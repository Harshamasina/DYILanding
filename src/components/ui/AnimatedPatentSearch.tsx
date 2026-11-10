'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    Bookmark,
    Building2,
    Calendar,
    ChevronDown,
    ChevronRight,
    Clock,
    Database,
    Download,
    ExternalLink,
    FileText,
    Flag,
    FlaskConical,
    Folder,
    Grid2X2,
    List,
    Search,
    User,
    XCircle,
} from 'lucide-react';
import { BrowserMockupChrome } from './BrowserMockupChrome';

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const SEARCH_QUERY = 'aspirin AND caffeine';
const MOCKUP_HEIGHT = 'h-[520px] sm:h-[620px] lg:h-[680px]';

const TYPE_START = 650;
const TYPE_SPEED = 55;
const SEARCH_LOADING = TYPE_START + SEARCH_QUERY.length * TYPE_SPEED + 450;
const SEARCH_RESULTS = SEARCH_LOADING + 1300;
const SEARCH_HOVER = SEARCH_RESULTS + 1700;
const DETAIL_LOADING = SEARCH_HOVER + 850;
const DETAIL_OVERVIEW = DETAIL_LOADING + 1050;
const CLAIMS_IN = DETAIL_OVERVIEW + 2600;
const COMPOUNDS_IN = CLAIMS_IN + 2600;
const REST_IN = COMPOUNDS_IN + 2600;
const FADE_OUT = REST_IN + 900;
const RESET_TIME = FADE_OUT + 500;
const LOOP_TIME = RESET_TIME + 500;

type Phase =
    | 'idle'
    | 'typing'
    | 'submitted'
    | 'loadingResults'
    | 'results'
    | 'hoverResult'
    | 'loadingDetail'
    | 'overview'
    | 'claims'
    | 'compounds'
    | 'rest'
    | 'fadeout';

const TABS = ['Overview', 'Claims', 'Compounds', 'Trials'] as const;

interface ResultItem {
    pub: string;
    date: string;
    codes: string[];
    title: string;
    inventors: string;
    abstract: string;
}

/* Every record in this mockup is illustrative: one fictional matter (a
   fixed-dose analgesic combination tablet) with DEMO publication numbers, so
   nothing reads as a real patent. The compounds are real, and each name,
   SMILES, formula, weight and InChIKey belongs to the same molecule. */
const SEARCH_RESULTS_DATA: ResultItem[] = [
    {
        pub: 'US-DEMO-2022-0042-A1',
        date: '2022-01-20',
        codes: ['A61K31/616', 'A61K31/167', 'A61K31/522'],
        title: 'Stabilized fixed-dose analgesic combination tablet',
        inventors: 'REYES, ANA, OKAFOR, DANIEL, LINDQVIST, MAJA +2 more',
        abstract:
            'A fixed-dose analgesic tablet combines acetylsalicylic acid, acetaminophen, and caffeine with an excipient system that limits hydrolysis of acetylsalicylic acid to salicylic acid during storage.',
    },
    {
        pub: 'EP-DEMO-0108-B1',
        date: '2023-06-14',
        codes: ['A61K9/2086', 'A61K31/616'],
        title: 'Bilayer tablet separating acetylsalicylic acid from acetaminophen',
        inventors: 'BRANDT, LUKAS, SATO, HARUKA +3 more',
        abstract:
            'A bilayer tablet keeps acetylsalicylic acid and acetaminophen in separate layers to reduce interaction during storage, with caffeine distributed in the second layer.',
    },
    {
        pub: 'WO-DEMO-0311-A1',
        date: '2024-03-07',
        codes: ['A61K31/522', 'A61P29/02'],
        title: 'Caffeine-containing analgesic composition for tension-type headache',
        inventors: 'MORENO, LUCIA, PATEL, RAVI +2 more',
        abstract:
            'Analgesic compositions comprising caffeine as an adjuvant to acetaminophen are described for the acute treatment of tension-type headache, with defined dose ranges for each component.',
    },
    {
        pub: 'US-DEMO-0517-B2',
        date: '2024-09-24',
        codes: ['A61K9/16', 'A61K31/616'],
        title: 'Low-moisture granulation process for aspirin combination products',
        inventors: 'HALL, GRACE, NGUYEN, TRAN +4 more',
        abstract:
            'A dry granulation process holds residual moisture below a set limit so that acetylsalicylic acid in combination products degrades less to salicylic acid.',
    },
    {
        pub: 'JP-DEMO-0057-A',
        date: '2025-02-13',
        codes: ['A61K31/167', 'A61K9/20'],
        title: 'Rapid-dissolving acetaminophen and caffeine formulation',
        inventors: 'TANAKA, KENJI, MORI, AYA +3 more',
        abstract:
            'A rapidly dissolving tablet of acetaminophen and caffeine uses a disintegrant blend to shorten dissolution time in simulated gastric fluid.',
    },
    {
        pub: 'US-DEMO-0623-A1',
        date: '2025-07-31',
        codes: ['A61P25/06', 'A61K31/616'],
        title: 'Method of treating migraine with a fixed-dose analgesic combination',
        inventors: 'REYES, ANA, CHEN, WEI +2 more',
        abstract:
            'Methods of treating migraine headache by orally administering a tablet comprising acetylsalicylic acid, acetaminophen, and caffeine are disclosed.',
    },
    {
        pub: 'EP-DEMO-0734-A1',
        date: '2026-01-15',
        codes: ['A61K31/192', 'A61K31/522'],
        title: 'Ibuprofen and caffeine combination with faster onset of action',
        inventors: 'KOWALSKI, PIOTR, ADEYEMI, TOLU +2 more',
        abstract:
            'An oral combination of ibuprofen and caffeine is formulated to reach therapeutic plasma levels sooner than ibuprofen alone in an illustrative pharmacokinetic study.',
    },
];

const PORTFOLIO_ITEMS = [
    { title: 'CAFFEINE-CONTAINING ANALGESIC COMPOSITION...', pub: 'WO-DEMO-0311-A1', savedDaysAgo: 0 },
    { title: 'RAPID-DISSOLVING ACETAMINOPHEN AND...', pub: 'JP-DEMO-0057-A', savedDaysAgo: 1 },
    { title: 'LOW-MOISTURE GRANULATION PROCESS FOR...', pub: 'US-DEMO-0517-B2', savedDaysAgo: 2 },
];

const FILTERS = ['Jurisdiction', 'Filing date', 'IPC / CPC', 'Assignee', 'Inventor', 'Scope'];

const DETAIL = {
    country: 'US',
    number: 'DEMO-2022-0042',
    kind: 'A1',
    title: 'Stabilized fixed-dose analgesic combination tablet',
    applicants: 'NORTHSTAR PHARMA...',
    inventor: 'REYES ANA, OKAFOR...',
    ipc: 'A61K31/616',
    source: 'Cache',
    cache: 'L1',
    latency: '12916 ms',
    compounds: 5,
    trials: 3,
};

