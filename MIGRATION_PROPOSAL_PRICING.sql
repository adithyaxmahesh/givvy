-- Migration: Add pricing fields to proposals table
-- Run this in the Supabase SQL Editor

-- Add pricing_type column (hourly or project-based)
alter table proposals add column if not exists pricing_type text not null default 'hourly' check (pricing_type in ('hourly', 'project'));

-- Add hourly_rate column (nullable, used when pricing_type = 'hourly')
alter table proposals add column if not exists hourly_rate numeric(10,2) default null;

-- Add project_amount column (nullable, used when pricing_type = 'project')
alter table proposals add column if not exists project_amount numeric(12,2) default null;

-- Add compensation mix fields for cash, equity, or blended fractional work
alter table proposals add column if not exists marketplace_section text not null default 'fractional-hires' check (marketplace_section in ('fractional-hires', 'equity-work'));
alter table proposals add column if not exists compensation_type text not null default 'equity' check (compensation_type in ('equity', 'cash', 'blended'));
alter table proposals add column if not exists proposed_equity_amount numeric(12,2) default null;
alter table proposals add column if not exists proposed_cash_amount numeric(12,2) default null;
