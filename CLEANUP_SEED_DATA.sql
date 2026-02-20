-- ============================================================================
-- CLEANUP SEED DATA
-- Run this in Supabase SQL Editor to remove all seed/demo data
-- while preserving real user data.
--
-- Seed accounts use these email domains:
--   @demo.com, @givvy.io, @equityexchange.io
-- ============================================================================

-- Step 1: Identify seed user IDs
-- (profiles whose email matches seed domains)
-- We'll use these to cascade-delete related data.

BEGIN;

-- Delete milestones linked to deals from seed startups or seed talent
DELETE FROM milestones
WHERE deal_id IN (
  SELECT id FROM deals
  WHERE startup_id IN (
    SELECT id FROM startups
    WHERE founder_id IN (
      SELECT id FROM profiles
      WHERE email LIKE '%@demo.com'
         OR email LIKE '%@givvy.io'
         OR email LIKE '%@equityexchange.io'
    )
  )
  OR talent_id IN (
    SELECT id FROM talent_profiles
    WHERE user_id IN (
      SELECT id FROM profiles
      WHERE email LIKE '%@demo.com'
         OR email LIKE '%@givvy.io'
         OR email LIKE '%@equityexchange.io'
    )
  )
);

-- Delete deals from seed users
DELETE FROM deals
WHERE startup_id IN (
  SELECT id FROM startups
  WHERE founder_id IN (
    SELECT id FROM profiles
    WHERE email LIKE '%@demo.com'
       OR email LIKE '%@givvy.io'
       OR email LIKE '%@equityexchange.io'
  )
)
OR talent_id IN (
  SELECT id FROM talent_profiles
  WHERE user_id IN (
    SELECT id FROM profiles
    WHERE email LIKE '%@demo.com'
       OR email LIKE '%@givvy.io'
       OR email LIKE '%@equityexchange.io'
  )
);

-- Delete open_roles from seed startups
DELETE FROM open_roles
WHERE startup_id IN (
  SELECT id FROM startups
  WHERE founder_id IN (
    SELECT id FROM profiles
    WHERE email LIKE '%@demo.com'
       OR email LIKE '%@givvy.io'
       OR email LIKE '%@equityexchange.io'
  )
);

-- Delete portfolio_holdings from seed talent
DELETE FROM portfolio_holdings
WHERE talent_id IN (
  SELECT id FROM talent_profiles
  WHERE user_id IN (
    SELECT id FROM profiles
    WHERE email LIKE '%@demo.com'
       OR email LIKE '%@givvy.io'
       OR email LIKE '%@equityexchange.io'
  )
);

-- Delete safe_documents from seed deals
DELETE FROM safe_documents
WHERE deal_id IN (
  SELECT id FROM deals
  WHERE startup_id IN (
    SELECT id FROM startups
    WHERE founder_id IN (
      SELECT id FROM profiles
      WHERE email LIKE '%@demo.com'
         OR email LIKE '%@givvy.io'
         OR email LIKE '%@equityexchange.io'
    )
  )
);

-- Delete notifications for seed users
DELETE FROM notifications
WHERE user_id IN (
  SELECT id FROM profiles
  WHERE email LIKE '%@demo.com'
     OR email LIKE '%@givvy.io'
     OR email LIKE '%@equityexchange.io'
);

-- Delete startups owned by seed founders
DELETE FROM startups
WHERE founder_id IN (
  SELECT id FROM profiles
  WHERE email LIKE '%@demo.com'
     OR email LIKE '%@givvy.io'
     OR email LIKE '%@equityexchange.io'
);

-- Delete talent_profiles for seed users
DELETE FROM talent_profiles
WHERE user_id IN (
  SELECT id FROM profiles
  WHERE email LIKE '%@demo.com'
     OR email LIKE '%@givvy.io'
     OR email LIKE '%@equityexchange.io'
);

-- Delete posts by seed users
DELETE FROM posts
WHERE author_id IN (
  SELECT id FROM profiles
  WHERE email LIKE '%@demo.com'
     OR email LIKE '%@givvy.io'
     OR email LIKE '%@equityexchange.io'
);

-- Delete profiles for seed users
DELETE FROM profiles
WHERE email LIKE '%@demo.com'
   OR email LIKE '%@givvy.io'
   OR email LIKE '%@equityexchange.io';

-- Delete auth users for seed accounts (run separately if using Supabase dashboard)
-- Note: You may need to delete auth.users via Supabase Dashboard > Authentication
-- since direct DELETE on auth.users may require special permissions.

COMMIT;
