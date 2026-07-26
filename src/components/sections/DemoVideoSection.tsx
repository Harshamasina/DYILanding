import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { DemoVideoJsonLd } from '@/components/seo/DemoVideoJsonLd';
import { DemoVideoShowcase } from '@/components/ui/DemoVideoShowcase';

/**
 * Inline product-demo section. Sits between Features and the per-pillar
 * deep-dives (Import / Search / AI Drafting): Features tells, this section
 * shows all three pillars working together, then each section drills in.
 *
 * The video itself only loads when a trigger opens the shared modal, so this
 * section ships a poster and chapter list (cheap markup) plus VideoObject
 * JSON-LD, keeping it within the page's performance budget.
 */
export function DemoVideoSection() {
    return (
        <section
            id="demo-video"
            aria-label="Product demo"
            className="relative overflow-hidden py-24 lg:py-32 bg-page-bg"
        >
            {/* Subtle background pattern, matches ImportSection */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                }}
            />

            <DemoVideoJsonLd />

            <Container className="relative">
                {/* Section heading — tree branch anchor */}
                <div id="tree-demo" className="flex items-center gap-3 mb-6">
                    <span
                        className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Live Demo
                    </span>
                </div>

                <FadeIn treeNode="tree-demo">
                    <div className="max-w-3xl mb-12 lg:mb-16">
                        <h2
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            From Prior Art Search to{' '}
                            <span className="text-primary">Docketed Filing</span>
                        </h2>
                        <p
                            className="mt-4 text-lg text-text-secondary leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            See docketing, prior art search, and AI drafting run end
                            to end in one connected, audit-trailed workspace.
                            Recorded with synthetic demo data.
                        </p>
                    </div>
                </FadeIn>

                <DemoVideoShowcase />
            </Container>
        </section>
    );
}
