import Link from 'next/link';
import { ENGAGEMENT } from '@/lib/site-config';
import { ArrowRight } from './icons';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

/**
 * Homepage sections below the hero, in the order they appear.
 *
 * Two rules govern the copy here. Nothing states a number that is not a term
 * of engagement, and the disqualification column is written to actually
 * disqualify people. Softening it removes the only reason a seller believes
 * the rest of the page.
 */

const DELIVERABLES = [
  {
    name: 'A written assessment',
    body: 'What the business is likely to sell for, who is likely to buy it, and what will get in the way.',
  },
  {
    name: 'Normalized financials',
    body: 'Three years restated the way a buyer reads them, with the add-backs defended before they are questioned.',
  },
  {
    name: 'The information memorandum',
    body: 'The document a buyer reads before deciding whether to spend real time on your business.',
  },
  {
    name: 'A researched buyer list',
    body: 'Named buyers with a reason to want this business, not a blast to a database.',
  },
  {
    name: 'Diligence management',
    body: 'Every request tracked and answered, so the process does not stall while you run the company.',
  },
  {
    name: 'Closing and handover',
    body: 'Counsel, lenders, and accountants coordinated through to signing and the transition after it.',
  },
];

const RIGHT_FOR = [
  `Between ${ENGAGEMENT.minEnterpriseValue} and ${ENGAGEMENT.maxEnterpriseValue} in enterprise value`,
  'Profitable, with three years of financials that hold up to scrutiny',
  'Revenue spread across enough customers that losing one is survivable',
  'An owner who will stay through a transition period and mean it',
  'A real reason for selling that you are willing to say out loud',
];

const NOT_RIGHT_FOR = [
  `Under ${ENGAGEMENT.minEnterpriseValue} in enterprise value`,
  'No clean financials for the last three years',
  'The majority of revenue coming from one customer',
  'An owner unwilling to stay 90 days after close',
];

const WORRIES = [
  {
    worry: 'My employees will find out.',
    answer:
      'Buyers are approached blind and sign an NDA before they learn the name of the business. Nothing goes on a public listing with your name on it. You decide who inside the company is told, and when.',
  },
  {
    worry: 'Someone will give me a number and I will have no way to judge it.',
    answer:
      'You get the assessment before we go to market, with the reasoning shown. When an offer arrives you already know what a fair one looks like, because you saw how the number was built.',
  },
  {
    worry: 'This will eat a year of my life and then die.',
    answer:
      `That is why the timeline is ${ENGAGEMENT.timelineDays} days and why it is published. Deals die from drift. Naming the date is what stops the process from becoming permanent.`,
  },
];

const FINANCIAL_CHARACTERISTICS = [
  'How much of the revenue repeats without being re-sold',
  'How concentrated the customer base is',
  'Whether the business runs when the owner is not there',
];

