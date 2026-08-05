import { Inter, Newsreader, Sora } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';
import { SiteDisclosure } from '@/components/site-disclosure';
import { ENGAGEMENT, SITE, siteTitle } from '@/lib/site-config';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
});

const TITLE = siteTitle();
const DESCRIPTION = `Sell-side representation for owner-operated businesses from ${ENGAGEMENT.minEnterpriseValue} to ${ENGAGEMENT.maxEnterpriseValue} in enterprise value. Fixed fee, ${ENGAGEMENT.timelineDays} days.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    siteName: SITE.firmName,
    url: SITE.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  other: {
    'theme-color': '#14243D',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE.firmName,
  url: SITE.url,
  email: SITE.contactEmail,
  description: DESCRIPTION,
  serviceType: 'Sell-side mergers and acquisitions advisory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${newsreader.variable} scroll-smooth`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ClientLayout>{children}</ClientLayout>
        <SiteDisclosure />
      </body>
    </html>
  );
}
