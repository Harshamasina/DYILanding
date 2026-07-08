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
const SEARCH_QUERY = 'CRISPR diagnostics';
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

const SEARCH_RESULTS_DATA: ResultItem[] = [
    {
        pub: 'US-11873485-B2',
        date: '2024-01-16',
        codes: ['C12N15/11', 'C12N9/22'],
        title: 'Allosteric conditional guide RNAs for cell-selective regulation of CRISPR/Cas',
        inventors: 'HOCHREIN, LISA, HANEWICH-HOLLATZ, MIKHAIL H., CHEN, ZHWEI +4 more',
        abstract:
            'Programmable guide RNAs (gRNAs) play a central role in the CRISPR revolution sweeping biology and medicine by directing the function of a Cas protein effector to a target gene of choice. To achieve programmable control over regulatory scope, the activity of a conditional guide RNA depends on the presence or absence of a trigger sequence.',
    },
    {
        pub: 'US-12385040-B2',
        date: '2025-08-12',
        codes: ['C12N9/22', 'C12N15/11'],
        title: 'Allosteric conditional guide RNAs for cell-selective regulation of CRISPR/Cas',
        inventors: 'HOCHREIN, LISA, HANEWICH-HOLLATZ, MIKHAIL H., CHEN, ZHWEI +4 more',
        abstract:
            'Programmable guide RNAs (gRNAs) play a central role in the CRISPR revolution sweeping biology and medicine by directing the function of a Cas protein effector to a target gene of choice. Conditional guide RNAs may provide cell-selective editing and diagnostic readouts.',
    },
    {
        pub: 'US-12522863-B2',
        date: '2026-01-13',
        codes: ['C12Q1/70', 'C12Q1/6806', 'C12N9/78'],
        title: 'Crispr effector system based coronavirus diagnostics',
        inventors: 'ZHANG, FENG, Gootenberg, Jonathan, Abudayyeh, Omar +4 more',
        abstract:
            'Systems and methods for rapid diagnostics related to the use of CRISPR effector systems and optimized guide sequences for detection of coronavirus, including multiplex lateral flow diagnostic devices and methods of use, are provided.',
    },
    {
        pub: 'WO-2026048712-A1',
        date: '2026-03-28',
        codes: ['C12Q1/68', 'A61K39/395'],
        title: 'CRISPR effector system based diagnostics for virus detection',
        inventors: 'CHEN, SMITH, DUBOIS, MORRISON +3 more',
        abstract:
            'Compositions and methods are disclosed for nucleic acid detection in biological samples using guide RNA complexes, target amplification, and reporter cleavage assays suitable for point-of-care diagnostics.',
    },
    {
        pub: 'EP-4285631-B1',
        date: '2025-11-04',
        codes: ['C12N15/90', 'C07K14/39'],
        title: 'Engineered CRISPR nucleases with altered target specificity',
        inventors: 'JOUNG, J KEITH, KLEINSTIVER, BENJAMIN +6 more',
        abstract:
            'Engineered CRISPR nucleases with improved activity and altered protospacer-adjacent motif compatibility are described for genome editing, epigenomic engineering, and in vitro diagnostic applications.',
    },
    {
        pub: 'US-20260091442-A1',
        date: '2026-02-19',
        codes: ['C12Q1/6816', 'G01N33/569'],
        title: 'Methods and compositions for multiplex sample nucleic acid detection',
        inventors: 'WILSON, PRIYA, GARCIA, MATEO, LEWIS, ANIKA +2 more',
        abstract:
            'A multiplexed nucleic-acid detection workflow combines CRISPR-associated enzymes, barcoded guide RNAs, and optical reporters to identify pathogen signatures from a single prepared sample.',
    },
    {
        pub: 'JP-2026010038-A',
        date: '2026-04-02',
        codes: ['C12N9/22', 'C12Q1/6876'],
        title: 'RNA-guided detection system with improved reporter stability',
        inventors: 'NAKAMURA, Y., TAKEDA, S., PARK, M. +5 more',
        abstract:
            'Reporter constructs and reaction buffers are optimized to improve CRISPR-based signal stability across temperature ranges, enabling transportable diagnostic kits with high sensitivity.',
    },
];

