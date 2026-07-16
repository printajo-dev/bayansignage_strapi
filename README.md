# Bayan Signage — Backend (Strapi)

Headless CMS backend for the [bayan-signage-frontend](https://github.com/printajo-dev/bayan-signage)
marketing site. Its job is small and specific: receive lead-form
submissions from the website, store them, and forward them onward.

## Content types

- **Lead** (`src/api/lead/`) — the only content type public API consumers
  touch. Public (unauthenticated) `create` access only — see
  `src/index.ts`. Fields: `name`, `email`, `phone`, `message`,
  `serviceInterest`, `sourcePage`, `formName`, plus tracking fields
  (`status`, `crmSyncStatus`, `crmSyncError`, `emailNotified`).
- Leads are visible and manageable in the Strapi admin panel
  (`/admin` → Content Manager → Lead) — there is no separate admin app.

## Lead lifecycle (`src/api/lead/content-types/lead/lifecycles.ts`)

On every `afterCreate`, in parallel:

- **`services/notify-email.ts`** — emails the team via Brevo SMTP relay.
  Skips gracefully (logs a warning, doesn't throw) if `BREVO_SMTP_*` env
  vars aren't set.
- **`services/perfex-sync.ts`** — pushes the lead to Perfex CRM via its
  REST API. Skips gracefully if `PERFEX_API_*` env vars aren't set.

The lead record is then updated with `emailNotified` / `crmSyncStatus` /
`crmSyncError` so you can see in the admin panel whether each integration
actually fired. Both integrations are optional at runtime — the site works
and stores leads even with none of the `BREVO_*`/`PERFEX_*` vars configured.

## Environment variables

See `.env.example`. Required: the Strapi secrets (`APP_KEYS`,
`API_TOKEN_SALT`, etc. — generate real values, don't ship the placeholder
ones). Optional: `BREVO_SMTP_*` / `LEAD_NOTIFY_*` for email notification,
`PERFEX_API_*` for CRM sync.

## Getting started

```bash
npm install
cp .env.example .env   # fill in real secrets
npm run develop
```

Admin panel: `http://localhost:1337/admin` (first run prompts you to
create an admin account).

## Deployment

Deployed independently of the frontend. Swap the SQLite dev database for
Postgres in production (see `config/database.ts` — already reads
`DATABASE_CLIENT`/`DATABASE_URL` from env, `pg` is already a dependency)
since SQLite doesn't survive hosts with an ephemeral filesystem. Set all
`.env.example` variables as real secrets on the host (never commit real
values). The frontend needs this backend's public URL set as its
`NEXT_PUBLIC_STRAPI_URL`, and this backend needs the frontend's URL set as
`CORS_ALLOWED_ORIGINS`.

**DigitalOcean App Platform** (`.do/app.yaml`): App Platform dashboard →
Create App → select this GitHub repo → it picks up `.do/app.yaml`
automatically, including a bound managed Postgres database.
`deploy_on_push: true` in that spec means every `git push` to `main`
triggers a new build and deploy automatically — no extra CI step needed.
Before the first deploy, replace every `REPLACE_ME` secret value in the
spec (Strapi's core secrets — generate each with `node -e
"console.log(require('crypto').randomBytes(16).toString('base64'))"`) and
set `CORS_ALLOWED_ORIGINS` to the frontend's real domain.

## CI / Claude Code / Copilot

- `.github/workflows/ci.yml` — installs deps, type-checks, and builds the
  admin panel on every push/PR.
- `.github/workflows/claude.yml` — lets you trigger Claude Code from an
  issue or PR comment containing `@claude`. Requires an `ANTHROPIC_API_KEY`
  repo secret.
- `.github/copilot-instructions.md` — repo-specific context for GitHub
  Copilot Chat and the Copilot coding agent.

---

# Strapi CLI reference

- `npm run develop` — start with autoReload enabled.
- `npm run start` — start with autoReload disabled (production mode).
- `npm run build` — build the admin panel.

See the [Strapi docs](https://docs.strapi.io) for the full CLI and
deployment guide.
