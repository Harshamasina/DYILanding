'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MockupRecordLabel } from './BrowserMockupChrome';

/* ── Animated dashboard mockup — pixel-accurate replica of dashboard screenshot ──
   Responsive: stacks vertically on mobile, full layout on desktop.
   Desktop: 2:1 aspect ratio matching screenshot layout.
   Mobile: natural height with stacked layout. */

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/** Return YYYY-MM-DD string for today + `offset` days */
function dateFromNow(offset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
}

const ACTION_BUTTONS = [
    { label: '+ Add Family', primary: true },
    { label: '+ File PRV', primary: true },
    { label: '+ File PCT', primary: true },
    { label: '+ File NPE', primary: true },
    { label: '↓ Upload Document', primary: false },
    { label: '⟳ Import Portfolio', primary: false },
    { label: '⊕ Fee Schedule', primary: false, noArrow: true },
    { label: '👤 Manage Members', primary: false, noArrow: true },
];

const STATS = [
    { label: 'Total Families', value: 22, sub: `As of ${dateFromNow(0)}`, subColor: '#94a3b8', icon: 'folder' as const, iconColor: '#6366f1', iconBg: '#ede9fe' },
    { label: 'Pending Deadlines', value: 32, sub: 'Next 30 days', subColor: '#3b82f6', icon: 'calendar' as const, iconColor: '#3b82f6', iconBg: '#dbeafe' },
    { label: 'Overdue Items', value: 15, sub: 'Requires immediate attention', subColor: '#dc2626', icon: 'alert' as const, iconColor: '#dc2626', iconBg: '#fee2e2' },
    { label: 'Fees Due', value: 66, sub: 'Current cycle', subColor: '#059669', icon: 'dollar' as const, iconColor: '#059669', iconBg: '#d1fae5' },
];

const ACTIVITY_ITEMS = [
    { id: 'DEMO-SGLT-002', appNo: '18/567,890', type: 'Prior art', action: 'CREATE', time: '3 hours ago' },
    { id: 'DEMO-FREE-01', appNo: '17/234,567', type: 'Patent draft', action: 'EXPORT', time: '4 hours ago' },
    { id: 'DEMO-2025-007', appNo: '18/890,123', type: 'Prior art', action: 'CREATE', time: '14 hours ago' },
    { id: 'DEMO-ADC-004', appNo: 'EP25801111.1', type: 'Annuity fee', action: 'UPDATE', time: '5 days ago' },
    { id: 'DEMO-RNA-003', appNo: 'PCT/US25/044', type: 'National phase', action: 'UPDATE', time: '9 days ago' },
    { id: 'DEMO-BIO-002', appNo: '18/345,678', type: 'National phase', action: 'UPDATE', time: '9 days ago' },
    { id: 'DEMO-2025-004', appNo: 'FR2025/012', type: 'Provisional', action: 'CREATE', time: '9 days ago' },
    { id: 'DEMO-2024-003', appNo: 'EP25809876.3', type: 'Office action', action: 'CREATE', time: '18 days ago' },
    { id: 'DEMO-CAR-006', appNo: '17/901,234', type: 'Provisional', action: 'UPDATE', time: '19 days ago' },
    { id: 'DEMO-2023-019', appNo: 'JP2025-56789', type: 'Family', action: 'CREATE', time: '19 days ago' },
];

const ACTION_COLORS: Record<string, { bg: string; text: string }> = {
    CREATE: { bg: '#dcfce7', text: '#16a34a' },
    UPDATE: { bg: '#dbeafe', text: '#2563eb' },
    EXPORT: { bg: '#f1f5f9', text: '#64748b' },
};

const DONUT_DATA = [
    { label: 'US', value: 21, color: '#3b4a8a' },
    { label: 'EP', value: 16, color: '#4d5e9e' },
    { label: 'JP', value: 14, color: '#6272b2' },
    { label: 'AU', value: 9, color: '#7886c4' },
    { label: 'KR', value: 9, color: '#8594d0' },
    { label: 'FR', value: 5, color: '#95a2d8' },
    { label: 'IN', value: 5, color: '#a4b0e0' },
    { label: 'GB', value: 4, color: '#b4bee6' },
    { label: 'BR', value: 2, color: '#c4ccec' },
    { label: 'CA', value: 2, color: '#d4daf2' },
    { label: 'CN', value: 0, color: '#c0c6d8' },
    { label: 'MX', value: 0, color: '#d8dce6' },
    { label: 'RU', value: 0, color: '#9aa3b8' },
];

