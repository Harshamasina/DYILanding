'use client';

import {
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
    type ButtonHTMLAttributes,
    type RefObject,
} from 'react';
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
} from 'framer-motion';
import {
    Archive,
    BadgeCheck,
    CalendarClock,
    FileSearch,
    FileText,
    GitBranch,
    Play,
    ShieldCheck,
    Sparkles,
    type LucideIcon,
} from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';
import { WatchDemoButton } from '@/components/ui/WatchDemoModal';

/* Patent lifecycle.
   Desktop: a single record travels the route on a timed loop. Prior art
   converges into the discovery node, the record passes through the claims
   document, fans out across the jurisdiction branches, then continues
   through prosecution and maintenance into the archive. Each stage
   highlights as the dot arrives and its detail card appears below it.
   Hovering or focusing a stage plays just that stage once and holds on its
   last frame; leaving resumes the full loop from there. The SVG is painted imperatively from a
   requestAnimationFrame clock, so the loop costs no React renders.

   Mobile: a vertical rail fills as the reader scrolls, and each stage card
   lights up when the rail reaches it.

   Without JS the diagram and the stage list render complete and static. */

type StageId = 'discover' | 'define' | 'file' | 'protect' | 'maintain';
type Span = readonly [number, number];
type JurisdictionCode = 'US' | 'EP' | 'IN' | 'PCT';

interface LifecycleStage {
    id: StageId;
    label: string;
    meta: string;
    detail: string;
    icon: LucideIcon;
    /** Timeline span (ms) played once while this stage is hovered or focused. */
    window: Span;
}

interface Keyframe {
    at: number;
    head: number;
    tail: number;
    stage: number;
}

interface Frame {
    /** Route position (0-1) of the leading edge of the drawn line. */
    head: number;
    /** Route position (0-1) of the trailing edge, used to retract the line between loops. */
    tail: number;
    active: number;
    /** Opacity multiplier for the travelling dots. */
    dot: number;
}

interface Seek {
    head: number;
    tail: number;
    elapsed: number;
}

type Mode = { kind: 'auto' } | { kind: 'inspect'; index: number };

interface Scene {
    root: SVGSVGElement;
    stages: SVGGElement[];
    convergePaths: SVGPathElement[];
    convergeDots: SVGCircleElement[];
    prePath: SVGPathElement | null;
    branchPaths: SVGPathElement[];
    branchDots: SVGCircleElement[];
    postPath: SVGPathElement | null;
    mainDot: SVGCircleElement | null;
    claimInk: SVGPathElement[];
    officeAction: SVGGElement | null;
    binPath: SVGPathElement | null;
    bin: SVGGElement | null;
    fees: SVGGElement | null;
    /** Groups outside a stage that follow a stage's state (the archive bin). */
    mirrors: SVGGElement[];
    milestones: Array<{ element: SVGGElement; at: number }>;
}

/* ── Content ── */

const STAGES: LifecycleStage[] = [
    {
        id: 'discover',
        label: 'Discover',
        meta: 'Prior art search',
        detail: 'Search the global patent corpus by keyword, inventor, applicant, IPC, CPC, or patent number, then pick the references that matter.',
        icon: FileSearch,
        window: [0, 2600],
    },
    {
        id: 'define',
        label: 'Define',
        meta: 'AI-assisted drafting',
        detail: 'Turn your selected prior art and invention notes into a draft specification and claims with US, EP, IN, or PCT/WO templates.',
        icon: Sparkles,
        window: [2600, 5300],
    },
    {
        id: 'file',
        label: 'File',
        meta: 'PRV, PCT, and national phase',
        detail: 'Docket provisional, PCT, and national phase cases in one family tree, with every jurisdiction and its deadlines in view.',
        icon: GitBranch,
        window: [5300, 8000],
    },
    {
        id: 'protect',
        label: 'Protect',
        meta: 'Office actions through grant',
        detail: 'Log office actions, track response deadlines computed from cited rules where supported, and record the grant on the same family.',
        icon: ShieldCheck,
        window: [8000, 12100],
    },
    {
        id: 'maintain',
        label: 'Maintain',
        meta: 'Maintenance fees through expiry',
        detail: 'Track US maintenance fees, foreign annuities, and grace periods in any currency, then archive the family with its full audit history.',
        icon: CalendarClock,
        window: [12100, 16300],
    },
];

const JURISDICTIONS: Array<{ code: JurisdictionCode; y: number }> = [
    { code: 'US', y: 75 },
    { code: 'EP', y: 130 },
    { code: 'IN', y: 200 },
    { code: 'PCT', y: 255 },
];

/* Office action card states, switched by where the record is in Protect. */
const OA_STATUSES = [
    { id: 'due', text: 'Response due in 30 days' },
    { id: 'drafted', text: 'Response drafted' },
    { id: 'submitted', text: 'Response submitted' },
    { id: 'granted', text: 'Grant date recorded' },
];

/* Maintenance fee card states, switched by how many fees the record has
   passed (paid-1 to paid-3) and whether it has reached the archive. */
const FEE_STATUSES = [
    { id: 'due', text: '3.5-year fee due' },
    { id: 'paid-1', text: '3.5-year fee paid' },
    { id: 'paid-2', text: '7.5-year fee paid' },
    { id: 'paid-3', text: '11.5-year fee paid' },
    { id: 'expired', text: 'Expired at 20 years' },
];

/* ── Route geometry ── */

const ROUTE = {
    converge: [0, 0.12],
    pre: [0.12, 0.44],
    branch: [0.44, 0.6],
    post: [0.6, 0.93],
    bin: [0.93, 1],
} as const;

const PRE_X: Span = [210, 500];
const POST_X: Span = [700, 1112];
const CLAIMS_X: Span = [307, 432];
/* US maintenance fees fall due 3.5, 7.5 and 11.5 years after grant. */
const ANNUITY_X = [975, 1030, 1085];
const ANNUITY_LABELS = ['3.5 yr', '7.5 yr', '11.5 yr'];

