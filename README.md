# Bayan Signage — Backend (Strapi)

Content management and API backend for Bayan Signage. Manages Screens
(each with an auto-generated pairing code) and Playlists (an ordered list
of media items with per-item durations). The
[bayan-signage-frontend](../bayan-signage-frontend) player app reads from
this API to know what to display on each screen.

## Content types

- **Screen** — `name`, `location`, `pairingCode` (unique, auto-generated on
  create if left blank), `lastSeenAt`, `playlist` (relation).
- **Playlist** — `name`, `items` (repeatable `signage.playlist-item`
  component: `media` + `durationSecs`).

Public (unauthenticated) read access to `find`/`findOne` on both content
types is granted automatically on startup (see `src/index.ts`) so the
player frontend can fetch a screen's playlist without auth.

## Deployment

Intended to be deployed independently of the frontend (e.g. DigitalOcean).
Swap the SQLite dev database for Postgres/MySQL in `config/database.ts` for
production.

## CI / Claude Code

- `.github/workflows/ci.yml` — installs deps, type-checks, and builds the
  admin panel on every push/PR.
- `.github/workflows/claude.yml` — lets you trigger Claude Code from an
  issue or PR comment containing `@claude`. Requires an `ANTHROPIC_API_KEY`
  secret to be added under repo Settings → Secrets and variables → Actions.

---

# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
