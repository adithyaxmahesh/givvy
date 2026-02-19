-- ============================================================================
-- Givvy — SAFE Dollar Amounts Migration
-- Converts equity_percent (percentage) columns to investment_amount (dollar)
-- and equity_unlock to unlock_amount in milestones.
--
-- SAFE notes are structured as dollar figures, not percentages.
-- This migration renames columns and converts existing data accordingly.
-- ============================================================================

-- 1. Deals: rename equity_percent -> investment_amount
-- Convert: investment_amount = valuation_cap * equity_percent / 100
ALTER TABLE deals RENAME COLUMN equity_percent TO investment_amount;

-- Update existing deal values: compute dollar amount from safe_terms
UPDATE deals
SET investment_amount = COALESCE(
  (safe_terms->>'valuation_cap')::float * investment_amount / 100,
  investment_amount
)
WHERE investment_amount > 0 AND investment_amount < 100;

-- Update safe_terms JSONB to use investment_amount instead of equity_percent
UPDATE deals
SET safe_terms = safe_terms - 'equity_percent' || jsonb_build_object(
  'investment_amount',
  COALESCE(
    (safe_terms->>'valuation_cap')::float * (safe_terms->>'equity_percent')::float / 100,
    0
  )
)
WHERE safe_terms ? 'equity_percent';

-- 2. Milestones: rename equity_unlock -> unlock_amount
ALTER TABLE milestones RENAME COLUMN equity_unlock TO unlock_amount;

-- 3. Portfolio Holdings: rename equity_percent -> investment_amount
ALTER TABLE portfolio_holdings RENAME COLUMN equity_percent TO investment_amount;

-- Convert existing portfolio values: use safe_amount if available, else compute
UPDATE portfolio_holdings
SET investment_amount = COALESCE(
  safe_amount::float,
  (valuation_cap::float * investment_amount / 100),
  investment_amount
)
WHERE investment_amount > 0 AND investment_amount < 100;

-- 4. Open Roles: equity_min/equity_max are now dollar amounts
-- No column rename needed, but existing percentage data should be converted
-- if the startup's valuation is available
UPDATE open_roles r
SET
  equity_min = COALESCE(
    (SELECT s.valuation::float FROM startups s WHERE s.id = r.startup_id) * r.equity_min / 100,
    r.equity_min
  ),
  equity_max = COALESCE(
    (SELECT s.valuation::float FROM startups s WHERE s.id = r.startup_id) * r.equity_max / 100,
    r.equity_max
  )
WHERE r.equity_min > 0 AND r.equity_min < 100;

-- 5. Talent Profiles: min_equity is now a dollar amount
-- Convert from percentage to a reasonable dollar default
UPDATE talent_profiles
SET min_equity = min_equity * 100000
WHERE min_equity > 0 AND min_equity < 100;

-- ============================================================================
-- Done! All equity fields now use dollar amounts instead of percentages.
-- ============================================================================
