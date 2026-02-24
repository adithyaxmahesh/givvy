import { Inter, Sora } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'Givvy - Hire Top Talent. Pay with Equity.',
  description:
    'The global talent marketplace where startups hire world-class engineers, designers, and marketers with equity compensation. SAFE-powered agreements, AI matching, and milestone-based vesting.',
  openGraph: {
    type: 'website',
    title: 'Givvy - Hire Top Talent. Pay with Equity.',
    description:
      'The global talent marketplace where startups hire world-class talent with equity. SAFE agreements, AI matching, milestone vesting.',
    siteName: 'Givvy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Givvy - Hire Top Talent. Pay with Equity.',
    description:
      'The global talent marketplace where startups hire world-class talent with equity.',
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
    <html lang="en" className={`${inter.variable} ${sora.variable} scroll-smooth`}>
      <body className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
