import type { Metadata } from 'next';
import Link from 'next/link';
import {
    Check,
    Minus,
    ArrowRight,
    ArrowDown,
} from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { HeroAmbience } from '@/components/ui/HeroAmbience';
import { FadeIn } from '@/components/motion/FadeIn';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { CompareJsonLd } from '@/components/seo/CompareJsonLd';
import { PATENT_SEARCH_PAGE_URL } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';
import { SectionMark } from '@/components/ui/SectionMark';
import { SubsectionNumber } from '@/components/ui/SubsectionNumber';
import { FigureCaption } from '@/components/ui/FigureCaption';
import { CompareStackSvg } from '@/components/illustrations/CompareStackSvg';

export const metadata: Metadata = buildMetadata({
    title: 'Design Your Invention vs Legacy IPMS',
    description:
        'How Design Your Invention compares to legacy IP management software. One platform for multi-jurisdiction patent docketing, prior art search, AI-assisted drafting, office action analysis and response, and chemistry enrichment, built for pharma companies and IP boutique law firms.',
    path: '/compare/',
    ogKey: 'compare',
});

/* ── Data ── */

/* The four tools of the usual stack, shown on phones in place of FIG. 1. */
const STACK_TOOLS = ['Docketing', 'Prior-art search', 'Drafting', 'Spreadsheets'] as const;

interface CompareRow {
    capability: string;
    /** The page that shows the capability in detail. */
    href: string;
    legacy: string;
    legacyIncluded: boolean;
    /** The compliance row, marked in amber. */
    accent?: boolean;
    dyi: string;
}

/* Comparison is against the common fragmented stack (a docketing tool plus
 * separate search, separate drafting, and spreadsheets), not a single named
 * vendor. Claims describe DYI's own capabilities; the legacy column describes
 * the typical multi-tool reality without asserting specifics about any one
 * competitor. Factual, no disparagement. */
const COMPARE_ROWS: CompareRow[] = [
    {
        capability: 'Multi-jurisdiction docketing',
        href: '/docketing/',
        legacy: 'A core strength: mature docketing, often with annuity payment services and established integrations',
        legacyIncluded: true,
        dyi: 'US, PCT, EU, JP, CN, and IN docketing with provisional, PCT, and national-phase case linkage in a visual family tree',
    },
    {
        capability: 'Prior art search',
        href: '/patent-search/',
        legacy: 'Usually a separate search subscription or Espacenet, with results copied back into the docket by hand',
        legacyIncluded: false,
        dyi: 'Built in, querying the EPO global database across 100+ patent authorities without leaving the family view',
    },
    {
        capability: 'Novelty search',
        href: '/patent-search/#novelty-search',
        legacy: 'A separate search vendor or a manual search, with findings summarized by hand',
        legacyIncluded: false,
        dyi: 'Automated from the invention brief: references ranked and read feature by feature, each finding backed by a quoted passage',
    },
    {
        capability: 'AI-assisted patent drafting',
        href: '/ai-patent-drafting/',
        legacy: 'Drafting happens in Word or a separate drafting tool, outside the docket',
        legacyIncluded: false,
        dyi: 'First-draft generation for attorney review across US, EP, IN, and PCT (WO), with a mandatory review workflow',
    },
    {
        capability: 'Office action analysis and response',
        href: '/office-actions/',
        legacy: 'Usually worked in Word documents and email, outside the docket',
        legacyIncluded: false,
        dyi: 'USPTO rejections mapped to claims with source-checked quotes, and responses built on the signed analysis for approval by an attorney who did not last revise them',
    },
    {
        capability: 'Drug and chemistry enrichment',
        href: '/patent-search/',
        legacy: 'Handled in dedicated chemistry databases or spreadsheets, kept apart from the patent record',
        legacyIncluded: false,
        dyi: 'Chemistry-aware enrichment for pharma IP workflows: compounds disclosed in a patent shown as 2D structures with InChIKey and SMILES, linked ClinicalTrials.gov trials, and a Loss of Exclusivity timeline per drug product',
    },
    {
        capability: 'Part 11-aligned architecture',
        href: '/#compliance',
        legacy: 'Audit trails are common; Part 11-aligned controls such as reason-for-change and e-signature vary by product and configuration',
        legacyIncluded: false,
        accent: true,
        dyi: 'Audit-first design following FDA 21 CFR Part 11 patterns: reason-for-change, append-only audit trail, e-signature re-authentication',
    },
    {
        capability: 'Multi-tenant data isolation',
        href: '/#security',
        legacy: 'Often single-tenant hosting or on-premises installs, depending on the vendor deployment model',
        legacyIncluded: false,
        dyi: "Each organization's data kept separate at the database level, enforced by PostgreSQL Row-Level Security",
    },
];

