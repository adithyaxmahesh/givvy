import {
  IconEmergingManagers,
  IconFamilyOffices,
  IconFounders,
  IconHoldingCompanies,
  IconPeFirms,
  IconVentureFunds,
} from './icons';

const AUDIENCES = [
  { label: 'Founders', icon: IconFounders },
  { label: 'PE Firms', icon: IconPeFirms },
  { label: 'Family Offices', icon: IconFamilyOffices },
  { label: 'Emerging Managers', icon: IconEmergingManagers },
  { label: 'Venture Funds', icon: IconVentureFunds },
  { label: 'Holding Companies', icon: IconHoldingCompanies },
];

export function TrustStrip() {
  return (
    <section className="border-b border-au-line/80 bg-au-cream">
      <div className="au-container pb-[31px] pt-[13px]">
        <p className="text-center text-[9.5px] font-medium uppercase tracking-[0.22em] text-au-ink-soft/90">
          Trusted by teams across ownership
        </p>
        <ul className="mx-auto mt-[29px] flex max-w-[1248px] flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-10 lg:justify-between lg:gap-0">
          {AUDIENCES.map(({ label, icon: Icon }) => (
            <li key={label} className="flex items-center gap-2.5">
              <Icon className="h-[22px] w-[22px] text-au-ink-soft" />
              <span className="whitespace-nowrap text-[11.5px] font-medium tracking-[-0.005em] text-au-ink">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
