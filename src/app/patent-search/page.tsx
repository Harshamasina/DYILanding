import type { Metadata } from 'next';
import { Fragment } from 'react';
import Link from 'next/link';
import {
    Search,
    FileText,
    ScrollText,
    UserSearch,
    Building2,
    Hash,
    FlaskConical,
    Network,
    Activity,
    Globe,
    SlidersHorizontal,
    Database,
    Lock,
    Download,
    Mail,
    ShieldCheck,
    Bookmark,
    ChevronRight,
    TrendingUp,
    ScanSearch,
    Lightbulb,
    Scale,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { HeroAmbience } from '@/components/ui/HeroAmbience';
import { FadeIn } from '@/components/motion/FadeIn';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { AnimatedPatentSearch } from '@/components/ui/AnimatedPatentSearch';
import { PatentSearchJsonLd } from '@/components/seo/PatentSearchJsonLd';
import { SEARCH_APP_URL } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

export const metadata: Metadata = buildMetadata({
    title: 'Free Patent Search With Chemical Structure and Clinical Trial Data',
    description:
        'Search 120M+ patents across every jurisdiction for free. Detect disclosed compounds with 2D structures, run substructure search, and see linked clinical trials. No account needed to start.',
    path: '/patent-search/',
});

/* ── Data ── */

interface IconItem {
    icon: React.ElementType;
    title: string;
    description: string;
}

const TRUST_STRIP = [
    '120M+ patents covered',
    '100+ jurisdictions',
    'Chemical structure search',
    'Clinical-trial intelligence',
    'Export-ready results',
];

const SEARCH_MODES: IconItem[] = [
    {
        icon: Search,
        title: 'Keyword',
        description: 'Full-text search across titles, abstracts, and claims, with hyphens and stop words handled for you.',
    },
    {
        icon: FileText,
        title: 'Title and Abstract',
        description: 'A faster, scoped search for when you want precision over recall.',
    },
    {
        icon: ScrollText,
        title: 'Claims',
        description: 'Search the claim language itself to find what a patent actually protects.',
    },
    {
        icon: UserSearch,
        title: 'Inventor',
        description: 'Every filing by a named inventor, with name-order variations matched automatically.',
    },
    {
        icon: Building2,
        title: 'Applicant',
        description: 'Search by company or assignee, with corporate suffixes (Inc., Ltd., GmbH) normalized.',
    },
    {
        icon: Hash,
        title: 'Publication Number',
        description: 'Jump straight to a patent by number in any format, spaces and kind codes handled.',
    },
];

const FILTERS = ['Jurisdiction', 'Filing date', 'IPC / CPC', 'Assignee', 'Inventor', 'Scope'];

const WORKFLOW: { icon: React.ElementType; label: string }[] = [
    { icon: FlaskConical, label: 'Molecule' },
    { icon: Network, label: 'Patent Family' },
    { icon: Building2, label: 'Assignee' },
    { icon: Activity, label: 'Clinical Trial' },
    { icon: TrendingUp, label: 'Competitive Landscape' },
];

const ENRICHMENT: IconItem[] = [
    {
        icon: FlaskConical,
        title: 'Compound Chemistry',
        description: 'Compounds disclosed in a patent are resolved to a canonical structure: a 2D depiction plus InChIKey, IUPAC name, SMILES, molecular weight, and cross-database IDs (PubChem, ChEMBL, CAS, DrugBank).',
    },
    {
        icon: Network,
        title: 'Substructure Search',
        description: 'Every pharma patent is back-linked to the compounds it discloses. See how many a patent covers, then find every other patent disclosing the same molecule or scaffold, the substructure-aware search premium tools charge a fortune for.',
    },
    {
        icon: Activity,
        title: 'Clinical Trial Landscape',
        description: 'Linked trials from ClinicalTrials.gov show phase, status, sponsor, and indication, so you can see what is in clinic for a molecule and who is running it, right beside the patent.',
    },
];

const DATA_SOURCES = ['PubChem', 'SureChEMBL', 'UniChem', 'RDKit', 'ClinicalTrials.gov'];

const FREE_FEATURES = [
    'Search 120M+ patents across every jurisdiction',
    'Titles and abstracts, six search modes',
    'Disclosed compounds with 2D structures',
    'Linked clinical-trial data',
];

const WORK_FEATURES = [
    'Everything in free search',
    'Full-text claims on every patent',
    'CSV export of results',
    'More results per page and a higher search limit',
    'Save patents to a portfolio',
];

const PLATFORM_CAPS: IconItem[] = [
    {
        icon: Search,
        title: 'Patent Intelligence',
        description: 'Search by keyword, claims, assignee, inventor, and jurisdiction.',
    },
    {
        icon: FlaskConical,
        title: 'Chemical Search',
        description: 'Find patents connected to compounds, substructures, and molecular families.',
    },
    {
        icon: Activity,
        title: 'Clinical Signals',
        description: 'Map patents to trial activity, indications, sponsors, and competitive signals.',
    },
    {
        icon: Download,
        title: 'Export and Workflow',
        description: 'Save searches, export results, and share findings with IP or R&D teams.',
    },
];

const USE_CASES: IconItem[] = [
    {
        icon: ScanSearch,
        title: 'IP Analysts',
        description: 'Run prior-art, patentability, and competitive-landscape searches faster.',
    },
    {
        icon: FlaskConical,
        title: 'Pharma R&D Teams',
        description: 'Connect compounds, indications, and clinical-trial activity to the patents that cover them.',
    },
    {
        icon: Lightbulb,
        title: 'Startup Founders',
        description: 'Understand the white space before investing in development or filing.',
    },
    {
        icon: Scale,
        title: 'Legal Teams',
        description: 'Prepare export-ready patent evidence and family-level summaries.',
    },
];

const PATENT_SEARCH_FAQ: FaqItem[] = [
    {
        question: 'Is patent search free?',
        answer:
            'Yes. You can search 120M+ patents across every jurisdiction for free, with no account. Signing in with a work email unlocks full-text claims, CSV export, and more results per page, but the core search and the compound and clinical-trial intelligence are free to use.',
    },
    {
        question: 'Do I need an account to search?',
        answer:
            'No. Anonymous search covers titles and abstracts across all jurisdictions and shows disclosed compounds and linked clinical trials. You only need to sign in with a work email when you want full-text claims or to export results to CSV.',
    },
    {
        question: 'Can I search by assignee, inventor, jurisdiction, and legal status?',
        answer:
            'Yes. Alongside keyword and claims search, you can search by inventor and by applicant or assignee, then narrow any query by jurisdiction, filing date, and IPC or CPC classification. Every result carries its legal status, so granted patents are easy to tell from pending applications.',
    },
    {
        question: 'Can I search patents by chemical structure or compound?',
        answer:
            'Yes. Compounds disclosed in a patent are detected and rendered as 2D structures with their InChIKey, IUPAC name, SMILES, and molecular weight. From any compound you can find every other patent that discloses the same molecule or scaffold.',
    },
    {
        question: 'Does the platform support pharma and biotech patent research?',
        answer:
            'Yes. The enrichment layer is built for pharma and biotech work: disclosed compounds are rendered as 2D structures with full chemical identifiers, and patents are linked to their clinical-trial landscape. Non-pharma searches behave exactly the same, they simply do not pick up the chemistry overlay.',
    },
    {
        question: 'What clinical-trial data is shown?',
        answer:
            'Patents are linked to trials from ClinicalTrials.gov, showing the trial phase, recruitment status, lead sponsor, and indication. This lets you see, at a glance, what is in clinical development for a molecule and who is running it.',
    },
    {
        question: 'Can my team export patent results?',
        answer:
            'Yes. Signed-in work-email users can export search results to CSV for sharing with IP or R&D teams, alongside full-text claims and a higher per-page result count.',
    },
    {
        question: 'Can this support freedom-to-operate or competitive-landscape research?',
        answer:
            'It is well suited to it. Universal coverage, substructure search, assignee and inventor search, and the linked clinical-trial landscape make competitive-landscape and freedom-to-operate scoping fast. For formal work, results flow into the full Design Your Invention platform, where prior art is saved with an immutable audit trail.',
    },
    {
        question: 'How many patents and jurisdictions are covered?',
        answer:
            'The search corpus covers 120M+ patents spanning every jurisdiction and IPC class, sourced from the Google Patents public dataset via BigQuery. Coverage is universal, not limited to a single field or country.',
    },
    {
        question: 'How is this different from Google Patents or Lens?',
        answer:
            'Beyond keyword search, every result is enriched: compound chemistry with 2D structures, substructure search to find all patents disclosing a scaffold, and a linked clinical-trial landscape. You can save patents to a portfolio, export to CSV, and move straight into a full IP management platform whose in-app prior-art search is powered by Lens.org.',
    },
    {
        question: 'Is my search activity private?',
        answer:
            'You can search without creating an account, and anonymous searches are not tied to a personal profile. When you sign in, your saved patents and portfolio are private to your account. The wider platform is built for confidential invention workflows with audit-grade access controls.',
    },
    {
        question: 'Which databases power the enrichment?',
        answer:
            'Compound and trial data is drawn from established scientific sources: PubChem and SureChEMBL for compound chemistry, UniChem for cross-database identifiers, RDKit for structure depiction, and ClinicalTrials.gov for the trial landscape.',
    },
    {
        question: 'How do I run a prior art search before drafting an application?',
        answer:
            'Start with a free keyword, assignee, inventor, patent-number, or chemical-structure search to map the existing art, then save the relevant patents. Those saved references carry into the full Design Your Invention platform, where AI drafting generates claims positioned to be novel over exactly that prior art, against a frozen, auditable snapshot of what was reviewed.',
    },
    {
        question: 'Can I search Indian patents and other international jurisdictions?',
        answer:
            'Yes. The corpus spans every jurisdiction, including Indian (IN) patents alongside US, EP, WO, CN, JP, KR, and the rest, sourced from the Google Patents public dataset via BigQuery. You can filter any query by jurisdiction, and a free anonymous search already covers titles and abstracts worldwide; signing in with a work email adds full-text claims and CSV export.',
    },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function PatentSearchPage() {
    return (
        <main id="main-content">
            {/* ── 1. Hero ── */}
            <section className="relative overflow-hidden bg-page-bg-alt pt-28 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">
                <HeroAmbience edge="bottom" />
                <Container className="relative z-10">
                    <nav aria-label="Breadcrumb" className="mb-8">
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
                            <li className="font-medium text-text-primary">Patent Search</li>
                        </ol>
                    </nav>

                    <div className="max-w-3xl">
                        <span
                            className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            Patent Search
                        </span>
                        <h1
                            className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-[3.5rem]"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Search 120M+ Patents, From Keyword to{' '}
                            <span className="text-primary italic">Chemical Structure</span>
                        </h1>
                        <p
                            className="mt-5 text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Search global patents, chemical structures, clinical-trial data, and
                            ownership records from one intelligent workspace, built for invention
                            teams, IP analysts, and R&D professionals.
                        </p>

                        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                            <Button href={SEARCH_APP_URL} newTab size="lg" className="justify-center">
                                Search Free
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                            <BookDemoButton variant="secondary" size="lg" className="justify-center">
                                Book a Demo
                            </BookDemoButton>
                        </div>
                    </div>
                </Container>

                {/* Big animation (placeholder for now) */}
                <Container className="relative z-10 mt-12 sm:mt-16">
                    <MockupHalo>
                        <AnimatedPatentSearch />
                    </MockupHalo>
                </Container>

                {/* Credibility strip */}
                <Container className="relative z-10 mt-8 sm:mt-10">
                    <FadeIn delay={0.1}>
                        <div className="flex flex-wrap justify-center gap-2">
                            {TRUST_STRIP.map((item) => (
                                <TrustPill key={item} label={item} />
                            ))}
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 2. Universal search ── */}
            <section className="relative overflow-hidden bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <HeroAmbience edge="top" />
                <Container className="relative z-10">
                    <FadeIn>
                        <div className="max-w-3xl">
                            <h2
                                className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                One Search Bar, Every Jurisdiction
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Avoid switching between USPTO, EPO, WIPO, Google Patents, Lens, and
                                clinical-trial databases. Search patents, assignees, claims, molecules,
                                and trial signals from one workflow, across 120M+ patents and every
                                jurisdiction.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
                        {SEARCH_MODES.map((mode, i) => (
                            <FadeIn key={mode.title} delay={i * 0.05}>
                                <IconCard {...mode} />
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn delay={0.1}>
                        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                                <SlidersHorizontal className="h-4 w-4 text-primary" />
                                Filter results by
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {FILTERS.map((f, i) => (
                                    <FilterChip key={f} label={f} active={i === 0} />
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 3. Drug-Discovery Intelligence (centerpiece) ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Drug-Discovery Intelligence
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Every Patent, From Molecule to Clinic
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Pharma-relevant patents pick up a layer of chemistry and clinical
                                context that generic patent search never shows, drawn from the same
                                databases the field already trusts.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Molecule -> clinic workflow */}
                    <FadeIn delay={0.05}>
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:mt-12">
                            {WORKFLOW.map((step, i) => (
                                <Fragment key={step.label}>
                                    {i > 0 && (
                                        <ChevronRight
                                            aria-hidden="true"
                                            className="h-4 w-4 shrink-0 text-primary/35"
                                        />
                                    )}
                                    <WorkflowStep icon={step.icon} label={step.label} delay={i * 140} />
                                </Fragment>
                            ))}
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-3">
                        {ENRICHMENT.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.08}>
                                <FeatureCard {...item} />
                            </FadeIn>
                        ))}
                    </div>

                    {/* Powered by */}
                    <FadeIn delay={0.1}>
                        <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-card-border bg-page-bg-alt px-6 py-5 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.06] sm:flex-row sm:items-center sm:gap-5">
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                                <Database className="h-4 w-4 text-primary" />
                                Powered by
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {DATA_SOURCES.map((s) => (
                                    <SourceBadge key={s} label={s} />
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 4. Free vs work email ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="mx-auto max-w-2xl text-center">
                            <h2
                                className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Start Free, Unlock More With a Work Email
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Search and explore the enrichment with no account. A work email adds
                                full-text claims, export, and higher limits.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:mt-16 lg:grid-cols-2">
                        <FadeIn>
                            <AccessPlanCard
                                icon={Search}
                                title="Start Free"
                                subtitle="No account required"
                                features={FREE_FEATURES}
                                cta="Search Free"
                                variant="quiet"
                            />
                        </FadeIn>

                        <FadeIn delay={0.08}>
                            <AccessPlanCard
                                icon={Mail}
                                title="Unlock Professional Access"
                                subtitle="Free to create, unlocks the full tool"
                                features={WORK_FEATURES}
                                cta="Get Full Access"
                                variant="recommended"
                            />
                        </FadeIn>
                    </div>
                </Container>
            </section>

            {/* ── 5. Inside the platform ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <FadeIn>
                            <div>
                                <span
                                    className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                    style={{ fontFamily: 'var(--font-mono)' }}
                                >
                                    Inside the platform
                                </span>
                                <h2
                                    className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    The Same Search, Wired Into Your IP Workflow
                                </h2>
                                <p
                                    className="mt-4 text-lg leading-relaxed text-text-secondary"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    The free tool is the front door. Inside Design Your Invention,
                                    prior-art search runs across 100+ jurisdictions, saves straight to
                                    a patent family with an immutable audit trail, and feeds AI-assisted
                                    drafting, all in one platform.
                                </p>
                                <ul className="mt-6 flex flex-col gap-4">
                                    <li className="flex items-start gap-3">
                                        <Globe className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                        <span
                                            className="text-sm leading-relaxed text-text-secondary"
                                            style={{ fontFamily: 'var(--font-body)' }}
                                        >
                                            Prior-art search across 100+ jurisdictions, with full-text
                                            claims, legal status, citations, and family.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                        <span
                                            className="text-sm leading-relaxed text-text-secondary"
                                            style={{ fontFamily: 'var(--font-body)' }}
                                        >
                                            Save references with relevance scoring and a complete,
                                            tamper-proof audit trail.
                                        </span>
                                    </li>
                                </ul>
                                <Link
                                    href="/#ai-drafting"
                                    className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    See how search feeds AI drafting
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {PLATFORM_CAPS.map((cap) => (
                                    <MiniFeatureCard key={cap.title} {...cap} />
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </Container>
            </section>

            {/* ── 6. Use cases ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="mx-auto max-w-2xl text-center">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Use cases
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Built for Patent, R&D, and Biotech Teams
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                One workspace for the people who turn patent data into decisions.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
                        {USE_CASES.map((uc, i) => (
                            <FadeIn key={uc.title} delay={i * 0.06}>
                                <FeatureCard {...uc} />
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── 7. FAQ ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
                            <h2
                                className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Patent Search Questions
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                What the free search covers, and what a work email unlocks.
                            </p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <FaqAccordion items={PATENT_SEARCH_FAQ} />
                    </FadeIn>
                </Container>
            </section>

            {/* ── 8. Final CTA ── */}
            <section className="py-16 sm:py-20 lg:py-24">
                <Container>
                    <div className="mx-auto max-w-2xl text-center">
                        <h2
                            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Run Your First Search in Seconds
                        </h2>
                        <p
                            className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Search 120M+ patents free, no account, with compound and clinical-trial
                            intelligence on every result.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            <Button href={SEARCH_APP_URL} newTab size="lg" className="w-full justify-center sm:w-auto">
                                Search Free
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                            <BookDemoButton variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
                                Book a Demo
                            </BookDemoButton>
                        </div>
                    </div>
                </Container>
            </section>

            <PatentSearchJsonLd faq={PATENT_SEARCH_FAQ} />
        </main>
    );
}

/* ── Helpers ── */

function TrustPill({ label }: { label: string }) {
    return (
        <span
            className="group inline-flex items-center gap-2 rounded-lg border border-card-border bg-white/80 px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary hover:shadow-md hover:shadow-primary/[0.08]"
            style={{ fontFamily: 'var(--font-mono)' }}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 transition-colors duration-300 group-hover:bg-primary" />
            {label}
        </span>
    );
}

function FilterChip({ label, active }: { label: string; active?: boolean }) {
    return (
        <span
            className={`group inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary hover:shadow-md hover:shadow-primary/[0.08] ${
                active
                    ? 'border-primary/25 bg-primary/[0.07] text-primary'
                    : 'border-card-border bg-card-bg text-text-secondary'
            }`}
            style={{ fontFamily: 'var(--font-mono)' }}
        >
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary/75 transition-transform duration-300 group-hover:scale-110" />
            {label}
        </span>
    );
}

function WorkflowStep({
    icon: Icon,
    label,
    delay,
}: {
    icon: React.ElementType;
    label: string;
    delay: number;
}) {
    return (
        <span
            className="group inline-flex items-center gap-2 rounded-full border border-card-border bg-card-bg px-3.5 py-2 text-xs font-semibold text-text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary hover:shadow-md hover:shadow-primary/[0.08] sm:text-sm"
            style={{ fontFamily: 'var(--font-body)' }}
        >
            <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/[0.08] text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:animate-pulse"
                style={{ animationDelay: `${delay}ms` }}
            >
                <Icon className="h-3.5 w-3.5" />
            </span>
            {label}
        </span>
    );
}

function IconCard({ icon: Icon, title, description }: IconItem) {
    return (
        <article className="group flex gap-4 rounded-2xl border border-transparent p-4 transition-all duration-300 hover:-translate-y-1 hover:border-card-border hover:bg-card-bg hover:shadow-xl hover:shadow-primary/[0.07]">
            <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 transition-all duration-300 group-hover:border-primary/25 group-hover:shadow-md group-hover:shadow-primary/[0.12]">
                <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="min-w-0">
                <h3
                    className="text-[15px] font-semibold leading-snug text-text-primary transition-colors duration-300 group-hover:text-primary"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {title}
                </h3>
                <p
                    className="mt-1 text-[13px] leading-relaxed text-text-secondary"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {description}
                </p>
            </div>
        </article>
    );
}

function FeatureCard({ icon: Icon, title, description }: IconItem) {
    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/[0.08]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-18 bg-linear-to-b from-primary/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 transition-all duration-300 group-hover:border-primary/25 group-hover:shadow-md group-hover:shadow-primary/[0.12]">
                <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
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

function MiniFeatureCard({ icon: Icon, title, description }: IconItem) {
    return (
        <article className="group rounded-2xl border border-card-border bg-page-bg-alt p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-card-bg hover:shadow-lg hover:shadow-primary/[0.07]">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 transition-all duration-300 group-hover:border-primary/25 group-hover:shadow-md group-hover:shadow-primary/[0.12]">
                <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3
                className="mt-3 text-[15px] font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {title}
            </h3>
            <p
                className="mt-1 text-[13px] leading-relaxed text-text-secondary"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {description}
            </p>
        </article>
    );
}

function SourceBadge({ label }: { label: string }) {
    return (
        <span
            className="group inline-flex items-center gap-2 rounded-lg border border-card-border bg-white px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary hover:shadow-md hover:shadow-primary/[0.08]"
            style={{ fontFamily: 'var(--font-mono)' }}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-success/80 transition-colors duration-300 group-hover:bg-success" />
            {label}
        </span>
    );
}

function AccessPlanCard({
    icon: Icon,
    title,
    subtitle,
    features,
    cta,
    variant,
}: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    features: readonly string[];
    cta: string;
    variant: 'quiet' | 'recommended';
}) {
    const recommended = variant === 'recommended';

    return (
        <div
            className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card-bg p-7 transition-all duration-300 hover:-translate-y-1 ${
                recommended
                    ? 'border-2 border-primary shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/[0.16]'
                    : 'border border-card-border shadow-sm hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.08]'
            }`}
        >
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 h-22 bg-linear-to-b from-primary/[0.08] to-transparent transition-opacity duration-300 ${
                    recommended ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
            />
            {recommended && (
                <span
                    className="relative mb-4 inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
                    style={{ fontFamily: 'var(--font-mono)' }}
                >
                    Recommended for IP and R&D teams
                </span>
            )}
            <div className="relative flex items-center gap-2.5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.08] text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/20">
                    <Icon className="h-5 w-5" />
                </span>
                <h3
                    className="text-xl font-bold text-text-primary transition-colors duration-300 group-hover:text-primary"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {title}
                </h3>
            </div>
            <p
                className="relative mt-2 text-sm text-text-muted"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {subtitle}
            </p>
            <ul className="relative mt-6 flex flex-col gap-3">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                        <AccessFeatureIcon feature={feature} />
                        <span
                            className="text-sm text-text-secondary"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="relative mt-auto pt-7">
                <Button
                    href={SEARCH_APP_URL}
                    newTab
                    variant={recommended ? 'primary' : 'secondary'}
                    size="md"
                    className="w-full justify-center"
                >
                    {cta}
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

function AccessFeatureIcon({ feature }: { feature: string }) {
    if (feature.includes('claims')) {
        return <Lock className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />;
    }
    if (feature.includes('CSV') || feature.includes('export')) {
        return <Download className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />;
    }
    if (feature.includes('Save patents')) {
        return <Bookmark className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />;
    }
    return <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success" />;
}
