import { SITE_URL } from '@/lib/constants';
import { FAQ_ITEMS } from '@/lib/faq-data';

/**
 * Page-level structured data for /faq/:
 *   - BreadcrumbList (Home > FAQ)
 *   - FAQPage (the full shared FAQ_ITEMS set)
 *
 * The same FAQ_ITEMS also render in the homepage FAQ section; both pages show
 * the Q&A visibly, so emitting FAQPage on each is valid. /faq/ is the clean,
 * canonical URL for the full list.
 */
const PAGE_URL = `${SITE_URL}/faq/`;

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'FAQ', item: PAGE_URL },
    ],
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
        },
    })),
};

export function FaqPageJsonLd() {
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
