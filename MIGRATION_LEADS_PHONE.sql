-- Migration: Capture a phone number on landing page lead submissions
-- Run this in the Supabase SQL Editor.
--
-- Until this runs, POST /api/leads will reject submissions because the insert
-- names a column that does not exist yet.
--
-- Note on existing columns: the "Firm" field is now labelled "Company / Firm"
-- and the free-text field now asks what services the visitor wants. Both keep
-- their original column names (firm, context) so existing rows stay readable.

alter table leads add column if not exists phone text not null default '';
