'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, FileText, Fingerprint, Link2, LockKeyhole } from 'lucide-react';

export type OfficeActionScene = 'issues' | 'evidence' | 'signed' | 'strategy' | 'amendment' | 'approval' | 'export';

/** Focused excerpts of the same fictional matter, sized for phones and the homepage. */
export function OfficeActionFocusScene({ scene, resolved, reducedMotion }: { scene: OfficeActionScene; resolved: boolean; reducedMotion: boolean }) {
    return (
        <div className="flex flex-1 flex-col bg-[#f4f5f7] p-3 sm:p-4">
            <div className="mb-3 flex items-center gap-3 rounded-lg border border-card-border bg-white p-3">
                <FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div><p className="text-sm font-semibold text-text-primary">Adaptive sensor system</p><p className="mt-0.5 text-xs text-text-secondary">OA-DEMO-118 · Non-final rejection</p></div>
            </div>
            <AnimatePresence mode="wait" initial={false}>
                <motion.div key={scene} initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reducedMotion ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.25 }} className="flex flex-1 flex-col rounded-lg border border-card-border bg-white p-4 sm:p-5">
                    {scene === 'issues' && <>
                        <SceneTitle label="Analysis" title="Three issues. One reviewable record." />
                        <div className="mt-4 divide-y divide-card-border">
                            {[['Obviousness', '§ 103 · Claims 1-3', 'Smith and Jones'], ['Indefiniteness', '§ 112(b) · Claim 4', 'Antecedent basis'], ['Claim objection', 'Claim 5', 'Dependent form']].map(([title, basis, note], i) => <motion.div key={title} initial={{ opacity: reducedMotion ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ delay: reducedMotion ? 0 : i * 0.25 }} className="py-3 first:pt-0"><p className="text-sm font-semibold text-text-primary">{title}</p><p className="mt-1 text-xs leading-relaxed text-text-secondary">{basis} · {note}</p></motion.div>)}
                        </div>
                        <SceneNote>Examiner issues are organized for attorney review.</SceneNote>
                    </>}
                    {scene === 'evidence' && <>
                        <SceneTitle label="Claim 1 · Limitation [1b]" title="Read the claim beside its source." />
                        <p className="mt-4 text-sm leading-relaxed text-text-primary">A controller configured to adjust a sampling interval <strong>periodically.</strong></p>
                        <div className={`mt-4 rounded-lg border-l-2 p-3 ${resolved ? 'border-primary bg-primary/5' : 'border-card-border bg-page-bg-alt'}`}>
                            <p className="text-xs font-semibold text-primary">Smith · ¶ [0031]</p>
                            <blockquote className="mt-2 text-sm leading-relaxed text-text-primary">“The processing unit adjusts the sampling interval periodically.”</blockquote>
                        </div>
                        <SceneNote icon={<Link2 className="h-4 w-4 shrink-0" />}>{resolved ? 'Quotation matched. Counsel evaluates the examiner’s reading.' : 'Checking the quotation against the cited passage.'}</SceneNote>
                    </>}
                    {scene === 'signed' && <>
                        <SceneTitle label="Analysis sign-off" title="Reviewed before response drafting." />
                        <div className="mt-5 rounded-lg border border-card-border p-4"><p className="text-sm font-semibold text-text-primary">Attorney review recorded</p><p className="mt-2 text-sm leading-relaxed text-text-secondary">“Checked each chart against the cited passages.”</p><p className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary"><Fingerprint className="h-4 w-4" />M. Chen · Analysis signatory</p></div>
                        <SceneNote>The signed analysis becomes the response’s source record.</SceneNote>
                    </>}
                    {scene === 'strategy' && <>
                        <SceneTitle label="Response strategy" title="Counsel selects the approach." />
                        <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4"><p className="text-xs text-text-secondary">Obviousness · Claims 1-3</p><p className="mt-2 text-base font-semibold text-primary">Amend and traverse</p><p className="mt-3 text-sm leading-relaxed text-text-primary">Prepare a Claim 1 amendment and remarks addressing Smith and Jones.</p></div>
                        <SceneNote>Each issue carries its selected strategy and recorded reasoning.</SceneNote>
                    </>}
                    {scene === 'amendment' && <>
                        <SceneTitle label="1. (Currently amended)" title="An amendment with cited support." />
                        <p className="mt-4 text-sm leading-relaxed text-text-primary">A controller configured to adjust a sampling interval <del className="text-text-secondary">periodically</del>{' '}<ins className="bg-primary/10 text-primary underline-offset-4">in response to a detected change in temperature</ins>.</p>
                        <div className={`mt-4 rounded-lg border p-3 ${resolved ? 'border-primary/25 bg-primary/5' : 'border-card-border bg-page-bg-alt'}`}><p className="text-xs font-semibold text-primary">Application as filed · ¶ [0032]</p><p className="mt-2 text-sm leading-relaxed text-text-primary">“The controller varies the sampling interval when the temperature changes.”</p></div>
                        <SceneNote>{resolved ? 'Support linked for attorney confirmation and acceptance.' : 'Inserted words require disclosure support.'}</SceneNote>
                    </>}
                    {(scene === 'approval' || scene === 'export') && <>
                        <SceneTitle label={scene === 'export' ? 'Filing copy' : 'Attorney approval'} title={scene === 'export' ? 'Approved copy. Ready for attorney filing.' : resolved ? 'Approved content is locked.' : 'A separate attorney reviews the response.'} />
                        <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-card-border py-3"><div><dt className="text-xs text-text-secondary">Last revised by</dt><dd className="mt-1 text-sm font-semibold">M. Chen</dd></div><div><dt className="text-xs text-text-secondary">Reviewing attorney</dt><dd className="mt-1 text-sm font-semibold">R. Patel</dd></div></dl>
                        <ul className="mt-4 space-y-2">{['Signed analysis retained', 'Claim amendments linked to support', resolved || scene === 'export' ? 'Approval recorded and content locked' : 'Response checks ready for review'].map(text => <li key={text} className="flex items-start gap-2 text-xs leading-relaxed text-text-primary"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{text}</li>)}</ul>
                        <SceneNote icon={<LockKeyhole className="h-4 w-4 shrink-0" />}>{scene === 'export' ? 'Word filing copy exported. The attorney files separately with the USPTO.' : resolved ? 'Signed by R. Patel · Approval applies to this draft.' : 'The approving attorney must not be the last reviser.'}</SceneNote>
                    </>}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function SceneTitle({ label, title }: { label: string; title: string }) {
    /* A paragraph, not a heading: the mockup sits between page headings and must not break their order. */
    return <div><p className="text-xs font-medium text-primary">{label}</p><p className="mt-2 text-lg font-semibold leading-snug text-text-primary">{title}</p></div>;
}
function SceneNote({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
    return <p className="mt-auto flex items-start gap-2 border-t border-card-border pt-3 text-xs leading-relaxed text-text-secondary"><span className="mt-0.5 text-primary">{icon ?? <Check className="h-4 w-4 shrink-0" />}</span>{children}</p>;
}
