import { FadeIn } from '@/components/motion/FadeIn';

export interface ReferenceItem {
    title: string;
    description: string;
}

interface ReferenceListProps {
    items: ReferenceItem[];
    /** 'compliance' sets the numerals in amber; everything else is indigo. */
    tone?: 'primary' | 'compliance';
    /** Element for each item's title, to keep the section's heading outline. */
    titleAs?: 'h3' | 'h4' | 'p';
    /** Passed to each item's FadeIn (the home page tree spine reveal). */
    treeNode?: string;
    /** Stagger offset for the first item, in seconds. */
    baseDelay?: number;
    className?: string;
}

/* A feature list in the manner of a patent specification: each item carries a
   hanging numeral in the margin and is set apart by space alone, the way a
   specification sets its numbered paragraphs, with no rules between rows. It
   carries a
   reference numeral (102, 104, 106) tied to the figure it sits beside, in
   place of an icon tile. The numerals come from CSS counters in globals.css:
   the enclosing .figure-group sets the figure number. The numerals are decoration, so they are hidden from screen
   readers. */
export function ReferenceList({
    items,
    tone = 'primary',
    titleAs: Title = 'h3',
    treeNode,
    baseDelay = 0,
    className = '',
}: ReferenceListProps) {
    const numeral = tone === 'compliance' ? 'text-compliance-ink' : 'text-primary';

    return (
        <ol className={className}>
            {items.map((item, i) => (
                <li key={item.title}>
                    <FadeIn treeNode={treeNode} delay={baseDelay + i * 0.08}>
                        <div className="grid grid-cols-[3rem_1fr] gap-x-3 py-4">
                            <span
                                aria-hidden="true"
                                className={`reference-numeral text-base font-semibold leading-snug tabular-nums [font-family:var(--font-display)] ${numeral}`}
                            />
                            <div className="min-w-0">
                                <Title className="text-[15px] font-semibold leading-snug text-text-primary [font-family:var(--font-display)]">
                                    {item.title}
                                </Title>
                                <p className="mt-1 text-[13px] leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </FadeIn>
                </li>
            ))}
        </ol>
    );
}
