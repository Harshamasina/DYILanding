'use client';

import { useId, useRef, useState, type Ref } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '@/lib/faq-data';

function FaqAccordionItem({ item, isOpen, onToggle, hidden = false, buttonRef }: {
    item: FaqItem;
    isOpen: boolean;
    onToggle: () => void;
    /* Collapsed behind "Show all": kept in the DOM (and in the FAQ JSON-LD)
       but hidden from view and from assistive tech. */
    hidden?: boolean;
    buttonRef?: Ref<HTMLButtonElement>;
}) {
    return (
        <div hidden={hidden} className={`border-b border-card-border/60 transition-colors duration-200 ${isOpen ? 'bg-primary/[0.02]' : ''}`}>
            <button
                ref={buttonRef}
                type="button"
                className="w-full flex items-center justify-between py-4 sm:py-5 px-4 sm:px-6 text-left cursor-pointer group"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <span
                    className={`text-sm sm:text-base font-semibold pr-6 transition-colors duration-200 ${
                        isOpen ? 'text-primary' : 'text-text-primary group-hover:text-primary'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {item.question}
                </span>
                <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-all duration-300 ${
                        isOpen ? 'rotate-180 text-primary' : 'text-text-muted'
                    }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 pb-4 sm:pb-5' : 'max-h-0'
                }`}
            >
                <div className="px-4 sm:px-6">
                    <div className="border-l border-primary/30 pl-4">
                        <p
                            className="max-w-[33rem] text-sm leading-relaxed text-text-secondary"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {item.answer}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* initialVisible shows only the first N questions with a "Show all"
   control under them, so long FAQs do not run the page on. Every question
   stays rendered, so search engines still read the full list. */
export function FaqAccordion({ items, initialVisible }: { items: FaqItem[]; initialVisible?: number }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [expanded, setExpanded] = useState(false);
    const firstRevealedRef = useRef<HTMLButtonElement>(null);
    const listId = useId();
    const limit = initialVisible && initialVisible < items.length ? initialVisible : null;

    const toggleAll = () => {
        const next = !expanded;
        setExpanded(next);
        if (next) {
            /* Move focus to the first question just revealed. */
            requestAnimationFrame(() => firstRevealedRef.current?.focus());
        } else if (openIndex !== null && limit !== null && openIndex >= limit) {
            setOpenIndex(null);
        }
    };

    return (
        <div className="max-w-3xl mx-auto rounded-2xl border border-card-border bg-card-bg shadow-sm overflow-hidden">
            <div id={listId}>
                {items.map((item, index) => (
                    <FaqAccordionItem
                        key={item.question}
                        item={item}
                        isOpen={openIndex === index}
                        hidden={limit !== null && !expanded && index >= limit}
                        buttonRef={limit !== null && index === limit ? firstRevealedRef : undefined}
                        onToggle={() =>
                            setOpenIndex(openIndex === index ? null : index)
                        }
                    />
                ))}
            </div>
            {limit !== null && (
                <button
                    type="button"
                    onClick={toggleAll}
                    aria-expanded={expanded}
                    aria-controls={listId}
                    className="flex min-h-11 w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/[0.03] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary [font-family:var(--font-body)]"
                >
                    {expanded ? 'Show fewer questions' : `Show all ${items.length} questions`}
                    <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                </button>
            )}
        </div>
    );
}
