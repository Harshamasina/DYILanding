import { Check, Star, Info } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';

interface PlanFeature {
    text: string;
    detail?: string;
}

interface Plan {
    name: string;
    price: string;
    priceNote: string;
    description: string;
    target: string;
    recommended?: boolean;
    features: PlanFeature[];
    /** CTA label and routing — links go through next/link, demos open the
     *  BookDemoModal. Lets each plan match its actual conversion intent. */
    cta: {
        label: string;
        href?: string;
    };
    /** Small advisory line shown below the features list. Use it to point to
     *  the higher-tier plan instead of cluttering the list with X-marks. */
    note?: string;
}

const SIGNUP_HREF = 'https://app.designyourinvention.com/auth/sign-in';

const PLANS: Plan[] = [
    {
        name: 'Starter',
        price: 'Free during private beta',
        priceNote: 'Self-serve sign-up, no credit card required',
        target: 'Solo attorneys & small IP teams',
        description:
            'Everything you need to move off spreadsheets and manage patent operations digitally.',
        cta: { label: 'Start Free', href: SIGNUP_HREF },
        features: [
            { text: 'Unlimited patent families' },
            { text: 'PRV / PCT / NPE modules' },
            { text: 'Office action & deadline tracking' },
            { text: 'Annuity & maintenance fees' },
            { text: 'Email deadline reminders' },
            { text: 'CSV / Excel export' },
            { text: 'Document attachments' },
            { text: 'RBAC up to 5 users' },
            { text: 'Basic audit log' },
        ],
        note: 'Advanced compliance controls available in Compliance Pro.',
    },
    {
        name: 'Compliance Pro',
        price: 'Tailored pricing',
        priceNote: 'Based on users, modules, and portfolio size',
        target: 'Pharma IP teams, biotech companies & specialty law firms',
        description:
            'Workflow controls and enterprise features for confidential, high-stakes patent work in regulated environments.',
        recommended: true,
        cta: { label: 'Book a Compliance Demo' },
        features: [
            { text: 'Everything in Starter', detail: 'Included' },
            { text: 'Unlimited users & roles' },
            { text: 'Append-only field-level audit trail', detail: 'Part 11-aligned' },
            { text: '21 CFR Part 11-aligned workflow controls', detail: 'Part 11-aligned' },
            { text: 'Electronic signatures + re-auth' },
            { text: 'SSO / SAML integration' },
            { text: 'Foreign associate portal' },
            { text: 'Orange Book / EMA auto-sync' },
            { text: 'Portfolio import tool' },
            { text: 'Dedicated onboarding' },
            { text: 'Priority support' },
        ],
    },
];

