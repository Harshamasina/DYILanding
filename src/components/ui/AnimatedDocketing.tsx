/* ── Docketing "Deadline Center" mockup ── PLACEHOLDER.
   A static, on-brand product mockup that stands in for the eventual animated
   walkthrough (deadline derivation -> risk scoring -> digest send). Built as a
   presentational component with no client hooks so it renders on the server.
   Swap the internals for an animated version later; the export name and the
   MockupHalo wrapper in the page stay the same so nothing else has to change.
*/

interface FilterRow {
    label: string;
    count: number;
}

const FILTERS: FilterRow[] = [
    { label: 'All deadlines', count: 44 },
    { label: 'Office Actions', count: 7 },
    { label: 'Annuity Fees', count: 12 },
    { label: 'PCT Deadlines', count: 6 },
    { label: 'PRV Deadlines', count: 4 },
    { label: 'Patent Fees', count: 9 },
    { label: 'Reminders', count: 6 },
];

interface DeadlineRow {
    title: string;
    family: string;
    assignee: string;
    due: string;
    amount?: string;
    risk: 'red' | 'amber' | 'green';
    score: number;
}

interface Bucket {
    label: string;
    accent: string;
    rows: DeadlineRow[];
}

const BUCKETS: Bucket[] = [
    {
        label: 'Overdue',
        accent: '#dc2626',
        rows: [
            {
                title: 'Office Action response',
                family: 'CRSP-2023-0142',
                assignee: 'A. Mehta',
                due: '3 days ago',
                risk: 'red',
                score: 96,
            },
            {
                title: 'Annuity fee (year 7)',
                family: 'ONCO-2019-0088',
                assignee: 'Unassigned',
                due: '1 day ago',
                amount: 'EUR 1,420',
                risk: 'red',
                score: 91,
            },
        ],
    },
    {
        label: 'Due today',
        accent: '#d97706',
        rows: [
            {
                title: 'PCT Chapter I (Rule 22)',
                family: 'NEURO-2024-0031',
                assignee: 'R. Iyer',
                due: 'Today, 5:00 PM',
                risk: 'amber',
                score: 68,
            },
        ],
    },
    {
        label: 'Due this week',
        accent: '#6366f1',
        rows: [
            {
                title: 'Request for Examination',
                family: 'CRSP-2023-0142',
                assignee: 'A. Mehta',
                due: 'in 3 days',
                risk: 'amber',
                score: 54,
            },
            {
                title: 'Maintenance fee (US)',
                family: 'IMMU-2021-0203',
                assignee: 'S. Park',
                due: 'in 5 days',
                amount: 'USD 1,600',
                risk: 'green',
                score: 28,
            },
            {
                title: 'Custom reminder: inventor sign-off',
                family: 'NEURO-2024-0031',
                assignee: 'R. Iyer',
                due: 'in 6 days',
                risk: 'green',
                score: 19,
            },
        ],
    },
];

const RISK_BARS = [
    { label: 'Red', count: 4, color: '#dc2626', width: '18%' },
    { label: 'Amber', count: 9, color: '#d97706', width: '38%' },
    { label: 'Green', count: 31, color: '#059669', width: '88%' },
];

const RISK_DOT: Record<DeadlineRow['risk'], string> = {
    red: '#dc2626',
    amber: '#d97706',
    green: '#059669',
};

const MOCKUP_HEIGHT = 'h-[480px] sm:h-[560px] lg:h-[620px]';

