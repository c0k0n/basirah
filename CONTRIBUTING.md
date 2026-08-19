# Contributing to Basirah

Thank you for taking the time to look closely at this project.

## Before opening a change

For a larger change, please open an issue first so the direction can be discussed. Small fixes and clear corrections can go directly into a pull request.

## Content and language

Arabic, Qur'anic, Burmese, and English content needs extra care. Please explain the source of a correction and keep Unicode characters intact. Do not rewrite religious content from memory or present a personal interpretation as an authoritative translation.

## Code changes

Use Bun for the project commands. Before opening a pull request, run:

```sh
bun run format:check
bun run check
bun run build
```

Keep browser JavaScript small, preserve accessible markup, and explain any content or architectural trade-offs in the pull request.
