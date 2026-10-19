# Regression Test Report

**Date**: 2026-10-19
**Build**: Current (`main` @ 259b639) vs Baseline (`validation-report-story-3.1-2026-10-19.md`)
**Tested By**: QA Agent
**Scope**: Story 3.1 — Repo Scaffold (`@annexus/ui` package foundation)
**BUILDID**: CYCLE-1 | **AzureDevOps**: #23665

---

## Summary

**Overall Status**: 🟢 NO REGRESSIONS

**New Failures**: 0
**Fixed Issues**: 0
**Flaky Tests**: 0

No code changes were made between the validation run and this regression run. QA artifacts only were written (`validation-report-story-3.1-2026-10-19.md`, `docs/status.md` update). The full regression pipeline confirms the scaffold is stable.

---

## Test Suite Comparison

| Category | Baseline (Validation) | Current (Regression) | Change |
|----------|-----------------------|----------------------|--------|
| Total Tests | 22 | 22 | 0 |
| Passed | 22 | 22 | 0 |
| Failed | 0 | 0 | 0 |
| Skipped | 0 | 0 | 0 |
| Coverage | N/A (scaffold) | N/A (scaffold) | — |

---

## Changes Since Baseline

| Commit | Author | Summary | Affects Tests? |
|--------|--------|---------|----------------|
| 259b639 | merge | Merge PR #2 (feat/cycle-1-story-3.1-repo-scaffold) | No — already on main |
| 8a5ea18 | DEV | docs: code review, remediation, status update | No — docs only |
| c560be4 | DEV | feat(scaffold): Story 3.1 repo scaffold | Already validated |

**Conclusion**: No source code changes between baseline and regression run. Regression confirms stability.

---

## Full Suite Re-Execution Evidence

### Install
```
Command: pnpm install
Output:  Already up to date
         Done in 16ms using pnpm v12.11.2
Exit:    0  ✅ (same as baseline)
```

### Build (clean dist/)
```
Command: rm -rf dist/ && pnpm build
Output:  vite v6.4.4 building for production...
         ✓ 2 modules transformed.
         [vite:dts] Declaration files built in 413ms.
         dist/style.css     0.04 kB │ gzip: 0.06 kB
         dist/index.cjs.js  0.01 kB │ gzip: 0.03 kB
         ✓ built in 559ms
Exit:    0  ✅ (same as baseline)
```

### dist/ output
```
index.cjs.js  14 bytes   ✅ (same as baseline)
index.d.ts     1 byte    ✅ (same as baseline)
index.es.js    1 byte    ✅ (same as baseline)
style.css     42 bytes   ✅ (same as baseline)
File count: 4            ✅ (same as baseline)
```

### TypeCheck
```
Command: pnpm typecheck (tsc --noEmit)
Output:  (empty)
Exit:    0  ✅ (same as baseline)
```

### Lint
```
Command: pnpm lint (eslint src --ext ts,tsx --max-warnings 0)
Output:  (empty)
Exit:    0  ✅ (same as baseline)
```

### Config spot-checks
```
.npmrc:       @annexus:registry=https://npm.pkg.github.com  ✅ unchanged
package.json: @annexus/ui 0.0.1 module                      ✅ unchanged
style.css:    *,*:before,*:after{box-sizing:border-box}      ✅ unchanged
```

---

## New Failures (Regressions)

None.

---

## Fixed Issues

None (no failures in baseline to fix).

---

## Flaky Tests

None detected. All manual CLI tests are deterministic.

---

## Coverage Changes

N/A — Story 3.1 has no source logic to cover (scaffold story). Vitest not yet configured (delivered by Story 3.4).

---

## Recommendations

No action required. Story 3.1 scaffold is stable and regression-clean.

---

## Sign-Off

**QA Agent**
**Date**: 2026-10-19
**Status**: ✅ APPROVED — Zero regressions. CYCLE-1 stories 3.2–3.6 remain unblocked.
