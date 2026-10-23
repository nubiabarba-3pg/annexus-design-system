# Regression Test Report

**Date**: 2026-10-21
**Build**: Current (`main` @ `5a65b4d`) vs Baseline (`validation-report-story-3.2-2026-10-21.md`, `80291cc`, the last validated build before remediation)
**Tested By**: QA Agent
**Scope**: Full suite on `main` + Story 3.2 checks + Story 3.1 package/scaffold checks (the remediation changed 3.1 build config)
**BUILDID**: CYCLE-1 | **AzureDevOps**: #23669, #23665

---

## Summary

**Overall Status**: 🟢 NO REGRESSIONS

**New Failures**: 0
**Fixed Issues**: 2 (BUG-001, BUG-002)
**Flaky Tests**: 0

Commit `f9a4808` fixed both defects and broke nothing else. The unit suite, the build, the package entry points and the published tarball are all stable. One finding is documentation drift, not code (DOC-001): the architecture doc and the Story 3.1 spec still prescribe `index.cjs.js`, the file name behind BUG-002.

---

## Changes Since Baseline

| Commit | Author | Summary | Affects Tests? |
|--------|--------|---------|----------------|
| `f9a4808` | Angel Tejeida (DEV) | fix(story-3.2): remediate BUG-001 and BUG-002 | Yes — `vite.config.ts` (CJS file name), `package.json` (`main`, `exports.require`, `smoke:require`), `pallete.color.scss` (`$gray700`), `designVariables.test.ts` (+1 assertion), `scripts/smoke-require.cjs` (new) |
| `5a65b4d` | merge | Merge PR #14 | No — merge only |

No other source changes. Open PR #13 (Story 3.5) is not on `main` and is out of scope.

---

## Test Suite Comparison

| Category | Baseline | Current | Change |
|----------|----------|---------|--------|
| Unit tests total | 25 | 25 | 0 (the new `#404042` assertion sits inside an existing test) |
| Unit tests passed | 25 | 25 | 0 |
| Unit tests failed | 0 | 0 | 0 |
| Skipped | 0 | 0 | 0 |
| Coverage (stmts/branch/funcs/lines) | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | 0 |
| Story 3.2 test cases passed | 15 / 17 | 17 / 17 | +2 ✅ (TC-005, TC-014) |
| Package integration (ESM / CJS) | ✅ / ❌ | ✅ / ✅ | CJS fixed |
| `smoke:require` | n/a | ✅ | New guard |

---

## New Failures (Regressions)

None.

---

## Fixed Issues

| Test ID | Test Name | Previous | Current | Notes |
|---------|-----------|----------|---------|-------|
| TC-005 | Spec hex → palette | ❌ 16/17 | ✅ 17/17 | BUG-001 — `$gray700: #404042` (`f9a4808`) |
| TC-014 | Built package import (CJS) | ❌ `require()` → `{}` | ✅ `Input`, `designVariables` (26 keys, identical to ESM) | BUG-002 — CJS emitted as `dist/index.cjs` (`f9a4808`) |

---

## Story 3.1 Scaffold Checks (re-run because the fix changed 3.1 build config)

| 3.1 TC | Check | Result | Notes |
|--------|-------|--------|-------|
| TC-003 | `dist/` entry files | ✅ | `index.es.js`, `index.cjs`, `index.d.ts`, `style.css` (+ `components/`, `styles/` `.d.ts` folders since 3.2). The CJS file name changed **intentionally** (BUG-002); the 3.1 expectation of `index.cjs.js` is outdated → DOC-001 |
| TC-006 | `.npmrc` registry | ✅ | `@annexus:registry=https://npm.pkg.github.com` |
| TC-007 / TC-021 | name, version, type, peerDeps | ✅ | `@annexus/ui` `0.0.1` `module`; react / react-dom `^18.0.0` |
| TC-008 | Scripts | ✅ | All 8 required scripts present, plus `coverage`, `test:watch`, `smoke:require` |
| TC-009 | Entry points resolve | ✅ | `main` → `./dist/index.cjs`, `module`, `types`, `exports.{types,import,require}`, `./style.css`: all files exist |
| TC-014 | Install idempotency | ✅ | `pnpm-lock.yaml` hash identical before and after (`0c5f9144…`) |
| TC-015 | Build idempotency | ✅ | Two clean builds → identical `dist/` content hash (`3552e8b0…`) |
| TC-022 | build → typecheck → lint pipeline | ✅ | exit 0 |
| Pack | `pnpm pack --dry-run` | ✅ | Tarball ships `dist/index.cjs`, `index.es.js`, `index.d.ts`, `style.css`, all `.d.ts`, `package.json` |

