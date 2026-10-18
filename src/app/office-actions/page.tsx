import type { Metadata } from 'next';
import type { ElementType, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, FileCheck2, FileSearch, Fingerprint, GitCompare, ListChecks, LockKeyhole, PenLine, Quote, ScrollText, SlidersHorizontal, TriangleAlert } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { HeroAmbience } from '@/components/ui/HeroAmbience';
import { FadeIn } from '@/components/motion/FadeIn';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { OfficeActionHeroSvg } from '@/components/illustrations/OfficeActionHeroSvg';
import { OfficeActionApprovalPreview, OfficeActionEvidenceTrace, OfficeActionResponsePreview } from '@/components/illustrations/OfficeActionPreviews';
import { LimitationChartVisual, ProsecutionRecordVisual, ResponseStrategyVisual } from '@/components/illustrations/OfficeActionProsecutionVisuals';
import { AnimatedOfficeActionWorkflow } from '@/components/ui/AnimatedOfficeActionWorkflow';
import { OfficeActionJsonLd } from '@/components/seo/OfficeActionJsonLd';
import { DOCKETING_PAGE_URL, OFFICE_ACTIONS_PAGE_URL } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

export const metadata: Metadata = buildMetadata({
    title: 'Office Action Analysis and Response Software for USPTO Rejections',
    description: 'Connect examiner issues to claims and source passages, then prepare a structured response with supported amendments, attorney approval, and Word exports.',
    path: OFFICE_ACTIONS_PAGE_URL,
    ogKey: 'office-actions',
});

/* Scope follows DYIBackend's office-action implementation and as-built records.
   US only; model assistance depends on evaluated capabilities and workspace policy.
   Approval and filing remain attorney acts. Preview matter data is fictional. */
const FAQ: FaqItem[] = [
    {
        question: 'Which office actions are supported?',
        answer: 'Analysis reads USPTO communications including non-final and final rejections, advisory actions, and restriction and election requirements. A notice of allowance is recognized, with nothing to map. The response workspace supports replies under 37 CFR 1.111 and amendments after final under 37 CFR 1.116. Other jurisdictions are planned, starting with EP. RCE submissions, pre-appeal requests, and restriction responses are not yet supported.',
    },
    {
        question: 'How do I bring in the documents?',
        answer: 'Import a US application by application, patent, or publication number, or upload your documents. The analysis identifies the office action, examined claims, and available references. You confirm the record when a document or claim set is ambiguous. Missing or unreadable pages are flagged for review.',
    },
    {
        question: 'Which reference documents can it read?',
        answer: 'EP and WO publication text is fetched through EPO OPS, and US published applications through USPTO Open Data. Granted US patents and non-patent literature require an uploaded copy. The examiner’s PTO-892 reference list can be fetched to the case, but is not read by the analysis.',
    },
    {
        question: 'Can AI help draft arguments and amendments?',
        answer: 'Model-assisted issue restatements, amendment proposals, amendment assessments, and anticipation arguments are available only where the capability has completed its evaluation, the deployment enables it, and workspace policy permits it. The structured response workspace, claim listing, support links, and exports work without these drafting aids. Attorneys choose strategies and accept changes, and model-derived text cannot be approved until it passes an automated independent review.',
    },
    {
        question: 'Who reviews and approves the work?',
        answer: 'An authorized attorney signs the analysis after confirming their identity, and whoever last corrected the map cannot sign it. Response approval requires an authorized attorney who did not last revise the draft. Corrections and decisions are recorded with a reason, and approved content is locked. Model-derived response text must also pass an automated independent review, a separate model reading plus code checks, before approval.',
    },
    {
        question: 'What can I export, and does the software file?',
        answer: 'Word exports include analysis review drafts, evidence reports, signed issue maps, response review drafts, approved filing copies, and interview agendas. The attorney files separately in Patent Center and records the filing. The software does not submit the response to the USPTO.',
    },
    {
        question: 'Does it stay connected to the patent docket?',
        answer: 'Yes. The office action, analysis, and response belong to the docketed matter. Candidate response dates come from the docketing rules engine and require attorney confirmation; analysis does not overwrite the docket’s due date. Workspace policies and matter access controls apply throughout.',
    },
];

