import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { SectionMark } from '@/components/ui/SectionMark';

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
    /** CTA label and routing: links go through next/link, demos open the
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
            { text: 'Provisional, PCT & national-phase modules' },
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
            { text: 'Office action analysis & response', detail: 'USPTO' },
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
            <Container className="relative">
                {/* Section Heading */}
                <SectionMark id="tree-pricing" className="mb-6">
                    Plans
                </SectionMark>
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

                {/* Plans set out like a fee schedule: a heavy top rule, the
                    plans side by side under a hairline divider, and each
                    plan's features as ruled rows with any note on the right. */}
                <div className="mx-auto grid max-w-5xl grid-cols-1 border-t-2 border-b border-t-text-primary border-b-card-border lg:grid-cols-2">
                    {PLANS.map((plan, i) => (
                        <FadeIn
                            key={plan.name}
                            treeNode="tree-pricing"
                            delay={i * 0.15}
                            className={`h-full ${i > 0 ? 'border-t border-card-border lg:border-t-0 lg:border-l' : ''}`}
                        >
                            <article
                                className={`flex h-full flex-col py-8 sm:py-10 ${
                                    plan.recommended
                                        ? 'bg-primary/[0.03] px-5 sm:px-8 lg:px-10'
                                        : 'sm:px-2 lg:pr-10 lg:pl-0'
                                }`}
                            >
                                {/* Plan header */}
                                <div className="mb-6">
                                    {plan.recommended ? (
                                        <span className="mb-4 inline-block rounded-[3px] border border-primary/30 bg-primary/[0.04] px-2 pt-1 pb-0.5 text-[15px] leading-none tracking-[0.1em] text-primary [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                                            For Regulated Teams
                                        </span>
                                    ) : (
                                        <span aria-hidden="true" className="mb-4 hidden h-[21px] lg:block" />
                                    )}
                                    <h3 className="text-2xl font-bold text-text-primary [font-family:var(--font-display)]">
                                        {plan.name}
                                    </h3>
                                    <p className="mt-3 text-2xl font-semibold text-primary [font-family:var(--font-display)]">
                                        {plan.price}
                                    </p>
                                    <p className="mt-1 text-xs text-text-muted [font-family:var(--font-body)]">
                                        {plan.priceNote}
                                    </p>
                                    <p className="mt-4 text-sm text-text-secondary [font-family:var(--font-body)]">
                                        <span className="font-semibold text-text-primary">
                                            Best for:
                                        </span>{' '}
                                        {plan.target}
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                        {plan.description}
                                    </p>
                                </div>

                                {/* CTA: link for self-serve, modal for demo */}
                                <div className="mb-8">
                                    {plan.cta.href ? (
                                        <Button
                                            href={plan.cta.href}
                                            variant={plan.recommended ? 'primary' : 'secondary'}
                                            className="w-full justify-center sm:w-auto"
                                        >
                                            {plan.cta.label}
                                        </Button>
                                    ) : (
                                        <BookDemoButton
                                            topic={plan.name}
                                            variant={plan.recommended ? 'primary' : 'secondary'}
                                            className="w-full justify-center sm:w-auto"
                                        >
                                            {plan.cta.label}
                                        </BookDemoButton>
                                    )}
                                </div>

                                {/* Features as ruled rows */}
                                <div className="flex-1">
                                    <div aria-hidden="true" className="flex items-baseline justify-between gap-4 border-b border-text-primary pb-2 text-[15px] leading-none tracking-[0.1em] text-navy-light [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                                        <span>Feature</span>
                                        <span>Notes</span>
                                    </div>
                                    <ul>
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature.text}
                                                className="flex items-baseline justify-between gap-4 border-b border-card-border py-2.5"
                                            >
                                                <span className="text-sm leading-snug text-text-primary [font-family:var(--font-body)]">
                                                    {feature.text}
                                                </span>
                                                {feature.detail && (
                                                    <span
                                                        className={`shrink-0 text-[15px] leading-none tracking-[0.06em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps] ${
                                                            feature.detail.includes('Part 11') ? 'text-compliance-ink' : 'text-primary'
                                                        }`}
                                                    >
                                                        {feature.detail}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Optional advisory note: points to the higher
                                    tier instead of stacking X-marks for missing
                                    features. */}
                                {plan.note && (
                                    <p
                                        role="note"
                                        className="mt-6 border-l-2 border-primary/30 pl-3 text-xs italic leading-relaxed text-text-secondary [font-family:var(--font-body)]"
                                    >
                                        {plan.note}
                                    </p>
                                )}
                            </article>
                        </FadeIn>
                    ))}
                </div>

                {/* Compliance qualifier: sits with the plan that advertises
                    Part 11-aligned controls so the customer-responsibility
                    boundary is visible at the point of the claim. */}
                <FadeIn treeNode="tree-pricing" delay={0.25}>
                    <p
                        className="mt-10 max-w-[31rem] mx-auto text-center text-xs sm:text-[13px] italic text-text-muted leading-relaxed"
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
                                className="-my-3 inline-block py-3 font-semibold text-primary underline decoration-primary/30 underline-offset-[6px] transition-colors hover:decoration-primary"
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
