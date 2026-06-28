'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    CalendarDays,
    Search,
    FileText,
    Mail,
    Globe,
    AlertTriangle,
    Sparkles,
    Check,
    Plus,
    Clock,
    ArrowRight,
    type LucideIcon,
} from 'lucide-react';

/*
   Hero visual variant B: the "Patent Operations Hub" mind map.

   Scattered legacy tools (left input cards) flow along connectors into the
   central Patent Operations Hub, which fans out to every jurisdiction (right
   cards). Live notification cards above the hub rotate through a pool, and
   small status callouts pop in and out over the jurisdiction cards, both the
   same idea as the family tree's annotation cycle. Tool badges (Excel /
   search / Word / mail) travel the left connectors into the hub on a gentle
   loop. Indigo gradient flows on the spokes; source tool tiles and jurisdiction
   flags keep their own colors. Everything is decorative (aria-hidden) and the
   motion is disabled under prefers-reduced-motion.

   Authored in a fixed design coordinate space and scaled uniformly to its
   column width, so the curves always meet the cards exactly.
*/

const DESIGN_W = 964;
const DESIGN_H = 612;
const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const ENTER_EASE = [0.22, 1, 0.36, 1] as const;

/* Set true to recolor the left flows indigo to match the right side. The
   reference tints each left flow to its source card, so this defaults false. */
const INDIGO_FLOWS = false;

const INDIGO = { ribbon: '#a5b4fc', dot: '#6366f1' };

/* ── Geometry ── */
const HUB = { cx: 460, cy: 366, w: 240, h: 344 };
const IN = { w: 188, h: 106, cx: 116 };
const OUT = { w: 194, h: 108, cx: 860 };
const TOP = { w: 152, h: 100, cy: 66 };

const HUB_L = HUB.cx - HUB.w / 2;
const HUB_R = HUB.cx + HUB.w / 2;
const HUB_T = HUB.cy - HUB.h / 2;
const IN_R = IN.cx + IN.w / 2;
const OUT_L = OUT.cx - OUT.w / 2;

const IN_CYS = [162, 284, 406, 528];
const OUT_CYS = [176, 300, 424, 548];
const TOP_CXS = [295, 460, 625];
const ENTRY_YS = [300, 344, 388, 432];
const EXIT_YS = [300, 344, 388, 432];

const RIGHT_CY: Record<string, number> = { us: 176, ep: 300, jp: 424, others: 548 };

/* ── Card data ── */
interface InputCard {
    id: string;
    tag: string;
    desc: [string, string];
    Icon: LucideIcon;
    tile: string;
    preview: 'calendar' | 'list' | 'doc' | 'check';
    token: 'excel' | 'search' | 'word' | 'mail';
    flow: { ribbon: string; dot: string };
}

const INPUTS: InputCard[] = [
    { id: 'docketing', tag: 'DOCKETING', desc: ['Spreadsheets', '& Calendars'], Icon: CalendarDays, tile: '#10b981', preview: 'calendar', token: 'excel', flow: { ribbon: '#6ee7b7', dot: '#10b981' } },
    { id: 'search', tag: 'SEARCH', desc: ['Prior Art', 'Search Tools'], Icon: Search, tile: '#3b82f6', preview: 'list', token: 'search', flow: { ribbon: '#93c5fd', dot: '#3b82f6' } },
    { id: 'drafting', tag: 'DRAFTING', desc: ['Word Docs', '& Templates'], Icon: FileText, tile: '#8b5cf6', preview: 'doc', token: 'word', flow: { ribbon: '#c4b5fd', dot: '#8b5cf6' } },
    { id: 'prosecution', tag: 'PROSECUTION', desc: ['Emails & Office', 'Actions'], Icon: Mail, tile: '#f59e0b', preview: 'check', token: 'mail', flow: { ribbon: '#fcd34d', dot: '#f59e0b' } },
];

interface OutputCard {
    id: string;
    flag: 'US' | 'EU' | 'JP' | 'OTHERS';
    pill: string;
    title: string;
    sub: string | null;
    status: string | null;
    dot: string | null;
}

