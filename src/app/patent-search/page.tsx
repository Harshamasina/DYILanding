import type { Metadata } from 'next';
import { Fragment } from 'react';
import Link from 'next/link';
import {
    Search,
    ChevronRight,
    ArrowRight,
    Check,
    FileSearch,
    Filter,
    FlaskConical,
    Lightbulb,
    Scale,
    type LucideIcon,
} from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { HeroAmbience } from '@/components/ui/HeroAmbience';
import { FadeIn } from '@/components/motion/FadeIn';
import { SectionMark } from '@/components/ui/SectionMark';
import { IndexCard } from '@/components/ui/IndexCard';
import { SubsectionNumber } from '@/components/ui/SubsectionNumber';
import { ProcessFlow } from '@/components/ui/ProcessFlow';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { AnimatedPatentSearch, CompoundsTrialsStill } from '@/components/ui/AnimatedPatentSearch';
import { PatentSearchHeroSvg } from '@/components/illustrations/PatentSearchHeroSvg';
import { NoveltySearchFigure } from '@/components/illustrations/NoveltySearchFigure';
import { PatentSearchJsonLd } from '@/components/seo/PatentSearchJsonLd';
import { SEARCH_APP_URL } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

export const metadata: Metadata = buildMetadata({
    title: 'Free Patent Search With Chemical Structure and Clinical Trial Data',
    description:
        'Free patent search across a corpus of 120M+ patent records from 100+ patent authorities. Detect disclosed compounds, run substructure search, see linked clinical trials, and run an automated novelty search from your invention brief.',
    path: '/patent-search/',
    ogKey: 'patent-search',
});

/* ── Data ── */

interface IconItem {
    title: string;
    description: string;
}

const SEARCH_MODES: IconItem[] = [
    {
        title: 'Keyword',
        description: 'Full-text search across titles, abstracts, and claims, with hyphens and stop words handled for you.',
    },
    {
        title: 'Title and Abstract',
        description: 'A faster, scoped search for when you want precision over recall.',
    },
    {
        title: 'Claims',
        description: 'Search the claim language itself to find what a patent actually protects.',
    },
    {
        title: 'Inventor',
        description: 'Every filing by a named inventor, with name-order variations matched automatically.',
    },
    {
        title: 'Applicant',
        description: 'Search by company or assignee, with corporate suffixes (Inc., Ltd., GmbH) normalized.',
    },
    {
        title: 'Publication Number',
        description: 'Jump straight to a patent by number in any format, spaces and kind codes handled.',
    },
];

/* The filters, grouped by kind so the list reads in three short lines. */
const FILTER_GROUPS: { label: string; items: string[] }[] = [
    { label: 'Bibliographic', items: ['Jurisdiction', 'Filing date', 'Publication date', 'Priority date', 'IPC / CPC', 'Assignee', 'Inventor', 'Scope'] },
    { label: 'Legal and family', items: ['Legal status', 'Patent family', 'Cited by'] },
    { label: 'Chemistry and trials', items: ['Compounds', 'Clinical trials'] },
];

const WORKFLOW = [
    'Molecule',
    'Patent Family',
    'Assignee',
    'Clinical Trial',
    'Competitive Landscape',
];

const ENRICHMENT: IconItem[] = [
    {
        title: 'Compound Chemistry',
        description: 'Compounds disclosed in a patent are resolved to a canonical structure: a 2D depiction plus InChIKey, IUPAC name, SMILES, molecular weight, and cross-database IDs (PubChem, ChEMBL, CAS, DrugBank).',
    },
    {
        title: 'Substructure Search',
        description: 'Pharma patents are back-linked to the compounds detected in them. See how many a patent covers, then find other patents in the corpus disclosing the same molecule or scaffold with a substructure-aware search.',
    },
    {
        title: 'Clinical Trial Landscape',
        description: 'Linked trials from ClinicalTrials.gov show phase, status, sponsor, and indication, so you can see what is in clinic for a molecule and who is running it, right beside the patent.',
    },
];

