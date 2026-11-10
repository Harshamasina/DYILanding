import type { ReactNode } from 'react';

/* A short run of facts on one line: a small-caps label, then the items
   separated by middle dots, as the phrases would be set in running text. It
   replaces rows of pill badges and of ruled cells. Below sm the label sits on
   its own line and a centred run aligns left, so it keeps an edge to read from. */
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
    const outer = centred
        ? 'flex flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-center'
        : 'flex flex-wrap items-baseline gap-y-2';
    return (
        <div className={`${outer} ${className}`}>
            {label && <span className={`w-full text-base leading-none tracking-[0.04em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps] sm:mr-3 sm:w-auto ${labelTone}`}>
                {label}
            </span>}
            {/* The list is pulled left by one item's padding and clipped, so the
                dot before the first item on every wrapped line is hidden and only
                the dots between items show. */}
            <div className={`min-w-0 overflow-hidden ${centred ? 'w-full sm:w-auto' : 'grow'}`}>
                <ul aria-label={label} className={`-ml-[13px] flex flex-wrap items-baseline gap-y-1.5 ${centred ? 'sm:justify-center' : ''}`}>
                    {children}
                </ul>
            </div>
        </div>
    );
}

export function RuledItem({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
    const tone = dark ? 'text-white/85 before:text-white/40' : 'text-text-primary before:text-primary/45';
    return (
        <li className={`relative px-3 text-sm leading-snug [font-family:var(--font-body)] before:absolute before:left-0 before:-translate-x-1/2 before:content-['·'] ${tone}`}>
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
