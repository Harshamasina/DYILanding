import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { ImportConnectors } from '@/components/ui/ImportConnectors';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { SectionMark } from '@/components/ui/SectionMark';
import { SubsectionNumber } from '@/components/ui/SubsectionNumber';

const STEPS = [
    {
        number: '01',
        title: 'Upload',
        subtitle: 'Drop your file',
        details: [
            'Download our template or use your spreadsheet',
            'Supports XLSX and CSV formats',
            'Import up to 5,000 filings per file',
        ],
    },
    {
        number: '02',
        title: 'Preview',
        subtitle: 'See what changes',
        details: [
            'Validate every row before import',
            'See new families, provisionals, PCTs, and national entries',
            'Flag duplicates and errors automatically',
        ],
    },
    {
        number: '03',
        title: 'Confirm',
        subtitle: 'One click. Done.',
        details: [
            'Create records in one atomic transaction',
            'Log every import in the audit trail',
            'Roll back safely if validation fails',
        ],
    },
];

export function ImportSection() {
    return (
        <section id="import" className="pt-8 pb-24 lg:pt-12 lg:pb-32 bg-page-bg relative overflow-hidden">
            {/* Subtle background pattern */}
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--primary)_1px,transparent_0)] bg-size-[32px_32px] opacity-[0.02]" />

            <Container className="relative">
                {/* Section Header */}
                <SectionMark id="tree-import" className="mb-6">
                    Portfolio Import
                </SectionMark>

                <FadeIn treeNode="tree-import">
                    <div className="max-w-3xl mb-12 lg:mb-16">
                        <h2
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Migrate your entire portfolio in{' '}
                            <span className="italic">hours, not months</span>
                        </h2>
                        <p
                            className="mt-4 max-w-[40rem] text-lg text-text-secondary leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Upload your existing spreadsheet, preview exactly what will change,
                            and confirm with one click. Validate every row before anything
                            reaches your records, with no manual re-keying or reformatting.
                        </p>
                    </div>
                </FadeIn>

                {/* The three steps on one ruled line, numbered 3.1 to 3.3 under
                    the section mark. Vertical on phones. */}
                <ol className="relative grid gap-10 lg:grid-cols-3 lg:gap-0">
                    <ImportConnectors />

                    {STEPS.map((step, i) => (
                        <li key={step.number} className="relative pl-9 lg:pt-10 lg:pr-10 lg:pl-0">
                            <span
                                aria-hidden="true"
                                className="absolute top-1.5 left-0 h-2.5 w-2.5 rotate-45 border border-primary bg-page-bg lg:top-0 lg:-translate-y-1/2"
                            />
                            <FadeIn treeNode="tree-import" delay={i * 0.15}>
                                <div className="flex items-baseline gap-3">
                                    <SubsectionNumber />
                                    <h3 className="text-xl font-bold text-text-primary sm:text-2xl [font-family:var(--font-display)]">
                                        {step.title}
                                    </h3>
                                </div>
                                <p className="mt-2 text-sm italic text-text-secondary [font-family:var(--font-body)]">
                                    {step.subtitle}
                                </p>
                                <ul className="mt-5 border-t border-card-border">
                                    {step.details.map((detail) => (
                                        <li
                                            key={detail}
                                            className="border-b border-card-border py-2.5 text-[13px] leading-relaxed text-text-secondary [font-family:var(--font-body)]"
                                        >
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </FadeIn>
                        </li>
                    ))}
                </ol>

                {/* Mid-page call to action after the import flow: one line and a link. */}
                <FadeIn treeNode="tree-import" delay={0.15}>
                    <p className="mt-12 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-lg text-text-primary lg:mt-16 [font-family:var(--font-display)]">
                        <span>Ready to migrate your patent portfolio?</span>
                        <BookDemoButton topic="portfolio import" variant="link" size="md" className="-my-2.5 py-2.5!">
                            Book a Demo
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </BookDemoButton>
                    </p>
                </FadeIn>
            </Container>
        </section>
    );
}