const PORTFOLIO_ITEMS = [
    { title: 'COMPOSITIONS, METHODS AND ARTICLES CONCERNING...', pub: 'WO2012034089A1', savedDaysAgo: 0 },
    { title: 'COMPOSITIONS AND METHODS FOR TREATMENT...', pub: 'JP2020100623A', savedDaysAgo: 1 },
    { title: 'PHARMACEUTICAL FORMULATIONS AND THEIR...', pub: 'US2025186435A1', savedDaysAgo: 2 },
];

const FILTERS = ['Jurisdiction', 'Filing date', 'IPC / CPC', 'Assignee', 'Inventor', 'Scope'];

const DETAIL = {
    country: 'US',
    number: '20220017883',
    kind: 'A1',
    title: 'Variants of CRISPR from Prevotella and Francisella 1 (Cpf1)',
    applicants: 'MASSACHUSETTS G...',
    inventor: 'JOUNG J KEITH, KLEI...',
    ipc: 'C12N9/22',
    source: 'Cache',
    cache: 'L1',
    latency: '12916 ms',
    compounds: 40,
    trials: 3,
};

const BIBLIO_COLUMNS = [
    [
        ['Publication number', 'US12590299B2'],
        ['Country code', 'US'],
        ['Kind code', 'B2'],
    ],
    [
        ['Publication date', '31 Mar 2026'],
        ['Application date', '12 Oct 2021'],
        ['Priority date', '26 Jul 2016'],
    ],
    [
        ['Source', 'Cache'],
        ['Cache', 'L1'],
        ['Latency', '9407 ms'],
    ],
] as const;

const IPC_CODES = ['C12N9/22', 'C07K14/39', 'C12N9/02', 'C12N15/11', 'C12N15/90'] as const;

