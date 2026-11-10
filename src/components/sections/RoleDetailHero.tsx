import Link from 'next/link';
import { MapPin, Briefcase, BarChart3, ArrowRight, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import type { Role } from '@/types/careers';
import { SectionMark } from '@/components/ui/SectionMark';

interface RoleDetailHeroProps {
    role: Role;
}

export function RoleDetailHero({ role }: RoleDetailHeroProps) {
    const mailto = `mailto:${role.applyEmail}?subject=${encodeURIComponent(role.applySubject)}`;

    const metaItems = [
        { icon: MapPin, label: role.location },
        { icon: Briefcase, label: role.employmentType },
        { icon: BarChart3, label: role.compensation },
    ];

    return (
        <section className="pt-28 pb-10 sm:pt-32 sm:pb-12 lg:pt-40 lg:pb-16 border-b border-card-border">
            <Container>
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-1.5 text-sm text-text-secondary mb-6"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    <Link
                        href="/careers/"
                        className="hover:text-primary transition-colors no-underline"
                    >
                        Careers
                    </Link>
                    <ChevronRight className="w-4 h-4 text-text-muted" aria-hidden="true" />
                    <span className="text-text-primary">{role.title}</span>
                </nav>

                <div className="max-w-3xl">
                    <SectionMark numbered={false}>{role.department}</SectionMark>
                    <h1
                        className="mt-5 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {role.title}
                    </h1>
                    <p
                        className="mt-5 text-lg text-text-secondary leading-relaxed"
                        style={{ fontFamily: 'var(--font-body)' }}
                    >
                        {role.summary}
                    </p>

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
                        <Button href={mailto} variant="primary" size="md">
                            Apply for This Role
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}
