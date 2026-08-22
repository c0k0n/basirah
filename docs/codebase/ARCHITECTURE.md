# Architecture

## Core Sections (Required)

### 1) Architectural Style

- Primary style: **content-driven static site generation** with tiny per-component vanilla-JS islands. No hydration, no client framework (verified: no `client:*` directives anywhere).
- Why this classification: all HTML is produced at build time by Astro (`output: "static"`, `getStaticPaths` in the two `[param].astro` routes); interactivity is limited to five `<script>` behaviors (listed in §2 step 5).
- Primary constraints:
  1. Content correctness — Qur'anic/Burmese/Arabic data is validated by Zod at build time; `src/assets/content/**` is read-only.
  2. Minimal JavaScript and no new dependencies (AGENTS.md core principles).
  3. Cloudflare Pages static hosting shapes headers/redirects/error pages.
- Non-goals (by design): no route-based i18n (Burmese document language + `lang` attributes), no View Transitions/`<ClientRouter />`, no authentication, database, server API, service worker, offline cache, or client UI framework.

### 2) System Flow

```text
JSON content (src/assets/content/**)
  → loaders glob()/file() + Zod schemas (src/content.config.ts)
    → getCollection() sorted in route files
      → getStaticPaths()/template render (src/pages/**)
        → static HTML + hashed /_astro assets (audio via import.meta.glob "?url")
          → deployed to Cloudflare Pages (.github/workflows/deploy.yml)
            → browser: static HTML + small component scripts
```

Steps with evidence:

1. **Content validation**: `surahs` uses `glob()` over 46 JSON files; `duas`/`names` use `file()` parsers that parse+Zod-validate then remap items into entries (`src/content.config.ts:35-171`). The bismillah object is pinned to a canonical string set via `.superRefine()` (`src/content.config.ts:72-84`) so content files cannot introduce variants.
2. **Route generation**: surah detail sorts by `surah_metadata.surah_number`, computes prev/next, and maps audio filenames to hashed Vite URLs through eager `import.meta.glob(..., { query: "?url" })` (`src/pages/surahs/[surah].astro:28-70`). Surah ids come from filenames; selected numbers are non-contiguous: 1, 36, 63, 65–67, 73–114.
3. **Shell composition**: every page wraps in `Layout.astro`, which sets canonical/hreflang/OG/Twitter metadata, an inline pre-paint theme script, `<Font>` preloads, header/footer, and skip link (`src/layouts/Layout.astro`).
4. **Structured data**: pages emit JSON-LD via `JsonLd.astro`, which escapes `<>&`, U+2028/U+2029 to prevent script-context breakout (`src/components/JsonLd.astro:8-23`). The homepage declares a schema.org `@graph` with separate WebSite and Organization nodes and a square logo asset (`src/pages/index.astro:23-46`).
5. **Client behavior** (the only runtime JS):
   - Theme: inline head script reads `localStorage["basirah-theme"]`/prefers-color-scheme before paint; `ThemeToggle.astro` persists toggles and updates `meta[data-theme-color]`.
   - Nav menu toggle + Escape handling (`Header.astro`). No service worker, offline cache, or PWA runtime code exists anywhere in source.
   - List filtering via the shared `filterList` util (Arabic diacritic/alef-form folding through `foldText`) with an `aria-live` result count (`src/utils/filterList.ts`, `ListFilter.astro:35`), reused inside the native `<dialog>` surah picker with a `/` keyboard shortcut (`SurahJumpDialog.astro:183`).
   - Audio player: play/pause, ±10s seek, time display, range seek bar with playback position announced to screen readers via `aria-valuetext` (`AudioPlayer.astro:138-160`); the surah page docks it as a floating bar when verses are visible but the inline player has scrolled away, using two IntersectionObservers (`[surah].astro:362-372`).

### 3) Layer/Module Responsibilities

| Layer or module                               | Owns                                                               | Must not own                                        | Evidence                                                 |
| --------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------- | -------------------------------------------------------- |
| `content.config.ts`                           | Schema truth for all three collections; canonical-text enforcement | Page rendering, presentation                        | `src/content.config.ts`                                  |
| `pages/[param].astro`                         | Static path enumeration, ordering, nav props, audio URL mapping    | Component internals                                 | `src/pages/surahs/[surah].astro`                         |
| `Layout.astro`                                | Document head, SEO meta, fonts, theme bootstrap, landmarks         | Collection queries beyond none (it queries nothing) | `src/layouts/Layout.astro`                               |
| Components                                    | Localized DOM behavior scoped by `data-*` attributes               | Global state, routing                               | e.g. `AudioPlayer.astro` scopes to `[data-audio-player]` |
| `public/_headers`, `_redirects`, `robots.txt` | Edge-level security/cache/crawl policy                             | App logic                                           | files themselves                                         |

### 4) Reused Patterns

| Pattern                                                                               | Where found                                                                        | Why it exists                                              |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `data-*` attribute hooks for JS (`data-filter-item`, `data-quick-open`, …)            | All interactive components                                                         | Decouples JS from styling classes; multiple instances safe |
| Defensive collection-derived links (pick + filter nulls)                              | `Footer.astro:10-52` picks featured surahs/duas by id and drops missing ones       | Content reorder/removal can never break footer links       |
| Shared pure helpers under `src/utils/` (`foldText`, `filterList`, `truncate`, `SITE`) | Imported by `ListFilter`, `SurahJumpDialog`, `[surah].astro`, index page, Layout   | One implementation per behavior; no drift                  |
| Token-driven theming with dual override paths                                         | `tokens.css` — media-query block for unset theme + `[data-theme="dark"]` attribute | System-preference default with persistent manual toggle    |

### 5) Known Architectural Risks

- **53 MB of binary audio committed to git**: repo size grows with every added recitation; clone/CI times will degrade (scan output: largest file ~8.9 MB; `du -sh` = 53M). See CONCERNS.
- **Single-file growth hotspots**: `SurahJumpDialog.astro` (554 lines incl. scoped styles) and `content.css` (1164 lines) mix several responsibilities; churn history shows these areas change often.
- **Static-only error handling**: `500.html` exists but real origin 5xx on Cloudflare needs Custom Error Rules — a hosting boundary, not something `_redirects` can solve.

### 6) Evidence

- `src/content.config.ts`, `src/pages/surahs/[surah].astro`, `src/layouts/Layout.astro`
- Interactive scripts: `Header.astro`, `ThemeToggle.astro`, `ListFilter.astro`, `SurahJumpDialog.astro`, `AudioPlayer.astro`
- Terminal: surah-number list extraction; `grep client: src/` → no matches
