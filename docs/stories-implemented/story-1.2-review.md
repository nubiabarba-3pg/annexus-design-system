# Story 1.2 Self-Review — Input

**Date**: 2026-10-20
**Story**: Input component (CYCLE-2, Epic 1, Wave 1) — ADO #23652
**Developer**: DEV Agent (Dev 2 slot)
**Status**: 🟡 In Progress — code complete and unit-proven; Storybook/a11y/Chromatic ACs blocked on Story 3.3

---

## What Was Implemented

- `src/components/Input/Input.tsx` — `forwardRef` Input: label, native input, error span (`role="alert"`), helper text
- `Input.types.ts`, `Input.scss` (BEM, token vars with fallbacks), `Input.stories.tsx` (CSF3, 8 stories), `Input.test.tsx` (18 tests), `index.ts`
- `src/index.ts` — named exports `Input`, `InputProps`
- `vitest.config.ts` + `vitest.setup.ts` — **minimal** Vitest/jsdom/jest-dom setup (Story 3.4 owns the full setup; user approved adding this early)
- `.gitignore` — added `coverage/`

## Deviations from Plan

| Deviation | Reason |
|-----------|--------|
| Named exports in `src/index.ts` instead of `export *` | Patterns doc §7.1 forbids star-exports |
| `forwardRef(function Input…)` named function; no default `React` import | Patterns doc §3.4; `noUnusedLocals` |
| Focus style via `.annexus-input__field:focus` (story code) not `:focus-within` on wrapper (story AC text) | Visually identical; kept story code |
| No `jest-axe` test | Not installed; a11y covered by Storybook addon once 3.3 lands |
| Minimal `vitest.config.ts` added | Story 3.4 not yet done; coordinate with Story 1.1 / 3.4 to avoid duplicate creation |

## Testing Summary

- `pnpm vitest run --coverage`: 18/18 pass; Input.tsx 100% statements/branches/functions/lines
- `pnpm typecheck`: 0 errors · `pnpm lint`: 0 warnings · `prettier --check`: clean · `pnpm build`: exit 0

## DoD Evidence — Spec Echo (Gate 1)

> Condensed (requirements grouped, test names rather than `file:line`). To be expanded to one row per AC / Step with `file:line` when the story is closed after Story 3.3.

| Requirement | Proof |
|---|---|
| Exports `Input`/`InputProps` from barrel | `src/index.ts` named exports; `pnpm build` emits types |
| Default gray-300 border | `Input.scss` `&__field` border |
| Focus: brand-primary border + shadow-xs | `Input.scss` `&:focus` |
| Error: red border/text, `aria-invalid`, `aria-describedby` | tests "sets aria-invalid…", "sets aria-describedby…", "renders error message text" |
| `error=""` is not an error | test "does NOT trigger error state when error is an empty string" |
| Label `htmlFor` association | test "associates label with input via htmlFor / id" |
| Disabled: native attr, opacity 0.5, not-allowed | tests "disabled prop…", "applies --disabled…"; `Input.scss` `&--disabled` |
| Ref → `<input>` | test "forwards ref…" |
| helperText hidden on error | tests "renders helperText…", "hides helperText…" |
| Attribute passthrough | test "passes type, min, max…" |
| min-height 44px; radius md 4px | `Input.scss` `&__field` |
| Coverage ≥90% | 100% all metrics |
| CSF3 stories incl. 4 Figma variants | `Input.stories.tsx` (**written, not yet rendered**) |
| Storybook a11y zero violations | ⛔ UNPROVEN — no `.storybook/` until Story 3.3 |
| Chromatic snapshots | ⛔ UNPROVEN — depends on Storybook/CI (3.3, 3.6) |

## Gate 2 — Negative Space

No masking/formatting, no validation logic, no textarea, no prefix/suffix icon in `Input.tsx` / `Input.types.ts` — reproducible check: `grep -niE "mask|format|validat|textarea|prefix|suffix|icon" src/components/Input/Input.tsx src/components/Input/Input.types.ts` returns no matches (exit 1).

## Gate 3 — Contract Consistency

`InputProps` matches usage in tests, stories, and the barrel; `pnpm typecheck` 0 errors.

## Next Steps

- Once Story 3.3 lands: run Storybook, check a11y tab for all Input stories, then mark Done and close ADO #23652
- ADO #23652 not yet moved to Active — `az login` required
