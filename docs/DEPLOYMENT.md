# Deployment — Empresa Plana Website

## Visión general

El sitio corre en **Nuxt 4** (SSR, Nitro preset `node_server`). **Render quedó
descartado como deploy primario**: el servicio manual creado allí usa un build
command incorrecto (`npm run generate`, inexistente) y no aplica nuestro
`render.yaml`. La decisión actual es **InsForge** para todo (DB + deploy).
Cloudflare Pages queda como objetivo reversible cuando Prisma soporte Workers
(issue prisma/prisma#28657).

| Concepto | Valor |
|---|---|
| Framework | Nuxt 4 + Nitro 2 |
| Preset primario | `node_server` |
| Preset reversible | `cloudflare_pages` (bloqueado por Prisma #28657) |
| Build command | `pnpm run render:build` |
| Start command | `node .output/server/index.mjs` |
| Health check | `/api/health` |
| DB | InsForge Postgres (eu-central), **Prisma Migrate es la autoridad** |
| Deploy | InsForge Compute (pendiente) |

## InsForge (actual)

- Proyecto: **empresaplana.cat** (`8929a7b2-3f14-461b-b228-e6f8c8b6573c`),
  región eu-central, API base `https://k5s4v7js.eu-central.insforge.app`.
- DB: Postgres 15 en el proyecto InsForge; `DATABASE_URL` en `.env` local
  (gitignored), consumida por Prisma 7 + `@prisma/adapter-pg`.
- Esquema: autoridad en **Prisma Migrate** (`prisma/migrations/`). La CLI de
  InsForge NO se usa para migrar; solo proyecto, secretos, logs y deploy.
- Migración inicial: `20260913151507_init` (27 modelos + m2m `_RouteToStop` +
  `_prisma_migrations` = **29 tablas**).
- Seed completo: 3 users demo (cliente/trabajador/admin, passkey `12345678`),
  8 rutas, 20 paradas, 10 horarios, 10 buses, 8 conductores, 4 presupuestos.
- Verificación: suite smoke 18/18 verde contra InsForge (build producción).

## Render (pausado / histórico)

El servicio `empresaplana-website.onrender.com` se creó manual (no blueprint):
build command `npm run generate` (no existe) → build falló. Se decidió no
usarlo; el blueprint `render.yaml` se conserva por si se retoma.

## Cloudflare Pages (futuro)

```bash
pnpm run cf:build   # NITRO_PRESET=cloudflare_pages → dist/
pnpm run cf:dev     # build + wrangler pages dev (compatibility nodejs_compat)
wrangler pages deploy dist
```

Config en `wrangler.jsonc` (`compatibility_flags: ["nodejs_compat"]`). **Bloqueo
actual:** Prisma ORM 7 instancia el query compiler WASM desde buffer y workerd
lo prohíbe (`Wasm code generation disallowed by embedder`). No hay compat flag.

## Desarrollo local

```bash
pnpm run dev   # http://localhost:3000 — DB InsForge (DATABASE_URL del .env)
```