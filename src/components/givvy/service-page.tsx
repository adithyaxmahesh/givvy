'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BottomCta } from './bottom-cta';
import { PrimaryButton } from './buttons';
import { ArrowRight, StarFour } from './icons';
import { BookIntroModal, GetDeckModal } from './modals';
import { Nav } from './nav';
import type { ServiceGroup } from './services-data';
import { SiteFooter } from './site-footer';

type Dialog = 'intro' | 'deck' | null;

interface ServicePageProps {
  group: ServiceGroup;
}

const PROCESS = [
  {
    number: '01',
    title: 'Define the mandate',
    description: 'Align the outcome, participants, information, approvals, and timeline.',
  },
  {
    number: '02',
    title: 'Coordinate execution',
    description: 'Run the workstreams and keep every party operating from one shared record.',
  },
  {
    number: '03',
    title: 'Administer ownership',
    description: 'Maintain the records, reporting, obligations, and next actions after close.',
  },
];

export function ServicePage({ group }: ServicePageProps) {
  const [dialog, setDialog] = useState<Dialog>(null);

  return (
    <div className="au-page font-sans antialiased">
      <Nav onBookIntro={() => setDialog('intro')} />

      <main>
        <section className="relative overflow-hidden border-b border-au-line/80 bg-au-cream">
          <div
            aria-hidden
            className="absolute right-[-8%] top-[-40%] h-[580px] w-[580px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.95),rgba(255,255,255,0))]"
          />
          <div className="au-container relative py-16 sm:py-20 lg:py-24">
            <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
              <div>
                <Link
                  href="/#services"
                  className="inline-flex items-center gap-2 text-[12px] font-semibold text-au-ink-soft transition-colors hover:text-au-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue"
                >
                  <ArrowRight className="h-3 w-3 rotate-180" />
                  All services
                </Link>
                <p className={`mt-10 text-[11px] font-semibold uppercase tracking-[0.1em] ${group.labelColor}`}>
                  {group.label}
                </p>
                <h1 className="mt-4 max-w-[780px] text-[42px] font-bold leading-[1.02] tracking-[-0.045em] text-au-navy sm:text-[56px] lg:text-[68px]">
                  {group.name} services
                </h1>
                <p className="mt-6 max-w-[720px] text-[17px] leading-[28px] text-au-ink">
                  {group.pageDescription}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <PrimaryButton size="md" onClick={() => setDialog('intro')}>
                    Book intro
                  </PrimaryButton>
                  <a
                    href="#capabilities"
                    className="inline-flex h-[48px] items-center gap-2 rounded-[10px] border border-au-line bg-white/80 px-6 text-[15px] font-medium text-au-navy transition-all duration-200 hover:-translate-y-px hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue"
                  >
                    View capabilities
                    <ArrowRight className="h-3.5 w-3.5 rotate-90" />
                  </a>
                </div>
              </div>

              <aside className={`rounded-[16px] border p-6 sm:p-7 ${group.edge} ${group.tint}`}>
                <StarFour className={`h-4 w-4 ${group.labelColor}`} />
                <p className="mt-8 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-au-ink-soft">
                  Built to deliver
                </p>
                <p className="mt-3 text-[18px] font-semibold leading-[1.45] tracking-[-0.015em] text-au-navy">
                  {group.outcome}
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section id="capabilities" className="scroll-mt-[110px] bg-au-cream">
          <div className="au-container py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
              <div>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${group.labelColor}`}>
                  Capabilities
                </p>
                <h2 className="mt-4 text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-au-navy sm:text-[38px]">
                  What Givvy handles
                </h2>
                <p className="mt-4 text-[13px] leading-[22px] text-au-ink-soft">
                  Engage Givvy for one workstream or coordinate the full ownership lifecycle.
                </p>
              </div>

              <ol className="border-t border-au-line">
                {group.services.map((service, index) => (
                  <li
                    key={service.title}
                    className="grid gap-3 border-b border-au-line py-5 sm:grid-cols-[44px_minmax(180px,0.8fr)_minmax(0,1.2fr)] sm:items-start sm:gap-5"
                  >
                    <span className={`text-[11px] font-semibold tabular-nums ${group.labelColor}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-[14px] font-semibold leading-[20px] text-au-navy">{service.title}</h3>
                    <p className="text-[13px] leading-[21px] text-au-ink-soft">{service.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-y border-au-line/80 bg-white/45">
          <div className="au-container py-16 sm:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-au-blue">How we work</p>
            <h2 className="mt-4 text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-au-navy sm:text-[38px]">
              One operating layer from mandate to administration
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-[15px] border border-au-line bg-au-line md:grid-cols-3">
              {PROCESS.map((step) => (
                <div key={step.number} className="bg-au-cream p-6 sm:p-8">
                  <span className="text-[11px] font-semibold text-au-blue">{step.number}</span>
                  <h3 className="mt-10 text-[17px] font-semibold tracking-[-0.02em] text-au-navy">{step.title}</h3>
                  <p className="mt-3 text-[12.5px] leading-[21px] text-au-ink-soft">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="bg-au-cream pt-8">
          <BottomCta onBookIntro={() => setDialog('intro')} onGetDeck={() => setDialog('deck')} />
        </div>
      </main>

      <SiteFooter />
      <BookIntroModal open={dialog === 'intro'} onClose={() => setDialog(null)} />
      <GetDeckModal open={dialog === 'deck'} onClose={() => setDialog(null)} />
    </div>
  );
}