export function PricingSection() {
    return (
        <section
            id="pricing"
            className="relative overflow-hidden py-24 lg:py-32"
        >
            {/* Soft indigo glow positioned behind the recommended
                Compliance Pro tier to draw the eye to the upgrade
                path. On lg+ where the cards sit side-by-side, the
                glow shifts to the right (where the recommended card
                renders). On smaller breakpoints where cards stack,
                the glow shifts to the lower-mid area where the
                recommended card sits below Starter. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div
                    className="absolute top-[72%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-110 w-110 sm:h-130 sm:w-130 lg:top-1/2 lg:left-[65%] lg:h-150 lg:w-150"
                    style={{
                        background:
                            'radial-gradient(circle at center, rgba(99,102,241,0.20) 0%, rgba(129,140,248,0.10) 35%, transparent 65%)',
                        filter: 'blur(60px)',
                    }}
                />
            </div>
            <Container className="relative">
                {/* Section Heading */}
                <div id="tree-pricing" className="flex items-center gap-3 mb-6">
                    <span
                        className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Plans
                    </span>
                </div>
                <FadeIn treeNode="tree-pricing">
                    <div className="max-w-2xl mb-16 lg:mb-20">
                        <h2
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Pricing that scales with your portfolio
                        </h2>
                        <p
                            className="mt-4 text-lg text-text-secondary leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Two plans built for different team sizes. Choose a
                            self-serve start or book a guided demo for
                            compliance-focused teams.
                        </p>
                    </div>
                </FadeIn>

                {/* Plan Cards */}
                <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
                    {PLANS.map((plan, i) => (
                        <FadeIn key={plan.name} treeNode="tree-pricing" delay={i * 0.15}>
                            <div
                                className={`relative rounded-2xl border p-6 sm:p-8 h-full flex flex-col ${
                                    plan.recommended
                                        ? 'border-primary shadow-xl shadow-primary/10 ring-1 ring-primary'
                                        : 'border-card-border'
                                }`}
                            >
                                {/* Badge */}
                                {plan.recommended && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                            <Star className="w-3 h-3 fill-white" />
                                            For Regulated Teams
                                        </span>
                                    </div>
                                )}

                                {/* Plan Header */}
                                <div className="mb-6">
                                    <h3
                                        className="text-2xl font-bold text-text-primary"
                                        style={{ fontFamily: 'var(--font-display)' }}
                                    >
                                        {plan.name}
                                    </h3>
                                    <div className="mt-3">
                                        <span
                                            className="text-xl font-bold text-primary"
                                            style={{ fontFamily: 'var(--font-mono)' }}
                                        >
                                            {plan.price}
                                        </span>
                                        <p
                                            className="text-xs text-text-muted mt-1"
                                            style={{ fontFamily: 'var(--font-body)' }}
                                        >
                                            {plan.priceNote}
                                        </p>
                                    </div>
                                    <p
                                        className="mt-4 text-sm text-text-secondary"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        <span className="font-semibold text-text-primary">
                                            Best for:
                                        </span>{' '}
                                        {plan.target}
                                    </p>
                                    <p
                                        className="mt-2 text-sm text-text-secondary leading-relaxed"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {plan.description}
                                    </p>
                                </div>

                                {/* CTA Button — link for self-serve, modal for demo */}
                                <div className="mb-6">
                                    {plan.cta.href ? (
                                        <Button
                                            href={plan.cta.href}
                                            variant={plan.recommended ? 'primary' : 'secondary'}
                                            className="w-full justify-center"
                                        >
                                            {plan.cta.label}
                                        </Button>
                                    ) : (
                                        <BookDemoButton
                                            variant={plan.recommended ? 'primary' : 'secondary'}
                                            className="w-full justify-center"
                                        >
                                            {plan.cta.label}
                                        </BookDemoButton>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-card-border mb-6" />

                                {/* Features */}
                                <ul className="space-y-3 flex-1">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature.text}
                                            className="flex items-start gap-3"
                                        >
                                            <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                            <span
                                                className="text-sm leading-snug text-text-primary"
                                                style={{ fontFamily: 'var(--font-body)' }}
                                            >
                                                {feature.text}
                                                {feature.detail && (
                                                    <span
                                                        className="ml-1.5 text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded"
                                                        style={{ fontFamily: 'var(--font-mono)' }}
                                                    >
                                                        {feature.detail}
                                                    </span>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Optional advisory note — points to the higher
                                    tier instead of stacking X-marks for missing
                                    features. */}
                                {plan.note && (
                                    <div
                                        className="mt-6 flex items-start gap-2.5 rounded-lg border border-primary/15 bg-primary/4 px-3.5 py-3"
                                        role="note"
                                    >
                                        <Info
                                            className="w-4 h-4 text-primary shrink-0 mt-0.5"
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                        <p
                                            className="text-xs leading-relaxed text-text-secondary"
                                            style={{ fontFamily: 'var(--font-body)' }}
                                        >
                                            {plan.note}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* Compliance qualifier — sits with the plan that advertises
                    Part 11-aligned controls so the customer-responsibility
                    boundary is visible at the point of the claim. */}
                <FadeIn treeNode="tree-pricing" delay={0.25}>
                    <p
                        className="mt-10 max-w-3xl mx-auto text-center text-xs sm:text-[13px] italic text-text-muted leading-relaxed"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        Part 11-aligned controls are product capabilities, not a
                        compliance certification. Validation and regulatory
                        compliance depend on each organization&rsquo;s intended
                        use, configuration, procedures, and quality system.
                    </p>
                </FadeIn>

                {/* Enterprise CTA */}
                <FadeIn treeNode="tree-pricing" delay={0.3}>
                    <div className="text-center mt-12">
                        <p
                            className="text-sm text-text-secondary"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Need a custom enterprise plan?{' '}
                            <a
                                href="#contact"
                                className="text-primary font-semibold hover:text-primary-dark transition-colors"
                            >
                                Contact us
                            </a>
                        </p>
                    </div>
                </FadeIn>
            </Container>
        </section>
    );
}
