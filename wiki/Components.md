# Componentes

## Catálogo

El proyecto tiene **8 componentes Astro** en `src/components/`:

| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| **BusTrackingPanel** | `BusTrackingPanel.astro` | Panel de seguimiento de buses con reportes y reseñas |
| **LegalPolicy** | `LegalPolicy.astro` | Páginas de política legal (privacidad, cookies, aviso legal) |
| **QuoteForm** | `QuoteForm.astro` | Formulario de solicitud de presupuesto |
| **RouteAccordion** | `RouteAccordion.astro` | Acordeón de resultados de ruta directa |
| **ServiceDetail** | `ServiceDetail.astro` | Página de detalle de un servicio discrecional |
| **ThroughAccordion** | `ThroughAccordion.astro` | Acordeón de rutas con conexión (mismo bus) |
| **TownSelect** | `TownSelect.astro` | Selector de municipio con icono y lista de paradas |
| **TransferAccordion** | `TransferAccordion.astro` | Acordeón de rutas con transbordo |

---

## BusTrackingPanel

**Archivo:** `src/components/BusTrackingPanel.astro`

Panel interactivo de seguimiento de buses. Originalmente era un componente React (`.tsx`), convertido a Astro vanilla con `<script define:vars>`.

**Props:**
| Prop | Tipo | Descripción |
|------|------|-------------|
| `lineId` | `string` | Identificador de la línea |
| `lineLabel` | `string` | Nombre visible de la línea |
| `stops` | `StopInfo[]` | Lista de paradas `{id, name, time}` |
| `t` | `BusTracking` | Diccionario i18n de seguimiento |

**Funcionalidad:**
- Selector de parada
- 6 botones de reporte (pasado, puntual, retrasado, adelantado, no pasado, cancelado)
- Campo de minutos de retraso (visible solo para "retrasado"/"adelantado")
- Campo de comentario
- Barra de escalación (cuando se supera el umbral de reportes negativos)
- Formulario de reseña con estrellas (1-5)

**Nota:** En modo estático, los reportes y reseñas no persisten (las llamadas a `/api/bus-tracking/*` fallan silenciosamente).

---

## QuoteForm

**Archivo:** `src/components/QuoteForm.astro`

Formulario de solicitud de presupuesto con campos de contacto y servicio.

**Datos:** Importa `QUOTE_FORM` desde `@/data` (estructura definida en `src/data/presupuesto.json`).

**Campos del formulario:**
- Contacto: nombre, email, teléfono, empresa
- Servicio: motivo (desplegable), descripción, ciudad/día/hora de salida y llegada, número de personas
- Consentimiento de privacidad + reCAPTCHA (visual, no funcional en estático)

---

## TownSelect

**Archivo:** `src/components/TownSelect.astro`

Selector desplegable de municipios con icono de Material Symbols.

**Props:**
| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `name` | `string` | — | Nombre del campo del formulario |
| `placeholder` | `string` | — | Texto del placeholder |
| `defaultValue` | `string` | — | Valor preseleccionado |
| `icon` | `string` | `"location_on"` | Icono de Material Symbols |

**Datos:** Importa `STOPS` desde `@/data/towns` (129 municipios de `src/data/stops.json`).

---

## RouteAccordion / TransferAccordion / ThroughAccordion

Tres componentes de acordeón para los resultados de búsqueda de rutas:

- **RouteAccordion:** Rutas directas (origen → destino en la misma línea).
- **TransferAccordion:** Rutas con transbordo (línea A → hub → línea B).
- **ThroughAccordion:** Rutas con conexión (mismo bus, cambio de línea en una parada compartida).

Cada uno recibe su resultado (`LineSummary`, `TransferOption`, `ThroughJourney`) y el diccionario `t` de resultados.

---

## ServiceDetail

**Archivo:** `src/components/ServiceDetail.astro`

Página de detalle de un servicio discrecional. Recibe el contenido del servicio como props spread.

**Props:** `title`, `tagline`, `sectionTitle`, `body[]`, `imageUrl`, `imageCaption`, `canonicalUrl`.

---

## LegalPolicy

**Archivo:** `src/components/LegalPolicy.astro`

Renderiza páginas de política legal (aviso legal, privacidad, cookies). Recibe el contenido desde el diccionario i18n.
