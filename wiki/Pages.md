# Páginas

## Mapa de rutas

El sitio tiene **29 páginas** compiladas como HTML estático. Todas las rutas incluyen el prefijo `/empresaplana-website/`.

### Páginas principales

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `src/pages/index.astro` | Página principal con hero, buscador y líneas populares |
| `/rutas-horarios` | `src/pages/rutas-horarios.astro` | Buscador de rutas y horarios con resultados |
| `/rutas-horarios-sin-resultados` | `src/pages/rutas-horarios-sin-resultados.astro` | Estado vacío del buscador |
| `/servicios-discrecionales` | `src/pages/servicios-discrecionales.astro` | Catálogo de servicios discrecionales |
| `/servicios/[slug]` | `src/pages/servicios/[slug].astro` | Detalle de un servicio (8 slugs) |
| `/donde-estamos` | `src/pages/donde-estamos.astro` | Localización de oficinas y puntos de venta |
| `/rastreig` | `src/pages/rastreig.astro` | Panel de seguimiento de buses |
| `/solicitar-presupuesto` | `src/pages/solicitar-presupuesto.astro` | Formulario de solicitud de presupuesto |
| `/solicitud-confirmada` | `src/pages/solicitud-confirmada.astro` | Confirmación de solicitud enviada |

### Páginas legales

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/aviso-legal` | `src/pages/aviso-legal.astro` | Aviso legal |
| `/aviso-legal-variante` | `src/pages/aviso-legal-variante.astro` | Variante del aviso legal |
| `/politica-privacidad` | `src/pages/politica-privacidad.astro` | Política de privacidad |
| `/politica-cookies` | `src/pages/politica-cookies.astro` | Política de cookies |

### Variantes de diseño

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/home-variant-1` | `src/pages/home-variant-1.astro` | Variante 1 de la página principal |
| `/home-variant-2` | `src/pages/home-variant-2.astro` | Variante 2 de la página principal |
| `/mobile` | `src/pages/mobile.astro` | Versión móvil de la página principal |
| `/screens` | `src/pages/screens.astro` | Índice de todas las pantallas/variantes |
| `/marketing-kit` | `src/pages/marketing-kit.astro` | Kit de marketing |

### Páginas móviles (redirecciones)

| Ruta | Redirige a |
|------|-----------|
| `/donde-estamos-mobile` | — (página propia) |
| `/donde-estamos-mobile-app` | `/donde-estamos-mobile` |
| `/donde-estamos-oficina-seleccionada` | `/donde-estamos` |
| `/rutas-horarios-mobile-app` | `/rutas-horarios` |
| `/servicios-discrecionales-mobile-app` | `/servicios-discrecionales` |

### Servicios (rutas dinámicas)

| Slug | Servicio |
|------|----------|
| `servicios-a-empreses-i-fabriques` | Servicios a empresas y fábricas |
| `viajes-fin-de-curso` | Viajes de fin de curso |
| `comidas-y-celebraciones` | Bodas y celebraciones |
| `autocares-adaptados` | Autocares adaptados |
| `transfers` | Transfers aeropuerto-hotel |
| `transporte-escolar` | Transporte escolar |
| `transportes-discrecionales` | Transportes discrecionales |

## Layout

Todas las páginas usan `BaseLayout.astro` como layout principal, que proporciona:
- `<head>` completo (meta tags, OG, canonical, Material Symbols)
- Importación de `global.css` (Tailwind + tokens de diseño)
- `<body>` con clase configurable via prop `bodyClass`
- `<slot />` para el contenido de la página

## Internacionalización

Las páginas principales soportan los 3 idiomas (CA/ES/EN) vía query param `?lang=`. Las páginas legales y de servicios usan contenido del diccionario i18n.
