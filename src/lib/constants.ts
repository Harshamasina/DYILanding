export const SITE_URL = 'https://designyourinvention.com';
export const SITE_NAME = 'Design Your Invention';
export const SITE_DESCRIPTION =
    'Enterprise IP management with AI-powered prior art search and patent drafting. Patent docketing, PCT/PRV/NPE case management, and FDA 21 CFR Part 11 compliance.';

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
        // 'https://www.linkedin.com/company/design-your-invention/',
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

/* ── Shared form enums (must match backend validation) ── */

export const ROLE_OPTIONS = [
    { value: '', label: 'Select your role' },
    { value: 'Patent Attorney', label: 'Patent Attorney' },
    { value: 'IP Manager', label: 'IP Manager' },
    { value: 'Paralegal / Docketing Specialist', label: 'Paralegal / Docketing Specialist' },
    { value: 'Pharma / Biotech IP Team', label: 'Pharma / Biotech IP Team' },
    { value: 'Law Firm Partner', label: 'Law Firm Partner' },
    { value: 'Founder / Inventor', label: 'Founder / Inventor' },
    { value: 'Other', label: 'Other' },
] as const;

export const INQUIRY_TYPE_OPTIONS = [
    { value: '', label: 'What can we help with?' },
    { value: 'Book a product demo', label: 'Book a product demo' },
    { value: 'Discuss pricing', label: 'Discuss pricing' },
    { value: 'Migrate existing portfolio', label: 'Migrate existing portfolio' },
    { value: 'AI drafting workflow', label: 'AI drafting workflow' },
    { value: 'Compliance / Part 11 controls', label: 'Compliance / Part 11 controls' },
    { value: 'Other', label: 'Other' },
] as const;

/* Portfolio Size — used for lead qualification. Submitted to the backend
 * as a structured field via ContactMessagePayload; also folded into the
 * message body so existing backends that don't yet know about the field
 * still surface it to the recipient. */
export const PORTFOLIO_SIZE_OPTIONS = [
    { value: '', label: 'Select portfolio size' },
    { value: '1-50 families', label: '1–50 families' },
    { value: '51-250 families', label: '51–250 families' },
    { value: '251-1,000 families', label: '251–1,000 families' },
    { value: '1,000+ families', label: '1,000+ families' },
] as const;
