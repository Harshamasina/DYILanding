import type { ReactNode } from 'react';

/** Shared context for the static, fictional prosecution walkthrough. Each
    step is labelled as a patent drawing figure: step "02" is FIG. 2. */
export function OfficeActionExampleLabel({ step, children }: { step: string; children: ReactNode }) {
    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-l-2 border-primary/30 pl-4">
            <span className="flex flex-wrap items-baseline gap-x-3 text-sm">
                <span className="font-semibold tracking-[0.06em] text-text-primary [font-family:var(--font-display)]">FIG. {Number(step)}</span>
                <span className="italic text-text-secondary [font-family:var(--font-body)]">{children}</span>
            </span>
            <span className="text-xs leading-relaxed text-text-secondary">Illustrative matter · Adaptive sensor system</span>
        </div>
    );
}
