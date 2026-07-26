import { StarFour } from './icons';

interface SectionHeadingProps {
  title: string;
  /** The small gold sparkle that terminates the rule on some sections. */
  sparkle?: boolean;
}

export function SectionHeading({ title, sparkle = false }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-6">
      <h2 className="min-w-0 font-editorial text-[26px] font-normal leading-[1.1] tracking-[-0.01em] text-au-navy sm:text-[31px] lg:shrink-0">
        {title}
      </h2>
      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-au-line via-au-line to-au-line/40" />
      {sparkle && (
        <span aria-hidden className="relative -ml-2 shrink-0 text-[#C9A961]">
          <StarFour className="h-[13px] w-[13px]" />
          <StarFour className="absolute -right-[7px] -top-[3px] h-[6px] w-[6px] opacity-70" />
        </span>
      )}
    </div>
  );
}
