import type { Metadata } from 'next';
import { playfair, baskerville, ibmPlexMono, dmSans, jetbrainsMono } from '@/lib/fonts';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { TreeSpine } from '@/components/motion/TreeSpine';
import { StickyWatchDemo } from '@/components/ui/StickyWatchDemo';
import '@/styles/globals.css';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: `${SITE_NAME} | IP Management Software for Law Firms & Pharma`,
    description: SITE_DESCRIPTION,
    openGraph: {
        title: `${SITE_NAME} | IP Management Software for Law Firms & Pharma`,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        siteName: SITE_NAME,
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Design Your Invention — Compliance-Native IP Portfolio Management',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} | IP Management Software for Law Firms & Pharma`,
        description: SITE_DESCRIPTION,
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: SITE_URL,
    },
    icons: {
        icon: [
            { url: '/icon.svg', type: 'image/svg+xml' },
            { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
        ],
        shortcut: '/favicon.ico',
        apple: '/apple-icon.png',
    },
    other: {
        'theme-color': '#6366f1',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${playfair.variable} ${baskerville.variable} ${ibmPlexMono.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
        >
            <body>
                <a href="#main-content" className="skip-to-content">
                    Skip to content
                </a>
                <JsonLd />
                <div className="flex min-h-screen flex-col bg-page-bg">
                    <Header />
                    <div className="relative flex-1 bg-page-bg">
                        <TreeSpine />
                        {children}
                    </div>
                    <Footer />
                </div>
                <StickyWatchDemo />
            </body>
        </html>
    );
}
