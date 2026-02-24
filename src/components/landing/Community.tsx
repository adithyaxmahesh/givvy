'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FloatingAvatar, type FloatingAvatarData } from './ui/Floating';

/* ─── Cartoon person SVGs ─────────────────────────────────────── */

const Person1 = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <circle cx="32" cy="22" r="12" fill="#FFDBB4"/>
    <path d="M20 18c0-8 5-14 12-14s12 6 12 14" fill="#4A3728"/>
    <path d="M22 20c-1 0-2 1-2 3s1 3 2 3" fill="#FFDBB4"/>
    <path d="M42 20c1 0 2 1 2 3s-1 3-2 3" fill="#FFDBB4"/>
    <circle cx="27" cy="22" r="1.5" fill="#2D2D2D"/>
    <circle cx="37" cy="22" r="1.5" fill="#2D2D2D"/>
    <path d="M29 28c1.5 1.5 3.5 1.5 5 0" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 64V46c0-6 4-10 10-12h12c6 2 10 6 10 12v18" fill="#7c3aed"/>
    <path d="M28 34h8v4c0 2-2 4-4 4s-4-2-4-4v-4z" fill="#FFDBB4"/>
  </svg>
);

const Person2 = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <circle cx="32" cy="22" r="12" fill="#C68642"/>
    <path d="M20 16c0-6 5-12 12-12s12 6 12 12c0 2-1 3-3 3h-18c-2 0-3-1-3-3z" fill="#1A1A1A"/>
    <circle cx="27" cy="22" r="1.5" fill="#2D2D2D"/>
    <circle cx="37" cy="22" r="1.5" fill="#2D2D2D"/>
    <path d="M29 28c1.5 1.5 3.5 1.5 5 0" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 20c-1 0-2 1-2 3s1 3 2 3" fill="#C68642"/>
    <path d="M42 20c1 0 2 1 2 3s-1 3-2 3" fill="#C68642"/>
    <path d="M28 34h8v4c0 2-2 4-4 4s-4-2-4-4v-4z" fill="#C68642"/>
    <path d="M16 64V46c0-6 4-10 10-12h12c6 2 10 6 10 12v18" fill="#f59e0b"/>
  </svg>
);

const Person3 = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <circle cx="32" cy="22" r="12" fill="#FFDBB4"/>
    <path d="M18 18c0-10 6-14 14-14s14 4 14 14l-4-2c-2-4-5-6-10-6s-8 2-10 6l-4 2z" fill="#D4A373"/>
    <circle cx="27" cy="22" r="1.5" fill="#2D2D2D"/>
    <circle cx="37" cy="22" r="1.5" fill="#2D2D2D"/>
    <path d="M30 27.5c1 1 2 1 3 0" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 20c-1 0-2 1-2 3s1 3 2 3" fill="#FFDBB4"/>
    <path d="M42 20c1 0 2 1 2 3s-1 3-2 3" fill="#FFDBB4"/>
    <path d="M28 34h8v4c0 2-2 4-4 4s-4-2-4-4v-4z" fill="#FFDBB4"/>
    <path d="M16 64V46c0-6 4-10 10-12h12c6 2 10 6 10 12v18" fill="#10b981"/>
    <circle cx="32" cy="10" r="2" fill="#D4A373"/>
  </svg>
);

const Person4 = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <circle cx="32" cy="22" r="12" fill="#F5D0A9"/>
    <path d="M19 20c0-10 5-16 13-16s13 6 13 16" fill="#B5651D"/>
    <path d="M18 20h28c0-2-1-4-3-4H21c-2 0-3 2-3 4z" fill="#B5651D"/>
    <path d="M17 19c2 2 6 3 15 3s13-1 15-3" stroke="#B5651D" strokeWidth="2"/>
    <circle cx="27" cy="23" r="1.5" fill="#2D2D2D"/>
    <circle cx="37" cy="23" r="1.5" fill="#2D2D2D"/>
    <path d="M29 28c1.5 1.5 3.5 1.5 5 0" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 20c-1 0-2 1-2 3s1 3 2 3" fill="#F5D0A9"/>
    <path d="M42 20c1 0 2 1 2 3s-1 3-2 3" fill="#F5D0A9"/>
    <path d="M28 34h8v4c0 2-2 4-4 4s-4-2-4-4v-4z" fill="#F5D0A9"/>
    <path d="M16 64V46c0-6 4-10 10-12h12c6 2 10 6 10 12v18" fill="#f472b6"/>
  </svg>
);

const Person5 = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <circle cx="32" cy="22" r="12" fill="#8D5524"/>
    <path d="M20 14c2-6 6-10 12-10s10 4 12 10c0 2-2 4-5 4h-14c-3 0-5-2-5-4z" fill="#1A1A1A"/>
    <path d="M20 14v8" stroke="#1A1A1A" strokeWidth="2"/>
    <path d="M44 14v8" stroke="#1A1A1A" strokeWidth="2"/>
    <circle cx="27" cy="22" r="1.5" fill="#FFF"/>
    <circle cx="37" cy="22" r="1.5" fill="#FFF"/>
    <path d="M29 28c1.5 1.5 3.5 1.5 5 0" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 20c-1 0-2 1-2 3s1 3 2 3" fill="#8D5524"/>
    <path d="M42 20c1 0 2 1 2 3s-1 3-2 3" fill="#8D5524"/>
    <path d="M28 34h8v4c0 2-2 4-4 4s-4-2-4-4v-4z" fill="#8D5524"/>
    <path d="M16 64V46c0-6 4-10 10-12h12c6 2 10 6 10 12v18" fill="#8b5cf6"/>
  </svg>
);

