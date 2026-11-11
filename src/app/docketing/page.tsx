import type { Metadata } from 'next';
import Link from 'next/link';
import {
    ArrowRight,
    BadgeDollarSign,
    BellRing,
    ChevronDown,
    Coins,
    FileClock,
    FolderTree,
    Gavel,
    Globe,
    MapPinned,
    Pill,
    Play,
    type LucideIcon,
} from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { WatchDemoButton } from '@/components/ui/WatchDemoModal';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { HeroAmbience } from '@/components/ui/HeroAmbience';
import { FadeIn } from '@/components/motion/FadeIn';
import { SectionMark } from '@/components/ui/SectionMark';
import { IndexCard } from '@/components/ui/IndexCard';
import { SubsectionNumber } from '@/components/ui/SubsectionNumber';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { AnimatedDocketingWorkflow } from '@/components/ui/AnimatedDocketingWorkflow';
import { ComputedDeadlineTrace } from '@/components/ui/ComputedDeadlineTrace';
import { LoeCard } from '@/components/sections/LoeCard';
import { DocketingHeroSvg } from '@/components/illustrations/DocketingHeroSvg';
import { DocketingJsonLd } from '@/components/seo/DocketingJsonLd';
import { OFFICE_ACTIONS_PAGE_URL, PATENT_SEARCH_PAGE_URL } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

export const metadata: Metadata = buildMetadata({
    title: 'Patent Docketing and Deadline Management Software',
    description:
        'Audit-first patent docketing that derives supported statutory deadlines from your case data, scores each by risk, and emails proactive reminders before they come due. Calculated dates remain subject to professional review.',
    path: '/docketing/',
    ogKey: 'docketing',
});

/* ── Data ── */

interface CardItem {
    title: string;
    description: string;
}

const TRACKS: { label: string; icon: LucideIcon }[] = [
    { label: 'Application Families', icon: FolderTree },
    { label: 'Provisional (PRV) Applications', icon: FileClock },
    { label: 'PCT Filings', icon: Globe },
    { label: 'National-Phase (NPE) Cases', icon: MapPinned },
    { label: 'Office Actions', icon: Gavel },
    { label: 'Annuity Fees', icon: Coins },
    { label: 'Patent Fees', icon: BadgeDollarSign },
    { label: 'Drug Products', icon: Pill },
    { label: 'Custom Reminders', icon: BellRing },
];

const TRACE_CAPABILITIES: CardItem[] = [
    {
        title: 'Cited and explainable',
        description: 'See the source event, governing authority, assumptions, and every calculation step.',
    },
    {
        title: 'Attorney control is preserved',
        description: 'Overrides retain the computed value, require a reason, and remain fully audited.',
    },
    {
        title: 'Updates never move dates silently',
        description: 'Preview the impact, review changes, sign the release, and restore the prior version.',
    },
];

interface RiskSignal {
    weight: string;
    /* Bar width class matching the weight (Tailwind needs the literal). */
    bar: string;
    title: string;
    description: string;
}

const RISK_SIGNALS: RiskSignal[] = [
    { weight: '40%', bar: 'w-[40%]', title: 'Time pressure', description: 'How close, or how far past, the deadline is. Overdue items spike toward 100.' },
    { weight: '25%', bar: 'w-1/4', title: 'Type severity', description: 'Office actions (90) and annuities (80) outrank routine reminders (20).' },
    { weight: '25%', bar: 'w-1/4', title: 'Overdue cascade', description: 'Already-overdue or open past-due items escalate sharply rather than plateauing.' },
    { weight: '10%', bar: 'w-[10%]', title: 'Assignment gap', description: 'Unassigned deadlines are penalized. An orphaned deadline is a dangerous deadline.' },
];

const DIGESTS: CardItem[] = [
    {
        title: 'Daily Deadline Digest',
        description: "Every morning at 8 AM in your workspace's local time zone, every user gets the deadlines coming due within a configurable window, pre-sorted by risk.",
    },
    {
        title: 'Reminder-Due Email',
        description: 'The same morning send for custom reminders falling due that day, so team-specific tasks land alongside statutory deadlines.',
    },
    {
        title: 'Weekly Stale-Alert Digest',
        description: 'Mondays at 9 AM local, a hygiene report of the things quietly going wrong that no hard deadline would surface.',
    },
];

