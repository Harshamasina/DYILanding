import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { ContactForm } from '@/components/sections/ContactForm';
import { WatchDemoLink } from '@/components/ui/WatchDemoLink';
import { SectionMark } from '@/components/ui/SectionMark';
import { RuledList, RuledItem } from '@/components/ui/RuledList';

/* The response time lives in the contact details below, so it is not
   repeated here. */
const TRUST_SIGNALS = [
    '15-minute guided walkthrough',
    'Demo tailored to your patent workflow',
];

const CONTACT_INFO: { label: string; value: string; href?: string }[] = [
    {
        label: 'Email',
        value: 'sales@designyourinvention.com',
        href: 'mailto:sales@designyourinvention.com',
    },
    {
        label: 'Headquarters',
        value: 'United States',
    },
    {
        label: 'Response Time',
        value: 'Within 1 business day',
    },
];

export function CtaSection() {
    return (
        <section id="contact" className="py-24 lg:py-32">
            <Container>
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-20">
                    {/* Left column: CTA copy and contact details. min-w-0 lets the
                        grid track shrink below its content on phones. */}
                    <div className="min-w-0 lg:col-span-2">
                        {/* Section heading, tree branch anchor */}
                        <SectionMark id="tree-contact" className="mb-6">
                            Contact
                        </SectionMark>
                        <FadeIn treeNode="tree-contact">
                            <h2
                                className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Modernize Patent Operations With a{' '}
                                <span className="italic">
                                    Guided Demo
                                </span>
                            </h2>
                            <p
                                className="mt-5 text-lg text-text-secondary leading-relaxed"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                See how Design Your Invention helps patent teams
                                manage docketing, prior art search, AI-assisted
                                drafting, compliance controls, and portfolio
                                workflows in one connected, audit-trailed
                                workspace.
                            </p>

                            {/* Low-friction alternative to the form: a subtle
                                link to watch the demo first. This is below the
                                fold where the sticky pill is hidden, so it is
                                the bottom-funnel watch-demo entry point. */}
                            <WatchDemoLink className="mt-6">
                                Prefer to watch first? See the short demo (2:35)
                            </WatchDemoLink>

                            <RuledList label="The demo" className="mt-8">
                                {TRUST_SIGNALS.map((signal) => (
                                    <RuledItem key={signal}>{signal}</RuledItem>
                                ))}
                            </RuledList>

                            {/* Contact details: a plain definition list */}
                            <dl className="mt-10 border-t border-card-border">
                                {CONTACT_INFO.map((item) => (
                                    <div
                                        key={item.label}
                                        className="grid grid-cols-1 gap-y-1.5 border-b border-card-border py-3.5 sm:grid-cols-[8.5rem_1fr] sm:items-baseline sm:gap-x-4"
                                    >
                                        <dt className="text-base text-navy-light leading-none tracking-[0.1em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                                            {item.label}
                                        </dt>
                                        {/* Below sm the term sits above its value, so the email address keeps
                                            the full column and never breaks mid-word. */}
                                        <dd className="min-w-0 text-sm font-medium [font-family:var(--font-body)]">
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    className="-my-3 inline-block py-3 text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-dark hover:decoration-primary"
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <span className="text-text-primary">{item.value}</span>
                                            )}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </FadeIn>
                    </div>

                    {/* Right column: contact form
                        h-full chain (column → FadeIn → card div) makes the
                        white card stretch to match the left column's height
                        instead of collapsing around the form content. */}
                    <div className="lg:col-span-3 lg:h-full">
                        <FadeIn
                            treeNode="tree-contact"
                            delay={0.15}
                            className="lg:h-full"
                        >
                            <div className="rounded-2xl border border-card-border bg-card-bg p-5 sm:p-8 lg:p-10 shadow-lg shadow-black/5 lg:h-full">
                                <ContactForm />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </Container>
        </section>
    );
}