const Person6 = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <circle cx="32" cy="22" r="12" fill="#FFDBB4"/>
    <path d="M22 12c2-4 5-8 10-8s8 4 10 8c1 3 0 6-2 8H24c-2-2-3-5-2-8z" fill="#E8B04B"/>
    <path d="M20 20h24" stroke="#E8B04B" strokeWidth="3" strokeLinecap="round"/>
    <rect x="24" y="6" width="16" height="3" rx="1.5" fill="#E8B04B"/>
    <circle cx="27" cy="23" r="1.5" fill="#2D2D2D"/>
    <circle cx="37" cy="23" r="1.5" fill="#2D2D2D"/>
    <path d="M29 28c1.5 1.5 3.5 1.5 5 0" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 20c-1 0-2 1-2 3s1 3 2 3" fill="#FFDBB4"/>
    <path d="M42 20c1 0 2 1 2 3s-1 3-2 3" fill="#FFDBB4"/>
    <path d="M28 34h8v4c0 2-2 4-4 4s-4-2-4-4v-4z" fill="#FFDBB4"/>
    <path d="M16 64V46c0-6 4-10 10-12h12c6 2 10 6 10 12v18" fill="#3b82f6"/>
  </svg>
);

const Person7 = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <circle cx="32" cy="22" r="12" fill="#D4A373"/>
    <path d="M20 18c0-8 5-14 12-14s12 6 12 14" fill="#2D2D2D"/>
    <path d="M20 18h24v3c0 1-1 2-2 2H22c-1 0-2-1-2-2v-3z" fill="#2D2D2D"/>
    <circle cx="27" cy="23" r="1.5" fill="#2D2D2D"/>
    <circle cx="37" cy="23" r="1.5" fill="#2D2D2D"/>
    <path d="M30 28c1 1 2 1 3 0" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 20c-1 0-2 1-2 3s1 3 2 3" fill="#D4A373"/>
    <path d="M42 20c1 0 2 1 2 3s-1 3-2 3" fill="#D4A373"/>
    <path d="M28 34h8v4c0 2-2 4-4 4s-4-2-4-4v-4z" fill="#D4A373"/>
    <path d="M16 64V46c0-6 4-10 10-12h12c6 2 10 6 10 12v18" fill="#06b6d4"/>
  </svg>
);

const Person8 = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <circle cx="32" cy="22" r="12" fill="#FFDBB4"/>
    <path d="M18 16c0-8 6-12 14-12s14 4 14 12" fill="#C41E3A"/>
    <path d="M18 16c2 6 8 6 14 6s12 0 14-6" fill="#C41E3A"/>
    <path d="M24 10c4-2 8-2 12 0" stroke="#C41E3A" strokeWidth="2"/>
    <circle cx="27" cy="23" r="1.5" fill="#2D2D2D"/>
    <circle cx="37" cy="23" r="1.5" fill="#2D2D2D"/>
    <path d="M29 28c1.5 1.5 3.5 1.5 5 0" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 20c-1 0-2 1-2 3s1 3 2 3" fill="#FFDBB4"/>
    <path d="M42 20c1 0 2 1 2 3s-1 3-2 3" fill="#FFDBB4"/>
    <path d="M28 34h8v4c0 2-2 4-4 4s-4-2-4-4v-4z" fill="#FFDBB4"/>
    <path d="M16 64V46c0-6 4-10 10-12h12c6 2 10 6 10 12v18" fill="#f43f5e"/>
  </svg>
);

const avatars: FloatingAvatarData[] = [
  { id: 'a1', gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)', initials: <Person1 />, size: 80, x: '8%',  y: '12%', driftDuration: 7, driftAmount: 5, parallaxSpeed: 0.8, delay: 0.1 },
  { id: 'a2', gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', initials: <Person2 />, size: 64, x: '30%', y: '5%',  driftDuration: 6, driftAmount: 6, parallaxSpeed: 0.5, delay: 0.2 },
  { id: 'a3', gradient: 'linear-gradient(135deg,#10b981,#059669)', initials: <Person3 />, size: 72, x: '72%', y: '8%',  driftDuration: 8, driftAmount: 4, parallaxSpeed: 1.0, delay: 0.15 },
  { id: 'a4', gradient: 'linear-gradient(135deg,#f472b6,#ec4899)', initials: <Person4 />, size: 68, x: '88%', y: '25%', driftDuration: 5, driftAmount: 7, parallaxSpeed: 0.6, delay: 0.3 },
  { id: 'a5', gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', initials: <Person5 />, size: 76, x: '5%',  y: '60%', driftDuration: 6.5, driftAmount: 5, parallaxSpeed: 1.2, delay: 0.25 },
  { id: 'a6', gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)', initials: <Person6 />, size: 70, x: '35%', y: '70%', driftDuration: 7.5, driftAmount: 6, parallaxSpeed: 0.7, delay: 0.35 },
  { id: 'a7', gradient: 'linear-gradient(135deg,#06b6d4,#0891b2)', initials: <Person7 />, size: 66, x: '65%', y: '72%', driftDuration: 5.5, driftAmount: 4, parallaxSpeed: 0.9, delay: 0.4 },
  { id: 'a8', gradient: 'linear-gradient(135deg,#f43f5e,#e11d48)', initials: <Person8 />, size: 60, x: '90%', y: '62%', driftDuration: 6, driftAmount: 5, parallaxSpeed: 1.1, delay: 0.2 },
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
        {/* Floating cartoon avatars */}
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
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden"
              style={{ background: a.gradient }}
            >
              {a.initials}
            </motion.div>
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
