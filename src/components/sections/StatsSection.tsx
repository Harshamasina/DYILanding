'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Layers,
    Users,
    ShieldCheck,
    ClipboardCheck,
    Database,
    DollarSign,
    Globe,
    type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';

interface Stat {
    value: number;
    prefix?: string;
    suffix: string;
    label: string;
    sublabel: string;
    icon?: LucideIcon;
    /** Override for non-numeric headlines (e.g. "21 CFR Part 11"). Renders
     *  as a single chunk at a more compact size so longer phrases don't
     *  wrap word-by-word and throw off card alignment. */
    display?: string;
}

type StatsVariant = 'cards' | 'minimal';
type NumberFont = 'mono' | 'display';

interface StatsSectionProps {
    stats: Stat[];
    variant?: StatsVariant;
    className?: string;
    /** Eyebrow label rendered above the grid (e.g., "Platform at a Glance"). */
    eyebrow?: string;
    /** Tree-spine anchor id used by the global page tree to track this section. */
    treeNode?: string;
    /** Font family for the headline number — 'mono' (default) or 'display' (Playfair). */
    numberFont?: NumberFont;
}

const FONT_VAR: Record<NumberFont, string> = {
    mono: 'var(--font-mono)',
    display: 'var(--font-display)',
};

/* useLayoutEffect warns during the static export prerender, so fall back to
   useEffect on the server where layout effects are a no-op anyway. */
const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useCountUp(target: number, isVisible: boolean, duration = 1500) {
    /* Seeded with the final value so the exported HTML, search crawlers, and
       no-JS visitors read the real number rather than a placeholder 0. On the
       client the value drops to 0 before first paint and counts up once the
       section scrolls into view. */
    const [count, setCount] = useState(target);
    const [canAnimate, setCanAnimate] = useState(false);
    const hasAnimated = useRef(false);

    useIsomorphicLayoutEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;

        setCount(0);
        setCanAnimate(true);
    }, []);

    useEffect(() => {
        if (!canAnimate || !isVisible || hasAnimated.current) return;
        hasAnimated.current = true;

        const startTime = performance.now();

        function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }, [canAnimate, isVisible, target, duration]);

    return count;
}

