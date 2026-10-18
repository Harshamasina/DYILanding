import { ArrowRight, FileText, Fingerprint, GitBranch, Link2, ListChecks, Quote } from 'lucide-react';

/* Marketing illustrations, not live matter data or recommended dispositions.
   Vocabulary and relationships follow the OA analysis and response handoffs. */
const DOCUMENTS = [
    { icon: FileText, label: 'Office Action', role: 'The examiner’s position', text: 'Grounds of rejection, affected claims, and pinpoint citations.', destination: 'Issues to address' },
    { icon: ListChecks, label: 'Examined Claim Set', role: 'The analysis baseline', text: 'The claim language and status the examiner acted on.', destination: 'Claim chart and amendment baseline' },
    { icon: Quote, label: 'Application as Filed', role: 'The disclosure for support', text: 'The original disclosure against which amendment support is confirmed.', destination: 'Support for inserted language' },
];

export function ProsecutionRecordVisual() {
    return (
        <figure>
            <div className="grid gap-6 lg:grid-cols-3">
                {DOCUMENTS.map(({ icon: Icon, label, role, text, destination }, i) => (
                    <article key={label} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05]">
                        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-18 bg-linear-to-b from-primary/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative flex items-center justify-between"><span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-100 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 text-primary transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-sm group-hover:shadow-primary/[0.06]"><Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" aria-hidden="true" /></span><span className="text-xs text-text-muted [font-family:var(--font-mono)]">0{i + 1}</span></div>
                        <p className="relative mt-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary [font-family:var(--font-mono)]">{role}</p>
                        <h3 className="relative mt-2 text-xl font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary">{label}</h3>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{text}</p>
                        <p className="mt-6 flex items-start gap-2 border-t border-card-border pt-4 text-xs leading-relaxed text-primary"><ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />{destination}</p>
                    </article>
                ))}
            </div>
            <div className="mx-auto hidden h-7 w-2/3 border-x border-primary/20 lg:block" aria-hidden="true" />
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary/15 bg-white px-6 py-5 sm:flex-row sm:items-center lg:mt-0">
                <GitBranch className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div><p className="text-sm font-semibold text-text-primary">Preserve the Prosecution Context</p><p className="mt-1 text-sm leading-relaxed text-text-secondary">The response retains its signed analysis, examined claims, as-filed disclosure, and file history as its source record.</p></div>
            </div>
            <figcaption className="mt-4 text-center text-xs leading-relaxed text-text-muted">Distinct document roles, carried into one response record.</figcaption>
        </figure>
    );
}

const CHART = [
    { limitation: '[1a]', text: 'A temperature sensor', smith: ['Full', '¶ [0024]'], jones: ['Full', '¶ [0018]'] },
    { limitation: '[1b]', text: 'A controller that adjusts the sampling interval', smith: ['Full', '¶ [0031]'], jones: ['Not addressed', 'No mapped passage'] },
    { limitation: '[1c]', text: 'A stored calibration profile', smith: ['Partial', '¶ [0036]'], jones: ['Full', '¶ [0042]'] },
];

function Reading({ value, pinpoint }: { value: string; pinpoint: string }) {
    const tone = value === 'Full' ? 'border-primary/20 bg-primary/[0.06] text-primary' : value === 'Partial' ? 'border-compliance/20 bg-compliance/[0.06] text-compliance' : 'border-card-border bg-page-bg-alt text-text-muted';
    return <div><span className={`inline-flex rounded-md border px-2.5 py-1 text-[11px] font-semibold [font-family:var(--font-mono)] ${tone}`}>{value}</span><span className="mt-2 block text-xs text-text-muted">{pinpoint}</span></div>;
}

