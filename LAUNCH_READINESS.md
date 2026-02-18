# EquityExchange — Launch Readiness Audit

*Perspective: ex-founder of a billion-dollar startup (e.g. Mercor). What’s missing or broken to be ready for real users and real growth?*

---

## Executive summary

The product is a **two-sided equity-for-talent marketplace**: founders post startups and roles; talent post profiles; AI matching, deals, milestones, and SAFE documents are in place. The stack (Next.js 14, Supabase, Resend, OpenAI) is solid. **Several blocking bugs are fixed in this pass**; the rest of this doc is a prioritized list of gaps to close before and shortly after launch.

---

## Critical (fix before first real users)

### 1. **Deal status vs database** — FIXED

- **Was:** API created deals with `status: 'proposed'`. DB only allows `pending`, `negotiating`, `accepted`, `active`, `completed`, `cancelled`, `disputed`, `expired`. Inserts failed.
- **Fix:** `src/app/api/deals/route.ts` now uses `status: 'pending'`.

### 2. **Startup stage enum mismatch** — FIXED

- **Was:** Founder onboarding sends `pre-seed`, `seed`, `series-a`, `series-b`, `growth`. DB allowed only `idea`, `mvp`, `early`, `growth`, `scale`. Startup creation failed after onboarding.
- **Fix:** `MIGRATION.sql` updated to allow app stages. If you already ran the old migration, run `MIGRATION_PATCH_STAGE_AND_CATEGORY.sql` in the Supabase SQL editor.

### 3. **Talent category enum mismatch** — FIXED

- **Was:** Talent onboarding and validations use `consulting`, `media` (and app has no `sales`, `product`). DB allowed only `engineering`, `design`, `marketing`, `sales`, `operations`, `finance`, `legal`, `product`. Talent profile creation could fail.
- **Fix:** `MIGRATION.sql` updated to include `consulting`, `media`. Same patch file for existing DBs.

### 4. **Dashboard “Upcoming Milestones” always empty** — FIXED

- **Was:** `/api/deals` did not include `milestones`; dashboard uses `deals.flatMap(d => d.milestones ?? [])`, so the section was always empty.
- **Fix:** Deals list API now selects `milestones(id, title, due_date, status, equity_unlock)`.

### 5. **Welcome email never sent** — FIXED

- **Was:** `sendWelcomeEmail` existed but was never called. New users got no onboarding email.
- **Fix:** Signup API now calls `sendWelcomeEmail(email, full_name)` after successful account creation (non-blocking; safe if `RESEND_API_KEY` is unset).

---

## High priority (launch week)

### 6. **Session secret and env in production**

- **Risk:** `SESSION_SECRET` defaults to a dev value in `lib/auth.ts`. In production this must be a long, random secret (e.g. `openssl rand -hex 32`).
- **Action:** Set `SESSION_SECRET` in production env; never commit it. Add `.env.example` with placeholders and document in README.

### 7. **Demo credentials on login page**

- **Issue:** Login page says “Try: founder@demo.com / talent@demo.com (password: password123)”. Auth uses **Supabase** only; those accounts only work if they exist in your Supabase project.
- **Action:** Either (a) remove the demo hint for production, or (b) create those two users in Supabase (Dashboard → Authentication → Users) and optionally seed matching rows in `profiles` / `startups` / `talent_profiles` for demos.

### 8. **Email links point to hardcoded domain**

- **Issue:** `lib/email/send.ts` uses `https://equityexchange.io/...` in CTA links. In dev or custom domain this is wrong.
- **Action:** Use `process.env.NEXT_PUBLIC_APP_URL` (or similar) for all links in emails. You already have `NEXT_PUBLIC_APP_URL` in `.env.local`; wire it into the email templates.

### 9. **Resend “From” domain**

- **Issue:** `FROM_ADDRESS = 'EquityExchange <noreply@equityexchange.io>'`. Sending from your own domain requires verifying the domain in Resend.
- **Action:** For launch, use Resend’s sandbox domain or verify your domain; update `FROM_ADDRESS` accordingly.

### 10. **No rate limiting**

- **Risk:** Auth and API routes have no rate limiting. Vulnerable to brute-force (login/signup) and abuse.
- **Action:** Add rate limiting (e.g. Upstash Redis + `@upstash/ratelimit`, or Vercel KV) on `/api/auth/login`, `/api/auth/signup`, and key write APIs (e.g. deals, messages). At minimum, protect login/signup.

### 11. **Auth: single session store**

- **Current:** Session is cookie-based (`ee_session`). Supabase auth is used for signup/login; then a custom cookie drives API auth and middleware. Supabase session refresh in middleware is not wired for the cookie path.
- **Action:** Document that “logged in” is determined by `ee_session`; ensure session expiry (e.g. 7 days) and secure cookie flags are correct in production. If you later rely on Supabase session in server components, ensure middleware refreshes Supabase tokens where needed.

---

## Medium priority (first month)

### 12. **Email flows not wired**

- **Present:** `sendMatchNotification`, `sendDealProposal`, `sendMilestoneApproved`, `sendSAFEReady` are implemented but **never called**.
- **Action:** Call them at the right events: e.g. when a match is created, when a deal is proposed, when a milestone is approved, when a SAFE is ready for signature. Use queue/background if you don’t want to block the request.

