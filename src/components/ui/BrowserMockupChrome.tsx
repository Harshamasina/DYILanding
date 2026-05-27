interface BrowserMockupChromeProps {
    url: string;
    className?: string;
}

export function BrowserMockupChrome({ url, className = '' }: BrowserMockupChromeProps) {
    return (
        <div className={`flex shrink-0 items-center gap-2 border-b border-card-border bg-page-bg-alt px-3 py-1.5 sm:px-4 sm:py-2 ${className}`}>
            <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FF5F57] sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-[#FFBD2E] sm:h-2.5 sm:w-2.5" />
                <span className="h-2 w-2 rounded-full bg-[#28C840] sm:h-2.5 sm:w-2.5" />
            </div>
            <div className="flex min-w-0 flex-1 justify-center">
                <div
                    className="flex min-w-0 max-w-full items-center gap-1.5 rounded-md border border-card-border bg-white px-2 py-0.5 text-[8px] text-text-muted sm:px-3 sm:text-[9px]"
                    style={{ fontFamily: 'var(--font-dashboard-mono)' }}
                >
                    <span className="truncate">{url}</span>
                </div>
            </div>
            <div className="w-6 sm:w-[40px]" />
        </div>
    );
}
