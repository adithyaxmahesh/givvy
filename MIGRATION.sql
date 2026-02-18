-- ============================================================================
-- Givvy — Full Database Migration
-- Paste this entire file into the Supabase SQL Editor and click "Run".
-- Safe to re‑run: uses IF NOT EXISTS / IF EXISTS throughout.
-- ============================================================================

-- 0. Extensions
-- ============================================================================
create extension if not exists "uuid-ossp" with schema extensions;


-- ============================================================================
-- 1. TABLES (10)
-- ============================================================================

-- 1a. profiles
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('founder', 'talent')),
  full_name   text not null,
  email       text not null,
  avatar_url  text,
  location    text,
  verified    boolean not null default false,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 1b. startups
create table if not exists startups (
  id            uuid primary key default uuid_generate_v4(),
  founder_id    uuid not null references profiles(id) on delete cascade,
  name          text not null,
  logo_url      text,
  logo_emoji    text not null default '🚀',
  tagline       text,
  description   text,
  stage         text not null check (stage in ('idea', 'mvp', 'early', 'growth', 'scale', 'pre-seed', 'seed', 'series-a', 'series-b')),
  industry      text,
  location      text,
  founded       text,
  team_size     int not null default 1,
  funding       text,
  valuation     text,
  equity_pool   float not null default 10,
  website       text,
  pitch         text,
  traction      text[] not null default '{}',
  featured      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 1c. talent_profiles
create table if not exists talent_profiles (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null unique references profiles(id) on delete cascade,
  title                 text not null,
  bio                   text,
  skills                text[] not null default '{}',
  category              text not null check (category in (
                          'engineering', 'design', 'marketing',
                          'sales', 'operations', 'finance',
                          'legal', 'product', 'consulting', 'media'
                        )),
  experience_years      int not null default 0,
  hourly_rate           text,
  location              text,
  availability          text not null check (availability in ('full-time', 'part-time', 'contract')),
  preferred_industries  text[] not null default '{}',
  min_equity            float not null default 0,
  rating                float not null default 0,
  completed_deals       int not null default 0,
  featured              boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- 1d. open_roles
create table if not exists open_roles (
  id              uuid primary key default uuid_generate_v4(),
  startup_id      uuid not null references startups(id) on delete cascade,
  title           text not null,
  category        text not null,
  equity_min      float not null default 0,
  equity_max      float not null default 0,
  cash_equivalent text,
  description     text,
  requirements    text[] not null default '{}',
  duration        text,
  status          text not null default 'open' check (status in ('open', 'in-progress', 'filled')),
  created_at      timestamptz not null default now()
);

-- 1e. deals
create table if not exists deals (
  id              uuid primary key default uuid_generate_v4(),
  startup_id      uuid not null references startups(id) on delete cascade,
  talent_id       uuid not null references talent_profiles(id) on delete cascade,
  role_id         uuid references open_roles(id) on delete set null,
  status          text not null default 'pending' check (status in (
                    'pending', 'negotiating', 'accepted',
                    'active', 'completed', 'cancelled',
                    'disputed', 'expired'
                  )),
  equity_percent  float not null default 0,
  vesting_months  int not null default 48,
  cliff_months    int not null default 12,
  safe_terms      jsonb not null default '{}'::jsonb,
  match_score     float not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 1f. milestones
create table if not exists milestones (
  id              uuid primary key default uuid_generate_v4(),
  deal_id         uuid not null references deals(id) on delete cascade,
  title           text not null,
  description     text,
  due_date        date,
  equity_unlock   float not null default 0,
  status          text not null default 'pending' check (status in (
                    'pending', 'in-progress', 'completed',
                    'verified', 'missed'
                  )),
  deliverables    text[] not null default '{}',
  created_at      timestamptz not null default now()
);

-- 1g. messages
create table if not exists messages (
  id          uuid primary key default uuid_generate_v4(),
  deal_id     uuid not null references deals(id) on delete cascade,
  sender_id   uuid not null references profiles(id) on delete cascade,
  content     text not null,
  type        text not null default 'text' check (type in ('text', 'system', 'file', 'milestone')),
  created_at  timestamptz not null default now()
);

-- 1h. safe_documents
create table if not exists safe_documents (
  id              uuid primary key default uuid_generate_v4(),
  deal_id         uuid not null unique references deals(id) on delete cascade,
  template        text not null check (template in ('standard', 'mfn', 'custom')),
  status          text not null default 'draft' check (status in ('draft', 'pending', 'signed', 'voided')),
  terms           jsonb not null default '{}'::jsonb,
  document_url    text,
  version_history jsonb not null default '[]'::jsonb,
  audit_trail     jsonb not null default '[]'::jsonb,
  signatures      jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 1i. portfolio_holdings
create table if not exists portfolio_holdings (
  id              uuid primary key default uuid_generate_v4(),
  talent_id       uuid not null references talent_profiles(id) on delete cascade,
  startup_id      uuid not null references startups(id) on delete cascade,
  deal_id         uuid references deals(id) on delete set null,
  equity_percent  float not null default 0,
  safe_amount     text,
  valuation_cap   text,
  status          text not null default 'active' check (status in ('active', 'vesting', 'exited', 'cancelled')),
  current_value   text,
  return_multiple float not null default 1,
  date_issued     timestamptz not null default now()
);

-- 1j. notifications
create table if not exists notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  title       text not null,
  description text,
  type        text not null check (type in ('deal', 'milestone', 'message', 'system', 'portfolio')),
  link        text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);


-- ============================================================================
-- 2. INDEXES
-- ============================================================================

-- profiles
create index if not exists idx_profiles_role       on profiles(role);
create index if not exists idx_profiles_email      on profiles(email);

-- startups
create index if not exists idx_startups_founder    on startups(founder_id);
create index if not exists idx_startups_stage      on startups(stage);
create index if not exists idx_startups_industry   on startups(industry);
create index if not exists idx_startups_featured   on startups(featured);

-- talent_profiles
create index if not exists idx_talent_user         on talent_profiles(user_id);
create index if not exists idx_talent_category     on talent_profiles(category);
create index if not exists idx_talent_availability on talent_profiles(availability);
create index if not exists idx_talent_featured     on talent_profiles(featured);

-- open_roles
create index if not exists idx_roles_startup       on open_roles(startup_id);
create index if not exists idx_roles_status        on open_roles(status);
create index if not exists idx_roles_category      on open_roles(category);

-- deals
create index if not exists idx_deals_startup       on deals(startup_id);
create index if not exists idx_deals_talent        on deals(talent_id);
create index if not exists idx_deals_role          on deals(role_id);
create index if not exists idx_deals_status        on deals(status);

-- milestones
create index if not exists idx_milestones_deal     on milestones(deal_id);
create index if not exists idx_milestones_status   on milestones(status);

-- messages
create index if not exists idx_messages_deal       on messages(deal_id);
create index if not exists idx_messages_sender     on messages(sender_id);
create index if not exists idx_messages_created    on messages(created_at);

-- safe_documents
create index if not exists idx_safedocs_deal       on safe_documents(deal_id);
create index if not exists idx_safedocs_status     on safe_documents(status);

-- portfolio_holdings
create index if not exists idx_portfolio_talent    on portfolio_holdings(talent_id);
create index if not exists idx_portfolio_startup   on portfolio_holdings(startup_id);
create index if not exists idx_portfolio_deal      on portfolio_holdings(deal_id);
create index if not exists idx_portfolio_status    on portfolio_holdings(status);

-- notifications
create index if not exists idx_notifications_user  on notifications(user_id);
create index if not exists idx_notifications_type  on notifications(type);
create index if not exists idx_notifications_read  on notifications(read);
create index if not exists idx_notifications_created on notifications(created_at);


-- ============================================================================
-- 3. FUNCTIONS
-- ============================================================================

-- 3a. Auto‑create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, created_at, updated_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'talent'),
    now(),
    now()
  );
  return new;
end;
$$;

-- 3b. Generic updated_at timestamp function
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================================
-- 4. TRIGGERS
-- ============================================================================

-- 4a. Auth → profiles trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4b. updated_at triggers
drop trigger if exists set_profiles_updated_at on profiles;
create trigger set_profiles_updated_at
  before update on profiles
  for each row execute function public.update_updated_at();

drop trigger if exists set_startups_updated_at on startups;
create trigger set_startups_updated_at
  before update on startups
  for each row execute function public.update_updated_at();

drop trigger if exists set_talent_profiles_updated_at on talent_profiles;
create trigger set_talent_profiles_updated_at
  before update on talent_profiles
  for each row execute function public.update_updated_at();

drop trigger if exists set_deals_updated_at on deals;
create trigger set_deals_updated_at
  before update on deals
  for each row execute function public.update_updated_at();

drop trigger if exists set_safe_documents_updated_at on safe_documents;
create trigger set_safe_documents_updated_at
  before update on safe_documents
  for each row execute function public.update_updated_at();


-- ============================================================================
-- 5. REALTIME
-- ============================================================================

alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table deals;


-- ============================================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on every table
alter table profiles           enable row level security;
alter table startups           enable row level security;
alter table talent_profiles    enable row level security;
alter table open_roles         enable row level security;
alter table deals              enable row level security;
alter table milestones         enable row level security;
alter table messages           enable row level security;
alter table safe_documents     enable row level security;
alter table portfolio_holdings enable row level security;
alter table notifications      enable row level security;

-- Helper: is the current user the founder of a given startup?
create or replace function public.is_startup_founder(p_startup_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from startups where id = p_startup_id and founder_id = auth.uid()
  );
$$;

-- Helper: is the current user a participant in a given deal?
create or replace function public.is_deal_participant(p_deal_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from deals d
    join startups s on s.id = d.startup_id
    join talent_profiles tp on tp.id = d.talent_id
    where d.id = p_deal_id
      and (s.founder_id = auth.uid() or tp.user_id = auth.uid())
  );
$$;


-- ---------- profiles ----------
drop policy if exists "profiles_select" on profiles;
create policy "profiles_select" on profiles
  for select using (true);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());


