'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { hashTargetFromEvent, scrollToHashTarget } from '@/lib/hashScroll';

/**
 * Owns in-page anchor scrolling for the whole site. Rendered once in the root
 * layout; renders nothing.
 *
 * Covers the three ways a visitor reaches a section:
 *   - clicking a hash link on the page they are already on (nav, footer,
 *     in-section CTAs, the skip link)
 *   - landing on a URL that already carries a hash, including a client-side
 *     navigation from another route
 *   - going back or forward between hashes
 *
 * See lib/hashScroll for why the browser and the router cannot be left to do
 * this on their own.
 */
export function HashScroll() {
    const pathname = usePathname();

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            const id = hashTargetFromEvent(event);
            if (!id) return;

            /* preventDefault stops the router's own hash handling (Link bails
               when the event is already defaulted) and the browser's instant
               jump. The event keeps bubbling on purpose, so component-level
               onClick handlers still run: closing the mobile menu, dismissing
               a mega-menu, and so on. */
            event.preventDefault();
            scrollToHashTarget(id);

            if (window.location.hash !== `#${id}`) {
                const url = `${window.location.pathname}${window.location.search}#${id}`;
                // Keep the existing history state so the App Router stays in
                // sync; this is a fragment change, not a navigation.
                window.history.pushState(window.history.state, '', url);
            }
        }

        function handleHashChange() {
            const id = decodeURIComponent(window.location.hash.slice(1));
            if (id) scrollToHashTarget(id);
        }

        document.addEventListener('click', handleClick, { capture: true });
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            document.removeEventListener('click', handleClick, { capture: true });
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    /* Arriving with a hash, on first load or after a route change. The browser
       has already jumped by now, but it jumped before the deferred mockups
       mounted and without allowing for the fixed header, so re-run the
       corrected scroll and let the watchdog track the layout as it settles. */
    useEffect(() => {
        const id = decodeURIComponent(window.location.hash.slice(1));
        if (!id) return;

        const frame = requestAnimationFrame(() =>
            scrollToHashTarget(id, { instant: true }),
        );
        return () => cancelAnimationFrame(frame);
    }, [pathname]);

    return null;
}
