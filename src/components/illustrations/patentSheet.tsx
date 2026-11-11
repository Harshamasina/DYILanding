'use client';

import { createContext, useContext, useId, type ReactNode } from 'react';

/* One drawing system for every product hero: white cards, indigo ink and
   slate labels on an open sheet with a small title and the brand mark. Every
   hero builds from these parts and sets no colours, sizes or strokes of its
   own, so the five drawings read as one family. The viewBox is 728 by 692:
   a 72 unit header band holds the title and the mark, and each drawing's
   content is laid out on the 728 by 620 area below it. The heroes render at
   about 560px wide, so 15 units of type lands near 11.5px.

   Layout rules shared by every hero: content sits 40 units in from the
   edges, cards are 24 to 32 units apart on an 8 unit grid, text stays at
   least 16 units inside a card, and each drawing has one hero card. */

export const INK = '#4f46e5';
export const INK_SOFT = '#a5b4fc';
export const INK_TINT = '#e0e7ff';
export const BORDER = '#c7d2fe';
export const SLATE = '#64748b';
export const TEXT = '#0f172a';
export const LINE = '#e2e8f0';
export const PAPER = '#ffffff';
/* Marks a partial or pending state only. */
export const AMBER = '#b45309';

const SIZE = { label: 15, body: 16, title: 17, heroTitle: 20, figure: 30 } as const;
const RADIUS = 10;
const STROKE = 1.25;

const mono = '[font-family:var(--font-mono)]';
const serif = '[font-family:var(--font-body)]';

const HEADER = 72;

const ShadowContext = createContext({ hero: '', card: '' });

type Anchor = 'start' | 'middle' | 'end';

/* The centre of a drawing's hero card, in content coordinates. The backdrop's
   rings are centred on it. */
export interface Focus {
    cx: number;
    cy: number;
}

export function Sheet({ title, focus, className = 'h-auto w-full max-w-[560px]', children }: { title: string; focus: Focus; className?: string; children: ReactNode }) {
    const base = useId().replace(/[^a-zA-Z0-9_-]/g, '');
    const ids = { hero: `sheet-hero-${base}`, card: `sheet-card-${base}` };
    return (
        <svg viewBox={`0 0 728 ${620 + HEADER}`} fill="none" aria-hidden="true" focusable="false" className={`select-none ${className}`}>
            <defs>
                <filter id={ids.hero} x="-20%" y="-20%" width="140%" height="160%">
                    <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor={INK} floodOpacity="0.12" />
                </filter>
                <filter id={ids.card} x="-20%" y="-20%" width="140%" height="160%">
                    <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor={SLATE} floodOpacity="0.08" />
                </filter>
            </defs>
            <Backdrop id={base} focus={{ cx: focus.cx, cy: focus.cy + HEADER }} />
            <Label x={40} y={56}>{title}</Label>
            <BrandMark id={base} cx={652} cy={44} size={64} />
            <g transform={`translate(0 ${HEADER})`}>
                <ShadowContext.Provider value={ids}>{children}</ShadowContext.Provider>
            </g>
        </svg>
    );
}

/* The app's logo mark, drawn from public/logos/dyi-logo-mark.svg: six
   shaded facets around a white core. The source hexagon is 200 by 241 units
   centred on (340, 175); size sets the drawn height. Two faint rings sit
   around it, as in the earlier hero drawings. */
const MARK_FACETS = [
    { points: '340,50 440,108 340,175', from: '#A5B4FC', to: '#818CF8', x1: 0, y1: 0, x2: 1, y2: 1 },
    { points: '440,108 440,233 340,175', from: '#818CF8', to: '#6366F1', x1: 0, y1: 0, x2: 0, y2: 1 },
    { points: '440,233 340,291 340,175', from: '#6366F1', to: '#4F46E5', x1: 1, y1: 0, x2: 0, y2: 1 },
    { points: '340,291 240,233 340,175', from: '#4F46E5', to: '#312E81', x1: 1, y1: 1, x2: 0, y2: 0 },
    { points: '240,233 240,108 340,175', from: '#312E81', to: '#0F1B2D', x1: 0, y1: 1, x2: 0, y2: 0 },
    { points: '240,108 340,50 340,175', from: '#0F1B2D', to: '#4F46E5', x1: 0, y1: 1, x2: 1, y2: 0 },
] as const;

