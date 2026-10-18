'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import {
    ROLE_OPTIONS,
    PORTFOLIO_SIZE_OPTIONS,
    INQUIRY_TYPE_OPTIONS,
} from '@/lib/constants';
import { submitDemoRequest, type ApiError } from '@/lib/api';
import { validateContactForm, hasErrors } from '@/lib/validation';
import {
    TurnstileWidget,
    isTurnstileEnabled,
    type TurnstileHandle,
} from '@/components/ui/TurnstileWidget';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BookDemoButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    children?: React.ReactNode;
}

interface DemoFormData {
    name: string;
    email: string;
    company: string;
    role: string;
    portfolioSize: string;
    inquiryType: string;
    phone: string;
    message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL_FORM: DemoFormData = {
    name: '',
    email: '',
    company: '',
    role: '',
    portfolioSize: '',
    inquiryType: '',
    phone: '',
    message: '',
};

export function BookDemoButton({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
}: BookDemoButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Hydration guard: document.body is not available during SSR
    useEffect(() => setMounted(true), []);

    return (
        <>
            <Button
                variant={variant}
                size={size}
                className={className}
                onClick={() => setIsOpen(true)}
            >
                {children || 'Book a Demo'}
            </Button>
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <DemoModal onClose={() => setIsOpen(false)} />
                    )}
                </AnimatePresence>,
                document.body,
            )}
        </>
    );
}

