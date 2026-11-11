import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Minus, ArrowRight, Play, LockKeyhole, PenLine, FileDown, type LucideIcon } from 'lucide-react';
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
import { ProcessFlow, type ProcessStep } from '@/components/ui/ProcessFlow';
import { SubsectionNumber } from '@/components/ui/SubsectionNumber';
import { InlineList } from '@/components/ui/RuledList';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { AnimatedClaimsWorkflow } from '@/components/ui/AnimatedClaimsWorkflow';
import { AiDraftingHeroSvg } from '@/components/illustrations/AiDraftingHeroSvg';
import { AttorneyAuthorshipVisual } from '@/components/illustrations/AttorneyAuthorshipVisual';
import { JurisdictionRuleExplorer, type DraftingOffice } from '@/components/ui/JurisdictionRuleExplorer';
import { AiDraftingJsonLd } from '@/components/seo/AiDraftingJsonLd';
import { OFFICE_ACTIONS_PAGE_URL, PATENT_SEARCH_PAGE_URL } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

export const metadata: Metadata = buildMetadata({
    title: 'AI Patent Drafting Software With Attorney Review',
    description:
        'Attorney-in-the-loop AI patent drafting: turn saved prior art into structured draft claims, abstract, and novelty analysis for attorney review across US, EP, IN, PCT, JP, CN, GB, KR, CA, AU, and BR.',
    path: '/ai-patent-drafting/',
    ogKey: 'ai-patent-drafting',
});

/* ── Data ── */

interface CardItem {
    title: string;
    description: string;
}

/* Capability language rather than pinned model versions. Providers and
   versions change with task, availability, and customer requirements, and
   exact model identifiers belong in the security questionnaire and release
   notes, not in marketing copy that goes stale. */
const GENERATION_MODEL = 'an enterprise Claude model from Anthropic';
const REVIEW_MODEL = 'a separate, independent reviewer model';

const CAPABILITIES: CardItem[] = [
    {
        title: 'Prior Art Search',
        description: 'Worldwide patent search via EPO Open Patent Services, covering 100+ jurisdictions through INPADOC, the EPO worldwide patent family database.',
    },
    {
        title: 'Prior Art Management',
        description: "Save, annotate, paste claim text, and track the relevance of references per patent family. References from a novelty search arrive with their findings already mapped to the invention's features.",
    },
    {
        title: 'AI Draft Generation',
        description: `Feed invention details and saved prior art to ${GENERATION_MODEL} to generate jurisdiction-specific claims, abstract, description, and novelty analysis in the background.`,
    },
];

const WORKFLOW: ProcessStep[] = [
    { title: 'Create family' },
    { title: 'Research prior art' },
    { title: 'Draft claims' },
    { title: 'Attorney review' },
    { title: 'File' },
];

/* One medical-use claim per office, in the form the drafter writes for it,
   from the drafting rules (skill-v1.6). The board shows them in this order. */
