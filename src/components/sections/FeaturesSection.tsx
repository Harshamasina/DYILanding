import {
    FileText,
    GitBranch,
    FileCheck,
    Hourglass,
    ScrollText,
    AlertCircle,
    BellRing,
    DollarSign,
    ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AnimatedFamiliesTable } from '@/components/ui/AnimatedFamiliesTable';
import { AnimatedCalendar } from '@/components/ui/AnimatedCalendar';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { DeferredMount } from '@/components/motion/DeferredMount';
import { FadeIn } from '@/components/motion/FadeIn';

interface Feature {
    icon: React.ElementType;
    title: string;
    description: string;
}

type MockupType = 'families' | 'calendar';

interface FeatureRow {
    heading: string;
    headingAccent: string;
    features: Feature[];
    mockup: MockupType;
    mockupSide: 'left' | 'right';
    ctaLabel: string;
    ctaHref: string;
}

const FEATURE_ROWS: FeatureRow[] = [
    {
        mockupSide: 'right',
        mockup: 'families',
        heading: 'See Every Patent Family, From Provisional to National Phase',
        headingAccent: '',
        ctaLabel: 'View patent docketing features',
        ctaHref: '/docketing/',
        features: [
            {
                icon: FileText,
                title: 'Patent Docketing',
                description:
                    'Track every application, deadline, status, and jurisdiction across PRV, PCT, NPE, and national phase cases in one audit-first docket.',
            },
            {
                icon: GitBranch,
                title: 'Family Management',
                description:
                    'See how provisionals, PCTs, continuations, and national phases connect in one visual family tree.',
            },
            {
                icon: FileCheck,
                title: 'Branded PDF Reports',
                description:
                    'Turn the live docket into a client-ready PDF with your branding, stamped with a report ID and SHA-256 checksum verifiable against the audit log.',
            },
            {
                icon: Hourglass,
                title: 'Loss of Exclusivity Timeline',
                description:
                    'Link drug products to their patent wall and regulatory floor, and see the combined protection horizon with a live what-if for annuity decisions.',
            },
        ],
    },
    {
        mockupSide: 'left',
        mockup: 'calendar',
        heading: 'Surface Every Patent Deadline Before It Becomes Urgent',
        headingAccent: '',
        ctaLabel: 'View deadline and fee tracking',
        ctaHref: '/docketing/',
        features: [
            {
                icon: ScrollText,
                title: 'Computed Deadlines',
                description:
                    'Supported PCT and U.S. office-action deadlines are calculated from recorded case events under versioned, cited rules, and every date shows its work.',
            },
            {
                icon: AlertCircle,
                title: 'Office Action Tracking',
                description:
                    'Track response deadlines with urgency color coding: green for on track, amber for due soon, red for overdue.',
            },
            {
                icon: DollarSign,
                title: 'Fee Management',
                description:
                    'Multi-currency annuity and patent fee tracking with grace periods and date-accurate FX rollups across the whole portfolio.',
            },
            {
                icon: BellRing,
                title: 'Proactive Digests and Calendar Feeds',
                description:
                    'Risk-sorted daily deadline digests, a weekly stale-alert hygiene report, and private read-only feeds for Outlook, Google, and Apple Calendar.',
            },
        ],
    },
];

function FeatureCard({ icon: Icon, title, description }: Feature) {
    return (
        <article className="group flex gap-4 items-start p-5 rounded-xl border border-transparent transition-all duration-200 hover:border-card-border hover:bg-card-bg hover:shadow-md hover:shadow-black/[0.03]">
            <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(99,102,241,0.08)] mt-0.5">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
                <h3
                    className="text-[15px] font-semibold text-text-primary leading-snug"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {title}
                </h3>
                <p
                    className="mt-1.5 text-[13px] leading-relaxed text-text-secondary"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {description}
                </p>
            </div>
        </article>
    );
}

function FeatureRowBlock({ row, index }: { row: FeatureRow; index: number }) {
    const heading = (
        <FadeIn delay={index * 0.15}>
            <h3
                className="text-2xl font-bold text-text-primary sm:text-3xl mb-4 lg:mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {row.heading}
            </h3>
        </FadeIn>
    );

    const cardsColumn = (
        <div className="flex flex-col h-full">
            {heading}
            <div className="flex flex-col gap-1">
                {row.features.map((feature, i) => (
                    <FadeIn key={feature.title} delay={index * 0.15 + i * 0.08}>
                        <FeatureCard {...feature} />
                    </FadeIn>
                ))}
            </div>
            <FadeIn delay={index * 0.15 + row.features.length * 0.08}>
                <div className="mt-6 pl-5">
                    <Button
                        href={row.ctaHref}
                        variant="outline"
                        size="sm"
                        className="group/cta"
                    >
                        {row.ctaLabel}
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                    </Button>
                </div>
            </FadeIn>
        </div>
    );

    const mockup = (
        <FadeIn delay={index * 0.15 + 0.1} className="h-full">
            <div className="flex items-center justify-center h-full">
                <DeferredMount
                    className={
                        row.mockup === 'families'
                            ? 'w-full h-[440px] sm:h-[480px] lg:h-[520px]'
                            : 'w-full h-[520px] sm:h-[540px] lg:h-[560px]'
                    }
                >
                    <MockupHalo>
                        {row.mockup === 'families' ? <AnimatedFamiliesTable /> : <AnimatedCalendar />}
                    </MockupHalo>
                </DeferredMount>
            </div>
        </FadeIn>
    );

    const isMockupRight = row.mockupSide === 'right';

    return (
        <div>
            {/* Desktop layout - items-stretch so the mockup column matches
                the (heading + cards) height on the other side. */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-stretch">
                {isMockupRight ? (
                    <>
                        {cardsColumn}
                        {mockup}
                    </>
                ) : (
                    <>
                        {mockup}
                        {cardsColumn}
                    </>
                )}
            </div>
            {/* Mobile layout - heading + cards, then mockup */}
            <div className="lg:hidden space-y-8">
                {cardsColumn}
                {mockup}
            </div>
        </div>
    );
}

export function FeaturesSection() {
    return (
        <section
            id="features"
            className="relative overflow-hidden py-24 lg:py-32"
        >
            <Container>
                {/* Section Heading */}
                <div id="tree-features" className="flex items-center gap-3 mb-6">
                    <span
                        className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Features
                    </span>
                </div>
                <FadeIn treeNode="tree-features">
                    <div className="max-w-2xl mb-16 lg:mb-20">
                        <h2
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Everything Your Patent Team Needs,{' '}
                            <span className="text-primary">
                                From Filing to Grant
                            </span>
                        </h2>
                        <p
                            className="mt-4 text-lg text-text-secondary leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Design Your Invention covers the full patent lifecycle:
                            docketing, application family management, PCT/PRV/NPE case
                            management, fee and deadline tracking, prior art search, and
                            AI-assisted drafting. Patent attorneys, IP managers, and
                            pharma teams run their entire patent portfolio in one place,
                            from filing to grant.
                        </p>
                    </div>
                </FadeIn>

                {/* Alternating Feature Rows */}
                <div className="space-y-20 lg:space-y-28">
                    {FEATURE_ROWS.map((row, i) => (
                        <FeatureRowBlock key={i} row={row} index={i} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
