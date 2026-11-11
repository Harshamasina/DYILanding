import { Check, ChevronRight, FileDown, PenLine, Sparkles } from 'lucide-react';

/* The attorney-in-the-loop beat as a document, not a diagram: the exported
   DOCX page sits behind, and in front the draft claim as the attorney sees
   it, the AI's wording struck through and the attorney's wording inserted,
   with the reason for the change in the margin, the signed approval and the
   disclaimer every draft carries. On hover the export page slides out from
   under the draft. Illustrative content only. */

const STATUS = ['Draft', 'In review', 'Approved'] as const;

export function AttorneyAuthorshipVisual({ className = '' }: { className?: string }) {
    return (
        <figure
            aria-label="A draft claim with the attorney's edit over the AI wording, a reason for the change, a signed approval, and the exported DOCX"
            className={`group relative mx-auto w-full max-w-[34rem] ${className}`}
        >
            <div aria-hidden="true" className="lifecycle-dot-grid pointer-events-none absolute -inset-10" />

            {/* The exported page, behind */}
            <div
                aria-hidden="true"
                className="absolute inset-x-8 -top-14 bottom-10 rotate-[3deg] rounded-2xl border border-card-border bg-white/90 shadow-sm transition-transform duration-500 ease-out group-hover:translate-x-6 group-hover:-translate-y-3 group-hover:rotate-[6deg] motion-reduce:transition-none"
            >
                <div className="flex items-center justify-end gap-2 px-5 pt-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold tracking-[0.08em] text-white [font-family:var(--font-mono)]">
                        <FileDown className="h-3 w-3" strokeWidth={2} />
                        DOCX
                    </span>
                </div>
            </div>

            {/* The draft, in front */}
            <div className="relative rounded-2xl border border-card-border bg-white shadow-[0_24px_48px_-24px_rgba(15,27,45,0.28)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border px-5 py-3.5">
                    <span className="text-[11px] tracking-[0.06em] text-text-muted [font-family:var(--font-mono)]">
                        DRAFT V3 · CLAIM 1
                    </span>
                    <ol aria-label="Draft status" className="flex items-center gap-1">
                        {STATUS.map((step, i) => {
                            const current = i === STATUS.length - 1;
                            return (
                                <li key={step} className="flex items-center gap-1">
                                    {i > 0 && <ChevronRight aria-hidden="true" className="h-3 w-3 text-slate-300" />}
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.06em] uppercase [font-family:var(--font-mono)] ${current ? 'bg-success/10 text-success' : 'text-text-muted'}`}
                                    >
                                        {step}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                <div className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_9.5rem]">
                    <p className="text-[15px] leading-[1.75] text-text-primary [font-family:var(--font-body)]">
                        <span className="font-semibold">1.</span> A stabilized fixed-dose tablet comprising a first
                        analgesic in an amount of{' '}
                        <del className="whitespace-nowrap rounded-sm bg-primary/[0.06] px-0.5 text-text-muted decoration-primary/60">
                            about 300 mg
                        </del>{' '}
                        <ins className="whitespace-nowrap rounded-sm bg-compliance/10 px-0.5 font-semibold text-compliance-ink underline decoration-compliance decoration-2 underline-offset-4">
                            250 mg to 325 mg
                        </ins>
                        , and a stabilizer selected from the group consisting of...
                    </p>

                    <aside className="relative self-start rounded-lg border-l-2 border-compliance bg-compliance/[0.06] px-3 py-2.5">
                        <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] text-compliance-ink uppercase [font-family:var(--font-mono)]">
                            <PenLine aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
                            Reason for change
                        </p>
                        <p className="mt-1 text-xs leading-snug text-text-primary [font-family:var(--font-body)]">
                            Narrowed the range over the cited art.
                        </p>
                    </aside>
                </div>

                <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.05] px-2.5 py-1 text-[11px] text-primary [font-family:var(--font-body)]">
                        <Sparkles aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
                        AI suggested
                    </span>
                    <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-slate-300" />
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-compliance/30 bg-compliance/[0.06] px-2.5 py-1 text-[11px] text-compliance-ink [font-family:var(--font-body)]">
                        <PenLine aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
                        Attorney revised
                    </span>
                </div>

                <div className="flex items-end justify-between gap-4 border-t border-dashed border-card-border px-5 py-4">
                    <div className="min-w-0">
                        <svg aria-hidden="true" viewBox="0 0 140 36" className="h-8 w-32 text-navy-light">
                            <path
                                d="M4 26c8-14 14-20 18-16s-6 18-2 18 10-16 16-16-2 14 4 14 8-10 14-10 4 8 10 8 10-14 18-14-4 12 2 12 12-6 20-8 14 0 28-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="mt-1 border-t border-slate-300 pt-1 text-[11px] text-text-secondary [font-family:var(--font-body)]">
                            Approved by the attorney of record
                        </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-success/25 bg-success/[0.07] px-2 py-1 text-[10px] font-semibold tracking-[0.06em] text-success uppercase [font-family:var(--font-mono)]">
                        <Check aria-hidden="true" className="h-3 w-3" strokeWidth={2.5} />
                        Signed and locked
                    </span>
                </div>

                <p className="rounded-b-2xl bg-page-bg-alt px-5 py-2.5 text-[10px] tracking-[0.06em] text-text-muted uppercase [font-family:var(--font-mono)]">
                    AI-generated content. Not legal advice.
                </p>
            </div>

            {/* The audit stamp the export leaves */}
            <div className="absolute -bottom-12 right-3 flex items-center gap-2 rounded-xl border border-card-border bg-white px-3 py-2 shadow-lg sm:-bottom-7 sm:-right-8">
                <span aria-hidden="true" className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                    <FileDown className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                <span className="text-xs leading-tight text-text-primary [font-family:var(--font-body)]">
                    <span className="block font-semibold">DOCX exported</span>
                    <span className="text-text-muted">Logged as an audit event</span>
                </span>
            </div>
        </figure>
    );
}
