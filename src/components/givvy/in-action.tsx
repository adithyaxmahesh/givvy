import type { ReactNode } from 'react';
import { IconChevronRight } from './icons';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

/**
 * Five panels showing how a sale is run.
 *
 * These previously displayed named deals with enterprise values, a fund NAV
 * with a performance figure, and an earnout obligation in dollars. All of it
 * was invented, and performance figures are the most heavily regulated thing
 * a firm like this can put on a page.
 *
 * The graphics are unchanged. What they show is now the process itself:
 * stages, states, and checklists that are true of every engagement. Nothing
 * here carries a currency amount, a percentage, a client name, or a count,
 * and nothing should be added that does.
 */

function Panel({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[11px] border border-au-line/80 bg-white shadow-[0_1px_2px_rgba(20,36,61,0.03)] transition-shadow duration-300 hover:shadow-au-card">
      <p className="px-3 pb-3 pt-3.5 text-center font-editorial text-[12.5px] font-normal tracking-[-0.005em] text-au-navy">
        {title}
      </p>
      <div className="flex-1 px-[11px] pb-3.5">{children}</div>
      <div className="border-t border-au-line/60 px-3 py-[11px]">
        <p className="text-center text-[9.5px] font-medium text-au-ink-soft">{caption}</p>
      </div>
    </div>
  );
}

const STAGE_TABS = ['All', 'Now', 'Next', 'Done'];

const STAGES = [
  { name: 'Preparation', detail: 'Financials and materials', week: 'Wk 1', accent: 'bg-au-step-green' },
  { name: 'Buyer outreach', detail: 'Blind approach under NDA', week: 'Wk 4', accent: 'bg-au-step-blue' },
  { name: 'Meetings', detail: 'Owner and buyer', week: 'Wk 8', accent: 'bg-au-step-blue' },
  { name: 'Offers and diligence', detail: 'Terms agreed', week: 'Wk 11', accent: 'bg-au-step-gold' },
];

