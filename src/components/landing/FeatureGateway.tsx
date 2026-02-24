'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { PhoneMock } from './ui/PhoneMock';
import { ArrowRight, Briefcase } from 'lucide-react';

function GatewayPhoneContent() {
  return (
    <div className="px-4 py-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4 self-start">
        <svg width="14" height="14" viewBox="0 0 28 28" fill="none" className="text-[#1a1a1a]">
          <rect x="2" y="8" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="2.5" />
          <rect x="12" y="8" width="14" height="12" rx="4" stroke="currentColor" strokeWidth="2.5" />
        </svg>
        <span className="text-[10px] font-bold text-[#1a1a1a]">Givvy</span>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#1a1a1a]">Series A Legal Prep</p>
            <p className="text-[8px] text-gray-400">NovaPay · FinTech</p>
          </div>
        </div>
        <div className="flex gap-2 mb-2">
          <span className="text-[8px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">0.5% Equity</span>
          <span className="text-[8px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">SAFE · $4M Cap</span>
        </div>
        <p className="text-[8px] text-gray-500 leading-relaxed">
          Corporate structuring, investor agreements, and compliance for upcoming Series A.
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#1a1a1a]">Full-Stack MVP Build</p>
            <p className="text-[8px] text-gray-400">Luma Health · HealthTech</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-[8px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">1.5% Equity</span>
          <span className="text-[8px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">SAFE · $6M Cap</span>
        </div>
      </div>
    </div>
  );
}

function StatRow() {
  const stats = [
    { value: '$0', label: 'Cash spent' },
    { value: '47', label: 'Professionals hired' },
    { value: '12', label: 'Startups funded' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-center gap-8 sm:gap-14 mt-12"
    >
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <p className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">{s.value}</p>
          <p className="text-xs text-[#1a1a1a]/50 font-medium">{s.label}</p>
        </div>
      ))}
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
              Preserve
              <br />
              Your Runway.
              <br />
              Build Your
              <br />
              Team.
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
            <p className="text-sm sm:text-base text-[#1a1a1a]/70 leading-relaxed max-w-sm lg:ml-auto">
              Top startups compensate lawyers, developers, designers, and marketers with equity — preserving cash for growth while giving professionals real upside in companies they help build.
            </p>
            <a href="#how-it-works" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#1a1a1a] hover:gap-2.5 transition-all">
              Learn how it works <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        <StatRow />
      </div>
    </section>
  );
}
