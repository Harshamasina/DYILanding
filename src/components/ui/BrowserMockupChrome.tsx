interface MockupRecordLabelProps {
    /** The record reference, as the app would print it: "DEMO-2024-011". */
    record: string;
    /** The screen the mockup shows: "Patent families". */
    screen: string;
    className?: string;
}

/* The left of a mockup's title bar: a record reference and the screen
   name, the way a docket printout heads its pages, in place of window
   control dots. */
export function MockupRecordLabel({ record, screen, className = '' }: MockupRecordLabelProps) {
    return (
        <div className={`flex min-w-0 shrink-0 items-baseline gap-1.5 leading-none sm:gap-2 ${className}`}>
            <span className="text-[10px] font-semibold tracking-[0.04em] text-navy-light sm:text-[10px] [font-family:var(--font-dashboard-mono)]">
                {record}
            </span>
            <span className="truncate text-[10px] sm:text-[9px] tracking-[0.04em] text-text-secondary sm:text-xs [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                {screen}
            </span>
        </div>
    );
}

interface BrowserMockupChromeProps extends MockupRecordLabelProps {
    url: string;
}

export function BrowserMockupChrome({ url, record, screen, className = '' }: BrowserMockupChromeProps) {
    return (
        <div className={`flex shrink-0 items-center gap-3 border-b border-card-border bg-page-bg-alt px-3 py-1.5 sm:px-4 sm:py-2 ${className}`}>
            <MockupRecordLabel record={record} screen={screen} />
            <div className="flex min-w-0 flex-1 justify-end">
                <div className="flex min-w-0 max-w-full items-center gap-1.5 rounded-md border border-card-border bg-white px-2 py-0.5 text-[10px] text-text-muted sm:px-3 sm:text-[9px] [font-family:var(--font-dashboard-mono)]">
                    <span className="truncate">{url}</span>
                </div>
            </div>
        </div>
    );
}
