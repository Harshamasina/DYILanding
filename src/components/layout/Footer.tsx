import Link from 'next/link';
import Image from 'next/image';
import {
    ShieldCheck,
    FileCheck,
    Building2,
    Lock,
    Fingerprint,
    Server,
    Sparkles,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { BrandLogoLink } from '@/components/ui/BrandLogoLink';
import { SITE_NAME } from '@/lib/constants';
import { getLatestPosts } from '@/content/blog';

function LinkedInIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function XSocialIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function YouTubeIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}

// AI assistant brand marks (monochrome, single-path, inherit currentColor).
// Sourced from simple-icons (OpenAI, Claude, Gemini, Perplexity) and lobehub
// icons (Grok) so the marks stay accurate to each brand.
function ChatGptIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
        </svg>
    );
}

function ClaudeIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
        </svg>
    );
}

function GeminiIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
        </svg>
    );
}

function PerplexityIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z" />
        </svg>
    );
}

function GrokIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" clipRule="evenodd" className={className} aria-hidden="true">
            <path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815" />
        </svg>
    );
}

const TRUST_BADGES = [
    { icon: ShieldCheck, label: 'SOC 2-Aligned Controls' },
    { icon: FileCheck, label: '21 CFR Part 11-Ready' },
    { icon: Building2, label: 'Enterprise SSO' },
    { icon: Lock, label: 'AES-256 Encryption' },
    { icon: Fingerprint, label: 'MFA Support' },
    { icon: Server, label: 'Encrypted Infrastructure' },
];

const STATIC_FOOTER_LINKS = {
    Product: [
        { label: 'Features', href: '/#features' },
        { label: 'Patent Search', href: '/patent-search/' },
        { label: 'AI Patent Drafting', href: '/ai-patent-drafting/' },
        { label: 'Patent Docketing', href: '/docketing/' },
        { label: 'Compare vs Legacy IPMS', href: '/compare/' },
        { label: 'Compliance', href: '/#compliance' },
        { label: 'Pricing', href: '/#pricing' },
    ],
    Company: [
        { label: 'Contact', href: '/#contact' },
        { label: 'Careers', href: '/careers/' },
        { label: 'FAQ', href: '/faq/' },
        { label: 'Support', href: '/support/' },
    ],
    Legal: [
        { label: 'Privacy Policy', href: '/privacy/' },
        { label: 'Terms of Service', href: '/terms/' },
    ],
} as const;

const SOCIAL_LINKS = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/design-your-invention/', icon: LinkedInIcon },
    { label: 'X', href: '#', icon: XSocialIcon },
    { label: 'YouTube', href: '#', icon: YouTubeIcon },
] as const;

// "Ask AI about us" deep links. Each button opens the AI chat with this query
// pre-filled, prompting the model to describe the platform. The wording mirrors
// public/llms.txt so search-grounded answers stay accurate instead of guessed.
// Keep it factual and keyword-rich; no em-dashes or en-dashes (CLAUDE.md rule 35).
const ASK_AI_PROMPT =
    'Tell me about Design Your Invention (designyourinvention.com), an IP management ' +
    'software platform for pharma companies and IP boutique law firms. What does it ' +
    'offer for multi-jurisdiction patent docketing, prior art search, and AI-assisted ' +
    'patent drafting, and who is it for?';

const ASK_AI_QUERY = encodeURIComponent(ASK_AI_PROMPT);

// Gemini has no public URL prefill, so its button routes to Google AI Mode
// (udm=50), which Gemini powers. AI Mode answers more concisely than the chat
// apps, so we hand it a longer, explicitly detailed query that enumerates the
// subtopics to expand. This coaxes a fuller answer than the shared prompt would.
const ASK_AI_GEMINI_PROMPT =
    'Give a detailed, comprehensive overview of Design Your Invention ' +
    '(designyourinvention.com), an IP management software platform for pharma ' +
    'companies and IP boutique law firms. Explain in depth what it offers for ' +
    'multi-jurisdiction patent docketing, prior art search across 100+ ' +
    'jurisdictions, AI-assisted patent drafting, and FDA 21 CFR Part 11 ' +
    'compliance. Cover who it is for and how it compares to legacy IPMS tools.';

const ASK_AI_GEMINI_QUERY = encodeURIComponent(ASK_AI_GEMINI_PROMPT);

// URL shapes that pre-fill a prompt for each assistant. ChatGPT uses hints=search
// so it grounds the answer on the live web.
const ASK_AI_LINKS = [
    { label: 'ChatGPT', icon: ChatGptIcon, href: `https://chatgpt.com/?hints=search&q=${ASK_AI_QUERY}` },
    { label: 'Claude', icon: ClaudeIcon, href: `https://claude.ai/new?q=${ASK_AI_QUERY}` },
    { label: 'Gemini', icon: GeminiIcon, href: `https://www.google.com/search?udm=50&q=${ASK_AI_GEMINI_QUERY}` },
    { label: 'Perplexity', icon: PerplexityIcon, href: `https://www.perplexity.ai/search?q=${ASK_AI_QUERY}` },
    { label: 'Grok', icon: GrokIcon, href: `https://grok.com/?q=${ASK_AI_QUERY}` },
] as const;

