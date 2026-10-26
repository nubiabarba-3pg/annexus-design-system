# Code Review - Story 3.3: Storybook 8.x Setup

> ## 🛠️ Remediation Status: ✅ Resolved
> - **Remediated**: 2026-10-26 by DEV Agent
> - **Fixed**: 4 issue(s) — 🔴 0 / 🟠 0 / 🟡 1 / 🟢 3
> - **Deferred (with user consent)**: 0. The ISS-001 root-cause fix in Story 1.2's file is tracked as DEF-3.3-01 (owner Dev-2), not deferred
> - **Tests**: 35/35 passing | **Coverage**: 100% | **Linter**: clean
> - **Scenario**: Code Review

**Date**: 2026-10-26  
**Reviewed By**: REVIEWER Agent  
**Review Number**: 1  
**Review Mode**: INITIAL_REVIEW  
**Status**: ⚠️ APPROVED WITH COMMENTS

> **Independence note**: this review ran in a separate session from the implementation. Every claim in the DEV self-review was re-checked with live commands, built artifacts, the installed Storybook sources, and a headless-Chrome (CDP) session. Results are in "Live Verification" below.

---

## Review Metadata

**Previous Review**: None on `main`. A review of the discarded PR #5 implementation (built on the obsolete `src/tokens` layout) exists only on `origin/feat/cycle-1-story-3.3-storybook:docs/reviews/story-3.3-code-review-v1.md`. It covers different code, so it was used only for the carry-over check below.  
**Previous Status**: N/A  
**Files Changed Since Last Review**: All (initial review of the rework)  
**Severity Threshold Applied**: All severities (🔴 🟠 🟡 🟢)  
**Branch**: `feat/cycle-1-story-3.3-storybook-rework` at `41e6eb0` (= `origin/main`), with the changes uncommitted in the working tree

---

## Review Summary

**Components Reviewed**:
- `.storybook/main.ts` (new, 15 lines)
- `.storybook/preview.ts` (new, 21 lines)
- `.gitignore` (+1 line: `storybook-static/`)
- `package.json` (`@storybook/addon-essentials` `^8.0.0` → `^8.6.19`)
- `pnpm-lock.yaml` (addon-essentials subtree 8.6.14 → 8.6.19)
- `docs/stories-implemented/story-3.3-review.md` (DEV self-review, new)
- `docs/status.md` (modified)

**Lines of Code**: ~38 lines of configuration, plus the lockfile and docs  
**Tests Reviewed**: Yes. The story specifies manual tests. The reviewer re-ran the existing suite (35/35), the scripted red → green Storybook build, and the browser checks.  
**Coverage**: 100% statements / branches / functions / lines (unchanged; no `src/` change)

**Overall Assessment**: Both config files match Steps 1–2 of the story exactly. Seven of the eight technical ACs pass as written and were re-verified live. The build is idempotent down to the byte. The lockfile change is confined to the addon-essentials subtree, and every quality gate exits 0, including ad-hoc lint and type-check of `.storybook/`. AC6 ("zero console errors; empty sidebar") is not literally met. Its three console messages come from outside this story: one is a Storybook 8.6.19 core-server defect and two come from Story 1.2's TSDoc, and the reviewer confirmed both attributions at source level. However, the Story 1.2 fix is not tracked anywhere, and the self-review leaves out that the errors appear on the landing page itself (ISS-001). The other findings are low-severity accuracy issues in the docs.

---

## Live Verification (reviewer re-runs)

