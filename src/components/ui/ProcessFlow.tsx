import { ArrowDown, ArrowRight } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

export interface ProcessStep {
    title: string;
    description?: string;
}

/* A sequence drawn the way a method patent draws one: a flowchart of thin
   boxes labelled S101, S102, joined by arrows. Used only for real sequences
   (a procedure the product runs), so a list of features never reads as steps.
   The boxes share the hero drawings' stroke and corner. Across from lg,
   stacked with downward arrows below it. */
const COLUMNS: Record<number, string> = {
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
};

export function ProcessFlow({ steps, label, className = '' }: { steps: readonly ProcessStep[]; label: string; className?: string }) {
    return (
        <ol aria-label={label} className={`grid grid-cols-1 gap-y-9 lg:gap-x-10 ${COLUMNS[steps.length] ?? 'lg:grid-cols-4'} ${className}`}>
            {steps.map((step, i) => (
                <li key={step.title} className="relative">
                    {i > 0 && (
                        <>
                            <ArrowDown aria-hidden="true" className="absolute -top-7 left-6 h-5 w-5 text-primary/45 lg:hidden" />
                            <ArrowRight aria-hidden="true" className="absolute top-8 -left-[1.875rem] hidden h-5 w-5 text-primary/45 lg:block" />
                        </>
                    )}
                    <FadeIn delay={i * 0.08}>
                        <div className="rounded-[3px] border border-primary/30 bg-white px-4 py-3.5 shadow-[0_1px_0_rgba(79,70,229,0.06)] lg:min-h-[5.25rem]">
                            <span className="block text-[11px] font-semibold tracking-wide text-primary [font-family:var(--font-mono)]">
                                S{101 + i}
                            </span>
                            <span className="mt-1.5 block text-base font-semibold leading-snug text-text-primary [font-family:var(--font-display)]">
                                {step.title}
                            </span>
                        </div>
                        {step.description && (
                            <p className="mt-3 px-1 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                {step.description}
                            </p>
                        )}
                    </FadeIn>
                </li>
            ))}
        </ol>
    );
}
