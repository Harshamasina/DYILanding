import { SubsectionNumber } from '@/components/ui/SubsectionNumber';

interface IndexCardProps {
    title: string;
    description: string;
    /** Indigo, or amber for the compliance beats. */
    tone?: 'primary' | 'compliance';
    /** On a navy section. */
    dark?: boolean;
}

/* A card filed like a folder in a patent file wrapper: its subsection number
   sits on an index tab above the top-left edge, so a row of three reads as
   tabbed folders rather than three identical tiles. The tab overlaps the
   card's top border by one pixel and shares its fill, so the two read as one
   piece. The whole folder lifts on hover. */
export function IndexCard({ title, description, tone = 'primary', dark = false }: IndexCardProps) {
    const fill = dark ? 'bg-[#101d34]' : 'bg-card-bg';
    const edge = dark ? 'border-white/12 group-hover:border-primary-light/35' : 'border-card-border group-hover:border-primary/25';
    return (
        <article className="group relative h-full pt-[calc(1.75rem-1px)] transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <span className={`absolute top-0 left-5 z-10 flex h-7 items-center rounded-t-md border border-b-0 px-3 transition-colors duration-300 ${fill} ${edge}`}>
                <SubsectionNumber tone={tone} dark={dark} size="sm" className="text-sm" />
            </span>
            <div className={`relative flex h-full flex-col rounded-xl rounded-tl-md border p-6 transition-colors duration-300 ${fill} ${edge} ${dark ? '' : 'shadow-sm group-hover:shadow-md group-hover:shadow-primary/[0.04]'}`}>
                <h3 className={`text-lg font-semibold transition-colors duration-300 [font-family:var(--font-display)] ${dark ? 'text-white group-hover:text-primary-light' : 'text-text-primary group-hover:text-primary'}`}>
                    {title}
                </h3>
                <p className={`mt-2 text-sm leading-relaxed [font-family:var(--font-body)] ${dark ? 'text-text-on-dark/80' : 'text-text-secondary'}`}>
                    {description}
                </p>
            </div>
        </article>
    );
}
