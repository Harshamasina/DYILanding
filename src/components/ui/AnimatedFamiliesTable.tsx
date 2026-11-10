'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MockupRecordLabel } from './BrowserMockupChrome';

/* ── Choreographed patent families table mockup ──
   Matches the real product UI: stat cards, search bar, full table with
   Reference Code, Title, Jurisdiction, Technology Area, Owner, Priority Date, Created.
   Checkboxes animate, then bulk action bar slides in. Loops every ~8s. */

interface FamilyRow {
    ref: string;
    title: string;
    jurisdiction: string;
    techArea: string;
    owner: string;
    priority: string;
    created: string;
    status: string;
    statusColor: string;
}

const FAMILIES: FamilyRow[] = [
    { ref: 'DEMO-2024-011', title: 'Bispecific IgG4 Based Antibody Simultaneously En...', jurisdiction: 'US', techArea: 'Autoimmune Bio...', owner: 'Dustin Biologics', priority: '11 Sep 2024', created: '01 Mar 2025', status: 'Active', statusColor: 'bg-emerald-100 text-emerald-700' },
    { ref: 'DEMO-2024-005', title: 'Heterobifunctional PROTAC Composite Targeting...', jurisdiction: 'EP', techArea: 'Targeted Protein D...', owner: 'Kalispell Therapy...', priority: '19 Oct 2024', created: '14 Feb 2025', status: 'Filed', statusColor: 'bg-primary/10 text-primary' },
    { ref: 'DEMO-2024-001', title: 'Anti-TNF7 Monoclonal Antibody with Albumin...', jurisdiction: 'US', techArea: 'Immuno Oncology', owner: 'Dustin Biologics', priority: '03 Nov 2023', created: '11 Jan 2025', status: 'Active', statusColor: 'bg-emerald-100 text-emerald-700' },
    { ref: 'DEMO-2024-010', title: 'Osmotic Controlled Release Tablet of Dapaglifloz...', jurisdiction: 'JP', techArea: 'Oral Drug Delivery', owner: 'Darth Schmedics...', priority: '22 Apr 2024', created: '08 Mar 2025', status: 'Pending', statusColor: 'bg-amber-100 text-amber-700' },
    { ref: 'DEMO-2022-008', title: 'Injectable Nanoparticle Composing MCT-2a Do...', jurisdiction: 'IN', techArea: 'Nucleic Acid Deliv...', owner: 'Crispate Mfd Pha...', priority: '14 Aug 2022', created: '22 Dec 2024', status: 'Active', statusColor: 'bg-emerald-100 text-emerald-700' },
    { ref: 'DEMO-M003-01', title: 'Microbiome Derived Probiotic Formulation for In...', jurisdiction: 'US', techArea: 'Microbiome Ther...', owner: 'Dustin Biologics', priority: '22 Jul 2026', created: '15 Jun 2025', status: 'Draft', statusColor: 'bg-text-muted/15 text-text-muted' },
    { ref: 'DEMO-0X1-011', title: 'Bioavailable Polymer Shell Eluting Soriimus for...', jurisdiction: 'US', techArea: 'Cardiovascular & ...', owner: 'CordiScope Ther...', priority: '09 Dec 2025', created: '01 Sep 2025', status: 'Filed', statusColor: 'bg-primary/10 text-primary' },
    { ref: 'DEMO-BT5-007', title: 'Lyophilized Bispecific T-cell Engager for Respon...', jurisdiction: 'EP', techArea: 'Immuno Oncology', owner: 'CordiScope Ther...', priority: '17 May 2025', created: '03 Apr 2025', status: 'Active', statusColor: 'bg-emerald-100 text-emerald-700' },
];

const CHECK_TIMES = [1000, 1600, 2200];
const CHECK_ROWS = [0, 2, 4];
const BULK_BAR_TIME = 2800;
const RESET_TIME = 5500;
const LOOP_TIME = 6500;

const MOCKUP_HEIGHT = 'h-[440px] sm:h-[480px] lg:h-[520px]';

