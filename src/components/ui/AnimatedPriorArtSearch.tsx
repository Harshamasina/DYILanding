'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MockupRecordLabel } from './BrowserMockupChrome';

/* ── Animated Prior Art Search mockup — fixed height, loops infinitely ──
   Fixed height container. Timeline per cycle:
     0.8s   Start typing
     ~2.2s  Typing done → search button pulses
     ~2.8s  Cards + ALL metadata fade in together
     ~4.4s  Details button highlights (pulse/ring)
     ~5.2s  First card expands, 4 collapsed dropdown rows appear
     ~5.9s  Bibliographic Data opens, data table slides in
     ~8.1s  Biblio closes
     ~8.7s  Abstract opens, paragraph fades in
     ~10.9s Abstract closes — all 4 rows collapsed
     ~11.8s Fade out → reset
   Loops ~13.5s. */

const SEARCH_QUERY = 'Cancer Immunotherapy';

interface TitlePart {
    text: string;
    highlight?: boolean;
}

type StatusTone = 'success' | 'muted' | 'info' | 'warning';

interface SearchResult {
    patentNo: string;
    jurisdiction: string;
    jurisdictionBg: string;
    jurisdictionText: string;
    publicationType: string;
    legalStatus: string;
    legalStatusTone: StatusTone;
    title: TitlePart[];
    applicants: string;
    applicantCount: number;
    inventors: string;
    inventorExtra: number;
    citedBy: number;
    familySize: number;
    ipcCodes: string[];
    extraCodes?: number;
    cpcClasses: string[];
    lensId: string;
    docKey: string;
    matchedOn: readonly string[];
    publishedOffsetDays: number;
    filedOffsetDays: number;
    priorityOffsetDays: number;
}

const RESULTS: SearchResult[] = [
    {
        patentNo: 'WO2026048712A1',
        jurisdiction: 'WO',
        jurisdictionBg: '#dbeafe',
        jurisdictionText: '#2563eb',
        publicationType: 'PATENT_APPLICATION',
        legalStatus: 'Active',
        legalStatusTone: 'info',
        title: [
            { text: 'Bispecific Antibody Compositions for ' },
            { text: 'Cancer', highlight: true },
            { text: ' ' },
            { text: 'Immunotherapy', highlight: true },
            { text: ' and Methods of Treatment' },
        ],
        applicants: 'NOVARTIS AG [CH]; DANA-FARBER CANCER INSTITUTE INC [US]',
        applicantCount: 4,
        inventors: 'CHEN WEI, SMITH JOHN ROBERT',
        inventorExtra: 3,
        citedBy: 3,
        familySize: 8,
        ipcCodes: ['A61K 39/ 395', 'A61P 35/ 00', 'C07K 16/ 28'],
        extraCodes: 2,
        cpcClasses: ['A61K39/395', 'A61K2039/505', 'C07K16/2818', 'C07K16/2827', 'A61P35/00', 'C07K2317/31', 'C07K2317/76'],
        lensId: '132-948-206-551-884',
        docKey: 'WO_2026048712_A1_20260328',
        matchedOn: ['Title keyword match', 'Abstract keyword match', 'Claim keyword match'],
        publishedOffsetDays: 17,
        filedOffsetDays: 390,
        priorityOffsetDays: 730,
    },
    {
        patentNo: 'EP4285631B1',
        jurisdiction: 'EP',
        jurisdictionBg: '#ede9fe',
        jurisdictionText: '#6366f1',
        publicationType: 'GRANTED_PATENT',
        legalStatus: 'Granted',
        legalStatusTone: 'success',
        title: [
            { text: 'Modified NK Cell Compositions With Enhanced Anti-' },
            { text: 'Cancer', highlight: true },
            { text: ' ' },
            { text: 'Immunotherapy', highlight: true },
            { text: ' Activity' },
        ],
        applicants: 'CELLECTIS SA [FR]; INSTITUT CURIE [FR]',
        applicantCount: 2,
        inventors: 'DUBOIS MARIE, MORRISON HENRY',
        inventorExtra: 2,
        citedBy: 12,
        familySize: 15,
        ipcCodes: ['C12N 5/ 0783', 'A61K 35/ 17', 'A61K 40/ 12'],
        extraCodes: 3,
        cpcClasses: ['C12N5/0646', 'A61K35/17', 'C12N2510/00', 'A61K40/11', 'C12N2501/2315'],
        lensId: '084-719-338-602-471',
        docKey: 'EP_4285631_B1_20260315',
        matchedOn: ['Title keyword match', 'Claim keyword match'],
        publishedOffsetDays: 30,
        filedOffsetDays: 975,
        priorityOffsetDays: 1255,
    },
    {
        patentNo: 'US20260078423A1',
        jurisdiction: 'US',
        jurisdictionBg: '#ede9fe',
        jurisdictionText: '#6366f1',
        publicationType: 'PATENT_APPLICATION',
        legalStatus: 'Pending',
        legalStatusTone: 'warning',
        title: [
            { text: 'Nanoparticle Drug Delivery Systems for Targeted ' },
            { text: 'Cancer', highlight: true },
            { text: ' ' },
            { text: 'Immunotherapy', highlight: true },
            { text: ' Applications' },
        ],
        applicants: 'MASSACHUSETTS INST TECHNOLOGY [US]; BRIGHAM AND WOMENS HOSPITAL INC [US]',
        applicantCount: 2,
        inventors: 'LANGER ROBERT S, FAROKHZAD OMID',
        inventorExtra: 4,
        citedBy: 7,
        familySize: 6,
        ipcCodes: ['A61K 9/ 51', 'A61K 47/ 69', 'A61P 35/ 04'],
        extraCodes: 2,
        cpcClasses: ['A61K9/5107', 'A61K47/6929', 'A61K9/5169', 'A61P35/04'],
        lensId: '201-650-847-993-128',
        docKey: 'US_20260078423_A1_20260312',
        matchedOn: ['Title keyword match', 'Abstract keyword match'],
        publishedOffsetDays: 33,
        filedOffsetDays: 575,
        priorityOffsetDays: 880,
    },
];

