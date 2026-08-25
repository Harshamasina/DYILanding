'use client';

import { useEffect, useState } from 'react';
import { CalendarX2, Check, Globe, Info, Layers, ScrollText } from 'lucide-react';

/* ── Illustrative derivation trace with live dates ──
 *
 * The card walks a real 3-month U.S. office action calculation. Dates are
 * computed in the browser so the due date always lands a few days ahead of
 * whenever the visitor loads the page, and the arithmetic stays honest:
 * trigger + 3 calendar months (month-end clamp) = nominal date, then a
 * weekend- and federal-holiday-aware roll to the next open day. The static
 * fallback below is what static export renders and what no-JS visitors see. */

interface TraceDates {
    ruleVersion: string;
    triggerFull: string;
    calcAddition: string;
    nominalLine: string;
    rollLine: string;
    dueIso: string;
    dueFull: string;
}

const STATIC_FALLBACK: TraceDates = {
    ruleVersion: '2026.08',
    triggerFull: 'July 24, 2026',
    calcAddition: 'July 24 + 3 calendar months',
    nominalLine: 'October 24 falls on Saturday',
    rollLine: 'Rolled to Monday, October 26',
    dueIso: '2026-10-26',
    dueFull: 'October 26, 2026',
};

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function addDays(date: Date, days: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Same day number in the target month, clamped to that month's last day.
 * Mirrors the month-arithmetic convention shared by PCT R.80.2, EPC R.131(4),
 * and MPEP 710.01(a). */
function addMonthsClamped(date: Date, months: number): Date {
    const total = date.getFullYear() * 12 + date.getMonth() + months;
    const year = Math.floor(total / 12);
    const month = total - year * 12;
    const lastDay = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(date.getDate(), lastDay));
}

function sameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function nthWeekday(year: number, month: number, weekday: number, n: number): number {
    const firstDow = new Date(year, month, 1).getDay();
    return 1 + ((weekday - firstDow + 7) % 7) + (n - 1) * 7;
}

function lastWeekday(year: number, month: number, weekday: number): number {
    const lastDay = new Date(year, month + 1, 0);
    return lastDay.getDate() - ((lastDay.getDay() - weekday + 7) % 7);
}

/** U.S. federal holidays, including Friday/Monday observance of weekend dates. */
function isFederalHoliday(date: Date): boolean {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const dow = date.getDay();

    const fixed: Array<[number, number]> = [
        [0, 1],   // New Year's Day
        [5, 19],  // Juneteenth
        [6, 4],   // Independence Day
        [10, 11], // Veterans Day
        [11, 25], // Christmas Day
    ];
    for (const [fm, fd] of fixed) {
        if (m === fm && d === fd) return true;
        if (m === fm && d === fd + 1 && dow === 1) return true;
        if (m === fm && d === fd - 1 && dow === 5) return true;
    }
    if (m === 11 && d === 31 && dow === 5) return true;

    if (dow === 1) {
        if (m === 0 && d === nthWeekday(y, 0, 1, 3)) return true;
        if (m === 1 && d === nthWeekday(y, 1, 1, 3)) return true;
        if (m === 4 && d === lastWeekday(y, 4, 1)) return true;
        if (m === 8 && d === nthWeekday(y, 8, 1, 1)) return true;
        if (m === 9 && d === nthWeekday(y, 9, 1, 2)) return true;
    }
    if (dow === 4 && m === 10 && d === nthWeekday(y, 10, 4, 4)) return true;

    return false;
}

function isClosedDay(date: Date): boolean {
    const dow = date.getDay();
    return dow === 0 || dow === 6 || isFederalHoliday(date);
}

function monthDay(date: Date): string {
    return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

function fullDate(date: Date): string {
    return `${monthDay(date)}, ${date.getFullYear()}`;
}

function isoDate(date: Date): string {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${mm}-${dd}`;
}

function buildTrace(now: Date): TraceDates {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Aim the nominal date 2 days out, sliding forward only when the 3-month
    // back-projection does not round-trip (day 29-31 against a shorter month).
    let nominal = addDays(today, 2);
    let trigger = addMonthsClamped(nominal, -3);
    for (let offset = 2; offset <= 5; offset++) {
        const candidate = addDays(today, offset);
        const back = addMonthsClamped(candidate, -3);
        if (sameDay(addMonthsClamped(back, 3), candidate)) {
            nominal = candidate;
            trigger = back;
            break;
        }
    }

    let due = new Date(nominal);
    while (isClosedDay(due)) {
        due = addDays(due, 1);
    }

    const nominalDow = nominal.getDay();
    const nominalLine =
        nominalDow === 0 || nominalDow === 6
            ? `${monthDay(nominal)} falls on ${DAYS[nominalDow]}`
            : isFederalHoliday(nominal)
                ? `${monthDay(nominal)} falls on a federal holiday`
                : `${monthDay(nominal)} falls on ${DAYS[nominalDow]}`;

    const rollLine = sameDay(due, nominal)
        ? `${DAYS[nominalDow]} is a business day, no roll needed`
        : `Rolled to ${DAYS[due.getDay()]}, ${monthDay(due)}`;

    return {
        ruleVersion: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}`,
        triggerFull: fullDate(trigger),
        calcAddition: `${monthDay(trigger)} + 3 calendar months`,
        nominalLine,
        rollLine,
        dueIso: isoDate(due),
        dueFull: fullDate(due),
    };
}

