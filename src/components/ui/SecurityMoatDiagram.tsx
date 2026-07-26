'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Shield,
    Database,
    FileClock,
    Users,
    UserCheck,
    Brain,
    type LucideIcon,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────
   SecurityMoatDiagram
   ──────────────────────────────────────────────────────────────────────
   Auto-cycling architecture diagram. The hexagonal mark's six facets
   each represent a security layer; every 4 seconds the active facet
   advances, the matching card highlights, and a node line draws out
   from the facet ending in the layer name.

   Cards are ordered foundation → surface (RLS at the bedrock; AI at
   the visible top), reinforcing the architecture story. Each LAYERS
   index maps to the FACETS index of the same number.
   ────────────────────────────────────────────────────────────────────── */

interface Layer {
    title: string;
    description: string;
    Icon: LucideIcon;
}

const LAYERS: readonly Layer[] = [
    {
        title: 'Enforced Row-Level Security',
        description:
            'Database-level access policies help prevent cross-tenant exposure, even from accidental or rogue queries.',
        Icon: Shield,
    },
    {
        title: 'Strict Tenant Isolation',
        description:
            "Tenant-scoped transactions keep every organization's patent families, filings, documents, and users separated.",
        Icon: Database,
    },
    {
        title: 'Append-Only Audit Trails',
        description:
            'Every critical mutation records actor, timestamp, reason-for-change, and before/after values.',
        Icon: FileClock,
    },
    {
        title: 'Granular RBAC',
        description:
            'Admin, Attorney, Paralegal, and Viewer roles control access by module and action.',
        Icon: Users,
    },
    {
        title: 'Enterprise SSO',
        description:
            'Auth0 Organizations, SAML/OIDC, and tenant-level identity controls for enterprise teams.',
        Icon: UserCheck,
    },
    {
        title: 'Confidential AI Processing',
        description:
            'AI drafting runs on enterprise providers configured so invention data is processed only to produce your draft, under the applicable provider agreements.',
        Icon: Brain,
    },
];

interface FacetGeometry {
    points: string;
    line: { x1: number; y1: number; x2: number; y2: number };
    dot: { cx: number; cy: number };
    /** Label text split into 1 or 2 lines so it always fits inside the SVG
     *  viewBox at every viewport. The cards below carry the verbose title;
     *  these labels are the short visual annotation on the cube itself. */
    labelLines: readonly string[];
    labelX: number;
    /** y of the FIRST line baseline. Subsequent lines are positioned via
     *  tspan dy="1.1em". For top labels we set this to a negative number so
     *  the LAST line lands just above the dot. */
    labelY: number;
    labelAnchor: 'start' | 'end';
    annotationColor: string;
    gradId: string;
}

