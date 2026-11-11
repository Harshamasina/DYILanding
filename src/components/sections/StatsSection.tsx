'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';

interface Stat {
    value: number;
    prefix?: string;
    suffix: string;
    label: string;
    sublabel: string;
    /** Override for non-numeric headlines (e.g. "21 CFR Part 11"). Renders
     *  as a single chunk at a more compact size so longer phrases stay on
     *  one line. */
    display?: string;
    /** The one compliance figure in a band, shown in amber. One per band at most. */
    accent?: boolean;
}

/* Both variants render the same ruled strip, like the summary line of a
   docket report. 'minimal' centres each figure and drops the sublabel. */
type StatsVariant = 'cards' | 'minimal';
type NumberFont = 'mono' | 'display';

interface StatsSectionProps {
    stats: Stat[];
    variant?: StatsVariant;
    className?: string;
    /** Label rendered above the strip (e.g., "Platform at a Glance"). */
    eyebrow?: string;
    /** Tree-spine anchor id used by the global page tree to track this section. */
    treeNode?: string;
    /** Font family for the headline number: 'display' (Playfair, default) or 'mono'. */
    numberFont?: NumberFont;
}

const FONT_CLASS: Record<NumberFont, string> = {
    mono: '[font-family:var(--font-mono)]',
    display: '[font-family:var(--font-display)]',
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

function StatFigure({
    stat,
    isVisible,
    numberFont,
    minimal,
}: {
    stat: Stat;
    isVisible: boolean;
    numberFont: NumberFont;
    minimal: boolean;
}) {
    const count = useCountUp(stat.value, isVisible);
    const font = FONT_CLASS[numberFont];
    const tone = stat.accent ? 'text-compliance' : 'text-text-primary';

    return (
        <div className={`flex h-full flex-col ${minimal ? 'items-center text-center' : ''}`}>
            {stat.display ? (
                <span className={`text-2xl font-semibold leading-none tracking-tight whitespace-nowrap sm:text-3xl lg:text-[2.25rem] ${tone} ${font}`}>
                    {stat.display}
                </span>
            ) : (
                <span className={`flex items-baseline leading-none tabular-nums ${tone} ${font}`}>
                    {stat.prefix && <span className="text-2xl font-semibold sm:text-3xl">{stat.prefix}</span>}
                    <span className="text-4xl font-semibold tracking-tight lg:text-5xl">{count}</span>
                    {stat.suffix && (
                        /* A unit letter (the M in 120M+) is set at full size so it does not read as a small cap. */
                        <span className={`font-semibold ${/[A-Za-z]/.test(stat.suffix) ? 'text-4xl tracking-tight lg:text-5xl' : 'text-2xl sm:text-3xl'}`}>{stat.suffix}</span>
                    )}
                </span>
            )}
            <p className="mt-4 text-base leading-snug tracking-[0.04em] text-text-primary [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                {stat.label}
            </p>
            {!minimal && (
                <p className="mt-1 text-xs leading-relaxed text-text-secondary sm:text-sm [font-family:var(--font-body)]">
                    {stat.sublabel}
                </p>
            )}
        </div>
    );
}

export function StatsSection({
    stats,
    variant = 'cards',
    className = '',
    eyebrow,
    treeNode,
    numberFont = 'display',
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
                    <p
                        id={treeNode}
                        className="mb-6 text-base leading-none tracking-[0.04em] text-navy-light [font-family:var(--font-body)] [font-variant-caps:all-small-caps] lg:mb-8"
                    >
                        {eyebrow}
                    </p>
                )}
                {/* One ruled strip: hairline dividers between figures, two
                    columns on phones with a rule between the rows. */}
                <div className="grid grid-cols-2 border-y border-card-border lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <FadeIn
                            key={stat.label}
                            delay={i * 0.1}
                            className="h-full border-card-border px-4 py-6 even:border-l nth-[n+3]:border-t sm:px-6 lg:border-l lg:px-8 lg:py-8 lg:first:border-l-0 lg:nth-[n+3]:border-t-0"
                        >
                            <StatFigure
                                stat={stat}
                                isVisible={isVisible}
                                numberFont={numberFont}
                                minimal={variant === 'minimal'}
                            />
                        </FadeIn>
                    ))}
                </div>
            </Container>
        </section>
    );
}

/* Pre-defined stat sets: all numbers are real product capabilities */
export const HERO_STATS: Stat[] = [
    {
        value: 7,
        suffix: '',
        label: 'Core Patent Modules',
        sublabel: 'Families, provisionals, PCT, national phase & more',
    },
    {
        value: 5,
        suffix: '',
        label: 'User Roles',
        sublabel: 'granular RBAC built in',
    },
    {
        /* 21 is the CFR title number, not a count, so it is set as a static
           figure; a counting "21" read as twenty-one controls. */
        value: 0,
        display: 'Part 11',
        suffix: '',
        prefix: '',
        label: '21 CFR Part 11‑Aligned Controls',
        sublabel: 'Reason-for-change, e-signature, audit history',
        accent: true,
    },
    {
        value: 100,
        suffix: '%',
        label: 'Critical Actions Logged',
        sublabel: 'append-only change history',
    },
];

export const PRODUCT_STATS: Stat[] = [
    {
        value: 120,
        suffix: 'M+',
        label: 'Patent Records Searchable',
        sublabel: 'across 100+ patent authorities',
    },
    {
        value: 42,
        suffix: '+',
        label: 'Fee Types Tracked',
        sublabel: 'across 8 categories',
    },
    {
        value: 6,
        suffix: '',
        label: 'Drafting Jurisdictions',
        sublabel: 'US, EP, IN, WO, JP, CN',
    },
    {
        value: 100,
        suffix: '%',
        label: 'Critical Edits with a Reason',
        sublabel: 'reason-for-change required before saving',
        accent: true,
    },
];
