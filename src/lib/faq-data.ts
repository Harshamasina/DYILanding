export interface FaqItem {
    question: string;
    answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
    {
        question: 'What is Design Your Invention?',
        answer:
            'Design Your Invention (DYI) is an intellectual property management software (IPMS) platform for pharma companies and IP boutique law firms. It brings multi-jurisdiction patent docketing, prior art search across 100+ jurisdictions via the EPO, and AI-assisted patent drafting for six jurisdictions (US, EP, IN, WO, JP, CN) into one audited platform. The architecture is compliance-ready and mirrors FDA 21 CFR Part 11 standards, with multi-tenant data isolation so each organization keeps its portfolio fully separate.',
    },
    {
        question: 'Who is Design Your Invention for?',
        answer:
            'DYI is built for pharma companies and IP boutique law firms that manage patent portfolios across multiple jurisdictions. Typical users include IP attorneys, patent paralegals, IP directors, and legal operations teams who need patent docketing, prior art search, fee and deadline tracking, and a defensible audit trail in one place, instead of spreadsheets and email.',
    },
    {
        question: 'What is IP management software?',
        answer:
            'IP management software is a specialized platform that helps law firms, corporations, and patent teams manage their intellectual property portfolios, including patent applications, PCT filings, office actions, deadlines, fees, and compliance requirements. It replaces spreadsheets and email-based tracking with a structured, searchable, and auditable system.',
    },
    {
        question: 'How does the platform handle FDA 21 CFR Part 11 compliance?',
        answer:
            'Compliance is built into every workflow, not bolted on. Every edit to a critical field requires a documented reason-for-change. The full audit trail logs who made each change, what changed, and when, with immutable, tamper-proof records. Electronic signatures require re-authentication, and role-based access control ensures only authorized users can perform sensitive actions.',
    },
    {
        question: 'Can I manage PCT and PRV filings in one place?',
        answer:
            'Yes. The platform links PRV (provisional), PCT (international), and NPE (national phase entry) cases to their parent patent families. You can see the entire filing hierarchy in a visual family tree, track deadlines across all filing types, and manage office actions and fees from a single dashboard.',
    },
    {
        question: 'Can the platform manage patents across multiple jurisdictions?',
        answer:
            'Yes. Multi-jurisdiction portfolios are the core use case. Docketing covers US, PCT, EU, JP, CN, and IN, with PRV, PCT, and NPE cases linked to their parent application families so the full filing hierarchy is visible in one place. Deadlines, fees, and office actions are tracked across every jurisdiction, and fee analytics roll up spend with date-accurate multi-currency conversion into one reporting currency.',
    },
    {
        question: 'How does the platform help me never miss a patent deadline?',
        answer:
            'Statutory and procedural deadlines are derived automatically from your case data rather than entered by hand, so they cannot be forgotten or typed wrong. Every deadline gets a 0 to 100 risk score with green, amber, and red levels, and automated email digests push what is due to the responsible owner before the date. A weekly stale-alert report also surfaces cases that are quietly going wrong without generating a hard deadline.',
    },
    {
        question: 'What patent fee types are supported?',
        answer:
            'The platform supports 42 fee types across 8 categories, including filing fees, examination fees, issue fees, maintenance/annuity fees, extension fees, petition fees, PCT fees, and miscellaneous fees. Each fee can be tracked as due, paid, waived, or overdue with full analytics and CSV export.',
    },
    {
        question: 'Is the platform multi-tenant?',
        answer:
            'Yes. Each organization gets a dedicated subdomain (e.g., yourfirm.designyourinvention.com) with fully isolated data. Tenant isolation is enforced at the database level using Row-Level Security (RLS), ensuring zero cross-tenant data leakage. Your data is completely separate from every other organization on the platform.',
    },
    {
        question: 'How does role-based access control work?',
        answer:
            'The platform supports four roles: Tenant Admin, Attorney, Paralegal, and Viewer. Each role has granular permissions. For example, Viewers can browse and search but cannot create, edit, or delete records. Permissions are enforced both in the UI and on the server, so access control cannot be bypassed.',
    },
    {
        question: 'Can I export my data?',
        answer:
            'Yes. Every list view (families, PRV applications, PCT filings, NPE cases, fees, and audit logs) supports one-click CSV export with all columns included. You can also use bulk actions to select multiple records for status changes or deletion with a single operation.',
    },
    {
        question: 'What security measures are in place?',
        answer:
            'The platform uses Auth0 for enterprise-grade authentication with support for SSO, SAML, and multi-factor authentication. Tokens are stored in-memory only (never localStorage), all data is encrypted in transit and at rest, and documents are stored in encrypted S3 buckets with presigned URL access. High-risk actions require step-up re-authentication.',
    },
    {
        question: 'Can I import my existing patent portfolio from spreadsheets?',
        answer:
            'Yes. You can upload your existing Excel or CSV file and the system validates every row before anything touches the database. You get a color-coded preview showing which families will be created, which filings will be merged, and which will be skipped. One click to confirm, and all records are created in a single atomic transaction with full audit trail. Up to 5,000 filings per import.',
    },
    {
        question: 'What integrations are available?',
        answer:
            'The platform is a cloud-based web application that runs entirely in your browser, with no installation or plugins required. It supports CSV export for every list view, presigned S3 document downloads, and Auth0 SSO integration for enterprise identity providers including SAML and OAuth 2.0. A REST API is available for custom integrations with existing firm systems.',
    },
    {
        question: 'Is Design Your Invention cloud-based or on-premise?',
        answer:
            'Design Your Invention is a cloud-based web application that runs in your browser, with nothing to install or maintain. Each organization gets a dedicated subdomain with fully isolated data, enforced at the database level with Row-Level Security. Data is encrypted in transit and at rest, and documents are stored in encrypted storage with presigned access.',
    },
    {
        question: 'Is AI-generated patent drafting safe for filing?',
        answer:
            'AI-generated drafts are designed as a starting point, not a final filing. Every AI draft includes a mandatory disclaimer stating it requires attorney review before filing. The platform enforces a status workflow (draft, in review, approved), so no AI-generated content can be exported or acted on without human sign-off. Prior art snapshots, model versions, and token counts are preserved for every generation, giving you a complete audit trail for compliance.',
    },
    {
        question: 'Which jurisdictions does AI patent drafting support?',
        answer:
            'The AI drafting engine supports six jurisdictions: US (USPTO, 35 USC 101/102/103), EP (EPO, Article 52/54/56 EPC), IN (Indian Patent Office, Section 3(d)/(i)/(j)/(k) exclusions), WO (WIPO/PCT, international-stage neutral drafting), JP (JPO, Articles 29/36), and CN (CNIPA, Article 22/25/26). Each jurisdiction has specialized rules embedded in the generation process, so claims format, novelty language, and compliance checks adapt automatically.',
    },
    {
        question: 'How does prior art search work in the platform?',
        answer:
            'The prior art search queries the EPO global patent database covering 100+ jurisdictions, without leaving your patent family view. Four search modes are available: Keywords (technical terms across titles and abstracts), Inventor (handles name variations and titles), Applicant (strips corporate suffixes automatically), and Patent Number (any format, kind codes handled). Results can be filtered by IPC classification, date range, and jurisdiction. Relevant patents are saved directly to your family with relevance scoring and attorney notes, creating an auditable prior art record.',
    },
    {
        question: 'Does the platform support pharmaceutical patent workflows?',
        answer:
            'Yes. Pharma companies are one of the two core audiences. Prior art search resolves disclosed compounds to canonical chemical structures and supports substructure search, which matters for chemistry and life-sciences portfolios. AI-assisted drafting includes Indian Patent Office rules, covering the Section 3 exclusions that shape pharma patentability, and the audit-first architecture mirrors FDA 21 CFR Part 11 standards for regulated workflows.',
    },
    {
        question: 'How do I choose the right patent management software?',
        answer:
            'Look for a platform that covers your whole workflow in one place rather than a docketing tool plus separate prior art and drafting subscriptions. Practical criteria are multi-jurisdiction docketing, automatic deadline derivation, fee and renewal tracking, built-in prior art search, an easy way to import an existing portfolio, and an audit trail and access control that meet your compliance needs. Design Your Invention is built to cover all of these in a single platform, with a capability-by-capability breakdown on the comparison page.',
    },
    {
        question: 'How much does Design Your Invention cost?',
        answer:
            'Pricing is not published yet and is tailored to your team size and portfolio. Book a demo or use the contact form and we will share current pricing for your situation. We keep pricing out of marketing until it is final and public, so a quote reflects what actually applies to your team.',
    },
    {
        question: 'How does Design Your Invention compare to legacy tools like Anaqua, Clarivate, or AppColl?',
        answer:
            'Most IP teams run a docketing system plus separate tools for prior art search and drafting, with spreadsheets for chemistry and fees. Design Your Invention unifies multi-jurisdiction docketing, prior art search across 100+ jurisdictions, AI-assisted drafting for six jurisdictions, and chemistry enrichment in one compliance-ready platform. The comparison page has a capability-by-capability breakdown against the typical legacy setup.',
    },
];

/**
 * Curated subset shown in the homepage FAQ section (and mirrored in the
 * homepage FAQPage JSON-LD). The full list lives on the dedicated /faq/ page;
 * the homepage links there via a "view all" link. Keep these to the highest
 * intent questions so the homepage section stays tight.
 */
export const HOME_FAQ_ITEMS = FAQ_ITEMS.slice(0, 8);
