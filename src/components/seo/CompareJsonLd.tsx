import { SITE_URL, SITE_NAME } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

/**
 * Page-level structured data for /compare/:
 *   - BreadcrumbList (Home > Compare)
 *   - FAQPage (the comparison questions)
 *
 * No SoftwareApplication offers/price block here on purpose. Pricing is not
 * public yet, so no price or rating is asserted in schema (see the GEO
 * playbook guardrails). Add it only when pricing is real and intended public.
 */
const PAGE_URL = `${SITE_URL}/compare/`;

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Compare', item: PAGE_URL },
    ],
};

export function CompareJsonLd({ faq }: { faq: FaqItem[] }) {
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };

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
