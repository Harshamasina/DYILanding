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
import { RuledList, RuledItem } from '@/components/ui/RuledList';

/* The production set. The AI drafting page is the source of truth for this
   list: US, EP, IN, PCT (WO), JP, and CN all ship today. A jurisdiction not
   yet live can be marked planned. */
const JURISDICTIONS: { code: string; label: string; planned?: boolean }[] = [
    { code: 'US', label: 'USPTO' },
    { code: 'EP', label: 'EPO' },
    { code: 'IN', label: 'IPO' },
    { code: 'WO', label: 'WIPO' },
    { code: 'JP', label: 'JPO' },
    { code: 'CN', label: 'CNIPA' },
];

const TRUST_ITEMS = [
    'Confidential AI Processing',
    'Layered Prompt-Injection Defense',
    'Attorney Review Required',
    'Audit Trail per Draft',
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
                            <span className="accent-amend">Patent Drafting</span>
                        </h2>
                        <p
                            className="mt-4 max-w-[40rem] text-lg text-text-secondary leading-relaxed"
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
                                <DeferredMount className="relative w-full h-[440px] sm:h-[480px] lg:h-[520px]">
                                    <MockupHalo>
                                        <AnimatedAiDraftGeneration />
                                    </MockupHalo>
                                    {/* 402 Generate AI Draft, 404 the jurisdiction picker,
                                        406 the Review tab, 408 the History tab. */}
                                </DeferredMount>
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
                            </FadeIn>
                        </div>
                    </div>
                </div>

                {/* Safeguards: one ruled line, not a row of badges */}
                <FadeIn delay={0.1}>
                    <RuledList label="Safeguards" align="center" className="mt-16 lg:mt-24">
                        {TRUST_ITEMS.map((item) => (
                            <RuledItem key={item}>{item}</RuledItem>
                        ))}
                    </RuledList>
                </FadeIn>

                {/* ── CTA ── */}
                <FadeIn delay={0.15}>
                    <div className="mt-10 mx-auto flex w-full max-w-md flex-col justify-center gap-4 sm:max-w-none sm:flex-row">
                        <BookDemoButton topic="AI patent drafting" size="md" className="w-full justify-center sm:w-auto">
                            Book a Drafting Demo
                        </BookDemoButton>
                        <Button
                            href="/ai-patent-drafting/"
                            variant="link"
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
        title: 'First Draft in Under 5 Minutes',
        description: 'Select prior art references, describe your invention, and generate a full patent specification.',
    },
    {
        title: 'Jurisdiction-Specific Drafting Guidance',
        description: 'Configurable drafting guidance and templates for the production set (US, EP, IN, PCT/WO, JP, and CN) are applied to every generation.',
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

            <RuledList label="Jurisdictions">
                {JURISDICTIONS.map((j) => (
                    <RuledItem key={j.code}>
                        <span className="font-semibold text-primary [font-family:var(--font-mono)]">{j.code}</span>{' '}
                        <span className="text-text-secondary">{j.label}</span>
                        {j.planned && <span className="italic text-text-secondary"> (planned)</span>}
                    </RuledItem>
                ))}
            </RuledList>
            <p
                className="mt-3 text-xs text-text-muted"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                US, EP, IN, PCT (WO), JP, and CN are the production set today.
            </p>
        </div>
    );
}
