import type { Metadata } from 'next';
import { Mail, Clock, MessageSquare, FileText, ShieldCheck, BookOpen } from 'lucide-react';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { ogImageEntry, ogImageUrl } from '@/lib/og';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
    title: `Support - ${SITE_NAME} | IP Management Software Help & Resources`,
    description:
        'Get help with Design Your Invention IP management platform. Browse FAQs and access resources for patent docketing and compliance.',
    keywords: [
        'IP management support',
        'patent docketing help',
        'Design Your Invention support',
        'IP software customer service',
        'patent management help desk',
    ],
    alternates: {
        canonical: `${SITE_URL}/support/`,
    },
    openGraph: {
        title: `Support - ${SITE_NAME}`,
        description:
            'Get help with Design Your Invention IP management platform. Contact support, browse FAQs, and access resources.',
        url: `${SITE_URL}/support/`,
        siteName: SITE_NAME,
        type: 'website',
        images: [ogImageEntry('support', `Support - ${SITE_NAME}`)],
    },
    twitter: {
        card: 'summary_large_image',
        title: `Support - ${SITE_NAME}`,
        description:
            'Get help with Design Your Invention IP management platform.',
        images: [ogImageUrl('support')],
    },
};

const SUPPORT_CHANNELS = [
    {
        icon: Mail,
        title: 'Email Support',
        description: 'Send us a detailed message and our team will respond within 1 business day.',
        action: 'support@designyourinvention.com',
        href: 'mailto:support@designyourinvention.com',
        linkText: 'Send Email',
    },
    {
        icon: MessageSquare,
        title: 'Request a Demo',
        description: 'See the platform in action with a personalized walkthrough from our team.',
        action: 'Book a session',
        href: '/#contact',
        linkText: 'Book a Demo',
    },
    {
        icon: Clock,
        title: 'Response Time',
        description: 'Our support team is available Monday through Friday, 9 AM - 6 PM EST.',
        action: 'Within 1 business day',
        href: null,
        linkText: null,
    },
];

const RESOURCES = [
    {
        icon: BookOpen,
        title: 'Frequently Asked Questions',
        description: 'Answers to common questions about IP management, compliance, importing, and more.',
        href: '/#faq',
    },
    {
        icon: FileText,
        title: 'Portfolio Import Guide',
        description: 'Step-by-step guide for migrating your patent portfolio from spreadsheets.',
        href: '/#import',
    },
    {
        icon: ShieldCheck,
        title: 'Compliance & Security',
        description: 'Learn about FDA 21 CFR Part 11-aligned controls, audit trails, and data security.',
        href: '/#compliance',
    },
];

const COMMON_QUESTIONS = [
    {
        q: 'How do I import my existing patent portfolio?',
        a: 'Use our Portfolio Import tool - upload an XLSX or CSV file, preview the changes, and confirm with one click. Supports up to 5,000 filings per file.',
    },
    {
        q: 'What file formats are supported for document uploads?',
        a: 'Design Your Invention supports common document formats including PDF, DOCX, XLSX, and image files. File type restrictions can be configured per organization.',
    },
    {
        q: 'How do I add users to my organization?',
        a: 'Tenant Admins can invite users from Settings. Assign roles (Attorney, Paralegal, Viewer) with granular permissions enforced at the server level.',
    },
    {
        q: 'Can I export my data?',
        a: 'Yes. Every list view supports CSV export with all columns included. Audit logs can also be exported for compliance reporting.',
    },
    {
        q: 'How does the deadline reminder system work?',
        a: 'Design Your Invention tracks deadlines across all modules - office actions, PCT filings, annuity fees, and custom reminders. Email notifications are sent based on configurable lead times.',
    },
    {
        q: 'Is my data backed up?',
        a: 'All data is stored on encrypted AWS infrastructure with automated backups. Documents are stored in versioned S3 buckets with presigned URL access.',
    },
];

export default function SupportPage() {
    return (
        <main id="main-content">
            {/* Hero */}
            <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h1
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            How can we{' '}
                            <span className="text-primary">help you?</span>
                        </h1>
                        <p
                            className="mt-4 text-lg text-text-secondary leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Get support for your IP management workflow. Our team is here
                            to help you get the most out of Design Your Invention.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Support Channels */}
            <section className="pb-20 lg:pb-24">
                <Container>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                        {SUPPORT_CHANNELS.map((channel) => (
                            <div
                                key={channel.title}
                                className="rounded-2xl border border-card-border bg-card-bg p-6 sm:p-8 text-center"
                            >
                                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <channel.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h2
                                    className="text-lg font-bold text-text-primary mb-2"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {channel.title}
                                </h2>
                                <p
                                    className="text-sm text-text-secondary leading-relaxed mb-4"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    {channel.description}
                                </p>
                                {channel.href ? (
                                    <Button href={channel.href} variant="secondary" size="sm">
                                        {channel.linkText}
                                    </Button>
                                ) : (
                                    <p
                                        className="text-sm font-semibold text-primary"
                                        style={{ fontFamily: 'var(--font-mono)' }}
                                    >
                                        {channel.action}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Resources */}
            <section className="py-20 lg:py-24 bg-page-bg-alt">
                <Container>
                    <div className="max-w-5xl mx-auto">
                        <h2
                            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl mb-10"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Resources & Guides
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {RESOURCES.map((resource) => (
                                <a
                                    key={resource.title}
                                    href={resource.href}
                                    className="group rounded-xl border border-card-border bg-card-bg p-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 no-underline"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                                        <resource.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3
                                        className="text-base font-semibold text-text-primary mb-1.5 group-hover:text-primary transition-colors"
                                        style={{ fontFamily: 'var(--font-display)' }}
                                    >
                                        {resource.title}
                                    </h3>
                                    <p
                                        className="text-sm text-text-secondary leading-relaxed"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {resource.description}
                                    </p>
                                </a>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Common Questions */}
            <section className="py-20 lg:py-24">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <h2
                            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl mb-10"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Common Support Questions
                        </h2>
                        <div className="rounded-2xl border border-card-border bg-card-bg overflow-hidden">
                            {COMMON_QUESTIONS.map((item, i) => (
                                <div
                                    key={item.q}
                                    className={`p-5 sm:p-6 ${i < COMMON_QUESTIONS.length - 1 ? 'border-b border-card-border/60' : ''}`}
                                >
                                    <h3
                                        className="text-[15px] font-semibold text-text-primary mb-2"
                                        style={{ fontFamily: 'var(--font-display)' }}
                                    >
                                        {item.q}
                                    </h3>
                                    <p
                                        className="text-sm text-text-secondary leading-relaxed"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {item.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* Contact CTA */}
            <section className="pb-24 lg:pb-32">
                <Container>
                    <div className="max-w-2xl mx-auto text-center">
                        <h2
                            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl mb-4"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Still need help?
                        </h2>
                        <p
                            className="text-text-secondary mb-6 leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Our support team is ready to assist. Reach out directly or
                            book a demo to get personalized help.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button href="mailto:support@designyourinvention.com" variant="primary" size="lg">
                                Email Support
                            </Button>
                            <Button href="/#contact" variant="secondary" size="lg">
                                Contact Us
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