export function LimitationChartVisual() {
    return (
        <figure className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-card-border bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border px-5 py-5 sm:px-7"><h3 className="text-xl font-semibold text-text-primary">Claim 1 · Cited-Reference Chart</h3><span className="text-[10px] uppercase tracking-[0.12em] text-primary [font-family:var(--font-mono)]">Illustrative § 103 Analysis</span></div>
                <div className="hidden sm:block">
                    <table className="w-full table-fixed border-collapse text-left">
                        <caption className="sr-only">Illustrative mapping of three claim limitations against Smith and Jones</caption>
                        <thead><tr className="border-b border-card-border bg-page-bg-alt"><th scope="col" className="w-1/2 px-7 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted [font-family:var(--font-mono)]">Claim Limitation</th>{['Smith', 'Jones'].map(ref => <th scope="col" key={ref} className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-muted [font-family:var(--font-mono)]">{ref}</th>)}</tr></thead>
                        <tbody>{CHART.map(row => <tr key={row.limitation} className="border-b border-card-border/70 last:border-0"><th scope="row" className="px-7 py-5 text-sm font-normal leading-relaxed text-text-primary"><span className="mr-2 text-xs font-semibold text-primary [font-family:var(--font-mono)]">{row.limitation}</span>{row.text}</th><td className="px-5 py-5"><Reading value={row.smith[0]} pinpoint={row.smith[1]} /></td><td className="px-5 py-5"><Reading value={row.jones[0]} pinpoint={row.jones[1]} /></td></tr>)}</tbody>
                    </table>
                </div>
                <div className="divide-y divide-card-border sm:hidden">{CHART.map(row => <div key={row.limitation} className="p-5"><p className="text-sm leading-relaxed text-text-primary"><span className="mr-2 font-semibold text-primary">{row.limitation}</span>{row.text}</p><dl className="mt-4 grid grid-cols-2 gap-4">{[['Smith', row.smith], ['Jones', row.jones]].map(([ref, reading]) => <div key={ref as string}><dt className="mb-2 text-xs font-semibold text-text-secondary">{ref}</dt><dd><Reading value={reading[0]} pinpoint={reading[1]} /></dd></div>)}</dl></div>)}</div>
                <div className="flex items-start gap-3 border-t border-card-border bg-primary/[0.025] p-5 sm:px-7"><Link2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><p className="text-xs leading-relaxed text-text-secondary">Full and partial readings describe the mapped disclosure. A passage not addressed in the chart is not a finding that the reference lacks it.</p></div>
            </div>
            <figcaption className="mt-4 text-center text-xs leading-relaxed text-text-muted">Fictional references and pinpoints · Chart readings remain subject to attorney review.</figcaption>
        </figure>
    );
}

export function ResponseStrategyVisual() {
    return (
        <figure>
            <div className="overflow-hidden rounded-2xl border border-card-border bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border bg-page-bg-alt px-5 py-5 sm:px-7"><h3 className="text-xl font-semibold text-text-primary">From Ground of Rejection to Response Section</h3><span className="inline-flex items-center gap-2 text-xs font-medium text-primary"><Fingerprint className="h-4 w-4" aria-hidden="true" />Selected by Counsel</span></div>
                {[
                    { issue: 'Anticipation', basis: '§ 102 · Claims 1-3', choice: 'Traverse', output: 'Remarks addressing the cited disclosure', note: 'Counsel records the disputed limitation and the basis for the response.' },
                    { issue: 'Indefiniteness', basis: '§ 112(b) · Claim 4', choice: 'Amend', output: 'Claim amendment and supporting remarks', note: 'The revised language stays linked to its as-filed disclosure support.' },
                ].map(item => <div key={item.issue} className="grid gap-5 border-b border-card-border p-5 last:border-0 sm:p-7 lg:grid-cols-[1fr_0.85fr_1.5fr] lg:items-center lg:gap-8"><div><p className="text-base font-semibold text-text-primary">{item.issue}</p><p className="mt-2 text-xs text-text-muted">{item.basis}</p></div><div className="flex items-center gap-3"><ArrowRight className="hidden h-4 w-4 shrink-0 text-primary/50 lg:block" aria-hidden="true" /><span className="rounded-lg border border-primary/20 bg-primary/[0.04] px-4 py-2 text-sm font-semibold text-primary">{item.choice}</span></div><div><p className="text-sm font-semibold text-text-primary">{item.output}</p><p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.note}</p></div></div>)}
            </div>
            <figcaption className="mt-4 text-center text-xs leading-relaxed text-text-muted">Illustrative attorney-selected strategies · Available choices depend on the issue type.</figcaption>
        </figure>
    );
}