interface NotifItem {
    title: string;
    meta: string;
    badge: number;
    badgeColor: string;
    days: string;
}

const ANNUITY_FEES: NotifItem[] = [
    { title: 'Annuity Fee Due - 18/567,890', meta: `18/567,890 · ${dateFromNow(0)}`, badge: 70, badgeColor: '#dc2626', days: '0 days' },
    { title: 'Annuity Fee Due - 18/567,891', meta: `18/567,891 · ${dateFromNow(5)}`, badge: 65, badgeColor: '#f59e0b', days: '5 days' },
    { title: 'Annuity Fee Due - FR2025/012345', meta: `FR2025/012345 · ${dateFromNow(5)}`, badge: 65, badgeColor: '#f59e0b', days: '5 days' },
];

const OA_ITEMS: NotifItem[] = [
    { title: 'OA Response Due - EP25801111.1', meta: `EP25801111.1 · ${dateFromNow(15)}`, badge: 47, badgeColor: '#f59e0b', days: '15 days' },
    { title: 'OA Response Due - EP25809876.3', meta: `EP25809876.3 · ${dateFromNow(18)}`, badge: 45, badgeColor: '#f59e0b', days: '18 days' },
];

const REMINDER_ITEMS: NotifItem[] = [
    { title: 'BIO-002 US Restriction Requirement response deadline', meta: `002 US Restriction Requirement response deadline · ${dateFromNow(2)}`, badge: 46, badgeColor: '#f59e0b', days: '2 days' },
    { title: 'CVD-011 CE mark application follow-up', meta: `up · ${dateFromNow(5)}`, badge: 42, badgeColor: '#f59e0b', days: '5 days' },
    { title: 'MAB-001 EPO annuity fee payment, year 3', meta: `001 EPO annuity fee payment, year 3 · ${dateFromNow(8)}`, badge: 34, badgeColor: '#22c55e', days: '8 days' },
    { title: 'ADC-004 IND safety update, review IP implications', meta: `004 IND safety update, review IP implications · ${dateFromNow(12)}`, badge: 29, badgeColor: '#22c55e', days: '12 days' },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function AnimatedDashboard() {
    const containerRef = useRef<HTMLDivElement>(null);
    // Starts as soon as the top edge is on screen: the hero now ends above the
    // fold, so the dashboard must reveal without the visitor scrolling.
    const inView = useInView(containerRef, { once: true, margin: '0px 0px -2% 0px' });

    return (
        <motion.div
            ref={containerRef}
            aria-hidden="true"
            role="img"
            className="relative rounded-xl border border-card-border bg-[#f8f8fa] shadow-2xl shadow-black/10 overflow-hidden flex flex-col lg:aspect-[2/1] select-none"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
            {/* ── Chrome Bar ── */}
            <div className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white border-b border-card-border">
                <MockupRecordLabel record="DEMO-WS-001" screen="Portfolio dashboard" />
                <div className="hidden sm:flex flex-1 min-w-0 justify-end">
                    <div className="flex items-center gap-1.5 px-2 sm:px-4 py-0.5 sm:py-1 bg-page-bg-alt rounded-lg text-[10px] sm:text-[11px] text-text-muted border border-card-border"
                        style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        app.designyourinvention.com
                    </div>
                </div>
            </div>

            {/* ── Quick Actions ── */}
            <div className="px-3 sm:px-5 py-1.5 sm:py-2.5 flex items-center gap-1 sm:gap-2 bg-white border-b border-card-border overflow-hidden">
                {ACTION_BUTTONS.map((btn, i) => (
                    <motion.span
                        key={btn.label}
                        className={`text-[10px] sm:text-[10px] font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border whitespace-nowrap shrink-0 ${btn.primary ? 'text-primary' : 'text-text-secondary bg-white'}`}
                        style={{
                            fontFamily: 'var(--font-dashboard-mono)',
                            ...(btn.primary
                                ? { backgroundColor: 'color-mix(in srgb, #6366f1 10%, white)', borderColor: 'color-mix(in srgb, #6366f1 28%, #e2e8f0)' }
                                : { borderColor: '#e2e8f0' }),
                        }}
                        initial={{ opacity: 0, y: -5 }}
                        animate={inView ? { opacity: 1, y: 0 } : undefined}
                        transition={{ duration: 0.25, delay: 0.35 + i * 0.04, ease: EASE }}
                    >
                        {btn.label}
                        {!btn.noArrow && <span className="text-[10px] sm:text-[8px] ml-0.5 opacity-60"> ›</span>}
                    </motion.span>
                ))}
            </div>

            {/* ── Dashboard Body ── */}
            <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">

                {/* ── Left: Stats + Activity + Chart ── */}
                <div className="flex-[2] flex flex-col p-3 sm:p-4 gap-3 sm:gap-4 overflow-hidden">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 shrink-0">
                        {STATS.map((s, i) => (
                            <motion.div
                                key={s.label}
                                className="bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-card-border"
                                style={{ boxShadow: '0 2px 8px rgb(15 23 42 / 6%)' }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={inView ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.4, delay: 0.5 + i * 0.08, ease: EASE }}
                            >
                                <div className="flex items-start justify-between">
                                    <p className="text-[10px] sm:text-[10px] font-bold text-text-secondary leading-tight" style={{ fontFamily: 'var(--font-dashboard)' }}>{s.label}</p>
                                    <div className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: s.iconBg }}>
                                        <StatIcon type={s.icon} color={s.iconColor} />
                                    </div>
                                </div>
                                <CountUp target={s.value} delay={0.6 + i * 0.08} color="#0f172a" size="text-lg sm:text-2xl" inView={inView} />
                                {s.sub && (
                                    <p className="text-[10px] sm:text-[7px] mt-0.5 hidden sm:block"
                                        style={{ fontFamily: 'var(--font-dashboard)', color: s.subColor }}>
                                        {s.sub}
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Activity + Donut */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 min-h-0">
                        {/* Recent Family Activity */}
                        <motion.div
                            className="flex-1 bg-white rounded-lg border border-card-border p-3 sm:p-4 flex flex-col overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : undefined}
                            transition={{ duration: 0.4, delay: 0.85 }}
                        >
                            <div className="flex items-center justify-between mb-2 sm:mb-3 shrink-0">
                                <p className="text-[10px] sm:text-[11px] font-semibold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                    Recent Family Activity
                                </p>
                                <span className="text-[10px] sm:text-[9px] text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>View all families</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                {ACTIVITY_ITEMS.map((item, i) => (
                                    <motion.div
                                        key={`${item.id}-${item.type}`}
                                        className="flex items-center gap-2 py-[3px] sm:py-[5px] border-b border-card-border/40 last:border-b-0"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={inView ? { opacity: 1, x: 0 } : undefined}
                                        transition={{ duration: 0.3, delay: 0.95 + i * 0.05, ease: EASE }}
                                    >
                                        <span className="text-[10px] sm:text-[9px] font-semibold text-text-primary shrink-0 w-[70px] sm:w-[95px] truncate"
                                            style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                            {item.id}
                                        </span>
                                        <span className="text-[10px] sm:text-[8px] text-text-muted shrink-0 w-13.75 sm:w-17.5 truncate"
                                            style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                            {item.appNo}
                                        </span>
                                        <span className="text-[10px] sm:text-[8px] text-text-muted truncate flex-1"
                                            style={{ fontFamily: 'var(--font-dashboard)' }}>
                                            {item.type}
                                        </span>
                                        <span className="text-[10px] sm:text-[7px] font-bold px-1.5 sm:px-2 py-0.5 rounded shrink-0"
                                            style={{
                                                backgroundColor: ACTION_COLORS[item.action]?.bg,
                                                color: ACTION_COLORS[item.action]?.text,
                                                fontFamily: 'var(--font-dashboard-mono)',
                                            }}>
                                            {item.action}
                                        </span>
                                        <span className="text-[10px] sm:text-[7px] text-text-muted shrink-0 w-[45px] sm:w-[60px] text-right"
                                            style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                            {item.time}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Donut Chart — Active NPE Cases by Country */}
                        <motion.div
                            className="flex-1 bg-white rounded-lg border border-card-border p-3 sm:p-4 flex flex-col items-center"
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : undefined}
                            transition={{ duration: 0.4, delay: 0.9 }}
                        >
                            <p className="text-[10px] sm:text-[11px] font-semibold text-text-primary mb-2 sm:mb-3 self-start shrink-0" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                Active NPE Cases by Country
                            </p>
                            <div className="flex-1 flex items-center justify-center min-h-0 py-2 sm:py-0">
                                <DonutChart inView={inView} />
                            </div>
                            <div className="flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-0.5 sm:gap-y-1 justify-center mt-1 sm:mt-2 shrink-0">
                                {DONUT_DATA.map(seg => (
                                    <div key={seg.label} className="flex items-center gap-1">
                                        <span className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full" style={{ backgroundColor: seg.color }} />
                                        <span className="text-[10px] sm:text-[9px] text-text-muted" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>{seg.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ── Right: Notifications (hidden on mobile, visible md+) ── */}
                <div className="hidden md:flex flex-[1] flex-col bg-white border-l border-card-border overflow-hidden">
                    <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-1.5 sm:pb-2 border-b border-card-border/60 shrink-0">
                        <p className="text-[10px] sm:text-[12px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>Notifications</p>
                    </div>
                    <div className="flex-1 overflow-hidden px-3 sm:px-4 pt-2 sm:pt-3 space-y-1">
                        <NotifSection title="Annuity Fees" count={22} items={ANNUITY_FEES} baseDelay={1.1} inView={inView} />
                        <NotifSection title="Office Actions" count={12} items={OA_ITEMS} baseDelay={1.4} inView={inView} />
                        <NotifSection title="Reminders" count={10} items={REMINDER_ITEMS} baseDelay={1.7} inView={inView} />
                    </div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#f8f8fa] to-transparent pointer-events-none rounded-b-xl" />
        </motion.div>
    );
}


/* ── Sub-components ── */

function StatIcon({ type, color }: { type: 'folder' | 'calendar' | 'alert' | 'dollar'; color: string }) {
    const shared = { width: 10, height: 10, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
    switch (type) {
        case 'folder':
            return <svg {...shared}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>;
        case 'calendar':
            return <svg {...shared}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
        case 'alert':
            return <svg {...shared}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><path d="M12 9v4M12 17h.01" /></svg>;
        case 'dollar':
            return <svg {...shared}><circle cx="12" cy="12" r="10" /><path d="M12 6v12" /><path d="M15.5 9.5c0-1.38-1.57-2.5-3.5-2.5S8.5 8.12 8.5 9.5 10.07 12 12 12s3.5 1.12 3.5 2.5S13.93 17 12 17s-3.5-1.12-3.5-2.5" /></svg>;
    }
}

function NotifSection({ title, count, items, baseDelay, inView }: { title: string; count: number; items: NotifItem[]; baseDelay: number; inView: boolean }) {
    return (
        <div className="mb-2 sm:mb-3">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <div className="flex items-center gap-1.5">
                    <p className="text-[10px] sm:text-[10px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>{title}</p>
                    <span className="text-[10px] sm:text-[8px] font-bold text-white bg-[#22c55e] rounded-full px-1.5 py-0.5 leading-none min-w-[14px] text-center">{count}</span>
                </div>
                <span className="text-[10px] sm:text-[9px] text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>View All</span>
            </div>
            <div className="space-y-1 sm:space-y-1.5">
                {items.map((item, i) => (
                    <motion.div
                        key={item.title}
                        className="flex items-start gap-2 sm:gap-2.5 py-0.5 sm:py-1"
                        initial={{ opacity: 0, x: 10 }}
                        animate={inView ? { opacity: 1, x: 0 } : undefined}
                        transition={{ duration: 0.3, delay: baseDelay + i * 0.1, ease: EASE }}
                    >
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-[3px] shrink-0 bg-[#f59e0b]" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-[10px] text-text-primary leading-snug truncate" style={{ fontFamily: 'var(--font-dashboard)' }}>{item.title}</p>
                            <p className="text-[10px] sm:text-[8px] text-text-muted leading-snug mt-0.5 truncate" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>{item.meta}</p>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                            <span className="text-[10px] sm:text-[9px] font-bold leading-none"
                                style={{ color: item.badgeColor, fontFamily: 'var(--font-dashboard-mono)' }}>
                                {item.badge}
                            </span>
                            <span className="text-[10px] sm:text-[7px] text-text-muted mt-0.5" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>{item.days}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function CountUp({ target, delay, color, size = 'text-xl', inView }: { target: number; delay: number; color: string; size?: string; inView: boolean }) {
    const [count, setCount] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        if (!inView || started.current) return;
        started.current = true;
        const t = setTimeout(() => {
            const dur = 1200;
            const t0 = performance.now();
            (function step(now: number) {
                const p = Math.min((now - t0) / dur, 1);
                setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
                if (p < 1) requestAnimationFrame(step);
            })(performance.now());
        }, delay * 1000);
        return () => clearTimeout(t);
    }, [target, delay, inView]);

    return <p className={`${size} font-bold leading-tight`} style={{ fontFamily: 'var(--font-dashboard-mono)', color }}>{count}</p>;
}

function DonutChart({ inView }: { inView: boolean }) {
    const size = 180;
    const sw = 36;
    const r = (size - sw) / 2;
    const circ = 2 * Math.PI * r;
    const activeData = DONUT_DATA.filter(d => d.value > 0);
    const total = activeData.reduce((sum, d) => sum + d.value, 0);

    /* Pre-compute cumulative start percentages for each segment */
    const segments: Array<{ label: string; value: number; color: string; startPct: number; midPct: number }> = [];
    let cumPct = 0;
    for (const seg of activeData) {
        const pct = (seg.value / total) * 100;
        segments.push({ ...seg, startPct: cumPct, midPct: cumPct + pct / 2 });
        cumPct += pct;
    }

    return (
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: size, maxHeight: size }}>
            {/* Donut arcs — <g> rotated so arcs start from 12 o'clock */}
            <g transform={`rotate(-90, ${size / 2}, ${size / 2})`}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={sw} />
                {segments.map((seg, i) => {
                    const pct = (seg.value / total) * 100;
                    const len = (pct / 100) * circ;
                    const off = -(seg.startPct / 100) * circ;
                    return (
                        <motion.circle
                            key={seg.label}
                            cx={size / 2} cy={size / 2} r={r}
                            fill="none" stroke={seg.color} strokeWidth={sw}
                            strokeDasharray={`${len} ${circ - len}`}
                            strokeDashoffset={off}
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : undefined}
                            transition={{ duration: 0.5, delay: 1.1 + i * 0.06, ease: EASE }}
                        />
                    );
                })}
            </g>
            {/* Labels on segments — NOT inside the rotated group so text stays upright */}
            {segments.map(seg => {
                if (seg.value < 3) return null;
                const angle = (seg.midPct / 100) * 2 * Math.PI - Math.PI / 2;
                // Round to 2 decimals — Math.sin/cos can return values that differ
                // by 1 ULP between Node (server) and browser (client), causing
                // hydration mismatches when React serializes them as DOM attrs.
                const lx = Math.round((size / 2 + r * Math.cos(angle)) * 100) / 100;
                const ly = Math.round((size / 2 + r * Math.sin(angle)) * 100) / 100;
                return (
                    <text
                        key={`lbl-${seg.label}`}
                        x={lx} y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="white"
                        fontSize="7"
                        fontWeight="bold"
                        style={{ fontFamily: 'var(--font-dashboard-mono)', pointerEvents: 'none' }}
                    >
                        {seg.label}: {seg.value}
                    </text>
                );
            })}
        </svg>
    );
}
