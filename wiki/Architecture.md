# Arquitectura del proyecto

## Visión general

Empresa Plana Website es un sitio web estático construido con **Astro 7** que sirve como presencia online de la empresa de transporte público Empresa Plana. El sitio se compila a HTML/CSS/JS puro y se despliega en GitHub Pages.

## Stack tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| **Framework** | Astro 7 | Generación de sitio estático con islands de interactividad |
| **Estilos** | Tailwind CSS v4 | Utility-first CSS, compilado en build time via `@tailwindcss/vite` |
| **Tipografía** | Geist | Fuente sans-serif principal (400/600/700) |
| **Iconos** | Material Symbols | Iconografía de Google |
| **Internacionalización** | JSON propio | 3 idiomas (CA/ES/EN), 575 claves por idioma |
| **Linting** | Biome | Formato y linting unificado |
| **Paquete** | Bun | Gestor de paquetes y runtime |
| **Despliegue** | GitHub Pages | Hosting estático gratuito |

## Decisiones de diseño

### Modo estático (`output: "static"`)

El sitio se compiló originalmente como `server` (SSR con `@astrojs/node`), pero se cambió a `static` para:
- Compatibilidad con GitHub Pages y Cloudflare Pages (no requieren servidor)
- Mejor rendimiento (HTML pre-generado)
- Menor coste de hosting

**Consecuencia:** Las rutas API (`/api/auth/*`, `/api/users/*`, `/api/bus-tracking/*`) se eliminaron. El componente `BusTrackingPanel` muestra la UI pero no persiste datos.

### Base path `/empresaplana-website`

El sitio se sirve bajo la subruta `/empresaplana-website/` para poder coexistir con otros proyectos en el mismo dominio (`portfolio.senseikatana.com`). Todos los enlaces internos, assets y redirects usan este prefijo.

### Sin React

El único componente React (`BusTrackingPanel.tsx`) se convirtió a Astro vanilla con un bloque `<script>` usando `define:vars`. Esto elimina la dependencia de React y reduce el tamaño del bundle.

### Schema stub (`src/db/schema.ts`)

La capa de base de datos (Turso + Drizzle) se eliminó mientras se implementa un ORM propio. El archivo `src/db/schema.ts` exporta tipos y constantes mínimas para que los imports no fallen. Los archivos `src/lib/db.ts` y `src/lib/search.ts` son stubs vacíos.

## Flujo de datos

```
┌─────────────────────────────────────────────────┐
│                   Build time                     │
│                                                  │
│  src/config/i18n/*.json  ──→  Páginas Astro      │
│  src/data/*.json         ──→  Componentes         │
│  src/config/site-info.ts ──→  SEO / Meta tags     │
│  src/styles/global.css   ──→  Tailwind CSS        │
│                                                  │
│  Astro compila todo a HTML/CSS/JS estático       │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│               Runtime (navegador)                 │
│                                                  │
│  BusTrackingPanel.astro  →  <script> vanilla JS  │
│  (define:vars)             (fetch, DOM, eventos)  │
│                                                  │
│  Sin framework JS en el cliente                  │
└─────────────────────────────────────────────────┘
```

## Dependencias

### Producción (`dependencies`)

| Paquete | Versión | Uso |
|---------|---------|-----|
| `astro` | ^7.2.10 | Framework principal |
| `@tailwindcss/vite` | ^4.3.3 | Plugin Vite para Tailwind |
| `tailwindcss` | ^4.3.3 | Framework CSS utility-first |
| `zod` | ^4.5.4 | Validación de esquemas |
| `jose` | ^6.2.10 | JWT para autenticación (preparado para futuro) |

### Desarrollo (`devDependencies`)

| Paquete | Versión | Uso |
|---------|---------|-----|
| `@astrojs/check` | ^0.9.10 | Verificación de tipos Astro |
| `@biomejs/biome` | ^2.5.11 | Linting y formato |
| `@types/node` | ^26.4.1 | Tipos de Node.js |
| `typescript` | ^6.0.3 | Compilador TypeScript |
| `docx` | ^9.7.1 | Generación de documentos Word |

## Configuración de path aliases

`tsconfig.json` define el alias `@/` → `./src/`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

`astro.config.mjs` replica el alias para Vite:

```js
resolve: {
  alias: {
    "@": fileURLToPath(new URL("./src", import.meta.url)),
  },
},
```
