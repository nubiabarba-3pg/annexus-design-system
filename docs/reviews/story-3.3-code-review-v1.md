# Code Review - Story 3.3: Storybook 8.x Setup

> ## 🛠️ Remediation Status: ✅ Resolved (ISS-001); ISS-002–005 deferred
> - **Remediated**: 2026-10-20 by DEV Agent
> - **Fixed**: 1 issue(s) — 🔴 0 / 🟠 0 / 🟡 1 / 🟢 0
> - **Deferred (with user consent)**: 4 — ISS-002, ISS-003, ISS-005 (optional), ISS-004 (→ Story 3.6)
> - **Tests**: N/A (config-only; story specifies manual verification) | **Coverage**: N/A | **Linter**: clean (`pnpm lint` + `eslint .storybook` exit 0)
> - **Scenario**: Code Review

**Date**: 2026-10-20
**Reviewed By**: REVIEWER Agent
**Review Number**: 1
**Review Mode**: INITIAL_REVIEW
**Status**: ⚠️ APPROVED WITH COMMENTS

> **Independence note**: this review ran in the same session that implemented the story. Every claim was re-checked against live command output and the built artifacts, but a second reviewer pass is still a good idea before merge.

---

## Review Metadata

**Previous Review**: None
**Previous Status**: N/A
**Files Changed Since Last Review**: All (initial review)
**Severity Threshold Applied**: All severities (🔴 🟠 🟡 🟢)
**Branch**: `feat/cycle-1-story-3.3-storybook` (stacked on `0d9e152` — Story 3.2)

---

## Review Summary

**Components Reviewed**:
- `.storybook/main.ts` (new)
- `.storybook/preview.ts` (new)
- `.gitignore` (modified — `storybook-static/`)
- `docs/stories-implemented/story-3.3-review.md` (new)
- `docs/status.md` (modified)

**Lines of Code**: ~35 (configuration)
**Tests Reviewed**: N/A. The story specifies manual verification ("Tests (manual)"), and Vitest arrives in Story 3.4.
**Coverage**: N/A (config-only story)

**Overall Assessment**: Both config files match the story's Steps 1–2. All 8 technical ACs are verifiable, and the build, typecheck, lint and dev-server gates pass on a live re-run. There are no blockers. One medium finding: Storybook's preview loads only the token partials, not the library's global stylesheet, so stories (and future Chromatic baselines) render without the `box-sizing` reset that consumers get from `@annexus/ui/style.css`. The rest are low-severity hygiene items, mostly already flagged in the DEV self-review.

---

## Checklist Results

### Correctness
- [x] ✅ `framework.name` is `@storybook/react-vite` (`.storybook/main.ts:7`); built `project.json` confirms it
- [x] ✅ Addons `addon-essentials` + `addon-a11y` (`.storybook/main.ts:5`); `storybook-static/sb-addons/` has `a11y-9` plus 8 `essentials-*` bundles
- [x] ✅ Stories glob is exactly `../src/**/*.stories.@(js|jsx|ts|tsx)` (`.storybook/main.ts:4`)
- [x] ✅ Token import at `.storybook/preview.ts:2`. The built `preview-*.css` contains `--annexus-color-brand-primary`
- [x] ⚠️ Preview omits the global reset in `src/styles.scss` (see ISS-001)
- [x] ✅ `pnpm build-storybook` exits 0 and `storybook-static/index.html` exists (re-verified)
- [x] ✅ No obvious bugs

### Pattern Adherence
- [x] ✅ react-vite framework shares the library's Vite/SCSS pipeline (architecture: Storybook 8.x)
- [x] ✅ a11y addon registered globally, with no per-story config needed (patterns §5.3)
- [x] ✅ Autodocs opt-in via `tags: ['autodocs']` (patterns §5.1, §10.3)
- [x] ⚠️ `docs.autodocs` is marked `@deprecated` in Storybook 8.6 types (see ISS-002)

### Testing
- [x] ✅ Story declares manual tests only. The DEV self-review records red (exit 7) → green (exit 0) build evidence
- [x] ✅ Dev server and browser checks recorded (HTTP 200, empty `index.json`, 51 tokens resolved in the iframe via CDP)
- [x] ✅ Idempotency recorded (two builds produce an identical file list)

### Documentation
- [x] ✅ Self-review exists, with Gate 1/2/3 evidence tables
- [x] ✅ Deviations are documented candidly ("zero console errors" not literally met on an empty index; favicon 404; version skew; stray `index.d.ts`)
- [x] ✅ No TODO comments. The single comment in `preview.ts:13` is from the story snippet

### Security
- [x] ✅ No secrets and no Chromatic token in config (Chromatic is deferred to 3.6)
- [x] ✅ `storybook-static/` is git-ignored, so build output and telemetry `project.json` stay out of the repo

