import type { ReactNode } from 'react';

/** Shared caption for the static, fictional prosecution walkthrough. Each
    step is labelled as a patent drawing figure (step "02" is FIG. 2) and sits
    below its figure, like the FIG. captions on every other page. The note
    line names the illustrative matter. */
export function OfficeActionExampleLabel({ step, note = 'Illustrative matter, adaptive sensor system', children }: { step: string; note?: string; children: ReactNode }) {
    return (
        <figcaption className="mt-5 flex flex-col items-center gap-1 text-center">
            <span className="flex flex-wrap items-baseline justify-center gap-x-3 text-sm">
                <span className="font-semibold tracking-[0.06em] text-text-primary [font-family:var(--font-display)]">FIG. {Number(step)}</span>
                <span className="italic text-text-secondary [font-family:var(--font-body)]">{children}</span>
            </span>
            <span className="text-[13px] leading-relaxed text-slate-600 italic sm:text-xs [font-family:var(--font-body)]">{note}</span>
        </figcaption>
    );
}
