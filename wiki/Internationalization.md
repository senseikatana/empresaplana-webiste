# Internacionalización (i18n)

## Visión general

El sitio soporta **3 idiomas**: catalán (CA), español (ES) e inglés (EN). El idioma por defecto es **catalán**.

## Arquitectura

```
src/config/i18n/
├── ca.json          # Diccionario catalán (575 claves)
├── es.json          # Diccionario español (575 claves)
├── en.json          # Diccionario inglés (575 claves)
└── index.ts         # Motor de i18n (getDictionary, t, getLocale)
```

## Uso en páginas

```astro
---
import { getLocale, getDictionary } from "@/config/i18n";

const locale = getLocale(Astro.url.searchParams.get("lang"));
const dict = getDictionary(locale);
---

<h1>{dict.home.title}</h1>
<p>{dict.common.brand}</p>
```

## Cambio de idioma

El idioma se selecciona vía query parameter `?lang=ca|es|en`:

```astro
{LOCALES.map((lang) => (
  <a href={`${pathname}?lang=${lang}`}>
    {dict.common.lang[lang]}
  </a>
))}
```

## API del módulo i18n

| Función | Descripción |
|---------|-------------|
| `getLocale(value, fallback?)` | Normaliza y valida el locale; devuelve `fallback` si no es válido |
| `getDictionary(locale)` | Devuelve el diccionario completo para un locale |
| `t(locale, key)` | Accede a una clave anidada con notación de puntos (`"home.title"`) |
| `isLocale(value)` | Comprueba si un string es un locale válido |

## Estructura del diccionario

Los diccionarios tienen la misma estructura en los 3 idiomas. Ejemplo de claves principales:

```
common.brand                    → "Empresa Plana"
common.nav.services             → "Serveis discrecionals"
common.nav.locations            → "On som"
common.phone                    → "+34 977 553 680"
home.title                      → "Empresa Plana | Transport públic"
homeVariant1.title              → "Empresa Plana - Inici"
routes.title                    → "Rutes i Horaris"
routes.search.originLabel       → "Localitat d'origen"
routes.results.directTitle      → "Rutes directes"
busTracking.title               → "Seguiment d'autobusos"
busTracking.actions.passed      → "Ha passat"
serviciosDiscretionales.title   → "Serveis discrecionals"
```

## Añadir un nuevo idioma

1. Crear `src/config/i18n/xx.json` copiando `ca.json` como plantilla.
2. Traducir todas las claves manteniendo la estructura.
3. Añadir `"xx"` al array `LOCALES` en `index.ts`.
4. Añadir la clave `common.lang.xx` en los 3 diccionarios existentes.
5. Verificar que `getDictionary` y `t` funcionan con el nuevo locale.

## Añadir una nueva clave

1. Añadir la clave en los 3 archivos JSON (`ca.json`, `es.json`, `en.json`).
2. Usar la clave en el componente con `dict.seccion.clave` o `t(locale, "seccion.clave")`.
3. Verificar que la clave existe en los 3 idiomas (si falta, `t()` devuelve la clave como texto).

## Convenciones

- Las claves usan **camelCase** para nombres y **snake_case** para acciones.
- Los textos largos (políticas legales, descripciones de servicios) están en el diccionario, no hardcodeados.
- Los números de teléfono y URLs van en el diccionario para poder localizarlos.
- El componente `BusTrackingPanel` recibe el diccionario como prop `t` (no importa i18n directamente).
