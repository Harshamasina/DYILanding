'use client';

import { useEffect, useState } from 'react';
import { Bar, Body, Box, Circled, Connector, Label, Sheet, Title } from './patentSheet';
import { DAYS, STATIC_EXAMPLE, exampleDeadline, isFederalHoliday, sameDay, type ExampleDeadline } from '@/lib/deadline-example';

/* Hero drawing for the docketing page: the docket calendar with the due
   date circled (and the closed day it rolled past, dashed), the deadline
   trace beside it (trigger, then governing rule), and the computed due date
   as the hero card with its risk band and the family it belongs to. Built
   from the shared patent sheet so it matches the other product heroes.

   The dates are live: they come from the same helper as the page's trace
   card (ComputedDeadlineTrace), so both show one matter, due a few days
   after the visitor's today. Static export renders the fallback matter
   (Aug 11, 2026 + 3 months, rolled past Veterans Day to Nov 12) and the
   browser swaps in live dates on mount. */

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;
const MONTHS_TITLE = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const colX = (col: number) => 76 + col * 36;

function shortDate(date: Date): string {
    return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/* The line under the due date: why it moved, or that it did not. */
function rollNote({ nominal, due }: ExampleDeadline): string {
    if (sameDay(nominal, due)) {
        return `${DAYS[due.getDay()]} is a business day; no roll needed`;
    }
    const day = `${MONTHS_TITLE[nominal.getMonth()]} ${nominal.getDate()}`;
    const dow = nominal.getDay();
    const reason = dow === 0 || dow === 6 ? `falls on ${DAYS[dow]}` : isFederalHoliday(nominal) ? 'is a federal holiday' : 'is closed';
    return `Rolled to ${DAYS[due.getDay()]}; ${day} ${reason}`;
}

export function DocketingHeroSvg({ className }: { className?: string }) {
    const [matter, setMatter] = useState<ExampleDeadline>(STATIC_EXAMPLE);

    useEffect(() => {
        setMatter(exampleDeadline(new Date()));
    }, []);

    const { trigger, nominal, due } = matter;
    const year = due.getFullYear();
    const month = due.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const length = new Date(year, month + 1, 0).getDate();
    const rows = Math.ceil((firstDow + length) / 7);
    /* Five weeks fit the card at the usual spacing; a sixth tightens it. */
    const step = rows > 5 ? 30 : 36;
    const top = rows > 5 ? 178 : 184;
    const ring = rows > 5 ? 13 : 15;
    const cell = (day: number) => {
        const index = firstDow + day - 1;
        return { x: colX(index % 7), y: top + Math.floor(index / 7) * step };
    };
    const days = Array.from({ length }, (_, i) => i + 1);
    const dueCell = cell(due.getDate());
    const rolledFrom = !sameDay(nominal, due) && nominal.getMonth() === month ? cell(nominal.getDate()) : null;

    return (
        <Sheet title="DEADLINE TRACE" focus={{ cx: 364, cy: 490 }} className={className}>
            {/* The docket calendar */}
            <Box x={40} y={72} w={288} h={300} tone="quiet" />
            <Title x={64} y={112}>{`${MONTHS_SHORT[month]} ${year}`}</Title>
            {WEEKDAYS.map((day, col) => (
                <Label key={`${day}-${col}`} x={colX(col)} y={148} anchor="middle">{day}</Label>
            ))}
            {rolledFrom && <Circled cx={rolledFrom.x} cy={rolledFrom.y - 5} r={ring} dashed />}
            <Circled cx={dueCell.x} cy={dueCell.y - 5} r={ring} />
            {days.map(day => {
                const { x, y } = cell(day);
                return (
                    <Label key={day} x={x} y={y} anchor="middle" tone={day === due.getDate() ? 'ink' : 'slate'}>
                        {day}
                    </Label>
                );
            })}

            {/* The trace: trigger, then the rule that governs it */}
            <Box x={360} y={72} w={328} h={104} />
            <Title x={384} y={112}>TRIGGER</Title>
            <Label x={664} y={112} anchor="end">{shortDate(trigger)}</Label>
            <Body x={384} y={148}>Final Office Action mailed</Body>

            <Connector d="M524 176V208" />
            <Box x={360} y={208} w={328} h={104} />
            <Title x={384} y={248}>RULE</Title>
            <Label x={664} y={248} anchor="end">37 CFR 1.134</Label>
            <Body x={384} y={284}>3-month shortened period</Body>

            {/* The computed due date */}
            <Connector d="M524 312V404" />
            <Connector d={`M${dueCell.x} 372V404`} dashed />
            <Box x={40} y={404} w={648} h={172} tone="hero" />
            <Title x={64} y={444} hero>{`DUE · ${shortDate(due)}`}</Title>
            <Label x={664} y={444} anchor="end">COMPUTED</Label>
            <Body x={64} y={480}>{rollNote(matter)}</Body>
            <Label x={64} y={514}>FAMILY · US 17/123,456 · EP · PCT</Label>
            <Label x={64} y={552}>RISK 41</Label>
            <Bar x={168} y={546} w={496} value={0.41} tone="amber" />
        </Sheet>
    );
}
