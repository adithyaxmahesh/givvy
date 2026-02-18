// Givvy - Core Type Definitions

// ─── Enums / Union Types ───────────────────────────────────────────────────────

export type UserRole = 'founder' | 'talent';

export type StartupStage =
  | 'pre-seed'
  | 'seed'
  | 'series-a'
  | 'series-b'
  | 'growth';

export type SkillCategory =
  | 'engineering'
  | 'design'
  | 'legal'
  | 'finance'
  | 'marketing'
  | 'consulting'
  | 'media'
  | 'operations';

export type DealStatus =
  | 'proposed'
  | 'negotiating'
  | 'terms-agreed'
  | 'safe-generated'
  | 'signed'
  | 'active'
  | 'completed'
  | 'cancelled';

export type MilestoneStatus =
  | 'pending'
  | 'in-progress'
  | 'review'
  | 'approved'
  | 'rejected';

export type HoldingStatus = 'active' | 'vesting' | 'vested' | 'exited';

export type Availability = 'full-time' | 'part-time' | 'contract';

export type SAFETemplate = 'yc-standard' | 'yc-mfn' | 'custom';

export type SAFEDocStatus = 'draft' | 'pending-signature' | 'signed' | 'voided';

export type NotificationType =
  | 'deal'
  | 'milestone'
  | 'message'
  | 'match'
  | 'system';

// ─── Core Interfaces ───────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url: string | null;
  location: string | null;
  verified: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Startup {
  id: string;
  founder_id: string;
  name: string;
  logo_url: string | null;
  logo_emoji: string;
  tagline: string | null;
  description: string | null;
  stage: StartupStage;
  industry: string | null;
  location: string | null;
  founded: string | null;
  team_size: number;
  funding: string | null;
  valuation: string | null;
  equity_pool: number;
  website: string | null;
  pitch: string | null;
  traction: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
  founder?: Profile;
  open_roles?: OpenRole[];
}

export interface TalentProfile {
  id: string;
  user_id: string;
  title: string;
  bio: string | null;
  skills: string[];
  category: SkillCategory | null;
  experience_years: number;
  hourly_rate: string | null;
  location: string | null;
  availability: Availability;
  preferred_industries: string[];
  min_equity: number;
  rating: number;
  completed_deals: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

export interface OpenRole {
  id: string;
  startup_id: string;
  title: string;
  category: SkillCategory | null;
  equity_min: number;
  equity_max: number;
  cash_equivalent: string | null;
  description: string | null;
  requirements: string[];
  duration: string | null;
  status: 'open' | 'in-progress' | 'filled';
  created_at: string;
  startup?: Startup;
}

export interface SAFETerms {
  type: 'post-money' | 'pre-money';
  valuation_cap: number;
  discount: number;
  equity_percent: number;
  vesting_schedule: number;
  cliff_period: number;
  pro_rata: boolean;
  mfn_clause: boolean;
  board_seat: boolean;
  template: SAFETemplate;
}

export interface Deal {
  id: string;
  startup_id: string;
  talent_id: string;
  role_id: string | null;
  status: DealStatus;
  equity_percent: number;
  vesting_months: number;
  cliff_months: number;
  safe_terms: SAFETerms;
  match_score: number;
  created_at: string;
  updated_at: string;
  startup?: Startup;
  talent?: TalentProfile;
  role?: OpenRole;
  milestones?: Milestone[];
  messages?: Message[];
  safe_document?: SAFEDocument;
}

export interface Milestone {
  id: string;
  deal_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  equity_unlock: number;
  status: MilestoneStatus;
  deliverables: string[];
  created_at: string;
}

export interface Message {
  id: string;
  deal_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'system' | 'terms-update' | 'milestone-update';
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    role?: string;
  };
}

export interface VersionEntry {
  version: number;
  date: string;
  description: string;
  author: string;
}

export interface AuditEntry {
  action: string;
  timestamp: string;
  actor: string;
}

export interface SignatureData {
  signed: boolean;
  signer_name: string;
  signer_title: string;
  signed_at: string | null;
  ip_address?: string;
}

export interface SAFEDocument {
  id: string;
  deal_id: string;
  template: SAFETemplate;
  status: SAFEDocStatus;
  terms: SAFETerms;
  document_url: string | null;
  version_history: VersionEntry[];
  audit_trail: AuditEntry[];
  signatures: Record<string, SignatureData>;
  created_at: string;
  updated_at: string;
}

export interface PortfolioHolding {
  id: string;
  talent_id: string;
  startup_id: string;
  deal_id: string | null;
  equity_percent: number;
  safe_amount: string | null;
  valuation_cap: string | null;
  status: HoldingStatus;
  current_value: string | null;
  return_multiple: number;
  date_issued: string;
  startup?: Startup;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: NotificationType;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface AIMatchResult {
  score: number;
  reasons: string[];
  suggested_equity: [number, number];
  success_probability: number;
  deal_structure: string;
  risk_factors: string[];
}