const STALE_BUCKETS: CardItem[] = [
    { title: 'Families with no filings', description: 'A docket opened but never built out, sitting empty and forgotten.' },
    { title: 'Stale records', description: 'Provisional, PCT, or national-phase records untouched past a threshold (default 90 days).' },
    { title: 'Overdue open office actions', description: 'Past due and still not responded, the single most expensive thing to miss.' },
    { title: 'Unpaid overdue fees', description: 'Annuities past due, surfaced with grace-period and amount context.' },
    { title: 'Expired reminders', description: 'Pending reminders whose date has already passed without action.' },
    { title: 'Stale families', description: 'Active families with no updates inside the threshold window.' },
];

const OPS: CardItem[] = [
    {
        title: 'Multi-currency fees',
        description: 'Track patent and annuity fees with status, due date, amount, and currency. Analytics roll up spend across the portfolio with date-accurate FX conversion into one chosen currency.',
    },
    {
        title: 'Outside-counsel directory',
        description: 'A searchable roster of firms and agents, private to your workspace, with per-case assignments by role (lead counsel, local agent, foreign associate, annuity provider) and duplicate-assignment protection.',
    },
    {
        title: 'Family completeness scoring',
        description: 'Each family gets a 0 to 100 data-completeness score across family fields, child coverage, and child quality, turning "is this docket set up correctly?" into a measurable number.',
    },
    {
        title: 'Portfolio dashboard',
        description: 'Status breakdowns across families, PRVs, PCTs, NPE cases, office actions, annuities, and reminders, plus deadline-window counts and the aggregate risk breakdown, as of any chosen date.',
    },
    {
        title: 'Bulk CSV import',
        description: 'Onboard whole portfolios in one pass, importing families with their PRV, PCT, and NPE child records and key dates, with validation and column mapping.',
    },
    {
        title: 'Filtering and export',
        description: 'Filter deadlines by type, family, priority, date range, and assignee, with a "mine only" view for limited-permission users. Export deadlines, fees, and entity lists to CSV.',
    },
    {
        title: 'Branded PDF reports',
        description: 'Turn the live docket into a client-ready document. The portfolio health report carries your logo and organization name, the sections you choose, and an optional as-of date, with deadlines ranked by risk, fees grouped per currency, and stale-record alerts.',
    },
    {
        title: 'Verifiable report integrity',
        description: 'Every report is stamped with a unique Report ID and a SHA-256 checksum written to your audit log, and the preview and the download are byte identical. A report you handed a client months ago can still be verified against the record.',
    },
    {
        title: 'Data portability, no lock-in',
        description: 'Export the whole account, not just a view. Families, filings, cases, fees, reminders, and audit history come out as structured, machine-readable files (NDJSON) with schemas, plus CSV copies, on every plan. Each user can also export their own personal data from their profile.',
    },
];

const SECURITY: CardItem[] = [
    {
        title: 'Full audit trail',
        description: 'Every create, update, and delete on reminders, fees, and cases is logged with actor, before and after state, timestamp, IP, and request ID. Report generation and data exports are audited the same way, and an account export requires a typed reason and notifies every admin.',
    },
    {
        title: 'Reason-for-change enforced',
        description: 'Edits to sensitive fields such as dates and statuses require a typed reason, and deletions always do. The field is required rather than optional, following 21 CFR Part 11 patterns.',
    },
    {
        title: 'Firm-level data isolation',
        description: "Each firm's data is walled off in the database: every query runs under PostgreSQL Row-Level Security, inside a transaction scoped to your workspace. This defense-in-depth isolation is designed to prevent one firm from reaching another firm's docket.",
    },
    {
        title: 'Role-based access',
        description: 'Read versus write is enforced server-side per module (provisional, PCT, national-phase, and the rest). "View all reminders" versus "only mine" is a permission, not a UI toggle.',
    },
];

