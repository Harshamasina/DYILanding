export interface FaqItem {
    question: string;
    answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
    {
        question: 'What is Design Your Invention?',
        answer:
            'Design Your Invention (DYI) is an intellectual property management software (IPMS) platform for pharma companies and IP boutique law firms. It brings multi-jurisdiction patent docketing, prior art search across 100+ patent authorities via the EPO, and AI-assisted patent drafting for US, EP, IN, and PCT (WO) into one connected, audit-trailed workspace. The architecture follows FDA 21 CFR Part 11 patterns, with tenant-scoped data isolation so each organization keeps its portfolio separate.',
    },
    {
        question: 'Is the platform generally available or in private beta?',
        answer:
            'The full IP management platform is in private beta and under active development, so features can change during the beta. The public patent search tool is live and free to use today. If you want early access to the platform, book a demo or use the contact form and we will talk through your workflow and the current beta scope.',
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
        question: 'Which controls support an FDA 21 CFR Part 11-aligned workflow?',
        answer:
            'Every edit to a critical field requires a documented reason-for-change. The audit trail logs who made each change, what changed, and when, and is append-only: the application exposes no edit or delete path on audit history. Electronic approvals require re-authentication, and role-based access control limits who can perform sensitive actions. These are product capabilities, not a compliance certification. Validation and Part 11 compliance depend on each customer intended use, configuration, procedures, training, and quality system.',
    },
    {
        question: 'Can I manage PCT and PRV filings in one place?',
        answer:
            'Yes. The platform links PRV (provisional), PCT (international), and NPE (national phase entry) cases to their parent patent families. You can see the entire filing hierarchy in a visual family tree, track deadlines across all filing types, and manage office actions and fees from a single dashboard.',
    },
    {
        question: 'Can the platform manage patents across multiple jurisdictions?',
        answer:
            'Yes. Multi-jurisdiction portfolios are the core use case. Docketing covers US, PCT, EP, JP, CN, and IN, with PRV, PCT, and NPE cases linked to their parent application families so the full filing hierarchy is visible in one place. Deadlines, fees, and office actions are tracked across every jurisdiction in your portfolio, and fee analytics roll up spend with date-accurate multi-currency conversion into one reporting currency.',
    },
    {
        question: 'How does the platform help reduce deadline risk?',
        answer:
            'Supported statutory and procedural deadlines are derived from your case data rather than entered by hand, so they do not depend on someone remembering to add them to a calendar. Every deadline gets a 0 to 100 risk score with green, amber, and red levels, and automated email digests push what is due to the responsible owner before the date. A weekly stale-alert report also surfaces cases that are quietly going wrong without generating a hard deadline. Calculated dates are workflow aids: coverage depends on the case data you record, and a qualified patent professional remains responsible for verifying every date.',
    },
    {
        question: 'What patent fee types are supported?',
        answer:
            'The platform supports 42 fee types across 8 categories, including filing fees, examination fees, issue fees, maintenance/annuity fees, extension fees, petition fees, PCT fees, and miscellaneous fees. Each fee can be tracked as due, paid, waived, or overdue with full analytics and CSV export.',
    },
    {
        question: 'Is the platform multi-tenant?',
        answer:
            'Yes. Each organization gets a dedicated subdomain (e.g., yourfirm.designyourinvention.com) with tenant-scoped data. Isolation is enforced at the database level using Row-Level Security (RLS) inside tenant-scoped transactions, which is designed to prevent cross-organization access. Your organization data is kept separate from every other organization on the platform.',
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
            'The platform uses Auth0 for authentication with support for SSO, SAML, and multi-factor authentication. Access tokens are held in memory rather than written to browser storage, data is encrypted in transit and at rest, and documents are stored in encrypted S3 buckets with presigned URL access. High-risk actions require step-up re-authentication. Independent security assurance reports, such as SOC 2, have not been issued yet, and we will say so plainly in any security review.',
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
            'AI-generated drafts are a starting point, not a final filing. AI-generated content may be incomplete or inaccurate and is not legal advice, so every draft carries a mandatory disclaimer and requires attorney review. The platform enforces a status workflow (draft, in review, approved), so no AI-generated content can be exported or acted on without human sign-off. Prior art snapshots, model details, and token counts are preserved for every generation, giving you a complete record of what the assistant saw and produced.',
    },
    {
        question: 'Which jurisdictions does AI patent drafting support?',
        answer:
            'Four jurisdictions are in the production set: US (USPTO, 35 USC 101/112), EP (EPO, EPC Article 84 and the EPC 2000 compound-for-use format), IN (Indian Patent Office, Section 3(d)/(i)/(j)/(k) exclusions), and WO (WIPO/PCT, international-stage neutral drafting). JP and CN are planned and not available yet. Each supported jurisdiction has drafting guidance and mandatory section structure applied during generation, so claim format and section coverage follow local convention, with relevant statutory considerations flagged for attorney review.',
    },
    {
        question: 'How does prior art search work in the platform?',
        answer:
            'The in-app prior art search queries the EPO global patent database (Open Patent Services) covering 100+ patent authorities, without leaving your patent family view. It is a separate data source from the free public search tool, so result sets can differ. Four search modes are available: Keywords (technical terms across titles and abstracts), Inventor (handles name variations and titles), Applicant (strips corporate suffixes automatically), and Patent Number (any format, kind codes handled). Results can be filtered by IPC classification, date range, and jurisdiction. Relevant patents are saved directly to your family with relevance scoring and attorney notes, creating an auditable prior art record.',
    },
    {
        question: 'Does the platform support pharmaceutical patent workflows?',
        answer:
            'Yes. Pharma companies are one of the two core audiences. Prior art search resolves detected compounds to canonical chemical structures and supports substructure search, which matters for chemistry and life-sciences portfolios. AI-assisted drafting applies Indian Patent Office drafting rules and flags the Section 3 exclusions that shape pharma patentability for attorney review, and the audit-first architecture follows FDA 21 CFR Part 11 patterns for regulated workflows.',
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
            'Most IP teams run a docketing system plus separate tools for prior art search and drafting, with spreadsheets for chemistry and fees. Design Your Invention unifies multi-jurisdiction docketing, prior art search across 100+ patent authorities, AI-assisted drafting for US, EP, IN, and PCT, and chemistry enrichment in one connected, audit-trailed platform. The comparison page has a capability-by-capability breakdown against the typical legacy setup.',
    },
    {
        question: 'Is my content used to train AI models?',
        answer:
            'No. Invention details and prior art are sent to the model provider only to generate the draft you asked for, under an enterprise API agreement that does not permit training on customer content. Prompts carry no personal data unless an attorney puts it there, every generation is recorded against a frozen prior-art snapshot, and the retention terms, provider, and processing regions in force are shared as part of security review.',
    },
    {
        question: 'What security certifications does Design Your Invention hold?',
        answer:
            'None yet, and we will not imply otherwise. The security program is being built around the AICPA Trust Services Criteria, but no SOC 2 Type I or Type II report has been issued and no independent security audit has been completed. What exists today is architectural: tenant-scoped authorization with database row-level security, role-based access control, encryption in transit and at rest, append-only audit history, and step-up authentication on high-risk actions.',
    },
];

/**
 * Curated subset shown in the homepage FAQ section (and mirrored in the
 * homepage FAQPage JSON-LD). The full list lives on the dedicated /faq/ page;
 * the homepage links there via a "view all" link. Keep these to the highest
 * intent questions so the homepage section stays tight.
 */
export const HOME_FAQ_ITEMS = FAQ_ITEMS.slice(0, 8);
