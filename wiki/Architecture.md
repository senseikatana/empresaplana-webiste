# Arquitectura del proyecto

## Estado

Migración en curso de Astro 7 → **Nuxt 4** (rama `feat/nuxt-4-migration`).
`src/` es legacy de referencia; la app activa vive en `app/` + `server/`.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Nuxt 4 + Nitro 2 |
| UI | Nuxt UI v4 + Tailwind CSS v4 (build-time) |
| i18n | `@nuxtjs/i18n` — ca default, es/en con prefijo |
| Datos | Prisma 7 (`prisma-client` → `generated/prisma/`) + `@prisma/adapter-pg` + `pg` sobre Postgres |
| Auth | jose HS256 JWT (`ep_session`) + scrypt passkeys, roles `client/worker/admin` |
| Tipografía | Geist (@nuxt/fonts) + Material Symbols |
| Tooling | Biome, pnpm |

## Decisiones de diseño

### SSR con Nitro (`node_server`)

Preset `node_server` como target primario (Render). `NITRO_PRESET=cloudflare_pages`
queda reversible; bloqueado por Prisma #28657 (WASM en workerd).

### Prisma como única fuente de verdad

Keystatic/`src/content/*.json` se eliminan en la migración. El panel admin es el
CMS y administra contenido + flota contra Postgres.

### i18n por rutas

`ca` en raíz, `es`/`en` con prefijo, en vez del query param `?lang=` anterior.
Microcopy en `i18n/locales/*.json`; contenido editorial irá a Postgres por locale.

### Diseño

Tokens canónicos en `app/assets/css/main.css` (`@theme`, espejo de `DESIGN.md`);
tema Nuxt UI mapeado en `app/app.config.ts` (primary navy, secondary teal).

## Estructura

```
app/               # Nuxt srcDir: pages, components, layouts, middleware
server/            # Nitro: server/api/*, server/utils/* (auth, prisma, passkey)
i18n/locales/      # diccionarios ca/es/en (contenido real exportado)
prisma/            # schema + seed
generated/prisma/  # client generado (no editar)
src/               # LEGACY Astro (en migración)
```

## Flujo de datos

```
Postgres ── Prisma Client (server/utils/prisma.ts) ── Nitro API (server/api/*)
     ▲                                                    │
     └── Panel admin (Nuxt UI) ── useFetch/$fetch ────────┘
```
