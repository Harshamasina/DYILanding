import { Container } from '@/components/ui/Container';
import { SectionMark } from '@/components/ui/SectionMark';
import { RuledList, RuledItem } from '@/components/ui/RuledList';
import { HexCubeIllustration } from '@/components/illustrations/HexCubeIllustration';
import type { HeroCopy } from '@/types/careers';

interface CareersHeroProps {
    hero: HeroCopy;
}

export function CareersHero({ hero }: CareersHeroProps) {
    return (
        <section className="pt-28 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left column - copy */}
                    <div>
                        <SectionMark numbered={false}>{hero.eyebrow}</SectionMark>
                        <h1
                            className="mt-5 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            {hero.title}
                        </h1>
                        <p
                            className="mt-5 max-w-xl text-base text-text-secondary leading-relaxed sm:text-lg"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {hero.description}
                        </p>
                        <RuledList label="The team" className="mt-8">
                            {hero.tags.map((tag) => (
                                <RuledItem key={tag}>{tag}</RuledItem>
                            ))}
                        </RuledList>
                    </div>

                    {/* Right column - illustration (hidden on small screens) */}
                    <div className="hidden lg:block">
                        <HexCubeIllustration className="max-w-xl ml-auto" />
                    </div>
                </div>
            </Container>
        </section>
    );
}
