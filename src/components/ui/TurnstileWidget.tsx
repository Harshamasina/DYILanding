'use client';

import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

/**
 * Cloudflare Turnstile site key (PUBLIC — safe in the client bundle). Inlined
 * at build time from NEXT_PUBLIC_TURNSTILE_SITE_KEY. When unset (e.g. local dev
 * with no key), the widget renders nothing and `isTurnstileEnabled` is false,
 * so forms submit without a token — matching a dev backend whose
 * TURNSTILE_SECRET_KEY is also unset (its verifier no-ops). In production the
 * DYISearch backend requires the token, so this key MUST be set for the build.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export const isTurnstileEnabled = Boolean(SITE_KEY);

const SCRIPT_SRC =
    'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileApi {
    render: (el: HTMLElement, opts: Record<string, unknown>) => string;
    reset: (id?: string) => void;
    remove: (id?: string) => void;
}
declare global {
    interface Window {
        turnstile?: TurnstileApi;
    }
}

// Single shared loader so multiple widgets (demo modal + contact form) don't
// each inject the script.
let scriptPromise: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.turnstile) return Promise.resolve();
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = SCRIPT_SRC;
        s.async = true;
        s.defer = true;
        s.onload = () => resolve();
        s.onerror = () => {
            scriptPromise = null; // allow a later retry
            reject(new Error('Failed to load Cloudflare Turnstile.'));
        };
        document.head.appendChild(s);
    });
    return scriptPromise;
}

export interface TurnstileHandle {
    /** Reset the widget to obtain a fresh, single-use token. Call after a
        failed submit — the previous token has already been consumed. */
    reset: () => void;
}

interface TurnstileWidgetProps {
    onVerify: (token: string) => void;
    onExpire?: () => void;
    onError?: () => void;
    className?: string;
}

/**
 * Cloudflare Turnstile widget. Explicit-render so it works inside a modal that
 * mounts after page load. Renders once and survives parent re-renders (form
 * state changes) by reading callbacks from a ref.
 */
export const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
    function TurnstileWidget({ onVerify, onExpire, onError, className }, ref) {
        const containerRef = useRef<HTMLDivElement>(null);
        const widgetIdRef = useRef<string | null>(null);
        const cbRef = useRef({ onVerify, onExpire, onError });
        cbRef.current = { onVerify, onExpire, onError };

        const reset = useCallback(() => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.reset(widgetIdRef.current);
            }
        }, []);
        useImperativeHandle(ref, () => ({ reset }), [reset]);

        useEffect(() => {
            if (!SITE_KEY) return;
            let cancelled = false;
            loadTurnstileScript()
                .then(() => {
                    if (
                        cancelled ||
                        !containerRef.current ||
                        !window.turnstile ||
                        widgetIdRef.current
                    ) {
                        return;
                    }
                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey: SITE_KEY,
                        callback: (token: string) => cbRef.current.onVerify(token),
                        'expired-callback': () => cbRef.current.onExpire?.(),
                        'error-callback': () => cbRef.current.onError?.(),
                    });
                })
                .catch(() => cbRef.current.onError?.());
            return () => {
                cancelled = true;
                if (widgetIdRef.current && window.turnstile) {
                    window.turnstile.remove(widgetIdRef.current);
                    widgetIdRef.current = null;
                }
            };
        }, []);

        if (!SITE_KEY) return null;
        return <div ref={containerRef} className={className} />;
    },
);
