import Link from 'next/link';
import type { BlogPost } from './types';

function Content() {
    return (
        <>
            <p>
                Generative AI has moved from patent drafting into prosecution. Attorneys now use it to
                summarize office actions, restate rejections, propose claim amendments, and draft first
                versions of arguments. The USPTO has not banned any of that. It has, however, been clear
                that every existing obligation of the person who signs the response still applies, and
                that relying on an AI tool is not a substitute for the signer&apos;s own review.
            </p>
            <p>
                This guide explains what the USPTO&apos;s guidance on AI-based tools expects of
                practitioners, where AI-assisted office action responses tend to go wrong, and a
                verification workflow that holds up. It is general information about US practice, not
                legal advice for any particular matter.
            </p>

            <h2>What the USPTO&apos;s Guidance Actually Says</h2>
            <p>
                On April 11, 2024, the USPTO published guidance on the use of artificial
                intelligence-based tools in practice before the Office (89 FR 25609). The guidance did
                not create new rules. Its central point is that the existing rules already govern AI use,
                and it walks through how they apply:
            </p>
            <ul>
                <li><strong>No prohibition</strong> - using AI tools to help prepare submissions to the USPTO is permitted.</li>
                <li><strong>Duty of candor and good faith</strong> - the duty that applies to everyone involved in prosecuting an application applies equally to work produced with AI assistance.</li>
                <li><strong>Signature and reasonable inquiry</strong> - the person who signs a paper certifies it after a reasonable inquiry, and simply relying on the accuracy of an AI tool does not count as one.</li>
                <li><strong>Review of every submission</strong> - citations should be checked and arguments confirmed as legally and technically sound before they are filed.</li>
                <li><strong>People sign, tools do not</strong> - an AI system cannot sign a filing or hold a USPTO account.</li>
                <li><strong>Confidentiality</strong> - practitioners should understand whether a tool retains client information, uses it to train models, or sends it to third parties.</li>
            </ul>
            <p>
                The guidance does not impose a general duty to disclose that AI was used, absent a
                specific request from the Office. Its practical message is simpler: the attorney who signs
                the response owns every word of it, however the first draft was produced.
            </p>

            <h2>Where AI Goes Wrong in an Office Action Response</h2>
            <p>
                An office action response is an unusually unforgiving document for a language model. It
                is full of exact quotations, pinpoint citations, and claim language where a single word
                changes the scope of protection. Five failure modes come up again and again.
            </p>

            <h3>1. Quotations the reference does not contain</h3>
            <p>
                A model asked to quote a reference may produce a fluent paraphrase in quotation marks, or
                attach the right words to the wrong paragraph. Either error puts an inaccurate statement
                about the prior art on the record. Every quotation in the remarks should be checked
                character for character against the source text, with its pinpoint.
            </p>

            <h3>2. Arguments about features the claims do not recite</h3>
            <p>
                Models are good at explaining why an invention differs from the art and less careful
                about whether the claims actually say so. Arguments that rely on unclaimed features are
                routinely rejected because the features relied on are not recited in the claims. The test
                is whether each argued difference maps to claim language.
            </p>

            <h3>3. Amendments without support in the application as filed</h3>
            <p>
                A proposed amendment can read perfectly and still introduce new matter. Under 35 U.S.C.
                132(a), an amendment may not add new matter, and inserted language needs written
                description support in the application as filed. A model that drafts plausible claim
                language has no way of knowing whether the specification supports it unless that link
                is checked explicitly. We cover the support requirement in our guide to{' '}
                <Link href="/blog/claim-amendments-37-cfr-1-121-guide/">claim amendments under 37 CFR 1.121</Link>.
            </p>

            <h3>4. Misreading the rejection itself</h3>
            <p>
                A summary of the office action that merges two grounds, drops an objection, or assigns a
                reference to the wrong limitation will produce a response that argues against a position
                the examiner never took, while leaving a real ground unanswered. The response must address
                every ground, so the reading of the action needs the same verification as the arguments.
                Our guide to{' '}
                <Link href="/blog/how-to-analyze-a-uspto-office-action/">analyzing a USPTO office action</Link>{' '}
                sets out a method for that step.
            </p>

            <h3>5. Client information leaving the firm</h3>
            <p>
                Office action work involves unpublished claims, client strategy, and sometimes
                technology subject to export control. Pasting that material into a general-purpose
                chatbot raises the confidentiality questions the guidance flags. The issues are the same
                ones we discuss in{' '}
                <Link href="/blog/can-i-use-chatgpt-to-write-a-patent/">Can I Use ChatGPT to Write My Patent Application?</Link>,
                with the added weight of an active prosecution record.
            </p>

            <h2>A Verification Workflow That Supports the Signer</h2>
            <p>
                The goal is not to avoid AI but to make the signer&apos;s reasonable inquiry concrete and
                repeatable. A workflow that does that has six steps:
            </p>
            <ol>
                <li><strong>Fix the record first</strong> - the office action, the examined claims, the cited references, and the application as filed, confirmed by an attorney before any drafting begins.</li>
                <li><strong>Match every quotation to its source</strong> - exact text and pinpoint, checked against the reference rather than against the model&apos;s memory of it.</li>
                <li><strong>Link every inserted claim word to support</strong> - a passage in the application as filed, confirmed by an attorney, with unsupported words flagged.</li>
                <li><strong>Review model-derived text independently</strong> - a separate check of anything the model wrote, distinct from the step that generated it.</li>
                <li><strong>Separate drafting from approval</strong> - the attorney who approves the response should not be the one who last revised it.</li>
                <li><strong>Record what was approved</strong> - the exact version, the signer, the meaning of the signature, and the reason, so the approval can be reconstructed later.</li>
            </ol>
            <p>
                None of these steps is unique to AI. They are good prosecution hygiene. AI simply raises
                the cost of skipping them, because a model produces confident, well-formatted text whether
                or not it is right.
            </p>

            <h2>Policy Questions to Settle Before AI Touches Prosecution</h2>
            <p>
                Firms and in-house teams get the most from AI when the rules are decided before the
                first matter, not during it. The questions worth answering up front:
            </p>
            <ul>
                <li><strong>Which providers are approved</strong> - and whether data must stay in a particular region with a defined retention level.</li>
                <li><strong>Which matters are excluded</strong> - for example, export-controlled technology or clients who have instructed that AI not be used.</li>
                <li><strong>Who may approve AI-assisted work</strong> - and what review that approver must see before signing.</li>
                <li><strong>How usage is budgeted</strong> - so cost is predictable across matters and teams.</li>
                <li><strong>How clients are informed</strong> - professional responsibility guidance, including the ABA&apos;s Formal Opinion 512 on generative AI, addresses competence, confidentiality, and communication with clients.</li>
            </ul>

            <h2>How Design Your Invention Handles AI on Office Action Responses</h2>
            <p>
                The{' '}
                <Link href="/office-actions/">office action analysis and response workspace</Link>{' '}
                in Design Your Invention is built so that AI assistance never shortcuts attorney review.
                The structured response workspace, claim listing, support links, and Word export all work
                without any drafting aids. Model-assisted issue restatements, amendment proposals,
                amendment assessments, and anticipation arguments are available only where the
                capability has completed its evaluation, the deployment enables it, and workspace policy
                permits it.
            </p>
            <p>
                Every quotation in the claim chart is matched to the source text before it is stored.
                Inserted claim words are linked to passages in the application as filed, which an
                attorney confirms, and added words that no cited passage holds are flagged before
                approval. Model-derived response text cannot be approved until it passes an automated
                independent review, a separate model reading plus code checks. Approval requires an
                authorized attorney who did not last revise the draft, and approved content is locked.
                Workspace AI policy can restrict providers, require a region and retention level, and
                block AI for individual matters, with monthly AI usage capped per workspace. The same
                attorney-in-the-loop approach runs through our{' '}
                <Link href="/ai-patent-drafting/">AI patent drafting</Link> workflow.
            </p>
            <p>
                AI can write the first draft of a response. It cannot take responsibility for it. Build
                the checks that let the signer do that with confidence.
            </p>
        </>
    );
}

export const post: BlogPost = {
    slug: 'ai-office-action-response-uspto-guidance',
    title: 'Using AI on Office Action Responses: What the USPTO Expects',
    shortTitle: 'AI on OA Responses',
    description:
        'What the USPTO guidance on AI-based tools expects when AI helps draft an office action response, where AI-assisted responses go wrong, and a verification workflow for the signer.',
    publishedAt: '2026-10-10',
    author: { name: 'Design Your Invention Team', role: 'IP Management Specialists' },
    category: 'AI Drafting',
    readingTime: '9 min read',
    keywords: [
        'AI office action response',
        'USPTO AI guidance',
        'AI patent prosecution',
        'duty of candor AI',
        'ChatGPT office action response',
        'AI-based tools USPTO',
    ],
    content: Content,
};
