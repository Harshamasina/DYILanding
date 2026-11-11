import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { AnimatedAuditTable } from '@/components/ui/AnimatedAuditTable';
import { DeferredMount } from '@/components/motion/DeferredMount';
import { SectionMark } from '@/components/ui/SectionMark';
import { ReferenceList, type ReferenceItem } from '@/components/ui/ReferenceList';

const COMPLIANCE_ITEMS: ReferenceItem[] = [
    {
        title: 'Reason-for-Change on Every Edit',
        description:
            'Critical field edits require a documented reason before saving. No silent changes.',
    },
    {
        title: 'Full Audit Trail',
        description:
            'Every change logged: who, what, when, and the before/after diff.',
    },
    {
        title: 'Electronic Signatures',
        description:
            'Re-authentication prompt before approval actions and high-risk operations.',
    },
    {
        title: 'Append-Only Audit Records',
        description:
            'Audit history is append-only. The application exposes no edit or delete path, so records stay read-only.',
    },
    {
        title: 'Role-Based Access Control',
        description:
            'Admin, Attorney, Paralegal, Viewer, Inventor: granular permissions enforced server-side.',
    },
    {
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
            {/* Amber aurora: this is the site's compliance section, and amber
                is the compliance accent (globals.css). Warm hues read stronger
                than indigo, so watch the alpha if this is tuned. Two
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
                            'radial-gradient(ellipse at center, rgba(217,119,6,0.24) 0%, rgba(245,158,11,0.12) 35%, transparent 65%)',
                        filter: 'blur(60px)',
                    }}
                />
                {/* Desktop — anchors the right column behind the mockup */}
                <div
                    className="hidden lg:block absolute top-1/2 -right-[8%] -translate-y-1/2 lg:h-160 lg:w-220"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, rgba(217,119,6,0.24) 0%, rgba(245,158,11,0.12) 35%, transparent 65%)',
                        filter: 'blur(60px)',
                    }}
                />
            </div>
            <Container className="relative">
                {/* Section Heading */}
                <SectionMark id="tree-compliance" tone="compliance" className="mb-6">
                    Compliance
                </SectionMark>
                <FadeIn treeNode="tree-compliance">
                    <div className="max-w-2xl mb-12 lg:mb-16">
                        <h2
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            FDA 21 CFR Part 11‑Aligned Controls,{' '}
                            <span className="accent-amend">Built In, Not Bolted On</span>
                        </h2>
                        <p
                            className="mt-4 max-w-[40rem] text-lg text-text-secondary leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Every regulated workflow is built around traceability, approval control, and immutable records. Capture reasons for change, preserve audit history, require review checkpoints, and keep every edit tied to a user, timestamp, and record.
                        </p>
                    </div>
                </FadeIn>

                {/* Alternating layout: items left, audit table right */}
                <div className="figure-group">
                    {/* Desktop */}
                    <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Compliance items */}
                        <ReferenceList items={COMPLIANCE_ITEMS} tone="compliance" treeNode="tree-compliance" />

                        {/* Right: Animated Audit Table */}
                        <FadeIn treeNode="tree-compliance" delay={0.1}>
                            <DeferredMount className="relative w-full h-120 sm:h-135 lg:h-150">
                                <AnimatedAuditTable />
                                {/* 602 the Reason column, 604 the Timestamp column, 608 the
                                    log itself, 610 the Actor column. Rows expand and move,
                                    so the numerals point at the fixed header. */}
                            </DeferredMount>
                        </FadeIn>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden space-y-8">
                        <ReferenceList items={COMPLIANCE_ITEMS} tone="compliance" />
                        <FadeIn delay={0.2}>
                            <DeferredMount className="w-full h-120 sm:h-135 lg:h-150">
                                <AnimatedAuditTable />
                            </DeferredMount>
                        </FadeIn>
                    </div>
                </div>

            </Container>
        </section>
    );
}
