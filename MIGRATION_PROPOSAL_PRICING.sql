-- Migration: Add pricing fields to proposals table
-- Run this in the Supabase SQL Editor

-- Add pricing_type column (hourly or project-based)
alter table proposals add column if not exists pricing_type text not null default 'hourly' check (pricing_type in ('hourly', 'project'));

-- Add hourly_rate column (nullable, used when pricing_type = 'hourly')
alter table proposals add column if not exists hourly_rate numeric(10,2) default null;

-- Add project_amount column (nullable, used when pricing_type = 'project')
alter table proposals add column if not exists project_amount numeric(12,2) default null;
