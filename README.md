# Empresa Plana Website

Website redesign of [empresaplana.cat](https://empresaplana.cat) for Empresa Plana (Catalonia Transports Company). Bus schedules, routes, airport transfers, and discretionary services across the Costa Daurada, Camp de Tarragona, and Barcelona — built with Astro and served as a server-rendered site.

## Tech stack

| Layer      | Technology                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| Framework  | Astro 7 (`^7.2.10`)                                                         |
| Adapter    | `@astrojs/node` (`^11.1.5`), `output: "server"` (standalone)               |
| Styling    | Tailwind CSS v4 (`^4.3.3`) via `@tailwindcss/vite` (build-time, no CDN)     |
| Language   | TypeScript (`^6.0.3`)                                                       |
| Validation | Zod (`^4.5.4`)                                                              |
| Auth       | `jose` (`^6.2.10`) — HS256 JWTs in an httpOnly cookie                      |
| Tooling    | Biome (`^2.5.11`) for linting and formatting                                |
| Runtime    | [Bun](https://bun.sh), Node `>= 22.12.0`                                    |

## Prerequisites

- [Bun](https://bun.sh) installed
- Node.js `>= 22.12.0`

## Installation

```bash
bun install
```

## Scripts

| Command             | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `bun run dev`       | Start the dev server at `http://localhost:4321`        |
| `bun run build`     | Build the production output to `dist/`                 |
| `bun run preview`   | Serve the production build locally                     |
| `bun run lint`      | Lint the project with Biome                            |
| `bun run check`     | Run Biome's linter + formatter checks                  |
| `bun run format`    | Format the project with Biome (writes changes)         |
| `bun run format:check` | Check formatting with Biome (no writes)             |
| `bun run version:bump` | Bump `package.json` / `CHANGELOG.md` (see Versioning) |

## Project structure

```
src/
├── layouts/         # BaseLayout.astro, Layout.astro — the HTML shell (<head>, <body>)
├── pages/           # One .astro page per screen, plus /api/ route handlers
├── components/      # Reusable .astro components (RouteAccordion, QuoteForm, ...)
├── config/
│   ├── i18n/        # Site copy in es.json / en.json / ca.json + index.ts
│   └── site-info.ts # Brand metadata, canonical URLs, SEO defaults
├── data/            # Static fallback data (services, stops, towns, ...)
├── db/              # schema.ts — temporary stub pending a custom ORM
├── interfaces/      # TypeScript types per domain
├── lib/             # auth, passkey, search, users, db, tracking-store + validation/
├── styles/          # global.css — Tailwind v4 @theme design tokens
└── assets/          # Static assets (SVGs)
```

## Environment variables

Create a root `.env` file (it is git-ignored). The only variable required at runtime is:

- `AUTH_SECRET` — a long random string used to sign and verify HS256 session JWTs (`src/lib/auth.ts`).
- `BUS_TRACKING_DATA_FILE` — optional; overrides where the bus-tracking store writes its JSON (default `.data/bus-tracking.json`).

The database layer is currently stubbed (`src/lib/db.ts`, `src/db/schema.ts`) pending a custom ORM, so no database credentials are wired up yet.

## Versioning & releases

- `scripts/bump-version.mjs` (run via `bun run version:bump`) resolves the new version from a `--version=x.y.z` argument or the latest `v*` git tag, updates the `"version"` field in `package.json`, and promotes the `## [Unreleased]` heading in `CHANGELOG.md` to the new version with today's date.
- `.github/workflows/release.yml` runs when a `v*` tag is pushed: it checks out the default branch, sets up Bun, runs the bump script with `--version=${GITHUB_REF_NAME#v}`, commits any `package.json` / `CHANGELOG.md` changes, and creates a GitHub release with auto-generated notes.

This keeps `package.json` and `CHANGELOG.md` in sync on every tagged release.

## License

MIT
