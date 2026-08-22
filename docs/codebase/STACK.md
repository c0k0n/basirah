# Technology Stack

## Core Sections (Required)

### 1) Runtime Summary

| Area                | Value                                                                             | Evidence                                                                          |
| ------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Primary language    | TypeScript (strict) + Astro components (`.astro`)                                 | `tsconfig.json`, `src/components/*.astro`                                         |
| Runtime + version   | Bun only (local dev observed 1.4.0; CI pins 1.4.0); Node >= 24 engine requirement | `.github/workflows/deploy.yml` (`BUN_VERSION: "1.4.0"`), `package.json` `engines` |
| Package manager     | Bun only — npm/pnpm/yarn are explicitly forbidden by project rules                | `AGENTS.md` "Bun Only", `bun.lock`, `README.md` §Local development                |
| Module/build system | Vite via Astro; ESM (`"type": "module"`); static output                           | `package.json`, `astro.config.ts` (`output: "static"`)                            |

### 2) Production Frameworks and Dependencies

The single production dependency is the framework itself. There is no client UI framework.

| Dependency | Version | Role in system                                                  | Evidence                                       |
| ---------- | ------- | --------------------------------------------------------------- | ---------------------------------------------- |
| astro      | ^7.2.4  | Static site generator, content collections, Fonts API, bundling | `package.json` dependencies, `astro.config.ts` |

### 3) Development Toolchain

| Tool                                           | Purpose                                                              | Evidence                                        |
| ---------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| @astrojs/check (^0.9.10) + typescript (^6.0.3) | Type/diagnostic checking of `.astro` and `.ts` files (`astro check`) | `package.json` devDependencies, `tsconfig.json` |
| @astrojs/sitemap (^3.7.3)                      | Generates `sitemap-index.xml` at build time                          | `astro.config.ts`, `public/_redirects`          |
| prettier ^3.9.6 + prettier-plugin-astro        | Formatting (tabs, Astro parser override)                             | `.prettierrc.json`                              |
| @types/bun                                     | Bun type definitions used by `tsconfig.json` `"types": ["bun"]`      | `package.json`, `tsconfig.json`                 |

### 4) Key Commands

All project commands (`bun run dev`, `bun run build`, `bun run check`, `bun run preview`, `bun run format`, `bun run sync`) are documented once in the root `README.md` §Local development. There is no test command.

### 5) Environment and Config

- Config sources: `astro.config.ts` (site URL, sitemap, fonts), `src/utils/constants.ts` (title/description/nav), `tsconfig.json`, `.prettierrc.json`
- Required env vars in application code: none (no `import.meta.env` / `process.env` reads found)
- CI-only secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (GitHub Actions environment secrets on the `Production` environment; workflow also holds `deployments: write` permission)
- Deployment/runtime constraints: fully static output deployed to Cloudflare Pages (`https://basirah.pages.dev`) via wrangler; no server runtime exists

### 6) Evidence

- `package.json` (scripts, deps, engines)
- `astro.config.ts` (static output, site URL, sitemap, 5 font families — Noto Sans Myanmar, Noto Naskh Arabic, Recursive with `MONO`/`CASL`/`slnt`/`CRSV` variable axes, Material Symbols glyph subset)
- `tsconfig.json` (extends `astro/tsconfigs/strict`)
- `.github/workflows/deploy.yml`
- Terminal: `bun --version` → 1.4.0
