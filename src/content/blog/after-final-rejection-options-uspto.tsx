import Link from 'next/link';
import type { BlogPost } from './types';

function Content() {
    return (
        <>
            <p>
                A final rejection changes the question from &quot;what should we argue?&quot; to
                &quot;which path should this application take?&quot; For years, many practitioners
                answered with the After Final Consideration Pilot 2.0, which gave examiners extra time to
                consider a modest after-final amendment at no fee. The USPTO ended that program, and the
                last requests were accepted on December 14, 2024. The remaining paths are older, more
                formal, and each one starts its own chain of deadlines.
            </p>
            <p>
                This guide compares the options after a USPTO final rejection, an amendment under 37 CFR
                1.116, an examiner interview, a notice of appeal with or without pre-appeal review, and a
                request for continued examination, and sets out what each path means for the docket. It
                is general information about US practice, not legal advice for any particular matter.
            </p>

            <h2>What &quot;Final&quot; Actually Closes</h2>
            <p>
                A final rejection closes prosecution on the merits. The applicant can still reply, but a
                reply to a final action that does not place the application in condition for allowance
                does not stop the clock. The period for reply keeps running, typically three months from
                the action, extendable under 37 CFR 1.136(a) up to the six-month statutory limit, until
                the applicant files a notice of appeal, files a request for continued examination, or
                receives an allowance.
            </p>
            <p>
                The examiner&apos;s advisory action, which answers an after-final reply, does not restart
                that period. Its timing does matter for extension fees: if the reply was filed within two
                months of the final action, extension fees are computed from the advisory action&apos;s
                mail date rather than from the original period. That rule, and the rest of the response
                chain, is covered in our guide to{' '}
                <Link href="/blog/uspto-office-action-response-deadlines/">USPTO office action response deadlines</Link>.
            </p>

            <h2>Option 1: An Amendment Under 37 CFR 1.116</h2>
            <p>
                After a final rejection, amendments are entered at the examiner&apos;s discretion and
                only within limits. Under 37 CFR 1.116, an amendment may be admitted if it cancels claims,
                complies with a requirement of form expressly set out in a previous action, or presents
                rejected claims in better form for consideration on appeal. An amendment that touches the
                merits in any other way needs a showing of good and sufficient reasons why it is
                necessary and was not presented earlier.
            </p>
            <p>
                In practice, the after-final amendments most likely to be entered are the simple ones:
                canceling rejected claims, rewriting a dependent claim the examiner indicated was
                allowable into independent form, or fixing a formal objection. An amendment that adds a
                new limitation requiring further search will often be refused, and without AFCP 2.0 there
                is no dedicated program that gives the examiner extra time to search it.
            </p>

            <h2>Option 2: An Examiner Interview</h2>
            <p>
                Interviews after a final rejection are at the examiner&apos;s discretion, but an interview
                that may advance the application toward allowance or narrow the issues for appeal is
                commonly granted. Requests can be made through the USPTO&apos;s Automated Interview
                Request form. A short agenda and proposed claim language sent ahead make the time
                productive, and the interview often tells you which of the remaining paths is realistic.
            </p>
            <p>
                An interview does not extend or toll the period for reply. It is a way to choose a path,
                not a path of its own, so it should be scheduled well inside the window that still allows
                a reply, an appeal, or an RCE to be filed in time.
            </p>

            <h2>Option 3: A Notice of Appeal, With or Without Pre-Appeal Review</h2>
            <p>
                A notice of appeal under 37 CFR 41.31 is filed within the period for reply to the final
                action, with extensions available under 37 CFR 1.136(a). The appeal brief is then due two
                months from the filing of the notice under 37 CFR 41.37, and that period can itself be
                extended under 37 CFR 1.136(a).
            </p>
            <p>
                The pre-appeal brief request for review remains available. It is filed together with the
                notice of appeal, is limited to five pages of argument, and asks a review panel to
                review whether the rejection has a clear error or lacks an essential element of a prima
                facie case. It is not a vehicle for amendments. The panel can send the appeal forward,
                reopen prosecution, or allow the application. If the appeal proceeds, the time for the
                brief is reset to one month from the panel&apos;s decision or the balance of the original
                two-month period, whichever is longer.
            </p>
            <p>
                Appeal suits disputes about how the art or the claims should be read, where another round
                of argument before the same examiner is unlikely to change the outcome. A successful appeal
                can also earn patent term adjustment for the time spent in appellate review.
            </p>

            <h2>Option 4: A Request for Continued Examination</h2>
            <p>
                A request for continued examination under 37 CFR 1.114 requires a submission, such as an
                amendment, arguments, or new evidence, plus the RCE fee. It withdraws the finality of the
                rejection and reopens prosecution, so the submission is considered on the merits. Fees
                increase for a second and later RCE.
            </p>
            <p>
                The RCE is often the default choice, and sometimes it is the right one: it is the only
                after-final path that guarantees full consideration of a substantive amendment or new
                evidence. It carries a patent term cost, however. Time spent in continued examination is
                excluded from the three-year pendency guarantee in the patent term adjustment
                calculation, so an RCE can reduce the term a granted patent would otherwise earn.
            </p>

            <h2>Docketing Each Path</h2>
            <p>
                Each path generates its own dates, and a final rejection should be docketed with all of
                them visible so the choice of path is made with the calendar in view:
            </p>
            <ul>
                <li><strong>The final action chain</strong> - the period for reply, the two-month date that preserves favorable advisory action timing, the extension ladder, and the six-month statutory limit.</li>
                <li><strong>The appeal chain</strong> - the notice of appeal date, the appeal brief due two months later, and, after the examiner&apos;s answer, the reply brief period.</li>
                <li><strong>The pre-appeal reset</strong> - when a pre-appeal decision issues, the brief date recomputed from the decision.</li>
                <li><strong>The RCE follow-up</strong> - once an RCE is filed, the final action chain closes and the matter waits for the next action on the merits.</li>
                <li><strong>The term companion date</strong> - the three-month target that avoids applicant delay for patent term adjustment, shown as advisory alongside the legal deadline.</li>
            </ul>
            <p>
                When a path is taken, the dates that belong to the other paths should close together,
                with the closure recorded, a discipline we cover in our guide to{' '}
                <Link href="/blog/patent-de-docketing-zero-touch-guide/">de-docketing</Link>.
            </p>

            <h2>How Design Your Invention Fits After a Final Rejection</h2>
            <p>
                Design Your Invention&apos;s{' '}
                <Link href="/docketing/">patent docketing platform</Link>{' '}
                computes the office action response chain from the recorded action under versioned,
                cited rules, including the extension ladder, the statutory limit, and the patent term
                companion date, with every computed date subject to attorney review.
            </p>
            <p>
                The{' '}
                <Link href="/office-actions/">office action analysis and response workspace</Link>{' '}
                reads final rejections and advisory actions into a signed issue map, using the method in
                our guide to{' '}
                <Link href="/blog/how-to-analyze-a-uspto-office-action/">analyzing a USPTO office action</Link>.
                The response workspace supports amendments after final under 37 CFR 1.116 as well as
                replies under 37 CFR 1.111, with the claim listing and support checks described in our{' '}
                <Link href="/blog/claim-amendments-37-cfr-1-121-guide/">claim amendments guide</Link>.
                Notices of appeal, pre-appeal requests, and RCE submissions are prepared outside the
                response workspace today.
            </p>
            <p>
                After a final rejection, the argument matters less than the path. Choose the path with
                the issue map and the docket both in view.
            </p>
        </>
    );
}

export const post: BlogPost = {
    slug: 'after-final-rejection-options-uspto',
    title: 'After a Final Rejection: Choosing Between 1.116, Appeal, and RCE Without AFCP 2.0',
    shortTitle: 'Options After Final',
    description:
        'Your options after a USPTO final rejection now that AFCP 2.0 has ended: 1.116 amendments, interviews, appeal with pre-appeal review, and RCE, and the deadlines each path starts.',
    publishedAt: '2026-10-17',
    author: { name: 'Design Your Invention Team', role: 'IP Management Specialists' },
    category: 'Patent Docketing',
    readingTime: '9 min read',
    keywords: [
        'final rejection options',
        'after final response',
        'AFCP 2.0 ended',
        'RCE vs appeal',
        'pre-appeal brief request',
        '37 CFR 1.116 amendment',
        'advisory action',
    ],
    content: Content,
};
