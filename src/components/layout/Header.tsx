'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Search, PenLine, CalendarClock } from 'lucide-react';
import {
    NAV_LINKS,
    SITE_NAME,
    FEATURES_SECTION_URL,
    PATENT_SEARCH_PAGE_URL,
    AI_DRAFTING_PAGE_URL,
    DOCKETING_PAGE_URL,
} from '@/lib/constants';
import { BookDemoButton } from '@/components/ui/BookDemoModal';
import { BrandLogoLink } from '@/components/ui/BrandLogoLink';

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/* The two flagship product pages, surfaced in the "Features" mega-menu. */
const FEATURE_MENU = [
    {
        label: 'Patent Search',
        href: PATENT_SEARCH_PAGE_URL,
        description: 'Search 120M+ patents free, with compound and clinical-trial intelligence.',
        icon: Search,
    },
    {
        label: 'AI Patent Drafting',
        href: AI_DRAFTING_PAGE_URL,
        description: 'Turn selected prior art into jurisdiction-compliant drafts in minutes.',
        icon: PenLine,
    },
    {
        label: 'Patent Docketing',
        href: DOCKETING_PAGE_URL,
        description: 'Auto-derive every deadline, score it by risk, and never miss a date.',
        icon: CalendarClock,
    },
] as const;

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [featuresOpen, setFeaturesOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    /* Hover open with a small close delay so moving from the trigger to the
       panel doesn't dismiss it. */
    const openFeatures = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setFeaturesOpen(true);
    };
    const closeFeatures = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setFeaturesOpen(false), 120);
    };

    return (
        <>
            {/* Top blur veil - constrained to header width so it doesn't blur
                the tree spine running down the page edges. */}
            <div aria-hidden="true" className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
                <div className="mx-auto w-full max-w-352 px-3 sm:px-4 lg:px-6">
                    <div
                        className="h-24 sm:h-28 backdrop-blur-md"
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 55%, transparent)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent)',
                        }}
                    />
                </div>
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 pt-2 sm:pt-3" role="banner">
                <div className="mx-auto w-full max-w-352 px-3 sm:px-4 lg:px-6">
                    <nav
                        className={`flex items-center h-14 xl:h-16 gap-4 px-3 sm:px-4 xl:pl-6 xl:pr-3 rounded-lg border backdrop-blur-xl transition-all duration-300 ${
                            isScrolled
                                ? 'bg-white/80 shadow-lg shadow-black/5 border-card-border'
                                : 'bg-white/60 shadow-sm border-card-border/50'
                        }`}
                        aria-label="Main navigation"
                    >
                        {/* Logo */}
                        <BrandLogoLink
                            ariaLabel={`${SITE_NAME} - Back to top`}
                            className="group flex shrink-0 items-center no-underline mr-auto xl:mr-0"
                        >
                            <Image
                                src="/logos/dyi-wordmark.svg"
                                alt={SITE_NAME}
                                width={320}
                                height={36}
                                priority
                                className="h-6 w-auto opacity-95 transition-opacity duration-400 ease-out group-hover:opacity-100 sm:h-7 xl:h-8"
                            />
                        </BrandLogoLink>

                        {/* Desktop Nav */}
                        <ul className="hidden xl:flex flex-1 items-center justify-center gap-6 2xl:gap-8">
                            {/* Features mega-menu */}
                            <li
                                className="relative"
                                onMouseEnter={openFeatures}
                                onMouseLeave={closeFeatures}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') setFeaturesOpen(false);
                                }}
                            >
                                <div className="flex items-center gap-0.5">
                                    {/* Label navigates to the Features page */}
                                    <Link
                                        href={FEATURES_SECTION_URL}
                                        className="whitespace-nowrap rounded text-text-primary/70 hover:text-primary transition-colors duration-200 text-[14px] 2xl:text-[15px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        Features
                                    </Link>
                                    {/* Arrow toggles the dropdown */}
                                    <button
                                        type="button"
                                        aria-label="Open features menu"
                                        aria-haspopup="menu"
                                        aria-expanded={featuresOpen}
                                        onClick={() => setFeaturesOpen((v) => !v)}
                                        className="flex items-center rounded p-0.5 text-text-primary/70 hover:text-primary transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    >
                                        <motion.span
                                            className="inline-flex"
                                            animate={{ rotate: featuresOpen ? 180 : 0 }}
                                            transition={{ duration: 0.25, ease: EASE }}
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </motion.span>
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {featuresOpen && (
                                        <motion.div
                                            role="menu"
                                            aria-label="Features"
                                            initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                            transition={{ duration: 0.18, ease: EASE }}
                                            style={{ transformOrigin: 'top left' }}
                                            className="absolute left-0 top-full z-60 mt-3 w-90 rounded-xl border border-card-border bg-white p-2 shadow-xl shadow-black/10"
                                        >
                                            {FEATURE_MENU.map((item, i) => (
                                                <motion.div
                                                    key={item.href}
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2, delay: 0.05 + i * 0.05, ease: EASE }}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        role="menuitem"
                                                        onClick={() => setFeaturesOpen(false)}
                                                        className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-page-bg-alt focus:outline-none focus-visible:bg-page-bg-alt"
                                                    >
                                                        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-100/80 bg-linear-to-br from-indigo-50 via-white to-indigo-50/40">
                                                            <item.icon className="h-4.5 w-4.5 text-primary" />
                                                        </span>
                                                        <span className="min-w-0">
                                                            <span
                                                                className="block text-sm font-semibold text-text-primary"
                                                                style={{ fontFamily: 'var(--font-display)' }}
                                                            >
                                                                {item.label}
                                                            </span>
                                                            <span
                                                                className="mt-0.5 block text-xs leading-relaxed text-text-secondary"
                                                                style={{ fontFamily: 'var(--font-body)' }}
                                                            >
                                                                {item.description}
                                                            </span>
                                                        </span>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>

                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="whitespace-nowrap text-text-primary/70 hover:text-primary transition-colors duration-200 text-[14px] 2xl:text-[15px] font-semibold"
                                        style={{ fontFamily: 'var(--font-body)' }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Desktop CTA */}
                        <div className="hidden xl:flex shrink-0 items-center">
                            <BookDemoButton size="sm" />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            type="button"
                            className="xl:hidden p-2 text-text-primary hover:text-primary transition-colors cursor-pointer rounded-lg"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu - portaled to body to escape header backdrop-filter */}
            {mounted &&
                createPortal(
                    <div
                        id="mobile-menu"
                        className={`fixed inset-0 bg-white z-60 transition-all duration-300 xl:hidden ${
                            isMobileMenuOpen
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 -translate-y-full pointer-events-none'
                        }`}
                        aria-hidden={!isMobileMenuOpen}
                    >
                        {/* Top bar - brand mark + close button */}
                        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 h-16">
                            <BrandLogoLink
                                ariaLabel={`${SITE_NAME} - Back to top`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="group flex items-center no-underline"
                            >
                                <Image
                                    src="/logos/dyi-wordmark.svg"
                                    alt={SITE_NAME}
                                    width={320}
                                    height={36}
                                    className="h-9 w-auto opacity-95 transition-opacity duration-400 ease-out group-hover:opacity-100"
                                />
                            </BrandLogoLink>
                            <button
                                type="button"
                                className="p-2 text-text-primary hover:text-primary transition-colors cursor-pointer"
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
                            {/* Features group */}
                            <div className="flex flex-col items-center gap-4">
                                <Link
                                    href={FEATURES_SECTION_URL}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-primary"
                                    style={{ fontFamily: 'var(--font-mono)' }}
                                >
                                    Features
                                </Link>
                                {FEATURE_MENU.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-2 text-xl font-medium text-text-primary transition-colors hover:text-primary"
                                        style={{ fontFamily: 'var(--font-display)' }}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <item.icon className="h-5 w-5 text-primary" />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Top-level links */}
                            <ul className="flex flex-col items-center gap-5">
                                {NAV_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-xl font-medium text-text-primary hover:text-primary transition-colors"
                                            style={{ fontFamily: 'var(--font-display)' }}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <BookDemoButton size="lg" className="min-w-50" />
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
