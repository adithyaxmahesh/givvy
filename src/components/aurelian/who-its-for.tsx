import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

/* Soft, line based illustrations — one per audience card. */

function GroundShadow({ cx, rx = 46 }: { cx: number; rx?: number }) {
  return <ellipse cx={cx} cy="101" rx={rx} ry="5" fill="#B6AC98" opacity="0.22" />;
}

function IllustrationBuildings() {
  return (
    <svg viewBox="0 0 168 112" aria-hidden className="h-full w-auto">
      <GroundShadow cx={80} rx={58} />
      <g strokeWidth="1.2" strokeLinejoin="round">
        <rect x="24" y="34" width="36" height="66" fill="#CFDBEC" stroke="#7E93B2" />
        <rect x="60" y="18" width="42" height="82" fill="#E5EBF5" stroke="#7E93B2" />
        <rect x="102" y="46" width="30" height="54" fill="#C6D4E8" stroke="#7E93B2" />
        <g fill="#8FA4C0" stroke="none">
          {[42, 54, 66, 78, 90].map((y) => (
            <g key={y}>
              <rect x="30" y={y} width="8" height="5" rx="1" />
              <rect x="45" y={y} width="8" height="5" rx="1" />
              <rect x="108" y={y - 4 + 8} width="7" height="5" rx="1" opacity="0.85" />
              <rect x="119" y={y - 4 + 8} width="7" height="5" rx="1" opacity="0.85" />
            </g>
          ))}
        </g>
        <g fill="#A8BAD3" stroke="none">
          {[26, 38, 50, 62, 74, 86].map((y) => (
            <g key={y}>
              <rect x="66" y={y} width="9" height="6" rx="1" />
              <rect x="79" y={y} width="9" height="6" rx="1" />
              <rect x="92" y={y} width="6" height="6" rx="1" />
            </g>
          ))}
        </g>
        <path d="M16 100h136" fill="none" stroke="#9FAEC4" strokeWidth="1.3" />
      </g>
      <g fill="none" stroke="#BE9C4E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M128 36 C 138 31, 146 35, 150 44" />
        <path d="M145 28.5 l6.6 3.2 -4 6" />
      </g>
    </svg>
  );
}

function IllustrationBriefcase() {
  return (
    <svg viewBox="0 0 168 112" aria-hidden className="h-full w-auto">
      <GroundShadow cx={72} rx={60} />
      <g strokeWidth="1.2" strokeLinejoin="round">
        <path d="M104 62 V44 h34 v18Z" fill="#E4DCC9" stroke="#9C917A" />
        <path d="M104 44 121 31.5 138 44Z" fill="#D6CCB4" stroke="#9C917A" />
        <path d="M110 62V48M117.5 62V48M125 62V48M132 62V48" fill="none" stroke="#9C917A" strokeOpacity="0.75" />
        <rect x="28" y="46" width="70" height="46" rx="6" fill="#C9BC9F" stroke="#7E735C" />
        <path d="M28 62h70" fill="none" stroke="#7E735C" strokeOpacity="0.85" />
        <path d="M51 46v-6a6 6 0 0 1 6-6h13a6 6 0 0 1 6 6v6" fill="none" stroke="#7E735C" />
        <rect x="55" y="56.5" width="16" height="10" rx="2.5" fill="#B0A184" stroke="#7E735C" />
        <path d="M16 92h136" fill="none" stroke="#B3A992" strokeWidth="1.3" />
      </g>
    </svg>
  );
}

function IllustrationSprout() {
  return (
    <svg viewBox="0 0 168 112" aria-hidden className="h-full w-auto">
      <GroundShadow cx={84} rx={52} />
      <g strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M84 86 V52" fill="none" stroke="#57784F" />
        <path d="M84 66 C 73 64, 64 55, 64 44 C 77 44, 84 53, 84 66Z" fill="#B9D3B0" stroke="#57784F" />
        <path d="M84 58 C 95 56, 104 47, 104 36 C 91 36, 84 45, 84 58Z" fill="#CFE2C6" stroke="#57784F" />
        <path d="M62 86 h44 l-5 14 a4 4 0 0 1 -4 3 H71 a4 4 0 0 1 -4 -3 Z" fill="#D8C9A8" stroke="#9C8C68" />
        <ellipse cx="84" cy="86" rx="22" ry="5.5" fill="#E7DBC0" stroke="#9C8C68" />
        <g stroke="#B9954A">
          <ellipse cx="44" cy="96" rx="12" ry="4" fill="#EBDCB0" />
          <ellipse cx="44" cy="91" rx="12" ry="4" fill="#F2E6C4" />
          <ellipse cx="44" cy="86" rx="12" ry="4" fill="#F7EDD3" />
        </g>
      </g>
    </svg>
  );
}

function IllustrationTemple() {
  return (
    <svg viewBox="0 0 168 112" aria-hidden className="h-full w-auto">
      <GroundShadow cx={84} rx={56} />
      <g strokeWidth="1.2" strokeLinejoin="round">
        <path d="M84 20 40 42h88L84 20Z" fill="#DCE3EF" stroke="#7B8AA3" />
        <path d="M44 42h80v6H44Z" fill="#CBD5E6" stroke="#7B8AA3" />
        <g fill="#E7ECF5" stroke="#7B8AA3">
          {[48, 62, 76, 90, 104].map((x) => (
            <rect key={x} x={x} y="48" width="10" height="36" rx="1.5" />
          ))}
        </g>
        <path d="M42 84h84v8H42Z" fill="#CBD5E6" stroke="#7B8AA3" />
        <path d="M36 92h96v8H36Z" fill="#BCC8DC" stroke="#7B8AA3" />
        <path d="M16 100h136" fill="none" stroke="#9FAEC4" strokeWidth="1.3" />
      </g>
    </svg>
  );
}

const AUDIENCES = [
  {
    title: 'Founders acquiring companies',
    description: 'Find and close the right acquisitions faster, with less friction.',
    illustration: <IllustrationBuildings />,
    tint: 'from-[#F5F7FB]',
  },
  {
    title: 'Small PE and search funds',
    description: 'Operate like a top tier firm from day one with institutional infrastructure.',
    illustration: <IllustrationBriefcase />,
    tint: 'from-[#FBF8F2]',
  },
  {
    title: 'Emerging managers and micro funds',
    description: 'Launch and scale funds with best in class operations and reporting.',
    illustration: <IllustrationSprout />,
    tint: 'from-[#F8FBF7]',
  },
  {
    title: 'HoldCos and permanent capital firms',
    description: 'Build and manage long term ownership platforms with compound advantage.',
    illustration: <IllustrationTemple />,
    tint: 'from-[#F7F8FC]',
  },
];

export function WhoItsFor() {
  return (
    <section id="use-cases" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-[27px]">
        <Reveal>
          <SectionHeading title="Who it’s for" />
        </Reveal>

        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[14px]">
          {AUDIENCES.map((audience, index) => (
            <Reveal key={audience.title} delay={index * 0.06} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[13px] border border-[#F1EBE1] bg-[#FAF7F2] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-au-card">
                <div className={`flex h-[130px] items-end justify-center bg-gradient-to-b ${audience.tint} to-transparent pb-1`}>
                  <div className="h-[118px]">{audience.illustration}</div>
                </div>
                <div className="px-[18px] pb-[22px] pt-[11px]">
                  <h3 className="font-editorial text-[18px] font-normal leading-[1.25] tracking-[-0.01em] text-au-navy">
                    {audience.title}
                  </h3>
                  <p className="mt-2 max-w-[218px] text-[11.5px] leading-[21px] text-au-ink-soft">
                    {audience.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
