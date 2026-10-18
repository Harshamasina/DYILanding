import { ArrowRight, ClipboardList, FileSearch, Fingerprint, LockKeyhole, PenLine, Quote, ShieldCheck, UserCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { MockupHalo } from '@/components/ui/MockupHalo';
import { AnimatedOfficeActionFlow } from '@/components/ui/AnimatedOfficeActionFlow';
import { DeferredMount } from '@/components/motion/DeferredMount';
import { FadeIn } from '@/components/motion/FadeIn';
import { OFFICE_ACTIONS_PAGE_URL } from '@/lib/constants';

/* Same layout as the AI drafting section above it: heading, mockup beside a
   card list with badges, then a trust strip and CTAs. The mockup sits on the
   left on desktop so the feature sections alternate. Claims follow the office
   actions page fact-check: USPTO only today, EP planned, drafting aids gated. */

const OA_CARDS: { icon: React.ElementType; title: string; description: string }[] = [
    {
        icon: FileSearch,
        title: 'One-Click Issue Map',
        description: 'Grounds of rejection, affected claims, and cited references are read from the action once an attorney confirms the documents.',
    },
    {
        icon: Quote,
        title: 'Source-Checked Claim Charts',
        description: 'Every limitation is charted against its cited passages, and each quotation is matched to the source text before it is stored.',
    },
    {
        icon: PenLine,
        title: 'Supported Claim Amendments',
        description: 'Choose a strategy for every issue, amend the claim listing, and link inserted words to the application as filed.',
    },
    {
        icon: Fingerprint,
        title: 'Attorney Sign-Off and Approval',
        description: 'An attorney signs the analysis, and the response is approved by an attorney who did not last revise it, then locked.',
    },
];

const OFFICES: { code: string; label: string; color: string; planned?: boolean }[] = [
    { code: 'US', label: 'USPTO', color: 'text-danger' },
    { code: '1.111', label: 'Non-final reply', color: 'text-primary' },
    { code: '1.116', label: 'After-final amendment', color: 'text-compliance' },
    { code: 'EP', label: 'EPO', color: 'text-primary', planned: true },
];

const TRUST_ITEMS = [
    { icon: ShieldCheck, label: 'Signed Analysis' },
    { icon: UserCheck, label: 'Two-Attorney Approval' },
    { icon: LockKeyhole, label: 'Locked Approved Content' },
    { icon: ClipboardList, label: 'Complete Audit Trail' },
];

export function OfficeActionSection() {
    return (
        <section id="office-actions" aria-label="Office Action Analysis and Response" className="relative overflow-hidden py-24 lg:py-32">
            <Container>
                {/* ── Section Heading ── */}
                <div id="tree-office-actions" className="mb-6 flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary [font-family:var(--font-mono)]">Office Actions</span>
                </div>
                <FadeIn treeNode="tree-office-actions">
                    <div className="mb-16 max-w-3xl lg:mb-20">
                        <h2 className="text-3xl font-bold tracking-tight text-text-primary [font-family:var(--font-display)] sm:text-4xl lg:text-5xl">
                            Office Action Analysis and <span className="italic">Response Drafting</span>
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                            Map every rejection in a USPTO office action to the claims, limitations, and cited passages behind it, then build the response on the signed analysis. Quotations are checked against the source text, amendments are linked to support in the application as filed, and the response is approved by an attorney before it is exported for filing.
                        </p>
                    </div>
                </FadeIn>

                {/* ── Copy first on mobile, mockup left on desktop ── */}
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    <FadeIn delay={0.2} className="lg:order-2">
                        <OfficeActionContent />
                    </FadeIn>
                    <FadeIn delay={0.1} className="lg:order-1">
                        <DeferredMount className="h-[440px] w-full sm:h-[480px] lg:h-[520px]">
                            <MockupHalo>
                                <AnimatedOfficeActionFlow />
                            </MockupHalo>
                        </DeferredMount>
                    </FadeIn>
                </div>

                {/* ── Trust Strip ── */}
                <FadeIn delay={0.1}>
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-3 lg:mt-24 lg:gap-4">
                        {TRUST_ITEMS.map(item => (
                            <div key={item.label} className="flex items-center gap-2.5 rounded-lg border border-primary/15 bg-primary/3 px-5 py-3 sm:px-6 sm:py-3.5">
                                <item.icon className="h-4.5 w-4.5 shrink-0 text-primary sm:h-5 sm:w-5" strokeWidth={1.75} aria-hidden="true" />
                                <span className="text-xs font-semibold text-text-primary [font-family:var(--font-mono)] sm:text-sm">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                {/* ── CTA ── */}
                <FadeIn delay={0.15}>
                    <div className="mx-auto mt-10 flex w-full max-w-md flex-col justify-center gap-4 sm:max-w-none sm:flex-row">
                        <BookDemoButton size="md" className="w-full justify-center sm:w-auto">
                            Book an Office Action Demo
                            <ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </BookDemoButton>
                        <Button href={OFFICE_ACTIONS_PAGE_URL} variant="outline" size="md" className="group/cta w-full justify-center sm:w-auto">
                            View Office Action Features
                            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover/cta:translate-x-0.5" aria-hidden="true" />
                        </Button>
                    </div>
                </FadeIn>
            </Container>
        </section>
    );
}

/* Card markup matches AiCard in the AI drafting section. */
function OaCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
    return (
        <article className="group flex items-start gap-4 rounded-xl border border-transparent p-4 transition-all duration-200 hover:border-card-border hover:bg-card-bg hover:shadow-md hover:shadow-black/[0.03]">
            <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(99,102,241,0.08)] backdrop-blur-sm">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
                <h3 className="text-[15px] font-semibold leading-snug text-text-primary [font-family:var(--font-display)]">{title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-text-secondary [font-family:var(--font-body)]">{description}</p>
            </div>
        </article>
    );
}

function OfficeActionContent() {
    return (
        <div>
            <h3 className="mb-4 text-2xl font-bold text-text-primary [font-family:var(--font-display)] sm:text-3xl">
                From Examiner Rejection to an Attorney-Approved Response
            </h3>
            <div className="mb-6 flex flex-col gap-1">
                {OA_CARDS.map(card => <OaCard key={card.title} {...card} />)}
            </div>

            {/* Office and reply badges, styled like the jurisdiction badges */}
            <div className="flex flex-wrap gap-2">
                {OFFICES.map(o => (
                    <div key={o.code} className="flex items-center gap-1.5 rounded-lg border border-card-border bg-card-bg px-3 py-1.5">
                        <span className={`text-xs font-bold [font-family:var(--font-mono)] ${o.color}`}>{o.code}</span>
                        <span className="text-xs text-text-secondary [font-family:var(--font-body)]">{o.label}</span>
                        {o.planned && (
                            <span className="rounded bg-text-muted/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted [font-family:var(--font-mono)]">Planned</span>
                        )}
                    </div>
                ))}
            </div>
            <p className="mt-3 text-xs text-text-muted [font-family:var(--font-body)]">
                Built for USPTO office actions today, with EP planned next. AI drafting aids depend on capability availability and workspace policy.
            </p>
        </div>
    );
}
