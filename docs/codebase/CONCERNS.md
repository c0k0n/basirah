# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity       | Concern                                                                                                   | Evidence                                                         | Impact                                                                                       | Suggested action                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| accepted       | ~53 MB of binary `.opus` audio committed to git (46 files; largest ~8.9 MB) and grows with each new surah | `du -sh src/assets/audio/surahs/` → 53M; scan largest-files list | Repo clone size and CI checkout time grow unboundedly; history rewrites get harder over time | Accepted trade-off. Revisit only if clone/CI times become painful; then move to Cloudflare R2/Assets keeping hashed URLs |
| low            | CSP permits `'unsafe-inline'` for both scripts and styles                                                 | `public/_headers:8`                                              | Weakens XSS protection posture; needed today for the inline theme script and inline styles   | Acceptable documented trade-off; could move to nonces/hashes if the host supports it                                     |
| low (accepted) | No automated tests of any kind                                                                            | TESTING.md                                                       | Regressions in filter/audio/dialog logic surface only via manual testing                     | Accepted. Build-time gates (`format:check`, `astro check`, `build`) are the verification strategy                        |

### 2) Technical Debt

| Debt item                                                                                 | Why it exists                                    | Where                                                                                                              | Risk if ignored                                             | Suggested fix                                  |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------- |
| Hardcoded site URL repeated across configs                                                | Static-site simplicity                           | `astro.config.ts:6`, `public/robots.txt`, README badges                                                            | Changing domain requires multi-file edits                   | Low priority; acceptable at this scale         |
| Theme colors duplicated between CSS tokens, inline head script, ThemeToggle, and manifest | Inline pre-paint script cannot import CSS tokens | `tokens.css`, `Layout.astro:54-70`, `ThemeToggle.astro`, `manifest.webmanifest` (`theme_color`/`background_color`) | A palette change can miss one copy (e.g., theme-color meta) | Keep a comment cross-referencing all locations |

### 3) Security Concerns

| Risk                               | OWASP category (if applicable) | Evidence                                                               | Current mitigation                                                            | Gap                                |
| ---------------------------------- | ------------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| Inline script/style allowed by CSP | A03 Injection (posture)        | `public/_headers:8`                                                    | Tight default-src 'self'; frame-ancestors none; object-src none; HSTS preload | `unsafe-inline` weakens script-src |
| JSON-LD injection via content data | A03 Injection                  | `JsonLd.astro:8-23`                                                    | `<>&`, U+2028/U+2029 escaped before `set:html`                                | None found — well handled          |
| User input handling                | N/A                            | Search inputs are client-only DOM filtering; nothing is sent anywhere  | No server, no storage → minimal attack surface                                | None identified                    |
| Secret exposure                    | N/A                            | CI secrets scoped to deploy step; least-privilege workflow permissions | `deploy.yml:8-10`                                                             | None identified                    |

### 4) Performance and Scaling Concerns

| Concern                                                                                             | Evidence                                      | Current symptom                     | Scaling risk                                                | Suggested improvement                                                      |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| Large single-page verse lists (e.g., long surahs render every verse server-side into one HTML file) | `[surah].astro` renders all verses statically | Page weight grows with surah length | Only affects largest surahs; static HTML keeps it tolerable | Measure first; consider pagination only if a long-surah page becomes heavy |
| Audio `preload="none"` correctly avoids eager downloads                                             | `AudioPlayer.astro:16`                        | Good                                | —                                                           | —                                                                          |
| Fonts self-hosted via Astro with selective preload of LCP-critical families                         | `Layout.astro:116-133`                        | Good                                | —                                                           | —                                                                          |

### 5) Fragile/High-Churn Areas

| Area                               | Why fragile                                                                   | Churn signal                                 | Safe change strategy                                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/layouts/Layout.astro`         | Central shell touching SEO, fonts, theme bootstrap — everything depends on it | 21 commits in last 90 days (scan HIGH-CHURN) | Change one concern per edit; verify canonical/meta output after changes                                   |
| `src/pages/surahs/[surah].astro`   | Route generation + audio mapping + dock script in one file                    | 16 commits                                   | Keep `getStaticPaths` pure; test prev/next edges (first/last surah)                                       |
| `astro.config.ts` / `package.json` | Toolchain + font config churn                                                 | 15 / 17 commits                              | Re-run full gate trio after any toolchain change                                                          |
| `public/_headers`                  | CSP edits can silently break analytics/theme behavior                         | 13 commits                                   | Test headers against staging preview after edits                                                          |
| `src/styles/content.css`           | 1164-line file spanning many page types                                       | 13 commits                                   | Prefer scoped component styles for new isolated UI (precedent: `SurahJumpDialog.astro`, `Ornament.astro`) |

### 6) Evidence

- Scan output sections: HIGH-CHURN FILES, CODE METRICS, TODO/FIXME (none found)
- Terminal: `du -sh src/assets/audio/surahs/` → 53M
- Each table row above cites its supporting file paths in its Evidence/Where column
