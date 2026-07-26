-- Migration: Fractional hiring marketplace
-- Run this in the Supabase SQL Editor after the base marketplace migrations.

-- Keep app categories aligned across talent profiles, open roles, posts, and matching.
alter table talent_profiles drop constraint if exists talent_profiles_category_check;
alter table talent_profiles add constraint talent_profiles_category_check check (category in (
  'engineering', 'design', 'marketing', 'sales', 'operations',
  'finance', 'legal', 'product', 'consulting', 'media'
));

alter table talent_profiles drop constraint if exists talent_profiles_availability_check;
alter table talent_profiles add constraint talent_profiles_availability_check check (
  availability in ('full-time', 'fractional', 'part-time', 'contract')
);

-- Open roles can now distinguish fractional/project/advisor work and cash/equity/blended compensation.
alter table open_roles add column if not exists marketplace_section text not null default 'fractional-hires';
alter table open_roles add column if not exists work_type text not null default 'fractional';
alter table open_roles add column if not exists compensation_type text not null default 'equity';
alter table open_roles add column if not exists cash_min numeric not null default 0;
alter table open_roles add column if not exists cash_max numeric not null default 0;

alter table open_roles drop constraint if exists open_roles_work_type_check;
alter table open_roles add constraint open_roles_work_type_check check (
  work_type in ('fractional', 'project', 'advisor', 'contract', 'full-time')
);

alter table open_roles drop constraint if exists open_roles_compensation_type_check;
alter table open_roles add constraint open_roles_compensation_type_check check (
  compensation_type in ('equity', 'cash', 'blended')
);

alter table open_roles drop constraint if exists open_roles_marketplace_section_check;
alter table open_roles add constraint open_roles_marketplace_section_check check (
  marketplace_section in ('fractional-hires', 'equity-work')
);

create index if not exists idx_roles_marketplace_section on open_roles(marketplace_section);
create index if not exists idx_roles_work_type on open_roles(work_type);
create index if not exists idx_roles_compensation_type on open_roles(compensation_type);

-- Marketplace posts mirror the same fractional work terms.
alter table posts add column if not exists marketplace_section text not null default 'fractional-hires';
alter table posts add column if not exists work_type text not null default 'fractional';
alter table posts add column if not exists compensation_type text not null default 'equity';
alter table posts add column if not exists cash_min numeric not null default 0;
alter table posts add column if not exists cash_max numeric not null default 0;

alter table posts drop constraint if exists posts_work_type_check;
alter table posts add constraint posts_work_type_check check (
  work_type in ('fractional', 'project', 'advisor', 'contract', 'full-time')
);

alter table posts drop constraint if exists posts_compensation_type_check;
alter table posts add constraint posts_compensation_type_check check (
  compensation_type in ('equity', 'cash', 'blended')
);

alter table posts drop constraint if exists posts_marketplace_section_check;
alter table posts add constraint posts_marketplace_section_check check (
  marketplace_section in ('fractional-hires', 'equity-work')
);

create index if not exists idx_posts_marketplace_section on posts(marketplace_section);
create index if not exists idx_posts_work_type on posts(work_type);
create index if not exists idx_posts_compensation_type on posts(compensation_type);

-- Proposals can state cash/equity intent separately from hourly/project pricing.
alter table proposals add column if not exists marketplace_section text not null default 'fractional-hires';
alter table proposals add column if not exists compensation_type text not null default 'equity';
alter table proposals add column if not exists proposed_equity_amount numeric(12,2) default null;
alter table proposals add column if not exists proposed_cash_amount numeric(12,2) default null;

alter table proposals drop constraint if exists proposals_compensation_type_check;
alter table proposals add constraint proposals_compensation_type_check check (
  compensation_type in ('equity', 'cash', 'blended')
);

alter table proposals drop constraint if exists proposals_marketplace_section_check;
alter table proposals add constraint proposals_marketplace_section_check check (
  marketplace_section in ('fractional-hires', 'equity-work')
);
