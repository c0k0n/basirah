# Codebase Structure

## Core Sections (Required)

### 1) Top-Level Map

| Path                           | Purpose                                                                                                                                                                                  | Evidence                                      |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `public/`                      | Copied verbatim: Cloudflare `_headers`/`_redirects`, `robots.txt`, `manifest.webmanifest`, favicons/PWA icons, `og-image.png`                                                            | `public/*`, README §Project structure         |
| `src/assets/content/`          | **Read-only** JSON content data (never modify): surah JSON files, `essential-duas/duas.json`, `allah-names/names.json`                                                                   | `AGENTS.md` §Content, `src/content.config.ts` |
| `src/assets/audio/surahs/`     | Read-only recitation audio (`.opus` files)                                                                                                                                               | directory listing                             |
| `src/components/`              | 10 Astro components (PascalCase `.astro`)                                                                                                                                                | `src/components/`                             |
| `src/utils/`                   | Shared helpers: `constants.ts` (`SITE` title/description/nav), `foldText.ts` (Arabic-aware search folding), `filterList.ts` (shared list filtering + live-region updates), `truncate.ts` | files themselves                              |
| `src/layouts/Layout.astro`     | Single shared document shell: head/meta/fonts/theme script/header/footer/skip link                                                                                                       | `src/layouts/Layout.astro`                    |
| `src/pages/`                   | File-based routes (static)                                                                                                                                                               | `src/pages/**`                                |
| `src/styles/`                  | Four vanilla CSS layers: `tokens.css` → `base.css` → `components.css` → `content.css`, imported in that order by the layout                                                              | `Layout.astro:6-9`                            |
| `src/content.config.ts`        | Content-collection definitions: loaders + Zod schemas                                                                                                                                    | file itself                                   |
| `.github/workflows/deploy.yml` | CI: Bun build → wrangler Pages deploy on push to `main`                                                                                                                                  | file itself                                   |
| `AGENTS.md`, `CLAUDE.md`       | Local agent/project instructions — **git-ignored** (`.gitignore:2-3`)                                                                                                                    | `.gitignore`                                  |
| `.astro/`, `dist/`             | Generated artifacts, git-ignored, never source                                                                                                                                           | `.gitignore`                                  |
| `docs/`                        | Codebase documentation (these files)                                                                                                                                                     | directory itself                              |

### 2) Entry Points

- Main runtime entry: none in the server sense — this is a static site. Build entry is `astro.config.ts`; page generation entries are the route files under `src/pages/`.
- Dynamic-route generators:
  - `src/pages/surahs/[surah].astro:28-70` — `getStaticPaths()` builds one page per surah, resolves prev/next nav and hashed audio URLs.
  - `src/pages/duas/[dua].astro:11` — `getStaticPaths()` for dua detail pages.
- Client-side scripts are bundled from per-component `<script>` blocks (Astro processes/bundles these); there is no global entry JS.

### 3) Module Boundaries

| Boundary            | What belongs here                                                                                  | What must not be here                                  |
| ------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `src/assets/**`     | Immutable content + audio data                                                                     | Any code or casual edits (read-only rule)              |
| `src/pages/**`      | Route composition, `getStaticPaths`, page-level SEO/JSON-LD                                        | Reusable UI markup (belongs in components)             |
| `src/components/**` | Self-contained UI blocks incl. their own `<script>`/`<style>` when needed                          | Cross-page state or routing logic beyond its DOM scope |
| `src/utils/**`      | Pure shared helpers with no Astro/DOM dependencies (`foldText`, `filterList`, `truncate`, `SITE`)  | Component-specific logic or side effects               |
| `src/styles/**`     | All styling; components may add scoped styles only (see `SurahJumpDialog.astro`, `Ornament.astro`) | Component-global overrides elsewhere                   |
| `public/`           | Files served unchanged                                                                             | Anything needing build-time processing                 |

### 4) Naming and Organization Rules

- Components: `PascalCase.astro` (`AudioPlayer.astro`, `SurahJumpDialog.astro`)
- Pages/routes: lowercase; collections use `index.astro` + `[param].astro`
- Shared utils: camelCase `.ts` files named after their primary export (`foldText.ts`, `filterList.ts`, `truncate.ts`) or role (`constants.ts`)
- Content data files: kebab-case JSON (`surah-al-fatihah.json`); surah ids derive from filename (`surah-al-fatihah`)
- CSS files: lowercase role-based names (`tokens`, `base`, `components`, `content`)
- Directory organization is layer-ish within a single app: assets / components / layouts / pages / styles — not feature folders
- Imports are relative (`../components/Header.astro`, `../utils/foldText`); no path aliases configured in `tsconfig.json`

### 5) Evidence

- Scan output "DIRECTORY TREE" section (`docs/codebase/.codebase-scan.txt`)
- `astro.config.ts`, `tsconfig.json`, `.gitignore`
