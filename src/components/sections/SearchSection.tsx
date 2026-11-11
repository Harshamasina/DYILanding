import { FileSearch, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { AnimatedPriorArtSearch } from '@/components/ui/AnimatedPriorArtSearch';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { DeferredMount } from '@/components/motion/DeferredMount';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { SEARCH_APP_URL, PATENT_SEARCH_PAGE_URL } from '@/lib/constants';
import { SectionMark } from '@/components/ui/SectionMark';
import { ReferenceList, type ReferenceItem } from '@/components/ui/ReferenceList';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Patent Search section.

   Narrative: "This is the patent search built into our platform. Try it
   free, no signup. Want more detail? View more." The mockup depicts the
   in-platform search (its chrome reads app.designyourinvention.com), so
   its figure caption says "inside the platform" to stay honest: the free public
   tool reached via "Get Free Access" is a separate, free-to-try surface,
   not the in-app experience with save-to-family and audit trail.
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const CAPABILITY_POINTS: ReferenceItem[] = [
    {
        title: '100+ Jurisdictions',
        description: 'Search the global patent corpus from a single search bar, no tool switching.',
    },
    {
        title: 'Six Search Modes',
        description: 'Keyword, inventor, applicant, IPC, CPC, and patent number, with edge cases handled for you.',
    },
    {
        title: 'Full Patent Detail',
        description: 'Bibliographic data, abstracts, claims, citations, and patent family where the source provides them.',
    },
    {
        title: 'Automated Novelty Search',
        description: 'Inside the platform, start from your invention brief: the strongest candidates are read against each feature, with a checked quote behind every finding.',
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
                <SectionMark id="tree-search" className="mb-6">
                    Patent Search
                </SectionMark>
                <FadeIn treeNode="tree-search">
                    <div className="max-w-3xl mb-12 lg:mb-16">
                        <h2
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Free Patent Search, Connected to{' '}
                            <span className="accent-amend">Your Patent Families</span>
                        </h2>
                        <p
                            className="mt-4 max-w-[40rem] text-lg text-text-secondary leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Search across 100+ patent authorities by keyword, inventor, applicant,
                            or patent number, with bibliographic detail, claims, and patent family
                            where the source provides them. Get free access to our public patent
                            search tool, no signup required.
                        </p>
                    </div>
                </FadeIn>

                {/* ── Mockup (left) + Copy (right) ── */}
                <div className="figure-group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <FadeIn delay={0.1}>
                        <DeferredMount className="relative w-full h-[440px] sm:h-[480px] lg:h-[520px]">
                            <MockupHalo>
                                <AnimatedPriorArtSearch />
                            </MockupHalo>
                            {/* 302 the search bar, 304 the search mode menu, 306 the result list. */}
                        </DeferredMount>
                        {/* Honesty label: the mockup is the in-app search
                            (its chrome reads app.designyourinvention.com),
                            not the free public tool the CTA opens. */}
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <div>
                            <h3
                                className="text-2xl font-bold text-text-primary sm:text-3xl"
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

                            <ReferenceList items={CAPABILITY_POINTS} titleAs="p" className="mt-4" />

                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <Button
                                    href={SEARCH_APP_URL}
                                    newTab
                                    size="md"
                                    className="justify-center"
                                >
                                    <FileSearch className="w-4 h-4" />
                                    Try Patent Search Free
                                </Button>
                                <Button
                                    href={PATENT_SEARCH_PAGE_URL}
                                    variant="link"
                                    size="md"
                                    className="justify-center"
                                >
                                    Explore Patent Search
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Button>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </Container>
        </section>
    );
}
