'use client';

import { motion } from 'framer-motion';

interface PhoneMockProps {
  children: React.ReactNode;
  className?: string;
  float?: boolean;
  glow?: boolean;
}

export function PhoneMock({ children, className = '', float = true, glow = false }: PhoneMockProps) {
  return (
    <motion.div
      animate={float ? { y: [-10, 10, -10] } : undefined}
      transition={float ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
      className={`relative ${className}`}
    >
      {glow && (
        <div className="absolute -inset-8 rounded-[3.5rem] bg-gradient-to-b from-brand-500/20 via-brand-400/10 to-transparent blur-2xl pointer-events-none" />
      )}

      <div className="relative bg-[#1a1a1a] rounded-[3rem] p-[3px] shadow-[0_25px_80px_rgba(0,0,0,0.35),0_8px_20px_rgba(0,0,0,0.2)]">
        {/* Side buttons */}
        <div className="absolute -left-[2px] top-[80px] w-[3px] h-[28px] bg-[#2a2a2a] rounded-l-full" />
        <div className="absolute -left-[2px] top-[120px] w-[3px] h-[44px] bg-[#2a2a2a] rounded-l-full" />
        <div className="absolute -left-[2px] top-[172px] w-[3px] h-[44px] bg-[#2a2a2a] rounded-l-full" />
        <div className="absolute -right-[2px] top-[130px] w-[3px] h-[56px] bg-[#2a2a2a] rounded-r-full" />

        <div className="relative bg-white rounded-[2.75rem] overflow-hidden">
          {/* Screen reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none z-30" />

          {/* Dynamic Island */}
          <div className="flex justify-center pt-3">
            <div className="w-[100px] h-[28px] bg-[#1a1a1a] rounded-full" />
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-8 py-1.5 text-[10px] font-semibold text-[#1a1a1a]">
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
          <div>{children}</div>

          {/* Home Indicator */}
          <div className="flex justify-center pb-2 pt-3">
            <div className="w-[120px] h-[4px] bg-[#1a1a1a]/20 rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
