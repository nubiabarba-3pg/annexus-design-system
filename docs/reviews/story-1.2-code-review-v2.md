# Code Review - Story 1.2: Input

**Date**: 2026-10-20
**Reviewed By**: REVIEWER Agent
**Review Number**: 2
**Review Mode**: NEW_CHANGES
**Status**: ❌ CHANGES REQUESTED

> ## 🛠️ Remediation Status: ✅ Resolved
> - **Remediated**: 2026-10-20 by DEV Agent
> - **Fixed**: 1 issue(s) — 🔴 0 / 🟠 1 / 🟡 0 / 🟢 0 (ISS-009 closed as a side effect)
> - **Deferred (with user consent)**: 0 in this report; v1 🟡/🟢 items remain tracked in v1
> - **Tests**: 22/22 passing | **Coverage**: 100% | **Linter**: clean
> - **Scenario**: Code Review

---

## Review Metadata

**Previous Review**: docs/reviews/story-1.2-code-review-v1.md
**Previous Status**: APPROVED WITH COMMENTS (0 🔴 | 0 🟠 | 4 🟡 | 4 🟢)
**Files Changed Since Last Review**: `src/components/Input/Input.scss`, `src/styles/pallete.color.scss`, `src/styles/design.variables.scss`, `src/styles/design.variables.module.scss`, `src/styles/designVariables.ts`, `src/styles/scss-modules.d.ts`, `src/index.ts` (design-variable migration, CR-001)
**Severity Threshold Applied**: Blocker + High only (🟡/🟢 from v1 are tracked below, not re-reported)

---

## Review Summary

**Components Reviewed**: the files listed above (`Input.tsx`, `Input.types.ts`, tests and stories are unchanged since v1)
**Lines of Code**: ~170 changed (palette 30, design variables 40, export module 30, Input.scss 85)
**Tests Reviewed**: Yes
**Coverage**: Input.tsx 100%; **global thresholds fail** (functions 66.66% vs 90%)

**Overall Assessment**: The migration is clean: no hex values or palette variables in component SCSS, names are unique, the palette has no duplicate hex values, and the JS export returns the right values (checked against the built bundle). One High finding: the new `src/styles` files are counted by the coverage gate and have no test, so the coverage threshold now fails.

**Evidence verified by reviewer**: `npx vitest run --coverage` (18 pass; threshold error on functions); `npx tsc --noEmit` 0 errors; `eslint src --max-warnings 0` clean; `prettier --check src` clean; `vite build` exit 0 and `designVariables` import from `dist/index.es.js` returns the exported values; scan for hex values outside `pallete.color.scss` → none; duplicate hex in palette → none.

---

## Checklist Results

