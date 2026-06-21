import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { WatchDemoButton } from '@/components/ui/WatchDemoModal';
import { HeroTreeVisual } from '@/components/ui/HeroTreeVisual';
import { HeroAmbience } from '@/components/ui/HeroAmbience';
import { AnimatedDashboard } from '@/components/ui/AnimatedDashboard';
import { FileSearch, Play } from 'lucide-react';
import { SEARCH_APP_URL } from '@/lib/constants';

export function HeroSection() {
    return (
        <>
            {/* Hero — natural flow on mobile, min-viewport-height on desktop.
                min-h-screen (not h-screen) so short viewports can GROW the
                section to fit content instead of overflowing above the
                padding into the fixed navbar. */}
            <section
                id="hero"
                aria-label="Hero"
                className="relative flex flex-col pt-24 sm:pt-28 pb-10 sm:pb-12 lg:min-h-screen lg:justify-center lg:pt-28 lg:pb-24 xl:pt-32 xl:pb-28 overflow-hidden"
            >
                <HeroAmbience edge="bottom" />
                <Container className="relative z-10">
                    <div className="flex items-start lg:items-stretch gap-8 lg:gap-16 xl:gap-28">
                        {/* Text Content — left. On lg+ the column stretches to
                            the tree visual's height and centers its content
                            vertically so the heading and CTA block sit balanced
                            against the tree visual. */}
                        <div className="w-full lg:max-w-[52%] xl:max-w-[44%] lg:shrink-0 flex flex-col lg:justify-center">
                            <div>
                                <h1
                                    className="text-[2.25rem] font-bold leading-[1.12] tracking-tight text-text-primary sm:text-[2.75rem] md:text-5xl lg:text-[3.5rem] xl:text-[4rem]"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    Patent Operations That Replace Your{' '}
                                    <span className="text-primary italic">
                                        Spreadsheets, Scattered Searches, and Drafting Tools
                                    </span>
                                </h1>
                                <p
                                    className="mt-4 text-[15px] leading-relaxed text-text-secondary sm:mt-5 sm:text-base sm:max-w-2xl"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    Patent docketing, prior art search, and AI-powered drafting
                                    in one audited platform, built for law firms and IP
                                    teams. Manage PCT/PRV/NPE cases, track fees and deadlines,
                                    and maintain FDA 21 CFR Part 11 compliance.
                                </p>
                            </div>
                            <div>
                                {/* CTA row. Buttons ease down a step at xl: that is
                                    the only breakpoint where the tree's left-side
                                    annotation overlays render (hidden xl:flex) and
                                    bleed out of the tree column toward this row. The
                                    slightly smaller xl size plus the wider xl column
                                    gap keep the two clear of each other. */}
                                <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center">
                                    <Button href={SEARCH_APP_URL} newTab size="lg" className="w-full justify-center whitespace-nowrap sm:w-auto xl:px-6 xl:py-3 xl:text-base">
                                        <FileSearch className="w-5 h-5" />
                                        Try Patent Search Free
                                    </Button>
                                    <BookDemoButton variant="outline" size="lg" className="w-full justify-center whitespace-nowrap sm:w-auto xl:px-6 xl:py-3 xl:text-base">
                                        Book a Product Demo
                                    </BookDemoButton>
                                </div>
                            </div>
                        </div>

                        {/* Family Tree Visual — right, hidden below lg */}
                        <div className="hidden lg:flex flex-1 min-w-0 items-center justify-center">
                            <div className="w-full max-w-105">
                                <HeroTreeVisual />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Animated Dashboard — below the fold, appears on scroll.
                No MockupHalo wrap: the dashboard spans the container's
                full width on lg+, so the halo would extend past the
                viewport and get clipped by overflow-hidden, breaking
                the effect. The dashboard is already a strong focal
                point with its own shadow and 2:1 aspect.

                relative + overflow-hidden host the matching top-corner
                HeroAmbience quarter-circles, which combine with the
                hero's bottom-corner pair into full half-circles
                straddling the section boundary. */}
            <section
                id="hero-dashboard"
                className="relative overflow-hidden py-10 sm:py-14 lg:py-16"
            >
                <HeroAmbience edge="top" />
                <Container className="relative z-10">
                    <AnimatedDashboard />
                    {/* Demo video CTA, centered beneath the dashboard mockup. */}
                    <div className="mt-8 flex justify-center">
                        <WatchDemoButton size="md" className="whitespace-nowrap">
                            <Play className="w-4 h-4 fill-current" />
                            Watch 2 Min Demo
                        </WatchDemoButton>
                    </div>
                </Container>
            </section>
        </>
    );
}