function StatCard({
    stat,
    isVisible,
    numberFont = 'mono',
}: {
    stat: Stat;
    isVisible: boolean;
    numberFont?: NumberFont;
}) {
    const count = useCountUp(stat.value, isVisible);
    const Icon = stat.icon;
    const fontFamily = FONT_VAR[numberFont];

    return (
        <div className="h-full p-4 sm:p-5 lg:p-6 rounded-2xl border border-card-border bg-card-bg shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col">
            {/* Icon + headline row — items-start keeps icons aligned across cards
                even if one card's headline renders at a different size. */}
            <div className="flex items-start gap-3 sm:gap-4">
                {Icon && (
                    <div
                        className="shrink-0 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(99,102,241,0.08)]"
                        aria-hidden="true"
                    >
                        <Icon
                            className="w-5 h-5 lg:w-6 lg:h-6 text-primary"
                            strokeWidth={1.75}
                        />
                    </div>
                )}
                <div className="min-w-0 flex items-center h-11 sm:h-12 lg:h-14">
                    {stat.display ? (
                        <span
                            className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold text-primary tracking-tight leading-none whitespace-nowrap"
                            style={{ fontFamily }}
                        >
                            {stat.display}
                        </span>
                    ) : (
                        <div className="flex items-baseline gap-0.5">
                            {stat.prefix && (
                                <span
                                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary"
                                    style={{ fontFamily }}
                                >
                                    {stat.prefix}
                                </span>
                            )}
                            <span
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-none"
                                style={{ fontFamily }}
                            >
                                {count}
                            </span>
                            <span
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary"
                                style={{ fontFamily }}
                            >
                                {stat.suffix}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <p
                className="mt-3 sm:mt-4 text-sm sm:text-base font-semibold text-text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {stat.label}
            </p>
            <p
                className="mt-1 text-xs sm:text-sm text-text-muted"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {stat.sublabel}
            </p>
        </div>
    );
}

function StatMinimal({ stat, isVisible }: { stat: Stat; isVisible: boolean }) {
    const count = useCountUp(stat.value, isVisible);

    return (
        <div className="text-center py-4">
            <div className="flex items-baseline justify-center gap-0.5">
                {stat.prefix && (
                    <span
                        className="text-3xl lg:text-4xl font-bold text-primary"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        {stat.prefix}
                    </span>
                )}
                <span
                    className="text-5xl lg:text-6xl font-bold text-text-primary tracking-tight"
                    style={{ fontFamily: 'var(--font-mono)' }}
                >
                    {count}
                </span>
                <span
                    className="text-3xl lg:text-4xl font-bold text-text-primary"
                    style={{ fontFamily: 'var(--font-mono)' }}
                >
                    {stat.suffix}
                </span>
            </div>
            <p
                className="mt-2 text-sm font-semibold text-text-primary"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {stat.label}
            </p>
            <p
                className="mt-1 text-xs text-text-muted"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {stat.sublabel}
            </p>
        </div>
    );
}

export function StatsSection({
    stats,
    variant = 'cards',
    className = '',
    eyebrow,
    treeNode,
    numberFont = 'mono',
}: StatsSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        const current = sectionRef.current;
        if (current) {
            observer.observe(current);
        }

        return () => {
            if (current) {
                observer.unobserve(current);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className={`py-20 lg:py-24 ${className}`}>
            <Container>
                {eyebrow && (
                    <div
                        id={treeNode}
                        className="flex items-center gap-3 mb-8 lg:mb-10"
                    >
                        <span
                            className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            {eyebrow}
                        </span>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                    {stats.map((stat, i) => (
                        <FadeIn key={stat.label} delay={i * 0.1} className="h-full">
                            {variant === 'cards' ? (
                                <StatCard
                                    stat={stat}
                                    isVisible={isVisible}
                                    numberFont={numberFont}
                                />
                            ) : (
                                <StatMinimal stat={stat} isVisible={isVisible} />
                            )}
                        </FadeIn>
                    ))}
                </div>
            </Container>
        </section>
    );
}

/* Pre-defined stat sets — all numbers are real product capabilities */
export const HERO_STATS: Stat[] = [
    {
        value: 7,
        suffix: '',
        label: 'Core Patent Modules',
        sublabel: 'Families, PRV, PCT, NPE & more',
        icon: Layers,
    },
    {
        value: 5,
        suffix: '',
        label: 'User Roles',
        sublabel: 'granular RBAC built in',
        icon: Users,
    },
    {
        value: 21,
        suffix: '',
        prefix: '',
        label: 'CFR Part 11-Aligned Controls',
        sublabel: 'Reason-for-change, e-signature, audit history',
        icon: ShieldCheck,
    },
    {
        value: 100,
        suffix: '%',
        label: 'Critical Actions Logged',
        sublabel: 'append-only change history',
        icon: ClipboardCheck,
    },
];

export const PRODUCT_STATS: Stat[] = [
    {
        value: 120,
        suffix: 'M+',
        label: 'Patent Records Searchable',
        sublabel: 'across 100+ patent authorities',
        icon: Database,
    },
    {
        value: 42,
        suffix: '+',
        label: 'Fee Types Tracked',
        sublabel: 'across 8 categories',
        icon: DollarSign,
    },
    {
        value: 4,
        suffix: '',
        label: 'Drafting Jurisdictions',
        sublabel: 'US, EP, IN, WO (JP and CN planned)',
        icon: Globe,
    },
    {
        value: 100,
        suffix: '%',
        label: 'Audit Coverage',
        sublabel: 'critical actions fully traceable',
        icon: ClipboardCheck,
    },
];
