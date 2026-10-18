'use client';

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';
import { motion, useInView } from 'framer-motion';
import { Pause, Play, RotateCcw } from 'lucide-react';

function subscribeMotion(callback: () => void) {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    media.addEventListener('change', callback);
    return () => media.removeEventListener('change', callback);
}
function subscribeVisibility(callback: () => void) {
    document.addEventListener('visibilitychange', callback);
    return () => document.removeEventListener('visibilitychange', callback);
}
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDocumentVisible = () => document.visibilityState === 'visible';
/* The server renders the animated first frame, which is what most visitors
   keep after hydration. Reduced-motion visitors switch to the static preview. */
const serverMotion = () => false;
const serverVisibility = () => false;

const TICK_MS = 100;

/** One elapsed clock preserves the selected frame across pauses and visibility changes. */
export function useOfficeActionPlayback(ref: RefObject<HTMLElement | null>, duration: number, staticAt: number) {
    const inView = useInView(ref, { amount: 0.2 });
    const reducedMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, serverMotion);
    const visible = useSyncExternalStore(subscribeVisibility, isDocumentVisible, serverVisibility);
    const [position, setPosition] = useState<number | null>(null);
    const [paused, setPaused] = useState(false);
    const elapsed = position ?? (reducedMotion ? staticAt : 0);
    const finished = elapsed >= duration;
    const running = inView && visible && !paused && !reducedMotion && !finished;

    useEffect(() => {
        if (!running) return;
        let previous = performance.now();
        const timer = window.setInterval(() => {
            const now = performance.now();
            const delta = now - previous;
            previous = now;
            setPosition(value => Math.min(duration, (value ?? 0) + delta));
        }, TICK_MS);
        return () => window.clearInterval(timer);
    }, [running, duration]);

    return {
        elapsed, duration, reducedMotion, paused, finished, running,
        select: (at: number) => { setPosition(at); setPaused(true); },
        toggle: () => setPaused(value => !value),
        replay: () => { setPosition(reducedMotion ? staticAt : 0); setPaused(false); },
    };
}

export interface OfficeActionChapter {
    label: string;
    at: number;
    previewAt?: number;
    summary: string;
}

/* Each stage button carries its own progress track, so the walkthrough reads
   as a sequence of steps rather than one long bar. Summaries share a single
   grid cell sized to the longest one, so changing stages never shifts layout. */
export function OfficeActionPlaybackControls({ playback, chapters, screenId }: {
    playback: ReturnType<typeof useOfficeActionPlayback>;
    chapters: readonly OfficeActionChapter[];
    screenId: string;
}) {
    const active = chapters.reduce((index, chapter, i) => playback.elapsed >= chapter.at ? i : index, 0);
    const progressFor = (i: number) => {
        const start = chapters[i].at;
        const end = chapters[i + 1]?.at ?? playback.duration;
        return Math.min(1, Math.max(0, (playback.elapsed - start) / (end - start)));
    };
    /* Ticks arrive every 100ms; a matching linear tween keeps the track continuous. */
    const trackTransition = playback.running ? { duration: TICK_MS / 1000, ease: 'linear' as const } : { duration: 0.3, ease: 'easeOut' as const };

    return (
        <figcaption className="mt-4 rounded-xl border border-card-border bg-white/95 p-3 shadow-sm backdrop-blur-sm sm:p-4 [font-family:var(--font-dashboard)]">
            <div role="group" aria-label="Walkthrough stages" className={`grid gap-1 ${chapters.length > 4 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-2 sm:grid-cols-4'}`}>
                {chapters.map((chapter, i) => {
                    const current = i === active;
                    return (
                        <button
                            key={chapter.label}
                            type="button"
                            aria-controls={screenId}
                            aria-current={current ? 'step' : undefined}
                            onClick={() => playback.select(chapter.previewAt ?? chapter.at)}
                            className={`group flex min-h-11 flex-col justify-between gap-2 rounded-lg px-2 pt-2 pb-1.5 text-left text-xs font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-2.5 ${current ? 'bg-primary/[0.07] text-primary' : 'text-text-secondary hover:bg-page-bg-alt hover:text-text-primary'}`}
                        >
                            <span className="flex items-baseline gap-1.5">
                                <span className={`text-[10px] tabular-nums [font-family:var(--font-dashboard-mono)] ${current ? 'text-primary/80' : 'text-text-secondary'}`}>{String(i + 1).padStart(2, '0')}</span>
                                <span className="truncate">{chapter.label}</span>
                            </span>
                            <span aria-hidden="true" className="block h-0.5 w-full overflow-hidden rounded-full bg-card-border">
                                <motion.span
                                    className="block h-full w-full origin-left rounded-full bg-primary"
                                    initial={false}
                                    animate={{ scaleX: progressFor(i) }}
                                    transition={playback.reducedMotion ? { duration: 0 } : trackTransition}
                                />
                            </span>
                        </button>
                    );
                })}
            </div>
            <div className="mt-3 grid">
                {chapters.map((chapter, i) => (
                    <p
                        key={chapter.label}
                        aria-hidden={i !== active}
                        className={`[grid-area:1/1] text-sm leading-relaxed text-text-secondary transition-opacity duration-300 motion-reduce:transition-none ${i === active ? 'opacity-100' : 'invisible opacity-0'}`}
                    >
                        {chapter.summary}
                    </p>
                ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-card-border pt-2">
                <span className="text-xs text-text-secondary">{playback.reducedMotion ? 'Static preview · Select any stage' : 'Illustrative walkthrough · Fictional matter'}</span>
                <div className="flex items-center gap-1">
                    {!playback.reducedMotion && !playback.finished && (
                        <button type="button" onClick={playback.toggle} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-text-primary transition-colors hover:bg-page-bg-alt focus-visible:outline-2 focus-visible:outline-primary">
                            {playback.paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
                            {playback.paused ? 'Play walkthrough' : 'Pause walkthrough'}
                        </button>
                    )}
                    <button type="button" onClick={playback.replay} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary">
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        {playback.reducedMotion ? 'Reset preview' : 'Replay'}
                    </button>
                </div>
            </div>
        </figcaption>
    );
}
