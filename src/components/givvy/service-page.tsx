'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PrimaryButton } from './buttons';
import { ArrowRight } from './icons';
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

interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  core?: boolean;
}

interface PracticeDiagram {
  caption: string;
  nodes: DiagramNode[];
  links: [string, string][];
}

const PRACTICE_DIAGRAMS: Record<string, PracticeDiagram> = {
  ma: {
    caption: 'One process, one person accountable',
    nodes: [
      { id: 'owner', label: 'Owner', x: 82, y: 142 },
      { id: 'assessment', label: 'Assessment', x: 230, y: 82 },
      { id: 'engagement', label: 'Engagement', x: 284, y: 252, core: true },
      { id: 'preparation', label: 'Preparation', x: 462, y: 132 },
      { id: 'buyers', label: 'Buyers', x: 474, y: 344 },
      { id: 'close', label: 'Close', x: 280, y: 442 },
      { id: 'handover', label: 'Handover', x: 88, y: 356 },
    ],
    links: [
      ['owner', 'assessment'],
      ['assessment', 'engagement'],
      ['engagement', 'preparation'],
      ['preparation', 'buyers'],
      ['buyers', 'close'],
      ['close', 'handover'],
      ['handover', 'engagement'],
    ],
  },
  'exit-readiness': {
    caption: 'What a buyer discounts for, fixed while there is time',
    nodes: [
      { id: 'business', label: 'The business', x: 280, y: 248, core: true },
      { id: 'financials', label: 'Financials', x: 104, y: 104 },
      { id: 'customers', label: 'Customers', x: 454, y: 98 },
      { id: 'contracts', label: 'Contracts', x: 490, y: 276 },
      { id: 'team', label: 'Team', x: 382, y: 440 },
      { id: 'owner', label: 'Owner', x: 142, y: 424 },
      { id: 'price', label: 'Price', x: 64, y: 266 },
    ],
    links: [
      ['financials', 'business'],
      ['customers', 'business'],
      ['contracts', 'business'],
      ['team', 'business'],
      ['owner', 'business'],
      ['business', 'price'],
      ['owner', 'team'],
    ],
  },
  tender: {
    caption: 'Every election accounted for',
    nodes: [
      { id: 'company', label: 'Company', x: 280, y: 248, core: true },
      { id: 'window', label: 'Election window', x: 104, y: 104 },
      { id: 'disclosure', label: 'Disclosure', x: 454, y: 98 },
      { id: 'waivers', label: 'Waivers', x: 490, y: 276 },
      { id: 'valuation', label: '409A', x: 382, y: 440 },
      { id: 'withholding', label: 'Withholding', x: 142, y: 424 },
      { id: 'record', label: 'Record', x: 64, y: 266 },
    ],
    links: [
      ['company', 'window'],
      ['company', 'disclosure'],
      ['window', 'waivers'],
      ['company', 'valuation'],
      ['waivers', 'withholding'],
      ['withholding', 'record'],
      ['record', 'company'],
    ],
  },
  startups: {
    caption: 'One company, one sale process',
    nodes: [
      { id: 'company', label: 'Company', x: 280, y: 248, core: true },
      { id: 'board', label: 'Board', x: 104, y: 104 },
      { id: 'assessment', label: 'Assessment', x: 454, y: 98 },
      { id: 'buyers', label: 'Buyers', x: 490, y: 276 },
      { id: 'diligence', label: 'Diligence', x: 382, y: 440 },
      { id: 'close', label: 'Close', x: 142, y: 424 },
      { id: 'tender', label: 'Tender', x: 64, y: 266 },
    ],
    links: [
      ['company', 'board'],
      ['company', 'assessment'],
      ['assessment', 'buyers'],
      ['buyers', 'diligence'],
      ['diligence', 'close'],
      ['company', 'tender'],
      ['board', 'close'],
    ],
  },
};

