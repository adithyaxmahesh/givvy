-- Migration: Add signed_document_url to safe_documents
-- This stores the URL to the final PDF after both parties have signed

ALTER TABLE safe_documents
ADD COLUMN IF NOT EXISTS signed_document_url TEXT DEFAULT NULL;

COMMENT ON COLUMN safe_documents.signed_document_url IS 'URL to the fully executed (both-party signed) SAFE PDF in Supabase Storage';
