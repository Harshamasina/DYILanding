import type { Metadata } from 'next';
import Link from 'next/link';
import {
    AlarmClock,
    Mail,
    BellRing,
    CalendarX2,
    Clock,
    ShieldCheck,
    Database,
    KeyRound,
    ScrollText,
    Coins,
    Building2,
    FileWarning,
    Layers,
    FolderTree,
    Upload,
    Download,
    LayoutDashboard,
    Globe,
    TrendingUp,
    Check,
    ArrowRight,
    Play,
} from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { WatchDemoButton } from '@/components/ui/WatchDemoModal';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { HeroAmbience } from '@/components/ui/HeroAmbience';
import { FadeIn } from '@/components/motion/FadeIn';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { AnimatedDocketingWorkflow } from '@/components/ui/AnimatedDocketingWorkflow';
import { DocketingHeroSvg } from '@/components/illustrations/DocketingHeroSvg';
import { DocketingJsonLd } from '@/components/seo/DocketingJsonLd';
import { PATENT_SEARCH_PAGE_URL } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

export const metadata: Metadata = buildMetadata({
    title: 'Patent Docketing and Deadline Management Software',
    description:
        'Audit-first patent docketing that derives every statutory deadline from your case data, scores each by risk, and emails proactive reminders so none is missed.',
    path: '/docketing/',
});

/* ── Data ── */

interface IconItem {
    icon: React.ElementType;
    title: string;
    description: string;
}

const TRACKS = [
    'Application Families',
    'PRV Applications',
    'PCT Filings',
    'NPE Cases',
    'Office Actions',
    'Annuity Fees',
    'Patent Fees',
    'Custom Reminders',
];

interface DeadlineType {
    icon: React.ElementType;
    type: string;
    derivedFrom: string;
    subTypes: string;
    accent: string;
    tint: string;
}

const DEADLINE_TYPES: DeadlineType[] = [
    { icon: FileWarning, type: 'Office Action Response', derivedFrom: 'NPE office actions (due date)', subTypes: 'Non-final, Final, Advisory', accent: '#dc2626', tint: 'rgba(220,38,38,0.08)' },
    { icon: Coins, type: 'Annuity / Renewal Fee', derivedFrom: 'NPE annuity fees (due date + grace period)', subTypes: 'On-time, In-grace window', accent: '#d97706', tint: 'rgba(217,119,6,0.09)' },
    { icon: Globe, type: 'PCT Deadlines', derivedFrom: 'PCT filings', subTypes: 'Chapter I (Rule 22), Chapter II (Rule 30/31)', accent: '#4f46e5', tint: 'rgba(79,70,229,0.08)' },
    { icon: CalendarX2, type: 'PRV Deadlines', derivedFrom: 'Provisional applications', subTypes: 'Expiry, Conversion deadline', accent: '#6366f1', tint: 'rgba(99,102,241,0.08)' },
    { icon: Database, type: 'Patent Fees', derivedFrom: 'Fees on any entity', subTypes: 'Across 8 fee categories', accent: '#059669', tint: 'rgba(5,150,105,0.08)' },
    { icon: Layers, type: 'NPE Deadlines', derivedFrom: 'NPE cases', subTypes: 'Patent expiry, Request for Examination (RFE)', accent: '#4338ca', tint: 'rgba(67,56,202,0.08)' },
    { icon: AlarmClock, type: 'Custom Reminders', derivedFrom: 'User-created reminders', subTypes: 'One-time or recurring', accent: '#64748b', tint: 'rgba(100,116,139,0.10)' },
];

const ENGINE_BEHAVIORS: IconItem[] = [
    {
        icon: Globe,
        title: 'Timezone correct',
        description: '"Today" is computed in the tenant timezone, so a deadline never looks overdue a day early, or late, for a team in another part of the world.',
    },
    {
        icon: Clock,
        title: 'Grace periods understood',
        description: 'Annuity fees track a grace-period end date, so the system distinguishes "overdue but still payable in grace" from "truly lapsed."',
    },
    {
        icon: Check,
        title: 'Status aware',
        description: 'Abandoned, granted, or already-paid items drop out of the active deadline view automatically, so the list stays the work that actually remains.',
    },
];