const ABSTRACT_TEXT =
    'The present invention relates to bispecific antibody compositions that simultaneously bind programmed death-ligand 1 (PD-L1) and a tumor-associated antigen, thereby enhancing T-cell mediated anti-tumor immunity. The compositions demonstrate synergistic efficacy in combination with checkpoint inhibitor therapy across multiple solid tumor models.';

/* ── Static date fallbacks (used during SSR to avoid hydration mismatch) ── */
const STATIC_DATE_FALLBACK = {
    published: ['2026-03-28', '2026-03-15', '2026-03-12'],
    filed: ['2025-03-21', '2023-08-12', '2024-09-18'],
    priority: ['2024-04-15', '2022-11-03', '2023-11-22'],
};

function offsetDateISO(days: number, base: Date): string {
    const d = new Date(base);
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
}

/* ── Status pill colours ── */
const STATUS_TONES: Record<StatusTone, { bg: string; color: string }> = {
    success: { bg: '#dcfce7', color: '#15803d' },
    muted:   { bg: '#f1f5f9', color: '#64748b' },
    info:    { bg: '#dbeafe', color: '#2563eb' },
    warning: { bg: '#fef3c7', color: '#b45309' },
};

/* ── Timing ──
   The loop starts and rests on populated results, so the figure is never an
   empty pane under a result count. It ends by retyping the query over the
   visible results, then the next cycle opens on the same results again. */
const TYPE_SPEED = 50;
const HOVER_IN = 1600;
const EXPAND_IN = HOVER_IN + 800;
const BIBLIO_OPEN = EXPAND_IN + 700;
const BIBLIO_CLOSE = BIBLIO_OPEN + 2200;
const ABSTRACT_OPEN = BIBLIO_CLOSE + 600;
const ABSTRACT_CLOSE = ABSTRACT_OPEN + 2200;
const RETYPE_START = ABSTRACT_CLOSE + 900;
const SEARCH_DONE = RETYPE_START + SEARCH_QUERY.length * TYPE_SPEED + 300;
const LOOP_TIME = SEARCH_DONE + 600;

