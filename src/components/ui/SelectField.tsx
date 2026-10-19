'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────
   SelectField
   ──────────────────────────────────────────────────────────────────────
   Accessible listbox replacement for the native <select> used across the
   contact and demo forms. A native select cannot be styled past its box:
   the option list is drawn by the OS, so it ignores the brand palette,
   fonts, and motion language entirely.

   This renders the trigger and the panel ourselves (frosted glass, indigo
   accents, Playfair label, spring-free easing) while keeping the semantics
   a native select provides:
     - role="combobox" trigger + role="listbox" panel with aria-activedescendant
     - full keyboard control: arrows, Home/End, Enter/Space, Escape, typeahead
     - a hidden input so the value still lives in the form's DOM

   Focus stays on the trigger the whole time (aria-activedescendant pattern),
   which keeps Escape and Tab behaviour predictable inside the demo modal.

   The panel is portalled to <body> with fixed positioning, so a scrolling
   or overflow-hidden ancestor (the demo modal body) can never clip it. It
   opens toward whichever side of the viewport has more room, sizes its
   height to that room, and follows the trigger while anything scrolls.
   ────────────────────────────────────────────────────────────────────── */

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    /** Form field name. Also used for the hidden input that carries the value. */
    name: string;
    value: string;
    /** First option with an empty value is treated as the placeholder. */
    options: ReadonlyArray<SelectOption>;
    onChange: (value: string) => void;
    required?: boolean;
    error?: string;
    /** 'md' matches the contact card inputs, 'sm' the tighter modal inputs. */
    size?: 'sm' | 'md';
}

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/** Tallest the panel grows before its list scrolls. */
const PANEL_MAX_PX = 280;
/** Gap between trigger and panel, and the minimum margin to the viewport edge. */
const PANEL_GAP_PX = 8;
const VIEWPORT_MARGIN_PX = 12;
/** One option row (py-2.5 plus a text-sm line) and the list's p-1.5 padding. */
const OPTION_ROW_PX = 42;
const LIST_PADDING_PX = 12;

interface PanelPlacement {
    left: number;
    width: number;
    /** Distance from the viewport top (opening down) or bottom (opening up). */
    offset: number;
    up: boolean;
    maxHeight: number;
}

