# External Integrations

## Core Sections (Required)

### 1) Integration Inventory

| System                                          | Type (API/DB/Queue/etc)  | Purpose                                                                                                                                                                                                                                                                                        | Auth model                                                               | Criticality | Evidence                                                                                                                         |
| ----------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Pages                                | Hosting/CDN              | Serves the static build. `public/_headers` sets security headers, CSP, and cache rules; `public/_redirects` rewrites `/sitemap.xml` and `/sitemap-index.html` to the generated sitemap; `robots.txt` sets crawl policy; `manifest.webmanifest` provides install metadata (no offline behavior) | GitHub secret `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (CI only) | high        | `.github/workflows/deploy.yml:40-44`, `public/_headers`, `public/_redirects`, `public/robots.txt`, `public/manifest.webmanifest` |
| Cloudflare Web Analytics                        | Analytics beacon         | CSP allows `static.cloudflareinsights.com` script + `cloudflareinsights.com` connect; enabled at the Cloudflare dashboard level. No beacon script ships in-repo — Cloudflare injects it                                                                                                        | none (public beacon)                                                     | low         | `public/_headers:8`                                                                                                              |
| Google Fonts / Google Icons via Astro Fonts API | Build-time font fetching | Self-hosted fonts for Burmese (Noto Sans Myanmar), Arabic (Noto Naskh Arabic), Latin (Recursive, variable axes) + Material Symbols glyph subset; no runtime third-party font requests (`font-src 'self'`)                                                                                      | none (build-time)                                                        | medium      | `astro.config.ts:9-85`, `Layout.astro:120-133`                                                                                   |
| Search engines (GSC/Bing)                       | Verification meta tags   | Ownership verification only                                                                                                                                                                                                                                                                    | Public meta tokens (not secrets)                                         | low         | `Layout.astro:72-76`                                                                                                             |

There are **no runtime external API calls** from application code — zero `fetch(` occurrences in `src/`.

### 2) Data Stores

| Store | Role | Access layer | Key risk | Evidence                                              |
| ----- | ---- | ------------ | -------- | ----------------------------------------------------- |
| None  | —    | —            | —        | No database client exists in `package.json` or source |

Content is file-based JSON read at build time by Astro content loaders.

### 3) Secrets and Credentials Handling

- Credential sources: GitHub Actions environment secrets only (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`); injected into the wrangler deploy step
- Hardcoding checks: no app-level env reads found; no `.env` files tracked (`.gitignore` excludes them). The committed `google-site-verification` / Bing meta contents are public-by-design verification tokens, not secrets
- Rotation or lifecycle notes: [TODO] — not documented in repo

### 4) Reliability and Failure Behavior

- Retry/backoff behavior: N/A at runtime (static site); CI has `concurrency: cancel-in-progress` to avoid overlapping deploys (`deploy.yml:12-14`) and a GitHub `Production` environment with the live URL (`deploy.yml:22-24`)
- Supply-chain posture: GitHub Actions are pinned to commit SHAs and wrangler is version-pinned, so every deploy runs lockfile-audited or immutable tooling only
- Timeout policy: N/A in-app
- Fallback behavior: audio element ships a download link fallback for browsers without audio support (`AudioPlayer.astro:16-21`); theme/storage failures degrade silently

### 5) Observability for Integrations

- Logging around external calls: none exist to log (no runtime integrations)
- Metrics/tracing coverage: Cloudflare Web Analytics (dashboard-side) only; no RUM code, no error tracking in-repo
- Missing visibility gaps: deploy success/failure visible only via GitHub Actions logs; no deployment health check

### 6) Evidence

- `.github/workflows/deploy.yml`
- `public/_headers` (CSP allow-list enumerates every permitted origin)
- `astro.config.ts` (font providers)
- Terminal: `grep -rn "fetch(" src/` → no matches
