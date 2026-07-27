import { SITE_URL } from '@/lib/constants';

/* ── Open Graph / social share cards ──
 *
 * Every page and blog post gets its own generated 1200x630 PNG carrying that
 * page's own headline, so a link pasted into LinkedIn, X, Slack, or WhatsApp
 * previews with real text instead of one generic brand image.
 *
 * The cards are rendered at build time by the route handler at
 * src/app/og/[key]/image.png/route.tsx and land in the static export as real
 * .png files. The path deliberately ends in `.png` because the export is served
 * from a static host under `X-Content-Type-Options: nosniff` (see public/_headers):
 * an extension-less file would be served as application/octet-stream and every
 * social crawler would reject it as an image.
 *
 * This module stays free of heavy imports because every page imports it through
 * lib/metadata. The card copy itself lives in lib/og-cards, which is imported
 * only by the route handler. */

export const OG_SIZE = { width: 1200, height: 630 } as const;

export type OgVariant =
    /** Centred brand lockup. Homepage only. */
    | 'brand'
    /** Left-aligned title card for a marketing or legal page. */
    | 'page'
    /** Same as `page` plus a published-date / reading-time footer. Blog posts, roles. */
    | 'article';

/** Route-aware illustration used on the right side of a generated share card. */
export type OgVisual =
    | 'platform'
    | 'editorial'
    | 'docketing'
    | 'search'
    | 'drafting'
    | 'comparison'
    | 'careers'
    | 'support'
    | 'legal'
    | 'compliance'
    | 'analytics'
    | 'migration';

export interface OgCardContent {
    variant: OgVariant;
    /** The small, product-native SVG scene paired with this card's content. */
    visual: OgVisual;
    /** Short label in the top-right chip: section, category, or department. */
    eyebrow: string;
    title: string;
    description: string;
    /** Optional bottom-right line, e.g. "Jul 14, 2026 - 9 min read". */
    meta?: string;
}

/** Key for a blog post's card. Kept in one place so the route and the page agree. */
export function blogOgKey(slug: string): string {
    return `blog-${slug}`;
}

/** Key for an open-role card. */
export function careersOgKey(slug: string): string {
    return `careers-${slug}`;
}

export function ogImagePath(key: string): string {
    return `/og/${key}/image.png`;
}

/** Absolute URL. Social crawlers do not resolve relative og:image values. */
export function ogImageUrl(key: string): string {
    return `${SITE_URL}${ogImagePath(key)}`;
}

/** OpenGraph `images` entry, with the explicit dimensions crawlers use to
 * reserve layout space before the file downloads. */
export function ogImageEntry(key: string, alt: string) {
    return {
        url: ogImageUrl(key),
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        alt,
        type: 'image/png',
    };
}
