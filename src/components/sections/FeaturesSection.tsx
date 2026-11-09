import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AnimatedFamiliesTable } from '@/components/ui/AnimatedFamiliesTable';
import { AnimatedCalendar } from '@/components/ui/AnimatedCalendar';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { DeferredMount } from '@/components/motion/DeferredMount';
import { FadeIn } from '@/components/motion/FadeIn';
import { SectionMark } from '@/components/ui/SectionMark';
import { ReferenceList, type ReferenceItem } from '@/components/ui/ReferenceList';
import { FigureCaption } from '@/components/ui/FigureCaption';

type MockupType = 'families' | 'calendar';

interface FeatureRow {
    heading: string;
    headingAccent: string;
    features: ReferenceItem[];
    mockup: MockupType;
    caption: string;
    mockupSide: 'left' | 'right';
    ctaLabel: string;
    ctaHref: string;
}

const FEATURE_ROWS: FeatureRow[] = [
    {
        mockupSide: 'right',
        mockup: 'families',
        caption: 'Patent family docket',
        heading: 'See Every Patent Family, From Provisional to National Phase',
        headingAccent: '',
        ctaLabel: 'View patent docketing features',
        ctaHref: '/docketing/',
        features: [
            {
                title: 'Patent Docketing',
                description:
                    'Track every application, deadline, status, and jurisdiction across PRV, PCT, NPE, and national phase cases in one audit-first docket.',
            },
            {
                title: 'Family Management',
                description:
                    'See how provisionals, PCTs, continuations, and national phases connect in one visual family tree.',
            },
            {
                title: 'Branded PDF Reports',
                description:
                    'Turn the live docket into a client-ready PDF with your branding, stamped with a report ID and SHA-256 checksum verifiable against the audit log.',
            },
            {
                title: 'Loss of Exclusivity Timeline',
                description:
                    'Link drug products to their patent wall and regulatory floor, and see the combined protection horizon with a live what-if for annuity decisions.',
            },
        ],
    },
    {
        mockupSide: 'left',
        mockup: 'calendar',
        caption: 'Deadline calendar',
        heading: 'Surface Every Patent Deadline Before It Becomes Urgent',
        headingAccent: '',
        ctaLabel: 'View deadline and fee tracking',
        ctaHref: '/docketing/',
        features: [
            {
                title: 'Computed Deadlines',
                description:
                    'Supported PCT and U.S. office-action deadlines are calculated from recorded case events under versioned, cited rules, and every date shows its work.',
            },
            {
                title: 'Office Action Tracking',
                description:
                    'Track response deadlines with urgency color coding: green for on track, amber for due soon, red for overdue.',
            },
            {
                title: 'Fee Management',
                description:
                    'Multi-currency annuity and patent fee tracking with grace periods and date-accurate FX rollups across the whole portfolio.',
            },
            {
                title: 'Proactive Digests and Calendar Feeds',
                description:
                    'Risk-sorted daily deadline digests, a weekly stale-alert hygiene report, and private read-only feeds for Outlook, Google, and Apple Calendar.',
            },
        ],
    },
];

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
            <ReferenceList items={row.features} baseDelay={index * 0.15} />
            <FadeIn delay={index * 0.15 + row.features.length * 0.08}>
                <div className="mt-6 pl-15">
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
            <div className="flex flex-col items-center justify-center h-full">
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
                <FigureCaption className="mt-5">{row.caption}</FigureCaption>
            </div>
        </FadeIn>
    );

    const isMockupRight = row.mockupSide === 'right';

    return (
        <div className="figure-group">
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
                <SectionMark id="tree-features" className="mb-6">
                    Features
                </SectionMark>
                <FadeIn treeNode="tree-features">
                    <div className="max-w-2xl mb-16 lg:mb-20">
                        <h2
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Everything Your Patent Team Needs,{' '}
                            <span className="italic">
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
