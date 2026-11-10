import { Quote, ShieldCheck } from 'lucide-react';

/* The automated novelty search for one invention brief, read at a glance:
   short feature names across the top, one dot per reading (found, partial,
   not found), and a coverage bar per reference. The matter is the page's
   aspirin and caffeine example, and the references reuse the demo numbers
   of the search mockup. */

type Reading = 'found' | 'partial' | 'none';

interface Feature {
    id: string;
    short: string;
    text: string;
}

interface Reference {
    pub: string;
    title: string;
    date: 'before' | 'later';
    supplied?: boolean;
    readings: readonly Reading[];
}

const FEATURES: readonly Feature[] = [
    { id: 'F1', short: 'Aspirin + caffeine', text: 'Aspirin and caffeine in one oral tablet' },
    { id: 'F2', short: 'Under 60 s', text: 'Disintegrates in under 60 seconds' },
    { id: 'F3', short: '50 to 65 mg caffeine', text: '50 to 65 mg caffeine per tablet' },
    { id: 'F4', short: 'Low moisture', text: 'Low-moisture granulation' },
    { id: 'F5', short: 'Tension headache', text: 'For tension-type headache' },
];

const REFERENCES: readonly Reference[] = [
    { pub: 'US-DEMO-2022-0042-A1', title: 'Stabilized fixed-dose analgesic combination tablet', date: 'before', readings: ['found', 'none', 'found', 'partial', 'none'] },
    { pub: 'WO-DEMO-0311-A1', title: 'Caffeine-containing analgesic composition for tension-type headache', date: 'before', readings: ['partial', 'none', 'found', 'none', 'found'] },
    { pub: 'JP-DEMO-0057-A', title: 'Rapid-dissolving acetaminophen and caffeine formulation', date: 'later', readings: ['none', 'found', 'partial', 'none', 'none'] },
    { pub: 'US-DEMO-0517-B2', title: 'Low-moisture granulation process for aspirin combination products', date: 'before', supplied: true, readings: ['partial', 'none', 'none', 'found', 'none'] },
];

const READING_LABEL: Record<Reading, string> = { found: 'Found', partial: 'Partially found', none: 'Not found' };

const DATE_LABEL = { before: 'Published before', later: 'Filed earlier, published later' } as const;

/* The finding the quote panel opens on: reference 1, feature F3. */
const QUOTED = { row: 0, feature: 2 };

function Dot({ value, highlight = false }: { value: Reading; highlight?: boolean }) {
    const shape =
        value === 'found'
            ? 'bg-primary'
            : value === 'partial'
              ? 'border-2 border-primary bg-[linear-gradient(90deg,var(--color-primary)_50%,transparent_50%)]'
              : 'border-2 border-slate-300 bg-white';
    return (
        <span className={`inline-block h-4 w-4 rounded-full ${shape} ${highlight ? 'ring-2 ring-primary/35 ring-offset-2' : ''}`}>
            <span className="sr-only">{READING_LABEL[value]}</span>
        </span>
    );
}

/* One segment per feature, found first, so the bar reads as "how much of
   the invention this reference covers". */
function Coverage({ readings }: { readings: readonly Reading[] }) {
    const found = readings.filter(r => r === 'found').length;
    const partial = readings.filter(r => r === 'partial').length;
    const ordered: Reading[] = [...Array<Reading>(found).fill('found'), ...Array<Reading>(partial).fill('partial'), ...Array<Reading>(readings.length - found - partial).fill('none')];
    return (
        <div className="min-w-0">
            <div aria-hidden="true" className="flex gap-0.5">
                {ordered.map((r, i) => (
                    <span key={i} className={`h-1.5 flex-1 rounded-full ${r === 'found' ? 'bg-primary' : r === 'partial' ? 'bg-primary/35' : 'bg-slate-200'}`} />
                ))}
            </div>
            <p className="mt-1.5 text-xs text-text-secondary [font-family:var(--font-body)]">
                <span className="font-semibold text-text-primary">{found} of {readings.length}</span> found
                {partial > 0 && <span className="block text-text-muted lg:mt-0.5">{partial} partial</span>}
            </p>
        </div>
    );
}

function DateTag({ date }: { date: Reference['date'] }) {
    const tone = date === 'before' ? 'text-navy-light' : 'text-compliance-ink';
    return <span className={`text-[13px] leading-snug italic [font-family:var(--font-body)] ${tone}`}>{DATE_LABEL[date]}</span>;
}

function SuppliedTag() {
    return <span className="ml-2 inline-flex rounded border border-card-border bg-page-bg-alt px-1.5 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide text-text-secondary [font-family:var(--font-mono)]">Added by you</span>;
}

