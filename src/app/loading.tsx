import { Container } from '@/components/ui/Container';

function LoadingGlyph() {
    return (
        <svg
            className="loading-glyph h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="loading-glyph-gradient" x1="4" y1="4" x2="20" y2="20">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="52%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#0f1b2d" />
                </linearGradient>
            </defs>
            <circle
                cx="12"
                cy="12"
                r="8.5"
                stroke="currentColor"
                strokeOpacity="0.16"
                strokeWidth="2"
            />
            <circle
                className="loading-glyph__orbit"
                cx="12"
                cy="12"
                r="8.5"
                stroke="url(#loading-glyph-gradient)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray="34 22"
            />
            <path
                className="loading-glyph__spark"
                d="M12 7.5l1.08 3.42L16.5 12l-3.42 1.08L12 16.5l-1.08-3.42L7.5 12l3.42-1.08L12 7.5z"
                fill="currentColor"
            />
        </svg>
    );
}

export default function Loading() {
    return (
        <main
            id="main-content"
            className="min-h-screen bg-page-bg pt-28 sm:pt-32 lg:pt-36"
            aria-live="polite"
            aria-busy="true"
        >
            <Container>
                <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center">
                    <div className="w-full max-w-3xl text-center">
                        <div
                            className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-primary"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            <LoadingGlyph />
                            Loading
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="mx-auto h-10 w-full max-w-2xl rounded bg-slate-200/80 motion-safe:animate-pulse sm:h-12" />
                            <div className="mx-auto h-10 w-5/6 max-w-xl rounded bg-slate-200/70 motion-safe:animate-pulse sm:h-12" />
                            <div className="mt-7 space-y-3">
                                <div className="mx-auto h-3 w-full max-w-2xl rounded-full bg-slate-100 motion-safe:animate-pulse" />
                                <div className="mx-auto h-3 w-11/12 max-w-xl rounded-full bg-slate-100 motion-safe:animate-pulse" />
                                <div className="mx-auto h-3 w-3/4 max-w-lg rounded-full bg-slate-100 motion-safe:animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}