const INTAKE = [
    { icon: FileSearch, title: 'Import by number', text: 'Bring in a US application by application, patent, or publication number, or upload the papers directly.' },
    { icon: ListChecks, title: 'The examined claims as baseline', text: 'The claim set the examiner acted on anchors the chart and, later, the claim listing.' },
    { icon: Quote, title: 'References fetched where available', text: 'EP and WO text through EPO OPS, US publications through USPTO Open Data. Granted US patents and NPL are uploaded.' },
    { icon: TriangleAlert, title: 'Gaps flagged, never guessed', text: 'An ambiguous claim set waits for your confirmation, and missing or unreadable pages are flagged.' },
];
/* Claim parsing facts follow DYIBackend docs/features/CLAIM_PARSER.md. */
const CHART_RULES = [
    { title: 'Deterministic claim parsing', text: 'Claims are parsed without a model call. Numbering is never changed, and a multiple dependent claim keeps every dependency path.' },
    { title: 'Parse problems stop the chart', text: 'Duplicate or unnumbered claims and structural dependency errors, such as circular or unresolved references, are raised as blockers until the parse is corrected.' },
    { title: 'One reading per limitation, per reference', text: 'Each cited passage carries its own pinpoint, and every quotation is matched to the source text before it is stored.' },
    { title: 'Silence is not a finding', text: 'A limitation the examiner did not address is marked not addressed. It is never presented as proof the reference lacks it.' },
];
/* Strategy labels are the response pack's own; the pack limits them by issue type. */
const STRATEGIES = [
    { label: 'Amend and traverse', text: 'Narrow the claims and argue the rejection does not apply to them as amended.' },
    { label: 'Amend the claims', text: 'Overcome the issue by amendment, with the inserted language linked to support in the application as filed.' },
    { label: 'Traverse the rejection', text: 'Contest the examiner’s position without amendment, in remarks built on the record.' },
    { label: 'File a terminal disclaimer', text: 'Answer a nonstatutory double patenting rejection. Not offered against statutory double patenting.' },
    { label: 'Rewrite in independent form as indicated', text: 'Take up allowable subject matter in an objected-to claim. The rewrite is computed and previewed before you accept it.' },
];
const CLAIM_STATUSES = ['Original', 'Currently amended', 'Previously presented', 'New', 'Canceled', 'Withdrawn'];
const LISTING_CHECKS = [
    'Status identifiers and markings computed from your edits',
    'Possible antecedent basis gaps flagged on every claim change',
    'Numbering and dependencies checked across the listing',
    'Excess-claim counts shown as the listing changes',
];

const ANALYSIS_BENEFITS = [
    { title: 'An issue map you can review', text: 'See each rejection, the affected claims, and the references the examiner relies on.' },
    { title: 'Evidence beside the claim', text: 'Follow each limitation to a source passage, with quotations checked against the document.' },
    { title: 'Your judgment on the record', text: 'Correct readings, resolve warnings, and sign the analysis before starting the response.' },
];
const REVIEW_STEPS = [
    { icon: FileCheck2, title: 'Review the response', text: 'Resolve open issues, check citations, and confirm the support for amended claims.' },
    { icon: Fingerprint, title: 'Record attorney approval', text: 'A second attorney approves the response with an electronic signature, locking the content.' },
    { icon: ScrollText, title: 'Export the approved copy', text: 'Download a Word document. The attorney handles filing and records what was submitted.' },
];
const GOVERNANCE = [
    { icon: LockKeyhole, title: 'Matter access', text: 'Tenant isolation and optional matter walls keep sensitive work within the authorized team.' },
    { icon: SlidersHorizontal, title: 'AI policy', text: 'Restrict providers, require a region and retention level, and block AI for individual matters. Monthly AI usage is capped per workspace.' },
    { icon: Fingerprint, title: 'Audit history', text: 'Keep corrections, decisions, and signatures on the record, with the person and reason behind each act.' },
];

