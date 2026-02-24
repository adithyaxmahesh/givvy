'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FloatingAvatar, type FloatingAvatarData } from './ui/Floating';

const avatars: FloatingAvatarData[] = [
  { id: 'a1', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', initials: 'JD', size: 80, x: '8%',  y: '12%', driftDuration: 7, driftAmount: 5, parallaxSpeed: 0.8, delay: 0.1 },
  { id: 'a2', gradient: 'linear-gradient(135deg,#f5af19,#f12711)', initials: 'SK', size: 64, x: '30%', y: '5%',  driftDuration: 6, driftAmount: 6, parallaxSpeed: 0.5, delay: 0.2 },
  { id: 'a3', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', initials: 'RM', size: 72, x: '72%', y: '8%',  driftDuration: 8, driftAmount: 4, parallaxSpeed: 1.0, delay: 0.15 },
  { id: 'a4', gradient: 'linear-gradient(135deg,#fa709a,#fee140)', initials: 'AW', size: 68, x: '88%', y: '25%', driftDuration: 5, driftAmount: 7, parallaxSpeed: 0.6, delay: 0.3 },
  { id: 'a5', gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', initials: 'TC', size: 76, x: '5%',  y: '60%', driftDuration: 6.5, driftAmount: 5, parallaxSpeed: 1.2, delay: 0.25 },
  { id: 'a6', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', initials: 'LN', size: 70, x: '35%', y: '70%', driftDuration: 7.5, driftAmount: 6, parallaxSpeed: 0.7, delay: 0.35 },
  { id: 'a7', gradient: 'linear-gradient(135deg,#30cfd0,#330867)', initials: 'MP', size: 66, x: '65%', y: '72%', driftDuration: 5.5, driftAmount: 4, parallaxSpeed: 0.9, delay: 0.4 },
  { id: 'a8', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', initials: 'BK', size: 60, x: '90%', y: '62%', driftDuration: 6, driftAmount: 5, parallaxSpeed: 1.1, delay: 0.2 },
];

export function Community() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} id="community" className="relative w-full overflow-hidden bg-lime landing-noise">
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        {/* Floating avatars */}
        <div className="hidden md:block">
          {avatars.map((a) => (
            <FloatingAvatar key={a.id} data={a} containerRef={containerRef} />
          ))}
        </div>

        {/* Mobile avatars */}
        <div className="md:hidden flex justify-center gap-2 mb-8 flex-wrap">
          {avatars.slice(0, 5).map((a) => (
            <div
              key={a.id}
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              style={{ background: a.gradient }}
            />
          ))}
        </div>

        {/* Center text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-20 max-w-lg mx-auto"
        >
          <h2 className="font-display text-[36px] sm:text-[44px] lg:text-[52px] font-bold leading-tight tracking-tight text-[#1a1a1a] mb-4">
            Join Our Community
          </h2>
          <p className="text-sm sm:text-base text-[#1a1a1a]/60 leading-relaxed">
            Engage with fellow learners, share experiences, and ask questions. Gain insights from thought leaders in the crypto space.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