function Legend({ className = '' }: { className?: string }) {
    return (
        <div aria-hidden="true" className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-secondary [font-family:var(--font-body)] ${className}`}>
            {(['found', 'partial', 'none'] as const).map(r => (
                <span key={r} className="inline-flex items-center gap-2">
                    <Dot value={r} />
                    {r === 'none' ? 'Not found in reviewed text' : READING_LABEL[r]}
                </span>
            ))}
        </div>
    );
}

export function NoveltySearchFigure({ className = '' }: { className?: string }) {
    return (
        <figure className={`min-w-0 overflow-hidden rounded-2xl border border-card-border bg-white shadow-xl shadow-primary/[0.05] ${className}`}>
            <figcaption className="sr-only">Illustrative novelty search: four ranked references read against five features of an invention brief for a fast-dissolving aspirin and caffeine tablet.</figcaption>

            {/* Header: the brief and its assessment date */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-card-border bg-linear-to-r from-primary/[0.06] via-white to-white px-5 py-5 sm:px-7">
                <div className="min-w-0">
                    <p className="text-sm leading-none tracking-[0.04em] text-navy-light [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">Novelty search · Invention brief</p>
                    <p className="mt-2 text-lg font-semibold text-text-primary [font-family:var(--font-display)] sm:text-xl">Fast-dissolving aspirin and caffeine tablet</p>
                </div>
                <div className="flex flex-col items-start gap-1 sm:items-end">
                    <span className="text-[11px] uppercase tracking-wide text-text-secondary [font-family:var(--font-mono)]">Priority date</span>
                    <span className="text-sm font-semibold text-text-primary [font-family:var(--font-mono)]">2025-03-14</span>
                </div>
            </div>

            {/* Desktop: the coverage matrix */}
            <div className="hidden lg:block">
                <table className="w-full table-fixed border-collapse text-left">
                    <caption className="sr-only">Each reference read against the five features of the brief</caption>
                    <thead>
                        <tr className="border-b border-card-border bg-page-bg-alt">
                            <th scope="col" className="w-[31%] px-7 py-4 align-bottom text-[11px] font-semibold uppercase tracking-wide text-text-secondary [font-family:var(--font-mono)]">Ranked reference</th>
                            <th scope="col" className="w-[14%] px-3 py-4 align-bottom text-[11px] font-semibold uppercase tracking-wide text-text-secondary [font-family:var(--font-mono)]">Against priority</th>
                            {FEATURES.map(f => (
                                <th key={f.id} scope="col" title={f.text} className="px-2 py-4 text-center align-bottom">
                                    <span className="block text-[11px] font-semibold text-primary [font-family:var(--font-mono)]">{f.id}</span>
                                    <span className="mt-1 flex min-h-[2.1rem] items-end justify-center text-xs font-normal leading-snug text-text-primary [font-family:var(--font-body)]">{f.short}</span>
                                </th>
                            ))}
                            <th scope="col" className="w-[15%] px-7 py-4 align-bottom text-[11px] font-semibold uppercase tracking-wide text-text-secondary [font-family:var(--font-mono)]">Coverage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {REFERENCES.map((ref, r) => (
                            <tr key={ref.pub} className={`border-b border-card-border/70 last:border-0 ${r === QUOTED.row ? 'bg-primary/[0.025]' : ''}`}>
                                <th scope="row" className="px-7 py-4 align-middle font-normal">
                                    <span className="flex items-baseline gap-3">
                                        <span className="w-4 shrink-0 text-sm font-semibold tabular-nums text-text-muted [font-family:var(--font-display)]">{r + 1}</span>
                                        <span className="min-w-0">
                                            <span className="block text-xs font-semibold text-primary [font-family:var(--font-mono)]">
                                                {ref.pub}
                                                {ref.supplied && <SuppliedTag />}
                                            </span>
                                            <span className="mt-1 block text-[13px] leading-snug text-text-primary [font-family:var(--font-body)]">{ref.title}</span>
                                        </span>
                                    </span>
                                </th>
                                <td className="px-3 py-4 align-middle"><DateTag date={ref.date} /></td>
                                {ref.readings.map((value, i) => (
                                    <td key={FEATURES[i].id} className="px-2 py-4 text-center align-middle">
                                        <Dot value={value} highlight={r === QUOTED.row && i === QUOTED.feature} />
                                    </td>
                                ))}
                                <td className="px-7 py-4 align-middle"><Coverage readings={ref.readings} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phones and tablets: one card per reference, the same dots and bar */}
            <ol className="divide-y divide-card-border lg:hidden">
                {REFERENCES.map((ref, r) => (
                    <li key={ref.pub} className={`px-5 py-5 sm:px-7 ${r === QUOTED.row ? 'bg-primary/[0.025]' : ''}`}>
                        <p className="text-xs font-semibold text-primary [font-family:var(--font-mono)]">
                            <span className="mr-2 text-text-muted">{r + 1}</span>
                            {ref.pub}
                            {ref.supplied && <SuppliedTag />}
                        </p>
                        <p className="mt-1 text-sm leading-snug text-text-primary [font-family:var(--font-body)]">{ref.title}</p>
                        <p className="mt-1"><DateTag date={ref.date} /></p>
                        <dl className="mt-4 grid grid-cols-5 gap-1">
                            {ref.readings.map((value, i) => (
                                <div key={FEATURES[i].id} className="flex flex-col items-center gap-1.5 text-center">
                                    <dt className="order-2 text-[10px] leading-tight text-text-secondary [font-family:var(--font-body)]">{FEATURES[i].short}</dt>
                                    <dd className="order-1"><Dot value={value} highlight={r === QUOTED.row && i === QUOTED.feature} /></dd>
                                </div>
                            ))}
                        </dl>
                        <div className="mt-4 max-w-56">
                            <Coverage readings={ref.readings} />
                        </div>
                    </li>
                ))}
            </ol>

            {/* Key, then the passage behind the ringed finding */}
            <div className="border-t border-card-border px-5 py-4 sm:px-7">
                <Legend />
            </div>
            <div className="border-t border-card-border bg-primary/[0.025] px-5 py-5 sm:px-7">
                <div className="flex items-start gap-3">
                    <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary [font-family:var(--font-mono)]">
                            {FEATURES[QUOTED.feature].id} {FEATURES[QUOTED.feature].short} · {REFERENCES[QUOTED.row].pub} · Claim 1
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-text-primary italic [font-family:var(--font-body)]">
                            &ldquo;&hellip; wherein each tablet contains from 50 mg to 65 mg of caffeine.&rdquo;
                        </p>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary [font-family:var(--font-body)]">
                            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            Quote checked against the source text
                        </p>
                    </div>
                </div>
            </div>
        </figure>
    );
}
