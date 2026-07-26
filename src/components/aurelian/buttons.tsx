'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight } from './icons';

type Size = 'sm' | 'cta' | 'nav' | 'md' | 'lg';

const primarySize: Record<Size, string> = {
  sm: 'h-[38px] px-4 text-[12.5px] gap-2 rounded-[9px]',
  cta: 'h-[40px] px-5 text-[13px] gap-2.5 rounded-[10px]',
  nav: 'h-[46px] px-[26px] text-[14.5px] gap-2.5 rounded-[10px]',
  md: 'h-[48px] px-6 text-[15px] gap-2.5 rounded-[10px]',
  lg: 'h-[50px] px-7 text-[14.5px] gap-3 rounded-[11px]',
};

const arrowSize: Record<Size, string> = {
  sm: 'h-3 w-3',
  cta: 'h-[13px] w-[13px]',
  nav: 'h-[14px] w-[14px]',
  md: 'h-[14px] w-[14px]',
  lg: 'h-[15px] w-[15px]',
};

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: Size;
  withArrow?: boolean;
}

export function PrimaryButton({
  children,
  size = 'md',
  withArrow = true,
  className = '',
  ...props
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={`group inline-flex items-center justify-center bg-au-navy-deep font-medium tracking-[-0.005em] text-white shadow-au-btn transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#17325a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-2 focus-visible:ring-offset-au-cream active:translate-y-0 disabled:pointer-events-none disabled:opacity-55 ${primarySize[size]} ${className}`}
      {...props}
    >
      {children}
      {withArrow && (
        <ArrowRight
          className={`${arrowSize[size]} translate-y-[0.5px] text-white/75 transition-transform duration-200 group-hover:translate-x-[2px]`}
        />
      )}
    </button>
  );
}

export function SecondaryButton({
  children,
  size = 'md',
  withArrow = false,
  className = '',
  ...props
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={`group inline-flex items-center justify-center border border-au-line bg-white/80 font-medium tracking-[-0.005em] text-au-navy transition-all duration-200 hover:-translate-y-[1px] hover:border-[#DCD5C8] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-2 focus-visible:ring-offset-au-cream active:translate-y-0 ${primarySize[size]} ${className}`}
      {...props}
    >
      {children}
      {withArrow && <ArrowRight className={`${arrowSize[size]} text-au-ink-soft transition-transform duration-200 group-hover:translate-x-[2px]`} />}
    </button>
  );
}

/** Underlined text link with a trailing arrow — used for "Get the deck →". */
export function LinkButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`group inline-flex items-center gap-2 text-[13.5px] font-medium text-au-navy transition-colors hover:text-au-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${className}`}
      {...props}
    >
      <span className="border-b border-au-navy/40 pb-[1px] group-hover:border-au-blue/60">{children}</span>
      <ArrowRight className="h-[13px] w-[13px] transition-transform duration-200 group-hover:translate-x-[2px]" />
    </button>
  );
}
