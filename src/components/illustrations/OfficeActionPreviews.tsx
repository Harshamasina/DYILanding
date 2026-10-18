import type { ReactNode } from 'react';
import { ArrowRight, Check, CheckCheck, FileText, Fingerprint, Link2, LockKeyhole, Quote, ShieldCheck } from 'lucide-react';


/* Static product illustrations for the marketing page. All matter details and
   excerpts are fictional. These are deliberately not interactive app controls.
   The main animation slot is reserved for the user's future asset. */
const dashboardFont = '[font-family:var(--font-dashboard)]';
const monoFont = '[font-family:var(--font-dashboard-mono)]';

/** Evidence trace uses the same editorial panel layout as Docketing's date trace. */
export function OfficeActionEvidenceTrace() {
    return (
        <figure className="relative min-w-0">
            <div className="overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-lg shadow-primary/[0.05] ring-1 ring-white/70">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border px-5 py-5 sm:px-7">
                    <h3 className="text-xl font-semibold text-text-primary sm:text-2xl">Obviousness · Claims 1-3</h3>
                    <span className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/[0.04] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-primary [font-family:var(--font-mono)]"><Fingerprint className="h-3.5 w-3.5" aria-hidden="true" />Attorney Review</span>
                </div>
                <div className="grid lg:grid-cols-[290px_minmax(0,1fr)]">
                    <div className="border-b border-card-border bg-primary/[0.025] p-5 sm:p-7 lg:border-r lg:border-b-0">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary [font-family:var(--font-mono)]">Illustrative Issue Map</p>
                        <dl className="mt-6 grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
                            {[['Legal basis', '35 U.S.C. § 103'], ['Affected claims', 'Claims 1-3'], ['Cited reference', 'Smith reference']].map(([label, value]) => <div key={label} className="border-b border-card-border pb-5 last:border-0 last:pb-0"><dt className="text-xs text-text-muted">{label}</dt><dd className="mt-2 text-sm font-semibold text-text-primary">{value}</dd></div>)}
                        </dl>
                    </div>
                    <div className="p-5 sm:p-7">
                        <div className="flex gap-4 border-b border-card-border pb-6">
                            <TraceIcon><FileText className="h-5 w-5" /></TraceIcon>
                            <div><p className="text-sm font-semibold text-text-primary">Claim 1 · Limitation [1b]</p><p className="mt-2 text-sm leading-relaxed text-text-secondary">A controller configured to adjust a sampling interval in response to a detected change in temperature.</p></div>
                        </div>
                        <div className="flex gap-4 py-6">
                            <TraceIcon><Quote className="h-5 w-5" /></TraceIcon>
                            <div><p className="text-sm font-semibold text-text-primary">Examiner’s Passage</p><blockquote className="mt-2 text-sm leading-relaxed text-text-secondary">“Smith discloses a controller that adjusts the sampling interval based on a change in the measured temperature.”</blockquote><p className="mt-2 text-xs text-text-muted">Office action · page 4</p></div>
                        </div>
                        <div className="flex items-start gap-4 rounded-xl border border-primary/15 bg-primary/[0.035] p-4">
                            <TraceIcon><ShieldCheck className="h-5 w-5" /></TraceIcon>
                            <div><p className="text-sm font-semibold text-primary">Quotation Matched to the Source</p><p className="mt-2 text-xs leading-relaxed text-text-secondary">The attorney reviews the reading and decides how to address the issue.</p></div>
                        </div>
                    </div>
                </div>
            </div>
            <figcaption className="mt-4 text-center text-xs leading-relaxed text-text-muted">Illustrative example · The issue, affected claim, and source passage stay connected.</figcaption>
        </figure>
    );
}

function TraceIcon({ children }: { children: ReactNode }) {
    return <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-linear-to-br from-indigo-50 via-white to-white text-primary shadow-sm">{children}</span>;
}

function PreviewLabel({ children }: { children: ReactNode }) {
    return <span className={`text-[10px] font-medium uppercase tracking-[0.13em] text-text-muted sm:text-[11px] ${monoFont}`}>{children}</span>;
}

function Status({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
            <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{children}
        </span>
    );
}

function PreviewCaption({ children }: { children: ReactNode }) {
    return <figcaption className="mt-4 text-center text-xs leading-relaxed text-text-muted">{children} · Illustrative example</figcaption>;
}

