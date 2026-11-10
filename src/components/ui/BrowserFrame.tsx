import Image from 'next/image';
import { MockupRecordLabel } from './BrowserMockupChrome';

interface BrowserFrameProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    url?: string;
    /** Record reference and screen name for the title bar. */
    record?: string;
    screen?: string;
    className?: string;
    priority?: boolean;
}

export function BrowserFrame({
    src,
    alt,
    width,
    height,
    url = 'app.designyourinvention.com',
    record = 'DEMO-2024-011',
    screen = 'Docket',
    className = '',
    priority = false,
}: BrowserFrameProps) {
    return (
        <div className={`relative ${className}`}>
            {/* Browser Window */}
            <div className="rounded-xl border border-card-border bg-white shadow-2xl shadow-black/10 overflow-hidden">
                {/* Chrome Bar */}
                <div className="flex items-center gap-3 px-4 py-3 bg-page-bg-alt border-b border-card-border">
                    {/* Record reference, as the app heads its pages */}
                    <MockupRecordLabel record={record} screen={screen} />

                    {/* URL Bar */}
                    <div className="flex-1 min-w-0 flex justify-end">
                        <div className="flex items-center gap-2 px-4 py-1 bg-white rounded-md text-xs text-text-muted border border-card-border max-w-xs w-full justify-center">
                            <svg
                                className="w-3 h-3 text-success flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <span className="truncate [font-family:var(--font-mono)]">
                                {url}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Screenshot */}
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className="w-full h-auto"
                    priority={priority}
                />
            </div>

            {/* Bottom gradient fade, shorter on mobile so the image stays visible */}
            <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 lg:h-48 bg-gradient-to-t from-page-bg to-transparent pointer-events-none rounded-b-xl" />
        </div>
    );
}
