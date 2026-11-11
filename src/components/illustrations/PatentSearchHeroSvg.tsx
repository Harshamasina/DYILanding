import { Bar, Body, Box, Connector, Dot, Ink, Label, Sheet, Title } from './patentSheet';

/* Hero drawing for the patent search page: one query, the patent record it
   returns as the hero card, and the three facets the record opens into: its
   claim tree (one independent claim and seven dependents, claim 4 hanging
   from claim 3), the compounds it discloses drawn as small structures, and
   the trials linked to them by phase and status. It shows what the search
   surfaces, never a judgment of novelty or patentability. Built from the
   shared patent sheet so it matches the other product heroes exactly. */

/* The claim tree, one row per claim: depth 0 is the independent claim,
   depth 1 hangs from it, depth 2 from the claim above. Bar lengths stand in
   for claim text. */
const CLAIMS = [
    { depth: 0, w: 120 },
    { depth: 1, w: 98 },
    { depth: 1, w: 70 },
    { depth: 2, w: 72 },
    { depth: 1, w: 104 },
    { depth: 1, w: 84 },
    { depth: 1, w: 58 },
    { depth: 1, w: 92 },
] as const;
const CLAIM_TOP = 450;
const CLAIM_STEP = 15;
const nodeX = (depth: number) => 66 + depth * 20;
const claimY = (i: number) => CLAIM_TOP + i * CLAIM_STEP;

type Point = [number, number];

/* A pointy-topped hexagon's six corners, clockwise from the top. */
function hexPoints(cx: number, cy: number, r: number): Point[] {
    return Array.from({ length: 6 }, (_, k) => {
        const a = ((-90 + 60 * k) * Math.PI) / 180;
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Point;
    });
}

function path(points: Point[], closed: boolean): string {
    const d = `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}`;
    return closed ? `${d}Z` : d;
}

/* Small skeletal structures: a benzene or purine core with the stubs that
   set each compound apart. */
function Aspirin({ cx, cy }: { cx: number; cy: number }) {
    const h = hexPoints(cx, cy, 10);
    const [tx, ty] = h[0];
    const [rx, ry] = h[1];
    return (
        <g>
            <Ink d={path(h, true)} />
            <Ink d={`M${tx} ${ty}V${ty - 7}M${tx} ${ty - 7}L${tx + 6} ${ty - 11}M${tx} ${ty - 7}L${tx - 6} ${ty - 11}`} soft />
            <Ink d={`M${rx.toFixed(1)} ${ry.toFixed(1)}L${(rx + 7).toFixed(1)} ${(ry - 4).toFixed(1)}`} soft />
        </g>
    );
}

function Paracetamol({ cx, cy }: { cx: number; cy: number }) {
    const h = hexPoints(cx, cy, 10);
    const [tx, ty] = h[0];
    const [bx, by] = h[3];
    return (
        <g>
            <Ink d={path(h, true)} />
            <Ink d={`M${tx} ${ty}V${ty - 7}`} soft />
            <Ink d={`M${bx.toFixed(1)} ${by.toFixed(1)}V${(by + 6).toFixed(1)}L${(bx + 6).toFixed(1)} ${(by + 10).toFixed(1)}`} soft />
        </g>
    );
}

function Caffeine({ cx, cy }: { cx: number; cy: number }) {
    const s = 9;
    const h = hexPoints(cx - 5, cy, s);
    const [ax, ay] = h[1];
    const [ex, ey] = h[2];
    /* A regular pentagon fused on the hexagon's right edge. */
    const pentagon: Point[] = [
        [ax, ay],
        [ax + 0.951 * s, ay - 0.309 * s],
        [ax + 1.539 * s, (ay + ey) / 2],
        [ax + 0.951 * s, ey + 0.309 * s],
        [ex, ey],
    ];
    const [tx, ty] = h[0];
    const [lx, ly] = h[4];
    return (
        <g>
            <Ink d={path(h, true)} />
            <Ink d={path(pentagon, false)} />
            <Ink d={`M${tx.toFixed(1)} ${ty.toFixed(1)}V${(ty - 6).toFixed(1)}M${lx.toFixed(1)} ${ly.toFixed(1)}L${(lx - 6).toFixed(1)} ${(ly - 3).toFixed(1)}`} soft />
        </g>
    );
}

