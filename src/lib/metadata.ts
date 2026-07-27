import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { ogImageEntry, ogImageUrl } from '@/lib/og';

interface PageMetadataOptions {
    title: string;
    description: string;
    path?: string;
    /** Optional share-card key. Pages without a dedicated card inherit the
     * branded homepage card instead of pointing crawlers at a missing image.
     * Custom keys must have an entry in lib/og-cards. */
    ogKey?: string;
}

export function buildMetadata({
    title,
    description,
    path = '',
    ogKey = 'home',
}: PageMetadataOptions): Metadata {
    const url = `${SITE_URL}${path}`;
    const alt = `${title} - ${SITE_NAME}`;

    return {
        title: `${title} - ${SITE_NAME}`,
        description,
        openGraph: {
            title: `${title} - ${SITE_NAME}`,
            description,
            url,
            siteName: SITE_NAME,
            images: [ogImageEntry(ogKey, alt)],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} - ${SITE_NAME}`,
            description,
            images: [ogImageUrl(ogKey)],
        },
        alternates: {
            canonical: url,
        },
    };
}
