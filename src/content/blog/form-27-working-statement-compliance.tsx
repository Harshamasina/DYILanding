import Link from 'next/link';
import type { BlogPost } from './types';

function Content() {
    return (
        <>
            <p>
                India is one of the few jurisdictions that requires patentees to report whether their
                granted patents are actually being worked, commercially used, in the country. That
                report is Form 27, the statement regarding the working of a patented invention, and
                missing it carries real consequences. For any firm or company holding Indian patents,
                Form 27 is a recurring compliance deadline that is easy to forget and expensive to get
                wrong.
            </p>

            <h2>What Form 27 Is and Who Must File</h2>
            <p>
                Under Section 146(2) of the Patents Act, read with Rule 131, every patentee and every
                licensee must periodically furnish a statement on the extent to which the patented
                invention has been worked on a commercial scale in India. The statement is filed on
                Form 27 with the Indian Patent Office. The obligation sits on the rights holder, so a
                foreign applicant with an Indian patent carries it just as an Indian one does, and an
                exclusive licensee has its own duty to file.
            </p>

            <h2>What the 2020 Amendment Changed</h2>
            <p>
                The Patents (Amendment) Rules, 2020 reworked Form 27 and made it considerably more
                manageable. The key changes:
            </p>
            <ul>
                <li><strong>Financial year, not calendar year.</strong> Working is now reported for the financial year (April 1 to March 31), starting from the financial year after the one in which the patent was granted.</li>
                <li><strong>A six-month filing window.</strong> The statement is due within six months from the end of the financial year, which in practice means by September 30 each year.</li>
                <li><strong>Multiple patents on one form.</strong> A single Form 27 can now cover several related patents held by the same patentee, where they are interrelated.</li>
                <li><strong>Joint filing allowed.</strong> Two or more patentees can file a single form jointly.</li>
                <li><strong>Less granular revenue detail.</strong> The form no longer demands the old quantum-and-value breakdown; it asks whether the patent was worked, approximate revenue or value from working in India, and if not worked, the reasons.</li>
            </ul>

            <h2>Why Missing It Hurts</h2>
            <p>
                Two consequences make Form 27 worth tracking carefully. First, Section 122 makes
                refusing or failing to furnish the required information an offense, punishable by a
                fine, and furnishing false information knowingly is more serious still. Second, the
                working data feeds India's compulsory licensing regime under Section 84: a patent that
                is not worked in India can become a target for a compulsory license application by a
                third party. A pattern of non-working, on the record in your own filings, is exactly
                the evidence such an application relies on.
            </p>

            <h2>What to Track for Each Patent</h2>
            <p>
                Form 27 compliance is fundamentally a docketing problem: a recurring annual deadline
                attached to every granted Indian patent, with supporting data that has to be gathered
                before the window closes. For each Indian grant, keep:
            </p>
            <ul>
                <li><strong>Grant date,</strong> which sets the first financial year for which a statement is due.</li>
                <li><strong>The annual September 30 deadline,</strong> recurring every financial year for the life of the patent.</li>
                <li><strong>Worked or not-worked status</strong> for the year, with approximate value derived from working in India.</li>
                <li><strong>Reasons for non-working,</strong> where applicable, since the form requires them.</li>
                <li><strong>Licensee obligations,</strong> so any exclusive licensee files its own statement or is accounted for in a joint filing.</li>
            </ul>

            <h2>Make It a Standing Deadline, Not an Annual Scramble</h2>
            <p>
                Because Form 27 repeats every year for every Indian patent, the failure mode is not a
                single missed date but a slow drift as the portfolio grows. Deriving the recurring
                deadline automatically from each patent's grant data, and surfacing it well before
                September, is exactly what a deadline engine is for. In our{' '}
                <Link href="/docketing/">patent docketing</Link> system, statutory deadlines are
                computed from the case record rather than entered by hand, scored by risk, and pushed
                out in proactive reminders, so a recurring obligation like Form 27 stays visible across
                the whole Indian portfolio instead of living in a spreadsheet someone has to remember
                to open. If you are still mapping which of your filings are India-bound in the first
                place, a{' '}
                <Link href="/compare/">single platform that unifies docketing with the rest of the IP
                workflow</Link> keeps the working statements tied to the same families, fees, and
                deadlines you already manage.
            </p>

            <p>
                None of this is legal advice, and the precise scope of the obligation can turn on the
                facts of a given patent and licence. But as a compliance routine, Form 27 is
                predictable: known patents, a known annual deadline, and a known set of data to gather.
                Treated as standing docket items, it stops being a yearly fire drill.
            </p>
        </>
    );
}

export const post: BlogPost = {
    slug: 'form-27-working-statement-compliance',
    title: 'Form 27 Working Statement Compliance for Indian Patents',
    shortTitle: 'Form 27 Compliance',
    description:
        'A practical guide to Form 27, the Indian patent working statement under Section 146: who must file, what the 2020 amendment changed, the September 30 deadline, and what to track for every Indian patent.',
    publishedAt: '2026-06-03',
    author: { name: 'Design Your Invention Team', role: 'IP Management Specialists' },
    category: 'Compliance',
    readingTime: '7 min read',
    keywords: [
        'Form 27 India',
        'patent working statement India',
        'Section 146 Patents Act',
        'Form 27 deadline September 30',
        'Indian patent compliance',
        'patent working requirement India',
    ],
    content: Content,
};
