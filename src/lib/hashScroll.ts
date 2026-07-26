/* ──────────────────────────────────────────────────────────────────────
   Hash-link scrolling
   ──────────────────────────────────────────────────────────────────────
   Anchor navigation on this site fails in three ways that the browser and
   the App Router do not handle between them:

   1. Clicking a <Link href="/#features"> while already on "/" leaves the
      scroll to the router, which skips it when the section is partly on
      screen. The URL changes and the page stays where it is, or moves only
      part of the way.
   2. A fixed header covers the top of whatever the browser scrolls to.
   3. Below-the-fold mockups mount lazily (DeferredMount) and the mobile
      menu locks body scroll for a frame or two. Both change the target's
      offset while a smooth scroll is in flight, so the animation finishes
      somewhere short of the section.

   scrollToHashTarget() owns the scroll instead: it aims at the target minus
   the header offset, then watches for the rest of a short settle window and
   re-issues the scroll whenever the page has come to rest away from the
   goal. The watchdog stops the moment the visitor scrolls themselves, so it
   can never fight the user for control.
   ────────────────────────────────────────────────────────────────────── */

/** How long to keep correcting after the initial scroll request. */
const SETTLE_WINDOW_MS = 1400;
/** Frames without movement before a scroll counts as finished or blocked. */
const STALL_FRAMES = 3;
/** Safety cap so a permanently unreachable goal cannot loop. */
const MAX_REISSUES = 6;
/** Distance from the goal we treat as "arrived". */
const TOLERANCE_PX = 2;
/** Used only if the CSS variable is missing (e.g. stylesheet still loading). */
const OFFSET_FALLBACK_PX = 84;

/** Only one hash scroll may be in flight; a new one cancels the last. */
let activeRun: AbortController | null = null;

/**
 * Header offset, read from the same `--scroll-offset` custom property that
 * drives `scroll-padding-top`, so CSS stays the single source of truth and
 * the value can change per breakpoint.
 */
function headerOffset(): number {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(
        '--scroll-offset',
    );
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : OFFSET_FALLBACK_PX;
}

/** Document position that puts the target just below the fixed header. */
function goalFor(target: HTMLElement): number {
    const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
    );
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
    return Math.min(Math.max(top, 0), maxScroll);
}

/**
 * Move focus the way a real anchor jump would, so keyboard and screen-reader
 * users continue from the section rather than from the nav they just left.
 */
function focusTarget(target: HTMLElement) {
    if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), {
            once: true,
        });
    }
    target.focus({ preventScroll: true });
}

/**
 * Scroll to the element with this id and keep it there while the layout
 * settles. Returns false when no such element exists, so callers can fall
 * back to default browser behaviour.
 */
export function scrollToHashTarget(
    id: string,
    options: { instant?: boolean } = {},
): boolean {
    const target = document.getElementById(id);
    if (!target) return false;

    activeRun?.abort();
    const run = new AbortController();
    activeRun = run;
    const { signal } = run;

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;
    /* 'instant', not 'auto': per spec 'auto' defers to the CSS
       scroll-behavior, which is smooth here, so it would animate. */
    const behavior: ScrollBehavior =
        options.instant || prefersReducedMotion ? 'instant' : 'smooth';

    window.scrollTo({ top: goalFor(target), behavior });
    focusTarget(target);

    // Hand control back as soon as the visitor scrolls on their own.
    const stop = () => run.abort();
    window.addEventListener('wheel', stop, { passive: true, signal });
    window.addEventListener('touchstart', stop, { passive: true, signal });
    window.addEventListener('keydown', stop, { signal });

    const startedAt = performance.now();
    let lastY = window.scrollY;
    let stalledFrames = 0;
    let reissues = 0;

    function tick() {
        if (signal.aborted) return;

        if (performance.now() - startedAt > SETTLE_WINDOW_MS) {
            run.abort();
            return;
        }

        const current = document.getElementById(id);
        if (!current) {
            run.abort();
            return;
        }

        const y = window.scrollY;
        const goal = goalFor(current);

        stalledFrames = Math.abs(y - lastY) < 0.5 ? stalledFrames + 1 : 0;
        lastY = y;

        // Resting away from the goal means the scroll was blocked (body lock),
        // interrupted, or the goal moved under us (a mockup mounted). Re-aim.
        if (
            Math.abs(goal - y) > TOLERANCE_PX &&
            stalledFrames >= STALL_FRAMES &&
            reissues < MAX_REISSUES
        ) {
            reissues += 1;
            stalledFrames = 0;
            window.scrollTo({ top: goal, behavior });
        }

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    return true;
}

/** Trailing slashes vary with next.config's trailingSlash, so compare without. */
function normalizePath(path: string): string {
    return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

/**
 * Resolve a click to a same-page hash target id, or null when the click is
 * anything else: a new tab, a modified click, an external link, a download,
 * or a link to another route.
 */
export function hashTargetFromEvent(event: MouseEvent): string | null {
    if (event.defaultPrevented || event.button !== 0) return null;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;

    const anchor = (event.target as Element | null)?.closest?.('a[href]');
    if (!(anchor instanceof HTMLAnchorElement)) return null;
    if (anchor.target && anchor.target !== '_self') return null;
    if (anchor.hasAttribute('download')) return null;

    let url: URL;
    try {
        url = new URL(anchor.href, window.location.href);
    } catch {
        return null;
    }

    if (url.origin !== window.location.origin) return null;
    if (normalizePath(url.pathname) !== normalizePath(window.location.pathname)) {
        return null;
    }
    if (!url.hash || url.hash === '#') return null;

    const id = decodeURIComponent(url.hash.slice(1));
    return document.getElementById(id) ? id : null;
}