interface RiskSignal {
    weight: string;
    title: string;
    description: string;
    accent: string;
    tint: string;
}

const RISK_SIGNALS: RiskSignal[] = [
    { weight: '40%', title: 'Time pressure', description: 'How close, or how far past, the deadline is. Overdue items spike toward 100.', accent: '#dc2626', tint: 'rgba(220,38,38,0.10)' },
    { weight: '25%', title: 'Type severity', description: 'Office actions (90) and annuities (80) outrank routine reminders (20).', accent: '#d97706', tint: 'rgba(217,119,6,0.12)' },
    { weight: '25%', title: 'Overdue cascade', description: 'Already-overdue or open past-due items escalate sharply rather than plateauing.', accent: '#4f46e5', tint: 'rgba(79,70,229,0.10)' },
    { weight: '10%', title: 'Assignment gap', description: 'Unassigned deadlines are penalized. An orphaned deadline is a dangerous deadline.', accent: '#059669', tint: 'rgba(5,150,105,0.10)' },
];

const DIGESTS: IconItem[] = [
    {
        icon: Mail,
        title: 'Daily Deadline Digest',
        description: 'Every morning at 8 AM in each tenant local timezone, every user gets the deadlines coming due within a configurable window, pre-sorted by risk.',
    },
    {
        icon: BellRing,
        title: 'Reminder-Due Email',
        description: 'The same morning send for custom reminders falling due that day, so team-specific tasks land alongside statutory deadlines.',
    },
    {
        icon: CalendarX2,
        title: 'Weekly Stale-Alert Digest',
        description: 'Mondays at 9 AM local, a hygiene report of the things quietly going wrong that no hard deadline would surface.',
    },
];

const STALE_BUCKETS: IconItem[] = [
    { icon: FolderTree, title: 'Families with no filings', description: 'A docket opened but never built out, sitting empty and forgotten.' },
    { icon: Clock, title: 'Stale records', description: 'PRV, PCT, or NPE entities untouched past a threshold (default 90 days).' },
    { icon: FileWarning, title: 'Overdue open office actions', description: 'Past due and still not responded, the single most expensive thing to miss.' },
    { icon: Coins, title: 'Unpaid overdue fees', description: 'Annuities past due, surfaced with grace-period and amount context.' },
    { icon: AlarmClock, title: 'Expired reminders', description: 'Pending reminders whose date has already passed without action.' },
    { icon: Layers, title: 'Stale families', description: 'Active families with no updates inside the threshold window.' },
];

const OPS: IconItem[] = [
    {
        icon: Coins,
        title: 'Multi-currency fees',
        description: 'Track patent and annuity fees with status, due date, amount, and currency. Analytics roll up spend across the portfolio with date-accurate FX conversion into one chosen currency.',
    },
    {
        icon: Building2,
        title: 'Outside-counsel directory',
        description: 'A searchable, tenant-scoped roster of firms and agents, with per-case assignments by role (lead counsel, local agent, foreign associate, annuity provider) and duplicate-assignment protection.',
    },
    {
        icon: TrendingUp,
        title: 'Family completeness scoring',
        description: 'Each family gets a 0 to 100 data-completeness score across family fields, child coverage, and child quality, turning "is this docket set up correctly?" into a measurable number.',
    },
    {
        icon: LayoutDashboard,
        title: 'Portfolio dashboard',
        description: 'Status breakdowns across families, PRVs, PCTs, NPE cases, office actions, annuities, and reminders, plus deadline-window counts and the aggregate risk breakdown, as of any chosen date.',
    },
    {
        icon: Upload,
        title: 'Bulk CSV import',
        description: 'Onboard whole portfolios in one pass, importing families with their PRV, PCT, and NPE child records and key dates, with validation and column mapping.',
    },
    {
        icon: Download,
        title: 'Filtering and export',
        description: 'Filter deadlines by type, family, priority, date range, and assignee, with a "mine only" view for limited-permission users. Export deadlines, fees, and entity lists to CSV.',
    },
];

