# AGENTS.md

Empresa Plana website — transport públic de viajeros por carretera en la Costa Daurada.
Redesign + panel administrativo (CMS). Target: `https://empresaplana.cat`.

## Estado de la migración

- La app es **Nuxt 4** (`app/`, `server/`, `i18n/`). El legado Astro (`src/`) se
  eliminó por completo (rama `chore/remove-astro-legacy`).
- Integración: `dev`; releases: `main`.

## Stack (Nuxt 4)

- Nuxt 4 + Nitro 2 + Nuxt UI v4 (`@nuxt/ui`, Tailwind v4 build-time) + `@nuxtjs/i18n`
- Package manager: **pnpm**. Node >= 22.12.
- ORM: **Prisma 7** (`prisma-client` generator, output `generated/prisma/`) +
  `@prisma/adapter-pg` + `pg`. Fuente de verdad: **Postgres** (Prisma Postgres).
- Auth: **jose** HS256 JWT en cookie `ep_session` (httpOnly, 7d) + scrypt
  (`server/utils/passkey.ts`). Roles: `client | worker | admin`.
- Autorización: **ACL estilo WordPress** (roles → capabilities) en
  `shared/acl.ts`; guards de endpoint con `requireCapability()` en
  `server/utils/acl.ts`. Nada de checks `role === "..."` inline.
- Diseño: tokens en `app/assets/css/main.css` (`@theme`, espejo de `DESIGN.md`),
  tema Nuxt UI en `app/app.config.ts`. Geist + Material Symbols.

## Commands

- `pnpm install`
- `pnpm run dev` — dev server (puerto 3000)
- `pnpm run build` — build Node (`node_server`) → `.output/`
- `pnpm run preview` — sirve el build
- `pnpm run render:build` — build para Render (`node_server`, explícito)
- `pnpm run cf:build` / `pnpm run cf:dev` — build/previz Cloudflare Pages (ver Gotchas)
- `pnpm run db:generate` / `db:push` / `db:migrate` / `db:studio` / `db:create-user`
- `pnpm run check` / `lint` / `format` — Biome

## Deploy

- **Primario: Render** (blueprint `render.yaml`, preset `node_server`).
  Start command: `node .output/server/index.mjs`. Health check: `/api/health`.
- **Reversible a Cloudflare Pages:** `NITRO_PRESET=cloudflare_pages` + wrangler.
  Bloqueado hoy por Prisma (ver Gotchas).
- Migraciones Prisma NO corren en runtime: se ejecutan en CI o local.

## i18n

- Locale por defecto: **ca** (raíz `/`); `es` y `en` con prefijo (`/es`, `/en`).
- Diccionarios: `i18n/locales/{ca,es,en,fr}.json` (contenido real exportado del
  sitio original).

## Contenido real (fuentes, no inventar)

- `i18n/locales/*.json` — todo el copy de la web y del panel (ca/es/en/fr).
- `docs/empresa-plana-contenido-web.docx` — documentación completa del contenido.
- `wiki/Legacy-Content.md` — inventario (teléfonos, 129 localidades, 8 líneas, ISO, etc.).
- `app/data/contact.ts` — teléfonos/redes reales (extraídos del sitio original).

## Estructura

- `app/` — páginas, componentes, layouts, middleware (Nuxt 4 srcDir)
- `app/pages/` — sitio público (`/`, `/rutas-horarios`, `/dashboard/...`)
- `server/` — API REST (`server/api/`), utils (`auth`, `prisma`, `passkey`)
- `i18n/locales/` — diccionarios ca/es/en/fr
- `prisma/` — schema, seed + `seed-data/`; `generated/prisma/` — client generado (no editar)

## Gotchas

- **Prisma en Cloudflare Workers/Pages está roto** (issue Prisma #28657: el query
  compiler WASM se instancia desde buffer y workerd lo prohíbe). Por eso el
  deploy primario es Render. Cuando Prisma lo arregle: `NITRO_PRESET=cloudflare_pages`.
- El generador de Prisma es `prisma-client` (output `../generated/prisma`), no
  `prisma-client-js`. El client se importa desde `generated/prisma/client`.
- `pg-native` tiene stub (`server/utils/pg-native-stub.ts`) + alias en Nitro;
  no quitar.
- `prisma.config.ts` vive en la raíz (Prisma 7 no lo detecta dentro de `prisma/`).
- `getSessionUser` (server/utils/auth.ts) se llama así para no chocar con el
  auto-import de `getSession` de h3.
- Tokens de diseño solo en `app/assets/css/main.css`; nada de `bg-[#...]` ad hoc.
- No commitear `.env`, `.dev.vars` ni `generated/`.
- Local DB dev: Docker Postgres en `127.0.0.1:54329` (ver `README.md`).