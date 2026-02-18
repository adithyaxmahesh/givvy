# EquityExchange

**Upwork for Equity** — The marketplace where startups hire world-class talent with SAFE-based equity compensation.

## Quick Start

```bash
./run-dev.sh
```

Open **http://localhost:3000**

> If you see "command not found: npm", install Node.js first — see [SETUP_NODE.md](SETUP_NODE.md).

## Demo Mode

No env setup needed. The app runs in demo mode with in-memory auth:

- **Founder:** founder@demo.com / password123
- **Talent:** talent@demo.com / password123

## Full Setup (Supabase)

For real data, copy `.env.example` to `.env.local` and add your keys:

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase project URL and keys
```

Then run `MIGRATION.sql` in the Supabase SQL editor.

## Stack

Next.js 14 · Supabase · Tailwind · Framer Motion · OpenAI · Resend
