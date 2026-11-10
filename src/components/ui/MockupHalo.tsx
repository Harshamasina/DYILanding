interface MockupHaloProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Wraps an animated mockup with a soft neutral shadow pool that lifts it
 * off the page. Purely decorative: the pool sits behind the children via
 * `-z-10` inside an `isolate` stacking context so it never escapes the
 * wrapper. Neutral, not a coloured glow, so the mockup reads as an object
 * on the page rather than a light source.
 */
export function MockupHalo({ children, className = '' }: MockupHaloProps) {
    return (
        <div className={`mockup-frame relative isolate w-full min-w-0 ${className}`}>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-8 -inset-y-6 top-6 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.10)_0%,rgba(15,23,42,0.04)_40%,transparent_70%)] blur-[40px] sm:-inset-x-12 lg:-inset-x-16"
            />
            {children}
        </div>
    );
}
