'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { FloatingIcon, type FloatingIconData } from './ui/Floating';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { PhoneMock } from './ui/PhoneMock';

/* ─── Floating icon data (tune positions / colors here) ────────── */
const heroIcons: FloatingIconData[] = [
  {
    id: 'diamond',
    bg: '#22c55e',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3L3 12l9 9 9-9-9-9z" fill="white" opacity=".9"/></svg>,
    size: 52, x: '10%', y: '18%', rotate: -8, driftDuration: 5, driftAmount: 6, parallaxSpeed: 0.8, delay: 0.2,
  },
  {
    id: 'prism',
    bg: '#1e1b4b',
    icon: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><polygon points="13,4 22,20 4,20" fill="white" opacity=".85"/><polygon points="13,9 18,18 8,18" fill="#818cf8" opacity=".5"/></svg>,
    size: 48, x: '4%', y: '46%', rotate: 4, driftDuration: 6, driftAmount: 8, parallaxSpeed: 1.2, delay: 0.4, rounded: 'rounded-xl',
  },
  {
    id: 'arrows',
    bg: '#5eead4',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 6l-4 4-4-4M6 14l4-4 4 4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
    size: 44, x: '30%', y: '7%', rotate: 6, driftDuration: 4.5, driftAmount: 5, parallaxSpeed: 0.6, delay: 0.1, rounded: 'rounded-lg',
  },
  {
    id: 'check',
    bg: '#4ade80',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 10l3.5 3.5L15 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    size: 42, x: '60%', y: '5%', rotate: -3, driftDuration: 5.5, driftAmount: 7, parallaxSpeed: 0.9, delay: 0.3, rounded: 'rounded-xl',
  },
  {
    id: 'leaf',
    bg: '#a7f3d0',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 16S4 4 16 4c0 0 0 12-12 12z" fill="#065f46" opacity=".7"/><path d="M4 16L16 4" stroke="#065f46" strokeWidth="1.5"/></svg>,
    size: 40, x: '88%', y: '20%', rotate: 12, driftDuration: 6, driftAmount: 5, parallaxSpeed: 1.1, delay: 0.5, rounded: 'rounded-lg',
  },
  {
    id: 'coin',
    bg: '#3b82f6',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2"/><text x="11" y="15" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">C</text></svg>,
    size: 50, x: '86%', y: '48%', rotate: -5, driftDuration: 5, driftAmount: 6, parallaxSpeed: 0.7, delay: 0.6, rounded: 'rounded-xl',
  },
  {
    id: 'star',
    bg: '#fbbf24',
    icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2l2.5 5.5L19 8.5l-4 4 1 6-5-2.5L6 18.5l1-6-4-4 5.5-1z" fill="white" opacity=".9"/></svg>,
    size: 44, x: '16%', y: '72%', rotate: 8, driftDuration: 7, driftAmount: 4, parallaxSpeed: 1.3, delay: 0.3, rounded: 'rounded-xl',
  },
  {
    id: 'chain',
    bg: '#334155',
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 12a3 3 0 004 0l2-2a3 3 0 00-4-4l-1 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 8a3 3 0 00-4 0l-2 2a3 3 0 004 4l1-1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    size: 38, x: '76%', y: '72%', rotate: -10, driftDuration: 6, driftAmount: 5, parallaxSpeed: 0.5, delay: 0.7, rounded: 'rounded-lg',
  },
];

/* ─── Mini icons inside the phone ──────────────────────────────── */
function PhoneContent() {
  return (
    <div className="px-5 py-3">
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none" className="text-[#1a1a1a]">
          <rect x="2" y="8" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="2.5" />
          <rect x="12" y="8" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="2.5" />
        </svg>
        <span className="text-[11px] font-bold text-[#1a1a1a]">Givvy</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { bg: '#8b5cf6', r: 'rounded-md' },
          { bg: '#22c55e', r: 'rounded-md' },
          { bg: '#3b82f6', r: 'rounded-md' },
          { bg: '#f59e0b', r: 'rounded-md' },
          { bg: '#1e1b4b', r: 'rounded-md' },
        ].map((c, i) => (
          <div key={i} className={`w-8 h-8 ${c.r} shadow-sm`} style={{ backgroundColor: c.bg }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Hero Component ───────────────────────────────────────────── */
export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-cream overflow-hidden landing-noise">
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-0">
        {/* Floating icons — hidden on mobile */}
        <div className="hidden md:block">
          {heroIcons.map((icon) => (
            <FloatingIcon key={icon.id} data={icon} containerRef={containerRef} />
          ))}
        </div>

        {/* Center content */}
        <div className="text-center relative z-20 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge icon={<Sparkles className="h-3.5 w-3.5 text-amber-500" />} className="mb-6">
              special offer for early birds
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-display text-[42px] sm:text-[56px] lg:text-[68px] font-bold leading-[1.05] tracking-tight text-[#1a1a1a] mb-8"
          >
            Get Rewards
            <br />
            From Learning
            <br />
            Crypto
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Link href="/signup">
              <Button variant="dark" size="lg">Start Now</Button>
            </Link>
          </motion.div>
        </div>

        {/* Phone peek from bottom */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <div className="w-[260px] sm:w-[290px] h-[220px] overflow-hidden">
            <PhoneMock float={false} className="w-full">
              <PhoneContent />
            </PhoneMock>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
