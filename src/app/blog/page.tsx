import type { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { BlogPostsPaginated } from '@/components/blog/BlogPostsPaginated';
import { BlogListJsonLd } from '@/components/blog/BlogJsonLd';
import { HexCubeIllustration } from '@/components/illustrations/HexCubeIllustration';
import { getAllPosts } from '@/content/blog';
import { SITE_URL, SITE_NAME } from '@/lib/constants';
import { ogImageEntry, ogImageUrl } from '@/lib/og';

const BLOG_HERO_TAGS = ['Insights', 'Best practices', 'Compliance'];

export const metadata: Metadata = {
    title: `IP Management Blog - ${SITE_NAME}`,
    description:
        'Insights on IP management, patent docketing, FDA 21 CFR Part 11 compliance, PCT filing management, and portfolio analytics for law firms and pharma companies.',
    keywords: [
        'IP management blog',
        'patent docketing insights',
        'patent management articles',
        'FDA compliance blog',
        'intellectual property management',
    ],
    alternates: {
        canonical: `${SITE_URL}/blog/`,
    },
    openGraph: {
        title: `IP Management Blog - ${SITE_NAME}`,
        description: 'Insights on IP management, patent docketing, and compliance for law firms and pharma.',
        url: `${SITE_URL}/blog/`,
        siteName: SITE_NAME,
        type: 'website',
        images: [ogImageEntry('blog', `IP Management Blog - ${SITE_NAME}`)],
    },
    twitter: {
        card: 'summary_large_image',
        title: `IP Management Blog - ${SITE_NAME}`,
        description: 'Insights on IP management, patent docketing, and compliance for law firms and pharma.',
        images: [ogImageUrl('blog')],
    },
};

export default function BlogPage() {
    // Strip the `content` component: function-valued fields cannot be passed
    // to the BlogPostsPaginated Client Component. Cards only need the metadata.
    const posts = getAllPosts().map(({ content: _content, ...meta }) => meta);

    return (
        <main id="main-content">
            <BlogListJsonLd />

            {/* Hero */}
            <section className="pt-28 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        <div>
                            <span
                                className="inline-block text-[10px] font-bold uppercase tracking-[0.18em] text-primary px-2.5 py-1 rounded bg-primary/5"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                Blog
                            </span>
                            <h1
                                className="mt-5 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
                                style={{ fontFamily: 'var(--font-display)' }}
                            >
                                IP Management Blog
                            </h1>
                            <p
                                className="mt-5 max-w-xl text-base text-text-secondary leading-relaxed sm:text-lg"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Practical insights on patent docketing, FDA compliance, PCT filing
                                management, and portfolio analytics for law firms and pharma IP teams.
                            </p>
                            <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-page-bg-alt px-3 py-2 pr-5 border border-card-border">
                                <span className="flex w-9 h-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                    <BookOpen className="w-4.5 h-4.5 text-primary" aria-hidden="true" />
                                </span>
                                <span
                                    className="text-sm text-text-secondary"
                                    style={{ fontFamily: 'var(--font-body)' }}
                                >
                                    {BLOG_HERO_TAGS.join(' • ')}
                                </span>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <HexCubeIllustration className="max-w-xl ml-auto" />
                        </div>
                    </div>
                </Container>
            </section>

            {/* Post Grid */}
            <section className="pb-24 lg:pb-32">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <BlogPostsPaginated posts={posts} />
                    </div>
                </Container>
            </section>
        </main>
    );
}
