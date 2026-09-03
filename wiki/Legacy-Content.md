# Contenido del sitio antiguo

## Origen

Los 10 archivos Markdown en `src/config/` fueron extraídos del sitio web original de Empresa Plana (`empresaplana.cat`) mediante **Firecrawl** el 3 de septiembre de 2026.

## Inventario de archivos

| Archivo | URL original | Idioma | Contenido |
|---------|-------------|--------|-----------|
| `empresaplana.cat_.md` | `https://empresaplana.cat/` | ES | Inicio |
| `www.empresaplana.cat_ca.md` | `https://www.empresaplana.cat/ca` | CA | Inicio |
| `www.empresaplana.cat_en.md` | `https://www.empresaplana.cat/en` | EN | Inicio |
| `www.empresaplana.cat_ca_cercador-de-linies.md` | `https://www.empresaplana.cat/ca/cercador-de-linies` | CA | Buscador de líneas |
| `www.empresaplana.cat_ca_empresa-plana.md` | `https://www.empresaplana.cat/ca/empresa-plana` | CA | Empresa (sobre nosotros) |
| `www.empresaplana.cat_ca_presupuesto.md` | `https://www.empresaplana.cat/ca/presupuesto` | CA | Formulario de presupuesto |
| `www.empresaplana.cat_en_presupuesto.md` | `https://www.empresaplana.cat/en/presupuesto` | EN | Formulario de presupuesto |
| `www.empresaplana.cat_ca_serveis-discrecionals_2_serveis-a-empreses-i-fabriques.md` | `https://www.empresaplana.cat/ca/serveis-discrecionals/2/serveis-a-empreses-i-fabriques` | CA | Servicio: empresas y fábricas |
| `www.empresaplana.cat_servicios-discrecionales_5_viajes-fin-de-curso.md` | `https://www.empresaplana.cat/servicios-discrecionales/5/viajes-fin-de-curso` | ES | Servicio: viajes fin de curso |
| `www.empresaplana.cat_servicios-discrecionales_9_comidas-y-celebraciones.md` | `https://www.empresaplana.cat/servicios-discrecionales/9/comidas-y-celebraciones` | ES | Servicio: bodas y celebraciones |

## Contenido extraído

### Datos clave documentados

- **8 líneas más buscadas** con origen/destino y URLs de PDF.
- **129 localidades** del buscador de líneas.
- **Teléfonos de contacto:** +34 977 54 04 93 (Tarragona), +34 663 854 611 (Barcelona/Garraf), +34 977 55 36 80 (general).
- **Redes sociales:** Facebook, Twitter/X, YouTube, Instagram, WhatsApp.
- **Certificaciones ISO** 9001, 14001, UNE-EN 13816, 45001, 39001.
- **Financiación NextGenerationEU** (Plan de Recuperación, Transformación y Resiliencia).
- **Aviso de patinetes eléctricos** (prohibición desde 01/02/2023, sanción 200 €).
- **Formulario de presupuesto** con 13 campos y 5 motivos.
- **3 servicios discrecionales** detallados (empresas, fin de curso, celebraciones).

### Documento Word

El contenido completo se documentó en un documento Word:

```
docs/empresa-plana-contenido-web.docx
```

Generado con `scripts/generate-doc.mjs` (requiere `docx` como devDependency).

## Características de los archivos

- **Frontmatter:** Cada archivo tiene `url` y `title` en el frontmatter YAML.
- **Ruido de Firecrawl:** Los archivos incluyen banners de cookies repetidos, estilos HTML inline y scripts de reCAPTCHA. Este ruido se filtró durante la documentación.
- **Contenido multilingüe:** Los 3 idiomas están representados (CA, ES, EN).
- **No se usan en el código:** Estos archivos no se importan en ningún componente o página. Son referencia documental.

## Uso

Estos archivos sirven como:

1. **Referencia de contenido** para la redacción del nuevo sitio.
2. **Inventario de datos** (teléfonos, URLs, líneas, localidades).
3. **Auditoría de contenido** para verificar que no se pierda información en la migración.
4. **Base para el documento Word** de documentación completa.

## Limpieza futura

Cuando el contenido esté completamente migrado al nuevo sitio (i18n, datos JSON, páginas), estos archivos pueden eliminarse del repositorio. El documento Word en `docs/` preserva la información de forma permanente.
