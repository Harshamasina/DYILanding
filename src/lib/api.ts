// Public marketing site: default to the deployed DYISearch API so a build that
// is missing NEXT_PUBLIC_API_URL never bakes a localhost URL into production.
// Local dev against a local backend: set NEXT_PUBLIC_API_URL in
// .env.development.local (dev-only — NOT .env.local, which also leaks into
// `next build`/production and overrides .env.production).
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.search.designyourinvention.com';

/* ── Shared types ── */

export interface ApiSuccessResponse {
    ok: true;
    requestId: string;
    message: string;
}

export interface ApiValidationError {
    code: 'validation_error';
    message: string;
    details: {
        fieldErrors: Record<string, string[]>;
        formErrors: string[];
    };
    requestId: string;
}

export interface ApiRateLimitError {
    code: 'rate_limit_exceeded';
    message: string;
    requestId: string;
}

export type ApiError = ApiValidationError | ApiRateLimitError | { code: string; message: string; requestId?: string };

/* ── Demo Request ── */

export interface DemoRequestPayload {
    full_name: string;
    work_email: string;
    company: string;
    role: string;
    portfolio_size?: string;
    inquiry_type?: string;
    phone?: string;
    message?: string;
    /** Cloudflare Turnstile token. Required by the DYISearch backend in prod. */
    turnstileToken?: string;
    _hp_field?: string;
}

export async function submitDemoRequest(
    data: DemoRequestPayload,
    idempotencyKey: string,
): Promise<ApiSuccessResponse> {
    const res = await fetch(`${API_BASE_URL}/public/demo-requests`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
        if (json) {
            throw { status: res.status, ...json } as ApiError & { status: number };
        }
        throw { status: res.status, code: 'unknown', message: `Request failed (${res.status})` };
    }

    return (json ?? { ok: true, requestId: '', message: 'Success' }) as ApiSuccessResponse;
}

/* ── Contact Message ── */

export interface ContactMessagePayload {
    full_name: string;
    work_email: string;
    company: string;
    role: string;
    inquiry_type: string;
    message: string;
    /** Cloudflare Turnstile token. Required by the DYISearch backend in prod. */
    turnstileToken?: string;
    _hp_field?: string;
}

export async function submitContactMessage(
    data: ContactMessagePayload,
    idempotencyKey: string,
): Promise<ApiSuccessResponse> {
    const res = await fetch(`${API_BASE_URL}/public/contact-messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
        if (json) {
            throw { status: res.status, ...json } as ApiError & { status: number };
        }
        throw { status: res.status, code: 'unknown', message: `Request failed (${res.status})` };
    }

    return (json ?? { ok: true, requestId: '', message: 'Success' }) as ApiSuccessResponse;
}
