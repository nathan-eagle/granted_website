# Granted Website - Marketing Site Instructions

## Overview

Marketing site and grant discovery pages at **grantedai.com**.

- **Repo:** `nathan-eagle/granted_website` (separate repo from the app)
- **Vercel project:** **`site`** (different from repo name `granted_website`) → **grantedai.com**
- **Package manager:** npm
- **Stack:** Next.js 14.2.5, React 18, TypeScript 5.4, Tailwind CSS 3.4

## CRITICAL: Vercel Project Name

The Vercel project is named **`site`** (repo name is still `granted_website`). Before running any `npx vercel env` commands, verify:

```bash
cat .vercel/project.json
# Should show: "projectName": "site"
```

If it shows a different project name, run `npx vercel link` and select the `site` project.

## Quick Start

```bash
npm install
cp .env.example .env.local   # Then fill in secrets
npm run dev                    # http://localhost:3000
```

## Commands

| Command | What |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run import:posts` | Import blog posts from MDX |
| `npx vercel ls` | Check deploy status |

## Deployment

Vercel auto-deploys from pushes to `main`. Do **not** use GitHub Actions (stale/disabled). Check status with `npx vercel ls`.

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key — use JWT format (`eyJ...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-side API routes) — use JWT format |
| `RESEND_API_KEY` | Resend email API key |
| `CONTACT_TO_EMAIL` | Contact form recipient |
| `CONTACT_FROM_EMAIL` | Contact form sender (default: hello@grantedai.com) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 measurement ID |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID |

**Supabase key format:** Use the legacy JWT keys (`eyJhbGci...`), not the newer `sb_publishable_`/`sb_secret_` format. The JWT keys are required for PostgREST RLS to work correctly. Find them under Project Settings > API > Legacy keys in the Supabase dashboard.

These env vars must be set **both** in `.env.local` (local dev) and on the **`site`** Vercel project (production). The Vercel project `site` is what serves grantedai.com — setting env vars on any other Vercel project will have no effect.

**CRITICAL — Avoid trailing newlines:** When piping values to `vercel env add`, **always use `printf '%s'`** instead of `echo`. `echo` appends a trailing `\n` that gets stored as part of the value and silently breaks things.

```bash
# CORRECT
printf '%s' 'my-value' | npx vercel env add VAR_NAME production

# WRONG — adds trailing \n
echo 'my-value' | npx vercel env add VAR_NAME production
```

## Architecture

### Routes

**Marketing pages:**
- `/` — Homepage
- `/features`, `/pricing`, `/faq`, `/contact`, `/privacy`, `/terms`, `/security`
- `/for/nonprofits`, `/for/researchers`, `/for/sbir`, `/for/scholarships`
- `/compare/grant-writers`, `/compare/instrumentl`, `/compare/grantable`, `/compare/grantboost`, `/compare/chatgpt`, `/compare/doing-it-yourself`
- `/tools/readiness-quiz`, `/tools/deadlines`, `/tools/cost-calculator`

**Blog:** `/blog` + `/blog/[slug]` — 77+ MDX posts in `content/blog/`

**Grant finder:** `/grants` — public grant search with browse categories + LLM-powered search + email capture gate
**Grant detail pages:** `/grants/[slug]` — programmatic SEO pages from `public_grants` table (ISR)
**Grant sub-pages:** `/grants/new`, `/grants/closing-soon`, `/grants/state/[state]`

### API Routes

| Route | Purpose |
|---|---|
| `POST /api/contact` | Contact form → Resend email |
| `POST /api/subscribe` | Email subscription |
| `POST /api/unsubscribe` | Unsubscribe from emails |
| `POST /api/leads/capture` | Lead capture (grant finder email gate) |
| `POST /api/searches/save` | Save a search |
| `POST /api/foundations/match` | Foundation matching |
| `POST /api/cron/deadline-alerts` | Daily deadline alerts (Vercel cron) |
| `POST /api/cron/weekly-digest` | Weekly email digest (Vercel cron) |
| `GET /api/health` | Health check |
| `POST /api/revalidate` | ISR revalidation |

**Note:** The `/grants` search form calls `POST /api/public/discover` on the **granted-mvp** app (app.grantedai.com), not a local API route. That endpoint is the Gemini-powered LLM grant discovery. See `../ARCHITECTURE.md` for the full discovery pipeline.

### Key Directories

```
app/                  # Next.js App Router pages + API routes
  grants/             # Grant finder + programmatic SEO pages
  foundations/        # Foundation directory pages
  blog/               # Blog pages
components/           # React components (~58 files)
  GrantsPageClient.tsx  # Main grant finder UI (browse + search + results)
lib/                  # Utilities and helpers
  grants.ts           # Grant queries + category definitions
  foundations.ts      # Foundation queries
hooks/                # Custom React hooks
  useGrantSearch.ts   # Grant search state management
content/blog/         # MDX blog posts (77+)
public/               # Static assets
scripts/              # Build utilities (import-posts, scrape-pages)
```

### Design

- **Fonts:** DM Sans (body) + Instrument Serif (display)
- **Colors:** Cohesive palette via CSS variables — see root CLAUDE.md for design standards
- **SEO:** sitemap.ts, robots.ts, RSS feed, JSON-LD schema (Organization, WebSite, MonetaryGrant)

## Database

Reads from the shared Supabase project (`rziggkbirlabvnvdcnkc`). Key tables:

| Table | Purpose | Access |
|---|---|---|
| `public_grants` | Grant listings for finder + SEO pages | Read-only via anon key (no RLS) |
| `foundations` | Foundation directory (133K from ProPublica) | Read-only via anon key |
| `foundation_rfps` | Open grants from foundation websites | Read-only via anon key |
| `leads` | Email captures from grant finder | Insert via service role key |

## Sibling Project

The authenticated app lives in `../granted-mvp/` (a subdirectory of the `nathan-eagle/granted` repo — same parent directory but different git repo). Its Vercel project is named **`granted-mvp`** and deploys to **app.grantedai.com**. See `../CLAUDE.md` for the project map and `../ARCHITECTURE.md` for the full platform architecture.

## Strategy

See `../SITE_REDESIGN_STRATEGY.md` for the full product roadmap: programmatic grant pages, public grant finder, homepage redesign, and content flywheel.
