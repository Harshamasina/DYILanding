'use client';

import { Play, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { WatchDemoLauncher } from '@/components/ui/WatchDemoModal';

interface Chapter {
    title: string;
    description: string;
    /** Start offset into the demo (/dyi_film.mp4), in seconds. Offsets past the
        video length are clamped safely by VideoModal. */
    start: number;
    /** Human-readable marker shown beside the chapter title. */
    time: string;
}

const CHAPTERS: Chapter[] = [
    {
        title: 'Patent Docketing',
        description:
            'Track every filing, fee, and deadline on one audit-trailed timeline.',
        start: 28,
        time: '00:28',
    },
    {
        title: 'Prior Art Search',
        description:
            'Search 100+ jurisdictions and save references to a patent family.',
        start: 50,
        time: '00:50',
    },
    {
        title: 'AI Drafting',
        description:
            'Turn selected prior art into a structured first draft for attorney review.',
        start: 68,
        time: '01:08',
    },
    {
        title: 'Office Actions',
        description:
            'Map every USPTO rejection to your claims, sign the analysis, and have the response approved by an attorney who did not last revise it.',
        start: 99,
        time: '01:39',
    },
];

export function DemoVideoShowcase() {
    return (
        <WatchDemoLauncher>
            {(open) => (
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: chapter list (text) */}
                    <FadeIn treeNode="tree-demo" delay={0.1}>
                        <div>
                            <p className="text-base leading-none tracking-[0.04em] text-navy-light [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                                What is inside the demo
                            </p>

                            {/* Chapters read like a table of contents: the
                                number swaps to a play glyph on hover. */}
                            <ol className="mt-4 flex flex-col">
                                {CHAPTERS.map((chapter, i) => (
                                    <li key={chapter.title} className="border-t border-card-border first:border-t-0">
                                        <button
                                            type="button"
                                            onClick={() => open(chapter.start)}
                                            className="group grid w-full grid-cols-[3rem_1fr] gap-x-3 rounded-md px-2 py-3.5 text-left transition-colors duration-200 hover:bg-card-bg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                        >
                                            <span className="relative text-base font-semibold leading-snug tabular-nums text-primary [font-family:var(--font-display)]">
                                                <span className="transition-opacity duration-200 group-hover:opacity-0">{`0${i + 1}`}</span>
                                                <Play aria-hidden="true" className="absolute left-0 top-1 w-4 h-4 text-primary fill-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="flex items-center justify-between gap-3">
                                                    <span
                                                        className="text-[15px] font-semibold text-text-primary leading-snug"
                                                        style={{ fontFamily: 'var(--font-display)' }}
                                                    >
                                                        {chapter.title}
                                                    </span>
                                                    <span
                                                        className="shrink-0 text-xs text-text-muted tabular-nums"
                                                        style={{ fontFamily: 'var(--font-mono)' }}
                                                    >
                                                        {chapter.time}
                                                    </span>
                                                </span>
                                                <span
                                                    className="mt-0.5 block text-[13px] leading-relaxed text-text-secondary"
                                                    style={{ fontFamily: 'var(--font-body)' }}
                                                >
                                                    {chapter.description}
                                                </span>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ol>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="primary"
                                    size="md"
                                    className="justify-center"
                                    onClick={() => open()}
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    Watch Full Demo
                                </Button>
                                <BookDemoButton
                                    variant="link"
                                    size="md"
                                    className="justify-center"
                                >
                                    Book a Product Demo
                                    <ArrowRight className="w-4 h-4" />
                                </BookDemoButton>
                            </div>
                        </div>
                    </FadeIn>

                    {/* ── Right: clickable poster (video). Light, section-themed
                        surface. Pure markup, no video loads until the modal
                        opens. ── */}
                    <FadeIn treeNode="tree-demo" delay={0.2}>
                        <MockupHalo>
                            <button
                                type="button"
                                onClick={() => open()}
                                aria-label="Play the product demo"
                                className="group relative block w-full rounded-2xl overflow-hidden border border-card-border bg-page-bg-alt shadow-lg shadow-primary/5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                                {/* 16:9 poster body */}
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    {/* Poster: the film's title card (/thumb-film.jpg),
                                        the same image the player shows while the
                                        video loads. */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-0"
                                        style={{
                                            backgroundImage:
                                                'url(/thumb-film.jpg)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                    {/* Indigo wash so the placeholder recedes and
                                        the play button stays the focal point. */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-0"
                                        style={{
                                            background:
                                                'linear-gradient(180deg, rgba(79,70,229,0.08) 0%, rgba(67,56,202,0.16) 100%)',
                                        }}
                                    />

                                    {/* Play button — outlined by default, fills
                                        solid with a scale + pulsing ring on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="relative flex items-center justify-center w-18 h-18 rounded-full border-2 border-primary bg-transparent transition-all duration-300 group-hover:border-transparent group-hover:bg-primary group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/40">
                                            {/* Pulsing ring on hover */}
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-0 rounded-full bg-primary/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping"
                                            />
                                            <Play className="relative w-7 h-7 text-primary fill-primary ml-1 transition-colors duration-300 group-hover:text-white group-hover:fill-white" />
                                        </span>
                                    </div>

                                    {/* Duration badge */}
                                    <span
                                        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white border border-card-border px-2.5 py-0.5 text-xs text-text-secondary tabular-nums shadow-sm"
                                        style={{ fontFamily: 'var(--font-mono)' }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        02:35
                                    </span>
                                </div>
                            </button>
                        </MockupHalo>
                    </FadeIn>
                </div>
            )}
        </WatchDemoLauncher>
    );
}
