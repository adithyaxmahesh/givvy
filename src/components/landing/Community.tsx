'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FloatingAvatar, type FloatingAvatarData } from './ui/Floating';

const avatars: FloatingAvatarData[] = [
  { id: 'a1', gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)', initials: 'JD', size: 80, x: '8%',  y: '12%', driftDuration: 7, driftAmount: 5, parallaxSpeed: 0.8, delay: 0.1 },
  { id: 'a2', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', initials: 'SK', size: 64, x: '30%', y: '5%',  driftDuration: 6, driftAmount: 6, parallaxSpeed: 0.5, delay: 0.2 },
  { id: 'a3', gradient: 'linear-gradient(135deg,#10b981,#059669)', initials: 'RM', size: 72, x: '72%', y: '8%',  driftDuration: 8, driftAmount: 4, parallaxSpeed: 1.0, delay: 0.15 },
  { id: 'a4', gradient: 'linear-gradient(135deg,#f472b6,#ec4899)', initials: 'AW', size: 68, x: '88%', y: '25%', driftDuration: 5, driftAmount: 7, parallaxSpeed: 0.6, delay: 0.3 },
  { id: 'a5', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', initials: 'TC', size: 76, x: '5%',  y: '60%', driftDuration: 6.5, driftAmount: 5, parallaxSpeed: 1.2, delay: 0.25 },
  { id: 'a6', gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)', initials: 'LN', size: 70, x: '35%', y: '70%', driftDuration: 7.5, driftAmount: 6, parallaxSpeed: 0.7, delay: 0.35 },
  { id: 'a7', gradient: 'linear-gradient(135deg,#06b6d4,#0891b2)', initials: 'MP', size: 66, x: '65%', y: '72%', driftDuration: 5.5, driftAmount: 4, parallaxSpeed: 0.9, delay: 0.4 },
  { id: 'a8', gradient: 'linear-gradient(135deg,#f43f5e,#e11d48)', initials: 'BK', size: 60, x: '90%', y: '62%', driftDuration: 6, driftAmount: 5, parallaxSpeed: 1.1, delay: 0.2 },
];

const headlineWords = ['Founders', '&', 'Professionals,', 'Together'];

export function Community() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section ref={containerRef} id="community" className="relative w-full overflow-hidden bg-lime landing-noise">
      <motion.div
        style={{ y: bgY }}
        className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40"
      >
        {/* Floating avatars */}
        <div className="hidden md:block">
          {avatars.map((a) => (
            <FloatingAvatar key={a.id} data={a} containerRef={containerRef} />
          ))}
        </div>

        {/* Mobile avatars */}
        <div className="md:hidden flex justify-center gap-2 mb-8 flex-wrap">
          {avatars.slice(0, 5).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 300, damping: 20 }}
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              style={{ background: a.gradient }}
            />
          ))}
        </div>

        {/* Center text with word-by-word reveal */}
        <div className="text-center relative z-20 max-w-lg mx-auto">
          <h2 className="font-display text-[36px] sm:text-[44px] lg:text-[52px] font-bold leading-tight tracking-tight text-[#1a1a1a] mb-4">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm sm:text-base text-[#1a1a1a]/60 leading-relaxed"
          >
            Join a growing community where startup founders find world-class talent and professionals build equity portfolios in the companies they help create.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