### 13. **Error and not-found UX**

- **Missing:** No `app/not-found.tsx` or `app/error.tsx`. Users get the default Next.js pages.
- **Action:** Add a branded `not-found.tsx` and `error.tsx` (with optional reporting) for a more professional experience.

### 14. **Deal participant check on API**

- **Current:** Deal PATCH and other deal routes use `getAuthUser(cookie)` and admin client; they don’t verify that the user is actually a participant (founder of startup or owner of talent profile). Admin client bypasses RLS.
- **Action:** Before updating a deal (or messages/milestones/SAFE), resolve the user’s startups and talent profile and ensure they are a participant for that deal. Centralize this in a small helper used by all deal-scoped routes.

### 15. **Profile completeness and redirects**

- **Gap:** After signup, users go to founder or talent onboarding. There’s no enforcement that they complete it before using dashboard/marketplace (e.g. “complete your profile” gate or redirect).
- **Action:** In middleware or dashboard layout, if user has no startup (founder) or no talent_profile (talent), redirect to the right onboarding step and show a clear CTA.

### 16. **Open Roles category**

- **DB:** `open_roles.category` is `text not null` with no check. App uses the same categories as talent (engineering, design, etc.). If you add a check later, keep it aligned with `validations.ts` and talent categories.

### 17. **Milestone status wording**

- **DB:** Milestone statuses are `pending`, `in-progress`, `completed`, `verified`, `missed`. App types use `review`, `approved`, `rejected`. UI uses `getStatusColor(ms.status)` which has keys for both sets; “verified” will fall back to default gray. Consider aligning type names and adding explicit colors for `verified` / `missed` for clarity.

---

## Growth and ops (post-launch)

### 18. **Analytics and events**

- **Missing:** No product analytics (e.g. signup, onboarding complete, deal created, SAFE signed). You can’t measure funnel or retention.
- **Action:** Add an analytics provider (PostHog, Mixpanel, or Vercel Analytics + custom events) and send key events: signup, onboarding_complete, deal_created, deal_accepted, safe_signed.

### 19. **SEO and landing**

- **Missing:** No custom `metadata` in `app/layout.tsx` or per-page (title, description, OG). Landing and marketplace pages are not optimized for search or shares.
- **Action:** Add default and page-level metadata; consider static or dynamic OG images for startup/talent pages if you want them to be shareable.

### 20. **Monitoring and alerts**

- **Missing:** No error tracking or uptime checks. Failures in production may go unnoticed.
- **Action:** Add Sentry (or similar) for errors; use Vercel alerts or an external monitor for uptime. Optionally log critical paths (e.g. deal creation, SAFE sign) for debugging.

### 21. **Legal and compliance**

- **Note:** Equity and SAFEs are legally sensitive. You have a “consult legal counsel” note in the SAFE email, which is good.
- **Action:** Before scaling: terms of use, privacy policy, and if you hold or transmit sensitive data, a basic compliance review. Consider disclaimers that the platform does not provide legal/financial advice.

### 22. **Password and auth hardening**

- **Current:** Supabase handles password hashing. Custom cookie session is HMAC-signed; no refresh rotation.
- **Action:** Rely on Supabase auth best practices; consider “forgot password” flow (Supabase supports it) and optional 2FA later. Keep session lifetime and cookie settings appropriate for a financial-ish product.

---

## Checklist before going live

- [ ] Run `MIGRATION.sql` on production Supabase (or run patch if DB already exists).
- [ ] Set `SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`, Supabase keys, and optionally `RESEND_API_KEY`, `OPENAI_API_KEY` in production.
- [ ] Remove or fulfill demo credentials on login (see §7).
- [ ] Use `NEXT_PUBLIC_APP_URL` (or equivalent) in all email links (§8).
- [ ] Verify Resend domain or use sandbox (§9).
- [ ] Add rate limiting at least on auth routes (§10).
- [ ] Test full flows: signup → onboarding (founder + talent) → create deal → milestones → SAFE (if used).
- [ ] Add minimal error/not-found pages (§13).
- [ ] Plan first version of analytics and monitoring (§18, §20).

---

## Summary of code changes made in this audit

1. **`src/app/api/deals/route.ts`**  
   - New deals use `status: 'pending'`.  
   - List response now includes `milestones(id, title, due_date, status, equity_unlock)`.

2. **`MIGRATION.sql`**  
   - `startups.stage`: added `pre-seed`, `seed`, `series-a`, `series-b`.  
   - `talent_profiles.category`: added `consulting`, `media`.

3. **`MIGRATION_PATCH_STAGE_AND_CATEGORY.sql`** (new)  
   - For existing DBs: drops and re-adds stage and category check constraints with the new values.

4. **`src/app/api/auth/signup/route.ts`**  
   - Calls `sendWelcomeEmail(email, full_name)` after successful signup (non-blocking).

After applying the migration (or patch), founder and talent onboarding should succeed, deals should create and list with milestones, and new users should receive the welcome email when Resend is configured.