export function OfficeActionAnalysisPreview() {
    return (
        <figure className="min-w-0">
            <div className={`overflow-hidden rounded-xl border border-card-border bg-white shadow-xl shadow-navy/[0.05] ${dashboardFont}`}>
                <div className="flex items-center justify-between gap-3 border-b border-card-border px-5 py-4 sm:px-6">
                    <span className="text-sm font-semibold text-text-primary">Issue map</span>
                    <span className="rounded-full bg-primary/[0.07] px-2.5 py-1 text-[11px] font-medium text-primary">Attorney review</span>
                </div>
                <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div><PreviewLabel>Issue 01</PreviewLabel><p className="mt-2 text-xl font-semibold text-text-primary">Obviousness</p><p className="mt-1 text-xs text-text-secondary">35 U.S.C. § 103 · Claims 1-3</p></div>
                        <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary/[0.06] text-primary"><Link2 className="h-4 w-4" aria-hidden="true" /></span>
                    </div>
                    <div className="mt-6 rounded-lg border border-card-border">
                        <div className="border-b border-card-border bg-page-bg-alt px-4 py-2.5"><PreviewLabel>Claim 1 / Limitation [1b]</PreviewLabel></div>
                        <p className="px-4 py-4 text-sm leading-relaxed text-text-primary">A controller configured to adjust a sampling interval in response to a detected change in temperature.</p>
                    </div>
                    <div className="mx-5 flex items-center gap-2 border-l border-primary/25 py-3 pl-4 text-[11px] font-medium text-primary"><Link2 className="h-3.5 w-3.5" aria-hidden="true" />Linked examiner passage</div>
                    <div className="rounded-lg border border-primary/15 bg-primary/[0.035] p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2"><PreviewLabel>Office action · p. 4</PreviewLabel><Quote className="h-4 w-4 text-primary/50" aria-hidden="true" /></div>
                        <blockquote className="mt-3 text-sm leading-7 text-text-primary">“Smith discloses a controller that <mark className="rounded-sm bg-primary/10 px-0.5 text-inherit">adjusts the sampling interval</mark> based on a change in the measured temperature.”</blockquote>
                        <div className="mt-4"><Status>Quotation matched to source text</Status></div>
                    </div>
                </div>
            </div>
            <PreviewCaption>An issue, its affected claim, and the examiner’s words</PreviewCaption>
        </figure>
    );
}

export function OfficeActionResponsePreview() {
    return (
        <figure className="min-w-0">
            <div className={`overflow-hidden rounded-xl border border-card-border bg-white shadow-xl shadow-navy/[0.05] ${dashboardFont}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border px-5 py-4 sm:px-6">
                    <span className="text-sm font-semibold text-text-primary">Response workspace</span><span className="text-[11px] font-medium text-text-muted">Review draft</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-b border-card-border bg-page-bg-alt px-5 py-3 text-xs sm:px-6">
                    <Fingerprint className="h-3.5 w-3.5 text-primary" aria-hidden="true" /><span className="text-text-secondary">Based on signed analysis</span><ArrowRight className="h-3 w-3 text-text-muted" aria-hidden="true" /><span className="font-medium text-primary">Amend and traverse</span>
                </div>
                <div className="p-5 sm:p-7">
                    <PreviewLabel>Amendments to the claims</PreviewLabel>
                    <div className="mt-5 border-l-2 border-primary/25 pl-4">
                        <p className="text-sm font-semibold text-text-primary">1. (Currently amended)</p>
                        <p className="mt-3 text-sm leading-7 text-text-secondary">A sensor system comprising a controller configured to adjust a sampling interval <del className="decoration-text-muted">periodically</del> <ins className="bg-primary/[0.07] text-primary decoration-primary underline-offset-4">in response to a detected change in temperature</ins>.</p>
                    </div>
                    <div className="mt-6 rounded-lg border border-card-border bg-page-bg-alt p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-text-primary"><Link2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />Linked disclosure support</div>
                        <p className="mt-2 text-xs leading-relaxed text-text-secondary">Application as filed · paragraph [0032]</p>
                        <p className="mt-2 text-xs leading-relaxed text-text-muted">“The controller varies the sampling interval when the temperature changes.”</p>
                    </div>
                    <div className="mt-6 flex items-start gap-2.5 border-t border-card-border pt-4 text-xs leading-relaxed text-text-secondary"><Fingerprint className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />The attorney confirms support and accepts the amendment.</div>
                </div>
            </div>
            <PreviewCaption>Claim changes stay connected to the original disclosure</PreviewCaption>
        </figure>
    );
}

export function OfficeActionApprovalPreview() {
    return (
        <figure className="min-w-0">
            <div className={`relative overflow-hidden rounded-xl border border-card-border bg-page-bg-alt p-6 sm:p-9 ${dashboardFont}`}>
                <div className="mx-auto max-w-sm rounded-sm border border-card-border bg-white px-6 pt-7 pb-8 shadow-lg shadow-navy/[0.05] sm:px-8">
                    <div className="flex items-center justify-between gap-3"><FileText className="h-6 w-6 text-primary" aria-hidden="true" /><span className={`text-[10px] tracking-widest text-text-muted ${monoFont}`}>DOCX</span></div>
                    <p className="mt-6 text-lg font-semibold text-text-primary">Response to Office Action</p>
                    <p className="mt-1 text-xs text-text-muted">Adaptive sensor system</p>
                    <div className="mt-6 space-y-3 border-y border-card-border py-5">
                        {['Amendments to the claims', 'Remarks and arguments'].map((label) => <p key={label} className="flex items-center gap-2 text-xs text-text-secondary"><CheckCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />{label}</p>)}
                    </div>
                    <div className="mt-5"><Status>Approved by reviewing attorney</Status></div>
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] text-text-muted"><LockKeyhole className="h-3 w-3" aria-hidden="true" />Approved content locked</p>
                </div>
                <p className="mt-5 text-center text-xs text-text-secondary">Word filing copy · Filed separately by the attorney</p>
            </div>
            <PreviewCaption>A fixed copy of the approved response</PreviewCaption>
        </figure>
    );
}

