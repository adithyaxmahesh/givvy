import { z } from 'zod';

export const TASK_STATUS_VALUES = ['todo', 'in_progress', 'blocked', 'done'] as const;
export const TASK_PRIORITY_VALUES = ['low', 'medium', 'high'] as const;
export const PROJECT_STATUS_VALUES = ['active', 'on_hold', 'closed'] as const;
export const PORTAL_ROLE_VALUES = ['admin', 'client'] as const;

// Passwords are trimmed everywhere they are set or checked, so a credential can
// never contain leading or trailing whitespace. Without this, pasting a password
// that picked up a stray space fails as "invalid password" with no way to tell.
export const portalLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().trim().min(1, 'Password is required'),
});

export const portalChangePasswordSchema = z.object({
  current_password: z.string().trim().min(1, 'Current password is required'),
  new_password: z
    .string()
    .trim()
    .min(10, 'New password must be at least 10 characters')
    .max(128, 'New password must be 128 characters or less'),
});

export const portalUserCreateSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  full_name: z.string().trim().min(1, 'Name is required').max(100),
  company: z.string().trim().max(200).default(''),
  role: z.enum(PORTAL_ROLE_VALUES).default('client'),
  password: z
    .string()
    .trim()
    .min(10, 'Password must be at least 10 characters')
    .max(128, 'Password must be 128 characters or less'),
  project_ids: z.array(z.string().uuid()).default([]),
});

export const portalProjectCreateSchema = z.object({
  name: z.string().trim().min(1, 'Engagement name is required').max(200),
  client_name: z.string().trim().max(200).default(''),
  description: z.string().trim().max(2000).default(''),
  status: z.enum(PROJECT_STATUS_VALUES).default('active'),
});

export const portalTaskCreateSchema = z.object({
  project_id: z.string().uuid('Invalid engagement'),
  title: z.string().trim().min(1, 'Task title is required').max(300),
  description: z.string().trim().max(5000).default(''),
  section: z.string().trim().min(1).max(100).default('General'),
  status: z.enum(TASK_STATUS_VALUES).default('todo'),
  priority: z.enum(TASK_PRIORITY_VALUES).default('medium'),
  assignee_id: z.string().uuid().nullable().default(null),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').nullable().default(null),
});

export const portalTaskUpdateSchema = z.object({
  id: z.string().uuid('Invalid task'),
  title: z.string().trim().min(1).max(300).optional(),
  description: z.string().trim().max(5000).optional(),
  section: z.string().trim().min(1).max(100).optional(),
  status: z.enum(TASK_STATUS_VALUES).optional(),
  priority: z.enum(TASK_PRIORITY_VALUES).optional(),
  assignee_id: z.string().uuid().nullable().optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').nullable().optional(),
  position: z.number().int().optional(),
});

export type PortalTaskStatus = (typeof TASK_STATUS_VALUES)[number];
export type PortalTaskPriority = (typeof TASK_PRIORITY_VALUES)[number];
export type PortalProjectStatus = (typeof PROJECT_STATUS_VALUES)[number];
