import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteFooter } from '@/components/givvy/site-footer';
import { ENGAGEMENT, SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `Buyer list — ${SITE.firmName}`,
  description: `See owner-operated businesses from ${ENGAGEMENT.minEnterpriseValue} to ${ENGAGEMENT.maxEnterpriseValue} in enterprise value before they are published.`,
};

const INCLUDED = [
  'Businesses sent to you before they appear on the public page',
  'A blind teaser for each, with the operating detail that decides fit',
  'The CIM on request, once an NDA is signed',
  'A direct line to the person running the sale, not an inbox',
];

const PROFILE = [
  {
    title: 'Founders buying a company',
    body: 'Operators buying one business to run, not a portfolio to assemble.',
  },
  {
    title: 'Independent sponsors and searchers',
    body: 'Buyers with committed backing and a defined acquisition mandate.',
  },
  {
    title: 'Small private equity',
    body: 'Lower middle market firms buying below the size threshold larger banks work on.',
  },
  {
    title: 'Family offices',
    body: 'Long-hold buyers who want an owner-operated business and no exit clock.',
  },
];

export default function BuyersPage() {
  return (
    <div className="au-page min-h-screen font-sans antialiased">
      <header className="border-b border-au-line/90 bg-au-cream/85">
        <div className="au-container flex h-[68px] items-center lg:h-[94px]">
          <Link
            href="/"
            className="text-[13px] font-medium text-au-ink transition-colors hover:text-au-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-4"
          >
            &larr; {SITE.firmName}
          </Link>
        </div>
      </header>

      <main className="bg-au-cream">
        <div className="au-container py-14 sm:py-20">
          <h1 className="max-w-[620px] font-sans text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] text-au-navy sm:text-[44px]">
            See businesses before they are published.
          </h1>

          <div className="mt-8 max-w-[620px] rounded-[14px] border border-au-navy/20 bg-white px-6 py-5">
            <p className="text-[14px] font-medium leading-[1.65] text-au-navy">
              We represent sellers. A subscription gets you access to opportunities, not
              representation in a transaction.
            </p>
          </div>

          <section className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
            <div>
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-au-navy">
                What you get
              </h2>
              <ul className="mt-5 space-y-3">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex gap-3 text-[13.5px] leading-[1.7] text-au-ink">
                    <span aria-hidden className="mt-[9px] h-[3px] w-[3px] shrink-0 rounded-full bg-au-navy" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-au-navy">
                Who is on the list
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {PROFILE.map((entry) => (
                  <article key={entry.title} className="rounded-[13px] border border-au-line bg-white p-5">
                    <h3 className="text-[14px] font-semibold leading-tight text-au-navy">{entry.title}</h3>
                    <p className="mt-2 text-[12.5px] leading-[1.7] text-au-ink-soft">{entry.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-16 max-w-[620px]">
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-au-navy">Apply</h2>
            <p className="mt-3 text-[13.5px] leading-[1.75] text-au-ink">
              Applications are reviewed by a person. Tell us what you are looking to buy and what
              you have behind you, and we will come back to you either way.
            </p>
            <a
              href={`mailto:${SITE.contactEmail}?subject=Buyer%20list%20application`}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-au-navy px-6 text-[13px] font-medium text-white transition-colors hover:bg-[#20344F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-4 focus-visible:ring-offset-au-cream"
            >
              Apply to the buyer list
            </a>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
