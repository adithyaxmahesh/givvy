import Link from 'next/link';
import { IconLinkedIn, IconMail, IconX, IconYouTube } from './icons';
import { Wordmark } from './wordmark';

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'Overview', href: '#platform' },
      { label: 'Equity Marketplace', href: '/marketplace' },
      { label: 'Client Portal', href: '/portal/login' },
      { label: 'Security', href: '#platform' },
      { label: 'Integrations', href: '#platform' },
      { label: 'API', href: '#platform' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'M&A', href: '#services' },
      { label: 'Asset Management', href: '#services' },
      { label: 'Holding Companies', href: '#services' },
      { label: 'Private Markets', href: '#services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Use Cases', href: '#use-cases' },
      { label: 'Insights', href: '#about' },
      { label: 'Guides', href: '#about' },
      { label: 'Customer Stories', href: '#use-cases' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Careers', href: '#contact' },
      { label: 'Press', href: '#contact' },
      { label: 'Contact', href: '#contact' },
    ],
  },
];

const SOCIALS = [
  { label: 'LinkedIn', icon: IconLinkedIn, href: 'https://www.linkedin.com' },
  { label: 'X', icon: IconX, href: 'https://x.com' },
  { label: 'YouTube', icon: IconYouTube, href: 'https://www.youtube.com' },
  { label: 'Email', icon: IconMail, href: 'mailto:hello@givvy.com' },
];

const LEGAL = ['Privacy', 'Terms', 'Cookie Settings'];

export function SiteFooter() {
  return (
    <footer className="bg-au-cream">
      <div className="au-container">
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-au-line/80 pb-3 pt-1 sm:grid-cols-4 lg:grid-cols-[420px_repeat(4,minmax(0,1fr))] lg:gap-x-6">
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <Wordmark />
            <p className="mt-[6px] max-w-[205px] text-[11.5px] leading-[21px] text-au-ink-soft">
              The AI-native investment bank for ownership.
            </p>
            <ul className="mt-3 flex items-center gap-2">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex h-[23px] w-[23px] items-center justify-center rounded-[5px] bg-au-navy text-white transition-colors hover:bg-[#20344F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-2 focus-visible:ring-offset-au-cream"
                  >
                    <Icon className="h-[11px] w-[11px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-[11px] font-semibold leading-[16px] tracking-[-0.005em] text-au-navy">{column.title}</p>
              <ul className="mt-3 space-y-[6px]">
                {column.links.map((link) => (
                  <li key={link.label} className="leading-[16px]">
                    {link.href.startsWith('/') ? (
                      <Link href={link.href} className="text-[11.5px] text-au-ink-soft transition-colors hover:text-au-navy">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-[11.5px] text-au-ink-soft transition-colors hover:text-au-navy">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-au-line/80 py-3 sm:flex-row sm:items-center">
          <p className="text-[10.5px] leading-[16px] text-au-ink-soft">
            © 2024 Givvy Technologies, Inc. All rights reserved.
          </p>
          <ul className="flex items-center gap-6">
            {LEGAL.map((item) => (
              <li key={item} className="leading-[16px]">
                <Link href="#top" className="text-[10.5px] text-au-ink-soft transition-colors hover:text-au-navy">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
