import type { Metadata } from 'next';
import Link from 'next/link';
import {
    Check,
    Minus,
    Globe,
    Search,
    PenLine,
    FlaskConical,
    ShieldCheck,
    Building2,
    ArrowRight,
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

export const metadata: Metadata = buildMetadata({
    title: 'Design Your Invention vs Legacy IPMS',
    description:
        'How Design Your Invention compares to legacy IP management software. One platform for multi-jurisdiction patent docketing, prior art search, AI-assisted drafting, and chemistry enrichment, built for pharma companies and IP boutique law firms.',
    path: '/compare/',
    ogKey: 'compare',
});

/* ── Data ── */

interface CompareRow {
    icon: React.ElementType;
    capability: string;
    legacy: string;
    legacyIncluded: boolean;
    dyi: string;
}

/* Comparison is against the common fragmented stack (a docketing tool plus
 * separate search, separate drafting, and spreadsheets), not a single named
 * vendor. Claims describe DYI's own capabilities; the legacy column describes
 * the typical multi-tool reality without asserting specifics about any one
 * competitor. Factual, no disparagement. */
const COMPARE_ROWS: CompareRow[] = [
    {
        icon: Globe,
        capability: 'Multi-jurisdiction docketing',
        legacy: 'Core strength of most legacy IPMS tools',
        legacyIncluded: true,
        dyi: 'US, PCT, EU, JP, CN, and IN docketing with PCT/PRV/NPE case linkage in a visual family tree',
    },
    {
        icon: Search,
        capability: 'Prior art search',
        legacy: 'Commonly a separate subscription or manual EPO/Espacenet searches',
        legacyIncluded: false,
        dyi: 'Built in, querying the EPO global database across 100+ patent authorities without leaving the family view',
    },
    {
        icon: PenLine,
        capability: 'AI-assisted patent drafting',
        legacy: 'Typically not part of a docketing platform',
        legacyIncluded: false,
        dyi: 'First-draft generation for attorney review across US, EP, IN, and PCT (WO), with a mandatory review workflow',
    },
    {
        icon: FlaskConical,
        capability: 'Drug and chemistry enrichment',
        legacy: 'Rarely addressed; handled in separate tools or spreadsheets',
        legacyIncluded: false,
        dyi: 'Chemistry-aware enrichment aimed at pharma IP workflows',
    },
    {
        icon: ShieldCheck,
        capability: 'Part 11-aligned architecture',
        legacy: 'Varies widely by vendor and product age',
        legacyIncluded: false,
        dyi: 'Audit-first design following FDA 21 CFR Part 11 patterns: reason-for-change, append-only audit trail, e-signature re-authentication',
    },
    {
        icon: Building2,
        capability: 'Multi-tenant data isolation',
        legacy: 'Depends on deployment model',
        legacyIncluded: false,
        dyi: 'Per-tenant isolation enforced at the database level with PostgreSQL Row-Level Security',
    },
];

const PAGE_FAQ: FaqItem[] = [
    {
        question: 'What are the alternatives to legacy IPMS tools like Clarivate, Anaqua, or AppColl for pharma IP?',
        answer:
            'Teams evaluating alternatives to established IP management platforms typically want fewer disconnected tools. Design Your Invention is a modern option built for pharma companies and IP boutique law firms that unifies multi-jurisdiction patent docketing, prior art search, AI-assisted drafting, and chemistry enrichment in one connected, audit-trailed platform, rather than stitching a docketing tool together with separate search and drafting subscriptions.',
    },
    {
        question: 'How is Design Your Invention different from legacy IP management software?',
        answer:
            'The main difference is consolidation. Many IP teams run a docketing system, a separate prior art search tool, a drafting tool, and spreadsheets for chemistry and fees. Design Your Invention brings docketing, prior art search across 100+ patent authorities, AI-assisted drafting for US, EP, IN, and PCT, and chemistry enrichment into one connected, audit-trailed platform with a Part 11-aligned architecture and tenant-scoped data isolation.',
    },
    {
        question: 'Does Design Your Invention replace a separate prior art search tool?',
        answer:
            'For most prior art work, yes. The platform queries the EPO global patent database covering 100+ patent authorities directly inside the patent family view, with keyword, inventor, applicant, and patent-number search modes. Results save to the family with relevance scoring and attorney notes, creating an auditable prior art record without a second subscription.',
    },
    {
        question: 'Is Design Your Invention a good fit for IP boutique law firms?',
        answer:
            'Yes. IP boutique law firms are one of the two core audiences, alongside pharma companies. The platform is built for small and mid-sized IP teams that need multi-jurisdiction docketing, deadline and fee tracking, prior art search, and a defensible audit trail without the cost and complexity of the largest enterprise suites.',
    },
    {
        question: 'Does Design Your Invention include AI patent drafting that legacy tools usually lack?',
        answer:
            'Yes. AI-assisted drafting is built in and generates a first draft for attorney review across US, EP, IN, and PCT (WO), each with jurisdiction-specific drafting rules, with JP and CN planned. Every draft carries a mandatory disclaimer and a draft to in-review to approved workflow, so no AI-generated content can be exported or filed without human sign-off. It is a starting point for attorneys, not filing-ready output.',
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

                    <div className="max-w-3xl">
                        <span
                            className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            Design Your Invention vs Legacy IPMS
                        </span>
                        <h1
                            className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-[3.5rem]"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            One IP Platform Instead of{' '}
                            <span className="text-primary italic">Four Disconnected Tools</span>
                        </h1>
                        <p
                            className="mt-5 text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Most IP teams run a docketing system, a separate prior art search tool, a
                            drafting tool, and spreadsheets for chemistry and fees. Design Your Invention
                            is an intellectual property management software (IPMS) platform that unifies
                            all of it for pharma companies and IP boutique law firms, on an audit-first,
                            Part 11-aligned architecture.
                        </p>

                        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                            <BookDemoButton size="lg" className="justify-center">
                                Book a Demo
                                <ArrowRight className="h-5 w-5" />
                            </BookDemoButton>
                            <Button href={PATENT_SEARCH_PAGE_URL} variant="secondary" size="lg" className="justify-center">
                                Explore Patent Search
                            </Button>
                        </div>
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
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Capability by capability
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                What a Modern IPMS Includes by Default
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Legacy IP management software is strong at docketing but usually stops there.
                                The capabilities below are the ones pharma and boutique IP teams most often
                                bolt on with extra tools, and the ones Design Your Invention includes in one
                                platform.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.05}>
                        <div className="mt-10 overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm ring-1 ring-white/70 lg:mt-12">
                            <table className="w-full min-w-180 border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-card-border bg-white/60">
                                        {['Capability', 'Typical legacy setup', 'Design Your Invention'].map((h) => (
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
                                    {COMPARE_ROWS.map((row) => (
                                        <CompareTableRow key={row.capability} row={row} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <p
                            className="mt-6 max-w-3xl text-sm italic leading-relaxed text-text-muted"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
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
                            Book a walkthrough to see docketing, prior art search, AI-assisted drafting, and
                            chemistry enrichment working together on a sample portfolio.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            <BookDemoButton size="lg" className="w-full justify-center sm:w-auto">
                                Book a Demo
                                <ArrowRight className="h-5 w-5" />
                            </BookDemoButton>
                            <Button href="/docketing/" variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
                                View Patent Docketing
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

function CompareTableRow({ row }: { row: CompareRow }) {
    const Icon = row.icon;

    return (
        <tr className="group border-b border-card-border/60 transition-colors duration-200 last:border-b-0 hover:bg-white">
            <td
                className="px-5 py-4 text-sm font-semibold text-text-primary"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                <span className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40">
                        <Icon className="h-4 w-4 text-primary" />
                    </span>
                    {row.capability}
                </span>
            </td>
            <td
                className="px-5 py-4 text-sm text-text-secondary"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                <span className="flex items-start gap-2">
                    {row.legacyIncluded ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                    ) : (
                        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                    )}
                    {row.legacy}
                </span>
            </td>
            <td
                className="px-5 py-4 text-sm text-text-secondary"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                <span className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {row.dyi}
                </span>
            </td>
        </tr>
    );
}