function DeadlineTraceStep({
    icon: Icon,
    label,
    children,
    result = false,
    divider = true,
}: {
    icon: React.ElementType;
    label: string;
    children: React.ReactNode;
    result?: boolean;
    divider?: boolean;
}) {
    return (
        <li
            className={`relative grid grid-cols-[42px_minmax(0,1fr)] gap-x-4 px-1 py-4 sm:grid-cols-[42px_160px_minmax(0,1fr)] sm:items-center ${
                result
                    ? 'mt-1 rounded-xl border border-primary/15 bg-primary/[0.055] pr-4'
                    : divider
                        ? 'border-b border-card-border/80'
                        : ''
            }`}
        >
            <span
                className="relative z-10 row-span-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 text-primary shadow-sm sm:row-span-1"
                aria-hidden="true"
            >
                <Icon className="h-4.5 w-4.5" />
            </span>
            <h4
                className={`self-center text-sm font-semibold ${result ? 'uppercase tracking-[0.08em] text-primary' : 'text-text-primary'}`}
                style={{ fontFamily: result ? 'var(--font-mono)' : 'var(--font-display)' }}
            >
                {label}
            </h4>
            <div
                className="col-start-2 mt-1 text-sm leading-relaxed text-text-secondary sm:col-start-3 sm:row-start-1 sm:mt-0"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {children}
            </div>
        </li>
    );
}

export function ComputedDeadlineTrace() {
    const [live, setLive] = useState<TraceDates | null>(null);

    useEffect(() => {
        setLive(buildTrace(new Date()));
    }, []);

    const trace = live ?? STATIC_FALLBACK;

    return (
        <article className="relative overflow-hidden rounded-2xl border border-primary/15 bg-card-bg shadow-xl shadow-primary/[0.06] ring-1 ring-white/80">
            <div className="flex flex-col gap-5 border-b border-card-border px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
                <h3
                    className="text-xl font-semibold text-text-primary sm:text-2xl"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    Reply to final U.S. Office Action
                </h3>
                <div className="flex flex-wrap gap-2.5">
                    <span
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-red-600"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        <Info className="h-3.5 w-3.5" aria-hidden="true" />
                        Informational
                    </span>
                    <span
                        className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-primary"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        <CalendarX2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Computed
                    </span>
                </div>
            </div>

            <div className="grid md:grid-cols-[minmax(190px,0.29fr)_minmax(0,0.71fr)]">
                <aside className="border-b border-card-border bg-primary/[0.018] p-5 sm:p-7 md:border-r md:border-b-0">
                    <p
                        className="text-[11px] font-bold uppercase tracking-[0.13em] text-primary"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Illustrative calculation
                    </p>
                    <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-3 md:grid-cols-1">
                        <div className="border-b border-card-border pb-5 sm:border-b-0 sm:border-r sm:pr-5 md:border-r-0 md:border-b md:pr-0">
                            <dt className="text-xs text-text-muted">Rule version</dt>
                            <dd className="mt-1 font-semibold text-text-primary">{trace.ruleVersion}</dd>
                        </div>
                        <div className="border-b border-card-border pb-5 sm:border-b-0 sm:border-r sm:pr-5 md:border-r-0 md:border-b md:pr-0">
                            <dt className="text-xs text-text-muted">Coverage</dt>
                            <dd className="mt-1 font-semibold text-text-primary">U.S. Office Action</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-text-muted">Trigger source</dt>
                            <dd className="mt-1 font-semibold text-text-primary">Attorney-entered</dd>
                        </div>
                    </dl>
                </aside>

                <div className="p-4 sm:p-6 lg:px-8">
                    <div className="relative">
                        <div
                            aria-hidden="true"
                            className="absolute top-7 bottom-8 left-5 w-px bg-linear-to-b from-primary/50 via-primary/25 to-primary/10"
                        />
                        <ol aria-label="Deadline derivation trace">
                            <DeadlineTraceStep icon={CalendarX2} label="Trigger">
                                <p className="font-medium text-text-primary">Office Action issued</p>
                                <p>{trace.triggerFull}</p>
                                <p className="text-xs text-text-muted">Attorney-entered case event</p>
                            </DeadlineTraceStep>
                            <DeadlineTraceStep icon={ScrollText} label="Rule">
                                <p className="font-medium text-text-primary">
                                    3-month shortened statutory period
                                </p>
                                <p className="text-xs text-text-muted">
                                    35 U.S.C. 133 &middot; 37 CFR 1.113, 1.116, 1.136(a)
                                </p>
                            </DeadlineTraceStep>
                            <DeadlineTraceStep icon={Layers} label="Calculation">
                                <p className="font-medium text-text-primary">{trace.calcAddition}</p>
                                <p>{trace.nominalLine}</p>
                            </DeadlineTraceStep>
                            <DeadlineTraceStep icon={Globe} label="USPTO calendar" divider={false}>
                                <p className="font-medium text-text-primary">{trace.rollLine}</p>
                            </DeadlineTraceStep>
                            <DeadlineTraceStep icon={Check} label="Computed due date" result>
                                <time
                                    dateTime={trace.dueIso}
                                    className="text-2xl font-semibold tracking-tight text-text-primary sm:text-[1.75rem]"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {trace.dueFull}
                                </time>
                            </DeadlineTraceStep>
                        </ol>
                    </div>
                </div>
            </div>
        </article>
    );
}
