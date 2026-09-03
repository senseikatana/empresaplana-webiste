# AGENTS.md

Empresa Plana website — transport público de viajeros por carretera en la Costa Daurada.

## Stack

- Astro 7 (static output) + `@astrojs/react` (islands)
- Package manager: **bun** (`bun.lock` present)
- Node >= 22.12
- Styling: **Tailwind CSS v4 build-time** via `@tailwindcss/vite` (no CDN) +
  Geist + Material Symbols. Theme lives in `src/styles/global.css` (`@theme`
  block mirroring `src/assets/DESIGN.md`; brand colors exposed as CSS custom
  properties in `:root`).

## Commands

Run everything from this directory:

- `bun install`
- `bun run dev` — dev server on port 4321
- `bun run build` — builds `dist/` (static HTML + client assets)
- `bun run preview` — serves the production build

## Rendering mode

- `astro.config.mjs` sets `output: "static"`. All pages are pre-rendered at
  build time. No server adapter needed.
- `base: "/"` — deployed to `portfolio.senseikatana.com` (custom subdomain).
- Client-side prefetching is enabled (`prefetch: { prefetchAll: true }`).

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `deep-navy` | `#013990` | Primary brand, headers, nav, footer |
| `coastal-teal` | `#13AEB8` | Secondary accent, links, highlights |
| `energetic-orange` | `#EB8E02` | CTA buttons only (search, book now) |
| `surface-gray` | `#F1F3F5` | Card backgrounds, subtle sections |
| `background` | `#F8F9FA` | Page background |
| `text-main` | `#1A1C1E` | Body text |

Full token reference: `src/assets/DESIGN.md`

## Design system

Canonical tokens live in `src/assets/DESIGN.md` (mirror of the Stitch
"Empresa Plana - Branding" design system). Key facts:

- Brand colors: `deep-navy` `#013990`, `coastal-teal` `#13AEB8`,
  `energetic-orange` `#EB8E02` (CTAs only), background `#f8f9fa`.
- Font: Geist (400/600/700). Radius: `DEFAULT 0.25rem` / `lg 0.5rem` /
  `xl 0.75rem` / `full`. Ambient shadow `0px 4px 20px rgba(1,57,144,0.08)`.
- Spacing tokens: `margin-desktop 48px`, `margin-mobile 16px`, `gutter 24px`,
  `stack-sm/md/lg 8/16/32px`, `container-max 1280px`.

## Structure

- `src/layouts/BaseLayout.astro` — único layout. Owns `<head>` (fonts, Material
  Symbols, shared styles) and `<body>` wrapper. Pages contribute body content
  via `<slot />`.
- `src/pages/` — one folder per section, each with `index.astro`:
  - `/` → home (split hero, variant-2 style)
  - `/rutas-horarios/` → route search & results
  - `/donde-estamos/` → locations & offices
  - `/servicios-discrecionales/` → charter services
  - `/servicios/[slug]/` → individual service detail
  - `/solicitar-presupuesto/` → quote request form
  - `/mobile/` → mobile app landing
  - `/rastreig/` → bus tracking demo
  - `/aviso-legal/` → legal notice
  - `/politica-cookies/` → cookie policy
  - `/politica-privacidad/` → privacy policy
- `src/config/i18n/` — all site copy in `es.json` / `ca.json` / `en.json`.
  Default language: **Spanish (es)**. Routes serve Spanish at root; other
  languages via `?lang=ca` or `?lang=en` query param.
- `src/assets/DESIGN.md` — full design token reference.

## i18n

- Default locale: `es` (Spanish). Served at root `/`.
- Other locales: `ca` (Catalan), `en` (English).
- Switch via `?lang=ca` or `?lang=en` query parameter.
- `src/config/i18n/index.ts` exports `getLocale()`, `getDictionary()`, `t()`.
- `src/config/site-info.ts` exports `getSiteInfo()`, `getCanonicalUrl()`.

## Deployment

- **GitHub Pages** via `.github/workflows/deploy.yml`.
- Custom domain: `portfolio.senseikatana.com` (CNAME in `public/CNAME`).
- DNS: Cloudflare CNAME record `portfolio` → `senseikatana.github.io` (DNS only, no proxy).
- Build output: `dist/` (static HTML).

## Gotchas

- Design tokens live ONLY in `src/styles/global.css` (`@theme`) — add colors,
  spacing, fonts or text sizes there, never ad-hoc `bg-[#...]` values.
- `BaseLayout.astro` imports `../styles/global.css`; do not remove that import
  or styling breaks.
- `astro.config.mjs` must import from `astro/config` (not `astro/defineConfig`)
  and wire `tailwindcss()` from `@tailwindcss/vite` under `vite.plugins`.
- Never commit `.env` (copy from `.env.example` when needed).
- `public/CNAME` must contain `portfolio.senseikatana.com` for GitHub Pages.
