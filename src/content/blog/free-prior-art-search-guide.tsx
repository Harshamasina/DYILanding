import Link from 'next/link';
import type { BlogPost } from './types';
import { SEARCH_APP_URL } from '@/lib/constants';

function Content() {
    return (
        <>
            <p>
                Every patent application is a bet, and prior art is the house edge. A few hours of
                searching before you draft can tell you whether your invention is genuinely novel,
                where the closest art sits, and how to position claims to survive examination. Skip
                it, and you risk spending thousands on a filing that an examiner kills with a
                reference you could have found in an afternoon. The good news: you can now run a
                serious prior art search across more than 120 million patent records, from 100+ patent
                authorities, for free.
            </p>

            <h2>What a Prior Art Search Actually Tells You</h2>
            <p>
                Prior art is any public disclosure that predates your filing date: published patents
                and applications, journal articles, product manuals, even conference posters. A good
                search answers three questions before you commit to a draft:
            </p>
            <ul>
                <li><strong>Is it novel?</strong> Has anyone already disclosed the same combination of features?</li>
                <li><strong>Where is the closest art?</strong> What references will an examiner most likely cite, and what distinguishes your invention from them?</li>
                <li><strong>Is the path clear?</strong> For freedom-to-operate, are there in-force patents you could infringe by making or selling your product?</li>
            </ul>
            <p>
                Novelty search and freedom-to-operate are different exercises, novelty looks at what
                was disclosed anywhere in the world, freedom-to-operate looks at what is still in
                force in your target market, but both start from the same place: a fast, broad search
                across the global patent record.
            </p>

            <h2>Why Traditional Searching Is Painful</h2>
            <p>
                Most searchers bounce between half a dozen tools: USPTO Patent Public Search for US
                grants, Espacenet for European and family data, Google Patents for quick keyword
                lookups, and a paid platform when they need structure search or analytics. Each has a
                different query syntax, a different coverage gap, and a different export format.
                Pharma and chemistry teams have it worse, because the molecule disclosed in a patent
                is buried in the text and figures, not indexed as a searchable structure unless you
                pay a premium tool for it.
            </p>

            <h2>How to Run a Free Search Across 120M+ Patents</h2>
            <p>
                Our{' '}
                <Link href="/patent-search/">free patent search tool</Link>
                {' '}runs on the Google Patents public dataset through BigQuery: more than 120 million
                records from 100+ patent authorities across IPC classes, with no account required to
                start. Coverage, full-text availability, and freshness vary by authority and by
                publication delay, so treat it as broad rather than complete. Here is a practical
                workflow.
            </p>

            <h3>1. Start broad with the right search mode</h3>
            <p>
                Six search modes cover most needs. Use <strong>Keyword</strong> for a full-text sweep
                of titles, abstracts, and claims, <strong>Claims</strong> when you want what a patent
                actually protects rather than what it mentions, and <strong>Applicant</strong> or
                <strong> Inventor</strong> to map a competitor or a prolific filer. Corporate suffixes
                (Inc., Ltd., GmbH) and inventor name-order variations are normalized for you, so you
                do not miss filings to a spelling quirk.
            </p>

            <h3>2. Narrow with filters, not more keywords</h3>
            <p>
                Once you have a result set, tighten it by jurisdiction, filing date, and IPC or CPC
                classification rather than piling on keywords that quietly drop relevant hits. Every
                result carries its legal status, so you can tell a granted patent (which matters for
                freedom-to-operate) from a pending or abandoned application at a glance.
            </p>

            <h3>3. For chemistry, search by the molecule</h3>
            <p>
                This is where most free tools stop and ours keeps going. Compounds disclosed in a
                patent are resolved to a canonical 2D structure with an InChIKey, IUPAC name, SMILES,
                molecular weight, and cross-database IDs (PubChem, ChEMBL, CAS, DrugBank). From any
                compound you can pivot to every other patent that discloses the same molecule or
                scaffold, the substructure-aware search that premium platforms charge a fortune for.
            </p>

            <h3>4. See what is in the clinic</h3>
            <p>
                Patents are linked to trials from ClinicalTrials.gov, showing phase, recruitment
                status, sponsor, and indication. For a life-sciences landscape, that connects a
                molecule to the patents that cover it and the programs developing it, in one view,
                without leaving the search.
            </p>

            <h3>5. Sign in to export and go deeper</h3>
            <p>
                Anonymous search covers titles and abstracts across all jurisdictions and shows
                disclosed compounds and linked trials. Signing in with a work email unlocks full-text
                claims on every patent, CSV export for sharing with your IP or R&D team, and a higher
                result limit. There is no paywall on the core search itself.
            </p>

            <h2>From Search to a Stronger Filing</h2>
            <p>
                A prior art search is most valuable when it feeds the next step. The references you
                surface define the novelty bar your claims have to clear, so the draft should be
                written against the art you found, not in a vacuum. That is exactly how our platform
                connects the two: prior art saved during search flows into{' '}
                <Link href="/ai-patent-drafting/">AI-assisted patent drafting</Link>, where the draft
                is generated against a frozen, auditable snapshot of the exact references reviewed, so
                you can always answer what art informed a given claim.
            </p>
            <p>
                If you are also tracking deadlines across a growing portfolio, the same platform
                handles{' '}
                <Link href="/docketing/">patent docketing</Link>, deriving every statutory and
                procedural deadline from your case data and scoring each by risk.
            </p>

            <h2>Try It on Your Next Invention</h2>
            <p>
                Before you brief an attorney or commit to a draft, run the search yourself. It costs
                nothing, takes minutes, and often reshapes how you frame the invention. Open the{' '}
                <a href={SEARCH_APP_URL} target="_blank" rel="noopener noreferrer">live patent search tool</a>
                {' '}and start with a keyword, an assignee, or a chemical structure, or read more about
                what it covers on the{' '}
                <Link href="/patent-search/">patent search</Link> page.
            </p>
        </>
    );
}

export const post: BlogPost = {
    slug: 'free-prior-art-search-guide',
    title: 'How to Run a Free Prior Art Search Across 120M+ Patents',
    shortTitle: 'Free Prior Art Search',
    description:
        'How to run a free prior art and freedom-to-operate search across 120M+ patents, including chemical-structure and clinical-trial search, before you file.',
    publishedAt: '2026-05-27',
    author: { name: 'Design Your Invention Team', role: 'IP Management Specialists' },
    category: 'Patent Search',
    readingTime: '9 min read',
    keywords: [
        'free patent search',
        'prior art search',
        'freedom to operate search',
        'chemical structure patent search',
        'patent search tool',
        'how to search patents',
    ],
    content: Content,
};
