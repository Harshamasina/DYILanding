'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { updateTreeNodes, resetTreeNodes } from '@/lib/treeProgress';

interface TreeNodeConfig {
    elementId: string;
    label: string;
    isDark?: boolean;
}

const TREE_NODE_IDS: TreeNodeConfig[] = [
    { elementId: 'tree-features', label: 'Features' },
    { elementId: 'tree-demo', label: 'Live Demo' },
    { elementId: 'tree-import', label: 'Import' },
    { elementId: 'tree-search', label: 'Patent Search' },
    { elementId: 'tree-ai', label: 'Drafting' },
    { elementId: 'tree-compliance', label: 'Compliance' },
    { elementId: 'tree-security', label: 'Security', isDark: true },
    { elementId: 'tree-pricing', label: 'Pricing' },
    { elementId: 'tree-faq', label: 'FAQ' },
    { elementId: 'tree-contact', label: 'Contact' },
    // Final branch — the Enterprise Trust eyebrow inside the Footer's trust
    // card. isDark because the trust card sits on a navy-light surface and
    // uses the lighter indigo color for contrast (matches Security pattern).
    { elementId: 'tree-end', label: 'Enterprise Trust', isDark: true },
];

interface ComputedNode {
    elementId: string;
    top: number;
    label: string;
    isDark: boolean;
}

