import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, BRAND } from '@/lib/constants';
import { ogImageUrl } from '@/lib/og';

type OrganizationSchema = {
    '@context': 'https://schema.org';
    '@type': 'Organization';
    name: string;
    url: string;
    logo: string;
    image: string;
    description: string;
    legalName?: string;
    foundingDate?: string;
    address?: {
        '@type': 'PostalAddress';
        addressLocality: string;
        addressRegion: string;
        addressCountry: string;
    };
    contactPoint?: {
        '@type': 'ContactPoint';
        contactType: string;
        email: string;
        areaServed: string;
        availableLanguage: readonly string[];
    };
    sameAs?: readonly string[];
};

function buildOrganizationSchema(): OrganizationSchema {
    const schema: OrganizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        image: ogImageUrl('home'),
        description:
            'Enterprise IP management and patent docketing platform for law firms and pharma companies.',
    };

    if (BRAND.legalName && BRAND.legalName !== SITE_NAME) {
        schema.legalName = BRAND.legalName;
    }

    if (BRAND.foundingDate) {
        schema.foundingDate = BRAND.foundingDate;
    }

    if (BRAND.address.addressLocality) {
        schema.address = {
            '@type': 'PostalAddress',
            addressLocality: BRAND.address.addressLocality,
            addressRegion: BRAND.address.addressRegion,
            addressCountry: BRAND.address.addressCountry,
        };
    }

    if (BRAND.contact.email) {
        schema.contactPoint = {
            '@type': 'ContactPoint',
            contactType: BRAND.contact.contactType,
            email: BRAND.contact.email,
            areaServed: BRAND.contact.areaServed,
            availableLanguage: BRAND.contact.availableLanguage,
        };
    }

    const sameAs = BRAND.socialUrls.filter((url) => url.trim().length > 0);
    if (sameAs.length > 0) {
        schema.sameAs = sameAs;
    }

    return schema;
}

const organizationSchema = buildOrganizationSchema();

const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
};

const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    alternateName: 'DYI',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Intellectual Property Management Software',
    operatingSystem: 'Web',
    description:
        'Multi-tenant IP management software for patent docketing, PCT/PRV/NPE case management, and FDA 21 CFR Part 11-aligned workflow controls.',
    featureList: [
        'Patent Docketing',
        'Application Family Management',
        'PRV Application Tracking',
        'PCT Filing Management',
        'NPE Case Management',
        'Office Action Tracking',
        'Patent Fee Management (42 fee types across 8 categories)',
        'Document Management with Version Control',
        'Append-Only Audit Trail with FDA 21 CFR Part 11-Aligned Controls',
        'Multi-tenant Architecture',
        'Role-Based Access Control',
        'CSV Export',
        'Deadline Reminders',
        'Fee Analytics Dashboard',
        'Bulk Portfolio Import (XLSX/CSV)',
        'AI-Assisted Prior Art Search (100+ patent authorities via EPO)',
        'AI Patent Draft Generation for Attorney Review (US, EP, IN, PCT)',
        'Jurisdiction-Specific Drafting Guidance',
        'Prior Art Snapshot & Version Control',
        'DOCX Export with Patent-Standard Formatting',
        'Cost Analytics with Multi-Currency FX Conversion',
    ],
};

/**
 * Site-wide entity graph rendered on every page via the root layout.
 *
 * Only sitewide schemas live here (Organization, WebSite, SoftwareApplication).
 * Page-specific schemas (homepage breadcrumb + FAQPage, per-feature pages,
 * etc.) are emitted by their own page-level components so structured data
 * always matches the content actually visible on that URL. See HomeJsonLd.
 */
export function JsonLd() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(softwareSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema),
                }}
            />
        </>
    );
}
