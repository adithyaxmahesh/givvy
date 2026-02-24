'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PhoneMock } from './ui/PhoneMock';
import { FloatingPill, type FloatingPillData } from './ui/Floating';

const leftPills: FloatingPillData[] = [
  { id: 'p1', label: 'Next Block Expo',         size: 0, x: '0%',  y: '15%', side: 'left', driftDuration: 5,   driftAmount: 4, parallaxSpeed: 0.6, delay: 0.1 },
  { id: 'p2', label: 'Paris Blockchain Week 2025', size: 0, x: '2%',  y: '40%', side: 'left', driftDuration: 6,   driftAmount: 3, parallaxSpeed: 0.9, delay: 0.25 },
  { id: 'p3', label: 'Digital Assets Summit',   size: 0, x: '0%',  y: '65%', side: 'left', driftDuration: 5.5, driftAmount: 5, parallaxSpeed: 0.7, delay: 0.4 },
];

const rightPills: FloatingPillData[] = [
  { id: 'p4', label: 'DS Blockchain Summit',    size: 0, x: '68%', y: '18%', side: 'right', driftDuration: 6,   driftAmount: 4, parallaxSpeed: 0.8, delay: 0.15 },
  { id: 'p5', label: 'Blockchain Forum 2025',   size: 0, x: '70%', y: '45%', side: 'right', driftDuration: 5.5, driftAmount: 3, parallaxSpeed: 1.0, delay: 0.3 },
  { id: 'p6', label: 'Consensus Toronto',       size: 0, x: '68%', y: '70%', side: 'right', driftDuration: 6.5, driftAmount: 5, parallaxSpeed: 0.5, delay: 0.45 },
];

function QRBlock() {
  const rows = 8;
  const cols = 8;
  return (
    <div className="grid gap-[2px] p-3 bg-lime-light rounded-xl" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const dark = [0,1,2,5,6,7, 8,15, 16,23, 40,41,42,45,46,47, 48,55, 56,57,58,61,62,63].includes(i)
          || (i > 24 && i < 40 && Math.random() > 0.45);
        return (
          <div
            key={i}
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px] ${dark ? 'bg-[#1a1a1a]' : 'bg-transparent'}`}
          />
        );
      })}
    </div>
  );
}

function NetworkingPhoneContent() {
  return (
    <div className="px-4 py-3">
      <span className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">Upcoming</span>
      <h3 className="text-base font-bold text-[#1a1a1a] mt-1 mb-0.5">Web3 Summit</h3>
      <p className="text-[10px] text-gray-500 mb-0.5">7 Jun To 15 Jul, 2025</p>
      <p className="text-[10px] text-gray-400 mb-2">Dubai</p>
      <p className="text-[9px] text-gray-500 leading-relaxed mb-3">
        Join 2000+ delegates as we explore the limitless possibilities of building a better world together.
      </p>
      <QRBlock />
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
          className="font-display text-[36px] sm:text-[44px] lg:text-[52px] font-bold leading-tight tracking-tight text-white text-center mb-16"
        >
          Networking Opportunities
        </motion.h2>

        <div className="relative min-h-[480px] sm:min-h-[520px] flex items-center justify-center">
          {/* Floating event pills — left */}
          <div className="hidden lg:block">
            {leftPills.map((p) => (
              <FloatingPill key={p.id} data={p} containerRef={containerRef} />
            ))}
          </div>

          {/* Center phone */}
          <motion.div style={{ scale: phoneScale }} className="relative z-20">
            <PhoneMock float className="w-[240px] sm:w-[260px]">
              <NetworkingPhoneContent />
            </PhoneMock>
          </motion.div>

          {/* Floating event pills — right */}
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
          className="text-center text-sm text-gray-400 mt-12 max-w-md mx-auto leading-relaxed"
        >
          Connect with potential employers, investors, or collaborators.
        </motion.p>
      </div>
    </section>
  );
}
