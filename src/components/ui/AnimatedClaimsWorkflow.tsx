'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowDownUp,
    BookOpenText,
    Check,
    ChevronDown,
    ClipboardList,
    Clock3,
    Download,
    FileClock,
    FileText,
    GitBranch,
    History,
    Lightbulb,
    ListChecks,
    MoreVertical,
    PenLine,
    Plus,
    RefreshCw,
    RotateCcw,
    Scale,
    Sparkles,
    WandSparkles,
    X,
} from 'lucide-react';

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const MOCKUP_HEIGHT = 'h-[520px] sm:h-[620px] lg:h-[700px]';

const T_REVIEW = 600;
const T_REFINE_MENU = 3000;
const T_REFINE_MODAL = 4800;
const T_HISTORY = 7100;
const T_ABSTRACT = 9700;
const T_DESCRIPTION = 12300;
const T_NOVELTY_STALE = 15000;
const T_STALE_MODAL = 17100;
const T_NOVELTY_CLEAN = 19300;
const T_FADEOUT = 21600;
const T_RESET = 22300;
const T_LOOP = 22900;

type Phase =
    | 'idle'
    | 'claimsReview'
    | 'claimRefineMenu'
    | 'claimRefineModal'
    | 'claimHistory'
    | 'abstractReview'
    | 'descriptionHistory'
    | 'noveltyStale'
    | 'staleModal'
    | 'noveltyClean'
    | 'fadeout';

type UnitId = 'summary' | 'claims' | 'abstract' | 'description' | 'novelty' | 'instructions';
type Confidence = 'High' | 'Medium' | 'Changed';

interface WorkspaceItem {
    id: UnitId;
    label: string;
    count?: number;
    confidence?: Confidence;
    icon: ReactNode;
}

interface ClaimItem {
    number: number;
    kind: 'Independent' | 'Dependent';
    version: string;
    confidence: Confidence;
    dependsOn?: number;
    text: string;
}

const BASE_CLAIMS: ClaimItem[] = [
    {
        number: 1,
        kind: 'Independent',
        version: 'v1',
        confidence: 'Medium',
        text:
            'A computer-implemented method for coordinating private model training among enterprise nodes, comprising receiving policy profiles, assigning training budgets, validating secure-enclave attestations, and weighting model updates before aggregation.',
    },
    {
        number: 2,
        kind: 'Dependent',
        version: 'v1',
        confidence: 'High',
        dependsOn: 1,
        text:
            'The method of claim 1, wherein each policy profile identifies a governing privacy rule and a minimum noise floor selected from a maintained regulatory registry.',
    },
    {
        number: 3,
        kind: 'Dependent',
        version: 'v1',
        confidence: 'High',
        dependsOn: 1,
        text:
            'The method of claim 1, wherein the weighting is based on a quality score derived from attestation freshness, validation success, and drift from a prior training round.',
    },
    {
        number: 4,
        kind: 'Dependent',
        version: 'v1',
        confidence: 'Medium',
        dependsOn: 1,
        text:
            'The method of claim 1, further comprising storing an append-only training event record that identifies participating nodes without exposing source training data.',
    },
    {
        number: 5,
        kind: 'Dependent',
        version: 'v1',
        confidence: 'High',
        dependsOn: 1,
        text:
            'The method of claim 1, wherein a coordinator suspends a node from a training round when an attestation token is older than a configured freshness interval.',
    },
    {
        number: 6,
        kind: 'Dependent',
        version: 'v1',
        confidence: 'High',
        dependsOn: 1,
        text:
            'The method of claim 1, wherein encrypted model updates are combined using a threshold protocol that prevents the coordinator from reading an individual contribution.',
    },
    {
        number: 7,
        kind: 'Independent',
        version: 'v1',
        confidence: 'Medium',
        text:
            'A training coordination system comprising memory and processors configured to maintain policy profiles, validate node attestations, assign training budgets, and generate an auditable aggregation record.',
    },
];

const REFINED_CLAIMS: ClaimItem[] = [
    {
        number: 1,
        kind: 'Independent',
        version: 'v2',
        confidence: 'Medium',
        text:
            'A computer-implemented method for coordinating private model training across enterprise nodes, comprising receiving jurisdiction-tagged policy profiles, calculating per-node training budgets, verifying secure-enclave attestations, and applying node-specific reliability weights before secure aggregation.',
    },
    {
        number: 2,
        kind: 'Dependent',
        version: 'v1',
        confidence: 'Changed',
        dependsOn: 1,
        text:
            'The method of claim 1, wherein each policy profile identifies a privacy rule and a minimum noise floor selected from a registry maintained by a coordinator service.',
    },
    {
        number: 3,
        kind: 'Dependent',
        version: 'v1',
        confidence: 'Changed',
        dependsOn: 1,
        text:
            'The method of claim 1, wherein the reliability weight is adjusted when attestation freshness or validation results fall outside configured training thresholds.',
    },
    {
        number: 4,
        kind: 'Dependent',
        version: 'v1',
        confidence: 'Medium',
        dependsOn: 1,
        text:
            'The method of claim 1, further comprising storing an append-only training event record that identifies participating nodes without exposing source training data.',
    },
    {
        number: 5,
        kind: 'Dependent',
        version: 'v1',
        confidence: 'Changed',
        dependsOn: 1,
        text:
            'The method of claim 1, wherein a coordinator excludes a node when an attestation credential is older than a freshness interval associated with the node policy profile.',
    },
    {
        number: 6,
        kind: 'Dependent',
        version: 'v1',
        confidence: 'High',
        dependsOn: 1,
        text:
            'The method of claim 1, wherein encrypted model updates are combined using a threshold protocol that prevents the coordinator from reading an individual contribution.',
    },
    {
        number: 7,
        kind: 'Independent',
        version: 'v1',
        confidence: 'Medium',
        text:
            'A training coordination system comprising memory and processors configured to maintain policy profiles, validate node attestations, assign training budgets, and generate an auditable aggregation record.',
    },
];