const FREE_FEATURES = [
    'Search 120M+ patent records across 100+ authorities',
    'Titles and abstracts on every result',
    'Six search modes; claims mode searches available claim text',
    'Disclosed compounds with 2D structures',
    'Linked clinical-trial data',
];

const WORK_FEATURES = [
    'Everything in free search',
    'Full-text claims where the source dataset provides them',
    'CSV export of results',
    'More results per page and a higher search limit',
    'Save patents to a portfolio',
];

const PLATFORM_CAPS: IconItem[] = [
    {
        title: 'Patent Intelligence',
        description: 'Search by keyword, claims, assignee, inventor, and jurisdiction.',
    },
    {
        title: 'Chemical Search',
        description: 'Find patents connected to compounds, substructures, and molecular families.',
    },
    {
        title: 'Clinical Signals',
        description: 'Map patents to trial activity, indications, sponsors, and competitive signals.',
    },
    {
        title: 'Export and Workflow',
        description: 'Save patents to a portfolio, export results, and share findings with IP or R&D teams.',
    },
];

const NOVELTY_STEPS: IconItem[] = [
    {
        title: 'Features from the brief',
        description: 'The invention brief becomes numbered features, F1 to F8, the same ones your attorney reviews.',
    },
    {
        title: 'A search built for you',
        description: 'Queries are written from each feature, run across the global patent corpus, and ranked against the whole invention.',
    },
    {
        title: 'Read feature by feature',
        description: 'The strongest candidates are read in their abstracts and claims, and every finding quotes the passage it rests on.',
    },
    {
        title: 'Dated against your priority',
        description: 'Each reference is placed against your priority date, including art filed earlier and published later.',
    },
];

const NOVELTY_AFTER: IconItem[] = [
    {
        title: 'Your references, read the same way',
        description: 'List up to 25 patents you already hold. They are read against the same features, beside the search results.',
    },
    {
        title: 'Carried into AI drafting',
        description: "Save a reference to the family and its findings travel with it into the drafting wizard's prior art step.",
    },
];

const USE_CASES: (IconItem & { icon: LucideIcon })[] = [
    {
        icon: Search,
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
        description: 'Understand the white space before investing in development, and run a novelty search on the invention brief before paying for a draft.',
    },
    {
        icon: Scale,
        title: 'Legal Teams',
        description: 'Prepare export-ready patent evidence and family-level summaries, with novelty findings tied to quoted claims.',
    },
];

