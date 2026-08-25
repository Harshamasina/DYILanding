import { SITE_URL, SITE_NAME } from '@/lib/constants';
import type { FaqItem } from '@/lib/faq-data';

/**
 * Page-level structured data for /docketing/:
 *   - SoftwareApplication (the docketing + deadline engine and its capabilities)
 *   - BreadcrumbList (Home > Patent Docketing)
 *   - FAQPage
 *
 * Mirrors the dangerouslySetInnerHTML JSON-LD pattern used elsewhere.
 */
const PAGE_URL = `${SITE_URL}/docketing/`;

const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${SITE_NAME} Patent Docketing`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: PAGE_URL,
    description:
        'Audit-first patent docketing and deadline management with traceable calculations for supported PCT and U.S. office-action deadlines, risk scoring, and proactive email digests. Calculated dates remain informational until professionally verified.',
    featureList: [
        'Deterministic, versioned calculations for supported PCT and U.S. office-action deadlines',
        'Per-date derivation trace with trigger provenance, legal citations, arithmetic, assumptions, and office-calendar adjustments',
        'Informational trust status with audited attorney overrides and verification controls',
        'Rule-release impact preview, signed activation, and rollback controls',
        'Unified docket tracking office actions, annuities, PCT, provisional, patent-fee, national-phase, and custom-reminder dates',
        'Risk scoring with green / amber / red traffic lights and portfolio roll-up',
        'Timezone-correct deadlines with annuity grace-period handling',
        'Proactive daily, reminder-due, and weekly stale-alert email digests',
        'Stale-alert hygiene report surfacing silent risks before they lapse',
        'Multi-currency fee and annuity tracking with date-accurate FX conversion',
        'Office action tracking and outside-counsel firm assignments',
        'Family completeness scoring across 0 to 100',
        'Bulk CSV import and CSV export of deadlines, fees, and entities',
        'Branded PDF portfolio health reports with tenant logo, selectable sections, and an as-of date',
        'Verifiable report integrity with a unique Report ID and SHA-256 checksum written to the audit log',
        'Loss of Exclusivity timeline linking drug products to patent families and regulatory exclusivities',
        'Patent wall, regulatory floor, and combined protection horizon per jurisdiction and indication',
        'Interactive what-if that recomputes affected products when a patent family is dropped',
        'Full tenant data export in NDJSON with JSON Schemas and CSV, plus self-serve personal data export',
        'Append-only audit trail, reason-for-change enforcement, RLS tenant isolation, and RBAC',
    ],
};

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Patent Docketing', item: PAGE_URL },
    ],
};

export function DocketingJsonLd({ faq }: { faq: FaqItem[] }) {
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
