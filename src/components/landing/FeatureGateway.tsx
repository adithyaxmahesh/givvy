'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { PhoneMock } from './ui/PhoneMock';
import { Button } from './ui/Button';
import { Sun, Moon } from 'lucide-react';

function GatewayPhoneContent() {
  return (
    <div className="px-5 py-4 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-5 self-start">
        <svg width="14" height="14" viewBox="0 0 28 28" fill="none" className="text-[#1a1a1a]">
          <rect x="2" y="8" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="2.5" />
          <rect x="12" y="8" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="2.5" />
        </svg>
        <span className="text-[10px] font-bold text-[#1a1a1a]">Givvy</span>
      </div>

      {/* Mini floating icons */}
      <div className="relative w-full h-[100px] mb-4">
        {[
          { bg: '#8b5cf6', x: '15%', y: '5%', s: 28 },
          { bg: '#22c55e', x: '60%', y: '0%', s: 26 },
          { bg: '#3b82f6', x: '72%', y: '35%', s: 24 },
          { bg: '#5eead4', x: '30%', y: '50%', s: 22 },
          { bg: '#fbbf24', x: '10%', y: '55%', s: 24 },
          { bg: '#1e1b4b', x: '48%', y: '30%', s: 26 },
        ].map((c, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute rounded-md shadow-sm"
            style={{ left: c.x, top: c.y, width: c.s, height: c.s, backgroundColor: c.bg }}
          />
        ))}
      </div>

      <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">Start Course</h3>
      <p className="text-[9px] text-gray-500 text-center mb-3 leading-tight">
        Designed to reward<br />your commitment to learning.
      </p>
      <button className="bg-[#1a1a1a] text-white text-[10px] font-semibold px-5 py-1.5 rounded-full">
        Start Now
      </button>
    </div>
  );
}

function ThemeToggle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-center mt-10"
    >
      <div className="inline-flex items-center bg-charcoal/10 rounded-full p-1 gap-0.5">
        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm transition-colors">
          <Sun className="w-4 h-4 text-amber-500" />
        </button>
        <button className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-white/50">
          <Moon className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </motion.div>
  );
}

export function FeatureGateway() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const phoneScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const phoneY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <section ref={ref} id="features" className="relative w-full overflow-hidden bg-lime landing-noise">
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-12 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-[36px] sm:text-[44px] lg:text-[52px] font-bold leading-[1.08] tracking-tight text-[#1a1a1a]">
              Your Gateway
              <br />
              To Financial
              <br />
              Empowerment
            </h2>
          </motion.div>

          {/* Center phone */}
          <motion.div
            style={{ scale: phoneScale, y: phoneY }}
            className="flex justify-center order-first lg:order-none"
          >
            <PhoneMock float className="w-[240px] sm:w-[260px]">
              <GatewayPhoneContent />
            </PhoneMock>
          </motion.div>

          {/* Right text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:text-right"
          >
            <p className="text-sm sm:text-base text-[#1a1a1a]/70 leading-relaxed max-w-sm lg:ml-auto italic">
              Learning about cryptocurrency can yield not only increased understanding and confidence but also tangible rewards.
            </p>
          </motion.div>
        </div>

        <ThemeToggle />
      </div>
    </section>
  );
}
