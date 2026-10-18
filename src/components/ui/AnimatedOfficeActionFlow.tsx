'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CircleCheck, Clock3, Download, FileText, LockKeyhole, ShieldCheck } from 'lucide-react';
import { BrowserMockupChrome } from './BrowserMockupChrome';
import { useDemoDates, type DemoDates } from '@/lib/office-action-demo-dates';

/* ── Animated Office Action flow (home section) ──
   One matter, four stages, told in the same 13.8s loop as the AI drafting
   mockup. The stages line up with the three benefits beside it:
     issues   (0)     the action is read, then three issues land
     chart    (2700)  claim 1 is charted, the quote matches its source,
                      M. Chen signs the analysis (4500)
     response (5700)  a strategy lands on every issue, claim 1 is amended
                      where Jones is weakest, and support is cited (8300)
     approval (9500)  every check holds, R. Patel approves, content locks
     fadeout  (12000) idle (13000), loop at 13800ms.
   The side record fills in as each act happens, so the frame is never empty.
   Matter, references and people are fictional and match the detail page. */

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const MOCKUP_HEIGHT = 'h-[440px] sm:h-[480px] lg:h-[520px]';
const MATTER = 'OA-DEMO-118';

type Stage = 'issues' | 'chart' | 'response' | 'approval' | 'fadeout' | 'idle';

interface Frame {
    stage: Stage;
    step: number;
}

/* [ms, stage, step]. A step is a beat inside a stage. */
const TIMELINE: [number, Stage, number][] = [
    [500, 'issues', 1],
    [2700, 'chart', 0],
    [3500, 'chart', 1],
    [4500, 'chart', 2],
    [5700, 'response', 0],
    [6100, 'response', 1],
    [6500, 'response', 2],
    [6900, 'response', 3],
    [7500, 'response', 4],
    [8300, 'response', 5],
    [9500, 'approval', 0],
    [10300, 'approval', 1],
    [12000, 'fadeout', 0],
    [13000, 'idle', 0],
];
const T_LOOP = 13800;

/* Reduced motion shows the response: the frame that carries the most story. */
const STATIC_FRAME: Frame = { stage: 'response', step: 5 };

const STAGES: { key: Stage; label: string }[] = [
    { key: 'issues', label: 'Issues' },
    { key: 'chart', label: 'Claim chart' },
    { key: 'response', label: 'Response' },
    { key: 'approval', label: 'Approval' },
];

const ISSUES = [
    { title: 'Obviousness', basis: '35 U.S.C. 103', claims: 'Claims 1-3', refs: ['SMITH', 'JONES'], summary: 'Rejected as unpatentable over Smith in view of Jones.' },
    { title: 'Indefiniteness', basis: '35 U.S.C. 112(b)', claims: 'Claim 4', refs: [], summary: '“The profile” lacks a clear antecedent.' },
    { title: 'Objection', basis: '37 C.F.R. 1.75', claims: 'Claim 5', refs: [], summary: 'Objected to as improper dependent form.' },
];

const STRATEGY_PICKS = ['Amend and traverse', 'Amend the claims', 'Amend the claims'];

const LIMITATIONS = [
    { label: '[1a]', text: 'a temperature sensor', coverage: 'Fully disclosed', cite: 'SMITH ¶ [0024]' },
    { label: '[1b]', text: 'a controller that adjusts a sampling interval when the temperature changes', coverage: 'Fully disclosed', cite: 'SMITH ¶ [0031]' },
    { label: '[1c]', text: 'a stored calibration profile', coverage: 'Partly disclosed', cite: 'JONES ¶ [0042]' },
];

const CHECKS = [
    'The analysis is signed',
    'Every issue has a filing choice',
    'The claim listing is complete',
    'Every amended claim cites its support',
    'The application as filed is current',
    'No integrity warning is open',
];

/* The claim listing as the reply presents it under 37 CFR 1.121. */
const LISTING = [
    { claims: '1', status: 'Currently amended', tone: 'blue' },
    { claims: '2-3', status: 'Original', tone: 'default' },
    { claims: '4-5', status: 'Currently amended', tone: 'blue' },
] as const;

