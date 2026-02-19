-- Migration: Add proposals table for post applications
-- Run this in the Supabase SQL Editor

create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  message text not null default '',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Prevent duplicate proposals from the same user on the same post
create unique index if not exists idx_proposals_unique_sender_post
  on proposals(post_id, sender_id);

create index if not exists idx_proposals_post on proposals(post_id);
create index if not exists idx_proposals_sender on proposals(sender_id);
create index if not exists idx_proposals_status on proposals(status);

-- RLS
alter table proposals enable row level security;

create policy "Post authors can read proposals on their posts"
  on proposals for select
  using (
    sender_id = auth.uid()
    or exists (
      select 1 from posts where posts.id = proposals.post_id and posts.author_id = auth.uid()
    )
  );

create policy "Authenticated users can insert proposals"
  on proposals for insert
  with check (auth.uid() = sender_id);

create policy "Post authors can update proposal status"
  on proposals for update
  using (
    exists (
      select 1 from posts where posts.id = proposals.post_id and posts.author_id = auth.uid()
    )
  );