function DemoModal({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<DemoFormData>(INITIAL_FORM);
    const hpRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [idempotencyKey] = useState(() => crypto.randomUUID());
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileHandle>(null);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Close on Escape
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Frontend field name → backend field name
    const fieldMap: Record<string, string> = {
        name: 'full_name',
        email: 'work_email',
        company: 'company',
        role: 'role',
        portfolioSize: 'portfolio_size',
        inquiryType: 'inquiry_type',
        phone: 'phone',
        message: 'message',
    };

    /* Shared by the native inputs and the custom SelectField, which reports
       a plain value rather than a change event. */
    function setField(name: string, value: string) {
        setForm((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change (using backend field name)
        const backendName = fieldMap[name] ?? name;
        if (fieldErrors[backendName]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[backendName];
                return next;
            });
        }
    }

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        setField(e.target.name, e.target.value);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const clientErrors = validateContactForm(form);
        if (hasErrors(clientErrors)) {
            setFieldErrors(clientErrors);
            setStatus('error');
            setErrorMessage('Please fix the errors above.');
            return;
        }

        if (isTurnstileEnabled && !turnstileToken) {
            setStatus('error');
            setErrorMessage('Please complete the verification challenge below.');
            return;
        }

        setStatus('submitting');
        setErrorMessage('');
        setFieldErrors({});

        try {
            await submitDemoRequest(
                {
                    full_name: form.name,
                    work_email: form.email,
                    company: form.company,
                    role: form.role,
                    portfolio_size: form.portfolioSize || undefined,
                    inquiry_type: form.inquiryType || undefined,
                    phone: form.phone.trim() || undefined,
                    message: form.message.trim() || undefined,
                    turnstileToken: turnstileToken ?? undefined,
                    _hp_field: hpRef.current?.value || undefined,
                },
                idempotencyKey,
            );
            setStatus('success');
        } catch (err: unknown) {
            setStatus('error');
            // Turnstile tokens are single-use; reset for a fresh one on retry.
            turnstileRef.current?.reset();
            setTurnstileToken(null);
            const apiErr = err as ApiError & { status?: number };

            if (apiErr.code === 'validation_error' && 'details' in apiErr) {
                setFieldErrors(apiErr.details.fieldErrors);
                setErrorMessage('Please fix the errors above.');
            } else if (apiErr.code === 'rate_limit_exceeded') {
                setErrorMessage('Too many attempts. Please try again in a minute.');
            } else {
                setErrorMessage(
                    apiErr.message || 'Something went wrong. Please try again.',
                );
            }
        }
    }

    // Map backend field names to form field names for error display
    function getFieldError(backendField: string): string | undefined {
        const errors = fieldErrors[backendField];
        return errors?.[0];
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
            />

            {/* Modal: fixed header and footer, only the fields scroll. The
                SelectField panels are portalled, so the scrolling body never
                clips an open dropdown. */}
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="demo-modal-title"
                className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-card-border bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 cursor-pointer rounded-lg p-1.5 text-text-muted transition-colors hover:bg-page-bg-alt hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary"
                    aria-label="Close dialog"
                >
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>

                {status === 'success' ? (
                    <div className="px-6 py-12 text-center sm:px-8">
                        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                            <CheckCircle className="h-7 w-7 text-success" aria-hidden="true" />
                        </span>
                        <h2
                            id="demo-modal-title"
                            className="mb-2 text-2xl font-bold text-text-primary [font-family:var(--font-display)]"
                        >
                            Demo Request Received
                        </h2>
                        <p className="mx-auto max-w-sm text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                            We&apos;ll reach out within 1 business day to
                            schedule your personalized demo.
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-6 cursor-pointer text-sm font-semibold text-primary transition-colors hover:text-primary-dark [font-family:var(--font-body)]"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <header className="relative shrink-0 overflow-hidden border-b border-card-border px-6 pt-6 pb-5 pr-14 sm:px-8 sm:pt-7">
                            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-primary/[0.06] to-transparent" />
                            <p className="relative text-xs font-bold uppercase tracking-[0.15em] text-primary [font-family:var(--font-mono)]">
                                Personalized walkthrough
                            </p>
                            <h2
                                id="demo-modal-title"
                                className="relative mt-2 text-2xl font-bold text-text-primary [font-family:var(--font-display)]"
                            >
                                Book a Demo
                            </h2>
                            <p className="relative mt-1.5 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                See how Design Your Invention can streamline your IP
                                workflow. We&apos;ll reach out to schedule a time.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col" noValidate>
                            {/* Honeypot: hidden from real users, uncontrolled to avoid autofill */}
                            <input
                                ref={hpRef}
                                type="text"
                                name="website_url"
                                defaultValue=""
                                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                                tabIndex={-1}
                                autoComplete="new-password"
                                aria-hidden="true"
                            />

                            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
                                <FieldGroup legend="Your details">
                                    <ModalField
                                        label="Full Name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Jane Smith"
                                        error={getFieldError('full_name')}
                                    />
                                    <ModalField
                                        label="Work Email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="jane@acmelaw.com"
                                        error={getFieldError('work_email')}
                                    />
                                    <ModalField
                                        label="Company"
                                        name="company"
                                        type="text"
                                        autoComplete="organization"
                                        value={form.company}
                                        onChange={handleChange}
                                        required
                                        placeholder="Acme Law LLP"
                                        error={getFieldError('company')}
                                    />
                                    <ModalField
                                        label="Phone"
                                        hint="Optional"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+1 555 123 4567"
                                        error={getFieldError('phone')}
                                    />
                                </FieldGroup>

                                <FieldGroup legend="Your team and request">
                                    <SelectField
                                        label="Role"
                                        name="role"
                                        value={form.role}
                                        onChange={(v) => setField('role', v)}
                                        required
                                        size="sm"
                                        options={ROLE_OPTIONS}
                                        error={getFieldError('role')}
                                    />
                                    <SelectField
                                        label="Portfolio Size"
                                        name="portfolioSize"
                                        value={form.portfolioSize}
                                        onChange={(v) => setField('portfolioSize', v)}
                                        required
                                        size="sm"
                                        options={PORTFOLIO_SIZE_OPTIONS}
                                        error={getFieldError('portfolio_size')}
                                    />
                                    <div className="sm:col-span-2">
                                        <SelectField
                                            label="Inquiry Type"
                                            name="inquiryType"
                                            value={form.inquiryType}
                                            onChange={(v) => setField('inquiryType', v)}
                                            required
                                            size="sm"
                                            options={INQUIRY_TYPE_OPTIONS}
                                            error={getFieldError('inquiry_type')}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="demo-message"
                                            className="mb-1.5 block text-sm font-semibold text-text-primary [font-family:var(--font-display)]"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="demo-message"
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            aria-required="true"
                                            aria-invalid={!!getFieldError('message')}
                                            aria-describedby={getFieldError('message') ? 'demo-message-error' : undefined}
                                            rows={3}
                                            maxLength={1000}
                                            placeholder="Tell us about your patent workflow, portfolio size, or compliance needs..."
                                            className={`w-full resize-y rounded-lg border bg-white/70 px-4 py-2.5 text-sm text-text-primary backdrop-blur-md transition-[color,background-color,border-color,box-shadow] duration-200 placeholder:text-text-muted [font-family:var(--font-body)] focus:outline-none ${
                                                getFieldError('message')
                                                    ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
                                                    : 'border-card-border hover:border-primary/35 hover:bg-white/90 hover:shadow-md hover:shadow-primary/[0.06] focus:border-primary focus:bg-white/90 focus:ring-2 focus:ring-primary/20'
                                            }`}
                                        />
                                        {getFieldError('message') && (
                                            <p id="demo-message-error" role="alert" className="mt-1.5 text-xs text-danger [font-family:var(--font-body)]">
                                                {getFieldError('message')}
                                            </p>
                                        )}
                                    </div>
                                </FieldGroup>

                                {/* Bot verification (Cloudflare Turnstile) */}
                                <TurnstileWidget
                                    ref={turnstileRef}
                                    onVerify={setTurnstileToken}
                                    onExpire={() => setTurnstileToken(null)}
                                    onError={() => setTurnstileToken(null)}
                                    className="w-full"
                                />
                            </div>

                            <footer className="shrink-0 border-t border-card-border bg-page-bg-alt/70 px-6 py-4 sm:px-8">
                                {status === 'error' && (
                                    <p role="alert" className="mb-3 flex items-center gap-2 text-sm text-danger [font-family:var(--font-body)]">
                                        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                                        {errorMessage}
                                    </p>
                                )}
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                        We reply within 1 business day.
                                    </p>
                                    <Button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="w-full justify-center sm:w-auto"
                                        size="md"
                                    >
                                        {status === 'submitting' ? (
                                            'Sending...'
                                        ) : (
                                            <>
                                                Request a Demo
                                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </footer>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
}

/* A titled group of fields: a small mono legend over a two-column grid. */
function FieldGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
    return (
        <fieldset>
            <legend className="mb-3 flex w-full items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-text-secondary [font-family:var(--font-mono)]">
                {legend}
                <span aria-hidden="true" className="h-px flex-1 bg-card-border" />
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">{children}</div>
        </fieldset>
    );
}

function ModalField({
    label,
    hint,
    name,
    type,
    autoComplete,
    value,
    onChange,
    required,
    placeholder,
    error,
}: {
    label: string;
    hint?: string;
    name: string;
    type: string;
    autoComplete?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
    error?: string;
}) {
    return (
        <div>
            <label
                htmlFor={`demo-${name}`}
                className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-text-primary [font-family:var(--font-display)]"
            >
                {label}
                {hint && <span className="text-xs font-normal text-text-secondary [font-family:var(--font-body)]">{hint}</span>}
            </label>
            <input
                id={`demo-${name}`}
                name={name}
                type={type}
                autoComplete={autoComplete}
                value={value}
                onChange={onChange}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `demo-${name}-error` : undefined}
                placeholder={placeholder}
                className={`w-full rounded-lg border bg-white/70 px-4 py-2.5 text-sm text-text-primary backdrop-blur-md transition-[color,background-color,border-color,box-shadow] duration-200 placeholder:text-text-muted [font-family:var(--font-body)] focus:outline-none ${
                    error
                        ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
                        : 'border-card-border hover:border-primary/35 hover:bg-white/90 hover:shadow-md hover:shadow-primary/[0.06] focus:border-primary focus:bg-white/90 focus:ring-2 focus:ring-primary/20'
                }`}
            />
            {error && (
                <p id={`demo-${name}-error`} role="alert" className="mt-1.5 text-xs text-danger [font-family:var(--font-body)]">
                    {error}
                </p>
            )}
        </div>
    );
}
