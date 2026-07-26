-- Migration: Add posts table for marketplace listings
-- Run this in the Supabase SQL Editor

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('seeking', 'offering')),
  title text not null,
  description text not null default '',
  category text not null default '',
  marketplace_section text not null default 'fractional-hires' check (marketplace_section in ('fractional-hires', 'equity-work')),
  work_type text not null default 'fractional' check (work_type in ('fractional', 'project', 'advisor', 'contract', 'full-time')),
  compensation_type text not null default 'equity' check (compensation_type in ('equity', 'cash', 'blended')),
  equity_min numeric not null default 0,
  equity_max numeric not null default 0,
  cash_min numeric not null default 0,
  cash_max numeric not null default 0,
  tags text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_posts_author on posts(author_id);
create index if not exists idx_posts_status on posts(status);
create index if not exists idx_posts_type on posts(type);
create index if not exists idx_posts_category on posts(category);
create index if not exists idx_posts_marketplace_section on posts(marketplace_section);
create index if not exists idx_posts_work_type on posts(work_type);
create index if not exists idx_posts_compensation_type on posts(compensation_type);
create index if not exists idx_posts_created on posts(created_at desc);

-- RLS
alter table posts enable row level security;

create policy "Anyone can read active posts"
  on posts for select
  using (status = 'active');

create policy "Authenticated users can insert own posts"
  on posts for insert
  with check (auth.uid() = author_id);

create policy "Authors can update own posts"
  on posts for update
  using (auth.uid() = author_id);

create policy "Authors can delete own posts"
  on posts for delete
  using (auth.uid() = author_id);