const BIBLIO_COLUMNS = [
    [
        ['Publication number', 'US-DEMO-2022-0042-A1'],
        ['Country code', 'US'],
        ['Kind code', 'A1'],
    ],
    [
        ['Publication date', '20 Jan 2022'],
        ['Application date', '14 Jul 2021'],
        ['Priority date', '15 Jul 2020'],
    ],
    [
        ['Source', 'Cache'],
        ['Cache', 'L1'],
        ['Latency', '9407 ms'],
    ],
] as const;

const IPC_CODES = ['A61K31/616', 'A61K31/167', 'A61K31/522', 'A61K9/20', 'A61P29/02'] as const;

const FAMILY_MEMBERS = [
    ['US', 'A1', 'US-DEMO-2022-0042-A1'],
    ['US', 'B2', 'US-DEMO-0042-B2'],
    ['EP', 'A1', 'EP-DEMO-0042-A1'],
    ['WO', 'A1', 'WO-DEMO-0042-A1'],
    ['CA', 'A1', 'CA-DEMO-0042-A1'],
    ['JP', 'A', 'JP-DEMO-0042-A'],
    ['AU', 'A1', 'AU-DEMO-0042-A1'],
] as const;

interface ClaimItem {
    number: number;
    type: 'Independent' | 'Dependent';
    dependsOn?: number;
    text: string;
}

const CLAIMS: ClaimItem[] = [
    {
        number: 1,
        type: 'Independent',
        text:
            'A pharmaceutical tablet comprising acetylsalicylic acid, acetaminophen, and caffeine, wherein the weight ratio of acetylsalicylic acid to caffeine is from 3:1 to 5:1, and a pharmaceutically acceptable excipient.',
    },
    {
        number: 2,
        type: 'Dependent',
        dependsOn: 1,
        text: 'The tablet of claim 1, comprising 250 mg acetylsalicylic acid, 250 mg acetaminophen, and 65 mg caffeine.',
    },
    {
        number: 3,
        type: 'Dependent',
        dependsOn: 1,
        text: 'The tablet of claim 1, wherein the tablet is film-coated.',
    },
    {
        number: 4,
        type: 'Dependent',
        dependsOn: 3,
        text: 'The tablet of claim 3, wherein the film coating comprises hydroxypropyl methylcellulose.',
    },
    {
        number: 5,
        type: 'Dependent',
        dependsOn: 1,
        text: 'The tablet of claim 1, wherein the acetylsalicylic acid is present in a layer separate from the acetaminophen.',
    },
    {
        number: 6,
        type: 'Dependent',
        dependsOn: 1,
        text:
            'The tablet of claim 1, wherein the salicylic acid content does not exceed 3% of the acetylsalicylic acid content after 12 months of storage at 25 degrees C and 60% relative humidity.',
    },
    {
        number: 7,
        type: 'Dependent',
        dependsOn: 1,
        text: 'The tablet of claim 1, for use in the acute treatment of migraine headache.',
    },
    {
        number: 8,
        type: 'Dependent',
        dependsOn: 1,
        text: 'A method of treating acute pain, comprising orally administering the tablet of claim 1 to a patient in need thereof.',
    },
];

const CLAIM_BY_NUMBER = new Map(CLAIMS.map((claim) => [claim.number, claim]));

const CLAIM_TREE_ITEMS = CLAIMS.map((claim) => {
    let depth = 0;
    let parentNumber = claim.dependsOn;
    const seen = new Set<number>();

    while (parentNumber && !seen.has(parentNumber)) {
        seen.add(parentNumber);
        const parent = CLAIM_BY_NUMBER.get(parentNumber);
        if (!parent) break;
        depth += 1;
        parentNumber = parent.dependsOn;
    }

    return {
        claim,
        depth,
    };
});

type StructureId = 'aspirin' | 'salicylic' | 'paracetamol' | 'ibuprofen' | 'caffeine';

interface CompoundItem {
    name: string;
    structure: StructureId;
    inchiKey: string;
    formula: string;
    mw: string;
    smiles: string;
    source: string;
}

