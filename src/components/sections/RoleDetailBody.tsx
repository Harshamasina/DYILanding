import { Fragment, type ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import type { DetailBlock, DetailSection, Role } from '@/types/careers';

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function highlightEmails(text: string): ReactNode {
    const matches = Array.from(text.matchAll(EMAIL_REGEX));
    if (matches.length === 0) return text;

    const parts: ReactNode[] = [];
    let cursor = 0;

    matches.forEach((match, i) => {
        const email = match[0];
        const start = match.index ?? 0;
        if (start > cursor) {
            parts.push(<Fragment key={`t-${i}`}>{text.slice(cursor, start)}</Fragment>);
        }
        parts.push(
            <a
                key={`e-${i}`}
                href={`mailto:${email}`}
                className="font-semibold text-primary hover:text-primary-dark transition-colors no-underline"
                style={{ fontFamily: 'var(--font-mono)' }}
            >
                {email}
            </a>,
        );
        cursor = start + email.length;
    });

    if (cursor < text.length) {
        parts.push(<Fragment key="t-end">{text.slice(cursor)}</Fragment>);
    }

    return <>{parts}</>;
}

interface RoleDetailBodyProps {
    role: Role;
}

export function RoleDetailBody({ role }: RoleDetailBodyProps) {
    return (
        <section className="py-14 sm:py-16 lg:py-20">
            <Container>
                <div className="max-w-3xl mx-auto">
                    {/* TLDR callout */}
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-7">
                        <p className="mb-3 text-base text-navy-light leading-none tracking-[0.1em] [font-family:var(--font-body)] [font-variant-caps:all-small-caps]">
                            TL;DR
                        </p>
                        <SplitParagraphs
                            text={role.detail.tldr}
                            className="text-[15px] text-text-primary leading-relaxed space-y-4"
                        />
                    </div>

                    {/* Sections */}
                    <div className="mt-12 space-y-12">
                        {role.detail.sections.map((section) => (
                            <DetailSectionView key={section.heading} section={section} />
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}

function DetailSectionView({ section }: { section: DetailSection }) {
    return (
        <div>
            <h2
                className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
            >
                {section.heading}
            </h2>
            {section.intro ? (
                <p
                    className="mt-3 text-[15px] text-text-secondary leading-relaxed"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {highlightEmails(section.intro)}
                </p>
            ) : null}
            <div className="mt-5 space-y-6">
                {section.blocks.map((block, i) => (
                    <BlockView key={i} block={block} />
                ))}
            </div>
        </div>
    );
}

function BlockView({ block }: { block: DetailBlock }) {
    switch (block.kind) {
        case 'paragraph':
            return (
                <p
                    className="text-[15px] text-text-secondary leading-relaxed"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {highlightEmails(block.text)}
                </p>
            );

        case 'bullets':
            return (
                <ul className="space-y-2.5 pl-5 list-disc marker:text-primary/60">
                    {block.items.map((item, i) => (
                        <li
                            key={i}
                            className="text-[15px] text-text-secondary leading-relaxed pl-1"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            );

        case 'group':
            return (
                <div>
                    <h3
                        className="text-base font-semibold text-text-primary"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        {block.title}
                    </h3>
                    <ul className="mt-3 space-y-2.5 pl-5 list-disc marker:text-primary/60">
                        {block.bullets.map((item, i) => (
                            <li
                                key={i}
                                className="text-[15px] text-text-secondary leading-relaxed pl-1"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            );

        case 'steps':
            return (
                <ol className="space-y-5">
                    {block.items.map((step, i) => (
                        <li key={i} className="flex gap-4">
                            <span
                                className="w-8 shrink-0 pt-0.5 text-lg font-semibold leading-none tabular-nums text-primary [font-family:var(--font-display)]"
                                aria-hidden="true"
                            >
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <div className="pt-0.5">
                                <h3
                                    className="text-base font-semibold text-text-primary"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    className="mt-1.5 text-[15px] text-text-secondary leading-relaxed"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    {step.body}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            );
    }
}

function SplitParagraphs({ text, className }: { text: string; className: string }) {
    const paragraphs = text.split(/\n\n+/);
    return (
        <div className={className} style={{ fontFamily: 'var(--font-body)' }}>
            {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
            ))}
        </div>
    );
}
