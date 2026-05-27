import { SITE_URL, SITE_NAME } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

/**
 * Page-level structured data for /ai-patent-drafting/:
 *   - SoftwareApplication (the AI drafting feature + its capabilities)
 *   - BreadcrumbList (Home > AI Patent Drafting)
 *   - FAQPage
 *
 * Mirrors the dangerouslySetInnerHTML JSON-LD pattern used elsewhere.
 */
const PAGE_URL = `${SITE_URL}/ai-patent-drafting/`;

const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${SITE_NAME} AI Patent Drafting`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: PAGE_URL,
    description:
        'Attorney-in-the-loop AI patent drafting. Turn invention details and saved prior art into a filing-ready first draft, claims, abstract, description, and novelty analysis, tailored to the target jurisdiction.',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Contact us for pricing tailored to your team size and needs.',
    },
    featureList: [
        'Prior-art search across 100+ jurisdictions via EPO Open Patent Services',
        'Prior-art management: save, annotate, paste claim text, track relevance per family',
        'Jurisdiction-specific draft generation (US, EP, IN, PCT): claims, abstract, description, novelty analysis',
        'Structured, versioned claim tree with per-unit, append-only revision history',
        'Per-claim and per-section regeneration and interactive refinement',
        'Second-opinion confidence review by a separate model (Claude Opus 4.7)',
        'Frozen, immutable prior-art snapshots for defensible provenance',
        'Tamper-resistant, append-only audit trail (21 CFR Part 11 patterns)',
        'Role-based access control with server-enforced permissions',
        'Filing-ready DOCX export',
    ],
};

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'AI Patent Drafting', item: PAGE_URL },
    ],
};

export function AiDraftingJsonLd({ faq }: { faq: FaqItem[] }) {
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
