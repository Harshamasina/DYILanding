'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Replica of the in-app Loss of Exclusivity timeline: a per-product Gantt of
 * granted patents, regulatory rights, and context rows, with the today line,
 * the regulatory floor, and the combined horizon drawn across them.
 */

const START_YEAR = 2026;
const END_YEAR = 2050;
const TICKS = [2028, 2032, 2036, 2040, 2044, 2048];

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/** Maps a decimal year onto the 0 to 100 chart axis. */
function pct(year: number) {
    return ((year - START_YEAR) / (END_YEAR - START_YEAR)) * 100;
}

type BarKind = 'granted' | 'regulatory' | 'excluded' | 'context';

interface TimelineRow {
    label: string;
    sublabel: string;
    kind: BarKind;
    start: number;
    end: number;
    tooltip: string;
}

const ROWS: TimelineRow[] = [
    { label: 'EP 4 512 880 B1', sublabel: 'granted', kind: 'granted', start: 2028.1, end: 2048.12, tooltip: 'Granted patent, expires 2048-02-15' },
    { label: 'EP26890001.4', sublabel: 'granted', kind: 'granted', start: 2026.5, end: 2046.3, tooltip: 'Granted patent, expires 2046-04-10' },
    { label: 'Pediatric', sublabel: 'revoked · product-wide', kind: 'excluded', start: 2041.6, end: 2042.2, tooltip: 'Revoked, excluded from the horizon' },
    { label: 'Market protection', sublabel: 'active · product-wide', kind: 'regulatory', start: 2031.4, end: 2041.5, tooltip: 'Regulatory right, ends 2041-07-01' },
    { label: 'PCT context', sublabel: 'Recorded national-phase deadline', kind: 'context', start: 2026.2, end: 2027.9, tooltip: 'PCT context, national-phase deadline' },
    { label: 'PCT context', sublabel: 'Recorded national-phase deadline', kind: 'context', start: 2026.2, end: 2027.9, tooltip: 'PCT context, national-phase deadline' },
];

interface Marker {
    year: number;
    label: string;
    className: string;
}

const MARKERS: Marker[] = [
    { year: 2026.53, label: 'Today', className: 'w-px bg-danger/50' },
    { year: 2041.5, label: 'Regulatory floor', className: 'w-px bg-primary' },
    { year: 2048.12, label: 'Combined horizon', className: 'w-0.5 bg-danger' },
];

const STATS = [
    { label: 'Patent wall', value: '2048-02-15' },
    { label: 'Regulatory floor', value: '2041-07-01' },
    { label: 'Combined horizon', value: '2048-02-15' },
];

/** Diagonal hatch used for regulatory rights and projected patents. */
const HATCH = 'repeating-linear-gradient(45deg, rgba(79,70,229,0.30) 0 5px, rgba(255,255,255,0) 5px 10px)';
const HATCH_LIGHT = 'repeating-linear-gradient(45deg, rgba(129,140,248,0.35) 0 5px, rgba(255,255,255,0) 5px 10px)';

