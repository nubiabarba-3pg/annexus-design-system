# Code Review - Story 3.2: SCSS Design Tokens

> ## 🛠️ Remediation Status: ✅ Resolved
> - **Remediated**: 2026-10-20 by DEV Agent (2 passes: ISS-001/002, then ISS-003/004 after v2 approval)
> - **Fixed**: 4 issue(s) — 🔴 0 / 🟠 1 / 🟡 1 / 🟢 2
> - **Deferred (with user consent)**: 0
> - **Tests**: N/A (no Vitest until Story 3.4; verified by token diff, Sass compile, and byte-identical `dist/style.css`) | **Coverage**: N/A | **Linter**: clean
> - **Scenario**: Code Review

**Date**: 2026-10-20
**Reviewed By**: REVIEWER Agent
**Review Number**: 1
**Review Mode**: INITIAL_REVIEW
**Status**: ❌ CHANGES REQUESTED

> **Independence note**: this review ran in the same session as the Story 3.3 review, on the same workstation that implemented the story. Every claim below was re-checked against live command output and the built `dist/style.css`.

---

## Review Metadata

**Previous Review**: None
**Previous Status**: N/A
**Files Changed Since Last Review**: All (initial review)
**Severity Threshold Applied**: All severities (🔴 🟠 🟡 🟢)
**Commit Reviewed**: `0d9e152` (branch `feat/cycle-1-story-3.2-design-tokens`; also the base of `feat/cycle-1-story-3.3-storybook`)

---

## Review Summary

**Components Reviewed**:
- `src/tokens/_colors.scss` (new)
- `src/tokens/_typography.scss` (new)
- `src/tokens/_spacing.scss` (new)
- `src/tokens/_shadows.scss` (new)
- `src/tokens/index.scss` (new)
- `src/styles.scss` (modified: `@use 'tokens';`)
- `docs/stories-implemented/story-3.2-review.md` (new)

**Lines of Code**: ~95 (SCSS)
**Tests Reviewed**: N/A. The story specifies manual verification ("Tests (manual)"), and Vitest arrives in Story 3.4.
**Coverage**: N/A (CSS-only story)

**Overall Assessment**: The token partials match the story's Steps 1–5. Every value matches `docs/ui-ux/ui-ux-spec.md`, and where the spec is silent, the value comes from the story snippet. The build, typecheck, lint and Prettier gates pass on a live re-run, and the build is idempotent. The one significant problem is the **token-name contract with downstream stories**. Four custom-property names that seven CYCLE-2 stories reference are not defined here. Those components would silently render their `var()` fallbacks instead of the tokens. The self-review's Gate 3 says this was checked and passed, but it wasn't.

---

## Checklist Results

### Correctness
- [x] ✅ All 19 color tokens present with spec values (`_colors.scss:4-28`). gray-700 is `#404042` per the spec, not the story snippet's `#414651` (documented deviation; agreed)
- [x] ✅ Typography: family, size xs–2xl, weight regular–bold, line-height xs–lg (`_typography.scss:3-23`)
- [x] ✅ Spacing `--annexus-spacing-{1,2,3,4,5,6,8,10,12}` (`_spacing.scss:3-11`)
- [x] ✅ Shadows xs / xs-skeuomorphic / lg, radius sm 3px / md 4px / full 9999px, touch targets (`_shadows.scss:3-18`)
- [x] ✅ `index.scss` uses `@forward` only, with no `@import` (`index.scss:2-5`)
- [x] ✅ `dist/style.css` has all 51 unique `--annexus-*` properties at `:root`, each defined exactly once
- [x] ❌ Downstream token names not defined (see ISS-001)

### Pattern Adherence
- [x] ✅ `--annexus-{category}-{scale}-{variant}` naming throughout
- [x] ✅ SCSS module system (`@use` / `@forward`)
- [x] ⚠️ Patterns doc §4.1/§4.3/§4.4 describe a token API this story does not (and per its AC should not) provide (see ISS-002)

