import type { ReactNode } from 'react';

/* A short run of facts on one line: a small-caps label, then the items
   separated by thin vertical rules, like a line in a docket report. It
   replaces rows of pill badges, which repeat the section in a louder voice.
   Below sm the label sits on its own line above the items; a centred list
   becomes left-aligned rows with hairline rules between them, because a
   centred stack of phrases has no edge to read from on a phone. */
export function RuledList({
    label,
    children,
    align = 'start',
    dark = false,
    className = '',
}: {
    label?: string;
    children: ReactNode;
    align?: 'start' | 'center';
    dark?: boolean;
    className?: string;
}) {
    const centred = align === 'center';
    const labelTone = dark ? 'text-white/75' : 'text-navy-light';
    const ruleTone = dark ? 'border-white/20' : 'border-card-border';
    const outer = centred
        ? 'flex flex-col gap-y-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-center sm:gap-y-2'
        : 'flex flex-wrap items-baseline gap-y-2';
    const list = centred
        ? `flex flex-col border-t ${ruleTone} max-sm:[&>li]:border-b max-sm:[&>li]:border-l-0 max-sm:[&>li]:px-0 max-sm:[&>li]:py-2.5 sm:-ml-[13px] sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-center sm:gap-y-2 sm:border-t-0`
        : '-ml-[13px] flex flex-wrap items-baseline gap-y-2';
    return (
        <div className={`${outer} ${className}`}>
            {label && <span className={`w-full text-base leading-none tracking-[0.1em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps] sm:mr-3 sm:w-auto ${labelTone}`}>
                {label}
            </span>}
            {/* From sm up the list is pulled left by one item's rule and
                padding and clipped, so the rule before the first item on every
                wrapped line is hidden and only the rules between items show. */}
            <div className={`min-w-0 overflow-hidden ${centred ? 'w-full sm:w-auto' : 'grow'}`}>
                <ul aria-label={label} className={list}>
                    {children}
                </ul>
            </div>
        </div>
    );
}

export function RuledItem({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
    const tone = dark ? 'border-white/20 text-white/85' : 'border-card-border text-text-primary';
    return (
        <li className={`border-l px-3 text-sm leading-snug [font-family:var(--font-body)] ${tone}`}>
            {children}
        </li>
    );
}

/* The same line for a plain list of strings. */
export function InlineList({
    label,
    items,
    align = 'start',
    dark = false,
    className = '',
}: {
    label?: string;
    items: readonly string[];
    align?: 'start' | 'center';
    dark?: boolean;
    className?: string;
}) {
    return (
        <RuledList label={label} align={align} dark={dark} className={className}>
            {items.map((item) => (
                <RuledItem key={item} dark={dark}>
                    {item}
                </RuledItem>
            ))}
        </RuledList>
    );
}
