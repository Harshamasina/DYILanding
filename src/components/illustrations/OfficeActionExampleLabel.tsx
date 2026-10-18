import type { ReactNode } from 'react';

/** Shared context for the static, fictional prosecution walkthrough. */
export function OfficeActionExampleLabel({ step, children }: { step: string; children: ReactNode }) {
    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-l-2 border-primary/30 pl-4">
            <span className="text-xs font-semibold text-primary [font-family:var(--font-mono)]">{step} / {children}</span>
            <span className="text-xs leading-relaxed text-text-secondary">Illustrative matter · Adaptive sensor system</span>
        </div>
    );
}
