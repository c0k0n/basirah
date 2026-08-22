# Coding Conventions

## Core Sections (Required)

### 1) Naming Rules

| Item                       | Rule                                                          | Example                                                  | Evidence                                                                    |
| -------------------------- | ------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| Files (components/layouts) | PascalCase + `.astro`                                         | `AudioPlayer.astro`, `PageHeader.astro`                  | `src/components/`                                                           |
| Files (pages)              | lowercase route names; `index.astro`; dynamic `[param].astro` | `surahs/[surah].astro`                                   | `src/pages/`                                                                |
| Content data files         | kebab-case JSON; entry id = filename stem                     | `surah-al-fatihah.json` → id `surah-al-fatihah`          | `src/assets/content/essential-surahs/`, loader in `content.config.ts:36-39` |
| Functions/variables        | camelCase                                                     | `foldText`, `audioBySurahId`, `getStaticPaths`           | `src/utils/foldText.ts:5`, `[surah].astro`                                  |
| Types/interfaces           | PascalCase; Props interface per component                     | `interface Props { surah: CollectionEntry<"surahs"> }`   | `SurahCard.astro:5-7`                                                       |
| Constants                  | SCREAMING_SNAKE for module-level consts                       | `SITE`, `BISMILLAH_CANONICAL`, `SKIP_SECONDS`            | `utils/constants.ts:1`, `content.config.ts:26`, `AudioPlayer.astro:138`     |
| DOM JS hooks               | kebab-case `data-*` attributes, never class selectors         | `data-audio-play`, `data-quick-open`, `data-filter-live` | all interactive components                                                  |

### 2) Formatting and Linting

- Formatter: Prettier 3 with `prettier-plugin-astro`; **tabs**, double quotes (`.prettierrc.json`)
- Linter: none beyond `astro check` type diagnostics; ESLint is not configured
- Enforced strictness (`tsconfig.json` extends `astro/tsconfigs/strict`): `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `noImplicitOverride`
- Run gates before submitting changes: `bun run format:check && bun run check && bun run build` (commands documented in README §Local development; rationale in CONTRIBUTING.md)

### 3) Import and Module Conventions

- Relative imports only (`../components/Header.astro`, `../utils/foldText`); no path aliases exist
- Order observed: framework/Astro imports (`astro:content`, `astro:assets`) → components → shared utils/config/data → styles last (in Layout)
- Shared logic goes in `src/utils/` as pure functions; components import from there instead of re-declaring local copies (e.g. `foldText` used by both `ListFilter` and `SurahJumpDialog`)
- `verbatimModuleSyntax` requires `import type` for type-only imports (e.g. `CollectionEntry`)
- No barrel files / public export modules — single-purpose modules only

### 4) Error and Logging Conventions

- Client scripts fail soft with try/catch or `.catch(() => {})`: theme storage is wrapped so private-browsing cannot break the toggle (`ThemeToggle.astro:26-29,56-58`), audio play rejections are swallowed (`AudioPlayer.astro:160`)
- Build-time validation is the real error boundary: Zod schemas reject malformed content during `astro check`/build, including the canonical-bismillah refinement that tells authors to "fix the content file instead of adding a new variant" (`content.config.ts:80`)
- No logging library; no runtime logging at all (static site)
- Non-null assertions used sparingly where an empty collection would be a content bug anyway (`duas/index.astro:11` `duas[0]!`)

### 5) Testing Conventions

- Test file naming/location rule: N/A — no test framework configured
- Mocking strategy norm: N/A
- Coverage expectation: none; verification = format check + `astro check` + production build (see TESTING.md)

### Additional project-specific conventions

- **Multilingual markup**: document language is Burmese (`lang="my"` default in Layout); embedded English gets `lang="en"`, Arabic gets `lang="ar"` (+ `dir="rtl"`), inline Arabic inside LTR text uses the `isolated-rtl` class (`base.css:155-158`). ARIA labels are written in Burmese.
- **Comments explain "why", not "what"** (e.g., floating-dock rationale in `[surah].astro:353-357`, audio-hashing note in `[surah].astro:26-27`, icon-font ordering note in `base.css:159-162`).
- **Fonts**: three text families + one icon font, all via Astro Fonts API — `--font-my` (Noto Sans Myanmar), `--font-ar` (Noto Naskh Arabic), `--font-en` (Recursive; sans/display/mono via `MONO`/`CASL` axes), `--font-icon` (Material Symbols). Language routing is done with `:lang()` selectors in `base.css`.
- **Icons**: Material Symbols via ligature text inside `<span class="material-symbols-outlined">`, always `aria-hidden="true"`; allowed glyphs must be listed in `astro.config.ts` glyphs array.
