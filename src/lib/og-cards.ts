import type { OgCardContent, OgVisual } from '@/lib/og';
import { blogOgKey, careersOgKey } from '@/lib/og';
import { getAllPosts, getPostBySlug } from '@/content/blog';
import careersData from '@/data/careers.json';
import type { CareersData, Role } from '@/types/careers';

/* ── Share-card copy ──
 *
 * One entry per static route. Blog posts and open roles are derived from their
 * own data below, so adding a post or a role needs no change here.
 *
 * Card copy is written short for a 1200x630 canvas and is not the same string
 * as the page's <title>: meta titles carry the brand suffix and keyword
 * variations, a share card wants the human headline. Keep the claim wording in
 * step with the page it represents, including the qualifier that goes with any
 * deadline, compliance, search-coverage, or AI claim.
 *
 * This module pulls in the blog index, so it is imported only by the OG route
 * handler, never by lib/og or by a page. */

const careers = careersData as CareersData;

const STATIC_CARDS: Record<string, OgCardContent> = {
    home: {
        variant: 'brand',
        visual: 'platform',
        eyebrow: 'Compliance-native IP portfolio management',
        title: 'Design Your Invention',
        description: '',
    },
    blog: {
        variant: 'page',
        visual: 'editorial',
        eyebrow: 'Blog',
        title: 'IP Management Insights',
        description:
            'Guides on patent docketing, PCT filing, portfolio analytics, and Part 11-aligned workflow controls for law firms and pharma IP teams.',
    },
    faq: {
        variant: 'page',
        visual: 'support',
        eyebrow: 'FAQ',
        title: 'IP Management Software, Answered',
        description:
            'What the platform is, who it is for, supported jurisdictions, prior art search, AI drafting, Part 11-aligned controls, product stage, and security.',
    },
    docketing: {
        variant: 'page',
        visual: 'docketing',
        eyebrow: 'Patent Docketing',
        title: 'Patent Docketing and Deadline Management',
        description:
            'Audit-first docketing that derives supported statutory deadlines from your case data and scores each by risk. Calculated dates remain subject to professional review.',
    },
    'patent-search': {
        variant: 'page',
        visual: 'search',
        eyebrow: 'Patent Search',
        title: 'Free Patent Search With Chemistry and Trial Data',
        description:
            'Search a corpus of 120M+ patent records from 100+ patent authorities. Detect disclosed compounds, run substructure search, and see linked clinical trials.',
    },
    'ai-patent-drafting': {
        variant: 'page',
        visual: 'drafting',
        eyebrow: 'AI Drafting',
        title: 'AI Patent Drafting With Attorney Review',
        description:
            'Turn saved prior art into a structured first draft of claims, abstract, and novelty analysis for attorney review across US, EP, IN, and PCT.',
    },
    compare: {
        variant: 'page',
        visual: 'comparison',
        eyebrow: 'Comparison',
        title: 'Design Your Invention vs Legacy IPMS',
        description:
            'One platform for multi-jurisdiction docketing, prior art search, AI-assisted drafting, and chemistry enrichment, built for pharma IP teams and boutique firms.',
    },
    careers: {
        variant: 'page',
        visual: 'careers',
        eyebrow: 'Careers',
        title: careers.hero.title,
        description: careers.hero.description,
    },
    support: {
        variant: 'page',
        visual: 'support',
        eyebrow: 'Support',
        title: 'Help and Resources',
        description:
            'Get help with Design Your Invention. Browse FAQs, reach the team, and find resources for patent docketing and compliance workflows.',
    },
    privacy: {
        variant: 'page',
        visual: 'legal',
        eyebrow: 'Legal',
        title: 'Privacy Policy',
        description:
            'How Design Your Invention collects, uses, and protects personal data across the IP management platform.',
    },
    terms: {
        variant: 'page',
        visual: 'legal',
        eyebrow: 'Legal',
        title: 'Terms of Service',
        description:
            'The terms governing use of the Design Your Invention IP management platform.',
    },
};

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Formats an ISO `YYYY-MM-DD` date without touching the build machine's locale,
 * so the generated PNG is byte-identical on every machine. */
function formatCardDate(iso: string): string {
    const [year, month, day] = iso.split('-');
    const monthName = MONTHS[Number(month) - 1];
    if (!monthName || !year || !day) return iso;
    return `${monthName} ${Number(day)}, ${year}`;
}

function activeRoles(): Role[] {
    return careers.roles.filter((role) => role.active);
}

/** Selects a useful illustration for an article without coupling the renderer
 * to individual slugs. New categories automatically receive the closest
 * product scene, with the editorial scene as a graceful fallback. */
function articleVisual(category: string): OgVisual {
    const value = category.toLowerCase();
    if (value.includes('draft') || value.includes('chatgpt')) return 'drafting';
    if (value.includes('search') || value.includes('prior art')) return 'search';
    if (value.includes('docket') || value.includes('filing') || value.includes('npe')) return 'docketing';
    if (value.includes('compliance')) return 'compliance';
    if (value.includes('analytics') || value.includes('portfolio')) return 'analytics';
    if (value.includes('migration') || value.includes('import')) return 'migration';
    return 'editorial';
}

/** Card for a share key, or undefined when the key is unknown. */
export function getOgCard(key: string): OgCardContent | undefined {
    const staticCard = STATIC_CARDS[key];
    if (staticCard) return staticCard;

    if (key.startsWith('blog-')) {
        const post = getPostBySlug(key.slice('blog-'.length));
        if (!post) return undefined;
        return {
            variant: 'article',
            visual: articleVisual(post.category),
            eyebrow: post.category,
            title: post.title,
            description: post.description,
            meta: `${formatCardDate(post.publishedAt)} - ${post.readingTime}`,
        };
    }

    if (key.startsWith('careers-')) {
        const slug = key.slice('careers-'.length);
        const role = activeRoles().find((r) => r.slug === slug);
        if (!role) return undefined;
        return {
            variant: 'article',
            visual: 'careers',
            eyebrow: role.department,
            title: role.title,
            description: role.summary,
            meta: `${role.location} - ${role.employmentType}`,
        };
    }

    return undefined;
}

/** Every card the build should emit. Drives generateStaticParams. */
export function getAllOgKeys(): string[] {
    return [
        ...Object.keys(STATIC_CARDS),
        ...getAllPosts().map((post) => blogOgKey(post.slug)),
        ...activeRoles().map((role) => careersOgKey(role.slug)),
    ];
}
