'use client';

import { useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Check, Globe2, Minus } from 'lucide-react';

/* Flag files in public/flags, copied from the tenant app's flag set. EP takes
   the EU flag; WO is an international office, so it takes a globe. */
const FLAG_FILE: Record<string, string> = {
    US: 'us',
    EP: 'eu',
    IN: 'in',
    JP: 'jp',
    CN: 'cn',
    GB: 'gb',
    KR: 'kr',
    CA: 'ca',
    AU: 'au',
    BR: 'br',
};

function OfficeFlag({ code, size }: { code: string; size: 'sm' | 'lg' }) {
    const box = size === 'lg' ? 'h-7 w-10 rounded-[4px]' : 'h-4 w-6 rounded-[3px]';
    const file = FLAG_FILE[code];
    if (!file) {
        return (
            <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center bg-sky-100 text-sky-700 ring-1 ring-black/10 ${box}`}>
                <Globe2 className={size === 'lg' ? 'h-4.5 w-4.5' : 'h-3 w-3'} strokeWidth={1.8} />
            </span>
        );
    }
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`/flags/${file}.svg`}
            alt=""
            width={size === 'lg' ? 40 : 24}
            height={size === 'lg' ? 28 : 16}
            loading="lazy"
            className={`shrink-0 object-cover ring-1 ring-black/10 ${box}`}
        />
    );
}

export interface DraftingOffice {
    code: string;
    authority: string;
    /* A shorter name for the board tile, where the full one would be cut. */
    shortName?: string;
    /* Claim 1 for a new medical use, as the office accepts it: the text before
       the highlighted phrase, the phrase, and the text after it. */
    claim: [string, string, string];
    claimNote: string;
    treatmentDrafted: boolean;
    fact: { label: string; value: string };
    abstractCap: string;
    rules: string;
}

/* An office board and the rule sheet for the office picked. Until someone
   picks one, the board steps through the offices on its own while it is on
   screen; the bar under the active tile shows the time left, and hovering or
   focusing the explorer holds it. Reduced motion turns the stepping off. */
export function JurisdictionRuleExplorer({ offices }: { offices: DraftingOffice[] }) {
    const rootRef = useRef<HTMLDivElement>(null);
    const inView = useInView(rootRef, { amount: 0.35 });
    const reduceMotion = useReducedMotion();
    const [active, setActive] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    const [held, setHeld] = useState(false);

    const stepping = autoplay && !reduceMotion;
    const paused = held || !inView;
    const office = offices[active];

    function choose(index: number) {
        setAutoplay(false);
        setActive(index);
    }

    return (
        <div
            ref={rootRef}
            className={`grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch lg:gap-12 ${paused ? 'explorer-paused' : ''}`}
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocus={() => setHeld(true)}
            onBlur={() => setHeld(false)}
        >
            {/* Office board */}
            <div className="flex">
                <div className="grid flex-1 auto-rows-fr grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
                    {offices.map((o, i) => {
                        const isActive = i === active;
                        return (
                            <button
                                key={o.code}
                                type="button"
                                aria-pressed={isActive}
                                aria-controls={`office-sheet-${o.code}`}
                                onClick={() => choose(i)}
                                className={`group relative flex min-h-[5.75rem] flex-col justify-between overflow-hidden rounded-xl border p-3 text-left transition-[background-color,border-color,box-shadow,translate] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none sm:min-h-[6.25rem] ${
                                    isActive
                                        ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'border-card-border bg-white text-text-primary hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md motion-reduce:hover:translate-y-0'
                                }`}
                            >
                                <OfficeFlag code={o.code} size="sm" />
                                <span className="mt-3 text-2xl font-semibold leading-none [font-family:var(--font-mono)] lg:text-[1.75rem]">
                                    {o.code}
                                </span>
                                <span
                                    className={`mt-1.5 text-xs leading-snug [font-family:var(--font-body)] ${
                                        isActive ? 'text-white/85' : 'text-text-secondary group-hover:text-primary'
                                    }`}
                                >
                                    {o.shortName ?? o.authority}
                                </span>
                                {isActive && stepping ? (
                                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
                                        <span
                                            key={active}
                                            className="explorer-progress block h-full origin-left bg-white"
                                            onAnimationEnd={() => setActive((active + 1) % offices.length)}
                                        />
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                    <div
                        aria-hidden="true"
                        className="relative flex min-h-[5.75rem] flex-col justify-end overflow-hidden rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] p-3 sm:min-h-[6.25rem]"
                    >
                        <span className="lifecycle-dot-grid absolute inset-0" />
                        <span className="relative text-2xl font-semibold leading-none text-primary [font-family:var(--font-mono)]">
                            {offices.length}
                        </span>
                        <span className="relative mt-1 text-xs leading-snug text-text-secondary [font-family:var(--font-body)]">
                            offices, one drafting engine
                        </span>
                    </div>
                </div>
            </div>

            {/* Rule sheet */}
            <div className="relative flex">
                <span aria-hidden="true" className="lifecycle-dot-grid pointer-events-none absolute -inset-8" />
                {offices.map((o) => (
                    <article
                        key={o.code}
                        id={`office-sheet-${o.code}`}
                        hidden={o.code !== office.code}
                        aria-label={`${o.authority} drafting rules`}
                        className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-card-border bg-white shadow-xl shadow-primary/[0.07] lg:min-h-[30rem]"
                    >
                        <header className="flex items-center justify-between gap-4 border-b border-card-border bg-page-bg-alt px-5 py-4 sm:px-7">
                            <div className="flex min-w-0 items-center gap-3">
                                <OfficeFlag code={o.code} size="lg" />
                                <span className="inline-flex h-10 min-w-[3.25rem] items-center justify-center rounded-md bg-primary px-2 text-base font-semibold text-white [font-family:var(--font-mono)]">
                                    {o.code}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-base font-semibold text-text-primary [font-family:var(--font-display)]">
                                        {o.authority}
                                    </p>
                                    <p className="whitespace-nowrap text-xs text-text-muted [font-family:var(--font-mono)]">
                                        {o.code} draft · Claim 1
                                    </p>
                                </div>
                            </div>
                            <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 [font-family:var(--font-body)] sm:inline-flex">
                                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Rules applied
                            </span>
                        </header>

                        <div className="explorer-swap flex flex-1 flex-col px-5 py-6 sm:px-7 sm:py-7">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted [font-family:var(--font-mono)]">
                                A new medical use, in the form this office accepts
                            </p>
                            <blockquote className="mt-3 border-l-2 border-primary pl-4 text-lg leading-relaxed text-text-primary [font-family:var(--font-display)] sm:text-xl">
                                <span className="mr-1.5 text-sm text-text-muted [font-family:var(--font-mono)]">1.</span>
                                {o.claim[0]}
                                <mark className="rounded bg-primary/10 px-0.5 text-primary underline [box-decoration-break:clone] [-webkit-box-decoration-break:clone] decoration-primary/40 decoration-2 underline-offset-4">
                                    {o.claim[1]}
                                </mark>
                                {o.claim[2]}
                            </blockquote>
                            <p className="mt-3 pl-[1.125rem] text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                {o.claimNote}
                            </p>

                            <dl className="mb-6 mt-6 grid overflow-hidden rounded-xl border border-card-border sm:grid-cols-3">
                                <div className="border-b border-card-border p-4 sm:border-b-0 sm:border-r">
                                    <dt className="text-[11px] uppercase tracking-[0.12em] text-text-muted [font-family:var(--font-mono)]">
                                        Methods of treatment
                                    </dt>
                                    <dd className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-text-primary [font-family:var(--font-body)]">
                                        {o.treatmentDrafted ? (
                                            <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" strokeWidth={2.2} />
                                        ) : (
                                            <Minus aria-hidden="true" className="h-4 w-4 text-text-muted" strokeWidth={2.2} />
                                        )}
                                        {o.treatmentDrafted ? 'Drafted' : 'Not drafted'}
                                    </dd>
                                </div>
                                <div className="border-b border-card-border p-4 sm:border-b-0 sm:border-r">
                                    <dt className="text-[11px] uppercase tracking-[0.12em] text-text-muted [font-family:var(--font-mono)]">
                                        {o.fact.label}
                                    </dt>
                                    <dd className="mt-1.5 text-sm font-semibold text-text-primary [font-family:var(--font-body)]">
                                        {o.fact.value}
                                    </dd>
                                </div>
                                <div className="p-4">
                                    <dt className="text-[11px] uppercase tracking-[0.12em] text-text-muted [font-family:var(--font-mono)]">
                                        Abstract cap
                                    </dt>
                                    <dd className="mt-1.5 text-sm font-semibold text-text-primary [font-family:var(--font-body)]">
                                        {o.abstractCap}
                                    </dd>
                                </div>
                            </dl>

                            <p className="mt-auto border-t border-card-border pt-5 text-sm leading-relaxed text-text-secondary [font-family:var(--font-body)]">
                                <span className="font-semibold text-text-primary">Drafting rules: </span>
                                {o.rules}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
