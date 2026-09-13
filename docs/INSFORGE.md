# InsForge — Empresa Plana Website

Registro de la integración con InsForge: backend, DB y decisiones tomadas.

## Contexto

El proyecto es Nuxt 4 full-stack (SSR + Nitro `node_server` + WebSocket) con
**Prisma 7** (`prisma-client` generator + `@prisma/adapter-pg` + `pg`) como ORM
y autoridad de esquema. Se migró de Render a InsForge: DB + deploy en la misma
plataforma.

## Conexión

- CLI instalada y linkeada al proyecto `empresaplana.cat`
  (`8929a7b2-3f14-461b-b228-e6f8c8b6573c`, región `eu-central`).
- Comandos siempre vía `npx -y @insforge/cli ...` (con `-y` para no bloquear).
- Estado: `npx -y @insforge/cli current`.
- `.insforge/project.json` se genera al linkear; **no se commitea** (ya en
  `.gitignore`).

## Base de datos

| Dato | Valor |
|---|---|
| Host | `k5s4v7js.eu-central.database.insforge.app` |
| DB | `insforge` (PostgreSQL 15.18) |
| SSL | `require` (pg advierte que es alias de `verify-full` hasta pg v9) |
| Consumo | Prisma 7 via `@prisma/adapter-pg`, `DATABASE_URL` en `.env` |
| Esquema | **Prisma Migrate manda** (`prisma/migrations/`), no migraciones InsForge |

### Migraciones

Comando de migración estándar (igual que contra una Postgres cualquiera):

```bash
pnpm run db:generate   # prisma generate
pnpm exec prisma migrate dev --name <name>   # crear + aplicar migración
pnpm run db:seed       # tsx prisma/seed.ts
```

- `20260913151507_init`: migración inicial (toda la app).
- **29 tablas** = 27 modelos + `_RouteToStop` (m2m implícito Stop↔Route) +
  `_prisma_migrations` (control de migraciones).

### Seed (datos ficticios para desarrollo)

`prisma/seed.ts` + `prisma/seed-data/` — idempotente (upserts):

- 3 usuarios demo: `cliente`(client), `trabajador`(worker), `admin`(admin);
  passkey `12345678` (hash scrypt real, `server/utils/passkey.ts`).
- Flota: 8 rutas, 20 paradas, 10 horarios, 10 buses, 8 conductores.
- 4 notificaciones, 4 entradas de actividad, 4 presupuestos.

## Secrets

- `AUTH_SECRET` = `1c2bac8921448a404f464d9464842801` (generado en Render,
  validado: 32 bytes → HS256 OK con jose). Vive en `.env` local (gitignored) y
  se configurará como secret/env del deploy InsForge. **Nunca compiteado.**
- `DATABASE_URL` de InsForge solo en `.env` local; en producción va como env
  del servicio deployado.

## Estado de la app contra InsForge

Verificado contra el build de producción (`node .output/server/index.mjs`
con `.env` de InsForge): **18/18** smoke tests verdes (guards 302 sin sesión,
login de los 3 roles, redirects por capability, `/fr/dashboard/login` sin loop).

## Deploy (InsForge Compute) — HECHO ✅

- Servicio: **empresaplana**
  - Endpoint: `https://empresaplana-8929a7b2-3f14-461b-b228-e6f8c8b6573c.fly.dev`
  - Topología: Fly.io (`shared-1x`, 512 MB, region iad), imagen
    `registry.fly.io/empresaplana-<projectId>` (build remoto vía flyctl, sin
    Docker local).
  - `Dockerfile` multi-stage (Node 22.12 bookworm-slim, pnpm 12.4.1,
    `NITRO_PRESET=node_server`, `node .output/server/index.mjs`).
  - Envs: `DATABASE_URL` (InsForge), `AUTH_SECRET`, `PORT=3000`.
- `fly.toml` autogenerado por el CLI (scale-to-zero: `auto_stop_machines=stop`,
  `min_machines_running=0`).
- Health check: `GET /api/health` → `{"ok":true,"db":"up"}`.
- Smoke 8/8 reales contra producción: guards 302, redirect con param, login y
  permisos de admin/worker/client correctos.

### Gotchas de deploy (aprendidos)

- pnpm 11+ deja de leer `pnpm.onlyBuiltDependencies` del `package.json`; la
  config vive en `pnpm-workspace.yaml` (`allowBuilds`). Sin ello,
  `ERR_PNPM_IGNORED_BUILDS`.
- El stage de build LEE el esquema y las fuentes: el `COPY . .` debe ocurrir
  ANTES de `pnpm install` para que el `postinstall` de Prisma encuentre
  `prisma/schema.prisma`.
- `prisma.config.ts` lee `env('DATABASE_URL')` al cargar: el stage de build
  necesitó un `DATABASE_URL` placeholder (solo genera código, no conecta).
- Corepack en node:22 bookworm-slim falla (`Cannot find matching keyid`);
  instalar pnpm vía `npm install -g` es más fiable.
- Imagen base necesita `openssl` para los engines de Prisma.

## Pendiente

1. Dominio `empresaplana.cat` vía `domains` (con su SSL).
2. Pausar/eliminar el servicio de Render `empresaplana-website`.
3. Rotar `user-api-key` de InsForge y password de la DB (expuestos en chat en
   algún momento).