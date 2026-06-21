import { Clock, ShieldCheck, Calendar, Mail, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { ContactForm } from '@/components/sections/ContactForm';
import { WatchDemoLink } from '@/components/ui/WatchDemoLink';

const TRUST_SIGNALS = [
    { icon: Calendar, text: '15-minute guided walkthrough' },
    { icon: Clock, text: 'Response within 1 business day' },
    { icon: ShieldCheck, text: 'Demo tailored to your patent workflow' },
];

const CONTACT_INFO = [
    {
        icon: Mail,
        label: 'Email',
        value: 'sales@designyourinvention.com',
        href: 'mailto:sales@designyourinvention.com',
    },
    {
        icon: MapPin,
        label: 'Headquarters',
        value: 'United States',
    },
    {
        icon: Clock,
        label: 'Response Time',
        value: 'Within 1 business day',
    },
];

export function CtaSection() {
    return (
        <section id="contact" className="py-24 lg:py-32">
            <Container>
                <div className="grid gap-16 lg:grid-cols-5 lg:gap-20">
                    {/* Left Column — CTA copy + contact info */}
                    <div className="lg:col-span-2">
                        {/* Section Heading — tree branch anchor */}
                        <div id="tree-contact" className="flex items-center gap-3 mb-6">
                            <span
                                className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Contact
                            </span>
                        </div>
                        <FadeIn treeNode="tree-contact">
                            <h2
                                className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Modernize Patent Operations With a{' '}
                                <span className="text-primary">
                                    Guided Demo
                                </span>
                            </h2>
                            <p
                                className="mt-5 text-lg text-text-secondary leading-relaxed"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                See how Design Your Invention helps patent teams
                                manage docketing, prior art search, AI-assisted
                                drafting, compliance, and portfolio workflows in
                                one audited platform.
                            </p>

                            {/* Low-friction alternative to the form: a subtle
                                link to watch the demo first. This is below the
                                fold where the sticky pill is hidden, so it is
                                the bottom-funnel watch-demo entry point. */}
                            <WatchDemoLink className="mt-6">
                                Prefer to watch first? See the 2-minute demo
                            </WatchDemoLink>

                            {/* Trust Signals */}
                            <div className="mt-8 flex flex-wrap gap-4">
                                {TRUST_SIGNALS.map((signal) => (
                                    <div
                                        key={signal.text}
                                        className="flex items-center gap-2 text-text-muted"
                                    >
                                        <signal.icon className="w-4 h-4" />
                                        <span
                                            className="text-sm"
                                            style={{
                                                fontFamily: 'var(--font-body)',
                                            }}
                                        >
                                            {signal.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Contact Details */}
                            <div className="mt-10 space-y-5">
                                {CONTACT_INFO.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-lg border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(99,102,241,0.08)] flex items-center justify-center">
                                            <item.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p
                                                className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1"
                                                style={{
                                                    fontFamily:
                                                        'var(--font-mono)',
                                                }}
                                            >
                                                {item.label}
                                            </p>
                                            {item.href ? (
                                                <a
                                                    href={item.href}
                                                    className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                                                    style={{
                                                        fontFamily:
                                                            'var(--font-body)',
                                                    }}
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p
                                                    className="text-sm font-medium text-text-primary"
                                                    style={{
                                                        fontFamily:
                                                            'var(--font-body)',
                                                    }}
                                                >
                                                    {item.value}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </div>

                    {/* Right Column — Contact Form
                        h-full chain (column → FadeIn → card div) makes the
                        white card stretch to match the left column's height
                        instead of collapsing around the form content. */}
                    <div className="lg:col-span-3 lg:h-full">
                        <FadeIn
                            treeNode="tree-contact"
                            delay={0.15}
                            className="lg:h-full"
                        >
                            <div className="rounded-2xl border border-card-border bg-card-bg p-8 lg:p-10 shadow-lg shadow-black/5 lg:h-full">
                                <ContactForm />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </Container>
        </section>
    );
}