### Performance
- [x] ✅ Storybook build runs in ~3s
- [x] ⚠️ `vite-plugin-dts` runs during the Storybook build and emits a stray `index.d.ts` (see ISS-005)

### SOLID / Anti-Monolith / Maintainability
- [x] ✅ N/A for SOLID (config). Both files are minimal and match the story snippets
- [x] ⚠️ `.storybook/` sits outside `pnpm typecheck` and `pnpm lint` coverage (see ISS-004)

---

## Issues Found

### ISS-001: Storybook preview loads tokens only, not the library's global stylesheet 🟡 Medium

**Category**: Correctness / Visual fidelity
**File**: `.storybook/preview.ts:2`
**Pattern Reference**: Architecture — Chromatic is the visual-regression source of truth and hosts the published Storybook

**Issue**:
Consumers get `@annexus/ui/style.css`, which is compiled from `src/styles.scss`: tokens **plus** the global `*, *::before, *::after { box-sizing: border-box; }` reset. Storybook imports only `src/tokens/index.scss`, so stories render with the browser default `content-box`.

**Evidence**:
```
storybook preview css box-sizing: 0
dist/style.css box-sizing: 1
```

**Why This Matters**: From CYCLE-2 onward, any component with padding plus a border plus an explicit width/height (Button, Input, Toggle…) will measure differently in Storybook than in consuming apps. The Chromatic baselines will then encode the wrong geometry, and a later fix will show up as a mass visual diff. This is cheapest to fix now, while no stories exist.

**Suggested Fix**: import the same entry the library ships. `src/styles.scss` already `@use`s the tokens, so they're still included:
```typescript
import type { Preview } from '@storybook/react';
import '../src/styles.scss';
```
This deviates from the literal AC text (`import '../src/tokens/index.scss'`) but meets its stated intent ("all component stories have access to `--annexus-*` properties"). Record it in the self-review's Deviations if adopted. If the literal AC must stand, keep the tokens import and add `import '../src/styles.scss';` too. The duplicated `:root` block is harmless.

---

### ISS-002: `docs.autodocs` is deprecated in Storybook 8.6 🟢 Low

**Category**: Maintainability / Forward-compat
**File**: `.storybook/main.ts:10-12`

**Issue**:
The installed `@storybook/core` 8.6.19 types mark the option deprecated:
```
 * Should we generate a docs entry per CSF file? Set to 'tag' (the default) ...
 * @deprecated Use `tags: ['autodocs']` in `.storybook/preview.js` instead
autodocs?: boolean | 'tag';
```
`'tag'` is already the default, so the line has no effect today, and it will need removing in a Storybook 9 upgrade.

**Assessment**: The story AC explicitly requires `docs: { autodocs: 'tag' }`, so the implementation is correct to the spec. Don't move autodocs to a global `tags` in `preview.ts`: the patterns doc wants autodocs to stay opt-in per story meta.

**Suggested action** (optional): keep it for AC compliance, and add a note in the self-review / Story 3.6 backlog to drop it when upgrading to Storybook 9.

---

### ISS-003: `@storybook/addon-essentials` version skew (8.6.14 vs 8.6.19) 🟢 Low

**Category**: Dependency hygiene
**File**: `pnpm-lock.yaml` (not changed by this story)

**Issue**: `pnpm storybook` prints an "incompatible packages" warning on every start, because essentials resolved to 8.6.14 while `storybook`, `@storybook/react`, `react-vite` and `addon-a11y` are at 8.6.19. Functionally harmless (patch-level), but it's noise at the console-cleanliness AC, and every dev and CI run will hit it.

**Suggested Fix**: `pnpm update @storybook/addon-essentials` (lockfile-only change). Coordinate with Dev 2: the 3.4 Vitest setup also edits `pnpm-lock.yaml`, so whichever merges second rebases.

---

### ISS-004: `.storybook/` is not covered by `pnpm typecheck` or `pnpm lint` 🟢 Low

**Category**: Quality gates / CI
**Files**: `tsconfig.json:19` (`include: ["src"]`), `package.json` `lint` script (`eslint src …`)

**Issue**: The DEV ran ad-hoc `tsc` and `eslint` on `.storybook/` (both clean), but the project scripts that Story 3.6 CI will run skip these files. A type error in `main.ts` would only surface at `build-storybook` time, and lint drift would not surface at all.

**Suggested action**: handle in Story 3.6 (CI/CD). Either widen `tsconfig.json` `include` to `["src", ".storybook"]` and the lint script to `eslint src .storybook …`, or add a `tsconfig.storybook.json`. Not a 3.3 blocker, since the story's Files Touched excludes both files.

---

### ISS-005: Library `vite-plugin-dts` runs inside the Storybook build 🟢 Low

**Category**: Build hygiene
**File**: `.storybook/main.ts` (no `viteFinal`); root `vite.config.ts:9`