TC-013 and TC-016 (empty barrel, no components / no Vitest config) are obsolete by design since Stories 1.2 and 3.2, so they weren't re-run.

---

## Flaky Tests

| Test ID | Test Name | Pass Rate | Recommendation |
|---------|-----------|-----------|----------------|
| — | Full suite run 3× | 3/3 (25/25 each) | None |

---

## Coverage Changes

**Coverage**: 100% (unchanged). No areas decreased.

---

## Findings

### DOC-001: Docs still prescribe `index.cjs.js` 🟡 Medium
**Category**: Documentation drift. Not a test failure.
**Description**: After BUG-002 the CJS bundle is `dist/index.cjs`, but these planning/reference docs still specify `index.cjs.js`:
- `docs/architecture/design/00-system-architecture-greenfield.md` lines 151, 209, 221 (diagram, dist tree, `exports.require`)
- `docs/architecture-diagrams/00-system-architecture-diagrams-greenfield.md` line 111
- `docs/plans/stories/epic-3-story-3.1-repo-scaffold.md` lines 18, 29, 79, 97, 123, 129
- `docs/plans/builds/cycle-1/cycle-plan.md` line 47; `docs/plans/implementation-plan.md` line 227
**Risk**: The architecture doc is reference material that agents follow strictly. A later story or scaffold rework built from it could reintroduce `index.cjs.js` and with it BUG-002. `smoke:require` would catch that, but today it runs only in `prepublishOnly`, not in CI (OBS-004).
**Recommendation**: Run `aire-drift` so the architecture doc, the Story 3.1 spec and the plans record the `index.cjs` decision. Historical review and QA reports stay as they are, since they describe what was true at the time.

---

## Recommendations

1. 🟡 Fix DOC-001 via `aire-drift` before Story 3.6 (CI/CD), whose story may reference the old file name.
2. Add `pnpm smoke:require` to the Story 3.6 CI pipeline (OBS-004).
3. Close ADO #23779 (BUG-002) and #23780 (BUG-001): both verified fixed with no regressions.

---

## Evidence

```
## install idempotency (3.1 TC-014)
Done in 76ms using pnpm v12.14.0
lock 0c5f9144962461b2 -> 0c5f9144962461b2

## 3.1 TC-022 pipeline + build idempotency (TC-015)
pipeline exit=0
dist hash run1 3552e8b0b8c2f33d run2 3552e8b0b8c2f33d
2100 index.cjs | 224 index.d.ts | 2753 index.es.js | 1322 style.css

## suite x3 (flaky check)
Tests 25 passed (25)  All files | 100 | 100 | 100 | 100
Tests 25 passed (25)  All files | 100 | 100 | 100 | 100
Tests 25 passed (25)  All files | 100 | 100 | 100 | 100

## smoke:require
require smoke check passed

## package.json entry points
@annexus/ui 0.0.1 module {"react":"^18.0.0","react-dom":"^18.0.0"}
main ./dist/index.cjs true | module ./dist/index.es.js true | types ./dist/index.d.ts true
exports.types true | exports.import true | exports.require ./dist/index.cjs true | ./style.css true

## pack contents
dist/components/Input/{index,Input,Input.types}.d.ts, dist/index.cjs, dist/index.d.ts,
dist/index.es.js, dist/style.css, dist/styles/designVariables.d.ts, package.json
```

Story 3.2 test-case evidence for this build is in `docs/testing/validation-report-story-3.2-2026-10-21-v2.md`.
