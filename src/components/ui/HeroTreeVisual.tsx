'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import {
    Sparkles,
    Clock,
    AlertTriangle,
    Languages,
    ShieldCheck,
    Check,
    Info,
    AlertCircle,
    Star,
    ArrowRight,
    type LucideIcon,
} from 'lucide-react';

/* ── Professional patent family tree visualization with live annotations ──
   Clean monochromatic tree (4 levels: Family → 2 PRVs → PCT → 3 NPEs) with
   dynamic AI annotations that cycle in and out on random cards via dashed
   indigo connectors. Annotations are tagged to the card types they apply to,
   so family-level insights only appear on the root, deadlines only on
   provisional/PCT/NPE cards, translations only on NPE cards, etc. */

export const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/* ─────────────────────────────────────────────
   Annotation type system
   ───────────────────────────────────────────── */

type CardId = 'root' | 'prv-a' | 'prv-b' | 'pct' | 'npe-ep' | 'npe-jp';
type Side = 'left' | 'right';
type CardLevel = 'root' | 'child' | 'grandchild';
type Tone = 'ok' | 'warn' | 'danger' | 'info';
type AnnotationType =
    | 'ai-insight'
    | 'office-action'
    | 'deadline'
    | 'translation'
    | 'compliance'
    | 'strategy'
    | 'related';

interface AnnotationRow {
    tone: Tone;
    icon: LucideIcon;
    text: string;
}

interface Annotation {
    type: AnnotationType;
    icon: LucideIcon;
    label: string;
    bigNumber?: string;
    bigSub?: string;
    rows: AnnotationRow[];
    cta: string;
    cards: CardId[];
}

const CARD_SIDES: Record<CardId, Side> = {
    'root': 'right',
    'prv-a': 'left',
    'prv-b': 'right',
    'pct': 'right',
    'npe-ep': 'left',
    'npe-jp': 'right',
};

/* Annotation pool. Each entry is tagged with the cards it can attach to,
   so the cycle engine only ever shows semantically correct callouts:
   family-level on root, conversion deadlines on PRVs, Ch. II demand on
   PCT, translation / annuity / examination on NPEs. */