const COMPOUNDS = [
    { name: 'ASPIRIN', Mark: Aspirin },
    { name: 'PARACETAMOL', Mark: Paracetamol },
    { name: 'CAFFEINE', Mark: Caffeine },
] as const;

const TRIALS = [
    { phase: 'PH 3', status: 'COMPLETED', value: 0.75, label: 'slate', bar: 'soft' },
    { phase: 'PH 2', status: 'RECRUITING', value: 0.5, label: 'amber', bar: 'amber' },
    { phase: 'PH 1', status: 'ACTIVE', value: 0.25, label: 'ink', bar: 'ink' },
] as const;

export function PatentSearchHeroSvg({ className }: { className?: string }) {
    const lastChild = CLAIMS.reduce((at, claim, i) => (claim.depth === 1 ? i : at), 0);
    return (
        <Sheet title="SEARCH RECORD" focus={{ cx: 364, cy: 260 }} className={className}>
            {/* The query */}
            <Box x={40} y={72} w={648} h={88} />
            <Title x={64} y={108}>QUERY</Title>
            <Body x={144} y={108}>aspirin AND caffeine</Body>
            <Label x={664} y={108} anchor="end">6 SEARCH MODES</Label>
            <Bar x={64} y={132} w={600} value={0.45} />

            {/* The record it returns */}
            <Connector d="M364 160V192" />
            <Box x={40} y={192} w={648} h={136} tone="hero" />
            <Title x={64} y={232} hero>US DEMO-2022-0042 A1</Title>
            <Label x={664} y={232} anchor="end">FAMILY 7</Label>
            <Body x={64} y={268}>Stabilized fixed-dose analgesic combination tablet</Body>
            <Label x={64} y={304}>MATCH</Label>
            <Bar x={144} y={298} w={296} value={0.82} />
            <Label x={664} y={304} anchor="end">100+ AUTHORITIES</Label>

            {/* The facets the record opens into */}
            <Connector d="M364 328V352" end={false} />
            <Connector d="M140 376V352H588V376" />
            <Connector d="M364 352V376" start={false} />

            {/* Claims: the whole tree, one independent and seven dependent */}
            <Box x={40} y={376} w={200} h={200} />
            <Title x={64} y={412}>CLAIMS</Title>
            <Label x={216} y={412} anchor="end">1 + 7</Label>
            <Ink d={`M${nodeX(0)} ${claimY(0)}V${claimY(lastChild)}`} soft />
            <Ink d={`M${nodeX(1)} ${claimY(2)}V${claimY(3)}H${nodeX(2)}`} soft />
            {CLAIMS.map((claim, i) => {
                const x = nodeX(claim.depth);
                const y = claimY(i);
                return (
                    <g key={i}>
                        {claim.depth === 1 && <Ink d={`M${nodeX(0)} ${y}H${x}`} soft />}
                        <Dot cx={x} cy={y} r={claim.depth === 0 ? 3.5 : 2.5} soft={claim.depth > 0} />
                        <Ink d={`M${x + 9} ${y}H${x + 9 + claim.w}`} soft={claim.depth > 0} />
                    </g>
                );
            })}

            {/* Compounds: three of the five disclosed, drawn as structures */}
            <Box x={264} y={376} w={200} h={200} />
            <Title x={288} y={412}>COMPOUNDS</Title>
            <Label x={440} y={412} anchor="end">5</Label>
            {COMPOUNDS.map(({ name, Mark }, i) => {
                const cy = 452 + i * 34;
                return (
                    <g key={name}>
                        <Mark cx={304} cy={cy} />
                        <Label x={330} y={cy + 5} tone="ink">{name}</Label>
                    </g>
                );
            })}
            <Label x={288} y={560}>+ 2 MORE</Label>

            {/* Trials: the three linked to those compounds, by phase */}
            <Box x={488} y={376} w={200} h={200} />
            <Title x={512} y={412}>TRIALS</Title>
            <Label x={664} y={412} anchor="end">3</Label>
            {TRIALS.map((trial, i) => {
                const y = 446 + i * 40;
                return (
                    <g key={trial.phase}>
                        <Label x={512} y={y}>{trial.phase}</Label>
                        <Label x={664} y={y} anchor="end" tone={trial.label}>{trial.status}</Label>
                        <Bar x={512} y={y + 10} w={152} value={trial.value} tone={trial.bar} />
                    </g>
                );
            })}
            <Label x={512} y={564}>NCT-DEMO-0042</Label>
        </Sheet>
    );
}
