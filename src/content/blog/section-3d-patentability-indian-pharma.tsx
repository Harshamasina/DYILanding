import Link from 'next/link';
import type { BlogPost } from './types';

function Content() {
    return (
        <>
            <p>
                For pharma companies filing in India, Section 3(d) of the Patents Act is the single
                provision that decides whether a patent on a new form of a known drug survives. It is
                why the imatinib (Glivec) patent was refused, and it is the first thing an Indian
                examiner reaches for when a claim looks like an incremental change to an existing
                molecule. If your portfolio touches India, tracking the Section 3(d) posture of every
                application is not optional, it is the difference between a granted patent and a
                rejection you could have seen coming.
            </p>

            <h2>What Section 3(d) Actually Says</h2>
            <p>
                Section 3(d) excludes from patentability the mere discovery of a new form of a known
                substance that does not result in the enhancement of the known efficacy of that
                substance. It also bars the mere discovery of a new property or new use for a known
                substance, and the mere use of a known process unless that process produces a new
                product or uses at least one new reactant. An explanation to the section treats salts,
                esters, ethers, polymorphs, metabolites, pure form, particle size, isomers, mixtures
                of isomers, complexes, combinations, and other derivatives of a known substance as the
                same substance, unless they differ significantly in properties with regard to efficacy.
            </p>
            <p>
                The phrase that carries the weight is enhancement of known efficacy. In Novartis v.
                Union of India (2013), the Supreme Court read efficacy in the pharmaceutical context as
                therapeutic efficacy, not merely improved physical properties like better solubility or
                stability. So a new polymorph that dissolves faster but does not demonstrably treat the
                disease better can still fall foul of 3(d).
            </p>

            <h2>Why It Trips Up Pharma Portfolios Specifically</h2>
            <p>
                Lifecycle management in pharma leans heavily on exactly the kinds of claims 3(d)
                scrutinizes: new salts, polymorphs, formulations, combinations, and dosage regimens of
                an already-disclosed active. A claim set that sails through the USPTO or EPO on novelty
                and inventive step can still need a separate, evidence-backed efficacy story to clear
                3(d) in India. Teams that treat the Indian national phase as a formality discover the
                gap only when the first examination report cites 3(d), often years after the priority
                filing, when generating fresh efficacy data is hard.
            </p>

            <h2>What to Track for Every India-Bound Application</h2>
            <p>
                The practical answer is to make 3(d) exposure a tracked attribute of each case, not a
                surprise in prosecution. For each application entering or planned for India, keep a
                clear record of:
            </p>
            <ul>
                <li><strong>Known-substance status:</strong> is the claimed compound a new form, new use, or derivative of a substance already in the public domain?</li>
                <li><strong>Efficacy evidence on file:</strong> what comparative therapeutic-efficacy data exists against the known form, and where does it live?</li>
                <li><strong>Priority and disclosure dates:</strong> what was publicly disclosed before filing, since the known substance baseline drives the whole analysis.</li>
                <li><strong>Family linkage:</strong> which parent and sibling filings share the same active, so a 3(d) position taken in one case stays consistent across the family.</li>
                <li><strong>Examination deadlines:</strong> the response windows on any 3(d) objection, which are unforgiving in India.</li>
            </ul>

            <h2>Build the Efficacy Story Before You File, Not After</h2>
            <p>
                The strongest 3(d) defense is comparative data generated while it is still feasible:
                head-to-head therapeutic-efficacy results for the new form against the known substance,
                tied to the specific advantage the claims rely on. Capturing what prior art defines the
                known substance is half the battle, and it starts with a thorough{' '}
                <Link href="/patent-search/">prior art search</Link> that pins down exactly what was
                already disclosed about the molecule. Drafting then has to argue enhanced efficacy
                explicitly rather than assume it, which is why an{' '}
                <Link href="/ai-patent-drafting/">AI-assisted draft</Link> aimed at the Indian
                jurisdiction is built around Section 3(d) and the related Section 3 exclusions from the
                start, not bolted on during prosecution.
            </p>

            <h2>Keep It Visible Across the Portfolio</h2>
            <p>
                A single application is easy to reason about. A portfolio of fifty India-bound cases,
                each with its own known-substance baseline and efficacy evidence, is not. Treating 3(d)
                posture as structured case data, alongside deadlines and family relationships in your{' '}
                <Link href="/docketing/">patent docketing</Link> system, means a manager can answer
                which Indian cases carry 3(d) risk and which already have the efficacy data to meet it,
                without reopening every file. That visibility is what turns a notorious rejection ground
                into a position you have prepared for.
            </p>
        </>
    );
}

export const post: BlogPost = {
    slug: 'section-3d-patentability-indian-pharma',
    title: 'Section 3(d) Patentability Tracking for Indian Pharma Patents',
    shortTitle: 'Section 3(d) for Pharma',
    description:
        'How Section 3(d) of the Indian Patents Act decides patentability for new forms of known drugs, what the Novartis Glivec ruling means by enhanced efficacy, and what pharma teams should track for every India-bound application.',
    publishedAt: '2026-06-02',
    author: { name: 'Design Your Invention Team', role: 'IP Management Specialists' },
    category: 'Compliance',
    readingTime: '8 min read',
    keywords: [
        'Section 3(d) Indian Patents Act',
        'Section 3(d) pharma patentability',
        'enhanced efficacy patent India',
        'Novartis Glivec Section 3(d)',
        'Indian patent prosecution pharma',
        'new form of known substance patent',
    ],
    content: Content,
};
