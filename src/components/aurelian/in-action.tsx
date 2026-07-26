import type { ReactNode } from 'react';
import { ArrowRight, IconChevronRight } from './icons';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

function Panel({ title, link, children }: { title: string; link: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[11px] border border-au-line/80 bg-white shadow-[0_1px_2px_rgba(20,36,61,0.03)] transition-shadow duration-300 hover:shadow-au-card">
      <p className="px-3 pb-3 pt-3.5 text-center font-editorial text-[12.5px] font-normal tracking-[-0.005em] text-au-navy">
        {title}
      </p>
      <div className="flex-1 px-[11px] pb-3.5">{children}</div>
      <div className="border-t border-au-line/60 px-3 py-[11px]">
        <button
          type="button"
          className="group mx-auto flex items-center gap-1.5 text-[9.5px] font-medium text-au-ink-soft transition-colors hover:text-au-navy"
        >
          {link}
          <ArrowRight className="h-[9px] w-[9px] transition-transform duration-200 group-hover:translate-x-[1.5px]" />
        </button>
      </div>
    </div>
  );
}

const PIPELINE_TABS = ['All', 'Active', 'Won', 'Lost'];

const PIPELINE = [
  { name: 'Industrial Co.', stage: 'LOI Sent', value: '$125M', accent: 'bg-au-step-blue' },
  { name: 'Healthcare Services', stage: 'DD in Progress', value: '$87M', accent: 'bg-au-step-green' },
  { name: 'SaaS Platform', stage: 'Initial Review', value: '$48M', accent: 'bg-au-step-blue' },
  { name: 'Manufacturing Co.', stage: 'Outreach', value: '$62M', accent: 'bg-au-step-gold' },
];

