'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bell,
    BookOpen,
    BriefcaseBusiness,
    CalendarDays,
    Check,
    ChevronDown,
    ChevronRight,
    CircleCheck,
    CircleDollarSign,
    Clock3,
    Download,
    FileClock,
    FileSearch,
    FileText,
    Folder,
    Globe2,
    History,
    Import,
    LayoutDashboard,
    LockKeyhole,
    Pill,
    Search,
    Settings,
    ShieldCheck,
    X,
} from 'lucide-react';
import { BrowserMockupChrome } from './BrowserMockupChrome';
import { DATE_ANCHOR, buildDates, useDemoDates, type DemoDates } from '@/lib/office-action-demo-dates';

/* ── Animated Office Action workflow (detail page hero) ──
   A simplified copy of the DYIFrontend office action screens, played as one
   matter moving from examiner rejection to a released filing copy:
     pipeline   (0)      the five analysis stages tick through
     issueMap   (3000)   issues land with legal basis and confidence tags
     claimChart (5500)   issue 1 opens to a limitation, quote and source block
     signModal  (8000)   M. Chen signs the issue map; signed view at 9300
     strategy   (10500)  response tab, a strategy lands on every issue
     claims     (13000)  claim 1 (Currently amended), support passage covers it
     approval   (15700)  checks hold, R. Patel approves, content locks
     exportCopy (18300)  filing copy made; the attorney files and records it
     fadeout    (21600)  reset (22300), loop at 22900ms, matching the
                         AI drafting hero.
   Two attorneys on purpose: the one who revised the draft cannot approve it.
   Matter, references and people are fictional. Model drafting is gated in
   production, so no model-writing control appears. */

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const MOCKUP_HEIGHT = 'h-[520px] sm:h-[620px] lg:h-[700px]';
const MATTER = 'OA-DEMO-118';

type Phase =
    | 'idle'
    | 'pipeline'
    | 'issueMap'
    | 'claimChart'
    | 'signModal'
    | 'strategy'
    | 'claims'
    | 'approval'
    | 'exportCopy'
    | 'fadeout';

interface Frame {
    phase: Phase;
    step: number;
}

/* [ms, phase, step]. A step is a beat inside a phase. */
const TIMELINE: [number, Phase, number][] = [
    [700, 'pipeline', 1],
    [1200, 'pipeline', 2],
    [1700, 'pipeline', 3],
    [2300, 'pipeline', 5],
    [3000, 'issueMap', 0],
    [5500, 'claimChart', 0],
    [6400, 'claimChart', 1],
    [8000, 'signModal', 0],
    [9300, 'signModal', 1],
    [10500, 'strategy', 0],
    [10950, 'strategy', 1],
    [11450, 'strategy', 2],
    [11950, 'strategy', 3],
    [13000, 'claims', 0],
    [14200, 'claims', 1],
    [15700, 'approval', 0],
    [16200, 'approval', 1],
    [16600, 'approval', 2],
    [17400, 'approval', 3],
    [18300, 'exportCopy', 0],
    [19000, 'exportCopy', 1],
    [21600, 'fadeout', 0],
    [22300, 'idle', 0],
];
const T_LOOP = 22900;

/* Reduced motion shows the claim chart: the evidence is the frame that says most. */
const STATIC_FRAME: Frame = { phase: 'claimChart', step: 1 };

const ANALYSIS_PHASES: Phase[] = ['pipeline', 'issueMap', 'claimChart', 'signModal'];

/* Dates come from the shared demo helper, relative to today. */
const DatesContext = createContext<DemoDates>(buildDates(DATE_ANCHOR));

function useDates() {
    return useContext(DatesContext);
}

export function AnimatedOfficeActionWorkflow() {
    const [frame, setFrame] = useState<Frame>({ phase: 'pipeline', step: 0 });
    const [reducedMotion, setReducedMotion] = useState(false);
    const dates = useDemoDates();

    const runCycle = useCallback(() => {
        setFrame({ phase: 'pipeline', step: 0 });
        return TIMELINE.map(([ms, phase, step]) => setTimeout(() => setFrame({ phase, step }), ms));
    }, []);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReducedMotion(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (reducedMotion) {
            setFrame(STATIC_FRAME);
            return;
        }
        let timers = runCycle();
        const interval = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, T_LOOP);
        return () => {
            timers.forEach(clearTimeout);
            clearInterval(interval);
        };
    }, [runCycle, reducedMotion]);

    const { phase, step } = frame;
    const hidden = phase === 'fadeout' || phase === 'idle';
    const inAnalysis = ANALYSIS_PHASES.includes(phase) || phase === 'idle';
    const approver = phase === 'approval' || phase === 'exportCopy' || phase === 'fadeout';

    return (
        <DatesContext.Provider value={dates}>
        <div
            aria-hidden="true"
            role="img"
            className={`relative flex select-none flex-col overflow-hidden rounded-xl border border-card-border bg-[#f8f8fa] shadow-2xl shadow-black/10 [font-family:var(--font-dashboard)] ${MOCKUP_HEIGHT}`}
        >
            <BrowserMockupChrome url={browserUrl(phase)} />
            {/* Same app shell as the docketing hero: sidebar column, then top bar over the page. */}
            <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden sm:grid-cols-[170px_minmax(0,1fr)] lg:grid-cols-[190px_minmax(0,1fr)]">
                <AppSidebar approver={approver} />
                <div className="flex min-w-0 flex-col overflow-hidden">
                    <AppTopBar approver={approver} />
                    <motion.div
                        className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden bg-[#f4f5f7] p-2 sm:gap-2.5 sm:p-3 lg:p-4"
                        animate={{ opacity: hidden ? 0 : 1 }}
                        transition={{ duration: 0.45, ease: EASE }}
                    >
                        <MatterHeader />
                        <MainTabs active={inAnalysis ? 'Analysis' : 'Response'} />
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={inAnalysis ? 'analysis' : 'response'}
                                className="flex min-h-0 flex-1 flex-col gap-2 sm:gap-2.5"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.3, ease: EASE }}
                            >
                                {inAnalysis ? <AnalysisArea phase={phase} step={step} /> : <ResponseArea phase={phase} step={step} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {phase === 'signModal' && step === 0 && <SignAnalysisModal />}
                {phase === 'approval' && step === 2 && <ApproveModal />}
            </AnimatePresence>
        </div>
        </DatesContext.Provider>
    );
}

