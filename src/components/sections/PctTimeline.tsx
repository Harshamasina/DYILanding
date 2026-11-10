'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TimelineNode {
    month: string;
    title: string;
    description: string;
    position: 'top' | 'bottom';
    optional?: boolean;
}

const TIMELINE_NODES: TimelineNode[] = [
    {
        month: '0',
        title: 'File Local Priority Application',
        description: 'Month 0 (if any)',
        position: 'top',
    },
    {
        month: '0–12',
        title: 'File PCT Application',
        description: 'Month 0–12',
        position: 'top',
    },
    {
        month: '12–16',
        title: 'ISR + Written Opinion (ISR/WO)',
        description: 'Month 12–16',
        position: 'bottom',
    },
    {
        month: '~2 mo',
        title: 'File Claim Amendments (Article 19)',
        description: '~2 months from ISR',
        position: 'top',
        optional: true,
    },
    {
        month: '18',
        title: 'Publication of PCT Application',
        description: 'Month 18',
        position: 'bottom',
    },
    {
        month: '22',
        title: 'Chapter II Demand + Article 34 Amendments',
        description: 'Month 22',
        position: 'top',
        optional: true,
    },
    {
        month: '28',
        title: 'IPRP (Chapter II) / SISR',
        description: 'Around Month 28',
        position: 'bottom',
    },
    {
        month: '30–34',
        title: 'National / Regional Phase Entry (NPE)',
        description: 'Month 20–34 (typically ~30)',
        position: 'top',
    },
];

function CardContent({ node }: { node: TimelineNode }) {
    return (
        <div
            className={`rounded-lg p-3.5 text-center w-full ${
                node.optional
                    ? 'bg-white border border-dashed border-text-muted/30'
                    : 'bg-white border border-card-border shadow-sm'
            }`}
        >
            <p
                className="text-[11px] font-semibold text-text-primary leading-snug"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {node.title}
            </p>
            <p
                className="text-[10px] text-text-muted mt-1"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                {node.description}
            </p>
            {node.optional && (
                <span
                    className="text-[9px] text-primary font-medium mt-1 block"
                    style={{ fontFamily: 'var(--font-mono)' }}
                >
                    (optional)
                </span>
            )}
        </div>
    );
}

function ConnectorWithMonth({ node, direction }: { node: TimelineNode; direction: 'up' | 'down' }) {
    return (
        <div className="flex flex-col items-center gap-0">
            {direction === 'up' && (
                <>
                    <div className="w-px h-3 bg-navy/20" />
                    <span
                        className="text-[9px] font-bold text-navy/60 my-0.5"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        {node.month}
                    </span>
                    <div className="w-px h-3 bg-navy/20" />
                </>
            )}
            {direction === 'down' && (
                <>
                    <div className="w-px h-3 bg-navy/20" />
                    <span
                        className="text-[9px] font-bold text-navy/60 my-0.5"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        {node.month}
                    </span>
                    <div className="w-px h-3 bg-navy/20" />
                </>
            )}
        </div>
    );
}

