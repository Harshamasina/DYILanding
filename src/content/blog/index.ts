import type { BlogPost } from './types';

import { post as whatIsIpManagement } from './what-is-ip-management-software';
import { post as patentDocketing } from './patent-docketing-best-practices';
import { post as fdaCompliance } from './fda-21-cfr-part-11-compliance-guide';
import { post as pctFiling } from './pct-filing-management-tips';
import { post as portfolioAnalytics } from './patent-portfolio-analytics-roi';
import { post as aiPatentDrafting } from './ai-patent-drafting-guide';
import { post as patentDataMigration } from './patent-data-migration-csv-import';
import { post as npeCaseManagement } from './npe-case-management-guide';
import { post as freePriorArtSearch } from './free-prior-art-search-guide';
import { post as chatgptForPatents } from './can-i-use-chatgpt-to-write-a-patent';

const allPosts: BlogPost[] = [
    whatIsIpManagement,
    patentDocketing,
    fdaCompliance,
    pctFiling,
    portfolioAnalytics,
    aiPatentDrafting,
    patentDataMigration,
    npeCaseManagement,
    freePriorArtSearch,
    chatgptForPatents,
];

/** All posts sorted by publishedAt descending (newest first) */
export function getAllPosts(): BlogPost[] {
    return [...allPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

/** Latest N posts (newest first). Used for footer, related-posts, etc. */
export function getLatestPosts(limit: number): BlogPost[] {
    return getAllPosts().slice(0, limit);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
    return allPosts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
    return allPosts.map((p) => p.slug);
}