const MOCKUP_HEIGHT = 'h-[440px] sm:h-[480px] lg:h-[520px]';

type Phase =
    | 'typing' | 'searched' | 'results'
    | 'hover' | 'expanded'
    | 'biblio' | 'between' | 'abstract' | 'rest';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export function AnimatedPriorArtSearch() {
    /* First frame (and the reduced-motion frame): the query typed and its
       results showing. */
    const [typedText, setTypedText] = useState(SEARCH_QUERY);
    const [phase, setPhase] = useState<Phase>('results');
    const reduceMotion = useReducedMotion();

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const dates = useMemo(() => {
        if (!mounted) return STATIC_DATE_FALLBACK;
        const today = new Date();
        return {
            published: RESULTS.map(r => offsetDateISO(r.publishedOffsetDays, today)),
            filed:     RESULTS.map(r => offsetDateISO(r.filedOffsetDays, today)),
            priority:  RESULTS.map(r => offsetDateISO(r.priorityOffsetDays, today)),
        };
    }, [mounted]);

    const runCycle = useCallback(() => {
        setTypedText(SEARCH_QUERY);
        setPhase('results');

        const timers: ReturnType<typeof setTimeout>[] = [];

        timers.push(setTimeout(() => setPhase('hover'), HOVER_IN));
        timers.push(setTimeout(() => setPhase('expanded'), EXPAND_IN));
        timers.push(setTimeout(() => setPhase('biblio'), BIBLIO_OPEN));
        timers.push(setTimeout(() => setPhase('between'), BIBLIO_CLOSE));
        timers.push(setTimeout(() => setPhase('abstract'), ABSTRACT_OPEN));
        timers.push(setTimeout(() => setPhase('rest'), ABSTRACT_CLOSE));

        let charIndex = 0;
        timers.push(setTimeout(() => {
            setTypedText('');
            setPhase('typing');
            const interval = setInterval(() => {
                charIndex++;
                setTypedText(SEARCH_QUERY.slice(0, charIndex));
                if (charIndex >= SEARCH_QUERY.length) clearInterval(interval);
            }, TYPE_SPEED);
            timers.push(interval as unknown as ReturnType<typeof setTimeout>);
        }, RETYPE_START));

        timers.push(setTimeout(() => setPhase('searched'), SEARCH_DONE));

        return timers;
    }, []);

    useEffect(() => {
        /* Reduced motion: keep the populated first frame, no loop. */
        if (reduceMotion) return;
        let timers = runCycle();
        const interval = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, LOOP_TIME);
        return () => { timers.forEach(clearTimeout); clearInterval(interval); };
    }, [runCycle, reduceMotion]);

    /* ── Derived ── */
    const isTyping = phase === 'typing';
    const showCursor = phase === 'typing';
    /* The results stay on screen while the query is retyped, so the count
       and filters never sit above an empty pane. */
    const searchDone = true;
    const showResults = true;
    const hoverHighlight = phase === 'hover';
    const isExpanded = ['expanded', 'biblio', 'between', 'abstract', 'rest'].includes(phase);
    const biblioOpen = phase === 'biblio';
    const abstractOpen = phase === 'abstract';

    return (
        <div
            aria-hidden="true"
            role="img"
            className={`relative flex flex-col rounded-xl border border-card-border bg-[#f8f8fa] shadow-2xl shadow-black/10 overflow-hidden select-none ${MOCKUP_HEIGHT}`}
        >
            {/* ── Chrome Bar ── */}
            <div className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-white border-b border-card-border">
                <MockupRecordLabel record="DEMO-PAS-001" screen="Patent search" />
                <div className="hidden sm:flex flex-1 min-w-0 justify-end">
                    <div className="flex items-center gap-1.5 px-2 sm:px-4 py-0.5 sm:py-1 bg-page-bg-alt rounded-lg text-[10px] sm:text-[11px] text-text-muted border border-card-border" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-success hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        app.designyourinvention.com
                    </div>
                </div>
            </div>

            {/* ── Patent Search Header ── */}
            <div className="px-3 sm:px-5 pt-2.5 sm:pt-3 pb-2 sm:pb-2.5 bg-white border-b border-card-border">
                <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                    <span className="text-[10px] sm:text-sm font-bold text-text-primary" style={{ fontFamily: 'var(--font-dashboard)' }}>Patent Search</span>
                    <div className="hidden sm:flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[9px] text-text-secondary border border-card-border rounded-md px-2 py-1 bg-white" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            Add Manually
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[9px] text-text-secondary border border-card-border rounded-md px-2 py-1 bg-white" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            Hide Search
                        </span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 sm:py-1.5 rounded-lg border border-card-border bg-page-bg-alt shrink-0">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" /></svg>
                        <span className="text-[10px] sm:text-[10px] text-text-secondary font-medium" style={{ fontFamily: 'var(--font-dashboard)' }}>Full Text</span>
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-1 px-2 py-1 sm:py-1.5 rounded-lg border bg-white min-w-0 h-[22px] sm:h-[28px] transition-colors" style={{ borderColor: isTyping || typedText ? '#6366f1' : 'var(--color-card-border, #e2e8f0)' }}>
                        <span className="text-[10px] sm:text-[11px] text-text-primary truncate" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            {typedText}
                            {showCursor && (
                                <span className="inline-block w-px h-[10px] sm:h-[13px] bg-text-primary ml-px align-middle" style={{ animation: 'blink-cursor 0.8s step-end infinite' }} />
                            )}
                        </span>
                        {typedText && (
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-text-muted shrink-0 cursor-default" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.707 7.707a1 1 0 011.414 0L10 8.586l.879-.879a1 1 0 111.414 1.414L11.414 10l.879.879a1 1 0 01-1.414 1.414L10 11.414l-.879.879a1 1 0 01-1.414-1.414L8.586 10l-.879-.879a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <motion.span
                        className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[10px] font-semibold text-white shrink-0 cursor-default"
                        style={{ fontFamily: 'var(--font-dashboard-mono)', backgroundColor: '#6366f1' }}
                        animate={
                            phase === 'searched'
                                ? { opacity: 1, scale: [1, 1.1, 1] }
                                : { opacity: searchDone || isTyping ? 1 : 0.5, scale: 1 }
                        }
                        transition={{ duration: 0.3 }}
                    >Search</motion.span>
                </div>
            </div>

            {/* ── Filters row: Filters + Clear | Tips ── */}
            <div
                className="px-3 sm:px-5 py-1.5 sm:py-2 bg-white border-b border-card-border flex items-center justify-between transition-opacity duration-200"
                style={{ opacity: searchDone ? 1 : 0 }}
            >
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[9px] text-text-secondary border border-card-border rounded-md px-1.5 py-0.5 bg-white cursor-default" style={{ fontFamily: 'var(--font-dashboard)' }}>
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        Filters
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[9px] font-medium cursor-default" style={{ fontFamily: 'var(--font-dashboard)', color: '#dc2626' }}>
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" /></svg>
                        Clear
                    </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[9px] text-text-secondary cursor-default" style={{ fontFamily: 'var(--font-dashboard)' }}>
                    <svg className="w-2.5 h-2.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6m-3-3v3m-5.636-5.636a7 7 0 119.9 0C14.936 16.21 14 17.46 14 18.75V19h-4v-.25c0-1.29-.936-2.54-1.636-3.386z" /></svg>
                    Tips
                </span>
            </div>

            {/* ── Results count + Sort + Pagination ── */}
            <div
                className="px-3 sm:px-5 py-1.5 sm:py-2 bg-white border-b border-card-border flex items-center justify-between gap-2 transition-opacity duration-200"
                style={{ opacity: searchDone ? 1 : 0 }}
            >
                <span className="text-[10px] sm:text-[9px] text-text-muted truncate" style={{ fontFamily: 'var(--font-dashboard)' }}>
                    Showing <span className="text-text-primary font-medium">1&ndash;20</span> of <span className="text-text-primary font-medium">185,744</span> results
                    <span className="hidden sm:inline"> &middot; max score <span className="text-text-primary font-medium">25.9</span></span>
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] sm:text-[9px] text-text-muted" style={{ fontFamily: 'var(--font-dashboard)' }}>
                        Sort by
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 border border-card-border rounded text-text-primary font-medium">
                            Relevance
                            <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                    </span>
                    <div className="hidden sm:flex items-center gap-0.5">
                        {['1', '2', '3', '4', '5', '…', '500'].map((p) => (
                            <span
                                key={p}
                                className="text-[10px] sm:text-[9px] px-1 py-0.5 rounded border min-w-[14px] text-center"
                                style={{
                                    fontFamily: 'var(--font-dashboard)',
                                    borderColor: p === '1' ? '#6366f1' : 'var(--color-card-border, #e2e8f0)',
                                    color: p === '1' ? '#6366f1' : 'var(--color-text-muted, #94a3b8)',
                                    fontWeight: p === '1' ? 600 : 400,
                                }}
                            >{p}</span>
                        ))}
                    </div>
                    <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[9px] px-1.5 py-0.5 border border-card-border rounded text-text-secondary" style={{ fontFamily: 'var(--font-dashboard)' }}>
                        20 / page
                        <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                </div>
            </div>

            {/* ── Results area ── */}
            <div className="flex-1 px-3 sm:px-5 py-2 sm:py-3 overflow-hidden relative">
                {/* Placeholder */}
                {!showResults && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-text-muted/20 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-[10px] sm:text-[10px] text-text-muted/40 text-center" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            Search across 100+ patent jurisdictions by keyword, inventor, applicant, or patent number
                        </p>
                    </div>
                )}

                <div className="space-y-2 sm:space-y-2.5">
                {RESULTS.map((result, i) => {
                    const tone = STATUS_TONES[result.legalStatusTone];
                    const expandThisCard = i === 0 && isExpanded;
                    const highlightThisDetails = i === 0 && hoverHighlight;
                    return (
                    <div
                        key={result.patentNo}
                        className="bg-white rounded-lg border border-card-border p-2.5 sm:p-3.5 transition-opacity duration-300"
                        style={{
                            opacity: showResults ? 1 : 0,
                            transitionDelay: showResults ? `${i * 100}ms` : '0ms',
                        }}
                    >
                        {/* Patent header row */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm border border-text-muted/40 bg-white shrink-0" />
                                <span className="text-[10px] sm:text-[11px] font-bold text-text-primary shrink-0" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>{result.patentNo}</span>
                                <span className="text-[10px] sm:text-[8px] px-1.5 py-0.5 rounded-full font-semibold shrink-0" style={{ backgroundColor: result.jurisdictionBg, color: result.jurisdictionText }}>{result.jurisdiction}</span>
                                <span className="text-[10px] sm:text-[8px] px-1.5 py-0.5 rounded-full font-semibold shrink-0" style={{ backgroundColor: '#fef3c7', color: '#b45309', fontFamily: 'var(--font-dashboard-mono)' }}>{result.publicationType}</span>
                                <span className="text-[10px] sm:text-[8px] px-1.5 py-0.5 rounded-full font-semibold shrink-0" style={{ backgroundColor: tone.bg, color: tone.color }}>{result.legalStatus}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <motion.span
                                    className="hidden sm:inline-flex items-center gap-0.5 text-[10px] sm:text-[9px] rounded-md px-1.5 py-0.5 cursor-default"
                                    style={{ fontFamily: 'var(--font-dashboard)' }}
                                    animate={{
                                        backgroundColor: highlightThisDetails ? '#eef2ff' : '#ffffff',
                                        color: highlightThisDetails ? '#4f46e5' : 'var(--color-text-secondary, #64748b)',
                                        borderColor: highlightThisDetails ? '#6366f1' : 'var(--color-card-border, #e2e8f0)',
                                        boxShadow: highlightThisDetails ? '0 0 0 2px rgba(99,102,241,0.25)' : '0 0 0 0px rgba(99,102,241,0)',
                                        scale: highlightThisDetails ? [1, 1.06, 1] : 1,
                                    }}
                                    transition={{ duration: 0.4, scale: { duration: 0.9, repeat: highlightThisDetails ? Infinity : 0 } }}
                                    // border defined via inline style — motion doesn't animate className borders
                                >
                                    {expandThisCard ? (
                                        <><svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>Hide</>
                                    ) : (
                                        <><svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>Details</>
                                    )}
                                </motion.span>
                                <svg className="hidden sm:block w-2.5 h-2.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                <span className="text-[10px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md font-semibold text-white cursor-default" style={{ fontFamily: 'var(--font-dashboard-mono)', backgroundColor: '#6366f1' }}>+ Save</span>
                            </div>
                        </div>

                        {/* Title */}
                        <p className="text-[10px] sm:text-[10px] text-text-primary font-medium leading-snug mb-1" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            {result.title.map((part, pi) =>
                                part.highlight
                                    ? <span key={pi} className="text-primary underline decoration-primary/30">{part.text}</span>
                                    : <span key={pi}>{part.text}</span>
                            )}
                        </p>

                        {/* Applicants + Inventors */}
                        <p className="flex items-center gap-1 text-[10px] sm:text-[8px] text-text-muted leading-snug truncate" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" /></svg>
                            <span className="truncate">{result.applicants}</span>
                            <span className="text-text-muted/70 shrink-0">({result.applicantCount})</span>
                        </p>
                        <p className="flex items-center gap-1 text-[10px] sm:text-[8px] text-text-muted leading-snug truncate mb-1.5" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            <span className="truncate">Inventors: {result.inventors}</span>
                            <span className="text-primary shrink-0">+{result.inventorExtra} more</span>
                        </p>

                        {/* Metadata pills */}
                        <div className="flex items-center gap-1 flex-wrap mb-1.5" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            <MetaPill icon="calendar" label="Published" value={dates.published[i]} />
                            <MetaPill icon="clock" label="Filed" value={dates.filed[i]} />
                            <MetaPill icon="timer" label="Priority" value={dates.priority[i]} />
                            <MetaPill icon="link" label="Cited by" value={String(result.citedBy)} />
                            <MetaPill icon="tree" label="Family" value={String(result.familySize)} />
                        </div>

                        {/* IPC codes */}
                        <div className="flex items-center gap-1 flex-wrap">
                            {result.ipcCodes.map((code) => (
                                <span
                                    key={code}
                                    className="text-[10px] sm:text-[7px] px-1 sm:px-1.5 py-0.5 rounded bg-page-bg-alt border border-card-border text-text-secondary"
                                    style={{ fontFamily: 'var(--font-dashboard-mono)' }}
                                >{code}</span>
                            ))}
                            {result.extraCodes && (
                                <span
                                    className="text-[10px] sm:text-[7px] text-primary font-medium"
                                    style={{ fontFamily: 'var(--font-dashboard-mono)' }}
                                >+{result.extraCodes} more</span>
                            )}
                        </div>

                        {/* Why this matched */}
                        <div className="flex items-center gap-1 flex-wrap mt-1.5" style={{ fontFamily: 'var(--font-dashboard)' }}>
                            <span className="text-[10px] sm:text-[8px] text-text-muted">Why this matched:</span>
                            {result.matchedOn.map((match) => (
                                <span
                                    key={match}
                                    className="text-[10px] sm:text-[7px] px-1 sm:px-1.5 py-0.5 rounded"
                                    style={{ backgroundColor: '#dcfce7', color: '#15803d' }}
                                >{match}</span>
                            ))}
                        </div>

                        {/* Expanded panel (first card, slides down) */}
                        <AnimatePresence initial={false}>
                            {expandThisCard && (
                                <motion.div
                                    key="expanded"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-2 sm:mt-2.5 border-t border-card-border pt-1.5">
                                        {/* Bibliographic Data row */}
                                        <SectionRow label="Bibliographic Data" open={biblioOpen} bold />
                                        <AnimatePresence initial={false}>
                                            {biblioOpen && (
                                                <motion.div
                                                    key="biblio"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="py-1.5 sm:py-2 px-1">
                                                        <div className="grid grid-cols-6 border border-card-border rounded overflow-hidden text-[10px] sm:text-[7px]">
                                                            {/* Row 1 */}
                                                            <BiblioLabel delay={0}>Title</BiblioLabel>
                                                            <BiblioValue delay={20} span={3}>{result.title.map(p => p.text).join('').toUpperCase()}</BiblioValue>
                                                            <BiblioLabel delay={40}>Applicants</BiblioLabel>
                                                            <BiblioValue delay={60}>{result.applicants}</BiblioValue>
                                                            {/* Row 2 */}
                                                            <BiblioLabel delay={80}>Inventors</BiblioLabel>
                                                            <BiblioValue delay={100}>{result.inventors}</BiblioValue>
                                                            <BiblioLabel delay={120}>Publication No.</BiblioLabel>
                                                            <BiblioValue delay={140} mono>{result.patentNo}</BiblioValue>
                                                            <BiblioLabel delay={160}>Document Key</BiblioLabel>
                                                            <BiblioValue delay={180} mono>{result.docKey}</BiblioValue>
                                                            {/* Row 3 */}
                                                            <BiblioLabel delay={200}>Lens ID</BiblioLabel>
                                                            <BiblioValue delay={220} mono>{result.lensId}</BiblioValue>
                                                            <BiblioLabel delay={240}>Claims Source Lens ID</BiblioLabel>
                                                            <BiblioValue delay={260}>&mdash;</BiblioValue>
                                                            <BiblioLabel delay={280}>Jurisdiction</BiblioLabel>
                                                            <BiblioValue delay={300}>{result.jurisdiction}</BiblioValue>
                                                            {/* Row 4 */}
                                                            <BiblioLabel delay={320}>Publication Type</BiblioLabel>
                                                            <BiblioValue delay={340} mono>{result.publicationType}</BiblioValue>
                                                            <BiblioLabel delay={360}>Legal Status</BiblioLabel>
                                                            <BiblioValue delay={380}>{result.legalStatus.toUpperCase()}</BiblioValue>
                                                            <BiblioLabel delay={400}>Filing Date</BiblioLabel>
                                                            <BiblioValue delay={420} mono>{dates.filed[0]}</BiblioValue>
                                                            {/* Row 5 */}
                                                            <BiblioLabel delay={440}>Publication Date</BiblioLabel>
                                                            <BiblioValue delay={460} mono>{dates.published[0]}</BiblioValue>
                                                            <BiblioLabel delay={480}>Priority Date</BiblioLabel>
                                                            <BiblioValue delay={500} mono>{dates.priority[0]}</BiblioValue>
                                                            <BiblioLabel delay={520}>Cited By</BiblioLabel>
                                                            <BiblioValue delay={540}>{result.citedBy}</BiblioValue>
                                                            {/* Row 6 */}
                                                            <BiblioLabel delay={560}>Family Size</BiblioLabel>
                                                            <BiblioValue delay={580}>{result.familySize}</BiblioValue>
                                                            <BiblioLabel delay={600}>IPC Classes</BiblioLabel>
                                                            <BiblioValue delay={620} span={3}>
                                                                <div className="flex items-center gap-1 flex-wrap">
                                                                    {result.ipcCodes.map((code) => (
                                                                        <span
                                                                            key={code}
                                                                            className="px-1 sm:px-1.5 py-0.5 rounded bg-page-bg-alt border border-card-border text-text-secondary"
                                                                            style={{ fontFamily: 'var(--font-dashboard-mono)' }}
                                                                        >{code}</span>
                                                                    ))}
                                                                </div>
                                                            </BiblioValue>
                                                            {/* Row 7 */}
                                                            <BiblioLabel delay={640} noBottomBorder>CPC Classes</BiblioLabel>
                                                            <BiblioValue delay={660} span={5} noBottomBorder>
                                                                <div className="flex items-center gap-1 flex-wrap">
                                                                    {result.cpcClasses.map((cpc, ci) => (
                                                                        <motion.span
                                                                            key={cpc}
                                                                            initial={{ opacity: 0, y: -2 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ duration: 0.2, delay: 0.66 + ci * 0.03 }}
                                                                            className="px-1 sm:px-1.5 py-0.5 rounded bg-page-bg-alt border border-card-border text-text-secondary"
                                                                            style={{ fontFamily: 'var(--font-dashboard-mono)' }}
                                                                        >{cpc}</motion.span>
                                                                    ))}
                                                                </div>
                                                            </BiblioValue>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Abstract row */}
                                        <SectionRow label="Abstract" open={abstractOpen} bold />
                                        <AnimatePresence initial={false}>
                                            {abstractOpen && (
                                                <motion.div
                                                    key="abstract"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pl-4 sm:pl-5 py-1.5 sm:py-2 border-b border-card-border/40">
                                                        <motion.p
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ duration: 0.5, delay: 0.15 }}
                                                            className="text-[10px] sm:text-[8px] text-text-secondary leading-relaxed"
                                                            style={{ fontFamily: 'var(--font-dashboard)' }}
                                                        >
                                                            {ABSTRACT_TEXT}
                                                        </motion.p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Claims row (always collapsed) */}
                                        <SectionRow label="Claims" open={false} />
                                        {/* Family Members row (always collapsed) */}
                                        <SectionRow label={`Family Members (${result.familySize})`} open={false} last />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    );
                })}
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#f8f8fa] to-transparent pointer-events-none rounded-b-xl" />

            <style>{`@keyframes blink-cursor { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }`}</style>
        </div>
    );
}

/* ── Metadata pill ── */
type MetaIcon = 'calendar' | 'clock' | 'timer' | 'link' | 'tree';

const META_ICON_PATHS: Record<MetaIcon, string> = {
    calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    timer: 'M10 2h4m-2 8v4l3 2m5-6a8 8 0 11-16 0 8 8 0 0116 0z',
    link: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
    tree: 'M12 4v4m0 0l-4 4m4-4l4 4m-4 4v4m-4-4H4m16 0h-4',
};

function MetaPill({ icon, label, value }: { icon: MetaIcon; label: string; value: string }) {
    return (
        <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 rounded border border-card-border bg-white text-text-secondary">
            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={META_ICON_PATHS[icon]} />
            </svg>
            <span className="text-text-muted">{label}</span>
            <span className="font-semibold text-text-primary" style={{ fontFamily: 'var(--font-dashboard-mono)' }}>{value}</span>
        </span>
    );
}

/* ── Collapsible section header (Biblio / Abstract / Claims / Family Members) ── */
function SectionRow({ label, open, bold, last }: { label: string; open: boolean; bold?: boolean; last?: boolean }) {
    return (
        <div className={`flex items-center gap-1.5 py-1 sm:py-1.5 ${last ? '' : 'border-b border-card-border/40'}`}>
            <motion.svg
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-text-muted shrink-0"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                animate={{ rotate: open ? 0 : -90 }}
                transition={{ duration: 0.25 }}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
            <span className={`text-[10px] sm:text-[9px] text-text-secondary ${bold ? 'font-semibold' : ''}`} style={{ fontFamily: 'var(--font-dashboard)' }}>{label}</span>
        </div>
    );
}

/* ── Bibliographic data table cells (6-col grid) ── */
const SPAN_CLASS: Record<number, string> = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
};

function BiblioLabel({ children, delay, span = 1, noBottomBorder }: { children: React.ReactNode; delay: number; span?: number; noBottomBorder?: boolean }) {
    return (
        <motion.div
            className={`${SPAN_CLASS[span]} bg-page-bg-alt border-r border-card-border px-1.5 py-1 text-text-muted ${noBottomBorder ? '' : 'border-b'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: delay / 1000 }}
            style={{ fontFamily: 'var(--font-dashboard)' }}
        >
            {children}
        </motion.div>
    );
}

function BiblioValue({ children, delay, span = 1, mono, noBottomBorder }: { children: React.ReactNode; delay: number; span?: number; mono?: boolean; noBottomBorder?: boolean }) {
    return (
        <motion.div
            className={`${SPAN_CLASS[span]} bg-white border-r border-card-border px-1.5 py-1 text-text-primary font-medium truncate ${noBottomBorder ? '' : 'border-b'}`}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: delay / 1000 }}
            style={{ fontFamily: mono ? 'var(--font-dashboard-mono)' : 'var(--font-dashboard)' }}
        >
            {children}
        </motion.div>
    );
}
