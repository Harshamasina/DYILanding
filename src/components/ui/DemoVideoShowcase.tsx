'use client';

import {
    Play,
    Search,
    FileText,
    FolderClock,
    ArrowRight,
} from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { WatchDemoLauncher } from '@/components/ui/WatchDemoModal';

interface Chapter {
    icon: React.ElementType;
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
        icon: FolderClock,
        title: 'Patent Docketing',
        description:
            'Track every filing, fee, and deadline on one audited timeline.',
        start: 34,
        time: '00:34',
    },
    {
        icon: Search,
        title: 'Prior Art Search',
        description:
            'Search 100+ jurisdictions and save references to a patent family.',
        start: 56,
        time: '00:56',
    },
    {
        icon: FileText,
        title: 'AI Drafting',
        description:
            'Turn selected prior art into a jurisdiction-compliant first draft.',
        start: 72,
        time: '01:12',
    },
];

export function DemoVideoShowcase() {
    return (
        <WatchDemoLauncher>
            {(open) => (
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* ── Left: chapter list (text) ── */}
                    <FadeIn treeNode="tree-demo" delay={0.1}>
                        <div>
                            <p
                                className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                What is inside the demo
                            </p>

                            <ul className="mt-4 flex flex-col gap-2">
                                {CHAPTERS.map((chapter, i) => (
                                    <li key={chapter.title}>
                                        <button
                                            type="button"
                                            onClick={() => open(chapter.start)}
                                            className="group w-full text-left flex gap-4 items-start rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-card-border hover:bg-card-bg hover:shadow-md hover:shadow-black/3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                        >
                                            {/* Icon tile, swaps to a play glyph on hover */}
                                            <span className="relative shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-lg border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(99,102,241,0.08)]">
                                                <chapter.icon className="w-5 h-5 text-primary transition-opacity duration-200 group-hover:opacity-0" />
                                                <Play className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 text-primary fill-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                            </span>
                                            <span className="flex-1 min-w-0">
                                                <span className="flex items-center justify-between gap-3">
                                                    <span
                                                        className="text-[15px] font-semibold text-text-primary leading-snug"
                                                        style={{ fontFamily: 'var(--font-display)' }}
                                                    >
                                                        <span className="text-text-muted">{`0${i + 1} `}</span>
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
                            </ul>

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
                                    variant="outline"
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
                                    {/* Placeholder frame. Swap /video_placeholder.jpg
                                        for a captured frame of the real demo when
                                        it lands. */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-0"
                                        style={{
                                            backgroundImage:
                                                'url(/video_placeholder.jpg)',
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
                                        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-card-border px-2.5 py-0.5 text-xs text-text-muted tabular-nums shadow-sm"
                                        style={{ fontFamily: 'var(--font-mono)' }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        02:24
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
