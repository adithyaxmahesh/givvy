import type { Metadata } from 'next';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: `Privacy — ${SITE.firmName}`,
  description: 'What we collect, why we collect it, and how to have it deleted.',
};

export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-au-navy">
        Privacy
      </h1>
      <p>
        This page describes what {SITE.firmName} collects through this website and what we do with
        it. It is written to be read, not to be impenetrable.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          What you type into a form on this site: your name, email address, phone number, company,
          and whatever you tell us about what you are looking for.
        </li>
        <li>Anything you send us by email.</li>
        <li>Standard server logs, including IP address and pages requested.</li>
      </ul>

      <h2>Why we collect it</h2>
      <p>
        To answer you, to work out whether we can help, and to keep a record of our correspondence.
        We do not sell it, rent it, or trade it, and we do not use it to build advertising profiles.
      </p>

      <h2>Who else sees it</h2>
      <p>
        Our hosting and database providers process it on our behalf. Beyond that, we disclose
        information only where the law requires it. Confidential information about a business we
        represent is shared with a prospective buyer only after an NDA is signed.
      </p>

      <h2>How long we keep it</h2>
      <p>
        For as long as we have a reason to, and then no longer. Enquiries that go nowhere are
        deleted on request.
      </p>

      <h2>Your choices</h2>
      <p>
        Ask us for a copy of what we hold about you, ask us to correct it, or ask us to delete it,
        and we will. Email{' '}
        <a href={`mailto:${SITE.contactEmail}`} className="underline">
          {SITE.contactEmail}
        </a>
        .
      </p>

      <h2>Cookies</h2>
      <p>
        This site does not set advertising or tracking cookies. Only cookies strictly necessary to
        serve the site and keep an authenticated session are used.
      </p>
    </>
  );
}
