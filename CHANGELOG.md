# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-09-13

### Added
- Migración a **Nuxt 4** (Nitro 2, presets `node_server`): app full-stack SSR con Nuxt UI v4, Tailwind v4 y estructura `app/`, `server/`, `i18n/`.
- API REST + CMS con **Prisma 7** sobre Postgres: modelos y seed de datos reales de rutas, buses, horarios, paradas y conductores; endpoints de presupuestos, favoritas, chat, oficinas y búsqueda de rutas.
- Panel dashboard por rol (cliente/trabajador/admin) con navegación por capabilities (`hasCapability()`).
- Chat WebSocket entre clientes y personal.
- SEO técnico: meta/OG traducidos, hreflang, `robots.txt` y `sitemap.xml`.
- Idioma francés (`fr`) en los diccionarios i18n (ca/es/en/fr).
- Login demo y middleware global de auth + guards de ruta por capability.
- Deploy en **InsForge** (Prisma Postgres + Compute + Dockerfile) y documentación (`docs/DEPLOYMENT.md`, `docs/INSFORGE.md`).

### Changed
- Eliminado el legacy **Astro** (`src/`, Keystatic y dependencias).
- Gestor de paquetes **bun → pnpm** (pnpm-lock, workspaces, workflows CI).
- Auth migrada a **JWT HS256 (jose)** en cookie `ep_session` (7 días) con passkeys hasheadas con **scrypt**.
- Autorización bajo **ACL estilo WordPress** (roles → capabilities) en endpoints y UI, sin checks de rol inline.
- Hardening de la API: **rate-limit** por IP (ventana fija en memoria) y sesión obligatoria en endpoints sensibles.

### Fixed
- CI: `prisma generate` en postinstall con `DATABASE_URL` dummy y `nuxt prepare` previo.
- Endpoints sensibles (presupuestos, favoritas, chat, cuenta) que no exigían sesión autenticada.

---

## [0.1.0] - 2026-09-03

### Added
- Version automation: `scripts/bump-version.mjs` and `.github/workflows/release.yml`.
- Database boundary stubs pending a custom ORM: `src/db/schema.ts`, plus stubbed `src/lib/db.ts`, `src/lib/search.ts`, and `api/auth/*` / `api/users/*` routes.
- Build glue to make the site build and serve: `src/layouts/BaseLayout.astro`, `src/data/towns.ts`, and `src/data/index.ts`.

### Changed
- Converted the `BusTrackingPanel` React island into a vanilla-JS Astro component (`BusTrackingPanel.astro`).
- Wired the build: `astro.config.mjs` (server output, Node adapter, Tailwind, `@/` alias) and cleaned `tsconfig.json` and `.gitignore`.

### Removed
- Database tooling: deleted `src/scripts/` (Turso seed/sync/export scripts) and the 10 scraped markdown files in `src/config/`.
- Dead code: `src/interfaces/types.ts` and `src/interfaces/data.ts`.
- React dependency, dropped with the bus-tracking island conversion.

### Fixed
- Fixed dev and build scripts so the project builds and serves.

---

## [1.0.0] - 2026-07-26

### Added
- Initial release of the project.
- Complete folder structure and baseline configuration.
- Comprehensive `.gitignore`, `LICENSE`, and documentation files.
- Responsive design layout and UI components.

### Changed
- Standardized project configurations and clean commit workflow.

### Fixed
- Resolved nested repository issues and gitlink submodule conflicts.
