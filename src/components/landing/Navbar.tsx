'use client';

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/Button';

const links = [
  { label: 'For Startups', href: '#features' },
  { label: 'For Talent', href: '#how-it-works' },
  { label: 'Community', href: '#community' },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image src="/givvy-logo.png" alt="Givvy" width={160} height={91} className="h-11 w-auto" priority />
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 50));

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Logo />

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm font-medium text-gray-500 hover:text-[#1a1a1a] transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-[#1a1a1a] transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link href="/signup">
            <Button variant="dark" size="sm">Get Started</Button>
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-600" aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
          >
            <div className="max-w-[1200px] mx-auto px-5 py-4 space-y-3">
              {links.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-600 py-2">
                  {l.label}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="text-center text-sm font-medium text-gray-600 py-2">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  <Button variant="dark" size="md" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