const ANNOTATIONS: Annotation[] = [
    /* ── ROOT (Patent Family) ── */
    {
        type: 'ai-insight', cards: ['root'], icon: Sparkles, label: 'AI Insight',
        rows: [
            { tone: 'ok', icon: Check, text: 'Claim landscape mapped' },
            { tone: 'warn', icon: AlertTriangle, text: '2 prior art conflicts' },
        ],
        cta: 'View AI Analysis',
    },
    {
        type: 'ai-insight', cards: ['root'], icon: Sparkles, label: 'Patentability',
        rows: [
            { tone: 'ok', icon: Check, text: 'Strong novelty score' },
            { tone: 'ok', icon: Check, text: 'No family overlap' },
        ],
        cta: 'View Report',
    },
    {
        type: 'related', cards: ['root'], icon: Star, label: 'Family Map',
        bigNumber: '+8', bigSub: 'related families',
        rows: [{ tone: 'info', icon: Info, text: 'Continuation suggested' }],
        cta: 'View Family Map',
    },
    {
        type: 'compliance', cards: ['root'], icon: ShieldCheck, label: '21 CFR Part 11',
        rows: [
            { tone: 'ok', icon: Check, text: 'Audit log verified' },
            { tone: 'ok', icon: Check, text: 'All signatures current' },
        ],
        cta: 'View Audit Log',
    },

    /* ── PROVISIONAL (PRV-A, PRV-B) ── */
    {
        type: 'deadline', cards: ['prv-a', 'prv-b'], icon: Clock, label: 'PCT Conversion',
        bigNumber: '90', bigSub: 'days to convert',
        rows: [{ tone: 'ok', icon: Check, text: 'Draft PCT ready' }],
        cta: 'File PCT',
    },
    {
        type: 'ai-insight', cards: ['prv-a', 'prv-b'], icon: Sparkles, label: 'AI Drafting',
        rows: [
            { tone: 'ok', icon: Check, text: 'PCT application drafted' },
            { tone: 'info', icon: Info, text: 'Ready for attorney review' },
        ],
        cta: 'Review Draft',
    },
    {
        type: 'ai-insight', cards: ['prv-a', 'prv-b'], icon: Sparkles, label: 'Claim Refinement',
        rows: [
            { tone: 'ok', icon: Check, text: 'Claim scope optimized' },
            { tone: 'warn', icon: AlertTriangle, text: 'Office action predicted' },
        ],
        cta: 'View Suggestions',
    },
    {
        type: 'office-action', cards: ['prv-a', 'prv-b'], icon: AlertTriangle, label: 'Risk Forecast',
        rows: [
            { tone: 'danger', icon: AlertCircle, text: '35 USC 102 likely' },
            { tone: 'ok', icon: Check, text: 'Mitigations drafted' },
        ],
        cta: 'Review Strategy',
    },

    /* ── PCT ── */
    {
        type: 'deadline', cards: ['pct'], icon: Clock, label: 'Deadline',
        bigNumber: '167', bigSub: 'days to Ch. II demand',
        rows: [{ tone: 'warn', icon: Star, text: '+12 related filings' }],
        cta: 'View Timeline',
    },
    {
        type: 'deadline', cards: ['pct'], icon: Clock, label: 'National Phase',
        bigNumber: '215', bigSub: 'days to NP entry',
        rows: [{ tone: 'ok', icon: Check, text: 'Jurisdictions: 5' }],
        cta: 'Plan Filings',
    },
    {
        type: 'ai-insight', cards: ['pct'], icon: Sparkles, label: 'ISR Analysis',
        rows: [
            { tone: 'ok', icon: Check, text: 'ISR received, analyzed' },
            { tone: 'info', icon: Info, text: 'Strong novelty in 4 regions' },
        ],
        cta: 'View ISR',
    },
    {
        type: 'strategy', cards: ['pct'], icon: Star, label: 'Strategy',
        rows: [
            { tone: 'info', icon: Info, text: '5 NPE entries recommended' },
            { tone: 'ok', icon: Check, text: 'Cost estimate ready' },
        ],
        cta: 'View Strategy',
    },

    /* ── NPE (national phase / post-grant) ── */
    {
        type: 'translation', cards: ['npe-jp'], icon: Languages, label: 'Translation',
        rows: [
            { tone: 'warn', icon: Clock, text: 'JP due 15 Jul 2026' },
            { tone: 'ok', icon: Check, text: 'Vendor matched' },
        ],
        cta: 'Schedule Filing',
    },
    {
        type: 'translation', cards: ['npe-ep'], icon: Languages, label: 'Translation',
        rows: [
            { tone: 'ok', icon: Check, text: 'EP claims translated' },
            { tone: 'info', icon: Info, text: '8 valid jurisdictions' },
        ],
        cta: 'View Translations',
    },
    {
        type: 'office-action', cards: ['npe-ep'], icon: AlertTriangle, label: 'Office Action',
        bigNumber: '30', bigSub: 'days to respond',
        rows: [{ tone: 'ok', icon: Check, text: 'AI response drafted' }],
        cta: 'Review Response',
    },
    {
        type: 'office-action', cards: ['npe-jp'], icon: AlertTriangle, label: 'Office Action',
        rows: [
            { tone: 'danger', icon: AlertCircle, text: 'JPO rejection received' },
            { tone: 'ok', icon: Check, text: 'Strategy ready' },
        ],
        cta: 'Review Strategy',
    },
    {
        type: 'deadline', cards: ['npe-ep'], icon: Clock, label: 'Annuity Due',
        bigNumber: '45', bigSub: 'days to fee payment',
        rows: [{ tone: 'warn', icon: Star, text: 'EP4679899' }],
        cta: 'Pay Annuity',
    },
    {
        type: 'deadline', cards: ['npe-jp'], icon: Clock, label: '5th Year Annuity',
        bigNumber: '60', bigSub: 'days to renewal',
        rows: [{ tone: 'warn', icon: Star, text: 'JP2028-519834' }],
        cta: 'Pay Annuity',
    },
];

/* ─────────────────────────────────────────────
   Cycle engine
   ───────────────────────────────────────────── */

const DISPLAY_MS = 6500;        // how long each annotation stays visible
const INTERVAL_MS = 3000;       // gap between attempts to spawn a new one
const MAX_CONCURRENT = 2;       // max annotations on screen at once
const RECENT_SIZE = 3;          // last N cards used (avoid immediate repeats)
const INITIAL_DELAY_MS = 2800;  // wait for the tree's entrance animation to finish

export interface ActiveAnnotation {
    id: number;
    cardId: CardId;
    annotation: Annotation;
}

