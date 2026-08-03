'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BottomCta } from './bottom-cta';
import { PrimaryButton } from './buttons';
import { ArrowRight, StarFour } from './icons';
import { BookIntroModal, GetDeckModal } from './modals';
import { Nav } from './nav';
import { SERVICE_GROUPS, type ServiceGroup } from './services-data';
import { SiteFooter } from './site-footer';

type Dialog = 'intro' | 'deck' | null;

interface ServicePageProps {
  group: ServiceGroup;
}

const PROCESS = [
  {
    number: '01',
    title: 'Frame',
    description: 'Define the outcome, economics, participants, approvals, and critical path.',
  },
  {
    number: '02',
    title: 'Build',
    description: 'Create the structure, models, records, and shared execution workspace.',
  },
  {
    number: '03',
    title: 'Execute',
    description: 'Coordinate every workstream, counterparty, decision, document, and approval.',
  },
  {
    number: '04',
    title: 'Operate',
    description: 'Maintain the ownership record, reporting, obligations, and next actions.',
  },
];

const WORKFLOW_STATES = ['In review', 'Active', 'Ready', 'Queued'];

function WorkspacePanel({ group }: { group: ServiceGroup }) {
  return (
    <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-au-navy-deep p-3 shadow-[0_28px_70px_-34px_rgba(9,24,45,0.72)] sm:p-4">
      <div
        aria-hidden
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(62,110,174,0.35),rgba(62,110,174,0))]"
      />
      <div className="relative overflow-hidden rounded-[14px] border border-white/10 bg-[#102744]">
        <div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/45">Givvy workspace</span>
        </div>

        <div className="grid min-h-[360px] sm:grid-cols-[132px_minmax(0,1fr)]">
          <div className="hidden border-r border-white/10 p-4 sm:block">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/35">Mandate</p>
            <p className="mt-2 text-[12px] font-semibold leading-[18px] text-white">{group.name}</p>
            <div className="mt-8 space-y-3">
              {['Overview', 'Workstreams', 'Documents', 'Decisions'].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-md px-2 py-1.5 text-[9.5px] ${index === 1 ? 'bg-white/10 text-white' : 'text-white/40'}`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#8EB5E8]">Live mandate</p>
                <h2 className="mt-2 text-[18px] font-semibold tracking-[-0.025em] text-white">Execution overview</h2>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-[0.08em] text-emerald-200">
                On track
              </span>
            </div>

            <div className="mt-8 space-y-3">
              {group.services.slice(0, 4).map((service, index) => (
                <div
                  key={service.title}
                  className="flex items-center justify-between gap-4 rounded-[10px] border border-white/10 bg-white/[0.035] px-3.5 py-3.5"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${index === 1 ? 'bg-emerald-300' : 'bg-[#6E9FDE]'}`} />
                    <span className="truncate text-[10.5px] font-medium text-white/85">{service.title}</span>
                  </span>
                  <span className="shrink-0 text-[8.5px] font-semibold uppercase tracking-[0.07em] text-white/35">
                    {WORKFLOW_STATES[index]}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[10px] border border-white/10 p-3">
                <p className="text-[8.5px] uppercase tracking-[0.1em] text-white/35">Next decision</p>
                <p className="mt-2 text-[10.5px] font-medium text-white/80">Mandate review</p>
              </div>
              <div className="rounded-[10px] border border-white/10 p-3">
                <p className="text-[8.5px] uppercase tracking-[0.1em] text-white/35">Record</p>
                <p className="mt-2 text-[10.5px] font-medium text-white/80">Always current</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicePage({ group }: ServicePageProps) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const reduceMotion = useReducedMotion();
  const relatedGroups = SERVICE_GROUPS.filter((item) => item.slug !== group.slug);

  return (
    <div className="au-page font-sans antialiased">
      <Nav onBookIntro={() => setDialog('intro')} />

      <main>
        <section className="relative overflow-hidden border-b border-au-line/80 bg-au-cream">
          <div
            aria-hidden
            className="absolute left-1/2 top-[-35%] h-[720px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.98),rgba(255,255,255,0))]"
          />
          <div className="au-container relative pb-14 pt-10 sm:pb-20 sm:pt-14 lg:pb-24">
            <div className="flex items-center justify-between gap-6">
              <Link
                href="/#services"
                className="inline-flex items-center gap-2 text-[11.5px] font-semibold text-au-ink-soft transition-colors hover:text-au-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue"
              >
                <ArrowRight className="h-3 w-3 rotate-180" />
                All services
              </Link>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${group.labelColor}`}>
                {group.label}
              </p>
            </div>

            <div className="mt-14 grid items-center gap-14 lg:grid-cols-[minmax(0,0.88fr)_minmax(520px,1.12fr)] lg:gap-16">
              <motion.div
                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${group.labelColor}`}>
                  {group.name}
                </p>
                <h1 className="mt-5 max-w-[650px] text-[42px] font-semibold leading-[1.01] tracking-[-0.05em] text-au-navy sm:text-[56px] lg:text-[64px]">
                  {group.heroTitle}
                </h1>
                <p className="mt-6 max-w-[590px] text-[16px] leading-[27px] text-au-ink sm:text-[17px]">
                  {group.pageDescription}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {group.audiences.map((audience) => (
                    <span
                      key={audience}
                      className="rounded-full border border-au-line bg-white/65 px-3 py-1.5 text-[10.5px] font-medium text-au-ink-soft"
                    >
                      {audience}
                    </span>
                  ))}
                </div>

                <div className="mt-9 flex flex-wrap items-center gap-6">
                  <PrimaryButton size="md" onClick={() => setDialog('intro')}>
                    Discuss a mandate
                  </PrimaryButton>
                  <a
                    href="#capabilities"
                    className="group inline-flex items-center gap-2 border-b border-au-navy/35 pb-1 text-[13px] font-semibold text-au-navy transition-colors hover:border-au-blue hover:text-au-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue"
                  >
                    Explore capabilities
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={reduceMotion ? undefined : { opacity: 0, x: 20 }}
                animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <WorkspacePanel group={group} />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-b border-au-line/80 bg-white/45">
          <div className="au-container py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
              <div>
                <p className={`text-[10.5px] font-semibold uppercase tracking-[0.11em] ${group.labelColor}`}>
                  The operating thesis
                </p>
                <h2 className="mt-4 text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-au-navy sm:text-[38px]">
                  Built around the work, not the software.
                </h2>
              </div>

              <div className="grid gap-px overflow-hidden rounded-[18px] border border-au-line bg-au-line md:grid-cols-3">
                {group.pillars.map((pillar, index) => (
                  <div key={pillar.title} className="relative min-h-[260px] bg-au-cream p-6 sm:p-7">
                    <span className={`text-[10px] font-semibold tabular-nums ${group.labelColor}`}>
                      0{index + 1}
                    </span>
                    <StarFour className={`absolute right-6 top-6 h-3.5 w-3.5 opacity-70 ${group.labelColor}`} />
                    <h3 className="mt-16 text-[18px] font-semibold leading-[1.2] tracking-[-0.025em] text-au-navy">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-[12.5px] leading-[21px] text-au-ink-soft">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="capabilities" className="scroll-mt-[110px] bg-au-cream">
          <div className="au-container py-16 sm:py-24">
            <div className="grid gap-12 lg:grid-cols-[330px_minmax(0,1fr)] lg:gap-20">
              <div className="lg:sticky lg:top-[130px] lg:self-start">
                <p className={`text-[10.5px] font-semibold uppercase tracking-[0.11em] ${group.labelColor}`}>
                  Full capability set
                </p>
                <h2 className="mt-4 text-[31px] font-semibold leading-[1.08] tracking-[-0.04em] text-au-navy sm:text-[40px]">
                  One mandate or the full lifecycle.
                </h2>
                <p className="mt-5 max-w-[285px] text-[13px] leading-[22px] text-au-ink-soft">
                  Start with a single transaction or use Givvy as the connective operating layer across the entire
                  ownership system.
                </p>
                <div className={`mt-8 rounded-[14px] border p-5 ${group.edge} ${group.tint}`}>
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-au-ink-soft">Designed outcome</p>
                  <p className="mt-3 text-[14px] font-semibold leading-[21px] text-au-navy">{group.outcome}</p>
                </div>
              </div>

              <ol className="border-t border-au-line">
                {group.services.map((service, index) => (
                  <li
                    key={service.title}
                    className="group grid gap-3 border-b border-au-line py-6 transition-colors hover:bg-white/45 sm:grid-cols-[48px_minmax(180px,0.8fr)_minmax(0,1.2fr)] sm:items-start sm:gap-6 sm:px-3"
                  >
                    <span className={`text-[10.5px] font-semibold tabular-nums ${group.labelColor}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-[15px] font-semibold leading-[21px] tracking-[-0.015em] text-au-navy">
                      {service.title}
                    </h3>
                    <p className="text-[13px] leading-[22px] text-au-ink-soft">{service.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="overflow-hidden border-y border-au-line/80 bg-[#F1ECE4]">
          <div className="au-container py-12 sm:py-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.11em] text-au-blue">The working record</p>
                <h2 className="mt-4 max-w-[600px] text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-au-navy sm:text-[38px]">
                  Useful artifacts, not another layer of meetings.
                </h2>
              </div>
              <p className="max-w-[420px] text-[13px] leading-[22px] text-au-ink-soft">
                Every mandate leaves behind a current, decision-ready operating record your team can keep using.
              </p>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {group.deliverables.map((deliverable, index) => (
                <li
                  key={deliverable}
                  className="flex min-h-[112px] flex-col justify-between rounded-[12px] border border-[#DDD4C7] bg-[#FAF7F2] p-4"
                >
                  <span className="text-[9px] font-semibold tabular-nums text-au-ink-soft/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[12.5px] font-semibold leading-[18px] text-au-navy">{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-au-cream">
          <div className="au-container py-16 sm:py-24">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.11em] text-au-blue">Engagement model</p>
                <h2 className="mt-4 text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-au-navy sm:text-[38px]">
                  From mandate to operating rhythm.
                </h2>
              </div>
              <p className="max-w-[360px] text-[13px] leading-[22px] text-au-ink-soft">
                A clear sequence with one accountable record across every phase.
              </p>
            </div>

            <div className="relative mt-12 grid gap-8 md:grid-cols-4 md:gap-5">
              <div aria-hidden className="absolute left-0 right-0 top-[15px] hidden h-px bg-au-line md:block" />
              {PROCESS.map((step) => (
                <div key={step.number} className="relative">
                  <div className="relative z-10 flex h-[31px] w-[31px] items-center justify-center rounded-full border border-au-line bg-au-cream text-[9.5px] font-semibold text-au-blue">
                    {step.number}
                  </div>
                  <h3 className="mt-8 text-[17px] font-semibold tracking-[-0.02em] text-au-navy">{step.title}</h3>
                  <p className="mt-3 max-w-[250px] text-[12.5px] leading-[21px] text-au-ink-soft">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-au-line/80 bg-white/40">
          <div className="au-container py-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-au-ink-soft">Explore another practice</p>
                <p className="mt-2 text-[17px] font-semibold text-au-navy">The ownership lifecycle is connected.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {relatedGroups.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/services/${item.slug}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-au-line bg-au-cream px-4 py-2.5 text-[11.5px] font-semibold text-au-navy transition-all hover:-translate-y-px hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue"
                  >
                    {item.name}
                    <ArrowRight className="h-3 w-3 text-au-ink-soft transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="bg-au-cream pt-8">
          <BottomCta
            onBookIntro={() => setDialog('intro')}
            onGetDeck={() => setDialog('deck')}
            title={group.ctaTitle}
            description={group.ctaDescription}
          />
        </div>
      </main>

      <SiteFooter />
      <BookIntroModal open={dialog === 'intro'} onClose={() => setDialog(null)} />
      <GetDeckModal open={dialog === 'deck'} onClose={() => setDialog(null)} />
    </div>
  );
}
