-- ============================================================================
-- CLEANUP SEED DATA
-- Run this in Supabase SQL Editor to remove all seed/demo data
-- while preserving real user data.
--
-- Seed accounts use these email domains:
--   @demo.com, @givvy.io, @equityexchange.io
-- ============================================================================

BEGIN;

-- 1. Delete portfolio_holdings (references deals and talent_profiles)
DELETE FROM portfolio_holdings
WHERE talent_id IN (
  SELECT id FROM talent_profiles
  WHERE user_id IN (
    SELECT id FROM profiles
    WHERE email LIKE '%@demo.com'
       OR email LIKE '%@givvy.io'
       OR email LIKE '%@equityexchange.io'
  )
)
OR deal_id IN (
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

-- 2. Delete safe_documents (references deals)
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

-- 3. Delete milestones (references deals)
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

-- 4. Delete deals (now safe — no more references to it)
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

-- 5. Delete open_roles (references startups)
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

-- 6. Delete notifications
DELETE FROM notifications
WHERE user_id IN (
  SELECT id FROM profiles
  WHERE email LIKE '%@demo.com'
     OR email LIKE '%@givvy.io'
     OR email LIKE '%@equityexchange.io'
);

-- 7. Delete proposals (references posts)
DELETE FROM proposals
WHERE post_id IN (
  SELECT id FROM posts
  WHERE author_id IN (
    SELECT id FROM profiles
    WHERE email LIKE '%@demo.com'
       OR email LIKE '%@givvy.io'
       OR email LIKE '%@equityexchange.io'
  )
)
OR sender_id IN (
  SELECT id FROM profiles
  WHERE email LIKE '%@demo.com'
     OR email LIKE '%@givvy.io'
     OR email LIKE '%@equityexchange.io'
);

-- 8. Delete posts
DELETE FROM posts
WHERE author_id IN (
  SELECT id FROM profiles
  WHERE email LIKE '%@demo.com'
     OR email LIKE '%@givvy.io'
     OR email LIKE '%@equityexchange.io'
);

-- 9. Delete startups (now safe — open_roles and deals removed)
DELETE FROM startups
WHERE founder_id IN (
  SELECT id FROM profiles
  WHERE email LIKE '%@demo.com'
     OR email LIKE '%@givvy.io'
     OR email LIKE '%@equityexchange.io'
);

-- 10. Delete talent_profiles
DELETE FROM talent_profiles
WHERE user_id IN (
  SELECT id FROM profiles
  WHERE email LIKE '%@demo.com'
     OR email LIKE '%@givvy.io'
     OR email LIKE '%@equityexchange.io'
);

-- 11. Delete profiles (last — everything else references this)
DELETE FROM profiles
WHERE email LIKE '%@demo.com'
   OR email LIKE '%@givvy.io'
   OR email LIKE '%@equityexchange.io';

COMMIT;

-- NOTE: After running this, go to Supabase Dashboard > Authentication > Users
-- and manually delete the seed auth users (@demo.com, @givvy.io, @equityexchange.io)
