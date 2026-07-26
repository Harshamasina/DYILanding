import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
    title: `Terms of Service - ${SITE_NAME}`,
    description:
        'Terms of Service for Design Your Invention, the enterprise IP management platform. Read our terms governing use of the patent docketing and compliance platform.',
    alternates: {
        canonical: `${SITE_URL}/terms/`,
    },
    openGraph: {
        title: `Terms of Service - ${SITE_NAME}`,
        description:
            'Terms of Service governing use of the Design Your Invention IP management platform.',
        url: `${SITE_URL}/terms/`,
        siteName: SITE_NAME,
        type: 'website',
    },
    twitter: {
        card: 'summary',
        title: `Terms of Service - ${SITE_NAME}`,
        description:
            'Terms of Service governing use of the Design Your Invention IP management platform.',
    },
};

const LAST_UPDATED = 'March 15, 2026';

export default function TermsPage() {
    return (
        <main id="main-content">
            <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <h1
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Terms of Service
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
                            <TermsSection title="1. Acceptance of Terms">
                                <p>
                                    By accessing or using {SITE_NAME} (&quot;the Service&quot;), operated at
                                    designyourinvention.com, you agree to be bound by these Terms of
                                    Service. If you are using the Service on behalf of an organization,
                                    you represent that you have authority to bind that organization to
                                    these terms.
                                </p>
                            </TermsSection>

                            <TermsSection title="2. Description of Service">
                                <p>
                                    {SITE_NAME} is a multi-tenant, cloud-based IP management platform
                                    that provides patent docketing, PCT/PRV/NPE case management, fee
                                    tracking, document management, deadline reminders, and audit trail
                                    functionality, including controls designed to support FDA 21 CFR
                                    Part 11-aligned workflows. The Service is currently offered in
                                    private beta, features may change, and compliance and validation
                                    remain the responsibility of each customer.
                                </p>
                                <p className="mt-2">
                                    Calculated deadlines, risk scores, search results, and AI-generated
                                    drafts are workflow aids, not legal advice. You remain responsible
                                    for verifying dates, rules, citations, and filing requirements
                                    through a qualified patent professional.
                                </p>
                            </TermsSection>

                            <TermsSection title="3. Account Registration">
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>
                                        You must provide accurate and complete registration information
                                    </li>
                                    <li>
                                        You are responsible for maintaining the confidentiality of your
                                        account credentials
                                    </li>
                                    <li>
                                        You must notify us immediately of any unauthorized access to your
                                        account
                                    </li>
                                    <li>
                                        Each organization receives a dedicated subdomain for tenant
                                        isolation
                                    </li>
                                    <li>
                                        Account administrators are responsible for managing user roles and
                                        permissions within their organization
                                    </li>
                                </ul>
                            </TermsSection>

                            <TermsSection title="4. Acceptable Use">
                                <p>You agree not to:</p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>
                                        Use the Service for any unlawful purpose or in violation of any
                                        applicable laws or regulations
                                    </li>
                                    <li>
                                        Attempt to gain unauthorized access to other tenants&apos; data or
                                        any part of the Service not intended for your use
                                    </li>
                                    <li>
                                        Reverse engineer, decompile, or disassemble any part of the Service
                                    </li>
                                    <li>
                                        Interfere with or disrupt the integrity or performance of the
                                        Service
                                    </li>
                                    <li>
                                        Upload malicious code, viruses, or any harmful content
                                    </li>
                                    <li>
                                        Share your account credentials with unauthorized individuals
                                    </li>
                                </ul>
                            </TermsSection>

                            <TermsSection title="5. Intellectual Property">
                                <h3
                                    className="text-base font-semibold text-text-primary mt-4 mb-2"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    Your Data
                                </h3>
                                <p>
                                    You retain all ownership rights to the intellectual property data,
                                    documents, and other content you enter into the platform. We do not
                                    claim any ownership over your data.
                                </p>

                                <h3
                                    className="text-base font-semibold text-text-primary mt-4 mb-2"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    Our Platform
                                </h3>
                                <p>
                                    The Service, including its design, code, features, and documentation,
                                    is owned by {SITE_NAME} and protected by intellectual property laws.
                                    You are granted a limited, non-exclusive, non-transferable license to
                                    use the Service during your subscription period.
                                </p>
                            </TermsSection>

                            <TermsSection title="6. Data Handling & Security">
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>
                                        All tenant data is isolated using Row-Level Security (RLS) at the
                                        database layer
                                    </li>
                                    <li>
                                        Data is encrypted in transit (TLS) and at rest
                                    </li>
                                    <li>
                                        Documents are stored in encrypted S3 buckets with presigned URL
                                        access
                                    </li>
                                    <li>
                                        We maintain append-only audit trails to support regulatory
                                        record-keeping
                                    </li>
                                    <li>
                                        Our data handling practices are detailed in our{' '}
                                        <a
                                            href="/privacy/"
                                            className="text-primary font-semibold hover:text-primary-dark transition-colors"
                                        >
                                            Privacy Policy
                                        </a>
                                    </li>
                                </ul>
                            </TermsSection>

                            <TermsSection title="7. Compliance Features">
                                <p>
                                    {SITE_NAME} offers controls designed to support FDA 21 CFR Part 11
                                    aligned workflows, including reason-for-change tracking, append-only
                                    audit trails, electronic approvals with re-authentication, and
                                    role-based access control. These are product capabilities and not a
                                    compliance certification. Each organization is responsible for its
                                    own regulatory compliance, for validating the platform for its
                                    specific intended use, and for the procedures, training, and quality
                                    system around it.
                                </p>
                            </TermsSection>

                            <TermsSection title="8. Subscription & Payment">
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>
                                        Subscription plans and pricing are as displayed on our pricing page
                                    </li>
                                    <li>
                                        Subscriptions renew automatically unless cancelled before the
                                        renewal date
                                    </li>
                                    <li>
                                        You may cancel your subscription at any time from your account
                                        settings
                                    </li>
                                    <li>
                                        Refunds are handled on a case-by-case basis - contact our support
                                        team
                                    </li>
                                    <li>
                                        We reserve the right to modify pricing with 30 days&apos; advance
                                        notice
                                    </li>
                                </ul>
                            </TermsSection>

                            <TermsSection title="9. Service Availability">
                                <p>
                                    We strive to maintain high availability of the Service but do not
                                    guarantee uninterrupted access. We may perform scheduled maintenance
                                    with advance notice. We are not liable for any downtime, data loss,
                                    or service interruption caused by factors beyond our reasonable
                                    control.
                                </p>
                            </TermsSection>

                            <TermsSection title="10. Limitation of Liability">
                                <p>
                                    To the maximum extent permitted by law, {SITE_NAME} shall not be
                                    liable for any indirect, incidental, special, consequential, or
                                    punitive damages, including but not limited to loss of profits, data,
                                    or business opportunities, arising from your use of the Service.
                                </p>
                                <p>
                                    Our total liability for any claim arising from these terms shall not
                                    exceed the amount you paid for the Service in the 12 months preceding
                                    the claim.
                                </p>
                            </TermsSection>

                            <TermsSection title="11. Termination">
                                <p>
                                    Either party may terminate the subscription at any time. Upon
                                    termination:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li>Your access to the platform will be revoked</li>
                                    <li>
                                        You may request an export of your data within 30 days of
                                        termination
                                    </li>
                                    <li>
                                        After the 30-day period, your data will be permanently deleted
                                        from our systems
                                    </li>
                                    <li>
                                        Audit trail data may be retained as required by regulatory
                                        obligations
                                    </li>
                                </ul>
                            </TermsSection>

                            <TermsSection title="12. Governing Law">
                                <p>
                                    These Terms shall be governed by and construed in accordance with the
                                    laws of the United States. Any disputes arising from these terms shall
                                    be resolved in the courts of competent jurisdiction.
                                </p>
                            </TermsSection>

                            <TermsSection title="13. Changes to Terms">
                                <p>
                                    We may update these Terms from time to time. We will notify you of
                                    material changes by email or through the platform. Continued use of
                                    the Service after changes take effect constitutes acceptance of the
                                    updated terms.
                                </p>
                            </TermsSection>

                            <TermsSection title="14. Contact Us">
                                <p>
                                    If you have questions about these Terms of Service, contact us at:
                                </p>
                                <p className="mt-2">
                                    <strong>{SITE_NAME}</strong>
                                    <br />
                                    Email:{' '}
                                    <a
                                        href="mailto:legal@designyourinvention.com"
                                        className="text-primary font-semibold hover:text-primary-dark transition-colors"
                                    >
                                        legal@designyourinvention.com
                                    </a>
                                </p>
                            </TermsSection>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}

function TermsSection({
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
