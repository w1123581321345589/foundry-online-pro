# Foundry Online — Pro (Online Microschools, One-Button Launch)

Simple, elegant, forward-thinking (Stripe-like). This repo ships:
- **Auth**: Clerk (passwordless; parent↔learner linkage)
- **Virtual Classroom**: Daily (room creation + join), stub fallback via env URL
- **Payments**: Stripe Connect-ready (5% take, $199/mo floor via Billing), test webhook
- **ESA**: mock adapter + persistence
- **Learn Studio (GLL)**: 5 buttons + QA rubric gate + persistence
- **Safety**: recording consent, incident intake, moderation scaffolding
- **DB**: Prisma models + seeds; Postgres
- **Design**: Tailwind system tuned for calm minimalism; DESIGN.md included
- **Replit-ready**: runs Postgres/Redis, migrates, starts API&Web via one script

## Quick start (Replit)
1) Add secrets from `.env.example` to Replit Secrets.
2) Run project (it executes `scripts/dev.replit`).
3) Visit Web `https://<repl-url>` and API `/health`.

## Quick start (local)
```
pnpm i
pnpm -r build
pnpm --filter @foundry/db prisma:migrate
pnpm --filter @foundry/api dev   # API @ :4000
pnpm --filter @foundry/web dev   # Web @ :3000
```

### Demo links
- Dashboard `/`
- Learn Studio `/gll`
- Virtual class `/classroom/sample-session-id`
- Safety `/safety`
- Payments (test) `/pay`

> Privacy-first: no child data used for model training. COPPA posture with parent-linked accounts; DM off by default.



## New in PLUS
- **Stripe Connect onboarding** for operators (account link flow + status).
- **Billing floor fee** ($199/mo) via Stripe Billing subscription (auto-start after first tuition if email is present).
- **Parent Portal** (sessions, invoices, quick pay) at `/parent`.


## New in OPERATOR
- **Operator Onboarding Wizard** `/operator/onboarding` — collect org info + billing email, launch Stripe Connect, check status, start $199 floor subscription.
- **Payouts Dashboard** `/operator/payouts` — view connected account status, available/pending balances, and recent payouts.
- **API**: `/operator/onboard/*` to orchestrate onboarding; `/stripe/connect/balance` and `/stripe/connect/payouts` for reporting.


## New in SUITE
- **Parent Portal 2.0** `/parent` – Attendance history, session recordings, and weekly recap PDF download.
- **Instructor Console** `/instructor/sessions` – class list & rosters; per-session moderation (chat on/off), quick "Start Class", and recording toggle.
- **API**: Attendance endpoints, recording attach/start/stop, and weekly recap PDF generator (stub with PDFKit).