const SECURITY: IconItem[] = [
    {
        icon: ScrollText,
        title: 'Full audit trail',
        description: 'Every create, update, and delete on reminders, fees, and cases is logged with actor, before and after state, timestamp, IP, and request ID.',
    },
    {
        icon: Database,
        title: 'Reason-for-change enforced',
        description: 'Edits to sensitive fields such as dates and statuses require a typed reason, and deletions always do. The field is never null, mirroring 21 CFR Part 11 patterns.',
    },
    {
        icon: ShieldCheck,
        title: 'Tenant isolation',
        description: 'Every query runs under PostgreSQL Row-Level Security inside a tenant-scoped transaction. One firm can never see another firm docket.',
    },
    {
        icon: KeyRound,
        title: 'Role-based access',
        description: 'Read versus write is enforced server-side per module (prv, pct, npe, and the rest). "View all reminders" versus "only mine" is a permission, not a UI toggle.',
    },
];

const PAGE_FAQ: FaqItem[] = [
    {
        question: 'Is this a calendar I have to keep up to date by hand?',
        answer:
            'No. Deadlines are computed on read from the underlying case records, not entered manually. The moment you set a filing date or a publication date, every dependent statutory and procedural deadline appears automatically and stays correct as the case changes.',
    },
    {
        question: 'Which deadlines does the engine derive?',
        answer:
            'Seven types across the whole case hierarchy: office action responses, annuity and renewal fees, PCT deadlines (Chapter I Rule 22 and Chapter II Rule 30/31), PRV deadlines (expiry and conversion), patent fees, NPE deadlines (patent expiry and request for examination), and custom reminders. Each is bucketed by urgency from overdue through upcoming.',
    },
    {
        question: 'How does risk scoring decide what is red?',
        answer:
            'Every deadline gets a 0 to 100 score blending four signals: time pressure (40%), type severity (25%), overdue cascade (25%), and assignment gap (10%). A score of 70 or higher is red, 40 or higher is amber, and anything lower is green. Scores roll up into a portfolio-level breakdown so managers get an at-a-glance health read.',
    },
    {
        question: 'Will deadlines look overdue a day early for international teams?',
        answer:
            'No. "Today" is computed in each tenant local timezone, so a deadline is never miscolored for a team in another part of the world. Annuity fees also track a grace-period end date, so the system separates "overdue but still payable in grace" from "truly lapsed."',
    },
    {
        question: 'What are the email digests, and can users control them?',
        answer:
            'Three automated jobs push deadlines out: a daily deadline digest (8 AM local, pre-sorted by risk), a reminder-due email the same morning, and a weekly stale-alert hygiene report on Mondays at 9 AM local. Sends respect each user notification preferences, are throttled to provider limits, and fail gracefully per user so one bad address never blocks the batch.',
    },
    {
        question: 'What is the stale-alert report for?',
        answer:
            'It surfaces silent risks that no hard deadline would catch: families with no filings, stale PRV/PCT/NPE records, overdue open office actions, unpaid overdue fees, expired reminders, and stale families. It is the "what is slipping through the cracks?" view that date-only docketing misses.',
    },
    {
        question: 'Can it handle a multi-currency, multi-jurisdiction portfolio?',
        answer:
            'Yes. Fees and annuities carry an amount and currency, and analytics roll up spend across the portfolio with date-accurate FX conversion into a single chosen reporting currency. Fees attach polymorphically to families, PRV, PCT, NPE cases, or office actions, so renewal exposure is visible at every level.',
    },
    {
        question: 'How is the docket defensible in an audit?',
        answer:
            'Every create, update, and delete on reminders, fees, and cases is logged with actor, before and after state, timestamp, IP, and request ID. Edits to sensitive fields require a typed reason, deletions always do, and tenant data is isolated with PostgreSQL Row-Level Security. Read versus write is enforced server-side per module.',
    },
    {
        question: 'How does it track renewal and annuity fee dates?',
        answer:
            'Annuity and renewal fees are tracked with amount, currency, due date, fee year, renewal year, and a grace-period end date. The engine derives each renewal deadline automatically from the case data, buckets it by urgency, and the daily digest surfaces it before it comes due, distinguishing "overdue but still payable in grace" from "truly lapsed."',
    },
    {
        question: 'How does it reduce the risk of a missed deadline or human error?',
        answer:
            'Deadlines are computed on read from the case records rather than typed into a calendar, so they cannot be forgotten or entered wrong. Unassigned deadlines are penalized in the risk score, abandoned or paid items drop out automatically, and three automated digests push what is due to the responsible owner. The weekly stale-alert report catches cases that are silently going wrong without generating a hard deadline.',
    },
    {
        question: 'How hard is it to migrate our existing docket from spreadsheets or another tool?',
        answer:
            'Most teams start with a bulk CSV import. You upload your existing portfolio and the system validates every row before anything touches the database, then creates families with their PRV, PCT, and NPE child records and key dates in a single atomic transaction with a full audit trail. Because deadlines are derived on read, every dependent deadline appears automatically the moment the dates are imported.',
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
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Patent Docketing and Deadline Management
                            </span>
                            <h1
                                className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-[3.5rem]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Patent Docketing That{' '}
                                <span className="text-primary italic">Never Misses a Deadline</span>
                            </h1>
                            <p
                                className="mt-5 text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                One missed annuity payment or office-action response can cost a client an
                                entire patent. Docketing is built as an audit-first, never-miss-a-date engine
                                that derives every statutory and procedural deadline from your case data,
                                scores each one by risk, and pushes it to the right person before it comes due.
                            </p>

                            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                                <BookDemoButton size="lg" className="justify-center">
                                    Book a Demo
                                    <ArrowRight className="h-5 w-5" />
                                </BookDemoButton>
                                <WatchDemoButton variant="secondary" size="lg" className="justify-center">
                                    <Play className="h-5 w-5 fill-current" />
                                    Watch Demo
                                </WatchDemoButton>
                            </div>
                        </div>

                        <div className="pointer-events-none hidden lg:flex lg:w-full lg:justify-end">
                            <DocketingHeroSvg />
                        </div>
                    </div>
                </Container>

                <Container className="relative z-10 mt-12 sm:mt-16">
                    <MockupHalo>
                        <AnimatedDocketingWorkflow />
                    </MockupHalo>
                </Container>

                {/* Tracks across the case hierarchy */}
                <Container className="relative z-10 mt-8 sm:mt-10">
                    <FadeIn delay={0.1}>
                        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-3">
                            <span
                                className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Tracks across your case hierarchy
                            </span>
                            <div className="flex flex-wrap justify-center gap-2">
                                {TRACKS.map((t, i) => (
                                    <TrackChip key={t} label={t} delay={i * 120} />
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 2. The unified deadline engine ── */}
            <section className="relative overflow-hidden bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <HeroAmbience edge="top" />
                <Container className="relative z-10">
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                The unified deadline engine
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                One Engine, Seven Deadline Types
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Deadlines are not a manual calendar. A single engine derives every
                                statutory and procedural deadline across the entire case hierarchy and
                                presents them in one prioritized, filterable view, each bucketed by urgency
                                from overdue through upcoming and tagged with its family, assignee, and (for
                                fees) amount and currency.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.05}>
                        <div className="mt-10 overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm ring-1 ring-white/70 lg:mt-12">
                            <table className="w-full min-w-150 border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-card-border bg-white/60">
                                        {['Deadline Type', 'Derived From', 'Sub-types'].map((h) => (
                                            <th
                                                key={h}
                                                className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-text-muted"
                                                style={{ fontFamily: 'var(--font-mono)' }}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {DEADLINE_TYPES.map((row) => (
                                        <DeadlineTypeRow key={row.type} row={row} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </FadeIn>

                    <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-3">
                        {ENGINE_BEHAVIORS.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.08}>
                                <CapabilityCard {...item} />
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── 3. Risk scoring ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Risk scoring
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Triage by Real Risk, Not Just Date Order
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Every deadline gets a 0 to 100 risk score and a traffic-light level, so
                                attorneys triage by genuine risk. The score is a weighted blend of four
                                signals, and scores roll up into a portfolio-level breakdown for an
                                at-a-glance health read.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.05}>
                        <div className="mt-8 flex flex-wrap items-center gap-2.5">
                            <RiskBadge level="red" />
                            <RiskBadge level="amber" />
                            <RiskBadge level="green" />
                            <span
                                className="text-sm text-text-muted"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                70+ red &middot; 40+ amber &middot; else green
                            </span>
                        </div>
                    </FadeIn>

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

            {/* ── 4. Proactive notifications ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Proactive notifications
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Deadlines Come to You, Not the Other Way Around
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Docketing does not wait for users to log in. Three automated digest jobs
                                push deadlines out, each respecting user notification preferences, throttled
                                to provider limits, and failing gracefully per user.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-3">
                        {DIGESTS.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.08}>
                                <CapabilityCard {...item} />
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── 5. Stale-alert hygiene report ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Stale-alert hygiene report
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Catch What Date-Only Docketing Misses
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Beyond hard deadlines, the system surfaces silent risks, cases that are not
                                generating a deadline but still need attention. The weekly report covers six
                                buckets.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
                        {STALE_BUCKETS.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.06}>
                                <CapabilityCard {...item} />
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── 6. Fees, firms, and portfolio operations ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Fees, firms, and operations
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                The Operating Layer Around Every Deadline
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Fees, outside counsel, family health, dashboards, and bulk operations all
                                feed the same prioritized deadline view, so the docket reflects how patent
                                work actually flows.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
                        {OPS.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.06}>
                                <CapabilityCard {...item} />
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── 7. Audit, security & compliance (dark moat) ── */}
            <section className="bg-navy py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary-light"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Audit, security and compliance
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Audit-First, Tenant-Isolated, Built to Survive Review
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-on-dark"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Docketing inherits the platform multi-tenant, audit-first architecture. The
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
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                How deadlines are derived, scored, and surfaced before they come due.
                            </p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <FaqAccordion items={PAGE_FAQ} />
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
                            See Your Docket Score Itself by Risk
                        </h2>
                        <p
                            className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Book a walkthrough on a sample portfolio, or explore free patent search to start
                            building families that feed the deadline engine.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            <BookDemoButton size="lg" className="w-full justify-center sm:w-auto">
                                Book a Demo
                                <ArrowRight className="h-5 w-5" />
                            </BookDemoButton>
                            <Button href={PATENT_SEARCH_PAGE_URL} variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
                                Explore Patent Search
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>

            <DocketingJsonLd faq={PAGE_FAQ} />
        </main>
    );
}

/* ── Helpers ── */

function TrackChip({ label, delay }: { label: string; delay: number }) {
    return (
        <span
            className="group inline-flex items-center gap-2 rounded-lg border border-card-border bg-white/80 px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary hover:shadow-sm hover:shadow-primary/[0.05]"
            style={{ fontFamily: 'var(--font-mono)' }}
        >
            <span
                className="h-1.5 w-1.5 rounded-full bg-primary/60 transition-colors duration-300 group-hover:bg-primary group-hover:animate-pulse"
                style={{ animationDelay: `${delay}ms` }}
            />
            {label}
        </span>
    );
}

function DeadlineTypeRow({ row }: { row: DeadlineType }) {
    const Icon = row.icon;

    return (
        <tr className="group border-b border-card-border/60 transition-colors duration-200 last:border-b-0 hover:bg-white">
            <td
                className="px-5 py-4 text-sm font-semibold text-text-primary"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                <span className="flex items-center gap-3">
                    <span
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 group-hover:scale-105 group-hover:shadow-sm"
                        style={{ borderColor: `${row.accent}33`, backgroundColor: row.tint }}
                    >
                        <Icon className="h-4 w-4" style={{ color: row.accent }} />
                    </span>
                    {row.type}
                </span>
            </td>
            <td
                className="px-5 py-4 text-sm text-text-secondary"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {row.derivedFrom}
            </td>
            <td className="px-5 py-4">
                <span
                    className="inline-flex rounded-md px-2 py-0.5 text-[12px] font-medium transition-colors duration-200"
                    style={{
                        color: row.accent,
                        backgroundColor: row.tint,
                        fontFamily: 'var(--font-mono)',
                    }}
                >
                    {row.subTypes}
                </span>
            </td>
        </tr>
    );
}

function CapabilityCard({ icon: Icon, title, description }: IconItem) {
    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-18 bg-linear-to-b from-primary/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-sm group-hover:shadow-primary/[0.06]">
                <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-105" />
            </div>
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
            <div className="flex items-start justify-between gap-4">
                <span
                    className="text-2xl font-bold"
                    style={{ color: signal.accent, fontFamily: 'var(--font-mono)' }}
                >
                    {signal.weight}
                </span>
                <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{
                        color: signal.accent,
                        backgroundColor: signal.tint,
                        fontFamily: 'var(--font-mono)',
                    }}
                >
                    weighted
                </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-page-bg-alt">
                <div
                    className="h-full rounded-full transition-all duration-500 group-hover:opacity-90"
                    style={{ width: signal.weight, backgroundColor: signal.accent }}
                />
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
    const rows = [
        { label: 'Red', count: 4, width: '18%', color: '#dc2626' },
        { label: 'Amber', count: 9, width: '38%', color: '#d97706' },
        { label: 'Green', count: 31, width: '88%', color: '#059669' },
    ];

    return (
        <aside className="group flex h-full flex-col rounded-2xl border border-primary/15 bg-linear-to-br from-white via-white to-indigo-50/60 p-6 shadow-md shadow-primary/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.06]">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p
                        className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Portfolio rollup
                    </p>
                    <h3
                        className="mt-2 text-xl font-semibold text-text-primary"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Risk health at a glance
                    </h3>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-white text-primary shadow-sm">
                    <TrendingUp className="h-5 w-5" />
                </span>
            </div>

            <div className="mt-7 flex justify-center">
                <div
                    className="relative flex h-38 w-38 items-center justify-center rounded-full p-3 shadow-inner"
                    style={{
                        background:
                            'conic-gradient(#dc2626 0 18%, #d97706 18% 56%, #059669 56% 100%)',
                    }}
                >
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white shadow-sm">
                        <span
                            className="text-3xl font-bold text-text-primary"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            41
                        </span>
                        <span
                            className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted"
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
                            <span
                                className="text-xs font-bold"
                                style={{ color: row.color, fontFamily: 'var(--font-mono)' }}
                            >
                                {row.count}
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white shadow-inner">
                            <div
                                className="h-full rounded-full transition-all duration-500 group-hover:opacity-90"
                                style={{ width: row.width, backgroundColor: row.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}

function SecurityCard({ icon: Icon, title, description }: IconItem) {
    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-light/40 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-light/25 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-primary/[0.05]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-primary-light/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-primary-light/25 group-hover:bg-primary-light/10 group-hover:shadow-sm group-hover:shadow-primary/[0.05]">
                <Icon className="h-5 w-5 text-primary-light transition-transform duration-300 group-hover:scale-105" />
            </div>
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

function RiskBadge({ level }: { level: 'red' | 'amber' | 'green' }) {
    const map = {
        red: { label: 'Red', bg: 'bg-danger/10', text: 'text-danger', dot: 'bg-danger' },
        amber: { label: 'Amber', bg: 'bg-compliance/10', text: 'text-compliance', dot: 'bg-compliance' },
        green: { label: 'Green', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
    }[level];
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${map.bg} ${map.text}`}
            style={{ fontFamily: 'var(--font-mono)' }}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${map.dot}`} />
            {map.label}
        </span>
    );
}
