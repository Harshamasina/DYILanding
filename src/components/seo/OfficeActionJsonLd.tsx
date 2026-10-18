import { SITE_URL, SITE_NAME, OFFICE_ACTIONS_PAGE_URL } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

/**
 * Page-level structured data for /office-actions/:
 *   - SoftwareApplication (office action analysis and response drafting)
 *   - BreadcrumbList (Home > Office Action Analysis and Response)
 *   - FAQPage
 *
 * Mirrors the JSON-LD pattern used by the other feature pages. The feature
 * list states US scope plainly: analysis and response are built for USPTO
 * actions only, and nothing here may read as automated filing.
 */
const PAGE_URL = `${SITE_URL}${OFFICE_ACTIONS_PAGE_URL}`;

const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${SITE_NAME} Office Action Analysis and Response`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: PAGE_URL,
    description:
        'Attorney-in-the-loop USPTO office action analysis and response drafting. One press reads the office action and claims, maps every rejection and objection to claims, limitations, and cited passages with quotations checked against the source, and carries the signed analysis into a structured response workspace that produces Word documents for attorney filing.',
    featureList: [
        'One-click office action analysis, with an attorney confirming the documents',
        'Issue map covering 20 US issue types and 23 legal-basis identifiers',
        'Claim charts per limitation and reference with source-verified quotations',
        'Deterministic claim parsing, including multiple dependent claims and Markush groups',
        'Candidate response deadlines from a rules engine, confirmed by an attorney',
        'Attorney sign-off with stated signature meaning and step-up re-authentication',
        'Response strategies per issue from a versioned US response pack',
        'Claim listing computed to 37 CFR 1.121(c)',
        'Support passages linked to the application as filed',
        'Automated independent review of model-derived text, approval gates, and locked approved content',
        'Word (DOCX) review draft, filing copy, and interview agenda',
        'Append-only audit trail with Part 11-aligned electronic signatures',
    ],
};

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Office Action Analysis and Response', item: PAGE_URL },
    ],
};

export function OfficeActionJsonLd({ faq }: { faq: FaqItem[] }) {
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
