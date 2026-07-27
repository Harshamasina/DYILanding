import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/* ── Fonts for the share-card renderer ──
 *
 * Satori (the engine behind next/og) reads TTF, OTF, and WOFF, but not WOFF2,
 * which is the only format next/font self-hosts. So the three brand faces are
 * vendored as TTF under src/assets/fonts and read from disk at build time.
 * Both families are SIL Open Font License 1.1, which permits redistribution.
 *
 * Vendoring rather than fetching from Google at build time keeps `next build`
 * working offline and keeps the generated PNGs identical between builds. */

export type OgFont = {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 500 | 700;
    style: 'normal';
};

export const OG_FONT_DISPLAY = 'Playfair Display';
export const OG_FONT_BODY = 'Libre Baskerville';
export const OG_FONT_MONO = 'IBM Plex Mono';

const FONT_FILES = [
    { name: OG_FONT_DISPLAY, file: 'PlayfairDisplay-Bold.ttf', weight: 700 },
    { name: OG_FONT_BODY, file: 'LibreBaskerville-Regular.ttf', weight: 400 },
    { name: OG_FONT_MONO, file: 'IBMPlexMono-Medium.ttf', weight: 500 },
] as const;

let cached: OgFont[] | null = null;

/** Reads the brand faces once per build and reuses them across all cards. */
export function loadOgFonts(): OgFont[] {
    if (cached) return cached;

    const dir = join(process.cwd(), 'src', 'assets', 'fonts');

    cached = FONT_FILES.map(({ name, file, weight }) => {
        const buffer = readFileSync(join(dir, file));
        return {
            name,
            /* Copy out of the Node Buffer pool: a Buffer is a view into a shared
             * ArrayBuffer, and satori reads the whole underlying buffer. */
            data: buffer.buffer.slice(
                buffer.byteOffset,
                buffer.byteOffset + buffer.byteLength,
            ) as ArrayBuffer,
            weight,
            style: 'normal' as const,
        };
    });

    return cached;
}