### Correctness
- [x] ✅ Compiled CSS keeps the same values as v1 (label fallback changed `#404042` → `$gray700` #414651, matching the Story 3.2 spec)
- [x] ✅ `:export` values match the SCSS variables

### Pattern Adherence
- [x] ✅ Component uses only design variables; palette referenced only from `design.variables.scss`
- [x] ✅ Unique camelCase section-prefixed names
- [x] ⚠️ `design.variables.module.scss` is hand-synced with `design.variables.scss` (ISS-009)

### Testing
- [x] ❌ New `src/styles` code untested; global coverage gate fails (ISS-008-v2)

### Security
- [x] ✅ No secrets, no new dependencies

---

## Issues Found

### ISS-101: Coverage threshold fails because `src/styles` is counted and untested 🟠 High
**File**: `vitest.config.ts` (coverage `include: ['src/**/*.{ts,tsx}']`), `src/styles/designVariables.ts`, `src/styles/scss-modules.d.ts`
**Problem**: `npx vitest run --coverage` exits non-zero: `ERROR: Coverage for functions (66.66%) does not meet global threshold (90%)`. `designVariables.ts` (0%) and the type-only `scss-modules.d.ts` are included. The ≥90% gate is an acceptance criterion of every story and of Story 3.6 (CI), so the next CI run would be red. v1 measured 100% before these files existed.
**Fix**: (a) add `src/styles/designVariables.test.ts` (Story 3.2 already lists it): assert `designVariables` exposes every variable declared in `design.variables.scss`; since `css: false` returns no values for `.module.scss`, enable CSS processing for that file (e.g. `test.css: { include: /\.module\.scss$/ }`) or assert through a Vite `?inline`/sass compile; (b) add `'**/*.d.ts'` to the coverage `exclude`.
**Reference**: story ACs (coverage ≥ 90%), cycle-2 acceptance criteria.

**Resolution** (2026-10-20, DEV):
- Fix: added `src/styles/designVariables.test.ts` (export parity with `design.variables.scss`, palette values, unique names, unique hex); `vitest.config.ts` now compiles `*.module.scss` (`css.include`) and excludes `*.d.ts` and `*.test.ts` from coverage; `tsconfig.json` and `vite.config.ts` (dts) exclude `*.test.ts`
- Commit / change ref: `vitest.config.ts`, `tsconfig.json`, `vite.config.ts`, `src/styles/designVariables.test.ts`
- Test evidence: the test failed first (`Object.keys(designVariables)` empty; values were hashed class names), then 22/22 pass, coverage 100% on all metrics
- Status: ✅ Resolved

---

## Previous Issues Status (v1)

| ID | Status |
|----|--------|
| ISS-001 aria override | Open (🟡) |
| ISS-002 hardcoded values | **Partially resolved** — all colors and fonts are design variables; px spacing (4/8/12/44px), `opacity`, transitions and `var(--annexus-radius-md, 4px)` remain. The radius still points to a CSS custom property that no longer exists, so only the fallback is ever used (🟡) |
| ISS-003 axe test | Open (🟡) |
| ISS-004 test gaps | Open (🟡) |
| ISS-005 helper text id | Open (🟢) |
| ISS-006 focus mixin | Open (🟢) |
| ISS-007 React namespace | Open (🟢) |
| ISS-008 process notes | Superseded: Story 3.4 will touch `vitest.config.ts` (ISS-101 fix goes there) |

## Notes below threshold (not blocking)

- 🟡 ISS-009: `design.variables.module.scss` must be kept in sync by hand; nothing fails if a variable is added to `design.variables.scss` and not exported. The parity test in ISS-101 closes this.
- 🟡 Story 3.2 is not yet implemented as a story, but its code is already on this branch; merge order per CR-001 is 3.2 → … → 3.6 → 1.2. Land the `src/styles` files with Story 3.2, not with Input.

---

## Approval Status

**❌ CHANGES REQUESTED** — 0 🔴 | 1 🟠 | 0 new 🟡 | 0 new 🟢 (v1: 4 🟡 / 4 🟢 still tracked)

**Recommended next step**: `aire-dev-remediate` for ISS-101 (also covers ISS-009); v1 🟡 items can ride with Stories 3.2/3.3.

---

# 🛠️ Remediation — 2026-10-20

**Developer**: DEV Agent
**Severity Scope**: 🔴 Blocker + 🟠 High
**Scenario**: Code Review
**Stories Affected**: 1.2 (files belong to Story 3.2)

## Issues Remediated

| ID | Severity | Story | File:Line | Summary | Resolution | Test Added |
|----|----------|-------|-----------|---------|------------|------------|
| ISS-101 | 🟠 High | 1.2 | vitest.config.ts | Coverage gate fails (`src/styles` untested) | Parity/palette tests + coverage config | `src/styles/designVariables.test.ts` ✅ |
| ISS-009 | 🟡 Medium | 1.2 | design.variables.module.scss | Hand-synced export | Parity test fails if a variable is not exported | same ✅ |

## Issues Deferred (with user consent)

| ID | Severity | Story | Reason |
|----|----------|-------|--------|
| v1 ISS-001/003/004 (🟡), 005/006/007 (🟢) | 🟡/🟢 | 1.2 | Out of scope of this pass; tracked in v1 |

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/styles/designVariables.test.ts` | Added | 4 tests |
| `vitest.config.ts` | Modified | compile `*.module.scss`; coverage excludes `*.d.ts`, `*.test.ts` |
| `tsconfig.json` | Modified | exclude `*.test.ts` from typecheck (consistent with `*.test.tsx`; no `@types/node`) |
| `vite.config.ts` | Modified | dts excludes `*.test.ts` |

## Testing Summary

- **Targeted tests added**: 4
- **Full suite**: 22/22 passing
- **Coverage**: 100% (target ≥90%)
- `tsc --noEmit`, `eslint --max-warnings 0`, `prettier --check`, `vite build` all clean

## Deviations from Report Suggestions

- None.

## Lessons Learned

1. With `css: false`, Vitest returns hashed class names for `.module.scss`, so exported values must be tested with CSS processing enabled for that file only.

## Next Steps

- [ ] Re-request code review (`aire-review-code`) — optional (no 🔴 fixed); the 🟠 fix is test/config only
- [ ] Land `src/styles/**` and these config changes with Story 3.2, not with Input
