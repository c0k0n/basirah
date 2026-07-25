# Hikmah

A static Islamic knowledge library designed for Myanmar Muslims. It presents selected Surahs with audio, essential duas, and the beautiful names of Allah in Burmese, Arabic, and English.

## Content model

All source content remains in `src/assets/content/` and is registered through Astro content collections in `src/content.config.ts`:

- `essential-surahs/` — one JSON file per Surah plus its bundled audio
- `essential-duas/duas.json` — daily duas and dhikr
- `99-names/names.json` — names of Allah

New content sections can follow the same pattern: add the content directory, define its collection schema, then add a listing and detail route when needed.

## Local development

```sh
pnpm dev
pnpm build
```

The site is configured for static output, so `dist/` can be deployed directly to Cloudflare Pages. Before publishing, replace the provisional `site` URL in `astro.config.mjs` with the final public domain so canonical URLs and the sitemap are correct. If Pages is not suitable, `pnpm deploy:worker` uses Wrangler's static-assets deployment fallback.

## Verification

`pnpm build` validates schemas, generates all content routes, and emits the sitemap. `pnpm check` is currently blocked by the repository’s TypeScript 7 dependency because Astro’s checker requires TypeScript 6 or earlier until its TypeScript 7 support lands.
