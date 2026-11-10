import { Bar, Body, Box, Connector, Ink, Label, Sheet, Title } from './patentSheet';

/* Hero drawing for the patent search page: one query, the patent record it
   returns as the hero card, and the three facets the record opens into
   (claims, disclosed compounds with a structure drawing, and linked trials).
   It shows what the search surfaces, never a judgment of novelty or
   patentability. Built from the shared patent sheet so it matches the other
   product heroes exactly. */

export function PatentSearchHeroSvg({ className }: { className?: string }) {
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

            <Box x={40} y={376} w={200} h={200} />
            <Title x={64} y={412}>CLAIMS</Title>
            <Label x={64} y={440}>1 INDEPENDENT</Label>
            <Label x={64} y={464}>7 DEPENDENT</Label>
            <Ink d="M70 488V544M70 516H92M70 544H92" soft />
            <Ink d="M102 516H200M102 544H184" soft />

            <Box x={264} y={376} w={200} h={200} />
            <Title x={288} y={412}>COMPOUNDS</Title>
            {/* Aspirin, the first compound of claim 1: a benzene ring with an
                acetyl ester and a carboxylic acid on adjacent carbons. */}
            <Ink d="M387 488L408 500M388 494L402 502M408 500L408 524M408 524L387 536M402 522L388 530M387 536L366 524M366 524L366 500M371 520L371 504M366 500L387 488M387 488L387 464M389 462L376 454M386 466L373 459M387 464L400 456M366 500L353 492M338 492L325 500M322 500L322 515M328 500L328 515M325 500L304 488" />
            <Label x={366} y={457} anchor="middle" tone="ink">O</Label>
            <Label x={402} y={457} tone="ink">OH</Label>
            <Label x={346} y={493} anchor="middle" tone="ink">O</Label>
            <Label x={325} y={529} anchor="middle" tone="ink">O</Label>

            <Box x={488} y={376} w={200} h={200} />
            <Title x={512} y={412}>TRIALS</Title>
            <Label x={512} y={440}>PHASE 2</Label>
            <Label x={512} y={464} tone="amber">RECRUITING</Label>
            <Bar x={512} y={500} w={152} value={0.5} />
            <Label x={512} y={552}>NCT-DEMO-0042</Label>
        </Sheet>
    );
}