function DealPipeline() {
  return (
    <div>
      <p className="px-[3px] text-[9.5px] font-semibold text-au-navy">Pipeline</p>
      <div className="mt-[11px] flex items-center gap-[13px] px-[3px] text-[8.5px] text-au-ink-soft">
        {PIPELINE_TABS.map((tab, index) => (
          <span key={tab} className={`relative pb-[5px] ${index === 0 ? 'text-au-navy' : ''}`}>
            {tab}
            {index === 0 && <span className="absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-au-navy/60" />}
          </span>
        ))}
      </div>
      <ul className="mt-[15px] space-y-[19px]">
        {PIPELINE.map((deal) => (
          <li key={deal.name} className="flex items-start gap-[9px] px-[3px]">
            <span className={`mt-[1px] h-[25px] w-[3px] shrink-0 rounded-full ${deal.accent}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9.5px] font-semibold leading-tight text-au-navy">{deal.name}</p>
              <p className="mt-[4px] text-[8px] leading-none text-au-ink-soft">{deal.stage}</p>
            </div>
            <div className="text-right">
              <p className="text-[9.5px] font-semibold leading-tight text-au-navy">{deal.value}</p>
              <p className="mt-[4px] text-[8px] leading-none text-au-ink-soft">EV</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavChart() {
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

function FundAdmin() {
  return (
    <div>
      <div className="flex items-baseline justify-between px-[3px]">
        <p className="text-[10px] font-semibold text-au-navy">Fund I LP</p>
        <p className="text-[8px] text-au-ink-soft">Q1 2024</p>
      </div>
      <div className="mt-2.5 px-[3px]">
        <p className="text-[8.5px] uppercase tracking-[0.08em] text-au-ink-soft">NAV</p>
        <div className="mt-[3px] flex items-baseline gap-2">
          <p className="text-[19px] font-semibold leading-none tracking-[-0.025em] text-au-navy">$42.6M</p>
          <span className="text-[9px] font-medium text-au-step-green">+6.3%</span>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2.5 px-[3px]">
        <dl className="w-[38%] shrink-0 space-y-2.5">
          <div>
            <dt className="text-[8.5px] text-au-ink-soft">Contributions</dt>
            <dd className="mt-[1px] text-[11px] font-semibold tracking-[-0.01em] text-au-navy">$12.8M</dd>
          </div>
          <div>
            <dt className="text-[8.5px] text-au-ink-soft">Distributions</dt>
            <dd className="mt-[1px] text-[11px] font-semibold tracking-[-0.01em] text-au-navy">$3.1M</dd>
          </div>
        </dl>
        <div className="min-w-0 flex-1">
          <NavChart />
          <div className="flex justify-between text-[7.5px] text-au-ink-soft">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const OWNERSHIP_NODES = [
  { name: 'HoldCo', share: '100%', x: 84, y: 4, w: 64 },
  { name: 'Subsidiary A', share: '100%', x: 22, y: 56, w: 78 },
  { name: 'Subsidiary B', share: '100%', x: 132, y: 56, w: 78 },
  { name: 'OpCo 1', share: '85%', x: 6, y: 110, w: 58 },
  { name: 'OpCo 2', share: '100%', x: 68, y: 110, w: 58 },
  { name: 'Real Estate SPV', share: '100%', x: 132, y: 110, w: 78 },
];

function OwnershipMap() {
  return (
    <svg viewBox="0 0 216 142" className="w-full" role="img" aria-label="Ownership map from HoldCo down to operating companies">
      <g fill="none" stroke="#DDD7CC" strokeWidth="0.9">
        <path d="M116 30 V43" />
        <path d="M61 43 H171" />
        <path d="M61 43 V56 M171 43 V56" />
        <path d="M61 82 V96 M171 82 V96" />
        <path d="M35 96 H97" />
        <path d="M35 96 V110 M97 96 V110 M171 96 V110" />
      </g>
      {OWNERSHIP_NODES.map((node) => (
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
            {node.share}
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
  { name: 'HR', status: 'In Progress', done: false },
  { name: 'IT & Security', status: 'Not Started', done: false },
];

function DiligenceTracker() {
  return (
    <div>
      <div className="flex items-center gap-3 px-[3px]">
        <div className="shrink-0">
          <p className="text-[9.5px] font-semibold leading-tight text-au-navy">Diligence</p>
          <p className="mt-[2px] text-[8px] leading-none text-au-ink-soft">84% Complete</p>
        </div>
        <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-au-line/70">
          <div className="h-full w-[84%] rounded-full bg-au-step-green" />
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

function ShareholderPayouts() {
  return (
    <div>
      <div className="flex items-baseline justify-between px-[3px]">
        <p className="text-[10px] font-semibold text-au-navy">Earnout Program</p>
        <p className="text-[8px] text-au-ink-soft">Q2 2024</p>
      </div>
      <div className="mt-3 px-[3px]">
        <p className="text-[8.5px] text-au-ink-soft">Total Earnout Obligation</p>
        <p className="mt-[3px] text-[19px] font-semibold leading-none tracking-[-0.025em] text-au-navy">$1.24M</p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 px-[3px]">
        <div>
          <p className="text-[8.5px] text-au-ink-soft">Paid</p>
          <p className="mt-[2px] text-[11px] font-semibold tracking-[-0.01em] text-au-navy">$620K</p>
        </div>
        <div>
          <p className="text-[8.5px] text-au-ink-soft">Remaining</p>
          <p className="mt-[2px] text-[11px] font-semibold tracking-[-0.01em] text-au-navy">$620K</p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 px-[3px]">
        <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-au-line/70">
          <div className="h-full w-1/2 rounded-full bg-au-step-blue" />
        </div>
        <p className="text-[8.5px] font-medium text-au-ink-soft">50%</p>
      </div>
    </div>
  );
}

const PANELS = [
  { title: 'Deal Pipeline', link: 'View all opportunities', content: <DealPipeline /> },
  { title: 'Fund Admin Dashboard', link: 'View full dashboard', content: <FundAdmin /> },
  { title: 'Ownership Map', link: 'Explore full map', content: <OwnershipMap /> },
  { title: 'Diligence Tracker', link: 'View all requests', content: <DiligenceTracker /> },
  { title: 'Shareholder Payouts', link: 'View earnout details', content: <ShareholderPayouts /> },
];

export function InAction() {
  return (
    <section id="platform" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-[51px]">
        <Reveal>
          <SectionHeading title="Aurelian in action" />
        </Reveal>

        <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-[18px]">
          {PANELS.map((panel, index) => (
            <Reveal key={panel.title} delay={index * 0.05} className="h-full">
              <Panel title={panel.title} link={panel.link}>
                {panel.content}
              </Panel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
