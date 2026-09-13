# Despliegue

## Render (primario)

Blueprint `render.yaml` en la raíz (Infrastructure as Code):

- Build: `render:build` (preset `node_server`).
- Start: `node .output/server/index.mjs`.
- Health check: `/api/health`.
- Secretos: `DATABASE_URL` (`sync: false`), `AUTH_SECRET` (generado).

Ver también `docs/DEPLOYMENT.md`.

## Cloudflare Pages (bloqueado, reversible)

```bash
pnpm run cf:build   # NITRO_PRESET=cloudflare_pages → dist/
pnpm run cf:dev     # build + wrangler pages dev (nodejs_compat)
wrangler pages deploy dist
```

**Bloqueo:** Prisma ORM 7 instancia el query compiler WASM desde buffer y
workerd lo prohíbe (`Wasm code generation disallowed by embedder`,
prisma/prisma#28657). Sin compat flag disponible. Volver a este target cuando
Prisma publique un build compatible con Workers.

## CI

- `.github/workflows/check.yml` — Biome + build `node_server` en push/PR.
- Migraciones Prisma NO corren en runtime: ejecutarlas en CI o local.
