# Empresa Plana Website

Website redesign of [empresaplana.cat](https://empresaplana.cat) for Empresa Plana
(Costa Daurada / Camp de Tarragona transport company). Public site + admin panel
(CMS) — bus schedules, routes, fares, airport transfers and discretionary
services. Content is Catalan-first, with `es` and `en` locales.

## Tech stack

| Layer      | Technology                                                          |
| ---------- | ------------------------------------------------------------------- |
| Framework  | Nuxt 4 + Nitro 2                                                     |
| UI         | Nuxt UI v4 (`@nuxt/ui`), Tailwind CSS v4 build-time                  |
| i18n       | `@nuxtjs/i18n` — `ca` default (root), `es`/`en` prefixed            |
| Data       | Prisma 7 (`prisma-client` generator → `generated/prisma/`) + `@prisma/adapter-pg` + `pg` |
| DB         | Postgres (Prisma Postgres)                                           |
| Auth       | `jose` HS256 JWT in `ep_session` httpOnly cookie + scrypt passkeys   |
| Fonts      | Geist (via `@nuxt/fonts`) + Material Symbols                        |
| Tooling    | Biome, TypeScript strict                                            |
| Runtime    | Node `>= 22.12`, pnpm                                               |

## Prerequisites

- [pnpm](https://pnpm.io) + Node.js `>= 22.12`
- Local DB (Docker): `docker run -d --name empresaplana-pg -e POSTGRES_USER=empresaplana -e POSTGRES_PASSWORD=empresaplana -e POSTGRES_DB=empresaplana -p 54329:5432 postgres:17-alpine`

## Installation

```bash
pnpm install
cp .env.example .env   # set DATABASE_URL and AUTH_SECRET
pnpm run db:generate
pnpm run db:push
pnpm run db:create-user admin 12345678 admin   # create first admin user
```

## Scripts

| Command                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `pnpm run nuxt:dev`       | Dev server at `http://localhost:3000`              |
| `pnpm run nuxt:build`     | Production build (Node `node_server`) → `.output/` |
| `pnpm run nuxt:preview`   | Serve the production build locally                 |
| `pnpm run render:build`   | Explicit Node build for Render                     |
| `pnpm run cf:build`       | Build Cloudflare Pages preset (blocked, see Gotchas) |
| `pnpm run cf:dev`         | Build + `wrangler pages dev` preview               |
| `pnpm run db:generate` / `db:push` / `db:studio` | Prisma CLI        |
| `pnpm run db:create-user` | Create/update a user (`pnpm run db:create-user <user> <pass> <role>`) |
| `pnpm run check` / `lint` / `format` | Biome checks                       |

## Environment variables

- `DATABASE_URL` — Postgres connection string (Prisma Postgres or local Docker).
- `AUTH_SECRET` — long random string for HS256 session JWTs.

Runtime secrets on Render come from the blueprint (`render.yaml`); never commit
`.env` or `.dev.vars`.

## Project structure

```
app/               # Nuxt srcDir — pages, components, layouts, middleware
  assets/css/      # main.css — Tailwind v4 @theme design tokens (source of truth)
  data/            # real contact data (phones, social, WhatsApp)
server/            # Nitro API — server/api/*, server/utils/* (auth, prisma, passkey)
i18n/locales/      # real ca/es/en dictionaries (exported content, do not invent)
prisma/            # schema.prisma, seed
generated/prisma/  # generated Prisma client (git-ignored, do not edit)
src/               # LEGACY Astro (being migrated; reference only)
render.yaml        # Render blueprint (IaC)
wrangler.jsonc     # Cloudflare config (reversible target)
```

## Deployment

- **Render (primary):** blueprint `render.yaml` — builds `render:build`, serves
  `node .output/server/index.mjs`, health check `/api/health`.
- **Cloudflare Pages (blocked):** Prisma ORM 7 crashes on Workers (issue
  prisma/prisma#28657 — WASM code generation disallowed by workerd). Flip back
  with `NITRO_PRESET=cloudflare_pages` once Prisma ships a Workers-compatible build.

## License

MIT
