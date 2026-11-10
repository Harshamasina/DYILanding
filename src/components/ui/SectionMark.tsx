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
                className={`flex shrink-0 rounded-[3px] border leading-none [font-family:var(--font-display)] ${numbered ? 'items-baseline gap-1 px-2 pt-1 pb-1.25' : 'h-8 w-8 items-center justify-center'} ${tab}`}
            >
                {/* Playfair's section sign sits low in its line box; on the bare
                    square tab it is nudged up so its ink is centred. */}
                <span className={`text-[22px] ${numbered ? '' : '-translate-y-[2.5px]'}`}>§</span>
                {numbered && <span className="section-mark-number text-lg font-semibold tabular-nums" />}
            </span>
            <span
                className={`text-base leading-snug tracking-[0.04em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps] ${label}`}
            >
                {children}
            </span>
        </div>
    );
}
