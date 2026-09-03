# Sistema de diseño

## Fuente de verdad

Los tokens de diseño viven en `src/styles/global.css` (bloque `@theme` de Tailwind v4) y están documentados en `DESIGN.md` (raíz del repo). **Nunca** uses valores `bg-[#...]` ad-hoc; todo pasa por los tokens.

## Colores de marca

| Token | Variable CSS | Hex | Uso |
|-------|-------------|-----|-----|
| `deep-navy` | `--brand-primary` | `#013990` | Color principal, encabezados, navegación |
| `coastal-teal` | `--brand-secondary` | `#13AEB8` | Acentos, enlaces activos, iconografía |
| `energetic-orange` | `--brand-tertiary` | `#EB8E02` | CTAs (botones de acción) |
| `background` | `--brand-neutral` | `#f8f9fa` | Fondo general |

## Superficies

| Token | Hex | Uso |
|-------|-----|-----|
| `surface` | `#f8f9fa` | Fondo de página |
| `surface-container-lowest` | `#ffffff` | Tarjetas, paneles elevados |
| `surface-container-low` | `#f3f4f5` | Fondo de secciones |
| `surface-container` | `#edeeef` | Separadores |
| `surface-container-high` | `#e7e8e9` | Hover states |
| `surface-container-highest` | `#e1e3e4` | Bordes activos |
| `surface-variant` | `#e1e3e4` | Bordes de inputs |

## Colores semánticos

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#002563` | Texto primario sobre fondo claro |
| `on-primary` | `#ffffff` | Texto sobre fondo primario |
| `secondary` | `#00696f` | Texto secundario |
| `error` | `#ba1a1a` | Errores, alertas |
| `error-container` | `#ffdad6` | Fondo de errores |
| `outline` | `#747783` | Texto placeholder |
| `outline-variant` | `#c4c6d4` | Bordes sutiles |

## Tipografía

Fuente: **Geist** (400 / 600 / 700), cargada vía CDN en `global.css`.

| Token | Tamaño | Line-height | Peso | Uso |
|-------|--------|-------------|------|-----|
| `display-lg` | 48px | 56px | 700 | Títulos hero |
| `headline-lg` | 32px | 40px | 700 | Títulos de sección |
| `headline-lg-mobile` | 24px | 32px | 700 | Títulos en móvil |
| `headline-md` | 24px | 32px | 600 | Subtítulos |
| `body-lg` | 18px | 28px | 400 | Texto destacado |
| `body-md` | 16px | 24px | 400 | Texto general |
| `label-md` | 14px | 20px | 600 | Etiquetas, badges |
| `button` | 16px | 16px | 600 | Texto de botones |

## Espaciado

| Token | Valor | Uso |
|-------|-------|-----|
| `container-max` | 1280px | Ancho máximo del contenido |
| `gutter` | 24px | Espacio entre columnas |
| `margin-desktop` | 48px | Margen lateral en desktop |
| `margin-mobile` | 16px | Margen lateral en móvil |
| `stack-sm` | 8px | Espacio vertical pequeño |
| `stack-md` | 16px | Espacio vertical mediano |
| `stack-lg` | 32px | Espacio vertical grande |

## Bordes y radios

| Token | Valor |
|-------|-------|
| `DEFAULT` | 0.25rem |
| `lg` | 0.5rem |
| `xl` | 0.75rem |
| `full` | 9999px |

## Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `ambient` | `0px 4px 20px rgba(1,57,144,0.08)` | Sombra suave para tarjetas |

## Clases utilitarias compartidas

Definidas en `global.css`:

| Clase | Efecto |
|-------|--------|
| `.ambient-shadow` | Aplica la sombra ambient |
| `.glass-panel` | Fondo semitransparente con blur |
| `.bg-pattern` | Patrón de puntos radial |
| `.material-symbols-outlined` | Configuración base de Material Symbols |
| `.icon-filled` / `.icon-fill` | Variante rellena de iconos |

## Iconos

Se usa **Material Symbols** de Google, cargado vía `<link>` en `BaseLayout.astro`:

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
```

Uso en Astro:
```astro
<span class="material-symbols-outlined">directions_bus</span>
```
