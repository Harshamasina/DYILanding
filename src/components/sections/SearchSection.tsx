import { Globe, Search, FileText, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { AnimatedPriorArtSearch } from '@/components/ui/AnimatedPriorArtSearch';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { SEARCH_APP_URL, PATENT_SEARCH_PAGE_URL } from '@/lib/constants';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Patent Search section.

   Narrative: "This is the patent search built into our platform. Try it
   free, no signup. Want more detail? View more." The mockup depicts the
   in-platform search (its chrome reads app.designyourinvention.com), so
   it is labelled "Inside the platform" to stay honest — the free public
   tool reached via "Get Free Access" is a separate, free-to-try surface,
   not the in-app experience with save-to-family and audit trail.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const CAPABILITY_POINTS: { icon: React.ElementType; title: string; description: string }[] = [
    {
        icon: Globe,
        title: '100+ Jurisdictions',
        description: 'Search the global patent corpus from a single search bar, no tool switching.',
    },
    {
        icon: Search,
        title: 'Six Search Modes',
        description: 'Keyword, inventor, applicant, IPC, CPC, and patent number, with edge cases handled for you.',
    },
    {
        icon: FileText,
        title: 'Full Patent Detail',
        description: 'Bibliographic data, abstracts, claims, citations, and patent family on every result.',
    },
];

export function SearchSection() {
    return (
        <section
            id="patent-search"
            aria-label="Patent Search"
            className="relative overflow-hidden py-24 lg:py-32"
        >
            <Container>
                {/* ── Section Heading ── */}
                <div id="tree-search" className="flex items-center gap-3 mb-6">
                    <span
                        className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Patent Search
                    </span>
                </div>
                <FadeIn treeNode="tree-search">
                    <div className="max-w-3xl mb-12 lg:mb-16">
                        <h2
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            The Same Patent Search That{' '}
                            <span className="italic">Powers Our Platform</span>
                        </h2>
                        <p
                            className="mt-4 text-lg text-text-secondary leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Search across 100+ jurisdictions by keyword, inventor, applicant, or
                            patent number, with full bibliographic detail, claims, and patent
                            family. Get free access to our patent search tool, no signup required.
                        </p>
                    </div>
                </FadeIn>

                {/* ── Mockup (left) + Copy (right) ── */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <FadeIn delay={0.1}>
                        <MockupHalo>
                            <AnimatedPriorArtSearch />
                        </MockupHalo>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <div>
                            {/* Honesty label: the mockup is the in-app search
                                (its chrome reads app.designyourinvention.com),
                                not the free public tool the CTA opens. */}
                            <span
                                className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Inside the platform
                            </span>
                            <h3
                                className="mt-4 text-2xl font-bold text-text-primary sm:text-3xl"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                Search Prior Art the Way Your Team Works
                            </h3>
                            <p
                                className="mt-3 text-text-secondary leading-relaxed"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                The patent search inside Design Your Invention is wired into the
                                same workflow as your portfolio. Try the search for yourself, free
                                and without an account.
                            </p>

                            <ul className="mt-6 flex flex-col gap-4">
                                {CAPABILITY_POINTS.map((point) => (
                                    <li key={point.title} className="flex gap-3 items-start">
                                        <div className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 mt-0.5">
                                            <point.icon className="w-4.5 h-4.5 text-primary" />
                                        </div>
                                        <div>
                                            <p
                                                className="text-[15px] font-semibold text-text-primary leading-snug"
                                                style={{ fontFamily: 'var(--font-display)' }}
                                            >
                                                {point.title}
                                            </p>
                                            <p
                                                className="mt-0.5 text-[13px] leading-relaxed text-text-secondary"
                                                style={{ fontFamily: 'var(--font-body)' }}
                                            >
                                                {point.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <Button
                                    href={SEARCH_APP_URL}
                                    newTab
                                    size="md"
                                    className="justify-center"
                                >
                                    Get Free Access
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                                <Button
                                    href={PATENT_SEARCH_PAGE_URL}
                                    variant="secondary"
                                    size="md"
                                    className="justify-center"
                                >
                                    View More
                                </Button>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </Container>
        </section>
    );
}