/* Each path starts at the right edge of its prior art card. */
const PRIOR_ART = [
    { x: 18, y: 72, number: 'US 2019/0123456', path: 'M 138 98 C 172 98, 176 146, 210 165' },
    { x: 8, y: 137, number: 'EP 3056789', path: 'M 128 163 C 162 163, 180 165, 210 165' },
    { x: 32, y: 202, number: 'WO 2020/123456', path: 'M 152 228 C 180 228, 184 184, 210 165' },
];
const PRE_PATH = `M ${PRE_X[0]} 165 H ${PRE_X[1]}`;
const BRANCH_PATHS = [
    'M 500 165 C 535 165, 535 75, 570 75 H 630 C 665 75, 665 165, 700 165',
    'M 500 165 C 535 165, 535 130, 570 130 H 630 C 665 130, 665 165, 700 165',
    'M 500 165 C 535 165, 535 200, 570 200 H 630 C 665 200, 665 165, 700 165',
    'M 500 165 C 535 165, 535 255, 570 255 H 630 C 665 255, 665 165, 700 165',
];
const POST_PATH = `M ${POST_X[0]} 165 H ${POST_X[1]}`;
/* Curves down through the bin lid and ends inside the box. */
const BIN_PATH = `M ${POST_X[1]} 165 C 1136 165, 1150 170, 1150 190 V 226`;
const CLAIM_LINES = [
    'M 325 128 H 384',
    /* Numbered lines start clear of their "1." to "3." markers. */
    'M 333 150 H 410',
    'M 333 172 H 398',
    'M 333 194 H 410',
    'M 325 216 H 386',
];

const BRANCH_STAGGER = 0.04;
const BRANCH_SPAN = 0.88;

function clamp(value: number) {
    return Math.max(0, Math.min(value, 1));
}

function lerp(from: number, to: number, amount: number) {
    return from + (to - from) * amount;
}

function ease(value: number) {
    return 0.5 - Math.cos(Math.PI * clamp(value)) / 2;
}

function segmentProgress(value: number, start: number, end: number) {
    return clamp((value - start) / (end - start));
}

function routeAt([start, end]: Span, [fromX, toX]: Span, x: number) {
    return lerp(start, end, (x - fromX) / (toX - fromX));
}

function branchLocal(value: number, index: number) {
    return segmentProgress(value, index * BRANCH_STAGGER, BRANCH_SPAN + index * BRANCH_STAGGER);
}

/** Route position at which branch `index` reaches `local` along its own path. */
function branchAt(index: number, local: number) {
    return lerp(ROUTE.branch[0], ROUTE.branch[1], index * BRANCH_STAGGER + local * BRANCH_SPAN);
}

const AT = {
    discover: ROUTE.converge[1],
    claimsIn: routeAt(ROUTE.pre, PRE_X, CLAIMS_X[0]),
    claimsOut: routeAt(ROUTE.pre, PRE_X, CLAIMS_X[1]),
    file: ROUTE.pre[1],
    branched: ROUTE.branch[1],
    /* The office action card rises as the record enters Protect. */
    officeActionDue: routeAt(ROUTE.post, POST_X, 712),
    officeAction: routeAt(ROUTE.post, POST_X, 800),
    responseSubmitted: routeAt(ROUTE.post, POST_X, 850),
    grant: routeAt(ROUTE.post, POST_X, 900),
    /* The maintenance fee card rises as the record leaves Grant. */
    feeDue: routeAt(ROUTE.post, POST_X, 915),
    annuities: ANNUITY_X.map((x) => routeAt(ROUTE.post, POST_X, x)),
    /* The bin lid lifts as the record leaves the last annuity and closes once
       the record has dropped inside; the bin then shows as archived. */
    lidOpen: routeAt(ROUTE.post, POST_X, 1098),
    lidClose: lerp(ROUTE.bin[0], ROUTE.bin[1], 0.86),
    archive: lerp(ROUTE.bin[0], ROUTE.bin[1], 0.95),
};

/* ── Timeline ──
   Stage indexes switch when the dot arrives, so the highlight and card land
   together with it. The last leg retracts the line into the archive, which
   leaves nothing drawn and lets the loop restart without a visible jump. */

const TIMELINE: Keyframe[] = [
    { at: 0, head: 0, tail: 0, stage: 0 },
    { at: 1200, head: AT.discover, tail: 0, stage: 0 },
    { at: 2600, head: AT.discover, tail: 0, stage: 0 },
    { at: 3500, head: AT.claimsIn, tail: 0, stage: 1 },
    { at: 5300, head: AT.claimsOut, tail: 0, stage: 1 },
    { at: 6000, head: AT.file, tail: 0, stage: 2 },
    { at: 7400, head: AT.branched, tail: 0, stage: 2 },
    /* Protect goes live as the record leaves the branches, so the office
       action card reads "due" while the dot travels in, "drafted" at the
       office action node, "submitted" at the response node, and turns into
       a green grant notice when the record reaches Grant. */
    { at: 8000, head: AT.branched, tail: 0, stage: 3 },
    { at: 8900, head: AT.officeAction, tail: 0, stage: 3 },
    { at: 9800, head: AT.officeAction, tail: 0, stage: 3 },
    { at: 10400, head: AT.responseSubmitted, tail: 0, stage: 3 },
    { at: 11000, head: AT.responseSubmitted, tail: 0, stage: 3 },
    { at: 11600, head: AT.grant, tail: 0, stage: 3 },
    /* Maintain goes live as the record leaves Grant, when the fee card rises. */
    { at: 12100, head: AT.grant, tail: 0, stage: 4 },
    { at: 12800, head: AT.annuities[0], tail: 0, stage: 4 },
    { at: 14500, head: AT.annuities[AT.annuities.length - 1], tail: 0, stage: 4 },
    { at: 15500, head: 1, tail: 0, stage: 4 },
    { at: 16300, head: 1, tail: 0, stage: 4 },
    { at: 17700, head: 1, tail: 1, stage: 4 },
];

const LOOP_MS = TIMELINE[TIMELINE.length - 1].at;
const SEEK_MS = 480;
const DOT_FADE_MS = 220;

/** Route position where each stage begins, used to mark stages done or upcoming. */
const STAGE_STARTS = [0, AT.claimsIn, AT.file, AT.branched, AT.grant];

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function sampleTimeline(time: number) {
    for (let i = 1; i < TIMELINE.length; i += 1) {
        const next = TIMELINE[i];
        if (time < next.at) {
            const prev = TIMELINE[i - 1];
            const amount = ease((time - prev.at) / (next.at - prev.at));
            return {
                head: lerp(prev.head, next.head, amount),
                tail: lerp(prev.tail, next.tail, amount),
                stage: prev.stage,
            };
        }
    }
    const last = TIMELINE[TIMELINE.length - 1];
    return { head: last.head, tail: last.tail, stage: last.stage };
}

function stageState(index: number, { head, tail, active }: Frame) {
    if (index === active) return 'active';
    const start = STAGE_STARTS[index];
    const end = STAGE_STARTS[index + 1] ?? 1;
    return head >= start && tail < end ? 'done' : 'upcoming';
}

/* ── Imperative SVG painting ── */

const pathLengths = new WeakMap<SVGPathElement, number>();