// Icon-only buttons that expand on hover/focus to reveal the assistant name.
// On touch screens (below lg, no hover) the label stays visible so the icons are
// never a mystery; from lg up the button collapses to a circle and the name
// slides in smoothly. The label is always in the DOM, so screen readers and the
// aria-label keep it accessible even while visually collapsed.
// Premium, layered reveal. The pill opens with a slow easeOutQuint curve
// (transition-[max-width,margin] on the outer span); the label then glides in
// and fades up with a short delay (inner span) so the motion is staggered, not a
// single snap. Colours ease over a matching window. Closing reverses with no
// delay so it feels responsive. motion-reduce disables all of it.
const ASK_AI_BUTTON_CLASS =
    'group inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/4 p-2.5 text-text-on-dark/70 no-underline transition-colors duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary-light/40 hover:bg-primary-light/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light';
const ASK_AI_ICON_CLASS =
    'h-5 w-5 shrink-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:group-hover:scale-100';
const ASK_AI_LABEL_CLASS =
    'ml-1.5 max-w-[8rem] overflow-hidden transition-[max-width,margin] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:ml-0 lg:max-w-0 lg:group-hover:ml-1.5 lg:group-hover:max-w-[8rem] lg:group-focus-within:ml-1.5 lg:group-focus-within:max-w-[8rem] motion-reduce:transition-none';
const ASK_AI_LABEL_TEXT_CLASS =
    'block whitespace-nowrap text-xs font-semibold opacity-100 transition-[opacity,transform] duration-[400ms] ease-out lg:-translate-x-1 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100 lg:group-hover:delay-150 lg:group-focus-within:translate-x-0 lg:group-focus-within:opacity-100 lg:group-focus-within:delay-150 motion-reduce:translate-x-0 motion-reduce:transition-none';