const PAGE_FAQ: FaqItem[] = [
    {
        question: 'Is this a calendar I have to keep up to date by hand?',
        answer:
            'No. Supported deadlines are computed automatically from the underlying case records every time you open them, not entered manually. The moment you set a filing date or a publication date, every dependent statutory and procedural deadline the engine supports appears automatically and recalculates when those source fields change. Dates the engine does not derive stay under your control as custom reminders, and all dates should be verified by a qualified patent professional.',
    },
    {
        question: 'Which deadlines are computed, and which are tracked?',
        answer:
            'Current computed coverage focuses on supported PCT deadlines and U.S. office-action response chains. Each result carries its informational trust status and a derivation trace, and must be professionally verified. The unified docket also tracks annuities, provisional and national-phase matters, patent fees, and custom reminders; not every tracked date is a rules-based calculation.',
    },
    {
        question: 'How does risk scoring decide what is red?',
        answer:
            'Every deadline gets a 0 to 100 score blending four signals: time pressure (40%), type severity (25%), overdue cascade (25%), and assignment gap (10%). A score of 70 or higher is red, 40 or higher is amber, and anything lower is green. Scores roll up into a portfolio-level breakdown so managers get an at-a-glance health read. The score prioritizes workflow attention. It is not a legal assessment of the case or of the consequences of a missed date.',
    },
    {
        question: 'Will deadlines look overdue a day early for international teams?',
        answer:
            'No. "Today" is computed in your workspace\'s local time zone, so a deadline is not miscolored for a team in another part of the world. Annuity fees also track a grace-period end date, so the system separates "overdue but still payable in grace" from "truly lapsed."',
    },
    {
        question: 'What are the email digests, and can users control them?',
        answer:
            'Three automated jobs push deadlines out: a daily deadline digest (8 AM local, pre-sorted by risk), a reminder-due email the same morning, and a weekly stale-alert hygiene report on Mondays at 9 AM local. Sends respect each user\'s notification preferences, are throttled to provider limits, and fail gracefully per user so one bad address does not block the batch.',
    },
    {
        question: 'What is the stale-alert report for?',
        answer:
            'It surfaces silent risks that no hard deadline would catch: families with no filings, stale provisional, PCT, or national-phase records, overdue open office actions, unpaid overdue fees, expired reminders, and stale families. It is the "what is slipping through the cracks?" view that date-only docketing misses.',
    },
    {
        question: 'Can it handle a multi-currency, multi-jurisdiction portfolio?',
        answer:
            'Yes. Fees and annuities carry an amount and currency, and analytics roll up spend across the portfolio with date-accurate FX conversion into a single chosen reporting currency. A fee can be attached to a family, a provisional, PCT, or national-phase case, or an office action, so renewal exposure is visible at every level.',
    },
    {
        question: 'How is the docket defensible in an audit?',
        answer:
            'Every create, update, and delete on reminders, fees, and cases is logged with actor, before and after state, timestamp, IP, and request ID. Edits to sensitive fields require a typed reason, deletions always do, and each firm\'s data is isolated with PostgreSQL Row-Level Security. Read versus write is enforced server-side per module.',
    },
    {
        question: 'Can I hand a client or an auditor a report straight from the docket?',
        answer:
            'Yes. The portfolio health report turns the live docket into a branded PDF in one click. It carries your organization\'s logo and name, only the sections you select, and an optional as-of date, and it covers portfolio stats, family analytics, deadlines ranked by risk, annuity and patent fees grouped per currency, and stale-record alerts. Every report is stamped with a unique Report ID and a SHA-256 checksum written to your audit log, so a document you handed over months ago can still be verified against the record.',
    },
    {
        question: 'Can I see when a drug product actually loses exclusivity?',
        answer:
            'Yes. The Loss of Exclusivity timeline links each drug product to the patent families and regulatory exclusivities that protect it, then shows three numbers per jurisdiction and indication: the patent wall (the latest granted patent expiry), the regulatory floor (the latest active exclusivity end date), and the combined horizon, which is the later of the two. A live what-if lets you drop a patent family and watch every affected product recompute, so the cost of letting an annuity lapse is visible before the decision is made. The timeline visualizes the dates your attorneys record. It is a portfolio visualization, not a legal determination.',
    },
    {
        question: 'How does it track renewal and annuity fee dates?',
        answer:
            'Annuity and renewal fees are tracked with amount, currency, due date, fee year, renewal year, and a grace-period end date. The engine derives each renewal deadline automatically from the case data, buckets it by urgency, and the daily digest surfaces it before it comes due, distinguishing "overdue but still payable in grace" from "truly lapsed."',
    },
    {
        question: 'How does it reduce the risk of a missed deadline or human error?',
        answer:
            'Supported deadlines are computed automatically from the case records rather than typed into a calendar, so they do not depend on someone remembering to add them. Unassigned deadlines are penalized in the risk score, abandoned or paid items drop out automatically, and three automated digests push what is due to the responsible owner. The weekly stale-alert report catches cases that are silently going wrong without generating a hard deadline. Accuracy still depends on the case data you record, and calculated dates should be verified by a qualified patent professional.',
    },
    {
        question: 'How hard is it to migrate our existing docket from spreadsheets or another tool?',
        answer:
            'Most teams start with a bulk CSV import. You upload your existing portfolio and the system validates every row before anything touches the database, then creates families with their PRV, PCT, and NPE child records and key dates in a single atomic transaction with a full audit trail. Supported dependent deadlines appear automatically when the required source dates are imported.',
    },
    {
        question: 'If we ever leave, can we take our data with us?',
        answer:
            'Yes, on every plan, and without a support ticket. A workspace admin can export the entire account in one click: families, filings, PRV, PCT and NPE cases, office actions, fees, reminders, prior-art references, team roles, and the audit trail. The bundle ships as structured, machine-readable files (NDJSON) with a JSON Schema for every dataset, plus CSV renderings of the common docket views, so it stays readable in Excel and parseable by another system. Each dataset carries a SHA-256 checksum, the whole export is a consistent point-in-time snapshot, and the export itself is audited and emailed to every admin. Individual users can export their own personal data from their profile.',
    },
    {
        question: 'Does it integrate with our existing tools, and is it cloud-based?',
        answer:
            'It is a cloud web application with nothing to install. Every list view (deadlines, fees, families, PRV, PCT, NPE, and audit logs) supports one-click CSV export, bulk CSV import handles onboarding, and a REST API is available for custom integrations with existing firm systems.',
    },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function DocketingPage() {
    return (
        <main id="main-content" className="min-w-0 overflow-x-hidden">
            {/* ── 1. Hero ── */}
            <section className="relative overflow-hidden bg-page-bg-alt pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24">
                <HeroAmbience edge="bottom" />
                <Container className="relative z-10">
                    <nav aria-label="Breadcrumb" className="mb-8 lg:mb-10">
                        <ol
                            className="flex items-center gap-2 text-sm text-text-muted"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            <li>
                                <Link href="/" className="transition-colors hover:text-primary">
                                    Home
                                </Link>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li className="font-medium text-text-primary">Patent Docketing</li>
                        </ol>
                    </nav>

                    <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:gap-8 xl:gap-12">
                        <div className="relative z-10 max-w-3xl lg:max-w-[640px]">
                            <SectionMark numbered={false}>Patent Docketing and Deadline Management</SectionMark>
                            <h1
                                className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-[3.5rem]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Patent Docketing That{' '}
                                <span className="accent-amend text-primary">Reduces Deadline Risk</span>
                            </h1>
                            <p
                                className="mt-5 max-w-[40rem] text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                One missed annuity payment or office-action response can cost a client an
                                entire patent. Docketing is built as an audit-first engine that derives
                                supported statutory and procedural deadlines from your case data, scores
                                each one by risk, and pushes it to the responsible owner before it comes
                                due.
                            </p>
                            {/* The verification boundary sits under the pitch as a ruled note,
                                the way the office actions hero states its scope. */}
                            <p className="mt-5 max-w-[40rem] text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                Every calculated date stays reviewable, and remains subject to
                                verification by a qualified patent professional.
                            </p>

                            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                                <BookDemoButton topic="patent docketing" size="lg" className="justify-center">
                                    Book a Demo
                                </BookDemoButton>
                                <WatchDemoButton variant="outline" size="lg" startTime={34} className="justify-center">
                                    <Play className="h-5 w-5 fill-current" />
                                    Watch Demo
                                </WatchDemoButton>
                            </div>
                        </div>

                        <div className="pointer-events-none hidden md:flex md:w-full md:justify-center lg:justify-end">
                            <DocketingHeroSvg />
                        </div>
                    </div>
                </Container>

                <Container className="figure-group relative z-10 mt-12 sm:mt-16">
                    <MockupHalo>
                        <AnimatedDocketingWorkflow />
                    </MockupHalo>
                </Container>

                {/* Tracks across the case hierarchy */}
                <Container className="relative z-10 mt-8 sm:mt-10">
                    <FadeIn delay={0.1}>
                        <TrackHierarchy />
                    </FadeIn>
                </Container>
            </section>

            {/* ── 2. Traceable computed deadlines ── */}
            <section
                id="computed-deadlines"
                className="relative scroll-mt-24 overflow-hidden bg-page-bg-alt py-20 sm:py-24 lg:py-28"
            >
                <HeroAmbience edge="top" />
                <Container className="relative z-10">
                    <FadeIn>
                        <div className="max-w-4xl">
                            <SectionMark tone="compliance">Traceable computed deadlines</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Every Computed Date{' '}
                                <span className="accent-amend">Shows Its Work</span>
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Supported PCT and U.S. office-action deadlines are calculated from recorded
                                case events using deterministic, versioned rules. Review the trigger,
                                citation, arithmetic, calendar adjustment, assumptions, and rule version
                                behind every result.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                                <Link
                                    href="/blog/automated-patent-deadline-calculation-rules-engine/"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    Read how automated patent deadline calculation works
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                                <Link
                                    href={OFFICE_ACTIONS_PAGE_URL}
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    See office action analysis and response
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.05}>
                        <div className="figure-group relative mt-10 lg:mt-12">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-8 drafting-dots"
                            />
                            <div className="relative">
                                <ComputedDeadlineTrace />
                            </div>
                        </div>
                    </FadeIn>

                    <div className="mt-8 grid gap-x-6 gap-y-8 lg:mt-10 lg:grid-cols-3">
                        {TRACE_CAPABILITIES.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.08} className="h-full">
                                <IndexCard {...item} />
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── 3. Risk scoring ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    {/* The risk-level legend sits in the intro's empty right column from lg up. */}
                    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-end lg:gap-12">
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark>Risk scoring</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Triage by Real Risk, Not Just Date Order
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Every deadline gets a 0 to 100 risk score and a traffic-light level, so
                                attorneys triage by workload pressure rather than date order alone. The
                                score is a weighted blend of four signals, and scores roll up into a
                                portfolio-level breakdown for an at-a-glance health read. Scores rank what
                                needs attention first. They are not a legal assessment of the case.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.05}>
                        <div className="mt-8 lg:mt-0 lg:mb-1">
                            <p className="text-base leading-none tracking-[0.04em] text-navy-light [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                                Risk levels
                            </p>
                            <ul aria-label="Risk levels" className="mt-3 flex flex-col gap-2 pl-1">
                                <RiskLevel dot="bg-danger" ring="ring-danger/20">Red, a score of 70 or higher</RiskLevel>
                                <RiskLevel dot="bg-compliance" ring="ring-compliance/20">Amber, 40 or higher</RiskLevel>
                                <RiskLevel dot="bg-success" ring="ring-success/20">Green, anything lower</RiskLevel>
                            </ul>
                        </div>
                    </FadeIn>
                    </div>

                    <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
                        <div className="grid gap-6 sm:grid-cols-2">
                            {RISK_SIGNALS.map((s, i) => (
                                <FadeIn key={s.title} delay={i * 0.06}>
                                    <RiskSignalCard signal={s} />
                                </FadeIn>
                            ))}
                        </div>
                        <FadeIn delay={0.18}>
                            <RiskScorePanel />
                        </FadeIn>
                    </div>
                </Container>
            </section>

            {/* ── 4. Proactive notifications and the stale-alert hygiene report ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark>Proactive notifications</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Deadlines Come to You, Not the Other Way Around
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Docketing does not wait for users to log in. Three automated digest jobs
                                push deadlines out, each respecting every user's notification preferences, throttled
                                to provider limits, and failing gracefully per user. A fourth report goes
                                further and catches what date-only docketing misses entirely.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.05}>
                        <GroupLabel
                            label="Automated digests"
                            note="Pushed on a schedule, in your workspace's local time zone."
                        />
                    </FadeIn>

                    <div className="mt-6 grid gap-x-6 gap-y-8 lg:grid-cols-3">
                        {DIGESTS.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.08} className="h-full">
                                <IndexCard {...item} />
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn delay={0.05}>
                        <GroupLabel
                            label="Weekly stale-alert report"
                            note="Six buckets of silent risk that never generate a hard deadline."
                        />
                    </FadeIn>

                    <RuledRows items={STALE_BUCKETS} className="mt-6" />
                </Container>
            </section>

            {/* ── 5. Fees, firms, reporting, operations, and the LOE timeline ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark>Fees, firms, reporting, and operations</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                The Operating Layer Around Every Deadline
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Fees, outside counsel, family health, dashboards, and bulk operations all
                                feed the same prioritized deadline view, so the docket reflects how patent
                                work actually flows. The same data becomes a branded PDF report for a client
                                or an auditor, it can leave in a format you own whenever you want it, and it
                                rolls up into the protection horizon of every product it covers.
                            </p>
                        </div>
                    </FadeIn>

                    <DisclosureRows items={OPS} className="mt-12 lg:mt-14" />

                    <div className="mt-12 lg:mt-14">
                        <LoeCard note="Where the docket meets the product it protects." />
                    </div>
                </Container>
            </section>

            {/* ── 7. Audit, security & compliance (dark moat) ── */}
            <section className="bg-navy py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark tone="compliance" dark>Audit, security and compliance</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Audit-First, Tenant-Isolated, Built to Survive Review
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-on-dark"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Docketing inherits the platform's multi-tenant, audit-first architecture. The
                                same controls that make the platform defensible in enterprise procurement
                                apply to every reminder, fee, and case.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
                        {SECURITY.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.08}>
                                <SecurityCard {...item} />
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── 8. FAQ ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
                            <h2
                                className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Docketing Questions
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                How deadlines are derived, scored, and surfaced before they come due.
                            </p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <FaqAccordion items={PAGE_FAQ} initialVisible={6} />
                    </FadeIn>
                </Container>
            </section>

            {/* ── 9. Final CTA ── */}
            <section className="py-16 sm:py-20 lg:py-24">
                <Container>
                    <div className="mx-auto max-w-2xl text-center">
                        <h2
                            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            See Your Docket Ranked by Risk
                        </h2>
                        <p
                            className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Book a walkthrough on a sample portfolio, or explore free patent search to start
                            building families that feed the deadline engine.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            <BookDemoButton topic="patent docketing" size="lg" className="w-full justify-center sm:w-auto">
                                Book a Demo
                            </BookDemoButton>
                            <Button href={PATENT_SEARCH_PAGE_URL} variant="link" size="lg" className="justify-center">
                                Explore Patent Search
                                <ArrowRight className="h-5 w-5" aria-hidden="true" />
                            </Button>
                        </div>
                        <p
                            className="mx-auto mt-8 max-w-[31rem] text-xs leading-relaxed text-text-muted sm:text-[13px]"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Calculated dates are workflow aids, not legal advice. Coverage depends on the
                            case data you record, and every date should be verified by a qualified patent
                            professional before it is relied on.
                        </p>
                    </div>
                </Container>
            </section>

            <DocketingJsonLd faq={PAGE_FAQ} />
        </main>
    );
}

