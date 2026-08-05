import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteFooter } from '@/components/givvy/site-footer';
import { OPPORTUNITIES } from '@/lib/opportunities';
import { ENGAGEMENT, SITE } from '@/lib/site-config';

const DESCRIPTION = SITE.region
  ? `Current sell-side engagements. ${SITE.region}, ${ENGAGEMENT.minEnterpriseValue}–${ENGAGEMENT.maxEnterpriseValue} enterprise value.`
  : `Current sell-side engagements. ${ENGAGEMENT.minEnterpriseValue}–${ENGAGEMENT.maxEnterpriseValue} enterprise value.`;

export const metadata: Metadata = {
  title: `Businesses for sale — ${SITE.firmName}`,
  description: DESCRIPTION,
};

export default function OpportunitiesPage() {
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
            Businesses currently for sale
          </h1>
          <p className="mt-5 max-w-[560px] font-mono text-[13px] uppercase tracking-[0.06em] text-au-ink">
            {ENGAGEMENT.minEnterpriseValue} to {ENGAGEMENT.maxEnterpriseValue} enterprise value
          </p>

          {OPPORTUNITIES.length === 0 ? (
            <section className="mt-12 rounded-[16px] border border-au-line bg-white px-6 py-14 sm:px-12">
              <div className="mx-auto max-w-[560px]">
                <h2 className="text-[19px] font-semibold leading-tight tracking-[-0.02em] text-au-navy">
                  Engagements are posted here as they go to market.
                </h2>
                <p className="mt-4 text-[13.5px] leading-[1.75] text-au-ink">
                  Buyers on our list hear about a business before it appears on this page, and
                  often before it is fully prepared. If you are actively looking to buy, get on
                  the list and you will see them first.
                </p>
                <Link
                  href="/buyers"
                  className="mt-7 inline-flex h-11 items-center rounded-full bg-au-navy px-6 text-[13px] font-medium text-white transition-colors hover:bg-[#20344F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-4 focus-visible:ring-offset-au-cream"
                >
                  Get on the buyer list
                </Link>
              </div>
            </section>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {OPPORTUNITIES.map((item) => (
                <article
                  key={item.id}
                  className="flex h-full flex-col rounded-[14px] border border-au-line bg-white p-6"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-au-ink-soft">
                    {item.industry} &middot; {item.region}
                  </p>
                  <dl className="mt-4 space-y-1.5 font-mono text-[12px] text-au-navy">
                    <div className="flex justify-between gap-4">
                      <dt className="text-au-ink-soft">Revenue</dt>
                      <dd>{item.revenueBand}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-au-ink-soft">EBITDA</dt>
                      <dd>{item.ebitdaBand}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 flex-1 text-[12.5px] leading-[1.7] text-au-ink">
                    {item.description}
                  </p>
                  <Link
                    href={`/buyers?cim=${item.id}`}
                    className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-au-navy px-5 text-[12.5px] font-medium text-au-navy transition-colors hover:bg-au-navy hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-4"
                  >
                    Request the CIM
                  </Link>
                </article>
              ))}
            </div>
          )}

          <p className="mt-10 text-[12.5px] text-au-ink-soft">
            We represent the sellers of every business listed here.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
