import { SITE_URL, SITE_NAME } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

/**
 * Page-level structured data for /patent-search/:
 *   - SoftwareApplication (the free search tool + its feature list)
 *   - BreadcrumbList (Home > Patent Search)
 *   - FAQPage (drives rich-snippet eligibility for the on-page FAQ)
 *
 * Mirrors the dangerouslySetInnerHTML JSON-LD pattern used by the
 * homepage `JsonLd` component and the AI drafting page.
 */
const PAGE_URL = `${SITE_URL}/patent-search/`;

const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${SITE_NAME} Patent Search`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: PAGE_URL,
    description:
        'Free patent search across a corpus of 120M+ patent records from 100+ patent authorities, with chemical compound detection, substructure search, and linked clinical-trial data.',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    featureList: [
        'Global patent search across 120M+ patent records from 100+ patent authorities',
        'Six search modes: keyword, title and abstract, claims, inventor, applicant, publication number',
        'Chemical compound detection with 2D structures, InChIKey, IUPAC name, SMILES, and molecular weight',
        'Substructure search: find patents in the corpus disclosing a compound or scaffold',
        'Linked clinical-trial data: phase, status, sponsor, and indication',
        'Full-text claims and CSV export for work-email accounts',
        'Save patents to a portfolio',
    ],
};

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Patent Search', item: PAGE_URL },
    ],
};

export function PatentSearchJsonLd({ faq }: { faq: FaqItem[] }) {
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
            />
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
