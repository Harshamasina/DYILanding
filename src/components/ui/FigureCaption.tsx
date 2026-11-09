interface FigureCaptionProps {
    children: React.ReactNode;
    className?: string;
}

/* Caption under a product mockup, labelled the way patent drawings are:
   "FIG. 3". The number comes from the enclosing .figure-group's CSS counter
   (globals.css), so figures number themselves in page order. */
export function FigureCaption({ children, className = '' }: FigureCaptionProps) {
    return (
        <p className={`flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-sm ${className}`}>
            <span className="font-semibold tracking-[0.06em] text-text-primary [font-family:var(--font-display)]">
                FIG. <span className="figure-number" />
            </span>
            <span className="italic text-text-secondary [font-family:var(--font-body)]">{children}</span>
        </p>
    );
}
