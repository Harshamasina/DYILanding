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
import { FadeIn } from '@/components/motion/FadeIn';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { AnimatedClaimsWorkflow } from '@/components/ui/AnimatedClaimsWorkflow';
import { AiDraftingJsonLd } from '@/components/seo/AiDraftingJsonLd';
import { PATENT_SEARCH_PAGE_URL } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

export const metadata: Metadata = buildMetadata({
    title: 'AI Patent Drafting Software With Attorney Review',
    description:
        'Turn invention details and saved prior art into a filing-ready first draft, claims, abstract, description, and novelty analysis, tailored to US, EP, IN, and PCT. Attorney-in-the-loop, with a tamper-resistant audit trail.',
    path: '/ai-patent-drafting/',
});

/* ── Data ── */

interface IconItem {
    icon: React.ElementType;
    title: string;
    description: string;
}

const POWERED_BY = [
    'Claude Sonnet 4.6 (generation)',
    'Claude Opus 4.7 (review)',
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
        description: 'Feed invention details and saved prior art to Claude to generate jurisdiction-specific claims, abstract, description, and novelty analysis, asynchronously.',
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
        rules: 'Section 3(d) enhanced-efficacy requirement enforced for pharma claims, the single most important rule for Indian pharma patents.',
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
        title: 'Three honest buckets',
        description: 'High, medium, or low per unit, not a false-precision number. The judge defaults to medium when uncertain; high must be affirmatively justified.',
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
        title: 'Prioritization, not a gate',
        description: 'Scores help you spend review time on the weakest sections first. They never block export or approval, and are never shown to the end client.',
    },
];

