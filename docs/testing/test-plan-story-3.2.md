# Test Plan — Story 3.2: Design System Styles (Palette, Design Variables, JS Export)

**Scope**: Story 3.2 — Design System Styles
**BUILDID**: CYCLE-1 | **AzureDevOps**: #23669
**Created**: 2026-10-21 | **Author**: QA Agent
**Status**: Ready for execution
**Source**: `docs/plans/stories/epic-3-story-3.2-design-tokens.md` (re-scoped CR-001), `docs/requirements.md` § Feature: Design Tokens, `docs/ui-ux/ui-ux-spec.md` `design_tokens`

---

## Scope

**Coverage**: Story 3.2 — Design System Styles (CYCLE-1 Foundation, Wave 2)

**In Scope**:
- `src/styles/pallete.color.scss` — every spec color, hex, unique names and values
- `src/styles/design.variables.scss` — section-named design variables referencing the palette; fonts
- `src/styles/design.variables.module.scss` — `:export` of every design variable
- `src/styles/designVariables.ts` + `scss-modules.d.ts` — `designVariables` / `DesignVariables`
- `src/index.ts` — public export of both
- `src/styles/designVariables.test.ts` — parity, palette uniqueness, component-SCSS guards
- Component SCSS conformance (currently `src/components/Input/Input.scss`) — no hex, no palette references
- Built package (`dist/`) — `designVariables` importable from the ESM and CJS bundles
- Negative space from the story OUT list (no `src/tokens/`, no new `--annexus-*` properties, no dark mode)

**Out of Scope**:
- Spacing, radius and shadow variables (added per component story — story AC)
- Input component behaviour (Story 1.2 — separate catch-up QA)
- `--annexus-radius-md` in `Input.scss` (review ISS-005, deferred to Story 1.2) — recorded as an observation, not a 3.2 failure
- Storybook / Chromatic (3.3 / 3.6), CI pipeline (3.6)

**Test Type**: Automated (Vitest) + CLI command execution + file inspection + one mutation check.

---

## Requirements Traceability

| Req ID | Acceptance Criterion | Test Scenarios |
|--------|----------------------|----------------|
| AC-01 | Every color from `ui-ux-spec.md` `design_tokens` exists once in the palette, in hex | TC-005, TC-006 |
| AC-02 | Palette has no duplicate names and no duplicate hex values | TC-004, TC-007 |
| AC-03 | Palette uses `$camelCaseColorName: #hex;` and includes the named brand/semantic/neutral colors and `$gray50`–`$gray900` | TC-006 |
| AC-04 | `design.variables.scss` starts with `@use 'pallete.color' as palette;`; color variables follow `$<section><Element><State>Color: palette.$x`; no name repeated | TC-008 |
| AC-05 | `$fontFamilyBase: 'Assistant', sans-serif` plus per-section size / line-height / weight variables; values match the spec typography scale | TC-009 |
| AC-06 | Component SCSS uses only design variables — no hex, no palette variables | TC-004, TC-010 |
| AC-07 | `design.variables.module.scss` exports every variable in `design.variables.scss` | TC-004, TC-011 |
| AC-08 | Adding a design variable without its `:export` line makes a test fail | TC-012 |
| AC-09 | `designVariables.ts` exports `designVariables` and `DesignVariables`; both exported from `src/index.ts` | TC-013 |
| AC-10 | `import { designVariables }` from the built package returns values equal to the SCSS variables (e.g. `inputLabelColor === '#414651'`) | TC-014 |
| AC-11 | Only `design.variables.scss` references the palette | TC-015 |
| AC-12 | OUT: no `src/tokens/`, no `--annexus-*` custom properties defined, no dark-mode overrides, no variables for non-existent components | TC-016 |
| AC-13 | `pnpm build`, `typecheck`, `lint`, `test` exit 0; coverage ≥ 90% (story) / ≥ 85% (QA gate) | TC-001, TC-002, TC-003, TC-004 |
| REQ-DT | Requirements § Design Tokens: tokens as SCSS variables, consumed by all components, token file exported in the package | TC-010, TC-013, TC-014 |

---

## Test Categories

### Unit Tests (Vitest)
- `designVariables.test.ts`: export parity, palette value resolution, palette name/hex uniqueness, component SCSS guards

### Integration Tests
- SCSS → CSS Modules `:export` → TS module → library bundle (`dist/index.es.js`, `dist/index.cjs.js`)
- Component SCSS (`Input.scss`) compiles against `design.variables.scss` in the Vite build

### E2E Tests
- N/A — no user-facing UI in this story

---

## Test Scenarios