const MARK_EDGES = [
    { x: 340, y: 50, o: 0.15 },
    { x: 440, y: 108, o: 0.12 },
    { x: 440, y: 233, o: 0.1 },
    { x: 340, y: 291, o: 0.08 },
    { x: 240, y: 233, o: 0.1 },
    { x: 240, y: 108, o: 0.12 },
] as const;

export function BrandMark({ id, cx, cy, size }: { id: string; cx: number; cy: number; size: number }) {
    const scale = size / 241;
    return (
        <g>
            <defs>
                {MARK_FACETS.map((facet, i) => (
                    <linearGradient key={facet.points} id={`mark-${id}-${i}`} x1={facet.x1} y1={facet.y1} x2={facet.x2} y2={facet.y2}>
                        <stop offset="0%" stopColor={facet.from} />
                        <stop offset="100%" stopColor={facet.to} />
                    </linearGradient>
                ))}
            </defs>
            <circle cx={cx} cy={cy} r={size * 0.62} fill={PAPER} stroke={INK_SOFT} strokeOpacity="0.55" strokeDasharray="4 5" />
            <g transform={`translate(${cx} ${cy}) scale(${scale}) translate(-340 -175)`}>
                {MARK_FACETS.map((facet, i) => (
                    <polygon key={facet.points} points={facet.points} fill={`url(#mark-${id}-${i})`} />
                ))}
                {MARK_EDGES.map(edge => (
                    <line key={`${edge.x}-${edge.y}`} x1={edge.x} y1={edge.y} x2="340" y2="175" stroke="#ffffff" strokeWidth="0.5" opacity={edge.o} />
                ))}
                <polygon points="340,50 440,108 440,233 340,291 240,233 240,108" stroke="#6366F1" strokeWidth="1" opacity="0.3" />
                <polygon points="340,140 370,157 370,193 340,210 310,193 310,157" fill="#ffffff" opacity="0.92" />
                <polygon points="340,147 364,161 364,189 340,203 316,189 316,161" stroke="#6366F1" strokeWidth="0.5" opacity="0.3" />
                <circle cx="340" cy="175" r="4" fill="#6366F1" />
                <circle cx="340" cy="175" r="1.5" fill="#ffffff" />
            </g>
        </g>
    );
}

/* Atmosphere behind the cards, as in the earlier hero drawings: faint
   orbit rings centred on the hero card, a dot field that fades in toward
   the bottom, plus marks and two hollow circles in the margins. Same
   parameters on every hero; only the ring centre follows the hero card. */
const PLUS_MARKS = [
    [20, 150],
    [708, 210],
    [20, 440],
    [708, 520],
    [560, 40],
] as const;

export function Backdrop({ id, focus }: { id: string; focus: Focus }) {
    const dots = `sheet-dots-${id}`;
    const fade = `sheet-fade-${id}`;
    const mask = `sheet-mask-${id}`;
    return (
        <g>
            <defs>
                <pattern id={dots} width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.1" fill={INK_SOFT} />
                </pattern>
                <linearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                </linearGradient>
                <mask id={mask}>
                    <rect x="0" y="330" width="728" height="362" fill={`url(#${fade})`} />
                </mask>
            </defs>
            <rect x="0" y="330" width="728" height="362" fill={`url(#${dots})`} mask={`url(#${mask})`} opacity="0.45" />
            <g stroke={INK_SOFT} strokeWidth="1.25">
                <circle cx={focus.cx} cy={focus.cy} r="190" strokeOpacity="0.4" strokeDasharray="5 7" />
                <circle cx={focus.cx} cy={focus.cy} r="260" strokeOpacity="0.3" />
                <circle cx={focus.cx} cy={focus.cy} r="330" strokeOpacity="0.25" strokeDasharray="5 7" />
            </g>
            <g stroke={INK_SOFT} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round">
                {PLUS_MARKS.map(([x, y]) => (
                    <path key={`${x}-${y}`} d={`M${x - 6} ${y}H${x + 6}M${x} ${y - 6}V${y + 6}`} />
                ))}
            </g>
            <g stroke={INK_SOFT} strokeOpacity="0.45" strokeWidth="1.5">
                <circle cx="22" cy="300" r="4.5" />
                <circle cx="706" cy="640" r="4" />
            </g>
        </g>
    );
}

