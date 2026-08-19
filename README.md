# Basirah — بَصِيرَة

> **Islamic knowledge for Myanmar Muslims.** Qur'an surahs with recitation audio, essential duas, and the Names of Allah — presented faithfully in **Burmese, English, and Arabic**.

[![Live site](https://img.shields.io/badge/live-basirah.pages.dev-10b981?style=flat-square&logo=cloudflare-pages&logoColor=white)](https://basirah.pages.dev)
[![Astro](https://img.shields.io/badge/Astro-7.2-ff5d01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Bun](https://img.shields.io/badge/Bun-fbf0df?style=flat-square&logo=bun&logoColor=black)](https://bun.sh)
[![PWA](https://img.shields.io/badge/PWA-✓-5a67d8?style=flat-square&logo=pwa&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License: MIT](https://img.shields.io/badge/license-MIT-3da639?style=flat-square&logo=opensourceinitiative&logoColor=white)](LICENSE)

---

## Table of contents

- [What is Basirah?](#what-is-basirah)
- [The story so far](#the-story-so-far)
- [Features](#features)
- [Content](#content)
  - [Surahs (46)](#surahs)
  - [Essential duas (18)](#essential-duas)
  - [The Names of Allah (100)](#the-names-of-allah)
  - [Recitation audio](#recitation-audio)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Deployment](#deployment)
- [Notes & lessons learned](#notes--lessons-learned)
- [Accessibility, SEO & performance](#accessibility-seo--performance)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## What is Basirah?

Basirah (بَصِيرَة, "insight" or "clear perception") is a small, lovingly built **static website** that gathers foundational Islamic knowledge in one calm, beautiful place — designed first and foremost for **Myanmar Muslims**, and written so that anyone can benefit.

The site is **trilingual by design**:

- **Burmese (မြန်မာ)** — the primary language of the interface and explanations, in a clear, warm Burmese voice.
- **English** — translations and transliterations for readers who think in English.
- **Arabic** — the original Qur'anic text and Arabic script, always presented with the accuracy it deserves.

Everything is free, public, and meant to be shared. No accounts, no tracking beyond Cloudflare's privacy-respecting Web Analytics, no noise. Just knowledge, presented with care.

> The site used to be called **Hikmah** (حِكْمَة, "wisdom") — a name we still love. Basirah felt truer to where the project is going: not just collecting knowledge, but helping people _see_ it clearly.

## The story so far

This project began in **July 2026** as a personal effort — building something useful for the Myanmar Muslim community. From the first commit (searchable pages for surahs and the Names of Allah) to today, the journey has been one of continuous, humble refinement:

1. **Content first** — JSON files for surahs, duas, and the Names of Allah, each translated into Burmese and English with Arabic originals.
2. **Bilingual & accessible** — Burmese translations everywhere, proper multilingual typography, keyboard-friendly navigation, semantic HTML.
3. **Brand & PWA** — renamed from Hikmah to Basirah, custom generated icons, installable as an app, dark/light themes.
4. **Hardening** — security headers, Content Security Policy, SEO passes, JSON-LD structured data, canonical URLs, and a strict content-validation layer.
5. **Quality passes** — accessibility audits, semantic markup refactors, and the content-integrity work described below (canonical Bismillah, schema guards, and more).

Today the site is **deployed on Cloudflare Pages**, passes `astro check` with zero errors, and ships a fully static build — every page pre-rendered, fast, and crawlable.

## Features

- **46 Qur'an surahs** — from Al-Fātiḥah through Al-Bayyinah — each with Arabic text, English and Burmese translations, Burmese transliteration, metadata (revelation place & order, meaning of the title), and a **recitation audio player** (46 high-quality `.opus` files, one per surah).
- **18 essential duas** — everyday supplications with Arabic, Burmese pronunciation, and both Burmese and English meanings, filterable and searchable.
- **100 Names of Allah** — a beautifully formatted, searchable table from Allāh (اللَّه) to Aṣ-Ṣabūr (الصَّبُورُ), each with transliteration and bilingual meanings.
- **Instant search & filter** — a lightweight, dependency-free filter with _folded-text matching_: it unifies Arabic letter variants and ignores diacritics, so a search "just works" even when the user's keyboard input isn't perfectly normalized. No JavaScript framework needed.
- **Recitation audio** — an accessible custom audio player (play/pause, seek, time display) with hashed, immutably-cached audio files for fast repeat visits.
- **PWA** — installable, with a web app manifest in Burmese (`lang: "my"`), auto-updating service worker, offline app-shell caching, and theme-aware icons.
- **Light & dark themes** — a warm "paper & emerald & gold" light theme and a deep green-black dark theme, respecting `prefers-color-scheme` with a manual toggle, with a flash-of-wrong-theme guard.
- **Bilingual typography done properly** — Noto Serif/Sans Myanmar, Noto Naskh Arabic, and Latin serif/sans stacks, each applied via `:lang()` selectors so every script renders beautifully.
- **Accessibility** — skip links, ARIA labels and live regions, visible focus states, `prefers-reduced-motion` support, and semantic HTML throughout.
- **SEO & structured data** — canonical URLs, hreflang, Open Graph & Twitter cards, XML sitemap, and JSON-LD (`WebSite`, `CollectionPage`/`ItemList`, `WebPage`, and per-surah `audio` entities).
- **Security** — strict Content Security Policy, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, and a `robots.txt` that welcomes search engines and other crawlers alike (while politely excluding the heavy media folder).

## Content

All content lives in **`src/assets/content/`** and is treated as **read-only data** — it is the source of truth, never generated or transformed at build time. Three collections are defined in `src/content.config.ts` using Astro's **Content Collections API** with **Zod schema validation**:

| Collection | Source                                         | Items | Loader                   |
| ---------- | ---------------------------------------------- | ----- | ------------------------ |
| `surahs`   | `essential-surahs/*.json` (one file per surah) | 46    | `glob()`                 |
| `duas`     | `essential-duas/duas.json`                     | 18    | `file()` + custom parser |
| `names`    | `allah-names/names.json`                       | 100   | `file()` + custom parser |

### Surahs

Each `surah-*.json` file has three parts:

- **`bismillah`** — the Bismillah in Arabic plus English translation, Burmese translation, and Burmese transliteration. This is **canonical**: a `superRefine` guard in the schema enforces that all 46 files carry the exact same values. If a new surah file is added with a different Bismillah rendering, `astro check` fails with a helpful message pointing to the file — no accidental variants, ever.
- **`surah_metadata`** — surah number, Arabic name, transliteration, Burmese title, the meaning of the title (English + Burmese), revelation place (English + Burmese), revelation order, total verse count, and a Burmese summary. The schema also supports an optional **prostration marker** (`prostration_verse`) — currently unused by the data, but ready.
- **`verses`** — an array of verse objects, each with `verse_number`, Arabic, English translation, Burmese translation, Burmese transliteration, and an optional `note`.

### Essential duas

A single `duas.json` file: 18 everyday supplications (morning and evening remembrances, protection, gratitude, forgiveness, and more), each with Arabic text, **Burmese pronunciation** (so readers can recite correctly even if they haven't mastered Arabic script), and meanings in both Burmese and English.

### The Names of Allah

`names.json` — a table of 100 entries, from **Allāh (اللَّه)** to **Aṣ-Ṣabūr (الصَّبُورُ)**, each with Arabic, transliteration, English meaning, Burmese meaning, and Burmese transliteration. (Yes — the collection lists 100 entries, beginning with the name of Allāh Himself; the famous tradition of the 99 Names is what inspired it.)

### Recitation audio

46 `.opus` files in `src/assets/audio/surahs/`, one per surah, matched 1:1 by filename. They're bundled via `import.meta.glob` and emitted as **hashed, immutable assets** — perfect for caching and kind to repeat visitors. Together they weigh about 53 MB.

## Tech stack

| Concern                   | Choice                                               | Why                                                                                                                                       |
| ------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Framework                 | **Astro 7** (static output)                          | Content-focused, zero client-side weight by default, best-in-class content collections                                                    |
| Language                  | **TypeScript** (strict + `noUncheckedIndexedAccess`) | Type safety for content and code alike                                                                                                    |
| Runtime / package manager | **Bun**                                              | Fast, modern, single-tool workflow                                                                                                        |
| Styling                   | **Vanilla CSS** (4 files, design tokens)             | No framework tax; full control; tiny output                                                                                               |
| Client JS                 | **Small vanilla scripts**                            | No React/Vue/etc.; AudioPlayer and ListFilter are bundled, while navigation and PWA registration use one hashed TypeScript browser module |
| PWA                       | **`@vite-pwa/astro`**                                | First-class Astro integration, auto-updating service worker                                                                               |
| Sitemap                   | **`@astrojs/sitemap`**                               | Zero-config XML sitemap                                                                                                                   |
| Fonts                     | **Google Fonts** (Noto family + Material Symbols)    | Multilingual coverage, subsetted and preloaded                                                                                            |
| Hosting                   | **Cloudflare Pages**                                 | Global edge, free tier, `_headers`/`_redirects` support                                                                                   |
| CI / tests                | none (yet)                                           | Keep it simple; `astro check` + build gate every change                                                                                   |

The guiding principle of this project is **simplicity with integrity**: no unnecessary abstractions, no framework sprawl, no JavaScript where HTML + CSS will do. Everything is statically generated — the fastest kind of website there is.

## Architecture

```
public/  →  static files copied as-is (robots.txt, icons, _headers, _redirects)
src/
  assets/content/    →  READ-ONLY content data (JSON collections)
  assets/audio/      →  recitation audio (.opus, bundled & hashed)
  assets/brand/      →  source SVG for the maskable icon
  components/        →  reusable .astro components (8)
  layouts/           →  Layout.astro: meta, SEO, fonts, and theme
  pages/             →  routes (home, 404, surahs, duas, names-of-allah)
  scripts/           →  browser-only service-worker registration
scripts/             →  Bun build tooling (headers and PWA asset generation)
  styles/            →  tokens, base, components, content
  content.config.ts  →  collection schemas + validation guards
```

**The content pipeline** is the heart of the site:

1. JSON files are loaded by Astro's content layer (`glob()` for surahs, `file()` with custom parsers for duas and names).
2. Every entry is validated against a **Zod schema** — required fields, types, and custom guards.
3. TypeScript types are inferred from the schema, so pages get autocomplete and build-time errors for content mistakes.
4. Pages (`getCollection`, `getEntry`) render fully static HTML, JSON-LD, and audio references.

**Client-side behavior** (all bundled, no frameworks):

- `AudioPlayer` — initializes from the shared TypeScript browser module.
- `ListFilter` — delegated listener with folded-text matching and a live-region result count.
- Theme toggle — `localStorage` + `prefers-color-scheme`, with a FOUC guard.
- PWA registration — via `@vite-pwa/astro` (`registerType: "autoUpdate"`).

**PWA details worth knowing:** the custom service worker uses Workbox's
`StaleWhileRevalidate` strategy for visited document navigations. If a request
cannot be fetched and is not already cached, it serves the precached `/404`
document as an offline fallback. Static metadata files such as the sitemap,
robots file, and manifest are not handled by the navigation route.

## Project structure

```
basirah/
├── public/                      # Static files copied to dist/
│   ├── _headers                 # Security headers, cache policy
│   ├── _redirects               # Sitemap URL aliases
│   ├── robots.txt               # Crawler policy
│   ├── favicon.svg / .ico       # Brand
│   ├── og-image.png             # Open Graph share image (1200×630)
│   └── pwa-*.png / maskable-*   # PWA icons (generated)
├── src/
│   ├── assets/
│   │   ├── audio/surahs/        # 46 recitation files (.opus)
│   │   └── content/             # READ-ONLY: essential-surahs/, essential-duas/, allah-names/
│   ├── components/              # AudioPlayer, ListFilter, Header, Footer, SurahCard,
│   │                            # PageHeader, ThemeToggle, JsonLd
│   ├── layouts/Layout.astro     # Shell: SEO, fonts, theme, transitions, PWA link
│   ├── pages/
│   │   ├── index.astro          # Home: hero + section cards
│   │   ├── 404.astro            # Custom 404 (also the PWA fallback page)
│   │   ├── surahs/              # Index + [surah] detail w/ audio player
│   │   ├── duas/                # Index + [dua] detail
│   │   └── names-of-allah/      # 100-names table
│   ├── scripts/                 # Browser-only service-worker registration
│   ├── styles/                  # tokens.css, base.css, components.css, content.css
│   └── content.config.ts        # Content collections: loaders + Zod schemas + guards
├── scripts/                     # Bun build tooling (not shipped to the site)
├── astro.config.ts              # Site config, sitemap, PWA, fonts
├── package.json
├── tsconfig.json                # strict; extends astro/tsconfigs/strict
└── LICENSE                      # MIT
```

## Getting started

**Prerequisites:** [Bun](https://bun.sh) (the only permitted runtime/package manager in this repo) and Node.js ≥ 24.

```bash
bun install        # install dependencies
bun run dev        # start the dev server
bun run check      # type-check the whole project (astro check)
bun run build      # generate deploy assets, check, and build → dist/
bun run preview    # preview the production build locally
```

| Script                    | What it does                                                    |
| ------------------------- | --------------------------------------------------------------- |
| `dev`                     | `astro dev`                                                     |
| `check`                   | `astro check` — content validation + type checking              |
| `build`                   | Generates deploy assets, then runs `astro check && astro build` |
| `preview`                 | `astro preview`                                                 |
| `format` / `format:check` | Prettier (with `prettier-plugin-astro`)                         |
| `generate-headers`        | Derives the CSP hash and regenerates `public/_headers`          |
| `generate-pwa-assets`     | Regenerates PWA icons from `src/assets/brand/` SVG sources      |
| `sync`                    | `astro sync` — refresh content-layer types                      |

## Deployment

Deployed to **Cloudflare Pages** (currently `https://basirah.pages.dev`):

- **Build command:** `bun run build` (or the equivalent of `astro check && astro build`)
- **Output directory:** `dist/`

**How the pieces fit together at the edge:**

- **`public/_headers`** — security headers (CSP, `X-Frame-Options`, `Permissions-Policy`, …), immutable `Cache-Control: max-age=31536000` for hashed `/_astro/*` assets, `no-cache` for `sw.js` so updates propagate, and a daily cache for `manifest.webmanifest`. The custom 404 page is served without `X-Robots-Tag` so its `noindex` meta rules.
- **`public/_redirects`** — legacy sitemap aliases (`/sitemap.xml` and `/sitemap-index.html`) rewritten to the real `/sitemap-index.xml` with a 200.
- **`public/robots.txt`** — allows all crawlers, excludes the heavy `/_astro/` media folder, and points to the sitemap.
- **Content Security Policy** — served from `_headers`, with a `sha256` hash for the one inline theme script in `Layout.astro`. **Important:** if that script ever changes, the hash must be regenerated (`openssl dgst -sha256 -binary | base64`) or the site breaks under CSP.

## Notes & lessons learned

This section is a candid record of things we got wrong, learned, and fixed — in the spirit of the project: _simplicity with integrity, and honesty about the journey._

1. **Service-worker fallbacks must be narrow.** An earlier implementation used a broad `navigateFallback` and could answer non-page requests such as `robots.txt` with the custom 404 document. The current custom worker only handles requests whose `mode` is `navigate`; metadata files therefore remain network-served. Lesson: **service workers can swallow requests that the server would handle perfectly** — keep route predicates explicit.

2. **Sitemap aliases.** The sitemap integration only emits `sitemap-index.xml`, but older references pointed at `/sitemap.xml` and `/sitemap-index.html`. Rather than fight the tooling, we added two 200-rewrites in `_redirects`. Simple, honest, edge-fast.

3. **Canonical Bismillah — 45 files normalized, once, forever.** At some point, variations of the Bismillah translations had crept into the 46 surah JSON files (45 of them differing). We normalized all 45 to one canonical set, then — instead of trusting ourselves — **enforced it in the content schema** with a `superRefine` guard. Now any future file with a variant fails the build with a message that says: _"fix the content file, don't add a new variant."_ Content integrity enforced by the toolchain, not by memory.

4. **Unequal card heights are a grid + flexbox classic.** On the home page and the surah grid, grid items stretch to equal height but the inner cards didn't — so cards with less text looked shorter than their neighbors. The fix: `height: 100%` on the inner card, plus `grid-auto-rows: 1fr` for uniformity across rows. The same lesson applies to the dua rows, which also got a mobile wrap fix so every row stacks number → Burmese → English → Arabic consistently.

5. **Never hand-type Arabic or Burmese in tooling.** During verification we compared dist output against a hand-typed Arabic string and got a false alarm (and later, real fixes). The rule we now live by: **derive canonical values from the data itself**, and compare data against data programmatically.

6. **CSP hashes are living things.** The inline theme script's hash is baked into `_headers`. Changing the script without regenerating the hash silently breaks the theme under the strict CSP. It's documented in the `_headers` comments for a reason — read them.

7. **Content files are read-only by principle.** The data in `src/assets/content/` is treated as a source of truth. Changes there are deliberate, reviewed, and validated — never casual.

8. **First visits can look wrong (the PWA lesson).** After a deploy, visitors may see a stale page until the service worker updates (`autoUpdate` handles it on the next visit). A hard refresh once clears it. It's the cost of a fast, app-like site — and a known, accepted trade-off.

## Accessibility, SEO & performance

**Accessibility**

- Skip link, landmarks, semantic HTML (lists for grids, `dl` for definitions, `:lang` typography).
- Escape closes the mobile menu and returns focus.
- ARIA: live region for filter results, `aria-pressed` theme toggle, labeled audio controls, `aria-hidden` decorations.
- `prefers-reduced-motion` respected; keyboard-visible focus styles; readable contrast in both themes.

**SEO**

- Unique titles/descriptions per page; canonical URLs (trailing-slash normalized); `hreflang` + `x-default`; sitemap.
- Open Graph + Twitter `summary_large_image` cards with a branded 1200×630 image.
- JSON-LD structured data on every page type — including `audio` entities for surah recitations.
- Google & Bing site verification; a crawl-friendly `robots.txt`.

**Performance**

- 100% static output; no client framework; the small shared stylesheet is inlined
  to remove a render-blocking request.
- Fonts subsetted and preloaded for the critical path; hashed assets cached immutably for a year.
- Audio served as efficient `.opus` with lazy `preload` semantics in the player.

## Roadmap

Ideas we're mulling — not promises, just honest intentions:

- **More surahs** — the collection currently spans Al-Fātiḥah through Al-Bayyinah; the longer surahs (Al-Baqarah and beyond) are a big, careful project.
- **Prostration markers** — the schema already supports `prostration_verse`; the data and UI markers are next.
- **Transliteration toggle** — show/hide Burmese transliteration per verse.
- **More duas & adhkār** — expand beyond the essential 18 (morning/evening remembrances, travel, illness…).
- **Sajdah & tajweed hints** — small correctness helpers for reciters.
- **Tests & CI** — the project has none yet; a lightweight check workflow would be a nice safety net.
- **Feedback channel** — a way for readers to report translation or typography issues (content accuracy matters most).

## Contributing

This is a small, personal project, and it would be a joy to see it grow — but **accuracy comes before quantity**, and we'd rather have 10 correct pages than 100 rushed ones. If you'd like to help:

1. Read `AGENTS.md` if it's present in your working copy (it's deliberately not committed; it holds the project's working rules).
2. **Bun only** — no npm, no yarn, no pnpm. Use `bun install`, `bun run …`.
3. Content files in `src/assets/content/` are **read-only in principle** — propose changes rather than mass-editing; the schema guards will catch anything inconsistent anyway.
4. Run `bun run build` before pushing — it runs `astro check` and must pass with zero errors.
5. Keep the site's voice: calm, correct, humble, and faithful to both languages and the Islamic tradition. If you're unsure about a translation, ask first — don't guess.
6. Format with `bun run format` (Prettier) and keep changes small and reviewable.

Above all: be kind, be careful, and remember _who_ this site serves.

## License

[MIT](LICENSE) © 2026 c0k0n.

The Qur'anic text and translations are presented for educational purposes; the project holds no copyright over the sacred texts themselves.

---

_Basirah — بَصِيرَة — insight, clarity, light._
_Made with humility, for the Myanmar Muslim community — and for anyone seeking knowledge._
