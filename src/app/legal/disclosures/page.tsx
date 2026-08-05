import type { Metadata } from 'next';
import { REGULATORY_DISCLOSURE, SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `Disclosures — ${SITE.firmName}`,
  description: 'Regulatory status, scope of services, and conflicts policy.',
};

export default function DisclosuresPage() {
  return (
    <>
      <h1 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-au-navy">
        Disclosures
      </h1>

      <h2>Regulatory status</h2>
      <p>{REGULATORY_DISCLOSURE}</p>

      <h2>What we do</h2>
      <p>
        {SITE.firmName} represents owners of privately held businesses in the sale of those
        businesses. We are engaged by the seller, we are paid by the seller, and our obligation is
        to the seller.
      </p>

      <h2>What we do not do</h2>
      <ul>
        <li>We do not raise capital and we do not introduce companies to backers.</li>
        <li>We do not hold client money, and we do not take custody of anything sold.</li>
        <li>We do not manage money or portfolios for anyone.</li>
        <li>We do not give legal, tax, or accounting advice.</li>
        <li>We do not operate a venue where anything is bought and sold between third parties.</li>
      </ul>

      <h2>Conflicts</h2>
      <p>
        We represent the seller in every engagement. Buyers on our list receive sourcing and
        introductions; they do not receive representation. We do not act for both sides of the same
        transaction.
      </p>

      <h2>Nothing here is an offer</h2>
      <p>
        Material on this site describes our services. It is not an offer to buy or sell any business
        or interest in one, and it is not advice to any particular reader.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about anything on this page can go to{' '}
        <a href={`mailto:${SITE.contactEmail}`} className="underline">
          {SITE.contactEmail}
        </a>
        .
      </p>
    </>
  );
}
