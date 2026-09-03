# Versionado

## Sistema de versiones

El proyecto usa **Semantic Versioning** (SemVer): `MAJOR.MINOR.PATCH`.

| Componente | Descripción |
|-----------|-------------|
| `package.json` | Campo `"version"` — fuente de verdad |
| `CHANGELOG.md` | Registro de cambios por versión |
| `scripts/bump-version.mjs` | Script que sincroniza ambos |
| `.github/workflows/release.yml` | Workflow que ejecuta el bump en cada tag `v*` |

## Flujo de versionado

### Manual

```bash
# 1. Crear un tag
git tag v1.2.0

# 2. Ejecutar el bump
bun run version:bump --version=1.2.0

# 3. Commit y push
git add package.json CHANGELOG.md
git commit -m "chore(release): bump version to 1.2.0"
git push && git push --tags
```

### Automático (recomendado)

1. Haz push de un tag `v*` al repositorio.
2. El workflow `.github/workflows/release.yml` se ejecuta automáticamente:
   - Checkout de la rama `main`.
   - Ejecuta `bun scripts/bump-version.mjs` con la versión del tag.
   - Actualiza `package.json` y `CHANGELOG.md`.
   - Hace commit y push de los cambios.
   - Crea un GitHub Release con notas automáticas.

```bash
# Crear y push un tag para触发 el workflow
git tag v1.2.0
git push origin v1.2.0
```

## Script `bump-version.mjs`

### Uso

```bash
# Con versión explícita
bun run version:bump --version=1.2.0

# Desde el último tag (requiere tags en el repo)
bun run version:bump
```

### Qué hace

1. Lee la versión de `--version=` o del último tag `v*` en git.
2. Valida que sea SemVer válido (`x.y.z` o `x.y.z-prerelease`).
3. Actualiza `"version"` en `package.json` (preservando formato).
4. Reemplaza `## [Unreleased]` en `CHANGELOG.md` con `## [x.y.z] - YYYY-MM-DD`.

### Ejemplo de CHANGELOG

Antes:
```markdown
## [Unreleased]

### Added
- Nueva funcionalidad X
```

Después de `bun run version:bump --version=1.2.0`:
```markdown
## [1.2.0] - 2026-09-03

### Added
- Nueva funcionalidad X
```

## Convenciones de commits

El proyecto sigue **Conventional Commits**:

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `chore:` | Mantenimiento (deps, config, CI) |
| `docs:` | Documentación |
| `refactor:` | Refactorización sin cambio de comportamiento |
| `style:` | Formato, espaciado, etc. |
| `test:` | Tests |
| `perf:` | Mejora de rendimiento |

Ejemplos:
```
feat(deploy): convertir a sitio estático y configurar GitHub Pages
fix(search): corregir búsqueda de rutas con acentos
chore(deps): actualizar Astro a 7.2.10
docs(wiki): añadir documentación de componentes
```

## Ramas

| Rama | Propósito |
|------|-----------|
| `main` | Producción — rama por defecto en GitHub |
| `dev` | Desarrollo — ramas feature se mergean aquí primero |
| `feat/*` | Features — ramas de trabajo para nuevas funcionalidades |

### Flujo de ramas

```
feat/mi-feature → dev → main
```

1. Crear rama `feat/mi-feature` desde `dev`.
2. Desarrollar y commitear.
3. Merge a `dev` (PR o merge directo).
4. Merge a `main` cuando esté listo para producción.
5. Crear tag `v*` para触发 el release.
