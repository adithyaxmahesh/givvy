'use client';

import { motion } from 'framer-motion';

interface PhoneMockProps {
  children: React.ReactNode;
  className?: string;
  float?: boolean;
}

export function PhoneMock({ children, className = '', float = true }: PhoneMockProps) {
  return (
    <motion.div
      animate={float ? { y: [-8, 8, -8] } : undefined}
      transition={float ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
      className={`relative ${className}`}
    >
      <div className="relative bg-[#1a1a1a] rounded-[2.5rem] p-[3px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="bg-white rounded-[2.35rem] overflow-hidden">
          {/* Dynamic Island */}
          <div className="flex justify-center pt-2.5">
            <div className="w-[90px] h-[24px] bg-[#1a1a1a] rounded-full" />
          </div>
          {/* Status Bar */}
          <div className="flex items-center justify-between px-7 py-1 text-[10px] font-semibold text-[#1a1a1a]">
            <span>18:23</span>
            <div className="flex items-center gap-1.5">
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
                <rect x="0" y="5" width="2.5" height="5" rx="0.5" />
                <rect x="3.5" y="3" width="2.5" height="7" rx="0.5" />
                <rect x="7" y="1" width="2.5" height="9" rx="0.5" />
                <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" />
              </svg>
              <svg width="13" height="9" viewBox="0 0 13 9" fill="currentColor">
                <path d="M1.2 5.8C2.5 4.5 4.2 3.7 6.1 3.7s3.6.8 4.9 2.1l1.1-1.1C10.5 3.1 8.4 2.1 6.1 2.1S1.7 3.1.1 4.7l1.1 1.1z" />
                <circle cx="6.1" cy="7.8" r="1.2" />
              </svg>
              <div className="flex items-center">
                <div className="w-[18px] h-[8px] border border-current rounded-[2px] relative">
                  <div className="absolute inset-[1.5px] right-[2px] bg-current rounded-[0.5px]" />
                </div>
                <div className="w-[1.5px] h-[3.5px] bg-current rounded-r-full ml-[0.5px]" />
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="min-h-[160px]">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
