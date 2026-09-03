# Guía de contribución

## Flujo de trabajo

### 1. Crear rama de feature

```bash
git checkout dev
git pull origin dev
git checkout -b feat/mi-feature
```

### 2. Desarrollar

```bash
# Servidor de desarrollo
bun run dev

# Verificar tipos
bunx astro check

# Linting y formato
bun run check
bun run format
```

### 3. Commitear

Seguir Conventional Commits:

```bash
git add .
git commit -m "feat(component): descripción del cambio"
```

### 4. Merge a dev

```bash
git checkout dev
git merge feat/mi-feature --no-ff -m "Merge branch 'feat/mi-feature' into dev"
git push origin dev
```

### 5. Merge a main (cuando esté listo)

```bash
git checkout main
git merge dev --no-ff -m "Merge branch 'dev' into main"
git push origin main
```

### 6. Release (opcional)

```bash
git tag v1.2.0
git push origin v1.2.0
# El workflow de GitHub Actions ejecuta el bump automáticamente
```

## Convenciones de código

### TypeScript

- Usar tipos explícitos en props de componentes.
- Los interfaces van en `src/interfaces/`.
- Usar `@/` para imports absolutos.

### Astro

- Los componentes usan `<script define:vars>` para interactividad (no React).
- Los datos estáticos van en `src/data/` como JSON.
- Los tokens de diseño van en `src/styles/global.css` (nunca `bg-[#...]` ad-hoc).

### CSS

- Usar clases de Tailwind del sistema de diseño.
- Los tokens de color, espaciado y tipografía están en `global.css`.
- No hardcodear colores; usar las variables CSS del `@theme`.

### i18n

- Todo el texto visible va en los diccionarios `src/config/i18n/*.json`.
- Añadir claves en los 3 idiomas (CA, ES, EN).
- Usar `getLocale()` y `getDictionary()` en las páginas.

## Estructura de commits

```
tipo(alcance): descripción

[opcional cuerpo]

[opcional pie]
```

- **tipo:** `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`, `perf`
- **alcance:** componente, módulo o área afectada
- ** descripción:** imperativo, sin punto final, máx 72 caracteres

Ejemplos:
```
feat(search): añadir filtro por franja horaria
fix(accordion): corregir animación de apertura
chore(deps): actualizar Tailwind a v4.3.3
docs(wiki): documentar sistema de diseño
```

## Pull Requests

Si se usa el flujo de PRs:

1. Crear PR de `feat/*` a `dev`.
2. Describir los cambios en la descripción.
3. Esperar review (si aplica).
4. Merge con `--no-ff` para preservar el historial.

## Checklist antes de merge

- [ ] `bun run build` compila sin errores
- [ ] `bunx astro check` no muestra errores de tipos
- [ ] `bun run check` pasa linting y formato
- [ ] Los enlaces internos usan el prefijo `/empresaplana-website/`
- [ ] Los textos están en los 3 diccionarios i18n
- [ ] Los tokens de diseño se usan correctamente (no colores hardcodeados)