function measure(path: SVGPathElement) {
    let length = pathLengths.get(path);
    if (!length) {
        try {
            length = path.getTotalLength();
        } catch {
            length = 0;
        }
        if (length > 0) pathLengths.set(path, length);
    }
    return length;
}

function setAttr(element: Element, name: string, value: string) {
    if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

function drawSegment(path: SVGPathElement | null | undefined, head: number, tail: number) {
    if (!path) return;
    const length = measure(path);
    const start = length * clamp(tail);
    const visible = length * clamp(head) - start;
    /* Round caps would render a zero-length dash as a dot, so hide it. */
    if (visible < 0.5) {
        setAttr(path, 'opacity', '0');
        return;
    }
    setAttr(path, 'opacity', '1');
    path.setAttribute('stroke-dasharray', `${visible.toFixed(2)} ${length.toFixed(2)}`);
    path.setAttribute('stroke-dashoffset', `${(-start).toFixed(2)}`);
}

function placeDot(
    dot: SVGCircleElement | null | undefined,
    path: SVGPathElement | null | undefined,
    progress: number,
    opacity: number,
) {
    if (!dot) return;
    const length = path ? measure(path) : 0;
    if (!path || !length || opacity <= 0.01) {
        setAttr(dot, 'opacity', '0');
        return;
    }
    const point = path.getPointAtLength(length * clamp(progress));
    dot.setAttribute('cx', point.x.toFixed(2));
    dot.setAttribute('cy', point.y.toFixed(2));
    dot.setAttribute('opacity', opacity.toFixed(3));
}

/** The record passes behind the claims document while it is drafted. */
function claimsFade(x: number) {
    if (x <= CLAIMS_X[0]) return clamp((CLAIMS_X[0] - x) / 10);
    if (x >= CLAIMS_X[1]) return clamp((x - CLAIMS_X[1]) / 10);
    return 0;
}

function collectScene(root: SVGSVGElement): Scene {
    const all = <T extends Element>(selector: string) => Array.from(root.querySelectorAll<T>(selector));
    return {
        root,
        stages: all<SVGGElement>('[data-lifecycle-stage]'),
        convergePaths: all<SVGPathElement>('[data-piece="converge"]'),
        convergeDots: all<SVGCircleElement>('[data-dot="converge"]'),
        prePath: root.querySelector<SVGPathElement>('[data-piece="pre"]'),
        branchPaths: all<SVGPathElement>('[data-piece="branch"]'),
        branchDots: all<SVGCircleElement>('[data-dot="branch"]'),
        postPath: root.querySelector<SVGPathElement>('[data-piece="post"]'),
        mainDot: root.querySelector<SVGCircleElement>('[data-dot="main"]'),
        claimInk: all<SVGPathElement>('[data-piece="claim"]'),
        officeAction: root.querySelector<SVGGElement>('[data-oa]'),
        binPath: root.querySelector<SVGPathElement>('[data-piece="bin"]'),
        bin: root.querySelector<SVGGElement>('[data-bin]'),
        fees: root.querySelector<SVGGElement>('[data-fees]'),
        mirrors: all<SVGGElement>('[data-stage-mirror]'),
        milestones: all<SVGGElement>('[data-at]').map((element) => ({
            element,
            at: Number(element.dataset.at),
        })),
    };
}

function paintScene(scene: Scene, frame: Frame) {
    const { head, tail } = frame;

    scene.stages.forEach((group, index) => setAttr(group, 'data-state', stageState(index, frame)));

    const convergeHead = segmentProgress(head, ...ROUTE.converge);
    const convergeTail = segmentProgress(tail, ...ROUTE.converge);
    scene.convergePaths.forEach((path) => drawSegment(path, convergeHead, convergeTail));

    drawSegment(scene.prePath, segmentProgress(head, ...ROUTE.pre), segmentProgress(tail, ...ROUTE.pre));

    const branchHead = segmentProgress(head, ...ROUTE.branch);
    const branchTail = segmentProgress(tail, ...ROUTE.branch);
    scene.branchPaths.forEach((path, index) => {
        drawSegment(path, branchLocal(branchHead, index), branchLocal(branchTail, index));
    });

    drawSegment(scene.postPath, segmentProgress(head, ...ROUTE.post), segmentProgress(tail, ...ROUTE.post));
    drawSegment(scene.binPath, segmentProgress(head, ...ROUTE.bin), segmentProgress(tail, ...ROUTE.bin));

    const claimsHead = segmentProgress(head, AT.claimsIn, AT.claimsOut);
    const claimsTail = segmentProgress(tail, AT.claimsIn, AT.claimsOut);
    scene.claimInk.forEach((line, index) => {
        const start = index * 0.15;
        drawSegment(
            line,
            segmentProgress(claimsHead, start, start + 0.4),
            segmentProgress(claimsTail, start, start + 0.4),
        );
    });

    scene.milestones.forEach(({ element, at }) => {
        setAttr(element, 'data-reveal', head >= at && tail < at ? 'shown' : 'hidden');
    });

    if (scene.officeAction) {
        const status = head >= AT.grant
            ? 'granted'
            : head >= AT.responseSubmitted ? 'submitted' : head >= AT.officeAction ? 'drafted' : 'due';
        setAttr(scene.officeAction, 'data-status', status);
    }

    if (scene.fees) {
        const paid = AT.annuities.filter((at) => head >= at).length;
        const fee = head >= AT.archive ? 'expired' : paid > 0 ? `paid-${paid}` : 'due';
        setAttr(scene.fees, 'data-fee', fee);
    }

    if (scene.bin) {
        setAttr(scene.bin, 'data-lid', head >= AT.lidOpen && head < AT.lidClose ? 'open' : 'closed');
    }
    scene.mirrors.forEach((element) => {
        setAttr(element, 'data-state', stageState(Number(element.dataset.stageMirror), frame));
    });

    /* Dots fade out as the retracting tail catches the head. */
    const dot = frame.dot * clamp((head - tail) / 0.04);

    const converging = head > 0.002 && head < ROUTE.converge[1];
    scene.convergeDots.forEach((circle, index) => {
        placeDot(circle, scene.convergePaths[index], convergeHead, converging ? dot : 0);
    });

    const branching = head > ROUTE.branch[0] && head < ROUTE.branch[1];
    scene.branchDots.forEach((circle, index) => {
        placeDot(circle, scene.branchPaths[index], branchLocal(branchHead, index), branching ? dot : 0);
    });

    if (head >= ROUTE.pre[0] && head <= ROUTE.pre[1]) {
        const local = segmentProgress(head, ...ROUTE.pre);
        placeDot(scene.mainDot, scene.prePath, local, dot * claimsFade(lerp(PRE_X[0], PRE_X[1], local)));
    } else if (head >= ROUTE.post[0] && head <= ROUTE.post[1]) {
        placeDot(scene.mainDot, scene.postPath, segmentProgress(head, ...ROUTE.post), dot);
    } else if (head > ROUTE.post[1]) {
        /* Into the archive. The bin is drawn over the dot so it drops behind
           the box front, and it fades out at the bottom so no glow shows. */
        const local = segmentProgress(head, ...ROUTE.bin);
        placeDot(scene.mainDot, scene.binPath, local, dot * clamp((1 - local) / 0.12));
    } else {
        placeDot(scene.mainDot, null, 0, 0);
    }
}

/* ── Component ── */

export function PatentLifecycleSection() {
    const rootRef = useRef<HTMLElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const sceneRef = useRef<Scene | null>(null);
    const clockRef = useRef(0);
    const modeRef = useRef<Mode>({ kind: 'auto' });
    const seekRef = useRef<Seek | null>(null);
    const sinceSeekRef = useRef(Number.POSITIVE_INFINITY);
    const frameRef = useRef<Frame>({ head: 0, tail: 0, active: 0, dot: 1 });
    const activeRef = useRef(0);
    const desktopRef = useRef(false);
    const inspectedRef = useRef<number | null>(null);
    const pointerTypeRef = useRef('mouse');

    const reduceMotion = Boolean(useReducedMotion());
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [inspectedIndex, setInspectedIndex] = useState<number | null>(null);

    const paint = useCallback((frame: Frame) => {
        frameRef.current = frame;
        if (frame.active !== activeRef.current) {
            activeRef.current = frame.active;
            setActiveIndex(frame.active);
        }
        const svg = svgRef.current;
        if (!desktopRef.current || !svg) return;
        if (sceneRef.current?.root !== svg) sceneRef.current = collectScene(svg);
        paintScene(sceneRef.current, frame);
    }, []);

    const tick = useCallback((dt: number) => {
        const mode = modeRef.current;
        const seek = seekRef.current;

        if (seek) {
            seek.elapsed += dt;
            if (seek.elapsed >= SEEK_MS) {
                seekRef.current = null;
                sinceSeekRef.current = 0;
            }
        } else {
            sinceSeekRef.current += dt;
            clockRef.current += dt;
            if (mode.kind === 'auto') {
                clockRef.current %= LOOP_MS;
            } else {
                /* Play the inspected stage once, then hold on its final frame
                   until the pointer leaves. */
                clockRef.current = Math.min(clockRef.current, STAGES[mode.index].window[1]);
            }
        }

        const base = sampleTimeline(clockRef.current);
        let { head, tail } = base;
        let dot = clamp(sinceSeekRef.current / DOT_FADE_MS);

        const current = seekRef.current;
        if (current) {
            const amount = ease(current.elapsed / SEEK_MS);
            head = lerp(current.head, head, amount);
            tail = lerp(current.tail, tail, amount);
            dot = 0;
        }

        paint({
            head,
            tail,
            active: mode.kind === 'inspect' ? mode.index : base.stage,
            dot,
        });
    }, [paint]);

    const inspect = useCallback((index: number | null) => {
        inspectedRef.current = index;
        setInspectedIndex(index);
        const mode = modeRef.current;

        if (index === null) {
            if (mode.kind === 'inspect') {
                /* Resume the full loop from wherever the replay reached. */
                const [start, end] = STAGES[mode.index].window;
                clockRef.current = Math.min(Math.max(clockRef.current, start), end);
                modeRef.current = { kind: 'auto' };
            }
            return;
        }

        if (mode.kind === 'inspect' && mode.index === index) return;
        modeRef.current = { kind: 'inspect', index };
        clockRef.current = STAGES[index].window[0];
        seekRef.current = { head: frameRef.current.head, tail: frameRef.current.tail, elapsed: 0 };
    }, []);

    useEffect(() => {
        const query = window.matchMedia('(min-width: 1024px)');
        const sync = () => {
            desktopRef.current = query.matches;
            setIsDesktop(query.matches);
            paint(frameRef.current);
        };
        sync();
        query.addEventListener('change', sync);
        return () => query.removeEventListener('change', sync);
    }, [paint]);

    /* The scene caches its nodes, milestone positions and path lengths.
       Re-collect whenever the SVG markup changes (for example after a hot
       reload in development), so a replaced node is never left without its
       state and shown ahead of the dot. The loop's own writes never touch
       children, d, or data-at, so they don't trigger this. */
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const refresh = (records: MutationRecord[]) => {
            records.forEach(({ target }) => {
                if (target instanceof SVGPathElement) pathLengths.delete(target);
            });
            sceneRef.current = null;
            paint(frameRef.current);
        };
        refresh([]);
        const observer = new MutationObserver((records) => refresh(records));
        observer.observe(svg, { subtree: true, childList: true, attributeFilter: ['d', 'data-at'] });
        return () => observer.disconnect();
    }, [paint]);

    /* Run the desktop loop only while the diagram is on screen. The margin
       matches FadeIn, so the loop starts from Discover as the diagram fades in. */
    useEffect(() => {
        const canvas = svgRef.current;
        if (reduceMotion || !isDesktop || !canvas) return;

        let frame = 0;
        let last = 0;
        const loop = (now: number) => {
            tick(last ? Math.min(now - last, 64) : 0);
            last = now;
            frame = requestAnimationFrame(loop);
        };
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !frame) {
                last = 0;
                frame = requestAnimationFrame(loop);
            } else if (!entry.isIntersecting && frame) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
        }, { rootMargin: '-80px 0px' });
        observer.observe(canvas);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [reduceMotion, isDesktop, tick]);

    /* Reduced motion: a complete, static diagram. Hover and focus still
       switch the highlighted stage and its card. */
    useEffect(() => {
        if (!reduceMotion || !isDesktop) return;
        paint({ head: 1, tail: 0, active: inspectedIndex ?? 0, dot: 0 });
    }, [reduceMotion, isDesktop, inspectedIndex, paint]);

    const stageHandlers = (index: number): ButtonHTMLAttributes<HTMLButtonElement> => ({
        onPointerDown: (event) => {
            pointerTypeRef.current = event.pointerType;
        },
        onPointerEnter: (event) => {
            if (event.pointerType === 'mouse') inspect(index);
        },
        onPointerLeave: (event) => {
            if (event.pointerType === 'mouse') inspect(null);
        },
        onFocus: (event) => {
            if (event.currentTarget.matches(':focus-visible')) inspect(index);
        },
        onBlur: () => {
            if (inspectedRef.current === index) inspect(null);
        },
        onClick: () => {
            /* Touch has no hover, so a tap pins the replay and a second tap releases it. */
            if (pointerTypeRef.current !== 'mouse') {
                inspect(inspectedRef.current === index ? null : index);
            }
        },
    });

    const activeStage = STAGES[activeIndex];

    return (
        <section
            ref={rootRef}
            id="patent-lifecycle"
            aria-labelledby="patent-lifecycle-heading"
            className="relative"
        >
            {/* Spine continuing out of the dashboard above, so the two read as
                one composition instead of two stacked panels. */}
            <FadeIn direction="none">
                <div aria-hidden="true" className="flex flex-col items-center">
                    <span className="h-10 w-px bg-linear-to-b from-primary/0 via-primary/30 to-primary/70 sm:h-14" />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/15" />
                </div>
            </FadeIn>

            <FadeIn delay={0.1} className="mx-auto mt-5 max-w-3xl text-center">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary [font-family:var(--font-mono)]">
                    The Patent Lifecycle, In One App
                </p>
                <h2
                    id="patent-lifecycle-heading"
                    className="mt-2 text-balance text-2xl font-bold tracking-tight text-text-primary [font-family:var(--font-display)] sm:text-3xl lg:text-4xl"
                >
                    Take every invention from first search to final archive.
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)] sm:text-[15px]">
                    One record follows each invention from prior art search and AI drafting through
                    filing, prosecution, and maintenance fees. No re-keying between tools, and every change
                    is <span className="whitespace-nowrap">audit-trailed.</span>
                </p>
                <p className="mt-3 text-xs text-text-secondary [font-family:var(--font-mono)] lg:hidden">
                    Scroll to follow one record through the app.
                </p>
            </FadeIn>

            <FadeIn delay={0.2} className="relative mt-8 hidden select-none lg:block xl:mt-10">
                <div aria-hidden="true" className="lifecycle-dot-grid pointer-events-none absolute inset-0" />
                <LifecycleScene svgRef={svgRef} />
                <div className="absolute inset-0 grid grid-cols-[263fr_203fr_249fr_222fr_263fr]">
                    {STAGES.map((stage, index) => (
                        <button
                            key={stage.id}
                            type="button"
                            aria-label={`${stage.label}: ${stage.meta}. ${stage.detail}`}
                            className="lifecycle-hotspot cursor-pointer rounded-3xl"
                            {...stageHandlers(index)}
                        />
                    ))}
                </div>
            </FadeIn>

            <FadeIn delay={0.3} className="relative -mt-2 hidden h-52 select-none lg:block">
                <AnimatePresence initial={false}>
                    <StageCard
                        key={activeStage.id}
                        stage={activeStage}
                        index={activeIndex}
                        reduceMotion={reduceMotion}
                    />
                </AnimatePresence>
            </FadeIn>

            <MobileLifecycle enabled={!isDesktop} reduceMotion={reduceMotion} />
        </section>
    );
}

