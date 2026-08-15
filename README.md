# Basirah

A modern static Islamic knowledge website for Myanmar Muslims, built with
[Astro](https://astro.build) and deployed to Cloudflare Pages. Content: Surahs
(with recitation audio), Essential Duas, and the Names of Allah — in Arabic,
Burmese, and English.

## Development

Bun is the only supported runtime and package manager.

```bash
bun install
bun run dev       # astro dev
bun run check     # astro check
bun run build     # astro check && astro build
bun run format    # prettier --write .
```

This project is TypeScript-only (no `.js`/`.mjs` files): `astro.config.ts`,
`scripts/*.mts`, `src/content.config.ts`, and `src/**/*.ts`.

## Project structure

- `scripts/` — build-time tooling run via bun (not part of the site).
- `src/scripts/` — client-side scripts bundled into the site by Astro. It
  exists separately because Astro only bundles `<script src>` files that live
  inside `src/`.
- `src/data/` — site helpers imported by components (e.g. `nav.ts`).
- `src/assets/brand/` — brand source SVGs used to generate site assets:
  `icon-maskable.svg` (full-bleed tile for maskable/apple icons),
  `og-image.svg` (social share image source).
- `src/assets/content/` — read-only content data for the collections
  (`essential-surahs/*.json`, `essential-duas/duas.json`,
  `allah-names/names.json`).
- `src/assets/audio/surahs/` — recitation audio; surah pages resolve it with
  `import.meta.glob`, so Astro emits hashed, immutable `/_astro/...` URLs (see
  `public/_headers` for cache rules).

## Content collections

Collections are defined in `src/content.config.ts`. Entry IDs are the
base-relative file names; surah URLs (`/surahs/surah-al-fatihah/`) and the
audio lookup map are derived from the collection `id`, so adding or renaming a
JSON file changes the site's URLs.

## Generated assets

### PWA and brand icons

`bun run generate-pwa-assets` (script: `scripts/generate-pwa-assets.mts`)
regenerates all icons in `public/` from two brand sources:

- `public/favicon.svg` — the rounded brand tile; produces the transparent
  PWA icons (`pwa-64x64.png`, `pwa-192x192.png`, `pwa-512x512.png`) and
  `favicon.ico`.
- `src/assets/brand/icon-maskable.svg` — the full-bleed green tile with the
  gold star; produces `maskable-icon-512x512.png` (Android safe zone) and
  `apple-touch-icon-180x180.png`.

The script uses the `@vite-pwa/assets-generator` API directly because the CLI
applies a single preset to all images and would composite the rounded tile
onto a white background (the old maskable/apple artifacts).

### Social share (OG) image

`public/og-image.png` is rendered from `src/assets/brand/og-image.svg` with
[resvg-js](https://github.com/yisibl/resvg-js) using the static Noto fonts
(Serif, Sans Myanmar, Naskh Arabic) from
<https://github.com/notofonts/noto-fonts>. Variable fonts render at a single
weight in resvg, so the static hinted instances are required:

```bash
bunx --yes @resvg/resvg-js-cli --no-system-font \
  --font-file /path/to/NotoSerif-Regular.ttf \
  --font-file /path/to/NotoSerif-Bold.ttf \
  --font-file /path/to/NotoSansMyanmar-Regular.ttf \
  --font-file /path/to/NotoSansMyanmar-Bold.ttf \
  --font-file /path/to/NotoNaskhArabic-Regular.ttf \
  --font-file /path/to/NotoNaskhArabic-Bold.ttf \
  src/assets/brand/og-image.svg public/og-image.png
```

Font URLs, e.g.:
`https://raw.githubusercontent.com/notofonts/noto-fonts/main/hinted/ttf/NotoSerif/NotoSerif-Bold.ttf`
(substitute `NotoSansMyanmar` and `NotoNaskhArabic` families likewise).