export default function OfficeActionsPage() {
    return (
        <main id="main-content" className="min-w-0 overflow-x-hidden">
            <section className="relative overflow-hidden bg-page-bg-alt pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-24">
                <HeroAmbience edge="bottom" />
                <Container className="relative z-10">
                    <nav aria-label="Breadcrumb" className="mb-8 lg:mb-10">
                        <ol className="flex items-center gap-2 text-sm text-text-muted">
                            <li><Link href="/" className="transition-colors hover:text-primary">Home</Link></li>
                            <li aria-hidden="true">/</li>
                            <li className="font-medium text-text-primary">Office Actions</li>
                        </ol>
                    </nav>
                    <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:gap-8 xl:gap-12">
                        <div className="relative z-10 max-w-3xl lg:max-w-[640px]">
                            <Eyebrow>Office Action Analysis and Response</Eyebrow>
                            <h1 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-[3.5rem]">
                                Office Action Analysis With <span className="text-primary italic">Response Drafting Built In</span>
                            </h1>
                            <p className="mt-5 text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg">
                                Turn a USPTO office action into a reviewed issue map, then build a response from the signed analysis. Connect rejections to claims and source passages, prepare supported amendments, and keep attorney decisions on the record.
                            </p>
                            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                                <BookDemoButton size="lg" className="justify-center">Book a Demo<ArrowRight className="h-5 w-5" aria-hidden="true" /></BookDemoButton>
                                <Button href="#record" variant="secondary" size="lg" className="justify-center">Explore Features</Button>
                            </div>
                            <p className="mt-4 text-xs leading-relaxed text-text-muted">Built for USPTO office actions</p>
                        </div>
                        <div className="pointer-events-none hidden lg:flex lg:w-full lg:justify-end"><OfficeActionHeroSvg /></div>
                    </div>
                </Container>
                <Container className="relative z-10 mt-12 sm:mt-16">
                    <MockupHalo><AnimatedOfficeActionWorkflow /></MockupHalo>
                </Container>
                <Container className="relative z-10 mt-8 sm:mt-10">
                    <FadeIn delay={0.1}>
                        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted [font-family:var(--font-mono)]">One connected matter</span>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['Source Record', 'Issue Map', 'Signed Analysis', 'Response'].map(label => <span key={label} className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-white/80 px-3 py-1.5 text-xs font-medium text-text-secondary shadow-sm [font-family:var(--font-mono)]"><span className="h-1.5 w-1.5 rounded-full bg-primary/60" />{label}</span>)}
                            </div>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            {/* ── The prosecution record: what the analysis reads ── */}
            <section id="record" className="relative scroll-mt-24 overflow-hidden bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <HeroAmbience edge="top" />
                <Container className="relative z-10">
                    <SectionIntro eyebrow="The prosecution record" title="Start From the Record the Examiner Acted On">
                        A response is only as strong as the record behind it. The analysis keeps the office action, the examined claim set, and the application as filed in their own roles, so every later reading points back to the right paper.
                    </SectionIntro>
                    <FadeIn delay={0.05}><div className="mt-10 lg:mt-12"><ProsecutionRecordVisual /></div></FadeIn>
                    <div className="mt-10 grid gap-x-8 gap-y-6 border-t border-card-border pt-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
                        {INTAKE.map(({ icon: Icon, title, text }, i) => (
                            <FadeIn key={title} delay={i * 0.06}>
                                <div className="group -m-3 flex gap-3 rounded-xl p-3 transition-colors duration-300 hover:bg-white">
                                    <Icon className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                                    <div>
                                        <h3 className="text-sm font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary">{title}</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{text}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            <section id="issue-map" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-24 lg:py-28">
                <Container className="relative z-10">
                    <SectionIntro eyebrow="Source-linked analysis" title="Every Examiner Issue Connected to the Record">
                        See each rejection, the claims it affects, and the passages behind it. The issue map brings the examiner’s position and the supporting source text into one reviewable record.
                    </SectionIntro>
                    <FadeIn delay={0.05}><div className="mt-10 lg:mt-12"><OfficeActionEvidenceTrace /></div></FadeIn>
                    <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-3">
                        {ANALYSIS_BENEFITS.map((item, i) => <FadeIn key={item.title} delay={i * 0.06} className="h-full"><CapabilityCard icon={[ListChecks, Quote, Fingerprint][i]} title={item.title} description={item.text} /></FadeIn>)}
                    </div>
                    <FadeIn>
                        <details className="group mt-8 border-t border-card-border pt-5">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">Explore Analysis Coverage<ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" /></summary>
                            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-text-secondary">
                                <p>Prior-art rejections, eligibility, Section 112 issues, double patenting, objections, and procedural outcomes are grouped in the issue map. Claim charts compare limitations against cited references; missing sources and unresolved readings remain visible for attorney review.</p>
                                <a href="#faq" className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline">See Document and Jurisdiction Coverage<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
                            </div>
                        </details>
                    </FadeIn>
                </Container>
            </section>

            {/* ── Claim chart: the examiner's mapping, limitation by limitation ── */}
            <section id="claim-chart" className="relative scroll-mt-24 overflow-hidden bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
                        <div className="lg:sticky lg:top-28">
                            <SectionIntro eyebrow="Claim charts" title="Read the Rejection Limitation by Limitation">
                                Each claim is broken into labeled limitations and charted against every reference the examiner relies on. See where the examiner’s mapping holds, where it is partial, and where it says nothing.
                            </SectionIntro>
                            <ol className="mt-8 space-y-5">
                                {CHART_RULES.map(({ title, text }, i) => (
                                    <li key={title}>
                                        <FadeIn delay={i * 0.06} className="group flex gap-4">
                                            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-white text-xs font-semibold text-primary transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white [font-family:var(--font-mono)]">{String(i + 1).padStart(2, '0')}</span>
                                            <div>
                                                <h3 className="text-base font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary">{title}</h3>
                                                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{text}</p>
                                            </div>
                                        </FadeIn>
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <FadeIn delay={0.1}>
                            <div className="relative">
                                <div aria-hidden="true" className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-primary/[0.05] blur-3xl" />
                                <div className="relative"><LimitationChartVisual /></div>
                            </div>
                        </FadeIn>
                    </div>
                </Container>
            </section>

            {/* ── Strategy: one recorded choice per ground of rejection ── */}
            <section id="strategy" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
                <Container>
                    <SectionIntro eyebrow="Response strategy" title="Choose a Strategy for Every Ground of Rejection">
                        Every issue in the signed analysis gets a recorded strategy before the drafting starts. The choice shapes the response sections, and the reasoning stays with the issue for the reviewing attorney.
                    </SectionIntro>
                    <FadeIn delay={0.05}><div className="mt-10 lg:mt-12"><ResponseStrategyVisual /></div></FadeIn>
                    <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-card-border bg-card-border sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
                        {STRATEGIES.map(({ label, text }, i) => (
                            <FadeIn key={label} delay={i * 0.05} className="h-full">
                                <article className="group relative h-full bg-white p-6 transition-colors duration-300 hover:bg-primary/[0.02]">
                                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-primary [font-family:var(--font-mono)]">{label}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-text-secondary transition-colors duration-300 group-hover:text-text-primary">{text}</p>
                                </article>
                            </FadeIn>
                        ))}
                        <FadeIn delay={STRATEGIES.length * 0.05} className="h-full">
                            <div className="flex h-full items-start gap-3 bg-primary/[0.04] p-6">
                                <Fingerprint className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                                <p className="text-sm leading-relaxed text-text-secondary"><span className="font-semibold text-text-primary">Counsel decides.</span> Only strategies the US rule pack permits for the issue type are offered, and only an attorney selects one.</p>
                            </div>
                        </FadeIn>
                    </div>
                </Container>
            </section>

            <section id="response" className="scroll-mt-24 bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <Container>
                    <SectionIntro eyebrow="Structured response drafting" title="Build the Response From the Signed Analysis">
                        Carry reviewed issues into a structured draft. Keep your strategy, claim changes, and disclosure support connected as you prepare the reply.
                    </SectionIntro>
                    <div className="mt-12 grid items-start gap-6 lg:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <FadeIn className="h-full"><CapabilityCard icon={GitCompare} title="Compared With Your Patent Draft" description="Line up the examined claims against the linked patent draft, claim by claim, to see how prosecution has moved them." /></FadeIn>
                            <FadeIn delay={0.06} className="h-full"><CapabilityCard icon={PenLine} title="Consistent Claim Amendments" description="Claim statuses and amendment markup are computed from your edits, with numbering and dependencies checked." /></FadeIn>
                            <FadeIn delay={0.12} className="h-full"><CapabilityCard icon={FileSearch} title="Support From the Disclosure" description="Link inserted language to passages in the application as filed, which an attorney confirms. Added words no cited passage holds are flagged before approval." /></FadeIn>
                            <FadeIn delay={0.18} className="h-full"><CapabilityCard icon={ScrollText} title="A Structured Starting Point" description="Carry issues, claims, references, and examiner quotations into response sections for attorney drafting and review." /></FadeIn>
                        </div>
                        <FadeIn delay={0.1}><OfficeActionResponsePreview /></FadeIn>
                    </div>
                    <FadeIn delay={0.05}>
                        <div className="mt-10 grid gap-8 rounded-2xl border border-primary/15 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
                            <div>
                                <h3 className="text-xl font-semibold text-text-primary">A Claim Listing Built to 37 CFR 1.121(c)</h3>
                                <p className="mt-3 text-sm leading-relaxed text-text-secondary">Amend, cancel, withdraw, or add claims, and the listing follows. Every claim carries its status identifier, with insertions underlined and deletions struck through.</p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {CLAIM_STATUSES.map(status => <span key={status} className="rounded-md border border-card-border bg-page-bg-alt px-2.5 py-1 text-xs text-text-secondary [font-family:var(--font-mono)]">({status})</span>)}
                                </div>
                            </div>
                            <ul className="space-y-3 lg:border-l lg:border-card-border lg:pl-12">
                                {LISTING_CHECKS.map(check => (
                                    <li key={check} className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary">
                                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/[0.08] text-primary"><Check className="h-3 w-3" aria-hidden="true" /></span>
                                        {check}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-card-border bg-white p-5">
                            <SlidersHorizontal className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                            <p className="text-sm leading-relaxed text-text-secondary"><span className="font-semibold text-text-primary">Model assistance, under your control.</span> AI drafting aids depend on evaluated capabilities and workspace policy. Attorneys select strategies and accept amendments. <a href="#faq" className="font-semibold text-primary underline-offset-4 hover:underline">See Availability</a>.</p>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            <section id="approval" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
                <Container>
                    <SectionIntro eyebrow="Review, approval, and exports" title="Attorney Sign-Off Before the Final Copy">
                        Move from a review draft to an approved response with clear checks and a recorded signature. Approved content is locked, and filing remains with the attorney.
                    </SectionIntro>
                    <div className="mt-12 grid items-center gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
                        <div className="grid gap-5">
                            {REVIEW_STEPS.map(({ icon, title, text }, i) => <FadeIn key={title} delay={i * 0.06}><CapabilityCard icon={icon} title={title} description={text} /></FadeIn>)}
                        </div>
                        <FadeIn delay={0.1}><OfficeActionApprovalPreview /></FadeIn>
                    </div>
                    <FadeIn delay={0.1}>
                        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-card-border bg-page-bg-alt p-5 sm:flex-row sm:items-center sm:gap-6">
                            <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-text-primary"><FileCheck2 className="h-5 w-5 text-primary" aria-hidden="true" />Word Exports</span>
                            <p className="text-sm leading-relaxed text-text-secondary">Issue maps, evidence reports, response review drafts, approved filing copies, and interview agendas.</p>
                        </div>
                    </FadeIn>
                </Container>
            </section>

            <section id="governance" className="scroll-mt-24 bg-navy py-20 sm:py-24 lg:py-28">
                <Container>
                    <SectionIntro eyebrow="Audit, security, and control" title="Built for Privileged Prosecution Work" dark>
                        The same access controls and audit history that protect your docket extend to every office action analysis and response.
                    </SectionIntro>
                    <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-3">
                        {GOVERNANCE.map(({ icon: Icon, title, text }, i) => (
                            <FadeIn key={title} delay={i * 0.06} className="h-full">
                                <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-navy-light/40 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-light/25 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-primary/[0.05]">
                                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-primary-light/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-primary-light/25 group-hover:bg-primary-light/10 group-hover:shadow-sm group-hover:shadow-primary/[0.05]"><Icon className="h-5 w-5 text-primary-light transition-transform duration-300 group-hover:scale-105" aria-hidden="true" /></span>
                                    <h3 className="relative mt-4 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-primary-light">{title}</h3>
                                    <p className="relative mt-2 text-sm leading-relaxed text-text-on-dark/80">{text}</p>
                                </article>
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            <section id="faq" className="scroll-mt-24 py-20 sm:py-24 lg:py-28">
                <Container>
                    <FadeIn><div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16"><h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">Office Action Questions</h2><p className="mt-4 text-lg leading-relaxed text-text-secondary">Coverage, documents, and how your team stays in control.</p></div></FadeIn>
                    <FadeIn delay={0.1}><FaqAccordion items={FAQ} /></FadeIn>
                </Container>
            </section>

            <section className="py-16 sm:py-20 lg:py-24">
                <Container>
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl">See It on Your Next Office Action</h2>
                        <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">Explore the analysis and response workflow on a published US application of your choice.</p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            <BookDemoButton size="lg" className="w-full justify-center sm:w-auto">Book a Demo<ArrowRight className="h-5 w-5" aria-hidden="true" /></BookDemoButton>
                            <Button href={DOCKETING_PAGE_URL} variant="secondary" size="lg" className="w-full justify-center sm:w-auto">Explore Patent Docketing</Button>
                        </div>
                    </div>
                </Container>
            </section>
            <OfficeActionJsonLd faq={FAQ} />
        </main>
    );
}

function Eyebrow({ children }: { children: ReactNode }) {
    return <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary [font-family:var(--font-mono)]">{children}</span>;
}

function SectionIntro({ eyebrow, title, children, dark = false }: { eyebrow: string; title: string; children: ReactNode; dark?: boolean }) {
    return <FadeIn><div className="max-w-3xl"><span className={`text-xs font-bold uppercase tracking-[0.15em] [font-family:var(--font-mono)] ${dark ? 'text-primary-light' : 'text-primary'}`}>{eyebrow}</span><h2 className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${dark ? 'text-white' : 'text-text-primary'}`}>{title}</h2><p className={`mt-4 text-lg leading-relaxed ${dark ? 'text-text-on-dark' : 'text-text-secondary'}`}>{children}</p></div></FadeIn>;
}

function CapabilityCard({ icon: Icon, title, description }: { icon: ElementType; title: string; description: string }) {
    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.05]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-18 bg-linear-to-b from-primary/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-sm group-hover:shadow-primary/[0.06]"><Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-105" aria-hidden="true" /></div>
            <h3 className="relative mt-4 text-lg font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary">{title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
        </article>
    );
}

