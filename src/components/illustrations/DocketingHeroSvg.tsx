import { Bar, Body, Box, Circled, Connector, Label, Sheet, Title } from './patentSheet';

/* Hero drawing for the docketing page: the docket calendar with the due
   date circled and the federal holiday it rolled past, the deadline trace
   beside it (trigger, then governing rule), and the computed due date as
   the hero card with its risk band and the family it belongs to. Built from
   the shared patent sheet so it matches the other product heroes exactly.
   It shows the same matter as the page's trace card (ComputedDeadlineTrace,
   whose static fallback uses these dates): a final Office Action mailed
   Aug 11, 2026, a 3-month shortened statutory period set under 37 CFR 1.134,
   nominal Nov 11 (Veterans Day) rolled to Thursday, Nov 12.
   November 1, 2026 is a Sunday. */

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const DUE_DAY = 12;
const HOLIDAY = 11;
const colX = (col: number) => 76 + col * 36;
const rowY = (row: number) => 184 + row * 36;

export function DocketingHeroSvg({ className }: { className?: string }) {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    return (
        <Sheet title="DEADLINE TRACE" focus={{ cx: 364, cy: 490 }} className={className}>
            {/* The docket calendar */}
            <Box x={40} y={72} w={288} h={300} tone="quiet" />
            <Title x={64} y={112}>NOV 2026</Title>
            {WEEKDAYS.map((day, col) => (
                <Label key={`${day}-${col}`} x={colX(col)} y={148} anchor="middle">{day}</Label>
            ))}
            <Circled cx={colX((HOLIDAY - 1) % 7)} cy={rowY(Math.floor((HOLIDAY - 1) / 7)) - 5} r={15} dashed />
            <Circled cx={colX((DUE_DAY - 1) % 7)} cy={rowY(Math.floor((DUE_DAY - 1) / 7)) - 5} r={15} />
            {days.map(day => (
                <Label key={day} x={colX((day - 1) % 7)} y={rowY(Math.floor((day - 1) / 7))} anchor="middle" tone={day === DUE_DAY ? 'ink' : 'slate'}>
                    {day}
                </Label>
            ))}

            {/* The trace: trigger, then the rule that governs it */}
            <Box x={360} y={72} w={328} h={104} />
            <Title x={384} y={112}>TRIGGER</Title>
            <Label x={664} y={112} anchor="end">AUG 11, 2026</Label>
            <Body x={384} y={148}>Final Office Action mailed</Body>

            <Connector d="M524 176V208" />
            <Box x={360} y={208} w={328} h={104} />
            <Title x={384} y={248}>RULE</Title>
            <Label x={664} y={248} anchor="end">37 CFR 1.134</Label>
            <Body x={384} y={284}>3-month shortened period</Body>

            {/* The computed due date */}
            <Connector d="M524 312V404" />
            <Connector d={`M${colX((DUE_DAY - 1) % 7)} 372V404`} dashed />
            <Box x={40} y={404} w={648} h={172} tone="hero" />
            <Title x={64} y={444} hero>DUE · NOV 12, 2026</Title>
            <Label x={664} y={444} anchor="end">COMPUTED</Label>
            <Body x={64} y={480}>Rolled to Thursday; Nov 11 is a federal holiday</Body>
            <Label x={64} y={514}>FAMILY · US 17/123,456 · EP · PCT</Label>
            <Label x={64} y={552}>RISK 41</Label>
            <Bar x={168} y={546} w={496} value={0.41} tone="amber" />
        </Sheet>
    );
}
