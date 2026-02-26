'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FloatingIcon, type FloatingIconData } from './ui/Floating';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { PhoneMock } from './ui/PhoneMock';

const heroIcons: FloatingIconData[] = [
  {
    id: 'legal', bg: '#7c3aed',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3v2m0 0l-7 7h14l-7-7zM4 14v2h16v-2M6 18h12v2H6v-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    size: 52, x: '10%', y: '18%', rotate: -8, driftDuration: 5, driftAmount: 6, parallaxSpeed: 0.8, delay: 0.3,
  },
  {
    id: 'code', bg: '#3b82f6',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    size: 48, x: '4%', y: '46%', rotate: 4, driftDuration: 6, driftAmount: 8, parallaxSpeed: 1.2, delay: 0.5, rounded: 'rounded-xl',
  },
  {
    id: 'design', bg: '#f472b6',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 19l7-7 3 3-7 7-3-3z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="8" r="1.5" fill="white"/></svg>,
    size: 44, x: '30%', y: '7%', rotate: 6, driftDuration: 4.5, driftAmount: 5, parallaxSpeed: 0.6, delay: 0.2, rounded: 'rounded-lg',
  },
  {
    id: 'marketing', bg: '#f59e0b',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 11l18-5v12L3 13v-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 11v2l2 6h2l-1-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    size: 42, x: '60%', y: '5%', rotate: -3, driftDuration: 5.5, driftAmount: 7, parallaxSpeed: 0.9, delay: 0.4, rounded: 'rounded-xl',
  },
  {
    id: 'accounting', bg: '#10b981',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" stroke="white" strokeWidth="2"/><path d="M8 6h8M8 10h8M8 14h4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
    size: 40, x: '88%', y: '20%', rotate: 12, driftDuration: 6, driftAmount: 5, parallaxSpeed: 1.1, delay: 0.6, rounded: 'rounded-lg',
  },
  {
    id: 'consulting', bg: '#8b5cf6',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 2.4-1.2 4.5-3 5.7V17H8v-2.3A7 7 0 0112 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    size: 50, x: '86%', y: '48%', rotate: -5, driftDuration: 5, driftAmount: 6, parallaxSpeed: 0.7, delay: 0.7, rounded: 'rounded-xl',
  },
  {
    id: 'finance', bg: '#06b6d4',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 20h18M6 16v4M10 12v8M14 8v12M18 4v16" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>,
    size: 44, x: '16%', y: '72%', rotate: 8, driftDuration: 7, driftAmount: 4, parallaxSpeed: 1.3, delay: 0.45, rounded: 'rounded-xl',
  },
  {
    id: 'ops', bg: '#334155',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="white" strokeWidth="1.5"/></svg>,
    size: 38, x: '76%', y: '72%', rotate: -10, driftDuration: 6, driftAmount: 5, parallaxSpeed: 0.5, delay: 0.8, rounded: 'rounded-lg',
  },
];

function PhoneContent() {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center mb-3">
        <Image src="/givvy-logo.png" alt="Givvy" width={120} height={68} className="h-7 w-auto" />
      </div>
      <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-2 font-medium">Open Projects</p>
      <div className="space-y-2.5">
        {[
          { role: 'Legal Counsel', equity: '0.5%', tag: 'Pre-Seed', co: 'NovaPay', color: '#7c3aed' },
          { role: 'Lead Engineer', equity: '1.2%', tag: 'Seed', co: 'Luma Health', color: '#3b82f6' },
          { role: 'Brand Designer', equity: '0.8%', tag: 'Pre-Seed', co: 'Canopy AI', color: '#10b981' },
        ].map((p, i) => (
          <motion.div
            key={p.role}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
            className="bg-gray-50 rounded-xl px-3 py-2.5"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: p.color }}>
                {p.co[0]}
              </div>
              <span className="text-[10px] font-bold text-[#1a1a1a] flex-1">{p.role}</span>
              <span className="text-[8px] font-semibold bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded-full">{p.tag}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-400">{p.co}</span>
              <span className="text-[9px] font-semibold text-green-600">{p.equity} equity</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const phoneOpacity = useTransform(scrollYProgress, [0.3, 0.6], [1, 0]);

  return (
    <section ref={containerRef} className="relative w-full bg-cream overflow-hidden landing-noise">
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20">
        <div className="hidden md:block">
          {heroIcons.map((icon) => (
            <FloatingIcon key={icon.id} data={icon} containerRef={containerRef} />
          ))}
        </div>

        <div className="text-center relative z-20 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Badge icon={<Zap className="h-3.5 w-3.5 text-amber-500" />} className="mb-6">
              human capital as venture capital
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.4, 0.25, 1] }}
            className="font-display text-[42px] sm:text-[56px] lg:text-[68px] font-bold leading-[1.05] tracking-tight text-[#1a1a1a] mb-4"
          >
            Hire Top Talent.
            <br />
            Pay With Equity.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-gray-500 max-w-md mx-auto mb-8 leading-relaxed"
          >
            The marketplace where startups hire lawyers, developers, designers, and marketers with equity instead of cash.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/signup">
              <Button variant="dark" size="lg">Get Started Free</Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg">See How It Works</Button>
            </a>
          </motion.div>
        </div>

        {/* Full-size phone — no clipping */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
          style={{ y: phoneY, scale: phoneScale, opacity: phoneOpacity }}
          className="mt-14 sm:mt-16 flex justify-center"
        >
          <PhoneMock float={false} glow className="w-[280px] sm:w-[300px] lg:w-[320px]">
            <PhoneContent />
          </PhoneMock>
        </motion.div>
      </div>
    </section>
  );
}
