# Copilot instructions — bayan-signage-backend

Strapi 5 (Community Edition) CMS backend for the bayansignage.com
marketing site. See `README.md` first. Notes below are the things most
likely to trip up an automated change.

## What this backend actually does

Its only real job is the **Lead** content type
(`src/api/lead/`) — receiving public form submissions from the frontend
and forwarding them to email (Brevo) and CRM (Perfex). There is no other
public-facing content type. Don't assume a "digital signage" purpose from
old commit history — that scope was dropped; this is a lead-capture
backend for a marketing site.

## Content-type conventions

- Content types are hand-authored as `schema.json` + `lifecycles.ts` files
  under `src/api/<name>/content-types/<name>/`, not generated via the
  interactive `strapi generate` CLI (which can't run non-interactively).
  Follow the existing `lead` content type's file layout as the template
  for any new one.
- Public API permissions are granted in `src/index.ts`
  (`PUBLIC_PERMISSIONS`) on bootstrap, not by hand in the admin UI — add
  new public actions there so they survive a fresh database.
- Use the Document Service API (`strapi.documents(...)`) for CRUD in
  lifecycle hooks and services — this is Strapi 5, not v4's Entity
  Service.

## Integration services

`src/api/lead/services/notify-email.ts` and `perfex-sync.ts` must both
**fail gracefully** — if their required env vars aren't set, log and
return a "skipped" result rather than throwing. Lead creation must never
fail because an optional downstream integration isn't configured. Keep
this pattern for any new integration.

## Verifying changes

- `npx tsc --noEmit` and `npm run build` must both pass — CI
  (`.github/workflows/ci.yml`) enforces this on every push/PR.
- To verify end-to-end: `npm run develop`, then `POST /api/leads` with a
  `{ data: { name, email } }` body and confirm a `201` and that the
  record appears in the admin panel's Content Manager.