| ID | Category | Command / Check | Expected Result | Priority |
|----|----------|-----------------|-----------------|----------|
| TC-001 | Build | `pnpm build` | Exit 0; `dist/` has `index.es.js`, `index.cjs.js`, `index.d.ts`, `style.css` | 🔴 Critical |
| TC-002 | TypeCheck | `pnpm typecheck` | Exit 0, no errors | 🔴 Critical |
| TC-003 | Lint | `pnpm lint` | Exit 0, zero warnings | 🔴 Critical |
| TC-004 | Unit + Coverage | `pnpm coverage` | All tests pass; coverage ≥ 90% lines/branches/functions/statements | 🔴 Critical |
| TC-005 | Spec parity | Compare every hex in `ui-ux-spec.md` `design_tokens.colors` with `pallete.color.scss` (case-insensitive) | Each spec hex present exactly once | 🔴 Critical |
| TC-006 | Palette naming | Inspect `pallete.color.scss` | All lines `$camelCase: #hex;`; includes `$midnightBlue` #11175E, `$cobaltBlue` #1B3E80, `$azureBlue` #0167AC, `$deepGreen` #044638, `$jadeGreen` #079455, `$brickRed` #B73B3B, `$lightSteel` #CED6DB, `$white`, `$jetBlack` #222222, `$shadowBlack` #0A0D12, `$gray50`–`$gray900` | 🟠 High |
| TC-007 | Palette uniqueness | Script: count names and hex values | No duplicates (independent of TC-004) | 🟠 High |
| TC-008 | Design variable naming | Inspect `design.variables.scss` | First statement is `@use 'pallete.color' as palette;`; every `*Color` variable = `palette.$x`; names unique and section-prefixed | 🟠 High |
| TC-009 | Fonts | Inspect `design.variables.scss` | `$fontFamilyBase: 'Assistant', sans-serif`; every size/line-height pair matches the spec scale (12/18, 14/20, 16/24); weights ∈ {400, 600, 700} | 🟠 High |
| TC-010 | Component SCSS | `grep` `src/components/**/*.scss` for hex and `palette.` / `pallete.color` | No matches; files `@use` `design.variables` | 🔴 Critical |
| TC-011 | Export parity | Script: diff variable names in `design.variables.scss` vs `:export` keys | Identical sets | 🟠 High |
| TC-012 | Mutation: guard test | Temporarily append `$qaProbeColor: palette.$white;` to `design.variables.scss`, run `pnpm test`, then restore with `git checkout -- src/styles/design.variables.scss` | Parity test fails; after restore, `git diff` on the file is empty and tests pass | 🟠 High |
| TC-013 | Public API | Inspect `designVariables.ts`, `src/index.ts`, `dist/index.d.ts` | `designVariables` and `DesignVariables` exported from the barrel and present in the `.d.ts` | 🟠 High |
| TC-014 | Built package import | `node -e "import('./dist/index.es.js')..."` and `require('./dist/index.cjs.js')` | `designVariables` has one key per design variable; `inputLabelColor === '#414651'`, `inputFieldFocusBorderColor === '#11175e'`; `fontFamilyBase` contains `Assistant` | 🔴 Critical |
| TC-015 | Palette isolation | `grep -rl "pallete.color" src` | Only `design.variables.scss` | 🟡 Medium |
| TC-016 | Negative space | Check `src/tokens/` absent; no `--annexus-*:` definitions in `src`; no `prefers-color-scheme` / dark selectors; variables only for existing components (Input) | All absent | 🟡 Medium |
| TC-017 | Comment accuracy | Inspect headers of `styles.scss`, `pallete.color.scss`, `design.variables.scss` | No stale `src/tokens` pointer (review ISS-003) | 🟢 Low |

---

## Test Data Requirements

- **Valid data**: the palette and design variable files as committed on `main`; spec hex list from `ui-ux-spec.md` lines 7–28
- **Mutation data (TC-012)**: one probe variable `$qaProbeColor: palette.$white;`, added and removed within the test; the file is restored with `git checkout` and verified with `git diff`
- **Edge data**: hex case (spec upper-case vs palette lower-case) — compare case-insensitively

---

## Environment Requirements

| Requirement | Value |
|-------------|-------|
| Node.js | 26 LTS (or ≥ 24 compatible) |
| pnpm | per lockfile |
| OS | Windows 11 (local) / Ubuntu (CI, Story 3.6) |
| Branch | `main` at or after `9fef804` (includes PR #7 and PR #9) |
| State | `pnpm install` done; `dist/` rebuilt by TC-001 before TC-013/TC-014 |

---

## Execution Order

1. TC-001 → TC-003 (build, typecheck, lint)
2. TC-004 (unit tests + coverage)
3. TC-005 → TC-011, TC-013, TC-015 → TC-017 (inspections and scripts)
4. TC-014 (built package import, needs TC-001)
5. TC-012 (mutation — last before the final re-run; restore and re-run `pnpm test`)

---

## Quality Gates

| Gate | Target | Mandatory |
|------|--------|-----------|
| `pnpm build` / `typecheck` / `lint` | Exit 0 | ✅ Yes |
| Unit test coverage | ≥ 85% (QA) and ≥ 90% (story threshold) | ✅ Yes |
| Unit tests | 100% passing | ✅ Yes |
| Integration (TC-014 bundle import) | Pass | ✅ Yes |
| Critical test cases | All pass | ✅ Yes |
| Open Critical / High bugs | 0 | ✅ Yes |
| Security scan | N/A — no runtime logic, no new dependencies | N/A |
| Performance | N/A | N/A |

**Known risk at plan time**: review ISS-001 — the spec gives gray 700 as `#404042` and the palette has `#414651`. Until there's a design decision, TC-005 is expected to fail for this one value. QA will classify it in the validation report.

---

## Schedule

| Activity | Target Date |
|----------|-------------|
| Test plan created | 2026-10-21 |
| Test execution | 2026-10-21 (`aire-qa-validate story 3.2`) |
| Validation report | 2026-10-21 |
| Sign-off | Before CYCLE-1 close (2026-10-22) |

---

## Bugs Found

*(Populated during `aire-qa-validate` execution — none at plan time)*

---

## Next Steps

- [ ] Execute via `aire-qa-validate story 3.2`