export function Footer() {
    const currentYear = new Date().getFullYear();

    // Build Resources column dynamically: latest 4 blog posts + index link.
    // Re-evaluated at build time so the footer always reflects the newest posts.
    const latestPosts = getLatestPosts(4);
    const resourcesLinks = [
        ...latestPosts.map((p) => ({
            label: p.shortTitle ?? p.title,
            href: `/blog/${p.slug}/`,
        })),
        { label: 'Blog', href: '/blog/' },
    ];

    const footerColumns: Array<{
        category: string;
        links: ReadonlyArray<{ label: string; href: string }>;
    }> = [
        { category: 'Product', links: STATIC_FOOTER_LINKS.Product },
        { category: 'Resources', links: resourcesLinks },
        { category: 'Company', links: STATIC_FOOTER_LINKS.Company },
        { category: 'Legal', links: STATIC_FOOTER_LINKS.Legal },
    ];

    return (
        <div>
            {/* ── Trust Card — sits on white bg, bottom half overlaps into footer ── */}
            <div className="relative z-10 pb-0">
                <Container>
                    <div className="rounded-2xl border border-primary/15 bg-navy-light p-8 sm:p-10 lg:p-12 shadow-2xl shadow-primary/10 mb-12 sm:-mb-35">
                        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                            {/* Left: Trust Badges */}
                            <div className="flex-[3]">
                                <p
                                    id="tree-end"
                                    className="text-xs font-bold uppercase tracking-[0.15em] text-primary-light mb-4"
                                    style={{ fontFamily: 'var(--font-mono)' }}
                                >
                                    Enterprise Trust
                                </p>
                                <h3
                                    className="text-xl sm:text-2xl font-bold text-white mb-6"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    Built for teams that can&apos;t afford to compromise on security
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {TRUST_BADGES.map((badge) => (
                                        <div
                                            key={badge.label}
                                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/4"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-primary-light/10 flex items-center justify-center shrink-0">
                                                <badge.icon className="w-4 h-4 text-primary-light" />
                                            </div>
                                            <span
                                                className="text-[11px] sm:text-xs font-semibold text-white/80"
                                                style={{ fontFamily: 'var(--font-mono)' }}
                                            >
                                                {badge.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Testimonial */}
                            <div className="flex-[2] flex flex-col justify-center">
                                <div className="border-l-2 border-primary-light/30 pl-6">
                                    <svg className="w-8 h-8 text-primary-light/20 mb-4" fill="currentColor" viewBox="0 0 32 32">
                                        <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                                    </svg>
                                    <blockquote>
                                        <p
                                            className="text-base sm:text-lg text-white/90 leading-relaxed italic"
                                            style={{ fontFamily: 'var(--font-body)' }}
                                        >
                                            Built for regulated patent teams handling
                                            confidential invention data, audit-sensitive
                                            workflows, and multi-jurisdiction portfolios.
                                        </p>
                                    </blockquote>
                                    <div className="mt-5 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary-light" style={{ fontFamily: 'var(--font-mono)' }}>
                                                DI
                                            </span>
                                        </div>
                                        <div>
                                            <p
                                                className="text-sm font-semibold text-white"
                                                style={{ fontFamily: 'var(--font-display)' }}
                                            >
                                                Design Your Invention Team
                                            </p>
                                            <p
                                                className="text-xs text-white/40"
                                                style={{ fontFamily: 'var(--font-body)' }}
                                            >
                                                IP Management Platform
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Container>
            </div>

            {/* ── Footer — dark navy. From sm+ the trust card overlaps via
                negative margin, so we pad the top heavily; on mobile the card
                sits in normal flow so we use a smaller, conventional pt. ── */}
            <footer className="bg-navy text-text-on-dark pt-16 sm:pt-48" role="contentinfo">
                <Container>
                    {/* Footer Links Grid */}
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-6 lg:gap-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2 lg:pr-4 min-w-0">
                            <BrandLogoLink
                                ariaLabel={`${SITE_NAME} — Back to top`}
                                className="group inline-flex items-center gap-5 no-underline"
                            >
                                <Image
                                    src="/logos/dyi-logo-mark.svg"
                                    alt=""
                                    width={128}
                                    height={128}
                                    className="h-24 w-24 shrink-0 opacity-95 transition-opacity duration-400 ease-out group-hover:opacity-100 sm:h-28 sm:w-28"
                                />
                                <span
                                    className="text-2xl font-bold tracking-tight text-white transition-colors duration-400 ease-out group-hover:text-primary-light sm:text-[1.6rem]"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {SITE_NAME}
                                </span>
                            </BrandLogoLink>
                            <p
                                className="mt-5 text-[15px] leading-relaxed text-text-on-dark/60 max-w-md"
                                style={{ fontFamily: 'var(--font-body)' }}
                            >
                                Compliance-native patent operations software for law
                                firms, pharma teams, and biotech companies
                                combining docketing, portfolio management, AI-assisted
                                drafting, and audit-ready workflows in one secure
                                platform.
                            </p>

                            {/* Social Icons */}
                            <div className="mt-8 flex items-center gap-5">
                                {SOCIAL_LINKS.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="text-text-on-dark/40 hover:text-primary-light transition-colors duration-200"
                                        aria-label={`Follow us on ${social.label}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <social.icon className="w-5.5 h-5.5" />
                                    </a>
                                ))}
                            </div>

                            {/* Ask AI About Us - GEO / AI-visibility deep links.
                                Grouped with the social links as a "learn about
                                us" action. Icon-only on desktop, expanding to the
                                assistant name on hover/focus; labels stay visible
                                on mobile where there is no hover. */}
                            <div className="mt-8">
                                <div className="mb-3 flex items-center gap-2">
                                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary-light" />
                                    <span
                                        className="text-xs font-bold uppercase tracking-[0.15em] text-primary-light"
                                        style={{ fontFamily: 'var(--font-mono)' }}
                                    >
                                        Ask AI about us
                                    </span>
                                </div>
                                <div
                                    className="flex flex-wrap items-center gap-2 lg:flex-nowrap"
                                    style={{ fontFamily: 'var(--font-mono)' }}
                                >
                                    {ASK_AI_LINKS.map((ai) => (
                                        <a
                                            key={ai.label}
                                            href={ai.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Ask ${ai.label} about ${SITE_NAME}`}
                                            title={ASK_AI_PROMPT}
                                            className={ASK_AI_BUTTON_CLASS}
                                        >
                                            <ai.icon className={ASK_AI_ICON_CLASS} />
                                            <span className={ASK_AI_LABEL_CLASS}>
                                                <span className={ASK_AI_LABEL_TEXT_CLASS}>{ai.label}</span>
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Link Columns */}
                        {footerColumns.map(({ category, links }) => (
                            <div key={category}>
                                <h3
                                    className="text-xs font-bold uppercase tracking-[0.15em] text-primary-light mb-5"
                                    style={{ fontFamily: 'var(--font-display)' }}
                                >
                                    {category}
                                </h3>
                                <ul className="space-y-3.5">
                                    {links.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-text-on-dark/60 hover:text-white transition-colors duration-200 no-underline"
                                                style={{ fontFamily: 'var(--font-body)' }}
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Copyright Bar */}
                    <div className="border-t border-white/10 mt-16 py-8">
                        <p
                            className="text-xs text-text-on-dark/40 text-center"
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            &copy; {currentYear} {SITE_NAME}. All rights reserved.
                        </p>
                    </div>
                </Container>
            </footer>
        </div>
    );
}