export function PctTimeline() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end center'],
    });

    const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    // Each node appears when the timeline bar reaches its position
    const nodeCount = TIMELINE_NODES.length;
    const nodeTransforms = TIMELINE_NODES.map((_, i) => {
        const start = i / nodeCount;
        const end = Math.min(start + 0.08, 1);
        return { start, end };
    });

    return (
        <div ref={sectionRef} className="mt-24 lg:mt-32">
            {/* Sub-section Label */}
            <div id="timeline-flow" className="flex items-center gap-3 mb-4">
                <h3 className="text-base leading-none tracking-[0.1em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps] text-navy-light">
                    PCT Filing Timeline
                </h3>
            </div>
            <p
                className="text-sm text-text-secondary mb-16 max-w-xl"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                A structured route from priority filing through PCT milestones to
                national/regional phase entry.
            </p>

            {/* Desktop Timeline */}
            <div className="hidden lg:block overflow-hidden pb-4">
                <div className="min-w-250">
                    <div className="grid grid-cols-8 gap-x-3">

                        {/* Row 1: Top cards */}
                        {TIMELINE_NODES.map((node, index) => (
                            <div key={`top-${index}`} className="flex flex-col justify-end min-h-32">
                                {node.position === 'top' && (
                                    <TimelineAnimatedCard
                                        node={node}
                                        index={index}
                                        scrollYProgress={scrollYProgress}
                                        nodeTransforms={nodeTransforms}
                                        direction="top"
                                    />
                                )}
                            </div>
                        ))}

                        {/* Row 2: Connectors top → timeline with month label */}
                        {TIMELINE_NODES.map((node, index) => (
                            <div key={`conn-top-${index}`} className="flex justify-center">
                                {node.position === 'top' ? (
                                    <ConnectorWithMonth node={node} direction="up" />
                                ) : (
                                    <div className="h-8" />
                                )}
                            </div>
                        ))}

                        {/* Row 3: Timeline bar with dots */}
                        <div className="col-span-8 relative h-5 flex items-center">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.75 bg-navy/10 rounded-full" />
                            <motion.div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.75 bg-navy rounded-full"
                                style={{ width: lineWidth }}
                            />
                            <div className="absolute -right-1 top-1/2 -translate-y-1/2">
                                <svg width="10" height="10" viewBox="0 0 10 10" className="text-navy/40">
                                    <path d="M0 0 L10 5 L0 10 Z" fill="currentColor" />
                                </svg>
                            </div>
                            {/* Dots */}
                            <div className="grid grid-cols-8 gap-x-3 w-full relative">
                                {TIMELINE_NODES.map((_, index) => (
                                    <TimelineAnimatedDot
                                        key={`dot-${index}`}
                                        index={index}
                                        scrollYProgress={scrollYProgress}
                                        nodeTransforms={nodeTransforms}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Row 4: Connectors timeline → bottom with month label */}
                        {TIMELINE_NODES.map((node, index) => (
                            <div key={`conn-bot-${index}`} className="flex justify-center">
                                {node.position === 'bottom' ? (
                                    <ConnectorWithMonth node={node} direction="down" />
                                ) : (
                                    <div className="h-8" />
                                )}
                            </div>
                        ))}

                        {/* Row 5: Bottom cards */}
                        {TIMELINE_NODES.map((node, index) => (
                            <div key={`bot-${index}`} className="flex flex-col justify-start min-h-32">
                                {node.position === 'bottom' && (
                                    <TimelineAnimatedCard
                                        node={node}
                                        index={index}
                                        scrollYProgress={scrollYProgress}
                                        nodeTransforms={nodeTransforms}
                                        direction="bottom"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Timeline — vertical */}
            <div className="lg:hidden">
                <div className="relative pl-10">
                    <div className="absolute left-1.75 top-0 bottom-0 w-0.5 bg-navy/10" />
                    <motion.div
                        className="absolute left-1.75 top-0 w-0.5 bg-navy origin-top"
                        style={{ height: lineWidth }}
                    />
                    <div className="space-y-6">
                        {TIMELINE_NODES.map((node, index) => (
                            <motion.div
                                key={node.title}
                                className="relative"
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-30px' }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                {/* Node dot with month */}
                                <div className="absolute -left-10 top-3 flex flex-col items-center">
                                    <div className="w-3.5 h-3.5 rounded-full bg-navy border-[3px] border-primary z-10" />
                                    <span
                                        className="text-[8px] font-bold text-navy/50 mt-1 whitespace-nowrap"
                                        style={{ fontFamily: 'var(--font-mono)' }}
                                    >
                                        {node.month}
                                    </span>
                                </div>

                                <div
                                    className={`rounded-lg p-4 ${
                                        node.optional
                                            ? 'bg-white border border-dashed border-text-muted/30'
                                            : 'bg-white border border-card-border shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded"
                                            style={{ fontFamily: 'var(--font-mono)' }}
                                        >
                                            Month {node.month}
                                        </span>
                                        {node.optional && (
                                            <span
                                                className="text-[9px] text-text-muted"
                                                style={{ fontFamily: 'var(--font-mono)' }}
                                            >
                                                optional
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className="text-sm font-semibold text-text-primary"
                                        style={{ fontFamily: 'var(--font-display)' }}
                                    >
                                        {node.title}
                                    </p>
                                    <p
                                        className="text-xs text-text-muted mt-1"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {node.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* Scroll-linked animated card — appears as timeline bar reaches it */
function TimelineAnimatedCard({
    node,
    index,
    scrollYProgress,
    nodeTransforms,
    direction,
}: {
    node: TimelineNode;
    index: number;
    scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
    nodeTransforms: { start: number; end: number }[];
    direction: 'top' | 'bottom';
}) {
    const opacity = useTransform(
        scrollYProgress,
        [nodeTransforms[index].start, nodeTransforms[index].end],
        [0, 1]
    );
    const translateY = useTransform(
        scrollYProgress,
        [nodeTransforms[index].start, nodeTransforms[index].end],
        [direction === 'top' ? -15 : 15, 0]
    );

    return (
        <motion.div style={{ opacity, y: translateY }}>
            <CardContent node={node} />
        </motion.div>
    );
}

/* Scroll-linked animated dot — scales in as timeline bar reaches it */
function TimelineAnimatedDot({
    index,
    scrollYProgress,
    nodeTransforms,
}: {
    index: number;
    scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
    nodeTransforms: { start: number; end: number }[];
}) {
    const scale = useTransform(
        scrollYProgress,
        [nodeTransforms[index].start, nodeTransforms[index].end],
        [0, 1]
    );

    return (
        <motion.div className="flex justify-center" style={{ scale }}>
            <div className="w-3.5 h-3.5 rounded-full bg-navy border-[3px] border-primary" />
        </motion.div>
    );
}