### Testing
- [x] ✅ Manual tests reproduced: `pnpm build` exit 0, `dist/style.css` non-empty (1.99 kB), 51 properties (≥ 30 required)
- [x] ✅ Idempotency: two consecutive builds → `cmp` identical
- [x] ✅ `grep` for `annexus-color-brand-primary` and `annexus-shadow-lg` both match

### Documentation
- [x] ✅ Self-review exists, with Gate 1/2/3 tables and candid deviations
- [x] ❌ Gate 3 claim "token names used by downstream stories … all exist" is incorrect (see ISS-001)
- [x] ⚠️ Minor inaccuracies in the self-review and file header comments (see ISS-003, ISS-004)
- [x] ✅ No TODO comments, no commented-out code

### Security
- [x] ✅ N/A. Static CSS custom properties only; no secrets, no user input

### Performance
- [x] ✅ 1.99 kB (0.64 kB gzip). A scratch build with two component SCSS files that each `@use` the token barrel still emitted each property once, because the minifier deduplicates them. No bloat risk from the per-component `@use` pattern

### SOLID / Anti-Monolith / Maintainability
- [x] ✅ One partial per token category, with a single barrel. N/A for SOLID (CSS)
- [x] ✅ OUT-of-scope respected: no `tokens.ts`, no dark-mode overrides, no component-specific tokens

---

## Issues Found

### ISS-001: Four token names referenced by CYCLE-2 stories are not defined 🟠 High

**Category**: Contract Consistency (DoD Gate 3)
**Files**: `src/tokens/_colors.scss:10-11,15`, `src/tokens/_typography.scss:3`; `docs/stories-implemented/story-3.2-review.md` (Gate 3)
**Pattern Reference**: Story 3.2 AC: "All component stories referencing these tokens render without fallback values visible"

**Issue**:
Story 3.2 defines the canonical names, but seven downstream stories (written in the same planning pass) reference shorter aliases that do not exist:

| Referenced in stories | Defined by 3.2 | Stories affected |
|---|---|---|
| `--annexus-color-white` | `--annexus-color-neutral-white` | 1.1, 1.2, 1.3, 2.1, 2.2, 2.3 |
| `--annexus-color-error` | `--annexus-color-semantic-error` | 1.2, 1.4 |
| `--annexus-color-success` | `--annexus-color-semantic-success` | 1.4 |
| `--annexus-font-family` | `--annexus-font-family-base` | 1.1, 1.2, 1.4, 2.1, 2.2, 2.3 |

**Evidence** (every `var(--annexus-*)` in `docs/plans/stories/` diffed against the properties emitted in `dist/style.css`):
```
used-but-undefined:
--annexus-color-error    (epic-1-story-1.2-input.md epic-1-story-1.4-badge.md)
--annexus-color-success  (epic-1-story-1.4-badge.md)
--annexus-color-white    (1.1-button 1.2-input 1.3-toggle 2.1-slider 2.2-tooltip 2.3-dropdown-nav)
--annexus-font-family    (1.1-button 1.2-input 1.4-badge 2.1-slider 2.2-tooltip 2.3-dropdown-nav)
```
Every other downstream `var()` reference resolves, and every hex fallback matches its defined value.

**Why This Matters**: Each of these references carries a fallback (`var(--annexus-color-white, #ffffff)`), so nothing breaks visibly. Components would quietly bypass the token system: a future token change (for example, a brand refresh of `semantic-error`) would not reach Input or Badge, and no build, lint or test would flag it. That defeats the story's purpose and fails its last AC. The self-review's Gate 3 records this check as ✅, so the gap would otherwise have gone straight to QA.

**Suggested Fix**: pick one, before CYCLE-2 starts:

- **Option A (recommended): align the stories to the canonical names.** Update the seven story files (and the patterns doc, see ISS-002) to use `neutral-white`, `semantic-error`, `semantic-success` and `font-family-base`. No token code changes; it keeps one name per value, consistent with the `{category}-{scale}-{variant}` convention. This is a planning-artifact edit (PRODUCT_OWNER / ARCHITECT).
- **Option B: add aliases in 3.2.** This leaves the stories untouched but permanently carries two names per value:
  ```scss
  // _colors.scss
  --annexus-color-white: var(--annexus-color-neutral-white);
  --annexus-color-error: var(--annexus-color-semantic-error);
  --annexus-color-success: var(--annexus-color-semantic-success);
  // _typography.scss
  --annexus-font-family: var(--annexus-font-family-base);
  ```

