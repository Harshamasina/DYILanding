'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MockupRecordLabel } from './BrowserMockupChrome';

/* ── Choreographed deadline calendar mockup ──
   Dynamically uses the current month and next month so it always
   feels current to the visitor. Deadline events are seeded deterministically
   based on month/year so they look realistic. Loops every ~8s. */

interface CalendarEvent {
    day: number;
    label: string;
    color: string;
    textColor: string;
}

interface MonthData {
    monthIndex: number;
    name: string;
    shortName: string;
    year: number;
    startDay: number;
    totalDays: number;
    events: CalendarEvent[];
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const EVENT_TEMPLATES: { label: string; color: string; textColor: string }[] = [
    { label: 'OA Response Due', color: 'bg-red-100', textColor: 'text-red-700' },
    { label: 'Annuity Fee Due', color: 'bg-amber-100', textColor: 'text-amber-700' },
    { label: 'USPTO Search', color: 'bg-primary/10', textColor: 'text-primary' },
    { label: 'RFE Deadline', color: 'bg-red-100', textColor: 'text-red-700' },
    { label: 'Review PRV Filing', color: 'bg-emerald-100', textColor: 'text-emerald-700' },
    { label: 'Invention Disclosure', color: 'bg-amber-100', textColor: 'text-amber-700' },
    { label: 'Family Validation', color: 'bg-emerald-100', textColor: 'text-emerald-700' },
    { label: 'Review PRV Package', color: 'bg-primary/10', textColor: 'text-primary' },
    { label: 'PCT Filing Due', color: 'bg-red-100', textColor: 'text-red-700' },
    { label: 'EP Response Due', color: 'bg-amber-100', textColor: 'text-amber-700' },
    { label: 'Fee Payment', color: 'bg-primary/10', textColor: 'text-primary' },
    { label: 'NPE Review', color: 'bg-emerald-100', textColor: 'text-emerald-700' },
    { label: 'OA Draft Review', color: 'bg-amber-100', textColor: 'text-amber-700' },
    { label: 'JP National Phase', color: 'bg-red-100', textColor: 'text-red-700' },
    { label: 'Annuity Renewal', color: 'bg-primary/10', textColor: 'text-primary' },
    { label: 'Status Update', color: 'bg-emerald-100', textColor: 'text-emerald-700' },
];

/** Simple seeded pseudo-random for deterministic event placement */
function seededDays(month: number, year: number, count: number, maxDay: number): number[] {
    let seed = month * 31 + year;
    const days: number[] = [];
    while (days.length < count) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        const d = (seed % maxDay) + 1;
        if (d >= 3 && d <= maxDay - 2) {
            days.push(d);
        }
    }
    return days.sort((a, b) => a - b);
}