const DESCRIPTION_SECTIONS = [
    {
        label: 'Technical Field',
        heading: 'TECHNICAL FIELD',
        text:
            'The disclosure relates to privacy-preserving distributed machine learning, and more particularly to coordination systems that train shared models while enterprise data remains under local control.',
    },
    {
        label: 'Background',
        heading: 'BACKGROUND',
        text:
            'Organizations often collaborate on machine learning models while operating under different privacy policies, audit requirements, and contractual restrictions. Existing systems can struggle to balance privacy budgets, trust scoring, and model utility across participants.',
    },
    {
        label: 'Summary',
        heading: 'SUMMARY OF THE INVENTION',
        text:
            'A coordinator receives participant policy profiles, maps each profile to privacy-budget rules, verifies training-node attestations, and applies reliability weights before secure aggregation of model updates.',
    },
    {
        label: 'Detailed Description',
        heading: 'DETAILED DESCRIPTION',
        text:
            'In one implementation, each node submits an attestation token, a policy identifier, and a proposed update envelope. The coordinator evaluates freshness, prior reliability, and budget availability before admitting the node to a training round.',
    },
    {
        label: 'Drawings',
        heading: 'BRIEF DESCRIPTION OF THE DRAWINGS',
        text:
            'Figure 1 illustrates a coordinator, enterprise nodes, policy registry, attestation verifier, and secure aggregation service. Figure 2 illustrates a round-level validation and weighting workflow.',
    },
];

const NOVELTY_LINKS = [
    'Overview of prior art snapshot',
    'Statutory analysis - 35 U.S.C. 101',
    'Statutory analysis - 35 U.S.C. 112',
    'Known coordinator systems',
    'Training budget distinctions',
];

const NOVELTY_SECTIONS = [
    {
        heading: 'OVERVIEW OF PRIOR ART SNAPSHOT',
        body:
            'The review is limited to four references currently attached to the matter. The closest reference discloses enterprise model training with attested participants, but does not teach jurisdiction-specific budget assignment combined with reliability-weighted secure aggregation.',
    },
    {
        heading: 'STATUTORY ANALYSIS - 35 U.S.C. 101',
        body:
            'The draft frames the invention as a practical computer-network improvement: policy-aware admission control, attestation verification, and secure aggregation orchestration. This helps avoid presenting the claim as a bare business rule or mathematical result.',
    },
    {
        heading: 'STATUTORY ANALYSIS - 35 U.S.C. 112',
        body:
            'The claim terms are supported by the description sections addressing policy profiles, attestation freshness, node reliability scoring, and threshold aggregation. Additional examples could further support fallback handling when a node fails validation.',
    },
    {
        heading: 'KNOWN COORDINATOR SYSTEMS',
        body:
            'Reference A is highly relevant for secure aggregation. Reference B is relevant for regulatory routing. Neither reference appears to disclose weighted aggregation triggered by attestation freshness and validation quality.',
    },
    {
        heading: 'TRAINING BUDGET DISTINCTIONS',
        body:
            'The strongest distinction is the coupling of jurisdiction-tagged policy profiles with participant-specific budget assignment before admission into a training round. This limitation should remain visible in the independent claim.',
    },
];

