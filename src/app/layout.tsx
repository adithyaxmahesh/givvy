import { Inter, Newsreader, Sora } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';
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

export const metadata: Metadata = {
  title: 'Givvy - Hire Fractional Talent with Cash or Equity.',
  description:
    'The global marketplace where startups hire fractional CFOs, SDRs, operators, engineers, and advisors with cash, equity, or blended compensation. SAFE-powered agreements, AI matching, and milestone-based vesting.',
  openGraph: {
    type: 'website',
    title: 'Givvy - Hire Fractional Talent with Cash or Equity.',
    description:
      'The global talent marketplace where startups hire world-class fractional talent with cash, equity, or blended compensation.',
    siteName: 'Givvy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Givvy - Hire Fractional Talent with Cash or Equity.',
    description:
      'The global talent marketplace where startups hire world-class fractional talent with cash, equity, or blended compensation.',
  },
  other: {
    'theme-color': '#7c3aed',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${newsreader.variable} scroll-smooth`}>
      <body className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
