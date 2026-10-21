# Code Review - Story 3.5: Shared Utilities and Types

> ## 🛠️ Remediation Status: 🟡 Partially Remediated (3/5)
> - **Remediated**: 2026-10-21 by DEV Agent
> - **Fixed**: 3 issue(s) — 🔴 0 / 🟠 0 / 🟡 2 / 🟢 1
> - **Deferred (with user consent)**: 2 — ISS-003 (Input is Salvador's merged code, follow-up), ISS-004 (informational, no change needed)
> - **Tests**: 35/35 passing | **Coverage**: 100% | **Linter**: clean
> - **Scenario**: Code Review

**Date**: 2026-10-21
**Reviewed By**: REVIEWER Agent
**Review Number**: 1
**Review Mode**: INITIAL_REVIEW
**Status**: ⚠️ APPROVED WITH COMMENTS

> Independence note: the code under review was written earlier in the same Claude session. Findings were verified by re-running every gate, but a human or fresh-session reviewer may still want a second look.

---

## Review Metadata

**Previous Review**: None
**Previous Status**: N/A
**Files Changed Since Last Review**: All (uncommitted working tree on `main`)
**Severity Threshold Applied**: All
**Story File**: `docs/plans/stories/epic-3-story-3.5-shared-utils.md`
**Context read**: `docs/architecture/design/01-patterns-and-standards-greenfield.md` (§3.3, §7.1, §8, checklist)

---

## Review Summary

**Files Reviewed**: `src/utils/classNames.ts`, `src/utils/devWarning.ts`, `src/types/common.types.ts`, `src/types/env.d.ts`, `src/index.ts`, `src/utils/classNames.test.ts`, `src/utils/devWarning.test.ts`, `docs/stories-implemented/story-3.5-review.md`

| Severity | Count |
|----------|-------|
| 🔴 Blocker | 0 |
| 🟠 High | 0 |
| 🟡 Medium | 2 |
| 🟢 Low | 3 |

### Evidence verified by reviewer (re-run, not copied)

| Gate | Result |
|------|--------|
| `pnpm test` | exit 0 — 35/35 (10 new) |
| `pnpm coverage` | exit 0 — 100% stmts/branches/funcs/lines; `classNames.ts`, `devWarning.ts` 100% (threshold 90%) |
| `pnpm typecheck` | exit 0 |
| `pnpm lint` (`--max-warnings 0`) | exit 0 |
| `pnpm build` | exit 0; `dist/index.d.ts:6` exports `Size, Tone, BaseProps`; `classNames`/`devWarning` absent from public barrel |

### Acceptance criteria

| # | AC | Verdict | Evidence |
|---|----|---------|----------|
| 1 | `classNames` wraps `clsx` | ✅ | `src/utils/classNames.ts:1` |
| 2 | `devWarning(condition, component, message)`, dev-only | ✅ | `src/utils/devWarning.ts:1-5`; 3 tests |
| 3 | `Size`, `Tone`, `BaseProps` (incl. `data-testid`) | ✅ | `src/types/common.types.ts:3-11` |
| 4 | `index.ts` exports types | ✅ | `src/index.ts:9` |
| 5 | typecheck exits 0 | ✅ | exit 0 |
| 6 | classNames Vitest covers truthy/falsy/array/conditional | ✅ | `classNames.test.ts` (7 tests) |
| 7 | Behaviour table | ✅ | both test files |

### Checklist

- Correctness ✅ · Patterns ✅ (see ISS-001) · Testing ✅ (AAA-style, behaviour names; mocks only on `console.warn`, an external boundary) · Security ✅ (no secrets, no dynamic code, message is a plain `console.warn` string) · SOLID / anti-monolith ✅ (each file <10 lines, single responsibility, no coupling) · Performance N/A · Docs ✅ (self-review exists, no TODOs, no commented-out code)

---

## Issues

### ISS-001 🟡 Medium — Documentation: patterns doc contradicts the implemented utilities
**Files**: `docs/architecture/design/01-patterns-and-standards-greenfield.md` §3.3 (line ~226), §8 (line ~673)
§3.3 documents a hand-rolled `classNames(...classes: (string|undefined|false|null)[])` (no array support); §8 documents `devWarning(condition, message)` with an `[Annexus UI]` prefix. The story (the contract) implements `clsx` re-export and a 3-arg `[Component] message` form. Future component stories that follow the patterns doc will call `devWarning` with the wrong arity (a compile error) — or, worse, will be told arrays are unsupported.
**Fix**: update §3.3 and §8 to the story signatures, e.g. `devWarning(condition, 'Slider', 'value (…) is outside the range […]')`. (Doc change, ARCHITECT/DEV.)

**Resolution** (2026-10-21, DEV):
- Fix: Patterns doc §3.3 now shows the `clsx` re-export; §8 shows `devWarning(condition, component, message)` with the `[Component] message` form and the Slider example updated.
- Commit / change ref: `docs/architecture/design/01-patterns-and-standards-greenfield.md` §3.3, §8
- Test evidence: Doc change — no test; code matches (`src/utils/devWarning.ts`, `src/utils/classNames.ts`)
- Status: ✅ Resolved

### ISS-002 🟡 Medium — Maintainability: `env.d.ts` will break if `@types/node` is added later
**File**: `src/types/env.d.ts:3`
`declare const process: …` conflicts with Node's global `process` declaration as soon as any dependency pulls `@types/node` into the program (Story 3.3 Storybook / 3.4 Vitest setup or CI tooling are plausible). Result would be `TS2451: Cannot redeclare block-scoped variable 'process'`, failing `pnpm typecheck` in an unrelated story.
**Fix (pick one)**: (a) keep the file but add a comment: "delete this file if `@types/node` is installed", and make that part of the 3.3/3.4 checklists; or (b) avoid the global entirely by reading the flag through a typed helper in `devWarning.ts`, e.g. `const isProduction = (): boolean => (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV === 'production';` — no ambient declaration, and it is also safe in runtimes where `process` is undefined (bundlers that don't replace it). Note (b) would not be statically replaced by consumer bundlers, so (a) is preferred.

**Resolution** (2026-10-21, DEV):
- Fix: Option (a): `env.d.ts` now says to delete it if `@types/node` is installed. Not added to the 3.3/3.4 story files (Salvador's) — flagged below.
- Commit / change ref: `src/types/env.d.ts:3`
- Test evidence: `pnpm typecheck` exit 0 (non-testable comment change)
- Status: ✅ Resolved

### ISS-003 🟢 Low — Pattern: `Input` still imports `clsx` directly
**File**: `src/components/Input/Input.tsx:2`
Story 3.5 intent: "component files use `classNames(...)` rather than importing `clsx` directly, making the utility swappable." Input predates this story and is out of scope here.
**Fix**: swap to `import { classNames } from '../../utils/classNames'` in a follow-up (or when Input is next touched).

### ISS-004 🟢 Low — Maintainability: emitted `dist/utils/classNames.d.ts` references `clsx`
**File**: `dist/utils/classNames.d.ts` (generated)
`clsx` is a devDependency, so this `.d.ts` points at a package consumers won't have. Harmless today because nothing in `dist/index.d.ts` reaches it. It becomes a real break if `classNames` is ever put on a public prop type or the barrel.
**Fix**: none needed now; keep `classNames`/`devWarning` internal (as the patterns doc §7.1 requires), or move `clsx` to `dependencies` if that ever changes.

### ISS-005 🟢 Low — Testing: `devWarning.test.ts` restores `NODE_ENV` unsafely
**File**: `src/utils/devWarning.test.ts:10,14`
`process.env.NODE_ENV = originalEnv` writes the string `"undefined"` if the original was unset. Vitest sets `NODE_ENV='test'`, so it is a non-issue today.
**Fix**: use `vi.stubEnv('NODE_ENV', 'production')` with `vi.unstubAllEnvs()` in `afterEach`.

**Resolution** (2026-10-21, DEV):
- Fix: Switched to `vi.stubEnv('NODE_ENV', …)` with `vi.unstubAllEnvs()` in `afterEach`; no manual `process.env` writes.
- Commit / change ref: `src/utils/devWarning.test.ts:6-17`
- Test evidence: `src/utils/devWarning.test.ts` 3/3 green; full suite 35/35
- Status: ✅ Resolved

---

## Verdict

⚠️ **APPROVED WITH COMMENTS** — 0 🔴, 0 🟠. Zero blockers, all acceptance criteria and quality gates verified. ISS-001 and ISS-002 should be handled before CYCLE-1 closes (cheap, and ISS-002 can fail an unrelated story); ISS-003–005 are optional.

**Next step**: `aire-dev-remediate` for ISS-001/002 (optionally 003/005), then QA (`aire-qa-validate 3.5`).

---

# 🛠️ Remediation — 2026-10-21

**Developer**: DEV Agent
**Severity Scope**: 🟡 Medium + selected 🟢 Low (no 🔴/🟠 existed)
**Scenario**: Code Review
**Stories Affected**: 3.5

## Issues Remediated

| ID | Severity | Story | File:Line | Summary | Resolution | Test Added |
|----|----------|-------|-----------|---------|------------|------------|
| ISS-001 | 🟡 Medium | 3.5 | patterns doc §3.3, §8 | Doc contradicted implemented utilities | Aligned to story signatures | n/a (doc) |
| ISS-002 | 🟡 Medium | 3.5 | `src/types/env.d.ts:3` | Breaks if `@types/node` is added | Removal note added | n/a (comment) |
| ISS-005 | 🟢 Low | 3.5 | `src/utils/devWarning.test.ts` | Unsafe `NODE_ENV` restore | `vi.stubEnv` / `unstubAllEnvs` | existing 3 tests ✅ |

## Issues Deferred (with user consent)

| ID | Severity | Story | Reason |
|----|----------|-------|--------|
| ISS-003 | 🟢 Low | 3.5 | `Input` is already-merged code owned by Salvador; migrate to `classNames` in a follow-up |
| ISS-004 | 🟢 Low | 3.5 | Informational; no change needed while `classNames` stays internal |

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `docs/architecture/design/01-patterns-and-standards-greenfield.md` | Modified | §3.3 and §8 aligned with Story 3.5 |
| `src/types/env.d.ts` | Modified | Added removal note |
| `src/utils/devWarning.test.ts` | Modified | `vi.stubEnv` instead of manual env writes |

## Patterns Applied

| Pattern | Where Applied | Notes |
|---------|---------------|-------|
| Vitest env stubbing | `devWarning.test.ts` | Auto-restores via `vi.unstubAllEnvs()` |

## Testing Summary

- **Targeted tests added**: 0 (changes are doc/comment/test-refactor; existing tests cover behaviour)
- **Full suite**: 35/35 passing
- **Coverage**: 100% (target ≥85%; repo gate 90%)
- `pnpm typecheck`, `pnpm lint` (0 warnings), `pnpm build` all exit 0

## Deviations from Report Suggestions

- ISS-002: the report also suggested adding a watch-item to the 3.3/3.4 checklists. Not done — those story files belong to Salvador; the note lives in `env.d.ts` instead. Someone should tell Salvador before 3.3/3.4 add `@types/node`.

## Lessons Learned

1. Keep the patterns doc in step with story-level signatures when a story overrides it.

## Next Steps

- [ ] Re-request code review (`aire-review-code`) — optional, no 🔴 fixed
- [ ] QA validation (`aire-qa-validate 3.5`)