const JURISDICTIONS: DraftingOffice[] = [
    {
        code: 'US',
        authority: 'USPTO',
        claim: ['', 'A method of treating', ' cancer in a subject in need thereof, comprising administering Compound X.'],
        claimNote: 'Use claims are not drafted for the US, because a bare use claim fails 35 USC 101.',
        treatmentDrafted: true,
        fact: { label: 'Flagged for review', value: '101, 112 and ODP' },
        abstractCap: '150 words',
        rules: '35 USC 101 / 112 and obviousness-type double patenting issues flagged for attorney review, with the full US section structure (Field, Background, Summary, Brief Description of Drawings, Detailed Description).',
    },
    {
        code: 'EP',
        authority: 'EPO',
        claim: ['Compound X ', 'for use in treating', ' cancer.'],
        claimNote: 'The EPC 2000 "for use" form. "Use of X for treating Y" is read as a method of treatment and is not drafted.',
        treatmentDrafted: false,
        fact: { label: 'Key check', value: 'Art. 84 clarity' },
        abstractCap: '150 words',
        rules: 'EPC Article 84 clarity, conciseness, and support, plus the EPC 2000 "compound for use" claim format.',
    },
    {
        code: 'IN',
        authority: 'Indian Patent Office',
        shortName: 'IPO',
        claim: ['', 'A pharmaceutical composition comprising', ' Compound X and a pharmaceutically acceptable carrier.'],
        claimNote: 'Product, composition and process claims only: a new use of a known substance is not an invention in India.',
        treatmentDrafted: false,
        fact: { label: 'Key check', value: 'Section 3(d)' },
        abstractCap: '150 words',
        rules: 'Section 3(d) enhanced-efficacy considerations flagged for attorney review on pharma claims, the single most important rule for Indian pharma patents.',
    },
    {
        code: 'WO',
        authority: 'WIPO (PCT)',
        shortName: 'WIPO',
        claim: ['Compound X ', 'for use in treating', ' cancer.'],
        claimNote: 'Added for the EP national phase, with each use described fully so national counsel can convert it to the local form.',
        treatmentDrafted: false,
        fact: { label: 'Key check', value: 'National-phase notes' },
        abstractCap: '150 words',
        rules: 'Jurisdiction-neutral claims compatible with USPTO and EPO conventions, with national-phase amendments flagged for entry.',
    },
    {
        code: 'JP',
        authority: 'JPO',
        claim: ['', 'A pharmaceutical composition for treating cancer', ', comprising Compound X as an active ingredient.'],
        claimNote: 'A use claim is read as a method of using the substance, so the medical use is claimed as a composition for a specific disease.',
        treatmentDrafted: false,
        fact: { label: 'Key check', value: 'Multi-multi ban' },
        abstractCap: '200 words',
        rules: 'The multi-multi dependency ban checked on every new draft, and medicinal use claimed as a pharmaceutical composition for a specific disease, with pharmacological test data called for in the description.',
    },
    {
        code: 'CN',
        authority: 'CNIPA',
        claim: ['Use of Compound X ', 'in the preparation of a medicament', ' for treating cancer.'],
        claimNote: '"Use of X for treating Y" is treated as a method of treatment; the pharmaceutical-use form is the one accepted.',
        treatmentDrafted: false,
        fact: { label: 'Key check', value: 'Alternative-only dependency' },
        abstractCap: '150 words, 300 Chinese characters',
        rules: 'Medical use in the "use of X in the preparation of a medicament" form, multiple dependent claims in the alternative only, and sufficiency judged on the application as filed.',
    },
    {
        code: 'GB',
        authority: 'UKIPO',
        claim: ['Compound X ', 'for use in the treatment of', ' cancer.'],
        claimNote: 'Swiss-type claims are refused in every new or pending UK application, with no 2011 transition as at the EPO.',
        treatmentDrafted: false,
        fact: { label: 'Claims before the fee', value: '25' },
        abstractCap: '200 words',
        rules: 'Methods of treatment kept out of the claims, Swiss-type claims refused whatever the priority date, and omnibus "as herein described" claims flagged.',
    },
    {
        code: 'KR',
        authority: 'MOIP (formerly KIPO)',
        shortName: 'MOIP',
        claim: ['', 'A pharmaceutical composition for preventing or treating cancer', ', comprising Compound X as an active ingredient.'],
        claimNote: 'A claim ending in "use" is neither a product nor a method in Korea, so the medical use is a composition claim.',
        treatmentDrafted: false,
        fact: { label: 'Claims before the fee', value: 'None, each is charged' },
        abstractCap: '150 words, 400 Korean characters',
        rules: 'The multi-multi dependency ban checked on every draft, use claims flagged, and the Korean translation due 1 year 2 months from the earliest priority date.',
    },
    {
        code: 'CA',
        authority: 'CIPO',
        claim: ['', 'Use of Compound X for treating', ' cancer.'],
        claimNote: 'Accepted without an administering step; adding one turns the use claim into a method of medical treatment.',
        treatmentDrafted: false,
        fact: { label: 'Claims before the fee', value: '20' },
        abstractCap: '150 words',
        rules: 'Use claims that recite administering flagged, multiple dependent claims in the alternative only, and incorporation by reference in the description blocked.',
    },
    {
        code: 'AU',
        authority: 'IP Australia',
        claim: ['', 'A method of treating', ' cancer, comprising administering Compound X.'],
        claimNote: 'Australia has no exclusion for methods of medical treatment, and Swiss-type claims are accepted alongside them.',
        treatmentDrafted: true,
        fact: { label: 'Claims before the fee', value: '20' },
        abstractCap: '150 words',
        rules: 'Methods of treatment drafted, Swiss-type claims accepted, multiple dependent claims free to depend on each other, and omnibus claims flagged.',
    },
    {
        code: 'BR',
        authority: 'INPI',
        claim: ['Use of Compound X, ', 'characterized by', ' being for preparing a medicament for treating cancer.'],
        claimNote: 'The Swiss form only, with "characterized by" once in every claim. Drafted in English for the Portuguese filing.',
        treatmentDrafted: false,
        fact: { label: 'Claims before the fee', value: '15' },
        abstractCap: '200 words',
        rules: '"Characterized by" counted in every claim, imprecise terms such as "about" flagged, and dependency wording held to "any one of the preceding claims".',
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

const VERSIONING: CardItem[] = [
    {
        title: 'Per-unit regeneration',
        description: 'Refine claim 3 without paying to regenerate claims 1, 2, and 4 through N. Each claim and section is its own record.',
    },
    {
        title: 'Interactive refinement',
        description: 'Natural-language instructions ("broaden claim 2 to cover oral and IV administration") produce a new revision of one unit, not a full rewrite.',
    },
    {
        title: 'Manual edits, never blocked',
        description: 'Attorney edits are revisioned identically to AI edits, distinguished only by a source field.',
    },
    {
        title: 'Restore as a new revision',
        description: 'Restoring an earlier revision creates a new revision, never a deletion. History only grows.',
    },
    {
        title: 'Dependent sections flagged as stale',
        description: 'Editing claim 2 marks dependent claims, novelty analysis, and description sections stale. You decide what to regenerate, the system never does it for you.',
    },
    {
        title: 'Diff and tree edits',
        description: 'Side-by-side comparison between any two revisions of any unit, plus reorder, reparent, split, and merge of claims.',
    },
];

const CONFIDENCE: CardItem[] = [
    {
        title: 'Three support bands',
        description: 'High, medium, or low per unit, describing how well the generated text is supported by the prior art on record, not a probability and not a legal opinion. The reviewer defaults to medium when uncertain; high must be affirmatively justified.',
    },
    {
        title: 'Evidence-grounded',
        description: 'Every rating cites a specific claim number, quoted phrase, or publication number from the prior-art snapshot.',
    },
    {
        title: 'Progressive reveal',
        description: 'The draft is readable the instant generation completes; scores fill in seconds later while you read. You never wait on one long loading screen.',
    },
    {
        title: 'Prioritization, not a determination',
        description: 'Bands rank where attorney attention is most useful, and do not assess patentability, novelty, or filing readiness. They do not block export or approval, and are not shown to the end client.',
    },
];

const SECURITY: CardItem[] = [
    {
        title: 'Tenant isolation',
        description: 'Each customer workspace is separated at the application and data layers. Tenant identity is verified before any drafting record, prior-art source, or portfolio item can be accessed.',
    },
    {
        title: 'Append-only audit',
        description: 'Draft revisions, source references, and prior-art snapshots are preserved as append-only evidence, creating a review history that can be inspected later without being rewritten.',
    },
    {
        title: 'AI-specific controls',
        description: 'Model access, prompt handling, and spending limits are governed per tenant. Generation and saving are controlled separately, with retention-limited provider settings and no personal data by default. Current provider retention terms are shared as part of security review.',
    },
];

const SECURITY_GUARDS: { label: string; text: string }[] = [
    {
        label: 'Enterprise review',
        text: 'Controls designed for procurement, security questionnaires, and regulated IP teams.',
    },
    {
        label: 'Evidence retained',
        text: 'Every generated draft remains tied to the prior-art snapshot and review trail behind it.',
    },
    {
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
            'US, EP, IN, PCT (WO), JP, CN, GB, KR, CA, AU, and BR are the production set, each with jurisdiction-specific claim format, drafting rules, and mandatory section structure applied. A missing required section is flagged rather than silently omitted.',
    },
    {
        question: 'How does prior art work for US and Indian patents without a claims API?',
        answer:
            'Bibliographic data is retrieved for all jurisdictions via EPO Open Patent Services (OPS). EP and PCT patents also return full-text claims directly from EPO. US and Indian patents have no reliable public claims API today, so a claims-retrieval helper guides the attorney to paste claim text from the source (USPTO ODP or InPASS). Pasted claims are stored on the reference and fed to the AI for novelty analysis.',
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
            'No. Generating a draft uses paid AI capacity, so it is a separate permission from editing a draft. Paralegals can search, save prior art, fill invention details, view drafts, and export, but only attorneys and tenant admins can generate, refine, or approve.',
    },
    {
        question: 'Is it suitable for regulated and pharma teams?',
        answer:
            'Yes. The append-only audit trail, electronic records, and access controls follow 21 CFR Part 11 patterns, and the India Section 3(d) enhanced-efficacy requirement is flagged for attorney review on pharma claims. The structured, versioned record is built to stand up in enterprise procurement and regulatory review. Compliance and validation still depend on your intended use, configuration, procedures, and quality system.',
    },
    {
        question: 'Can I just use ChatGPT to write my patent application?',
        answer:
            'A general chatbot writes generic claims with no access to the prior art on record, no jurisdiction-specific statutory rules, no version history, and no audit trail. This assistant grounds every draft in the actual prior art saved to the family (including pasted claim text), applies US, EP, IN, PCT, JP, CN, GB, KR, CA, AU, and BR rules and section structure, runs a second-model confidence review, and keeps an append-only audit trail with mandatory attorney review before filing. The attorney is the author; the AI is the assistant.',
    },
    {
        question: 'Can the AI spot claim-support issues or weaknesses before filing?',
        answer:
            'Yes. Generation produces a novelty analysis that flags potential overlaps with the prior art on record, and a separate, independent reviewer model reviews each claim, the abstract, the description, and the novelty analysis, banding each as high, medium, or low support with a cited rationale. You see the least-supported sections first. It assists the review; the attorney makes the call.',
    },
    {
        question: 'Can it draft patent applications for India?',
        answer:
            'Yes. India (IN) is in the production jurisdiction set. Drafts apply Indian Patent Office rules, including the Section 3(d) enhanced-efficacy requirement that is decisive for pharma claims, plus the mandatory section structure, with US, EP, PCT, JP, CN, GB, KR, CA, AU, and BR supported alongside it. A missing required section is flagged rather than silently omitted.',
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
                            <SectionMark numbered={false}>AI Patent Drafting</SectionMark>
                            <h1
                                className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-[3.5rem]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                AI Patent Drafting With{' '}
                                <span className="accent-amend text-primary">Attorney Review Built In</span>
                            </h1>
                            <p
                                className="mt-5 max-w-[40rem] text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                An attorney-in-the-loop drafting assistant that turns invention details and
                                saved prior art into a structured first draft for attorney review: claims,
                                abstract, description, and novelty analysis, prepared for the drafting
                                conventions of the target jurisdiction. AI drafts are stronger when they
                                are written against the art on record.
                            </p>

                            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                                <BookDemoButton topic="AI patent drafting" size="lg" className="justify-center">
                                    Book a Demo
                                </BookDemoButton>
                                <WatchDemoButton variant="outline" size="lg" startTime={72} className="justify-center">
                                    <Play className="h-5 w-5 fill-current" />
                                    Watch Demo
                                </WatchDemoButton>
                            </div>
                        </div>

                        <div className="pointer-events-none hidden md:flex md:w-full md:justify-center lg:justify-end">
                            <AiDraftingHeroSvg />
                        </div>
                    </div>
                </Container>

                <Container className="figure-group relative z-10 mt-12 sm:mt-16">
                    <MockupHalo>
                        <AnimatedClaimsWorkflow />
                    </MockupHalo>
                </Container>
            </section>

            {/* ── 2. How it works ── */}
            <section className="relative overflow-hidden bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <HeroAmbience edge="top" />
                <Container className="relative z-10">
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark>How it works</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Drafts That Know the Prior Art
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary"
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

                    {/* Workflow: the drafting procedure as a patent-style flowchart */}
                    <ProcessFlow label="Drafting workflow" steps={WORKFLOW} className="mt-10 lg:mt-12" />

                    <div className="mt-12 grid gap-x-6 gap-y-8 lg:mt-14 lg:grid-cols-3">
                        {CAPABILITIES.map((item, i) => (
                            <FadeIn key={item.title} delay={i * 0.08} className="h-full">
                                <IndexCard {...item} />
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
                            <SectionMark>Jurisdiction-aware</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Claims Written to the Rules That Apply
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                The drafting engine applies jurisdiction-specific claim format, statutory
                                rules, and mandatory section structure for eleven offices. Pick one to see
                                how the same medical use is claimed there.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1} className="mt-12 lg:mt-16">
                        <JurisdictionRuleExplorer offices={JURISDICTIONS} />
                    </FadeIn>
                </Container>
            </section>

            {/* ── 4. Prior art & references (coverage by jurisdiction) ── */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark>Prior Art and References</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Real Coverage, Stated Plainly
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Search runs through EPO Open Patent Services (OPS), returning
                                bibliographic data and family links worldwide. The table below states
                                full-text claims coverage per jurisdiction, including where claim text has
                                to be pasted.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Coverage table */}
                    <FadeIn delay={0.05}>
                        {/* Phones: one ruled block per row, so no column hides off-screen */}
                        <dl className="mt-10 border-t border-card-border sm:hidden">
                            {COVERAGE_ROWS.map((row) => (
                                <div key={row.label} className="border-b border-card-border py-4">
                                    <dt className="text-sm font-semibold text-text-primary [font-family:var(--font-body)]">{row.label}</dt>
                                    <dd className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                                        {(
                                            [
                                                ['US', row.us],
                                                ['IN', row.in],
                                                ['EP', row.ep],
                                                ['PCT', row.pct],
                                            ] as const
                                        ).map(([code, value]) => (
                                            <span key={code} className="flex items-center gap-2">
                                                <span className="w-9 text-xs font-semibold text-primary [font-family:var(--font-mono)]">{code}</span>
                                                <CoverageCell value={value} />
                                            </span>
                                        ))}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        <div className="mt-10 hidden overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm ring-1 ring-white/70 sm:block lg:mt-12">
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

                    <FadeIn delay={0.08}>
                        <InlineList
                            label="Key"
                            items={[
                                'Paste: you paste the claim text from the source (USPTO ODP or InPASS)',
                                'via EPO: fetched automatically from EPO Open Patent Services',
                            ]}
                            className="mt-5"
                        />
                    </FadeIn>

                </Container>
            </section>

            {/* ── 5. Structured, versioned drafts ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark tone="compliance">Structured and versioned</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                A Draft Is a{' '}
                                <span className="accent-amend">Record</span>, Not a Block of Text
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Every claim is its own record with a real dependency tree. Abstract,
                                novelty analysis, and each description section are their own units. Every
                                change to every unit is its own append-only revision, capturing who, when,
                                why, AI versus manual, and what art the AI saw.
                            </p>
                        </div>
                    </FadeIn>

                    <RuledItemList items={VERSIONING} tone="compliance" className="mt-12 lg:mt-16" />

                    <FadeIn delay={0.1}>
                        <div className="mt-10 grid gap-5 sm:grid-cols-2">
                            <RuleCard icon={LockKeyhole} title="Approval lock and branching">
                                An approved draft is hard-locked. To change it, you branch a new version
                                that carries forward all content with full lineage. "Approved" stays a
                                strong signal, and a draft cannot be approved while any unit is stale.
                            </RuleCard>
                            <RuleCard icon={PenLine} title="Mandatory reason-for-change">
                                Every revision carries a reason, system-filled for AI revisions,
                                attorney-supplied for manual edits and restores. The field is never null.
                            </RuleCard>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── 6. Confidence scores ──
                Intro across the top, then two equal-height columns: the four
                points on the left and the reviewer's report on the right. The
                grid's first row holds both, so they start and end level; the
                figure caption sits in a second row under the report only. */}
            <section className="bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <SectionMark>Second-opinion review</SectionMark>
                        <h2 className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl [font-family:var(--font-display)]">
                            A Separate Model Reviews the Draft
                        </h2>
                        <p className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                            After {GENERATION_MODEL} generates the draft, a background review runs{' '}
                            {REVIEW_MODEL} as a judge over the claims, abstract, description, and
                            novelty analysis, banding how well each unit is supported by the prior
                            art on record so you can spend review time where it matters. The bands
                            guide attorney attention; they are not a legal determination.
                        </p>
                    </FadeIn>

                    <div className="figure-group mt-12 grid gap-y-8 lg:mt-14 lg:grid-cols-2 lg:gap-x-16">
                        <RuledItemList items={CONFIDENCE} columns={1} className="lg:col-start-1 lg:row-start-1 lg:h-full lg:auto-rows-fr" />
                        <ReviewReportFigure className="lg:col-start-2 lg:row-start-1 lg:h-full" />
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
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark tone="compliance" dark>
                                Security and compliance
                            </SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Built to Survive an Audit
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-base leading-relaxed text-text-on-dark sm:text-lg"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                AI drafting is governed by the same audit-first controls that protect the
                                wider platform: tenant boundaries, retained evidence, controlled model use,
                                and review history that stands up to enterprise procurement and regulated
                                IP workflows.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Six controls in two even columns: every card shares one
                        width and the row's height, so left and right line up. */}
                    <ol className="mt-12 grid auto-rows-fr gap-5 md:grid-cols-2 lg:mt-14">
                        {[...SECURITY_GUARDS.map(({ label, text }) => ({ title: label, description: text })), ...SECURITY].map((item, i) => (
                            <li key={item.title}>
                                <FadeIn delay={(i % 2) * 0.06} className="h-full">
                                    <SecurityCard {...item} />
                                </FadeIn>
                            </li>
                        ))}
                    </ol>
                </Container>
            </section>

            {/* ── 8. Access control (RBAC) ── */}
            <section className="py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn>
                        <div className="max-w-3xl">
                            <SectionMark>Access control</SectionMark>
                            <h2
                                className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Who Can Generate, Edit, and Approve
                            </h2>
                            <p
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Every permission is enforced on the server, not only hidden in the
                                interface. Generating a draft uses paid AI capacity, so it is a separate
                                permission from editing, and admins decide who can trigger it.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.05}>
                        {/* Phones: one ruled block per action, naming the roles allowed */}
                        <dl className="mt-10 border-t border-card-border sm:hidden">
                            {RBAC_ROWS.map((row) => (
                                <div key={row.action} className="border-b border-card-border py-3.5">
                                    <dt className="text-sm font-semibold text-text-primary [font-family:var(--font-body)]">{row.action}</dt>
                                    <dd className="mt-1 text-sm text-text-secondary [font-family:var(--font-body)]">
                                        {rolesAllowed(row)}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        <div className="mt-10 hidden overflow-x-auto rounded-2xl border border-card-border bg-card-bg shadow-sm ring-1 ring-white/70 sm:block lg:mt-12">
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
            <section className="relative overflow-hidden bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
                        <div>
                            <FadeIn>
                                <SectionMark>Attorney in the loop</SectionMark>
                                <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-text-primary [font-family:var(--font-display)] sm:text-4xl lg:text-5xl">
                                    The Attorney Is the Author.{' '}
                                    <span className="text-primary">The AI Is the Assistant.</span>
                                </h2>
                                <p className="mt-5 max-w-[36rem] text-lg leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                    Every draft starts in DRAFT status and requires review before filing. The
                                    novelty analysis flags potential overlaps with the prior art, and per-claim
                                    refinement lets attorneys tighten one claim without re-running the whole
                                    draft. The UI and DOCX export carry the disclaimer "AI-generated content.
                                    Not legal advice."
                                </p>
                            </FadeIn>
                            <FadeIn delay={0.1}>
                                <div className="hover-crop group mt-8 flex max-w-[36rem] gap-4 rounded-xl border border-card-border bg-white p-5 shadow-sm transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md motion-reduce:hover:translate-y-0">
                                    <span
                                        aria-hidden="true"
                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 text-primary transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white"
                                    >
                                        <FileDown className="h-4.5 w-4.5" strokeWidth={1.6} />
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="text-base font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary [font-family:var(--font-display)]">
                                            <span className="hover-sweep">Export</span>
                                        </h3>
                                        <p className="mt-1 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                            Completed drafts render to a formatted{' '}
                                            <span className="font-semibold text-text-primary">DOCX</span> from the
                                            structured claim tree, even on locked drafts, and each export is logged
                                            as an audit event.
                                        </p>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                        <FadeIn delay={0.15} direction="left">
                            <AttorneyAuthorshipVisual className="mb-12 mt-8 sm:mb-6 lg:mt-0" />
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
                                className="mt-4 max-w-[40rem] text-lg leading-relaxed text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                What the assistant does, and where the attorney stays in control.
                            </p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <FaqAccordion items={PAGE_FAQ} initialVisible={6} />
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
                            <BookDemoButton topic="AI patent drafting" size="lg" className="w-full justify-center sm:w-auto">
                                Book a Demo
                            </BookDemoButton>
                            <Button href={PATENT_SEARCH_PAGE_URL} variant="link" size="lg" className="justify-center">
                                Explore Patent Search
                                <ArrowRight className="h-5 w-5" aria-hidden="true" />
                            </Button>
                        </div>
                        <Link
                            href={OFFICE_ACTIONS_PAGE_URL}
                            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            After filing, see office action analysis and response
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>

                    {/* Professional-use notice: hidden pending attorney review of its wording. */}
                    {/* <div className="mx-auto mt-12 max-w-3xl border-l border-compliance-ink pl-5 text-left sm:pl-6">
                        <h3 className="text-sm font-semibold text-text-primary [font-family:var(--font-display)]">
                            Before you use a generated draft
                        </h3>
                        <ul className="mt-3 flex max-w-[33rem] flex-col gap-2 text-[13px] leading-relaxed text-text-secondary [font-family:var(--font-body)]">
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
                    </div> */}
                </Container>
            </section>

            <AiDraftingJsonLd faq={PAGE_FAQ} />
        </main>
    );
}

/* ── Helpers ── */

/* One jurisdiction as a filing card: its office code set large like a
   stamp in the margin, the office and its rules beside it. On hover the card
   takes registration marks at its corners, the code inks in, and the office
   name is underlined as an amendment is. */
/* Numbered capabilities as ruled rows, two columns from lg: the subsection
   number, the title in the display face, the description, a hairline rule. */
function RuledItemList({
    items,
    tone = 'primary',
    columns = 2,
    className = '',
}: {
    items: CardItem[];
    tone?: 'primary' | 'compliance';
    columns?: 1 | 2;
    className?: string;
}) {
    const amber = tone === 'compliance';
    return (
        <ol className={`grid gap-x-12 ${columns === 2 ? 'lg:grid-cols-2' : ''} ${className}`}>
            {items.map((item, i) => (
                <li key={item.title}>
                    <FadeIn delay={i * 0.05}>
                        <div className={`hover-changebar group flex gap-4 py-6 ${amber ? 'bar-amber' : ''}`}>
                            <SubsectionNumber tone={tone} size="sm" className="changebar-shift w-9 shrink-0 pt-1" />
                            <div className="min-w-0">
                                <h3 className={`text-lg font-semibold text-text-primary transition-colors duration-300 [font-family:var(--font-display)] ${amber ? 'group-hover:text-compliance-ink' : 'group-hover:text-primary'}`}>
                                    <span className={`hover-sweep ${amber ? 'sweep-amber' : ''}`}>{item.title}</span>
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

function rolesAllowed(row: RbacRow): string {
    const roles = [
        row.admin && 'Admin',
        row.attorney && 'Attorney',
        row.paralegal && 'Paralegal',
        row.readOnly && 'Read-only',
    ].filter(Boolean);
    return roles.length === 4 ? 'All roles' : roles.join(', ');
}

function CapabilityCard({
    title,
    description,
    tone = 'primary',
    numbered = true,
}: CardItem & { tone?: 'primary' | 'compliance'; numbered?: boolean }) {
    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-18 bg-linear-to-b from-primary/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            {numbered && <SubsectionNumber tone={tone} className="relative" />}
            <h3
                className={`relative text-lg font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary ${numbered ? 'mt-4' : ''}`}
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

function SecurityCard({ title, description }: CardItem) {
    return (
        <article className="hover-crop crop-dark group flex h-full gap-4 rounded-2xl border border-white/10 bg-navy-light/40 p-5 transition-[translate,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-primary-light/30 hover:bg-navy-light/60 sm:p-6 motion-reduce:hover:translate-y-0">
            <SubsectionNumber tone="compliance" dark className="w-10 shrink-0 pt-1 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-primary-light [font-family:var(--font-display)]">
                    <span className="hover-sweep sweep-dark">{title}</span>
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-on-dark/80 [font-family:var(--font-body)]">
                    {description}
                </p>
            </div>
        </article>
    );
}

/* A closing rule of the versioning model, as a card with its mark in a thin
   amber seal. On hover the card takes registration marks and the seal fills. */
function RuleCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
    return (
        <article className="hover-crop crop-amber group flex h-full gap-4 rounded-xl border border-card-border bg-white p-5 shadow-sm transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-compliance/40 hover:shadow-md sm:p-6 motion-reduce:hover:translate-y-0">
            <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-compliance/40 text-compliance-ink transition-colors duration-300 group-hover:border-compliance group-hover:bg-compliance group-hover:text-white"
            >
                <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
            </span>
            <div className="min-w-0">
                <h3 className="text-base font-semibold text-text-primary transition-colors duration-300 group-hover:text-compliance-ink [font-family:var(--font-display)]">
                    <span className="hover-sweep sweep-amber">{title}</span>
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">{children}</p>
            </div>
        </article>
    );
}

function CoverageCell({ value }: { value: string }) {
    if (value === 'yes') {
        return (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success transition-transform duration-200 group-hover:scale-105">
                <Check className="h-4.5 w-4.5" aria-label="Available" />
            </span>
        );
    }
    /* Plain text, no pill: darker shades so the words pass 4.5:1. */
    const isEpo = value === 'EPO';
    return (
        <span className={`text-xs font-semibold [font-family:var(--font-mono)] ${isEpo ? 'text-emerald-700' : 'text-compliance-ink'}`}>
            {isEpo ? 'via EPO' : 'Paste'}
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

/* A support band as small caps over a coloured rule, not a filled pill. */
/* FIG. 2: the reviewer's report for one illustrative draft (the same
   adaptive sensor matter as the hero drawing). Each row is a draft unit with
   its band and the evidence the rating cites, which is what the four points
   beside it describe. Bands key sits in the footer. */
const REVIEW_ROWS: { unit: string; level: 'high' | 'medium' | 'low'; evidence: string }[] = [
    { unit: 'Claim 1', level: 'high', evidence: 'Supported by Ref. A, Smith ¶ [0031]' },
    { unit: 'Claim 2', level: 'medium', evidence: 'Quoted: "adjusts the sampling interval"; partial support' },
    { unit: 'Claim 3', level: 'high', evidence: 'Supported by Ref. B, Jones ¶ [0042]' },
    { unit: 'Abstract', level: 'high', evidence: 'Matches claim 1 scope' },
    { unit: 'Description', level: 'medium', evidence: 'Embodiment 2 has no cited support' },
    { unit: 'Novelty analysis', level: 'low', evidence: 'Ref. A ¶ [0031] reads on the controller step' },
];

function ReviewReportFigure({ className = '' }: { className?: string }) {
    return (
        <div className={`flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-sm ${className}`}>
            <div className="flex items-baseline justify-between gap-4 border-b border-card-border px-6 py-4">
                <span className="text-base leading-none tracking-[0.04em] text-navy-light [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                    Reviewer report
                </span>
                <span className="text-xs text-text-secondary [font-family:var(--font-mono)]">Adaptive sensor system · v2</span>
            </div>
            {/* Rows share the card's height evenly, so the card can stretch to
                match the list beside it. */}
            <ul className="grid flex-1 auto-rows-fr">
                {REVIEW_ROWS.map((row) => (
                    <li key={row.unit} className="grid grid-cols-[minmax(0,8.5rem)_5.5rem_minmax(0,1fr)] content-center items-baseline gap-x-4 border-b border-card-border px-6 py-4 max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-y-2">
                        <span className="text-sm font-semibold text-text-primary [font-family:var(--font-display)]">{row.unit}</span>
                        <span className="justify-self-start max-sm:justify-self-end">
                            <ConfidenceBand level={row.level} />
                        </span>
                        <span className="text-sm leading-snug text-text-secondary [font-family:var(--font-body)] max-sm:col-span-2">{row.evidence}</span>
                    </li>
                ))}
            </ul>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 px-6 py-4">
                <span className="text-sm leading-none tracking-[0.04em] text-navy-light [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                    Bands
                </span>
                <ConfidenceBand level="high" />
                <ConfidenceBand level="medium" />
                <ConfidenceBand level="low" />
            </div>
        </div>
    );
}

function ConfidenceBand({ level }: { level: 'high' | 'medium' | 'low' }) {
    const map = {
        high: { label: 'High', text: 'text-emerald-700', rule: 'border-success' },
        medium: { label: 'Medium', text: 'text-compliance-ink', rule: 'border-compliance' },
        low: { label: 'Low', text: 'text-red-700', rule: 'border-danger' },
    }[level];
    return (
        <span
            className={`border-b-2 pb-1 text-base font-semibold leading-none tracking-[0.04em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps] ${map.text} ${map.rule}`}
        >
            {map.label}
        </span>
    );
}