function StageCard({
    stage,
    index,
    reduceMotion,
}: {
    stage: LifecycleStage;
    index: number;
    reduceMotion: boolean;
}) {
    const Icon = stage.icon;
    return (
        <motion.div
            data-stage={stage.id}
            className="lifecycle-card-track absolute inset-x-0 top-0 h-full"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: -6, transition: { duration: 0.16, ease: EASE } }}
            /* The short delay lets the outgoing card clear before the next one lands. */
            transition={{ duration: 0.34, delay: reduceMotion ? 0 : 0.12, ease: EASE }}
        >
            <span
                aria-hidden="true"
                className="lifecycle-card-caret absolute top-0 z-10 h-3 w-3 -translate-x-1/2 rotate-45 rounded-tl-[3px] border-l border-t border-primary/25 bg-white"
            />
            <div className="lifecycle-card absolute top-1.5 w-80 rounded-2xl border border-primary/20 bg-white p-4 shadow-[0_22px_48px_-30px_rgba(79,70,229,0.55)]">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                    </span>
                    <p className="text-lg font-bold leading-tight text-text-primary [font-family:var(--font-display)]">
                        {stage.label}
                    </p>
                    <span className="ml-auto self-start text-[11px] text-text-secondary [font-family:var(--font-mono)]">
                        {String(index + 1).padStart(2, '0')} / {String(STAGES.length).padStart(2, '0')}
                    </span>
                </div>
                <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary [font-family:var(--font-mono)]">
                    {stage.meta}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                    {stage.detail}
                </p>
            </div>
        </motion.div>
    );
}

