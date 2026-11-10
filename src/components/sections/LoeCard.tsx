import { ArrowRight } from 'lucide-react';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { FadeIn } from '@/components/motion/FadeIn';
import { LoeTimeline } from '@/components/ui/LoeTimeline';
import { FigureCaption } from '@/components/ui/FigureCaption';

interface Pillar {
    label: string;
    detail: string;
}

const PILLARS: Pillar[] = [
    { label: 'Patent wall', detail: 'Latest granted patent expiry' },
    { label: 'Regulatory floor', detail: 'Latest active exclusivity end' },
    { label: 'Combined horizon', detail: 'The later of the two' },
];

/**
 * Loss of Exclusivity card: a glassmorphic panel carrying the in-app LOE
 * timeline. Rendered inside the operations section on /docketing/.
 */
export function LoeCard({ note }: { note?: string }) {
    return (
        <div className="relative">
            <div className="relative z-10">
                <FadeIn>
                    <div className="group/panel relative overflow-hidden rounded-3xl border border-card-border bg-white/80 p-6 shadow-xl shadow-primary/[0.05] ring-1 ring-primary/[0.06] backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/[0.09] hover:ring-primary/15 sm:p-8 lg:p-10">
                        {/* Soft indigo bloom, fading out well inside the panel */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 opacity-70"
                            style={{
                                background:
                                    'radial-gradient(120% 80% at 100% 0%, rgba(99,102,241,0.10) 0%, rgba(99,102,241,0.04) 35%, rgba(255,255,255,0) 70%)',
                            }}
                        />

                        <div className="relative">
                            {/* Copy */}
                            <div className="min-w-0 max-w-3xl">
                                {/* A plain tab, drawn like the section mark, instead of a filled pill */}
                                {/* Tab, label and note share one line, wrapping on phones. */}
                                <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                    <span className="rounded-[3px] border border-primary/30 bg-primary/[0.04] px-2 pt-1 pb-1.5 text-base leading-none tracking-[0.1em] text-primary [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                                        New
                                    </span>
                                    <span className="text-base leading-none tracking-[0.1em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps] text-navy-light">
                                        Loss of Exclusivity timeline
                                    </span>
                                    {note && (
                                        <span className="text-sm italic text-slate-600 [font-family:var(--font-body)]">{note}</span>
                                    )}
                                </span>

                                <h2
                                    id="loe-heading"
                                    className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    See When Exclusivity{' '}
                                    <span className="italic">Really Ends</span>
                                </h2>

                                <p
                                    className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    Docketing tells you what is due. The LOE timeline tells you what it is
                                    worth. Link every drug product to the patent families and regulatory
                                    exclusivities that protect it, then read the protection horizon per
                                    jurisdiction and indication.
                                </p>
                                <p
                                    className="mt-3 text-base leading-relaxed text-slate-600"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    Before you let an annuity lapse, drop the family in the live what-if and
                                    watch every affected product recompute, so the blast radius is visible
                                    before the decision is made.
                                </p>
                            </div>

                            {/* Pillars */}
                            <ul className="mt-8 grid border-t border-card-border sm:grid-cols-3 sm:gap-x-6">
                                {PILLARS.map((pillar, i) => (
                                    <PillarChip key={pillar.label} pillar={pillar} index={i} />
                                ))}
                            </ul>
                        </div>

                        {/* In-app LOE timeline */}
                        <div className="figure-group relative mt-8 lg:mt-10">
                            <LoeTimeline />
                            <FigureCaption className="mt-5">Protection horizon for one drug product, by jurisdiction</FigureCaption>
                        </div>

                        {/* Footer: disclaimer and CTA */}
                        <div className="relative mt-6 flex flex-col gap-5 border-t border-white/70 pt-6 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:pt-7">
                            <p
                                className="max-w-md text-xs leading-relaxed text-slate-600"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Horizons are built from the dates your attorneys record. A portfolio
                                visualization, not a legal determination.
                            </p>

                            <BookDemoButton
                                topic="the Loss of Exclusivity timeline"
                                size="lg"
                                className="w-full shrink-0 justify-center sm:w-auto"
                            >
                                Book a Demo
                                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/panel:translate-x-0.5" />
                            </BookDemoButton>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}

function PillarChip({ pillar, index }: { pillar: Pillar; index: number }) {
    return (
        <li>
            <FadeIn delay={0.1 + index * 0.08} direction="up">
                <div className="group flex h-full items-start gap-3 border-b border-card-border py-3.5">
                    <span className="min-w-0">
                        <span
                            className="block text-[13px] font-semibold text-text-primary transition-colors duration-300 group-hover:text-primary"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            {pillar.label}
                        </span>
                        <span
                            className="mt-0.5 block text-xs leading-relaxed text-text-secondary"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {pillar.detail}
                        </span>
                    </span>
                </div>
            </FadeIn>
        </li>
    );
}
