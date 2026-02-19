import { z } from 'zod';

// ─── Auth Schemas ──────────────────────────────────────────────────────────────

export const signupSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be 128 characters or less'),
  role: z.enum(['founder', 'talent'], {
    required_error: 'Please select a role',
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Startup Schema ────────────────────────────────────────────────────────────

export const startupSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100),
  logo_emoji: z.string().default('🚀'),
  tagline: z
    .string()
    .max(200, 'Tagline must be 200 characters or less')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .or(z.literal('')),
  stage: z.enum(['pre-seed', 'seed', 'series-a', 'series-b', 'growth'], {
    required_error: 'Please select a stage',
  }),
  industry: z.string().max(100).optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  founded: z.string().optional().or(z.literal('')),
  team_size: z.coerce.number().int().min(1, 'Team size must be at least 1').default(1),
  funding: z.string().optional().or(z.literal('')),
  valuation: z.string().optional().or(z.literal('')),
  equity_pool: z.coerce
    .number()
    .min(0, 'Equity pool cannot be negative')
    .max(100, 'Equity pool cannot exceed 100%')
    .default(10),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  pitch: z
    .string()
    .max(10000, 'Pitch must be 10000 characters or less')
    .optional()
    .or(z.literal('')),
  traction: z.array(z.string()).default([]),
});

// ─── Talent Profile Schema ─────────────────────────────────────────────────────

export const talentProfileSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  bio: z
    .string()
    .max(2000, 'Bio must be 2000 characters or less')
    .optional()
    .or(z.literal('')),
  skills: z
    .array(z.string())
    .min(1, 'Please add at least one skill'),
  category: z.enum(
    [
      'engineering',
      'design',
      'legal',
      'finance',
      'marketing',
      'consulting',
      'media',
      'operations',
    ],
    { required_error: 'Please select a category' }
  ),
  experience_years: z.coerce
    .number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Please enter a valid number of years'),
  hourly_rate: z.string().optional().or(z.literal('')),
  location: z.string().max(200).optional().or(z.literal('')),
  availability: z
    .enum(['full-time', 'part-time', 'contract'])
    .default('full-time'),
  preferred_industries: z.array(z.string()).default([]),
  min_equity: z.coerce
    .number()
    .min(0, 'Minimum equity cannot be negative')
    .default(0.1),
});

// ─── Open Role Schema ──────────────────────────────────────────────────────────

export const openRoleSchema = z.object({
  title: z.string().min(1, 'Role title is required').max(100),
  category: z
    .enum([
      'engineering',
      'design',
      'legal',
      'finance',
      'marketing',
      'consulting',
      'media',
      'operations',
    ])
    .optional(),
  equity_min: z.coerce
    .number()
    .min(0, 'Equity minimum cannot be negative')
    .max(100),
  equity_max: z.coerce
    .number()
    .min(0, 'Equity maximum cannot be negative')
    .max(100),
  cash_equivalent: z.string().optional().or(z.literal('')),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .optional()
    .or(z.literal('')),
  requirements: z.array(z.string()).default([]),
  duration: z.string().optional().or(z.literal('')),
});

// ─── Deal Schema ───────────────────────────────────────────────────────────────

export const dealSchema = z.object({
  startup_id: z.string().min(1, 'Startup is required'),
  talent_id: z.string().min(1, 'Talent is required'),
  role_id: z.string().optional().or(z.literal('')),
  equity_percent: z.coerce
    .number()
    .min(0.01, 'Equity must be greater than 0')
    .max(100, 'Equity cannot exceed 100%'),
  vesting_months: z.coerce
    .number()
    .int()
    .min(1, 'Vesting period must be at least 1 month')
    .max(60, 'Vesting period cannot exceed 60 months')
    .default(48),
  cliff_months: z.coerce
    .number()
    .int()
    .min(0, 'Cliff cannot be negative')
    .max(24, 'Cliff cannot exceed 24 months')
    .default(12),
  safe_terms: z.object({
    type: z.enum(['post-money', 'pre-money']).default('post-money'),
    valuation_cap: z.coerce.number().min(0).default(0),
    discount: z.coerce.number().min(0).max(100).default(0),
    equity_percent: z.coerce.number().min(0).max(100),
    vesting_schedule: z.coerce.number().int().min(1).default(48),
    cliff_period: z.coerce.number().int().min(0).default(12),
    pro_rata: z.boolean().default(false),
    mfn_clause: z.boolean().default(false),
    board_seat: z.boolean().default(false),
    template: z.enum(['yc-standard', 'yc-mfn', 'custom']).default('yc-standard'),
  }),
});

// ─── Milestone Schema ──────────────────────────────────────────────────────────

export const milestoneSchema = z.object({
  title: z.string().min(1, 'Milestone title is required').max(200),
  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less')
    .optional()
    .or(z.literal('')),
  due_date: z.string().optional().or(z.literal('')),
  equity_unlock: z.coerce
    .number()
    .min(0, 'Equity unlock cannot be negative')
    .max(100, 'Equity unlock cannot exceed 100%'),
  deliverables: z.array(z.string()).default([]),
});

// ─── Message Schema ────────────────────────────────────────────────────────────

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message must be 5000 characters or less'),
  type: z
    .enum(['text', 'system', 'terms-update', 'milestone-update'])
    .default('text'),
});

// ─── Matching / Search Schema ──────────────────────────────────────────────────

export const matchingRequestSchema = z.object({
  startup_id: z.string().optional(),
  talent_id: z.string().optional(),
  role_id: z.string().optional(),
  skills: z.array(z.string()).optional(),
  category: z
    .enum([
      'engineering',
      'design',
      'legal',
      'finance',
      'marketing',
      'consulting',
      'media',
      'operations',
    ])
    .optional(),
  min_experience: z.coerce.number().min(0).optional(),
  max_equity: z.coerce.number().min(0).max(100).optional(),
  availability: z.enum(['full-time', 'part-time', 'contract']).optional(),
  location: z.string().optional(),
});

// ─── Post Schema ────────────────────────────────────────────────────────────

export const postSchema = z.object({
  type: z.enum(['seeking', 'offering'], {
    required_error: 'Please select a post type',
  }),
  title: z.string().min(1, 'Title is required').max(200),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .default(''),
  category: z.string().max(100).default(''),
  equity_min: z.coerce.number().min(0).max(100).default(0),
  equity_max: z.coerce.number().min(0).max(100).default(0),
  tags: z.array(z.string()).default([]),
});

// ─── Inferred Types ────────────────────────────────────────────────────────────

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type StartupInput = z.infer<typeof startupSchema>;
export type TalentProfileInput = z.infer<typeof talentProfileSchema>;
export type OpenRoleInput = z.infer<typeof openRoleSchema>;
export type DealInput = z.infer<typeof dealSchema>;
export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type MatchingRequestInput = z.infer<typeof matchingRequestSchema>;
export type PostInput = z.infer<typeof postSchema>;