/* Node centre inside each mobile list item: 28px offset plus half its 14px height. */
const MOBILE_NODE_CENTER = 35;

function MobileLifecycle({ enabled, reduceMotion }: { enabled: boolean; reduceMotion: boolean }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLSpanElement>(null);
    const fillRef = useRef<HTMLSpanElement>(null);
    const dotRef = useRef<HTMLSpanElement>(null);
    const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
    const metricsRef = useRef<{ height: number; nodes: number[] }>({ height: 0, nodes: [] });
    const reachedRef = useRef(-1);
    const [reached, setReached] = useState(-1);

    /* Progress runs 0 to 1 while the list passes a reading line at 65% of the
       viewport, so progress times list height is where that line sits. */
    const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start 65%', 'end 65%'] });
    const progress = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 30,
        mass: 0.25,
        restDelta: 0.0005,
    });

    const update = useCallback((value: number) => {
        const { height, nodes } = metricsRef.current;
        const fill = fillRef.current;
        const dot = dotRef.current;
        if (nodes.length < 2 || !fill || !dot) return;

        const first = nodes[0];
        const span = nodes[nodes.length - 1] - first;
        const line = reduceMotion ? Number.POSITIVE_INFINITY : value * height;
        const amount = clamp((line - first) / span);

        fill.style.transform = `scaleY(${amount})`;
        dot.style.transform = `translateY(${amount * span}px)`;
        dot.style.opacity = !reduceMotion && amount > 0 ? '1' : '0';

        let next = -1;
        nodes.forEach((node, index) => {
            if (line >= node - 6) next = index;
        });
        if (next !== reachedRef.current) {
            reachedRef.current = next;
            setReached(next);
        }
    }, [reduceMotion]);

    useMotionValueEvent(progress, 'change', (value) => {
        if (enabled) update(value);
    });

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!enabled || !wrapper) return;

        const measureNodes = () => {
            const nodes = itemRefs.current.flatMap((item) => (item ? [item.offsetTop + MOBILE_NODE_CENTER] : []));
            metricsRef.current = { height: wrapper.offsetHeight, nodes };
            const rail = railRef.current;
            if (rail && nodes.length > 1) {
                rail.style.top = `${nodes[0]}px`;
                rail.style.height = `${nodes[nodes.length - 1] - nodes[0]}px`;
            }
            update(progress.get());
        };

        measureNodes();
        const observer = new ResizeObserver(measureNodes);
        observer.observe(wrapper);
        return () => observer.disconnect();
    }, [enabled, progress, update]);

    return (
        <div ref={wrapperRef} className="relative mt-8 select-none lg:hidden">
            <span ref={railRef} aria-hidden="true" className="lifecycle-mobile-rail">
                <span ref={fillRef} className="lifecycle-mobile-rail-fill" />
                <span ref={dotRef} className="lifecycle-mobile-rail-dot" />
            </span>
            <ol className="space-y-3 pl-10">
                {STAGES.map((stage, index) => {
                    const Icon = stage.icon;
                    const state = index === reached ? 'active' : index < reached ? 'done' : 'upcoming';
                    return (
                        <li
                            key={stage.id}
                            ref={(node) => {
                                itemRefs.current[index] = node;
                            }}
                            className="lifecycle-mobile-stage relative"
                            data-state={state}
                        >
                            <span aria-hidden="true" className="lifecycle-mobile-node" />
                            {/* Each card fades in as it scrolls into view; the node and rail stay put. */}
                            <FadeIn className="lifecycle-mobile-card rounded-2xl border bg-white px-4 py-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                                        <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-bold text-text-primary [font-family:var(--font-display)]">
                                            {stage.label}
                                        </h3>
                                        <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.1em] text-primary [font-family:var(--font-mono)]">
                                            {stage.meta}
                                        </p>
                                        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                            {stage.detail}
                                        </p>
                                        {stage.id === 'file' && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {JURISDICTIONS.map(({ code }) => (
                                                    <span
                                                        key={code}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary [font-family:var(--font-mono)]"
                                                    >
                                                        <svg
                                                            aria-hidden="true"
                                                            viewBox="0 0 18 12"
                                                            className="h-2.75 w-[16.5px] rounded-[2px] shadow-[0_0_0_0.5px_rgba(15,23,42,0.25)]"
                                                        >
                                                            <FlagArt code={code} />
                                                        </svg>
                                                        {code}
                                                    </span>
                                                ))}
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/20 px-2.5 py-1 text-[11px] font-semibold text-primary [font-family:var(--font-mono)]">
                                                    <span className="opacity-80">JP</span>
                                                    <span className="opacity-55">CN</span>
                                                    <span aria-hidden="true" className="opacity-40">···</span>
                                                    <span className="sr-only">and more patent offices</span>
                                                </span>
                                            </div>
                                        )}
                                        {stage.id === 'protect' && (
                                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <FileText className="h-3.5 w-3.5 text-primary" /> Office Action
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <BadgeCheck className="h-3.5 w-3.5 text-success" /> Grant
                                                </span>
                                            </div>
                                        )}
                                        {stage.id === 'maintain' && (
                                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarClock className="h-3.5 w-3.5 text-compliance" /> Maintenance fees
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Archive className="h-3.5 w-3.5" /> Expire &amp; Archive
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </FadeIn>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

/* Static markup: the loop only mutates attributes, so this never re-renders. */
const LifecycleScene = memo(function LifecycleScene({
    svgRef,
}: {
    svgRef: RefObject<SVGSVGElement | null>;
}) {
    return (
        <svg
            ref={svgRef}
            aria-hidden="true"
            className="relative block aspect-[1200/290] w-full"
            viewBox="0 0 1200 290"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <filter id="lifecycle-dot-glow" x="-300%" y="-300%" width="700%" height="700%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="lifecycle-grant-glow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <clipPath id="lifecycle-flag-clip">
                    <rect width="18" height="12" rx="2" />
                </clipPath>
            </defs>

            {/* Dividers sit midway between neighbouring stage content, and each
                heading is centred over its own content. The hotspot grid and
                the detail card anchors use the same positions. */}
            <StageSeparator x={263} />
            <StageSeparator x={466} />
            <StageSeparator x={715} />
            <StageSeparator x={937} />

            <g className="lifecycle-base-lines">
                {PRIOR_ART.map(({ path }) => <path key={path} d={path} />)}
                <path d={PRE_PATH} />
                {BRANCH_PATHS.map((d) => <path key={d} d={d} />)}
                <path d={POST_PATH} />
                <path d={BIN_PATH} />
            </g>

            <g className="lifecycle-active-lines">
                {PRIOR_ART.map(({ path }) => <path key={path} d={path} data-piece="converge" opacity={0} />)}
                <path d={PRE_PATH} data-piece="pre" opacity={0} />
                {BRANCH_PATHS.map((d) => <path key={d} d={d} data-piece="branch" opacity={0} />)}
                <path d={POST_PATH} data-piece="post" opacity={0} />
                <path d={BIN_PATH} data-piece="bin" opacity={0} />
            </g>

            <g className="lifecycle-stage" data-lifecycle-stage="discover">
                <StageHeader x={113} label="Discover" />
                {PRIOR_ART.map(({ x, y, number }) => (
                    <PriorArtCard key={number} x={x} y={y} number={number} />
                ))}
                <circle className="lifecycle-stage-halo" cx="210" cy="165" r="22" />
                <g className="lifecycle-light" data-at={AT.discover}>
                    <circle className="lifecycle-node" cx="210" cy="165" r="9" />
                </g>
                <text className="lifecycle-micro-label" x="80" y="268" textAnchor="middle">Prior Art</text>
            </g>

            <g className="lifecycle-stage" data-lifecycle-stage="define">
                <StageHeader x={370} label="Define" />
                <circle className="lifecycle-stage-halo" cx="369" cy="154" r="46" />
                <ClaimDocument />
                <text className="lifecycle-micro-label" x="370" y="268" textAnchor="middle">Claims</text>
            </g>

            <g className="lifecycle-stage" data-lifecycle-stage="file">
                <StageHeader x={600} label="File" />
                <circle className="lifecycle-stage-halo" cx="500" cy="165" r="22" />
                <g className="lifecycle-light" data-at={AT.file}>
                    <circle className="lifecycle-node" cx="500" cy="165" r="9" />
                </g>
                {JURISDICTIONS.map(({ code, y }, index) => (
                    <JurisdictionChip key={code} y={y} code={code} at={branchAt(index, 0.3)} />
                ))}
                <MoreOfficesChip at={branchAt(1.5, 0.3)} />
            </g>

            <g className="lifecycle-stage" data-lifecycle-stage="protect">
                <StageHeader x={831} label="Protect" />
                <circle className="lifecycle-stage-halo" cx="800" cy="165" r="22" />
                {/* Office action card: data-status follows the record (due, drafted,
                    submitted), then the card becomes a green grant notice. */}
                <g className="lifecycle-rise lifecycle-oa" data-at={AT.officeActionDue} data-oa="">
                    <rect className="lifecycle-event-card" x="748" y="64" width="160" height="54" rx="12" />
                    <path className="lifecycle-event-tail" d="M 789 118 L 800 129 L 811 118" />
                    <g className="lifecycle-oa-icon">
                        <rect className="lifecycle-event-icon" x="759" y="80" width="17" height="22" rx="2.5" />
                        <path className="lifecycle-event-icon-line" d="M 763.5 87 H 771.5 M 763.5 92 H 771.5 M 763.5 97 H 769" />
                    </g>
                    <g className="lifecycle-oa-badge">
                        <circle cx="776" cy="101" r="4.5" />
                        <path d="M 774 101 L 775.6 102.6 L 778.4 99.7" />
                    </g>
                    <g className="lifecycle-oa-grant-icon">
                        <circle cx="767.5" cy="91" r="8.5" />
                        <path d="M 763.8 91.2 L 766.5 93.9 L 771.4 88.4" />
                    </g>
                    <text className="lifecycle-event-title lifecycle-oa-title" data-title="oa" x="784" y="84.5">Office Action</text>
                    <text className="lifecycle-event-title lifecycle-oa-title" data-title="grant" x="784" y="84.5">Patent Granted</text>
                    <circle className="lifecycle-oa-dot" cx="787" cy="95" r="2.2" />
                    {OA_STATUSES.map(({ id, text }) => (
                        <text key={id} className="lifecycle-event-meta lifecycle-oa-status" data-for={id} x="792" y="97.5">
                            {text}
                        </text>
                    ))}
                    {[784, 822.5, 861].map((x, index) => (
                        <rect key={x} className="lifecycle-oa-step" data-step={index + 1} x={x} y="103.5" width="35" height="2.5" rx="1.25" />
                    ))}
                </g>
                <g className="lifecycle-light" data-at={AT.officeAction}>
                    <circle className="lifecycle-node" cx="800" cy="165" r="9" />
                </g>
                <g className="lifecycle-light" data-at={AT.responseSubmitted}>
                    <circle className="lifecycle-node lifecycle-node-small" cx="850" cy="165" r="4.5" />
                </g>
                <text className="lifecycle-micro-label" x="800" y="198" textAnchor="middle">Office Action</text>

                <g className="lifecycle-grant" data-at={AT.grant}>
                    <circle className="lifecycle-grant-halo" cx="900" cy="165" r="15" />
                    <circle className="lifecycle-grant-node" cx="900" cy="165" r="9" />
                    <path className="lifecycle-check" d="M 896 165 L 899 168 L 905 161" />
                </g>
                <text className="lifecycle-micro-label" x="900" y="198" textAnchor="middle">Grant</text>
            </g>

            <g className="lifecycle-stage" data-lifecycle-stage="maintain">
                <StageHeader x={1068} label="Maintain" />
                <FeeCard />
                {ANNUITY_X.map((x, index) => (
                    <g key={x} className="lifecycle-annuity" data-at={AT.annuities[index]}>
                        <circle className="lifecycle-annuity-node" cx={x} cy="165" r="9" />
                        <path className="lifecycle-annuity-check" d={`M ${x - 4} 165 L ${x - 1} 168 L ${x + 5} 161`} />
                        <text className="lifecycle-micro-label lifecycle-amber-label" x={x} y="198" textAnchor="middle">
                            {ANNUITY_LABELS[index]}
                        </text>
                    </g>
                ))}
            </g>

            {PRIOR_ART.map(({ path }) => (
                <circle
                    key={path}
                    data-dot="converge"
                    className="lifecycle-progress-dot-small"
                    r="4.5"
                    cx="210"
                    cy="165"
                    opacity={0}
                />
            ))}
            {BRANCH_PATHS.map((d) => (
                <circle
                    key={d}
                    data-dot="branch"
                    className="lifecycle-progress-dot-small"
                    r="4.5"
                    cx="500"
                    cy="165"
                    opacity={0}
                    filter="url(#lifecycle-dot-glow)"
                />
            ))}
            <circle
                data-dot="main"
                className="lifecycle-progress-dot"
                r="7"
                cx="210"
                cy="165"
                opacity={0}
                filter="url(#lifecycle-dot-glow)"
            />
            <ArchiveBin />
        </svg>
    );
});

function StageHeader({ x, label }: { x: number; label: string }) {
    return <text className="lifecycle-stage-heading" x={x} y="33" textAnchor="middle">{label}</text>;
}

function StageSeparator({ x }: { x: number }) {
    return <path className="lifecycle-stage-separator" d={`M ${x} 17 V 43`} />;
}

/* 120 x 52 card with 13px side padding: document icon, then the number and
   two summary lines, all centred on the card's vertical midline. */
function PriorArtCard({ x, y, number }: { x: number; y: number; number: string }) {
    return (
        <g>
            <rect className="lifecycle-document-card" x={x} y={y} width="120" height="52" rx="9" />
            <path className="lifecycle-document-icon" d={`M ${x + 13} ${y + 13} H ${x + 24} L ${x + 29} ${y + 18} V ${y + 39} H ${x + 13} Z`} />
            <path className="lifecycle-document-fold" d={`M ${x + 24} ${y + 13} V ${y + 18} H ${x + 29}`} />
            <text className="lifecycle-document-number" x={x + 38} y={y + 22}>{number}</text>
            <path className="lifecycle-document-line" d={`M ${x + 38} ${y + 30} H ${x + 107} M ${x + 38} ${y + 37} H ${x + 94}`} />
        </g>
    );
}

function ClaimDocument() {
    return (
        <g>
            <path className="lifecycle-claim-document" d="M 307 75 H 405 L 432 102 V 232 H 307 Z" />
            <path className="lifecycle-claim-fold" d="M 405 75 V 102 H 432" />
            <text className="lifecycle-claim-title" x="325" y="111">Claims</text>
            {CLAIM_LINES.map((d) => <path key={d} className="lifecycle-claim-line" d={d} />)}
            {CLAIM_LINES.map((d) => (
                <path key={d} className="lifecycle-claim-ink" d={d} data-piece="claim" opacity={0} />
            ))}
            <text className="lifecycle-claim-number" x="316" y="153">1.</text>
            <text className="lifecycle-claim-number" x="316" y="175">2.</text>
            <text className="lifecycle-claim-number" x="316" y="197">3.</text>
        </g>
    );
}

function JurisdictionChip({ y, code, at }: { y: number; code: JurisdictionCode; at: number }) {
    return (
        <g className="lifecycle-chip" data-at={at}>
            <rect className="lifecycle-jurisdiction-chip" x="560" y={y - 17} width="80" height="34" rx="17" />
            <g transform={`translate(572 ${y - 6})`}>
                <g className="lifecycle-flag" clipPath="url(#lifecycle-flag-clip)">
                    <FlagArt code={code} />
                </g>
                <rect className="lifecycle-flag-border" width="18" height="12" rx="2" />
            </g>
            <text className="lifecycle-jurisdiction-code" x="613" y={y + 4} textAnchor="middle">{code}</text>
        </g>
    );
}

/* The four chips are examples, not the full list. A ghost chip in the gap
   between EP and IN, on dashed stubs from the file node and into the post
   route, says more offices follow. Its codes fade out into an ellipsis. */
function MoreOfficesChip({ at }: { at: number }) {
    return (
        <g className="lifecycle-chip lifecycle-more" data-at={at}>
            <path className="lifecycle-more-route" d="M 511 165 H 562 M 638 165 H 698" />
            <rect className="lifecycle-more-chip" x="562" y="154" width="76" height="22" rx="11" />
            <text className="lifecycle-more-code" x="600" y="168.5" textAnchor="middle">
                <tspan opacity="0.8">JP</tspan>
                <tspan dx="5" opacity="0.5">CN</tspan>
                <tspan dx="3" opacity="0.45">···</tspan>
            </text>
        </g>
    );
}

/* Simplified flags drawn in an 18 x 12 box. PCT has no national flag, so it
   uses a globe for the international phase. Star positions are rounded so
   server and client render identical attributes. */
const US_STRIPE = 12 / 7;
const US_STARS = [1.4, 3.1, 4.8, 6.5].flatMap((x) => [1.4, 3.4, 5.4].map((y) => ({ x, y })));
const EU_STARS = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2;
    return {
        x: Math.round((9 + 3.7 * Math.cos(angle)) * 100) / 100,
        y: Math.round((6 + 3.7 * Math.sin(angle)) * 100) / 100,
    };
});

function FlagArt({ code }: { code: JurisdictionCode }) {
    switch (code) {
        case 'US':
            return (
                <>
                    <rect width="18" height="12" fill="#b22234" />
                    {[1, 3, 5].map((row) => (
                        <rect key={row} y={US_STRIPE * row} width="18" height={US_STRIPE} fill="#ffffff" />
                    ))}
                    <rect width="8" height={US_STRIPE * 4} fill="#3c3b6e" />
                    {US_STARS.map(({ x, y }) => (
                        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.4" fill="#ffffff" />
                    ))}
                </>
            );
        case 'EP':
            return (
                <>
                    <rect width="18" height="12" fill="#003399" />
                    {EU_STARS.map(({ x, y }) => (
                        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="#ffcc00" />
                    ))}
                </>
            );
        case 'IN':
            return (
                <>
                    <rect width="18" height="4" fill="#ff9933" />
                    <rect y="4" width="18" height="4" fill="#ffffff" />
                    <rect y="8" width="18" height="4" fill="#138808" />
                    <circle cx="9" cy="6" r="1.55" fill="none" stroke="#000080" strokeWidth="0.45" />
                    <circle cx="9" cy="6" r="0.4" fill="#000080" />
                </>
            );
        case 'PCT':
            return (
                <>
                    <rect width="18" height="12" fill="#eef2ff" />
                    <circle cx="9" cy="6" r="4.3" fill="#ffffff" stroke="#4f46e5" strokeWidth="0.8" />
                    <ellipse cx="9" cy="6" rx="1.9" ry="4.3" fill="none" stroke="#6366f1" strokeWidth="0.6" />
                    <path d="M 4.7 6 H 13.3 M 5.5 3.7 H 12.5 M 5.5 8.3 H 12.5" stroke="#6366f1" strokeWidth="0.6" />
                </>
            );
    }
}

/* Maintenance fee card above the fee nodes, mirroring the office action card
   in Protect. It rises as the record enters Maintain, fills one step per fee
   paid (each step is a milestone), and reads expired once archived. */
function FeeCard() {
    return (
        <g className="lifecycle-rise lifecycle-fee" data-at={AT.feeDue} data-fees="">
            <rect className="lifecycle-event-card" x="950" y="64" width="160" height="54" rx="12" />
            <path className="lifecycle-event-tail" d="M 1019 118 L 1030 129 L 1041 118" />
            <rect className="lifecycle-fee-icon-body" x="959" y="82" width="18" height="17" rx="3" />
            <path
                className="lifecycle-fee-icon-line"
                d="M 959 87.5 H 977 M 963.5 79.5 V 84 M 972.5 79.5 V 84 M 963.5 92.5 H 966.5 M 970 92.5 H 973 M 963.5 95.8 H 966.5"
            />
            <text className="lifecycle-event-title" x="986" y="84.5">Maintenance Fees</text>
            <circle className="lifecycle-fee-dot" cx="989" cy="95" r="2.2" />
            {FEE_STATUSES.map(({ id, text }) => (
                <text key={id} className="lifecycle-event-meta lifecycle-fee-status" data-for={id} x="994" y="97.5">
                    {text}
                </text>
            ))}
            {AT.annuities.map((at, index) => (
                <rect
                    key={at}
                    className="lifecycle-fee-step"
                    data-at={at}
                    x={986 + index * 38.5}
                    y="103.5"
                    width="35"
                    height="2.5"
                    rx="1.25"
                />
            ))}
        </g>
    );
}

/* Archive bin. Drawn after the dots so the record drops behind the box front
   and disappears inside. It sits outside the maintain group, so it mirrors
   that stage's state. The lid lifts on its right hinge while the record
   arrives (data-lid), and the bin turns indigo once archived (data-reveal). */
function ArchiveBin() {
    return (
        <g className="lifecycle-stage" data-stage-mirror="4">
            <g className="lifecycle-bin" data-bin="" data-at={AT.archive}>
                <g className="lifecycle-bin-body">
                    <rect className="lifecycle-bin-box" x="1128" y="206" width="44" height="38" rx="5" />
                    <path className="lifecycle-bin-slot" d="M 1143 221 H 1157" />
                    <g className="lifecycle-bin-lid">
                        <rect className="lifecycle-bin-lid-shape" x="1124" y="197" width="52" height="8" rx="3" />
                        <path className="lifecycle-bin-handle" d="M 1142 197 V 193.5 H 1158 V 197" />
                    </g>
                </g>
            </g>
            <text className="lifecycle-micro-label" x="1150" y="268" textAnchor="middle">Expire &amp; Archive</text>
        </g>
    );
}