/* How many acts the side record shows as done for a frame. */
function recordDone({ stage, step }: Frame) {
    switch (stage) {
        case 'issues': return step >= 1 ? 1 : 0;
        case 'chart': return step >= 2 ? 2 : 1;
        case 'response': return step >= 5 ? 4 : step >= 3 ? 3 : 2;
        case 'approval': return step >= 1 ? 6 : 4;
        default: return 6;
    }
}

export function AnimatedOfficeActionFlow() {
    const [frame, setFrame] = useState<Frame>({ stage: 'issues', step: 0 });
    const [reducedMotion, setReducedMotion] = useState(false);
    const dates = useDemoDates();

    const runCycle = useCallback(() => {
        setFrame({ stage: 'issues', step: 0 });
        return TIMELINE.map(([ms, stage, step]) => setTimeout(() => setFrame({ stage, step }), ms));
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

    const { stage, step } = frame;
    const hidden = stage === 'fadeout' || stage === 'idle';
    /* While fading out, hold the last stage on screen. */
    const shown: Stage = hidden ? 'approval' : stage;
    const shownStep = hidden ? 1 : step;
    const activeIndex = STAGES.findIndex(s => s.key === shown);

    return (
        <div
            aria-hidden="true"
            role="img"
            className={`relative flex select-none flex-col overflow-hidden rounded-xl border border-card-border bg-[#f8f8fa] shadow-2xl shadow-black/10 [font-family:var(--font-dashboard)] ${MOCKUP_HEIGHT}`}
        >
            <BrowserMockupChrome url={`app.designyourinvention.com/office-actions/${MATTER}`} />

            {/* Matter header */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-card-border bg-white px-2.5 py-2 sm:px-3">
                <div className="flex min-w-0 items-center gap-1.5">
                    <FileText className="h-3 w-3 shrink-0 text-slate-500 sm:h-3.5 sm:w-3.5" />
                    <span className="shrink-0 text-[9px] font-bold text-text-primary [font-family:var(--font-dashboard-mono)] sm:text-[10px]">{MATTER}</span>
                    <span className="truncate text-[9px] text-slate-500 sm:text-[10px]">· Adaptive Sensor System</span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <span className="hidden sm:inline-flex"><Tag tone="red">Non-final rejection</Tag></span>
                    <Tag tone="gold"><Clock3 className="mr-1 h-2.5 w-2.5" />Due {dates.due}</Tag>
                </div>
            </div>

            {/* Stage strip */}
            <div className="flex shrink-0 items-center gap-1.5 border-b border-card-border bg-white px-2.5 py-1.5 sm:gap-2 sm:px-3">
                {STAGES.map((s, i) => {
                    const done = i < activeIndex;
                    const active = i === activeIndex;
                    return (
                        <div key={s.key} className="flex min-w-0 flex-1 items-center gap-1.5 last:flex-none sm:gap-2">
                            <span className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[7px] font-bold transition-colors duration-300 sm:h-4 sm:w-4 sm:text-[8px] ${done ? 'bg-emerald-600 text-white' : active ? 'bg-primary text-white ring-2 ring-primary/20' : 'border border-slate-300 bg-white text-slate-400'}`}>
                                {done ? <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5" strokeWidth={3} /> : i + 1}
                            </span>
                            <span className={`shrink-0 text-[8px] transition-colors duration-300 sm:text-[9px] ${active ? 'font-semibold text-primary' : done ? 'text-text-primary' : 'text-slate-400'}`}>{s.label}</span>
                            {i < STAGES.length - 1 && <span className={`h-px min-w-1 flex-1 transition-colors duration-300 ${done ? 'bg-emerald-500/60' : 'bg-slate-200'}`} />}
                        </div>
                    );
                })}
            </div>

            {/* Body */}
            <motion.div
                className="flex min-h-0 flex-1 gap-2 bg-[#f4f5f7] p-2 sm:gap-2.5 sm:p-2.5"
                animate={{ opacity: hidden ? 0 : 1 }}
                transition={{ duration: 0.45, ease: EASE }}
            >
                <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-card-border bg-white shadow-sm">
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={shown}
                            className="flex min-h-0 flex-1 flex-col"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.12 } }}
                            transition={{ duration: 0.35, delay: 0.1, ease: EASE }}
                        >
                            {shown === 'issues' && <IssuesStage step={shownStep} />}
                            {shown === 'chart' && <ChartStage step={shownStep} dates={dates} />}
                            {shown === 'response' && <ResponseStage step={shownStep} />}
                            {shown === 'approval' && <ApprovalStage step={shownStep} dates={dates} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <ResponseRecord done={recordDone(frame)} dates={dates} />
            </motion.div>
        </div>
    );
}

/* ── Stages ── */

function StageHeader({ title, children }: { title: string; children?: ReactNode }) {
    return (
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-card-border px-2.5 py-2 sm:px-3">
            <p className="truncate text-[10px] font-bold text-text-primary sm:text-[11px]">{title}</p>
            {children}
        </div>
    );
}

/* step 0: reading the action; 1: issues and references land. */
function IssuesStage({ step }: { step: number }) {
    return (
        <>
            <StageHeader title="Issue map">
                <Tag tone="gold">{step === 0 ? 'Reading the action' : 'Awaiting review'}</Tag>
            </StageHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2 sm:gap-2 sm:p-2.5">
                {step === 0 ? (
                    [0, 1, 2].map(i => (
                        <div key={i} className="animate-pulse rounded-md border border-card-border p-2.5">
                            <div className="h-2 w-1/3 rounded bg-slate-200" />
                            <div className="mt-2 h-1.5 w-1/2 rounded bg-slate-100" />
                            <div className="mt-1.5 h-1.5 w-4/5 rounded bg-slate-100" />
                        </div>
                    ))
                ) : (
                    <>
                        {ISSUES.map((issue, i) => (
                            <motion.div
                                key={issue.title}
                                className="rounded-md border border-card-border p-2 sm:p-2.5"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.22, ease: EASE }}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-[10px] font-semibold text-text-primary">{i + 1}. {issue.title}</p>
                                    <span className="shrink-0 text-[8px] text-slate-500 sm:text-[9px]">{issue.claims}</span>
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-1">
                                    <Tag>{issue.basis}</Tag>
                                    {issue.refs.map(r => <Tag key={r} tone="blue">{r}</Tag>)}
                                </div>
                                <p className="mt-1 text-[9px] leading-snug text-slate-600">{issue.summary}</p>
                            </motion.div>
                        ))}
                        <motion.div
                            className="mt-auto hidden rounded-md border border-card-border bg-slate-50 sm:block"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.75, ease: EASE }}
                        >
                            <p className="border-b border-card-border px-2.5 py-1.5 text-[9px] font-semibold text-text-primary">Cited references</p>
                            {[['SMITH', 'US publication'], ['JONES', 'EP publication']].map(([label, kind]) => (
                                <div key={label} className="flex items-center gap-1.5 px-2.5 py-1">
                                    <Tag tone="blue">{label}</Tag>
                                    <span className="truncate text-[9px] text-slate-600">{kind}</span>
                                    <span className="ml-auto"><Tag tone="green">Full text held</Tag></span>
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </div>
        </>
    );
}

/* step 0: claim 1 charted; 1: the quote matches its source; 2: signed. */
function ChartStage({ step, dates }: { step: number; dates: DemoDates }) {
    const matched = step >= 1;
    const signed = step >= 2;
    return (
        <>
            <StageHeader title="1. Obviousness · Claim 1">
                <Tag>35 U.S.C. 103</Tag>
            </StageHeader>
            <div className="flex min-h-0 flex-1 flex-col p-2 sm:p-2.5">
                <p className="hidden text-[9px] uppercase tracking-wide text-slate-400 sm:block">Claim 1 as examined · 3 limitations</p>
                <div className="rounded-md border border-card-border sm:mt-1.5">
                    {LIMITATIONS.map((lim, i) => (
                        <motion.div
                            key={lim.label}
                            className="border-b border-card-border/70 px-2 py-1 last:border-0 sm:px-2.5 sm:py-1.5"
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.15, ease: EASE }}
                        >
                            <div className="flex items-start gap-1.5">
                                <span className="shrink-0 text-[9px] font-bold text-primary [font-family:var(--font-dashboard-mono)]">{lim.label}</span>
                                <p className="min-w-0 flex-1 text-[9px] leading-snug text-text-primary">{lim.text}</p>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-1 pl-6">
                                <Tag tone={lim.coverage === 'Fully disclosed' ? 'red' : 'orange'}>{lim.coverage}</Tag>
                                <span className="text-[8px] text-slate-500 [font-family:var(--font-dashboard-mono)] sm:text-[9px]">{lim.cite}</span>
                            </div>
                            {i === 1 && (
                                <p className="ml-6 mt-1 hidden text-[9px] leading-snug text-slate-600 sm:block"><span className="font-semibold text-text-primary">Examiner&apos;s reading:</span> Smith&apos;s processing unit is the claimed controller.</p>
                            )}
                            {i === 1 && (
                                <figure className={`ml-6 mt-1.5 rounded-r-md border-l-2 px-2 py-1.5 transition-all duration-500 ${matched ? 'border-primary bg-primary/5 ring-1 ring-primary/25' : 'border-slate-300 bg-slate-50'}`}>
                                    <blockquote className="text-[9px] italic leading-snug text-slate-700">&ldquo;The processing unit adjusts the sampling interval based on a change in the measured temperature.&rdquo;</blockquote>
                                    <figcaption className="mt-1 flex h-4 items-center">
                                        <AnimatePresence mode="popLayout" initial={false}>
                                            <motion.span key={matched ? 'ok' : 'wait'} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.25 }}>
                                                {matched ? <Tag tone="green"><Check className="mr-0.5 h-2.5 w-2.5" />Quote matched to source text</Tag> : <Tag>Checking quote against SMITH</Tag>}
                                            </motion.span>
                                        </AnimatePresence>
                                    </figcaption>
                                </figure>
                            )}
                        </motion.div>
                    ))}
                </div>
                <div className="mt-auto pt-2">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {signed ? (
                            <motion.div key="signed" className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                                <p className="flex items-center gap-1.5 text-[10px] font-semibold text-text-primary"><CircleCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />Analysis signed by M. Chen</p>
                                <p className="mt-0.5 hidden pl-5 text-[9px] text-slate-600 sm:block">Signed after attorney review, {dates.signedAt}.</p>
                            </motion.div>
                        ) : (
                            <motion.div key="unsigned" className="flex items-center gap-2 rounded-md border border-card-border bg-slate-50 px-2.5 py-2" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                                <p className="min-w-0 flex-1 text-[9px] text-slate-600">Draft for attorney review.</p>
                                <span className={`inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-2 py-1 text-[9px] font-semibold text-white transition-shadow duration-300 ${matched ? 'shadow-md shadow-primary/30 ring-2 ring-primary/25' : ''}`}><ShieldCheck className="h-3 w-3" />Sign analysis</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}

/* step 0-3: strategies land on 0-3 issues; 4: claim 1 amended; 5: support cited. */
function ResponseStage({ step }: { step: number }) {
    const picked = Math.min(step, 3);
    const missing = ISSUES.length - picked;
    const amended = step >= 4;
    const supported = step >= 5;
    return (
        <>
            <StageHeader title="Response · Reply under 37 CFR 1.111">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={missing} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.2 }}>
                        {missing === 0 ? <Tag tone="green">Every issue has a strategy</Tag> : <Tag tone="gold">{missing} without a strategy</Tag>}
                    </motion.span>
                </AnimatePresence>
            </StageHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-2 sm:gap-2 sm:p-2.5">
                <div className="rounded-md border border-card-border">
                    {ISSUES.map((issue, i) => {
                        const chosen = i < picked;
                        return (
                            <div key={issue.title} className="flex items-center justify-between gap-2 border-b border-card-border/70 px-2.5 py-1 last:border-0 sm:py-1.5">
                                <p className="min-w-0 truncate text-[9px] font-semibold text-text-primary sm:text-[10px]">{i + 1}. {issue.title}</p>
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.span key={chosen ? 'chosen' : 'none'} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.25, ease: EASE }}>
                                        {chosen ? <Tag tone="blue">{STRATEGY_PICKS[i]}</Tag> : <Tag tone="gold">Select strategy</Tag>}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                <div className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border p-2 transition-colors duration-500 sm:p-2.5 ${amended ? 'border-primary/25' : 'border-card-border'}`}>
                    <div className="flex items-center gap-1.5">
                        <p className="text-[10px] font-semibold text-text-primary">{amended ? '1. (Currently amended)' : '1. (Original)'}</p>
                        {amended && <Tag tone="blue">Amended</Tag>}
                        <span className="ml-auto hidden items-center gap-1 text-[8px] text-slate-500 xl:flex">Examined from <Tag>USPTO record</Tag></span>
                    </div>
                    <p className="mt-1 text-[9px] leading-relaxed text-text-primary sm:min-h-11">
                        A sensor system comprising: a temperature sensor; a controller that adjusts a sampling interval when the temperature changes; and a stored calibration profile
                        {amended && (
                            <motion.ins className="bg-primary/10 text-primary decoration-primary/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
                                {' '}that maps each temperature band to a sampling interval
                            </motion.ins>
                        )}
                        .
                    </p>
                    <div className="mt-auto pt-1.5 sm:pt-2">
                        <div className="flex flex-wrap items-center gap-1">
                            <span className="text-[9px] font-semibold text-text-primary"><span className="sm:hidden">Support as filed</span><span className="hidden sm:inline">Support in the application as filed</span></span>
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span key={supported ? 'ok' : amended ? 'need' : 'none'} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.2 }}>
                                    {supported ? <Tag tone="green">Cites 1 passage</Tag> : amended ? <Tag tone="gold">Needs a passage</Tag> : <Tag>No inserted words</Tag>}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <motion.div
                            className="mt-1.5 hidden rounded-md border border-card-border bg-slate-50 px-2 py-1.5 sm:block"
                            initial={false}
                            animate={{ opacity: supported ? 1 : 0.35 }}
                            transition={{ duration: 0.35, ease: EASE }}
                        >
                            <p className="text-[9px] font-semibold text-text-primary">Specification ¶ [0036]</p>
                            <p className="mt-0.5 text-[9px] leading-snug text-slate-600">The calibration profile maps each temperature band to its own sampling interval.</p>
                        </motion.div>
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1 rounded-md border border-card-border bg-slate-50 px-2.5 py-1.5">
                    <span className="mr-0.5 text-[9px] font-semibold text-text-primary">Claim listing</span>
                    {LISTING.map(row => (
                        <Tag key={row.claims} tone={amended ? row.tone : 'default'}>
                            <span className="mr-1 font-semibold [font-family:var(--font-dashboard-mono)]">{row.claims}</span>
                            {amended && row.status === 'Currently amended' ? <><span className="sm:hidden">Amended</span><span className="hidden sm:inline">Currently amended</span></> : 'Original'}
                        </Tag>
                    ))}
                </div>
            </div>
        </>
    );
}

/* step 0: every check holds; 1: approved, locked, filing copy made. */
function ApprovalStage({ step, dates }: { step: number; dates: DemoDates }) {
    const approved = step >= 1;
    return (
        <>
            <StageHeader title="Approval readiness">
                {approved ? <Tag tone="green">Approved</Tag> : <Tag tone="green">Ready to approve</Tag>}
            </StageHeader>
            <div className="flex min-h-0 flex-1 flex-col p-2 sm:p-2.5">
                <div className="rounded-md border border-card-border bg-slate-50 px-2.5 py-2">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-bold text-text-primary">14 of 14 checks hold</p>
                        <span className="text-[8px] text-slate-500 sm:text-[9px]">Draft version 7</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <motion.div className="h-full rounded-full bg-emerald-600" initial={{ width: '86%' }} animate={{ width: '100%' }} transition={{ duration: 0.6, delay: 0.15, ease: EASE }} />
                    </div>
                    <div className="mt-2 hidden grid-cols-2 gap-2 border-t border-card-border pt-1.5 sm:grid">
                        <p className="text-[8px] text-slate-500">Last revised by<span className="block text-[9px] font-semibold text-text-primary">M. Chen</span></p>
                        <p className="text-[8px] text-slate-500">Approver<span className="block text-[9px] font-semibold text-text-primary">R. Patel</span></p>
                    </div>
                </div>
                <div className="mt-1.5">
                    {CHECKS.map((c, i) => (
                        <motion.p
                            key={c}
                            className={`items-center gap-1.5 border-b border-card-border/70 py-1 text-[9px] text-text-primary last:border-0 ${i < 5 ? 'flex' : 'hidden sm:flex'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.25, delay: 0.1 + i * 0.08 }}
                        >
                            <CircleCheck className="h-3 w-3 shrink-0 text-emerald-600" />{c}
                        </motion.p>
                    ))}
                </div>
                <div className="mt-auto flex flex-col gap-1.5 pt-2">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {approved ? (
                            <motion.div key="approved" className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                                <p className="flex items-center gap-1.5 text-[10px] font-semibold text-text-primary"><LockKeyhole className="h-3.5 w-3.5 shrink-0 text-emerald-600" />Approved and locked</p>
                                <p className="mt-0.5 pl-5 text-[9px] text-slate-600">Signed by R. Patel, {dates.approvedAt} · Meaning: Approval</p>
                            </motion.div>
                        ) : (
                            <motion.div key="ready" className="flex items-center gap-2 rounded-md border border-card-border px-2.5 py-2" exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                                <p className="min-w-0 flex-1 text-[9px] text-slate-600">Approver must not be the last reviser.</p>
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-2 py-1 text-[9px] font-semibold text-white shadow-md shadow-primary/30 ring-2 ring-primary/25"><ShieldCheck className="h-3 w-3" />Approve response</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.div
                        className="flex items-center gap-2 rounded-md border border-card-border px-2.5 py-1.5"
                        initial={false}
                        animate={{ opacity: approved ? 1 : 0.35 }}
                        transition={{ duration: 0.35, delay: approved ? 0.3 : 0, ease: EASE }}
                    >
                        <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[9px] font-semibold text-text-primary">Filing copy · Reply under 37 CFR 1.111</p>
                            <p className="text-[8px] text-slate-500">Word document for attorney filing</p>
                        </div>
                        <Download className="h-3 w-3 shrink-0 text-slate-500" />
                    </motion.div>
                </div>
            </div>
        </>
    );
}

/* ── Side record: each signed or recorded act, filled in as it happens ── */

function ResponseRecord({ done, dates }: { done: number; dates: DemoDates }) {
    const acts = [
        { title: 'Action read', meta: `Issued ${dates.issued}` },
        { title: 'Analysis signed', meta: 'M. Chen' },
        { title: 'Strategies chosen', meta: '3 of 3 issues' },
        { title: 'Support cited', meta: 'Spec. ¶ [0036]' },
        { title: 'Approved, locked', meta: 'R. Patel' },
        { title: 'Filing copy made', meta: 'Word (.docx)' },
    ];
    return (
        <aside className="hidden w-[150px] shrink-0 flex-col overflow-hidden rounded-lg border border-card-border bg-white shadow-sm md:flex lg:hidden xl:flex">
            <div className="border-b border-card-border px-2.5 py-2">
                <p className="text-[10px] font-bold text-text-primary">Response record</p>
                <p className="text-[8px] text-slate-500 [font-family:var(--font-dashboard-mono)]">{MATTER}</p>
            </div>
            <ol className="flex flex-1 flex-col px-2.5 py-2.5">
                {acts.map((act, i) => {
                    const isDone = i < done;
                    const isNext = i === done;
                    return (
                        <li key={act.title} className="relative flex max-h-14 flex-1 gap-2 last:flex-none">
                            {i < acts.length - 1 && <span className={`absolute bottom-0 left-[6px] top-4 w-px transition-colors duration-300 ${isDone ? 'bg-emerald-500/50' : 'bg-slate-200'}`} />}
                            <span className={`relative mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${isDone ? 'bg-emerald-600 text-white' : isNext ? 'border border-primary bg-primary/10' : 'border border-slate-300 bg-white'}`}>
                                {isDone && <Check className="h-2 w-2" strokeWidth={3} />}
                                {isNext && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />}
                            </span>
                            <div className="min-w-0">
                                <p className={`text-[9px] font-semibold leading-tight transition-colors duration-300 ${isDone ? 'text-text-primary' : 'text-slate-400'}`}>{act.title}</p>
                                <p className={`mt-0.5 truncate text-[8px] leading-tight transition-colors duration-300 ${isDone ? 'text-slate-500' : 'text-slate-300'}`}>{act.meta}</p>
                            </div>
                        </li>
                    );
                })}
            </ol>
            <div className="m-2 mt-0 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5">
                <p className="text-[8px] uppercase tracking-wide text-amber-700">Reply due</p>
                <p className="text-[11px] font-bold text-text-primary">{dates.dueInDays} days</p>
                <p className="text-[8px] text-slate-500 [font-family:var(--font-dashboard-mono)]">{dates.due}</p>
            </div>
        </aside>
    );
}

/* ── Shared ── */

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
    return <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded border px-1.5 py-px text-[8px] leading-4 sm:text-[9px] ${TAG_TONES[tone]}`}>{children}</span>;
}
