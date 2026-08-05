import Link from 'next/link';
import { ENGAGEMENT, SITE, SOCIAL_LINKS } from '@/lib/site-config';
import { IconMail } from './icons';
import { Wordmark } from './wordmark';

// Every link resolves to a real page. Placeholder anchors were removed rather
// than pointed at #top, which is how the previous footer advertised pages and
// capabilities that did not exist.
const COLUMNS = [
  {
    title: 'Sellers',
    links: [
      { label: 'What we do', href: '/services/ma' },
      { label: 'Startups', href: '/services/startups' },
    ],
  },
  {
    title: 'Buyers',
    links: [{ label: 'Opportunities', href: '/opportunities' }],
  },
  {
    title: 'Sign in',
    links: [
      // Operator-approved exception. "Equity Marketplace" is on the forbidden
      // copy list because the phrase describes a venue where private
      // securities change hands. It is permitted here, and only here, via
      // complianceExempt — which keeps the build check failing on every other
      // occurrence instead of switching the guard off wholesale.
      { label: 'Equity Marketplace', href: '/dashboard/browse', complianceExempt: true },
      { label: 'Client portal', href: '/portal/login' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Disclosures', href: '/legal/disclosures' },
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
];

const CONTACT = { label: 'Email', href: `mailto:${SITE.contactEmail}` };

export function SiteFooter() {
  return (
    <footer className="bg-au-cream">
      <div className="au-container">
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-au-line/80 pb-3 pt-1 sm:grid-cols-4 lg:grid-cols-[380px_repeat(4,minmax(0,1fr))] lg:gap-x-6">
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <Wordmark />
            <p className="mt-[6px] max-w-[230px] text-[11.5px] leading-[21px] text-au-ink-soft">
              Sell-side representation for owner-operated businesses, {ENGAGEMENT.minEnterpriseValue} to{' '}
              {ENGAGEMENT.maxEnterpriseValue} enterprise value.
            </p>
            <ul className="mt-3 flex items-center gap-2">
              {[...SOCIAL_LINKS, CONTACT].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="flex h-[23px] w-[23px] items-center justify-center rounded-[5px] bg-au-navy text-white transition-colors hover:bg-[#20344F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-2 focus-visible:ring-offset-au-cream"
                  >
                    <IconMail className="h-[11px] w-[11px]" />
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
                      <Link
                        href={link.href}
                        data-compliance-exempt={'complianceExempt' in link ? '' : undefined}
                        className="text-[11.5px] text-au-ink-soft transition-colors hover:text-au-navy"
                      >
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
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="text-[10.5px] leading-[16px] text-au-ink-soft transition-colors hover:text-au-navy"
          >
            {SITE.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
