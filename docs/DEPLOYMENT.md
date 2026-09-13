# Deployment — Empresa Plana Website

## Visión general

El sitio corre en **Nuxt 4** (SSR, Nitro preset `node_server`) y se despliega en
**Render** vía blueprint (`render.yaml`). Cloudflare Pages queda como objetivo
reversible cuando Prisma soporte Workers (issue prisma/prisma#28657).

| Concepto | Valor |
|---|---|
| Framework | Nuxt 4 + Nitro 2 |
| Preset primario | `node_server` (Render) |
| Preset reversible | `cloudflare_pages` (bloqueado por Prisma #28657) |
| Build command | `pnpm run render:build` |
| Start command | `node .output/server/index.mjs` |
| Health check | `/api/health` |
| DB | Postgres (Prisma Postgres), migraciones fuera de runtime |

## Render (actual)

Blueprint `render.yaml` en la raíz:

- Service web, `env: node`, build `render:build`, start `node .output/server/index.mjs`.
- `DATABASE_URL` se carga como secret vía `sync: false`; `AUTH_SECRET` se genera.
- El runtime de la app se sirve desde `.output/server/` (Nitro standalone).

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
pnpm run nuxt:dev   # http://localhost:3000 (DB Docker en 127.0.0.1:54329)
```