/* ── Helpers ── */

function GroupLabel({ label, note }: { label: string; note: string }) {
    return (
        <div className="mt-14 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 lg:mt-16">
            <span className="text-base leading-none tracking-[0.04em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps] text-navy-light">
                {label}
            </span>
            <span
                className="text-sm text-text-muted"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {note}
            </span>
        </div>
    );
}

function CapabilityCard({ title, description }: CardItem) {
    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-18 bg-linear-to-b from-primary/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <SubsectionNumber className="relative" />
            <h3
                className="relative mt-4 text-lg font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {title}
            </h3>
            <p
                className="relative mt-2 text-sm leading-relaxed text-text-secondary"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {description}
            </p>
        </article>
    );
}

function RiskSignalCard({ signal }: { signal: RiskSignal }) {
    return (
        <article className="group flex h-full flex-col rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05]">
            {/* Weight is shown by bar length, all in indigo, so red, amber
                and green stay reserved for the risk levels themselves. */}
            <div className="flex items-baseline justify-between gap-4">
                <span className="text-2xl font-bold tabular-nums text-primary [font-family:var(--font-mono)]">
                    {signal.weight}
                </span>
                <span className="text-sm leading-none tracking-[0.04em] text-navy-light [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                    weight
                </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-page-bg-alt">
                <div className={`h-full rounded-full bg-primary transition-all duration-500 group-hover:opacity-90 ${signal.bar}`} />
            </div>
            <h3
                className="mt-4 text-base font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {signal.title}
            </h3>
            <p
                className="mt-1.5 text-sm leading-relaxed text-text-secondary"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {signal.description}
            </p>
        </article>
    );
}

