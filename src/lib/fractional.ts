export const MARKETPLACE_CATEGORIES = [
  { value: 'engineering', label: 'Engineering', emoji: '💻' },
  { value: 'design', label: 'Design', emoji: '🎨' },
  { value: 'legal', label: 'Legal', emoji: '⚖️' },
  { value: 'finance', label: 'Finance', emoji: '📊' },
  { value: 'sales', label: 'Sales / SDR', emoji: '📞' },
  { value: 'marketing', label: 'Marketing', emoji: '📈' },
  { value: 'product', label: 'Product', emoji: '🧭' },
  { value: 'operations', label: 'Operations', emoji: '⚙️' },
  { value: 'consulting', label: 'Consulting', emoji: '🤝' },
  { value: 'media', label: 'Media', emoji: '🎬' },
] as const;

export const WORK_TYPES = [
  { value: 'fractional', label: 'Fractional', description: 'Ongoing part-time leadership or execution' },
  { value: 'project', label: 'Project', description: 'Scoped deliverable with a clear finish line' },
  { value: 'advisor', label: 'Advisor', description: 'Strategic guidance and periodic support' },
  { value: 'contract', label: 'Contract', description: 'Flexible short-term work' },
  { value: 'full-time', label: 'Full-time', description: 'Dedicated long-term hire' },
] as const;

export const COMPENSATION_TYPES = [
  { value: 'equity', label: 'Equity', description: 'SAFE or stock-based compensation' },
  { value: 'cash', label: 'Cash', description: 'Cash retainer, hourly, or project fee' },
  { value: 'blended', label: 'Cash + Equity', description: 'Reduced cash plus startup upside' },
] as const;

export const MARKETPLACE_SECTIONS = [
  {
    value: 'fractional-hires',
    label: 'Fractional Hires',
    shortLabel: 'Fractional',
    description: 'Hire embedded fractional CFOs, SDRs, operators, product leads, and advisors with cash or blended compensation.',
  },
  {
    value: 'equity-work',
    label: 'Equity Work',
    shortLabel: 'Equity',
    description: 'Find equity-compensated projects, advisory work, and startup execution opportunities backed by SAFE terms.',
  },
] as const;

export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number]['value'];
export type WorkType = (typeof WORK_TYPES)[number]['value'];
export type CompensationType = (typeof COMPENSATION_TYPES)[number]['value'];
export type MarketplaceSection = (typeof MARKETPLACE_SECTIONS)[number]['value'];

export const MARKETPLACE_CATEGORY_VALUES = MARKETPLACE_CATEGORIES.map((category) => category.value) as [
  MarketplaceCategory,
  ...MarketplaceCategory[],
];

export const WORK_TYPE_VALUES = WORK_TYPES.map((type) => type.value) as [
  WorkType,
  ...WorkType[],
];

export const COMPENSATION_TYPE_VALUES = COMPENSATION_TYPES.map((type) => type.value) as [
  CompensationType,
  ...CompensationType[],
];

export const MARKETPLACE_SECTION_VALUES = MARKETPLACE_SECTIONS.map((section) => section.value) as [
  MarketplaceSection,
  ...MarketplaceSection[],
];

export function getCategoryLabel(category?: string | null): string {
  return MARKETPLACE_CATEGORIES.find((item) => item.value === category)?.label ?? category ?? '';
}

export function getWorkTypeLabel(workType?: string | null): string {
  return WORK_TYPES.find((item) => item.value === workType)?.label ?? workType ?? '';
}

export function getCompensationTypeLabel(compensationType?: string | null): string {
  return COMPENSATION_TYPES.find((item) => item.value === compensationType)?.label ?? compensationType ?? '';
}

export function getMarketplaceSectionLabel(section?: string | null): string {
  return MARKETPLACE_SECTIONS.find((item) => item.value === section)?.label ?? section ?? '';
}

export function getMarketplaceSectionDescription(section?: string | null): string {
  return MARKETPLACE_SECTIONS.find((item) => item.value === section)?.description ?? '';
}
