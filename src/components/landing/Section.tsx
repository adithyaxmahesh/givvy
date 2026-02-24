'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

type Bg = 'cream' | 'lime' | 'dark' | 'white';

interface SectionProps {
  bg?: Bg;
  children: ReactNode;
  className?: string;
  id?: string;
  noReveal?: boolean;
  noPadding?: boolean;
}

const bgClass: Record<Bg, string> = {
  cream: 'bg-cream',
  lime: 'bg-lime',
  dark: 'bg-charcoal',
  white: 'bg-white',
};

const textClass: Record<Bg, string> = {
  cream: 'text-[#1a1a1a]',
  lime: 'text-[#1a1a1a]',
  dark: 'text-white',
  white: 'text-[#1a1a1a]',
};

export function Section({ bg = 'cream', children, className = '', id, noReveal = false, noPadding = false }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.25'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], noReveal ? [1, 1] : [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], noReveal ? [0, 0] : [50, 0]);

  return (
    <section ref={ref} id={id} className={`relative w-full overflow-hidden ${bgClass[bg]} ${textClass[bg]} landing-noise`}>
      <motion.div
        style={{ opacity, y }}
        className={`relative z-10 max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 ${noPadding ? '' : 'py-20 sm:py-24 lg:py-28'} ${className}`}
      >
        {children}
      </motion.div>
    </section>
  );
}
