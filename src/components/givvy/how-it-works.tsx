import type { ReactNode } from 'react';
import { IconCheckCircle, IconCheckMini, IconDoc, StarFour } from './icons';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

interface Step {
  number: number;
  title: string;
  description: string;
  dot: string;
  card: ReactNode;
}

function MicroCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-[88px] items-center rounded-[10px] border border-au-line/70 bg-white px-3.5 py-[13px] shadow-[0_1px_2px_rgba(20,36,61,0.03),0_10px_26px_-18px_rgba(20,36,61,0.22)]">
      {children}
    </div>
  );
}

function Sparkline() {
  return (
    <svg viewBox="0 0 58 26" aria-hidden className="h-[32px] w-[66px]">
      <polyline
        points="1,22 8,19 14,20 20,14 26,16 32,10 38,12 44,6 51,7 57,2"
        fill="none"
        stroke="#4E8A6B"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STEPS: Step[] = [
  {
    number: 1,
    title: 'Qualify the business',
    description: 'We look at the financials, the customer mix, and the owner\u2019s plans, then tell you plainly whether we can sell it.',
    dot: 'bg-au-step-blue',
    card: (
      <MicroCard>
        <span className="mr-2.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border border-au-edge-blue bg-au-tint-blue">
          <StarFour className="h-[11px] w-[11px] text-au-blue" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-semibold leading-tight text-au-navy">Fit assessed</p>
          <p className="mt-[3px] text-[10px] text-au-ink-soft">Answer either way</p>
        </div>
        <IconCheckCircle className="h-[15px] w-[15px] shrink-0 text-au-step-green" />
      </MicroCard>
    ),
  },
  {
    number: 2,
    title: 'Prepare the business',
    description: 'We normalize the financials, write the materials, and agree what the business is worth before anyone sees it.',
    dot: 'bg-au-step-green',
    card: (
      <MicroCard>
        <div className="min-w-0 flex-1">
          <p className="text-[9.5px] uppercase tracking-[0.06em] text-au-ink-soft">Preparation</p>
          <p className="mt-[3px] text-[11.5px] font-semibold leading-tight text-au-navy">Materials drafted</p>
        </div>
        <Sparkline />
      </MicroCard>
    ),
  },
  {
    number: 3,
    title: 'Approach buyers',
    description: 'We approach qualified buyers confidentially, run diligence, and keep the process from stalling.',
    dot: 'bg-au-step-gold',
    card: (
      <MicroCard>
        <div className="w-full">
          <p className="text-[9.5px] uppercase tracking-[0.06em] text-au-ink-soft">In parallel</p>
          <ul className="mt-2 space-y-[6px]">
            {['Diligence', 'Legal docs', 'Financing'].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <IconCheckMini className="h-[9px] w-[9px] shrink-0 text-au-step-green" />
                <span className="flex-1 text-[10px] leading-none text-au-ink">{item}</span>
                <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-au-step-green" />
              </li>
            ))}
          </ul>
        </div>
      </MicroCard>
    ),
  },
  {
    number: 4,
    title: 'Close and hand over',
    description: 'We get the documents signed, the money moved, and the business handed to its new owner.',
    dot: 'bg-au-step-lilac',
    card: (
      <MicroCard>
        <span className="mr-2.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border border-au-edge-blue bg-au-tint-blue">
          <IconDoc className="h-[13px] w-[13px] text-au-blue" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-semibold leading-tight text-au-navy">Sale closed</p>
          <p className="mt-[3px] text-[10px] text-au-ink-soft">Handover underway</p>
        </div>
        <IconCheckCircle className="h-[15px] w-[15px] shrink-0 text-au-blue" />
      </MicroCard>
    ),
  },
];

function StepArrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 44 8"
      className="pointer-events-none absolute -right-[36px] top-1/2 hidden h-2 w-[44px] -translate-y-1/2 lg:block"
    >
      <path d="M1 4h33" fill="none" stroke="#CFC7B8" strokeWidth="1.1" strokeDasharray="2.5 4" strokeLinecap="round" />
      <path d="M35 1.4 38.6 4 35 6.6" fill="none" stroke="#B6AE9E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HowItWorks() {
  return (
    <section id="about" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-11">
        <Reveal>
          <SectionHeading title="How it works" sparkle />
        </Reveal>

        <div className="mt-3 grid grid-cols-1 gap-x-[70px] gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.06}>
              <div className="relative">
                {step.card}
                {index < STEPS.length - 1 && <StepArrow />}
              </div>
              <div
                className={`mt-6 ${index > 0 ? 'lg:-ml-[35px] lg:border-l lg:border-au-line/70 lg:pl-[35px]' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ${step.dot} text-[10px] font-semibold text-white`}
                  >
                    {step.number}
                  </span>
                  <h3 className="font-editorial text-[20px] font-normal leading-none tracking-[-0.01em] text-au-navy">
                    {step.title}
                  </h3>
                </div>
                <p className="ml-8 mt-4 max-w-[215px] text-[11.5px] leading-[21px] text-au-ink-soft">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