export function AnimatedClaimsWorkflow() {
    const [phase, setPhase] = useState<Phase>('idle');

    const runCycle = useCallback(() => {
        setPhase('idle');
        const timers: ReturnType<typeof setTimeout>[] = [];
        timers.push(setTimeout(() => setPhase('claimsReview'), T_REVIEW));
        timers.push(setTimeout(() => setPhase('claimRefineMenu'), T_REFINE_MENU));
        timers.push(setTimeout(() => setPhase('claimRefineModal'), T_REFINE_MODAL));
        timers.push(setTimeout(() => setPhase('claimHistory'), T_HISTORY));
        timers.push(setTimeout(() => setPhase('abstractReview'), T_ABSTRACT));
        timers.push(setTimeout(() => setPhase('descriptionHistory'), T_DESCRIPTION));
        timers.push(setTimeout(() => setPhase('noveltyStale'), T_NOVELTY_STALE));
        timers.push(setTimeout(() => setPhase('staleModal'), T_STALE_MODAL));
        timers.push(setTimeout(() => setPhase('noveltyClean'), T_NOVELTY_CLEAN));
        timers.push(setTimeout(() => setPhase('fadeout'), T_FADEOUT));
        timers.push(setTimeout(() => setPhase('idle'), T_RESET));
        return timers;
    }, []);

    useEffect(() => {
        let timers = runCycle();
        const interval = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, T_LOOP);

        return () => {
            timers.forEach(clearTimeout);
            clearInterval(interval);
        };
    }, [runCycle]);

    const visible = phase !== 'idle' && phase !== 'fadeout';
    const selectedUnit = getSelectedUnit(phase);
    const claims = isRefinedPhase(phase) ? REFINED_CLAIMS : BASE_CLAIMS;
    const showWarnings = ['claimHistory', 'descriptionHistory', 'noveltyStale', 'staleModal'].includes(phase);

    return (
        <div
            aria-hidden="true"
            role="img"
            className={`relative flex flex-col overflow-hidden rounded-2xl border border-card-border bg-[#eef1f5] shadow-2xl shadow-black/10 select-none ${MOCKUP_HEIGHT}`}
        >
            <motion.div
                className="flex h-full flex-col"
                initial={false}
                animate={{ opacity: visible ? 1 : 0.16 }}
                transition={{ duration: 0.35, ease: EASE }}
            >
                <TopBar showWarnings={showWarnings} />
                <WarningBanner show={showWarnings} />

                <div className="grid min-h-0 flex-1 grid-cols-[52px_minmax(0,1fr)] gap-1.5 p-1.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-3 sm:p-3 lg:grid-cols-[170px_minmax(0,1fr)] xl:grid-cols-[190px_minmax(0,1fr)_260px]">
                    <WorkspaceSidebar selectedUnit={selectedUnit} changed={isRefinedPhase(phase)} visible={visible} />
                    <MainWorkspace phase={phase} claims={claims} selectedUnit={selectedUnit} />
                    <ReviewHistoryPanel phase={phase} selectedUnit={selectedUnit} />
                </div>
            </motion.div>

            <AnimatePresence>
                {phase === 'claimRefineModal' && <RefineModal />}
                {phase === 'staleModal' && <StaleModal />}
            </AnimatePresence>
        </div>
    );
}

function getSelectedUnit(phase: Phase): UnitId {
    if (phase === 'abstractReview') return 'abstract';
    if (phase === 'descriptionHistory') return 'description';
    if (phase === 'noveltyStale' || phase === 'staleModal' || phase === 'noveltyClean') return 'novelty';
    return 'claims';
}

function isRefinedPhase(phase: Phase) {
    return ['claimHistory', 'abstractReview', 'descriptionHistory', 'noveltyStale', 'staleModal', 'noveltyClean'].includes(phase);
}

