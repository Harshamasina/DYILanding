import { SITE_URL, SITE_NAME } from '@/lib/constants';

/**
 * VideoObject structured data for the homepage product demo.
 *
 * Makes the demo eligible for Google video rich results and the Videos tab,
 * which is net-new SERP surface. Rendered from DemoVideoSection so the markup
 * ships with the video it describes (page-specific schema lives with its
 * content, same convention as HomeJsonLd / the per-feature JSON-LD components).
 *
 * NOTE: confirm `uploadDate` and `duration` match the real /dyi_film.mp4.
 * `thumbnailUrl` points at the branded poster; swap it for a representative
 * frame when one exists. Google requires thumbnailUrl to resolve to a real image.
 */
const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Design Your Invention Product Demo',
    description:
        'A walkthrough of the Design Your Invention IP management platform: run a prior art search across 100+ jurisdictions, generate a jurisdiction-aware patent draft, and docket the filing with every fee and deadline tracked.',
    thumbnailUrl: [`${SITE_URL}/video_placeholder.jpg`],
    uploadDate: '2026-06-21',
    duration: 'PT2M24S',
    contentUrl: `${SITE_URL}/dyi_film.mp4`,
    embedUrl: `${SITE_URL}/#demo-video`,
    publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png`,
        },
    },
};

export function DemoVideoJsonLd() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
    );
}