export function TreeSpine() {
    const pathname = usePathname();
    const isHomepage = pathname === '/';

    const [nodes, setNodes] = useState<ComputedNode[]>([]);
    const [treeStart, setTreeStart] = useState(0);
    const [treeEnd, setTreeEnd] = useState(0);
    const [ready, setReady] = useState(false);

    const rawProgress = useMotionValue(0);
    const progress = useSpring(rawProgress, {
        stiffness: 120,
        damping: 35,
        restDelta: 0.001,
    });

    const [visibleNodes, setVisibleNodes] = useState<boolean[]>([]);
    const [endVisible, setEndVisible] = useState(false);

    const calculatePositions = useCallback(() => {
        // Tree starts from dashboard screenshot bottom
        const dashboardEl = document.getElementById('hero-dashboard');
        if (!dashboardEl) return;

        const dashRect = dashboardEl.getBoundingClientRect();
        const startY = dashRect.bottom + window.scrollY - 40;

        const positions: ComputedNode[] = [];

        TREE_NODE_IDS.forEach((node) => {
            const el = document.getElementById(node.elementId);
            if (el) {
                const rect = el.getBoundingClientRect();
                positions.push({
                    elementId: node.elementId,
                    top: rect.top + window.scrollY - startY,
                    label: node.label,
                    isDark: node.isDark ?? false,
                });
            }
        });

        // End at the Enterprise Trust eyebrow inside the Footer's trust card.
        // The spine extends past the CtaSection and terminates at the vertical
        // center of this element. Fallback to CtaSection center if the element
        // is ever missing (e.g. during hot-reload transitions).
        const endEl = document.getElementById('tree-end');
        let endY = 5000;
        if (endEl) {
            const endRect = endEl.getBoundingClientRect();
            endY = endRect.top + endRect.height / 2 + window.scrollY - startY;
        } else {
            const ctaEl = document.querySelector('#main-content > section:last-child');
            if (ctaEl) {
                const ctaRect = ctaEl.getBoundingClientRect();
                endY = ctaRect.top + ctaRect.height / 2 + window.scrollY - startY;
            }
        }

        setTreeStart(startY);
        setTreeEnd(endY);
        setNodes(positions);
        setVisibleNodes(new Array(positions.length).fill(false));
        setReady(true);
    }, []);

    // Recalculate positions on mount, route change, and resource load
    useEffect(() => {
        if (!isHomepage) {
            // Reset state when navigating away from homepage
            setReady(false);
            setNodes([]);
            rawProgress.set(0);
            resetTreeNodes();
            return;
        }

        function recalc() {
            requestAnimationFrame(calculatePositions);
        }

        // After fonts swap in
        document.fonts.ready.then(recalc);

        // After all resources (images) load — check if already done
        if (document.readyState === 'complete') {
            recalc();
        } else {
            window.addEventListener('load', recalc);
        }

        // Safety: recalculate after hero image has definitely painted
        // and after client-side navigation has rendered the DOM
        const safety1 = setTimeout(recalc, 500);
        const safety2 = setTimeout(recalc, 2000);

        window.addEventListener('resize', calculatePositions);
        return () => {
            window.removeEventListener('load', recalc);
            window.removeEventListener('resize', calculatePositions);
            clearTimeout(safety1);
            clearTimeout(safety2);
        };
    }, [calculatePositions, isHomepage, rawProgress]);

    // Scroll handler
    useEffect(() => {
        if (!ready || treeEnd === 0) return;

        function onScroll() {
            const scrollY = window.scrollY;
            const viewportMid = scrollY + window.innerHeight * 0.5;
            const treeProgress = (viewportMid - treeStart) / treeEnd;
            const clamped = Math.max(0, Math.min(treeProgress, 1));
            rawProgress.set(clamped);

            const drawnLength = clamped * treeEnd;
            const newVisible = nodes.map((node) => drawnLength >= node.top);
            setVisibleNodes(newVisible);
            setEndVisible(clamped > 0.95);

            // Publish to external store so FadeIn can read it
            const updates: Record<string, boolean> = {};
            nodes.forEach((node, i) => {
                updates[node.elementId] = newVisible[i];
            });
            updateTreeNodes(updates);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => window.removeEventListener('scroll', onScroll);
    }, [ready, treeStart, treeEnd, nodes, rawProgress]);

    if (!ready || nodes.length === 0) return null;

    return (
        <div
            className="hidden xl:block absolute pointer-events-none z-10"
            style={{
                top: treeStart,
                left: 'max(16px, calc((100vw - 80rem) / 2 - 72px))',
                height: treeEnd,
                width: 80,
            }}
        >
            {/* Background track — faint guide line */}
            <div
                className="absolute left-1.5 top-0 w-0.5 rounded-full bg-primary/6"
                style={{ height: treeEnd }}
            />

            {/* Animated drawn line — scales from top */}
            <motion.div
                className="absolute left-1 top-0 w-1 rounded-full origin-top"
                style={{
                    height: treeEnd,
                    scaleY: progress,
                    background: 'linear-gradient(to bottom, #6366F1, #818cf8)',
                    boxShadow: '0 0 10px rgba(99, 102, 241, 0.35)',
                }}
            />

            {/* Start dot — connects to dashboard */}
            <motion.div
                className="absolute w-3 h-3 rounded-full bg-primary shadow-md shadow-primary/40"
                style={{ top: -6, left: 0.5 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5, ease: 'backOut' }}
            />

            {/* Node dots + branch lines */}
            {nodes.map((node, i) => (
                <div
                    key={node.label}
                    className="absolute"
                    style={{ top: node.top + 2, left: -1 }}
                >
                    {/* Node dot */}
                    <motion.div
                        className={`w-3.5 h-3.5 rounded-full border-2 shadow-md ${
                            node.isDark
                                ? 'bg-primary-light border-white/20 shadow-primary-light/30'
                                : 'bg-primary border-white shadow-primary/30'
                        }`}
                        initial={{ scale: 0 }}
                        animate={visibleNodes[i] ? { scale: 1 } : { scale: 0 }}
                        transition={{ duration: 0.35, ease: 'backOut' }}
                    />

                    {/* Branch line — extends to connect with heading */}
                    <motion.div
                        className="absolute top-1.5 left-4 h-px origin-left"
                        style={{
                            width: 'calc(2rem + 40px)',
                            backgroundColor: node.isDark ? '#818cf8' : '#6366F1',
                            opacity: node.isDark ? 0.5 : 0.3,
                        }}
                        initial={{ scaleX: 0 }}
                        animate={visibleNodes[i] ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
                    />
                </div>
            ))}

            {/* End dot */}
            <motion.div
                className="absolute w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg shadow-primary/40"
                style={{ top: treeEnd - 8, left: -2 }}
                initial={{ scale: 0 }}
                animate={endVisible ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.4, ease: 'backOut' }}
            />
        </div>
    );
}
