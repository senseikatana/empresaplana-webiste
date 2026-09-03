# Deployment — Empresa Plana Website

## Visión general

El sitio se compila como HTML/CSS/JS estático con Astro y se despliega en **GitHub Pages**. Más adelante se migrará a **Cloudflare Pages** bajo el dominio `portfolio.senseikatana.com/empresaplana-website`.

| Concepto | Valor |
|---|---|
| Modo de salida | `static` (HTML estático, sin servidor) |
| Base path | `/empresaplana-website` |
| Build command | `bun run build` |
| Output directory | `dist/` |
| Framework | Astro 7 + Tailwind CSS v4 |

---

## GitHub Pages (actual)

### Requisitos previos

1. **Repo en GitHub** con la rama `main` (o `dev`) como fuente.
2. **Bun** instalado en el runner (el workflow usa `oven-sh/setup-bun`).
3. **GitHub Pages habilitado** en Settings → Pages → Source: GitHub Actions.

### Workflow

El archivo `.github/workflows/deploy.yml` ejecuta el despliegue automáticamente en cada push a `dev` o `main`:

```
push → bun install → bun run build → upload dist/ → deploy to Pages
```

### Pasos manuales (si no usas el workflow)

```bash
# 1. Instalar dependencias
bun install

# 2. Compilar el sitio estático
bun run build

# 3. El resultado queda en dist/
# Subir dist/ como artifact o servir con cualquier servidor estático
```

### Configuración en GitHub

1. Ve a **Settings → Pages** del repositorio.
2. En **Source**, selecciona **GitHub Actions** (no "Deploy from a branch").
3. Haz push a `dev` o `main` — el workflow se ejecuta automáticamente.
4. El sitio estará disponible en: `https://senseikatana.github.io/empresaplana-website/`

### Dominio personalizado (opcional)

Si quieres servir desde `portfolio.senseikatana.com/empresaplana-website`:

1. En Cloudflare DNS, crea un registro CNAME:
   - **Nombre:** `portfolio`
   - **Destino:** `senseikatana.github.io`
   - **Proxy:** DNS only (naranja apagado) o proxied — GitHub necesita ver las peticiones directas para el dominio personalizado.

2. En **GitHub → Settings → Pages → Custom domain**, introduce `portfolio.senseikatana.com`.

3. El archivo `CNAME` en la raíz del repo ya contiene `senseikatana.com`. Si el dominio final es `portfolio.senseikatana.com`, actualízalo:
   ```
   portfolio.senseikatana.com
   ```

4. Marca **Enforce HTTPS** una vez que el certificado se haya emitido (automático con GitHub Pages + dominio personalizado).

> **Nota sobre la subruta:** GitHub Pages sirve el contenido en la raíz del dominio configurado. Si usas `portfolio.senseikatana.com` como dominio personalizado, el sitio estará en `https://portfolio.senseikatana.com/` (no en `/empresaplana-website/`). Para que la subruta funcione tal cual, necesitas un proxy inverso en Cloudflare que mapee `/empresaplana-website/` al `dist/`. Esto se documentará cuando se configure Cloudflare Pages.

---

## Cloudflare Pages (futuro)

> Esta sección se completará cuando se migre el despliegue.

### Plan

1. Conectar el repositorio de GitHub a Cloudflare Pages.
2. Configurar el proyecto:
   - **Framework preset:** Astro
   - **Build command:** `bun run build`
   - **Build output directory:** `dist`
   - **Node version:** 22+ (configurar en la variable de entorno `NODE_VERSION=22`)
3. Configurar el dominio `portfolio.senseikatana.com` en Cloudflare Pages.
4. Ajustar `base` en `astro.config.mjs` según la ruta final:
   - Si el sitio va en la raíz del subdominio: `base: "/"` (quitar `/empresaplana-website`).
   - Si va en la subruta: mantener `base: "/empresaplana-website"` y configurar una regla de transformación de URL en Cloudflare.

---

## Desarrollo local

```bash
# Instalar
bun install

# Servidor de desarrollo (con base path)
bun run dev
# → http://localhost:4321/empresaplana-website/

# Build de producción
bun run build

# Preview del build
bun run preview
```

---

## Estructura de salida (`dist/`)

```
dist/
├── index.html                          # Página principal
├── _astro/                             # Assets (CSS, JS)
├── rutas-horarios/index.html
├── rastreig/index.html
├── servicios-discrecionales/index.html
├── servicios/[slug]/index.html         # 8 servicios
├── donde-estamos/index.html
├── aviso-legal/index.html
├── politica-privacidad/index.html
├── politica-cookies/index.html
├── solicitar-presupuesto/index.html
├── ...                                 # 29 páginas en total
├── favicon.ico
└── favicon.svg
```

---

## Notas importantes

- **Sin backend:** El sitio es 100% estático. Las rutas API (`/api/auth/*`, `/api/users/*`, `/api/bus-tracking/*`) se eliminaron. La página de seguimiento de buses (`/rastreig`) muestra la UI pero no persiste datos.
- **Sin React:** El componente `BusTrackingPanel` se convirtió de React (`.tsx`) a Astro con JavaScript vanilla. No hay dependencia de React.
- **i18n:** Los tres idiomas (CA, ES, EN) están soportados vía query param `?lang=ca|es|en`. El idioma por defecto es catalán.
- **Assets externos:** Las imágenes usan URLs de `lh3.googleusercontent.com` y `empresaplana.cat`. Si se quieren servir localmente, hay que descargarlas a `public/`.