const COMPOUNDS: CompoundItem[] = [
    { name: 'Aspirin', structure: 'aspirin', inchiKey: 'BSYNRYMUTXBXSQ-UHFFFAOYSA-N', formula: 'C9H8O4', mw: '180.16 g/mol', smiles: 'CC(=O)Oc1ccccc1C(=O)O', source: 'Claim 1' },
    { name: 'Acetaminophen', structure: 'paracetamol', inchiKey: 'RZVAJINKPMORJF-UHFFFAOYSA-N', formula: 'C8H9NO2', mw: '151.16 g/mol', smiles: 'CC(=O)Nc1ccc(O)cc1', source: 'Claim 1' },
    { name: 'Caffeine', structure: 'caffeine', inchiKey: 'RYYVLZVUVIJVGH-UHFFFAOYSA-N', formula: 'C8H10N4O2', mw: '194.19 g/mol', smiles: 'Cn1cnc2c1c(=O)n(C)c(=O)n2C', source: 'Claim 1' },
    { name: 'Salicylic acid', structure: 'salicylic', inchiKey: 'YGSDEFSMJLZEOE-UHFFFAOYSA-N', formula: 'C7H6O3', mw: '138.12 g/mol', smiles: 'O=C(O)c1ccccc1O', source: 'Claim 6' },
    { name: 'Ibuprofen', structure: 'ibuprofen', inchiKey: 'HEFNNWSXXWATRW-UHFFFAOYSA-N', formula: 'C13H18O2', mw: '206.28 g/mol', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O', source: 'Description ¶ [0018]' },
];

export function AnimatedPatentSearch() {
    const [typedText, setTypedText] = useState('');
    const [phase, setPhase] = useState<Phase>('idle');
    const [reducedMotion, setReducedMotion] = useState(false);

    const runCycle = useCallback(() => {
        setTypedText('');
        setPhase('idle');

        const timers: ReturnType<typeof setTimeout>[] = [];
        let charIndex = 0;

        timers.push(
            setTimeout(() => {
                setPhase('typing');
                const interval = setInterval(() => {
                    charIndex++;
                    setTypedText(SEARCH_QUERY.slice(0, charIndex));
                    if (charIndex >= SEARCH_QUERY.length) clearInterval(interval);
                }, TYPE_SPEED);
                timers.push(interval as unknown as ReturnType<typeof setTimeout>);
            }, TYPE_START),
        );

        timers.push(setTimeout(() => setPhase('submitted'), SEARCH_LOADING - 350));
        timers.push(setTimeout(() => setPhase('loadingResults'), SEARCH_LOADING));
        timers.push(setTimeout(() => setPhase('results'), SEARCH_RESULTS));
        timers.push(setTimeout(() => setPhase('hoverResult'), SEARCH_HOVER));
        timers.push(setTimeout(() => setPhase('loadingDetail'), DETAIL_LOADING));
        timers.push(setTimeout(() => setPhase('overview'), DETAIL_OVERVIEW));
        timers.push(setTimeout(() => setPhase('claims'), CLAIMS_IN));
        timers.push(setTimeout(() => setPhase('compounds'), COMPOUNDS_IN));
        timers.push(setTimeout(() => setPhase('rest'), REST_IN));
        timers.push(setTimeout(() => setPhase('fadeout'), FADE_OUT));
        timers.push(
            setTimeout(() => {
                setTypedText('');
                setPhase('idle');
            }, RESET_TIME),
        );

        return timers;
    }, []);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updateMotionPreference = () => setReducedMotion(media.matches);

        updateMotionPreference();
        media.addEventListener('change', updateMotionPreference);
        return () => media.removeEventListener('change', updateMotionPreference);
    }, []);

    useEffect(() => {
        if (reducedMotion) {
            setTypedText(SEARCH_QUERY);
            setPhase('overview');
            return;
        }

        let timers = runCycle();
        const interval = setInterval(() => {
            timers.forEach(clearTimeout);
            timers = runCycle();
        }, LOOP_TIME);

        return () => {
            timers.forEach(clearTimeout);
            clearInterval(interval);
        };
    }, [runCycle, reducedMotion]);

    const showSearch = ['idle', 'typing', 'submitted', 'loadingResults', 'results', 'hoverResult'].includes(phase);
    const showDetail = ['loadingDetail', 'overview', 'claims', 'compounds', 'rest'].includes(phase);
    const activeTab = phase === 'claims' ? 'Claims' : phase === 'compounds' || phase === 'rest' ? 'Compounds' : 'Overview';
    const browserUrl = getPatentBrowserUrl(phase);

    return (
        <div
            aria-hidden="true"
            role="img"
            className={`relative flex flex-col overflow-hidden rounded-xl border border-card-border bg-[#f8f8fa] shadow-2xl shadow-black/10 select-none ${MOCKUP_HEIGHT}`}
        >
            <BrowserMockupChrome url={browserUrl} record="DEMO-PAS-001" screen="Patent search" />
            <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
                <AnimatePresence mode="wait">
                    {showSearch && (
                        <motion.div
                            key="search"
                            className="absolute inset-0"
                            initial={false}
                            animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                        >
                            <SearchScreen
                                typedText={typedText}
                                showCursor={phase === 'idle' || phase === 'typing'}
                                submitted={phase === 'submitted'}
                                loading={phase === 'loadingResults'}
                                showResults={phase === 'results' || phase === 'hoverResult'}
                                hoverTop={phase === 'hoverResult'}
                            />
                        </motion.div>
                    )}

                    {showDetail && (
                        <motion.div
                            key="detail"
                            className="absolute inset-0"
                            initial={false}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                        >
                            {phase === 'loadingDetail' ? <DetailSkeleton /> : <DetailScreen activeTab={activeTab} />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                @keyframes patent-cursor-blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
                @keyframes patent-shimmer { 100% { transform: translateX(100%); } }
                .patent-search-skeleton {
                    position: relative;
                    overflow: hidden;
                    background: #eef2f7;
                }
                .patent-search-skeleton::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    transform: translateX(-100%);
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.78), transparent);
                    animation: patent-shimmer 1.15s infinite;
                }
            `}</style>
        </div>
    );
}

function getPatentBrowserUrl(phase: Phase) {
    if (phase === 'loadingDetail' || phase === 'overview') {
        return 'search.designyourinvention.com/US-DEMO-2022-0042-A1/overview';
    }
    if (phase === 'claims') {
        return 'search.designyourinvention.com/US-DEMO-2022-0042-A1/claims';
    }
    if (phase === 'compounds' || phase === 'rest') {
        return 'search.designyourinvention.com/US-DEMO-2022-0042-A1/compounds';
    }
    if (phase === 'submitted' || phase === 'loadingResults' || phase === 'results' || phase === 'hoverResult') {
        return 'search.designyourinvention.com/?q=aspirin%20AND%20caffeine';
    }
    return 'search.designyourinvention.com/';
}

function SearchScreen({
    typedText,
    showCursor,
    submitted,
    loading,
    showResults,
    hoverTop,
}: {
    typedText: string;
    showCursor: boolean;
    submitted: boolean;
    loading: boolean;
    showResults: boolean;
    hoverTop: boolean;
}) {
    return (
        <div className="flex h-full flex-col bg-white px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
            <div
                className="mx-auto flex w-full max-w-[920px] items-center gap-2 rounded-xl border-2 border-primary bg-white px-3 py-2 shadow-[0_18px_45px_rgba(79,70,229,0.12)] sm:rounded-2xl sm:px-4 sm:py-3"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                <span className="hidden shrink-0 items-center gap-1.5 text-[10px] font-semibold text-text-primary sm:inline-flex lg:text-[13px]">
                    Keyword
                    <ChevronDown className="h-3 w-3 text-text-muted" />
                </span>
                <span className="hidden h-5 w-px bg-card-border sm:block" />
                <Search className="h-4 w-4 shrink-0 text-slate-500" />
                <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-text-primary sm:text-[13px] lg:text-[15px]">
                    {typedText}
                    {showCursor && (
                        <span
                            className="ml-0.5 inline-block h-[13px] w-px translate-y-0.5 bg-text-primary sm:h-[16px]"
                            style={{ animation: 'patent-cursor-blink 0.8s step-end infinite' }}
                        />
                    )}
                </span>
                {typedText && <XCircle className="hidden h-3.5 w-3.5 shrink-0 text-slate-400 sm:block" />}
                <motion.span
                    className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-white sm:px-4 sm:py-2 sm:text-[12px] lg:text-[14px]"
                    animate={submitted ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35, ease: EASE }}
                >
                    Search patents
                </motion.span>
            </div>

            <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-[180px_minmax(0,1fr)_180px] xl:grid-cols-[190px_minmax(0,1fr)_190px]">
                <FilterPanel loading={loading} />

                <main className="min-w-0 overflow-hidden">
                    <SearchResultsToolbar loading={loading} showResults={showResults} />
                    <div className="mt-2 rounded-md border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-[8px] text-slate-600 sm:text-[10px]" style={{ fontFamily: 'var(--font-body)' }}>
                        {loading ? (
                            <Skeleton className="h-3 w-2/3 rounded" />
                        ) : (
                            'Signed in with a work email returns more results per page (and a higher hourly search limit), same features either way.'
                        )}
                    </div>

                    <div className="mt-3 space-y-2.5 overflow-hidden">
                        {loading || !showResults ? (
                            <SearchResultsSkeleton />
                        ) : (
                            SEARCH_RESULTS_DATA.map((result, index) => (
                                <SearchResultCard
                                    key={result.pub}
                                    result={result}
                                    index={index}
                                    highlighted={hoverTop && index === 0}
                                />
                            ))
                        )}
                    </div>
                </main>

                <PortfolioPanel loading={loading} />
            </div>
        </div>
    );
}

function SearchResultsToolbar({ loading, showResults }: { loading: boolean; showResults: boolean }) {
    return (
        <div className="flex items-end justify-between gap-3" style={{ fontFamily: 'var(--font-body)' }}>
            <div>
                <p className="text-[12px] font-bold text-text-primary sm:text-[15px]">
                    {loading || !showResults ? <Skeleton className="h-4 w-20 rounded" /> : '183 results'}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-600 sm:text-[11px]">
                    {loading || !showResults ? <Skeleton className="h-3 w-24 rounded" /> : 'Showing 20 of 183'}
                </p>
            </div>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
                <button className="inline-flex items-center gap-1 rounded-md border border-card-border bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-400">
                    <Download className="h-3 w-3" />
                    Export CSV
                </button>
                <button className="inline-flex items-center gap-1 rounded-md border border-card-border bg-white px-2.5 py-1.5 text-[10px] text-text-primary">
                    Sort by: Relevance
                    <ChevronDown className="h-3 w-3 text-text-muted" />
                </button>
                <span className="inline-flex overflow-hidden rounded-md border border-card-border bg-white">
                    <span className="bg-indigo-50 px-2 py-1.5 text-primary">
                        <List className="h-3.5 w-3.5" />
                    </span>
                    <span className="border-l border-card-border px-2 py-1.5 text-slate-500">
                        <Grid2X2 className="h-3.5 w-3.5" />
                    </span>
                </span>
            </div>
        </div>
    );
}

function FilterPanel({ loading }: { loading: boolean }) {
    return (
        <aside className="hidden min-h-0 lg:block">
            <div className="rounded-lg border border-card-border bg-white p-3 shadow-sm" style={{ fontFamily: 'var(--font-body)' }}>
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-text-primary">Filters</span>
                    <span className="text-[9px] text-slate-500">Clear all</span>
                </div>
                <div className="divide-y divide-card-border">
                    {FILTERS.map((filter) => (
                        <div key={filter} className="flex items-center justify-between py-2.5 text-[11px] text-text-primary">
                            {loading ? <Skeleton className="h-3 w-20 rounded" /> : filter}
                            <ChevronDown className="h-3 w-3 text-slate-500" />
                        </div>
                    ))}
                </div>
                <button className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-[11px] font-bold text-white shadow-lg shadow-primary/20">
                    Apply filters
                </button>
            </div>
        </aside>
    );
}

function PortfolioPanel({ loading }: { loading: boolean }) {
    return (
        <aside className="hidden min-h-0 lg:block">
            <div className="rounded-lg border border-card-border bg-white p-3 shadow-sm" style={{ fontFamily: 'var(--font-body)' }}>
                <div className="flex items-center gap-2 text-[11px] font-bold text-text-primary">
                    <Folder className="h-3.5 w-3.5 text-slate-600" />
                    Your patent portfolio
                </div>
                <p className="mt-2 text-[9px] text-slate-600">{loading ? <Skeleton className="h-3 w-20 rounded" /> : '3 saved patents'}</p>
                <div className="mt-3 space-y-2">
                    {loading
                        ? [0, 1, 2].map((item) => (
                              <div key={item} className="rounded-md border border-card-border bg-slate-50 p-2.5">
                                  <Skeleton className="h-3 w-full rounded" />
                                  <Skeleton className="mt-1.5 h-2.5 w-16 rounded" />
                                  <Skeleton className="mt-1.5 h-2.5 w-24 rounded" />
                              </div>
                          ))
                        : PORTFOLIO_ITEMS.map((item) => (
                              <div key={item.pub} className="rounded-md border border-card-border bg-slate-50 p-2.5">
                                  <p className="truncate text-[9px] font-semibold uppercase leading-snug text-primary">{item.title}</p>
                                  <p className="mt-1 text-[7px] text-text-primary" style={{ fontFamily: 'var(--font-mono)' }}>{item.pub}</p>
                                  <p className="mt-1 text-[7px] text-slate-500">Saved {formatSavedDate(item.savedDaysAgo)}</p>
                              </div>
                          ))}
                </div>
                <button className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-md border border-card-border bg-white px-2 py-2 text-[10px] font-bold text-text-primary">
                    <Folder className="h-3 w-3" />
                    View all
                </button>
                <p className="mt-3 text-[9px] text-primary">DYI Docketing has more {'->'}</p>
            </div>
        </aside>
    );
}

function formatSavedDate(daysAgo: number) {
    if (daysAgo === 0) return 'today';
    if (daysAgo === 1) return 'yesterday';
    return `${daysAgo} days ago`;
}

function SearchResultCard({ result, index, highlighted }: { result: ResultItem; index: number; highlighted: boolean }) {
    return (
        <motion.article
            className="relative rounded-lg border bg-white p-3 shadow-sm"
            style={{
                fontFamily: 'var(--font-body)',
                borderColor: highlighted ? '#4f46e5' : 'var(--color-card-border, #e2e8f0)',
                boxShadow: highlighted ? '0 0 0 2px rgba(79,70,229,0.12)' : undefined,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: index * 0.06, ease: EASE }}
        >
            <Bookmark className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-500" />
            <h3 className="pr-6 text-[11px] font-bold leading-snug text-primary sm:text-[13px]">
                {result.title}
            </h3>
            <p className="mt-1 text-[8px] font-semibold text-slate-700" style={{ fontFamily: 'var(--font-mono)' }}>
                {result.pub}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Pill>US</Pill>
                <span className="inline-flex items-center gap-1 text-[8px] text-slate-600" style={{ fontFamily: 'var(--font-mono)' }}>
                    <Calendar className="h-2.5 w-2.5" />
                    {result.date}
                </span>
                {result.codes.map((code) => (
                    <Pill key={code}>{code}</Pill>
                ))}
            </div>
            <p className="mt-1.5 flex items-center gap-1 truncate text-[8px] text-slate-600 sm:text-[9px]">
                <User className="h-3 w-3 shrink-0" />
                {result.inventors}
            </p>
            <p className="mt-1.5 max-h-[38px] overflow-hidden text-[9px] leading-relaxed text-slate-600 sm:text-[10px]">
                {result.abstract}
            </p>
        </motion.article>
    );
}

function SearchResultsSkeleton() {
    return (
        <>
            {[0, 1, 2, 3, 4].map((item) => (
                <article key={item} className="rounded-lg border border-card-border bg-white p-3">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="mt-2 h-3 w-24 rounded" />
                    <div className="mt-2 flex gap-1.5">
                        <Skeleton className="h-4 w-8 rounded" />
                        <Skeleton className="h-4 w-20 rounded" />
                        <Skeleton className="h-4 w-20 rounded" />
                    </div>
                    <Skeleton className="mt-2 h-3 w-2/3 rounded" />
                    <Skeleton className="mt-2 h-3 w-full rounded" />
                    <Skeleton className="mt-1.5 h-3 w-5/6 rounded" />
                </article>
            ))}
        </>
    );
}

function DetailSkeleton() {
    return (
        <div className="h-full overflow-hidden bg-white px-4 py-4 sm:px-6 lg:px-8" style={{ fontFamily: 'var(--font-body)' }}>
            <div className="mx-auto h-full max-w-[1220px] overflow-hidden">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-4 w-36 rounded" />
                </div>
                <div className="mt-5 rounded-xl border border-card-border bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <Skeleton className="h-3 w-24 rounded" />
                            <Skeleton className="mt-4 h-7 w-72 rounded" />
                            <Skeleton className="mt-3 h-5 w-2/3 rounded" />
                        </div>
                        <div className="hidden gap-2 sm:flex">
                            <Skeleton className="h-9 w-32 rounded-lg" />
                            <Skeleton className="h-9 w-36 rounded-lg" />
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-4 border-t border-card-border pt-4 lg:grid-cols-6">
                        {[0, 1, 2, 3, 4, 5].map((item) => (
                            <Skeleton key={item} className="h-8 rounded" />
                        ))}
                    </div>
                </div>
                <div className="mt-6 grid min-h-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div>
                        <div className="flex gap-8 border-b border-card-border pb-3">
                            {[0, 1, 2, 3].map((item) => (
                                <Skeleton key={item} className="h-4 w-20 rounded" />
                            ))}
                        </div>
                        <div className="mt-4 rounded-xl border border-card-border p-5">
                            <Skeleton className="h-5 w-20 rounded" />
                            <Skeleton className="mt-4 h-4 w-full rounded" />
                            <Skeleton className="mt-2 h-4 w-11/12 rounded" />
                            <Skeleton className="mt-2 h-4 w-9/12 rounded" />
                        </div>
                    </div>
                    <div className="hidden rounded-xl border border-card-border p-5 lg:block">
                        <Skeleton className="h-5 w-36 rounded" />
                        <Skeleton className="mt-5 h-14 rounded-lg" />
                        <Skeleton className="mt-3 h-14 rounded-lg" />
                        <Skeleton className="mt-4 h-16 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailScreen({ activeTab }: { activeTab: (typeof TABS)[number] }) {
    if (activeTab === 'Claims') {
        return <ClaimsWorkspace />;
    }

    if (activeTab === 'Compounds') {
        return <CompoundsWorkspace />;
    }

    return <OverviewWorkspace />;
}

function OverviewWorkspace() {
    return (
        <div className="h-full overflow-hidden bg-white px-4 py-4 sm:px-6 lg:px-8" style={{ fontFamily: 'var(--font-body)' }}>
            <div className="mx-auto h-full max-w-[1220px] overflow-hidden">
                <Breadcrumb />
                <PatentHeader />
                <div className="mt-5 grid min-h-0 grid-cols-1 items-start gap-5 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-w-0 overflow-hidden">
                        <TabBar active="Overview" />
                        <motion.div
                            className="mt-4 rounded-xl border border-card-border bg-white p-4 sm:p-5"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                        >
                            <h3 className="text-[15px] font-bold text-text-primary">Abstract</h3>
                            <p className="mt-3 text-[11px] leading-relaxed text-slate-600 sm:text-[13px]">
                                A fixed-dose analgesic tablet combines acetylsalicylic acid, acetaminophen, and caffeine with an excipient system that limits hydrolysis of acetylsalicylic acid to salicylic acid during storage.
                            </p>
                            <p className="mt-3 text-[11px] font-semibold text-primary">Show more</p>
                        </motion.div>

                        <BibliographicDetailsCard />
                        <PatentFamilyCard />
                    </div>
                    <IntelligencePanel />
                </div>
            </div>
        </div>
    );
}

function BibliographicDetailsCard() {
    return (
        <motion.section
            className="mt-4 rounded-xl border border-card-border bg-white p-4 sm:p-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
        >
            <h3 className="text-[15px] font-bold text-text-primary">Bibliographic details</h3>

            <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-3">
                {BIBLIO_COLUMNS.map((column, columnIndex) => (
                    <div key={columnIndex} className="space-y-1">
                        {column.map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between gap-4 border-b border-card-border/80 pb-1">
                                <span className="text-[10px] text-slate-600">{label}</span>
                                <span className="shrink-0 text-[9px] font-semibold text-text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="mt-4 border-t border-card-border pt-4">
                <BiblioInfoRow label="Applicants">
                    <span className="font-semibold text-text-primary">MASSACHUSETTS GEN HOSPITAL</span>
                </BiblioInfoRow>
                <BiblioInfoRow label="Inventor">
                    <span className="font-semibold text-text-primary">JOUNG J KEITH; KLEINSTIVER BENJAMIN</span>
                </BiblioInfoRow>
                <BiblioInfoRow label="IPC">
                    <span className="flex flex-wrap gap-1.5">
                        {IPC_CODES.map((code) => (
                            <Pill key={code}>{code}</Pill>
                        ))}
                    </span>
                </BiblioInfoRow>
            </div>

            <div className="mt-5 border-t border-card-border pt-5">
                <div className="relative grid grid-cols-3 gap-4">
                    <div className="absolute left-[12%] right-[12%] top-[18px] hidden border-t border-dashed border-card-border sm:block" />
                    <TimelinePoint icon={<Flag className="h-3.5 w-3.5" />} date="26 Jul 2016" label="Priority date" />
                    <TimelinePoint icon={<FileText className="h-3.5 w-3.5" />} date="12 Oct 2021" label="Application date" />
                    <TimelinePoint icon={<Calendar className="h-3.5 w-3.5" />} date="31 Mar 2026" label="Publication date" />
                </div>
            </div>
        </motion.section>
    );
}

function BiblioInfoRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="grid grid-cols-[90px_minmax(0,1fr)] items-center gap-4 py-1.5 text-[10px] sm:grid-cols-[112px_minmax(0,1fr)]">
            <span className="text-slate-600">{label}</span>
            <div className="min-w-0 truncate text-[10px]">{children}</div>
        </div>
    );
}

function TimelinePoint({ icon, date, label }: { icon: ReactNode; date: string; label: string }) {
    return (
        <div className="relative z-10 flex flex-col items-center text-center">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-card-border bg-slate-50 text-primary">
                {icon}
            </span>
            <span className="mt-2 text-[9px] font-semibold text-text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                {date}
            </span>
            <span className="text-[9px] text-slate-600">{label}</span>
        </div>
    );
}

function PatentFamilyCard() {
    return (
        <motion.section
            className="mt-4 rounded-xl border border-card-border bg-white p-4 sm:p-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16, ease: EASE }}
        >
            <h3 className="text-[15px] font-bold text-text-primary">Patent family</h3>
            <div className="mt-4 divide-y divide-card-border">
                {FAMILY_MEMBERS.map(([country, kind, publication]) => (
                    <div key={publication} className="flex items-center gap-3 py-2">
                        <span className="inline-flex min-w-12 items-center justify-center gap-1 rounded border border-card-border bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-600" style={{ fontFamily: 'var(--font-mono)' }}>
                            {country}
                            <span>{kind}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-primary" style={{ fontFamily: 'var(--font-mono)' }}>{publication}</span>
                        <span className="text-[10px] text-slate-500">-</span>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}

function ClaimsWorkspace() {
    return (
        <div className="h-full overflow-hidden bg-white px-4 py-4 sm:px-6 lg:px-8" style={{ fontFamily: 'var(--font-body)' }}>
            <div className="mx-auto grid h-full max-w-[1180px] grid-cols-1 items-start gap-5 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
                <main className="min-w-0 overflow-hidden">
                    <TabBar active="Claims" />
                    <motion.section
                        className="mt-4 h-full overflow-hidden rounded-xl border border-card-border bg-white p-4 sm:p-5"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                    >
                        <h3 className="text-[15px] font-bold text-text-primary">Claims</h3>
                        <div className="mt-3 flex items-center gap-2">
                            <Pill>33 claims</Pill>
                            <span className="text-[9px] text-slate-600" style={{ fontFamily: 'var(--font-mono)' }}>Language: en</span>
                        </div>
                        <div className="mt-3 overflow-hidden">
                            <div className="relative space-y-3 overflow-hidden">
                                <span
                                    aria-hidden="true"
                                    className="absolute bottom-5 top-5 w-px rounded-full bg-primary/80"
                                    style={{ left: 10 }}
                                />
                                {CLAIM_TREE_ITEMS.map(({ claim, depth }, index) => (
                                    <motion.article
                                        key={claim.number}
                                        className="relative rounded-lg border border-card-border bg-white p-3 shadow-sm"
                                        style={{
                                            marginLeft: `${34 + depth * 22}px`,
                                            borderLeftColor: claim.type === 'Independent' ? '#4f46e5' : '#c4b5fd',
                                            borderLeftWidth: claim.type === 'Independent' ? 3 : 2,
                                        }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.28, delay: index * 0.05, ease: EASE }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="absolute top-6 h-px rounded-full bg-primary/70"
                                            style={{ left: `-${24 + depth * 22}px`, width: `${24 + depth * 22}px` }}
                                        />
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[12px] font-bold text-text-primary">Claim {claim.number}</span>
                                            <Pill tone="indigo">{claim.type}</Pill>
                                            {claim.dependsOn && (
                                                <span className="text-[9px] text-slate-600">
                                                    depends on <span className="text-primary">Claim {claim.dependsOn}</span>
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-2 max-h-[54px] overflow-hidden text-[11px] leading-relaxed text-slate-600 sm:text-[12px]">
                                            {claim.text}
                                        </p>
                                    </motion.article>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                </main>
                <IntelligencePanel dimCompounds />
            </div>
        </div>
    );
}

function CompoundsWorkspace() {
    return (
        <div className="h-full overflow-hidden bg-white px-4 py-4 sm:px-6 lg:px-8" style={{ fontFamily: 'var(--font-body)' }}>
            <div className="mx-auto grid h-full max-w-[1180px] grid-cols-1 items-start gap-5 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
                <main className="min-w-0 overflow-hidden">
                    <TabBar active="Compounds" />
                    <motion.section
                        className="mt-4 h-full overflow-hidden rounded-xl border border-card-border bg-white p-4 sm:p-5"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                    >
                        <h3 className="text-[15px] font-bold text-text-primary">Disclosed compounds</h3>
                        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                            {COMPOUNDS.map((compound, index) => (
                                <motion.article
                                    key={compound.inchiKey}
                                    className="min-h-[142px] rounded-lg border border-card-border bg-white p-3"
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.28, delay: index * 0.05, ease: EASE }}
                                >
                                    <div className="flex h-16 items-center justify-center sm:h-20">
                                        <Molecule structure={compound.structure} />
                                    </div>
                                    <p className="mt-2 truncate text-[8px] font-semibold text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                                        {compound.inchiKey}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <p className="text-[9px] text-slate-600">{compound.mw}</p>
                                        <Pill>{compound.name}</Pill>
                                    </div>
                                    <p className="mt-1 truncate text-[8px] text-text-primary" style={{ fontFamily: 'var(--font-mono)' }}>{compound.smiles}</p>
                                    <p className="mt-1 text-[8px] text-slate-600" style={{ fontFamily: 'var(--font-mono)' }}>{compound.source}</p>
                                </motion.article>
                            ))}
                        </div>
                    </motion.section>
                </main>
                <IntelligencePanel />
            </div>
        </div>
    );
}

/* A still frame of the compounds view for the Drug-Discovery section: three
   disclosed compounds and one linked trial, readable at every width. The
   record is illustrative, like the rest of the mockup. */
const STILL_COMPOUNDS = [COMPOUNDS[0], COMPOUNDS[1], COMPOUNDS[2]];

export function CompoundsTrialsStill() {
    return (
        <div className="overflow-hidden rounded-xl border border-card-border bg-white shadow-sm [font-family:var(--font-body)]">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-card-border px-4 py-3 sm:px-5">
                <p className="text-sm font-semibold text-text-primary">Disclosed compounds</p>
                <p className="text-xs text-text-secondary">3 of {DETAIL.compounds} shown · from claims and description</p>
            </div>
            <ul className="grid grid-cols-1 divide-y divide-card-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {STILL_COMPOUNDS.map((compound) => (
                    <li key={compound.inchiKey} className="flex items-center gap-3 px-4 py-3 sm:flex-col sm:items-start sm:px-5 sm:py-4">
                        <div className="flex h-16 w-20 shrink-0 items-center justify-center sm:h-20 sm:w-full">
                            <Molecule structure={compound.structure} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary">{compound.name}</p>
                            <p className="mt-0.5 truncate text-xs font-semibold text-primary [font-family:var(--font-mono)]">{compound.inchiKey}</p>
                            <p className="mt-1 text-xs text-text-secondary">{compound.formula} · {compound.mw} · {compound.source}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="border-t border-card-border px-4 py-3 sm:px-5">
                <p className="text-sm font-semibold text-text-primary">Linked clinical trials</p>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-5">
                    <div className="min-w-0">
                        <dt className="text-text-secondary">Trial</dt>
                        <dd className="mt-0.5 truncate font-semibold text-primary [font-family:var(--font-mono)]">NCT-DEMO-0042</dd>
                    </div>
                    <div>
                        <dt className="text-text-secondary">Phase</dt>
                        <dd className="mt-0.5 text-text-primary">Phase 2</dd>
                    </div>
                    <div>
                        <dt className="text-text-secondary">Status</dt>
                        <dd className="mt-0.5 text-text-primary">Recruiting</dd>
                    </div>
                    <div className="min-w-0">
                        <dt className="text-text-secondary">Sponsor</dt>
                        <dd className="mt-0.5 truncate text-text-primary">Northstar Pharma</dd>
                    </div>
                    <div className="min-w-0">
                        <dt className="text-text-secondary">Indication</dt>
                        <dd className="mt-0.5 truncate text-text-primary">Migraine</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}

function Breadcrumb() {
    return (
        <div className="flex items-center gap-2 text-[11px] text-text-primary">
            <span className="text-primary">Search</span>
            <span className="text-slate-400">/</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>US-DEMO-2022-0042-A1</span>
        </div>
    );
}

function PatentHeader() {
    return (
        <section className="mt-5 rounded-xl border border-card-border bg-white p-5" style={{ fontFamily: 'var(--font-body)' }}>
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Patent Detail</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span className="text-[18px] text-slate-600 sm:text-[22px]">{DETAIL.country}</span>
                        <span className="text-[20px] font-bold text-text-primary sm:text-[25px]" style={{ fontFamily: 'var(--font-mono)' }}>
                            {DETAIL.number}
                        </span>
                        <Pill>{DETAIL.kind}</Pill>
                    </div>
                    <h2 className="mt-2 truncate text-[18px] font-bold text-text-primary sm:text-[22px]">
                        {DETAIL.title}
                    </h2>
                </div>
                <div className="hidden shrink-0 items-center gap-2 md:flex">
                    <button className="inline-flex items-center gap-2 rounded-md border border-card-border bg-white px-3 py-2 text-[12px] font-bold text-text-primary shadow-sm">
                        <Bookmark className="h-4 w-4" />
                        Save to portfolio
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-md border border-card-border bg-white px-3 py-2 text-[12px] font-bold text-text-primary shadow-sm">
                        <ExternalLink className="h-4 w-4" />
                        View on Espacenet
                    </button>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-card-border pt-4 lg:grid-cols-6">
                <HeaderMeta icon={<Building2 className="h-3.5 w-3.5" />} label="Applicants" value={DETAIL.applicants} />
                <HeaderMeta icon={<User className="h-3.5 w-3.5" />} label="Inventor" value={DETAIL.inventor} />
                <HeaderMeta icon={<ChevronRight className="h-3.5 w-3.5" />} label="IPC" value={DETAIL.ipc} />
                <HeaderMeta icon={<Database className="h-3.5 w-3.5" />} label="Source" value={DETAIL.source} />
                <HeaderMeta icon={<Database className="h-3.5 w-3.5" />} label="Cache" value={DETAIL.cache} />
                <HeaderMeta icon={<Clock className="h-3.5 w-3.5" />} label="Latency" value={DETAIL.latency} />
            </div>
        </section>
    );
}

function HeaderMeta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-wide text-slate-500">
                {icon}
                {label}
            </p>
            <p className="mt-1 truncate text-[10px] font-semibold text-text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                {value}
            </p>
        </div>
    );
}

function TabBar({ active }: { active: (typeof TABS)[number] }) {
    return (
        <div className="flex items-center gap-8 border-b border-card-border text-[12px]" style={{ fontFamily: 'var(--font-body)' }}>
            {TABS.map((tab) => (
                <span
                    key={tab}
                    className="relative pb-3 font-semibold"
                    style={{ color: tab === active ? '#4f46e5' : '#0f172a' }}
                >
                    {tab}
                    {tab === active && (
                        <motion.span layoutId="patent-tab-line" className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
                    )}
                </span>
            ))}
        </div>
    );
}

function IntelligencePanel({ dimCompounds }: { dimCompounds?: boolean }) {
    return (
        <aside className="hidden h-fit self-start overflow-hidden rounded-xl border border-card-border bg-white p-4 lg:block" style={{ fontFamily: 'var(--font-body)' }}>
            <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-text-primary">Patent intelligence</h3>
                <FlaskConical className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4 space-y-3">
                <IntelligenceRow
                    icon={<FlaskConical className="h-4 w-4" />}
                    label="Compounds detected"
                    sub="From claims and description"
                    value={DETAIL.compounds}
                    muted={dimCompounds}
                />
                <IntelligenceRow
                    icon={<Activity className="h-4 w-4" />}
                    label="Clinical trials"
                    sub="Linked via disclosed compoun..."
                    value={DETAIL.trials}
                />
            </div>
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <p className="text-[12px] font-bold text-text-primary">Full-text claims unlocked</p>
                        <p className="mt-0.5 text-[10px] text-slate-600">Open the Claims tab to read them.</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                </div>
            </div>
            <p className="mt-4 text-center text-[9px] leading-relaxed text-slate-500">
                Full-text claims and CSV export are free with a work-email account.
            </p>
        </aside>
    );
}

function IntelligenceRow({
    icon,
    label,
    sub,
    value,
    muted,
}: {
    icon: ReactNode;
    label: string;
    sub: string;
    value: number;
    muted?: boolean;
}) {
    return (
        <div className={`flex items-center gap-3 rounded-lg border border-card-border bg-white p-3 ${muted ? 'opacity-55' : ''}`}>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-primary">
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-bold text-text-primary">{label}</p>
                <p className="truncate text-[10px] text-slate-600">{sub}</p>
            </div>
            <span className="text-[11px] font-semibold text-text-primary" style={{ fontFamily: 'var(--font-mono)' }}>{value}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
        </div>
    );
}

function Pill({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'indigo' }) {
    return (
        <span
            className="inline-flex items-center rounded border px-1.5 py-0.5 text-[8px] font-semibold"
            style={{
                fontFamily: 'var(--font-mono)',
                backgroundColor: tone === 'indigo' ? '#eef2ff' : '#f8fafc',
                borderColor: tone === 'indigo' ? '#ddd6fe' : '#e2e8f0',
                color: tone === 'indigo' ? '#4f46e5' : '#475569',
            }}
        >
            {children}
        </span>
    );
}

function Skeleton({ className }: { className: string }) {
    return <span className={`patent-search-skeleton block ${className}`} />;
}

type BondKind = 1 | 2 | 'r2' | 'r2p';
type Atom = readonly [number, number, string?];

interface Structure {
    atoms: readonly Atom[];
    bonds: readonly (readonly [number, number, BondKind])[];
    rings: readonly (readonly [number, number])[];
}

/* Skeletal formulas drawn from each compound's real connectivity, laid out
   with a 15-unit bond length in a 140 x 90 box. 'r2' is a ring double bond,
   drawn with an inner line toward the nearest ring centre; 'r2p' points the
   inner line at the last ring listed (the five-membered ring of caffeine). */
const STRUCTURES: Record<StructureId, Structure> = {
    aspirin: {
        atoms: [
            [72.0, 39.0],
            [85.0, 46.5],
            [85.0, 61.5],
            [72.0, 69.0],
            [59.0, 61.5],
            [59.0, 46.5],
            [72.0, 24.0],
            [59.0, 16.5, 'O'],
            [85.0, 16.5, 'OH'],
            [46.0, 39.0, 'O'],
            [33.0, 46.5],
            [33.0, 61.5, 'O'],
            [20.0, 39.0],
        ],
        bonds: [[0, 1, 'r2'], [1, 2, 1], [2, 3, 'r2'], [3, 4, 1], [4, 5, 'r2'], [5, 0, 1], [0, 6, 1], [6, 7, 2], [6, 8, 1], [5, 9, 1], [9, 10, 1], [10, 11, 2], [10, 12, 1]],
        rings: [[72, 54]],
    },
    salicylic: {
        atoms: [
            [66.0, 39.0],
            [79.0, 46.5],
            [79.0, 61.5],
            [66.0, 69.0],
            [53.0, 61.5],
            [53.0, 46.5],
            [66.0, 24.0],
            [53.0, 16.5, 'O'],
            [79.0, 16.5, 'OH'],
            [40.0, 39.0, 'OH'],
        ],
        bonds: [[0, 1, 'r2'], [1, 2, 1], [2, 3, 'r2'], [3, 4, 1], [4, 5, 'r2'], [5, 0, 1], [0, 6, 1], [6, 7, 2], [6, 8, 1], [5, 9, 1]],
        rings: [[66, 54]],
    },
    paracetamol: {
        atoms: [
            [99.0, 48.0],
            [91.5, 61.0],
            [76.5, 61.0],
            [69.0, 48.0],
            [76.5, 35.0],
            [91.5, 35.0],
            [114.0, 48.0, 'OH'],
            [54.0, 48.0, 'NH'],
            [41.0, 40.5],
            [41.0, 25.5, 'O'],
            [28.0, 48.0],
        ],
        bonds: [[0, 1, 'r2'], [1, 2, 1], [2, 3, 'r2'], [3, 4, 1], [4, 5, 'r2'], [5, 0, 1], [0, 6, 1], [3, 7, 1], [7, 8, 1], [8, 9, 2], [8, 10, 1]],
        rings: [[84, 48]],
    },
    ibuprofen: {
        atoms: [
            [79.0, 44.0],
            [71.5, 57.0],
            [56.5, 57.0],
            [49.0, 44.0],
            [56.5, 31.0],
            [71.5, 31.0],
            [92.0, 51.5],
            [92.0, 66.5],
            [105.0, 44.0],
            [105.0, 29.0, 'O'],
            [118.0, 51.5, 'OH'],
            [36.0, 51.5],
            [23.0, 44.0],
            [10.0, 51.5],
            [23.0, 29.0],
        ],
        bonds: [[0, 1, 'r2'], [1, 2, 1], [2, 3, 'r2'], [3, 4, 1], [4, 5, 'r2'], [5, 0, 1], [0, 6, 1], [6, 7, 1], [6, 8, 1], [8, 9, 2], [8, 10, 1], [3, 11, 1], [11, 12, 1], [12, 13, 1], [12, 14, 1]],
        rings: [[64, 44]],
    },
    caffeine: {
        atoms: [
            [58.0, 31.0],
            [71.0, 38.5],
            [71.0, 53.5],
            [58.0, 61.0, 'N'],
            [45.0, 53.5],
            [45.0, 38.5, 'N'],
            [85.3, 33.9, 'N'],
            [94.1, 46.0],
            [85.3, 58.1, 'N'],
            [58.0, 16.0, 'O'],
            [32.0, 61.0, 'O'],
            [32.0, 31.0],
            [58.0, 76.0],
            [89.9, 19.6],
        ],
        bonds: [[0, 1, 1], [1, 2, 'r2'], [2, 3, 1], [3, 4, 1], [4, 5, 1], [5, 0, 1], [1, 6, 1], [6, 7, 1], [7, 8, 'r2p'], [8, 2, 1], [0, 9, 2], [4, 10, 2], [5, 11, 1], [3, 12, 1], [6, 13, 1]],
        rings: [[58, 46], [81.3, 46.0]],
    },
};

const ATOM_COLOR: Record<string, string> = { O: '#dc2626', OH: '#dc2626', N: '#1d4ed8', NH: '#1d4ed8' };

function Molecule({ structure }: { structure: StructureId }) {
    const { atoms, bonds, rings } = STRUCTURES[structure];
    const lines: ReactNode[] = [];

    bonds.forEach(([i, j, kind], index) => {
        const [x1, y1, l1] = atoms[i];
        const [x2, y2, l2] = atoms[j];
        const length = Math.hypot(x2 - x1, y2 - y1);
        const ux = (x2 - x1) / length;
        const uy = (y2 - y1) / length;
        const ax = x1 + ux * (l1 ? 6.5 : 0);
        const ay = y1 + uy * (l1 ? 6.5 : 0);
        const bx = x2 - ux * (l2 ? 6.5 : 0);
        const by = y2 - uy * (l2 ? 6.5 : 0);

        if (kind === 2) {
            for (const side of [1, -1]) {
                const ox = -uy * 1.8 * side;
                const oy = ux * 1.8 * side;
                lines.push(<line key={`${index}${side}`} x1={ax + ox} y1={ay + oy} x2={bx + ox} y2={by + oy} />);
            }
            return;
        }
        lines.push(<line key={index} x1={ax} y1={ay} x2={bx} y2={by} />);
        if (kind === 'r2' || kind === 'r2p') {
            const mx = (ax + bx) / 2;
            const my = (ay + by) / 2;
            const centre =
                kind === 'r2p'
                    ? rings[rings.length - 1]
                    : rings.reduce((best, ring) => (Math.hypot(ring[0] - mx, ring[1] - my) < Math.hypot(best[0] - mx, best[1] - my) ? ring : best));
            let px = -uy;
            let py = ux;
            if ((centre[0] - mx) * px + (centre[1] - my) * py < 0) {
                px = -px;
                py = -py;
            }
            lines.push(
                <line
                    key={`${index}in`}
                    x1={ax + px * 3.6 + ux * 2.6}
                    y1={ay + py * 3.6 + uy * 2.6}
                    x2={bx + px * 3.6 - ux * 2.6}
                    y2={by + py * 3.6 - uy * 2.6}
                />,
            );
        }
    });

    const labels = atoms.flatMap(([x, y, label], index) => {
        if (!label) return [];
        const fill = ATOM_COLOR[label] ?? '#111827';
        if (label === 'NH') {
            return [
                <text key={index} x={x} y={y} fill={fill} fontSize="12" textAnchor="middle" dominantBaseline="central">N</text>,
                <text key={`${index}h`} x={x} y={y + 11} fill={fill} fontSize="10" textAnchor="middle" dominantBaseline="central">H</text>,
            ];
        }
        if (label === 'OH') {
            /* Keep the O on the atom and write the H away from its bond. */
            const bond = bonds.find(([i, j]) => i === index || j === index);
            const neighbour = bond ? atoms[bond[0] === index ? bond[1] : bond[0]] : undefined;
            const fromRight = neighbour !== undefined && neighbour[0] > x + 1;
            return [
                <text key={index} x={fromRight ? x + 4.3 : x - 4.3} y={y} fill={fill} fontSize="12" textAnchor={fromRight ? 'end' : 'start'} dominantBaseline="central">
                    {fromRight ? 'HO' : 'OH'}
                </text>,
            ];
        }
        return [<text key={index} x={x} y={y} fill={fill} fontSize="12" textAnchor="middle" dominantBaseline="central">{label}</text>];
    });

    return (
        <svg viewBox="0 0 140 90" className="h-full w-full" aria-hidden="true">
            <g stroke="#111827" strokeWidth="1.8" strokeLinecap="round">{lines}</g>
            <g fontFamily="Arial, sans-serif">{labels}</g>
        </svg>
    );
}
