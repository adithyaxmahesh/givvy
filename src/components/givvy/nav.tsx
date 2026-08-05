'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PrimaryButton } from './buttons';
import { ArrowRight, IconClose, IconMenu } from './icons';
import { SERVICE_GROUPS } from './services-data';
import { Wordmark } from './wordmark';

const NAV_LINKS = [
  { label: 'Process', href: '/#about' },
  { label: 'Inside the process', href: '/#platform' },
  { label: 'Who we work with', href: '/#use-cases' },
  { label: 'Opportunities', href: '/opportunities' },
];

export function Nav({ onBookIntro }: { onBookIntro: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [menuOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setServicesOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-au-line/90 bg-au-cream/85 backdrop-blur-xl">
      <div className="au-container">
        <div className="grid h-[68px] grid-cols-[auto_1fr] items-center gap-4 lg:h-[94px] lg:pt-4 lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="justify-self-start rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-4 focus-visible:ring-offset-au-cream" aria-label="Givvy home">
            <Wordmark size="lg" />
          </Link>

          <nav aria-label="Primary" className="hidden justify-self-center lg:block">
            <ul className="flex items-center gap-10">
              <li
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) setServicesOpen(false);
                }}
              >
                <button
                  type="button"
                  onClick={() => setServicesOpen((open) => !open)}
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  className="group inline-flex items-center gap-1.5 text-[13px] font-medium tracking-[-0.005em] text-au-ink transition-colors hover:text-au-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-4 focus-visible:ring-offset-au-cream"
                >
                  Services
                  <ArrowRight
                    className={`h-3 w-3 transition-transform duration-200 ${servicesOpen ? '-rotate-90' : 'rotate-90'}`}
                  />
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.99 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-1/2 top-full w-[760px] -translate-x-1/2 pt-6"
                    >
                      <div className="rounded-[16px] border border-au-line bg-[#FFFCF8]/[0.98] p-3 shadow-[0_24px_60px_-28px_rgba(20,36,61,0.38)] backdrop-blur-xl">
                        <div className="grid grid-cols-2 gap-1">
                          {SERVICE_GROUPS.map((group) => (
                            <Link
                              key={group.slug}
                              href={`/services/${group.slug}`}
                              onClick={() => setServicesOpen(false)}
                              className="group/item rounded-[11px] px-4 py-3.5 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue"
                            >
                              <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${group.labelColor}`}>
                                {group.label}
                              </span>
                              <span className="mt-1 flex items-center justify-between gap-3 text-[14px] font-semibold text-au-navy">
                                {group.name}
                                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-au-ink-soft transition-transform duration-200 group-hover/item:translate-x-1" />
                              </span>
                              <span className="mt-1 block line-clamp-2 text-[11.5px] leading-[18px] text-au-ink-soft">
                                {group.summary}
                              </span>
                            </Link>
                          ))}
                          <Link
                            href="/#services"
                            onClick={() => setServicesOpen(false)}
                            className="flex items-center justify-between rounded-[11px] px-4 py-3.5 text-[13px] font-semibold text-au-navy transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue"
                          >
                            View all services
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[13px] font-medium tracking-[-0.005em] text-au-ink transition-colors hover:text-au-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-4 focus-visible:ring-offset-au-cream"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-5 justify-self-end">
            <Link
              href="/portal/login"
              className="group hidden items-center gap-1.5 text-[12.5px] font-medium text-au-ink-soft transition-colors hover:text-au-navy md:inline-flex"
            >
              Client portal
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-[2px]" />
            </Link>
            <PrimaryButton size="nav" onClick={onBookIntro} className="hidden sm:inline-flex">
              See if we&rsquo;re a fit
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-[9px] text-au-navy transition-colors hover:bg-au-wash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue lg:hidden"
            >
              {menuOpen ? <IconClose className="h-[18px] w-[18px]" /> : <IconMenu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-au-line/70 bg-au-cream lg:hidden"
          >
            <div className="au-container py-5">
              <ul className="space-y-1">
                <li className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-au-ink-soft">
                  Services
                </li>
                {SERVICE_GROUPS.map((group) => (
                  <li key={group.slug}>
                    <Link
                      href={`/services/${group.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-[9px] px-2 py-2.5 text-[14px] font-medium text-au-navy transition-colors hover:bg-au-wash"
                    >
                      {group.name}
                      <ArrowRight className="h-3 w-3 text-au-ink-soft" />
                    </Link>
                  </li>
                ))}
                <li className="my-3 border-t border-au-line/70" />
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-[9px] px-2 py-2.5 text-[14px] font-medium text-au-navy transition-colors hover:bg-au-wash"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/portal/login"
                    className="flex items-center gap-2 rounded-[9px] px-2 py-2.5 text-[14px] font-medium text-au-ink transition-colors hover:bg-au-wash"
                  >
                    Client portal
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </li>
              </ul>
              <PrimaryButton
                size="md"
                className="mt-4 w-full sm:hidden"
                onClick={() => {
                  setMenuOpen(false);
                  onBookIntro();
                }}
              >
                See if we&rsquo;re a fit
              </PrimaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
