import Link from 'next/link';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/givvy/site-footer';
import { SITE } from '@/lib/site-config';

export default function LegalLayout({ children }: { children: ReactNode }) {
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
          <article className="max-w-[680px] [&_h2]:mt-10 [&_h2]:text-[17px] [&_h2]:font-semibold [&_h2]:tracking-[-0.015em] [&_h2]:text-au-navy [&_li]:mt-2 [&_li]:text-[13.5px] [&_li]:leading-[1.75] [&_li]:text-au-ink [&_p]:mt-4 [&_p]:text-[13.5px] [&_p]:leading-[1.8] [&_p]:text-au-ink [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            {children}
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
