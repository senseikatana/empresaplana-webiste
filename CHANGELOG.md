# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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