const OUTPUTS: OutputCard[] = [
    { id: 'us', flag: 'US', pill: 'US', title: 'US Continuation', sub: '18/291,034', status: 'Active', dot: '#10b981' },
    { id: 'ep', flag: 'EU', pill: 'EP', title: 'EP National Phase', sub: 'EP4679899', status: 'Granted', dot: '#10b981' },
    { id: 'jp', flag: 'JP', pill: 'JP', title: 'JP National Phase', sub: 'JP2028-519834', status: 'Pending', dot: '#f59e0b' },
    { id: 'others', flag: 'OTHERS', pill: 'OTHERS', title: 'Other Countries', sub: null, status: null, dot: null },
];

interface TopNotif {
    Icon: LucideIcon;
    iconColor: string;
    title: [string, string];
    meta: string;
    cta: string;
    ctaColor: string;
}

const TOP_POOL: TopNotif[] = [
    { Icon: AlertTriangle, iconColor: '#ef4444', title: ['PCT conversion', 'due in 90 days'], meta: '01 Jul 2025', cta: 'View Details', ctaColor: '#e11d48' },
    { Icon: Sparkles, iconColor: '#10b981', title: ['AI claim insight', 'available'], meta: '3 suggestions', cta: 'Review Now', ctaColor: '#059669' },
    { Icon: Globe, iconColor: '#f59e0b', title: ['JP translation', 'required'], meta: 'Due 15 Jul 2025', cta: 'Manage', ctaColor: '#d97706' },
    { Icon: AlertTriangle, iconColor: '#ef4444', title: ['Office action', 'response due'], meta: '30 days left', cta: 'Respond', ctaColor: '#e11d48' },
    { Icon: Clock, iconColor: '#f59e0b', title: ['Annuity payment', 'upcoming'], meta: 'EP4679899', cta: 'Pay Now', ctaColor: '#d97706' },
    { Icon: Search, iconColor: '#6366f1', title: ['Prior art match', 'found'], meta: '4 references', cta: 'View', ctaColor: '#4f46e5' },
    { Icon: Sparkles, iconColor: '#10b981', title: ['Claim amendment', 'drafted'], meta: 'AI generated', cta: 'Review', ctaColor: '#059669' },
];

const HUB_CHECKS = ['Unified family record', 'Live deadlines', 'AI insights', 'Global filings'];

interface RightAnnot {
    card: string;
    Icon: LucideIcon;
    color: string;
    title: string;
    sub: string;
}

const RIGHT_POOL: RightAnnot[] = [
    { card: 'jp', Icon: Globe, color: '#d97706', title: 'JP translation required', sub: 'Due 15 Jul 2025' },
    { card: 'ep', Icon: Clock, color: '#d97706', title: 'Annuity due', sub: '45 days to pay' },
    { card: 'us', Icon: AlertTriangle, color: '#e11d48', title: 'Office action', sub: '30 days to respond' },
    { card: 'us', Icon: Check, color: '#059669', title: 'Continuation active', sub: '18/291,034' },
    { card: 'ep', Icon: Check, color: '#059669', title: 'Grant validated', sub: '8 EP states' },
    { card: 'jp', Icon: Sparkles, color: '#6366f1', title: 'AI response ready', sub: 'Review draft' },
    { card: 'others', Icon: Plus, color: '#6366f1', title: '12 more jurisdictions', sub: 'Add to family' },
];