function PracticeGraphic({ group, reduceMotion }: { group: ServiceGroup; reduceMotion: boolean | null }) {
  const diagram = PRACTICE_DIAGRAMS[group.slug];
  const nodes = new Map(diagram.nodes.map((node) => [node.id, node]));

  return (
    <figure className="relative mx-auto w-full max-w-[610px]">
      <div
        aria-hidden
        className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(62,110,174,0.12),rgba(62,110,174,0)_68%)] blur-xl"
      />
      <svg viewBox="0 0 560 520" className="relative w-full overflow-visible" role="img" aria-label={`${group.name} relationship map`}>
        <ellipse cx="280" cy="255" rx="218" ry="190" fill="none" stroke="#DCD5C9" strokeWidth="0.8" strokeDasharray="2 7" />
        <ellipse cx="280" cy="255" rx="144" ry="124" fill="none" stroke="#E7E1D8" strokeWidth="0.7" />

        {diagram.links.map(([fromId, toId], index) => {
          const from = nodes.get(fromId);
          const to = nodes.get(toId);
          if (!from || !to) return null;
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2 - 18;
          return (
            <motion.path
              key={`${fromId}-${toId}`}
              d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
              fill="none"
              stroke="#BFC8D4"
              strokeWidth="1"
              initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
              animate={reduceMotion ? undefined : { pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 0.9, delay: 0.15 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}

        {diagram.nodes.map((node, index) => (
          <motion.g
            key={node.id}
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.7 }}
            animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.25 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            {node.core ? (
              <>
                <circle cx={node.x} cy={node.y} r="48" fill="#14243D" />
                <circle cx={node.x} cy={node.y} r="57" fill="none" stroke="#3E6EAE" strokeWidth="0.9" strokeDasharray="3 5" />
                <text x={node.x} y={node.y + 4} textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="600">
                  {node.label}
                </text>
              </>
            ) : (
              <>
                <circle cx={node.x} cy={node.y} r="5" fill="#3E6EAE" />
                <circle cx={node.x} cy={node.y} r="11" fill="none" stroke="#C9D3DF" strokeWidth="0.8" />
                <text
                  x={node.x}
                  y={node.y < 250 ? node.y - 19 : node.y + 27}
                  textAnchor="middle"
                  fill="#415067"
                  fontSize="10"
                  fontWeight="500"
                >
                  {node.label}
                </text>
              </>
            )}
          </motion.g>
        ))}
      </svg>
      <figcaption className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9.5px] font-semibold uppercase tracking-[0.14em] text-au-ink-soft">
        {diagram.caption}
      </figcaption>
    </figure>
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

            <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(500px,1.08fr)] lg:gap-14">
              <motion.div
                initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${group.labelColor}`}>
                  {group.name}
                </p>
                <h1 className="mt-5 max-w-[680px] font-editorial text-[48px] font-normal leading-[0.98] tracking-[-0.035em] text-au-navy sm:text-[64px] lg:text-[76px]">
                  {group.heroTitle}
                </h1>
                <p className="mt-6 max-w-[590px] text-[16px] leading-[27px] text-au-ink sm:text-[17px]">
                  {group.pageDescription}
                </p>

                <p className="mt-7 max-w-[540px] text-[10.5px] font-semibold uppercase leading-[20px] tracking-[0.09em] text-au-ink-soft">
                  For {group.audiences.join(' · ')}
                </p>

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
                <PracticeGraphic group={group} reduceMotion={reduceMotion} />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-au-navy-deep text-white">
          <motion.p
            aria-hidden
            initial={reduceMotion ? undefined : { x: 80, opacity: 0 }}
            whileInView={reduceMotion ? undefined : { x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute -right-4 top-0 whitespace-nowrap font-editorial text-[120px] font-normal uppercase leading-none tracking-[-0.05em] text-white/[0.035] sm:text-[190px] lg:text-[260px]"
          >
            {group.name}
          </motion.p>
          <div className="au-container relative py-20 sm:py-28">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#8EB5E8]">The operating thesis</p>
            <h2 className="mt-6 max-w-[900px] font-editorial text-[38px] font-normal leading-[1.04] tracking-[-0.025em] text-white sm:text-[54px] lg:text-[66px]">
              Built around the work, not the software.
            </h2>

            <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-10">
              {group.pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="md:border-l md:border-white/15 md:pl-7"
                >
                  <span className="text-[10px] font-semibold tabular-nums text-[#8EB5E8]">0{index + 1}</span>
                  <h3 className="mt-10 text-[20px] font-semibold leading-[1.2] tracking-[-0.025em] text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 max-w-[310px] text-[13px] leading-[22px] text-white/55">{pillar.description}</p>
                </motion.div>
              ))}
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
                <h2 className="mt-4 font-editorial text-[36px] font-normal leading-[1.04] tracking-[-0.025em] text-au-navy sm:text-[48px]">
                  One process, start to finish.
                </h2>
                <p className="mt-5 max-w-[285px] text-[13px] leading-[22px] text-au-ink-soft">
                  The same person handles every stage, so nothing is lost in a handoff between an
                  analyst, a broker, and whoever is left at the end.
                </p>
                <div className="mt-10 border-l border-au-blue pl-5">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-au-ink-soft">Designed outcome</p>
                  <p className="mt-3 font-editorial text-[18px] font-normal leading-[1.45] text-au-navy">{group.outcome}</p>
                </div>
              </div>

              <ol className="border-t border-au-line">
                {group.services.map((service, index) => (
                  <li
                    key={service.title}
                    className="group grid gap-3 border-b border-au-line py-8 transition-transform duration-200 hover:translate-x-1 sm:grid-cols-[48px_minmax(190px,0.8fr)_minmax(0,1.2fr)_20px] sm:items-start sm:gap-6"
                  >
                    <span className={`text-[10.5px] font-semibold tabular-nums ${group.labelColor}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-[17px] font-semibold leading-[22px] tracking-[-0.02em] text-au-navy">
                      {service.title}
                    </h3>
                    <p className="text-[13px] leading-[22px] text-au-ink-soft">{service.description}</p>
                    <ArrowRight className="hidden h-4 w-4 text-au-ink-soft transition-transform group-hover:translate-x-1 sm:block" />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-au-line/80 bg-[radial-gradient(circle_at_78%_25%,rgba(151,177,211,0.24),transparent_34%),radial-gradient(circle_at_20%_90%,rgba(221,190,133,0.2),transparent_38%),#F2EEE8]">
          <div
            aria-hidden
            className="absolute -bottom-12 -right-6 font-editorial text-[150px] font-normal uppercase leading-none tracking-[-0.05em] text-au-navy/[0.035] sm:text-[230px]"
          >
            Record
          </div>
          <div className="au-container relative py-16 sm:py-24">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.11em] text-au-blue">The working record</p>
                <h2 className="mt-4 max-w-[700px] font-editorial text-[36px] font-normal leading-[1.04] tracking-[-0.025em] text-au-navy sm:text-[50px]">
                  Useful artifacts, not another layer of meetings.
                </h2>
              </div>
              <p className="max-w-[420px] text-[13px] leading-[22px] text-au-ink-soft">
                Every mandate leaves behind a current, decision-ready operating record your team can keep using.
              </p>
            </div>
            <ul className="mt-14 grid border-y border-au-navy/15 sm:grid-cols-2 lg:grid-cols-5">
              {group.deliverables.map((deliverable, index) => (
                <li
                  key={deliverable}
                  className="flex min-h-[150px] flex-col justify-between border-b border-au-navy/15 px-1 py-5 last:border-b-0 sm:border-r sm:px-5 lg:border-b-0 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                >
                  <span className="text-[9px] font-semibold tabular-nums text-au-ink-soft/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-editorial text-[19px] font-normal leading-[1.2] text-au-navy">{deliverable}</span>
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
                <h2 className="mt-4 font-editorial text-[36px] font-normal leading-[1.04] tracking-[-0.025em] text-au-navy sm:text-[50px]">
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
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {relatedGroups.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/services/${item.slug}`}
                    className="group inline-flex items-center gap-2 border-b border-au-navy/25 pb-1 text-[12px] font-semibold text-au-navy transition-colors hover:border-au-blue hover:text-au-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue"
                  >
                    {item.name}
                    <ArrowRight className="h-3 w-3 text-au-ink-soft transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-au-navy-deep text-white">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[540px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(62,110,174,0.28),rgba(62,110,174,0)_66%)]"
          />
          <div className="au-container relative py-20 text-center sm:py-28">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8EB5E8]">{group.name}</p>
            <h2 className="mx-auto mt-6 max-w-[980px] font-editorial text-[38px] font-normal leading-[1.03] tracking-[-0.025em] text-white sm:text-[56px] lg:text-[68px]">
              {group.ctaTitle}
            </h2>
            <p className="mx-auto mt-6 max-w-[560px] text-[13px] leading-[22px] text-white/55">{group.ctaDescription}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-7">
              <button
                type="button"
                onClick={() => setDialog('intro')}
                className="group inline-flex h-12 items-center gap-3 rounded-[9px] bg-white px-6 text-[13px] font-semibold text-au-navy transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8EB5E8] focus-visible:ring-offset-4 focus-visible:ring-offset-au-navy-deep"
              >
                See if we&rsquo;re a fit
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => setDialog('deck')}
                className="border-b border-white/30 pb-1 text-[12.5px] font-semibold text-white transition-colors hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8EB5E8]"
              >
                Ask a question
              </button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <BookIntroModal open={dialog === 'intro'} onClose={() => setDialog(null)} />
      <GetDeckModal open={dialog === 'deck'} onClose={() => setDialog(null)} />
    </div>
  );
}