const PAGE_FAQ: FaqItem[] = [
    {
        question: 'What are the alternatives to legacy IPMS tools like Clarivate, Anaqua, or AppColl for pharma IP?',
        answer:
            'Teams evaluating alternatives to established IP management platforms typically want fewer disconnected tools. Design Your Invention is a modern option built for pharma companies and IP boutique law firms that unifies multi-jurisdiction patent docketing, prior art search, AI-assisted drafting, office action analysis and response, and chemistry enrichment in one connected, audit-trailed platform, rather than stitching a docketing tool together with separate search and drafting subscriptions.',
    },
    {
        question: 'How is Design Your Invention different from legacy IP management software?',
        answer:
            'The main difference is consolidation. Many IP teams run a docketing system, a separate prior art search tool, a drafting tool, and spreadsheets for chemistry and fees. Design Your Invention brings docketing, prior art search across 100+ patent authorities, AI-assisted drafting for US, EP, IN, and PCT, USPTO office action analysis and response, and chemistry enrichment into one connected, audit-trailed platform with a Part 11-aligned architecture and tenant-scoped data isolation.',
    },
    {
        question: 'Does the platform replace a separate prior art search tool?',
        answer:
            'For most prior art work, yes. The platform queries the EPO global patent database covering 100+ patent authorities directly inside the patent family view, with keyword, inventor, applicant, and patent-number search modes. Results save to the family with relevance scoring and attorney notes, creating an auditable prior art record without a second subscription.',
    },
    {
        question: 'Is the platform a good fit for IP boutique law firms?',
        answer:
            'Yes. IP boutique law firms are one of the two core audiences, alongside pharma companies. The platform is built for small and mid-sized IP teams that need multi-jurisdiction docketing, deadline and fee tracking, prior art search, and a defensible audit trail without the cost and complexity of the largest enterprise suites.',
    },
    {
        question: 'Does the platform include AI patent drafting that legacy tools usually lack?',
        answer:
            'Yes. AI-assisted drafting is built in and generates a first draft for attorney review across US, EP, IN, and PCT (WO), each with jurisdiction-specific drafting rules, with JP and CN planned. Every draft carries a mandatory disclaimer and a draft to in-review to approved workflow, so no AI-generated content can be exported or filed without human sign-off. It is a starting point for attorneys, not filing-ready output.',
    },
    {
        question: 'Does the platform handle office action responses?',
        answer:
            'Yes, for USPTO office actions. The platform maps each rejection to the affected claims and the cited passages, with every quotation matched to the source text, and an attorney signs the analysis. The response is built on that signed analysis with a strategy per issue, a claim listing, and support links to the application as filed, then approved by an attorney who did not last revise it and exported to Word for filing. Legacy setups usually handle this work in Word and email, outside the docket. Other jurisdictions are planned, starting with EP.',
    },
    {
        question: 'How do we move an existing portfolio over from our current tools?',
        answer:
            'With the portfolio import tool. Download the template or use your own spreadsheet, in XLSX or CSV, with up to 5,000 filings per file. Every row is validated before import, and the preview shows the new families, provisionals, PCTs, and national entries, with duplicates and errors flagged automatically. Records are created in one atomic transaction, every import is logged in the audit trail, and the import rolls back safely if validation fails.',
    },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function ComparePage() {
    return (
        <main id="main-content" className="min-w-0 overflow-x-hidden">
            {/* ── 1. Hero ── */}
            <section className="relative overflow-hidden bg-page-bg-alt pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">
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
                            <li className="font-medium text-text-primary">Compare</li>
                        </ol>
                    </nav>

                    <div className="lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:items-center lg:gap-8 xl:gap-12">
                    <div className="max-w-3xl">
                        <SectionMark numbered={false}>vs legacy IP management systems</SectionMark>
                        <h1
                            className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-[3.5rem]"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            One IP Platform Instead of{' '}
                            <span className="accent-amend text-primary">Four Disconnected Tools</span>
                        </h1>
                        <p className="mt-5 max-w-[40rem] text-base leading-relaxed text-text-secondary [font-family:var(--font-body)] sm:mt-6 sm:text-lg">
                            Most IP teams run a docketing system, a separate prior art search tool, a
                            drafting tool, and spreadsheets for chemistry and fees. Design Your Invention
                            brings that work into one IP management platform for pharma companies and IP
                            boutique law firms, built on an audit-first, Part 11-aligned architecture.
                        </p>

                        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                            <BookDemoButton size="lg" topic="a comparison with our current IP management tools" className="justify-center">
                                Book a Demo
                            </BookDemoButton>
                            <Button href={PATENT_SEARCH_PAGE_URL} variant="link" size="lg" className="justify-center">
                                Explore Patent Search
                                <ArrowRight className="h-5 w-5" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>

                    {/* FIG. 1: the four tools of the usual stack converging on
                        one family record. The drawing shows from md up; phones
                        get the same figure as ruled text, so it stays readable.
                        Only one of the two is displayed, so the figure counter
                        counts it once. */}
                    <figure className="figure-group mx-auto mt-10 hidden w-full max-w-[560px] md:block lg:mx-0 lg:mt-0 lg:ml-auto">
                        <CompareStackSvg className="h-auto w-full" />
                        <figcaption>
                            <FigureCaption className="mt-4">The usual stack, and one record</FigureCaption>
                        </figcaption>
                    </figure>
                    <figure className="figure-group mt-10 md:hidden">
                        <div aria-hidden="true" className="rounded-2xl border border-card-border bg-card-bg px-5 py-4 shadow-sm">
                            <p className="text-sm leading-none tracking-[0.04em] text-navy-light [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                                The usual stack
                            </p>
                            <ul className="mt-3 border-t border-card-border">
                                {STACK_TOOLS.map((tool) => (
                                    <li key={tool} className="border-b border-dashed border-card-border py-2.5 text-sm text-text-secondary [font-family:var(--font-body)]">
                                        {tool}
                                    </li>
                                ))}
                            </ul>
                            <ArrowDown className="mx-auto my-3 h-4 w-4 text-primary" />
                            <p className="rounded-lg border border-primary/40 bg-primary/[0.04] px-4 py-3 text-sm text-text-primary [font-family:var(--font-body)]">
                                <span className="tracking-[0.04em] text-primary [font-variant-caps:all-small-caps]">One record</span>
                                <span className="ml-2 font-semibold [font-family:var(--font-mono)]">DEMO-2024-011</span>
                            </p>
                        </div>
                        <figcaption>
                            <FigureCaption className="mt-4">The usual stack, and one record</FigureCaption>
                        </figcaption>
                    </figure>
                    </div>
                </Container>
            </section>

            {/* ── 2. Comparison table ── */}
            {/* Paired with the hero's edge="bottom" ambience: this section's
                edge="top" quarter-circles complete the half-circles across the
                boundary, and the shared bg-page-bg-alt removes the seam. */}
            <section className="relative overflow-hidden bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <HeroAmbience edge="top" />
                <Container className="relative z-10">
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark>Capability by capability</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                What a Modern IPMS Includes by Default
                            </h2>
                            <p className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                Legacy IP management systems (IPMS) are strong at docketing but usually stop there.
                                The capabilities below are the ones pharma and boutique IP teams most often
                                bolt on with extra tools, and the ones Design Your Invention includes in one
                                platform.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.05}>
                        {/* Phones: one ruled block per capability, so the
                            Design Your Invention answer is never off-screen.
                            Only one of the two layouts is displayed, so the
                            subsection counter counts each row once. */}
                        <ol className="mt-10 rounded-2xl border border-card-border bg-card-bg px-5 shadow-sm md:hidden">
                            {COMPARE_ROWS.map((row) => (
                                <CompareBlock key={row.capability} row={row} />
                            ))}
                        </ol>

                        <div className="mt-10 hidden overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm ring-1 ring-white/70 md:block lg:mt-12">
                            <table className="w-full min-w-180 border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-card-border bg-white/60">
                                        <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-text-secondary [font-family:var(--font-mono)]">
                                            Capability
                                        </th>
                                        <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-text-secondary [font-family:var(--font-mono)]">
                                            Typical legacy setup
                                        </th>
                                        <th scope="col" className="border-t-2 border-t-primary bg-primary/[0.03] px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-primary [font-family:var(--font-mono)]">
                                            Design Your Invention
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARE_ROWS.map((row) => (
                                        <CompareTableRow key={row.capability} row={row} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p className="mt-6 max-w-[40rem] text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                            <span className="font-semibold text-compliance-ink">Amber</span> marks the Part 11
                            compliance row. Each capability links to the page that shows it in detail.
                        </p>
                        <p className="mt-3 max-w-[40rem] text-sm italic leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                            Legacy IP management products vary widely by vendor and product generation. This
                            comparison describes the common multi-tool setup, not any single named platform.
                            Pricing is not published; contact us for current pricing.
                        </p>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 3. FAQ ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
                            <h2
                                className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Comparison Questions
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                How Design Your Invention fits next to the IP management tools teams already know.
                            </p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <FaqAccordion items={PAGE_FAQ} />
                    </FadeIn>
                </Container>
            </section>

            {/* ── 4. Final CTA ── */}
            <section className="py-16 sm:py-20 lg:py-24">
                <Container>
                    <div className="mx-auto max-w-2xl text-center">
                        <h2
                            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            See the Whole Stack in One Platform
                        </h2>
                        <p
                            className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Book a walkthrough to see docketing, prior art search, AI-assisted drafting, office
                            action response, and chemistry enrichment working together on a sample portfolio.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            <BookDemoButton size="lg" topic="a comparison with our current IP management tools" className="w-full justify-center sm:w-auto">
                                Book a Demo
                            </BookDemoButton>
                            <Button href="/docketing/" variant="link" size="lg" className="justify-center">
                                View Patent Docketing
                                <ArrowRight className="h-5 w-5" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>

            <CompareJsonLd faq={PAGE_FAQ} />
        </main>
    );
}

/* ── Helpers ── */

/* The capability name links to the page that proves it, in the house link
   style: underlined, never a second button. */
function CapabilityLink({ row }: { row: CompareRow }) {
    return (
        <Link
            href={row.href}
            className="text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
        >
            {row.capability}
        </Link>
    );
}

/* One neutral check for both columns, so the legacy column's tick does not
   outshine the product's. A dash marks "not included". */
function Included({ yes }: { yes: boolean }) {
    return yes ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" aria-label="Included" />
    ) : (
        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" aria-label="Not included" />
    );
}

function CompareTableRow({ row }: { row: CompareRow }) {
    return (
        <tr className="group border-b border-card-border/60 transition-colors duration-200 last:border-b-0 hover:bg-white">
            <th scope="row" className="px-5 py-4 text-left text-sm font-semibold text-text-primary [font-family:var(--font-body)]">
                <span className="flex items-baseline gap-3">
                    <SubsectionNumber size="sm" tone={row.accent ? 'compliance' : 'primary'} className="w-8 shrink-0" />
                    <CapabilityLink row={row} />
                </span>
            </th>
            <td className="px-5 py-4 text-sm text-text-secondary [font-family:var(--font-body)]">
                <span className="flex items-start gap-2">
                    <Included yes={row.legacyIncluded} />
                    {row.legacy}
                </span>
            </td>
            <td className="bg-primary/[0.03] px-5 py-4 text-sm text-text-primary [font-family:var(--font-body)]">
                <span className="flex items-start gap-2">
                    <Included yes />
                    {row.dyi}
                </span>
            </td>
        </tr>
    );
}

function CompareBlock({ row }: { row: CompareRow }) {
    return (
        <li className="border-t border-card-border py-5 first:border-t-0">
            <h3 className="flex items-baseline gap-3 text-base font-semibold text-text-primary [font-family:var(--font-body)]">
                <SubsectionNumber size="sm" tone={row.accent ? 'compliance' : 'primary'} className="w-8 shrink-0" />
                <CapabilityLink row={row} />
            </h3>
            <p className="mt-3 pl-11 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                <span className="font-semibold">Typical legacy setup:</span> {row.legacy}
            </p>
            <p className="mt-2 pl-11 text-sm leading-relaxed text-text-primary [font-family:var(--font-body)]">
                <span className="font-semibold text-primary">Design Your Invention:</span> {row.dyi}
            </p>
        </li>
    );
}
