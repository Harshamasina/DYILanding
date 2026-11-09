interface SubsectionNumberProps {
    /** Indigo, amber on white, or the lighter shades on navy. */
    tone?: 'primary' | 'compliance';
    dark?: boolean;
    /** 'md' heads a card; 'sm' sits beside a line of text in a list. */
    size?: 'sm' | 'md';
    className?: string;
}

/* The number of a card under its section mark, "3.1", "3.2", in place of an
   icon tile. Counted by CSS (globals.css): each numbered SectionMark restarts
   the count. Decoration only, so it is hidden from screen readers. */
export function SubsectionNumber({ tone = 'primary', dark = false, size = 'md', className = '' }: SubsectionNumberProps) {
    const color =
        tone === 'compliance'
            ? dark
                ? 'text-compliance-on-dark'
                : 'text-compliance-ink'
            : dark
              ? 'text-primary-light'
              : 'text-primary';
    return (
        <span
            aria-hidden="true"
            className={`subsection-number block ${size === 'sm' ? 'text-base' : 'text-xl'} font-semibold leading-none tabular-nums [font-family:var(--font-display)] ${color} ${className}`}
        />
    );
}
