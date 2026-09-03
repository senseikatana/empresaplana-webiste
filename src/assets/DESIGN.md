# Empresa Plana — Design System

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `deep-navy` | `#013990` | Primary brand, headers, nav, footer |
| `coastal-teal` | `#13AEB8` | Secondary accent, links, highlights |
| `energetic-orange` | `#EB8E02` | CTA buttons only (search, book now) |
| `surface-gray` | `#F1F3F5` | Card backgrounds, subtle sections |
| `background` | `#F8F9FA` | Page background |
| `text-main` | `#1A1C1E` | Body text |

## Surface Palette

| Token | Hex | Role |
|-------|-----|------|
| `surface` | `#F8F9FA` | Base surface |
| `surface-dim` | `#D9DADB` | Muted surface |
| `surface-bright` | `#F8F9FA` | Bright surface |
| `surface-container-lowest` | `#FFFFFF` | Cards, elevated panels |
| `surface-container-low` | `#F3F4F5` | Subtle containers |
| `surface-container` | `#EDEEEF` | Default containers |
| `surface-container-high` | `#E7E8E9` | Emphasized containers |
| `surface-container-highest` | `#E1E3E4` | Top-level containers |
| `surface-variant` | `#E1E3E4` | Borders, dividers |
| `outline` | `#747783` | Icons, secondary text |
| `outline-variant` | `#C4C6D4` | Subtle borders |

## Primary Scale

| Token | Hex | Role |
|-------|-----|------|
| `primary` | `#002563` | Dark navy (active states) |
| `on-primary` | `#FFFFFF` | Text on primary |
| `primary-container` | `#013990` | Main brand container |
| `on-primary-container` | `#87A8FF` | Light accent on dark |
| `inverse-primary` | `#B2C5FF` | Inverse theme primary |
| `primary-fixed` | `#DAE2FF` | Fixed light primary |
| `primary-fixed-dim` | `#B2C5FF` | Fixed dim primary |

## Secondary Scale

| Token | Hex | Role |
|-------|-----|------|
| `secondary` | `#00696F` | Teal dark (hover states) |
| `on-secondary` | `#FFFFFF` | Text on secondary |
| `secondary-container` | `#78F5FF` | Teal container |
| `on-secondary-container` | `#007076` | Text on teal container |
| `secondary-fixed` | `#78F5FF` | Fixed teal |
| `secondary-fixed-dim` | `#57D8E2` | Fixed dim teal |

## Tertiary Scale (CTAs)

| Token | Hex | Role |
|-------|-----|------|
| `tertiary` | `#3F2200` | Dark orange |
| `on-tertiary` | `#FFFFFF` | Text on tertiary |
| `tertiary-container` | `#5D3500` | Orange container |
| `on-tertiary-container` | `#F3940F` | Bright orange accent |
| `tertiary-fixed` | `#FFDCBD` | Fixed light orange |
| `tertiary-fixed-dim` | `#FFB86D` | Fixed dim orange |

## Error

| Token | Hex | Role |
|-------|-----|------|
| `error` | `#BA1A1A` | Error state |
| `on-error` | `#FFFFFF` | Text on error |
| `error-container` | `#FFDAD6` | Error container |
| `on-error-container` | `#93000A` | Text on error container |

## Typography

- **Font family:** Geist (400, 600, 700)
- **Display LG:** 48px / 56px / -0.02em / 700
- **Headline LG:** 32px / 40px / 700
- **Headline LG Mobile:** 24px / 32px / 700
- **Headline MD:** 24px / 32px / 600
- **Body LG:** 18px / 28px / 400
- **Body MD:** 16px / 24px / 400
- **Label MD:** 14px / 20px / 0.05em / 600
- **Button:** 16px / 16px / 0.02em / 600

## Spacing

| Token | Value |
|-------|-------|
| `container-max` | 1280px |
| `gutter` | 24px |
| `margin-mobile` | 16px |
| `margin-desktop` | 48px |
| `stack-sm` | 8px |
| `stack-md` | 16px |
| `stack-lg` | 32px |

## Elevation

- **Ambient shadow:** `0px 4px 20px rgba(1, 57, 144, 0.08)`
- **Glass panel:** `background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border: 1px solid rgba(196,198,212,0.2)`

## Border Radius

- **Default:** `0.25rem` (4px)
- **Large:** `0.5rem` (8px)
- **XL:** `0.75rem` (12px)
- **Full:** `9999px`

## Icons

- **Icon set:** Material Symbols Outlined
- **Variation settings:** `FILL 0, wght 400, GRAD 0, opsz 24`
- **Filled variant:** `FILL 1` (class `.icon-filled` or `.icon-fill`)

## Layout Principles

- **Max width:** 1280px centered
- **Desktop margins:** 48px
- **Mobile margins:** 16px
- **Grid gutter:** 24px
- **Sticky nav:** top-0, z-50, shadow-sm
- **Footer:** full-width, primary background, on-primary text
