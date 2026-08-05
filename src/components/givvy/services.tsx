import Link from 'next/link';
import { ArrowRight } from './icons';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import { SERVICE_GROUPS } from './services-data';

export function Services() {
  return (
    <section id="services" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-11 pt-9 sm:pb-12 sm:pt-10">
        <Reveal>
          <SectionHeading title="What we do" sparkle />
        </Reveal>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_GROUPS.map((group, groupIndex) => (
            <Reveal key={group.label} delay={groupIndex * 0.06} className="h-full">
              <Link
                href={`/services/${group.slug}`}
                data-panel
                className={`group flex min-h-[230px] h-full flex-col rounded-[15px] border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_35px_-24px_rgba(20,36,61,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-au-blue focus-visible:ring-offset-4 focus-visible:ring-offset-au-cream ${group.edge} ${group.tint}`}
              >
                <p className={`text-[11.5px] font-semibold tracking-[-0.005em] ${group.labelColor}`}>
                  {group.label}
                </p>
                <h3 className="mt-8 text-[18px] font-semibold leading-[1.15] tracking-[-0.025em] text-au-navy">
                  {group.name}
                </h3>
                <p className="mt-3 text-[12.5px] leading-[21px] text-au-ink-soft">
                  {group.summary}
                </p>
                <span
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-[12.5px] font-semibold text-au-navy"
                >
                  Read more
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
