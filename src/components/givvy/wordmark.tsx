import { StarFour } from './icons';

export function Wordmark({ size = 'md', className = '' }: { size?: 'md' | 'lg'; className?: string }) {
  const large = size === 'lg';
  return (
    <span className={`inline-flex items-baseline ${large ? 'gap-[13px]' : 'gap-[9px]'} ${className}`}>
      <StarFour
        className={`${
          large ? 'h-[17px] w-[17px] translate-y-[-2px] lg:h-[19px] lg:w-[19px] lg:translate-y-[-3px]' : 'h-[17px] w-[17px] translate-y-[-2px]'
        } text-au-blue-bright`}
      />
      <span
        className={`font-editorial ${large ? 'text-[27px] lg:text-[36px]' : 'text-[25px]'} font-normal leading-none tracking-[-0.012em] text-au-navy`}
      >
        Givvy
      </span>
    </span>
  );
}
