import { Playfair_Display, Libre_Baskerville, IBM_Plex_Mono, DM_Sans, JetBrains_Mono } from 'next/font/google';

export const playfair = Playfair_Display({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-display',
    weight: ['400', '500', '600', '700', '800', '900'],
});

export const baskerville = Libre_Baskerville({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body',
    weight: ['400', '700'],
});

export const ibmPlexMono = IBM_Plex_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-mono',
    weight: ['400', '500', '600'],
});

/* Dashboard fonts — used only in the below-the-fold animated UI mockups that
   mirror the real product. preload: false keeps them out of the initial font
   preload set so they never compete with the hero's LCP fonts; they load on
   demand (display: swap) when their mockups paint. */
export const dmSans = DM_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-dashboard',
    weight: ['400', '500', '600', '700'],
    preload: false,
});

export const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-dashboard-mono',
    weight: ['400', '500', '600'],
    preload: false,
});