| # | Command | Exit | Result |
|---|---------|------|--------|
| V1 | `pnpm build-storybook` (run 1) | 0 | `storybook-static/index.html` present; 66 files |
| V2 | `pnpm build-storybook` (run 2) + file-list and `sha256sum` diff | 0 | 66 vs 66 files; **byte-identical** except `project.json` (it carries telemetry metadata) |
| V3 | Red reproduction without touching the repo: `pnpm exec storybook build -c <empty scratch dir> -o <scratch>` | 7 | `SB_CORE-SERVER_0006 (MainFileMissingError)`, `code: 6`. Same failure as the DEV's red log |
| V4 | `pnpm coverage` | 0 | 4 files, 35/35 tests; All files 100 / 100 / 100 / 100 |
| V5 | `pnpm lint` | 0 | `eslint src … --max-warnings 0` clean |
| V6 | `pnpm typecheck` | 0 | `tsc --noEmit` clean |
| V7 | `pnpm build` | 0 | `dist/index.es.js` 2.75 kB, `dist/index.cjs` 2.10 kB, `dist/style.css` 1.32 kB |
| V8 | `pnpm smoke:require` | 0 | "require smoke check passed" |
| V9 | `npx eslint .storybook --ext ts --max-warnings 0` | 0 | JSON formatter shows **2 files actually linted** (0/0). Proven non-vacuous: adding the probe rule `no-restricted-syntax: ExportDefaultDeclaration` flags both files |
| V10 | `npx prettier --check .storybook/main.ts .storybook/preview.ts` | 0 | Formatted |
| V11 | Self-review's strict `tsc` command on `.storybook/*.ts` | 0 | Clean. It also passes without `src/styles/scss-modules.d.ts`; side-effect SCSS imports are not type-resolved |
| V12 | `tsc -p <scratch tsconfig extending ./tsconfig.json, include .storybook + src>` | 0 | Clean under the project's own strict options (`noUnusedLocals`, etc.) |
| V13 | `pnpm peers check` (read-only) | 0 | "No peer dependency issues found" (cycle-plan AC: no peer dependency errors). Lockfile and `package.json` md5 unchanged afterwards |
| V14 | `pnpm ls --depth 0` | 0 | `storybook`, `@storybook/react`, `react-vite`, `addon-a11y`, `addon-essentials` all **8.6.19** |
| V15 | `pnpm view <pkg> dist-tags` | 0 | addon-essentials `latest`=8.6.14, `v8`=8.6.19. The other four `latest`=10.6.4. This confirms the self-review's dist-tag explanation, and that 8.6.19 is the newest 8.x patch |
| V16 | `pnpm exec storybook dev -p 6106 --ci --no-open` (non-default port; the `storybook` script itself pins `-p 6006`) | — | Started; `GET /` → 200; **no** "incompatible packages" warning. Terminal shows `[DEP0190] DeprecationWarning` (Storybook core spawns with `shell: true` under Node 26). Stopped by exact process-group ID |
| V17 | `node sb-check.mjs 9444 http://localhost:6106` (headless Chrome 156) | 0 | Reproduced the self-review exactly: 1× `favicon.svg` 404 on the story view; tabs `["Controls6","Actions","Accessibility"]`; a11y `0 Violations / 7 Passes / 0 Incomplete`; 2× React `non-boolean attribute` errors on the docs page; autodocs rendered |
| V18 | Reviewer's own CDP script (scratchpad `reviewer-check.mjs`, `reviewer-css.mjs`) | 0 | `/` redirects to `?path=/docs/atoms-input--docs`, so the **2 React errors appear on first launch**. a11y tab on `error-state` (0/16/0) and `disabled` (0/6/0). In the iframe, `body` and `.annexus-input__label` compute `border-box`, and CSSOM lists `src/styles.scss => *, ::before, ::after {box-sizing:border-box}`. The ArgsTable contains an injected empty `<label></label>` and `<input>` |

Working tree after all checks: `git status --short` identical to the start (only git-ignored build outputs were rewritten).

---

## Acceptance Criteria Verification

| # | Criterion (🤖 AI Agent Reference) | Status | Evidence |
|---|-----------|--------|----------|
| AC1 | Framework is `@storybook/react-vite` | ✅ Pass | `.storybook/main.ts:6-9`; built `project.json` → `{"name":"@storybook/react-vite","options":{}}` |
| AC2 | Addons include `addon-essentials` + `addon-a11y` | ✅ Pass | `.storybook/main.ts:5`; `project.json` addons both 8.6.19; `sb-addons/` = `a11y-9` + 8 `essentials-*` bundles |
| AC3 | Stories glob `['../src/**/*.stories.@(js\|jsx\|ts\|tsx)']` | ✅ Pass | `.storybook/main.ts:4`, exact string; `index.json` indexes `./src/components/Input/Input.stories.tsx` |
| AC4 | `docs: { autodocs: 'tag' }` | ✅ Pass | `.storybook/main.ts:10-12`; `atoms-input--docs` generated only from the tagged meta. The key is `@deprecated` in SB 8.6 types (carry-over ISS-002) |
| AC5 | `preview.ts` imports `'../src/styles.scss'` | ✅ Pass | `.storybook/preview.ts:4`; built `preview-*.css` = `*,*:before,*:after{box-sizing:border-box}`; live CSSOM rule from `src/styles.scss`; `.annexus-input__label` computes `border-box` (V18) |
| AC6 | `pnpm storybook` on 6006; zero console errors; empty sidebar | ⚠️ Not literally met (external causes) | The script pins `-p 6006` (unchanged); the server starts cleanly (V16). Console: 3 messages, all outside this story's files (see attribution below). They show on the landing page. The sidebar lists `Atoms/Input` because Story 1.2 merged early (PR #8); this story adds 0 stories (G2.1 re-run → 0). See ISS-001 |
| AC7 | `pnpm build-storybook` exits 0; `storybook-static/index.html` exists | ✅ Pass | V1, V2 |
| AC8 | a11y addon visible in addons panel of any story | ✅ Pass | V17, V18: Accessibility tab present on 3 stories, 0 violations on each |
| S1 | Step 1 — `main.ts` as specified | ✅ Pass | Same keys and values as the snippet; addons array on one line (Prettier, V10) |
| S2 | Step 2 — `preview.ts` as specified | ✅ Pass | Matches the snippet, plus a 2-line WHY comment (patterns §10.2), which is accurate: `src/index.ts:2` imports the same `./styles.scss` that becomes `dist/style.css` |
| S3 | Step 3 — run dev, build, `ls storybook-static/` | ✅ Pass | V1, V16 |
| Q | No TypeScript errors in `.storybook/` | ✅ Pass | V11, V12 |
| MR | Patterns §5.1 CSF3, §5.3 a11y with no per-story config, §10.3 autodocs opt-in, §9.1 addons in `main.ts`, §11 ownership (`.storybook/**`; `package.json` = infra stories) | ✅ Pass | No global `tags` in `preview.ts`; the Input stories have no `a11y` parameters yet are scanned; the config lives only in `.storybook/` |
| CP | Cycle plan: "`pnpm storybook` launches without errors (empty component list)"; "`pnpm install` … no peer dependency errors" | ⚠️ / ✅ | Same as AC6; V13 |
| OUT | No stories, no Chromatic, no theme/branding | ✅ Pass | G2.1–G2.6 greps re-run: all 0 (the only "chromatic" hit is the comment at `preview.ts:3`) |

