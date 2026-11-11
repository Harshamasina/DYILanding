import type { ReactNode } from 'react';

/** Shared caption for the static, fictional prosecution walkthrough: the
    step's title under its figure, then a note line naming the illustrative
    matter. step is kept for callers that still pass it. */
export function OfficeActionExampleLabel({ note = 'Illustrative matter, adaptive sensor system', children }: { step?: string; note?: string; children: ReactNode }) {
    return (
        <figcaption className="mt-5 flex flex-col items-center gap-1 text-center">
            <span className="text-sm font-semibold text-text-primary [font-family:var(--font-display)]">{children}</span>
            <span className="text-[13px] leading-relaxed text-slate-600 italic sm:text-xs [font-family:var(--font-body)]">{note}</span>
        </figcaption>
    );
}
