import type { Metadata } from 'next';
import { REGULATORY_DISCLOSURE, SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `Terms — ${SITE.firmName}`,
  description: 'Terms governing use of this website.',
};

export default function TermsPage() {
  return (
    <>
      <h1 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-au-navy">
        Terms
      </h1>
      <p>
        These terms govern your use of this website. They do not govern an engagement with{' '}
        {SITE.firmName}; that is a separate signed agreement.
      </p>

      <h2>No advice, no offer</h2>
      <p>
        Everything on this site is general information about what we do. It is not advice to you,
        and nothing here is an offer to buy or sell a business or an interest in one. Do not act on
        it without taking your own legal, tax, and accounting advice.
      </p>

      <h2>Our status</h2>
      <p>{REGULATORY_DISCLOSURE}</p>

      <h2>Confidentiality</h2>
      <p>
        Detail about a business we represent is released only to a buyer who has signed a
        non-disclosure agreement. Requesting information does not entitle you to receive it, and we
        decline requests at our discretion.
      </p>

      <h2>Accuracy</h2>
      <p>
        We keep this site accurate and current, and we correct errors when we find them. We do not
        promise it is free of them. Where a page says something is unpublished or not yet
        established, take that at face value rather than assuming an omission.
      </p>

      <h2>Your use of the site</h2>
      <p>
        Do not attempt to gain access to areas of the site you are not authorised to use, scrape it,
        or use it to send unsolicited commercial messages.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. The version on this page at the time you use the site is the one
        that applies.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${SITE.contactEmail}`} className="underline">
          {SITE.contactEmail}
        </a>
      </p>
    </>
  );
}
