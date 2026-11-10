import { Bar, Body, Box, Check, Connector, Figure, Label, Pill, Ring, Sheet, Title } from './patentSheet';

/* Hero drawing for the office actions page: the issues a non-final USPTO
   action raises, the claim 1 chart for the § 103 rejection as the hero card
   (each limitation read against its cited passage, signed after attorney
   review), the amended claim with its support as filed, and the checks that
   hold before approval. The matter is the page's illustrative one (adaptive
   sensor system, Smith and Jones), and every pinpoint matches the page's own
   figures: the chart rows are Smith's readings in the FIG. 3 claim chart
   ([1a] ¶ [0024] full, [1b] ¶ [0031] full, [1c] ¶ [0036] partial), and the
   amendment to [1b] is supported by paragraph [0032] as in FIG. 5. Built from
   the shared patent sheet so it matches the other product heroes exactly. */

const ISSUES = [
    { label: '§ 103', x: 40, w: 96 },
    { label: '§ 112(b)', x: 152, w: 128 },
    { label: 'OBJECTION', x: 296, w: 144 },
] as const;

const ROWS = [
    { id: '[1a]', ref: 'SMITH ¶ [0024]', status: 'FULL', value: 1 },
    { id: '[1b]', ref: 'SMITH ¶ [0031]', status: 'FULL', value: 1 },
    { id: '[1c]', ref: 'SMITH ¶ [0036]', status: 'PARTIAL', value: 0.5 },
] as const;

export function OfficeActionHeroSvg({ className }: { className?: string }) {
    return (
        <Sheet title="ISSUE MAP" focus={{ cx: 364, cy: 260 }} className={className}>
            {/* The issues the action raises */}
            {ISSUES.map(issue => (
                <g key={issue.label}>
                    <Pill x={issue.x} y={64} w={issue.w} tone="slate">{issue.label}</Pill>
                    <Connector d={`M${issue.x + issue.w / 2} 94V126`} dashed start={false} />
                </g>
            ))}
            <Pill x={528} y={64} w={160}>REPLY DUE</Pill>

            {/* The claim chart */}
            <Box x={40} y={126} w={648} h={268} tone="hero" />
            <Title x={64} y={166} hero>CLAIM 1 · § 103 CHART</Title>
            <Label x={664} y={166} anchor="end">ADAPTIVE SENSOR SYSTEM</Label>
            {ROWS.map((row, i) => {
                const y = 212 + i * 56;
                const partial = row.status === 'PARTIAL';
                return (
                    <g key={row.id}>
                        <Label x={64} y={y} tone="ink">{row.id}</Label>
                        <Label x={120} y={y}>{row.ref}</Label>
                        <Label x={664} y={y} anchor="end" tone={partial ? 'amber' : 'ink'}>{row.status}</Label>
                        <Bar x={120} y={y + 12} w={544} value={row.value} tone={partial ? 'amber' : 'ink'} />
                    </g>
                );
            })}
            <Check x={292} y={263} />
            <Label x={308} y={268} tone="ink">QUOTE MATCHED</Label>
            <Check x={73} y={367} />
            <Body x={90} y={372}>Analysis signed after attorney review</Body>

            {/* The amended claim and the checks that hold */}
            <Connector d="M196 394V426" />
            <Connector d="M532 394V426" />

            <Box x={40} y={426} w={312} h={150} />
            <Title x={64} y={466}>CLAIM 1</Title>
            <Label x={328} y={466} anchor="end" tone="ink">[1B] AMENDED</Label>
            <Body x={64} y={500}>…in response to a detected</Body>
            <Body x={64} y={524}>change in temperature</Body>
            <Check x={73} y={551} />
            <Label x={90} y={556} tone="ink">AS FILED ¶ [0032]</Label>

            <Box x={376} y={426} w={312} h={150} />
            <Label x={400} y={466}>CHECKS HOLD</Label>
            <Figure x={400} y={520}>14 / 14</Figure>
            <Ring cx={628} cy={500} r={28} />
            <Label x={400} y={556} tone="ink">SIGNED · APPROVED</Label>
        </Sheet>
    );
}