const FAMILY_MEMBERS = [
    ['US', 'B2', 'US12590299B2'],
    ['US', 'A1', 'US20180030425A1'],
    ['CA', 'A1', 'CA3031414A1'],
    ['EP', 'A1', 'EP3491133A1'],
    ['US', 'A1', 'US20220017883A1'],
    ['AU', 'A1', 'AU2025275207A1'],
    ['AU', 'B2', 'AU2023208113B2'],
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
            'An isolated CRISPR from Prevotella and Francisella 1 (Cpf1) protein, wherein the protein is from Lachnospiraceae bacterium ND2006 (LbCpf1), comprising a sequence that is at least 80% identical to the amino acid sequence of amino acids 1-1228 of SEQ ID NO: 10, with mutations at one or more of the following positions: N160, S168, N256, N260, K272, S286, K349, D505, Q513, G741, Q944, K945, and/or S985 of amino acids 1-1228 of SEQ ID NO:10.',
    },
    {
        number: 2,
        type: 'Dependent',
        dependsOn: 1,
        text:
            'The isolated protein of claim 1, comprising one or more of the following mutations: N160A, S168A, N256A, N260A, K272A, S286A, K349A, D505A, Q513A, G741A, Q944A, K945A, and/or S985A.',
    },
    {
        number: 3,
        type: 'Dependent',
        dependsOn: 1,
        text:
            'The isolated protein of claim 1, further comprising one or more mutations that decrease nuclease activity selected from the group consisting of mutations at D832 and E925.',
    },
    {
        number: 4,
        type: 'Dependent',
        dependsOn: 3,
        text: 'The isolated protein of claim 3, comprising mutations D832A and E925A.',
    },
    {
        number: 5,
        type: 'Dependent',
        dependsOn: 1,
        text:
            'The isolated protein of claim 1, comprising a sequence that is at least 95% identical to the amino acid sequence of amino acids 1-1228 of SEQ ID NO:10.',
    },
    {
        number: 6,
        type: 'Dependent',
        dependsOn: 1,
        text:
            'The isolated protein of claim 1, further comprising mutations at one or more guide-RNA contact residues that increase guide RNA binding affinity.',
    },
    {
        number: 7,
        type: 'Dependent',
        dependsOn: 1,
        text:
            'The isolated protein of claim 1, wherein the protein exhibits altered target specificity relative to a wild-type Cpf1 protein.',
    },
    {
        number: 8,
        type: 'Dependent',
        dependsOn: 1,
        text:
            'A composition comprising the isolated protein of claim 1 and a guide RNA configured to target a genomic sequence in a mammalian cell.',
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

interface CompoundItem {
    inchiKey: string;
    formula: string;
    mw: string;
    smiles: string;
    source: string;
    variant: number;
}

const COMPOUNDS: CompoundItem[] = [
    { inchiKey: 'QGZKDVFQNNGYKY-UHFFFAOYSA-N', formula: '[43NH3]', mw: '3 g/mol', smiles: '[43NH3]', source: 'SureChEMBL #20', variant: 0 },
    { inchiKey: 'MDFFNEOEWAXZRQ-UHFFFAOYSA-N', formula: '[NH2]', mw: '16.0226 g/mol', smiles: '[NH2]', source: 'SureChEMBL #3129', variant: 1 },
    { inchiKey: 'DHMQDGOQFOQNFH-UHFFFAOYSA-N', formula: 'NCC(=O)O', mw: '75.0666 g/mol', smiles: 'NCC(=O)O', source: 'SureChEMBL #6163', variant: 2 },
    { inchiKey: 'QNAYBMKLOCPYGJ-UHFFFAOYSA-N', formula: 'CC(N)C(=O)O', mw: '89.0932 g/mol', smiles: 'CC(N)C(=O)O', source: 'SureChEMBL #31', variant: 3 },
    { inchiKey: 'QNAYBMKLOCPYGJ-REOHCLBHSA-N', formula: 'C[C@H](N)C(=O)O', mw: '89.0932 g/mol', smiles: 'C[C@H](N)C(=O)O', source: 'SureChEMBL #32', variant: 4 },
    { inchiKey: 'MTCFGRXMJLQNBG-UHFFFAOYSA-N', formula: 'NC(CO)C(=O)O', mw: '105.093 g/mol', smiles: 'NC(CO)C(=O)O', source: 'SureChEMBL #1774', variant: 5 },
    { inchiKey: 'XLYOFNOQVPJJNP-UHFFFAOYSA-N', formula: 'H2O', mw: '18.015 g/mol', smiles: 'O', source: 'SureChEMBL #411', variant: 6 },
    { inchiKey: 'RWSOTUBLDIXVET-UHFFFAOYSA-N', formula: 'C6H6N2O', mw: '122.12 g/mol', smiles: 'O=C(N)c1ccncc1', source: 'SureChEMBL #4521', variant: 7 },
    { inchiKey: 'BSYNRYMUTXBXSQ-UHFFFAOYSA-N', formula: 'C9H8O4', mw: '180.16 g/mol', smiles: 'CC(=O)Oc1ccccc1C(=O)O', source: 'SureChEMBL #2210', variant: 8 },
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
            <BrowserMockupChrome url={browserUrl} />
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
        return 'search.designyourinvention.com/US20220017883A1/overview';
    }
    if (phase === 'claims') {
        return 'search.designyourinvention.com/US20220017883A1/claims';
    }
    if (phase === 'compounds' || phase === 'rest') {
        return 'search.designyourinvention.com/US20220017883A1/compounds';
    }
    if (phase === 'submitted' || phase === 'loadingResults' || phase === 'results' || phase === 'hoverResult') {
        return 'search.designyourinvention.com/?q=CRISPR%20diagnostics';
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
                                Engineered CRISPR from Prevotella and Francisella 1 (Cpf1) nucleases with altered and improved target specificity and their use in genomic engineering, epigenomic engineering, genome targeting, genome editing, and in vitro diagnostics.
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
                                        <Molecule variant={compound.variant} />
                                    </div>
                                    <p className="mt-2 truncate text-[8px] font-semibold text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                                        {compound.inchiKey}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <p className="text-[9px] text-slate-600">{compound.mw}</p>
                                        <Pill>Description</Pill>
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

function Breadcrumb() {
    return (
        <div className="flex items-center gap-2 text-[11px] text-text-primary">
            <span className="text-primary">Search</span>
            <span className="text-slate-400">/</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>US20220017883A1</span>
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
                    value={dimCompounds ? 0 : DETAIL.compounds}
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
                Full-text claims and CSV export are free with any account.
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

function Molecule({ variant }: { variant: number }) {
    const bond = { stroke: '#111827', strokeWidth: 1.8, strokeLinecap: 'round' as const };
    const blue = '#1017ff';
    const red = '#ff0000';
    const text = { fontSize: 16, fontFamily: 'Arial, sans-serif' } as const;

    switch (variant % 9) {
        case 0:
            return (
                <svg viewBox="0 0 140 90" className="h-full w-full">
                    <text x="43" y="48" fill={blue} fontSize="22" fontFamily="Arial, sans-serif">43</text>
                    <text x="64" y="52" fill={blue} fontSize="27" fontFamily="Arial, sans-serif">NH</text>
                    <text x="106" y="64" fill={blue} fontSize="18" fontFamily="Arial, sans-serif">3</text>
                </svg>
            );
        case 1:
            return (
                <svg viewBox="0 0 140 90" className="h-full w-full">
                    <text x="49" y="51" fill={blue} fontSize="27" fontFamily="Arial, sans-serif">NH</text>
                    <text x="91" y="60" fill={blue} fontSize="16" fontFamily="Arial, sans-serif">2</text>
                    <circle cx="105" cy="40" r="1.8" fill="#111827" />
                </svg>
            );
        case 2:
            return (
                <svg viewBox="0 0 140 90" className="h-full w-full">
                    <text x="13" y="49" fill={blue} {...text}>H</text>
                    <text x="25" y="56" fill={blue} fontSize="10" fontFamily="Arial, sans-serif">2</text>
                    <text x="33" y="49" fill={blue} {...text}>N</text>
                    <line x1="51" y1="44" x2="72" y2="56" {...bond} />
                    <line x1="72" y1="56" x2="100" y2="40" {...bond} />
                    <line x1="100" y1="40" x2="125" y2="54" {...bond} />
                    <line x1="98" y1="39" x2="98" y2="17" {...bond} />
                    <line x1="104" y1="39" x2="104" y2="17" {...bond} />
                    <text x="95" y="16" fill={red} {...text}>O</text>
                    <text x="125" y="61" fill={red} {...text}>OH</text>
                </svg>
            );
        case 3:
            return (
                <svg viewBox="0 0 140 90" className="h-full w-full">
                    <text x="20" y="66" fill={red} fontSize="20" fontFamily="Arial, sans-serif">HO</text>
                    <line x1="50" y1="54" x2="67" y2="24" {...bond} />
                    <line x1="55" y1="54" x2="72" y2="24" {...bond} />
                    <text x="58" y="20" fill={red} {...text}>O</text>
                    <line x1="54" y1="55" x2="88" y2="55" {...bond} />
                    <line x1="88" y1="55" x2="107" y2="23" {...bond} />
                    <line x1="88" y1="55" x2="107" y2="79" {...bond} />
                    <text x="105" y="77" fill={blue} fontSize="20" fontFamily="Arial, sans-serif">NH</text>
                    <text x="133" y="84" fill={blue} fontSize="12" fontFamily="Arial, sans-serif">2</text>
                </svg>
            );
        case 4:
            return (
                <svg viewBox="0 0 140 90" className="h-full w-full">
                    <text x="16" y="59" fill={red} fontSize="18" fontFamily="Arial, sans-serif">HO</text>
                    <line x1="44" y1="52" x2="62" y2="28" {...bond} />
                    <line x1="49" y1="54" x2="67" y2="30" {...bond} />
                    <text x="60" y="24" fill={red} fontSize="17" fontFamily="Arial, sans-serif">O</text>
                    <line x1="47" y1="53" x2="78" y2="53" {...bond} />
                    <line x1="78" y1="53" x2="100" y2="75" {...bond} />
                    <text x="98" y="77" fill={blue} fontSize="18" fontFamily="Arial, sans-serif">NH</text>
                    <text x="123" y="84" fill={blue} fontSize="11" fontFamily="Arial, sans-serif">2</text>
                    <line x1="80" y1="51" x2="104" y2="25" {...bond} />
                    <text x="104" y="24" fill="#111827" fontSize="15" fontFamily="Arial, sans-serif">CH</text>
                    <text x="124" y="30" fill="#111827" fontSize="10" fontFamily="Arial, sans-serif">3</text>
                </svg>
            );
        case 5:
            return (
                <svg viewBox="0 0 140 90" className="h-full w-full">
                    <text x="26" y="58" fill={red} {...text}>HO</text>
                    <line x1="50" y1="51" x2="71" y2="39" {...bond} />
                    <line x1="71" y1="39" x2="98" y2="50" {...bond} />
                    <line x1="98" y1="50" x2="122" y2="38" {...bond} />
                    <text x="123" y="43" fill={red} {...text}>OH</text>
                    <line x1="70" y1="39" x2="62" y2="17" {...bond} />
                    <line x1="75" y1="40" x2="67" y2="18" {...bond} />
                    <text x="56" y="17" fill={red} {...text}>O</text>
                    <line x1="98" y1="50" x2="104" y2="73" {...bond} />
                    <text x="100" y="82" fill={blue} {...text}>NH</text>
                    <text x="125" y="88" fill={blue} fontSize="10" fontFamily="Arial, sans-serif">2</text>
                </svg>
            );
        case 6:
            return (
                <svg viewBox="0 0 140 90" className="h-full w-full">
                    <text x="52" y="52" fill={red} fontSize="28" fontFamily="Arial, sans-serif">H</text>
                    <text x="72" y="60" fill={red} fontSize="16" fontFamily="Arial, sans-serif">2</text>
                    <text x="82" y="52" fill={red} fontSize="28" fontFamily="Arial, sans-serif">O</text>
                </svg>
            );
        case 7:
            return (
                <svg viewBox="0 0 140 90" className="h-full w-full">
                    <polygon points="45,45 58,25 84,25 99,45 85,66 59,66" fill="none" {...bond} />
                    <text x="66" y="22" fill={blue} fontSize="14" fontFamily="Arial, sans-serif">N</text>
                    <line x1="99" y1="45" x2="116" y2="31" {...bond} />
                    <text x="118" y="31" fill={red} fontSize="14" fontFamily="Arial, sans-serif">O</text>
                    <line x1="99" y1="45" x2="113" y2="62" {...bond} />
                    <text x="113" y="67" fill={blue} fontSize="14" fontFamily="Arial, sans-serif">NH</text>
                </svg>
            );
        default:
            return (
                <svg viewBox="0 0 140 90" className="h-full w-full">
                    <polygon points="30,50 44,29 69,29 84,50 69,71 44,71" fill="none" {...bond} />
                    <line x1="84" y1="50" x2="105" y2="37" {...bond} />
                    <text x="106" y="34" fill={red} {...text}>O</text>
                    <line x1="84" y1="50" x2="109" y2="65" {...bond} />
                    <text x="109" y="70" fill={red} {...text}>OH</text>
                    <line x1="44" y1="29" x2="38" y2="12" {...bond} />
                    <text x="25" y="16" fill={red} {...text}>O</text>
                </svg>
            );
    }
}
