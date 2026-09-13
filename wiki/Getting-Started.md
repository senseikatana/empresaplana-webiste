# Guía de inicio rápido

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| **pnpm** | 12+ |
| **Node.js** | 22.12+ |
| **Docker** (opcional, DB local) | — |

## Instalación

```bash
# 1. Clonar y ubicarse en la rama de migración
git clone git@github.com:senseikatana/empresaplana-webiste.git
cd empresaplana-webiste
git checkout feat/nuxt-4-migration

# 2. Dependencias
pnpm install

# 3. Variables de entorno
cp .env.example .env   # DATABASE_URL + AUTH_SECRET

# 4. Base de datos local (Docker Postgres)
docker run -d --name empresaplana-pg \
  -e POSTGRES_USER=empresaplana -e POSTGRES_PASSWORD=empresaplana \
  -e POSTGRES_DB=empresaplana -p 54329:5432 postgres:17-alpine
pnpm run db:generate
pnpm run db:push

# 5. Primer usuario admin
pnpm run db:create-user admin 12345678 admin
```

## Desarrollo local

```bash
pnpm run dev   # http://localhost:3000
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm run dev` | Dev server (3000) |
| `pnpm run build` | Build producción Node → `.output/` |
| `pnpm run preview` | Sirve el build |
| `pnpm run render:build` | Build para Render |
| `pnpm run cf:build` / `cf:dev` | Build/previz Cloudflare (bloqueado, ver Gotchas) |
| `pnpm run db:generate` / `db:push` / `db:studio` | Prisma CLI |
| `pnpm run db:create-user` | Crear usuario (`<user> <pass> <role>`) |
| `pnpm run check` / `lint` / `format` | Biome |

## Estructura del proyecto

```
empresaplana-webiste/
├── app/               # Nuxt srcDir: pages, components, layouts, middleware
├── server/            # Nitro API: server/api/*, server/utils/*
├── i18n/locales/      # diccionarios ca/es/en (contenido real)
├── prisma/            # schema + seed
├── generated/prisma/  # client generado (no editar)
├── render.yaml        # blueprint Render
├── wrangler.jsonc     # config Cloudflare
├── nuxt.config.ts     # config Nuxt
└── DESIGN.md          # tokens de diseño (fuente de verdad)
```

## Solución de problemas

### El servidor no arranca
```bash
pnpm --version
rm -rf node_modules .nuxt pnpm-lock.yaml
pnpm install
pnpm run nuxt:prepare
```

### La DB no conecta
```bash
curl http://localhost:3000/api/health   # debe devolver {"ok":true,"db":"up"}
```
Verificar que Docker Postgres esté corriendo (`docker ps | grep empresaplana-pg`).