export function LoeTimeline() {
    const reduce = useReducedMotion();

    /* Bars grow from their start date; markers drop in after the bars land. */
    const barMotion = (i: number) =>
        reduce
            ? {}
            : {
                  initial: { scaleX: 0, opacity: 0 },
                  whileInView: { scaleX: 1, opacity: 1 },
                  viewport: { once: true, margin: '-60px' },
                  transition: { duration: 0.7, delay: 0.15 + i * 0.09, ease: EASE },
              };

    const markerMotion = (i: number) =>
        reduce
            ? {}
            : {
                  initial: { scaleY: 0, opacity: 0 },
                  whileInView: { scaleY: 1, opacity: 1 },
                  viewport: { once: true, margin: '-60px' },
                  transition: { duration: 0.5, delay: 0.75 + i * 0.12, ease: EASE },
              };

    const rowMotion = (i: number) =>
        reduce
            ? {}
            : {
                  initial: { opacity: 0, y: 8 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: '-60px' },
                  transition: { duration: 0.5, delay: i * 0.07, ease: EASE },
              };

    return (
        <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-lg shadow-primary/[0.04] ring-1 ring-primary/[0.06] backdrop-blur-md sm:p-5">
            <Legend />

            <div className="mt-4 overflow-x-auto rounded-xl border border-card-border bg-white/80">
                <div className="min-w-[680px]">
                    {/* Product header */}
                    <div className="flex items-end justify-between gap-6 border-b border-card-border bg-page-bg-alt/70 px-4 py-3">
                        <div className="min-w-0">
                            <p
                                className="truncate text-sm font-semibold text-text-primary"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                OncoNova B1 · EP
                            </p>
                            <span
                                className="mt-1.5 inline-flex rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-text-secondary ring-1 ring-card-border"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Product-wide
                            </span>
                        </div>
                        <div className="flex shrink-0 gap-5 sm:gap-7">
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    className="text-right"
                                    {...(reduce
                                        ? {}
                                        : {
                                              initial: { opacity: 0, y: 6 },
                                              whileInView: { opacity: 1, y: 0 },
                                              viewport: { once: true, margin: '-60px' },
                                              transition: { duration: 0.5, delay: 0.15 + i * 0.08, ease: EASE },
                                          })}
                                >
                                    <p
                                        className="text-[11px] text-text-muted"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {stat.label}
                                    </p>
                                    <p
                                        className="mt-0.5 text-[13px] font-semibold text-text-primary"
                                        style={{ fontFamily: 'var(--font-mono)' }}
                                    >
                                        {stat.value}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="flex">
                        {/* Row labels */}
                        <div className="w-[200px] shrink-0">
                            {ROWS.map((row, i) => (
                                <motion.div
                                    key={`${row.label}-${i}`}
                                    className="flex h-14 flex-col justify-center border-b border-card-border/70 px-4 last:border-b-0"
                                    {...rowMotion(i)}
                                >
                                    <p
                                        className="truncate text-[13px] font-semibold text-text-primary"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {row.label}
                                    </p>
                                    <p
                                        className="truncate text-[11px] text-text-muted"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {row.sublabel}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Plot area */}
                        <div className="relative flex-1 border-l border-card-border">
                            {/* Year gridlines */}
                            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                                {TICKS.map((tick) => (
                                    <span
                                        key={tick}
                                        className="absolute inset-y-0 w-px bg-card-border/70"
                                        style={{ left: `${pct(tick)}%` }}
                                    />
                                ))}
                            </div>

                            {/* Marker lines */}
                            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                                {MARKERS.map((marker, i) => (
                                    <motion.span
                                        key={marker.label}
                                        className={`absolute inset-y-0 origin-top ${marker.className}`}
                                        style={{ left: `${pct(marker.year)}%` }}
                                        {...markerMotion(i)}
                                    />
                                ))}
                            </div>

                            {/* Bars */}
                            {ROWS.map((row, i) => (
                                <div
                                    key={`${row.label}-bar-${i}`}
                                    className="relative h-14 border-b border-card-border/70 transition-colors duration-200 last:border-b-0 hover:bg-primary/[0.03]"
                                >
                                    <motion.div
                                        className="group absolute top-1/2 origin-left -translate-y-1/2"
                                        style={{
                                            left: `${pct(row.start)}%`,
                                            width: `${pct(row.end) - pct(row.start)}%`,
                                        }}
                                        {...barMotion(i)}
                                    >
                                        <Bar row={row} />
                                        <Tooltip text={row.tooltip} />
                                    </motion.div>
                                </div>
                            ))}

                            {/* Year axis */}
                            <div className="relative h-8">
                                {TICKS.map((tick) => (
                                    <span
                                        key={tick}
                                        className="absolute top-2 -translate-x-1/2 text-[11px] text-text-muted"
                                        style={{ left: `${pct(tick)}%`, fontFamily: 'var(--font-mono)' }}
                                    >
                                        {tick}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Bar({ row }: { row: TimelineRow }) {
    if (row.kind === 'granted') {
        return (
            <div
                title={row.tooltip}
                className="h-2.5 w-full rounded-full bg-success shadow-sm transition-all duration-300 group-hover:scale-y-125 group-hover:shadow-md group-hover:shadow-success/25"
            />
        );
    }

    if (row.kind === 'regulatory') {
        return (
            <div
                title={row.tooltip}
                className="h-2.5 w-full rounded-full border border-primary/70 transition-all duration-300 group-hover:scale-y-125 group-hover:shadow-md group-hover:shadow-primary/20"
                style={{ backgroundImage: HATCH }}
            />
        );
    }

    if (row.kind === 'excluded') {
        return (
            <div
                title={row.tooltip}
                className="h-2.5 w-full rounded-full bg-slate-300 transition-all duration-300 group-hover:scale-y-125 group-hover:bg-slate-400"
            />
        );
    }

    return (
        <div
            title={row.tooltip}
            className="h-1 w-full rounded-full bg-text-secondary transition-all duration-300 group-hover:scale-y-150 group-hover:bg-text-primary"
        />
    );
}

function Tooltip({ text }: { text: string }) {
    return (
        <span
            className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden whitespace-nowrap rounded-lg border border-card-border bg-white px-2.5 py-1 text-[11px] font-medium text-text-primary opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 sm:block"
            style={{ fontFamily: 'var(--font-mono)' }}
        >
            {text}
        </span>
    );
}

interface LegendItem {
    label: string;
    swatch: React.ReactNode;
}

const LEGEND: LegendItem[] = [
    { label: 'Granted patent', swatch: <span className="h-2 w-7 rounded-full bg-success" /> },
    {
        label: 'Pending (projected)',
        swatch: (
            <span
                className="h-2 w-7 rounded-full border border-dashed border-primary-light"
                style={{ backgroundImage: HATCH_LIGHT }}
            />
        ),
    },
    {
        label: 'Regulatory right',
        swatch: (
            <span
                className="h-2 w-7 rounded-full border border-primary/70"
                style={{ backgroundImage: HATCH }}
            />
        ),
    },
    { label: 'PRV/PCT context', swatch: <span className="h-1 w-7 rounded-full bg-text-secondary" /> },
    { label: 'Excluded / inactive', swatch: <span className="h-2 w-7 rounded-full bg-slate-300" /> },
    { label: 'Today', swatch: <span className="h-4 w-0.5 rounded-full bg-danger/50" /> },
    { label: 'Patent wall', swatch: <span className="h-4 w-0.5 rounded-full bg-success" /> },
    { label: 'Regulatory floor', swatch: <span className="h-4 w-0.5 rounded-full bg-primary" /> },
    { label: 'Combined horizon', swatch: <span className="h-4 w-0.5 rounded-full bg-danger" /> },
    { label: 'Annuity risk', swatch: <span className="h-2 w-2 rounded-full bg-compliance" /> },
];

function Legend() {
    return (
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-card-border bg-white/80 px-3.5 py-2.5">
            {LEGEND.map((item) => (
                <li
                    key={item.label}
                    className="flex items-center gap-1.5 text-[11px] text-text-secondary transition-colors duration-200 hover:text-text-primary"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {item.swatch}
                    {item.label}
                </li>
            ))}
        </ul>
    );
}
