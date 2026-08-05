'use client';

import { LinkButton, PrimaryButton } from './buttons';
import { Reveal } from './reveal';

function OrbitArt() {
  return (
    <svg viewBox="0 0 340 240" aria-hidden className="h-full w-full">
      <defs>
        <radialGradient id="au-orb" cx="0.34" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FBFAF8" />
          <stop offset="0.55" stopColor="#DDD7CE" />
          <stop offset="1" stopColor="#B9B2A6" />
        </radialGradient>
      </defs>
      <g fill="none" stroke="#E2DACD" strokeWidth="1">
        <ellipse cx="196" cy="126" rx="128" ry="46" transform="rotate(-14 196 126)" />
        <ellipse cx="196" cy="126" rx="98" ry="34" transform="rotate(-14 196 126)" />
        <ellipse cx="196" cy="126" rx="66" ry="22" transform="rotate(-14 196 126)" strokeDasharray="2 4" />
      </g>
      <circle cx="204" cy="112" r="14" fill="url(#au-orb)" />
      <circle cx="204" cy="112" r="14" fill="none" stroke="#CFC7BA" strokeWidth="0.8" />
      <circle cx="86" cy="150" r="3.6" fill="#3C7BE8" />
      <circle cx="298" cy="88" r="2.6" fill="#C9C1B3" />
      <circle cx="150" cy="66" r="1.8" fill="#C9C1B3" />
    </svg>
  );
}

interface BottomCtaProps {
  onBookIntro: () => void;
  onGetDeck: () => void;
  title?: string;
  description?: string;
}

export function BottomCta({
  onBookIntro,
  onGetDeck,
  title = 'Find out whether we can sell your business.',
  description = 'A short conversation and an honest answer, including when the answer is no.',
}: BottomCtaProps) {
  return (
    <section id="contact" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-[31px]">
        <Reveal>
          <div className="relative overflow-hidden rounded-[16px] border border-au-line bg-[linear-gradient(180deg,#FEFBF7_0%,#FDF7EF_100%)] px-6 py-10 sm:px-12 sm:py-8 lg:pb-[14px] lg:pt-6">
            <div aria-hidden className="pointer-events-none absolute -right-6 top-1/2 hidden h-[240px] w-[340px] -translate-y-1/2 lg:block">
              <OrbitArt />
            </div>

            <div className="relative mx-auto max-w-[860px] text-center">
              <h2 className="font-editorial text-[26px] font-normal leading-[1.14] tracking-[-0.018em] text-au-navy sm:text-[33px] lg:text-[40px]">
                {title}
              </h2>
              <p className="mx-auto mt-[3px] max-w-[560px] text-[13px] leading-[1.6] text-au-ink">
                {description}
              </p>
              <div className="mt-[21px] flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
                <PrimaryButton size="cta" onClick={onBookIntro}>
                  See if we&rsquo;re a fit
                </PrimaryButton>
                <LinkButton onClick={onGetDeck}>Ask a question</LinkButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