export function WhatYouGet() {
  return (
    <section id="what-you-get" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container py-16 sm:py-20">
        <Reveal>
          <SectionHeading title="What you get for the fee" sparkle />
        </Reveal>

        <ol className="mt-10 grid gap-x-12 gap-y-0 sm:grid-cols-2">
          {DELIVERABLES.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.04}>
              <li className="flex gap-5 border-b border-au-line py-6">
                <span className="mt-[3px] font-mono text-[11px] tabular-nums text-au-ink-soft">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold leading-tight tracking-[-0.02em] text-au-navy">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.7] text-au-ink-soft">{item.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function RightForWrongFor() {
  return (
    <section id="fit" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-16 sm:pb-20">
        <Reveal>
          <SectionHeading title="Who we&rsquo;re right for, and who we&rsquo;re not" />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* Both columns get identical treatment. Tinting the qualifying column
              and leaving the other plain would put a thumb on the scale, and the
              disqualifying list is the half that earns the seller's trust. */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-[15px] border border-au-line bg-white p-7 sm:p-9">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-au-step-green">
                We can sell this
              </p>
              <ul className="mt-6 space-y-4">
                {RIGHT_FOR.map((item) => (
                  <li
                    key={item}
                    className="border-b border-au-line pb-4 text-[14px] leading-[1.6] text-au-navy last:border-b-0 last:pb-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="h-full">
            <div className="flex h-full flex-col rounded-[15px] border border-au-line bg-white p-7 sm:p-9">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#A2635E]">
                We will turn this down
              </p>
              <ul className="mt-6 space-y-4">
                {NOT_RIGHT_FOR.map((item) => (
                  <li
                    key={item}
                    className="border-b border-au-line pb-4 text-[14px] leading-[1.6] text-au-navy last:border-b-0 last:pb-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-7 text-[12.5px] leading-[1.7] text-au-ink-soft">
                If one of these describes your business, we will say so in the first conversation
                and point you somewhere better. Taking an engagement we cannot finish wastes a year
                of your life and ends with the business looking shopped.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function WhatOwnersWorryAbout() {
  return (
    <section id="worries" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-16 sm:pb-20">
        <Reveal>
          <SectionHeading title="What owners actually worry about" />
        </Reveal>

        <dl className="mt-10 border-t border-au-line">
          {WORRIES.map((entry, index) => (
            <Reveal key={entry.worry} delay={index * 0.05}>
              <div className="grid gap-4 border-b border-au-line py-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-12">
                <dt className="font-editorial text-[21px] font-normal leading-[1.3] tracking-[-0.01em] text-au-navy">
                  &ldquo;{entry.worry}&rdquo;
                </dt>
                <dd className="max-w-[560px] text-[13.5px] leading-[1.8] text-au-ink">
                  {entry.answer}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function WhyNoVertical() {
  return (
    <section id="approach" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-16 sm:pb-20">
        <Reveal>
          <SectionHeading title="Why we don&rsquo;t specialize by industry" />
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-20">
          <Reveal>
            <p className="max-w-[620px] font-editorial text-[22px] font-normal leading-[1.5] tracking-[-0.01em] text-au-navy sm:text-[25px]">
              Buyers of businesses this size do not shop by sector. They underwrite the same three
              things whether it is a plumbing company or a payroll bureau.
            </p>
            <p className="mt-6 max-w-[560px] text-[13.5px] leading-[1.8] text-au-ink">
              A firm that only sells one industry is matching on the least predictive variable. We
              match on what actually determines whether a deal closes, which means we can be honest
              with you about your business instead of selling you the vertical we happen to know.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <ul className="border-t border-au-line">
              {FINANCIAL_CHARACTERISTICS.map((item, index) => (
                <li key={item} className="flex gap-5 border-b border-au-line py-5">
                  <span className="mt-[2px] font-mono text-[11px] tabular-nums text-au-ink-soft">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[13.5px] leading-[1.6] text-au-navy">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function TheBuyers() {
  return (
    <section id="buyers" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-16 sm:pb-20">
        <Reveal>
          <SectionHeading title="The buyers" />
        </Reveal>

        <div className="mt-10 rounded-[15px] border border-au-line bg-white p-7 sm:p-10">
          <p className="max-w-[640px] text-[14px] leading-[1.8] text-au-ink">
            The people who buy businesses at this size are operators buying something to run,
            independent sponsors and searchers with backing already committed, smaller private
            firms working below the threshold the large banks bother with, and family offices that
            intend to hold. They are not a list you can buy. They are found one at a time, and the
            reason they take the call is that the last thing they were sent was worth reading.
          </p>
          <p className="mt-6 max-w-[640px] border-l border-au-line pl-5 text-[12.5px] leading-[1.75] text-au-ink-soft">
            We are not going to print a number of buyers here. When there are transactions closed
            under this firm, they will be listed with the detail that makes them checkable, and not
            before.
          </p>
          <Link
            href="/buyers"
            className="group mt-8 inline-flex items-center gap-2 border-b border-au-navy/25 pb-1 text-[12.5px] font-semibold text-au-navy transition-colors hover:border-au-blue hover:text-au-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue"
          >
            If you are buying, get on the list
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function StartupsNote() {
  return (
    <section id="startups" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-16 sm:pb-20">
        <Reveal>
          <div className="flex flex-col gap-5 border-t border-au-line pt-8 lg:flex-row lg:items-baseline lg:justify-between">
            <p className="max-w-[620px] font-editorial text-[20px] font-normal leading-[1.5] tracking-[-0.01em] text-au-navy">
              We also represent venture-backed companies being sold, where the outcome is under
              $50M and the banks built for larger mandates are not interested. Separately, we
              administer company-run tender offers.
            </p>
            <Link
              href="/services/startups"
              className="group inline-flex shrink-0 items-center gap-2 border-b border-au-navy/25 pb-1 text-[12.5px] font-semibold text-au-navy transition-colors hover:border-au-blue hover:text-au-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue"
            >
              For venture-backed companies
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
