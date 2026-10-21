# Code Review - Story 1.2: Input

**Date**: 2026-10-20
**Reviewed By**: REVIEWER Agent
**Review Number**: 1
**Review Mode**: INITIAL_REVIEW
**Status**: ⚠️ APPROVED WITH COMMENTS

---

## Review Metadata

**Previous Review**: None
**Previous Status**: N/A
**Files Changed Since Last Review**: All
**Severity Threshold Applied**: All

---

## Review Summary

**Components Reviewed**: `src/components/Input/{Input.tsx, Input.types.ts, Input.scss, Input.stories.tsx, Input.test.tsx, index.ts}`, `src/index.ts`, `vitest.config.ts`, `vitest.setup.ts`, `.gitignore`
**Lines of Code**: ~360 (44 impl TSX, 89 SCSS, 119 tests, 93 stories)
**Tests Reviewed**: Yes
**Coverage**: 100% statements/branches/functions/lines on `Input.tsx` (re-run by reviewer: 18/18 pass)

**Overall Assessment**: Small, focused, correct implementation that matches the story contract and the patterns doc. No blockers or high-severity issues. Findings are accessibility hardening, test-pattern gaps, and tracked tech debt (tokens). Storybook/a11y/Chromatic acceptance criteria cannot be verified until Story 3.3 and are correctly reported as pending by DEV.

**Evidence verified by reviewer**: `pnpm vitest run --coverage` (18 pass, 100%); `pnpm typecheck` 0 errors; `pnpm lint` 0 warnings; `prettier --check` clean; `pnpm build` exit 0. Additionally ran `tsc` over `src` + `vitest.setup.ts` with tests/stories included: 0 errors (stories and tests type-check).

---

## Checklist Results

### Correctness
- [x] ✅ Matches story ACs (error state, `error=""` edge, label association, ref forwarding, disabled, helper-text priority)
- [x] ⚠️ `{...rest}` can override ARIA wiring (ISS-001)
- [x] ✅ No race conditions / leaks (pure render component)

### Pattern Adherence
- [x] ✅ BEM, `forwardRef` with named function, named exports, barrel, file layout, `clsx` usage
- [x] ⚠️ Hardcoded px/hex fallbacks in SCSS vs patterns §4.1 (ISS-002; accepted — tokens arrive in Story 3.2)
- [x] ⚠️ Focus mixin from patterns §4.3 not used; inline equivalent (ISS-006)

### Testing
- [x] ✅ Unit tests exist, AAA-ish, meaningful, 100% coverage
- [x] ⚠️ Required categories missing: axe, controlled mode; class-based queries (ISS-003, ISS-004)

### Documentation
- [x] ✅ TSDoc on props; no commented-out code; self-review exists (honestly marked In Progress)
- [x] ⚠️ `Input.types.ts` relies on global `React` namespace (ISS-007)

### Security
- [x] ✅ No secrets; React escapes `error`/`helperText`; no `dangerouslySetInnerHTML`

### SOLID / Anti-Monolith
- [x] ✅ Single responsibility, small file, no coupling, testable in isolation

---

## Issues Found

### ISS-001: Consumer `aria-describedby` / `aria-invalid` silently override error wiring 🟡 Medium
**File**: `src/components/Input/Input.tsx:31-33` (spread `{...rest}` comes after `aria-invalid` / `aria-describedby`)
**Problem**: `<Input aria-describedby="hint" error="Required" />` removes the link to the error span; screen readers no longer announce the error on focus. This breaks the core error-a11y contract (Contract Consistency: silent override).
**Fix**: merge instead of override, e.g. destructure `'aria-describedby': describedBy` and set `aria-describedby={clsx(describedBy, hasError && errorId) || undefined}`; place `{...rest}` before the managed attributes. Add a test.
**Reference**: patterns §3.4; story AC "aria-describedby on `<input>`".

### ISS-002: Hardcoded px/hex/magic values in SCSS 🟡 Medium (accepted debt)
**File**: `Input.scss` (e.g. lines 7–10, 36–39, 49–50)
**Problem**: patterns §4.1 says never hardcode; `src/tokens/` does not exist yet. Story explicitly prescribes the `var(--token, fallback)` form, so this conforms to the story.
**Fix**: after Story 3.2, replace px literals with token variables and drop fallbacks; track as follow-up.

### ISS-003: No `axe` accessibility test 🟡 Medium
**File**: `Input.test.tsx`
**Problem**: patterns §6.2 requires `axe(container)` for every component; `jest-axe` is not installed.
**Fix**: add `jest-axe` as devDependency + one test per state (default/error/disabled), or explicitly defer to Storybook a11y once Story 3.3 lands and record the deferral in the story.

### ISS-004: Tests query/assert by BEM class; no controlled-mode or disabled-no-event test 🟡 Medium
**File**: `Input.test.tsx:52-55, 82-85` (class assertions); missing tests
**Problem**: patterns §6.1 discourages class queries; §6.2 requires controlled-mode round-trip and "no events fired when disabled". 
**Fix**: assert behavior (aria/visibility) instead of classes, or keep one class test with justification; add `value`+`onChange` round-trip and a disabled `user.type` → `onChange` not called test; add `aria-describedby` absent-by-default and label-click-focuses-input tests.

### ISS-005: Helper text not associated with the input 🟢 Low
**File**: `Input.tsx:40`
**Problem**: helper `<span>` has no id and is not in `aria-describedby`, so screen readers do not announce hints (WCAG 1.3.1/3.3.2). Not required by the story ACs.
**Fix**: give it `id={`${id}-helper`}` and include it in `aria-describedby` when no error (combine with ISS-001 fix).

### ISS-006: Focus ring inlined instead of shared mixin; error+mouse focus has no extra indicator 🟢 Low
**File**: `Input.scss:34-43, 56-62`
**Problem**: patterns §4.3 prescribes a `focus-visible-ring` mixin (not yet created); in error state `:focus` drops the shadow so mouse focus is only the (already red) border. Keyboard users still get the outline.
**Fix**: adopt the mixin when it exists; consider keeping `box-shadow` in error focus.

### ISS-007: Types file depends on ambient `React` namespace; `id` required with no fallback 🟢 Low
**File**: `Input.types.ts:1`
**Fix**: `import type { InputHTMLAttributes } from 'react'`. Optionally use `useId()` when `id` omitted (API ergonomics; story currently mandates required `id`).

### ISS-008: Process notes (non-code) 🟢 Low
- `vitest.config.ts` / `vitest.setup.ts` were added early; Story 3.4 and Story 1.1 will touch the same files — coordinate to avoid a merge conflict.
- `pnpm typecheck` excludes `*.test.tsx` / `*.stories.tsx` (Story 3.1 config), so those files are never type-checked in CI; reviewer verified they compile when `vitest.setup.ts` is included.
- Story AC says `:focus-within` on wrapper; implementation uses `:focus` on field (documented deviation, visually equivalent).

---

## Approval Status

**⚠️ APPROVED WITH COMMENTS** — 0 🔴 | 0 🟠 | 4 🟡 | 4 🟢

Required before story can be marked ✅ Done (not code review blockers): Storybook render + a11y addon check and Chromatic evidence once Story 3.3 / 3.6 land.

**Recommended next step**: `aire-dev-remediate` for ISS-001 (and ISS-004/005 tests); ISS-002/003/006 can ride with Stories 3.2/3.3.
