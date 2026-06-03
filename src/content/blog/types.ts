export interface BlogPost {
    slug: string;
    title: string;
    /** Short label for compact UI surfaces (footer, related-posts list). Falls back to title. */
    shortTitle?: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    author: {
        name: string;
        role: string;
    };
    category: string;
    readingTime: string;
    keywords: string[];
    content: React.ComponentType;
}

/**
 * Post fields without the `content` component. Used for card/list UIs and for
 * passing post data into Client Components, where a function-valued `content`
 * field cannot cross the server/client boundary.
 */
export type BlogPostMeta = Omit<BlogPost, 'content'>;
