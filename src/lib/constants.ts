export const SITE_URL = 'https://designyourinvention.com';
export const SITE_NAME = 'Design Your Invention';
export const SITE_DESCRIPTION =
    'IP management with AI-assisted prior art search and patent drafting for attorney review. Patent docketing, PCT/PRV/NPE case management, and FDA 21 CFR Part 11-aligned workflow controls.';

/* ── Brand entity metadata used by Organization JSON-LD.
 * Keep these accurate. Google reads them to resolve the brand as a
 * real entity. Update legalName once formal incorporation is done,
 * and add socialUrls as profiles go live. Empty fields are filtered
 * out of the schema, so it's safe to leave them blank for now. */
export const BRAND = {
    /** Formal registered name. Leave equal to SITE_NAME until incorporated. */
    legalName: 'Design Your Invention',
    /** YYYY or YYYY-MM-DD. */
    foundingDate: '2025',
    address: {
        addressLocality: 'Hyderabad',
        addressRegion: 'Telangana',
        addressCountry: 'IN',
    },
    contact: {
        email: 'support@designyourinvention.com',
        contactType: 'customer support',
        areaServed: 'IN',
        availableLanguage: ['English'],
    },
    /** Add public profile URLs as you create them. Each entry must be a
     * fully-qualified, working URL — Google penalizes broken sameAs. */
    socialUrls: [
        'https://www.linkedin.com/company/design-your-invention/',
        // 'https://twitter.com/<handle>',
        // 'https://github.com/<org>',
        // 'https://www.crunchbase.com/organization/design-your-invention',
    ] as readonly string[],
} as const;

/* Top-level nav links. The two flagship product pages (Patent Search,
 * AI Patent Drafting) live in the Header's "Features" mega-menu instead
 * of here, see FEATURE_MENU in Header.tsx. */
export const NAV_LINKS = [
    { label: 'Compliance', href: '/#compliance' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Contact', href: '/#contact' },
] as const;

export const CTA_SIGNUP_URL = '/#get-started';
export const CTA_DEMO_URL = '/#contact';

/* ── Patent Search handoff ──
 * The free public patent search tool lives on its own subdomain. The
 * landing page promotes it (Patent Search section + nav/hero CTAs) and
 * hands traffic off to it. The dedicated /patent-search/ marketing page
 * is planned but not built yet; PATENT_SEARCH_PAGE_URL points at its
 * future route so "View More" is wired once the page lands. */
export const SEARCH_APP_URL = 'https://search.designyourinvention.com';
export const FEATURES_SECTION_URL = '/#features';
export const PATENT_SEARCH_PAGE_URL = '/patent-search/';
export const AI_DRAFTING_PAGE_URL = '/ai-patent-drafting/';
export const DOCKETING_PAGE_URL = '/docketing/';

/* Shared form enums. The `value` of role and inquiry_type MUST exactly
 * match the backend's strict Zod enums, since both are submitted as
 * structured fields and rejected with a validation_error otherwise. See
 * DYISearchBackend: src/schemas/contactMessage.ts (CONTACT_ROLE_VALUES,
 * CONTACT_INQUIRY_TYPE_VALUES) and src/schemas/demoRequest.ts (which reuse
 * the same role enum). Keep these in sync when the backend enums change. */

export const ROLE_OPTIONS = [
    { value: '', label: 'Select your role' },
    { value: 'IP Attorney', label: 'IP Attorney' },
    { value: 'Patent Paralegal', label: 'Patent Paralegal' },
    { value: 'IP Director', label: 'IP Director' },
    { value: 'CTO / VP Engineering', label: 'CTO / VP Engineering' },
    { value: 'Legal Operations', label: 'Legal Operations' },
    { value: 'Other', label: 'Other' },
] as const;

export const INQUIRY_TYPE_OPTIONS = [
    { value: '', label: 'What can we help with?' },
    { value: 'General Inquiry', label: 'General Inquiry' },
    { value: 'Product Question', label: 'Product Question' },
    { value: 'Pricing', label: 'Pricing' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'Technical Support', label: 'Technical Support' },
    { value: 'Other', label: 'Other' },
] as const;

/* Portfolio Size. The Book-a-Demo form submits this as a STRUCTURED
 * `portfolio_size` field, so each `value` MUST exactly match the backend enum
 * in DYISearchBackend/src/schemas/demoRequest.ts (PORTFOLIO_SIZE_VALUES) or the
 * submission is rejected with a validation_error. The labels are display-only.
 * The Contact form has no structured `portfolio_size` column upstream, so it
 * folds the human label into the message body instead. */
export const PORTFOLIO_SIZE_OPTIONS = [
    { value: '', label: 'Select portfolio size' },
    { value: '1-10', label: '1-10 families' },
    { value: '11-50', label: '11-50 families' },
    { value: '51-200', label: '51-200 families' },
    { value: '201-1000', label: '201-1,000 families' },
    { value: '1000+', label: '1,000+ families' },
] as const;