-- ---------- startups ----------
drop policy if exists "startups_select" on startups;
create policy "startups_select" on startups
  for select using (true);

drop policy if exists "startups_insert_founder" on startups;
create policy "startups_insert_founder" on startups
  for insert with check (founder_id = auth.uid());

drop policy if exists "startups_update_founder" on startups;
create policy "startups_update_founder" on startups
  for update using (founder_id = auth.uid());

drop policy if exists "startups_delete_founder" on startups;
create policy "startups_delete_founder" on startups
  for delete using (founder_id = auth.uid());


-- ---------- talent_profiles ----------
drop policy if exists "talent_select" on talent_profiles;
create policy "talent_select" on talent_profiles
  for select using (true);

drop policy if exists "talent_insert_own" on talent_profiles;
create policy "talent_insert_own" on talent_profiles
  for insert with check (user_id = auth.uid());

drop policy if exists "talent_update_own" on talent_profiles;
create policy "talent_update_own" on talent_profiles
  for update using (user_id = auth.uid());


-- ---------- open_roles ----------
drop policy if exists "roles_select" on open_roles;
create policy "roles_select" on open_roles
  for select using (true);

drop policy if exists "roles_insert_founder" on open_roles;
create policy "roles_insert_founder" on open_roles
  for insert with check (public.is_startup_founder(startup_id));

