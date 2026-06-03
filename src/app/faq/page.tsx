import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { HeroAmbience } from '@/components/ui/HeroAmbience';
import { FadeIn } from '@/components/motion/FadeIn';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { FaqPageJsonLd } from '@/components/seo/FaqPageJsonLd';
import { FAQ_ITEMS } from '@/lib/faq-data';

export const metadata: Metadata = buildMetadata({
    title: 'IP Management Software FAQ',
    description:
        'Answers to common questions about Design Your Invention: what it is, who it is for, supported jurisdictions, prior art search, AI patent drafting, FDA 21 CFR Part 11 compliance, and security.',
    path: '/faq/',
});

export default function FaqPage() {
    return (
        <main id="main-content" className="min-w-0 overflow-x-hidden">
            {/* ── 1. Hero ── */}
            <section className="relative overflow-hidden bg-page-bg-alt pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">
                <HeroAmbience edge="bottom" />
                <Container className="relative z-10">
                    <nav aria-label="Breadcrumb" className="mb-8 lg:mb-10">
                        <ol
                            className="flex items-center gap-2 text-sm text-text-muted"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            <li>
                                <Link href="/" className="transition-colors hover:text-primary">
                                    Home
                                </Link>
                            </li>
                            <li aria-hidden="true">/</li>
                            <li className="font-medium text-text-primary">FAQ</li>
                        </ol>
                    </nav>

                    <div className="max-w-3xl">
                        <span
                            className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                            style={{ fontFamily: 'var(--font-mono)' }}
                        >
                            Frequently Asked Questions
                        </span>
                        <h1
                            className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-[3.5rem]"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            IP Management Software,{' '}
                            <span className="text-primary italic">Answered</span>
                        </h1>
                        <p
                            className="mt-5 text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            What Design Your Invention is, who it is for, the jurisdictions it covers, and how
                            it handles prior art search, AI-assisted patent drafting, FDA 21 CFR Part 11
                            compliance, and security. If your question is not here, book a demo and ask.
                        </p>
                    </div>
                </Container>
            </section>

            {/* ── 2. FAQ list ── */}
            {/* Paired with the hero's edge="bottom" ambience: edge="top" here
                completes the half-circles across the boundary, and the shared
                bg-page-bg-alt removes the seam. */}
            <section className="relative overflow-hidden bg-page-bg-alt py-20 sm:py-24 lg:py-28">
                <HeroAmbience edge="top" />
                <Container className="relative z-10">
                    <FadeIn>
                        <FaqAccordion items={FAQ_ITEMS} />
                    </FadeIn>
                </Container>
            </section>

            {/* ── 3. Final CTA ── */}
            <section className="bg-page-bg-alt py-16 sm:py-20 lg:py-24">
                <Container>
                    <div className="mx-auto max-w-2xl text-center">
                        <h2
                            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Still Have Questions?
                        </h2>
                        <p
                            className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Book a walkthrough on a sample portfolio, or compare Design Your Invention to the
                            legacy IP tools your team already knows.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                            <BookDemoButton size="lg" className="w-full justify-center sm:w-auto">
                                Book a Demo
                                <ArrowRight className="h-5 w-5" />
                            </BookDemoButton>
                            <Button href="/compare/" variant="secondary" size="lg" className="w-full justify-center sm:w-auto">
                                Compare vs Legacy IPMS
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>

            <FaqPageJsonLd />
        </main>
    );
}
