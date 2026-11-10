'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MockupRecordLabel } from './BrowserMockupChrome';

/* ── Animated audit trail table ──
   Fixed-height container. When rows expand, detail panels appear inline
   between table rows — bottom rows naturally disappear via overflow-hidden.
   2 rows auto-expand in sequence. Scroll-triggered, loops. */

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface ExpandData {
    fields: { field: string; previous: string; newValue: string }[];
    reasonText: string;
}

interface AuditRow {
    timestamp: string;
    actor: string;
    action: string;
    entity: string;
    changes: string;
    reason: string;
    expand?: ExpandData;
}

/* ── Dynamic date helpers ── */
function fmtDate(d: Date): string {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtTimestamp(daysAgo: number, time: string): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return `${fmtDate(d)}, ${time}`;
}

const ACTION_PILL: Record<string, string> = {
    Updated: 'bg-primary/10 text-primary',
    Created: 'bg-emerald-100 text-emerald-700',
    Deleted: 'bg-red-100 text-red-700',
};

const AUDIT_ROWS: AuditRow[] = [
    {
        timestamp: fmtTimestamp(0, '15:11'),
        actor: 'demopatent3@designyourinvention.com',
        action: 'Updated',
        entity: 'National phase case · EP 2589123',
        changes: 'Changed Grant Date, Grant Number',
        reason: 'No longer active',
        expand: {
            fields: [
                { field: 'Status', previous: 'active', newValue: 'completed' },
            ],
            reasonText: 'Status changed to completed from reminder card action.',
        },
    },
    {
        timestamp: fmtTimestamp(0, '15:11'),
        actor: 'demopatent1@designyourinvention.com',
        action: 'Deleted',
        entity: 'National phase case · JP 2028-519834',
        changes: 'Deleted',
        reason: 'Re-assign active',
    },
    {
        timestamp: fmtTimestamp(0, '15:11'),
        actor: 'demopatent1@designyourinvention.com',
        action: 'Updated',
        entity: 'National phase case · IN 202847012345',
        changes: 'Changed Status',
        reason: 'No longer active',
        expand: {
            fields: [
                { field: 'Jurisdiction', previous: 'GB', newValue: 'US' },
            ],
            reasonText: 'Changing the jurisdiction.',
        },
    },
    {
        timestamp: fmtTimestamp(1, '14:07'),
        actor: 'demopatent2@designyourinvention.com',
        action: 'Created',
        entity: 'Provisional · US 63/412,887',
        changes: 'Changed Application Number',
        reason: 'Updates fee accrual deadline',
    },
    {
        timestamp: fmtTimestamp(4, '14:07'),
        actor: 'demopatent1@designyourinvention.com',
        action: 'Updated',
        entity: 'PCT filing · PCT/US2024/012345',
        changes: 'Changed Status',
        reason: 'Priority re-assessment',
    },
    {
        timestamp: fmtTimestamp(5, '14:07'),
        actor: 'demopatent3@designyourinvention.com',
        action: 'Created',
        entity: 'National phase case · US 17/123,456',
        changes: 'Created',
        reason: 'Filed provisional',
    },
    {
        timestamp: fmtTimestamp(7, '11:42'),
        actor: 'demopatent2@designyourinvention.com',
        action: 'Updated',
        entity: 'Provisional · US 63/398,201',
        changes: 'Partially modified',
        reason: 'Fee schedule update',
    },
    {
        timestamp: fmtTimestamp(9, '09:18'),
        actor: 'demopatent1@designyourinvention.com',
        action: 'Created',
        entity: 'National phase case · CN 2028-10456789',
        changes: 'Created',
        reason: 'Portfolio migration',
    },
    {
        timestamp: fmtTimestamp(10, '16:33'),
        actor: 'demopatent1@designyourinvention.com',
        action: 'Deleted',
        entity: 'PCT filing · PCT/US2023/045678',
        changes: 'Deleted',
        reason: 'Duplicate entry removed',
    },
    {
        timestamp: fmtTimestamp(11, '10:05'),
        actor: 'demopatent3@designyourinvention.com',
        action: 'Created',
        entity: 'Provisional · US 63/455,019',
        changes: 'Created',
        reason: 'New provisional filing',
    },
    {
        timestamp: fmtTimestamp(12, '14:22'),
        actor: 'demopatent1@designyourinvention.com',
        action: 'Updated',
        entity: 'National phase case · KR 10-2028-0012345',
        changes: 'Changed Assignee',
        reason: 'Transfer of ownership recorded',
    },
    {
        timestamp: fmtTimestamp(14, '08:47'),
        actor: 'demopatent2@designyourinvention.com',
        action: 'Updated',
        entity: 'Provisional · US 63/471,632',
        changes: 'Changed Priority Date',
        reason: 'Amended per examiner request',
    },
    {
        timestamp: fmtTimestamp(15, '11:19'),
        actor: 'demopatent2@designyourinvention.com',
        action: 'Created',
        entity: 'National phase case · AU 2028201234',
        changes: 'Created',
        reason: 'National phase entry - EP',
    },
    {
        timestamp: fmtTimestamp(17, '15:50'),
        actor: 'demopatent2@designyourinvention.com',
        action: 'Deleted',
        entity: 'PCT filing · PCT/EP2024/067890',
        changes: 'Deleted',
        reason: 'Filing withdrawn by applicant',
    },
    {
        timestamp: fmtTimestamp(19, '09:30'),
        actor: 'demopatent3@designyourinvention.com',
        action: 'Updated',
        entity: 'National phase case · CA 3,245,678',
        changes: 'Changed Grant Number',
        reason: 'Grant certificate received',
    },
];