const FACETS: readonly FacetGeometry[] = [
    /* 0 — top-right (lightest) → Enforced Row-Level Security */
    {
        points: '340,50 440,108 340,175',
        line: { x1: 390, y1: 79, x2: 430, y2: 0 },
        dot: { cx: 430, cy: 0 },
        labelLines: ['Row-Level', 'Security'],
        labelX: 438,
        labelY: -14,
        labelAnchor: 'start',
        annotationColor: '#A5B4FC',
        gradId: 'moat-g0',
    },
    /* 1 — right → Strict Tenant Isolation */
    {
        points: '440,108 440,233 340,175',
        line: { x1: 440, y1: 170.5, x2: 520, y2: 170 },
        dot: { cx: 520, cy: 170 },
        labelLines: ['Tenant', 'Isolation'],
        labelX: 528,
        labelY: 165,
        labelAnchor: 'start',
        annotationColor: '#818CF8',
        gradId: 'moat-g1',
    },
    /* 2 — bottom-right → Immutable Audit Trails */
    {
        points: '440,233 340,291 340,175',
        line: { x1: 390, y1: 262, x2: 430, y2: 345 },
        dot: { cx: 430, cy: 345 },
        labelLines: ['Audit', 'Trails'],
        labelX: 438,
        labelY: 349,
        labelAnchor: 'start',
        annotationColor: '#6366F1',
        gradId: 'moat-g2',
    },
    /* 3 — bottom-left → Granular RBAC */
    {
        points: '340,291 240,233 340,175',
        line: { x1: 290, y1: 262, x2: 250, y2: 345 },
        dot: { cx: 250, cy: 345 },
        labelLines: ['RBAC'],
        labelX: 242,
        labelY: 349,
        labelAnchor: 'end',
        annotationColor: '#4F46E5',
        gradId: 'moat-g3',
    },
    /* 4 — left → Enterprise SSO */
    {
        points: '240,233 240,108 340,175',
        line: { x1: 240, y1: 170.5, x2: 160, y2: 170 },
        dot: { cx: 160, cy: 170 },
        labelLines: ['Enterprise', 'SSO'],
        labelX: 152,
        labelY: 165,
        labelAnchor: 'end',
        annotationColor: '#818CF8',
        gradId: 'moat-g4',
    },
    /* 5 — top-left (darkest) → Confidential AI Processing */
    {
        points: '240,108 340,50 340,175',
        line: { x1: 290, y1: 79, x2: 250, y2: 0 },
        dot: { cx: 250, cy: 0 },
        labelLines: ['Confidential', 'AI'],
        labelX: 242,
        labelY: -14,
        labelAnchor: 'end',
        annotationColor: '#A5B4FC',
        gradId: 'moat-g5',
    },
];

const CYCLE_MS = 4000;
const RESUME_AFTER_INTERACT_MS = 6000;