Under either option, correct the Gate 3 row in `docs/stories-implemented/story-3.2-review.md` and record how it was verified (e.g. the used-vs-defined diff above).

**Resolution** (2026-10-20, DEV):
- Fix: Option A (user choice). 45 references across 7 story files renamed to the canonical 3.2 names; self-review Gate 3 corrected with the diff method
- Change ref: `docs/plans/stories/epic-1-story-1.{1,2,3,4}-*.md`, `epic-2-story-2.{1,2,3}-*.md`; `docs/stories-implemented/story-3.2-review.md` (Gate 3)
- Test evidence: used-vs-defined diff over `docs/plans/stories/` + patterns doc → 0 undefined (was 4)
- Status: ✅ Resolved

---

### ISS-002: Patterns doc describes a token API that does not exist 🟡 Medium

**Category**: Pattern / Documentation consistency (owner: ARCHITECT)
**File**: `docs/architecture/design/01-patterns-and-standards-greenfield.md:350-366, 403, 425-427`

**Issue**:
§4.1 shows component SCSS doing `@use '../../tokens/colors' as *;` and then using SCSS variables (`$spacing-2`, `$font-size-body-md`, `$radius-md`). It also uses custom properties `--annexus-color-primary-500`, `--annexus-color-primary-600` and `--annexus-color-white`. §4.3 defaults to `--annexus-color-primary-500`, and §4.4 uses `$target-size-min`. Story 3.2 deliberately provides CSS custom properties only (no SCSS variables), with different names (`brand-primary`, `brand-hover`, `neutral-white`, `--annexus-touch-target-min`). A DEV copying the patterns-doc snippet would hit `Undefined variable` compile errors, or silently get unset properties.

**Assessment**: Not a defect in the 3.2 code. The story AC is explicit, and no CYCLE-2 story uses `$` variables (verified by grep). But many stories list the patterns doc as **Must Read**, so the conflict should be resolved alongside ISS-001.

**Suggested Fix**: rewrite §4.1/§4.3/§4.4 examples to `var(--annexus-…)` with the 3.2 names (e.g. `padding: var(--annexus-spacing-2) var(--annexus-spacing-4)`, `min-height: var(--annexus-touch-target-min)`). Optionally note that `@use '../../tokens/index'` is needed only for its `:root` side effect, since the module exposes no members.

**Resolution** (2026-10-20, DEV):
- Fix: §4.1 example rewritten to `@use '../../tokens/index' as tokens` + `var(--annexus-…)` with 3.2 names, plus a note that tokens expose no SCSS `$` members; §4.3 mixin default → `--annexus-color-brand-primary`; §4.4 → `var(--annexus-touch-target-min)`
- Change ref: `docs/architecture/design/01-patterns-and-standards-greenfield.md` §4.1, §4.3, §4.4
- Test evidence: §4.1 snippet compiled with `sass` against `src/tokens/` — before: `Error: Undefined variable.`; after: compiles
- Status: ✅ Resolved

---

### ISS-003: Self-review says "single `:root {}` block"; output has four 🟢 Low

**Category**: Documentation accuracy
**File**: `docs/stories-implemented/story-3.2-review.md` (Testing Summary)

**Issue**: `dist/style.css` contains one `:root{…}` block per partial (4 total). Functionally identical; just correct the wording so QA's DevTools check matches the description.

**Resolution** (2026-10-20, DEV):
- Fix: wording changed to "one `:root {}` block per partial (4)"
- Change ref: `docs/stories-implemented/story-3.2-review.md:39`
- Test evidence: `grep -o ':root' dist/style.css | wc -l` → 4
- Status: ✅ Resolved

---

### ISS-004: Partial headers attribute all values to `ui-ux-spec.md` 🟢 Low

**Category**: Documentation accuracy
**Files**: `src/tokens/_colors.scss:1`, `_typography.scss:1`, `_spacing.scss:1`, `_shadows.scss:1`

