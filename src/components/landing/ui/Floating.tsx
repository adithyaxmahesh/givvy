'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { type ReactNode, type RefObject } from 'react';

/* ─── Shared base props ────────────────────────────────────────── */
interface FloatingBase {
  id: string;
  x: string;
  y: string;
  size: number;
  rotate?: number;
  driftDuration?: number;
  driftAmount?: number;
  parallaxSpeed?: number;
  delay?: number;
}

/* ─── FloatingIcon ─────────────────────────────────────────────── */
export interface FloatingIconData extends FloatingBase {
  bg: string;
  icon: React.ReactNode;
  rounded?: string;
}

export function FloatingIcon({
  data,
  containerRef,
}: {
  data: FloatingIconData;
  containerRef: RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [(data.parallaxSpeed ?? 1) * -40, (data.parallaxSpeed ?? 1) * 40],
  );

  return (
    <motion.div
      style={{ position: 'absolute', left: data.x, top: data.y, y: parallaxY, width: data.size, height: data.size }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: data.delay ?? 0, duration: 0.6, ease: 'easeOut' }}
      className="z-10 pointer-events-none"
    >
      <motion.div
        animate={{
          y: [-(data.driftAmount ?? 6), data.driftAmount ?? 6, -(data.driftAmount ?? 6)],
          rotate: [(data.rotate ?? 0) - 2, (data.rotate ?? 0) + 2, (data.rotate ?? 0) - 2],
        }}
        transition={{ duration: data.driftDuration ?? 5, repeat: Infinity, ease: 'easeInOut' }}
        className={`w-full h-full flex items-center justify-center ${data.rounded ?? 'rounded-xl'} shadow-lg`}
        style={{ backgroundColor: data.bg }}
      >
        {data.icon}
      </motion.div>
    </motion.div>
  );
}

/* ─── FloatingAvatar ───────────────────────────────────────────── */
export interface FloatingAvatarData extends FloatingBase {
  gradient: string;
  initials: ReactNode;
}

export function FloatingAvatar({
  data,
  containerRef,
}: {
  data: FloatingAvatarData;
  containerRef: RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [(data.parallaxSpeed ?? 1) * -30, (data.parallaxSpeed ?? 1) * 30],
  );

  return (
    <motion.div
      style={{ position: 'absolute', left: data.x, top: data.y, y: parallaxY, width: data.size, height: data.size }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: data.delay ?? 0, duration: 0.6 }}
      whileHover={{ scale: 1.1 }}
      className="z-10"
    >
      <motion.div
        animate={{
          y: [-(data.driftAmount ?? 4), data.driftAmount ?? 4, -(data.driftAmount ?? 4)],
        }}
        transition={{ duration: data.driftDuration ?? 6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-full h-full rounded-full overflow-hidden border-[3px] border-white/90 shadow-lg"
        style={{ background: data.gradient }}
      >
        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm select-none">
          {data.initials}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── FloatingPill ─────────────────────────────────────────────── */
export interface FloatingPillData extends FloatingBase {
  label: string;
  side: 'left' | 'right';
}

export function FloatingPill({
  data,
  containerRef,
}: {
  data: FloatingPillData;
  containerRef: RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [(data.parallaxSpeed ?? 1) * -20, (data.parallaxSpeed ?? 1) * 20],
  );

  const slideFrom = data.side === 'right' ? 80 : -80;

  return (
    <motion.div
      style={{ position: 'absolute', left: data.x, top: data.y, y: parallaxY }}
      initial={{ opacity: 0, x: slideFrom }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: data.delay ?? 0, duration: 0.6, ease: 'easeOut' }}
      className="z-10"
    >
      <motion.div
        animate={{
          y: [-(data.driftAmount ?? 3), data.driftAmount ?? 3, -(data.driftAmount ?? 3)],
        }}
        transition={{ duration: data.driftDuration ?? 5, repeat: Infinity, ease: 'easeInOut' }}
        className="flex items-center gap-2 bg-white rounded-full pl-4 pr-2 py-2 shadow-lg"
      >
        <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{data.label}</span>
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-lime shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}
