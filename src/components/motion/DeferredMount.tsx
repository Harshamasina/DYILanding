'use client';

import { useEffect, useRef, useState } from 'react';

interface DeferredMountProps {
    children: React.ReactNode;
    /* Sizing classes that reserve the child's final box up front (match the
       child's own height/width exactly) so mounting causes no layout shift. */
    className?: string;
    /* How far ahead of the viewport to mount, so content is ready before it
       scrolls into view. */
    rootMargin?: string;
}

/* Defers mounting heavy, decorative below-the-fold content (the animated
   product mockups) until it is about to enter the viewport. The wrapper holds
   the exact final size from the first render, so the swap is shift-free. The
   deferred children are aria-hidden visuals, so keeping them out of the initial
   render is SEO-neutral while cutting initial DOM size and hydration cost
   (which is what drives Total Blocking Time on this page). */
export function DeferredMount({
    children,
    className = '',
    rootMargin = '400px',
}: DeferredMountProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (show) return;
        const el = ref.current;
        if (!el) return;

        // Fallback for environments without IntersectionObserver: render now.
        if (typeof IntersectionObserver === 'undefined') {
            setShow(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setShow(true);
                    observer.disconnect();
                }
            },
            { rootMargin },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin, show]);

    return (
        <div ref={ref} className={className}>
            {show ? children : null}
        </div>
    );
}