function browserUrl(phase: Phase) {
    const base = `app.designyourinvention.com/office-actions/${MATTER}`;
    if (phase === 'pipeline' || phase === 'issueMap' || phase === 'claimChart') return `${base}/analysis`;
    if (phase === 'signModal') return `${base}/analysis/sign-off`;
    if (phase === 'strategy') return `${base}/response/sections`;
    if (phase === 'claims') return `${base}/response/claims`;
    if (phase === 'approval') return `${base}/response/approval`;
    if (phase === 'exportCopy') return `${base}/response/documents`;
    return base;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   App shell
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* Sidebar and top bar mirror AnimatedDocketingWorkflow's DocketSidebar and
   TopBar (same workspace, sections, sizes and icons), with Office Actions active. */
const NAV_SECTIONS: [string, { label: string; icon: ReactNode; active?: boolean }[]][] = [
    ['MAIN', [
        { label: 'Dashboard', icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
        { label: 'Calendar', icon: <CalendarDays className="h-3.5 w-3.5" /> },
    ]],
    ['IP MANAGEMENT', [
        { label: 'Families', icon: <Folder className="h-3.5 w-3.5" /> },
        { label: 'Prior Art Search', icon: <BookOpen className="h-3.5 w-3.5" /> },
        { label: 'Products', icon: <Pill className="h-3.5 w-3.5" /> },
        { label: 'PRV', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
        { label: 'PCT', icon: <Globe2 className="h-3.5 w-3.5" /> },
        { label: 'NPE Cases', icon: <FileText className="h-3.5 w-3.5" /> },
        { label: 'Office Actions', icon: <FileClock className="h-3.5 w-3.5" />, active: true },
        { label: 'Annuity Fees', icon: <CircleDollarSign className="h-3.5 w-3.5" /> },
    ]],
    ['OPERATIONS', [
        { label: 'Costs', icon: <CircleDollarSign className="h-3.5 w-3.5" /> },
        { label: 'Firms', icon: <BriefcaseBusiness className="h-3.5 w-3.5" /> },
        { label: 'Documents', icon: <FileText className="h-3.5 w-3.5" /> },
        { label: 'Import Portfolio', icon: <Import className="h-3.5 w-3.5" /> },
        { label: 'Reminders', icon: <Bell className="h-3.5 w-3.5" /> },
        { label: 'Audit Log', icon: <History className="h-3.5 w-3.5" /> },
        { label: 'Patent World Map', icon: <Globe2 className="h-3.5 w-3.5" /> },
    ]],
    ['ADMIN', [
        { label: 'Settings', icon: <Settings className="h-3.5 w-3.5" /> },
    ]],
];

function personFor(approver: boolean) {
    return approver ? 'R. Patel' : 'M. Chen';
}

function AppSidebar({ approver }: { approver: boolean }) {
    return (
        <aside className="hidden min-w-0 flex-col border-r border-card-border bg-white sm:flex">
            <div className="flex h-14 shrink-0 items-center gap-2 border-b border-card-border px-2 sm:px-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
                    <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-[12px] font-bold text-text-primary">Northstar IP</p>
                    <p className="text-[9px] text-primary">Portfolio Management</p>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden px-1 py-2 sm:px-2">
                {NAV_SECTIONS.map(([section, items]) => (
                    <div key={section} className="mb-3">
                        <p className="mb-1 hidden px-2 text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:block">{section}</p>
                        <div className="space-y-0.5">
                            {items.map(item => (
                                <div
                                    key={item.label}
                                    className={`flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-[11px] font-semibold sm:justify-start ${item.active ? 'bg-primary/10 text-primary' : 'text-slate-600'}`}
                                >
                                    <span className={item.active ? 'text-primary' : 'text-slate-500'}>{item.icon}</span>
                                    <span className="hidden truncate sm:inline">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden shrink-0 border-t border-card-border p-3 sm:block">
                <p className="truncate text-[11px] font-bold text-text-primary">{personFor(approver)}</p>
                <p className="truncate text-[9px] text-slate-500">Patent Attorney</p>
            </div>
        </aside>
    );
}

function AppTopBar({ approver }: { approver: boolean }) {
    const { today } = useDates();
    return (
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-card-border bg-white px-2 sm:px-4">
            <div className="flex min-w-0 flex-1 items-center">
                <div className="flex min-w-0 items-center gap-2 sm:hidden">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-md shadow-primary/20">
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[12px] font-bold text-text-primary">Office Actions</p>
                        <p className="truncate text-[9px] text-primary">Northstar IP</p>
                    </div>
                </div>
                <div className="hidden h-9 w-full max-w-[420px] items-center gap-2 rounded-lg border border-card-border bg-white px-3 text-[11px] text-slate-400 sm:flex">
                    <Search className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="truncate">Search families, PRV, PCT, NPE, UUID</span>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                <span className="hidden rounded-full border border-card-border px-3 py-1.5 text-[11px] text-slate-600 sm:inline-flex">{today}</span>
                <Globe2 className="hidden h-4 w-4 text-slate-500 md:block" />
                <CalendarDays className="hidden h-4 w-4 text-slate-500 md:block" />
                <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 rounded-full bg-red-600 px-1 text-[8px] font-bold text-white">91</span>
                </span>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={personFor(approver)}
                        className="hidden items-center gap-2 sm:flex"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.25, ease: EASE }}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-text-primary">{personFor(approver)}</p>
                            <p className="text-[9px] text-primary">Attorney</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </header>
    );
}

function MatterHeader() {
    const d = useDates();
    return (
        <section className="flex shrink-0 items-start gap-2.5 rounded-lg border border-card-border bg-white px-3 py-2.5 shadow-sm">
            <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 sm:flex">
                <FileSearch className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-[11px] font-semibold text-text-primary sm:text-[13px]">Non-Final Rejection (CTNF)</p>
                    <Tag>Non-final rejection</Tag>
                </div>
                <p className="mt-0.5 truncate text-[9px] text-slate-500 sm:text-[10px]">
                    <span className="mr-1 rounded-sm bg-slate-100 px-1 font-semibold text-slate-600">US</span>
                    Adaptive Sensor System · Issued: {d.issued} · Due: {d.due}
                </p>
            </div>
            <Tag tone="blue">Open</Tag>
        </section>
    );
}

const MAIN_TABS = ['Details', 'Computed Deadlines', 'Documents', 'Evidence', 'Analysis', 'Response', 'History', 'Audit'];
const MAIN_TABS_COMPACT = new Set(['Documents', 'Analysis', 'Response', 'History']);

function MainTabs({ active }: { active: string }) {
    return (
        <nav className="flex shrink-0 gap-3 border-b border-card-border px-1 sm:gap-4">
            {MAIN_TABS.map(tab => (
                <span
                    key={tab}
                    className={`relative pb-1.5 text-[9px] sm:text-[10px] ${MAIN_TABS_COMPACT.has(tab) ? '' : 'hidden lg:inline'} ${tab === active ? 'font-semibold text-primary' : 'text-slate-600'}`}
                >
                    {tab}
                    {tab === active && <motion.span layoutId="oa-main-tab" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />}
                </span>
            ))}
        </nav>
    );
}

function SubTabs({ tabs, active }: { tabs: string[]; active: string }) {
    return (
        <nav className="flex shrink-0 items-center gap-1 overflow-hidden">
            {tabs.map((tab, i) => (
                <span
                    key={tab}
                    className={`shrink-0 rounded-md px-2 py-1 text-[9px] sm:text-[10px] ${i > 4 ? 'hidden md:inline' : ''} ${tab === active ? 'border border-card-border bg-white font-semibold text-text-primary shadow-sm' : 'text-slate-500'}`}
                >
                    {tab}
                </span>
            ))}
        </nav>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Analysis tab
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const ANALYSIS_SUBTABS = ['Issue map', 'Warnings (2)', 'References', 'Review', 'Sign-off', 'Exports', 'Source documents', 'Runs'];

function AnalysisArea({ phase, step }: Frame) {
    if (phase === 'pipeline' || phase === 'idle') return <PipelineCard step={phase === 'idle' ? 0 : step} />;
    if (phase === 'signModal') {
        return (
            <>
                <AnalysisStatus signed={step === 1} />
                <SubTabs tabs={ANALYSIS_SUBTABS} active="Sign-off" />
                <SigningCard signed={step === 1} />
            </>
        );
    }
    return (
        <>
            <SubTabs tabs={ANALYSIS_SUBTABS} active="Issue map" />
            <p className="shrink-0 text-[9px] text-slate-500 sm:text-[10px]">AI-assisted analysis. Draft for attorney review. · 3 issues, 0 corrected, 0 added by a person</p>
            {phase === 'issueMap' ? <IssueList /> : <ClaimChartView highlight={step === 1} />}
        </>
    );
}

const PIPELINE_STAGES = [
    { label: 'Getting the documents', note: 'Fetching from USPTO what is not already on file.' },
    { label: 'Checking the files', note: 'Every file is checked before anything reads it.' },
    { label: 'Reading the documents', note: 'Reading the text, with OCR where a page needs it.' },
    { label: 'Finding the examiner’s issues', note: 'Mapping each rejection to the claims and the passages it cites.' },
    { label: 'Ready for review', note: '' },
];

/* step = how many stages are complete. Finding the issues completes straight
   into Ready for review, so step goes 0, 1, 2, 3, then 5. */
function PipelineCard({ step }: { step: number }) {
    const done = step >= 5;
    const current = PIPELINE_STAGES[Math.min(step, 3)];
    return (
        <section className="flex min-h-0 flex-1 flex-col gap-3 rounded-lg border border-card-border bg-white p-3 shadow-sm sm:p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-bold text-text-primary sm:text-[13px]">{done ? 'Ready for review' : current.label}</p>
                {done ? <Tag tone="green">3 issues found</Tag> : <span className="text-[9px] text-red-500">Stop this run</span>}
            </div>
            <ol className="grid grid-cols-5 gap-1.5 sm:gap-3">
                {PIPELINE_STAGES.map((stage, i) => {
                    const state = i < step ? 'done' : i === step ? 'live' : 'wait';
                    return (
                        <li key={stage.label} className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold transition-colors duration-300 ${
                                        state === 'done' ? 'border-primary bg-primary text-white' : state === 'live' ? 'border-primary text-primary' : 'border-slate-300 text-slate-400'
                                    }`}
                                >
                                    {state === 'done' ? <Check className="h-3 w-3" /> : i + 1}
                                </span>
                                <span className={`h-px flex-1 transition-colors duration-300 ${i < step ? 'bg-primary' : 'bg-slate-200'} ${i === 4 ? 'invisible' : ''}`} />
                            </div>
                            <p className={`mt-1.5 hidden text-[9px] font-semibold leading-snug sm:block sm:text-[10px] ${state === 'wait' ? 'text-slate-400' : 'text-text-primary'}`}>{stage.label}</p>
                            {stage.note && <p className="mt-0.5 hidden text-[8px] leading-snug text-slate-400 lg:block">{stage.note}</p>}
                        </li>
                    );
                })}
            </ol>
            <div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <motion.div className="h-full rounded-full bg-primary" initial={false} animate={{ width: `${(step / 5) * 100}%` }} transition={{ duration: 0.4, ease: EASE }} />
                </div>
                <p className="mt-1.5 text-[9px] text-slate-500">{done ? 'Every stage finished. The issue map is ready for an attorney.' : step === 3 ? '4 of 6 model calls answered.' : 'This stage began 10:02.'}</p>
            </div>
            <p className="text-[9px] text-slate-400">AI-assisted analysis. Draft for attorney review. Source verification required. Nothing on the docket changes.</p>
            {/* Faint skeleton of the map to come, so the card does not read empty. */}
            <div className="flex flex-col gap-2">
                {[0, 1, 2].map(i => (
                    <div key={i} className="rounded-md border border-dashed border-card-border p-2.5">
                        <div className="h-2 w-1/3 rounded bg-slate-100" />
                        <div className="mt-2 h-1.5 w-2/3 rounded bg-slate-100" />
                    </div>
                ))}
            </div>
        </section>
    );
}

const ISSUES = [
    { title: 'Obviousness', tags: ['35 U.S.C. 103'], confidence: 'High confidence', summary: 'Claims 1-3 are rejected as unpatentable over Smith in view of Jones.' },
    { title: 'Indefiniteness', tags: ['35 U.S.C. 112(b)', 'MPEP 2173'], confidence: 'High confidence', summary: 'Claim 4 is rejected because “the profile” lacks a clear antecedent.' },
    { title: 'Objection to the claims', tags: ['37 C.F.R. 1.75'], confidence: 'Medium confidence', summary: 'Claim 5 is objected to as being in improper dependent form.' },
];

const REFERENCES = [
    { label: 'SMITH', kind: 'US publication', source: 'Text from USPTO Open Data' },
    { label: 'JONES', kind: 'EP publication', source: 'Text from EPO OPS' },
];

function IssueRow({ index, open = false, summary = false }: { index: number; open?: boolean; summary?: boolean }) {
    const issue = ISSUES[index];
    return (
        <div className="flex items-start gap-2">
            {open ? <ChevronDown className="mt-0.5 h-3 w-3 shrink-0 text-slate-500" /> : <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-slate-500" />}
            <div className="min-w-0">
                <p className="text-[10px] font-semibold text-text-primary sm:text-[11px]">{index + 1}. {issue.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1">
                    {issue.tags.map(t => <Tag key={t}>{t}</Tag>)}
                    <Tag>Model</Tag>
                    <Tag>{issue.confidence}</Tag>
                    <span className="hidden text-[9px] text-primary sm:inline">Assign · Comment</span>
                </div>
                {summary && <p className="mt-1.5 text-[9px] text-slate-600 sm:text-[10px]">{issue.summary}</p>}
            </div>
        </div>
    );
}

function IssueList() {
    return (
        <div className="flex min-h-0 flex-1 flex-col gap-2">
            {ISSUES.map((issue, i) => (
                <motion.div
                    key={issue.title}
                    className="rounded-lg border border-card-border bg-white p-3 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 + i * 0.3, ease: EASE }}
                >
                    <IssueRow index={i} summary />
                </motion.div>
            ))}
            <motion.section
                className="hidden rounded-lg border border-card-border bg-white shadow-sm sm:block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 1.15, ease: EASE }}
            >
                <div className="flex items-center justify-between border-b border-card-border px-3 py-2">
                    <span className="text-[10px] font-semibold text-text-primary">References</span>
                    <span className="text-[9px] text-slate-500">2 cited, both read</span>
                </div>
                {REFERENCES.map(ref => (
                    <div key={ref.label} className="flex items-center gap-2 border-b border-card-border/70 px-3 py-1.5 last:border-0">
                        <Tag>{ref.label}</Tag>
                        <span className="text-[9px] text-slate-600">{ref.kind}</span>
                        <span className="hidden text-[9px] text-slate-400 md:inline">· {ref.source}</span>
                        <span className="ml-auto"><Tag tone="green">Text held</Tag></span>
                    </div>
                ))}
            </motion.section>
        </div>
    );
}

const LIMITATIONS = [
    { label: '[1a]', text: 'a temperature sensor', coverage: 'Fully disclosed', ref: 'SMITH' },
    { label: '[1b]', text: 'a controller configured to adjust a sampling interval in response to a detected change in temperature', coverage: 'Fully disclosed', ref: 'SMITH' },
    { label: '[1c]', text: 'a stored calibration profile', coverage: 'Partly disclosed', ref: 'JONES' },
];

function ClaimChartView({ highlight }: { highlight: boolean }) {
    return (
        <div className="grid min-h-0 flex-1 gap-2.5 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="min-h-0 overflow-hidden rounded-lg border border-card-border bg-white p-3 shadow-sm">
                <IssueRow index={0} open />
                <div className="mt-2 pl-5">
                    <p className="text-[9px] leading-relaxed text-slate-600 sm:text-[10px]">
                        Claims 1-3 are rejected under 35 U.S.C. 103 as unpatentable over Smith in view of Jones. The examiner relies on Smith for the sensor and controller, and on Jones for the stored calibration profile.
                    </p>
                    <p className="mt-1.5 flex flex-wrap items-center gap-1 text-[9px] text-slate-500">References: <Tag>SMITH</Tag><Tag>JONES</Tag></p>
                    <div className="mt-2 rounded-md border border-card-border">
                        <div className="flex flex-wrap items-center gap-1.5 border-b border-card-border px-2.5 py-1.5">
                            <ChevronDown className="h-3 w-3 text-slate-500" />
                            <span className="text-[10px] font-semibold text-text-primary">Claim 1</span>
                            <span className="text-[9px] text-slate-400">3 limitations</span>
                            <Tag>Rejected</Tag>
                            <Tag>Not reviewed</Tag>
                        </div>
                        {LIMITATIONS.map((lim, i) => (
                            <div key={lim.label} className="border-b border-card-border/70 px-2.5 py-1.5 last:border-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {i === 1 ? <ChevronDown className="h-3 w-3 text-slate-500" /> : <ChevronRight className="h-3 w-3 text-slate-500" />}
                                    <span className="text-[10px] font-bold text-text-primary">{lim.label}</span>
                                    <Tag tone={lim.coverage === 'Fully disclosed' ? 'red' : 'orange'}>{lim.coverage}</Tag>
                                    <span className="text-[9px] text-slate-600">{lim.ref}</span>
                                </div>
                                {i === 1 && (
                                    <div className="mt-2 pl-4">
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <div>
                                                <p className="text-[9px] font-bold text-text-primary">Limitation</p>
                                                <p className="mt-0.5 text-[9px] leading-relaxed text-slate-600">{lim.label} {lim.text}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-[9px] font-bold text-text-primary">Examiner&apos;s reading</p>
                                                <p className="mt-0.5 text-[9px] leading-relaxed text-slate-600">The examiner reads the controller onto Smith&apos;s processing unit, which shortens the sampling interval when the measured temperature changes.</p>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-[9px] font-bold text-text-primary">Support</p>
                                        <figure className={`mt-1 rounded-r-md border-l-4 px-2.5 py-1.5 transition-all duration-500 ${highlight ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-slate-300 bg-slate-50'}`}>
                                            <blockquote className="text-[9px] leading-relaxed text-text-primary">&ldquo;The processing unit adjusts the sampling interval based on a change in the measured temperature.&rdquo;</blockquote>
                                            <figcaption className="mt-1 flex flex-wrap items-center gap-1.5 text-[8px] text-slate-500">
                                                <span>[0031]</span><span>SMITH</span><Tag>Express</Tag>
                                                <span className="underline decoration-dotted">Source verification required.</span>
                                                <span className="text-primary">Show in source</span>
                                            </figcaption>
                                        </figure>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <SourcePane highlight={highlight} />
        </div>
    );
}

const SOURCE_BLOCKS = [
    { block: 'Block 12', para: '[0029]', text: 'The sensor housing encloses a thermistor coupled to the measurement circuit.' },
    { block: 'Block 13', para: '[0030]', text: 'Readings are buffered before the processing unit evaluates them.' },
    { block: 'Block 14', para: '[0031]', text: 'The processing unit adjusts the sampling interval based on a change in the measured temperature.' },
];

function SourcePane({ highlight }: { highlight: boolean }) {
    return (
        <aside className="hidden min-h-0 flex-col overflow-hidden rounded-lg border border-card-border bg-white shadow-sm lg:flex">
            <div className="flex items-center justify-between border-b border-card-border px-3 py-2">
                <span className="text-[10px] font-semibold text-text-primary">Source</span>
                <span className="text-[9px] text-slate-500">Close source</span>
            </div>
            <div className="flex flex-col gap-2 p-2.5">
                <span className="flex items-center justify-between rounded-md border border-primary/40 px-2 py-1 text-[9px] text-text-primary">
                    Cited reference: SMITH <ChevronDown className="h-3 w-3 text-slate-400" />
                </span>
                {SOURCE_BLOCKS.map(b => {
                    const lit = highlight && b.para === '[0031]';
                    return (
                        <div key={b.block} className={`rounded-md border p-2 transition-all duration-500 ${lit ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-card-border'}`}>
                            <p className="text-[9px] font-semibold text-text-primary">{b.block} <span className="font-normal text-slate-400 [font-family:var(--font-dashboard-mono)]">{b.para}</span></p>
                            <p className="mt-1 text-[9px] leading-relaxed text-slate-600">{b.text}</p>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}

/* The analysis header that sits above the sub-tabs: status bar, the signed
   banner once signed, then the deadline, issue date, and AI budget facts. */
function AnalysisStatus({ signed }: { signed: boolean }) {
    const d = useDates();
    return (
        <section className="shrink-0 rounded-lg border border-card-border bg-white p-2.5 shadow-sm sm:p-3">
            <div className="flex items-center gap-2 rounded-md border border-card-border bg-slate-50 px-2.5 py-1.5">
                <Tag tone={signed ? 'green' : 'gold'}>{signed ? 'Signed' : 'Awaiting review'}</Tag>
                <span className="truncate text-[9px] text-slate-500 sm:text-[10px]">{signed ? 'AI-assisted analysis. Signed after attorney review.' : 'AI-assisted analysis. Draft for attorney review.'}</span>
            </div>
            <AnimatePresence initial={false}>
                {signed && (
                    <motion.div
                        className="overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.35, ease: EASE }}
                    >
                        <div className="mt-2 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 sm:p-3">
                            <CircleCheck className="mt-px h-4 w-4 shrink-0 text-emerald-600" />
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-semibold text-text-primary sm:text-[11px]">Signed after attorney review by M. Chen, {d.signedAt}.</p>
                                <p className="mt-1 text-[9px] text-slate-600 sm:text-[10px]">This analysis is signed. It is changed only by reopening it, which an approver does on the Sign-off view.</p>
                                <p className="mt-0.5 text-[9px] text-slate-400">The signature means: approval of this analysis.</p>
                            </div>
                            <X className="h-3 w-3 shrink-0 text-slate-400" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-3">
                <div className="min-w-0">
                    <p className="text-[8px] text-slate-400 sm:text-[9px]">Response deadline</p>
                    <p className="mt-0.5 text-[9px] text-text-primary sm:text-[10px]">{signed ? 'The confirmed date is in the analysis history.' : 'An attorney confirms the deadline.'}</p>
                    <p className="mt-1"><Tag tone={signed ? 'green' : 'gold'}>{signed ? 'Confirmed by an attorney' : 'Deadline pending attorney confirmation'}</Tag></p>
                    <p className="mt-1 text-[8px] leading-relaxed text-slate-400 sm:text-[9px]">Computed: {d.due} (PTA-preservation soft date: reply within 3 months (37 CFR 1.704(b)))</p>
                    {signed && <p className="mt-1 text-[9px] text-primary">Confirm the deadline</p>}
                </div>
                <div className="hidden min-w-0 sm:block">
                    <p className="text-[9px] text-slate-400">Issue date</p>
                    <p className="mt-0.5 text-[10px] text-text-primary">Read from the action: {d.issued}</p>
                    <p className="mt-1 text-[9px] text-slate-400">On the docket: {d.issued}</p>
                </div>
                <div className="hidden min-w-0 sm:block">
                    <p className="text-[9px] text-slate-400">AI budget this month</p>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-3/5 rounded-full bg-blue-500" />
                    </div>
                    <p className="mt-1.5 text-[9px] text-slate-400">3M of 5M tokens used. It resets {d.budgetReset}.</p>
                </div>
            </div>
        </section>
    );
}

const SIGN_CHECKS = [
    'The map is ready for review.',
    'No run is in progress.',
    'You hold the permission to sign.',
    'An approver grant on this matter.',
    'No warning stands in the way.',
    'You did not make the last correction.',
];

/* Before signing: the sign-off checklist. After: the signature record and
   the reopen action, as on the Sign-off view. */
function SigningCard({ signed }: { signed: boolean }) {
    const d = useDates();
    return (
        <section className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden rounded-lg border border-card-border bg-white p-3 shadow-sm">
            <p className="text-[11px] font-bold text-text-primary sm:text-[12px]">{signed ? 'Signatures' : 'Signing'}</p>
            <AnimatePresence mode="popLayout" initial={false}>
                {signed ? (
                    <motion.div
                        key="signed"
                        className="flex flex-col gap-2"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15, ease: EASE }}
                    >
                        <div className="rounded-md border border-card-border p-2.5">
                            <p className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-text-primary">
                                M. Chen
                                <Tag tone="green">Standing</Tag>
                                <span className="font-normal text-slate-400">{d.signedAt}</span>
                            </p>
                            <p className="mt-1 text-[9px] text-slate-600">The signature means: approval of this analysis.</p>
                            <p className="mt-0.5 text-[9px] text-slate-600">Reason: Checked each chart against the cited passages.</p>
                            <p className="mt-0.5 text-[9px] text-slate-400">Covers version 3 of the map.</p>
                        </div>
                        <span className="self-start rounded-md border border-red-300 px-2.5 py-1 text-[9px] text-red-500">Reopen the analysis</span>
                    </motion.div>
                ) : (
                    <motion.ul key="checks" className="flex flex-col gap-1.5" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                        {SIGN_CHECKS.map((check, i) => (
                            <li key={check} className="flex items-center gap-2 text-[9px] text-text-primary sm:text-[10px]">
                                {i === SIGN_CHECKS.length - 1 ? <Clock3 className="h-3.5 w-3.5 text-slate-400" /> : <CircleCheck className="h-3.5 w-3.5 text-emerald-600" />}
                                {check}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </section>
    );
}

function SignAnalysisModal() {
    return (
        <CeremonyModal title="Sign the issue map" confirm="Sign">
            <div>
                <p className="text-[10px] font-bold text-text-primary">What you are signing</p>
                <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[9px] text-slate-600">
                    <li>3 issues</li>
                    <li>3 claim charts</li>
                </ul>
                <p className="mt-2 text-[9px] text-slate-500">The warnings as they stand, which your signature records:</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[9px] text-slate-600">
                    <li>No integrity warnings</li>
                    <li>2 acknowledged</li>
                </ul>
                <p className="mt-2 text-[8px] leading-relaxed text-slate-400">Signing makes the map read-only until it is reopened. The reason and what you were shown are kept in the audit trail.</p>
            </div>
            <div className="flex flex-col gap-2.5">
                <MeaningRadios options={[['Approval', 'approval of this analysis'], ['Review', 'a record that this analysis was reviewed'], ['Responsibility', 'responsibility for this analysis'], ['Authorship', 'authorship of this analysis']]} />
                <ReasonBox label="Why you are signing" text="Checked each chart against the cited passages." />
                <IdentityConfirmed />
            </div>
        </CeremonyModal>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Response tab
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const RESPONSE_SUBTABS = ['Readiness', 'Sections', 'Claims', 'Passages', 'Approval', 'Documents', 'Proposals', 'Warnings', 'Filings', 'History'];

/* The 14-step path, as NextStepBanner labels it, with its lower-case "After this" names. */
const PATH_STEPS = [
    ['Starting text of the claims', 'confirm the starting text'],
    ['Application as filed', 'the application as filed'],
    ['Strategy for each issue', 'strategies'],
    ['Amendments', 'the amendments'],
    ['Issue sections', 'the issue sections'],
    ['Support for amended claims', 'the support'],
    ['Filing vehicle', 'the filing vehicle'],
    ['Caption', 'the caption'],
    ['Submit for review', 'submit for review'],
    ['Answer the warnings', 'the warnings'],
    ['Approval', 'approval'],
    ['Filing copy', 'the filing copy'],
    ['Record the filing', 'record the filing'],
    ['Entry by the Office', 'the entry disposition'],
];

const PATH_NOW: Record<number, { sentence: string; detail: string; actor?: string; button?: string }> = {
    3: { sentence: 'Choose a strategy for each issue (3 issues).', detail: 'For each issue, choose how the reply answers it and say why. The sections and arguments follow the strategy.', button: 'Open sections' },
    6: { sentence: 'Cite the support for the amended claims (1 claim).', detail: 'Cite where the application as filed shows each amended claim.', button: 'Open passages' },
    11: { sentence: 'Approve the response.', detail: 'A second attorney, not the last person to revise the draft, signs the approval and confirms their identity in the dialog.', actor: 'A second attorney approves this draft.', button: 'Open approval' },
    13: { sentence: 'File the paper with the Office, then record the filing here.', detail: 'File the paper with the Office outside the product, then record the date it was filed here.', button: 'Open filings' },
};

function ResponseArea({ phase, step }: Frame) {
    const pathStep = phase === 'strategy' ? 3 : phase === 'claims' ? 6 : phase === 'approval' ? 11 : 13;
    const status = phase === 'approval' ? (step >= 3 ? 'approved' : 'review') : phase === 'exportCopy' || phase === 'fadeout' ? 'approved' : 'drafting';
    const subtab = phase === 'strategy' ? 'Sections' : phase === 'claims' ? 'Claims' : phase === 'approval' ? 'Approval' : 'Documents';
    return (
        <>
            <DraftBar status={status} />
            <PathToFiling current={pathStep} />
            <SubTabs tabs={RESPONSE_SUBTABS} active={subtab} />
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={phase === 'fadeout' ? 'exportCopy' : phase}
                    className="flex min-h-0 flex-1 flex-col"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.28, ease: EASE }}
                >
                    {phase === 'strategy' && <StrategyView step={step} />}
                    {phase === 'claims' && <ClaimsView covered={step >= 1} />}
                    {phase === 'approval' && <ApprovalView step={step} />}
                    {(phase === 'exportCopy' || phase === 'fadeout') && <DocumentsView released={phase === 'fadeout' || step >= 1} />}
                </motion.div>
            </AnimatePresence>
        </>
    );
}

function DraftBar({ status }: { status: 'drafting' | 'review' | 'approved' }) {
    const label = status === 'drafting' ? 'Drafting' : status === 'review' ? 'In review' : 'Approved';
    return (
        <section className="flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-lg border border-card-border bg-white px-3 py-2 shadow-sm">
            <div className="flex min-w-0 items-center gap-2">
                <Tag tone={status === 'approved' ? 'green' : 'blue'}>{label}</Tag>
                <span className="text-[10px] font-semibold text-text-primary sm:text-[11px]">Reply under 37 CFR 1.111</span>
                <span className="hidden text-[9px] text-slate-400 md:inline">{status === 'approved' ? 'Approved by R. Patel' : 'Revised by M. Chen'}</span>
            </div>
            <div className="flex items-center gap-1.5">
                {status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 text-[9px] text-slate-500"><LockKeyhole className="h-3 w-3" />Approved content locked</span>
                ) : (
                    <>
                        <span className="hidden items-center gap-1 rounded-md border border-card-border bg-slate-50 px-2 py-1 text-[9px] text-slate-400 sm:inline-flex"><ShieldCheck className="h-3 w-3" />Approve response</span>
                        <span className="rounded-md bg-primary px-2 py-1 text-[9px] font-semibold text-white">Submit for review</span>
                    </>
                )}
            </div>
        </section>
    );
}

function PathToFiling({ current }: { current: number }) {
    const now = PATH_NOW[current];
    const next = PATH_STEPS.slice(current, current + 4);
    const after = PATH_STEPS.slice(current, current + 3).map(([, lower]) => lower);
    return (
        <section className="shrink-0 rounded-lg border border-card-border bg-white px-3 py-2.5 shadow-sm">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-text-primary sm:text-[11px]">Path to filing</span>
                <span className="text-[9px] text-slate-400">Step {current} of 14</span>
            </div>
            <ol className="mt-2 hidden items-start gap-3 md:flex">
                <li className="flex items-start gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary"><Check className="h-2.5 w-2.5" /></span>
                    <span className="text-[9px] text-text-primary">{current - 1} steps done</span>
                </li>
                <li className="flex items-start gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-semibold text-white">{current}</span>
                    <span className="text-[9px] font-semibold text-text-primary">{PATH_STEPS[current - 1][0]}<span className="block font-normal text-slate-400">Now</span></span>
                </li>
                {next.map(([label], i) => (
                    <li key={label} className={`items-start gap-1.5 ${i > 1 ? 'hidden xl:flex' : 'flex'}`}>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[8px] text-slate-500">{current + i + 1}</span>
                        <span className="text-[9px] text-slate-500">{label}</span>
                    </li>
                ))}
            </ol>
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-card-border pt-2">
                <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[9px] font-semibold text-text-primary sm:text-[10px]"><Tag tone="blue">Now</Tag><span className="truncate">{now.sentence}</span></p>
                    {/* The detail sentence only where it carries the story: the second-attorney rule. */}
                    {now.actor && <p className="mt-1 hidden text-[9px] text-slate-500 sm:block">{now.detail}</p>}
                    {now.actor && <p className="mt-0.5 hidden text-[9px] text-amber-600 sm:block">{now.actor}</p>}
                    {after.length > 0 && <p className="mt-0.5 hidden text-[8px] text-slate-400 lg:block">After this: {after.join(', ')}.</p>}
                </div>
                {now.button && <span className="hidden shrink-0 rounded-md bg-primary px-2.5 py-1.5 text-[9px] font-semibold text-white sm:inline">{now.button}</span>}
            </div>
        </section>
    );
}

const SECTIONS = [
    { name: 'Application', from: 'From the template' },
    { name: 'Amendments to the claims', from: 'From the template' },
    { name: 'Remarks', from: 'From the template' },
    { name: 'Response to an issue', from: '1. Obviousness' },
    { name: 'Response to an issue', from: '2. Indefiniteness' },
];

const STRATEGY_PICKS = ['Amend and traverse', 'Amend the claims', 'Amend the claims'];

/* step = how many issues have a strategy (0 to 3). */
function StrategyView({ step }: { step: number }) {
    const missing = ISSUES.length - step;
    return (
        <div className="grid min-h-0 flex-1 gap-2.5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <section className="hidden min-h-0 overflow-hidden rounded-lg border border-card-border bg-white shadow-sm sm:block">
                <div className="flex items-center justify-between border-b border-card-border px-3 py-2">
                    <div>
                        <p className="text-[11px] font-bold text-text-primary">Sections</p>
                        <p className="text-[9px] text-slate-500">7 sections in document order.</p>
                    </div>
                    <span className="rounded-md border border-card-border px-2 py-1 text-[9px] text-text-primary">Scaffold untouched sections</span>
                </div>
                {SECTIONS.map((s, i) => (
                    <div key={s.from + i} className="flex items-center gap-3 border-b border-card-border/70 px-3 py-1.5 last:border-0">
                        <span className="w-3 text-[9px] text-slate-400">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-semibold text-text-primary">{s.name}</p>
                            <p className="text-[8px] text-slate-400">{s.from}</p>
                        </div>
                        <Tag>Not yet written</Tag>
                        <span className="hidden text-[9px] text-primary md:inline">Edit section</span>
                    </div>
                ))}
            </section>
            <section className="min-h-0 overflow-hidden rounded-lg border border-card-border bg-white shadow-sm">
                <div className="flex items-center justify-between gap-2 border-b border-card-border px-3 py-2">
                    <p className="text-[10px] font-semibold text-text-primary">Issues and strategies</p>
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span key={missing} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.2 }}>
                            {missing === 0 ? <Tag tone="green">Every issue has a strategy</Tag> : <Tag tone="gold">{missing} without a strategy</Tag>}
                        </motion.span>
                    </AnimatePresence>
                </div>
                {ISSUES.map((issue, i) => {
                    const chosen = i < step;
                    return (
                        <div key={issue.title} className="border-b border-card-border/70 px-3 py-2 last:border-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-[10px] font-semibold text-text-primary">{i + 1}. {issue.title}</p>
                                <span className="text-[9px] text-primary">{chosen ? 'Change' : 'Select strategy'}</span>
                            </div>
                            <div className="mt-1 h-4">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span key={chosen ? 'chosen' : 'none'} className="inline-flex items-center gap-1.5" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}>
                                        {chosen ? <Tag>{STRATEGY_PICKS[i]}</Tag> : <><Tag tone="gold">No strategy selected</Tag><span className="text-[8px] text-slate-400">Suggested: {STRATEGY_PICKS[i]}</span></>}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}

function ClaimsView({ covered }: { covered: boolean }) {
    return (
        <div className="grid min-h-0 flex-1 gap-2.5 lg:grid-cols-2">
            <section className="min-h-0 overflow-hidden rounded-lg border border-card-border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-card-border px-3 py-2">
                    <p className="text-[11px] font-bold text-text-primary">1. (Currently amended)</p>
                    <span className="text-[9px] text-primary">Edit claim</span>
                </div>
                <div className="p-3">
                    <div className="flex gap-1"><Tag tone="blue">Amended</Tag></div>
                    <p className="mt-2 text-[9px] font-semibold text-text-primary">Claim text and listing markings</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-text-primary">
                        A sensor system comprising: a temperature sensor; a controller configured to adjust a sampling interval <del>periodically</del>{' '}
                        <motion.ins initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>in response to a detected change in temperature</motion.ins>; and a stored calibration profile.
                    </p>
                    <div className="mt-3 rounded-md border border-card-border bg-slate-50 p-2">
                        <p className="text-[9px] font-semibold text-text-primary">Dependency and structure</p>
                        <p className="mt-0.5 text-[9px] text-slate-500">Not multiple dependent · Read from the claim text</p>
                    </div>
                    <div className="mt-2 rounded-md border border-card-border bg-slate-50 p-2">
                        <p className="text-[9px] font-semibold text-text-primary">Examined starting point</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-500"><Tag>Original</Tag><Tag>From the USPTO record</Tag></p>
                    </div>
                </div>
            </section>
            <section className="hidden min-h-0 overflow-hidden rounded-lg border border-card-border bg-white shadow-sm sm:block">
                <div className="border-b border-card-border px-3 py-2">
                    <p className="text-[11px] font-bold text-text-primary">1. (Currently amended) passages</p>
                </div>
                <div className="p-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-text-primary">Inserted words</span>
                        <Tag tone="blue">Required</Tag>
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span key={covered ? 'ok' : 'need'} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                {covered ? <Tag tone="green">Saved link covers this target</Tag> : <Tag tone="gold">Saved set needs a passage</Tag>}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <p className="mt-1 text-[9px] text-slate-500">in response to a detected change in temperature</p>
                    <motion.div
                        className="mt-2.5 rounded-md border border-card-border p-2.5"
                        initial={false}
                        animate={{ opacity: covered ? 1 : 0.35, y: covered ? 0 : 6 }}
                        transition={{ duration: 0.35, ease: EASE }}
                    >
                        <p className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-text-primary">Specification, page 16 <Tag>Cited for &ldquo;change in temperature&rdquo;</Tag></p>
                        <p className="mt-1 text-[9px] leading-relaxed text-slate-600">[0032] The controller varies the sampling interval when the temperature changes.</p>
                        <p className="mt-1 text-[9px] text-primary">Read passage in source</p>
                    </motion.div>
                    <p className="mt-2 text-[9px] text-slate-500">{covered ? 'Cites 1 passage.' : 'Cites nothing yet'}</p>
                    <p className="mt-2 text-[8px] leading-relaxed text-slate-400">Cite where the application as filed shows this claim as amended. One passage is often enough, such as the claim as filed or a paragraph.</p>
                </div>
            </section>
        </div>
    );
}

const HOLDING = [
    'The analysis is signed',
    'Every issue has a filing choice',
    'The claim listing is complete',
    'Every amended claim cites its support',
    'The application as filed is current',
    'No integrity warning is open',
];
const ATTENTION = ['The kind of reply is confirmed', 'The caption is recorded'];

/* step 0: 12 of 14 hold; 1: all hold; 2: approve dialog; 3: approved and locked. */
function ApprovalView({ step }: { step: number }) {
    const d = useDates();
    const ready = step >= 1;
    const approved = step >= 3;
    return (
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-card-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-card-border px-3 py-2">
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-text-primary"><ShieldCheck className="h-3.5 w-3.5" />Approval readiness</p>
                {approved ? <Tag tone="green">Approved</Tag> : <Tag tone={ready ? 'green' : 'gold'}>{ready ? 'Ready to approve' : 'Not ready'}</Tag>}
            </div>
            <div className="p-3">
                {approved ? (
                    <motion.div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                        <p className="flex items-center gap-2 text-[10px] font-semibold text-text-primary sm:text-[11px]"><LockKeyhole className="h-3.5 w-3.5 text-emerald-600" />This draft is approved and locked. To change it, start a new draft from it.</p>
                        <p className="mt-1.5 pl-5.5 text-[9px] text-slate-600">Signed by R. Patel on {d.approvedAt} · Meaning: Approval · Content hash: 6bbf16a7</p>
                    </motion.div>
                ) : (
                    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-card-border bg-slate-50 p-3">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-text-primary sm:text-[11px]">{ready ? '14 of 14 checks hold' : '12 of 14 checks hold'}</p>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                                <motion.div className={`h-full rounded-full ${ready ? 'bg-emerald-600' : 'bg-primary'}`} initial={false} animate={{ width: ready ? '100%' : '86%' }} transition={{ duration: 0.45, ease: EASE }} />
                            </div>
                            <p className={`mt-1 text-[9px] ${ready ? 'text-emerald-700' : 'text-amber-600'}`}>{ready ? 'Every check holds.' : '2 checks need attention.'}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[9px] font-semibold ${ready ? 'bg-primary text-white' : 'border border-card-border bg-white text-slate-400'}`}><ShieldCheck className="h-3 w-3" />Approve response</span>
                    </div>
                )}
                {!ready && (
                    <>
                        <p className="mt-3 text-[10px] font-semibold text-text-primary">Needs attention (2)</p>
                        {ATTENTION.map(item => <CheckLine key={item} label={item} ok={false} />)}
                    </>
                )}
                <p className="mt-3 text-[10px] font-semibold text-text-primary">Holding ({ready ? 14 : 12})</p>
                {(ready ? [...ATTENTION, ...HOLDING] : HOLDING).slice(0, 6).map(item => <CheckLine key={item} label={item} ok />)}
            </div>
        </section>
    );
}

function CheckLine({ label, ok }: { label: string; ok: boolean }) {
    return (
        <p className="flex items-center gap-2 border-b border-card-border/70 py-1.5 text-[9px] text-text-primary last:border-0 sm:text-[10px]">
            {ok ? <CircleCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> : <X className="h-3.5 w-3.5 shrink-0 rounded-full bg-amber-500 p-0.5 text-white" />}
            {label}
        </p>
    );
}

function ApproveModal() {
    return (
        <CeremonyModal title="Approve the response" confirm="Approve">
            <div>
                <p className="text-[10px] font-bold text-text-primary">What you are signing</p>
                <div className="mt-1.5 space-y-0.5 rounded-md border border-card-border p-2 text-[9px] text-slate-600">
                    <p>Vehicle: Reply under 37 CFR 1.111</p>
                    <p>5 sections; 3 claims in the listing</p>
                    <p>Content hash: 6bbf16a7</p>
                    <p>Draft version 7</p>
                </div>
                <p className="mt-2 text-[8px] leading-relaxed text-slate-400">Approving freezes the content under the recorded hash. The reason and what you were shown are kept in the audit trail.</p>
            </div>
            <div className="flex flex-col gap-2.5">
                <MeaningRadios options={[['Approval', 'approval of this response'], ['Review', 'a record that this response was reviewed'], ['Responsibility', 'responsibility for this response']]} />
                <ReasonBox label="Why you are approving" text="Read the remarks and the listing against the signed map." />
                <IdentityConfirmed />
            </div>
        </CeremonyModal>
    );
}

function DocumentsView({ released }: { released: boolean }) {
    const d = useDates();
    return (
        <div className="grid min-h-0 flex-1 gap-2.5 xl:grid-cols-[minmax(0,1fr)_220px]">
            <div className="flex min-h-0 flex-col gap-2.5">
                <section className="rounded-lg border border-card-border bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                        <p className="flex items-center gap-1.5 text-[11px] font-bold text-text-primary">Filing copy</p>
                        <Tag tone="green">{released ? 'Filing copy made' : 'Ready to release'}</Tag>
                    </div>
                    <p className="mt-1 text-[9px] text-slate-500">The paper that is filed: no watermark, no notes, made from the approved draft. The product does not file it.</p>
                    <AnimatePresence mode="wait" initial={false}>
                        {released ? (
                            <motion.div key="made" className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-2.5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                                <p className="flex items-center gap-1.5 text-[10px] font-semibold text-text-primary"><CircleCheck className="h-3.5 w-3.5 text-emerald-600" />File this paper with the Office, then record the filing here.</p>
                                <span className="flex gap-1.5">
                                    <span className="inline-flex items-center gap-1 rounded-md border border-card-border bg-white px-2 py-1 text-[9px] text-text-primary"><Download className="h-3 w-3" />Download</span>
                                    <span className="rounded-md bg-primary px-2 py-1 text-[9px] font-semibold text-white">Record the filing</span>
                                </span>
                            </motion.div>
                        ) : (
                            <motion.p key="pending" className="mt-2.5 text-[9px] text-slate-500" exit={{ opacity: 0 }}>Approval: Signed {d.approvedAt}; covers this draft. · Claim listing: 3 claims: 1 amended, 0 new, 0 canceled.</motion.p>
                        )}
                    </AnimatePresence>
                </section>
                <section className="min-h-0 overflow-hidden rounded-lg border border-card-border bg-white shadow-sm">
                    <p className="border-b border-card-border px-3 py-2 text-[10px] font-semibold text-text-primary">Documents made</p>
                    <DocRow mode="Review draft" tags={<Tag>Marked for review</Tag>} meta={`Made by M. Chen on ${d.reviewDraft}.`} />
                    <AnimatePresence initial={false}>
                        {released && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.35, ease: EASE }}>
                                <DocRow mode="Filing copy" tags={<><Tag tone="blue">Signed</Tag><Tag tone="green">Matches the draft</Tag></>} meta={`Made by R. Patel on ${d.approvedDay}.`} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>
            <DocThumbnails released={released} />
        </div>
    );
}

function DocRow({ mode, tags, meta }: { mode: string; tags: ReactNode; meta: string }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-card-border/70 px-3 py-2 last:border-0">
            <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-text-primary">{mode} {tags}</p>
                <p className="mt-0.5 text-[8px] text-slate-400">{meta} No warning was open at render.</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] text-primary"><Download className="h-3 w-3" />Download</span>
        </div>
    );
}

/* Miniature Word pages: the watermarked review draft behind, the clean filing copy in front. */
function DocThumbnails({ released }: { released: boolean }) {
    return (
        <div className="relative hidden min-h-0 xl:block">
            <div className="absolute top-2 left-0 h-56 w-40 overflow-hidden rounded-sm border border-card-border bg-white p-3 shadow-md">
                <p className="text-[7px] font-bold tracking-wide text-red-500">REVIEW DRAFT. NOT FOR FILING.</p>
                <DocLines />
                <p className="absolute top-1/2 left-1/2 w-56 -translate-x-1/2 -translate-y-1/2 -rotate-45 text-center text-[11px] font-bold tracking-widest text-red-500/15">REVIEW DRAFT</p>
            </div>
            <motion.div
                className="absolute top-10 left-12 h-56 w-40 rounded-sm border border-card-border bg-white p-3 shadow-xl"
                initial={false}
                animate={{ opacity: released ? 1 : 0, y: released ? 0 : 14 }}
                transition={{ duration: 0.45, ease: EASE }}
            >
                <p className="text-[7px] font-bold text-text-primary">Response to Office Action</p>
                <DocLines />
                <p className="mt-3 text-[7px] text-slate-500">Respectfully submitted,</p>
                <p className="text-[7px] text-slate-400 [font-family:var(--font-dashboard-mono)]">/                    /</p>
            </motion.div>
        </div>
    );
}

function DocLines() {
    return (
        <div className="mt-2 space-y-1.5">
            {['w-full', 'w-5/6', 'w-full', 'w-2/3', 'w-full', 'w-4/5', 'w-full', 'w-1/2'].map((w, i) => <div key={i} className={`h-1 rounded bg-slate-200 ${w}`} />)}
        </div>
    );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Shared pieces
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

type TagTone = 'default' | 'red' | 'orange' | 'green' | 'gold' | 'blue';

const TAG_TONES: Record<TagTone, string> = {
    default: 'border-slate-200 bg-slate-50 text-slate-600',
    red: 'border-red-200 bg-red-50 text-red-600',
    orange: 'border-orange-200 bg-orange-50 text-orange-600',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    gold: 'border-amber-200 bg-amber-50 text-amber-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-600',
};

function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: TagTone }) {
    return <span className={`inline-flex shrink-0 items-center rounded border px-1.5 py-px text-[8px] leading-4 sm:text-[9px] ${TAG_TONES[tone]}`}>{children}</span>;
}

/* The signing dialog every signed act uses: what is signed on the left, the
   meaning, reason and identity check on the right. Shown in its ready state. */
function CeremonyModal({ title, confirm, children }: { title: string; confirm: string; children: [ReactNode, ReactNode] }) {
    return (
        <motion.div
            className="absolute inset-0 z-40 flex items-start justify-center bg-black/45 px-2 pt-10 backdrop-blur-[2px] sm:px-3 sm:pt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
        >
            <motion.div
                className="w-[min(94%,640px)] rounded-xl bg-white p-3.5 shadow-2xl sm:p-4"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.28, ease: EASE }}
            >
                <div className="flex items-center justify-between">
                    <p className="text-[12px] font-bold text-text-primary sm:text-[13px]">{title}</p>
                    <X className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="hidden sm:block">{children[0]}</div>
                    {children[1]}
                </div>
                <div className="mt-3 flex justify-end gap-2 border-t border-card-border pt-3">
                    <span className="rounded-md border border-card-border px-3 py-1.5 text-[10px] text-text-primary">Cancel</span>
                    <span className="rounded-md bg-primary px-3 py-1.5 text-[10px] font-semibold text-white shadow-md shadow-primary/30">{confirm}</span>
                </div>
            </motion.div>
        </motion.div>
    );
}

function MeaningRadios({ options }: { options: [string, string][] }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-text-primary">What your signature means</p>
            <div className="mt-1.5 space-y-1">
                {options.map(([label, phrase], i) => (
                    <p key={label} className="flex items-start gap-1.5">
                        <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border ${i === 0 ? 'border-[3px] border-primary' : 'border-slate-300'}`} />
                        <span className="text-[9px] text-text-primary">{label}<span className="block text-[8px] text-slate-400">{phrase}</span></span>
                    </p>
                ))}
            </div>
        </div>
    );
}

function ReasonBox({ label, text }: { label: string; text: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-text-primary">{label}</p>
            <p className="mt-1 rounded-md border border-card-border px-2 py-1.5 text-[9px] text-text-primary">{text}</p>
            <p className="mt-0.5 text-[8px] text-slate-400">At least 10 characters. The reason is kept in the audit trail.</p>
        </div>
    );
}

function IdentityConfirmed() {
    return (
        <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-2">
            <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <div>
                <p className="text-[10px] font-semibold text-text-primary">Identity confirmed</p>
                <p className="text-[8px] text-slate-500">This confirmation covers the next few minutes.</p>
            </div>
        </div>
    );
}
