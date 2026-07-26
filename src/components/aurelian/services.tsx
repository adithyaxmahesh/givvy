import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import { SERVICE_GROUPS } from './services-data';

export function Services() {
  return (
    <section id="services" className="scroll-mt-[84px] bg-au-cream">
      <div className="au-container pb-11 pt-9 sm:pb-12 sm:pt-10">
        <Reveal>
          <SectionHeading title="Services across the ownership lifecycle" sparkle />
        </Reveal>

        <div className="mt-[22px] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]">
          {SERVICE_GROUPS.map((group, groupIndex) => (
            <Reveal key={group.label} delay={groupIndex * 0.06} className="h-full">
              <div data-panel className={`h-full rounded-[13px] border ${group.edge} ${group.tint} p-[5px]`}>
                <p
                  className={`px-2 pb-[19px] pt-[19px] text-[11.5px] font-semibold tracking-[-0.005em] ${group.labelColor}`}
                >
                  {group.label}
                </p>
                <ul className="space-y-[6px]">
                  {group.services.map((service) => (
                    <li
                      key={service.title}
                      className="group rounded-[9px] border border-[#F2EDE5] bg-white py-[13px] pl-4 pr-7 shadow-[0_1px_2px_rgba(20,36,61,0.03)] transition-all duration-200 hover:-translate-y-[1px] hover:border-au-line/70 hover:shadow-[0_6px_18px_-10px_rgba(20,36,61,0.24)]"
                    >
                      <p className="text-[13px] font-semibold leading-[16px] tracking-[-0.005em] text-au-navy">
                        {service.title}
                      </p>
                      <p className="mt-1 max-w-[232px] text-[12px] leading-[21px] text-au-ink-soft">
                        {service.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