### AC6 console-message attribution — verified

| Message | Self-review attribution | Reviewer verification | Holds? |
|---------|------------------------|-----------------------|--------|
| `GET /favicon.svg` 404 (dev server only) | Storybook 8.6.19 core-server passes the favicon **file** path to `sirv()`, which expects a directory | `@storybook/core/dist/core-server/index.cjs` (`useStatics`) registers `` e.get(`/${basename(favicon)}`, sirvWorkaround(favicon, …)) `` with `favicon` = `@storybook/core/assets/browser/favicon.svg`. Directly above it, `staticDirs` entries that are files get special handling (parent dir + URL rewrite); the favicon does not. Live: `/favicon.svg` → 404, `/sb-common-assets/favicon.svg` → 200. `storybook-static/favicon.svg` exists. 8.6.19 is the newest 8.x (V15), so no patch is available | ✅ Yes |
| React "Received `true` for a non-boolean attribute `htmlFor`" / "`id`" on the Input docs page | TSDoc `src/components/Input/Input.types.ts:4` is rendered as markdown, and markdown-to-jsx emits real elements | The served module's `__docgenInfo.props.id.description` = `"Stable id shared between <label htmlFor> and <input id>"`. The stack is `label/input ← markdown-to-jsx ← ArgRow ← ArgsTable`, and the ArgsTable DOM contains an injected empty `<label>` and `<input>` (V18) | ✅ Yes (the backtick fix itself is not live-verified; that needs a `src/` edit) |

**Is the "⚠️ Met for config scope" verdict fair?** Mostly. The story's own QA-observable bullet scopes the check to "zero errors, zero warnings **from Storybook config**". Under that reading, the console part holds, and nothing in `.storybook/` produces a message. Patching either cause from this story would mean editing a file another story owns (patterns §11) or adding a branded favicon via `staticDirs` (OUT). The verdict leaves two things unsaid, though. First, `/` lands on the Docs page, so anyone running `pnpm storybook`, QA included, sees the errors immediately. Second, the unscoped QA Candidate line ("launches … with zero console errors") will fail until Story 1.2's TSDoc is fixed, and that fix is not tracked (ISS-001).

---

## Deviations Assessment