const EXPAND_ROWS = [0, 2];
const EXPAND_TIMES = [1500, 4000];
const COLLAPSE_TIME = 7000;
const LOOP_TIME = 8500;

export function AnimatedAuditTable() {
    const containerRef = useRef<HTMLDivElement>(null);
    const inView = useInView(containerRef, { once: true, margin: '-80px' });
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const runCycle = useCallback(() => {
        setExpandedRows(new Set());
        const timers: ReturnType<typeof setTimeout>[] = [];

        EXPAND_TIMES.forEach((time, i) => {
            timers.push(setTimeout(() => {
                setExpandedRows(prev => new Set([...prev, EXPAND_ROWS[i]]));
            }, time));
        });

        timers.push(setTimeout(() => setExpandedRows(new Set()), COLLAPSE_TIME));
        return timers;
    }, []);

    useEffect(() => {
        if (!inView) return;
        let timers = runCycle();
        const interval = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, LOOP_TIME);
        return () => { timers.forEach(clearTimeout); clearInterval(interval); };
    }, [runCycle, inView]);

    return (
        <motion.div
            ref={containerRef}
            aria-hidden="true"
            role="img"
            className="relative rounded-xl border border-card-border bg-[#f8f8fa] shadow-2xl shadow-black/10 overflow-hidden flex flex-col select-none h-120 sm:h-135 lg:h-150"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
            {/* Chrome Bar */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-page-bg-alt border-b border-card-border shrink-0">
                <MockupRecordLabel record="DEMO-AUD-001" screen="Audit log" />
                <div className="hidden sm:flex flex-1 min-w-0 justify-end">
                    <div className="flex items-center gap-1.5 px-2 sm:px-3 py-0.5 bg-white rounded-md text-[10px] sm:text-[9px] text-text-muted border border-card-border"
                        style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                        app.designyourinvention.com
                    </div>
                </div>
            </div>

            {/* Filter Row — single row, all filters inline, matching audit.png */}
            <motion.div
                className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-end gap-2 sm:gap-3 bg-white border-b border-card-border overflow-x-auto scrollbar-none shrink-0"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ duration: 0.3, delay: 0.4 }}
            >
                {[
                    { label: 'Event Type', value: 'All' },
                    { label: 'Entity ID', value: 'All' },
                    { label: 'Action', value: 'All' },
                    { label: 'Date From', value: fmtDate((() => { const d = new Date(); d.setDate(d.getDate() - 19); return d; })()) },
                    { label: 'Date To', value: fmtDate(new Date()) },
                ].map(f => (
                    <div key={f.label} className="shrink-0 flex-1 min-w-[60px]">
                        <span className="text-[10px] sm:text-[8px] text-text-muted block mb-0.5" style={{ fontFamily: 'var(--font-dashboard)' }}>{f.label}</span>
                        <span className="text-[10px] sm:text-[9px] font-medium px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-card-border text-text-secondary bg-page-bg-alt flex items-center justify-between gap-1 w-full"
                            style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                            <span className="truncate text-text-secondary">{f.value}</span>
                            <span className="opacity-40 text-[10px] sm:text-[6px] shrink-0">▾</span>
                        </span>
                    </div>
                ))}
                <span className="text-[10px] sm:text-[9px] font-medium text-primary whitespace-nowrap shrink-0 pb-1.5"
                    style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                    Clear Filters
                </span>
            </motion.div>

            {/* Table area — white card on gray bg */}
            <div className="flex-1 flex flex-col mx-2 sm:mx-3 mt-2 sm:mt-2.5 mb-2 rounded-lg border border-card-border bg-white overflow-hidden relative">

            {/* Table Header */}
            <div className="shrink-0 border-b border-card-border">
                <div className="grid px-3 sm:px-4 py-1.5 sm:py-2"
                    style={{ gridTemplateColumns: 'minmax(90px,1fr) minmax(100px,1.5fr) 72px minmax(100px,1.8fr) minmax(80px,1fr) minmax(70px,1fr) 50px' }}>
                    {['Timestamp', 'Actor', 'Action', 'Entity', 'Changes', 'Reason', ''].map(col => (
                        <span key={col || 'action-col'} className="text-[10px] sm:text-[9px] font-semibold text-text-muted uppercase tracking-wider truncate pr-2"
                            style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                            {col}
                        </span>
                    ))}
                </div>
            </div>

            {/* Scrollable table body — fixed height, overflow hidden */}
            <div className="flex-1 overflow-hidden relative">
                <div>
                    {AUDIT_ROWS.map((row, i) => {
                        const isExpanded = expandedRows.has(i) && !!row.expand;
                        return (
                            <div key={`row-${i}`}>
                                {/* Row */}
                                <motion.div
                                    className={`grid px-3 sm:px-4 py-1.5 sm:py-2 border-b border-card-border/40 transition-colors duration-300 ${
                                        isExpanded ? 'bg-primary/[0.04]' : ''
                                    }`}
                                    style={{ gridTemplateColumns: 'minmax(90px,1fr) minmax(100px,1.5fr) 72px minmax(100px,1.8fr) minmax(80px,1fr) minmax(70px,1fr) 50px' }}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={inView ? { opacity: 1, x: 0 } : undefined}
                                    transition={{ duration: 0.3, delay: 0.5 + i * 0.06, ease: EASE }}
                                >
                                    <span className="text-[10px] sm:text-[9px] text-text-muted truncate pr-2"
                                        style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                        {row.timestamp}
                                    </span>
                                    <span className="text-[10px] sm:text-[9px] text-primary truncate pr-2"
                                        style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                        {row.actor}
                                    </span>
                                    <span className="pr-2">
                                        <span className={`inline-block shrink-0 whitespace-nowrap text-[10px] sm:text-[8px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${ACTION_PILL[row.action] ?? 'bg-gray-100 text-gray-600'}`}
                                            style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                            {row.action}
                                        </span>
                                    </span>
                                    <span className="text-[10px] sm:text-[9px] text-text-secondary truncate pr-2"
                                        style={{ fontFamily: 'var(--font-dashboard)' }}>
                                        {row.entity}
                                    </span>
                                    <span className="text-[10px] sm:text-[9px] text-text-secondary truncate pr-2 hidden sm:block"
                                        style={{ fontFamily: 'var(--font-dashboard)' }}>
                                        {row.changes}
                                    </span>
                                    <span className="text-[10px] sm:text-[9px] text-text-muted truncate pr-2 hidden md:block"
                                        style={{ fontFamily: 'var(--font-dashboard)' }}>
                                        {row.reason}
                                    </span>
                                    <span className="text-[10px] sm:text-[8px] text-primary font-medium whitespace-nowrap"
                                        style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                        {row.expand ? (isExpanded ? '▾ Details' : '▸ Details') : ''}
                                    </span>
                                </motion.div>

                                {/* Inline expand panel — pushes rows below it down, overflow hides them */}
                                <AnimatePresence>
                                    {isExpanded && row.expand && (
                                        <motion.div
                                            className="bg-page-bg-alt/60 border-b border-card-border overflow-hidden"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: EASE }}
                                        >
                                            <div className="px-4 sm:px-6 py-3 sm:py-4">
                                                {/* Field diff table */}
                                                <div className="mb-3">
                                                    <div className="grid grid-cols-3 gap-2 border-b border-card-border/60 pb-1 mb-1.5">
                                                        {['Field', 'Previous Value', 'New Value'].map(h => (
                                                            <span key={h} className="text-[10px] sm:text-[9px] font-semibold text-text-muted"
                                                                style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                                                {h}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {row.expand.fields.map(f => (
                                                        <div key={f.field} className="grid grid-cols-3 gap-2 py-1.5 border-b border-card-border/30">
                                                            <span className="text-[10px] sm:text-[10px] font-medium text-text-primary"
                                                                style={{ fontFamily: 'var(--font-dashboard)' }}>
                                                                {f.field}
                                                            </span>
                                                            <span className="text-[10px] sm:text-[10px] text-text-secondary line-through decoration-text-secondary/60 bg-slate-50 px-1.5 py-0.5 rounded w-fit"
                                                                style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                                                {f.previous}
                                                            </span>
                                                            <span className="text-[10px] sm:text-[10px] font-medium text-text-primary bg-slate-100 px-1.5 py-0.5 rounded w-fit"
                                                                style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                                                {f.newValue}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Reason for change */}
                                                <div>
                                                    <p className="text-[10px] sm:text-[9px] font-semibold text-text-muted mb-1"
                                                        style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                                        Reason for Change
                                                    </p>
                                                    <p className="text-[10px] sm:text-[10px] text-text-secondary leading-relaxed"
                                                        style={{ fontFamily: 'var(--font-dashboard)' }}>
                                                        {row.expand.reasonText}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom fade inside the scroll area */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </div>

            {/* Close table card wrapper */}
            </div>
        </motion.div>
    );
}
