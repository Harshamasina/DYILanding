import {
    FileWarning,
    ScrollText,
    KeyRound,
    ShieldCheck,
    Users,
    FolderLock,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { AnimatedAuditTable } from '@/components/ui/AnimatedAuditTable';
import { DeferredMount } from '@/components/motion/DeferredMount';

const COMPLIANCE_ITEMS = [
    {
        icon: FileWarning,
        title: 'Reason-for-Change on Every Edit',
        description:
            'Critical field edits require a documented reason before saving. No silent changes.',
    },
    {
        icon: ScrollText,
        title: 'Full Audit Trail',
        description:
            'Every change logged: who, what, when, and the before/after diff.',
    },
    {
        icon: KeyRound,
        title: 'Electronic Signatures',
        description:
            'Re-authentication prompt before approval actions and high-risk operations.',
    },
    {
        icon: ShieldCheck,
        title: 'Append-Only Audit Records',
        description:
            'Audit history is append-only. The application exposes no edit or delete path, so records stay read-only.',
    },
    {
        icon: Users,
        title: 'Role-Based Access Control',
        description:
            'Admin, Attorney, Paralegal, Viewer: granular permissions enforced server-side.',
    },
    {
        icon: FolderLock,
        title: 'Secure Document Management',
        description:
            'Version-controlled uploads with presigned downloads and full delete audit trail.',
    },
];


export function ComplianceSection() {
    return (
        <section
            id="compliance"
            className="relative overflow-hidden py-24 lg:py-32 bg-page-bg-alt"
        >
            {/* Pure indigo aurora — same palette as hero/CTA. Two
                positions because the layout stacks on mobile vs side-by-
                side on desktop:
                  - Mobile/tablet: centered horizontally, positioned in
                    the lower portion of the section where the audit
                    mockup stacks below the items list.
                  - Desktop (lg+): mirrored to the right edge so it sits
                    behind the mockup column, clear of the items text
                    on the left. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                {/* Mobile / tablet — follows stacked mockup down the page */}
                <div
                    className="lg:hidden absolute top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/2 h-110 w-150 sm:h-130 sm:w-180"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, rgba(99,102,241,0.20) 0%, rgba(129,140,248,0.10) 35%, transparent 65%)',
                        filter: 'blur(60px)',
                    }}
                />
                {/* Desktop — anchors the right column behind the mockup */}
                <div
                    className="hidden lg:block absolute top-1/2 -right-[8%] -translate-y-1/2 lg:h-160 lg:w-220"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, rgba(99,102,241,0.20) 0%, rgba(129,140,248,0.10) 35%, transparent 65%)',
                        filter: 'blur(60px)',
                    }}
                />
            </div>
            <Container className="relative">
                {/* Section Heading */}
                <div id="tree-compliance" className="flex items-center gap-3 mb-6">
                    <span
                        className="text-xs font-bold uppercase tracking-[0.15em] text-compliance"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Compliance
                    </span>
                </div>
                <FadeIn treeNode="tree-compliance">
                    <div className="max-w-2xl mb-12 lg:mb-16">
                        <h2
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            FDA 21 CFR Part 11-Aligned Controls,{' '}
                            <span className="italic">Built In, Not Bolted On</span>
                        </h2>
                        <p
                            className="mt-4 text-lg text-text-secondary leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Every regulated workflow is built around traceability, approval control, and immutable records. Capture reasons for change, preserve audit history, require review checkpoints, and keep every edit tied to a user, timestamp, and record.
                        </p>
                    </div>
                </FadeIn>

                {/* Alternating layout: items left, audit table right */}
                <div>
                    {/* Desktop */}
                    <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Compliance items */}
                        <div className="flex flex-col gap-1">
                            {COMPLIANCE_ITEMS.map((item, i) => (
                                <FadeIn key={item.title} treeNode="tree-compliance" delay={i * 0.08}>
                                    <ComplianceCard {...item} />
                                </FadeIn>
                            ))}
                        </div>

                        {/* Right: Animated Audit Table */}
                        <FadeIn treeNode="tree-compliance" delay={0.1}>
                            <DeferredMount className="w-full h-120 sm:h-135 lg:h-150">
                                <AnimatedAuditTable />
                            </DeferredMount>
                        </FadeIn>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden space-y-8">
                        <div className="flex flex-col gap-1">
                            {COMPLIANCE_ITEMS.map((item, i) => (
                                <FadeIn key={item.title} delay={i * 0.08}>
                                    <ComplianceCard {...item} />
                                </FadeIn>
                            ))}
                        </div>
                        <FadeIn delay={0.2}>
                            <DeferredMount className="w-full h-120 sm:h-135 lg:h-150">
                                <AnimatedAuditTable />
                            </DeferredMount>
                        </FadeIn>
                    </div>
                </div>

                {/* Trust disclaimer — signals regulatory maturity to pharma buyers
                    without overpromising compliance certification. */}
                <FadeIn treeNode="tree-compliance" delay={0.3}>
                    <p
                        className="mt-12 lg:mt-16 max-w-3xl mx-auto text-center text-xs sm:text-[13px] italic text-text-muted leading-relaxed"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        Designed to support Part 11-aligned workflows through access controls, electronic approvals, reasons for change, and traceable audit history. Final compliance and validation depend on each customer&rsquo;s intended use, configuration, procedures, and quality system.
                    </p>
                </FadeIn>
            </Container>
        </section>
    );
}

function ComplianceCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
    return (
        <article className="group flex gap-4 items-start p-4 rounded-xl border border-transparent transition-all duration-200 hover:border-card-border hover:bg-card-bg hover:shadow-md hover:shadow-black/3">
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
                    className="mt-1 text-[13px] leading-relaxed text-text-secondary"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {description}
                </p>
            </div>
        </article>
    );
}