export function AnimatedFamiliesTable() {
    const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());
    const [showBulkBar, setShowBulkBar] = useState(false);

    const runCycle = useCallback(() => {
        setCheckedRows(new Set());
        setShowBulkBar(false);

        const timers: ReturnType<typeof setTimeout>[] = [];

        CHECK_TIMES.forEach((time, i) => {
            timers.push(setTimeout(() => {
                setCheckedRows(prev => new Set([...prev, CHECK_ROWS[i]]));
            }, time));
        });

        timers.push(setTimeout(() => setShowBulkBar(true), BULK_BAR_TIME));

        timers.push(setTimeout(() => {
            setCheckedRows(new Set());
            setShowBulkBar(false);
        }, RESET_TIME));

        return timers;
    }, []);

    useEffect(() => {
        let timers = runCycle();
        const interval = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, LOOP_TIME);

        return () => {
            timers.forEach(clearTimeout);
            clearInterval(interval);
        };
    }, [runCycle]);

    const TH = ({ children, className = '' }: { children: string; className?: string }) => (
        <th className={`py-2 pr-3 text-[10px] sm:text-[9px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap ${className}`}
            style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
            {children}
        </th>
    );

    return (
        <div aria-hidden="true" role="img" className={`relative rounded-xl border border-card-border bg-white shadow-2xl shadow-black/10 overflow-hidden mx-auto w-full select-none ${MOCKUP_HEIGHT}`}>
            {/* Chrome Bar */}
            <ChromeBar />

            {/* Stat Cards */}
            <div className="px-3 pt-2.5 pb-1.5 flex gap-2">
                {[
                    { label: 'Total Families', value: '18', color: 'text-primary' },
                    { label: 'Active', value: '18', color: 'text-emerald-600' },
                    { label: 'Inactive', value: '0', color: 'text-text-muted' },
                    { label: 'Added Last 30d', value: '18', color: 'text-primary' },
                ].map(stat => (
                    <div key={stat.label} className="flex-1 px-2.5 py-1.5 rounded-lg border border-card-border">
                        <p className="text-[10px] sm:text-[8px] text-text-muted" style={{ fontFamily: 'var(--font-dashboard)' }}>{stat.label}</p>
                        <p className={`text-base font-bold ${stat.color}`} style={{ fontFamily: 'var(--font-dashboard-mono)' }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="px-3 py-1.5 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-card-border bg-page-bg-alt/50 text-[10px] sm:text-[9px] text-text-muted"
                    style={{ fontFamily: 'var(--font-dashboard)' }}>
                    <svg className="w-3 h-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search by reference, title or technology area...
                </div>
                <div className="flex gap-1">
                    <span className="text-[10px] sm:text-[8px] px-2 py-1.5 rounded-lg border border-card-border text-text-muted font-medium" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                        Layout ▾
                    </span>
                    <span className="text-[10px] sm:text-[8px] px-2 py-1.5 rounded-lg border border-card-border text-text-muted font-medium" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                        Clear Filters
                    </span>
                </div>
            </div>

            {/* Bulk Action Bar */}
            <div className="relative h-7 mx-3">
                <AnimatePresence>
                    {showBulkBar && (
                        <motion.div
                            className="absolute inset-x-0 top-0 flex items-center gap-3 px-3 py-1 rounded-lg bg-primary text-white z-10"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="text-[10px] sm:text-[9px] font-semibold" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                3 selected
                            </span>
                            <div className="flex gap-1.5 ml-auto">
                                {['Export CSV', 'Change Status', 'Delete'].map(action => (
                                    <span key={action} className="text-[10px] sm:text-[8px] px-1.5 py-0.5 rounded bg-white/20 font-medium">
                                        {action}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Table */}
            <div className="px-3 pb-2 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-card-border">
                            <th className="w-8 py-2 pr-2"><div className="w-3 h-3 rounded border border-card-border" /></th>
                            <TH>Reference Code</TH>
                            <TH>Title</TH>
                            <TH className="hidden xl:table-cell">Jurisdiction</TH>
                            <TH className="hidden xl:table-cell">Technology Area</TH>
                            <TH>Priority Date</TH>
                        </tr>
                    </thead>
                    <tbody>
                        {FAMILIES.map((row, i) => {
                            const isChecked = checkedRows.has(i);
                            return (
                                <tr
                                    key={row.ref}
                                    className={`border-b border-card-border/40 transition-colors duration-300 ${
                                        isChecked ? 'bg-primary/[0.04]' : ''
                                    }`}
                                >
                                    <td className="py-2 pr-2">
                                        <motion.div
                                            className={`w-3 h-3 rounded border-[1.5px] flex items-center justify-center transition-colors duration-300 ${
                                                isChecked ? 'bg-primary border-primary' : 'border-card-border bg-white'
                                            }`}
                                            animate={isChecked ? { scale: [1, 1.2, 1] } : {}}
                                            transition={{ duration: 0.25 }}
                                        >
                                            {isChecked && (
                                                <motion.svg className="w-2 h-2 text-white" viewBox="0 0 12 12" fill="none">
                                                    <motion.path
                                                        d="M2.5 6L5 8.5L9.5 3.5"
                                                        stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                                                        initial={{ pathLength: 0 }}
                                                        animate={{ pathLength: 1 }}
                                                        transition={{ duration: 0.25, delay: 0.05 }}
                                                    />
                                                </motion.svg>
                                            )}
                                        </motion.div>
                                    </td>
                                    <td className="py-2 pr-3">
                                        <span className="text-[10px] font-semibold text-primary" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                            {row.ref}
                                        </span>
                                    </td>
                                    <td className="py-2 pr-3">
                                        <span className="text-[10px] text-text-primary font-medium truncate block max-w-[160px]" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                            {row.title}
                                        </span>
                                    </td>
                                    <td className="py-2 pr-3 hidden xl:table-cell">
                                        <span className="text-[10px] sm:text-[9px] text-text-secondary font-medium px-1.5 py-0.5 rounded bg-page-bg-alt" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                            {row.jurisdiction}
                                        </span>
                                    </td>
                                    <td className="py-2 pr-3 hidden xl:table-cell">
                                        <span className="text-[10px] text-text-secondary truncate block max-w-[100px]" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                            {row.techArea}
                                        </span>
                                    </td>
                                    <td className="py-2 pr-3">
                                        <span className="text-[10px] text-text-muted whitespace-nowrap" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                            {row.priority}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-xl" />
        </div>
    );
}

function ChromeBar() {
    return (
        <div className="flex items-center gap-2 px-3 py-2 bg-page-bg-alt border-b border-card-border">
            <MockupRecordLabel record="DEMO-2024-011" screen="Patent families" />
            <div className="hidden sm:flex flex-1 min-w-0 justify-end">
                <div className="flex items-center gap-1.5 px-3 py-0.5 bg-white rounded-md text-[10px] sm:text-[9px] text-text-muted border border-card-border"
                    style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                    <svg className="w-2.5 h-2.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    app.designyourinvention.com
                </div>
            </div>
        </div>
    );
}