function RiskScorePanel() {
    /* 4 + 9 + 31 = 44 deadlines. Bar widths and the donut stops are each
       level's share of that total: 9.1%, 20.5%, and 70.5%. */
    const rows = [
        { label: 'Red', count: 4, bar: 'w-[9.1%] bg-danger', ink: 'text-red-700' },
        { label: 'Amber', count: 9, bar: 'w-[20.5%] bg-compliance', ink: 'text-compliance-ink' },
        { label: 'Green', count: 31, bar: 'w-[70.5%] bg-success', ink: 'text-emerald-700' },
    ];

    return (
        <aside className="group flex h-full flex-col rounded-2xl border border-primary/15 bg-linear-to-br from-white via-white to-indigo-50/60 p-6 shadow-md shadow-primary/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.06]">
            <div>
                <div>
                    <p className="text-base leading-none tracking-[0.04em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps] text-navy-light">
                        Portfolio rollup
                    </p>
                    <h3
                        className="mt-2 text-xl font-semibold text-text-primary"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Risk health at a glance
                    </h3>
                </div>
            </div>

            <div className="mt-7 flex justify-center">
                <div className="relative flex h-38 w-38 items-center justify-center rounded-full bg-[conic-gradient(#dc2626_0_9.1%,#d97706_9.1%_29.6%,#059669_29.6%_100%)] p-3 shadow-inner">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white shadow-sm">
                        <span
                            className="text-3xl font-bold text-text-primary"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            41
                        </span>
                        <span
                            className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            avg score
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-7 space-y-3">
                {rows.map((row) => (
                    <div key={row.label}>
                        <div className="mb-1.5 flex items-center justify-between">
                            <span
                                className="text-xs font-semibold text-text-secondary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                {row.label}
                            </span>
                            <span className={`text-xs font-bold tabular-nums [font-family:var(--font-mono)] ${row.ink}`}>
                                {row.count}
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white shadow-inner">
                            <div className={`h-full rounded-full transition-all duration-500 group-hover:opacity-90 ${row.bar}`} />
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}

function SecurityCard({ title, description }: CardItem) {
    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-light/40 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-light/25 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-primary/[0.05]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-primary-light/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <SubsectionNumber tone="compliance" dark className="relative" />
            <h3
                className="relative mt-4 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-primary-light"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {title}
            </h3>
            <p
                className="relative mt-2 text-sm leading-relaxed text-text-on-dark"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {description}
            </p>
        </article>
    );
}

/* One risk level: a colour dot with a soft halo (the level's colour) and the
   rule in words, so the meaning never rests on colour alone. */
function RiskLevel({ dot, ring, children }: { dot: string; ring: string; children: React.ReactNode }) {
    return (
        <li className="flex items-center gap-2.5 text-sm leading-snug text-text-primary [font-family:var(--font-body)]">
            <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ring-4 ${dot} ${ring}`} />
            {children}
        </li>
    );
}

/* The record types one docket tracks, set as a hierarchy rail: a hairline
   with a tick down to each record, the way a family tree hangs its members.
   Each record is a small tab with its mark; on hover the tab lifts and takes
   registration marks at its corners. */
function TrackHierarchy() {
    return (
        <div className="mx-auto max-w-5xl">
            <p className="text-center text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                One docket covers every record type in a patent family, from the first filing to the drug product it protects.
            </p>
            <p className="mt-6 text-center text-base leading-none tracking-[0.04em] text-navy-light [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                Tracks across your case hierarchy
            </p>
            <ul aria-label="Tracks across your case hierarchy" className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-4 border-t border-primary/15 pt-4 sm:gap-x-4">
                {TRACKS.map(({ label, icon: Icon }) => (
                    <li key={label} className="relative">
                        <span aria-hidden="true" className="absolute -top-4 left-1/2 h-4 w-px -translate-x-1/2 bg-primary/20" />
                        <span className="hover-crop group inline-flex items-center gap-2 rounded-md border border-card-border bg-white px-3 py-1.5 shadow-[0_1px_0_rgba(79,70,229,0.06)] transition-[translate,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/30 motion-reduce:hover:translate-y-0">
                            <Icon aria-hidden="true" className="h-4 w-4 text-primary/70 transition-colors duration-300 group-hover:text-primary" strokeWidth={1.75} />
                            <span className="text-sm text-text-primary [font-family:var(--font-body)]">{label}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/* A numbered ruled list for long runs of short items (stale-alert buckets,
   operations features): subsection number, title, description, and a
   hairline between rows. Two columns from lg; reading order runs across. */
/* A compact numbered list whose rows open to their description. Every
   description stays in the page (and in search results); the list just takes
   less room, so the LOE timeline that follows arrives sooner. Native details
   and summary give keyboard support without any script. */
function DisclosureRows({ items, className = '' }: { items: CardItem[]; className?: string }) {
    /* Two independent columns (not one grid), so opening a row only moves
       the rows below it in its own column. Numbers run down the left column,
       then the right, which is the order the counter assigns them. */
    const half = Math.ceil(items.length / 2);
    const columns = [items.slice(0, half), items.slice(half)];
    return (
        <div className={`grid items-start lg:grid-cols-2 lg:gap-x-12 ${className}`}>
            {columns.map((column, c) => (
                <ol key={c} className={`border-card-border ${c === 0 ? 'border-t' : 'lg:border-t'}`}>
                    {column.map((item, i) => (
                        <li key={item.title} className="hover-changebar group border-b border-card-border">
                            <FadeIn delay={i * 0.04}>
                                <details className="group">
                                    <summary className="grid cursor-pointer list-none grid-cols-[2.75rem_1fr_auto] items-baseline gap-x-3 rounded-sm py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                                        <SubsectionNumber size="sm" className="changebar-shift" />
                                        <h3 className="text-base font-semibold text-text-primary transition-colors group-hover:text-primary [font-family:var(--font-display)]">
                                            <span className="hover-sweep">{item.title}</span>
                                        </h3>
                                        <ChevronDown
                                            aria-hidden="true"
                                            className="h-4 w-4 self-center text-text-secondary transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                                        />
                                    </summary>
                                    <p className="-mt-1 pb-5 pl-[3.5rem] pr-7 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                        {item.description}
                                    </p>
                                </details>
                            </FadeIn>
                        </li>
                    ))}
                </ol>
            ))}
        </div>
    );
}

function RuledRows({ items, className = '' }: { items: CardItem[]; className?: string }) {
    return (
        <ol className={`grid lg:grid-cols-2 lg:gap-x-12 ${className}`}>
            {items.map((item, i) => (
                <li key={item.title}>
                    <FadeIn delay={(i % 2) * 0.06}>
                        <div className="hover-changebar group grid grid-cols-[2.75rem_1fr] gap-x-3 py-5">
                            <SubsectionNumber size="sm" className="changebar-shift mt-0.5" />
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary [font-family:var(--font-display)]">
                                    <span className="hover-sweep">{item.title}</span>
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary transition-colors duration-300 group-hover:text-text-primary [font-family:var(--font-body)]">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </li>
            ))}
        </ol>
    );
}
