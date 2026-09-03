# Guía de inicio rápido

## Requisitos previos

| Herramienta | Versión mínima | Instalación |
|-------------|---------------|-------------|
| **Bun** | 1.0+ | `curl -fsSL https://bun.sh/install \| bash` |
| **Node.js** | 22.12+ | `bun` lo gestiona internamente |
| **Git** | 2.30+ | `sudo pacman -S git` (Arch/Manjaro) |

## Instalación

```bash
# 1. Clonar el repositorio
git clone git@github.com:senseikatana/empresaplana-webiste.git
cd empresaplana-webiste

# 2. Instalar dependencias
bun install

# 3. Variables de entorno (opcional, solo para auth futuro)
cp .env.example .env
# Editar .env con tus valores
```

## Desarrollo local

```bash
# Servidor de desarrollo con hot-reload
bun run dev
# → http://localhost:4321/empresaplana-website/

# Build de producción (genera dist/)
bun run build

# Preview del build de producción
bun run preview
```

> **Nota:** El sitio usa `base: "/empresaplana-website"`, por lo que todas las rutas incluyen ese prefijo.

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Servidor de desarrollo en puerto 4321 |
| `bun run build` | Compila el sitio estático en `dist/` |
| `bun run preview` | Sirve el build de producción localmente |
| `bun run lint` | Linting con Biome |
| `bun run check` | Linting + formato con Biome |
| `bun run format` | Formatea el código con Biome |
| `bun run format:check` | Verifica el formato sin modificar |
| `bun run version:bump` | Actualiza versión en package.json y CHANGELOG.md |

## Estructura del proyecto

```
empresaplana-webiste/
├── src/
│   ├── components/     # 8 componentes Astro
│   ├── config/         # i18n (ca/es/en) + site-info + datos scrapeados
│   ├── data/           # JSON estáticos (paradas, servicios, presupuesto)
│   ├── db/             # Schema stub (esperando ORM propio)
│   ├── interfaces/     # 19 archivos TypeScript de tipos
│   ├── layouts/        # BaseLayout.astro + Layout.astro
│   ├── lib/            # Utilidades (auth, passkey, tracking, search stub)
│   ├── pages/          # 23 páginas Astro
│   └── styles/         # global.css (Tailwind + tokens de diseño)
├── public/             # Assets estáticos (favicon)
├── docs/               # Documentación (DEPLOYMENT.md)
├── wiki/               # Esta wiki
├── scripts/            # Scripts de utilidad (bump-version, generate-doc)
├── astro.config.mjs    # Configuración de Astro
├── package.json        # Dependencias y scripts
├── tsconfig.json       # Configuración TypeScript
├── biome.json          # Configuración de linting/formato
└── DESIGN.md           # Tokens de diseño (fuente de verdad)
```

## Solución de problemas

### El servidor no arranca
```bash
# Verificar que bun está instalado
bun --version

# Limpiar caché y reinstalar
rm -rf node_modules bun.lock
bun install
```

### Errores de TypeScript
```bash
# Verificar tipos
bunx astro check
```

### El CSS no se aplica
Verificar que `src/styles/global.css` se importa en `BaseLayout.astro`:
```astro
import "../styles/global.css";
```
