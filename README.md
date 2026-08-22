# Basirah — بَصِيرَة

> Islamic knowledge for Myanmar Muslims: selected Qur'an surahs with recitation audio, essential duas, and the Names of Allah in Burmese, English, and Arabic.

[![Live site](https://img.shields.io/badge/live-basirah.pages.dev-10b981?style=flat-square&logo=cloudflare-pages&logoColor=white)](https://basirah.pages.dev)
[![Astro](https://img.shields.io/badge/Astro-7-ff5d01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Bun](https://img.shields.io/badge/Bun-fbf0df?style=flat-square&logo=bun&logoColor=black)](https://bun.sh)
[![License: MIT](https://img.shields.io/badge/license-MIT-3da639?style=flat-square&logo=opensourceinitiative&logoColor=white)](LICENSE)

## Overview

Basirah is a static [Astro](https://astro.build) website for Myanmar Muslims. Burmese is the primary interface language, with embedded English and Arabic content marked by language attributes. The site is framework-free on the client: pages render to plain HTML with vanilla CSS and only a few small component scripts.

| Collection     | Source                     | Items |
| -------------- | -------------------------- | ----: |
| Surahs         | `essential-surahs/*.json`  |    46 |
| Essential duas | `essential-duas/duas.json` |    18 |
| Names of Allah | `allah-names/names.json`   |   100 |

The selected surahs run from Al-Fatihah (1) to An-Nas (114) but are not a continuous range; routes are generated from the JSON metadata. Each surah page includes metadata, translations, transliterations, verses, navigation, structured data, and recitation audio where a matching `.opus` asset exists in `src/assets/audio/surahs/`. Content files under `src/assets/content/` are read-only project data validated by Zod schemas in `src/content.config.ts`.

## Quick start

Prerequisite: [Bun](https://bun.sh/). Do not use npm, pnpm, or yarn in this repository.

```sh
bun install
bun run dev
```

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

Pushes to `main` trigger [.github/workflows/deploy.yml](.github/workflows/deploy.yml): Bun install → build → `wrangler pages deploy dist --project-name=basirah` to Cloudflare Pages at `https://basirah.pages.dev`. The workflow requires the GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, and can also be run manually via `workflow_dispatch`.

## Documentation

Detailed, current-state documentation of this codebase lives in [`docs/codebase/`](docs/codebase/):

| Document                                         | Covers                                              |
| ------------------------------------------------ | --------------------------------------------------- |
| [STACK.md](docs/codebase/STACK.md)               | Languages, runtime, dependencies, config sources    |
| [STRUCTURE.md](docs/codebase/STRUCTURE.md)       | Directory map, entry points, module boundaries      |
| [ARCHITECTURE.md](docs/codebase/ARCHITECTURE.md) | Rendering model, data flow, client behaviors, risks |
| [CONVENTIONS.md](docs/codebase/CONVENTIONS.md)   | Naming, formatting, imports, multilingual markup    |
| [INTEGRATIONS.md](docs/codebase/INTEGRATIONS.md) | Hosting, analytics, fonts, secrets                  |
| [TESTING.md](docs/codebase/TESTING.md)           | Verification strategy (build-time gates, no tests)  |
| [CONCERNS.md](docs/codebase/CONCERNS.md)         | Known risks, debt, security notes, fragile areas    |

## Contributing

Contributions are warmly welcomed — and you don't need to be a programmer. This project especially needs help with:

- **Arabic script** — checking the Qur'anic verses and duas against reliable sources
- **Burmese translation** — keeping meanings accurate and natural for Myanmar readers
- **Burmese transliteration** — polishing the pronunciation guides so everyone can recite with confidence

To suggest a correction, open a [content correction issue](.github/ISSUE_TEMPLATE/content-correction.md) — every submission is reviewed with care before it is published. If you'd like to improve the code instead (or as well), [CONTRIBUTING.md](CONTRIBUTING.md) tells you how to get started.

## Security

Please report vulnerabilities privately rather than in public issues — see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © 2026 c0k0n.

The Qur'anic text and translations are presented for educational purposes; the project does not claim copyright over sacred texts themselves.

— Basirah — بَصِيرَة — insight, clarity, and light.