function TopBar({ showWarnings }: { showWarnings: boolean }) {
    return (
        <header className="shrink-0 overflow-hidden border-b border-card-border bg-white px-2 py-1.5 sm:px-4 sm:py-2" style={{ fontFamily: 'var(--font-dashboard)' }}>
            <div className="flex items-center justify-between gap-1.5">
                <div className="hidden min-w-0 flex-1 sm:block">
                    <div className="flex items-center gap-2">
                        <GitBranch className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                        <p className="truncate text-[10px] font-bold text-text-primary sm:text-[12px] lg:text-[14px]">
                            DEMO-AI-042 - Adaptive Secure Training Platform
                        </p>
                    </div>
                    <p className="mt-0.5 hidden truncate text-[8px] text-slate-500 sm:block">
                        Draft · US · AI Review: Medium · Updated 23 days ago
                    </p>
                </div>
                <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:flex-none sm:gap-1.5">
                    <ToolbarButton className="inline-flex px-1.5 sm:px-2">v2 · US</ToolbarButton>
                    <ToolbarButton className="hidden sm:inline-flex" icon={<Plus className="h-3 w-3" />}>New Draft</ToolbarButton>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-primary px-2 py-1.5 text-[8px] font-bold text-white shadow-lg shadow-primary/25 sm:px-3 sm:text-[11px]">
                        <Sparkles className="h-3 w-3" />
                        <span className="hidden sm:inline">Generate AI Draft</span>
                        <span className="sm:hidden">AI</span>
                    </span>
                    <ToolbarButton className="hidden sm:inline-flex" icon={<MoreVertical className="h-3 w-3" />} />
                    <span className={`hidden rounded-full px-2 py-1 text-[8px] font-semibold sm:inline-flex ${showWarnings ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {showWarnings ? 'Warnings' : 'Ready'}
                    </span>
                </div>
            </div>
        </header>
    );
}

function WarningBanner({ show }: { show: boolean }) {
    return (
        <motion.div
            className="shrink-0 overflow-hidden border-b border-amber-300 bg-amber-50"
            animate={{ height: show ? 'auto' : 0, opacity: show ? 1 : 0 }}
            transition={{ duration: 0.28, ease: EASE }}
        >
            <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4" style={{ fontFamily: 'var(--font-dashboard)' }}>
                <div className="flex min-w-0 items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                    <span className="text-[10px] font-bold text-text-primary sm:text-[12px]">Draft warnings</span>
                    <span className="hidden text-[9px] text-slate-500 sm:inline">2 units need acknowledgement</span>
                </div>
                <X className="h-3.5 w-3.5 shrink-0 text-slate-600" />
            </div>
        </motion.div>
    );
}

function WorkspaceSidebar({ selectedUnit, changed, visible }: { selectedUnit: UnitId; changed: boolean; visible: boolean }) {
    const items: WorkspaceItem[] = useMemo(
        () => [
            { id: 'summary', label: 'Draft Summary', icon: <ClipboardList className="h-3.5 w-3.5" /> },
            { id: 'claims', label: 'Claims', count: 26, confidence: changed ? 'Changed' : 'Medium', icon: <ListChecks className="h-3.5 w-3.5" /> },
            { id: 'abstract', label: 'Abstract', confidence: 'High', icon: <FileText className="h-3.5 w-3.5" /> },
            { id: 'description', label: 'Description', confidence: changed ? 'Changed' : 'High', icon: <BookOpenText className="h-3.5 w-3.5" /> },
            { id: 'novelty', label: 'Novelty', confidence: changed ? 'Changed' : 'High', icon: <Lightbulb className="h-3.5 w-3.5" /> },
            { id: 'instructions', label: 'Attorney Instructions', icon: <FileClock className="h-3.5 w-3.5" /> },
        ],
        [changed],
    );

    return (
        <aside className="min-w-0 overflow-hidden rounded-lg border border-card-border bg-white shadow-sm" style={{ fontFamily: 'var(--font-dashboard)' }}>
            <div className="hidden border-b border-card-border/70 px-2 py-3 sm:block sm:px-3">
                <p className="truncate text-[10px] font-bold text-text-primary sm:text-[13px]">Draft Workspace</p>
                <p className="mt-0.5 hidden text-[9px] text-slate-500 sm:block">Select a unit to review.</p>
            </div>
            <div className="space-y-1 p-1 sm:p-2">
                {items.map((item, index) => {
                    const active = item.id === selectedUnit;
                    return (
                        <motion.div
                            key={item.id}
                            className={`flex items-center justify-center gap-2 rounded-md border px-1.5 py-2 transition-colors sm:justify-start sm:px-2 ${
                                active ? 'border-primary bg-primary/8 text-primary' : 'border-transparent text-text-primary'
                            }`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -8 }}
                            transition={{ duration: 0.25, delay: index * 0.04, ease: EASE }}
                        >
                            <span className={active ? 'text-primary' : 'text-slate-500'}>{item.icon}</span>
                            <span className="hidden min-w-0 flex-1 truncate text-[11px] font-semibold sm:block">
                                {item.label}{item.count ? ` · ${item.count}` : ''}
                            </span>
                            <span className="sr-only">{item.label}</span>
                            {item.confidence && (
                                <span className={`hidden shrink-0 rounded-md px-2 py-1 text-[9px] font-semibold lg:inline-flex ${badgeClass(item.confidence)}`}>
                                    {item.confidence}
                                </span>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </aside>
    );
}

function MainWorkspace({ phase, claims, selectedUnit }: { phase: Phase; claims: ClaimItem[]; selectedUnit: UnitId }) {
    const showClaimMenu = phase === 'claimRefineMenu';

    return (
        <main className="min-w-0 overflow-hidden rounded-lg border border-card-border bg-white shadow-sm" style={{ fontFamily: 'var(--font-dashboard)' }}>
            <AnimatePresence mode="wait">
                {selectedUnit === 'claims' && (
                    <motion.div
                        key="claims"
                        className="flex h-full flex-col"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: EASE }}
                    >
                        <ClaimsToolbar />
                        <div className="min-h-0 flex-1 space-y-2 overflow-hidden p-2 sm:p-3">
                            {claims.map((claim, index) => {
                                const isDependent = claim.kind === 'Dependent';
                                const nextClaim = claims[index + 1];
                                const hasNextDependent = isDependent && nextClaim?.kind === 'Dependent' && nextClaim.dependsOn === claim.dependsOn;

                                return (
                                    <div key={claim.number} className="relative">
                                        {isDependent ? (
                                            <div className="grid grid-cols-[18px_minmax(0,1fr)] sm:grid-cols-[26px_minmax(0,1fr)]">
                                                <TreeConnector continueLine={hasNextDependent} />
                                                <ClaimCard
                                                    claim={claim}
                                                    changed={phase === 'claimHistory' && claim.confidence === 'Changed'}
                                                    delay={index * 0.06}
                                                />
                                            </div>
                                        ) : (
                                            <ClaimCard
                                                claim={claim}
                                                selected={claim.number === 1}
                                                changed={phase === 'claimHistory' && claim.confidence === 'Changed'}
                                                delay={index * 0.06}
                                            />
                                        )}
                                        {showClaimMenu && claim.number === 1 && <ClaimTemplateMenu />}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {selectedUnit === 'abstract' && <AbstractWorkspace key="abstract" />}
                {selectedUnit === 'description' && <DescriptionWorkspace key="description" />}
                {selectedUnit === 'novelty' && <NoveltyWorkspace key="novelty" clean={phase === 'noveltyClean'} staleMenu={phase === 'noveltyStale'} />}
            </AnimatePresence>
        </main>
    );
}

function ClaimsToolbar() {
    return (
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-card-border px-2.5 py-2 sm:px-3">
            <div className="flex items-center gap-1.5">
                <ToolbarButton icon={<Plus className="h-3 w-3" />}>Add claim</ToolbarButton>
                <ToolbarButton className="hidden sm:inline-flex" icon={<ArrowDownUp className="h-3 w-3" />}>Reorder mode</ToolbarButton>
            </div>
            <ToolbarButton className="hidden sm:inline-flex">All <ChevronDown className="h-3 w-3" /></ToolbarButton>
        </div>
    );
}

function ClaimCard({ claim, selected, changed, delay = 0 }: { claim: ClaimItem; selected?: boolean; changed?: boolean; delay?: number }) {
    return (
        <motion.article
            className={`rounded-lg border bg-white p-3 ${selected ? 'border-primary' : changed ? 'border-dashed border-amber-400' : 'border-card-border'}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay, ease: EASE }}
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-text-primary sm:text-[13px]">Claim {claim.number}</span>
                    <span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${claim.kind === 'Independent' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                        {claim.kind}
                    </span>
                    {claim.dependsOn && <span className="hidden text-[9px] text-slate-500 sm:inline">depends on Claim {claim.dependsOn}</span>}
                    <span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${badgeClass(claim.confidence)}`}>{claim.confidence}</span>
                    <span className="text-[9px] text-slate-500">{claim.version}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <RefineButton />
                    <ToolbarButton icon={<MoreVertical className="h-3 w-3" />} />
                </div>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-slate-700 sm:text-[12px]">
                {claim.text}
            </p>
        </motion.article>
    );
}

function TreeConnector({ continueLine }: { continueLine: boolean }) {
    return (
        <div className="relative h-full min-h-20">
            <div
                className="absolute left-2 top-0 w-px bg-amber-400 sm:left-3"
                style={{
                    height: continueLine ? 'calc(100% + 8px)' : 34,
                    opacity: 0.8,
                }}
            />
            <div className="absolute left-2 top-[34px] h-px w-3 bg-amber-400 sm:left-3 sm:w-4" style={{ opacity: 0.8 }} />
        </div>
    );
}

function ClaimTemplateMenu() {
    const items = ['Make more patent-style', 'Reduce marketing tone', 'Improve clarity', 'Tighten claim scope', 'Add implementation detail'];

    return (
        <motion.div
            className="absolute right-10 top-10 z-20 hidden w-56 rounded-lg border border-card-border bg-white p-1.5 shadow-xl shadow-black/15 sm:block"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: EASE }}
        >
            {items.map((item) => {
                const selected = item === 'Tighten claim scope';
                return (
                <motion.div
                    key={item}
                    className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-text-primary"
                    animate={
                        selected
                            ? {
                                  backgroundColor: ['#ffffff', '#eef2ff', '#eef2ff'],
                                  color: ['#0f172a', '#4f46e5', '#4f46e5'],
                                  x: [0, 2, 0],
                              }
                            : {}
                    }
                    transition={selected ? { duration: 0.7, delay: 0.75, ease: EASE } : undefined}
                >
                    {selected ? (
                        <motion.span
                            className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-white"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2, delay: 1.05, ease: EASE }}
                        >
                            <Check className="h-2.5 w-2.5" />
                        </motion.span>
                    ) : (
                        <Lightbulb className="h-3.5 w-3.5 text-slate-500" />
                    )}
                    {item}
                </motion.div>
                );
            })}
        </motion.div>
    );
}

function AbstractWorkspace() {
    return (
        <motion.div
            className="flex h-full flex-col"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
        >
            <UnitHeader title="Abstract" confidence="High" version="v1" menu />
            <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
                <div className="mx-auto max-w-2xl rounded-lg border border-card-border bg-slate-50 p-5 sm:p-7">
                    <p className="text-[11px] leading-relaxed text-slate-700 sm:text-[13px]">
                        A secure training coordination system assigns participant-specific privacy budgets, verifies trusted execution attestations, and applies reliability weighting to model updates before encrypted aggregation. The approach improves auditability and model utility while preserving enterprise data boundaries.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

function DescriptionWorkspace() {
    return (
        <motion.div
            className="flex h-full flex-col"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
        >
            <UnitHeader title="Description" confidence="Changed" version="v3" rescore />
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-2 sm:p-3 lg:grid-cols-[minmax(0,1fr)_130px]">
                <div className="space-y-3 overflow-hidden">
                    {DESCRIPTION_SECTIONS.map((section, index) => (
                        <motion.section
                            key={section.label}
                            className="rounded-lg border border-dashed border-amber-400 bg-white"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: index * 0.08, ease: EASE }}
                        >
                            <div className="flex items-center justify-between border-b border-card-border px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase text-slate-500">{section.label}</span>
                                    <span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${badgeClass('Changed')}`}>Changed</span>
                                    <span className="text-[9px] text-slate-500">v2</span>
                                </div>
                                <RefineButton />
                            </div>
                            <div className="px-5 py-5 sm:px-8">
                                <h4 className="text-[11px] font-bold text-text-primary sm:text-[12px]">{section.heading}</h4>
                                <p className="mt-3 text-[10px] leading-relaxed text-slate-700 sm:text-[12px]">{section.text}</p>
                            </div>
                        </motion.section>
                    ))}
                </div>
                <div className="hidden border-l border-card-border pl-3 lg:block">
                    <p className="text-[10px] font-bold uppercase text-slate-500">On This Section</p>
                    {DESCRIPTION_SECTIONS.map((section) => (
                        <p key={section.label} className="mt-2 text-[10px] font-semibold text-primary">{section.label}</p>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function NoveltyWorkspace({ clean, staleMenu }: { clean: boolean; staleMenu: boolean }) {
    return (
        <motion.div
            className="flex h-full flex-col"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
        >
            <UnitHeader title="Novelty Analysis" confidence={clean ? 'High' : 'Changed'} version={clean ? 'v3' : 'v2'} menu />
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-2 sm:p-3 lg:grid-cols-[minmax(0,1fr)_130px]">
                <section className={`overflow-hidden rounded-lg border bg-white p-5 sm:px-8 ${clean ? 'border-card-border' : 'border-dashed border-amber-400'}`}>
                    <div className="space-y-4">
                        {NOVELTY_SECTIONS.map((section, index) => (
                            <motion.div
                                key={section.heading}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: index * 0.05, ease: EASE }}
                            >
                                <h4 className="text-[11px] font-bold text-text-primary sm:text-[13px]">{section.heading}</h4>
                                <p className="mt-2 text-[10px] leading-relaxed text-slate-700 sm:text-[12px]">{section.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
                <div className="relative hidden border-l border-card-border pl-3 lg:block">
                    <p className="text-[10px] font-bold uppercase text-slate-500">On This Section</p>
                    {NOVELTY_LINKS.map((item) => (
                        <p key={item} className="mt-2 text-[10px] font-semibold uppercase leading-snug text-primary">{item}</p>
                    ))}
                    {staleMenu && <NoveltyMenu />}
                </div>
            </div>
        </motion.div>
    );
}

function NoveltyMenu() {
    const items = ['Edit', 'Regenerate', 'Rescore confidence', 'Restore prior', 'Acknowledge stale'];

    return (
        <motion.div
            className="absolute right-2 top-0 z-20 w-48 rounded-lg border border-card-border bg-white p-1.5 shadow-xl shadow-black/15"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
        >
            {items.map((item) => {
                const selected = item === 'Acknowledge stale';
                return (
                <motion.div
                    key={item}
                    className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] text-text-primary"
                    animate={
                        selected
                            ? {
                                  backgroundColor: ['#ffffff', '#fff7ed', '#fff7ed'],
                                  color: ['#0f172a', '#c2410c', '#c2410c'],
                                  x: [0, 2, 0],
                              }
                            : {}
                    }
                    transition={selected ? { duration: 0.7, delay: 0.9, ease: EASE } : undefined}
                >
                    {selected ? (
                        <motion.span
                            className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-white"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2, delay: 1.2, ease: EASE }}
                        >
                            <Check className="h-2.5 w-2.5" />
                        </motion.span>
                    ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    {item}
                </motion.div>
                );
            })}
        </motion.div>
    );
}

function UnitHeader({
    title,
    confidence,
    version,
    menu,
    rescore,
}: {
    title: string;
    confidence: Confidence;
    version: string;
    menu?: boolean;
    rescore?: boolean;
}) {
    return (
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-card-border px-3 py-3">
            <div className="flex items-center gap-2">
                <h3 className="text-[12px] font-bold text-text-primary sm:text-[14px]">{title}</h3>
                <span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${badgeClass(confidence)}`}>{confidence}</span>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] text-slate-600">{version}</span>
            </div>
            <div className="flex items-center gap-1">
                {rescore ? <ToolbarButton icon={<Scale className="h-3 w-3" />}>Rescore all</ToolbarButton> : <RefineButton />}
                {menu && <ToolbarButton icon={<MoreVertical className="h-3 w-3" />} />}
            </div>
        </div>
    );
}

function ReviewHistoryPanel({ phase, selectedUnit }: { phase: Phase; selectedUnit: UnitId }) {
    const historyMode = ['claimHistory', 'descriptionHistory', 'noveltyStale', 'staleModal', 'noveltyClean'].includes(phase);
    const title = selectedUnit === 'claims' ? 'Claim 1' : selectedUnit === 'novelty' ? 'Novelty Analysis' : selectedUnit === 'description' ? 'Summary' : 'Abstract';

    return (
        <aside className="hidden min-w-0 overflow-hidden rounded-lg border border-card-border bg-white shadow-sm xl:block" style={{ fontFamily: 'var(--font-dashboard)' }}>
            <div className="flex items-center gap-6 border-b border-card-border px-3 py-3 text-[12px]">
                <span className={!historyMode ? 'font-semibold text-primary underline underline-offset-[12px]' : 'text-text-primary'}>Review</span>
                <span className={historyMode ? 'font-semibold text-primary underline underline-offset-[12px]' : 'text-text-primary'}>History</span>
            </div>
            <AnimatePresence mode="wait">
                {historyMode ? (
                    <HistoryContent key="history" phase={phase} title={title} />
                ) : (
                    <ReviewContent key="review" selectedUnit={selectedUnit} />
                )}
            </AnimatePresence>
        </aside>
    );
}

function ReviewContent({ selectedUnit }: { selectedUnit: UnitId }) {
    const isClaim = selectedUnit === 'claims';
    const confidence: Confidence = selectedUnit === 'claims' ? 'Medium' : 'High';

    return (
        <motion.div
            className="p-3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25, ease: EASE }}
        >
            <h3 className="text-[13px] font-bold text-text-primary">{isClaim ? 'Claim 1' : 'Abstract'} <span className="text-slate-500">{isClaim ? 'v1' : 'v1'}</span></h3>
            <span className={`mt-3 inline-flex rounded-md px-2 py-1 text-[9px] font-semibold ${badgeClass(confidence)}`}>{confidence}</span>
            <p className="mt-4 text-[12px] font-bold text-text-primary">Rationale</p>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-700">
                {isClaim
                    ? 'The independent claim captures the main coordination workflow and includes concrete security and policy limitations.'
                    : 'The abstract is concise, technical, and avoids promotional language while summarizing the core coordination approach.'}
            </p>
            <p className="mt-4 text-[12px] font-bold text-text-primary">Concerns</p>
            <div className="mt-2 rounded-md border border-card-border bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-700">
                {isClaim
                    ? 'Consider whether dependent claims should separately cover registry updates and fallback behavior when attestations expire.'
                    : 'No concerns recorded.'}
            </div>
        </motion.div>
    );
}

function HistoryContent({ phase, title }: { phase: Phase; title: string }) {
    const firstRevision = phase === 'noveltyStale' || phase === 'staleModal' || phase === 'noveltyClean';

    return (
        <motion.div
            className="h-full overflow-hidden p-3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25, ease: EASE }}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-text-primary">{title} - Revisions</h3>
                <span className="text-[10px] text-slate-500">{firstRevision ? '1' : '2'}</span>
            </div>

            <RevisionCard version={firstRevision ? 'v1' : 'v2'} current label={firstRevision ? 'AI full regen' : 'AI refinement'} />
            {!firstRevision && <RevisionCard version="v1" label="AI full regen" restore />}

            {firstRevision ? (
                <div className="mt-3 flex h-40 items-center justify-center rounded-lg border border-dashed border-card-border text-center text-[12px] leading-relaxed text-slate-500">
                    This is the first revision - nothing to compare against yet.
                </div>
            ) : (
                <div className="mt-3 space-y-2 rounded-lg border border-card-border p-3">
                    <p className="text-[11px] font-bold text-text-primary">v1 {'->'} current</p>
                    <div className="rounded-md border border-red-200 bg-red-50 p-3">
                        <p className="text-[10px] font-bold text-red-700">REMOVED 2</p>
                        <p className="mt-2 text-[10px] text-red-700 line-through">generic secure processing and unspecified participant checks</p>
                    </div>
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                        <p className="text-[10px] font-bold text-emerald-700">ADDED 9</p>
                        <p className="mt-2 text-[10px] leading-relaxed text-emerald-800">jurisdiction-tagged policy profiles, attestation freshness, and node-specific reliability weighting before aggregation</p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

function RevisionCard({ version, label, current, restore }: { version: string; label: string; current?: boolean; restore?: boolean }) {
    return (
        <div className={`mt-3 rounded-lg border p-3 ${current ? 'border-primary bg-primary/5' : 'border-card-border bg-white'}`}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-text-primary">{version}</span>
                    {current && <span className="rounded-md bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-600">Current</span>}
                    <span className="text-[9px] uppercase text-slate-500">{label}</span>
                </div>
                {restore && <ToolbarButton icon={<RotateCcw className="h-3 w-3" />}>Restore</ToolbarButton>}
            </div>
            <p className="mt-2 truncate text-[10px] text-slate-500">attorney@example.com · a minute ago</p>
            <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-slate-500">
                A coordination workflow for secure enterprise model training across multiple controlled data environments...
            </p>
        </div>
    );
}

function RefineModal() {
    return (
        <ModalShell>
            <div className="w-[min(86vw,520px)] rounded-xl bg-white p-4 shadow-2xl sm:p-5" style={{ fontFamily: 'var(--font-dashboard)' }}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-[14px] font-bold text-text-primary sm:text-[15px]">Refine Claim 1</h3>
                        <p className="mt-1.5 text-[11px] text-slate-500 sm:text-[12px]">Describe how the AI should refine this claim.</p>
                    </div>
                    <X className="h-4 w-4 text-slate-500 sm:h-5 sm:w-5" />
                </div>
                <button className="mt-4 inline-flex items-center gap-2 rounded-lg border border-card-border bg-white px-2.5 py-1.5 text-[11px] font-semibold text-text-primary sm:px-3 sm:py-2 sm:text-[12px]">
                    <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Pick a template
                </button>
                <div className="mt-3 min-h-20 rounded-lg border border-card-border p-3 text-[11px] leading-relaxed text-text-primary sm:mt-4 sm:min-h-28 sm:text-[13px]">
                    Add implementation-level limits around policy registry lookup, attestation freshness, and fallback handling for expired node credentials.
                </div>
                <div className="mt-3 flex justify-end gap-2 sm:mt-4">
                    <button className="rounded-lg border border-card-border bg-white px-3 py-2 text-[11px] text-text-primary sm:px-4 sm:text-[12px]">Cancel</button>
                    <button className="rounded-lg bg-primary px-3 py-2 text-[11px] font-bold text-white sm:px-4 sm:text-[12px]">Apply Refinement</button>
                </div>
            </div>
        </ModalShell>
    );
}

function StaleModal() {
    return (
        <ModalShell>
            <div className="w-[min(86vw,540px)] rounded-xl bg-white p-4 shadow-2xl sm:p-5" style={{ fontFamily: 'var(--font-dashboard)' }}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-[14px] font-bold text-text-primary sm:text-[15px]">Acknowledge stale: Novelty Analysis</h3>
                        <p className="mt-1.5 text-[11px] text-slate-600 sm:text-[12px]">Clear the stale flag without regenerating. The unit text remains unchanged.</p>
                    </div>
                    <X className="h-4 w-4 text-slate-500 sm:h-5 sm:w-5" />
                </div>
                <div className="mt-3 text-[11px] sm:mt-4 sm:text-[12px]">
                    <p className="font-bold text-text-primary">Fields Being Changed</p>
                    <p className="mt-2 text-slate-700">· Novelty Analysis</p>
                </div>
                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:mt-4 sm:p-4">
                    <div className="flex gap-2.5 sm:gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[12px] text-white sm:h-7 sm:w-7">i</span>
                        <p className="text-[11px] leading-relaxed text-text-primary sm:text-[12px]">
                            Claim 1 was refined moments ago. Re-review is recommended because claim scope changed.
                        </p>
                    </div>
                </div>
                <p className="mt-3 text-[11px] font-bold text-text-primary sm:mt-4 sm:text-[12px]">Reason for Change</p>
                <div className="mt-2 h-20 rounded-lg border border-primary p-3 text-[11px] text-text-primary sm:h-24 sm:text-[13px]">Acknowledged after attorney review.</div>
                <div className="mt-3 flex justify-end gap-2 sm:mt-4">
                    <button className="rounded-lg border border-card-border bg-white px-3 py-2 text-[11px] text-text-primary sm:px-4 sm:text-[12px]">Cancel</button>
                    <button className="rounded-lg bg-primary px-3 py-2 text-[11px] font-bold text-white sm:px-4 sm:text-[12px]">Acknowledge</button>
                </div>
            </div>
        </ModalShell>
    );
}

function ModalShell({ children }: { children: ReactNode }) {
    return (
        <motion.div
            className="absolute inset-0 z-40 flex items-start justify-center bg-black/45 px-2 pt-6 backdrop-blur-[2px] sm:px-3 sm:pt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
        >
            <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.28, ease: EASE }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

function RefineButton() {
    return (
        <button className="inline-flex items-center gap-1 rounded-lg border border-card-border bg-white px-2 py-1.5 text-[9px] font-bold text-text-primary shadow-sm sm:text-[11px]">
            <WandSparkles className="h-3 w-3 text-primary" />
            Refine
            <ChevronDown className="h-3 w-3 text-slate-500" />
        </button>
    );
}

function ToolbarButton({ children, icon, className = '' }: { children?: ReactNode; icon?: ReactNode; className?: string }) {
    return (
        <button className={`items-center gap-1 whitespace-nowrap rounded-lg border border-card-border bg-white px-2 py-1.5 text-[9px] font-semibold text-text-primary shadow-sm sm:text-[11px] ${children ? 'inline-flex' : 'inline-flex px-1.5'} ${className}`}>
            {icon}
            {children}
        </button>
    );
}

function badgeClass(confidence: Confidence) {
    switch (confidence) {
        case 'High':
            return 'bg-emerald-100 text-emerald-700';
        case 'Medium':
            return 'bg-amber-100 text-amber-700';
        case 'Changed':
            return 'bg-orange-100 text-orange-700';
    }
}
