'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PrimaryButton } from './buttons';
import { IconClose, IconMenu } from './icons';
import { SERVICE_GROUPS } from './services-data';
import { Wordmark } from './wordmark';

// Flat links only. The previous "Services" item was a button with no href that
// opened a five-item mega-menu; three of those services no longer exist.
const NAV_LINKS = [
  { label: 'Opportunities', href: '/opportunities' },
  ...SERVICE_GROUPS.map((group) => ({ label: group.name, href: `/services/${group.slug}` })),
  { label: 'Process', href: '/#about' },
];

export function Nav({ onBookIntro }: { onBookIntro: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-au-line/90 bg-au-cream/85 backdrop-blur-xl">
      <div className="au-container">
        <div className="grid h-[68px] grid-cols-[auto_1fr] items-center gap-4 lg:h-[94px] lg:pt-4 lg:grid-cols-[1fr_auto_1fr]">
          <Link
            href="/"
            className="justify-self-start rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-4 focus-visible:ring-offset-au-cream"
            aria-label="Givvy home"
          >
            <Wordmark size="lg" />
          </Link>

          <nav aria-label="Primary" className="hidden justify-self-center lg:block">
            <ul className="flex items-center gap-9">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium tracking-[-0.005em] text-au-ink transition-colors hover:text-au-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-4 focus-visible:ring-offset-au-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-5 justify-self-end">
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
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-[9px] px-2 py-2.5 text-[14px] font-medium text-au-navy transition-colors hover:bg-au-wash"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
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
