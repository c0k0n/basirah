# Testing Patterns

## Core Sections (Required)

### 1) Test Stack and Commands

- Primary test framework: **none configured** — no test runner, assertion library, or mock tool exists
- Assertion/mocking tools: none
- Verification commands (`bun run check`, `bun run build`) are documented once in README §Local development; there is no `test` script in `package.json`

### 2) Test Layout

- Test file placement pattern: N/A (no test files anywhere; scan found none)
- Naming convention: N/A
- Setup files: `.astro/` generated types are refreshed by `bun run sync` / `astro check` before diagnostics

### 3) Test Scope Matrix

| Scope       | Covered? | Typical target | Notes                                                                                                                                    |
| ----------- | -------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Unit        | no       | —              | No test framework exists by design; see §5                                                                                               |
| Integration | no       | —              | Closest equivalent: Zod content validation at build/dev sync time (`src/content.config.ts`) rejects malformed data before pages generate |
| E2E         | no       | —              | —                                                                                                                                        |

### 4) Mocking and Isolation Strategy

- Main mocking approach: N/A
- Isolation guarantees: N/A
- Common failure mode in tests: N/A

### 5) Coverage and Quality Signals

- Coverage tool + threshold: none
- Current reported coverage: N/A
- **No automated test framework by design.** `bun run format:check` → `bun run check` → `bun run build` is the verification strategy; build-time validation (Zod content schemas, type diagnostics) plus manual testing cover the current project scope.
- Known untested areas (for awareness, not action): `foldText()` Arabic normalization, audio time formatting/seek clamping, route generation for non-contiguous surah numbers.

### 6) Evidence

- `package.json` scripts block
- Scan output "PERFORMANCE & TESTING" → "No performance testing configs detected"
- Terminal: `bun run check` → Result (26 files): 0 errors, 0 warnings