const SECURITY: IconItem[] = [
    {
        icon: Lock,
        title: 'Tenant isolation',
        description: 'Composite primary keys, Row-Level Security forced on every table (no BYPASSRLS), all queries inside withTenantContext(), and JWT org_id cross-validated against the tenant, a spoofed subdomain is rejected before any data is touched.',
    },
    {
        icon: Database,
        title: 'Tamper-resistant audit',
        description: 'Revision history and prior-art snapshots are append-only at the database layer, INSERT and SELECT only. Postgres rejects UPDATE and DELETE under RLS, even for a tenant admin. A notarized ledger any party can read but no party can edit.',
    },
    {
        icon: KeyRound,
        title: 'AI-specific controls',
        description: 'API keys in AWS Secrets Manager, five-layer prompt-injection defense, Anthropic zero-retention generation with no PII by default, and per-tenant token budgets with draft:generate separated from draft:write.',
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
            'US, EP, IN, and PCT (WO) are the production set, each with jurisdiction-specific claim format, statutory rules, and mandatory section structure applied. A missing required section is flagged rather than silently omitted. JP and CN exist in the type system for future expansion.',
    },
    {
        question: 'How does prior art work for US and Indian patents without a claims API?',
        answer:
            'Bibliographic data is retrieved for all jurisdictions via EPO OPS. EP and PCT patents also return full-text claims directly from EPO. US and Indian patents have no reliable public claims API today, so a claims-retrieval helper guides the attorney to paste claim text from the source (USPTO ODP or InPASS). Pasted claims are stored on the reference and fed to the AI for novelty analysis.',
    },
    {
        question: 'Is my data used to train the AI?',
        answer:
            'No. Tenant data goes to Claude only during generation, under Anthropic zero-retention API policy. Prompts contain only invention details and public prior art; no personal data unless the attorney puts it there.',
    },
    {
        question: 'How is a draft defensible in an audit?',
        answer:
            'Every AI revision is generated against a frozen, immutable snapshot of the exact prior-art set used at that moment, and revision history is append-only at the database layer. So "what art did the AI see when it wrote claim 3?" is always answerable, even years later and even if the live reference was later deleted.',
    },
    {
        question: 'What models power it?',
        answer:
            'Claude Sonnet 4.6 generates the draft, and a separate background review runs Claude Opus 4.7 as a judge to assign high / medium / low confidence to the claims, abstract, description, and novelty analysis.',
    },
    {
        question: 'Can paralegals trigger AI generation?',
        answer:
            'No. The draft:generate permission (which costs tokens) is deliberately separated from draft:write. Paralegals can search, save prior art, fill invention details, view drafts, and export, but only attorneys and tenant admins can generate, refine, or approve.',
    },
    {
        question: 'Is it suitable for regulated and pharma teams?',
        answer:
            'Yes. The append-only audit trail, electronic records, and access controls mirror 21 CFR Part 11 patterns for GxP readiness, and the India Section 3(d) enhanced-efficacy rule is enforced for pharma claims. The structured, versioned record is built to stand up in enterprise procurement and regulatory review.',
    },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function AiPatentDraftingPage() {
    return (
        <main id="main-content">
            {/* ── 1. Hero ── */}
            <section className="pt-28 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">
                <Container>
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
                            <li className="font-medium text-text-primary">AI Patent Drafting</li>
                        </ol>
                    </nav>

                    <div className="max-w-3xl">
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
                            From Prior Art to First Draft, With{' '}
                            <span className="text-primary italic">Attorney Review Built In</span>
                        </h1>
                        <p
                            className="mt-5 text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            An attorney-in-the-loop drafting assistant that turns invention details and
                            saved prior art into a filing-ready first draft, claims, abstract,
                            description, and novelty analysis, tailored to the target jurisdiction. AI
                            drafts are dramatically better when they know the art on record.
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
                </Container>

                <Container className="mt-12 sm:mt-16">
                    <FadeIn>
                        <MockupHalo>
                            <AnimatedClaimsWorkflow />
                        </MockupHalo>
                    </FadeIn>
                </Container>

                {/* Powered by */}
                <Container className="mt-8 sm:mt-10">
                    <FadeIn delay={0.1}>
                        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-3">
                            <span
                                className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Powered by
                            </span>
                            <div className="flex flex-wrap justify-center gap-2">
                                {POWERED_BY.map((p) => (
                                    <span
                                        key={p}
                                        className="rounded-lg border border-card-border bg-card-bg px-3 py-1.5 text-xs font-medium text-text-secondary"
                                        style={{ fontFamily: 'var(--font-mono)' }}
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 2. How it works ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
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
                                generates claims positioned to be novel over the art on record. Drafting
                                lives inside the patent family, because that is how patent work flows.
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
                                    <span
                                        className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card-bg px-3.5 py-2 text-xs font-semibold text-text-primary shadow-sm sm:text-sm"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        <step.icon className="h-4 w-4 text-primary" />
                                        {step.label}
                                    </span>
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
                                <article className="flex h-full gap-4 rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
                                    <span
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                                        style={{ backgroundColor: j.color, fontFamily: 'var(--font-mono)' }}
                                    >
                                        {j.code}
                                    </span>
                                    <div className="min-w-0">
                                        <h3
                                            className="text-lg font-semibold text-text-primary"
                                            style={{ fontFamily: 'var(--font-display)' }}
                                        >
                                            {j.authority}
                                        </h3>
                                        <p
                                            className="mt-1.5 text-sm leading-relaxed text-text-secondary"
                                            style={{ fontFamily: 'var(--font-body)' }}
                                        >
                                            {j.rules}
                                        </p>
                                    </div>
                                </article>
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
                        <div className="mt-10 overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm lg:mt-12">
                            <table className="w-full min-w-125 border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-card-border">
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
                                        <tr key={row.label} className="border-b border-card-border/60 last:border-b-0">
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
                                After Claude Sonnet 4.6 generates the draft, a background review runs
                                Claude Opus 4.7 as a judge over the claims, abstract, description, and
                                novelty analysis, so you can spend review time where it matters.
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
            <section className="bg-navy py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
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
                                className="mt-4 text-lg leading-relaxed text-text-on-dark"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Security and compliance are the product moat. AI drafting extends the same
                                patterns that make the platform defensible in enterprise procurement and
                                regulatory review, including 21 CFR Part 11 patterns for GxP readiness.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3">
                        {SECURITY.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.08}>
                                <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-navy-light/40 p-6">
                                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                                        <item.icon className="h-5 w-5 text-primary-light" />
                                    </div>
                                    <h3
                                        className="mt-4 text-lg font-semibold text-white"
                                        style={{ fontFamily: 'var(--font-display)' }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className="mt-2 text-sm leading-relaxed text-text-on-dark"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {item.description}
                                    </p>
                                </article>
                            </FadeIn>
                        ))}
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
                        <div className="mt-10 overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm lg:mt-12">
                            <table className="w-full min-w-150 border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-card-border">
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
                                        <tr key={row.action} className="border-b border-card-border/60 last:border-b-0">
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
                                    Completed drafts render to a filing-ready{' '}
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
                </Container>
            </section>

            <AiDraftingJsonLd faq={PAGE_FAQ} />
        </main>
    );
}

/* ── Helpers ── */

function CapabilityCard({ icon: Icon, title, description }: IconItem) {
    return (
        <article className="flex h-full flex-col rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3
                className="mt-4 text-lg font-semibold text-text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {title}
            </h3>
            <p
                className="mt-2 text-sm leading-relaxed text-text-secondary"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {description}
            </p>
        </article>
    );
}

function CoverageCell({ value }: { value: string }) {
    if (value === 'yes') {
        return <Check className="mx-auto h-4.5 w-4.5 text-success" aria-label="Available" />;
    }
    const isEpo = value === 'EPO';
    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${
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
        <Check className="mx-auto h-4.5 w-4.5 text-success" aria-label="Allowed" />
    ) : (
        <Minus className="mx-auto h-4 w-4 text-text-muted/50" aria-label="Not allowed" />
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
