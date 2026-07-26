import {
    Upload,
    Eye,
    CheckCircle2,
    ArrowDown,
    ArrowRight,
    Play,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { ImportConnectors } from '@/components/ui/ImportConnectors';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { WatchDemoButton } from '@/components/ui/WatchDemoModal';

const STEPS = [
    {
        number: '01',
        icon: Upload,
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
        icon: Eye,
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
        icon: CheckCircle2,
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
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, var(--primary) 1px, transparent 0)',
                backgroundSize: '32px 32px',
            }} />

            <Container className="relative">
                {/* Section Header */}
                <div id="tree-import" className="flex items-center gap-3 mb-6">
                    <span
                        className="text-xs font-bold uppercase tracking-[0.15em] text-primary"
                        style={{ fontFamily: 'var(--font-mono)' }}
                    >
                        Portfolio Import
                    </span>
                </div>

                <FadeIn treeNode="tree-import">
                    <div className="max-w-3xl mb-12 lg:mb-16">
                        <h2
                            className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Migrate your entire portfolio in{' '}
                            <span className="text-primary">hours, not months</span>
                        </h2>
                        <p
                            className="mt-4 text-lg text-text-secondary leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            Upload your existing spreadsheet, preview exactly what will change,
                            and confirm with one click. Validate every row before anything
                            reaches your records, with no manual re-keying or reformatting.
                        </p>
                    </div>
                </FadeIn>

                {/* 3-Step Flow */}
                <div className="grid gap-0 lg:grid-cols-3 lg:gap-0 relative">
                    {/* Desktop connector lines */}
                    <ImportConnectors />

                    {STEPS.map((step, i) => (
                        <FadeIn
                            key={step.number}
                            treeNode="tree-import"
                            delay={i * 0.15}
                            className="lg:h-full"
                        >
                            <div className="relative z-10 group lg:h-full">
                                {/* Mobile connector */}
                                {i > 0 && (
                                    <div className="flex flex-col items-center py-2 lg:hidden">
                                        <div className="w-px h-4 bg-linear-to-b from-primary/30 to-primary/15" />
                                        <ArrowDown className="w-4 h-4 text-primary/30 -mt-0.5" />
                                    </div>
                                )}

                                <div className={`rounded-2xl border border-card-border bg-card-bg p-6 sm:p-8 h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 ${i > 0 ? 'lg:ml-4' : ''} ${i < STEPS.length - 1 ? 'lg:mr-4' : ''}`}>
                                    {/* Step number + icon */}
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="relative">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(99,102,241,0.08)] flex items-center justify-center group-hover:border-indigo-200/80 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_8px_rgba(99,102,241,0.14)] transition-all">
                                                <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                            </div>
                                            <span
                                                className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-white text-[10px] sm:text-xs font-bold flex items-center justify-center"
                                                style={{ fontFamily: 'var(--font-mono)' }}
                                            >
                                                {step.number}
                                            </span>
                                        </div>
                                        <div>
                                            <h3
                                                className="text-lg sm:text-xl font-bold text-text-primary"
                                                style={{ fontFamily: 'var(--font-display)' }}
                                            >
                                                {step.title}
                                            </h3>
                                            <p
                                                className="text-sm text-text-secondary"
                                                style={{ fontFamily: 'var(--font-body)' }}
                                            >
                                                {step.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <ul className="space-y-2.5">
                                        {step.details.map((detail) => (
                                            <li key={detail} className="flex gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                <span
                                                    className="text-[13px] text-text-secondary leading-relaxed"
                                                    style={{ fontFamily: 'var(--font-body)' }}
                                                >
                                                    {detail}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* Mid-page CTA — high-intent moment after seeing the import flow */}
                <FadeIn treeNode="tree-import" delay={0.15}>
                    <div className="mt-12 lg:mt-16 flex flex-col items-center gap-5 sm:gap-6 text-center">
                        <h3
                            className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-text-primary"
                            style={{ fontFamily: 'var(--font-display)' }}
                        >
                            Ready to migrate your patent portfolio?
                        </h3>
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                            <BookDemoButton size="md">
                                Book a Demo
                                <ArrowRight className="w-4 h-4" />
                            </BookDemoButton>
                        </div>
                    </div>
                </FadeIn>
            </Container>
        </section>
    );
}
