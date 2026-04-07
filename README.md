# LeadLoop · pastel-retro lead-finder SaaS

LeadLoop is a full end-to-end SaaS that wraps the
[Apify Leads Finder](https://apify.com/code_crafter/leads-finder?fpr=p2hrc6) actor in a friendly
pastel/retro UI. It ships with a marketing site, two interactive logins (user + admin), a full
user console for filtering & saving leads, and an admin console for managing users, plans, and
audit logs.

> Designed to look and feel **nothing** like a typical sales tool. Bright pastels, thick borders,
> chunky retro shadows, and zero CRM-fatigue.

---

## ✨ Highlights

- **Marketing site** — landing page + pricing, fully responsive
- **Two login portals** — `/login` (users) and `/admin/login` (admins) with separate session checks
- **User console** — Dashboard, Search, Saved Leads (pipeline stages), History, Billing, Settings
- **Admin console** — Dashboard, Users, Searches audit, Plans, Settings
- **12-dimension lead search** — industry, location, job title, employees, contact info, etc.
- **Apify integration** — live mode when `APIFY_TOKEN` is set, mock mode otherwise
- **CSV export** — every search and the saved-leads board
- **Mock subscriptions** — change-plan flow that records subscription history (drop in Stripe later)
- **SQLite by default**, swappable to Postgres on Railway in one line
- **JWT-based sessions** in HTTP-only cookies (no NextAuth dependency, simpler deploy)
- **Pastel/retro design system** — `globals.css` ships `.btn`, `.chip`, `.field`, `.retro-card`, `.tbl`

---

## 🚀 Quick start (local)

```bash
npm install
cp .env.example .env       # already shipped — works as-is for demo
npm run db:reset           # creates SQLite + seeds plans, admin, demo user
npm run dev
```

Open <http://localhost:3000>. The seed creates two accounts:

| Role  | URL              | Email                 | Password    |
|-------|------------------|-----------------------|-------------|
| User  | `/login`         | `demo@leadloop.dev`   | `demo1234`  |
| Admin | `/admin/login`   | `admin@leadloop.dev`  | `admin1234` |

Without an Apify token the app runs in **mock mode** — every search returns realistic synthetic
leads so the entire UI is usable for demos.

To go live: grab a token at <https://apify.com/code_crafter/leads-finder?fpr=p2hrc6> and set
`APIFY_TOKEN` in `.env`.

---

## 🚂 Deploy to Railway

This repo is configured for Railway out of the box (`railway.json` + `nixpacks.toml`).

1. **Push** to GitHub (`git push -u origin main`).
2. In Railway, **New Project → Deploy from GitHub Repo → ThaGuff/Plex**.
3. Add a **Postgres** plugin from the Railway dashboard.
4. Open `prisma/schema.prisma` and change:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
5. Set the following environment variables in Railway:
   - `DATABASE_URL` → automatically injected by the Postgres plugin
   - `AUTH_SECRET` → run `openssl rand -base64 32` and paste
   - `APIFY_TOKEN` → your token
   - `APIFY_ACTOR_ID` → `code_crafter~leads-finder`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `DEMO_EMAIL`, `DEMO_PASSWORD`
   - `APP_URL` → your Railway URL once provisioned
6. Deploy. The Nixpacks build runs `prisma generate → db push → seed → next build`.

> Your Railway project: <https://railway.com/project/06ba0901-ad62-4082-8364-dda59e0a41ef>

---

## 🗂 Project layout

```
.
├── app/
│   ├── (app)/                      ← user console (auth required)
│   │   ├── layout.tsx              sidebar shell
│   │   ├── dashboard/page.tsx
│   │   ├── search/page.tsx
│   │   ├── leads/page.tsx          saved leads + pipeline
│   │   ├── history/page.tsx
│   │   ├── billing/page.tsx
│   │   └── settings/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx          ← admin sign-in portal
│   │   └── (panel)/                ← admin console (admin role required)
│   │       ├── layout.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── users/page.tsx
│   │       ├── searches/page.tsx
│   │       ├── plans/page.tsx
│   │       └── settings/page.tsx
│   ├── api/
│   │   ├── auth/                   login, signup, admin-login, logout
│   │   ├── leads/                  search, save, export
│   │   ├── billing/change-plan
│   │   ├── admin/users
│   │   └── me
│   ├── login/page.tsx              ← user sign-in portal
│   ├── signup/page.tsx
│   ├── pricing/page.tsx
│   ├── page.tsx                    ← marketing landing
│   ├── layout.tsx
│   └── globals.css                 ← pastel/retro design system
├── components/                     UI + dashboard + admin components
├── lib/
│   ├── apify.ts                    Apify integration + mock fallback
│   ├── auth.ts                     JWT session helpers
│   ├── db.ts                       Prisma client singleton
│   ├── plans.ts                    Plan definitions (free → scale)
│   └── utils.ts
├── prisma/
│   ├── schema.prisma               User, Lead, Search, SavedLead, Plan, Subscription
│   └── seed.ts                     plans + admin + demo user + extras
├── middleware.ts                   route gating (user vs admin vs public)
├── tailwind.config.ts              pastel palette + retro shadows
├── railway.json + nixpacks.toml    Railway deploy config
└── README.md
```

---

## 🎨 Design system

| Token | Hex |
|-------|-----|
| Cream (bg) | `#FFF9EC` |
| Bone | `#FBF1DC` |
| Ink (text) | `#241638` |
| Pink | `#FF6B9D` |
| Mint | `#7BE3B5` |
| Lavender | `#B79CFF` |
| Peach | `#FFB58D` |
| Sun | `#FFE066` |
| Sky | `#7CC4FF` |
| Coral | `#FF8585` |
| Lime | `#C6F26B` |

Fonts: **Bricolage Grotesque** (display), **Space Grotesk** (sans), **IBM Plex Mono** (mono).

Reusable utilities live in `app/globals.css`:
`.retro-card`, `.btn` (+`.btn-pink|mint|lav|peach|sun|ink|ghost`), `.chip`, `.field`, `.label`,
`.sticker`, `.tbl`, `.scribble*`.

---

## 🧠 Architecture notes

- **Auth** is intentionally lightweight: a JWT (signed with `AUTH_SECRET` via `jose`) lives in
  an HTTP-only cookie. `middleware.ts` gates routes by role. No NextAuth, no callbacks, no DB
  hops on every request.
- **Apify integration** lives in `lib/apify.ts`. `searchLeads()` checks for `APIFY_TOKEN` and
  routes to either the live actor (`run-sync-get-dataset-items`) or a deterministic mock dataset.
  Both code paths return the same `LeadResult` shape so the UI never knows the difference.
- **Plan limits** are enforced in `app/api/leads/search/route.ts` — month-to-date search counts
  are checked against the user's plan before each call.
- **Database** is SQLite locally (zero-config) and Postgres in production. The Prisma models are
  identical in both environments — only the `provider` line in `schema.prisma` changes.
- **Pipeline stages** for saved leads are represented as a status column on the `SavedLead` model,
  surfaced as a kanban-style 5-column board on `/leads`.

---

## 🔌 Wiring real Stripe later

The mock checkout in `app/api/billing/change-plan/route.ts` records a `Subscription` row and
flips the user's `planId`. To add real Stripe:

1. `npm install stripe`
2. Create products + prices in your Stripe dashboard, store the price IDs in a `stripeId` column
   on the `Plan` model.
3. Replace `change-plan` with a `POST /api/billing/checkout` that creates a Stripe Checkout
   session and redirects to Stripe.
4. Add `POST /api/webhooks/stripe` to listen for `checkout.session.completed` and update the
   `User.planId` + `Subscription.status`.

---

## 📜 License

MIT — go build something cute.