export function useAnnotationCycle(enabled: boolean) {
    const [active, setActive] = useState<ActiveAnnotation[]>([]);
    const idRef = useRef(0);
    const recentRef = useRef<CardId[]>([]);

    useEffect(() => {
        if (!enabled) return;

        const removalTimeouts = new Set<ReturnType<typeof setTimeout>>();
        let intervalId: ReturnType<typeof setInterval> | null = null;

        const tick = () => {
            setActive((prev) => {
                if (prev.length >= MAX_CONCURRENT) return prev;
                const activeIds = new Set(prev.map((a) => a.cardId));
                const cardIds = Object.keys(CARD_SIDES) as CardId[];
                const fresh = cardIds.filter(
                    (id) => !activeIds.has(id) && !recentRef.current.includes(id),
                );
                const pool = fresh.length > 0
                    ? fresh
                    : cardIds.filter((id) => !activeIds.has(id));
                if (pool.length === 0) return prev;

                const cardId = pool[Math.floor(Math.random() * pool.length)];
                const applicable = ANNOTATIONS.filter((a) => a.cards.includes(cardId));
                if (applicable.length === 0) return prev;
                const annotation = applicable[Math.floor(Math.random() * applicable.length)];

                idRef.current += 1;
                const id = idRef.current;

                recentRef.current.push(cardId);
                while (recentRef.current.length > RECENT_SIZE) recentRef.current.shift();

                const removalId = setTimeout(() => {
                    setActive((curr) => curr.filter((a) => a.id !== id));
                    removalTimeouts.delete(removalId);
                }, DISPLAY_MS);
                removalTimeouts.add(removalId);

                return [...prev, { id, cardId, annotation }];
            });
        };

        const startTimeoutId = setTimeout(() => {
            tick();
            intervalId = setInterval(tick, INTERVAL_MS);
        }, INITIAL_DELAY_MS);

        return () => {
            clearTimeout(startTimeoutId);
            if (intervalId) clearInterval(intervalId);
            removalTimeouts.forEach((t) => clearTimeout(t));
        };
    }, [enabled]);

    return useMemo(() => {
        const map = new Map<CardId, ActiveAnnotation>();
        active.forEach((a) => map.set(a.cardId, a));
        return map;
    }, [active]);
}

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */

export function HeroTreeVisual() {
    const reduceMotion = useReducedMotion();
    const activeByCard = useAnnotationCycle(!reduceMotion);

    return (
        <motion.div
            aria-hidden="true"
            role="img"
            className="relative select-none"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
            <div className="relative flex flex-col items-center gap-0">

                {/* ─── Level 1: Patent Family (root) ─── */}
                <FadeCard delay={0.5}>
                    <TreeCard
                        cardId="root"
                        level="root"
                        label="Patent Family"
                        title="Oncology Platform, Family A"
                        rows={[
                            ['Family ID', 'ONC-0005'],
                            ['Jurisdiction', 'United States'],
                            ['Priority Date', '01 Mar 2024'],
                        ]}
                        active={activeByCard.get('root')}
                    />
                </FadeCard>

                <ConnectorLine delay={0.9} />
                <NodeDot delay={1.05} />
                <BranchSplit delay={1.1} />

                {/* ─── Level 2: Two Provisional Applications ─── */}
                <div className="flex items-start gap-5 w-full mt-0">
                    <FadeCard delay={1.2} className="flex-1">
                        <TreeCard
                            cardId="prv-a"
                            level="child"
                            label="Provisional"
                            title="mRNA Delivery Vector"
                            status="Filed"
                            rows={[
                                ['App No.', 'US63/988,001'],
                                ['Filed', '18 Mar 2024'],
                            ]}
                            active={activeByCard.get('prv-a')}
                        />
                    </FadeCard>
                    <FadeCard delay={1.35} className="flex-1">
                        <TreeCard
                            cardId="prv-b"
                            level="child"
                            label="Provisional"
                            title="Conjugate Formulation"
                            status="Filed"
                            rows={[
                                ['App No.', 'US63/988,002'],
                                ['Filed', '01 Mar 2024'],
                            ]}
                            active={activeByCard.get('prv-b')}
                        />
                    </FadeCard>
                </div>

                <MergeLine delay={1.5} />
                <NodeDot delay={1.65} />
                <ConnectorLine delay={1.7} />

                {/* ─── Level 3: PCT Filing ─── */}
                <FadeCard delay={1.75}>
                    <TreeCard
                        cardId="pct"
                        level="child"
                        label="PCT Filing"
                        title="PCT/US2025/124343"
                        status="National Phase"
                        rows={[
                            ['Int. Filing', '01 Jul 2025'],
                            ['Ch. II Demand', '15 Jan 2026'],
                        ]}
                        active={activeByCard.get('pct')}
                    />
                </FadeCard>

                <ConnectorLine delay={2.0} />
                <NodeDot delay={2.1} />
                <BranchSplit delay={2.15} width={240} branches={3} />

                {/* ─── Level 4: Three NPE National Phase Entries ─── */}
                <div className="flex items-start gap-3 w-full mt-0">
                    <FadeCard delay={2.3} className="flex-1">
                        <TreeCard
                            cardId="npe-ep"
                            level="grandchild"
                            label="NPE"
                            title="EP National Phase"
                            status="Granted"
                            rows={[['Grant', 'EP4679899']]}
                            active={activeByCard.get('npe-ep')}
                        />
                    </FadeCard>
                    <FadeCard delay={2.4} className="flex-1">
                        <TreeCard
                            level="grandchild"
                            label="NPE"
                            title="US Continuation"
                            status="Active"
                            rows={[['App', '18/291,034']]}
                        />
                    </FadeCard>
                    <FadeCard delay={2.5} className="flex-1">
                        <TreeCard
                            cardId="npe-jp"
                            level="grandchild"
                            label="NPE"
                            title="JP National Phase"
                            status="Pending"
                            rows={[['App', 'JP2028-519834']]}
                            active={activeByCard.get('npe-jp')}
                        />
                    </FadeCard>
                </div>

            </div>
        </motion.div>
    );
}


