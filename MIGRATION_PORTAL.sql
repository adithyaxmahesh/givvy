-- Migration: Add client portal tables (engagements, workstreams, document vault)
-- Run this in the Supabase SQL Editor
--
-- The portal is a separate login surface from the equity marketplace. Marketplace
-- users live in Supabase Auth (auth.users + profiles); portal users live here in
-- portal_users with their own password hashes and their own session cookie, so a
-- credential for one side never grants access to the other.

create table if not exists portal_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null default '',
  company text not null default '',
  role text not null default 'client' check (role in ('admin', 'client')),
  -- Format: scrypt$1$<salt-hex>$<derived-key-hex>. Never store plaintext.
  password_hash text not null,
  must_change_password boolean not null default false,
  status text not null default 'active' check (status in ('active', 'disabled')),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists portal_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_name text not null default '',
  description text not null default '',
  status text not null default 'active' check (status in ('active', 'on_hold', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Scopes a client to the engagements they can see. Admins bypass this and see all.
create table if not exists portal_project_members (
  project_id uuid not null references portal_projects(id) on delete cascade,
  user_id uuid not null references portal_users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists portal_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references portal_projects(id) on delete cascade,
  title text not null,
  description text not null default '',
  -- Asana-style grouping heading within an engagement, e.g. 'Diligence'.
  section text not null default 'General',
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  assignee_id uuid references portal_users(id) on delete set null,
  due_date date,
  -- Sort order within a section; gaps are intentional so rows can be reordered.
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists portal_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references portal_projects(id) on delete cascade,
  name text not null,
  category text not null default 'General',
  size_label text not null default '',
  url text not null default '',
  uploaded_by uuid references portal_users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_portal_users_email on portal_users(email);
create index if not exists idx_portal_users_role on portal_users(role);
create index if not exists idx_portal_projects_status on portal_projects(status);
create index if not exists idx_portal_members_user on portal_project_members(user_id);
create index if not exists idx_portal_tasks_project on portal_tasks(project_id);
create index if not exists idx_portal_tasks_status on portal_tasks(status);
create index if not exists idx_portal_tasks_assignee on portal_tasks(assignee_id);
create index if not exists idx_portal_tasks_order on portal_tasks(project_id, section, position);
create index if not exists idx_portal_documents_project on portal_documents(project_id);

-- RLS
-- Portal rows hold password hashes and client deal data, so no policies are granted
-- to anon or authenticated roles. Every read and write goes through the /api/portal
-- routes, which authenticate the portal session cookie and use the service role key.
alter table portal_users           enable row level security;
alter table portal_projects        enable row level security;
alter table portal_project_members enable row level security;
alter table portal_tasks           enable row level security;
alter table portal_documents       enable row level security;
