import { SITE_URL, SITE_NAME } from '@/lib/constants';

/**
 * VideoObject structured data for the homepage product demo.
 *
 * Makes the demo eligible for Google video rich results and the Videos tab,
 * which is net-new SERP surface. Rendered from DemoVideoSection so the markup
 * ships with the video it describes (page-specific schema lives with its
 * content, same convention as HomeJsonLd / the per-feature JSON-LD components).
 *
 * `uploadDate` and `duration` match /dyi_film.mp4 (the 2:35 v3 film).
 * `thumbnailUrl` is a captured frame of the demo (the docketing dashboard).
 * Google requires thumbnailUrl to resolve to a real image.
 */
const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Design Your Invention Product Demo',
    description:
        'A walkthrough of the Design Your Invention IP management platform, recorded with synthetic demo data: docket every deadline and fee across jurisdictions, run a prior art search across 100+ patent authorities, generate a first patent draft for attorney review, analyze and respond to USPTO office actions with two-attorney approval, and see how confidential patent data is protected.',
    thumbnailUrl: [`${SITE_URL}/thumb-film.jpg`],
    uploadDate: '2026-10-18',
    duration: 'PT2M35S',
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
