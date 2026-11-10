import { Bar, Body, Box, Connector, Highlight, Label, Page, Sheet, Title } from './patentSheet';

/* Hero drawing for the AI drafting page: claim 1 as the hero card with the
   reference it was read against pinned beside it, its dependent claims 2
   and 3, a draft claim 4 held for attorney review, and the draft
   specification the claims belong to. Built from the shared patent sheet
   so it matches the other product heroes exactly. */

export function AiDraftingHeroSvg({ className }: { className?: string }) {
    return (
        <Sheet title="CLAIM TREE" focus={{ cx: 240, cy: 156 }} className={className}>
            {/* Claim 1 and the reference it was read against */}
            <Box x={40} y={72} w={400} h={168} tone="hero" />
            <Title x={64} y={112} hero>CLAIM 1</Title>
            <Label x={416} y={112} anchor="end">INDEPENDENT</Label>
            <Body x={64} y={148}>A sensor system comprising</Body>
            <Body x={64} y={172}>a controller configured to…</Body>
            <Label x={64} y={214}>HIGH SUPPORT</Label>
            <Bar x={216} y={208} w={200} value={0.9} />

            <Connector d="M440 156H488" dashed />
            <Page x={488} y={72} w={200} h={168} />
            <Title x={512} y={112}>REF. A</Title>
            <Label x={512} y={140}>SMITH ¶ [0031]</Label>
            <Highlight x={512} y={160} w={152} />
            <Label x={512} y={214} tone="ink">CITED · CLAIM 1</Label>

            {/* The dependent claims */}
            <Connector d="M240 240V272" end={false} />
            <Connector d="M196 304V272H532V304" />

            <Box x={40} y={304} w={312} h={128} />
            <Title x={64} y={344}>CLAIM 2</Title>
            <Label x={328} y={344} anchor="end">DEPENDS ON 1</Label>
            <Label x={64} y={404}>MEDIUM</Label>
            <Bar x={160} y={398} w={168} value={0.55} tone="soft" />

            <Box x={376} y={304} w={312} h={128} />
            <Title x={400} y={344}>CLAIM 3</Title>
            <Label x={664} y={344} anchor="end">DEPENDS ON 1</Label>
            <Label x={400} y={404}>HIGH</Label>
            <Bar x={496} y={398} w={168} value={0.85} />

            {/* The draft claim, held for attorney review */}
            <Connector d="M532 432V464" dashed />
            <Box x={376} y={464} w={312} h={112} dashed />
            <Title x={400} y={500} muted>CLAIM 4</Title>
            <Label x={664} y={500} anchor="end">DEPENDS ON 3</Label>
            <Body x={400} y={532}>Draft, held for attorney</Body>
            <Body x={400} y={556}>review before export</Body>

            {/* The specification the claims belong to */}
            <Box x={40} y={464} w={312} h={112} tone="quiet" />
            <Title x={64} y={500} muted>SPECIFICATION</Title>
            <Label x={328} y={500} anchor="end">DRAFT · US</Label>
            <Body x={64} y={532}>Field, background, summary,</Body>
            <Body x={64} y={556}>description and claims</Body>
        </Sheet>
    );
}
