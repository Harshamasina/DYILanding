import { Bar, Body, Box, Check, Connector, Label, Sheet, Title } from './patentSheet';

/* The compare page's hero figure: the four tools of the usual stack as dashed
   cards, each feeding one patent family record, the hero card, that holds
   the deadlines, prior art, drafts and fees together with one audit trail.
   Built from the shared patent sheet so it matches the other product heroes
   exactly. */

const TOOLS = [
    { name: 'DOCKETING', note: 'Deadlines in one system' },
    { name: 'PRIOR-ART SEARCH', note: 'Results in another tool' },
    { name: 'DRAFTING', note: 'Claims in Word files' },
    { name: 'SPREADSHEETS', note: 'Fees and chemistry by hand' },
] as const;

const ROWS = [
    { name: 'DEADLINES', value: 0.85 },
    { name: 'PRIOR ART', value: 0.7 },
    { name: 'DRAFTS', value: 0.6 },
    { name: 'FEES', value: 0.78 },
] as const;

const toolY = (i: number) => 72 + i * 120;
const rowY = (i: number) => 280 + i * 48;

export function CompareStackSvg({ className }: { className?: string }) {
    return (
        <Sheet title="THE USUAL STACK" focus={{ cx: 544, cy: 328 }} className={className}>
            {TOOLS.map((tool, i) => {
                const y = toolY(i);
                const target = rowY(i) - 5;
                return (
                    <g key={tool.name}>
                        <Box x={40} y={y} w={272} h={96} dashed />
                        <Title x={64} y={y + 40} muted>{tool.name}</Title>
                        <Body x={64} y={y + 72}>{tool.note}</Body>
                        <Connector d={`M312 ${y + 48}C356 ${y + 48} 356 ${target} 400 ${target}`} dashed />
                    </g>
                );
            })}

            <Label x={400} y={144} tone="ink">ONE RECORD</Label>
            <Box x={400} y={160} w={288} h={336} tone="hero" />
            <Title x={424} y={200} hero>DEMO-2024-011</Title>
            <Label x={424} y={228}>PATENT FAMILY</Label>
            {ROWS.map((row, i) => (
                <g key={row.name}>
                    <Label x={424} y={rowY(i)}>{row.name}</Label>
                    <Bar x={536} y={rowY(i) - 6} w={128} value={row.value} />
                </g>
            ))}
            <Check x={433} y={467} />
            <Label x={450} y={472} tone="ink">AUDIT TRAIL</Label>

            <Label x={544} y={536} anchor="middle">4 TOOLS, 1 RECORD</Label>
        </Sheet>
    );
}
