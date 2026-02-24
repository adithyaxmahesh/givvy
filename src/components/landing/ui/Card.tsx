'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = true, className = '', ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' } : undefined}
      transition={{ duration: 0.25 }}
      className={`bg-white rounded-2xl border border-gray-100/80 shadow-card-landing overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
