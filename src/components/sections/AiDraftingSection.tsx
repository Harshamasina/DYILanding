import {
    Lock,
    Shield,
    UserCheck,
    ClipboardList,
} from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AnimatedAiDraftGeneration } from '@/components/ui/AnimatedAiDraftGeneration';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { DeferredMount } from '@/components/motion/DeferredMount';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { FadeIn } from '@/components/motion/FadeIn';
import { SectionMark } from '@/components/ui/SectionMark';
import { ReferenceList, type ReferenceItem } from '@/components/ui/ReferenceList';
import { FigureCaption } from '@/components/ui/FigureCaption';

/* Production set first, planned jurisdictions marked. The AI drafting page
   is the source of truth for this list: US, EP, IN, and PCT (WO) ship today,
   JP and CN are planned. */
const JURISDICTIONS: { code: string; label: string; color: string; planned?: boolean }[] = [
    { code: 'US', label: 'USPTO', color: '#dc2626' },
    { code: 'EP', label: 'EPO', color: '#6366f1' },
    { code: 'IN', label: 'IPO', color: '#d97706' },
    { code: 'WO', label: 'WIPO', color: '#0ea5e9' },
    { code: 'JP', label: 'JPO', color: '#059669', planned: true },
    { code: 'CN', label: 'CNIPA', color: '#dc2626', planned: true },
];

const TRUST_ITEMS = [
    { icon: Shield, label: 'Confidential AI Processing' },
    { icon: Lock, label: '5-Layer Prompt Defense' },
    { icon: UserCheck, label: 'Attorney Review Required' },
    { icon: ClipboardList, label: 'Complete Audit Trail' },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function AiDraftingSection() {
    return (
        <section
            id="ai-drafting"
            className="relative overflow-hidden py-24 lg:py-32"
        >
            <Container>
                {/* ── Section Heading ── */}
                <SectionMark id="tree-ai" className="mb-6">
                    AI Drafting
                </SectionMark>
                <FadeIn treeNode="tree-ai">
                    <div className="max-w-3xl mb-16 lg:mb-20">
                        <h2
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            AI-Powered{' '}
                            <span className="italic">Patent Drafting</span>
                        </h2>
                        <p
                            className="mt-4 text-lg text-text-secondary leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Turn the prior art you have selected into a structured first draft for attorney review in under 5 minutes. Every draft is configured for the drafting conventions of the target jurisdiction, requires attorney review before it can be exported or filed, and is captured in a complete audit trail.
                        </p>
                    </div>
                </FadeIn>

                {/* ── Sub-sections ── */}
                <div className="space-y-20 lg:space-y-28">
                    {/* ─── AI Draft Generation: Mockup left, Text right ─── */}
                    <div className="figure-group">
                        {/* Desktop */}
                        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
                            <FadeIn delay={0.2}>
                                <DraftingContent />
                            </FadeIn>
                            <FadeIn delay={0.1}>
                                <DeferredMount className="w-full h-[440px] sm:h-[480px] lg:h-[520px]">
                                    <MockupHalo>
                                        <AnimatedAiDraftGeneration />
                                    </MockupHalo>
                                </DeferredMount>
                                <FigureCaption className="mt-5">AI draft workspace with claim review</FigureCaption>
                            </FadeIn>
                        </div>
                        {/* Mobile */}
                        <div className="lg:hidden space-y-8">
                            <FadeIn>
                                <DraftingContent />
                            </FadeIn>
                            <FadeIn delay={0.15}>
                                <DeferredMount className="w-full h-[440px] sm:h-[480px] lg:h-[520px]">
                                    <MockupHalo>
                                        <AnimatedAiDraftGeneration />
                                    </MockupHalo>
                                </DeferredMount>
                                <FigureCaption className="mt-5">AI draft workspace with claim review</FigureCaption>
                            </FadeIn>
                        </div>
                    </div>
                </div>

                {/* ── Trust Strip ── */}
                <FadeIn delay={0.1}>
                    <div className="mt-16 lg:mt-24 flex flex-wrap items-center justify-center gap-3 lg:gap-4">
                        {TRUST_ITEMS.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center gap-2.5 px-5 py-3 sm:px-6 sm:py-3.5 rounded-lg border border-primary/15 bg-primary/3"
                            >
                                <item.icon
                                    className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-primary shrink-0"
                                    strokeWidth={1.75}
                                />
                                <span
                                    className="text-xs sm:text-sm font-semibold text-text-primary"
                                    style={{ fontFamily: 'var(--font-mono)' }}
                                >
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                {/* ── CTA ── */}
                <FadeIn delay={0.15}>
                    <div className="mt-10 mx-auto flex w-full max-w-md flex-col justify-center gap-4 sm:max-w-none sm:flex-row">
                        <BookDemoButton size="md" className="w-full justify-center sm:w-auto">
                            Book a Drafting Demo
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </BookDemoButton>
                        <Button
                            href="/ai-patent-drafting/"
                            variant="outline"
                            size="md"
                            className="group/cta w-full justify-center sm:w-auto"
                        >
                            View AI Drafting Features
                            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                        </Button>
                    </div>
                </FadeIn>
            </Container>
        </section>
    );
}


const DRAFTING_CARDS: ReferenceItem[] = [
    {
        title: 'Draft in Under 5 Minutes',
        description: 'Select prior art references, describe your invention, and generate a full patent specification.',
    },
    {
        title: 'Jurisdiction-Specific Drafting Guidance',
        description: 'Configurable drafting guidance and templates for the production set (US, EP, IN, and PCT/WO) are applied to every generation.',
    },
    {
        title: 'Mandatory Attorney Review',
        description: 'Every AI-generated draft includes a disclaimer and requires human sign-off before filing.',
    },
    {
        title: 'Version Control & Append-Only Snapshots',
        description: 'Generate V1, review, add instructions, regenerate V2. Each version is kept as a separate, non-editable record.',
    },
];

function DraftingContent() {
    return (
        <div>
            <h3
                className="text-2xl font-bold text-text-primary sm:text-3xl mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                From Prior Art to First Draft, With Attorney Review Built In
            </h3>
            <ReferenceList items={DRAFTING_CARDS} className="mb-6" />

            {/* Jurisdiction Badges */}
            <div className="flex flex-wrap gap-2">
                {JURISDICTIONS.map((j) => (
                    <div
                        key={j.code}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-card-border bg-card-bg"
                    >
                        <span
                            className="text-xs font-bold"
                            style={{ fontFamily: 'var(--font-mono)', color: j.color }}
                        >
                            {j.code}
                        </span>
                        <span
                            className="text-xs text-text-secondary"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {j.label}
                        </span>
                        {j.planned && (
                            <span
                                className="rounded bg-text-muted/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Planned
                            </span>
                        )}
                    </div>
                ))}
            </div>
            <p
                className="mt-3 text-xs text-text-muted"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                US, EP, IN, and PCT (WO) are the production set today. JP and CN are planned.
            </p>
        </div>
    );
}
