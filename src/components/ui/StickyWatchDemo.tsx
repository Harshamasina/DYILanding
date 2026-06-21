'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { WatchDemoLauncher } from '@/components/ui/WatchDemoModal';

/**
 * Floating "Watch demo" launcher, shown on every page (mounted in the root
 * layout). Desktop only: `hidden lg:flex` keeps it off mobile, where a floating
 * button would cover scarce screen space and overlap CTAs.
 *
 * Collapsed it is a rounded-square play button; on hover it expands to reveal
 * the "Watch demo" label.
 *
 * Visibility keys off scroll PROGRESS through the page (not an absolute
 * viewport offset), so it behaves the same on a short legal page and a long
 * marketing page: it appears once you are a little way into the content and
 * hides as you approach the footer. On the homepage it additionally hides while
 * the inline demo section is on screen, so it never doubles up.
 */
export function StickyWatchDemo() {
    const pathname = usePathname();
    const [inBand, setInBand] = useState(false);
    const [overDemo, setOverDemo] = useState(false);
    const reduce = useReducedMotion();

    useEffect(() => {
        // Re-evaluate for the freshly navigated page (it starts at the top).
        setInBand(false);
        setOverDemo(false);

        function update() {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const scrollable = docHeight - window.innerHeight;
            const progress = scrollable > 0 ? scrollY / scrollable : 0;
            // Shown through the middle band: after the first stretch of
            // content, hidden again as the footer approaches.
            setInBand(progress > 0.12 && progress < 0.9);
        }
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);

        // Homepage only: suppress while the inline demo section is on screen.
        const demo = document.getElementById('demo-video');
        const observer = demo
            ? new IntersectionObserver(
                  ([entry]) => setOverDemo(entry.isIntersecting),
                  { threshold: 0 },
              )
            : null;
        if (demo && observer) observer.observe(demo);

        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
            observer?.disconnect();
        };
    }, [pathname]);

    const visible = inBand && !overDemo;

    return (
        <WatchDemoLauncher>
            {(open) => (
                <AnimatePresence>
                    {visible && (
                        <motion.button
                            type="button"
                            onClick={() => open()}
                            aria-label="Watch the product demo"
                            className="group hidden lg:flex fixed bottom-6 left-6 z-40 h-14 items-center overflow-hidden rounded-2xl border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 pr-0 shadow-lg shadow-primary/20 backdrop-blur-sm transition-[padding,box-shadow] duration-300 cursor-pointer hover:pr-5 hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            initial={
                                reduce
                                    ? { opacity: 0 }
                                    : { opacity: 0, y: 16, scale: 0.9 }
                            }
                            animate={
                                reduce
                                    ? { opacity: 1 }
                                    : { opacity: 1, y: 0, scale: 1 }
                            }
                            exit={
                                reduce
                                    ? { opacity: 0 }
                                    : { opacity: 0, y: 16, scale: 0.9 }
                            }
                            transition={{
                                duration: 0.25,
                                ease: [0.21, 0.47, 0.32, 0.98],
                            }}
                            whileHover={reduce ? undefined : { y: -2 }}
                            whileTap={reduce ? undefined : { scale: 0.96 }}
                        >
                            {/* Icon — always visible, holds the collapsed square */}
                            <span className="flex shrink-0 items-center justify-center w-14 h-14">
                                <Play className="w-6 h-6 text-primary fill-primary transition-transform duration-200 group-hover:scale-110" />
                            </span>
                            {/* Label — expands in on hover */}
                            <span
                                className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:max-w-35 group-hover:opacity-100"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Watch demo
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>
            )}
        </WatchDemoLauncher>
    );
}
