import type { Metadata } from 'next';
import Link from 'next/link';
import {
    Search,
    BookmarkCheck,
    Sparkles,
    FolderPlus,
    PenLine,
    UserCheck,
    FileCheck,
    GitBranch,
    History,
    RotateCcw,
    GitCompare,
    ListTree,
    RefreshCw,
    Lock,
    ShieldCheck,
    Database,
    KeyRound,
    ScrollText,
    Gauge,
    FileText,
    Check,
    Minus,
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
import { AnimatedClaimsWorkflow } from '@/components/ui/AnimatedClaimsWorkflow';
import { AiDraftingHeroSvg } from '@/components/illustrations/AiDraftingHeroSvg';
import { AiDraftingJsonLd } from '@/components/seo/AiDraftingJsonLd';
import { PATENT_SEARCH_PAGE_URL } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

export const metadata: Metadata = buildMetadata({
    title: 'AI Patent Drafting Software With Attorney Review',
    description:
        'Attorney-in-the-loop AI patent drafting: turn saved prior art into structured draft claims, abstract, and novelty analysis for attorney review across US, EP, IN, and PCT.',
    path: '/ai-patent-drafting/',
});

/* ── Data ── */

interface IconItem {
    icon: React.ElementType;
    title: string;
    description: string;
}

/* Capability language rather than pinned model versions. Providers and
   versions change with task, availability, and customer requirements, and
   exact model identifiers belong in the security questionnaire and release
   notes, not in marketing copy that goes stale. */
const GENERATION_MODEL = 'an enterprise Claude model';
const REVIEW_MODEL = 'a separate, independent reviewer model';

const POWERED_BY = [
    'Enterprise AI providers (generation)',
    'Independent second-model review',
    'EPO Open Patent Services',
    'PostgreSQL RLS',
    'Append-only audit',
];

const CAPABILITIES: IconItem[] = [
    {
        icon: Search,
        title: 'Prior Art Search',
        description: 'Worldwide patent search via EPO Open Patent Services, covering 100+ jurisdictions through INPADOC.',
    },
    {
        icon: BookmarkCheck,
        title: 'Prior Art Management',
        description: 'Save, annotate, paste claim text, and track the relevance of references per patent family.',
    },
    {
        icon: Sparkles,
        title: 'AI Draft Generation',
        description: `Feed invention details and saved prior art to ${GENERATION_MODEL} to generate jurisdiction-specific claims, abstract, description, and novelty analysis, asynchronously.`,
    },
];

const WORKFLOW: { icon: React.ElementType; label: string }[] = [
    { icon: FolderPlus, label: 'Create family' },
    { icon: Search, label: 'Research prior art' },
    { icon: PenLine, label: 'Draft claims' },
    { icon: UserCheck, label: 'Attorney review' },
    { icon: FileCheck, label: 'File' },
];

interface Jurisdiction {
    code: string;
    color: string;
    authority: string;
    rules: string;
}

const JURISDICTIONS: Jurisdiction[] = [
    {
        code: 'US',
        color: '#dc2626',
        authority: 'USPTO',
        rules: '35 USC 101 / 112 and obviousness-type double patenting addressed, with the full US section structure (Field, Background, Summary, Brief Description of Drawings, Detailed Description).',
    },
    {
        code: 'EP',
        color: '#6366f1',
        authority: 'EPO',
        rules: 'EPC Article 84 clarity, conciseness, and support, plus the EPC 2000 "compound for use" claim format.',
    },
    {
        code: 'IN',
        color: '#d97706',
        authority: 'Indian Patent Office',
        rules: 'Section 3(d) enhanced-efficacy considerations flagged for attorney review on pharma claims, the single most important rule for Indian pharma patents.',
    },
    {
        code: 'WO',
        color: '#0ea5e9',
        authority: 'WIPO (PCT)',
        rules: 'Jurisdiction-neutral claims compatible with USPTO and EPO conventions, with national-phase amendments flagged for entry.',
    },
];

const COVERAGE_ROWS: { label: string; us: string; in: string; ep: string; pct: string }[] = [
    {
        label: 'Bibliographic data (title, abstract, applicants, IPC/CPC, dates, family)',
        us: 'yes',
        in: 'yes',
        ep: 'yes',
        pct: 'yes',
    },
    {
        label: 'Full-text claims',
        us: 'Paste',
        in: 'Paste',
        ep: 'EPO',
        pct: 'EPO',
    },
];

const VERSIONING: IconItem[] = [
    {
        icon: RefreshCw,
        title: 'Per-unit regeneration',
        description: 'Refine claim 3 without burning tokens regenerating claims 1, 2, and 4 through N. Each claim and section is its own record.',
    },
    {
        icon: Sparkles,
        title: 'Interactive refinement',
        description: 'Natural-language instructions ("broaden claim 2 to cover oral and IV administration") produce a new revision of one unit, not a full rewrite.',
    },
    {
        icon: PenLine,
        title: 'Manual edits, never blocked',
        description: 'Attorney edits are revisioned identically to AI edits, distinguished only by a source field.',
    },
    {
        icon: RotateCcw,
        title: 'Restore as a new revision',
        description: 'Restoring an earlier revision creates a new revision, never a deletion. History only grows.',
    },
    {
        icon: ListTree,
        title: 'Cascade staleness',
        description: 'Editing claim 2 marks dependent claims, novelty analysis, and description sections stale. You decide what to regenerate, the system never does it for you.',
    },
    {
        icon: GitCompare,
        title: 'Diff and tree edits',
        description: 'Side-by-side comparison between any two revisions of any unit, plus reorder, reparent, split, and merge of claims.',
    },
];

const CONFIDENCE: IconItem[] = [
    {
        icon: Gauge,
        title: 'Three honest bands',
        description: 'High, medium, or low per unit, describing how well the generated text is supported by the prior art on record, not a probability and not a legal opinion. The reviewer defaults to medium when uncertain; high must be affirmatively justified.',
    },
    {
        icon: ScrollText,
        title: 'Evidence-grounded',
        description: 'Every rating cites a specific claim number, quoted phrase, or publication number from the prior-art snapshot. No vague hand-waving.',
    },
    {
        icon: History,
        title: 'Progressive reveal',
        description: 'The draft is readable the instant generation completes; scores backfill seconds later while you read. No single long spinner.',
    },
    {
        icon: ShieldCheck,
        title: 'Prioritization, not a determination',
        description: 'Bands rank where attorney attention is most useful, and do not assess patentability, novelty, or filing readiness. They do not block export or approval, and are not shown to the end client.',
    },
];

const SECURITY: IconItem[] = [
    {
        icon: Lock,
        title: 'Tenant isolation',
        description: 'Each customer workspace is separated at the application and data layers. Tenant identity is verified before any drafting record, prior-art source, or portfolio item can be accessed.',
    },
    {
        icon: Database,
        title: 'Append-only audit',
        description: 'Draft revisions, source references, and prior-art snapshots are preserved as append-only evidence, creating a review history that can be inspected later without being rewritten.',
    },
    {
        icon: KeyRound,
        title: 'AI-specific controls',
        description: 'Model access, prompt handling, and spending limits are governed per tenant. Generation and saving are controlled separately, with retention-limited provider settings and no personal data by default. Current provider retention terms are shared as part of security review.',
    },
];

const SECURITY_GUARDS: { icon: React.ElementType; label: string; text: string }[] = [
    {
        icon: ShieldCheck,
        label: 'Enterprise review',
        text: 'Controls designed for procurement, security questionnaires, and regulated IP teams.',
    },
    {
        icon: ScrollText,
        label: 'Evidence retained',
        text: 'Every generated draft remains tied to the prior-art snapshot and review trail behind it.',
    },
    {
        icon: FileCheck,
        label: 'Part 11-aligned patterns',
        text: 'Audit and change-control patterns follow 21 CFR Part 11 expectations. Validation stays with the customer.',
    },
];

interface RbacRow {
    action: string;
    admin: boolean;
    attorney: boolean;
    paralegal: boolean;
    readOnly: boolean;
}

const RBAC_ROWS: RbacRow[] = [
    { action: 'Search patents (EPO)', admin: true, attorney: true, paralegal: true, readOnly: true },
    { action: 'Save / paste prior art', admin: true, attorney: true, paralegal: true, readOnly: false },
    { action: 'Fill invention details', admin: true, attorney: true, paralegal: true, readOnly: false },
    { action: 'Generate / refine AI draft', admin: true, attorney: true, paralegal: false, readOnly: false },
    { action: 'Manual edit / restore / tree edit', admin: true, attorney: true, paralegal: false, readOnly: false },
    { action: 'Approve / reject draft', admin: true, attorney: true, paralegal: false, readOnly: false },
    { action: 'View drafts + history + scores', admin: true, attorney: true, paralegal: true, readOnly: true },
    { action: 'Export to DOCX', admin: true, attorney: true, paralegal: true, readOnly: false },
];

const PAGE_FAQ: FaqItem[] = [
    {
        question: 'Does the AI file patents or replace attorneys?',
        answer:
            'No. This is a professional tool for attorneys: the attorney is the author and the AI is the assistant. Every generated draft starts in DRAFT status and requires attorney review before any filing. The UI and the DOCX export carry the disclaimer "AI-generated content. Not legal advice."',
    },
    {
        question: 'Which jurisdictions are supported?',
        answer:
            'US, EP, IN, and PCT (WO) are the production set, each with jurisdiction-specific claim format, drafting rules, and mandatory section structure applied. A missing required section is flagged rather than silently omitted. JP and CN are planned and are not available yet.',
    },
    {
        question: 'How does prior art work for US and Indian patents without a claims API?',
        answer:
            'Bibliographic data is retrieved for all jurisdictions via EPO OPS. EP and PCT patents also return full-text claims directly from EPO. US and Indian patents have no reliable public claims API today, so a claims-retrieval helper guides the attorney to paste claim text from the source (USPTO ODP or InPASS). Pasted claims are stored on the reference and fed to the AI for novelty analysis.',
    },
    {
        question: 'Is my data used to train the AI?',
        answer:
            'No. Tenant data is sent to the model provider only during generation, under an enterprise API agreement that does not permit training on customer content. Prompts contain only invention details and public prior art, and no personal data unless the attorney puts it there. The retention and processing terms in force, along with the current provider and processing regions, are shared as part of security review.',
    },
    {
        question: 'How is a draft defensible in an audit?',
        answer:
            'Every AI revision is generated against a frozen snapshot of the exact prior-art set used at that moment, and revision history is append-only at the database layer. So "what art did the AI see when it wrote claim 3?" is always answerable, even years later and even if the live reference was later deleted.',
    },
    {
        question: 'What models power it?',
        answer:
            'Generation runs on enterprise Claude models from Anthropic, configured for confidential business workflows, and a separate background review runs a second, independent model as a judge to band the claims, abstract, description, and novelty analysis as high, medium, or low support. Model selection is governed by task, availability, and customer requirements, so exact versions change over time and are confirmed during security review rather than pinned in marketing copy.',
    },
    {
        question: 'Can paralegals trigger AI generation?',
        answer:
            'No. The draft:generate permission (which costs tokens) is deliberately separated from draft:write. Paralegals can search, save prior art, fill invention details, view drafts, and export, but only attorneys and tenant admins can generate, refine, or approve.',
    },
    {
        question: 'Is it suitable for regulated and pharma teams?',
        answer:
            'Yes. The append-only audit trail, electronic records, and access controls follow 21 CFR Part 11 patterns, and the India Section 3(d) enhanced-efficacy requirement is flagged for attorney review on pharma claims. The structured, versioned record is built to stand up in enterprise procurement and regulatory review. Compliance and validation still depend on your intended use, configuration, procedures, and quality system.',
    },
    {
        question: 'Can I just use ChatGPT to write my patent application?',
        answer:
            'A general chatbot writes generic claims with no access to the prior art on record, no jurisdiction-specific statutory rules, no version history, and no audit trail. This assistant grounds every draft in the actual prior art saved to the family (including pasted claim text), applies US, EP, IN, and PCT rules and section structure, runs a second-model confidence review, and keeps an append-only audit trail with mandatory attorney review before filing. The attorney is the author; the AI is the assistant.',
    },
    {
        question: 'Can the AI spot claim-support issues or weaknesses before filing?',
        answer:
            'Yes. Generation produces a novelty analysis that flags potential overlaps with the prior art on record, and a separate, independent reviewer model reviews each claim, the abstract, the description, and the novelty analysis, banding each as high, medium, or low support with a cited rationale. You see the least-supported sections first. It assists the review; the attorney makes the call.',
    },
    {
        question: 'Can it draft patent applications for India?',
        answer:
            'Yes. India (IN) is in the production jurisdiction set. Drafts apply Indian Patent Office rules, including the Section 3(d) enhanced-efficacy requirement that is decisive for pharma claims, plus the mandatory section structure, with US, EP, and PCT supported alongside it. A missing required section is flagged rather than silently omitted.',
    },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function AiPatentDraftingPage() {
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
                            <li className="font-medium text-text-primary">AI Patent Drafting</li>
                        </ol>
                    </nav>

                    <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:gap-8 xl:gap-12">
                        <div className="relative z-10 max-w-3xl lg:max-w-[640px]">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                AI Patent Drafting
                            </span>
                            <h1
                                className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-[3.5rem]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                AI Patent Drafting With{' '}
                                <span className="text-primary italic">Attorney Review Built In</span>
                            </h1>
                            <p
                                className="mt-5 text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                An attorney-in-the-loop drafting assistant that turns invention details and
                                saved prior art into a structured first draft for attorney review: claims,
                                abstract, description, and novelty analysis, prepared for the drafting
                                conventions of the target jurisdiction. AI drafts are dramatically better
                                when they know the art on record.
                            </p>

                            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                                <BookDemoButton size="lg" className="justify-center">
                                    Book a Demo
                                    <ArrowRight className="h-5 w-5" />
                                </BookDemoButton>
                                <WatchDemoButton variant="secondary" size="lg" startTime={72} className="justify-center">
                                    <Play className="h-5 w-5 fill-current" />
                                    Watch Demo
                                </WatchDemoButton>
                            </div>
                        </div>

                        <div className="pointer-events-none hidden lg:flex lg:w-full lg:justify-end">
                            <AiDraftingHeroSvg />
                        </div>
                    </div>
                </Container>

                <Container className="relative z-10 mt-12 sm:mt-16">
                    <MockupHalo>
                        <AnimatedClaimsWorkflow />
                    </MockupHalo>
                </Container>

                {/* Powered by */}
                <Container className="relative z-10 mt-8 sm:mt-10">
                    <FadeIn delay={0.1}>
                        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-3">
                            <span
                                className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Powered by
                            </span>
                            <div className="flex flex-wrap justify-center gap-2">
                                {POWERED_BY.map((p, i) => (
                                    <PoweredByChip key={p} label={p} delay={i * 120} />
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 2. How it works ── */}
            <section className="relative overflow-hidden bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <HeroAmbience edge="top" />
                <Container className="relative z-10">
                    <FadeIn>
                        <div className="max-w-3xl">
                            <h2
                                className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Drafts That Know the Prior Art
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Without prior-art context, a model writes generic claims. With the
                                relevant references in front of it, including pasted claim text, it
                                drafts claims against the art on record, which the attorney then tests
                                for novelty. Drafting lives inside the patent family, because that is
                                how patent work flows.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Workflow */}
                    <FadeIn delay={0.05}>
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:mt-12">
                            {WORKFLOW.map((step, i) => (
                                <span key={step.label} className="flex items-center gap-2 sm:gap-3">
                                    {i > 0 && (
                                        <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-text-muted/50" />
                                    )}
                                    <WorkflowStep icon={step.icon} label={step.label} delay={i * 120} />
                                </span>
                            ))}
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-3">
                        {CAPABILITIES.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.08}>
                                <CapabilityCard {...item} />
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── 3. Jurisdiction-specific drafting ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Jurisdiction-aware
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Claims Written to the Rules That Apply
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                The drafting engine applies jurisdiction-specific claim format, statutory
                                rules, and mandatory section structure. US, EP, IN, and PCT are the
                                production set.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16">
                        {JURISDICTIONS.map((j, i) => (
                            <FadeIn key={j.code} delay={i * 0.06}>
                                <JurisdictionCard jurisdiction={j} />
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── 4. Prior art & references (honest coverage) ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Prior Art and References
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Real Coverage, Stated Plainly
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Search runs through EPO OPS, returning bibliographic data and family
                                links worldwide. Full-text claims coverage is exactly as honest as it
                                should be for a legal audience.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Coverage table */}
                    <FadeIn delay={0.05}>
                        <div className="mt-10 overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm ring-1 ring-white/70 lg:mt-12">
                            <table className="w-full min-w-125 border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-card-border bg-white/60">
                                        <th
                                            className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-text-muted"
                                            style={{ fontFamily: 'var(--font-mono)' }}
                                        >
                                            Data
                                        </th>
                                        {['US', 'IN', 'EP', 'PCT'].map((c) => (
                                            <th
                                                key={c}
                                                className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-text-muted"
                                                style={{ fontFamily: 'var(--font-mono)' }}
                                            >
                                                {c}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {COVERAGE_ROWS.map((row) => (
                                        <tr key={row.label} className="group border-b border-card-border/60 transition-colors duration-200 last:border-b-0 hover:bg-white">
                                            <td
                                                className="px-5 py-4 text-sm text-text-primary"
                                                style={{ fontFamily: 'var(--font-body)' }}
                                            >
                                                {row.label}
                                            </td>
                                            {[row.us, row.in, row.ep, row.pct].map((cell, i) => (
                                                <td key={i} className="px-4 py-4 text-center">
                                                    <CoverageCell value={cell} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/[0.03] p-5">
                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <p
                                className="text-sm leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                <span className="font-semibold text-text-primary">Provenance you can defend.</span>{' '}
                                Every AI revision is generated against a frozen, immutable snapshot of the
                                exact prior-art set used at that moment. What art the AI saw when it wrote
                                a given claim is always answerable, even years later and even if the live
                                reference was later deleted.
                            </p>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 5. Structured, versioned drafts ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Structured and versioned
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                A Draft Is a Record, Not a Blob of Text
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Every claim is its own record with a real dependency tree. Abstract,
                                novelty analysis, and each description section are their own units. Every
                                change to every unit is its own append-only revision, capturing who, when,
                                why, AI versus manual, and what art the AI saw.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3">
                        {VERSIONING.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.06}>
                                <CapabilityCard {...item} />
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn delay={0.1}>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-2xl border border-card-border bg-page-bg-alt p-5">
                                <GitBranch className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <p
                                    className="text-sm leading-relaxed text-text-secondary"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    <span className="font-semibold text-text-primary">Approval lock and branching.</span>{' '}
                                    An approved draft is hard-locked. To change it, you branch a new version
                                    that carries forward all content with full lineage. "Approved" stays a
                                    strong signal, and a draft cannot be approved while any unit is stale.
                                </p>
                            </div>
                            <div className="flex items-start gap-3 rounded-2xl border border-card-border bg-page-bg-alt p-5">
                                <ScrollText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <p
                                    className="text-sm leading-relaxed text-text-secondary"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    <span className="font-semibold text-text-primary">Mandatory reason-for-change.</span>{' '}
                                    Every revision carries a reason, system-filled for AI revisions,
                                    attorney-supplied for manual edits and restores. The field is never null.
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 6. Confidence scores ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Second-opinion review
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                A Separate Model Reviews the Draft
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                After {GENERATION_MODEL} generates the draft, a background review runs{' '}
                                {REVIEW_MODEL} as a judge over the claims, abstract, description, and
                                novelty analysis, banding how well each unit is supported by the prior
                                art on record so you can spend review time where it matters. The bands
                                guide attorney attention; they are not a legal determination.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.05}>
                        <div className="mt-8 flex flex-wrap gap-2.5">
                            <ConfidenceBadge level="high" />
                            <ConfidenceBadge level="medium" />
                            <ConfidenceBadge level="low" />
                        </div>
                    </FadeIn>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12">
                        {CONFIDENCE.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.06}>
                                <CapabilityCard {...item} />
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── 7. Security & compliance (dark moat) ── */}
            <section className="relative overflow-hidden bg-navy py-20 sm:py-24 lg:py-28">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-primary/15 to-transparent"
                />
                <Container className="relative z-10">
                    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
                        <FadeIn>
                            <div>
                                <span
                                    className="text-xs font-bold uppercase tracking-[0.15em] text-primary-light"
                                    style={{ fontFamily: 'var(--font-mono)' }}
                                >
                                    Security and compliance
                                </span>
                                <h2
                                    className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    Built to Survive an Audit
                                </h2>
                                <p
                                    className="mt-4 text-base leading-relaxed text-text-on-dark sm:text-lg"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    AI drafting is governed by the same audit-first controls that protect the
                                    wider platform: tenant boundaries, retained evidence, controlled model use,
                                    and review history that stands up to enterprise procurement and regulated
                                    IP workflows.
                                </p>

                                <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/10">
                                    {SECURITY_GUARDS.map((guard, i) => (
                                        <SecurityGuardRow key={guard.label} guard={guard} border={i < SECURITY_GUARDS.length - 1} />
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        <div className="grid gap-4">
                            {SECURITY.map((item, i) => (
                                <FadeIn key={item.title} delay={i * 0.08}>
                                    <SecurityCard {...item} />
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── 8. Access control (RBAC) ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Access control
                            </span>
                            <h2
                                className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Five Permissions, Server-Enforced
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Frontend gating is defense-in-depth only. The token-costing draft:generate
                                permission is deliberately separate from draft:write, so admins control who
                                can trigger paid AI calls.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.05}>
                        <div className="mt-10 overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm ring-1 ring-white/70 lg:mt-12">
                            <table className="w-full min-w-150 border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-card-border bg-white/60">
                                        <th
                                            className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-text-muted"
                                            style={{ fontFamily: 'var(--font-mono)' }}
                                        >
                                            Action
                                        </th>
                                        {['Admin', 'Attorney', 'Paralegal', 'Read-only'].map((r) => (
                                            <th
                                                key={r}
                                                className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-text-muted"
                                                style={{ fontFamily: 'var(--font-mono)' }}
                                            >
                                                {r}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {RBAC_ROWS.map((row) => (
                                        <tr key={row.action} className="group border-b border-card-border/60 transition-colors duration-200 last:border-b-0 hover:bg-white">
                                            <td
                                                className="px-5 py-3.5 text-sm text-text-primary"
                                                style={{ fontFamily: 'var(--font-body)' }}
                                            >
                                                {row.action}
                                            </td>
                                            {[row.admin, row.attorney, row.paralegal, row.readOnly].map((ok, i) => (
                                                <td key={i} className="px-4 py-3.5 text-center">
                                                    <RbacCell ok={ok} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 9. Attorney-in-the-loop + export ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <div className="mx-auto max-w-3xl text-center">
                        <FadeIn>
                            <UserCheck className="mx-auto h-9 w-9 text-primary" />
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                The Attorney Is the Author. The AI Is the Assistant.
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Every draft starts in DRAFT status and requires review before filing. The
                                novelty analysis flags potential overlaps with the prior art, and per-claim
                                refinement lets attorneys tighten one claim without re-running the whole
                                draft. The UI and DOCX export carry the disclaimer "AI-generated content.
                                Not legal advice."
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <div className="mx-auto mt-7 inline-flex items-center gap-2.5 rounded-xl border border-card-border bg-card-bg px-5 py-3 text-left shadow-sm">
                                <FileText className="h-5 w-5 shrink-0 text-primary" />
                                <span
                                    className="text-sm text-text-secondary"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    Completed drafts render to a formatted{' '}
                                    <span className="font-semibold text-text-primary">DOCX</span> from the
                                    structured claim tree, even on locked drafts, and each export is logged
                                    as an audit event.
                                </span>
                            </div>
                        </FadeIn>
                    </div>
                </Container>
            </section>

            {/* ── 10. FAQ ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
                            <h2
                                className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                AI Drafting Questions
                            </h2>
                            <p
                                className="mt-4 text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                What the assistant does, and where the attorney stays in control.
                            </p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <FaqAccordion items={PAGE_FAQ} />
                    </FadeIn>
                </Container>
            </section>

            {/* ── 11. Final CTA ── */}
            <section className="py-16 sm:py-20 lg:py-24">
                <Container>
                    <div className="mx-auto max-w-2xl text-center">
                        <h2
                            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            See AI Drafting on Your Own Family
                        </h2>
                        <p
                            className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Book a walkthrough, or start upstream with free patent search and bring the
                            references into your draft.
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

                    {/* Professional-use notice. Kept on the conversion path, not
                        buried in the footer, because it governs how the output
                        of this product may be used. */}
                    <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-compliance/25 bg-compliance/[0.04] p-6 sm:p-7">
                        <h3
                            className="text-sm font-semibold text-text-primary"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Before you use a generated draft
                        </h3>
                        <ul
                            className="mt-3 flex flex-col gap-2 text-[13px] leading-relaxed text-text-secondary"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            <li>
                                AI-generated content may be incomplete or inaccurate and is not legal
                                advice. A qualified patent professional must independently review all
                                claims, citations, dates, factual statements, and filing requirements.
                            </li>
                            <li>
                                Support bands and novelty analysis assist review. They are not a
                                determination of novelty, patentability, enablement, or filing readiness.
                            </li>
                            <li>
                                You remain responsible for confidentiality obligations, export-control
                                rules, and any foreign-filing licence required before disclosing or
                                filing an invention outside its country of origin.
                            </li>
                        </ul>
                    </div>
                </Container>
            </section>

            <AiDraftingJsonLd faq={PAGE_FAQ} />
        </main>
    );
}

/* ── Helpers ── */

function PoweredByChip({ label, delay }: { label: string; delay: number }) {
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
            className="group inline-flex items-center gap-2 rounded-full border border-card-border bg-card-bg px-3.5 py-2 text-xs font-semibold text-text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary hover:shadow-sm hover:shadow-primary/[0.05] sm:text-sm"
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

function JurisdictionCard({ jurisdiction }: { jurisdiction: Jurisdiction }) {
    return (
        <article className="group relative flex h-full gap-4 overflow-hidden rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: `linear-gradient(to bottom, ${jurisdiction.color}14, transparent)`,
                }}
            />
            <span
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: jurisdiction.color, fontFamily: 'var(--font-mono)' }}
            >
                {jurisdiction.code}
            </span>
            <div className="relative min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <h3
                        className="text-lg font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {jurisdiction.authority}
                    </h3>
                    <span
                        className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                        style={{
                            color: jurisdiction.color,
                            backgroundColor: `${jurisdiction.color}14`,
                            fontFamily: 'var(--font-mono)',
                        }}
                    >
                        Rules applied
                    </span>
                </div>
                <p
                    className="mt-1.5 text-sm leading-relaxed text-text-secondary"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {jurisdiction.rules}
                </p>
            </div>
        </article>
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

function SecurityGuardRow({
    guard,
    border,
}: {
    guard: { icon: React.ElementType; label: string; text: string };
    border?: boolean;
}) {
    const Icon = guard.icon;

    return (
        <div className={`flex gap-4 p-5 ${border ? 'border-b border-white/10' : ''}`}>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-light/20 bg-primary-light/10 text-primary-light">
                <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
                <p
                    className="text-sm font-semibold text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {guard.label}
                </p>
                <p
                    className="mt-1 text-sm leading-relaxed text-text-on-dark/75"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {guard.text}
                </p>
            </div>
        </div>
    );
}

function SecurityCard({ icon: Icon, title, description }: IconItem) {
    return (
        <article className="group relative flex h-full gap-4 overflow-hidden rounded-2xl border border-white/10 bg-navy-light/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-light/25 hover:bg-navy-light/55 hover:shadow-lg hover:shadow-primary/[0.05]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-primary-light/[0.10] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-primary-light/25 group-hover:bg-white/10">
                <Icon className="h-5 w-5 text-primary-light transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="relative min-w-0">
                <h3
                    className="text-lg font-semibold text-white"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {title}
                </h3>
                <p
                    className="mt-1.5 text-sm leading-relaxed text-text-on-dark/80"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {description}
                </p>
            </div>
        </article>
    );
}

function CoverageCell({ value }: { value: string }) {
    if (value === 'yes') {
        return (
            <span className="mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success transition-transform duration-200 group-hover:scale-105">
                <Check className="h-4.5 w-4.5" aria-label="Available" />
            </span>
        );
    }
    const isEpo = value === 'EPO';
    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold transition-transform duration-200 group-hover:scale-105 ${
                isEpo ? 'bg-success/10 text-success' : 'bg-compliance/10 text-compliance'
            }`}
            style={{ fontFamily: 'var(--font-mono)' }}
        >
            {value === 'EPO' ? 'via EPO' : 'Paste'}
        </span>
    );
}

function RbacCell({ ok }: { ok: boolean }) {
    return ok ? (
        <span className="mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success transition-transform duration-200 group-hover:scale-105">
            <Check className="h-4.5 w-4.5" aria-label="Allowed" />
        </span>
    ) : (
        <span className="mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-text-muted/60">
            <Minus className="h-4 w-4" aria-label="Not allowed" />
        </span>
    );
}

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
    const map = {
        high: { label: 'High', bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
        medium: { label: 'Medium', bg: 'bg-compliance/10', text: 'text-compliance', dot: 'bg-compliance' },
        low: { label: 'Low', bg: 'bg-danger/10', text: 'text-danger', dot: 'bg-danger' },
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
