-- ============================================================================
-- Givvy — Onboarding V2 Migration
-- Run AFTER MIGRATION.sql and MIGRATION_APPROVAL_AND_PROFILE.sql
-- Safe to re-run.
--
-- This migration ensures the profiles table has all columns needed for
-- the new role-based onboarding (startup vs talent).
-- The onboarding_answers JSONB column stores all answers — no new columns
-- needed since data is flexible. This migration just ensures the columns
-- from the prior patch exist and adds a comment.
-- ============================================================================

-- Ensure columns exist (idempotent)
alter table profiles
  add column if not exists linkedin text,
  add column if not exists website text,
  add column if not exists onboarding_answers jsonb not null default '{}'::jsonb;

-- ============================================================================
-- ONBOARDING ANSWERS SCHEMA REFERENCE
-- The onboarding_answers JSONB column stores different keys per role:
--
-- === For Founders (role = 'founder') ===
--   company_description  text    What the startup does
--   location             text    Where the startup is based
--   startup_website      text    Startup website URL
--   stage                text    pre-seed | seed | series-a | series-b | growth
--   funding              text    How much funding raised (free text)
--   revenue              text    Monthly revenue range
--   talent_needs         text    What kind of talent they need
--   how_hear             text    How they heard about Givvy
--
-- === For Talent (role = 'talent') ===
--   talent_category      text    lawyer | consultant | accountant | media | coding | marketing | other
--   specialties          text    Comma-separated list of specialties
--   specialty_other      text    Free-text additional specialty info
--   experience_years     text    Years of experience (number as string)
--   experience_description text  Description of experience
--   location             text    Where the talent is based
--   how_hear             text    How they heard about Givvy
--
-- Admin can query these via:
--   SELECT
--     full_name, email, role, verified,
--     linkedin, website,
--     onboarding_answers->>'talent_category' as category,
--     onboarding_answers->>'specialties' as specialties,
--     onboarding_answers->>'stage' as stage,
--     onboarding_answers->>'revenue' as revenue,
--     onboarding_answers->>'company_description' as description
--   FROM profiles
--   ORDER BY created_at DESC;
-- ============================================================================

-- Index for quick filtering by category or stage inside JSONB
create index if not exists idx_profiles_onboarding_category
  on profiles using btree (((onboarding_answers->>'talent_category')));

create index if not exists idx_profiles_onboarding_stage
  on profiles using btree (((onboarding_answers->>'stage')));
