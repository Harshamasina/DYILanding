import { ImageResponse } from 'next/og';
import { OgCard } from '@/components/og/OgCard';
import { OG_SIZE } from '@/lib/og';
import { getAllOgKeys, getOgCard } from '@/lib/og-cards';
import { loadOgFonts } from '@/lib/og-fonts';

/* ── Share-card renderer ──
 *
 * Emits one 1200x630 PNG per key at /og/<key>/image.png. `force-static` is
 * required by `output: 'export'`: it tells Next this handler is fully
 * prerenderable, so the build runs it once per key and writes the bytes into
 * out/ instead of expecting a server at request time.
 *
 * The `image.png` path segment is deliberate. Next names an exported route
 * handler's file after its final segment, so ending in `.png` produces a real
 * out/og/<key>/image.png that static hosts serve as image/png. The framework's
 * own opengraph-image convention writes an extension-less file, which is served
 * as application/octet-stream and rejected by social crawlers, doubly so under
 * the nosniff header this site sets. */

export const dynamic = 'force-static';

export function generateStaticParams() {
    return getAllOgKeys().map((key) => ({ key }));
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ key: string }> },
) {
    const { key } = await params;
    const card = getOgCard(key);

    if (!card) {
        return new Response('Share card not found', { status: 404 });
    }

    return new ImageResponse(<OgCard card={card} />, {
        ...OG_SIZE,
        fonts: loadOgFonts(),
    });
}
