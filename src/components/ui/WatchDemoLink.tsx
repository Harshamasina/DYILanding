'use client';

import { Play } from 'lucide-react';
import { WatchDemoLauncher } from '@/components/ui/WatchDemoModal';

/**
 * Quiet, link-style watch-demo trigger (a small play chip + text). Use where a
 * full button would compete with a primary CTA, e.g. beside the contact form.
 * Wraps WatchDemoLauncher so it can be dropped into a Server Component (which
 * cannot pass the launcher's render-prop function itself).
 */
export function WatchDemoLink({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <WatchDemoLauncher>
            {(open) => (
                <button
                    type="button"
                    onClick={() => open()}
                    className={`group inline-flex items-center gap-2.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark cursor-pointer ${className}`}
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 transition-colors group-hover:bg-primary/15">
                        <Play className="w-3.5 h-3.5 ml-0.5 fill-primary text-primary" />
                    </span>
                    {children}
                </button>
            )}
        </WatchDemoLauncher>
    );
}
