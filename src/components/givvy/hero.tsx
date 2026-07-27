'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { PrimaryButton, SecondaryButton } from './buttons';
import {
  IconCapTable,
  IconChecklist,
  IconCube,
  IconLiquidity,
  IconPipeline,
  IconReport,
  StarFour,
} from './icons';
import { RetroComputer } from './retro-computer';
import { WorkflowCard, type WorkflowCardData } from './workflow-card';

interface PositionedCard extends WorkflowCardData {
  /** Position on the 92 x 62em hero stage. */
  left: number;
  top: number;
  width: number;
  float: number;
}

const CARDS: PositionedCard[] = [
  { title: 'Acquisition Pipeline', detail: '12 opportunities', icon: IconPipeline, tone: 'green', left: 2.2, top: 3.2, width: 16.8, float: 5.6 },
  { title: 'Diligence Checklist', detail: '84% complete', icon: IconChecklist, tone: 'blue', left: 4.2, top: 16, width: 16.8, float: 6.8 },
  { title: 'SPV Setup', detail: 'New vehicle created', icon: IconCube, tone: 'blue', left: 5.4, top: 27.9, width: 16.8, float: 6.2 },
  { title: 'Cap Table Cleanup', detail: '7 issues found', icon: IconCapTable, tone: 'lilac', left: 71.7, top: 5.2, width: 16.8, float: 6.4 },
  { title: 'Fund Reporting', detail: 'Q1 report ready', icon: IconReport, tone: 'blue', left: 72.4, top: 19.4, width: 16.8, float: 5.2 },
  { title: 'Liquidity Workflow', detail: 'Matching buyers...', icon: IconLiquidity, tone: 'lilac', left: 70.6, top: 32, width: 16.8, float: 7.2 },
];

function Connectors() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 920 620"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ overflow: 'visible' }}
    >
      <g fill="none" stroke="#CFC7B8" strokeWidth="1.1" strokeDasharray="2.5 4.5" strokeLinecap="round">
        {/* left column: card to machine + card to card */}
        <path d="M192 76 C 218 78, 228 96, 246 108" />
        <path d="M108 128 L 108 158" />
        <path d="M212 208 C 230 208, 236 214, 246 218" />
        <path d="M120 250 L 120 278" />
        <path d="M224 330 C 236 330, 240 336, 246 340" />
        {/* squiggle arcing over the machine */}
        <path d="M276 30 C 304 6, 348 10, 376 26 C 400 40, 428 46, 458 38" />
        {/* right column: machine to cards */}
        <path d="M666 108 L 706 104" />
        <path d="M666 230 L 712 228" />
        <path d="M660 350 L 698 348" />
      </g>

      {/* nodes on the right flank of the machine */}
      <g fill="none" stroke="#C3BBAB" strokeWidth="1.1">
        {[108, 230, 350].map((cy, index) => (
          <g key={cy}>
            <circle cx={index === 2 ? 650 : 656} cy={cy} r="7" />
            <path d="M-3 0 H3 M0 -3 V3" transform={`translate(${index === 2 ? 650 : 656} ${cy})`} />
          </g>
        ))}
        <circle cx="274" cy="31" r="4.5" />
      </g>

      {/* arrow heads into the right-hand cards */}
      <g fill="none" stroke="#B6AE9E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M700 99 l6 5 -6 5" />
        <path d="M706 223 l6 5 -6 5" />
        <path d="M692 343 l6 5 -6 5" />
      </g>
    </svg>
  );
}

export function Hero({ onBookIntro }: { onBookIntro: () => void }) {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden border-b border-au-line/80">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#FBF6EF_0%,#FAF5ED_42%,#FBF7F1_74%,#FCFAF7_100%)]"
      />
      <div
        aria-hidden
        className="absolute -right-[8%] top-[6%] h-[760px] w-[860px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.9),rgba(255,255,255,0))]"
      />
      {/* desk horizon */}
      <div aria-hidden className="absolute inset-x-0 bottom-[54px] h-px bg-gradient-to-r from-transparent via-[#EDE6DA] to-transparent" />

      <div className="au-container relative">
        <div className="grid grid-cols-1 items-start gap-10 pb-14 pt-14 sm:pb-16 sm:pt-20 lg:grid-cols-[460px_minmax(0,1fr)] lg:gap-x-4 lg:gap-y-0 lg:pb-[35px] lg:pt-[23px] xl:grid-cols-[486px_minmax(0,1fr)]">
          <div className="lg:self-center lg:pb-[30px]">
            <motion.h1
              initial={reduce ? undefined : { opacity: 0, y: 14 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="font-editorial text-[43px] font-light leading-[1.04] tracking-[-0.018em] text-au-navy sm:text-[56px] lg:text-[67px] xl:text-[71px]"
            >
              The AI native
              <br />
              investment bank
              <br />
              for <em className="italic text-au-blue">ownership.</em>
            </motion.h1>

            <motion.p
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="mt-[14px] max-w-[478px] text-[17.5px] leading-[27px] text-au-ink"
            >
              The financial institution that closes the deals Wall Street won&rsquo;t touch.
            </motion.p>

            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <PrimaryButton size="md" onClick={onBookIntro}>
                Book intro
              </PrimaryButton>
              <SecondaryButton size="md" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                See services
              </SecondaryButton>
            </motion.div>
          </div>

          {/* Desk scene */}
          <div className="au-stage-outer relative lg:-ml-6 lg:-mr-8 lg:mt-3 xl:-ml-9 xl:-mr-12">
            <div className="au-stage">
              <RetroComputer />
              <div className="hidden lg:block">
                <Connectors />
                {CARDS.map((card, index) => (
                  <motion.div
                    key={card.title}
                    className="absolute"
                    style={{ left: `${card.left}em`, top: `${card.top}em`, width: `${card.width}em` }}
                    initial={reduce ? undefined : { opacity: 0, y: 12 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      animate={reduce ? undefined : { y: [0, -6, 0] }}
                      transition={{ duration: card.float, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
                    >
                      <WorkflowCard {...card} />
                    </motion.div>
                  </motion.div>
                ))}
                <StarFour className="absolute left-[59.4em] top-[1.9em] h-[1.5em] w-[1.5em] text-[#C9A961]" />
              </div>
            </div>
          </div>

          {/* Workflow chips, laid out as a grid on smaller screens */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
            {CARDS.map((card) => (
              <WorkflowCard key={card.title} {...card} style={{ fontSize: '10px' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
