import { useEffect, useState } from 'react';

/* Dates for the office action demo animations (home section and detail page).
   Every date is relative to today, so the matter always reads as live work:
   the action issued about two months ago, which puts the 3-month reply date
   about a month out. The server renders against a fixed anchor and the
   client swaps in today on mount, so hydration never mismatches. */
export interface DemoDates {
    today: string;
    issued: string;
    due: string;
    dueInDays: number;
    signedAt: string;
    reviewDraft: string;
    approvedDay: string;
    approvedAt: string;
    budgetReset: string;
}

export const DATE_ANCHOR = new Date(2026, 9, 17);

function isoDay(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function shiftDays(base: Date, days: number) {
    return new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
}

/* Adds calendar months, holding the day where the target month has it. */
function addMonths(base: Date, months: number) {
    const target = new Date(base.getFullYear(), base.getMonth() + months, 1);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    return new Date(target.getFullYear(), target.getMonth(), Math.min(base.getDate(), lastDay));
}

export function buildDates(now: Date): DemoDates {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const issued = shiftDays(today, -60);
    const due = addMonths(issued, 3);
    const approved = shiftDays(today, -2);
    return {
        today: isoDay(today),
        issued: isoDay(issued),
        due: isoDay(due),
        dueInDays: Math.round((due.getTime() - today.getTime()) / 86_400_000),
        signedAt: `${isoDay(shiftDays(today, -12))} 10:14`,
        reviewDraft: isoDay(shiftDays(today, -4)),
        approvedDay: isoDay(approved),
        approvedAt: `${isoDay(approved)} 16:40`,
        budgetReset: `${isoDay(new Date(today.getFullYear(), today.getMonth() + 1, 0))} 20:00`,
    };
}

/* Anchor dates on the server and first render, today's dates after mount. */
export function useDemoDates(): DemoDates {
    const [dates, setDates] = useState<DemoDates>(() => buildDates(DATE_ANCHOR));
    useEffect(() => {
        setDates(buildDates(new Date()));
    }, []);
    return dates;
}
