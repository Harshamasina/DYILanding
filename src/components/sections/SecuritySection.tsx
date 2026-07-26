import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { SecurityMoatDiagram } from '@/components/ui/SecurityMoatDiagram';

export function SecuritySection() {
    return (
        <section id="security" className="py-24 lg:py-32 bg-navy">
            <Container>
                {/* Section Heading */}
                <div id="tree-security" className="flex items-center gap-3 mb-6">
                    <span
                        className="text-xs font-bold uppercase tracking-[0.15em] text-primary-light"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Security
                    </span>
                </div>
                <FadeIn treeNode="tree-security">
                    <div className="max-w-2xl mb-12 lg:mb-16">
                        <h2
                            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Six Layers of{' '}
                            <span className="text-primary-light">
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
