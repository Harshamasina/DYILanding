import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
    title: `Privacy Policy - ${SITE_NAME}`,
    description:
        'Learn how Design Your Invention collects, uses, and protects your personal data. Our privacy policy covers data handling for our IP management platform.',
    alternates: {
        canonical: `${SITE_URL}/privacy/`,
    },
    openGraph: {
        title: `Privacy Policy - ${SITE_NAME}`,
        description:
            'Learn how Design Your Invention collects, uses, and protects your personal data.',
        url: `${SITE_URL}/privacy/`,
        siteName: SITE_NAME,
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: `Privacy Policy - ${SITE_NAME}`,
        description:
            'Learn how Design Your Invention collects, uses, and protects your personal data.',
    },
};

const LAST_UPDATED = 'March 15, 2026';

export default function PrivacyPage() {
    return (
        <main id="main-content">
            <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <h1
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Privacy Policy
                        </h1>
                        <p
                            className="mt-3 text-sm text-text-muted"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            Last updated: {LAST_UPDATED}
                        </p>

                        <div
                            className="mt-10 space-y-10 text-text-secondary text-[15px] leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            <PolicySection title="1. Introduction">
                                <p>
                                    {SITE_NAME} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the
                                    website at designyourinvention.com and the {SITE_NAME} IP management
                                    platform. This Privacy Policy explains how we collect, use, disclose,
                                    and safeguard your information when you visit our website or use our
                                    platform.
                                </p>
                                <p>
                                    By accessing or using our services, you agree to the terms of this
                                    Privacy Policy. If you do not agree, please do not use our services.
                                </p>
                            </PolicySection>

                            <PolicySection title="2. Information We Collect">
                                <h3
                                    className="text-base font-semibold text-text-primary mt-4 mb-2"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    Information You Provide
                                </h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Account registration details (name, email, company, role)</li>
                                    <li>Contact form submissions and demo requests</li>
                                    <li>Patent and intellectual property data entered into the platform</li>
                                    <li>Documents uploaded to the document management system</li>
                                    <li>Communications with our support team</li>
                                </ul>

                                <h3
                                    className="text-base font-semibold text-text-primary mt-4 mb-2"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    Information Collected Automatically
                                </h3>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>IP address, browser type, and device information</li>
                                    <li>Pages visited, time spent, and navigation patterns</li>
                                    <li>Referring URLs and search terms</li>
                                    <li>Cookies and similar tracking technologies</li>
                                </ul>
                            </PolicySection>

                            <PolicySection title="3. How We Use Your Information">
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>To provide, operate, and maintain the {SITE_NAME} platform</li>
                                    <li>To process your account registration and manage your subscription</li>
                                    <li>To respond to inquiries, demo requests, and support tickets</li>
                                    <li>To send transactional emails (deadline reminders, audit notifications)</li>
                                    <li>To improve our platform, features, and user experience</li>
                                    <li>To ensure security and prevent unauthorized access</li>
                                    <li>To comply with legal obligations and regulatory requirements</li>
                                </ul>
                            </PolicySection>

                            <PolicySection title="4. Data Security">
                                <p>
                                    We use technical and organizational safeguards designed to protect
                                    your data:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>Data encrypted in transit (HTTPS/TLS) and at rest</li>
                                    <li>Authentication via Auth0 with support for SSO, SAML, and MFA</li>
                                    <li>Access tokens held in memory rather than written to browser storage</li>
                                    <li>Row-Level Security (RLS) at the database layer for tenant isolation</li>
                                    <li>Documents stored in encrypted S3 buckets with presigned URL access</li>
                                    <li>Append-only audit trail for data modifications</li>
                                    <li>Role-based access control (RBAC) with server-side enforcement</li>
                                </ul>
                                <p className="mt-2">
                                    No security programme can guarantee absolute security. Independent
                                    security assurance reports, such as SOC 2, have not been issued for
                                    the platform yet.
                                </p>
                            </PolicySection>

                            <PolicySection title="5. Data Sharing & Disclosure">
                                <p>
                                    We do not sell, rent, or trade your personal information. We may share
                                    data only in the following circumstances:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>
                                        <strong>Service providers:</strong> Trusted third parties that help
                                        operate our platform (hosting, authentication, email delivery)
                                    </li>
                                    <li>
                                        <strong>Legal compliance:</strong> When required by law, regulation,
                                        or valid legal process
                                    </li>
                                    <li>
                                        <strong>Business transfers:</strong> In connection with a merger,
                                        acquisition, or sale of assets
                                    </li>
                                    <li>
                                        <strong>With your consent:</strong> When you explicitly authorize
                                        disclosure
                                    </li>
                                </ul>
                            </PolicySection>

                            <PolicySection title="6. Multi-Tenant Data Isolation">
                                <p>
                                    {SITE_NAME} is a multi-tenant platform. Each organization&apos;s data is
                                    scoped to that organization through Row-Level Security (RLS) enforced at
                                    the database layer inside tenant-scoped transactions. These safeguards
                                    are designed to prevent other organizations on the platform from
                                    accessing your intellectual property data.
                                </p>
                            </PolicySection>

                            <PolicySection title="7. FDA 21 CFR Part 11-Aligned Controls">
                                <p>
                                    For customers using our compliance features, {SITE_NAME} provides audit
                                    trails, electronic approval workflows, and reason-for-change tracking
                                    designed to support Part 11-aligned workflows. Audit records are
                                    append-only: the application exposes no path to edit or delete them.
                                </p>
                                <p className="mt-2">
                                    These are product capabilities, not a compliance certification.
                                    Part 11 compliance and system validation depend on each customer&apos;s
                                    intended use, configuration, procedures, training, and quality system.
                                </p>
                            </PolicySection>

                            <PolicySection title="8. Cookies">
                                <p>
                                    Our website uses essential cookies required for authentication and
                                    platform functionality. We may also use analytics cookies to understand
                                    how visitors interact with our website. You can control cookie
                                    preferences through your browser settings.
                                </p>
                            </PolicySection>

                            <PolicySection title="9. Data Retention">
                                <p>
                                    We retain your data for as long as your account is active or as needed
                                    to provide services. Audit trail data is retained indefinitely to meet
                                    regulatory compliance requirements. You may request deletion of your
                                    account and associated data by contacting us.
                                </p>
                            </PolicySection>

                            <PolicySection title="10. Your Rights">
                                <p>
                                    Depending on your jurisdiction, you may have the right to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>Access the personal data we hold about you</li>
                                    <li>Request correction of inaccurate data</li>
                                    <li>Request deletion of your data (subject to regulatory retention requirements)</li>
                                    <li>Object to or restrict processing of your data</li>
                                    <li>Request data portability</li>
                                    <li>Withdraw consent at any time</li>
                                </ul>
                                <p className="mt-2">
                                    To exercise these rights, contact us at{' '}
                                    <a
                                        href="mailto:privacy@designyourinvention.com"
                                        className="text-primary font-semibold hover:text-primary-dark transition-colors"
                                    >
                                        privacy@designyourinvention.com
                                    </a>
                                    .
                                </p>
                            </PolicySection>

                            <PolicySection title="11. Changes to This Policy">
                                <p>
                                    We may update this Privacy Policy from time to time. We will notify
                                    you of any material changes by posting the updated policy on this page
                                    with a revised &quot;Last updated&quot; date.
                                </p>
                            </PolicySection>

                            <PolicySection title="12. Contact Us">
                                <p>
                                    If you have questions about this Privacy Policy or our data practices,
                                    contact us at:
                                </p>
                                <p className="mt-2">
                                    <strong>{SITE_NAME}</strong>
                                    <br />
                                    Email:{' '}
                                    <a
                                        href="mailto:privacy@designyourinvention.com"
                                        className="text-primary font-semibold hover:text-primary-dark transition-colors"
                                    >
                                        privacy@designyourinvention.com
                                    </a>
                                </p>
                            </PolicySection>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}

function PolicySection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h2
                className="text-xl font-bold text-text-primary mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {title}
            </h2>
            <div className="space-y-3">{children}</div>
        </div>
    );
}