**Issue**: Storybook's react-vite builder loads the root `vite.config.ts`, including `dts()`. The Storybook build logs `[vite:dts] Start generate declaration files...` and writes `storybook-static/index.d.ts`, which ends up in the Chromatic upload.

**Suggested Fix** (optional):
```typescript
viteFinal: async (config) => ({
  ...config,
  plugins: config.plugins?.filter(
    (plugin) => !(plugin && 'name' in plugin && plugin.name === 'vite:dts'),
  ),
}),
```
Fine to defer. It has no functional impact.

---

## Notes (not issues)

- **Merge order**: The story header says `Requires: [3.1]`, but `preview.ts` imports `src/tokens/index.scss` from Story 3.2. The branch is correctly stacked on `0d9e152`, so the 3.3 PR must merge after the 3.2 PR. Worth correcting `Requires` to `[3.1, 3.2]` in the story file and `dependency-graph.yml` the next time the plan is touched.
- **Assistant font**: the tokens declare `'Assistant', sans-serif`, but nothing in the repo loads the Assistant webfont, and none of the architecture, UI/UX or requirements docs say who loads it (the library or the consumer). Storybook and Chromatic will render the `sans-serif` fallback. This is outside 3.3's scope ("no custom theme"), but it needs an owner before CYCLE-2 baselines are captured. Raise with UI_UX_DESIGNER / ARCHITECT.
- **Console errors on an empty index**: I agree with the DEV's assessment. `SB_PREVIEW_API_0008 EmptyIndexError` is Storybook's own empty-state signal, and the dev-server favicon 404 is Storybook-internal. Neither comes from this config, and suppressing them would be wrong.

---

## Issue Summary

| # | ID | Severity | Category | File | Status |
|---|-----|----------|----------|------|--------|
| 1 | ISS-001 | 🟡 Medium | Correctness / Visual fidelity | `.storybook/preview.ts:2` | Recommended before merge |
| 2 | ISS-002 | 🟢 Low | Forward-compat | `.storybook/main.ts:10-12` | Optional |
| 3 | ISS-003 | 🟢 Low | Dependency hygiene | `pnpm-lock.yaml` | Optional |
| 4 | ISS-004 | 🟢 Low | Quality gates | `tsconfig.json:19`, `package.json` | Defer to 3.6 |
| 5 | ISS-005 | 🟢 Low | Build hygiene | `.storybook/main.ts` | Optional |

**Summary**:
- Blockers: 0
- High: 0
- Medium: 1
- Low: 4

---

## What Was Done Well

1. ✅ Config matches the story snippets exactly, with no gold-plating (no theme, no Chromatic, no stories)
2. ✅ Real red→green evidence: `build-storybook` exit 7 before config, exit 0 after
3. ✅ The browser-level check (headless Chrome via CDP) proves the tokens actually resolve in the preview iframe, not just that the build passed
4. ✅ The DEV caught and stacked on the hidden 3.2 dependency instead of building on uncommitted files
5. ✅ Candid deviations: the "zero console errors" gap is reported rather than papered over
6. ✅ `storybook-static/` git-ignored before it could be committed

---

## Acceptance Criteria Verification

| Criterion | Status | Evidence |
|-----------|--------|----------|
| `main.ts` framework is `@storybook/react-vite` | ✅ Pass | `.storybook/main.ts:7`; `project.json` |
| Addons include `addon-essentials` and `addon-a11y` | ✅ Pass | `.storybook/main.ts:5`; `sb-addons/` |
| Stories glob `['../src/**/*.stories.@(js\|jsx\|ts\|tsx)']` | ✅ Pass | `.storybook/main.ts:4` |
| `docs: { autodocs: 'tag' }` | ✅ Pass | `.storybook/main.ts:10-12` (deprecated — ISS-002) |
| `preview.ts` imports `'../src/tokens/index.scss'` | ✅ Pass | `.storybook/preview.ts:2` (fidelity gap — ISS-001) |
| `pnpm storybook` on port 6006; zero console errors; empty sidebar | ⚠️ Pass with note | :6006 → 200; `index.json` entries `{}`; only Storybook-internal empty-index error + favicon 404 |
| `pnpm build-storybook` exits 0; `storybook-static/index.html` exists | ✅ Pass | Live re-run |
| a11y addon visible in addons panel | ⚠️ Deferred visual check | Panel registered in `sb-addons/a11y-9/manager-bundle.js` ("Accessibility"); visual check after first CYCLE-2 story, per story Tests |
| No TS errors in `.storybook/` (Quality) | ✅ Pass | Strict `tsc --noEmit` on both files → exit 0 |
| No component stories / Chromatic / theme (OUT) | ✅ Pass | 0 `*.stories.*`; no `chromatic` refs; no `manager.ts` |

---

## Approval Status

