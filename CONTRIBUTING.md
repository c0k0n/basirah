# Contributing to Basirah

Thank you for taking the time to look closely at this project.

## Before opening a change

For a larger change, please open an issue first so the direction can be discussed. Small fixes and clear corrections can go directly into a pull request. Use the issue templates: [bug report](.github/ISSUE_TEMPLATE/bug-report.md) for site problems, [content correction](.github/ISSUE_TEMPLATE/content-correction.md) for text or translation fixes.

## Content and language

Content under `src/assets/content/` is read-only project data; Islamic source text is treated as protected. Arabic, Qur'anic, Burmese, and English corrections need extra care:

- Explain the source of a correction and keep Unicode characters intact.
- Do not rewrite religious content from memory or present a personal interpretation as an authoritative translation.

## Code changes

Use [Bun](https://bun.sh/) only — no npm, pnpm, or yarn. Before opening a pull request, run the verification gates listed in the [README](README.md#quick-start).

Keep browser JavaScript small, preserve accessible markup, and explain any content or architectural trade-offs in the pull request. Naming, formatting, and multilingual-markup conventions are documented in [`docs/codebase/`](docs/codebase/) — please follow them.
