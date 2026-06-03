'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogCard } from '@/components/blog/BlogCard';
import type { BlogPostMeta } from '@/content/blog/types';

/**
 * Client-side pagination for the blog index.
 *
 * Every post card is rendered into the static HTML; off-page cards are only
 * visually hidden (Tailwind `hidden`), never removed from the DOM. That keeps
 * all post links crawlable for SEO while users page through 6 at a time. Pure
 * in-state paging, no URL change, to keep it simple.
 */
const PAGE_SIZE = 6;

export function BlogPostsPaginated({ posts }: { posts: BlogPostMeta[] }) {
    const [page, setPage] = useState(1);
    const topRef = useRef<HTMLDivElement>(null);

    const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    function goToPage(next: number) {
        const clamped = Math.min(Math.max(1, next), totalPages);
        if (clamped === page) return;
        setPage(clamped);
        const reduce =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        topRef.current?.scrollIntoView({
            behavior: reduce ? 'auto' : 'smooth',
            block: 'start',
        });
    }

    return (
        <div ref={topRef} className="scroll-mt-28">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                    <div key={post.slug} className={i >= start && i < end ? 'h-full' : 'hidden'}>
                        <BlogCard post={post} />
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <nav
                    aria-label="Blog pagination"
                    className="mt-14 flex items-center justify-center gap-2"
                >
                    <PagerArrow
                        direction="prev"
                        disabled={page === 1}
                        onClick={() => goToPage(page - 1)}
                    />

                    <ol className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                            <li key={p}>
                                <PageButton
                                    page={p}
                                    isActive={p === page}
                                    onClick={() => goToPage(p)}
                                />
                            </li>
                        ))}
                    </ol>

                    <PagerArrow
                        direction="next"
                        disabled={page === totalPages}
                        onClick={() => goToPage(page + 1)}
                    />
                </nav>
            )}
        </div>
    );
}

function PageButton({
    page,
    isActive,
    onClick,
}: {
    page: number;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Go to page ${page}`}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'border border-card-border bg-white text-text-secondary hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-sm'
            }`}
            style={{ fontFamily: 'var(--font-mono)' }}
        >
            {page}
        </button>
    );
}

function PagerArrow({
    direction,
    disabled,
    onClick,
}: {
    direction: 'prev' | 'next';
    disabled: boolean;
    onClick: () => void;
}) {
    const isPrev = direction === 'prev';
    const Icon = isPrev ? ChevronLeft : ChevronRight;

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={isPrev ? 'Previous page' : 'Next page'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-card-border bg-white text-text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary hover:shadow-sm disabled:pointer-events-none disabled:opacity-40 disabled:hover:translate-y-0 cursor-pointer"
        >
            <Icon className="h-4.5 w-4.5" />
        </button>
    );
}
