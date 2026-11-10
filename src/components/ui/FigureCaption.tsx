interface FigureCaptionProps {
    children: React.ReactNode;
    /* How many numbered items the figure's list has. When set, a short key
       under the caption tells first-time readers what the numerals mean. */
    references?: number;
    className?: string;
}

/* Caption under a product mockup, labelled the way patent drawings are:
   "FIG. 3". The number comes from the enclosing .figure-group's CSS counter
   (globals.css), so figures number themselves in page order. The key's
   numbers use the same counter: FIG. 3 with three items reads 302 to 306. */
export function FigureCaption({ children, references, className = '' }: FigureCaptionProps) {
    const last = references ? String(2 * references).padStart(2, '0') : '';
    return (
        <div className={className}>
            <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-sm">
                <span className="font-semibold tracking-[0.06em] text-text-primary [font-family:var(--font-display)]">
                    FIG. <span className="figure-number" />
                </span>
                <span className="italic text-slate-600 [font-family:var(--font-body)]">{children}</span>
            </p>
            {references ? (
                <p className="mt-1 text-center text-xs italic text-slate-600 [font-family:var(--font-body)]">
                    Reference numerals <span className="figure-number" />02 to <span className="figure-number" />
                    {last} refer to the features listed.
                </p>
            ) : null}
        </div>
    );
}
