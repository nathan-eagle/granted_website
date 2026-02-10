# Granted Website - Marketing Site Instructions

## Overview

Marketing site and grant discovery pages at **grantedai.com**.

- **Repo:** `nathan-eagle/granted_website` (separate repo from the app)
- **Vercel project:** **`site`** (NOT `granted_website`) → **grantedai.com**
- **Package manager:** npm
- **Stack:** Next.js 14.2.5, React 18, TypeScript 5.4, Tailwind CSS 3.4

## CRITICAL: Vercel Project Name

The Vercel project is named **`site`**, not `granted_website`. Before running any `npx vercel env` commands, verify:

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

**Grant pages (Phase 1):** `/grants`, `/grants/[slug]` — ISR pages from `public_grants` table

**Grant finder (Phase 2):** `/find-grants` — public search tool with email capture

### API Routes

| Route | Purpose |
|---|---|
| `POST /api/contact` | Contact form → Resend email |
| `POST /api/subscribe` | Email subscription |
| `POST /api/leads/capture` | Lead capture (grant finder email gate) |

### Key Directories

```
app/                  # Next.js App Router pages + API routes
components/           # React components (~43 files)
lib/                  # Utilities and helpers
hooks/                # Custom React hooks
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
| `public_grants` | Grant listings for SEO pages | Read-only via anon key (no RLS) |
| `leads` | Email captures from grant finder | Insert via service role key |

## Sibling Project

The authenticated app lives in `../granted-mvp/` (same parent repo: `nathan-eagle/granted`). Its Vercel project is named **`granted-mvp`** and deploys to **app.grantedai.com**. See `../CLAUDE.md` for the full project map.

## Strategy

See `../SITE_REDESIGN_STRATEGY.md` for the full product roadmap: programmatic grant pages, public grant finder, homepage redesign, and content flywheel.