function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function SecurityMoatDiagram() {
    const [activeIdx, setActiveIdx] = useState(0);
    const cycleRef = useRef<number | null>(null);
    const resumeRef = useRef<number | null>(null);

    const stopCycle = useCallback(() => {
        if (cycleRef.current !== null) {
            window.clearInterval(cycleRef.current);
            cycleRef.current = null;
        }
        if (resumeRef.current !== null) {
            window.clearTimeout(resumeRef.current);
            resumeRef.current = null;
        }
    }, []);

    const startCycle = useCallback(() => {
        if (cycleRef.current !== null || prefersReducedMotion()) return;
        cycleRef.current = window.setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % LAYERS.length);
        }, CYCLE_MS);
    }, []);

    /* Kick off the auto-cycle on mount; clean up on unmount */
    useEffect(() => {
        startCycle();
        return stopCycle;
    }, [startCycle, stopCycle]);

    const jumpTo = useCallback(
        (i: number) => {
            stopCycle();
            setActiveIdx(i);
            if (prefersReducedMotion()) return;
            resumeRef.current = window.setTimeout(() => {
                resumeRef.current = null;
                startCycle();
            }, RESUME_AFTER_INTERACT_MS);
        },
        [startCycle, stopCycle],
    );

    const handleZoneEnter = useCallback(() => {
        stopCycle();
    }, [stopCycle]);

    const handleZoneLeave = useCallback(() => {
        if (cycleRef.current === null && resumeRef.current === null) {
            startCycle();
        }
    }, [startCycle]);

    return (
        <div className="grid grid-cols-1 items-center gap-12 xl:grid-cols-[minmax(440px,1fr)_minmax(0,1.1fr)] xl:gap-16">
            {/* ── Cube column ── */}
            <div
                className="flex w-full justify-center"
                onMouseEnter={handleZoneEnter}
                onMouseLeave={handleZoneLeave}
            >
                <svg
                    viewBox="100 -10 480 380"
                    className="w-full max-w-160 overflow-visible"
                    role="img"
                    aria-label="Six-layer security architecture diagram. Cube facets represent: Enforced Row-Level Security, Strict Tenant Isolation, Append-Only Audit Trails, Granular RBAC, Enterprise SSO, and Confidential AI Processing."
                >
                    <defs>
                        <linearGradient id="moat-g0" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#A5B4FC" />
                            <stop offset="100%" stopColor="#818CF8" />
                        </linearGradient>
                        <linearGradient id="moat-g1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#818CF8" />
                            <stop offset="100%" stopColor="#6366F1" />
                        </linearGradient>
                        <linearGradient id="moat-g2" x1="1" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366F1" />
                            <stop offset="100%" stopColor="#4F46E5" />
                        </linearGradient>
                        <linearGradient id="moat-g3" x1="1" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#4F46E5" />
                            <stop offset="100%" stopColor="#312E81" />
                        </linearGradient>
                        <linearGradient id="moat-g4" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#312E81" />
                            <stop offset="100%" stopColor="#0F1B2D" />
                        </linearGradient>
                        <linearGradient id="moat-g5" x1="0" y1="1" x2="1" y2="0">
                            <stop offset="0%" stopColor="#0F1B2D" />
                            <stop offset="100%" stopColor="#4F46E5" />
                        </linearGradient>
                        <radialGradient id="moat-coreGlow" cx="0.5" cy="0.5" r="0.5">
                            <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.7" />
                            <stop offset="60%" stopColor="#818CF8" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="moat-bloom" cx="0.5" cy="0.5" r="0.5">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="moat-bottom-bloom" cx="0.5" cy="0.5" r="0.5">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                            <stop offset="45%" stopColor="#C7D2FE" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Outer ambient halo — soft purple wash behind the cube */}
                    <circle
                        cx="340"
                        cy="175"
                        r="120"
                        fill="url(#moat-coreGlow)"
                        opacity="0.65"
                    />

                    {/* Inner bright bloom — concentrated white-violet around the core */}
                    <circle
                        cx="340"
                        cy="175"
                        r="40"
                        fill="url(#moat-bloom)"
                        opacity="0.5"
                    />

                    {/* Cube facets — clickable, dim when not active */}
                    {FACETS.map((facet, i) => (
                        <polygon
                            key={`facet-${i}`}
                            points={facet.points}
                            fill={`url(#${facet.gradId})`}
                            className="cursor-pointer"
                            style={{
                                opacity: i === activeIdx ? 1 : 0.22,
                                transition: 'opacity 400ms ease-out',
                            }}
                            onClick={() => jumpTo(i)}
                        />
                    ))}

                    {/* Outer hex border */}
                    <polygon
                        points="340,50 440,108 440,233 340,291 240,233 240,108"
                        fill="none"
                        stroke="#6366F1"
                        strokeWidth="1"
                        opacity="0.3"
                    />

                    {/* Inner white hexagonal core — the protected IP */}
                    <polygon
                        points="340,140 370,157 370,193 340,210 310,193 310,157"
                        fill="#ffffff"
                        opacity="0.92"
                    />
                    <circle cx="340" cy="175" r="4" fill="#6366F1" />
                    <circle cx="340" cy="175" r="1.5" fill="#ffffff" />

                    {/* Bottom reflection bloom — light from the core bleeding
                        onto the surface below the cube, anchoring it in space. */}
                    <ellipse
                        cx="340"
                        cy="318"
                        rx="80"
                        ry="7"
                        fill="url(#moat-bottom-bloom)"
                        opacity="0.85"
                    />
                    <ellipse
                        cx="340"
                        cy="316"
                        rx="22"
                        ry="2.5"
                        fill="#ffffff"
                        opacity="0.9"
                    />

                    {/* Node lines, endpoint dots, and end-of-line labels.
                        Visible at every viewport. Each label is split into 1
                        or 2 lines via tspan so the text always fits inside
                        the viewBox horizontally (problem labels are stacked
                        vertically instead of overflowing horizontally). */}
                    <g pointerEvents="none">
                        {FACETS.map((facet, i) => {
                            const isActive = i === activeIdx;
                            return (
                                <g key={`anno-${i}`}>
                                    <line
                                        x1={facet.line.x1}
                                        y1={facet.line.y1}
                                        x2={facet.line.x2}
                                        y2={facet.line.y2}
                                        stroke="#E0E7FF"
                                        strokeWidth="2.25"
                                        strokeLinecap="round"
                                        strokeDasharray="100"
                                        style={{
                                            strokeDashoffset: isActive ? 0 : 100,
                                            opacity: isActive ? 0.95 : 0,
                                            transition:
                                                'stroke-dashoffset 700ms ease-out, opacity 300ms ease-out',
                                            filter: isActive
                                                ? 'drop-shadow(0 0 4px rgba(165,180,252,0.55))'
                                                : 'none',
                                        }}
                                    />
                                    <circle
                                        cx={facet.dot.cx}
                                        cy={facet.dot.cy}
                                        r="4"
                                        fill="#E0E7FF"
                                        style={{
                                            opacity: isActive ? 1 : 0,
                                            transition: 'opacity 300ms ease-out',
                                            transitionDelay: isActive ? '500ms' : '0ms',
                                            filter: isActive
                                                ? 'drop-shadow(0 0 6px rgba(165,180,252,0.7))'
                                                : 'none',
                                        }}
                                    />
                                    <text
                                        x={facet.labelX}
                                        y={facet.labelY}
                                        textAnchor={facet.labelAnchor}
                                        fill="#ffffff"
                                        style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            fontVariantNumeric: 'lining-nums',
                                            opacity: isActive ? 1 : 0,
                                            transition: 'opacity 350ms ease-out',
                                            transitionDelay: isActive ? '450ms' : '0ms',
                                        }}
                                    >
                                        {facet.labelLines.map((line, j) => (
                                            <tspan
                                                key={`line-${j}`}
                                                x={facet.labelX}
                                                dy={j === 0 ? 0 : '1.1em'}
                                            >
                                                {line}
                                            </tspan>
                                        ))}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* ── Cards column ── */}
            <div
                className="grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2"
                onMouseEnter={handleZoneEnter}
                onMouseLeave={handleZoneLeave}
            >
                {LAYERS.map((layer, i) => {
                    const isActive = i === activeIdx;
                    const Icon = layer.Icon;
                    return (
                        <button
                            key={layer.title}
                            type="button"
                            onClick={() => jumpTo(i)}
                            onMouseEnter={() => jumpTo(i)}
                            onFocus={() => jumpTo(i)}
                            aria-pressed={isActive}
                            aria-label={`${layer.title}, layer ${i + 1} of ${LAYERS.length}`}
                            className={`group relative cursor-pointer rounded-2xl border p-6 text-left transition-all duration-350 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-navy ${
                                isActive
                                    ? '-translate-y-0.5 border-primary-light/55 bg-primary/14 shadow-[0_12px_40px_-12px_rgba(99,102,241,0.45),inset_0_1px_0_rgba(255,255,255,0.05)]'
                                    : 'border-white/10 bg-white/4 hover:border-primary-light/30 hover:bg-primary/7'
                            }`}
                        >
                            <span
                                className={`absolute right-5 top-4 font-mono text-[10px] font-semibold tracking-[0.08em] transition-opacity duration-350 ${
                                    isActive
                                        ? 'text-primary-light opacity-100'
                                        : 'text-primary-light opacity-50'
                                }`}
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                {`0${i + 1}`}
                            </span>
                            <span
                                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-350 ${
                                    isActive
                                        ? 'scale-[1.05] border-primary-light/45 bg-linear-to-br from-primary-light/30 via-primary-light/15 to-transparent text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_10px_rgba(165,180,252,0.28)]'
                                        : 'border-white/15 bg-linear-to-br from-white/8 via-white/4 to-transparent text-primary-light shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                                }`}
                                aria-hidden="true"
                            >
                                <Icon className="h-5 w-5" strokeWidth={1.75} />
                            </span>
                            <h3
                                className="text-[17px] font-bold leading-tight text-white"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                {layer.title}
                            </h3>
                            <p
                                className="mt-2 text-[13px] leading-relaxed text-text-on-dark/55"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                {layer.description}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
