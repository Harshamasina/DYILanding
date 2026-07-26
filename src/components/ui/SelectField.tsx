'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
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

/** Height reserved for the panel when deciding whether to open upward. */
const PANEL_ESTIMATE_PX = 264;

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
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const typeahead = useRef({ buffer: '', timer: 0 });

    const [open, setOpen] = useState(false);
    const [openUp, setOpenUp] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const placeholder =
        options.find((o) => o.value === '')?.label ?? 'Select an option';
    const items = options.filter((o) => o.value !== '');
    const selectedIndex = items.findIndex((o) => o.value === value);
    const selected = selectedIndex >= 0 ? items[selectedIndex] : undefined;

    const close = useCallback((refocus = true) => {
        setOpen(false);
        if (refocus) buttonRef.current?.focus();
    }, []);

    /* Open toward whichever side has room. The demo modal is a scroll
       container, so a panel that always dropped down would push the form
       and trap the last field's options against the modal edge. */
    const openPanel = useCallback(() => {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
            const below = window.innerHeight - rect.bottom;
            setOpenUp(below < PANEL_ESTIMATE_PX && rect.top > below);
        }
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        setOpen(true);
    }, [selectedIndex]);

    // Dismiss on any pointer press outside the field.
    useEffect(() => {
        if (!open) return;

        function onPointerDown(event: PointerEvent) {
            if (!containerRef.current?.contains(event.target as Node)) {
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
                className={`block text-sm font-semibold text-text-primary ${labelSpacing}`}
                style={{ fontFamily: 'var(--font-display)' }}
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
                className={`group relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-white/70 text-left text-sm backdrop-blur-md transition-[color,background-color,border-color,box-shadow] duration-200 focus:outline-none ${triggerPadding} ${
                    error
                        ? 'border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-2 focus-visible:ring-danger/20'
                        : open
                          ? 'border-primary/50 bg-white/90 shadow-lg shadow-primary/[0.07] ring-2 ring-primary/15'
                          : 'border-card-border hover:border-primary/35 hover:bg-white/90 hover:shadow-md hover:shadow-primary/[0.06] focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20'
                }`}
                style={{ fontFamily: 'var(--font-body)' }}
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

            <AnimatePresence>
                {open && (
                    <motion.div
                        className={`absolute left-0 right-0 z-50 ${
                            openUp ? 'bottom-full mb-2' : 'top-full mt-2'
                        }`}
                        initial={{ opacity: 0, y: openUp ? 6 : -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: openUp ? 4 : -4, scale: 0.98 }}
                        transition={
                            reduceMotion
                                ? { duration: 0 }
                                : { duration: 0.18, ease: EASE }
                        }
                        style={{ transformOrigin: openUp ? 'bottom center' : 'top center' }}
                    >
                        {/* Frosted panel: translucent white over a blur, with an
                            indigo sheen at the top edge so it reads as glass
                            rather than a flat dropdown. */}
                        <div className="relative overflow-hidden rounded-xl border border-white/70 bg-white/80 shadow-[0_24px_48px_-16px_rgba(15,23,42,0.28)] ring-1 ring-primary/10 backdrop-blur-xl">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-primary/[0.07] to-transparent"
                            />
                            <ul
                                ref={listRef}
                                id={listId}
                                role="listbox"
                                aria-labelledby={labelId}
                                className="relative max-h-60 overflow-y-auto overscroll-contain p-1.5"
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
                                            initial={
                                                reduceMotion
                                                    ? false
                                                    : { opacity: 0, y: openUp ? 3 : -3 }
                                            }
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={
                                                reduceMotion
                                                    ? { duration: 0 }
                                                    : {
                                                          duration: 0.16,
                                                          ease: EASE,
                                                          delay: Math.min(index * 0.022, 0.12),
                                                      }
                                            }
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onClick={() => commit(index)}
                                            className={`relative flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
                                                isActive
                                                    ? 'bg-primary/[0.09] text-primary'
                                                    : isSelected
                                                      ? 'text-primary'
                                                      : 'text-text-secondary'
                                            }`}
                                            style={{ fontFamily: 'var(--font-body)' }}
                                        >
                                            {/* Left accent bar grows in on the active row */}
                                            <motion.span
                                                aria-hidden="true"
                                                className="absolute left-0 top-1/2 w-0.5 -translate-y-1/2 rounded-full bg-primary"
                                                initial={false}
                                                animate={{
                                                    height: isActive ? 18 : 0,
                                                    opacity: isActive ? 1 : 0,
                                                }}
                                                transition={
                                                    reduceMotion
                                                        ? { duration: 0 }
                                                        : { duration: 0.18, ease: EASE }
                                                }
                                            />
                                            <span className="truncate">{option.label}</span>
                                            {isSelected && (
                                                <Check
                                                    aria-hidden="true"
                                                    className="h-4 w-4 shrink-0 text-primary"
                                                />
                                            )}
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="mt-1.5 text-xs text-danger"
                    style={{ fontFamily: 'var(--font-body)' }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}
