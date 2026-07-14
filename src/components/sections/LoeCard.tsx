import { ArrowRight, CalendarClock, Landmark, ShieldCheck, Sparkles } from 'lucide-react';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { FadeIn } from '@/components/motion/FadeIn';
import { LoeTimeline } from '@/components/ui/LoeTimeline';

interface Pillar {
    icon: React.ElementType;
    label: string;
    detail: string;
}

const PILLARS: Pillar[] = [
    { icon: ShieldCheck, label: 'Patent wall', detail: 'Latest granted patent expiry' },
    { icon: Landmark, label: 'Regulatory floor', detail: 'Latest active exclusivity end' },
    { icon: CalendarClock, label: 'Combined horizon', detail: 'The later of the two' },
];

/**
 * Loss of Exclusivity card: a glassmorphic panel carrying the in-app LOE
 * timeline. Rendered inside the operations section on /docketing/.
 */
export function LoeCard() {
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
                                <span
                                    className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 py-1 pl-1 pr-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/[0.08]"
                                    style={{ fontFamily: 'var(--font-mono)' }}
                                >
                                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                                        New
                                    </span>
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                                        Loss of Exclusivity timeline
                                    </span>
                                </span>

                                <h2
                                    id="loe-heading"
                                    className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    See When Exclusivity{' '}
                                    <span className="text-primary italic">Really Ends</span>
                                </h2>

                                <p
                                    className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    Docketing tells you what is due. The LOE timeline tells you what it is
                                    worth. Link every drug product to the patent families and regulatory
                                    exclusivities that protect it, then read the protection horizon per
                                    jurisdiction and indication.
                                </p>
                                <p
                                    className="mt-3 text-base leading-relaxed text-text-secondary"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    Before you let an annuity lapse, drop the family in the live what-if and
                                    watch every affected product recompute, so the blast radius is visible
                                    before the decision is made.
                                </p>
                            </div>

                            {/* Pillars */}
                            <ul className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
                                {PILLARS.map((pillar, i) => (
                                    <PillarChip key={pillar.label} pillar={pillar} index={i} />
                                ))}
                            </ul>
                        </div>

                        {/* In-app LOE timeline */}
                        <div className="relative mt-8 lg:mt-10">
                            <LoeTimeline />
                        </div>

                        {/* Footer: disclaimer and CTA */}
                        <div className="relative mt-6 flex flex-col gap-5 border-t border-white/70 pt-6 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:pt-7">
                            <p
                                className="max-w-md text-[11px] leading-relaxed text-text-muted"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Horizons are built from the dates your attorneys record. A portfolio
                                visualization, not a legal determination.
                            </p>

                            <BookDemoButton
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
    const Icon = pillar.icon;

    return (
        <li>
            <FadeIn delay={0.1 + index * 0.08} direction="up">
                <div className="group flex h-full items-start gap-3 rounded-xl border border-white/80 bg-white/70 p-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white/90 hover:shadow-md hover:shadow-primary/[0.06]">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-sm group-hover:shadow-primary/[0.08]">
                        <Icon
                            className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110"
                            aria-hidden="true"
                        />
                    </span>
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
