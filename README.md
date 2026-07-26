# Givvy

**Upwork for Equity** — The marketplace where startups hire world-class talent with SAFE-based equity compensation.

## Quick Start

```bash
./run-dev.sh
```

Open **http://localhost:3000**

> If you see "command not found: npm", install Node.js first — see [SETUP_NODE.md](SETUP_NODE.md).

## Setup (Supabase)

Copy `.env.example` to `.env.local` and add your keys:

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase project URL and keys
```

Then run `MIGRATION.sql` in the Supabase SQL editor, followed by the incremental
`MIGRATION_*.sql` files. `MIGRATION_LEADS.sql` creates the `leads` table that backs
the landing page "Book intro" and "Get the deck" forms; submissions are viewable at
`/admin/leads`.

## Stack

Next.js 14 · Supabase · Tailwind · Framer Motion · OpenAI · Resend
