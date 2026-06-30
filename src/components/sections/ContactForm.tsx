'use client';

import { useState, useRef } from 'react';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
    ROLE_OPTIONS,
    INQUIRY_TYPE_OPTIONS,
    PORTFOLIO_SIZE_OPTIONS,
} from '@/lib/constants';
import { submitContactMessage, type ApiError } from '@/lib/api';
import { validateContactForm, hasErrors } from '@/lib/validation';
import {
    TurnstileWidget,
    isTurnstileEnabled,
    type TurnstileHandle,
} from '@/components/ui/TurnstileWidget';

interface FormData {
    name: string;
    email: string;
    company: string;
    role: string;
    portfolioSize: string;
    inquiryType: string;
    message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL_FORM: FormData = {
    name: '',
    email: '',
    company: '',
    role: '',
    portfolioSize: '',
    inquiryType: '',
    message: '',
};

export function ContactForm() {
    const [form, setForm] = useState<FormData>(INITIAL_FORM);
    const hpRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileHandle>(null);

    // Frontend field name → backend field name
    const fieldMap: Record<string, string> = {
        name: 'full_name',
        email: 'work_email',
        company: 'company',
        role: 'role',
        portfolioSize: 'portfolio_size',
        inquiryType: 'inquiry_type',
        message: 'message',
    };

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        // Clear field error on change (using backend field name)
        const backendName = fieldMap[e.target.name] ?? e.target.name;
        if (fieldErrors[backendName]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[backendName];
                return next;
            });
        }
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

        // Contact messages have no structured `portfolio_size` column upstream,
        // so we fold the human-readable label into the message body to surface
        // the value to the recipient. (The option `value` is a terse enum code
        // shared with the demo form, so resolve its display label here.)
        const portfolioLabel =
            PORTFOLIO_SIZE_OPTIONS.find((o) => o.value === form.portfolioSize)?.label ??
            form.portfolioSize;
        const messageWithContext = `Portfolio size: ${portfolioLabel}\n\n${form.message}`;

        try {
            await submitContactMessage(
                {
                    full_name: form.name,
                    work_email: form.email,
                    company: form.company,
                    role: form.role,
                    inquiry_type: form.inquiryType,
                    message: messageWithContext,
                    turnstileToken: turnstileToken ?? undefined,
                    _hp_field: hpRef.current?.value || undefined,
                },
                idempotencyKey,
            );
            setStatus('success');
            setForm(INITIAL_FORM);
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

    function getFieldError(backendField: string): string | undefined {
        const errors = fieldErrors[backendField];
        return errors?.[0];
    }

    if (status === 'success') {
        return (
            <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <h3
                    className="text-xl font-bold text-text-primary mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    Message Sent
                </h3>
                <p
                    className="text-sm text-text-secondary max-w-sm mx-auto"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    Thanks for reaching out. We&apos;ll get back to you within
                    1 business day.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setStatus('idle');
                        setIdempotencyKey(crypto.randomUUID());
                    }}
                    className="mt-6 text-sm font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 lg:flex lg:h-full lg:flex-col"
            noValidate
        >
            {/* Honeypot - hidden from real users, uncontrolled to avoid autofill issues */}
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

            {/* Name + Email row */}
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                    label="Full Name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Smith"
                    error={getFieldError('full_name')}
                />
                <FormField
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

            {/* Company + Role row */}
            <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                    label="Company"
                    name="company"
                    type="text"
                    value={form.company}
                    onChange={handleChange}
                    required
                    placeholder="Acme Law LLP"
                    error={getFieldError('company')}
                />
                <FormSelect
                    label="Role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    options={ROLE_OPTIONS}
                    error={getFieldError('role')}
                />
            </div>

            {/* Portfolio Size + Inquiry Type row */}
            <div className="grid gap-6 sm:grid-cols-2">
                <FormSelect
                    label="Portfolio Size"
                    name="portfolioSize"
                    value={form.portfolioSize}
                    onChange={handleChange}
                    required
                    options={PORTFOLIO_SIZE_OPTIONS}
                    error={getFieldError('portfolio_size')}
                />
                <FormSelect
                    label="Inquiry Type"
                    name="inquiryType"
                    value={form.inquiryType}
                    onChange={handleChange}
                    required
                    options={INQUIRY_TYPE_OPTIONS}
                    error={getFieldError('inquiry_type')}
                />
            </div>

            {/* Message — grows to fill the card so there is no empty space
                below the submit button on lg (the card is stretched to the
                taller left column). */}
            <div className="lg:flex lg:flex-1 lg:flex-col lg:min-h-0">
                <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-text-primary mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!getFieldError('message')}
                    aria-describedby={getFieldError('message') ? 'message-error' : undefined}
                    rows={4}
                    placeholder="Tell us about your patent workflow, portfolio size, or compliance needs..."
                    className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors resize-y lg:flex-1 lg:min-h-40 ${
                        getFieldError('message')
                            ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
                            : 'border-card-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                    style={{ fontFamily: 'var(--font-body)' }}
                />
                {getFieldError('message') && (
                    <p
                        id="message-error"
                        role="alert"
                        className="mt-1.5 text-xs text-danger"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        {getFieldError('message')}
                    </p>
                )}
            </div>

            {/* Error Message */}
            {status === 'error' && (
                <div className="flex items-center gap-2 text-danger text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span style={{ fontFamily: 'var(--font-body)' }}>
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
                className="flex justify-center sm:justify-start"
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
    );
}

/* ── Reusable form primitives ── */

function FormField({
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
                htmlFor={name}
                className="block text-sm font-semibold text-text-primary mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                placeholder={placeholder}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                    error
                        ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
                        : 'border-card-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                style={{ fontFamily: 'var(--font-body)' }}
            />
            {error && (
                <p
                    id={`${name}-error`}
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

function FormSelect({
    label,
    name,
    value,
    onChange,
    required,
    options,
    error,
}: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    options: ReadonlyArray<{ value: string; label: string }>;
    error?: string;
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-semibold text-text-primary mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {label}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-text-primary focus:outline-none transition-colors appearance-none cursor-pointer ${
                    error
                        ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/20'
                        : 'border-card-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p
                    id={`${name}-error`}
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
