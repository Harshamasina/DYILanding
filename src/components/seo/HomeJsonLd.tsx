import { SITE_URL } from '@/lib/constants';
import { HOME_FAQ_ITEMS } from '@/lib/faq-data';

/**
 * Homepage-only structured data:
 *   - BreadcrumbList for the homepage section anchors
 *   - FAQPage for the curated homepage FAQ (HOME_FAQ_ITEMS)
 *
 * Rendered from app/page.tsx, not the root layout, so these blocks only appear
 * on the homepage where the matching content is visible. The full FAQ list and
 * its FAQPage schema live on /faq/ (see FaqPageJsonLd).
 */
const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Features', item: `${SITE_URL}/#features` },
        { '@type': 'ListItem', position: 3, name: 'Compliance', item: `${SITE_URL}/#compliance` },
        { '@type': 'ListItem', position: 4, name: 'Pricing', item: `${SITE_URL}/#pricing` },
        { '@type': 'ListItem', position: 5, name: 'FAQ', item: `${SITE_URL}/#faq` },
    ],
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
        },
    })),
};

export function HomeJsonLd() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    );
}