/* ── Curves ── */
function curveD(sx: number, sy: number, ex: number, ey: number, k = 0.55) {
    const dx = (ex - sx) * k;
    return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${ex - dx} ${ey}, ${ex} ${ey}`;
}

function cubicAt(p0: number, p1: number, p2: number, p3: number, t: number) {
    const mt = 1 - t;
    return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

const LEFT_CURVES = INPUTS.map((c, i) => {
    const sx = IN_R, sy = IN_CYS[i], ex = HUB_L, ey = ENTRY_YS[i];
    const dx = (ex - sx) * 0.55;
    return { id: `lc-${c.id}`, d: curveD(sx, sy, ex, ey), flow: INDIGO_FLOWS ? INDIGO : c.flow, token: c.token, c1x: sx + dx, c2x: ex - dx, sx, sy, ex, ey };
});

const RIGHT_CURVES = OUTPUTS.map((c, i) => {
    // Authored hub -> output so the spokes draw outward (left to right) and the
    // flow dots travel the same direction.
    const sx = HUB_R, sy = EXIT_YS[i], ex = OUT_L - 12, ey = OUT_CYS[i];
    return { id: `rc-${c.id}`, d: curveD(sx, sy, ex, ey), cy: OUT_CYS[i] };
});


/* ── Rotation hooks ── */
function useTopRotation(animate: boolean) {
    const [slots, setSlots] = useState<number[]>([0, 1, 2]);
    useEffect(() => {
        if (!animate) return;
        let turn = 0;
        const id = setInterval(() => {
            setSlots((prev) => {
                const slot = turn % 3;
                turn += 1;
                const used = new Set(prev);
                const avail = TOP_POOL.map((_, i) => i).filter((i) => !used.has(i));
                if (avail.length === 0) return prev;
                const pick = avail[Math.floor(Math.random() * avail.length)];
                const next = [...prev];
                next[slot] = pick;
                return next;
            });
        }, 2600);
        return () => clearInterval(id);
    }, [animate]);
    return slots;
}

interface RActive { id: number; card: string; annot: RightAnnot; }

function useRightAnnotations(animate: boolean) {
    const [active, setActive] = useState<RActive[]>([]);
    const idRef = useRef(0);
    const recent = useRef<string[]>([]);

    useEffect(() => {
        if (!animate) return;
        const timeouts = new Set<ReturnType<typeof setTimeout>>();
        let interval: ReturnType<typeof setInterval> | null = null;

        const tick = () => {
            setActive((prev) => {
                if (prev.length >= 2) return prev;
                const activeCards = new Set(prev.map((a) => a.card));
                const fresh = RIGHT_POOL.filter((a) => !activeCards.has(a.card) && !recent.current.includes(a.title));
                const pool = fresh.length > 0 ? fresh : RIGHT_POOL.filter((a) => !activeCards.has(a.card));
                if (pool.length === 0) return prev;
                const annot = pool[Math.floor(Math.random() * pool.length)];
                idRef.current += 1;
                const id = idRef.current;
                recent.current.push(annot.title);
                while (recent.current.length > 3) recent.current.shift();
                const t = setTimeout(() => {
                    setActive((curr) => curr.filter((a) => a.id !== id));
                    timeouts.delete(t);
                }, 5000);
                timeouts.add(t);
                return [...prev, { id, card: annot.card, annot }];
            });
        };

        const start = setTimeout(() => {
            tick();
            interval = setInterval(tick, 2600);
        }, 1600);

        return () => {
            clearTimeout(start);
            if (interval) clearInterval(interval);
            timeouts.forEach((t) => clearTimeout(t));
        };
    }, [animate]);

    return active;
}

const STATIC_RIGHT: RActive[] = [{ id: -1, card: 'jp', annot: RIGHT_POOL[0] }];


export function HeroHubVisual() {
    const reduce = useReducedMotion();
    const animate = !reduce;
    const wrapRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState<number | null>(null);

    const slots = useTopRotation(animate);
    const dynamicRight = useRightAnnotations(animate);
    const rightActive = animate ? dynamicRight : STATIC_RIGHT;

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const update = () => setScale(el.clientWidth / DESIGN_W);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return (
        <div
            ref={wrapRef}
            aria-hidden="true"
            role="img"
            className="relative w-full select-none"
            style={{ aspectRatio: `${DESIGN_W} / ${DESIGN_H}` }}
        >
            {scale !== null && (
                <div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{ width: DESIGN_W, height: DESIGN_H, transform: `scale(${scale})` }}
                >
                    {/* Connector layer (behind cards, so tokens slide under the hub) */}
                    <svg
                        className="absolute inset-0 overflow-visible"
                        width={DESIGN_W}
                        height={DESIGN_H}
                        viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}
                        fill="none"
                    >
                        <defs>
                            <linearGradient id="hubFlow" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0" stopColor="#c7d2fe" />
                                <stop offset="0.5" stopColor="#818cf8" />
                                <stop offset="1" stopColor="#6366f1" />
                            </linearGradient>
                        </defs>

                        {/* Left ribbons draw first (input -> hub), starting the
                            left to right sweep. */}
                        {LEFT_CURVES.map((c, i) => (
                            <g key={c.id}>
                                <motion.path
                                    d={c.d} stroke={c.flow.ribbon} strokeWidth={11} strokeLinecap="butt" opacity={0.4}
                                    initial={animate ? { pathLength: 0 } : false}
                                    animate={animate ? { pathLength: 1 } : false}
                                    transition={{ duration: 0.85, delay: 0.35 + i * 0.07, ease: ENTER_EASE }}
                                />
                                <motion.path
                                    id={c.id} d={c.d} stroke={c.flow.ribbon} strokeWidth={3} strokeLinecap="butt" opacity={0.85}
                                    initial={animate ? { pathLength: 0 } : false}
                                    animate={animate ? { pathLength: 1 } : false}
                                    transition={{ duration: 0.85, delay: 0.35 + i * 0.07, ease: ENTER_EASE }}
                                />
                            </g>
                        ))}

                        {/* Right spokes draw out from the hub (hub -> output), continuing
                            the sweep; chevrons fade in as each spoke arrives. */}
                        {RIGHT_CURVES.map((c, i) => (
                            <g key={c.id}>
                                <motion.path
                                    d={c.d} stroke="url(#hubFlow)" strokeWidth={10} strokeLinecap="butt" opacity={0.32}
                                    initial={animate ? { pathLength: 0 } : false}
                                    animate={animate ? { pathLength: 1 } : false}
                                    transition={{ duration: 0.85, delay: 0.95 + i * 0.08, ease: ENTER_EASE }}
                                />
                                <motion.path
                                    id={c.id} d={c.d} stroke="url(#hubFlow)" strokeWidth={2.5} strokeLinecap="butt" opacity={0.7}
                                    initial={animate ? { pathLength: 0 } : false}
                                    animate={animate ? { pathLength: 1 } : false}
                                    transition={{ duration: 0.85, delay: 0.95 + i * 0.08, ease: ENTER_EASE }}
                                />
                                <motion.path
                                    d={`M ${OUT_L - 14} ${c.cy - 7} L ${OUT_L - 6} ${c.cy} L ${OUT_L - 14} ${c.cy + 7}`}
                                    stroke="#6366f1"
                                    strokeWidth={2.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                    initial={animate ? { opacity: 0 } : false}
                                    animate={animate ? { opacity: 1 } : false}
                                    transition={{ duration: 0.4, delay: 1.5 + i * 0.08 }}
                                />
                            </g>
                        ))}

                        {/* Top dashed curves into the hub (fade in on load) */}
                        <motion.g
                            stroke="#a5b4fc"
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            fill="none"
                            initial={animate ? { opacity: 0 } : false}
                            animate={animate ? { opacity: 0.9 } : false}
                            transition={{ duration: 0.6, delay: 1.55, ease: ENTER_EASE }}
                        >
                            {TOP_CXS.map((cx, i) => {
                                const sy = TOP.cy + TOP.h / 2;
                                const my = (sy + HUB_T) / 2;
                                const ex = HUB.cx + (i - 1) * 32;
                                return <path key={cx} d={`M ${cx} ${sy} C ${cx} ${my}, ${ex} ${my}, ${ex} ${HUB_T}`} />;
                            })}
                        </motion.g>

                        {animate && (
                            <>
                                {LEFT_CURVES.map((c) => (
                                    <FlowDots key={`d-${c.id}`} id={c.id} color={c.flow.dot} count={3} dur={4.8} delay={1.7} />
                                ))}
                                {RIGHT_CURVES.map((c) => (
                                    <FlowDots key={`d-${c.id}`} id={c.id} color={INDIGO.dot} count={3} dur={5} delay={1.85} />
                                ))}
                                {LEFT_CURVES.map((c, i) => (
                                    <FlowToken key={`t-${c.id}`} id={c.id} begin={2.1 + i * 1.4} dur={7}>
                                        <ToolBadge kind={c.token} />
                                    </FlowToken>
                                ))}
                            </>
                        )}
                        {!animate && LEFT_CURVES.map((c) => {
                            const t = 0.42;
                            const x = cubicAt(c.sx, c.c1x, c.c2x, c.ex, t);
                            const y = cubicAt(c.sy, c.sy, c.ey, c.ey, t);
                            return (
                                <g key={`s-${c.id}`} transform={`translate(${x} ${y})`}>
                                    <ToolBadge kind={c.token} />
                                </g>
                            );
                        })}
                    </svg>

                    {/* Card layer */}
                    <div className="absolute inset-0">
                        {/* Entrance sweeps left to right: source cards first, the
                            ribbons draw to the hub, the hub appears, then the spokes
                            draw out to the jurisdiction cards, then the notifications. */}
                        {INPUTS.map((c, i) => (
                            <Reveal key={c.id} animate={animate} delay={i * 0.1} box={centerBox(IN.cx, IN_CYS[i], IN.w, IN.h)}>
                                <InputCardView card={c} />
                            </Reveal>
                        ))}

                        <Reveal animate={animate} delay={0.8} box={centerBox(HUB.cx, HUB.cy, HUB.w, HUB.h)}>
                            <HubCardView animate={animate} />
                        </Reveal>

                        {OUTPUTS.map((c, i) => (
                            <Reveal key={c.id} animate={animate} delay={1.15 + i * 0.12} box={centerBox(OUT.cx, OUT_CYS[i], OUT.w, OUT.h)}>
                                <OutputCardView card={c} />
                            </Reveal>
                        ))}

                        {/* Top notification cards: fixed positions, rotating content */}
                        {TOP_CXS.map((cx, i) => (
                            <Reveal key={i} animate={animate} delay={1.55 + i * 0.12} box={centerBox(cx, TOP.cy, TOP.w, TOP.h)}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={slots[i]}
                                        className="w-full h-full"
                                        initial={animate ? { opacity: 0, y: 6 } : false}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.35, ease: EASE }}
                                    >
                                        <TopCardView notif={TOP_POOL[slots[i]]} />
                                    </motion.div>
                                </AnimatePresence>
                            </Reveal>
                        ))}

                        {/* Right pop-up callouts */}
                        <AnimatePresence>
                            {rightActive.map((a) => (
                                <motion.div
                                    key={a.id}
                                    className="absolute z-20"
                                    style={{ left: OUT_L - 18, top: RIGHT_CY[a.card] - OUT.h / 2 - 26, width: 156 }}
                                    initial={{ opacity: 0, scale: 0.9, y: 6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 6 }}
                                    transition={{ duration: 0.35, ease: EASE }}
                                >
                                    <RightAnnotCard annot={a.annot} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}


/* ── Positioned reveal wrapper ── */
function centerBox(cx: number, cy: number, w: number, h: number): CSSProperties {
    return { position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h };
}

function Reveal({ animate, delay, box, children }: { animate: boolean; delay: number; box: CSSProperties; children: React.ReactNode }) {
    return (
        <motion.div
            style={box}
            initial={animate ? { opacity: 0, y: 14, scale: 0.96 } : false}
            animate={animate ? { opacity: 1, y: 0, scale: 1 } : false}
            transition={{ duration: 0.7, delay, ease: ENTER_EASE }}
        >
            {children}
        </motion.div>
    );
}


/* ── Cards ── */
function InputCardView({ card }: { card: InputCard }) {
    const Icon = card.Icon;
    return (
        <div className="w-full h-full rounded-2xl bg-white border border-card-border shadow-md shadow-black/5 px-4 py-3.5 flex items-start gap-3 overflow-hidden">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0" style={{ backgroundColor: card.tile }}>
                <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: card.tile, fontFamily: 'var(--font-mono)' }}>
                    {card.tag}
                </p>
                <p className="mt-1 text-[13px] leading-tight font-semibold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                    {card.desc[0]}<br />{card.desc[1]}
                </p>
            </div>
            <div className="shrink-0 self-center opacity-60">
                <MiniPreview kind={card.preview} />
            </div>
        </div>
    );
}

function HubCardView({ animate }: { animate: boolean }) {
    return (
        <div className="relative w-full h-full rounded-[20px] bg-white border border-primary/15 shadow-xl shadow-primary/10 ring-1 ring-primary/6 px-5 py-5 flex flex-col items-center text-center">
            <HubLogo animate={animate} />
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                Design Your Invention
            </p>
            <h3 className="mt-1 text-[22px] leading-tight font-bold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                Patent Operations Hub
            </h3>
            <div className="mt-3.5 w-full space-y-2.5 text-left">
                {HUB_CHECKS.map((c) => (
                    <div key={c} className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 shrink-0">
                            <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                        </span>
                        <span className="text-[14px] text-text-secondary" style={{ fontFamily: 'var(--font-body)' }}>{c}</span>
                    </div>
                ))}
            </div>
            <span className="mt-4 inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-primary/30 text-[12px] font-semibold text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                All in One Place
            </span>
        </div>
    );
}

function OutputCardView({ card }: { card: OutputCard }) {
    return (
        <div className="w-full h-full rounded-2xl bg-white border border-card-border shadow-md shadow-black/5 px-4 py-3.5 flex flex-col justify-center">
            <div className="flex items-center gap-2">
                <Flag code={card.flag} />
                <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                    {card.pill}
                </span>
            </div>
            <p className="mt-1.5 text-[14px] font-semibold text-text-primary leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {card.title}
            </p>
            {card.id === 'others' ? (
                <div className="mt-1.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                        <Plus className="w-3 h-3" strokeWidth={2.5} /> Add Jurisdiction
                    </span>
                    <span className="flex items-center justify-center w-5 h-5 rounded-full border border-primary/30 text-primary">
                        <Plus className="w-3 h-3" strokeWidth={2.5} />
                    </span>
                </div>
            ) : (
                <>
                    <p className="mt-0.5 text-[12px] text-text-muted" style={{ fontFamily: 'var(--font-mono)' }}>{card.sub}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: card.dot ?? '#94a3b8' }} />
                        <span className="text-[11px] font-medium" style={{ color: card.dot ?? '#94a3b8', fontFamily: 'var(--font-mono)' }}>{card.status}</span>
                    </div>
                </>
            )}
        </div>
    );
}

function TopCardView({ notif }: { notif: TopNotif }) {
    const Icon = notif.Icon;
    return (
        <div className="w-full h-full rounded-xl bg-white border border-card-border shadow-md shadow-black/6 px-3.5 py-3 flex flex-col">
            <div className="flex items-start gap-1.5">
                <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: notif.iconColor }} strokeWidth={2.4} />
                <p className="text-[12px] leading-tight font-semibold text-text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                    {notif.title[0]}<br />{notif.title[1]}
                </p>
            </div>
            <p className="mt-1 text-[11px] text-text-muted" style={{ fontFamily: 'var(--font-mono)' }}>{notif.meta}</p>
            <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: notif.ctaColor, fontFamily: 'var(--font-mono)' }}>
                {notif.cta}
                <ArrowRight className="w-2.5 h-2.5" strokeWidth={2.5} />
            </span>
        </div>
    );
}

function RightAnnotCard({ annot }: { annot: RightAnnot }) {
    const Icon = annot.Icon;
    return (
        <div className="rounded-lg bg-white border border-card-border shadow-lg shadow-black/10 px-2.5 py-1.5 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md shrink-0" style={{ backgroundColor: `${annot.color}1a` }}>
                <Icon className="w-3.5 h-3.5" style={{ color: annot.color }} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
                <p className="text-[10px] font-semibold leading-tight text-text-primary truncate" style={{ fontFamily: 'var(--font-display)' }}>{annot.title}</p>
                <p className="text-[9px] text-text-muted truncate" style={{ fontFamily: 'var(--font-mono)' }}>{annot.sub}</p>
            </div>
        </div>
    );
}


/* ── SVG pieces ── */
function FlowDots({ id, color, count, dur, delay = 0, reverse = false }: { id: string; color: string; count: number; dur: number; delay?: number; reverse?: boolean }) {
    const keyPoints = reverse ? '1;0' : '0;1';
    return (
        <>
            {Array.from({ length: count }).map((_, i) => {
                const begin = `${delay + (dur / count) * i}s`;
                return (
                    // opacity stays 0 until the motion begins, otherwise the dot
                    // sits at the SVG origin (top-left) before its first run.
                    <circle key={i} r={2.6} fill={color} opacity={0}>
                        <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={begin} calcMode="linear" keyPoints={keyPoints} keyTimes="0;1">
                            <mpath href={`#${id}`} />
                        </animateMotion>
                        <set attributeName="opacity" to="1" begin={begin} />
                    </circle>
                );
            })}
        </>
    );
}

