-- Migration: Add leads table for Givvy landing page intro requests and deck downloads
-- Run this in the Supabase SQL Editor

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'book-intro' check (source in ('book-intro', 'get-deck')),
  name text not null default '',
  email text not null,
  firm text not null default '',
  context text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_leads_source on leads(source);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_email on leads(email);
create index if not exists idx_leads_created on leads(created_at desc);

-- RLS
-- Leads hold contact details, so no policies are granted to anon or authenticated
-- roles. The public POST /api/leads route and the admin GET /api/admin/leads route
-- both use the service role key, which bypasses RLS.
alter table leads enable row level security;
