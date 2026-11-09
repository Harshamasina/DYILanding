interface SectionMarkProps {
    children: React.ReactNode;
    /** Anchor id, e.g. the home page tree spine's branch targets. */
    id?: string;
    /** 'compliance' marks the regulated beats in amber; everything else is indigo. */
    tone?: 'primary' | 'compliance';
    /** On navy sections. */
    dark?: boolean;
    /** Numbered by page order through a CSS counter on main; off outside main. */
    numbered?: boolean;
    className?: string;
}

/* Section label in the form of a legal citation: a section sign and its
   number on a docket tab, then the label in serif small caps. Replaces the mono
   uppercase eyebrow. The sign and number are decoration; the label is the text
   that search engines and screen readers get. */
export function SectionMark({
    children,
    id,
    tone = 'primary',
    dark = false,
    numbered = true,
    className = '',
}: SectionMarkProps) {
    const tab =
        tone === 'compliance'
            ? dark
                ? 'text-compliance-on-dark border-compliance-on-dark/35 bg-compliance-on-dark/[0.06]'
                : 'text-compliance-ink border-compliance-ink/30 bg-compliance-ink/[0.04]'
            : dark
              ? 'text-primary-light border-primary-light/35 bg-primary-light/[0.06]'
              : 'text-primary border-primary/30 bg-primary/[0.04]';
    const label = dark ? 'text-white/75' : 'text-navy-light';

    return (
        <div id={id} className={`flex items-center gap-3.5 ${className}`}>
            <span
                aria-hidden="true"
                className={`flex items-baseline gap-1 rounded-[3px] border px-2 pt-1.25 pb-1 leading-none [font-family:var(--font-display)] ${tab}`}
            >
                <span className="text-[22px]">§</span>
                {numbered && <span className="section-mark-number text-lg font-semibold tabular-nums" />}
            </span>
            <span
                className={`text-base leading-none tracking-[0.1em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps] ${label}`}
            >
                {children}
            </span>
        </div>
    );
}