export function SelectField({
    label,
    name,
    value,
    options,
    onChange,
    required,
    error,
    size = 'md',
}: SelectFieldProps) {
    const reduceMotion = useReducedMotion();
    const uid = useId();
    const buttonId = `${uid}-${name}-trigger`;
    const listId = `${uid}-${name}-list`;
    const labelId = `${uid}-${name}-label`;
    const errorId = `${uid}-${name}-error`;

    const containerRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const typeahead = useRef({ buffer: '', timer: 0 });

    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<PanelPlacement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    // The portal needs document.body, which does not exist during SSR.
    useEffect(() => setMounted(true), []);

    const placeholder =
        options.find((o) => o.value === '')?.label ?? 'Select an option';
    const items = options.filter((o) => o.value !== '');
    const selectedIndex = items.findIndex((o) => o.value === value);
    const selected = selectedIndex >= 0 ? items[selectedIndex] : undefined;

    const close = useCallback((refocus = true) => {
        setOpen(false);
        if (refocus) buttonRef.current?.focus();
    }, []);

    const itemCount = items.length;

    /* Measure against the viewport, not any scroll container: the panel is
       fixed to <body>, so the viewport is the only edge that can cut it. */
    const place = useCallback(() => {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (!rect) return;
        const wanted = Math.min(PANEL_MAX_PX, itemCount * OPTION_ROW_PX + LIST_PADDING_PX);
        const below = window.innerHeight - rect.bottom - PANEL_GAP_PX - VIEWPORT_MARGIN_PX;
        const above = rect.top - PANEL_GAP_PX - VIEWPORT_MARGIN_PX;
        const up = below < wanted && above > below;
        setPlacement({
            left: rect.left,
            width: rect.width,
            offset: up ? window.innerHeight - rect.top + PANEL_GAP_PX : rect.bottom + PANEL_GAP_PX,
            up,
            maxHeight: Math.max(OPTION_ROW_PX * 2, Math.min(wanted, up ? above : below)),
        });
    }, [itemCount]);

    const openPanel = useCallback(() => {
        place();
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        setOpen(true);
    }, [place, selectedIndex]);

    /* Follow the trigger while the page or the modal body scrolls, and on
       resize. Capture catches scrolls on any ancestor, not just window. */
    useLayoutEffect(() => {
        if (!open) return;
        let frame = 0;
        const schedule = (event?: Event) => {
            // Scrolling inside the list itself does not move the trigger.
            if (event && panelRef.current?.contains(event.target as Node)) return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(place);
        };
        window.addEventListener('scroll', schedule, true);
        window.addEventListener('resize', schedule);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', schedule, true);
            window.removeEventListener('resize', schedule);
        };
    }, [open, place]);

    // Dismiss on any pointer press outside the field.
    useEffect(() => {
        if (!open) return;

        function onPointerDown(event: PointerEvent) {
            const target = event.target as Node;
            if (!containerRef.current?.contains(target) && !panelRef.current?.contains(target)) {
                setOpen(false);
            }
        }

        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open]);

    // Keep the active option in view while arrowing through a long list.
    useEffect(() => {
        if (!open) return;
        listRef.current
            ?.querySelector<HTMLLIElement>('[data-active="true"]')
            ?.scrollIntoView({ block: 'nearest' });
    }, [open, activeIndex]);

    function commit(index: number) {
        const option = items[index];
        if (!option) return;
        onChange(option.value);
        close();
    }

    /** Jump to the next option whose label starts with the typed characters. */
    function runTypeahead(char: string) {
        window.clearTimeout(typeahead.current.timer);
        typeahead.current.buffer += char.toLowerCase();
        typeahead.current.timer = window.setTimeout(() => {
            typeahead.current.buffer = '';
        }, 600);

        const query = typeahead.current.buffer;
        const from = open ? activeIndex + 1 : selectedIndex + 1;
        const ordered = [
            ...items.slice(from),
            ...items.slice(0, Math.max(from, 0)),
        ];
        const match = ordered.find((o) => o.label.toLowerCase().startsWith(query));
        if (!match) return;

        const index = items.indexOf(match);
        if (open) {
            setActiveIndex(index);
        } else {
            onChange(match.value);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
        const { key } = event;

        if (key === 'Escape') {
            if (!open) return;
            // The demo modal listens for Escape on document; swallow it here
            // so the first press closes the dropdown, not the whole dialog.
            event.preventDefault();
            event.stopPropagation();
            close();
            return;
        }

        if (key === 'Tab') {
            if (open) setOpen(false);
            return;
        }

        if (!open) {
            if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
                event.preventDefault();
                openPanel();
            } else if (key.length === 1 && /\S/.test(key)) {
                event.preventDefault();
                runTypeahead(key);
            }
            return;
        }

        switch (key) {
            case 'ArrowDown':
                event.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, items.length - 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
                break;
            case 'Home':
                event.preventDefault();
                setActiveIndex(0);
                break;
            case 'End':
                event.preventDefault();
                setActiveIndex(items.length - 1);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                commit(activeIndex);
                break;
            default:
                if (key.length === 1 && /\S/.test(key)) {
                    event.preventDefault();
                    runTypeahead(key);
                }
        }
    }

    const triggerPadding = size === 'sm' ? 'px-4 py-2.5' : 'px-4 py-3';
    const labelSpacing = size === 'sm' ? 'mb-1.5' : 'mb-2';

    return (
        <div ref={containerRef} className="relative">
            <label
                id={labelId}
                htmlFor={buttonId}
                className={`block text-sm font-semibold text-text-primary [font-family:var(--font-display)] ${labelSpacing}`}
            >
                {label}
            </label>

            {/* Value carrier: keeps the field readable from the form DOM and
                from browser autofill tooling, which a div-based control loses. */}
            <input type="hidden" name={name} value={value} />

            <button
                ref={buttonRef}
                id={buttonId}
                type="button"
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={open ? listId : undefined}
                aria-labelledby={`${labelId} ${buttonId}`}
                aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                onClick={() => (open ? close(false) : openPanel())}
                onKeyDown={handleKeyDown}
                className={`group relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-white/70 text-left text-sm backdrop-blur-md transition-[color,background-color,border-color,box-shadow] duration-200 [font-family:var(--font-body)] focus:outline-none ${triggerPadding} ${
                    error
                        ? 'border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-2 focus-visible:ring-danger/20'
                        : open
                          ? 'border-primary/50 bg-white/90 shadow-lg shadow-primary/[0.07] ring-2 ring-primary/15'
                          : 'border-card-border hover:border-primary/35 hover:bg-white/90 hover:shadow-md hover:shadow-primary/[0.06] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                }`}
            >
                <span
                    className={`truncate transition-colors duration-200 ${
                        selected ? 'text-text-primary' : 'text-text-muted'
                    }`}
                >
                    {selected?.label ?? placeholder}
                </span>
                <motion.span
                    aria-hidden="true"
                    className="shrink-0 text-text-muted transition-colors duration-200 group-hover:text-primary"
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: EASE }}
                >
                    <ChevronDown className="h-4 w-4" />
                </motion.span>
            </button>

            {mounted && createPortal(
                <AnimatePresence>
                    {open && placement && (
                        <motion.div
                            ref={panelRef}
                            className={`fixed z-[110] ${placement.up ? 'origin-bottom' : 'origin-top'}`}
                            style={{
                                left: placement.left,
                                width: placement.width,
                                ...(placement.up ? { bottom: placement.offset } : { top: placement.offset }),
                            }}
                            initial={{ opacity: 0, y: placement.up ? 6 : -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: placement.up ? 4 : -4, scale: 0.98 }}
                            transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: EASE }}
                        >
                            {/* Frosted panel: translucent white over a blur, with an
                                indigo sheen at the top edge so it reads as glass
                                rather than a flat dropdown. */}
                            <div className="relative overflow-hidden rounded-xl border border-white/70 bg-white/90 shadow-[0_24px_48px_-16px_rgba(15,23,42,0.28)] ring-1 ring-primary/10 backdrop-blur-xl">
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-primary/[0.07] to-transparent"
                                />
                                <ul
                                    ref={listRef}
                                    id={listId}
                                    role="listbox"
                                    aria-labelledby={labelId}
                                    className="relative overflow-y-auto overscroll-contain p-1.5"
                                    style={{ maxHeight: placement.maxHeight }}
                                >
                                    {items.map((option, index) => {
                                        const isActive = index === activeIndex;
                                        const isSelected = option.value === value;

                                        return (
                                            <motion.li
                                                key={option.value}
                                                id={`${listId}-${index}`}
                                                role="option"
                                                aria-selected={isSelected}
                                                data-active={isActive}
                                                initial={reduceMotion ? false : { opacity: 0, y: placement.up ? 3 : -3 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={
                                                    reduceMotion
                                                        ? { duration: 0 }
                                                        : { duration: 0.16, ease: EASE, delay: Math.min(index * 0.022, 0.12) }
                                                }
                                                onMouseEnter={() => setActiveIndex(index)}
                                                onClick={() => commit(index)}
                                                className={`relative flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 [font-family:var(--font-body)] ${
                                                    isActive
                                                        ? 'bg-primary/[0.09] text-primary'
                                                        : isSelected
                                                          ? 'text-primary'
                                                          : 'text-text-secondary'
                                                }`}
                                            >
                                                {/* Left accent bar grows in on the active row */}
                                                <motion.span
                                                    aria-hidden="true"
                                                    className="absolute left-0 top-1/2 w-0.5 -translate-y-1/2 rounded-full bg-primary"
                                                    initial={false}
                                                    animate={{ height: isActive ? 18 : 0, opacity: isActive ? 1 : 0 }}
                                                    transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: EASE }}
                                                />
                                                <span className="truncate">{option.label}</span>
                                                {isSelected && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />}
                                            </motion.li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body,
            )}

            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="mt-1.5 text-xs text-danger [font-family:var(--font-body)]"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
