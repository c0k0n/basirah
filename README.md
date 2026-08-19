# Basirah — بَصِيرَة

> Islamic knowledge for Myanmar Muslims: selected Qur'an surahs with recitation audio, essential duas, and the Names of Allah in Burmese, English, and Arabic.

[![Live site](https://img.shields.io/badge/live-basirah.pages.dev-10b981?style=flat-square&logo=cloudflare-pages&logoColor=white)](https://basirah.pages.dev)
[![Astro 7.2.3](https://img.shields.io/badge/Astro-7.2.3-ff5d01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Bun](https://img.shields.io/badge/Bun-fbf0df?style=flat-square&logo=bun&logoColor=black)](https://bun.sh)
[![License: MIT](https://img.shields.io/badge/license-MIT-3da639?style=flat-square&logo=opensourceinitiative&logoColor=white)](LICENSE)

## Overview

Basirah is a static Astro website for Myanmar Muslims. Burmese is the primary interface language, with English translations/transliterations and Arabic source text where relevant. The site currently contains selected Qur'an surahs, essential duas, and the Names of Allah.

The project is intentionally small and framework-free on the client: Astro renders the pages to HTML, CSS is written as vanilla CSS, and only a few components ship browser JavaScript for required interactions.

## Current content

The content files under `src/assets/content/` are read-only project data. Their structure is validated through Astro Content Collections and Zod schemas in `src/content.config.ts`.

| Collection     | Source                     | Current items |
| -------------- | -------------------------- | ------------: |
| Surahs         | `essential-surahs/*.json`  |            46 |
| Essential duas | `essential-duas/duas.json` |            18 |
| Names of Allah | `allah-names/names.json`   |           100 |

The 46 selected surahs begin with Al-Fatihah (1) and include selected surahs through An-Nas (114); they are not a continuous range. The exact selected numbers are defined by the JSON metadata and are used to generate the routes.

Each surah includes metadata, a canonical Bismillah object, and verses with Arabic text, English translation, Burmese translation, and Burmese transliteration. Optional verse notes and prostration-verse metadata are supported by the schema when present in the data.

Each dua includes Burmese and English titles, Arabic text, Burmese pronunciation, and Burmese and English meanings.

Each Name of Allah includes Arabic, transliteration, English meaning, Burmese meaning, and Burmese transliteration.

There are 46 `.opus` recitation files in `src/assets/audio/surahs/`. The Surah detail route maps audio files to surahs by filename and imports them through Astro/Vite so the production URLs are emitted as hashed build assets.

## Features

- Static home, collection, detail, 404, and 500 pages.
- 46 selected Surah pages with metadata, translations, transliterations, verses, navigation, structured data, and recitation audio where the matching asset exists.
- Search/filter interfaces for Surahs, duas, and the Names of Allah.
- Native HTML audio controls wrapped by a small custom play/pause, seek, and time-display interface.
- Responsive navigation with a mobile menu.
- Light and dark themes using the system preference by default and a persistent header toggle.
- Material Symbols Outlined icons supplied through Astro's Fonts API and configured glyph subsets.
- Static Web App Manifest linked from the shared layout. No PWA plugin, Workbox bundle, service worker, or offline cache is shipped.
- Burmese, English, and Arabic typography using Astro-managed Google font providers and `:lang()` CSS selectors.
- Skip link, landmarks, visible focus styles, labels, live filter feedback, reduced-motion support, semantic lists/tables/details, and responsive layouts.
- Page titles, descriptions, canonical URLs for indexable pages, `hreflang`, Open Graph metadata, Twitter card metadata, XML sitemap, and JSON-LD on the main content pages.
- Cloudflare-oriented headers, redirects, cache rules, robots policy, and deployment workflow.

## Technology

| Area                        | Current implementation                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Framework                   | Astro `7.2.3`, static output                                                                                            |
| Language                    | TypeScript and Astro components                                                                                         |
| Runtime and package manager | Bun only                                                                                                                |
| Styling                     | Vanilla CSS in four files under `src/styles/`                                                                           |
| Client JavaScript           | Small scripts in Astro components; no React, Vue, Svelte, or other UI framework                                         |
| Content                     | Astro Content Collections with `glob()` and `file()` loaders plus Zod schemas                                           |
| Fonts and icons             | Astro Fonts API with Google and Google Icons providers                                                                  |
| Sitemap                     | `@astrojs/sitemap`                                                                                                      |
| Hosting                     | Cloudflare Pages at `https://basirah.pages.dev`                                                                         |
| Installability              | Static `public/manifest.webmanifest`; no service worker/offline runtime                                                 |
| Formatting                  | Prettier with `prettier-plugin-astro`                                                                                   |
| Automated tests             | No test framework is configured; `astro check`, formatting, and the production build are the current verification gates |

## Architecture

Astro renders the site as static HTML. There are no framework hydration directives or framework components. Interactive behavior is limited to the components that need it:

- `AudioPlayer.astro` controls audio playback and seeking.
- `ListFilter.astro` filters rendered lists and updates an accessible live region.
- `Header.astro` controls the responsive navigation and removes stale service-worker registrations/cache names left by previous deployments.
- `ThemeToggle.astro` stores the user's light/dark preference and updates the document theme and theme-color metadata.

The shared `Layout.astro` provides the document shell, metadata, fonts, manifest link, header, footer, skip link, and main landmark. `src/site.config.ts` is a small project-owned module for the shared title, description, and navigation links; it is not an Astro-required file.

## Project structure

```text
basirah/
├── public/
│   ├── _headers                 # Cloudflare response headers and cache rules
│   ├── _redirects               # Cloudflare static URL rewrites for sitemap aliases
│   ├── robots.txt               # Crawler policy and sitemap location
│   ├── manifest.webmanifest     # Static Web App Manifest
│   ├── favicon.svg / favicon.ico
│   ├── apple-touch-icon-180x180.png
│   ├── pwa-*.png / maskable-icon-512x512.png
│   └── og-image.png             # Open Graph image
├── src/
│   ├── assets/
│   │   ├── audio/surahs/        # 46 read-only .opus files
│   │   └── content/             # Read-only JSON content data
│   ├── components/
│   │   ├── AudioPlayer.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── JsonLd.astro
│   │   ├── ListFilter.astro
│   │   ├── PageHeader.astro
│   │   ├── SurahCard.astro
│   │   └── ThemeToggle.astro
│   ├── layouts/Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── 500.astro
│   │   ├── surahs/index.astro
│   │   ├── surahs/[surah].astro
│   │   ├── duas/index.astro
│   │   ├── duas/[dua].astro
│   │   └── names-of-allah/index.astro
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── components.css
│   │   └── content.css
│   ├── content.config.ts        # Loaders and collection schemas
│   └── site.config.ts           # Site metadata and navigation data
├── astro.config.ts              # Static output, sitemap, fonts, and icons
├── package.json
├── bun.lock
├── tsconfig.json
├── .github/workflows/deploy.yml # Bun build and Cloudflare Pages deployment
└── LICENSE
```

Generated directories such as `.astro/` and `dist/` are not source code and are ignored by Git.

## Local development

Prerequisite: install [Bun](https://bun.sh/). Do not use npm, pnpm, or yarn for this repository.

```sh
bun install
bun run dev
```

Available scripts:

| Command                   | Purpose                                                      |
| ------------------------- | ------------------------------------------------------------ |
| `bun run dev`             | Start the Astro development server                           |
| `bun run check`           | Run `astro check` for generated types and diagnostics        |
| `bun run build`           | Run `astro check` and create the production build in `dist/` |
| `bun run preview`         | Preview the production build locally                         |
| `bun run format`          | Format the repository with Prettier                          |
| `bun run format:check`    | Check formatting without changing files                      |
| `bun run sync`            | Refresh Astro content-layer types                            |
| `bun run astro -- <args>` | Run the Astro CLI through Bun                                |

Before submitting changes, run:

```sh
bun run format:check
bun run check
bun run build
```

## Deployment

The repository currently deploys to Cloudflare Pages through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) whenever changes are pushed to `main`, or when the workflow is manually dispatched.

The workflow:

1. Checks out the repository.
2. Installs Bun `1.3.14`.
3. Runs `bun install --frozen-lockfile`.
4. Runs `bun run build`.
5. Deploys `dist/` with `bunx wrangler@latest pages deploy dist --project-name=basirah`.

The workflow requires the GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

The build is static. The custom `404.astro` and `500.astro` pages are emitted as `404.html` and `500.html`; Cloudflare's handling of actual platform/origin 5xx responses is separate from static file routing. A real branded 5xx response requires Cloudflare Custom Error Rules or a server/runtime response, not `_redirects` alone.

## Public Cloudflare files

- `public/_headers` sets security headers, the Content Security Policy, hashed Astro-asset caching, HTML caching, and manifest caching. The CSP currently permits the inline behavior used by the site and Cloudflare Web Analytics endpoints.
- `public/_redirects` rewrites `/sitemap.xml` and `/sitemap-index.html` to the generated `/sitemap-index.xml` with status `200`.
- `public/robots.txt` allows normal crawling, disallows `/cdn-cgi/`, and points crawlers to the generated sitemap. It does not disallow the site's hashed CSS, JavaScript, fonts, or audio assets.
- `public/manifest.webmanifest` describes the site's name, language, colors, scope, display mode, categories, and install icons. It does not provide offline behavior by itself.

## Content and code rules

- Treat `src/assets/content/**` as read-only unless a content change has been explicitly reviewed.
- Do not modify the Qur'anic, Arabic, Burmese, or English content casually; accuracy and Unicode integrity matter.
- Keep source code in `src/` so Astro can process and bundle it. Use `public/` for files that must be copied unchanged.
- Use Bun for installation, scripts, checks, builds, and deployment commands.
- Prefer native Astro and browser APIs over new dependencies or framework layers.
- Keep interactive behavior local to the Astro component that owns it.
- Re-run formatting, `astro check`, and the production build after changes.

## Known boundaries

- The site is not a full Astro i18n route-based site. It uses Burmese as the document language and marks embedded English and Arabic content with language attributes.
- The site does not use Astro View Transitions or `<ClientRouter />`; navigation remains normal browser navigation.
- There is no authentication, database, server API, service worker, offline cache, or client UI framework.
- There is no automated test suite yet. Content validation and production build checks are the current automated safeguards.

## License

[MIT](LICENSE) © 2026 c0k0n.

The Qur'anic text and translations are presented for educational purposes; the project does not claim copyright over sacred texts themselves.

— Basirah — بَصِيرَة — insight, clarity, and light.