**Decision**: ⚠️ APPROVED WITH COMMENTS

**Reason**: All ACs pass or are deferred exactly as the story itself defers them, and there are no blockers or high-severity issues. ISS-001 is recommended before merge because it gets more expensive once CYCLE-2 stories and Chromatic baselines exist. ISS-002–005 are optional or belong to Story 3.6.

**Next Steps**:
1. Recommended: fix ISS-001 (`aire-dev-remediate 3.3`) — import `src/styles.scss` in `preview.ts`
2. Optional: ISS-003 lockfile bump (coordinate with Dev 2), ISS-005 `viteFinal` filter
3. Carry ISS-004 (and ISS-002's Storybook 9 note) into Story 3.6
4. Raise the Assistant font-loading ownership question before CYCLE-2
5. Then: `aire-qa-test-plan 3.3` → `aire-qa-validate 3.3`

---

## Sign-Off

**Reviewer**: REVIEWER Agent
**Date**: 2026-10-20
**Signature**: ⚠️ Approved With Comments

---

# 🛠️ Remediation — 2026-10-20

**Developer**: DEV Agent
**Severity Scope**: ISS-001 only (🟡 Medium). The user selected it; the 🟢 Low items were left as optional or deferred.
**Scenario**: Code Review
**Stories Affected**: 3.3

## Issues Remediated

| ID | Severity | Story | File:Line | Summary | Resolution | Test Added |
|----|----------|-------|-----------|---------|------------|------------|
| ISS-001 | 🟡 Medium | 3.3 | `.storybook/preview.ts:3-4` | Preview lacked the library's global reset | Added `import '../src/styles.scss';` alongside the AC-mandated tokens import | N/A — config change; verified by build CSS grep and computed style in browser |

**Resolution** (ISS-001):
- Fix: kept `import '../src/tokens/index.scss'` (literal AC) and added `import '../src/styles.scss'` with a one-line WHY comment. This is the review's fallback option. It was picked over replacing the import so that the AC text QA validates against still matches exactly.
- Change ref: `.storybook/preview.ts:3-4`
- Test evidence:
  ```
  before: box-sizing in preview css = 0
  after:  box-sizing in preview css = 1; brand-primary present = 1
  build-storybook exit=0   (storybook-static/index.html present)
  ```
  Headless Chrome 155 (CDP) on `http://localhost:6006/iframe.html`:
  ```
  { "boxSizing": "border-box", "uniqueTokens": 51, "brand": "#11175e" }
  ```
  The only console issue is the Storybook dev-server `favicon.ico` 404 (unchanged, Storybook-internal).
- Status: ✅ Resolved

## Issues Deferred (with user consent)

| ID | Severity | Reason | Target |
|----|----------|--------|--------|
| ISS-002 | 🟢 Low | `docs.autodocs` is required by the AC; drop it on the Storybook 9 upgrade | Future upgrade |
| ISS-003 | 🟢 Low | Lockfile bump conflicts with Dev 2's 3.4 lockfile work | After 3.4 merges |
| ISS-004 | 🟢 Low | `tsconfig`/lint-script scope belongs with the CI gates | Story 3.6 |
| ISS-005 | 🟢 Low | Stray `index.d.ts` in `storybook-static/` has no functional impact | Optional |

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `.storybook/preview.ts` | Modified | Added global stylesheet import (`../src/styles.scss`) |
| `docs/stories-implemented/story-3.3-review.md` | Modified | Updated line refs + recorded the deviation |

## Patterns Applied

| Pattern | Where Applied | Notes |
|---------|---------------|-------|
| Storybook mirrors the consumer stylesheet | `.storybook/preview.ts:3-4` | Chromatic baselines render with the same global CSS as `@annexus/ui/style.css` |
| Comment WHY not WHAT | `.storybook/preview.ts:3` | States why a second stylesheet is imported |

## Testing Summary

- **Targeted tests added**: 0 (config change; no Vitest until Story 3.4)
- **Verification**: `pnpm build-storybook` exit 0; `pnpm typecheck` exit 0; `pnpm lint` exit 0; `pnpm build` exit 0; `eslint .storybook` / strict `tsc` on `.storybook/` / `prettier --check .storybook` clean
- **Coverage**: N/A

## Deviations from Report Suggestions

- Used the review's fallback (keep the tokens import and add `styles.scss`) instead of the primary suggestion (replace it). This keeps AC 5 literally true for QA. The cost is a duplicated token `:root` block in the preview CSS.

## Lessons Learned

1. A Storybook preview should load the same global CSS the package ships, not just the tokens. Otherwise visual-regression baselines drift from real usage.

## Next Steps

- [ ] ✅ No re-review required (single 🟡 fix, no blockers/high)
- [ ] `aire-qa-test-plan 3.3` → `aire-qa-validate 3.3`
