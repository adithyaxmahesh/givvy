'use client';

import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({ children, icon, className = '' }: BadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200/60 bg-white/70 backdrop-blur-sm text-xs font-medium text-gray-600 ${className}`}
    >
      {icon}
      {children}
    </motion.span>
  );
}
