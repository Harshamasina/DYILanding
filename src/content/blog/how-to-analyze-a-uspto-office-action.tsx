import Link from 'next/link';
import type { BlogPost } from './types';

function Content() {
    return (
        <>
            <p>
                Most office action responses that go wrong were lost before the first sentence of the
                remarks was written. A ground of rejection was misread, a dependent claim the examiner
                treated separately was argued as a group, or a pinpoint citation turned out not to say
                what the action said it did. Office action analysis is the step that catches those
                problems, and it is the step most often compressed when a USPTO deadline is close.
            </p>
            <p>
                This guide sets out a working method for analyzing a USPTO office action before drafting
                the response: reading the action as a set of separate issues, confirming the claims
                actually examined, charting every limitation against the examiner&apos;s citations, and
                choosing a strategy issue by issue. It is general information about US practice, not
                legal advice for any particular matter.
            </p>

            <h2>Read the Action as a Set of Separate Issues</h2>
            <p>
                An office action is several decisions bundled into one document. The Office Action
                Summary states the status of every claim (rejected, objected to, allowed, or withdrawn),
                whether the action is final, and the period for reply. The attachments matter too: the
                list of references cited by the examiner, and the information disclosure statements the
                examiner has initialed as considered.
            </p>
            <p>
                The detailed action is where the real work is. Treat each ground as its own issue: one
                statutory basis, one set of affected claims, one set of references, and one line of
                reasoning. A non-final rejection might carry an obviousness rejection over two
                references, an indefiniteness rejection of a single dependent claim, and an objection to
                a claim in improper dependent form. Those three issues have different remedies, and
                objections in particular are handled by petition rather than appeal, so collapsing them
                into one narrative is the first mistake to avoid.
            </p>
            <p>
                Two passages deserve special attention. In a subsequent action, the examiner&apos;s
                response to arguments shows exactly which of your earlier points failed and why. And a
                statement that a claim would be allowable if rewritten in independent form is leverage:
                it may be the fastest route to an allowed claim while the broader claims are argued.
            </p>

            <h2>Confirm the Claims the Examiner Actually Examined</h2>
            <p>
                The baseline for any response is the claim set of record, meaning the last entered
                version of every claim, not the version sitting in a drafting folder. Preliminary
                amendments, an after-final amendment that was never entered, or a claim renumbered on
                entry can all leave the working copy out of step with what the examiner read.
            </p>
            <p>
                Confirm the dependency structure at the same time. Multiple dependent claims, Markush
                groups, and claims that depend on a canceled claim all change how the rejection applies,
                and a structural error discovered after the chart is built forces the chart to be
                rebuilt. Parse problems are cheap to fix at the start of the analysis and expensive at
                the end of it.
            </p>

            <h2>Build an Issue Map</h2>
            <p>
                An issue map is a structured record of what the examiner decided, written before anyone
                decides what to do about it. For each ground of rejection or objection, capture:
            </p>
            <ul>
                <li><strong>The legal basis</strong> - the statute or rule relied on, such as 35 U.S.C. 102, 103, 112(a), 112(b), or 101, a double patenting rejection, or an objection under 37 CFR 1.75.</li>
                <li><strong>The affected claims</strong> - including any dependent claims the examiner addressed with separate reasoning, since those may stand or fall on their own.</li>
                <li><strong>The references and pinpoints</strong> - every paragraph, column, line, and figure the examiner cites, tied to the limitation it is cited for.</li>
                <li><strong>The examiner&apos;s rationale</strong> - for obviousness, which reference supplies which limitation and the stated reason to combine them.</li>
                <li><strong>What the action does not say</strong> - limitations the examiner never mapped, which become the most valuable entries on the map.</li>
            </ul>
            <p>
                The map turns a narrative document into a checklist the response must close. It also
                becomes the shared reference for everyone working the matter, so a second attorney can
                review the analysis without rereading the action from scratch.
            </p>

            <h2>Chart Every Limitation Against the Examiner&apos;s Citations</h2>
            <p>
                For each rejected independent claim, break the claim into its limitations and chart
                each one against each cited reference. Every cell should record the cited passage, what
                that passage actually discloses, and a reading: fully disclosed, partly disclosed, or not
                addressed by the examiner. This is the same discipline as an infringement or invalidity
                chart, applied to the examiner&apos;s position.
            </p>

            <h3>Check every pinpoint against the reference text</h3>
            <p>
                Pull each cited reference and read the cited passages in full. Examiners occasionally
                cite the wrong paragraph, mix publication and patent numbering, or rely on a passage that
                discloses less than the action says. Equally important, any quotation that goes into the
                remarks must match the source exactly, with its pinpoint. A misquoted reference weakens
                every argument built on it. Our guide to{' '}
                <Link href="/blog/free-prior-art-search-guide/">running a free prior art search</Link>{' '}
                covers pulling full text for cited patents and publications.
            </p>

            <h3>Treat not addressed as a finding about the action</h3>
            <p>
                An examiner must account for every claim limitation. If the rejection never maps a
                limitation, that is a gap in the examiner&apos;s case worth pointing out. It is not,
                however, proof that the reference lacks the feature. Read the reference before arguing
                absence, because an examiner who finds the feature in a passage the action did not cite
                will simply say so in the next action, and the argument will have spent credibility for
                nothing.
            </p>

            <h3>Test the reasoning behind an obviousness rejection</h3>
            <p>
                For a rejection under 35 U.S.C. 103, the Graham factors still frame the inquiry: the
                scope and content of the prior art, the differences between the art and the claims, the
                level of ordinary skill, and any objective indicia of nonobviousness. After KSR, the
                examiner does not need an explicit teaching to combine, but does need articulated
                reasoning with a rational underpinning. Look for a combination that would change a
                reference&apos;s principle of operation or render it unsatisfactory for its intended
                purpose, a reference that teaches away, and reasoning that only works with the claims in
                hand.
            </p>

            <h2>Choose a Strategy per Issue, Not per Action</h2>
            <p>
                With the map and chart in place, decide each issue on its own. The usual options are to
                traverse with argument, to amend, to amend and traverse, to cancel claims, to submit
                evidence such as a declaration under 37 CFR 1.132, or to request an interview first.
                Objections are usually resolved by amending to comply or by rewriting an allowable claim
                in independent form.
            </p>
            <p>
                Whatever the choice, the reply has to address every ground. Under 37 CFR 1.111(b), a
                reply must distinctly and specifically point out the supposed errors in the action and
                respond to every ground of objection and rejection. A general allegation that the claims
                are patentable does not satisfy that rule, and a reply that skips a ground can be treated
                as incomplete. The issue map is what makes that requirement easy to verify.
            </p>
            <p>
                Amendments deserve a deliberate decision rather than a reflex. A narrowing amendment made
                for patentability can limit the range of equivalents available later, so the cost of
                each amendment should be weighed against the strength of the argument it replaces. When
                amending does make sense, the formalities and support requirements are covered in our
                guide to{' '}
                <Link href="/blog/claim-amendments-37-cfr-1-121-guide/">claim amendments under 37 CFR 1.121</Link>.
            </p>
            <p>
                When the disagreement is really about how a reference should be read, an examiner
                interview is often faster than another round of written argument. Requests can be made
                through the USPTO&apos;s Automated Interview Request form, ideally with a short agenda
                and the proposed claim language sent ahead.
            </p>

            <h2>Sign Off on the Analysis Before Drafting Starts</h2>
            <p>
                An analysis that nobody has reviewed is a hypothesis. Before the response is drafted,
                an attorney should confirm the issue map and the chart, record any corrections and the
                reasons for them, and sign off. Drafting from a reviewed analysis means errors in the
                reading of the action are caught once, at the source, instead of being repeated in every
                section of the response.
            </p>
            <p>
                The analysis also feeds the docket. A final rejection, for example, opens a different
                set of paths and dates than a non-final one, which we cover in our guide to{' '}
                <Link href="/blog/after-final-rejection-options-uspto/">options after a final rejection</Link>,
                and every action starts the response chain described in our guide to{' '}
                <Link href="/blog/uspto-office-action-response-deadlines/">USPTO office action response deadlines</Link>.
            </p>

            <h2>How Design Your Invention Handles Office Action Analysis</h2>
            <p>
                Design Your Invention builds this method into its{' '}
                <Link href="/office-actions/">office action analysis and response workspace</Link>.
                Once an attorney confirms the documents, the platform reads the action into an issue
                map with the legal basis, affected claims, and cited references for each issue. Claims
                are parsed deterministically, including multiple dependent claims and Markush groups,
                and duplicate claims or structural dependency errors are raised as blockers until the
                parse is corrected.
            </p>
            <p>
                The claim chart records one reading per limitation, per reference, with a pinpoint on
                every cited passage, and every quotation is matched to the source text before it is
                stored. A limitation the examiner did not address is marked not addressed and is never
                presented as proof the reference lacks it. An authorized attorney signs the analysis
                after confirming their identity, and whoever last corrected the map cannot sign it. The
                response is then built on the signed analysis, and the matter&apos;s deadlines live in
                the same{' '}
                <Link href="/docketing/">patent docketing platform</Link>. The workspace is built for
                USPTO office actions today, with other jurisdictions planned.
            </p>
            <p>
                The response is only as good as the reading of the action underneath it. Map the issues,
                chart the claims, sign the analysis, then draft.
            </p>
        </>
    );
}

export const post: BlogPost = {
    slug: 'how-to-analyze-a-uspto-office-action',
    title: 'How to Analyze a USPTO Office Action Before You Draft the Response',
    shortTitle: 'Analyzing an Office Action',
    description:
        'A working method for USPTO office action analysis: map each ground as its own issue, confirm the examined claims, and chart every limitation against the cited art.',
    publishedAt: '2026-10-07',
    author: { name: 'Design Your Invention Team', role: 'IP Management Specialists' },
    category: 'Patent Prosecution',
    readingTime: '10 min read',
    keywords: [
        'office action analysis',
        'how to read a USPTO office action',
        'office action response strategy',
        'non-final rejection',
        'patent claim chart',
        '35 USC 103 rejection',
        'patent prosecution',
    ],
    content: Content,
};