function FlowToken({ id, begin, dur, children }: { id: string; begin: number; dur: number; children: React.ReactNode }) {
    return (
        <g opacity={0}>
            <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${begin}s`}>
                <mpath href={`#${id}`} />
            </animateMotion>
            <animate attributeName="opacity" dur={`${dur}s`} repeatCount="indefinite" begin={`${begin}s`} values="0;1;1;0" keyTimes="0;0.16;0.78;1" />
            {children}
        </g>
    );
}

function ToolBadge({ kind }: { kind: InputCard['token'] }) {
    return (
        <g>
            <circle r={16} fill="#fff" />
            <circle r={16} fill="none" stroke="#0f172a" strokeOpacity={0.06} />
            {kind === 'excel' && (
                <>
                    <rect x={-11} y={-11} width={22} height={22} rx={5} fill="#107c41" />
                    <path d="M -5 -4 L 5 4 M 5 -4 L -5 4" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
                </>
            )}
            {kind === 'word' && (
                <>
                    <rect x={-11} y={-11} width={22} height={22} rx={5} fill="#2b579a" />
                    <path d="M -6.5 -4 L -3.5 5 L 0 -1.5 L 3.5 5 L 6.5 -4" stroke="#fff" strokeWidth={1.6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
                </>
            )}
            {kind === 'search' && (
                <>
                    <circle r={12} fill="#3b82f6" />
                    <circle cx={-1.5} cy={-1.5} r={4.5} fill="none" stroke="#fff" strokeWidth={2} />
                    <path d="M 2 2 L 5.5 5.5" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
                </>
            )}
            {kind === 'mail' && (
                <>
                    <circle r={12} fill="#fff" stroke="#fed7aa" strokeWidth={1.5} />
                    <rect x={-6.5} y={-4.5} width={13} height={9} rx={1.5} fill="none" stroke="#f97316" strokeWidth={1.6} />
                    <path d="M -6.5 -3.5 L 0 1.5 L 6.5 -3.5" fill="none" stroke="#f97316" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}
        </g>
    );
}

function HubLogo({ animate }: { animate: boolean }) {
    return (
        <div className="relative" style={{ width: 72, height: 58 }}>
            <svg className="absolute inset-0" width={72} height={58} viewBox="0 0 72 58" fill="none">
                <ellipse cx="36" cy="46" rx="28" ry="8" stroke="#c7d2fe" strokeWidth="1" opacity="0.7" />
                <ellipse cx="36" cy="46" rx="18" ry="5" stroke="#a5b4fc" strokeWidth="1" opacity="0.8" />
                {animate && (
                    <motion.ellipse
                        cx="36" cy="46" rx="10" ry="3"
                        stroke="#818cf8" strokeWidth="1"
                        initial={{ opacity: 0.6, scale: 0.6 }}
                        animate={{ opacity: 0, scale: 1.7 }}
                        transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}
                        style={{ transformOrigin: '36px 46px' }}
                    />
                )}
            </svg>
            <Image
                src="/logo.png"
                alt=""
                width={46}
                height={46}
                className="absolute left-1/2 top-0 -translate-x-1/2"
            />
        </div>
    );
}

function MiniPreview({ kind }: { kind: InputCard['preview'] }) {
    const stroke = '#cbd5e1';
    if (kind === 'calendar') {
        return (
            <svg width={34} height={30} viewBox="0 0 34 30" fill="none">
                <rect x="1" y="3" width="32" height="26" rx="3" stroke={stroke} />
                <line x1="1" y1="10" x2="33" y2="10" stroke={stroke} />
                {[0, 1, 2, 3].map((c) => <line key={c} x1={1 + c * 8} y1="10" x2={1 + c * 8} y2="29" stroke={stroke} />)}
                {[0, 1, 2].map((r) => <line key={r} x1="1" y1={16 + r * 5} x2="33" y2={16 + r * 5} stroke={stroke} />)}
            </svg>
        );
    }
    if (kind === 'list') {
        return (
            <svg width={34} height={30} viewBox="0 0 34 30" fill="none">
                {[0, 1, 2, 3].map((r) => (
                    <g key={r}>
                        <rect x="1" y={2 + r * 7} width="4" height="4" rx="1" stroke={stroke} />
                        <line x1="8" y1={4 + r * 7} x2="33" y2={4 + r * 7} stroke={stroke} />
                    </g>
                ))}
            </svg>
        );
    }
    if (kind === 'doc') {
        return (
            <svg width={30} height={32} viewBox="0 0 30 32" fill="none">
                <rect x="2" y="1" width="26" height="30" rx="3" stroke={stroke} />
                {[0, 1, 2, 3, 4].map((r) => <line key={r} x1="6" y1={7 + r * 5} x2={r === 4 ? 18 : 24} y2={7 + r * 5} stroke={stroke} />)}
            </svg>
        );
    }
    return (
        <svg width={34} height={30} viewBox="0 0 34 30" fill="none">
            {[0, 1, 2, 3].map((r) => (
                <g key={r}>
                    <path d={`M 1 ${4 + r * 7} l 2 2 l 3 -3`} stroke={r < 2 ? '#10b981' : stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="10" y1={4 + r * 7} x2="33" y2={4 + r * 7} stroke={stroke} />
                </g>
            ))}
        </svg>
    );
}

function Flag({ code }: { code: OutputCard['flag'] }) {
    if (code === 'OTHERS') {
        return (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
                <Globe className="w-3.5 h-3.5" strokeWidth={2} />
            </span>
        );
    }
    return (
        <svg width={20} height={20} viewBox="0 0 20 20">
            <defs>
                <clipPath id={`flag-${code}`}>
                    <circle cx="10" cy="10" r="10" />
                </clipPath>
            </defs>
            <g clipPath={`url(#flag-${code})`}>
                {code === 'US' && (
                    <>
                        <rect width="20" height="20" fill="#fff" />
                        {[0, 1, 2, 3, 4, 5, 6].map((r) => <rect key={r} y={r * 2.86} width="20" height="1.43" fill="#b22234" />)}
                        <rect width="9" height="10" fill="#3c3b6e" />
                    </>
                )}
                {code === 'EU' && (
                    <>
                        <rect width="20" height="20" fill="#0a3161" />
                        {Array.from({ length: 8 }).map((_, i) => {
                            const a = (i / 8) * Math.PI * 2;
                            return <circle key={i} cx={10 + Math.sin(a) * 6} cy={10 - Math.cos(a) * 6} r="1.1" fill="#ffcc00" />;
                        })}
                    </>
                )}
                {code === 'JP' && (
                    <>
                        <rect width="20" height="20" fill="#fff" />
                        <circle cx="10" cy="10" r="5.5" fill="#bc002d" />
                    </>
                )}
            </g>
            <circle cx="10" cy="10" r="9.5" fill="none" stroke="#0f172a" strokeOpacity="0.08" />
        </svg>
    );
}