function EngagementStages() {
  return (
    <div>
      <p className="px-[3px] text-[9.5px] font-semibold text-au-navy">Engagement</p>
      <div className="mt-[11px] flex items-center gap-[13px] px-[3px] text-[8.5px] text-au-ink-soft">
        {STAGE_TABS.map((tab, index) => (
          <span key={tab} className={`relative pb-[5px] ${index === 0 ? 'text-au-navy' : ''}`}>
            {tab}
            {index === 0 && <span className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-au-navy/60" />}
          </span>
        ))}
      </div>
      <ul className="mt-[15px] space-y-[19px]">
        {STAGES.map((stage) => (
          <li key={stage.name} className="flex items-start gap-[9px] px-[3px]">
            <span className={`mt-[1px] h-[25px] w-[3px] shrink-0 rounded-full ${stage.accent}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9.5px] font-semibold leading-tight text-au-navy">{stage.name}</p>
              <p className="mt-[4px] text-[8px] leading-none text-au-ink-soft">{stage.detail}</p>
            </div>
            <div className="text-right">
              <p className="text-[9.5px] font-semibold leading-tight text-au-navy">{stage.week}</p>
              <p className="mt-[4px] text-[8px] leading-none text-au-ink-soft">of 17</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Shape only. There are no axis values because there is nothing to report yet. */
function OutreachCurve() {
  return (
    <svg viewBox="0 0 132 60" aria-hidden className="h-[58px] w-full">
      <defs>
        <linearGradient id="au-nav-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4C7FC4" stopOpacity="0.18" />
          <stop offset="1" stopColor="#4C7FC4" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M2 46 L14 40 L26 43 L38 30 L50 34 L62 22 L74 26 L86 14 L98 18 L110 9 L122 4 L130 6 L130 56 L2 56 Z"
        fill="url(#au-nav-fill)"
      />
      <polyline
        points="2,46 14,40 26,43 38,30 50,34 62,22 74,26 86,14 98,18 110,9 122,4 130,6"
        fill="none"
        stroke="#3E6EAE"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const OUTREACH_STEPS = [
  { label: 'Approached', state: 'Blind' },
  { label: 'Signed NDA', state: 'Named' },
];

function BuyerOutreach() {
  return (
    <div>
      <div className="flex items-baseline justify-between px-[3px]">
        <p className="text-[10px] font-semibold text-au-navy">Buyer outreach</p>
        <p className="text-[8px] text-au-ink-soft">Confidential</p>
      </div>
      <div className="mt-2.5 px-[3px]">
        <p className="text-[8.5px] uppercase tracking-[0.08em] text-au-ink-soft">Nobody learns the name</p>
        <p className="mt-[3px] text-[13px] font-semibold leading-tight tracking-[-0.02em] text-au-navy">
          until an NDA is signed
        </p>
      </div>
      <div className="mt-3 flex items-start gap-2.5 px-[3px]">
        <dl className="w-[38%] shrink-0 space-y-2.5">
          {OUTREACH_STEPS.map((step) => (
            <div key={step.label}>
              <dt className="text-[8.5px] text-au-ink-soft">{step.label}</dt>
              <dd className="mt-[1px] text-[10px] font-semibold tracking-[-0.01em] text-au-navy">{step.state}</dd>
            </div>
          ))}
        </dl>
        <div className="min-w-0 flex-1">
          <OutreachCurve />
          <div className="flex justify-between text-[7.5px] text-au-ink-soft">
            <span>Wk 1</span>
            <span>Wk 8</span>
            <span>Wk 17</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const DEAL_NODES = [
  { name: 'Owner', note: 'Seller', x: 84, y: 4, w: 64 },
  { name: 'Operating Co', note: 'In the sale', x: 22, y: 56, w: 78 },
  { name: 'Property', note: 'Excluded', x: 132, y: 56, w: 78 },
  { name: 'Contracts', note: 'In the sale', x: 6, y: 110, w: 58 },
  { name: 'Equipment', note: 'In the sale', x: 68, y: 110, w: 58 },
  { name: 'Vehicles', note: 'Excluded', x: 132, y: 110, w: 78 },
];

function DealStructure() {
  return (
    <svg viewBox="0 0 216 142" className="w-full" role="img" aria-label="What is inside and outside a sale">
      <g fill="none" stroke="#DDD7CC" strokeWidth="0.9">
        <path d="M116 30 V43" />
        <path d="M61 43 H171" />
        <path d="M61 43 V56 M171 43 V56" />
        <path d="M61 82 V96 M171 82 V96" />
        <path d="M35 96 H97" />
        <path d="M35 96 V110 M97 96 V110 M171 96 V110" />
      </g>
      {DEAL_NODES.map((node) => (
        <g key={node.name}>
          <rect x={node.x} y={node.y} width={node.w} height="26" rx="6" fill="#fff" stroke="#E3DDD2" strokeWidth="0.9" />
          <text
            x={node.x + node.w / 2}
            y={node.y + 11.5}
            textAnchor="middle"
            fontSize="8.2"
            fontWeight="600"
            fill="#14243D"
          >
            {node.name}
          </text>
          <text x={node.x + node.w / 2} y={node.y + 20.5} textAnchor="middle" fontSize="7.2" fill="#8B9199">
            {node.note}
          </text>
        </g>
      ))}
    </svg>
  );
}

const DILIGENCE = [
  { name: 'Financial', status: 'Complete', done: true },
  { name: 'Legal', status: 'In Progress', done: false },
  { name: 'Commercial', status: 'Complete', done: true },
  { name: 'Employees', status: 'In Progress', done: false },
  { name: 'Systems', status: 'Not Started', done: false },
];

function DiligenceTracker() {
  return (
    <div>
      <div className="flex items-center gap-3 px-[3px]">
        <div className="shrink-0">
          <p className="text-[9.5px] font-semibold leading-tight text-au-navy">Diligence</p>
          <p className="mt-[2px] text-[8px] leading-none text-au-ink-soft">Every request tracked</p>
        </div>
        <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-au-line/70">
          <div className="h-full w-[60%] rounded-full bg-au-step-green" />
        </div>
      </div>
      <ul className="mt-4 space-y-[1px]">
        {DILIGENCE.map((item) => (
          <li key={item.name} className="flex items-center gap-2 border-b border-au-line/45 py-[9px] last:border-0">
            <span
              className={`h-[7px] w-[7px] shrink-0 rounded-full ${
                item.done ? 'bg-au-step-green' : 'border border-au-line bg-white'
              }`}
            />
            <span className="flex-1 text-[9px] font-medium text-au-navy">{item.name}</span>
            <span className="text-[8px] text-au-ink-soft">{item.status}</span>
            <IconChevronRight className="h-[8px] w-[8px] text-au-ink-soft/60" />
          </li>
        ))}
      </ul>
    </div>
  );
}

const CLOSING_ITEMS = [
  { name: 'Purchase agreement', state: 'Drafted' },
  { name: 'Landlord consent', state: 'Requested' },
  { name: 'Payoff letters', state: 'Requested' },
  { name: 'Transition plan', state: 'Agreed' },
];

function ClosingChecklist() {
  return (
    <div>
      <div className="flex items-baseline justify-between px-[3px]">
        <p className="text-[10px] font-semibold text-au-navy">Closing</p>
        <p className="text-[8px] text-au-ink-soft">Final weeks</p>
      </div>
      <div className="mt-3 px-[3px]">
        <p className="text-[8.5px] text-au-ink-soft">Nothing closes without</p>
        <p className="mt-[3px] text-[13px] font-semibold leading-tight tracking-[-0.02em] text-au-navy">
          all of it signed
        </p>
      </div>
      <ul className="mt-4 space-y-[1px]">
        {CLOSING_ITEMS.map((item) => (
          <li key={item.name} className="flex items-center gap-2 border-b border-au-line/45 py-[8px] last:border-0">
            <span className="h-[7px] w-[7px] shrink-0 rounded-full border border-au-line bg-white" />
            <span className="flex-1 text-[9px] font-medium text-au-navy">{item.name}</span>
            <span className="text-[8px] text-au-ink-soft">{item.state}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PANELS = [
  { title: 'Engagement Stages', caption: '17 weeks, published up front', content: <EngagementStages /> },
  { title: 'Buyer Outreach', caption: 'Blind until an NDA is signed', content: <BuyerOutreach /> },
  { title: 'What Is In The Sale', caption: 'Agreed before we go out', content: <DealStructure /> },
  { title: 'Diligence Tracker', caption: 'Requests chased, not forwarded', content: <DiligenceTracker /> },
  { title: 'Closing Checklist', caption: 'Coordinated to signing', content: <ClosingChecklist /> },
];

export function InAction() {
  return (
    <section id="platform" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-[51px]">
        <Reveal>
          <SectionHeading title="Inside the process" />
        </Reveal>

        <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-[18px]">
          {PANELS.map((panel, index) => (
            <Reveal key={panel.title} delay={index * 0.05} className="h-full">
              <Panel title={panel.title} caption={panel.caption}>
                {panel.content}
              </Panel>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-6 text-[11.5px] leading-[1.7] text-au-ink-soft">
            These show how an engagement is run. They are not a client dashboard, and no figure on
            this page describes a real transaction.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
