'use client';

import { useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import { MockupRecordLabel } from './BrowserMockupChrome';

/* ── Animated AI Draft Generation mockup ──
   Three-column workspace: Draft Workspace sidebar | Main panel | Review panel.
   Phase machine cycles, never through an empty workspace:
     claims (0)      Claim 1 selected, claim tree + review populated
     menu (3200)     3-dot menu opens on Claim 1
     claims (5000)   menu closes, back to claims view
     desc (6000)     sidebar selection moves to Description, content swaps
     loop (10800)    back to claims, which is also the first and the
                     reduced-motion frame.
*/

interface SidebarItem {
    id: string;
    label: string;
    count?: number;
    badge?: string;
    badgeColor?: string;
    badgeBg?: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
    { id: 'summary', label: 'Draft Summary' },
    { id: 'claims', label: 'Claims', count: 26, badge: 'Medium', badgeColor: '#d97706', badgeBg: '#fef3c7' },
    { id: 'abstract', label: 'Abstract', badge: 'High', badgeColor: '#059669', badgeBg: '#d1fae5' },
    { id: 'description', label: 'Description', badge: 'High', badgeColor: '#059669', badgeBg: '#d1fae5' },
    { id: 'novelty', label: 'Novelty', badge: 'High', badgeColor: '#059669', badgeBg: '#d1fae5' },
    { id: 'attorney', label: 'Attorney Instructions' },
];

interface ClaimData {
    number: number;
    type: 'Independent' | 'Dependent';
    typeColor: string;
    typeBg: string;
    dependsOn?: number;
    confidence: 'High' | 'Medium';
    confColor: string;
    confBg: string;
    text: string;
}

const CLAIMS: ClaimData[] = [
    {
        number: 1,
        type: 'Independent',
        typeColor: '#2563eb',
        typeBg: '#dbeafe',
        confidence: 'Medium',
        confColor: '#d97706',
        confBg: '#fef3c7',
        text: 'A method for privacy-preserving federated learning across enterprise participants, comprising allocating per-participant differential privacy budgets and aggregating cryptographically attested gradient updates under a secure aggregation protocol.',
    },
    {
        number: 2,
        type: 'Dependent',
        typeColor: '#64748b',
        typeBg: '#f1f5f9',
        dependsOn: 1,
        confidence: 'High',
        confColor: '#059669',
        confBg: '#d1fae5',
        text: 'The method of claim 1, wherein the regulatory-regime-specific minimum noise floor is determined by mapping the declared regulatory regime of each enterprise participant to a registry maintained by the coordinator and storing minimum noise floors corresponding to HIPAA, GDPR, and CCPA.',
    },
    {
        number: 3,
        type: 'Dependent',
        typeColor: '#64748b',
        typeBg: '#f1f5f9',
        dependsOn: 1,
        confidence: 'High',
        confColor: '#059669',
        confBg: '#d1fae5',
        text: 'The method of claim 1, wherein the per-participant trust weight is updated continuously based on the cryptographic attestation received from a trusted execution environment of the participant and on running aggregates of gradient-norm and gradient-direction anomaly scores.',
    },
    {
        number: 4,
        type: 'Dependent',
        typeColor: '#64748b',
        typeBg: '#f1f5f9',
        dependsOn: 1,
        confidence: 'Medium',
        confColor: '#d97706',
        confBg: '#fef3c7',
        text: 'The method of claim 1, further comprising performing secure aggregation under a threshold-cryptography protocol across at least three enterprise participants such that no individual encrypted gradient contribution is decryptable by the coordinator alone.',
    },
    {
        number: 5,
        type: 'Independent',
        typeColor: '#2563eb',
        typeBg: '#dbeafe',
        confidence: 'High',
        confColor: '#059669',
        confBg: '#d1fae5',
        text: 'A system comprising one or more processors and memory storing instructions that, when executed by the processors, cause the system to perform privacy-preserving federated learning under heterogeneous regulatory regimes by allocating per-participant differential privacy budgets and aggregating cryptographically attested gradient updates.',
    },
];

/* ── Group claims so each independent starts its own subtree ── */
const CLAIM_GROUPS: { parent: ClaimData; children: ClaimData[] }[] = (() => {
    const groups: { parent: ClaimData; children: ClaimData[] }[] = [];
    for (const c of CLAIMS) {
        if (c.type === 'Independent') groups.push({ parent: c, children: [] });
        else groups[groups.length - 1]?.children.push(c);
    }
    return groups;
})();

interface DescSection {
    name: string;
    version: string;
    confidence?: 'High' | 'Medium';
    confColor?: string;
    confBg?: string;
    heading: string;
    body: string;
}

const DESC_SECTIONS: DescSection[] = [
    {
        name: 'Technical Field',
        version: 'v2',
        confidence: 'High',
        confColor: '#059669',
        confBg: '#d1fae5',
        heading: 'FIELD OF THE INVENTION',
        body: 'The present invention relates to distributed machine learning systems, and more particularly to federated learning architectures that train shared models across data held by multiple independent enterprise participants operating under heterogeneous regulatory regimes without centralizing the underlying training data at any single location.',
    },
    {
        name: 'Background',
        version: 'v2',
        confidence: 'High',
        confColor: '#059669',
        confBg: '#d1fae5',
        heading: 'BACKGROUND OF THE INVENTION',
        body: 'Federated learning is a distributed paradigm in which multiple parties collaboratively train a shared model while keeping training data local, thereby preserving privacy and competitive sensitivity in cross-enterprise scenarios such as pharmaceutical drug discovery and financial fraud detection.',
    },
    {
        name: 'Summary',
        version: 'v3',
        confidence: 'Medium',
        confColor: '#d97706',
        confBg: '#fef3c7',
        heading: 'SUMMARY OF THE INVENTION',
        body: 'A method, system, and non-transitory computer-readable medium for cross-enterprise federated learning under heterogeneous regulatory regimes, allocating per-participant differential privacy budgets via a regulatory-regime registry maintained by the coordinator and aggregating cryptographically attested gradient updates.',
    },
    {
        name: 'Detailed Description',
        version: 'v3',
        confidence: 'High',
        confColor: '#059669',
        confBg: '#d1fae5',
        heading: 'DETAILED DESCRIPTION',
        body: 'In one embodiment, each enterprise participant declares a regulatory regime selected from HIPAA, GDPR, CCPA, DPDPA, and PIPL. The coordinator maps the declared regime to a regime-specific minimum noise floor and allocates a per-participant differential privacy budget under a campaign-total budget constraint.',
    },
];

const ON_THIS_SECTION = ['Technical Field', 'Background', 'Summary', 'Detailed Description', 'Drawings'];

interface MenuItem {
    label: string;
    icon: 'edit' | 'refresh' | 'badge' | 'clock' | 'trash';
    danger?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
    { label: 'Edit', icon: 'edit' },
    { label: 'Regenerate', icon: 'refresh' },
    { label: 'Rescore confidence', icon: 'badge' },
    { label: 'Restore prior', icon: 'clock' },
    { label: 'Delete', icon: 'trash', danger: true },
];

const TOP_TABS = ['Review', 'History'];

/* ── Timings (ms) ── */
const T_MENU_OPEN = 3200;
const T_MENU_CLOSE = 5000;
const T_DESCRIPTION = 6000;
const T_LOOP = 10800;

const MOCKUP_HEIGHT = 'h-[440px] sm:h-[480px] lg:h-[520px]';

type Phase = 'idle' | 'sidebar' | 'claims' | 'menu' | 'description' | 'fadeout';

/* ── Tiny inline icon used in the kebab menu ── */
function MenuIcon({ kind }: { kind: MenuItem['icon'] }) {
    const cn = 'w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0';
    switch (kind) {
        case 'edit':
            return (<svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>);
        case 'refresh':
            return (<svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>);
        case 'badge':
            return (<svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>);
        case 'clock':
            return (<svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
        case 'trash':
            return (<svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
    }
}

/* ── Sidebar item icon ── */
function SidebarIcon({ id, active }: { id: string; active: boolean }) {
    const cn = `w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 ${active ? 'text-primary' : 'text-text-muted'}`;
    if (id === 'novelty') {
        return (<svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>);
    }
    if (id === 'claims') {
        return (<svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>);
    }
    return (<svg className={cn} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function AnimatedAiDraftGeneration() {
    /* Opens on the populated claims view; with reduced motion it stays there. */
    const [phase, setPhase] = useState<Phase>('claims');
    const reduceMotion = useReducedMotion();

    const runCycle = useCallback(() => {
        setPhase('claims');
        const timers: ReturnType<typeof setTimeout>[] = [];
        timers.push(setTimeout(() => setPhase('menu'), T_MENU_OPEN));
        timers.push(setTimeout(() => setPhase('claims'), T_MENU_CLOSE));
        timers.push(setTimeout(() => setPhase('description'), T_DESCRIPTION));
        return timers;
    }, []);

    useEffect(() => {
        if (reduceMotion) return;
        let timers = runCycle();
        const interval = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, T_LOOP);
        return () => { timers.forEach(clearTimeout); clearInterval(interval); };
    }, [runCycle, reduceMotion]);

    /* ── Derived ── */
    const visible = phase !== 'idle' && phase !== 'fadeout';
    const showSidebar = visible;
    const showClaims = phase === 'claims' || phase === 'menu';
    const showDescription = phase === 'description';
    const showMenu = phase === 'menu';
    const selectedSidebar = showClaims ? 'claims' : showDescription ? 'description' : null;
    const showReview = visible;

    return (
        <div
            aria-hidden="true"
            role="img"
            className={`relative rounded-xl border border-card-border bg-[#f8f8fa] shadow-2xl shadow-black/10 overflow-hidden flex flex-col select-none ${MOCKUP_HEIGHT}`}
        >
            {/* ── Chrome Bar ── */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-b border-card-border shrink-0">
                <MockupRecordLabel record="DEMO-COMP-001" screen="AI draft" />
                <div className="hidden sm:flex flex-1 min-w-0 justify-end">
                    <div className="flex items-center gap-1 px-2 sm:px-3 py-0.5 bg-page-bg-alt rounded-md text-[10px] sm:text-[10px] text-text-muted border border-card-border" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-success hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        app.designyourinvention.com
                    </div>
                </div>
            </div>

            {/* ── Workspace Header — single row with full action set ── */}
            <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white border-b border-card-border shrink-0 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 min-w-0 flex-1">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H18a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    </svg>
                    <span className="text-[10px] sm:text-[10px] font-bold text-text-primary truncate" style={{ fontFamily: 'var(--font-dashboard)' }}>
                        DEMO-COMP-001 &middot; Privacy-Preserving Federated Learning
                    </span>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                    {/* v2 · US dropdown */}
                    <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 sm:py-1 rounded border border-card-border bg-white text-text-secondary font-medium" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v10m0-10a3 3 0 100-6 3 3 0 000 6zm0 10a3 3 0 100 6 3 3 0 000-6zm8-7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        v2 &middot; US
                        <svg className="w-1.5 h-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                    {/* + New Draft */}
                    <span className="hidden lg:inline-flex items-center gap-0.5 text-[10px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 sm:py-1 rounded border border-card-border bg-white text-text-secondary font-medium" style={{ fontFamily: 'var(--font-dashboard)' }}>
                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        New Draft
                    </span>
                    {/* Generate AI Draft (purple) */}
                    <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[8px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-semibold text-white shadow-sm" style={{ fontFamily: 'var(--font-dashboard)', background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.3 1.046a1 1 0 011.4 0l1.42 1.42a1 1 0 00.7.293h2.013a1 1 0 011 1V5.77a1 1 0 00.293.707l1.42 1.42a1 1 0 010 1.414l-1.42 1.42a1 1 0 00-.293.707v2.013a1 1 0 01-1 1H14.82a1 1 0 00-.707.293l-1.42 1.42a1 1 0 01-1.414 0l-1.42-1.42a1 1 0 00-.707-.293H7.139a1 1 0 01-1-1V12.43a1 1 0 00-.293-.707l-1.42-1.42a1 1 0 010-1.414l1.42-1.42a1 1 0 00.293-.707V4.759a1 1 0 011-1h2.013a1 1 0 00.707-.293l1.44-1.42z" /></svg>
                        Generate AI Draft
                    </span>
                    {/* Submit for Review */}
                    <span className="hidden lg:inline-flex items-center text-[10px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 sm:py-1 rounded border border-card-border bg-white text-text-secondary font-medium" style={{ fontFamily: 'var(--font-dashboard)' }}>
                        Submit for Review
                    </span>
                    {/* Export DOCX */}
                    <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 sm:py-1 rounded border border-card-border bg-white text-text-secondary font-medium" style={{ fontFamily: 'var(--font-dashboard)' }}>
                        <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export DOCX
                    </span>
                    {/* Kebab */}
                    <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-text-muted shrink-0" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                    {/* Chevron-down */}
                    <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

            {/* ── Three-card body ── */}
            <div className="flex flex-row flex-1 min-h-0 overflow-hidden gap-2 sm:gap-2.5 p-2 sm:p-2.5 bg-[#e9ecf1]">

                {/* ─── Left Card — Draft Workspace ─── */}
                {/* Hidden on phones so the main panel gets the width and its
                    text can stay readable; the unit list returns from sm. */}
                <div className="hidden sm:flex flex-col bg-white border border-card-border rounded-lg shadow-md shadow-black/8 shrink-0 overflow-hidden w-20 sm:w-26 lg:w-32">
                    <div className="px-2 sm:px-2.5 py-2 border-b border-card-border/60 shrink-0">
                        <p className="text-[10px] sm:text-[10px] font-bold text-text-primary leading-tight" style={{ fontFamily: 'var(--font-dashboard)' }}>Draft Workspace</p>
                        <p className="text-[10px] sm:text-[8px] text-text-muted mt-0.5 leading-tight" style={{ fontFamily: 'var(--font-dashboard)' }}>Select a unit to review.</p>
                    </div>
                    <div className="flex-1 overflow-hidden py-1 relative">
                        {/* Idle placeholder */}
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center px-2 pointer-events-none transition-opacity duration-500"
                            style={{ opacity: phase === 'idle' ? 1 : 0 }}
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted/30 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-[10px] sm:text-[8px] text-text-muted/50 text-center leading-tight" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                Workspace
                            </p>
                        </div>
                        {SIDEBAR_ITEMS.map((item, i) => {
                            const isSelected = selectedSidebar === item.id;
                            return (
                                <div
                                    key={item.id}
                                    className={`mx-1 sm:mx-1.5 my-0.5 px-1.5 sm:px-2 py-2 rounded-md flex items-center gap-1 transition-all duration-300 ${
                                        isSelected ? 'bg-primary/10 border border-primary/30' : 'border border-transparent'
                                    }`}
                                    style={{
                                        opacity: showSidebar ? 1 : 0,
                                        transitionDelay: showSidebar ? `${i * 80}ms` : '0ms',
                                    }}
                                >
                                    <SidebarIcon id={item.id} active={isSelected} />
                                    <span
                                        className={`text-[10px] sm:text-[9px] font-medium leading-none truncate flex-1 ${isSelected ? 'text-primary' : 'text-text-primary'}`}
                                        style={{ fontFamily: 'var(--font-dashboard)' }}
                                    >
                                        {item.label}{item.count !== undefined ? ` · ${item.count}` : ''}
                                    </span>
                                    {item.badge && (
                                        <span className="hidden sm:inline-block text-[10px] sm:text-[7px] px-1 py-0.5 rounded font-semibold leading-none shrink-0" style={{ backgroundColor: item.badgeBg, color: item.badgeColor }}>
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* AI Review status footer */}
                    <div
                        className="mx-1.5 mb-1.5 px-1.5 sm:px-2 py-1.5 rounded-md bg-page-bg-alt border border-card-border/60 transition-opacity duration-300"
                        style={{ opacity: showSidebar ? 1 : 0, transitionDelay: showSidebar ? '500ms' : '0ms' }}
                    >
                        <div className="flex items-center gap-1 mb-1">
                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-primary shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.3 1.046a1 1 0 011.4 0l1.42 1.42a1 1 0 00.7.293h2.013a1 1 0 011 1V5.77a1 1 0 00.293.707l1.42 1.42a1 1 0 010 1.414l-1.42 1.42a1 1 0 00-.293.707v2.013a1 1 0 01-1 1H14.82a1 1 0 00-.707.293l-1.42 1.42a1 1 0 01-1.414 0l-1.42-1.42a1 1 0 00-.707-.293H7.139a1 1 0 01-1-1V12.43a1 1 0 00-.293-.707l-1.42-1.42a1 1 0 010-1.414l1.42-1.42a1 1 0 00.293-.707V4.759a1 1 0 011-1h2.013a1 1 0 00.707-.293l1.44-1.42z" /></svg>
                            <span className="text-[10px] sm:text-[8px] font-bold text-text-primary leading-none" style={{ fontFamily: 'var(--font-dashboard)' }}>AI Review</span>
                        </div>
                        <p className="text-[10px] sm:text-[7px] text-text-muted leading-tight mb-1" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>Last run 2h ago</p>
                        <span className="hidden sm:inline-flex items-center text-[10px] sm:text-[7px] px-1 py-0.5 rounded font-semibold leading-none" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>Medium</span>
                    </div>
                </div>

                {/* ─── Main Card ─── */}
                <div className="flex-1 flex flex-col overflow-hidden relative bg-white border border-card-border rounded-lg shadow-md shadow-black/8 min-w-0">

                    {/* ── Idle placeholder — AI sparkles cluster ── */}
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center px-4 pointer-events-none transition-opacity duration-500 z-10"
                        style={{ opacity: phase === 'idle' ? 1 : 0 }}
                    >
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-primary/40 mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 008.279 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a2.63 2.63 0 001.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258a2.63 2.63 0 00-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.63 2.63 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.63 2.63 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[10px] sm:text-[12px] font-semibold text-text-secondary/70 text-center" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            AI Drafting Patent
                        </p>
                        <p className="mt-0.5 text-[10px] sm:text-[9px] text-text-muted/50 text-center leading-tight" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            Generating draft workspace
                        </p>
                    </div>

                    {/* ── Claims View — always rendered, opacity controlled for crossfade ── */}
                    {phase !== 'idle' && (
                        <div
                            className="flex-1 overflow-hidden flex flex-col transition-opacity duration-500"
                            style={{ opacity: (showClaims || showMenu) ? 1 : 0 }}
                        >
                            {/* Toolbar */}
                            <div className="px-2.5 sm:px-3 pt-2 pb-1.5 flex items-center justify-between gap-2 shrink-0">
                                <div className="flex items-center gap-1">
                                    <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[8px] px-1.5 py-0.5 rounded border border-card-border bg-white text-text-secondary font-medium" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                        <svg className="w-1.5 h-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                        Add claim
                                    </span>
                                    <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[8px] px-1.5 py-0.5 rounded border border-card-border bg-white text-text-secondary font-medium" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                        <svg className="w-1.5 h-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                        Reorder
                                    </span>
                                </div>
                                <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[8px] px-1.5 py-0.5 rounded border border-card-border bg-white text-text-secondary" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                    All
                                    <svg className="w-1.5 h-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </span>
                            </div>

                            {/* Claim groups — independent parents with their dependent children */}
                            <div className="flex-1 overflow-hidden px-2.5 sm:px-3 pb-2 space-y-2">
                                {(() => {
                                    let renderIdx = 0;
                                    return CLAIM_GROUPS.map((group, gi) => {
                                        const parentDelay = renderIdx++ * 100;
                                        const isFirstGroup = gi === 0;
                                        return (
                                            <div key={group.parent.number}>
                                                {/* Independent (parent) claim */}
                                                <div
                                                    className="relative transition-opacity duration-300"
                                                    style={{ opacity: showClaims ? 1 : 0, transitionDelay: showClaims ? `${parentDelay}ms` : '0ms' }}
                                                >
                                                    <ClaimCard claim={group.parent} selected={isFirstGroup} />
                                                    {isFirstGroup && showMenu && <KebabMenu />}
                                                </div>

                                                {/* Tree spine + dependents — per-child decoration so spine stops at last connector */}
                                                {group.children.length > 0 && (
                                                    <div>
                                                        {group.children.map((claim, ci) => {
                                                            const childDelay = renderIdx++ * 100;
                                                            const isLastChild = ci === group.children.length - 1;
                                                            return (
                                                                <div
                                                                    key={claim.number}
                                                                    className={`flex items-stretch transition-opacity duration-300 ${isLastChild ? '' : 'pb-1.5'}`}
                                                                    style={{ opacity: showClaims ? 1 : 0, transitionDelay: showClaims ? `${childDelay}ms` : '0ms' }}
                                                                >
                                                                    {/* Tree column */}
                                                                    <div className="relative w-4 sm:w-5 shrink-0">
                                                                        {/* Vertical segment — extends into pb-1.5 gap for non-last so it joins next sibling */}
                                                                        <div
                                                                            className="absolute top-0 left-2 sm:left-2.5 w-px"
                                                                            style={{
                                                                                height: isLastChild ? '14px' : 'calc(100% + 6px)',
                                                                                backgroundColor: '#d97706',
                                                                                opacity: 0.5,
                                                                            }}
                                                                        />
                                                                        {/* Horizontal connector */}
                                                                        <div
                                                                            className="absolute top-3 left-2 sm:left-2.5 right-0 h-px"
                                                                            style={{ backgroundColor: '#d97706', opacity: 0.5 }}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <ClaimCard claim={claim} />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                    )}

                    {/* ── Description View — always rendered, opacity controlled for crossfade ── */}
                    {phase !== 'idle' && (
                        <div
                            className="absolute inset-0 flex flex-col overflow-hidden transition-opacity duration-500"
                            style={{ opacity: showDescription ? 1 : 0, pointerEvents: showDescription ? 'auto' : 'none' }}
                        >
                            <div className="px-2.5 sm:px-3 pt-2 pb-1.5 flex items-center justify-between gap-2 shrink-0">
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>Description</span>
                                    <span className="text-[10px] sm:text-[7px] px-1 py-0.5 rounded font-semibold" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>High</span>
                                    <span className="text-[10px] sm:text-[7px] text-text-muted" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>v3</span>
                                </div>
                                <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[8px] px-1.5 py-0.5 rounded border border-card-border bg-white text-text-secondary font-medium" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                    <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    Rescore all
                                </span>
                            </div>
                            <div className="flex-1 overflow-hidden flex gap-2 px-2.5 sm:px-3 pb-2">
                                {/* Sections */}
                                <div className="flex-1 space-y-1.5 overflow-hidden min-w-0">
                                    {DESC_SECTIONS.map((sec, i) => (
                                        <div
                                            key={sec.name}
                                            className="bg-white rounded border border-card-border p-1.5 sm:p-2 transition-opacity duration-300"
                                            style={{ opacity: showDescription ? 1 : 0, transitionDelay: `${i * 120}ms` }}
                                        >
                                            <div className="flex items-center justify-between gap-1 mb-1 flex-wrap">
                                                <div className="flex items-center gap-1 flex-wrap min-w-0">
                                                    <span className="text-[10px] sm:text-[8px] font-bold uppercase tracking-wider text-text-primary leading-none" style={{ fontFamily: 'var(--font-dashboard)' }}>{sec.name}</span>
                                                    {sec.confidence && (
                                                        <span className="text-[10px] sm:text-[7px] px-1 py-0.5 rounded font-semibold leading-none" style={{ backgroundColor: sec.confBg, color: sec.confColor }}>{sec.confidence}</span>
                                                    )}
                                                    <span className="text-[10px] sm:text-[7px] text-text-muted leading-none" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>{sec.version}</span>
                                                </div>
                                                <div className="flex items-center gap-0.5 shrink-0">
                                                    <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[7px] px-1 py-0.5 rounded font-semibold text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
                                                        <svg className="w-1.5 h-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                        Refine
                                                    </span>
                                                    <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-text-muted" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                                                </div>
                                            </div>
                                            <p className="text-[10px] sm:text-[8px] font-bold text-text-primary mb-0.5" style={{ fontFamily: 'var(--font-dashboard)' }}>{sec.heading}</p>
                                            <p
                                                className="text-[10px] sm:text-[7px] text-text-secondary leading-relaxed"
                                                style={{
                                                    fontFamily: 'var(--font-dashboard)',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                }}
                                            >{sec.body}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* On This Section */}
                                <div className="hidden lg:block w-22 shrink-0 pt-1">
                                    <p className="text-[10px] sm:text-[7px] font-bold uppercase tracking-wider text-text-muted mb-1" style={{ fontFamily: 'var(--font-dashboard)' }}>On This Section</p>
                                    <div className="space-y-1">
                                        {ON_THIS_SECTION.map((s, i) => (
                                            <p
                                                key={s}
                                                className={`text-[10px] sm:text-[8px] leading-tight ${i < 2 ? 'text-primary font-medium' : 'text-text-muted'}`}
                                                style={{ fontFamily: 'var(--font-dashboard)' }}
                                            >{s}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Right Card — Review/History ─── */}
                <div
                    className="hidden md:flex flex-col bg-white border border-card-border rounded-lg shadow-md shadow-black/8 shrink-0 overflow-hidden w-28 lg:w-36"
                >
                    {/* Tabs */}
                    <div
                        className="flex items-center gap-2 px-2 sm:px-2.5 pt-2 border-b border-card-border/60 shrink-0 transition-opacity duration-300"
                        style={{ opacity: showReview ? 1 : 0 }}
                    >
                        {TOP_TABS.map((t, i) => (
                            <span
                                key={t}
                                className={`text-[10px] sm:text-[9px] pb-1.5 border-b-2 ${i === 0 ? 'text-primary border-primary font-semibold' : 'text-text-muted border-transparent'}`}
                                style={{ fontFamily: 'var(--font-dashboard)' }}
                            >{t}</span>
                        ))}
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                        {/* Idle placeholder */}
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center px-2 pointer-events-none transition-opacity duration-500"
                            style={{ opacity: phase === 'idle' ? 1 : 0 }}
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted/30 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <p className="text-[10px] sm:text-[8px] text-text-muted/50 text-center leading-tight" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                AI Review
                            </p>
                        </div>
                        {phase !== 'idle' && (
                            <div className="absolute inset-0 p-2 sm:p-2.5 transition-opacity duration-500" style={{ opacity: (showClaims || showMenu) ? 1 : 0 }}>
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="text-[10px] sm:text-[9px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>Claim 1</span>
                                    <span className="text-[10px] sm:text-[7px] text-text-muted" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>v1</span>
                                </div>
                                <span className="inline-block text-[10px] sm:text-[7px] px-1 py-0.5 rounded font-semibold" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>Medium</span>
                                <p className="mt-1.5 text-[10px] sm:text-[8px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>Rationale</p>
                                <p
                                    className="mt-0.5 text-[10px] sm:text-[7px] text-text-secondary leading-relaxed"
                                    style={{
                                        fontFamily: 'var(--font-dashboard)',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >Recites the core distinguishing limitations (regulatory-regime noise floor, multiplicative trust weight, cross-campaign reliability) per the novelty analysis. Tightly constrained but resists Refs 1+2 combination.</p>
                                <p className="mt-1.5 text-[10px] sm:text-[8px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>Concerns</p>
                                <div className="mt-1 bg-page-bg-alt rounded border border-card-border p-1 sm:p-1.5">
                                    <p
                                        className="text-[10px] sm:text-[7px] text-text-secondary leading-relaxed"
                                        style={{
                                            fontFamily: 'var(--font-dashboard)',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >1. Length and integration of multiple novel features creates narrow scope; consider whether a narrower-element fallback independent claim is warranted.</p>
                                </div>
                                <p className="mt-1.5 text-[10px] sm:text-[8px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>Suggestions</p>
                                <ul className="mt-1 space-y-0.5 text-[10px] sm:text-[7px] text-text-secondary leading-relaxed" style={{ fontFamily: 'var(--font-dashboard)' }}>
                                    <li className="flex items-start gap-1"><span className="text-primary shrink-0">·</span><span>Add narrower fallback dependent claim limiting noise floor by jurisdiction.</span></li>
                                    <li className="flex items-start gap-1"><span className="text-primary shrink-0">·</span><span>Cite WO2025/048712 to distinguish trust-weighting approach.</span></li>
                                </ul>
                            </div>
                        )}
                        {phase !== 'idle' && (
                            <div className="absolute inset-0 p-2 sm:p-2.5 transition-opacity duration-500" style={{ opacity: showDescription ? 1 : 0 }}>
                                <span className="inline-block text-[10px] sm:text-[7px] px-1 py-0.5 rounded font-semibold" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>High</span>
                                <p className="mt-1.5 text-[10px] sm:text-[8px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>Rationale</p>
                                <p
                                    className="mt-0.5 text-[10px] sm:text-[7px] text-text-secondary leading-relaxed"
                                    style={{
                                        fontFamily: 'var(--font-dashboard)',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >Field statement is concise, properly scoped to distributed ML and federated learning, and identifies the specific technical problems (privacy budget, trust calibration, jurisdiction routing) addressed by the claims.</p>
                                <p className="mt-1.5 text-[10px] sm:text-[8px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>Concerns</p>
                                <p className="mt-1 text-[10px] sm:text-[7px] text-text-muted italic" style={{ fontFamily: 'var(--font-dashboard)' }}>No concerns recorded.</p>
                                <p className="mt-1.5 text-[10px] sm:text-[8px] font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>Coverage</p>
                                <div className="mt-1 space-y-1">
                                    <div className="flex items-center justify-between text-[10px] sm:text-[7px]" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                        <span className="text-text-muted">Word count</span>
                                        <span className="text-text-primary font-semibold">1,842</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] sm:text-[7px]" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                        <span className="text-text-muted">Sections</span>
                                        <span className="text-text-primary font-semibold">5 / 5</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] sm:text-[7px]" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                                        <span className="text-text-muted">Last AI run</span>
                                        <span className="text-text-primary font-semibold">2h ago</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function ClaimCard({ claim, selected = false }: { claim: ClaimData; selected?: boolean }) {
    return (
        <div
            className={`relative bg-white rounded border ${selected ? 'border-primary/40 border-l-[3px] border-l-primary' : 'border-card-border'} p-1.5 sm:p-2`}
        >
            <div className="flex items-start justify-between gap-1.5">
                <div className="flex items-center gap-1 flex-wrap min-w-0">
                    <span className="text-[10px] sm:text-[8px] font-bold text-text-primary leading-none" style={{ fontFamily: 'var(--font-dashboard)' }}>Claim {claim.number}</span>
                    <span className="text-[10px] sm:text-[7px] px-1 py-0.5 rounded font-semibold leading-none" style={{ backgroundColor: claim.typeBg, color: claim.typeColor }}>{claim.type}</span>
                    {claim.dependsOn && (
                        <span className="hidden sm:inline text-[10px] sm:text-[7px] text-text-muted leading-none" style={{ fontFamily: 'var(--font-dashboard)' }}>depends on Claim {claim.dependsOn}</span>
                    )}
                    <span className="text-[10px] sm:text-[7px] px-1 py-0.5 rounded font-semibold leading-none" style={{ backgroundColor: claim.confBg, color: claim.confColor }}>{claim.confidence}</span>
                    <span className="text-[10px] sm:text-[7px] text-text-muted leading-none" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>v1</span>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                    <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[7px] px-1 py-0.5 rounded font-semibold text-white" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
                        <svg className="w-1.5 h-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Refine
                    </span>
                    <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-text-muted" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                </div>
            </div>
            <p
                className="text-[10px] sm:text-[8px] text-text-secondary leading-relaxed mt-1"
                style={{
                    fontFamily: 'var(--font-dashboard)',
                    display: '-webkit-box',
                    WebkitLineClamp: claim.type === 'Independent' ? 4 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}
            >{claim.text}</p>
        </div>
    );
}

function KebabMenu() {
    return (
        <div
            className="absolute right-1 top-6 sm:top-7 z-20 bg-white rounded-md border border-card-border shadow-lg overflow-hidden"
            style={{ minWidth: '88px' }}
        >
            {MENU_ITEMS.map((m) => (
                <div
                    key={m.label}
                    className="flex items-center gap-1.5 px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-[8px] hover:bg-page-bg-alt"
                    style={{ fontFamily: 'var(--font-dashboard)' }}
                >
                    <span className={m.danger ? 'text-danger' : 'text-text-secondary'}>
                        <MenuIcon kind={m.icon} />
                    </span>
                    <span className={`font-medium leading-none whitespace-nowrap ${m.danger ? 'text-danger' : 'text-text-primary'}`}>{m.label}</span>
                </div>
            ))}
        </div>
    );
}
