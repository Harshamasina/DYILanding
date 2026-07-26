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

    // Hydration guard — document.body not available during SSR
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="demo-modal-title"
                className="relative w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-card-border bg-white p-8 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-page-bg-alt transition-colors cursor-pointer"
                    aria-label="Close dialog"
                >
                    <X className="w-5 h-5" />
                </button>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                        <h3
                            id="demo-modal-title"
                            className="text-xl font-bold text-text-primary mb-2"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Demo Request Received
                        </h3>
                        <p
                            className="text-sm text-text-secondary max-w-sm mx-auto"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            We&apos;ll reach out within 1 business day to
                            schedule your personalized demo.
                        </p>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-6 text-sm font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h3
                            id="demo-modal-title"
                            className="text-xl font-bold text-text-primary mb-1"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Book a Demo
                        </h3>
                        <p
                            className="text-sm text-text-secondary mb-6"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            See how Design Your Invention can streamline your IP
                            workflow. We&apos;ll reach out to schedule a time.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            {/* Honeypot — hidden from real users, uncontrolled to avoid autofill */}
                            <input
                                ref={hpRef}
                                type="text"
                                name="website_url"
                                defaultValue=""
                                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                                tabIndex={-1}
                                autoComplete="new-password"
                                aria-hidden="true"
                            />

                            {/* Name + Email */}
                            <div className="grid gap-5 sm:grid-cols-2">
                                <ModalField
                                    label="Full Name"
                                    name="name"
                                    type="text"
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
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="jane@acmelaw.com"
                                    error={getFieldError('work_email')}
                                />
                            </div>

                            {/* Company + Role */}
                            <div className="grid gap-5 sm:grid-cols-2">
                                <ModalField
                                    label="Company"
                                    name="company"
                                    type="text"
                                    value={form.company}
                                    onChange={handleChange}
                                    required
                                    placeholder="Acme Law LLP"
                                    error={getFieldError('company')}
                                />
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
                            </div>

                            {/* Portfolio Size + Inquiry Type */}
                            <div className="grid gap-5 sm:grid-cols-2">
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

                            {/* Phone (optional) */}
                            <ModalField
                                label="Phone (optional)"
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+1 555 123 4567"
                                error={getFieldError('phone')}
                            />

                            {/* Message */}
                            <div>
                                <label
                                    htmlFor="demo-message"
                                    className="block text-sm font-semibold text-text-primary mb-1.5"
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                    }}
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
                                    className={`w-full rounded-lg border bg-white/70 backdrop-blur-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-[color,background-color,border-color,box-shadow] duration-200 resize-y ${
                                        getFieldError('message')
                                            ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
                                            : 'border-card-border hover:border-primary/35 hover:bg-white/90 hover:shadow-md hover:shadow-primary/[0.06] focus:border-primary focus:bg-white/90 focus:ring-2 focus:ring-primary/20'
                                    }`}
                                    style={{
                                        fontFamily: 'var(--font-body)',
                                    }}
                                />
                                {getFieldError('message') && (
                                    <p
                                        id="demo-message-error"
                                        role="alert"
                                        className="mt-1.5 text-xs text-danger"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {getFieldError('message')}
                                    </p>
                                )}
                            </div>

                            {/* Error */}
                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-danger text-sm">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-body)',
                                        }}
                                    >
                                        {errorMessage}
                                    </span>
                                </div>
                            )}

                            {/* Bot verification (Cloudflare Turnstile) */}
                            <TurnstileWidget
                                ref={turnstileRef}
                                onVerify={setTurnstileToken}
                                onExpire={() => setTurnstileToken(null)}
                                onError={() => setTurnstileToken(null)}
                                className="w-full"
                            />

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full justify-center"
                                size="lg"
                            >
                                {status === 'submitting' ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        Request a Demo
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
}

function ModalField({
    label,
    name,
    type,
    value,
    onChange,
    required,
    placeholder,
    error,
}: {
    label: string;
    name: string;
    type: string;
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
                className="block text-sm font-semibold text-text-primary mb-1.5"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {label}
            </label>
            <input
                id={`demo-${name}`}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `demo-${name}-error` : undefined}
                placeholder={placeholder}
                className={`w-full rounded-lg border bg-white/70 backdrop-blur-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-[color,background-color,border-color,box-shadow] duration-200 ${
                    error
                        ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
                        : 'border-card-border hover:border-primary/35 hover:bg-white/90 hover:shadow-md hover:shadow-primary/[0.06] focus:border-primary focus:bg-white/90 focus:ring-2 focus:ring-primary/20'
                }`}
                style={{ fontFamily: 'var(--font-body)' }}
            />
            {error && (
                <p
                    id={`demo-${name}-error`}
                    role="alert"
                    className="mt-1.5 text-xs text-danger"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}