**Issue**: Several values are not in the spec and come from the story snippet instead: gray-600/800, font-size lg/xl/2xl, weight medium, line-height lg, spacing-10 (40px is not in the spec's `[4,8,12,16,20,24,32,48]` scale). The headers say "values from docs/ui-ux/ui-ux-spec.md", which will mislead whoever reconciles tokens with Figma later (patterns doc: tokens "changed only by ARCHITECT or when Figma tokens update").

**Suggested Fix** (optional): e.g. `// Color tokens — docs/ui-ux/ui-ux-spec.md; gray-600/800 from Story 3.2`. The self-review's Deviations section already lists most of these.

**Resolution** (2026-10-20, DEV):
- Fix: headers now name the story-sourced values. `_shadows.scss:1` is unchanged, because all of its values are in the spec
- Change ref: `src/tokens/_colors.scss:1`, `src/tokens/_typography.scss:1-2`, `src/tokens/_spacing.scss:1-2`
- Test evidence: `dist/style.css` byte-identical before/after (`cmp`); build/typecheck/lint exit 0; Prettier clean
- Status: ✅ Resolved

---

## Notes (not issues)

- **gray-700 deviation**: agreed. The spec, the `03-inspiration.md` reference and every downstream fallback use `#404042`; the story snippet's `#414651` is the outlier. Worth correcting the story snippet the next time the plan is touched.
- **Story AC wording**: "all 9 gray scale values (50 through 900)" lists 10 values. The implementation correctly defines all 10.
- **`src/styles.scss` outside Files Touched**: justified and documented. Without `@use 'tokens'` nothing reaches `dist/style.css`.
- **Breakpoints** (`sm/md/lg/xl` in the spec) are not tokenized. They're not in the AC, and custom properties can't be used in `@media` queries anyway. If components need shared breakpoints, they'd need an SCSS variables/mixins module (future ARCHITECT call; ties into ISS-002).
- **Assistant font loading**: still unowned (raised in the Story 3.3 review). Tokens name the font, but nothing loads it.

---

## Issue Summary

| # | ID | Severity | Category | File | Status |
|---|-----|----------|----------|------|--------|
| 1 | ISS-001 | 🟠 High | Contract consistency | `_colors.scss:10-15`, `_typography.scss:3`, 7 CYCLE-2 stories | Must resolve before merge |
| 2 | ISS-002 | 🟡 Medium | Pattern doc consistency | `01-patterns-and-standards-greenfield.md:350-427` | Recommended (ARCHITECT) |
| 3 | ISS-003 | 🟢 Low | Doc accuracy | `story-3.2-review.md` | Optional |
| 4 | ISS-004 | 🟢 Low | Doc accuracy | `src/tokens/_*.scss:1` | Optional |

**Summary**:
- Blockers: 0
- High: 1
- Medium: 1
- Low: 2

---

## What Was Done Well

1. ✅ Values are traceable: spec first, story snippet only where the spec is silent, and deviations listed
2. ✅ Caught the gray-700 snippet/spec conflict and chose the canonical source, cross-checked against downstream fallbacks
3. ✅ Strict scope: no JS token export, no dark mode, no component tokens
4. ✅ Real verification evidence (build output, grep, token count, `cmp` idempotency), all reproduced in this review
5. ✅ Prettier-normalised source; lint and typecheck clean

---

## Acceptance Criteria Verification

| Criterion | Status | Evidence |
|-----------|--------|----------|
| `_colors.scss`: brand primary/hover/cta, semantic success/error, neutral white/black, gray 50–900 | ✅ Pass | `_colors.scss:4-28`; `dist/style.css` (hex lowercase, equivalent) |
| `_typography.scss`: family `'Assistant', sans-serif`, size xs–2xl, weight regular–bold, line-height scale | ✅ Pass | `_typography.scss:3-23` |
| `_spacing.scss`: `--annexus-spacing-{N}` scale | ✅ Pass | `_spacing.scss:3-11` |
| `_shadows.scss`: shadow xs / xs-skeuomorphic / lg; radius sm 3px / md 4px / full 9999px | ✅ Pass | `_shadows.scss:3-14` |
| `index.scss` uses `@forward` (not `@import`) | ✅ Pass | `index.scss:2-5` |
| `dist/style.css` contains all properties at `:root` after `pnpm build` | ✅ Pass | Live re-run: exit 0, 51 unique / 51 total `--annexus-*` |
| All component stories referencing these tokens render without fallback values | ❌ At risk | 4 referenced names undefined (ISS-001) |
| Quality: `pnpm build` / `pnpm typecheck` exit 0; values match `ui-ux-spec.md` | ✅ Pass | build 0, typecheck 0, lint 0, Prettier clean; values match spec |
| OUT: no JS tokens / dark mode / component tokens | ✅ Pass | No `tokens.ts`, no `prefers-color-scheme`, no component-scoped properties |

---

## Approval Status

**Decision**: ❌ CHANGES REQUESTED

**Reason**: Per the review rulebook, a 🟠 High issue blocks approval. ISS-001 is a token-contract mismatch that would silently route seven CYCLE-2 components to hard-coded fallbacks, and the self-review's Gate 3 recorded it as passing. The token code itself is correct to its spec, so the fix is small either way. It's a decision between aligning the stories (Option A) and adding aliases (Option B).

**Next Steps**:
1. Required: resolve ISS-001 via `aire-dev-remediate 3.2`. Choose Option A (update 7 story files, planning edit) or Option B (4 alias tokens), and correct the self-review Gate 3 evidence.
2. Recommended: ARCHITECT updates patterns doc §4.1/§4.3/§4.4 (ISS-002). Do this together with Option A.
3. Optional: ISS-003 / ISS-004 wording fixes.
4. Then re-request review (FIX_VERIFICATION mode) → `aire-qa-test-plan 3.2`.
5. Merge order is unchanged: 3.2 before 3.3 (3.3 is stacked on `0d9e152`).

---

## Sign-Off

**Reviewer**: REVIEWER Agent
**Date**: 2026-10-20
**Signature**: ❌ Changes Requested

---

# 🛠️ Remediation — 2026-10-20

**Developer**: DEV Agent
**Severity Scope**: Pass 1: 🟠 High (mandatory) + 🟡 ISS-002 (user selected). Pass 2 (after v2 approval): 🟢 ISS-003/004 (user selected)
**Scenario**: Code Review
**Stories Affected**: 3.2 (contract); planning artifacts for 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3

## Issues Remediated

| ID | Severity | Story | File:Line | Summary | Resolution | Test Added |
|----|----------|-------|-----------|---------|------------|------------|
| ISS-001 | 🟠 High | 3.2 | 7 CYCLE-2 story files; `story-3.2-review.md` Gate 3 | 4 referenced token names undefined | Option A: stories renamed to canonical names (45 refs); Gate 3 corrected | N/A (doc-only), verified by used-vs-defined diff: 4 → 0 |
| ISS-002 | 🟡 Medium | 3.2 | `01-patterns-and-standards-greenfield.md` §4.1/§4.3/§4.4 | Patterns doc showed `$` variables and non-existent token names | Examples rewritten to `var(--annexus-…)` with 3.2 names | N/A (doc-only), verified by Sass compile: error → compiles |
| ISS-003 | 🟢 Low | 3.2 | `story-3.2-review.md:39` | "single `:root` block" wording | Now "one `:root {}` block per partial (4)" | N/A (doc-only) |
| ISS-004 | 🟢 Low | 3.2 | `src/tokens/_colors.scss:1`, `_typography.scss:1-2`, `_spacing.scss:1-2` | Headers over-attributed values to the spec | Headers name the story-sourced values | N/A (comments), `dist/style.css` byte-identical |

**Rename map applied** (`perl` with a negative lookahead so already-canonical names are untouched):

| Old | New | Refs |
|-----|-----|------|
| `--annexus-color-white` | `--annexus-color-neutral-white` | 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3 |
| `--annexus-color-error` | `--annexus-color-semantic-error` | 1.2, 1.4 |
| `--annexus-color-success` | `--annexus-color-semantic-success` | 1.4 |
| `--annexus-font-family` | `--annexus-font-family-base` | 1.1, 1.2, 1.4, 2.1, 2.2, 2.3 |

## Issues Deferred (with user consent)

None. ISS-003/004 were deferred in pass 1 and fixed in pass 2.

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `docs/plans/stories/epic-1-story-1.1-button.md` | Modified | 4 token refs renamed |
| `docs/plans/stories/epic-1-story-1.2-input.md` | Modified | 12 token refs renamed |
| `docs/plans/stories/epic-1-story-1.3-toggle.md` | Modified | 2 token refs renamed |
| `docs/plans/stories/epic-1-story-1.4-badge.md` | Modified | 10 token refs renamed |
| `docs/plans/stories/epic-2-story-2.1-slider.md` | Modified | 4 token refs renamed |
| `docs/plans/stories/epic-2-story-2.2-tooltip.md` | Modified | 6 token refs renamed |
| `docs/plans/stories/epic-2-story-2.3-dropdown-nav.md` | Modified | 7 token refs renamed |
| `docs/architecture/design/01-patterns-and-standards-greenfield.md` | Modified | §4.1/§4.3/§4.4 token examples |
| `docs/stories-implemented/story-3.2-review.md` | Modified | Gate 3 corrected (pass 1); `:root` wording (pass 2) |
| `src/tokens/_colors.scss` | Modified | Header comment provenance (pass 2) |
| `src/tokens/_typography.scss` | Modified | Header comment provenance (pass 2) |
| `src/tokens/_spacing.scss` | Modified | Header comment provenance (pass 2) |

Pass 1 changed no source files (Option A). Pass 2 changed only `//` comments, and the compiled `dist/style.css` is byte-identical.

## Patterns Applied

| Pattern | Where Applied | Notes |
|---------|---------------|-------|
| `--annexus-{category}-{scale}-{variant}` naming | 7 story files, patterns doc | One canonical name per value |
| Tokens as CSS custom properties only | Patterns doc §4.1 | Explicit note: no SCSS `$` members |

## Testing Summary

- **Targeted checks**: 2. Used-vs-defined token diff (4 undefined → 0); Sass compile of the §4.1 snippet against `src/tokens/` (`Error: Undefined variable.` → compiles)
- **Full suite**: N/A. No Vitest config until Story 3.4
- **Gates**: `pnpm build` exit 0, `pnpm typecheck` exit 0, `pnpm lint` exit 0
- **Coverage**: N/A

```
== used-but-undefined (stories + patterns doc):
(end)
== old §4.1 snippet:
Error: Undefined variable.
== new §4.1 snippet:
.annexus-button {
  background-color: var(--annexus-color-brand-primary);
build=0  typecheck=0  lint=0
```

Pass 2:
```
build=0
style.css byte-identical      (cmp against pre-edit build)
typecheck=0
lint=0
All matched files use Prettier code style!
root blocks: 4
```

## Deviations from Report Suggestions

- None. Option A was applied as suggested; ISS-002 follows the suggested rewrite.

## Follow-ups (outside confirmed scope, not changed)

- `docs/ui-ux/03-inspiration.md:30-34` still maps Figma variables to `--annexus-color-success` / `-error` / `-white` / `-black`, and `:48-54` to `--annexus-text-*`. This table is the likely origin of the drift.
- `docs/architecture/design/00-system-architecture-greenfield.md:164-172` lists `--annexus-color-primary(-500)` and `--annexus-font-size-body-md` as example names.

Both should be aligned (UI_UX_DESIGNER / ARCHITECT) so future stories don't reintroduce the old names.

## Lessons Learned

1. A contract-consistency gate must diff the full set of references against the definitions; checking a few names by hand misses the outliers.

## Next Steps

- [x] Re-request code review (`aire-review-code 3.2`, FIX_VERIFICATION mode). Done: v2 ✅ APPROVED
- [ ] Pass 2 (🟢 comments only, CSS output byte-identical): no re-review required
- [ ] Then `aire-qa-test-plan 3.2`
