import Link from 'next/link';
import { MapPin, Briefcase, BarChart3, BadgeCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Role } from '@/types/careers';

interface RoleCardProps {
    role: Role;
}

const PREVIEW_LIMIT = 3;

export function RoleCard({ role }: RoleCardProps) {
    const detailHref = `/careers/${role.slug}/`;

    const responsibilitiesPreview = role.responsibilities.slice(0, PREVIEW_LIMIT);
    const requirementsPreview = role.requirements.slice(0, PREVIEW_LIMIT);

    const metaItems = [
        { icon: MapPin, label: role.location },
        { icon: Briefcase, label: role.employmentType },
        { icon: BarChart3, label: role.compensation },
    ];

    return (
        <article className="rounded-2xl border border-card-border bg-card-bg shadow-[0_8px_32px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr]">
                {/* Left column */}
                <div className="p-8 lg:p-10 lg:border-r lg:border-card-border">
                    <span className="block text-base text-navy-light leading-none tracking-[0.04em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                        {role.department}
                    </span>
                    <h2
                        className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {role.title}
                    </h2>
                    <p
                        className="mt-4 text-[15px] text-text-secondary leading-relaxed"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        {role.summary}
                    </p>

                    {/* Meta row */}
                    <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
                        {metaItems.map((item) => (
                            <li
                                key={item.label}
                                className="inline-flex items-center gap-2 text-sm text-text-secondary"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                <item.icon
                                    className="w-4 h-4 text-primary shrink-0"
                                    aria-hidden="true"
                                />
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8">
                        <Button href={detailHref} variant="primary" size="md">
                            Apply for This Role
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Button>
                    </div>
                </div>

                {/* Right column */}
                <div className="p-8 lg:p-10 border-t border-card-border lg:border-t-0 space-y-7">
                    <RoleHighlightBlock
                        title="What you'll do"
                        items={responsibilitiesPreview}
                    />
                    <RoleHighlightBlock
                        title="What we're looking for"
                        items={requirementsPreview}
                    />
                    <Link
                        href={detailHref}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors no-underline"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        View all requirements
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

interface RoleHighlightBlockProps {
    title: string;
    items: string[];
}

function RoleHighlightBlock({ title, items }: RoleHighlightBlockProps) {
    return (
        <div>
            <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
                    <BadgeCheck className="w-4 h-4 text-primary" aria-hidden="true" />
                </span>
                <h3
                    className="text-base font-semibold text-text-primary"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {title}
                </h3>
            </div>
            <ul className="mt-3 ml-11 space-y-2">
                {items.map((item) => (
                    <li
                        key={item}
                        className="relative pl-4 text-sm text-text-secondary leading-relaxed before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-text-muted/60"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
