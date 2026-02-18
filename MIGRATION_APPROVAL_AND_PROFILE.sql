-- ============================================================================
-- Givvy — Approval flow & profile fields (linkedin, website, onboarding Q&A)
-- Run this after MIGRATION.sql. Safe to re-run.
-- ============================================================================

-- Add optional profile fields and onboarding answers for admin review
alter table profiles
  add column if not exists linkedin text,
  add column if not exists website text,
  add column if not exists onboarding_answers jsonb not null default '{}'::jsonb;

comment on column profiles.linkedin is 'Optional LinkedIn profile URL';
comment on column profiles.website is 'Optional personal or company website URL';
comment on column profiles.onboarding_answers is 'Q&A from onboarding (admin review)';

-- Ensure new users start unverified (pending approval) - already default false
-- No change needed; verified boolean default false is already in MIGRATION.sql
