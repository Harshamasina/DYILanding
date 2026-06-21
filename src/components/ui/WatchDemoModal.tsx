'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Loader2,
    RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface WatchDemoButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    children?: React.ReactNode;
    /** Optional start offset in seconds. When set, the modal seeks here and
        attempts to autoplay (falling back to the play overlay if the browser
        blocks programmatic playback), so chapter links can deep-link into the
        demo. */
    startTime?: number;
}

const VIDEO_SRC = '/dyi_film.mp4';
/** Shown by the <video> element until the first frame decodes, so the initial
    load shows the branded placeholder instead of a black well. */
const POSTER_SRC = '/video_placeholder.jpg';

/**
 * Headless launcher that owns the modal open state, the body portal, and the
 * single VideoModal instance. Exposes `open(startTime?)` to arbitrary trigger
 * content via a render prop, so buttons, chapter links, the inline poster, and
 * the sticky pill can all reuse ONE modal/player rather than each mounting
 * their own (one video element on the page, loaded only when opened).
 */
export function WatchDemoLauncher({
    children,
}: {
    children: (open: (startTime?: number) => void) => React.ReactNode;
}) {
    const [state, setState] = useState<{ open: boolean; startTime?: number }>({
        open: false,
    });
    const [mounted, setMounted] = useState(false);

    // Hydration guard — document.body is not available during SSR.
    useEffect(() => setMounted(true), []);

    const open = useCallback(
        (startTime?: number) => setState({ open: true, startTime }),
        [],
    );

    return (
        <>
            {children(open)}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {state.open && (
                            <VideoModal
                                startTime={state.startTime}
                                onClose={() => setState({ open: false })}
                            />
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
}

export function WatchDemoButton({
    variant = 'secondary',
    size = 'md',
    className = '',
    children,
    startTime,
}: WatchDemoButtonProps) {
    return (
        <WatchDemoLauncher>
            {(open) => (
                <Button
                    variant={variant}
                    size={size}
                    className={className}
                    onClick={() => open(startTime)}
                >
                    {children || (
                        <>
                            <Play className="w-5 h-5" />
                            Watch Demo
                        </>
                    )}
                </Button>
            )}
        </WatchDemoLauncher>
    );
}

/* ─── Helpers ─── */

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

/* ─── Video Modal ─── */

type VideoState = 'idle' | 'loading' | 'ready' | 'playing' | 'buffering' | 'ended' | 'error';

function VideoModal({
    onClose,
    startTime,
}: {
    onClose: () => void;
    startTime?: number;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const controlsTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
    // Guards the one-shot autoplay attempt for chapter deep-links.
    const autoStartedRef = useRef(false);

    const [videoState, setVideoState] = useState<VideoState>('idle');
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);

    const isPlaying = videoState === 'playing' || videoState === 'buffering';
    const showSpinner = videoState === 'loading' || videoState === 'buffering';
    const showPlayOverlay = videoState === 'idle' || videoState === 'ready' || videoState === 'ended';

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Close on Escape, Space to play/pause
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === ' ') {
                e.preventDefault();
                togglePlay();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onClose],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Fullscreen change listener
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    // Auto-hide controls
    const resetControlsTimer = useCallback(() => {
        setShowControls(true);
        if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
        if (isPlaying) {
            controlsTimerRef.current = setTimeout(
                () => setShowControls(false),
                3000,
            );
        }
    }, [isPlaying]);

    function togglePlay() {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            setVideoState('loading');
            video.play().catch(() => {
                setVideoState('error');
            });
        } else {
            video.pause();
        }
    }

    function toggleMute() {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    }

    function toggleFullscreen() {
        const video = videoRef.current;
        if (!video) return;
        if (!document.fullscreenElement) {
            video.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    function handleTimeUpdate() {
        const video = videoRef.current;
        if (!video) return;
        setCurrentTime(video.currentTime);
        if (video.buffered.length > 0) {
            setBuffered(video.buffered.end(video.buffered.length - 1));
        }
    }

    function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
        const video = videoRef.current;
        const bar = progressRef.current;
        if (!video || !bar) return;
        const rect = bar.getBoundingClientRect();
        const ratio = Math.max(
            0,
            Math.min(1, (e.clientX - rect.left) / rect.width),
        );
        video.currentTime = ratio * video.duration;
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const bufferProgress = duration > 0 ? (buffered / duration) * 100 : 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
            {/* Frosted light backdrop */}
            <motion.div
                className="absolute inset-0 bg-white/40 backdrop-blur-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                        background:
                            'radial-gradient(ellipse at 50% 35%, rgba(99,102,241,0.12) 0%, transparent 65%)',
                    }}
                />
            </motion.div>

            {/* Modal */}
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Product demo video"
                className="relative w-full max-w-[min(94vw,146vh)]"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{
                    duration: 0.3,
                    ease: [0.21, 0.47, 0.32, 0.98],
                }}
            >
                {/* Glass player card */}
                <div
                    className="rounded-3xl border border-white/60 bg-white/70 p-2.5 sm:p-3 shadow-2xl shadow-primary/20 ring-1 ring-black/5 backdrop-blur-2xl"
                    data-video-container
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-1.5 py-2 sm:px-2">
                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={togglePlay}
                                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                                className="group flex items-center justify-center w-8 h-8 rounded-lg border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(99,102,241,0.08)] transition-all duration-200 hover:border-indigo-200/80 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_8px_rgba(99,102,241,0.18)] active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {isPlaying ? (
                                        <motion.span
                                            key="pause"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Pause className="w-3.5 h-3.5 fill-primary text-primary" />
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="play"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Play className="w-3.5 h-3.5 ml-0.5 fill-primary text-primary" />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                            <div className="flex flex-col leading-tight">
                                <span
                                    className="text-sm font-semibold text-text-primary"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    Product Demo
                                </span>
                                <span
                                    className="text-[11px] text-text-muted"
                                    style={{ fontFamily: 'var(--font-mono)' }}
                                >
                                    designyourinvention.com
                                </span>
                            </div>
                        </div>
                        <motion.button
                            type="button"
                            onClick={onClose}
                            className="flex items-center justify-center w-9 h-9 rounded-full border border-card-border bg-white/70 text-text-secondary transition-colors hover:bg-white hover:text-text-primary hover:border-primary/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            aria-label="Close video"
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                            <X className="w-4 h-4" />
                        </motion.button>
                    </div>

                    {/* Video well */}
                    <div
                        className="relative mt-1 overflow-hidden rounded-2xl bg-navy cursor-pointer group ring-1 ring-black/5"
                        onMouseMove={resetControlsTimer}
                        onMouseLeave={() => isPlaying && setShowControls(false)}
                    >
                        {/* 16:9 aspect ratio */}
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full object-cover"
                                src={VIDEO_SRC}
                                poster={POSTER_SRC}
                                preload="auto"
                                playsInline
                                aria-label="Design Your Invention product demo"
                                onClick={togglePlay}
                                onCanPlay={() => {
                                    const video = videoRef.current;
                                    // Auto-play as soon as the video is ready:
                                    // opening the modal is already a deliberate
                                    // "watch" click, so the user should not have
                                    // to press play a second time. Any chapter
                                    // seek was already applied in
                                    // onLoadedMetadata. Falls back to the play
                                    // overlay (ready) if the browser blocks
                                    // programmatic playback.
                                    if (!autoStartedRef.current && video) {
                                        autoStartedRef.current = true;
                                        setVideoState('loading');
                                        video
                                            .play()
                                            .then(() => setVideoState('playing'))
                                            .catch(() => setVideoState('ready'));
                                        return;
                                    }
                                    if (videoState === 'loading' || videoState === 'buffering') {
                                        setVideoState('playing');
                                    } else if (videoState === 'idle') {
                                        setVideoState('ready');
                                    }
                                }}
                                onPlaying={() => setVideoState('playing')}
                                onPause={() => {
                                    if (videoState !== 'buffering') {
                                        setVideoState('ready');
                                    }
                                }}
                                onWaiting={() => setVideoState('buffering')}
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={() => {
                                    const video = videoRef.current;
                                    if (!video) return;
                                    setDuration(video.duration);
                                    // Clamp chapter deep-link offsets so a
                                    // timestamp beyond the (placeholder) video's
                                    // length never seeks past the end.
                                    if (startTime != null && startTime > 0) {
                                        video.currentTime = Math.min(
                                            startTime,
                                            Math.max(0, video.duration - 0.1),
                                        );
                                    }
                                }}
                                onEnded={() => {
                                    setVideoState('ended');
                                    setShowControls(true);
                                }}
                                onError={() => setVideoState('error')}
                            />
                        </div>

                        {/* Loading / Buffering spinner */}
                        <AnimatePresence>
                            {showSpinner && (
                                <motion.div
                                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                    <span
                                        className="text-sm text-white/60"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {videoState === 'buffering' ? 'Buffering...' : 'Loading video...'}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Play / Replay overlay */}
                        <AnimatePresence>
                            {showPlayOverlay && (
                                videoState === 'ended' ? (
                                    <motion.div
                                        key="ended"
                                        className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-navy/55 backdrop-blur-[2px]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <button
                                            type="button"
                                            onClick={togglePlay}
                                            aria-label="Replay video"
                                            className="group flex flex-col items-center gap-3 cursor-pointer focus:outline-none"
                                        >
                                            <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white/10 ring-2 ring-white/50 backdrop-blur-sm transition-all duration-200 group-hover:bg-white/20 group-hover:scale-105 group-hover:ring-white/80">
                                                <RotateCcw
                                                    className="w-8 h-8 text-white transition-transform duration-300 group-hover:-rotate-90"
                                                    strokeWidth={2.5}
                                                />
                                            </span>
                                            <span
                                                className="text-sm font-semibold text-white"
                                                style={{ fontFamily: 'var(--font-body)' }}
                                            >
                                                Watch again
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                            style={{ fontFamily: 'var(--font-body)' }}
                                        >
                                            <X className="w-4 h-4" />
                                            Close player
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="play"
                                        type="button"
                                        className="group absolute inset-0 flex items-center justify-center cursor-pointer"
                                        onClick={togglePlay}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        aria-label="Play video"
                                    >
                                        <span className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/90 ring-4 ring-white/20 shadow-xl shadow-primary/40 backdrop-blur-sm transition-all duration-200 group-hover:bg-primary group-hover:scale-105">
                                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                                        </span>
                                    </motion.button>
                                )
                            )}
                        </AnimatePresence>

                        {/* Error state */}
                        {videoState === 'error' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                <p
                                    className="text-sm text-white/70"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    Video failed to load. Please check your connection and try again.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const video = videoRef.current;
                                        if (!video) return;
                                        setVideoState('idle');
                                        video.load();
                                    }}
                                    className="text-sm text-primary hover:text-primary-light transition-colors cursor-pointer font-semibold"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Controls bar */}
                        <div
                            className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
                                showControls && !showPlayOverlay
                                    ? 'opacity-100'
                                    : 'opacity-0 pointer-events-none'
                            }`}
                        >
                            {/* Gradient fade */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                            <div className="relative px-4 pb-3 pt-8">
                                {/* Progress bar */}
                                <div
                                    ref={progressRef}
                                    className="group/progress relative w-full h-1.5 rounded-full bg-white/20 cursor-pointer mb-3 overflow-hidden hover:h-2.5 transition-all duration-150"
                                    onClick={handleProgressClick}
                                    role="slider"
                                    aria-label="Video progress"
                                    aria-valuenow={Math.round(progress)}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    tabIndex={0}
                                >
                                    {/* Buffer */}
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full bg-white/20"
                                        style={{ width: `${bufferProgress}%` }}
                                    />
                                    {/* Progress */}
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full bg-primary"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                {/* Control buttons row */}
                                <div className="relative z-10 flex items-center gap-3">
                                    {/* Play/Pause */}
                                    <button
                                        type="button"
                                        onClick={togglePlay}
                                        className="text-white hover:text-primary transition-colors cursor-pointer"
                                        aria-label={isPlaying ? 'Pause' : 'Play'}
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-5 h-5 fill-current" />
                                        ) : (
                                            <Play className="w-5 h-5 fill-current" />
                                        )}
                                    </button>

                                    {/* Volume */}
                                    <button
                                        type="button"
                                        onClick={toggleMute}
                                        className="text-white hover:text-primary transition-colors cursor-pointer"
                                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                                    >
                                        {isMuted ? (
                                            <VolumeX className="w-5 h-5" />
                                        ) : (
                                            <Volume2 className="w-5 h-5" />
                                        )}
                                    </button>

                                    {/* Timestamp */}
                                    <span
                                        className="text-xs text-white/70 tabular-nums"
                                        style={{ fontFamily: 'var(--font-mono)' }}
                                    >
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>

                                    <div className="flex-1" />

                                    {/* Fullscreen */}
                                    <button
                                        type="button"
                                        onClick={toggleFullscreen}
                                        className="text-white hover:text-primary transition-colors cursor-pointer"
                                        aria-label={
                                            isFullscreen
                                                ? 'Exit fullscreen'
                                                : 'Fullscreen'
                                        }
                                    >
                                        {isFullscreen ? (
                                            <Minimize className="w-5 h-5" />
                                        ) : (
                                            <Maximize className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
