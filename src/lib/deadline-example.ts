/* Dates for the illustrative deadline on the docketing page, shared by the
   hero drawing and the trace card so both always show the same matter. A
   3-month U.S. office action period is aimed to fall a few days after the
   visitor's today: trigger + 3 calendar months (month-end clamp) gives the
   nominal date, then a weekend- and federal-holiday-aware roll gives the due
   date. The static fallback is what static export renders before the
   browser computes live dates. */

export interface ExampleDeadline {
    trigger: Date;
    nominal: Date;
    due: Date;
}

/* Aug 11 + 3 months lands on Nov 11, 2026 (Veterans Day, a Wednesday), so
   the due date rolls to Thursday, Nov 12. */
export const STATIC_EXAMPLE: ExampleDeadline = {
    trigger: new Date(2026, 7, 11),
    nominal: new Date(2026, 10, 11),
    due: new Date(2026, 10, 12),
};

export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function addDays(date: Date, days: number): Date {
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

export function sameDay(a: Date, b: Date): boolean {
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
export function isFederalHoliday(date: Date): boolean {
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

export function isClosedDay(date: Date): boolean {
    const dow = date.getDay();
    return dow === 0 || dow === 6 || isFederalHoliday(date);
}

export function exampleDeadline(now: Date): ExampleDeadline {
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
    return { trigger, nominal, due };
}