/* A card on the sheet. One hero card per drawing carries the subject in
   ink with the deeper shadow; normal cards support it; quiet cards sit back
   with no shadow; dashed marks a draft or an outside tool. */
export function Box({ x, y, w, h, tone = 'normal', dashed = false }: { x: number; y: number; w: number; h: number; tone?: 'hero' | 'normal' | 'quiet'; dashed?: boolean }) {
    const ids = useContext(ShadowContext);
    const shadow = dashed || tone === 'quiet' ? undefined : `url(#${tone === 'hero' ? ids.hero : ids.card})`;
    return (
        <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={RADIUS}
            fill={PAPER}
            stroke={dashed ? SLATE : tone === 'hero' ? INK : BORDER}
            strokeOpacity={dashed ? 0.55 : 1}
            strokeWidth={tone === 'hero' ? 1.5 : STROKE}
            strokeDasharray={dashed ? '6 5' : undefined}
            filter={shadow}
        />
    );
}

/* A page with a folded corner: a filed document, a cited reference or an export. */
export function Page({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
    const ids = useContext(ShadowContext);
    const fold = 22;
    return (
        <g filter={`url(#${ids.card})`}>
            <path
                d={`M${x + RADIUS} ${y}H${x + w - fold}L${x + w} ${y + fold}V${y + h - RADIUS}Q${x + w} ${y + h} ${x + w - RADIUS} ${y + h}H${x + RADIUS}Q${x} ${y + h} ${x} ${y + h - RADIUS}V${y + RADIUS}Q${x} ${y} ${x + RADIUS} ${y}Z`}
                fill={PAPER}
                stroke={BORDER}
                strokeWidth={STROKE}
            />
            <path d={`M${x + w - fold} ${y}V${y + fold}H${x + w}`} stroke={BORDER} strokeWidth={STROKE} />
        </g>
    );
}

export function Title({ x, y, anchor = 'start', muted = false, hero = false, children }: { x: number; y: number; anchor?: Anchor; muted?: boolean; hero?: boolean; children: ReactNode }) {
    return (
        <text x={x} y={y} fontSize={hero ? SIZE.heroTitle : SIZE.title} fontWeight="600" textAnchor={anchor} fill={muted ? SLATE : INK} className={mono}>
            {children}
        </text>
    );
}

export function Label({ x, y, anchor = 'start', tone = 'slate', children }: { x: number; y: number; anchor?: Anchor; tone?: 'slate' | 'ink' | 'amber'; children: ReactNode }) {
    const fill = tone === 'ink' ? INK : tone === 'amber' ? AMBER : SLATE;
    return (
        <text x={x} y={y} fontSize={SIZE.label} letterSpacing="1" textAnchor={anchor} fill={fill} className={mono}>
            {children}
        </text>
    );
}

export function Body({ x, y, anchor = 'start', children }: { x: number; y: number; anchor?: Anchor; children: ReactNode }) {
    return (
        <text x={x} y={y} fontSize={SIZE.body} textAnchor={anchor} fill={TEXT} className={serif}>
            {children}
        </text>
    );
}

/* A large figure, such as a count. */
export function Figure({ x, y, anchor = 'start', children }: { x: number; y: number; anchor?: Anchor; children: ReactNode }) {
    return (
        <text x={x} y={y} fontSize={SIZE.figure} fontWeight="600" textAnchor={anchor} fill={TEXT} className={mono}>
            {children}
        </text>
    );
}

/* A support, risk or progress bar. value runs from 0 to 1. */
export function Bar({ x, y, w, value, tone = 'ink' }: { x: number; y: number; w: number; value: number; tone?: 'ink' | 'soft' | 'amber' }) {
    const fill = tone === 'soft' ? INK_SOFT : tone === 'amber' ? AMBER : INK;
    return (
        <g>
            <rect x={x} y={y} width={w} height="6" rx="3" fill={INK_TINT} />
            <rect x={x} y={y} width={Math.max(6, w * value)} height="6" rx="3" fill={fill} />
        </g>
    );
}

/* One grey line standing in for text. At most one per card. */
export function Placeholder({ x, y, w }: { x: number; y: number; w: number }) {
    return <rect x={x} y={y} width={w} height="7" rx="3.5" fill={LINE} />;
}

/* A highlighted passage on a page. */
export function Highlight({ x, y, w }: { x: number; y: number; w: number }) {
    return <rect x={x} y={y} width={w} height="12" rx="3" fill={INK_TINT} />;
}

/* The first and last points of an absolute path made of M, L, H, V and C. */
function endpoints(d: string): [number, number, number, number] {
    const tokens = d.match(/[MLHVC]|-?\d+(?:\.\d+)?/g) ?? [];
    let command = 'M';
    let x = 0;
    let y = 0;
    let startX = 0;
    let startY = 0;
    let started = false;
    let i = 0;
    while (i < tokens.length) {
        const token = tokens[i];
        if (/[MLHVC]/.test(token)) {
            command = token;
            i += 1;
            continue;
        }
        if (command === 'H') {
            x = Number(token);
            i += 1;
        } else if (command === 'V') {
            y = Number(token);
            i += 1;
        } else if (command === 'C') {
            x = Number(tokens[i + 4]);
            y = Number(tokens[i + 5]);
            i += 6;
        } else {
            x = Number(token);
            y = Number(tokens[i + 1]);
            i += 2;
        }
        if (!started) {
            startX = x;
            startY = y;
            started = true;
        }
    }
    return [startX, startY, x, y];
}

export function Connector({ d, dashed = false, start = true, end = true }: { d: string; dashed?: boolean; start?: boolean; end?: boolean }) {
    const [sx, sy, ex, ey] = endpoints(d);
    return (
        <g>
            <path d={d} stroke={dashed ? INK : INK_SOFT} strokeOpacity={dashed ? 0.7 : 1} strokeWidth="1.5" strokeDasharray={dashed ? '5 5' : undefined} />
            {start && <circle cx={sx} cy={sy} r="3.5" fill={INK} />}
            {end && <circle cx={ex} cy={ey} r="3.5" fill={INK} />}
        </g>
    );
}

export function Pill({ x, y, w, tone = 'ink', children }: { x: number; y: number; w: number; tone?: 'ink' | 'slate'; children: ReactNode }) {
    return (
        <g>
            <rect x={x} y={y} width={w} height="30" rx="15" fill={PAPER} stroke={tone === 'ink' ? INK_SOFT : BORDER} strokeWidth={STROKE} />
            <Label x={x + w / 2} y={y + 20} anchor="middle" tone={tone === 'ink' ? 'ink' : 'slate'}>
                {children}
            </Label>
        </g>
    );
}

/* A filled tick: a check that held or a step that is done. */
export function Check({ x, y }: { x: number; y: number }) {
    return (
        <g>
            <circle cx={x} cy={y} r="9" fill={INK} />
            <path d={`M${x - 4} ${y}L${x - 1} ${y + 3}L${x + 4.5} ${y - 3.5}`} stroke={PAPER} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    );
}

/* A completion ring with a tick in the middle. */
export function Ring({ cx, cy, r = 26 }: { cx: number; cy: number; r?: number }) {
    return (
        <g>
            <circle cx={cx} cy={cy} r={r} stroke={INK_TINT} strokeWidth="6" />
            <circle cx={cx} cy={cy} r={r} stroke={INK} strokeWidth="6" strokeDasharray={`${2 * Math.PI * r * 0.999} 1000`} transform={`rotate(-90 ${cx} ${cy})`} />
            <path d={`M${cx - 9} ${cy}L${cx - 2} ${cy + 7}L${cx + 10} ${cy - 7}`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    );
}

/* A circled mark, such as a due date on a calendar. */
export function Circled({ cx, cy, r = 17, dashed = false }: { cx: number; cy: number; r?: number; dashed?: boolean }) {
    return <circle cx={cx} cy={cy} r={r} stroke={dashed ? SLATE : INK} strokeOpacity={dashed ? 0.6 : 1} strokeWidth="1.5" strokeDasharray={dashed ? '3 3' : undefined} fill={dashed ? 'none' : INK_TINT} />;
}

/* Thin line art inside a card, such as a chemical structure or a claim tree. */
export function Ink({ d, soft = false }: { d: string; soft?: boolean }) {
    return <path d={d} stroke={soft ? INK_SOFT : INK} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />;
}

/* A node on line art, such as a claim in a claim tree. */
export function Dot({ cx, cy, r = 3, soft = false }: { cx: number; cy: number; r?: number; soft?: boolean }) {
    return <circle cx={cx} cy={cy} r={r} fill={soft ? INK_SOFT : INK} />;
}
