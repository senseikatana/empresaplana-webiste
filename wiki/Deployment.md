# Despliegue

## GitHub Pages (actual)

### Flujo automático

El archivo `.github/workflows/deploy.yml` ejecuta el despliegue automáticamente en cada push a `dev` o `main`:

```
push → bun install → bun run build → upload dist/ → deploy to Pages
```

### Activar GitHub Pages

1. Ve a **Settings → Pages** del repositorio.
2. En **Source**, selecciona **GitHub Actions** (no "Deploy from a branch").
3. Haz push a `dev` o `main` — el workflow se ejecuta automáticamente.
4. El sitio estará disponible en: `https://senseikatana.github.io/empresaplana-website/`

### Despliegue manual

```bash
bun install
bun run build
# El resultado queda en dist/
```

### Dominio personalizado

Para servir desde `portfolio.senseikatana.com/empresaplana-website`:

1. En Cloudflare DNS, crea un registro CNAME:
   - **Nombre:** `portfolio`
   - **Destino:** `senseikatana.github.io`
   - **Proxy:** DNS only (naranja apagado)

2. En **GitHub → Settings → Pages → Custom domain**, introduce `portfolio.senseikatana.com`.

3. Actualiza el archivo `CNAME` en la raíz del repo:
   ```
   portfolio.senseikatana.com
   ```

4. Marca **Enforce HTTPS** una vez que el certificado se haya emitido.

> **Nota sobre la subruta:** GitHub Pages sirve el contenido en la raíz del dominio configurado. Si usas `portfolio.senseikatana.com` como dominio personalizado, el sitio estará en `https://portfolio.senseikatana.com/` (no en `/empresaplana-website/`). Para que la subruta funcione, necesitas un proxy inverso en Cloudflare.

---

## Cloudflare Pages (futuro)

> Esta sección se completará cuando se migre el despliegue.

### Plan

1. Conectar el repositorio de GitHub a Cloudflare Pages.
2. Configurar el proyecto:
   - **Framework preset:** Astro
   - **Build command:** `bun run build`
   - **Build output directory:** `dist`
   - **Node version:** 22+ (variable de entorno `NODE_VERSION=22`)
3. Configurar el dominio `portfolio.senseikatana.com` en Cloudflare Pages.
4. Ajustar `base` en `astro.config.mjs` según la ruta final:
   - Si el sitio va en la raíz del subdominio: `base: "/"` (quitar `/empresaplana-website`).
   - Si va en la subruta: mantener `base: "/empresaplana-website"` y configurar una regla de transformación de URL en Cloudflare.

---

## Configuración de Astro para despliegue

### `astro.config.mjs`

```js
export default defineConfig({
  output: "static",
  base: "/empresaplana-website",
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
```

### Cambios al pasar a Cloudflare Pages

Si el sitio va en la raíz del dominio:
1. Cambiar `base: "/empresaplana-website"` a `base: "/"`.
2. Eliminar el prefijo `/empresaplana-website` de todos los enlaces internos.
3. Ejecutar `bun run build` y verificar.

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

- **Sin backend:** El sitio es 100% estático. Las rutas API se eliminaron.
- **Sin React:** El componente `BusTrackingPanel` usa JavaScript vanilla.
- **Assets externos:** Las imágenes usan URLs de `lh3.googleusercontent.com` y `empresaplana.cat`. Si se quieren servir localmente, hay que descargarlas a `public/`.
