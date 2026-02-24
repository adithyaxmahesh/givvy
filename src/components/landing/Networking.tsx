'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PhoneMock } from './ui/PhoneMock';
import { FloatingPill, type FloatingPillData } from './ui/Floating';

const leftPills: FloatingPillData[] = [
  { id: 'p1', label: 'Pre-Seed Startups',  size: 0, x: '0%',  y: '15%', side: 'left',  driftDuration: 5,   driftAmount: 4, parallaxSpeed: 0.6, delay: 0.1 },
  { id: 'p2', label: 'AI & Machine Learning', size: 0, x: '2%',  y: '40%', side: 'left',  driftDuration: 6,   driftAmount: 3, parallaxSpeed: 0.9, delay: 0.25 },
  { id: 'p3', label: 'FinTech',            size: 0, x: '0%',  y: '65%', side: 'left',  driftDuration: 5.5, driftAmount: 5, parallaxSpeed: 0.7, delay: 0.4 },
];

const rightPills: FloatingPillData[] = [
  { id: 'p4', label: 'SaaS Companies',     size: 0, x: '68%', y: '18%', side: 'right', driftDuration: 6,   driftAmount: 4, parallaxSpeed: 0.8, delay: 0.15 },
  { id: 'p5', label: 'HealthTech',         size: 0, x: '70%', y: '45%', side: 'right', driftDuration: 5.5, driftAmount: 3, parallaxSpeed: 1.0, delay: 0.3 },
  { id: 'p6', label: 'Climate & Energy',   size: 0, x: '68%', y: '70%', side: 'right', driftDuration: 6.5, driftAmount: 5, parallaxSpeed: 0.5, delay: 0.45 },
];

function PortfolioPhoneContent() {
  const holdings = [
    { name: 'NovaPay', sector: 'FinTech', equity: '0.5%', value: '$12,500', safe: '$4M Cap', color: '#7c3aed' },
    { name: 'Luma Health', sector: 'HealthTech', equity: '1.2%', value: '$36,000', safe: '$6M Cap', color: '#3b82f6' },
    { name: 'Canopy AI', sector: 'AI/ML', equity: '0.8%', value: '$24,000', safe: '$8M Cap', color: '#10b981' },
  ];
  return (
    <div className="px-4 py-3">
      <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">Your Portfolio</span>
      <h3 className="text-sm font-bold text-[#1a1a1a] mt-1 mb-0.5">3 Companies</h3>
      <p className="text-[10px] text-gray-500 mb-3">Est. value: $72,500</p>

      <div className="space-y-2">
        {holdings.map((h) => (
          <div key={h.name} className="bg-gray-50 rounded-lg px-2.5 py-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: h.color }}>
                {h.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#1a1a1a] truncate">{h.name}</p>
                <p className="text-[8px] text-gray-400">{h.sector}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#1a1a1a]">{h.equity}</p>
                <p className="text-[8px] text-green-600">{h.value}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="h-1 rounded-full" style={{ backgroundColor: h.color, width: `${40 + Math.random() * 50}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Networking() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const phoneScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-charcoal landing-noise">
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="font-display text-[36px] sm:text-[44px] lg:text-[52px] font-bold leading-tight tracking-tight text-white text-center mb-4"
        >
          Build Your Equity Portfolio
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-sm sm:text-base text-gray-400 max-w-md mx-auto mb-14 leading-relaxed"
        >
          Track equity across every startup you work with. Watch your portfolio grow as companies scale.
        </motion.p>

        <div className="relative min-h-[480px] sm:min-h-[520px] flex items-center justify-center">
          {/* Floating sector pills — left */}
          <div className="hidden lg:block">
            {leftPills.map((p) => (
              <FloatingPill key={p.id} data={p} containerRef={containerRef} />
            ))}
          </div>

          {/* Center phone */}
          <motion.div style={{ scale: phoneScale }} className="relative z-20">
            <PhoneMock float className="w-[240px] sm:w-[260px]">
              <PortfolioPhoneContent />
            </PhoneMock>
          </motion.div>

          {/* Floating sector pills — right */}
          <div className="hidden lg:block">
            {rightPills.map((p) => (
              <FloatingPill key={p.id} data={p} containerRef={containerRef} />
            ))}
          </div>
        </div>

        {/* Mobile pills */}
        <div className="lg:hidden flex flex-wrap justify-center gap-2 mt-8">
          {[...leftPills, ...rightPills].map((p) => (
            <div key={p.id} className="flex items-center gap-2 bg-white rounded-full pl-3 pr-1.5 py-1.5 shadow-sm">
              <span className="text-xs font-medium text-gray-800">{p.label}</span>
              <div className="w-5 h-5 rounded bg-lime flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-sm text-gray-500 mt-12 max-w-md mx-auto leading-relaxed"
        >
          Instead of writing checks, invest your time and expertise. Work becomes your venture capital.
        </motion.p>
      </div>
    </section>
  );
}
