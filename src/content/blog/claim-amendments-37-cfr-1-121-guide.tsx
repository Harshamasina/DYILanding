import Link from 'next/link';
import type { BlogPost } from './types';

function Content() {
    return (
        <>
            <p>
                A claim amendment can be substantively right and still go nowhere. A wrong status
                identifier, markings shown against the wrong version, or a canceled claim reproduced in
                full can draw a notice of non-compliant amendment, and an inserted phrase without support
                in the application as filed can draw a new matter rejection. Neither problem has anything
                to do with whether the amended claim is patentable.
            </p>
            <p>
                This guide covers the mechanics of amending claims in a reply to a USPTO office action:
                the claim listing required by 37 CFR 1.121, the status identifiers, how changes are
                marked, how to show written description support, and what to recheck once the claims
                change. It is general information about US practice, not legal advice for any particular
                matter.
            </p>

            <h2>The Claim Listing: Every Claim, Every Time</h2>
            <p>
                Under 37 CFR 1.121(c), claims are amended by rewriting the entire claim with its changes
                marked, inside a complete claim listing. The listing replaces every earlier version of
                the claims in the application, so it must include every claim ever presented, in
                ascending numerical order, each with a status identifier in parentheses.
            </p>
            <p>
                Canceled and not entered claims are listed by number and status only, without their
                text, and consecutive claims with the same status can be grouped, for example
                &quot;Claims 5-7 (Canceled)&quot;. New claims are numbered consecutively from the
                highest number previously presented under 37 CFR 1.126, so a canceled claim&apos;s number
                is never reused.
            </p>

            <h2>The Status Identifiers</h2>
            <p>
                Each claim in the listing carries one identifier describing its status as of this
                amendment:
            </p>
            <ul>
                <li><strong>Original</strong> - the claim as filed, never amended.</li>
                <li><strong>Currently amended</strong> - changed in this paper, with the changes marked.</li>
                <li><strong>Previously presented</strong> - added or amended in an earlier paper that was entered, and unchanged now.</li>
                <li><strong>New</strong> - added in this paper, presented without markings.</li>
                <li><strong>Canceled</strong> - removed, listed without text.</li>
                <li><strong>Withdrawn</strong> - withdrawn from consideration, typically after a restriction requirement. A withdrawn claim being changed is shown as withdrawn and currently amended, with markings.</li>
                <li><strong>Not entered</strong> - presented in an earlier paper that the examiner did not enter, listed without text.</li>
            </ul>
            <p>
                Most identifier mistakes come from tracking status by memory. A claim amended in the last
                reply is &quot;Previously presented&quot; now, not &quot;Currently amended&quot;. A
                claim from an after-final amendment that was never entered still sits at its last entered
                version. And homemade labels such as &quot;Previously amended&quot; invite a notice even
                where the Office has tolerated nonstandard identifiers in the past. The listed set is the
                safe set.
            </p>

            <h2>Markings: Show Changes Against the Last Entered Version</h2>
            <p>
                A currently amended claim shows its changes against the immediately prior version of
                that claim, which means the last version actually entered, not the claim as originally
                filed and not a draft that was never filed. Added text is underlined and deleted text is
                shown in strike-through. Double brackets may be used instead to delete five or fewer
                consecutive characters, or where strike-through would be hard to see.
            </p>
            <blockquote>
                1. (Currently amended) A sensor system comprising: a temperature sensor; a controller
                configured to adjust a sampling interval; and a stored calibration profile{' '}
                <u>that maps each temperature band to a sampling interval</u>.
            </blockquote>
            <p>
                Two consistency checks prevent most marking errors. Every claim marked &quot;Currently
                amended&quot; should show at least one change, and no claim with any other identifier
                should show markings. A claim whose markings were generated against the wrong baseline
                is the hardest error to spot by eye, which is why the baseline should come from the
                prosecution record rather than a local file.
            </p>

            <h2>Support in the Application as Filed</h2>
            <p>
                Under 35 U.S.C. 132(a), no amendment may introduce new matter into the disclosure, and
                amended claims must still satisfy the written description requirement of 35 U.S.C.
                112(a). The MPEP asks applicants to point out where the support for an amendment can be
                found, and doing so in the remarks is the simplest way to avoid a new matter rejection.
            </p>
            <ul>
                <li><strong>Cite support per inserted phrase</strong> - a paragraph or page and line for each piece of new claim language, not one citation for the whole amendment.</li>
                <li><strong>Remember the original claims</strong> - claims as filed are part of the disclosure and can supply support of their own.</li>
                <li><strong>Watch negative limitations</strong> - excluding something requires support for the exclusion, not just silence in the specification.</li>
                <li><strong>Check carved-out ranges</strong> - a narrower numerical range needs support for its new endpoints, not merely for the broader range.</li>
                <li><strong>Avoid paraphrase</strong> - wording that is close to the specification but not in it is exactly where support disputes start.</li>
            </ul>

            <h2>What Changes When the Claims Change</h2>
            <p>
                Amending one claim ripples through the rest of the listing. Before the reply is filed,
                recheck:
            </p>
            <ul>
                <li><strong>Antecedent basis</strong> - an amendment that renames or removes an element can leave &quot;the&quot; or &quot;said&quot; references in dependent claims pointing at nothing, which invites an indefiniteness rejection.</li>
                <li><strong>Dependency</strong> - claims that depend on a canceled claim need to be amended or canceled, and new dependent claims need a valid parent.</li>
                <li><strong>Excess claim fees</strong> - fees under 37 CFR 1.16(h) and (i) apply for each independent claim over three and each claim over twenty, with a separate fee for multiple dependent claims, and an amendment that pushes the counts above what has already been paid owes the difference.</li>
                <li><strong>After-final limits</strong> - once an action is final, amendments are entered only within the limits of 37 CFR 1.116, which we cover in our guide to <Link href="/blog/after-final-rejection-options-uspto/">options after a final rejection</Link>.</li>
                <li><strong>Prosecution history</strong> - narrowing amendments made for patentability can limit equivalents later, so each one should be a deliberate choice.</li>
            </ul>
            <p>
                The remarks should also explain how the amended claims avoid each cited reference.
                Under 37 CFR 1.111(c), an applicant who amends in reply to a rejection must clearly point
                out the patentable novelty the claims present in view of the art, which is why the
                amendment decision belongs in the{' '}
                <Link href="/blog/how-to-analyze-a-uspto-office-action/">office action analysis</Link>{' '}
                rather than at the end of drafting.
            </p>

            <h2>How Design Your Invention Handles the Claim Listing</h2>
            <p>
                The{' '}
                <Link href="/office-actions/">office action response workspace</Link>{' '}
                in Design Your Invention builds the claim listing from the examined claims in the
                prosecution record, so markings are always shown against the right baseline. Each claim
                carries its status, and claims are parsed deterministically, including multiple dependent
                claims and Markush groups. Possible antecedent basis gaps are flagged on every claim
                change, and excess-claim counts update as the listing changes.
            </p>
            <p>
                Inserted language is linked to passages in the application as filed, which an attorney
                confirms, and added words that no cited passage holds are flagged before approval. The
                response is approved by an attorney who did not last revise it, approved content is
                locked, and the reply is exported to Word for the attorney to file. When AI assists with
                amendment proposals, the same support checks apply, as we explain in our guide to{' '}
                <Link href="/blog/ai-office-action-response-uspto-guidance/">using AI on office action responses</Link>.
            </p>
            <p>
                An amendment is a legal argument written in claim language. Get the listing, the
                markings, and the support right, and the examiner is left with only the argument to
                answer.
            </p>
        </>
    );
}

export const post: BlogPost = {
    slug: 'claim-amendments-37-cfr-1-121-guide',
    title: 'Claim Amendments Under 37 CFR 1.121: Status Identifiers, Markings, and Support',
    shortTitle: 'Claim Amendments (1.121)',
    description:
        'How to amend claims in a USPTO office action reply: the 37 CFR 1.121 claim listing, status identifiers, markings, written description support, and what to recheck after amending.',
    publishedAt: '2026-10-14',
    author: { name: 'Design Your Invention Team', role: 'IP Management Specialists' },
    category: 'Patent Filing',
    readingTime: '9 min read',
    keywords: [
        'claim amendment format',
        '37 CFR 1.121',
        'claim listing status identifiers',
        'currently amended claim',
        'notice of non-compliant amendment',
        'support for claim amendments',
        'new matter 35 USC 132',
    ],
    content: Content,
};