/* ─────────────────────────────────────────────
   Tree card
   ───────────────────────────────────────────── */

const LEVEL_STYLES: Record<CardLevel, { card: string; label: string }> = {
    root: {
        card: 'px-5 py-4 bg-white border border-primary/22 shadow-lg shadow-primary/[0.10] ring-1 ring-primary/[0.07]',
        label: 'bg-primary/10 text-primary',
    },
    child: {
        card: 'px-4 py-3.5 bg-white border border-card-border shadow-md shadow-black/[0.05]',
        label: 'bg-primary/[0.07] text-primary/80',
    },
    grandchild: {
        card: 'px-3.5 py-3 bg-white border border-card-border shadow-md shadow-black/[0.05]',
        label: 'bg-primary/[0.07] text-primary/80',
    },
};

const STATUS_COLORS: Record<string, string> = {
    'Filed': 'bg-primary/10 text-primary',
    'Active': 'bg-emerald-50 text-emerald-700',
    'Granted': 'bg-emerald-50 text-emerald-700',
    'National Phase': 'bg-primary/10 text-primary',
    'Pending': 'bg-amber-50 text-amber-700',
    'Draft': 'bg-text-muted/10 text-text-muted',
};

export function TreeCard({
    cardId,
    level,
    label,
    title,
    status,
    rows,
    active,
}: {
    cardId?: CardId;
    level: CardLevel;
    label: string;
    title: string;
    status?: string;
    rows: [string, string][];
    active?: ActiveAnnotation;
}) {
    const s = LEVEL_STYLES[level];
    const isRoot = level === 'root';
    const isGrandchild = level === 'grandchild';
    const side = cardId ? CARD_SIDES[cardId] : undefined;
    const hasActive = !!active;

    return (
        <div
            className={`relative rounded-xl transition-shadow duration-400 ${s.card} ${
                hasActive ? 'ring-2 ring-primary/22 ring-offset-0' : ''
            }`}
        >
            {/* Header: label + status badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
                <span
                    className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md ${s.label}`}
                    style={{ fontFamily: 'var(--font-mono)' }}
                >
                    {label}
                </span>
                {status && (
                    <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600'}`}
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        {status}
                    </span>
                )}
            </div>

            {/* Title */}
            <p
                className={`font-semibold text-text-primary leading-snug truncate ${
                    isRoot ? 'text-[13px]' : isGrandchild ? 'text-[11px]' : 'text-xs'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {title}
            </p>

            {/* Data rows */}
            <div className={`mt-2 space-y-1 ${isGrandchild ? 'text-[10px]' : 'text-[11px]'}`}>
                {rows.map(([rowLabel, value]) => (
                    <div key={rowLabel} className="flex justify-between gap-3">
                        <span className="text-text-muted shrink-0" style={{ fontFamily: 'var(--font-body)' }}>
                            {rowLabel}
                        </span>
                        <span className="text-text-secondary font-medium truncate text-right" style={{ fontFamily: 'var(--font-mono)' }}>
                            {value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Dynamic annotation overlay (xl+ only). The left/middle bottom-row
                NPE cards (EP, US) drop their callout below so it never bleeds
                sideways into the hero copy / CTA column; the right-edge JP card
                keeps a side callout (extends toward the page edge, away from the
                copy). All upper cards keep their side placement. */}
            {side && (
                <AnimatePresence>
                    {active && (
                        <AnnotationOverlay
                            key={active.id}
                            annotation={active.annotation}
                            placement={isGrandchild ? (cardId === 'npe-jp' ? 'right' : 'below') : side}
                        />
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}


/* ─────────────────────────────────────────────
   Annotation overlay
   ───────────────────────────────────────────── */

const PILL_CLASSES: Record<AnnotationType, string> = {
    'ai-insight': 'bg-primary/10 text-primary',
    'compliance': 'bg-primary/10 text-primary',
    'strategy': 'bg-primary/10 text-primary',
    'related': 'bg-primary/10 text-primary',
    'office-action': 'bg-rose-50 text-rose-600',
    'deadline': 'bg-amber-50 text-amber-700',
    'translation': 'bg-emerald-50 text-emerald-700',
};

const ACCENT_CLASSES: Record<AnnotationType, string> = {
    'ai-insight': 'text-primary',
    'compliance': 'text-primary',
    'strategy': 'text-primary',
    'related': 'text-primary',
    'office-action': 'text-rose-600',
    'deadline': 'text-amber-700',
    'translation': 'text-emerald-700',
};

const TONE_CLASSES: Record<Tone, string> = {
    ok: 'text-emerald-600',
    warn: 'text-amber-600',
    danger: 'text-rose-600',
    info: 'text-primary',
};

const containerVariants: Variants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.12, delayChildren: 0 } },
    exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const lineVariants: Variants = {
    initial: { scaleX: 0 },
    animate: { scaleX: 1, transition: { duration: 0.4, ease: EASE } },
    exit: { scaleX: 0, transition: { duration: 0.3, ease: EASE } },
};

const dotVariants: Variants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.25, ease: EASE } },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.2, ease: EASE } },
};

const cardVariants: Variants = {
    initial: (custom: number) => ({ opacity: 0, x: custom }),
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
    exit: (custom: number) => ({ opacity: 0, x: custom, transition: { duration: 0.3, ease: EASE } }),
};

/* Vertical connector + drop-in card, used when the callout sits below its
   card instead of to the side (bottom-row NPE cards, so they never bleed
   sideways into the hero copy / CTA column). */
const lineVariantsV: Variants = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1, transition: { duration: 0.4, ease: EASE } },
    exit: { scaleY: 0, transition: { duration: 0.3, ease: EASE } },
};

const cardVariantsBelow: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.3, ease: EASE } },
};

function AnnotationOverlay({
    annotation,
    placement,
}: {
    annotation: Annotation;
    placement: Side | 'below';
}) {
    const HeaderIcon = annotation.icon;
    const isBelow = placement === 'below';
    const isRight = placement === 'right';
    const fromX = isRight ? 12 : -12;

    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`hidden xl:flex absolute z-10 ${
                isBelow
                    ? 'top-full left-1/2 -translate-x-1/2 mt-1 flex-col items-center'
                    : `top-1/2 -translate-y-1/2 items-center ${
                          isRight ? 'left-full ml-1' : 'right-full mr-1 flex-row-reverse'
                      }`
            }`}
        >
            {/* Dashed connector: vertical when the callout drops below the card,
                horizontal when it sits to the side. */}
            {isBelow ? (
                <div className="flex flex-col items-center h-7 shrink-0">
                    <motion.div
                        variants={lineVariantsV}
                        className="flex-1 border-l-[1.5px] border-dashed border-primary/40"
                        style={{ transformOrigin: 'top' }}
                    />
                    <motion.div
                        variants={dotVariants}
                        className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_0_2px_rgba(99,102,241,0.18)] -mt-[3px]"
                    />
                </div>
            ) : (
                <div className="flex items-center w-9 shrink-0">
                    <motion.div
                        variants={lineVariants}
                        className="flex-1 border-t-[1.5px] border-dashed border-primary/40"
                        style={{ transformOrigin: isRight ? 'left' : 'right' }}
                    />
                    <motion.div
                        variants={dotVariants}
                        className={`w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_0_2px_rgba(99,102,241,0.18)] ${
                            isRight ? '-ml-[3px]' : '-mr-[3px] order-first'
                        }`}
                    />
                </div>
            )}

            {/* Annotation card (neutral white, theme via colored pill) */}
            <motion.div
                variants={isBelow ? cardVariantsBelow : cardVariants}
                custom={isBelow ? undefined : fromX}
                className="bg-white rounded-[10px] border border-card-border shadow-md shadow-black/[0.06] p-3 min-w-[170px] max-w-[190px]"
            >
                {/* Type pill (top) */}
                <div className="mb-2">
                    <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest ${PILL_CLASSES[annotation.type]}`}
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        <HeaderIcon className="w-3 h-3 shrink-0" />
                        {annotation.label}
                    </span>
                </div>

                {/* Big number readout (if present) */}
                {annotation.bigNumber && (
                    <>
                        <div
                            className={`text-[22px] font-semibold leading-tight ${ACCENT_CLASSES[annotation.type]}`}
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            {annotation.bigNumber}
                        </div>
                        <div
                            className="text-[10px] text-text-muted uppercase tracking-wider mb-2"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            {annotation.bigSub}
                        </div>
                    </>
                )}

                {/* Body rows */}
                {annotation.rows.length > 0 && (
                    <div className="space-y-1.5 mb-2">
                        {annotation.rows.map((row, i) => {
                            const RowIcon = row.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-start gap-1.5 text-[11px] leading-tight"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    <RowIcon
                                        className={`w-3 h-3 shrink-0 mt-px ${TONE_CLASSES[row.tone]}`}
                                        strokeWidth={2.5}
                                    />
                                    <span className="text-text-secondary">{row.text}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* CTA link */}
                <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest ${ACCENT_CLASSES[annotation.type]}`}
                    style={{ fontFamily: 'var(--font-mono)' }}
                >
                    {annotation.cta}
                    <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                </span>
            </motion.div>
        </motion.div>
    );
}


/* ─────────────────────────────────────────────
   Connector primitives (unchanged)
   ───────────────────────────────────────────── */

export function ConnectorLine({ delay }: { delay: number }) {
    return (
        <motion.div
            className="w-px h-8 bg-gradient-to-b from-primary/38 to-primary/22 mx-auto"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.35, delay, ease: EASE }}
            style={{ transformOrigin: 'top' }}
        />
    );
}

export function NodeDot({ delay }: { delay: number }) {
    return (
        <motion.div
            className="relative z-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay, ease: EASE }}
        >
            <div className="w-2.5 h-2.5 rounded-full bg-primary ring-[3px] ring-primary/16" />
        </motion.div>
    );
}

export function BranchSplit({ delay, width = 140, branches = 2 }: { delay: number; width?: number; branches?: number }) {
    const cx = width / 2;
    const endpoints = Array.from({ length: branches }, (_, i) =>
        branches === 1 ? cx : (i / (branches - 1)) * width
    );

    return (
        <div className="relative" style={{ width, height: 20 }}>
            <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                viewBox={`0 0 ${width} 20`}
                fill="none"
                preserveAspectRatio="none"
            >
                {endpoints.map((ex, i) => (
                    <motion.path
                        key={i}
                        d={`M ${cx} 0 C ${cx} 14, ${ex} 6, ${ex} 20`}
                        stroke="rgb(99 102 241 / 0.33)"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: delay + i * 0.03, ease: EASE }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function MergeLine({ delay }: { delay: number }) {
    const vw = 1000;
    const vh = 120;
    const cx = vw / 2;
    const leftX = vw * 0.25;
    const rightX = vw * 0.75;

    return (
        <div className="relative w-full" style={{ height: 40 }}>
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${vw} ${vh}`}
                preserveAspectRatio="none"
                fill="none"
            >
                <motion.path
                    d={`M ${leftX} 0 C ${leftX} ${vh * 0.65}, ${cx} ${vh * 0.35}, ${cx} ${vh}`}
                    stroke="rgb(99 102 241 / 0.33)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay, ease: EASE }}
                />
                <motion.path
                    d={`M ${rightX} 0 C ${rightX} ${vh * 0.65}, ${cx} ${vh * 0.35}, ${cx} ${vh}`}
                    stroke="rgb(99 102 241 / 0.33)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: delay + 0.05, ease: EASE }}
                />
            </svg>
        </div>
    );
}

export function FadeCard({ children, delay, className = '' }: { children: React.ReactNode; delay: number; className?: string }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}