const PATENT_SEARCH_FAQ: FaqItem[] = [
    {
        question: 'Is patent search free?',
        answer:
            'Yes. You can search a corpus of 120M+ patent records from 100+ patent authorities for free, with no account. Signing in with a work email unlocks full-text claims, CSV export, and more results per page, but the core search and the compound and clinical-trial intelligence are free to use.',
    },
    {
        question: 'Do I need an account to search?',
        answer:
            'No. Anonymous search covers titles and abstracts across the authorities in the corpus and shows detected compounds and linked clinical trials. You only need to sign in with a work email when you want full-text claims or to export results to CSV.',
    },
    {
        question: 'How does the automated novelty search work?',
        answer:
            "Inside the platform, the novelty search starts from a patent family's invention brief rather than a query. The brief is broken into numbered features, a search is built from those features and run across the global patent corpus, and the strongest candidates are read against every feature in their abstracts and claims. Each finding is marked found, partially found, or not found in the reviewed text, with the quoted passage it rests on, and each reference is dated against your priority date. Your team marks what is relevant and saves it to the family.",
    },
    {
        question: 'Can I add references I already have to a novelty search?',
        answer:
            "Yes. List up to 25 patent publications you already hold, and they are read against the same features as the search results. References you save keep their findings, so they arrive in the AI drafting prior art step already mapped to the invention's features.",
    },
    {
        question: 'Can I search by assignee, inventor, jurisdiction, and legal status?',
        answer:
            'Yes. Alongside keyword and claims search, you can search by inventor and by applicant or assignee, then narrow any query by jurisdiction, filing date, and IPC or CPC classification. Every result carries its legal status, so granted patents are easy to tell from pending applications.',
    },
    {
        question: 'Can I search patents by chemical structure or compound?',
        answer:
            'Yes. Compounds disclosed in a patent are detected and rendered as 2D structures with their InChIKey, IUPAC name, SMILES, and molecular weight. From any compound you can find other patents in the corpus that disclose the same molecule or scaffold. Detection is automated enrichment over third-party chemistry sources, so verify structures and associations against the original patent before relying on them.',
    },
    {
        question: 'Does the platform support pharma and biotech patent research?',
        answer:
            'Yes. The enrichment layer is built for pharma and biotech work: disclosed compounds are rendered as 2D structures with full chemical identifiers, and patents are linked to their clinical-trial landscape. Non-pharma searches behave exactly the same, they simply do not pick up the chemistry overlay.',
    },
    {
        question: 'What clinical-trial data is shown?',
        answer:
            'Patents are linked to trials from ClinicalTrials.gov, showing the trial phase, recruitment status, lead sponsor, and indication. This lets you see, at a glance, what is in clinical development for a molecule and who is running it. Patent-to-trial links are inferred from compound and sponsor data and should be confirmed against the trial record.',
    },
    {
        question: 'Can my team export patent results?',
        answer:
            'Yes. Signed-in work-email users can export search results to CSV for sharing with IP or R&D teams, alongside full-text claims and a higher per-page result count.',
    },
    {
        question: 'Can this support freedom-to-operate or competitive-landscape research?',
        answer:
            'It is well suited to scoping that work. Coverage across 100+ patent authorities, substructure search, assignee and inventor search, and the linked clinical-trial landscape make competitive-landscape and freedom-to-operate scoping fast. Results are a research aid, not a legal opinion: a freedom-to-operate conclusion requires qualified counsel and an appropriately scoped search, including sources and jurisdictions this corpus may not cover. For formal work, results flow into the full Design Your Invention platform, where prior art is saved with an append-only audit trail.',
    },
    {
        question: 'How many patents and jurisdictions are covered?',
        answer:
            'The public search corpus covers 120M+ patent records from 100+ patent authorities across IPC classes, sourced from the Google Patents public dataset via BigQuery. Coverage, full-text availability, language, and legal-status freshness vary by authority and by publication delay, so it is broad rather than complete. The in-app prior-art search inside the platform uses a separate data source, so result sets can differ.',
    },
    {
        question: 'How is this different from Google Patents or Lens?',
        answer:
            'Beyond keyword search, results carry an enrichment layer: compound chemistry with 2D structures, substructure search to find other patents in the corpus disclosing a scaffold, and a linked clinical-trial landscape. You can save patents to a portfolio, export to CSV, and move straight into a full IP management platform with its own integrated prior-art search.',
    },
    {
        question: 'Is my search activity private?',
        answer:
            'You can search without creating an account, and anonymous searches are not tied to a personal profile. Queries are still processed and logged for operational purposes such as rate limiting, abuse prevention, and service monitoring, as described in the privacy policy. When you sign in, your saved patents and portfolio are private to your account, and the wider platform is built for confidential invention workflows with tenant-scoped access controls.',
    },
    {
        question: 'Which databases power the enrichment?',
        answer:
            'Compound and trial data is drawn from established scientific sources: PubChem and SureChEMBL for compound chemistry, UniChem for cross-database identifiers, RDKit for structure depiction, and ClinicalTrials.gov for the trial landscape.',
    },
    {
        question: 'How do I run a prior art search before drafting an application?',
        answer:
            'Start with a free keyword, assignee, inventor, patent-number, or chemical-structure search to map the existing art, then save the relevant patents. Those saved references carry into the full Design Your Invention platform, where AI drafting generates draft claims with exactly those references available as context, against a frozen, auditable snapshot of what was reviewed. The draft and the search behind it both require attorney review.',
    },
    {
        question: 'Can I search Indian patents and other international jurisdictions?',
        answer:
            'Yes. The corpus spans 100+ patent authorities, including Indian (IN) patents alongside US, EP, WO, CN, JP, KR, and others, sourced from the Google Patents public dataset via BigQuery. You can filter any query by jurisdiction, and a free anonymous search already covers titles and abstracts worldwide; signing in with a work email adds full-text claims and CSV export.',
    },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function PatentSearchPage() {
    return (
        <main id="main-content" className="min-w-0 overflow-x-hidden">
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

                    <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(430px,1.05fr)] lg:gap-8 xl:gap-12">
                        <div className="relative z-10 max-w-3xl lg:max-w-[640px]">
                            <SectionMark numbered={false}>Patent Search</SectionMark>
                            <h1
                                className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-[3.5rem]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Search 120M+ Patents, From Keyword to{' '}
                                <span className="accent-amend text-primary">Chemical Structure</span>
                            </h1>
                            <p className="mt-5 text-base leading-relaxed text-text-secondary [font-family:var(--font-body)] sm:mt-6 sm:text-lg">
                                Search 120M+ global patent records alongside chemical structures,
                                clinical-trial data, and ownership records, from one intelligent
                                workspace built for invention teams, IP analysts, and R&D
                                professionals. Inside the platform, run an automated novelty search
                                straight from your invention brief.
                            </p>

                            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                                <Button href={SEARCH_APP_URL} newTab size="lg" className="justify-center whitespace-nowrap">
                                    <FileSearch className="h-5 w-5" />
                                    Try Patent Search Free
                                </Button>
                                <BookDemoButton topic="patent search" variant="link" size="lg" className="justify-center">
                                    Book a Demo
                                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                                </BookDemoButton>
                            </div>
                        </div>

                        <div className="pointer-events-none hidden md:flex md:w-full md:justify-center lg:justify-end">
                            <PatentSearchHeroSvg />
                        </div>
                    </div>
                </Container>

                {/* Product walkthrough: results, claims, and compounds for one patent. */}
                <Container className="figure-group relative z-10 mt-12 sm:mt-16">
                    <MockupHalo>
                        <AnimatedPatentSearch />
                    </MockupHalo>
                </Container>

                {/* Credibility strip */}
                <Container className="relative z-10 mt-8 sm:mt-10">
                    <FadeIn delay={0.1}>
                        <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                            <span className="font-semibold text-text-primary">120M+ patent records</span> from{' '}
                            <span className="font-semibold text-text-primary">100+ patent authorities</span>, with chemical
                            structure search, clinical-trial intelligence, and export-ready results.
                        </p>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 2. Global search ── */}
            <section className="relative overflow-hidden bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <HeroAmbience edge="top" />
                <Container className="relative z-10">
                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
                        <FadeIn className="min-w-0">
                            <div className="lg:sticky lg:top-28">
                                <SectionMark>Global Patent Search</SectionMark>
                                <h2
                                    className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    One Search Bar, 100+ Patent Authorities
                                </h2>
                                <p
                                    className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    Avoid switching between USPTO, EPO, WIPO, Google Patents, Lens,
                                    and clinical-trial databases. Search patents, assignees, claims,
                                    molecules, and trial signals from one workflow, across a corpus
                                    of 120M+ patent records from 100+ patent authorities. Coverage
                                    and full-text availability vary by source and publication delay.
                                </p>

                                <div className="figure-group mt-8">
                                    <div className="overflow-hidden rounded-2xl border border-card-border bg-white shadow-xl shadow-primary/[0.05]">
                                        <div className="border-b border-card-border bg-linear-to-r from-primary/[0.08] via-white to-white p-4">
                                            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-3 py-2.5 shadow-sm">
                                                <Search className="h-4 w-4 shrink-0 text-primary" />
                                                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text-primary [font-family:var(--font-body)]">
                                                    aspirin AND caffeine
                                                </span>
                                                <span
                                                    className="hidden rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white sm:inline-flex"
                                                    style={{ fontFamily: 'var(--font-mono)' }}
                                                >
                                                    Search
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 divide-x divide-card-border">
                                            <SearchMetric value="120M+" label="patent records" />
                                            <SearchMetric value="100+" label="authorities" />
                                            <SearchMetric value="6" label="search modes" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <div className="min-w-0">
                            <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2">
                                {SEARCH_MODES.map((mode, i) => (
                                    <FadeIn key={mode.title} delay={i * 0.04} className="h-full">
                                        <SearchModeCard {...mode} />
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    </div>

                    <FadeIn delay={0.12}>
                        <div className="mt-8 rounded-2xl border border-card-border bg-white p-5 shadow-sm sm:p-6 lg:p-7">
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-10">
                                <div className="flex items-start gap-3.5">
                                    <span
                                        aria-hidden="true"
                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/[0.04] text-primary"
                                    >
                                        <Filter className="h-4.5 w-4.5" strokeWidth={1.6} />
                                    </span>
                                    <div>
                                        <p className="text-lg font-semibold leading-snug text-text-primary [font-family:var(--font-display)]">
                                            Filter results by
                                        </p>
                                        <p className="mt-1 text-[13px] leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                            Narrow broad searches without leaving the same workflow.
                                        </p>
                                    </div>
                                </div>
                                <dl className="flex flex-col gap-4 lg:border-l lg:border-card-border lg:pl-10">
                                    {FILTER_GROUPS.map((group) => (
                                        <FilterGroup key={group.label} label={group.label} items={group.items} />
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 3. Novelty search (inside the platform) ── */}
            <section id="novelty-search" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark>Novelty Search</SectionMark>
                            <h2 className="mt-5 text-3xl font-bold tracking-tight text-text-primary [font-family:var(--font-display)] sm:text-4xl lg:text-5xl">
                                Automated Novelty Search, <span className="accent-amend">From Your Invention Brief</span>
                            </h2>
                            <p className="mt-4 text-lg leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                Inside the platform, start from the invention brief instead of a query. The
                                novelty search builds its own search from the invention&apos;s features, ranks
                                candidates from the global patent corpus, and reads the strongest ones against
                                every feature, with the quoted passage behind each finding.
                            </p>
                        </div>
                    </FadeIn>

                    <ProcessFlow label="How the novelty search runs" steps={NOVELTY_STEPS} className="mt-10 lg:mt-12" />

                    <FadeIn delay={0.08}>
                        <div className="figure-group relative mt-8 lg:mt-10">
                            <div aria-hidden="true" className="pointer-events-none absolute -inset-6 drafting-dots" />
                            <NoveltySearchFigure className="relative" />
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid grid-cols-1 items-end gap-x-10 gap-y-2 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_auto]">
                        <FadeIn>
                            <NumberedRuledList items={NOVELTY_AFTER} columns={2} plain />
                        </FadeIn>
                        <FadeIn delay={0.06} className="pb-5">
                            <Link
                                href="/ai-patent-drafting/"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark [font-family:var(--font-body)]"
                            >
                                See how findings feed AI drafting
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </FadeIn>
                    </div>
                </Container>
            </section>

            {/* ── 4. Drug-Discovery Intelligence (centerpiece) ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark>Drug-Discovery Intelligence</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                From Molecule to Clinic, Beside the Patent
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Pharma-relevant patents pick up a layer of chemistry and clinical
                                context that generic patent search does not surface, drawn from the
                                same databases the field already trusts.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Molecule -> clinic workflow */}
                    <FadeIn delay={0.05}>
                        <ol className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:mt-12">
                            {WORKFLOW.map((step, i) => (
                                <Fragment key={step}>
                                    {i > 0 && (
                                        <li aria-hidden="true">
                                            <ChevronRight className="h-4 w-4 shrink-0 text-primary/35" />
                                        </li>
                                    )}
                                    <li className="text-base text-text-primary [font-family:var(--font-display)] sm:text-lg">
                                        {step}
                                    </li>
                                </Fragment>
                            ))}
                        </ol>
                    </FadeIn>

                    {/* The enrichment itself, shown rather than described. */}
                    <FadeIn delay={0.08}>
                        <div className="figure-group mx-auto mt-10 max-w-4xl lg:mt-12">
                            <CompoundsTrialsStill />
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 lg:mt-14 lg:grid-cols-3">
                        {ENRICHMENT.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.08} className="h-full">
                                <IndexCard {...item} />
                            </FadeIn>
                        ))}
                    </div>

                    {/* Powered by */}
                    <FadeIn delay={0.1}>
                        <p className="mt-12 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                            Enrichment draws on PubChem, SureChEMBL, UniChem, RDKit, and ClinicalTrials.gov.
                        </p>
                    </FadeIn>

                    {/* Professional-use notice: hidden pending attorney review of its wording. */}
                    {/* <FadeIn delay={0.12}>
                        <div className="mt-6 rounded-2xl border border-compliance/25 bg-compliance/[0.04] px-6 py-5">
                            <h3 className="text-sm font-semibold text-text-primary [font-family:var(--font-display)]">
                                What to verify before you rely on a result
                            </h3>
                            <ul className="mt-3 flex flex-col gap-2 text-[13px] leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                <li>
                                    Compound detection and patent-to-trial links are automated
                                    enrichment. Check associations against the original patent and
                                    trial records before acting on them.
                                </li>
                                <li>
                                    Coverage, full-text availability, language, and legal-status
                                    freshness vary by patent authority and by publication delay.
                                </li>
                                <li>
                                    Search results are not a legal opinion. Freedom-to-operate,
                                    validity, and patentability conclusions require qualified counsel
                                    and an appropriately scoped search.
                                </li>
                            </ul>
                        </div>
                    </FadeIn> */}
                </Container>
            </section>

            {/* ── 5. Free vs work email ── */}
            <section className="py-20 sm:py-24 lg:py-28">
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

                    <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-2">
                        <FadeIn>
                            <AccessPlanCard
                                title="Start Free"
                                subtitle="No account required"
                                features={FREE_FEATURES}
                                cta="Search Free"
                                variant="quiet"
                            />
                        </FadeIn>

                        <FadeIn delay={0.08}>
                            <AccessPlanCard
                                title="Unlock Professional Access"
                                subtitle="Free work-email account"
                                features={WORK_FEATURES}
                                cta="Search, then sign in with a work email"
                                variant="recommended"
                            />
                        </FadeIn>
                    </div>
                </Container>
            </section>

            {/* ── 6. Inside the platform ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <FadeIn className="min-w-0">
                            <div>
                                <SectionMark>Inside the platform</SectionMark>
                                <h2
                                    className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    Search That Carries Into Your IP Workflow
                                </h2>
                                <p
                                    className="mt-4 text-lg leading-relaxed text-text-secondary"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    The free tool is the front door. Inside Design Your Invention,
                                    prior-art search runs across 100+ patent authorities, saves
                                    straight to a patent family with an append-only audit trail, and
                                    feeds AI-assisted drafting, all in one platform. The public search
                                    and the in-app prior-art search use separate data sources, so
                                    result sets can differ.
                                </p>
                                <ul className="mt-6 flex flex-col gap-3 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                    <li>
                                        Prior-art search across 100+ patent authorities, with
                                        full-text claims, legal status, citations, and family
                                        where the source provides them.
                                    </li>
                                    <li>
                                        Automated novelty search from a family&apos;s invention brief,
                                        read feature by feature.
                                    </li>
                                    <li>
                                        Save references with relevance scoring and a complete,
                                        append-only audit trail.
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

                        <FadeIn delay={0.1} className="min-w-0">
                            <PlatformCapList items={PLATFORM_CAPS} />
                        </FadeIn>
                    </div>
                </Container>
            </section>

            {/* ── 7. Use cases ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="mx-auto max-w-2xl text-center">
                            <SectionMark className="justify-center">Use cases</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
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

                    <FadeIn delay={0.06}>
                        <UseCaseCards items={USE_CASES} className="mx-auto mt-12 max-w-5xl lg:mt-16" />
                    </FadeIn>
                </Container>
            </section>

            {/* ── 8. FAQ ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
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
                        <FaqAccordion items={PATENT_SEARCH_FAQ} initialVisible={6} />
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
                            Run Your First Search in Seconds
                        </h2>
                        <p
                            className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Search 120M+ patent records free, no account, with compound and
                            clinical-trial context on matching results.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            <Button href={SEARCH_APP_URL} newTab size="lg" className="w-full justify-center sm:w-auto whitespace-nowrap">
                                <FileSearch className="h-5 w-5" />
                                Try Patent Search Free
                            </Button>
                            <BookDemoButton topic="patent search" variant="link" size="lg" className="justify-center">
                                Book a Demo
                                <ArrowRight className="h-5 w-5" aria-hidden="true" />
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

function SearchMetric({ value, label }: { value: string; label: string }) {
    return (
        <div className="p-4 text-center">
            <p className="text-lg font-bold text-text-primary [font-family:var(--font-display)] sm:text-xl">
                {value}
            </p>
            <p className="mt-1 text-sm leading-tight tracking-[0.04em] text-text-secondary [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                {label}
            </p>
        </div>
    );
}

function SearchModeCard({ title, description }: IconItem) {
    return (
        <article className="group relative flex h-full min-h-[156px] overflow-hidden rounded-2xl border border-card-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/[0.05]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex items-start gap-3.5">
                <SubsectionNumber className="w-10 shrink-0 pt-0.5" />
                <div className="min-w-0">
                    <h3
                        className="text-[15px] font-semibold leading-snug text-text-primary transition-colors duration-300 group-hover:text-primary"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {title}
                    </h3>
                    <p
                        className="mt-1.5 text-[13px] leading-relaxed text-text-secondary"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        {description}
                    </p>
                </div>
            </div>
        </article>
    );
}

function FeatureCard({ title, description }: IconItem) {
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

/* One kind of filter: its name in small caps, then each filter as a facet
   token with the box a search sidebar ticks. On hover the token's box takes
   the tick and its edge turns indigo, the way a facet reads once applied. */
function FilterGroup({ label, items }: { label: string; items: readonly string[] }) {
    return (
        <div className="grid gap-2 sm:grid-cols-[11.5rem_minmax(0,1fr)] sm:items-baseline sm:gap-4">
            <dt className="text-base leading-none tracking-[0.04em] text-navy-light [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                {label}
            </dt>
            <dd>
                <ul aria-label={label} className="flex flex-wrap gap-2">
                    {items.map((item) => (
                        <li
                            key={item}
                            className="group inline-flex items-center gap-2 rounded-md border border-card-border bg-page-bg-alt/70 py-1 pr-2.5 pl-2 text-[13px] text-text-primary transition-colors duration-200 [font-family:var(--font-body)] hover:border-primary/35 hover:bg-white"
                        >
                            <span
                                aria-hidden="true"
                                className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-slate-300 bg-white text-white transition-colors duration-200 group-hover:border-primary group-hover:bg-primary"
                            >
                                <Check className="h-2.5 w-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" strokeWidth={3} />
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>
            </dd>
        </div>
    );
}

/* The four platform capabilities as numbered slips: the subsection number
   in the margin, the title and a line of description. On hover a slip takes
   registration marks at its corners, its number steps in, and its title is
   underlined as an amendment is. */
function PlatformCapList({ items }: { items: readonly IconItem[] }) {
    return (
        <ol className="flex flex-col gap-4">
            {items.map((item, i) => (
                <li key={item.title}>
                    <FadeIn delay={i * 0.06}>
                        <article className="hover-crop group grid grid-cols-[2.75rem_1fr] gap-x-3 rounded-xl border border-card-border bg-white px-5 py-4 shadow-sm transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md motion-reduce:hover:translate-y-0">
                            <SubsectionNumber size="sm" className="pt-1 transition-transform duration-300 group-hover:translate-x-1" />
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary [font-family:var(--font-display)]">
                                    <span className="hover-sweep">{item.title}</span>
                                </h3>
                                <p className="mt-1 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">{item.description}</p>
                            </div>
                        </article>
                    </FadeIn>
                </li>
            ))}
        </ol>
    );
}

/* Who the search is for: four cards, each with the reader's mark in a thin
   seal ring. On hover the card takes registration marks, the ring fills, and
   the title is underlined. */
function UseCaseCards({ items, className = '' }: { items: readonly (IconItem & { icon: LucideIcon })[]; className?: string }) {
    return (
        <ul className={`grid grid-cols-1 gap-5 md:grid-cols-2 ${className}`}>
            {items.map(({ icon: Icon, title, description }) => (
                <li key={title}>
                    <article className="hover-crop group flex h-full gap-4 rounded-xl border border-card-border bg-white p-5 shadow-sm transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md sm:p-6 motion-reduce:hover:translate-y-0">
                        <span
                            aria-hidden="true"
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 text-primary transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white"
                        >
                            <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                        </span>
                        <div className="min-w-0">
                            <h3 className="text-base font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary [font-family:var(--font-display)]">
                                <span className="hover-sweep">{title}</span>
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">{description}</p>
                        </div>
                    </article>
                </li>
            ))}
        </ul>
    );
}

/* Numbered items with the number hanging in the margin, set apart by space
   rather than rules. Numbers come from the section's subsection counter;
   plain drops them for short closing lists that are not a numbered set. */
function NumberedRuledList({ items, columns = 1, plain = false, className = '' }: { items: readonly IconItem[]; columns?: 1 | 2; plain?: boolean; className?: string }) {
    return (
        <ol className={`grid grid-cols-1 gap-x-12 ${columns === 2 ? 'md:grid-cols-2' : ''} ${className}`}>
            {items.map((item) => (
                <li key={item.title} className={`py-4 ${plain ? '' : 'grid grid-cols-[2.75rem_1fr] gap-x-3'}`}>
                    {!plain && <SubsectionNumber size="sm" className="pt-1" />}
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold text-text-primary [font-family:var(--font-display)]">{item.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">{item.description}</p>
                    </div>
                </li>
            ))}
        </ol>
    );
}

function AccessPlanCard({
    title,
    subtitle,
    features,
    cta,
    variant,
}: {
    title: string;
    subtitle: string;
    features: readonly string[];
    cta: string;
    variant: 'quiet' | 'recommended';
}) {
    const recommended = variant === 'recommended';

    return (
        <div
            className={`relative flex h-full flex-col border-t-2 border-t-text-primary p-7 ${
                recommended ? 'bg-primary/[0.03]' : 'bg-card-bg'
            }`}
        >
            {recommended && (
                <span className="relative mb-4 text-base leading-none tracking-[0.04em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps] text-primary">
                    Recommended for IP and R&D teams
                </span>
            )}
            <h3 className="relative text-xl font-bold text-text-primary [font-family:var(--font-display)]">
                {title}
            </h3>
            <p className="relative mt-2 text-sm italic text-navy-light [font-family:var(--font-body)]">
                {subtitle}
            </p>
            {/* Ruled rows, like the pricing schedule: no tick icons. */}
            <ul className="relative mt-6 border-t border-card-border">
                {features.map((feature) => (
                    <li
                        key={feature}
                        className="border-b border-card-border py-2.5 text-sm text-text-primary [font-family:var(--font-body)]"
                    >
                        {feature}
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
