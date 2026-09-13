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

## Pendiente

1. Deploy a InsForge Compute: `Dockerfile` Node 22.12.0 (modo source), env
   `DATABASE_URL` + `AUTH_SECRET`, health `/api/health`.
2. Dominio `empresaplana.cat` vía `domains` (con su SSL).
3. Pausar/eliminar el servicio de Render `empresaplana-website`.