export function AnimatedDocketing() {
    return (
        <div
            aria-hidden="true"
            role="img"
            className={`relative flex select-none flex-col overflow-hidden rounded-xl border border-card-border bg-[#f8f8fa] shadow-2xl shadow-black/10 ${MOCKUP_HEIGHT}`}
        >
            {/* ── Chrome bar ── */}
            <div className="flex shrink-0 items-center gap-2 border-b border-card-border bg-white px-3 py-1.5 sm:px-4 sm:py-2">
                <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#FF5F57] sm:h-2.5 sm:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-[#FFBD2E] sm:h-2.5 sm:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-[#28C840] sm:h-2.5 sm:w-2.5" />
                </div>
                <div className="flex flex-1 justify-center">
                    <div
                        className="flex items-center gap-1 rounded-md border border-card-border bg-page-bg-alt px-2 py-0.5 text-[7px] text-text-muted sm:px-3 sm:text-[10px]"
                        style={{ fontFamily: 'var(--font-dashboard-mono)' }}
                    >
                        <svg className="hidden h-2 w-2 text-success sm:block sm:h-2.5 sm:w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        app.designyourinvention.com/docketing
                    </div>
                </div>
                <div className="w-6 sm:w-10" />
            </div>

            {/* ── Workspace header ── */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-card-border bg-white px-2.5 py-1.5 sm:px-3 sm:py-2">
                <div className="flex min-w-0 items-center gap-1.5">
                    <svg className="h-3 w-3 shrink-0 text-primary sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="truncate text-[8px] font-bold text-text-primary sm:text-[11px]" style={{ fontFamily: 'var(--font-dashboard)' }}>
                        Deadline Center
                    </span>
                    <span className="hidden items-center gap-1 rounded border border-card-border bg-white px-1.5 py-0.5 text-[7px] text-text-secondary sm:inline-flex sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                        Timezone: Asia/Kolkata
                    </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <RiskPill color="#dc2626" bg="#fee2e2" label="4 red" />
                    <RiskPill color="#d97706" bg="#fef3c7" label="9 amber" />
                    <span className="hidden sm:inline-flex"><RiskPill color="#059669" bg="#d1fae5" label="31 green" /></span>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="flex min-h-0 flex-1 flex-row gap-2 overflow-hidden bg-[#e9ecf1] p-2 sm:gap-2.5 sm:p-2.5">

                {/* ── Left rail - filters ── */}
                <div className="flex w-24 shrink-0 flex-col overflow-hidden rounded-lg border border-card-border bg-white shadow-md shadow-black/8 sm:w-30 lg:w-36">
                    <div className="shrink-0 border-b border-card-border/60 px-2 py-2 sm:px-2.5">
                        <p className="text-[8px] font-bold leading-tight text-text-primary sm:text-[10px]" style={{ fontFamily: 'var(--font-dashboard)' }}>Deadlines</p>
                        <p className="mt-0.5 text-[6px] leading-tight text-text-muted sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard)' }}>Derived on read</p>
                    </div>
                    <div className="flex-1 overflow-hidden py-1">
                        {FILTERS.map((f, i) => (
                            <div
                                key={f.label}
                                className={`mx-1 my-0.5 flex items-center justify-between gap-1 rounded-md px-1.5 py-1.5 sm:mx-1.5 sm:px-2 ${
                                    i === 0 ? 'border border-primary/30 bg-primary/10' : 'border border-transparent'
                                }`}
                            >
                                <span
                                    className={`truncate text-[7px] font-medium leading-none sm:text-[9px] ${i === 0 ? 'text-primary' : 'text-text-primary'}`}
                                    style={{ fontFamily: 'var(--font-dashboard)' }}
                                >
                                    {f.label}
                                </span>
                                <span className="shrink-0 text-[6px] font-semibold text-text-muted sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                    {f.count}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Mine-only toggle */}
                    <div className="mx-1.5 mb-1.5 flex items-center justify-between rounded-md border border-card-border/60 bg-page-bg-alt px-1.5 py-1.5 sm:px-2">
                        <span className="text-[6px] font-medium text-text-secondary sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard)' }}>Mine only</span>
                        <span className="flex h-2.5 w-4 items-center rounded-full bg-primary/30 px-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        </span>
                    </div>
                </div>

                {/* ── Main - bucketed deadline list ── */}
                <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-card-border bg-white shadow-md shadow-black/8">
                    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-card-border/60 px-2.5 py-1.5 sm:px-3 sm:py-2">
                        <div className="flex items-center gap-1">
                            <span className="inline-flex items-center gap-0.5 rounded border border-card-border bg-white px-1.5 py-0.5 text-[6px] font-medium text-text-secondary sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                All types
                                <svg className="h-1.5 w-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </span>
                            <span className="inline-flex items-center gap-0.5 rounded border border-card-border bg-white px-1.5 py-0.5 text-[6px] font-medium text-text-secondary sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                Sort: Risk
                            </span>
                        </div>
                        <span className="inline-flex items-center gap-0.5 rounded border border-card-border bg-white px-1.5 py-0.5 text-[6px] font-medium text-text-secondary sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            <svg className="h-1.5 w-1.5 sm:h-2 sm:w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export CSV
                        </span>
                    </div>

                    <div className="flex-1 overflow-hidden px-2.5 py-2 sm:px-3">
                        {BUCKETS.map((bucket) => (
                            <div key={bucket.label} className="mb-2 last:mb-0">
                                <div className="mb-1 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: bucket.accent }} />
                                    <span className="text-[6px] font-bold uppercase tracking-wider sm:text-[8px]" style={{ color: bucket.accent, fontFamily: 'var(--font-dashboard)' }}>
                                        {bucket.label}
                                    </span>
                                    <span className="text-[6px] text-text-muted sm:text-[7px]" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                        {bucket.rows.length}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {bucket.rows.map((row) => (
                                        <div
                                            key={row.title + row.family}
                                            className="flex items-center gap-1.5 rounded border border-card-border bg-white px-1.5 py-1.5 sm:gap-2 sm:px-2"
                                        >
                                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: RISK_DOT[row.risk] }} />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[7px] font-semibold text-text-primary sm:text-[9px]" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                                    {row.title}
                                                </p>
                                                <p className="truncate text-[6px] text-text-muted sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                                    {row.family}
                                                    <span className={row.assignee === 'Unassigned' ? 'text-danger' : ''}> · {row.assignee}</span>
                                                </p>
                                            </div>
                                            {row.amount && (
                                                <span className="hidden shrink-0 text-[6px] font-semibold text-text-secondary sm:inline sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                                    {row.amount}
                                                </span>
                                            )}
                                            <span className="shrink-0 text-[6px] font-medium text-text-secondary sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                                {row.due}
                                            </span>
                                            <span
                                                className="hidden shrink-0 rounded px-1 py-0.5 text-[6px] font-bold sm:inline-block sm:text-[8px]"
                                                style={{
                                                    fontFamily: 'var(--font-dashboard-mono)',
                                                    color: RISK_DOT[row.risk],
                                                    backgroundColor: `${RISK_DOT[row.risk]}1a`,
                                                }}
                                            >
                                                {row.score}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right - risk breakdown + digest ── */}
                <div className="hidden w-28 shrink-0 flex-col overflow-hidden rounded-lg border border-card-border bg-white shadow-md shadow-black/8 md:flex lg:w-36">
                    <div className="shrink-0 border-b border-card-border/60 px-2 py-2 sm:px-2.5">
                        <p className="text-[7px] font-bold text-text-primary sm:text-[9px]" style={{ fontFamily: 'var(--font-dashboard)' }}>Portfolio Risk</p>
                    </div>
                    <div className="space-y-2 px-2 py-2 sm:px-2.5">
                        {RISK_BARS.map((bar) => (
                            <div key={bar.label}>
                                <div className="mb-0.5 flex items-center justify-between">
                                    <span className="text-[6px] font-medium text-text-secondary sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard)' }}>{bar.label}</span>
                                    <span className="text-[6px] font-bold sm:text-[8px]" style={{ color: bar.color, fontFamily: 'var(--font-dashboard-mono)' }}>{bar.count}</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-page-bg-alt">
                                    <div className="h-full rounded-full" style={{ width: bar.width, backgroundColor: bar.color }} />
                                </div>
                            </div>
                        ))}
                        <div className="rounded-md border border-card-border/60 bg-page-bg-alt px-1.5 py-1.5 sm:px-2">
                            <p className="text-[6px] text-text-muted sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>Avg score</p>
                            <p className="text-[10px] font-bold text-text-primary sm:text-[13px]" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>41<span className="text-[6px] font-medium text-text-muted sm:text-[8px]"> / 100</span></p>
                        </div>
                    </div>
                    {/* Digest footer */}
                    <div className="mx-1.5 mb-1.5 mt-auto rounded-md border border-primary/20 bg-primary/[0.04] px-1.5 py-1.5 sm:px-2">
                        <div className="mb-0.5 flex items-center gap-1">
                            <svg className="h-2 w-2 shrink-0 text-primary sm:h-2.5 sm:w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span className="text-[6px] font-bold text-text-primary sm:text-[8px]" style={{ fontFamily: 'var(--font-dashboard)' }}>Daily digest</span>
                        </div>
                        <p className="text-[5px] leading-tight text-text-muted sm:text-[7px]" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>Sends 8:00 AM local, sorted by risk</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RiskPill({ color, bg, label }: { color: string; bg: string; label: string }) {
    return (
        <span
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[6px] font-bold sm:text-[8px]"
            style={{ color, backgroundColor: bg, fontFamily: 'var(--font-dashboard-mono)' }}
        >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
            {label}
        </span>
    );
}
