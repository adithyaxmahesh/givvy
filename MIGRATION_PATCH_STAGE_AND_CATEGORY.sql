-- Run this ONLY if you already ran MIGRATION.sql with the original stage/category enums
-- and founder or talent onboarding is failing with check constraint errors.
-- This expands allowed values to match the app (founder: pre-seed, seed, series-a, series-b; talent: consulting, media).

-- Startups: allow app stages (pre-seed, seed, series-a, series-b)
alter table startups drop constraint if exists startups_stage_check;
alter table startups add constraint startups_stage_check check (stage in (
  'idea', 'mvp', 'early', 'growth', 'scale', 'pre-seed', 'seed', 'series-a', 'series-b'
));

-- Talent: allow consulting and media
alter table talent_profiles drop constraint if exists talent_profiles_category_check;
alter table talent_profiles add constraint talent_profiles_category_check check (category in (
  'engineering', 'design', 'marketing', 'sales', 'operations', 'finance',
  'legal', 'product', 'consulting', 'media'
));
