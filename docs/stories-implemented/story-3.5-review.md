# Story 3.5 Self-Review

**Date**: 2026-10-21
**Story**: Shared Utilities and Types — `classNames`, `devWarning`, `common.types`
**Developer**: DEV Agent (Dev-2, Angel)

---

## What Was Implemented

- `src/utils/classNames.ts` — re-exports `clsx` as `classNames` (swappable wrapper; components never import `clsx` directly)
- `src/utils/devWarning.ts` — `devWarning(condition, component, message)`; warns `[Component] message` only when `condition` is false and `NODE_ENV !== 'production'`
- `src/types/common.types.ts` — `Size`, `Tone`, `BaseProps`
- `src/types/env.d.ts` — minimal ambient `process.env.NODE_ENV` declaration (see Deviations)
- `src/index.ts` — `export type { Size, Tone, BaseProps }`

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `src/utils/classNames.ts` | New | `clsx` re-export under project name |
| `src/utils/devWarning.ts` | New | Dev-only prop-misuse warning |
| `src/types/common.types.ts` | New | Shared prop types |
| `src/types/env.d.ts` | New | Ambient `process` shape for typecheck |
| `src/index.ts` | Modified | Public type exports |
| `src/utils/classNames.test.ts` | New | 7 tests (story required 5) |
| `src/utils/devWarning.test.ts` | New | 3 tests: dev, condition-true, production |

## Patterns Applied

| Pattern | Where Applied | Notes |
|---------|---------------|-------|
| Thin swappable wrapper | `classNames.ts` | Per story Step 1 |
| Dev-only guard | `devWarning.ts` | Per patterns doc §8 (story's 3-arg signature used) |
| Union types for shared props | `common.types.ts` | `Size`, `Tone` |
| TDD | utils | Tests written first; failed (modules missing), then green |

## Testing Summary

- **Unit Tests**: 10 new, all passing (35/35 across the repo)
- **Coverage**: 100% statements/branches/functions/lines (threshold 90%)
- `pnpm typecheck` exit 0 · `pnpm lint` exit 0 (0 warnings) · `pnpm build` exit 0

## DoD Evidence

### Gate 1 — Spec Echo

| # | Requirement | Proof |
|---|-------------|-------|
| AC1 | `classNames` wraps `clsx`; strings, falsy, arrays | `src/utils/classNames.ts:1`; tests in `classNames.test.ts` (join, falsy, array) pass |
| AC2 | `devWarning(condition, component, message)` warns only if false and NODE_ENV ≠ production | `src/utils/devWarning.ts:1-5`; `devWarning.test.ts` 3/3 pass |
| AC3 | `Size`, `Tone`, `BaseProps` (incl. `data-testid`) | `src/types/common.types.ts:3-11` |
| AC4 | `index.ts` exports `Size, Tone, BaseProps` | `src/index.ts:9`; `dist/index.d.ts:6` |
| AC5 | `pnpm typecheck` exits 0 | exit 0 |
| AC6 | Vitest `classNames` test: truthy, falsy, array, conditional | `classNames.test.ts` — 7 tests pass |
| AC7 | Behaviour table: `classNames('a', false, 'b')` → `'a b'`; `(undefined, null, 'c')` → `'c'`; dev warn / prod no-op / true no-op | `classNames.test.ts`, `devWarning.test.ts` |
| S1–S6 | Steps 1–6 | Files created as specified; verification run (see Testing Summary) |
| QA | `Size = 'xl'` is a TS error; `interface extends BaseProps` compiles | Probe file: `TS2322: '"xl"' is not assignable to type 'Size'`; `extends BaseProps` raised no error (probe removed) |

AC count in story: 7 · rows above: 7 ✅

### Gate 2 — Negative-Space Check

| Rule | Check | Result |
|------|-------|--------|
| No `cn` alias | `grep -rnE "\bcn\b" src/utils src/types src/index.ts` | none |
| No public export of utils | `grep -nE "classNames\|devWarning\|utils" src/index.ts`; same on `dist/index.d.ts` | none |
| No runtime type validation | `grep -rniE "zod\|yup\|PropTypes" src/utils src/types` | none |
| No animation utilities | `ls src/utils` | only classNames, devWarning (+ tests) |

### Gate 3 — Contract Consistency

| Story / patterns doc | Code | Match |
|----------------------|------|-------|
| `devWarning(condition, component, message)` → `[Component] message` | `devWarning.ts` | ✅ |
| `BaseProps` has `className`, `style`, `data-testid` | `common.types.ts` | ✅ |
| `Size` / `Tone` unions | `common.types.ts` | ✅ |
| Public API exports types only | `index.ts` | ✅ |

## Challenges Encountered

| Challenge | Resolution | Time Spent |
|-----------|------------|------------|
| `pnpm typecheck` failed: `Cannot find name 'process'` (no `@types/node`) | Added minimal ambient declaration instead of `@types/node` to avoid leaking Node globals into a browser lib | minutes |

## Deviations from Plan

- Added `src/types/env.d.ts` (not in the story's Files Touched) so the story's `process.env.NODE_ENV` guard typechecks.
- Added `devWarning.test.ts` (story only required `classNames` tests) to satisfy the 90% coverage gate.
- Patterns doc §8 shows a 2-arg `devWarning` with an `[Annexus UI]` prefix; the story's 3-arg `[Component]` form was used because its AC are explicit.
- `Variant` is named in the story's User Reference, but AC specify `Tone`; implemented `Tone`.

## Lessons Learned

- Existing `Input` imports `clsx` directly; migrate to `classNames` in a later story (not in scope here).
- Patterns doc §8 `devWarning` should be aligned with the story signature.