| Deviation | Assessment |
|-----------|------------|
| `.gitignore` outside Files Touched | ✅ Justified. A build output of 66 files, including `project.json` metadata, must not be committed. The entry sits outside the AIRE auto-managed block, as that block's header requires |
| `package.json` / `pnpm-lock.yaml` outside Files Touched | ✅ Justified and in the spirit of patterns §11 ("`package.json` — infra/devops stories only"). It fixes the 8.6.14/8.6.19 skew (the old review's ISS-003). **The lockfile diff is confined to the addon-essentials subtree**: the importer specifier/version for addon-essentials, plus the package and snapshot entries for addon-essentials and its 9 sub-addons (actions, backgrounds, controls, docs, highlight, measure, outline, toolbars, viewport). The 8.6.14 copies of `blocks`, `csf-plugin` and `react-dom-shim` (pulled in by addon-docs) collapse onto 8.6.19 entries that already existed. No non-`@storybook/*` package changes, and `unplugin@1.16.1` stays. Only addon-essentials gets the floor bump, and V15 shows why: it alone has `latest` stuck at 8.6.14 |
| TDD as scripted red → green on `build-storybook` instead of a Vitest test | ✅ Acceptable. The story declares "Tests (manual)", the red/green is real and reproducible (V3), and Story 3.6 will make `build-storybook` a CI gate. The stated reason is partly inaccurate, though (ISS-002d) |
| Sidebar not empty | ✅ Acceptable. It is a plan-order artifact (Story 1.2 merged early), not a defect, and it let AC8 be verified now rather than in CYCLE-2 |

---

## Previous (Discarded PR #5) Review — Carry-Over Check

| Old ID | Finding | Status against the new code |
|--------|---------|-----------------------------|
| ISS-001 🟡 | Preview loaded token partials, not the shipped global stylesheet | ✅ **Resolved by design**: `preview.ts:4` imports `../src/styles.scss` directly (the `src/tokens` layout no longer exists) |
| ISS-002 🟢 | `docs.autodocs` deprecated in SB 8.6 | ⏸️ **Still applies.** Confirmed in `@storybook/core/dist/types/index.d.ts` (`@deprecated Use tags: ['autodocs']…`). Required by AC4; deferred in the self-review (drop on SB 9) |
| ISS-003 🟢 | addon-essentials 8.6.14 vs 8.6.19 skew | ✅ **Resolved**: V14, and no incompatible-packages warning (V16) |
| ISS-004 🟢 | `.storybook/` outside `pnpm typecheck` / `pnpm lint` | ⏸️ **Still applies**, deferred to Story 3.6. A detail for 3.6: ESLint 8 ignores dot-folders by default. `eslint src .storybook` (directory form) does lint them (V9), but naming the files explicitly emits "File ignored by default" warnings, which fail `--max-warnings 0`. Use the directory form, or add `'!.storybook'` to `ignorePatterns` |
| ISS-005 🟢 | `vite-plugin-dts` runs inside the Storybook build | ⏸️ **Still applies**: `storybook-static/` now contains 8 `.d.ts` files. Deferred in the self-review; no functional impact |
| Note | `Requires: [3.1]` was wrong (depended on 3.2) | ✅ Resolved: `src/styles.scss` dates from Story 3.1 (`c560be4`) |

---

## Checklist Results

### Correctness
- [x] ✅ Code does what it is supposed to (AC1–AC5, AC7, AC8 verified live)
- [x] ✅ Global reset reaches stories (CSSOM + computed style on an element `Input.scss` does not style)
- [x] ⚠️ AC6 console/sidebar not literally met. External causes verified; follow-up untracked (ISS-001)
- [x] ✅ No obvious bugs; output idempotent (V2)

### Pattern Adherence
- [x] ✅ react-vite shares the root Vite/Sass pipeline (component SCSS compiles in the preview)
- [x] ✅ a11y global, no per-story config (§5.3); autodocs opt-in (§5.1, §10.3); addons in `main.ts` (§9.1)
- [x] ✅ Ownership boundaries respected (§11). The Story 1.2 file was deliberately left untouched
- [x] ✅ Naming, file layout and Prettier style correct

### Testing
- [x] ✅ Story tests are manual by design; scripted red → green and browser checks recorded and reproduced
- [x] ✅ Existing suite 35/35, coverage 100% (≥ 90% threshold)
- [x] ⚠️ The AC5 browser proof in the self-review is confounded, and the TDD rationale is partly inaccurate (ISS-002)

### Documentation
- [x] ✅ Self-review exists, with Gate 1/2/3 tables and candid deviations
- [x] ✅ No TODO/FIXME; the single comment states WHY (§10.2)
- [x] ⚠️ Minor evidence inaccuracies (ISS-002); stale User Reference AC not reconciled (ISS-003); `status.md` inconsistencies (ISS-004)

### Security
- [x] ✅ No secrets, tokens or Chromatic credentials (G2.6 → 0)
- [x] ✅ `storybook-static/` (with `project.json` metadata) git-ignored
- [x] ✅ No new runtime dependencies; dev-dependency patch bump only; `pnpm peers check` clean

### Performance
- [x] ✅ Storybook build ~4 s; dev server ready in < 1 s

### SOLID / Anti-Monolith / Maintainability
- [x] ✅ N/A for SOLID (declarative config). Both files are minimal, with no coupling beyond the documented Vite reuse

---

## Issues Found

### ISS-001: AC6 is not met on first launch, and the Story 1.2 fix that would close it is untracked 🟡 Medium

**Category**: Process / Traceability (acceptance)  
**File**: `docs/stories-implemented/story-3.3-review.md:162`, `:211`, `:229-231`; `docs/status.md:61`, `:359`. Root cause (not part of this diff): `src/components/Input/Input.types.ts:4`  
**Pattern Reference**: Story 3.3 QA Candidate + AC6; patterns §12 "All stories render without console errors"; implementation rulebook "Definition of Done — Sign-off rule"

**Issue**:
The attributions are correct (see the AC6 attribution table). However:
1. `http://localhost:6006/` redirects to `?path=/docs/atoms-input--docs`. The two React `console.error`s therefore fire on the very first page a developer or QA sees, together with the dev-server favicon 404. The self-review presents them as docs-page-only messages and never says that the docs page is the landing page.
2. The only record of the Story 1.2 fix is a prose bullet ("Follow-ups for other owners") and a Completed-Steps sub-bullet. There is no defect, no ADO item and no row in the `docs/status.md` Blockers/Risks table. If QA validates 3.3 before that fix lands, the unscoped QA Candidate check ("zero console errors") fails.
3. The defect is user-visible as well as noisy: the Docs props table renders an empty `<label>` and a stray `<input>` element in the `id` row's description (V18).

**Current Code** (Story 1.2's file, shown for context only; this story must not edit it):
```typescript
/** Stable id shared between <label htmlFor> and <input id> */
id: string;
```

**Suggested Fix**:
- Have the Story 1.2 owner (Dev-2) land the one-line fix, ideally via `aire-raise-defect` so it is tracked, **before** 3.3 goes to QA:
  ```typescript
  /** Stable id shared between `<label htmlFor>` and `<input id>` */
  id: string;
  ```
- Add the item to the `docs/status.md` Blockers/Risks table with an owner. The parent updates `status.md`.
- Amend the AC6 row of the self-review to say: "Not met as written. `/` lands on the Input Docs page, which shows 2 React errors until the Story 1.2 TSDoc fix lands. 1 dev-server favicon 404 is a known Storybook 8.6.19 core-server limitation (no newer 8.x patch). 0 messages originate from `.storybook/`." Give QA the same note so they validate AC6 against the "from Storybook config" scope and re-check after the 1.2 fix.

**Why This Matters**: AC6 is the story's headline observable. Unless the external causes are tracked and sequenced, QA will either fail 3.3 for a defect it does not own, or wave it through and the Story 1.2 defect gets lost.

**Resolution** (2026-10-26, DEV):
- Fix:
  - The AC6 row is reworded to "Not met as written; 0 from config; external causes tracked", with the suggested landing-page wording and a QA note.
  - The test summary now states that `/` redirects to the Input docs page, so the errors appear on first launch.
  - The Story 1.2 TSDoc fix is tracked as **DEF-3.3-01** in the `docs/status.md` Blockers table (owner Angel / Dev-2, "should land before 3.3 QA"). The user chose `status.md` tracking only: no ADO bug, no `aire-raise-defect`.
  - `src/components/Input/Input.types.ts` is deliberately not edited (Story 1.2 owns it).
- Change ref: `docs/stories-implemented/story-3.3-review.md:115, :172, :243`; `docs/status.md` header + Blockers row `DEF-3.3-01`
- Test evidence: doc-only, so it cannot be expressed as a test. Full suite re-run 35/35, coverage 100%
- Status: ✅ Resolved

---

### ISS-002: Self-review evidence inaccuracies 🟢 Low

**Category**: Documentation  
**File**: `docs/stories-implemented/story-3.3-review.md:26`, `:39`, `:88-98`, `:161`, `:169`, `:220`

**Issue**: Four small inaccuracies, none of which changes a verdict:
- **(a) AC5 browser proof is confounded (`:161`).** "iframe `<input>` computed `boxSizing: border-box`" would hold even without the preview import, because `src/components/Input/Input.scss:33` sets `box-sizing: border-box` on `.annexus-input__field` itself. The CSS-bundle evidence on the same row is valid.
- **(b) Lockfile scope count (`:26`).** It is addon-essentials plus **9** sub-addons (highlight is the one without a manager bundle), and the 8.6.14 copies of `blocks`, `csf-plugin` and `react-dom-shim` are deduplicated. The row says "8 sub-addons".
- **(c) Dev-server transcript trimmed without saying so (`:88-98`, `:169`).** The DEV's own raw log, and the reviewer's run, contain `[DEP0190] DeprecationWarning: Passing args to a child process with shell option true…` at startup. The DEV's log also ends with `[ELIFECYCLE] Command failed.` after the stop by PID. Neither comes from this config, but the story's QA bullet mentions warnings, and Q2 claims "no crash output".
- **(d) TDD rationale (`:39`, `:220`).** `vitest.config.ts` is already on `main` (added in Story 3.2, `3e8907f`) and has no `include` override. Vitest 2.1.9 globs with `dot: true`, so a `.storybook/*.test.ts` would run without touching Story 3.4's file. Choosing manual tests is still valid, because the story says "Tests (manual)"; only the stated reason is wrong.

**Suggested Fix**: For (a), cite an element `Input.scss` does not style (for example, `.annexus-input__label` or `body` computes `border-box`) or the CSSOM rule sourced from `src/styles.scss`. For (b), say "9 sub-addons (+ blocks / csf-plugin / react-dom-shim deduped)". For (c), keep the DEP0190 line, or mark the excerpt "trimmed" and note it is a Storybook-core/Node 26 deprecation. For (d), reword to "story specifies manual tests; `build-storybook` becomes the CI regression gate in 3.6".

**Resolution** (2026-10-26, DEV):
- Fix:
  - (a) New AC5 evidence, re-run on the static build with a control. `body` and `.annexus-input__label` compute `border-box` with the preview stylesheet and `content-box` with it disabled. `.annexus-input__field` stays `border-box` either way, which confirms the confound. The only universal reset rule comes from `/assets/preview-3yEGi_Su.css`.
  - (b) The lockfile row now says "9 sub-addons", lists them, and notes the `blocks` / `csf-plugin` / `react-dom-shim` dedupe.
  - (c) The dev-server transcript now includes the `DEP0190` line and is labelled an excerpt. `[ELIFECYCLE] Command failed.` is explained, and the Q2 row is corrected.
  - (d) The TDD rationale is reworded as suggested, and the self-review now acknowledges that a Vitest test would have run.
- Change ref: `docs/stories-implemented/story-3.3-review.md:26, :39, :88-100, :117-123, :171, :179, :231`
- Test evidence: doc-only. Reset check output is pasted in the self-review (`reset-check.mjs`, headless Chrome, exit 0)
- Status: ✅ Resolved

---

### ISS-003: Stale `--annexus-*` wording in the story's User Reference is not reconciled 🟢 Low

**Category**: Documentation / Traceability  
**File**: `docs/plans/stories/epic-3-story-3.3-storybook.md:27`, `:79`; `docs/stories-implemented/story-3.3-review.md:155-178` (Gate 1)

**Issue**: The plain-English AC (line 27: "Design token CSS is imported in `preview.ts` so all component stories have access to `--annexus-*` properties") and the System-responses row (line 79) still describe the pre-CR-001 custom-property tokens. No `--annexus-*` custom property is defined anywhere in `src/`, `dist/` or `storybook-static/`; the only reference is the unresolved fallback `var(--annexus-radius-md, 4px)` at `src/components/Input/Input.scss:23`. The implementation correctly follows the authoritative AI Agent Reference (line 64: `import '../src/styles.scss'`). However, Gate 1 lists only the 8 technical ACs and never notes the conflict. QA validating against the User Reference could look for `--annexus-*` properties and find none.

**Suggested Fix**: Add a Gate 1 row or a Deviations bullet: "User Reference AC5 / System-responses row reflect pre-CR-001 tokens; implemented per the AI Agent Reference (global stylesheet); no `--annexus-*` properties exist by design (CR-001)". Have PRODUCT_OWNER correct lines 27 and 79 the next time the plan is touched.

**Resolution** (2026-10-26, DEV):
- Fix: Added Gate 1 row **UR**, which reconciles the stale User Reference AC with the AI Agent Reference AC5 and tells QA which one to validate against. Added a Deviations bullet and a PRODUCT_OWNER follow-up. Lines 27 and 79 of the story file are tracked as **DOC-003** in the `docs/status.md` Blockers table. The story file itself is not edited: plan files are PRODUCT_OWNER's, outside DEV's write scope.
- Change ref: `docs/stories-implemented/story-3.3-review.md:187, :232, :244`; `docs/status.md` Blockers row `DOC-003`
- Test evidence: doc-only
- Status: ✅ Resolved

---

### ISS-004: `docs/status.md` inconsistencies in the sections this change edited 🟢 Low

**Category**: Documentation  
**File**: `docs/status.md:3-8`, `:233`, `:235-236`, `:359` (with `:379+` Blockers table)

**Issue**:
- Lines 3–5 keep the stale header ("Last Updated 2026-10-21 … 1/6 stories done"), directly above the updated header at lines 6–8 ("2026-10-26 … 2/7"). This duplication already existed on `main`, but the DEV edited this block and left two contradictory "Last Updated / Overall Status" values.
- Line 236, the 3.5 row reading "PR #13 open, awaiting review", contradicts the DEV's new text at lines 8, 370 and 383 ("3.5 merged (PR #13)"). PR #13 is merged.
- Line 233 overwrites the 3.3 Start date (2026-10-20 → 2026-10-26). The original start of the work is lost; the rework date is already in the title.
- Line 359: the Story 1.2 follow-up appears only under Completed Steps and is missing from the Blockers/Risks table (see ISS-001).

The accurate parts, verified: 35/35 tests and 100% coverage; Documentation 5/34 (5 files in `docs/stories-implemented/`); 3.5 QA pending (no 3.5 validation report); PR #5 closed and PR #13 merged (`gh pr list`); branch base `41e6eb0` = `origin/main`. The claim "ADO #23668 → In Progress" was not verified, since the tracker was out of scope for this review.

**Suggested Fix** (whoever next updates `status.md`): delete lines 3–5, remove the stale 3.5 row at line 236, restore Start `2026-10-20` for 3.3 (or add a "Rework started 2026-10-26" note), and add the Story 1.2 TSDoc item to the Blockers/Risks table.

**Resolution** (2026-10-26, DEV):
- Fix:
  - Deleted the stale header block; one header remains.
  - Removed the stale "PR #13 open, awaiting review" 3.5 row; the surviving 3.5 row now reads "merged PR #13 2026-10-23; QA pending".
  - Restored 3.3 Start `2026-10-20`; the title notes "rework started and implemented 2026-10-26".
  - Added DEF-3.3-01 (Story 1.2 TSDoc) and DOC-003 (stale User Reference) to the Blockers table.
- Change ref: `docs/status.md` header; Story Tracker rows 3.3 and 3.5; Blockers rows `DEF-3.3-01`, `DOC-003`
- Test evidence: doc-only
- Status: ✅ Resolved

---

## Issue Summary

| # | ID | Severity | Category | File | Status |
|---|-----|----------|----------|------|--------|
| 1 | ISS-001 | 🟡 Medium | Process / Traceability | `docs/stories-implemented/story-3.3-review.md:162`; root cause `src/components/Input/Input.types.ts:4` | Recommended before QA |
| 2 | ISS-002 | 🟢 Low | Documentation | `docs/stories-implemented/story-3.3-review.md:26, 39, 88-98, 161, 169, 220` | Optional |
| 3 | ISS-003 | 🟢 Low | Documentation / Traceability | `docs/plans/stories/epic-3-story-3.3-storybook.md:27, 79` | Optional |
| 4 | ISS-004 | 🟢 Low | Documentation | `docs/status.md:3-8, 233, 236, 359` | Optional |

**Summary**:
- Blockers: 0
- High: 0
- Medium: 1
- Low: 3

There are no findings against `.storybook/main.ts`, `.storybook/preview.ts`, `.gitignore`, `package.json` or `pnpm-lock.yaml`.

---

## What Was Done Well

1. ✅ Both config files match the story snippets exactly, with no gold-plating (no theme, no `staticDirs`, no Chromatic, no global `tags`)
2. ✅ Fixed the root cause of the version skew instead of silencing it: the floor was raised by hand after diagnosing pnpm's `latest`-dist-tag behaviour, and the diagnosis is confirmed (V15)
3. ✅ The lockfile change is surgical: only the addon-essentials subtree moved
4. ✅ Real browser-level verification over CDP found issues that a green `build-storybook` hides, and both root causes were traced correctly to source
5. ✅ File ownership respected: the Story 1.2 file was not edited, and the fix was handed to its owner with the exact change
6. ✅ The deviations section is candid, and the deferrals inherited from the old review are carried forward instead of dropped
7. ✅ Idempotent build: the reviewer's re-run is byte-identical (stronger than the claimed "identical file lists")

---

## Notes (not issues)

- **`iframe.html` opened on its own** (as the test-runner does) requests `/favicon.ico`, because `iframe.html` has no icon link. That gives a 404 in the dev server, and `storybook-static/` ships only `favicon.svg`. This is Storybook-internal, and it does not occur in the normal manager UI.
- **Assistant webfont**: still declared (`src/styles/design.variables.scss:8`) and still loaded nowhere. Stories and future Chromatic baselines render the `sans-serif` fallback. This was raised in the old review, is outside 3.3's scope ("no custom theme"), and still needs an owner (UI_UX_DESIGNER / ARCHITECT) before the CYCLE-2 baselines.
- **`var(--annexus-radius-md, 4px)`** (`src/components/Input/Input.scss:23`) references a custom property that does not exist after CR-001, so the fallback always applies. For the Story 1.2 / 3.2 owners.
- **Coordination**: Story 3.4 (Dev-2) may also touch `package.json` / `pnpm-lock.yaml`. Whichever merges second should regenerate the lockfile instead of hand-merging it.

---

## Approval Status

**Decision**: ⚠️ APPROVED WITH COMMENTS

**Reason**: No blockers or high-severity issues. The code under review is correct and complete against the story's AI Agent Reference, every gate passes on a live re-run, and the out-of-scope file changes are justified and minimal. AC6 is not literally met, but its causes are external, and the reviewer confirmed them at source level. The one Medium issue (ISS-001) is about tracking and sequencing the Story 1.2 fix so that QA validates AC6 correctly; it needs no change to this story's code.

**Next Steps**:
1. Recommended: `aire-dev-remediate 3.3` for ISS-001. Update the AC6 row, and raise or track the Story 1.2 TSDoc defect (`aire-raise-defect`) so Dev-2 fixes `Input.types.ts:4` before 3.3 QA. Optionally fix ISS-002 and ISS-003 in the same pass.
2. Whoever updates `docs/status.md` next: apply ISS-004 and add the Story 1.2 item to the Blockers/Risks table.
3. Carry the old ISS-002, ISS-004 (plus the ESLint dot-folder detail) and ISS-005 into Story 3.6 / the Storybook 9 upgrade, as the self-review already plans.
4. Then `aire-qa-test-plan 3.3` → `aire-qa-validate 3.3`, giving QA the AC6 scoping note.

---

## Sign-Off

**Reviewer**: REVIEWER Agent  
**Date**: 2026-10-26  
**Signature**: ⚠️ Approved With Comments

---

# 🛠️ Remediation — 2026-10-26

**Developer**: DEV Agent (Dev-1, Salvador)
**Severity Scope**: 🟡 Medium + 🟢 Low (all findings; user confirmed all four)
**Scenario**: Code Review
**Stories Affected**: 3.3 (follow-ups recorded for Story 1.2 and PRODUCT_OWNER)

## Issues Remediated

| ID | Severity | Story | File:Line | Summary | Resolution | Test Added |
|------|----------|-------|-----------|---------|------------|------------|
| ISS-001 | 🟡 Medium | 3.3 | `story-3.3-review.md:115, :172, :243`; `status.md` Blockers `DEF-3.3-01` | AC6 fails on first launch; Story 1.2 fix untracked | AC6 row reworded ("not met as written; 0 from config"); landing-page fact stated; DEF-3.3-01 in Blockers (owner Dev-2) | N/A (doc-only) |
| ISS-002 | 🟢 Low | 3.3 | `story-3.3-review.md:26, :39, :88-123, :171, :179, :231` | Self-review evidence inaccuracies | (a) AC5 proof replaced by an unconfounded check with a control; (b) 9 sub-addons; (c) DEP0190 / ELIFECYCLE disclosed; (d) TDD rationale corrected | N/A (doc-only); reset check re-run, exit 0 |
| ISS-003 | 🟢 Low | 3.3 | `story-3.3-review.md:187, :232, :244`; `status.md` Blockers `DOC-003` | Stale `--annexus-*` User Reference wording not reconciled | Gate 1 row UR + Deviations bullet; DOC-003 for PRODUCT_OWNER | N/A (doc-only) |
| ISS-004 | 🟢 Low | 3.3 | `status.md` header; Story Tracker 3.3 / 3.5; Blockers `DEF-3.3-01`, `DOC-003` | `status.md` inconsistencies | Stale header deleted; stale 3.5 row removed; 3.3 Start restored to 2026-10-20; Blockers rows added | N/A (doc-only) |

## Issues Deferred (with user consent)

| ID | Severity | Story | Reason |
|----|----------|-------|--------|
| — | — | — | None. The root-cause edit at `src/components/Input/Input.types.ts:4` belongs to Story 1.2 (Dev-2) and is tracked as DEF-3.3-01 in `docs/status.md`. By the user's choice, it is tracked in `status.md` only, with no ADO defect |

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `docs/stories-implemented/story-3.3-review.md` | Modified | AC5/AC6/Q2 rows, Gate 1 row UR, test summary (landing page, reset check with control, full dev-server excerpt), lockfile scope, TDD rationale, Deviations, follow-ups |
| `docs/status.md` | Modified | Single header, de-duplicated 3.5 row, 3.3 Start restored, DEF-3.3-01 + DOC-003 Blockers rows, remediation entries |
| `docs/reviews/story-3.3-code-review-v1.md` | Modified | Status banner, per-issue Resolution blocks, this section |

No source, config, test or dependency file changed during remediation (`git diff --stat -- src .storybook package.json pnpm-lock.yaml .gitignore` is identical to the reviewed state).

## Patterns Applied

| Pattern | Where Applied | Notes |
|---------|---------------|-------|
| File ownership (patterns §11) | ISS-001, ISS-003 | Story 1.2's file and the plan's story file left to their owners; tracked in Blockers instead |
| Evidence with a control | ISS-002(a) | The reset proof now fails if the preview stylesheet is removed (disabling it reverts `body` and `label` to `content-box`) |

## Testing Summary

- **Targeted tests added**: 0. All four issues are documentation-only and cannot be expressed as automated tests
- **Full suite**: 35/35 passing
- **Coverage**: 100% (target ≥85%; project threshold 90%)

**Test Output**:
```
$ pnpm coverage        exit=0
 Test Files  4 passed (4)
      Tests  35 passed (35)
All files          |     100 |      100 |     100 |     100 |
$ pnpm lint            exit=0
$ pnpm typecheck       exit=0
$ pnpm build-storybook exit=0
$ npx eslint .storybook --ext ts --max-warnings 0   exit=0

$ node reset-check.mjs 9333 "http://127.0.0.1:6206/iframe.html?id=atoms-input--default&viewMode=story"
universal box-sizing rules: [{"href":"/assets/preview-3yEGi_Su.css","rule":"*, ::before, ::after { box-sizing: border-box; }"}]
with preview stylesheet:     {"body":"border-box","label":"border-box","field":"border-box"}
preview stylesheet disabled: {"body":"content-box","label":"content-box","field":"border-box"}
```

## Deviations from Report Suggestions

- ISS-001: the report suggests `aire-raise-defect` "ideally". The user chose tracking in `docs/status.md` only (DEF-3.3-01), so no tracker item was created.

## Lessons Learned

1. A browser proof needs a control. Without one, an element that styles itself hides whether a global stylesheet applies at all.
2. Check which page Storybook lands on: the first index entry is often an autodocs page, so docs-page console errors are first-launch errors.
3. Quoted logs in evidence must be complete or explicitly marked as excerpts.

## Next Steps

- [ ] Re-request code review (`aire-review-code`). Optional: no 🔴 was fixed
- [ ] DEF-3.3-01 fixed by Dev-2 (Story 1.2), then `aire-qa-test-plan 3.3` → `aire-qa-validate 3.3` with the AC6 scoping note