function buildMonth(monthIndex: number, year: number): MonthData {
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    const eventDays = seededDays(monthIndex, year, 8, totalDays);
    const offset = monthIndex * 7; // offset into templates so months get different events

    const events: CalendarEvent[] = eventDays.map((day, i) => {
        const tmpl = EVENT_TEMPLATES[(i + offset) % EVENT_TEMPLATES.length];
        return { day, ...tmpl };
    });

    return {
        monthIndex,
        name: MONTH_NAMES[monthIndex],
        shortName: MONTH_NAMES[monthIndex],
        year,
        startDay: firstDay,
        totalDays,
        events,
    };
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const SWITCH_TIME = 3500;
const LOOP_TIME = 7500;

export function AnimatedCalendar() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Build months dynamically from current date
    const months = useMemo(() => {
        const now = new Date();
        const m1 = now.getMonth();
        const y1 = now.getFullYear();
        const m2 = (m1 + 1) % 12;
        const y2 = m1 === 11 ? y1 + 1 : y1;
        return [buildMonth(m1, y1), buildMonth(m2, y2)];
    }, []);

    const runCycle = useCallback(() => {
        setActiveIndex(0);
        const timer = setTimeout(() => setActiveIndex(1), SWITCH_TIME);
        return [timer];
    }, []);

    useEffect(() => {
        let timers = runCycle();
        const interval = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, LOOP_TIME);
        return () => {
            timers.forEach(clearTimeout);
            clearInterval(interval);
        };
    }, [runCycle]);

    const month = months[activeIndex];
    const blanks = Array.from({ length: month.startDay }, (_, i) => i);
    const days = Array.from({ length: month.totalDays }, (_, i) => i + 1);
    // Row count — varies 4-6 depending on start day + total days. Used to
    // build an evenly-distributed grid that fills the container regardless
    // of month length, so there's no trailing whitespace.
    const rowCount = Math.ceil((month.startDay + month.totalDays) / 7);

    return (
        <div aria-hidden="true" role="img" className="relative rounded-xl border border-card-border bg-white shadow-2xl shadow-black/10 overflow-hidden select-none h-[520px] sm:h-[540px] lg:h-[560px] flex flex-col">
            {/* Chrome Bar */}
            <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-page-bg-alt border-b border-card-border">
                <MockupRecordLabel record="DEMO-DKT-001" screen="Deadline calendar" />
                <div className="hidden sm:flex flex-1 min-w-0 justify-end">
                    <div className="flex items-center gap-1.5 px-3 py-0.5 bg-white rounded-md text-[10px] sm:text-[9px] text-text-muted border border-card-border"
                        style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                        <svg className="w-2.5 h-2.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        app.designyourinvention.com
                    </div>
                </div>
            </div>

            {/* Filter row 1: Date range picker (left) + Showing text (right) */}
            <div className="shrink-0 px-3 pt-2 pb-1 flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-card-border bg-white" style={{ fontFamily: 'var(--font-dashboard)' }}>
                    <span className="text-[10px] sm:text-[9px] text-text-muted/70">Start date</span>
                    <svg className="w-2.5 h-2.5 text-text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className="text-[10px] sm:text-[9px] text-text-muted/70">End date</span>
                    <svg className="w-3 h-3 text-text-muted ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={`showing-${month.year}-${month.monthIndex}`}
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 3 }}
                        transition={{ duration: 0.25 }}
                        className="text-[10px] sm:text-[9px] text-text-muted"
                        style={{ fontFamily: 'var(--font-dashboard-mono)' }}
                    >
                        Showing {month.year}-{String(month.monthIndex + 1).padStart(2, '0')}-01 to {month.year}-{String(month.monthIndex + 1).padStart(2, '0')}-{String(month.totalDays).padStart(2, '0')}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* Filter row 2: Year + Month dropdowns + Month/Year toggle (right-aligned) */}
            <div className="shrink-0 px-3 pb-1.5 flex items-center justify-end gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] text-text-primary font-medium px-2 py-1 rounded border border-card-border bg-white cursor-default" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                    {month.year}
                    <svg className="w-2 h-2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={month.name + month.year}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.25 }}
                        className="inline-flex items-center gap-1 text-[10px] text-text-primary font-medium px-2 py-1 rounded border border-card-border bg-white cursor-default"
                        style={{ fontFamily: 'var(--font-dashboard-mono)' }}
                    >
                        {month.name}
                        <svg className="w-2 h-2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </motion.span>
                </AnimatePresence>
                <div className="flex ml-1">
                    <span className="text-[10px] font-medium px-2 py-1 rounded-l border border-primary bg-primary text-white cursor-default" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>Month</span>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-r border border-l-0 border-card-border text-text-muted cursor-default" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>Year</span>
                </div>
            </div>

            {/* Calendar Grid — fills remaining vertical space so cells
                stretch to fit and there's no trailing whitespace. */}
            <div className="flex-1 min-h-0 px-3 pb-2 flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={month.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35 }}
                        className="flex-1 min-h-0 flex flex-col"
                    >
                        {/* Day Headers */}
                        <div className="shrink-0 grid grid-cols-7 mb-1">
                            {DAYS.map(d => (
                                <div key={d} className="text-center py-1.5 text-[10px] sm:text-[9px] font-semibold text-text-muted uppercase tracking-wider"
                                    style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Day Cells — fill remaining height; rows distribute evenly */}
                        <div
                            className="flex-1 grid grid-cols-7"
                            style={{ gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }}
                        >
                            {blanks.map(i => (
                                <div key={`blank-${i}`} className="border-t border-card-border/50" />
                            ))}
                            {days.map(day => {
                                const dayEvents = month.events.filter(e => e.day === day);
                                // Cap at 2 visible chips so dense cells don't
                                // overflow their 1fr row and clip the bottom
                                // of the calendar on smaller viewports.
                                const visibleEvents = dayEvents.slice(0, 2);
                                const overflowCount = dayEvents.length - visibleEvents.length;
                                return (
                                    <div key={day} className="border-t border-card-border/50 px-0.5 py-1 overflow-hidden">
                                        <span className="text-[10px] text-text-secondary font-medium pl-1" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                            {String(day).padStart(2, '0')}
                                        </span>
                                        {visibleEvents.map((event, ei) => (
                                            <motion.div
                                                key={event.label}
                                                className={`mt-0.5 px-1 py-0.5 rounded text-[10px] sm:text-[7px] font-medium truncate ${event.color} ${event.textColor}`}
                                                style={{ fontFamily: 'var(--font-dashboard-mono)' }}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: 0.15 + ei * 0.06 + (day / month.totalDays) * 0.4 }}
                                            >
                                                {event.label}
                                            </motion.div>
                                        ))}
                                        {overflowCount > 0 && (
                                            <motion.span
                                                className="block mt-0.5 pl-1 text-[10px] sm:text-[7px] font-semibold text-text-muted"
                                                style={{ fontFamily: 'var(--font-dashboard-mono)' }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3, delay: 0.15 + visibleEvents.length * 0.06 + (day / month.totalDays) * 0.4 }}
                                            >
                                                +{overflowCount} more
                                            </motion.span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