drop policy if exists "roles_update_founder" on open_roles;
create policy "roles_update_founder" on open_roles
  for update using (public.is_startup_founder(startup_id));


-- ---------- deals ----------
drop policy if exists "deals_select_participants" on deals;
create policy "deals_select_participants" on deals
  for select using (
    exists (
      select 1 from startups s where s.id = startup_id and s.founder_id = auth.uid()
    )
    or exists (
      select 1 from talent_profiles tp where tp.id = talent_id and tp.user_id = auth.uid()
    )
  );

drop policy if exists "deals_insert_auth" on deals;
create policy "deals_insert_auth" on deals
  for insert with check (auth.uid() is not null);

drop policy if exists "deals_update_participants" on deals;
create policy "deals_update_participants" on deals
  for update using (
    exists (
      select 1 from startups s where s.id = startup_id and s.founder_id = auth.uid()
    )
    or exists (
      select 1 from talent_profiles tp where tp.id = talent_id and tp.user_id = auth.uid()
    )
  );


-- ---------- milestones ----------
drop policy if exists "milestones_select" on milestones;
create policy "milestones_select" on milestones
  for select using (public.is_deal_participant(deal_id));

drop policy if exists "milestones_insert" on milestones;
create policy "milestones_insert" on milestones
  for insert with check (public.is_deal_participant(deal_id));

drop policy if exists "milestones_update" on milestones;
create policy "milestones_update" on milestones
  for update using (public.is_deal_participant(deal_id));


-- ---------- messages ----------
drop policy if exists "messages_select" on messages;
create policy "messages_select" on messages
  for select using (public.is_deal_participant(deal_id));

drop policy if exists "messages_insert" on messages;
create policy "messages_insert" on messages
  for insert with check (
    public.is_deal_participant(deal_id)
    and sender_id = auth.uid()
  );


-- ---------- safe_documents ----------
drop policy if exists "safedocs_select" on safe_documents;
create policy "safedocs_select" on safe_documents
  for select using (public.is_deal_participant(deal_id));

drop policy if exists "safedocs_insert" on safe_documents;
create policy "safedocs_insert" on safe_documents
  for insert with check (public.is_deal_participant(deal_id));

drop policy if exists "safedocs_update" on safe_documents;
create policy "safedocs_update" on safe_documents
  for update using (public.is_deal_participant(deal_id));


-- ---------- portfolio_holdings ----------
drop policy if exists "portfolio_select_own" on portfolio_holdings;
create policy "portfolio_select_own" on portfolio_holdings
  for select using (
    exists (
      select 1 from talent_profiles tp where tp.id = talent_id and tp.user_id = auth.uid()
    )
  );

drop policy if exists "portfolio_insert_auth" on portfolio_holdings;
create policy "portfolio_insert_auth" on portfolio_holdings
  for insert with check (auth.uid() is not null);


-- ---------- notifications ----------
drop policy if exists "notifications_select_own" on notifications;
create policy "notifications_select_own" on notifications
  for select using (user_id = auth.uid());

drop policy if exists "notifications_update_own" on notifications;
create policy "notifications_update_own" on notifications
  for update using (user_id = auth.uid());

drop policy if exists "notifications_insert_auth" on notifications;
create policy "notifications_insert_auth" on notifications
  for insert with check (auth.uid() is not null);


-- ============================================================================
-- Done! Your Givvy database is ready.
-- ============================================================================
