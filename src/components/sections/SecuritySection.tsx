import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { SecurityMoatDiagram } from '@/components/ui/SecurityMoatDiagram';
import { SectionMark } from '@/components/ui/SectionMark';

export function SecuritySection() {
    return (
        <section id="security" className="py-24 lg:py-32 bg-navy">
            <Container>
                {/* Section Heading */}
                <SectionMark id="tree-security" tone="compliance" dark className="mb-6">
                    Security
                </SectionMark>
                <FadeIn treeNode="tree-security">
                    <div className="max-w-2xl mb-12 lg:mb-16">
                        <h2
                            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Six Layers of{' '}
                            <span className="italic">
                                Compliance-Native Defense
                            </span>
                        </h2>
                        <p
                            className="mt-4 text-lg text-text-on-dark/60 leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Every patent record, draft, fee event, and audit log
                            is protected through layered controls, from
                            confidential AI processing to tenant-scoped queries
                            and enforced row-level security.
                        </p>
                    </div>
                </FadeIn>

                {/* Interactive moat diagram: cube + 6 cards, side by side at xl+ */}
                <FadeIn treeNode="tree-security" delay={0.15}>
                    <SecurityMoatDiagram />
                </FadeIn>
            </Container>
        </section>
    );
}
