# Validation Report - Story 3.2: Design System Styles (Palette, Design Variables, JS Export)

**Date**: 2026-10-21
**Tested By**: QA Agent
**Scope**: Story 3.2: Design System Styles — CYCLE-1, ADO #23669
**Test Plan Used**: `docs/testing/test-plan-story-3.2.md`
**Environment**: Dev (local) — Windows 11, Node.js v24.4.0, pnpm 12.14.0 (run via `npx pnpm@12.14.0` because the local corepack cache is broken), `main` @ `9fef804`, fresh `pnpm install --frozen-lockfile`

---

## Executive Summary

**Overall Status**: 🟡 PARTIAL

**Summary**: Story 3.2's own deliverables work. The palette, design variables, `:export` module and public `designVariables` export behave as specified. Build, typecheck and lint are clean, 25/25 tests pass, coverage is 100%, and the mutation check confirms the export-parity guard catches a missing `:export` line. 15 of 17 test cases pass. Two defects are open:
- One spec color is missing from the palette: gray 700 (BUG-001 / review ISS-001, 🟡 Medium).
- The CommonJS entry of the package exports nothing (BUG-002, 🟠 High). This dates from the Story 3.1 scaffold and was found during this validation.

**Recommendation**:
- [ ] ✅ READY FOR RELEASE
- [x] ⚠️ READY WITH MINOR ISSUES (documented below) — **for Story 3.2 scope only**; BUG-001 needs a design decision
- [ ] ❌ NOT READY - CRITICAL ISSUES MUST BE FIXED
- [ ] 🚫 BLOCKED

The package must not be released until BUG-002 is fixed: a 🟠 High bug blocks release. It belongs to the build config (Story 3.1 scope), not to Story 3.2 code.

---

## Requirements Coverage

| Requirement ID | Description | Test Status | Evidence | Notes |
|----------------|-------------|-------------|----------|-------|
| AC-01 | Every spec color exists once in the palette, in hex | ❌ Fail (16/17) | TC-005 | Spec gray 700 `#404042` missing — BUG-001 |
| AC-02 | No duplicate palette names / hex values | ✅ Pass | TC-004, TC-007 | 20 names, 20 unique hex |
| AC-03 | `$camelCase: #hex;` format; named colors present | ✅ Pass | TC-006 | All 20 lines conform; all 10 named colors match; gray50–gray900 present |
| AC-04 | `@use 'pallete.color' as palette;` first; color vars reference palette; unique names | ✅ Pass | TC-008 | 26 vars, 13 color vars, all `palette.$x`, none undefined |
| AC-05 | Font family + per-section size/line-height/weight | ✅ Pass | TC-009 | `'Assistant', sans-serif`; pairs 14/20 and 12/18 match spec scale; weights 400/600 |
| AC-06 | Component SCSS: no hex, no palette | ✅ Pass | TC-004, TC-010 | `Input.scss` clean; uses `@use design.variables as *` |
| AC-07 | `:export` exports every design variable | ✅ Pass | TC-004, TC-011 | 26 declared = 26 exported; keys match names |
| AC-08 | Missing `:export` line makes a test fail | ✅ Pass | TC-012 | Mutation: 1 failed, restored → 25/25 |
| AC-09 | `designVariables` + `DesignVariables` exported from `src/index.ts` | ✅ Pass | TC-013 | Present in `src/index.ts` and `dist/index.d.ts` |
| AC-10 | Built package `import { designVariables }` equals SCSS values | ✅ Pass (ESM) | TC-014 | ESM ✅ 26 keys, `inputLabelColor === '#414651'`. CJS ❌ — BUG-002 (out of story scope) |
| AC-11 | Only `design.variables.scss` references the palette | ✅ Pass | TC-015 | `designVariables.test.ts` also names the file, but only to read it in the uniqueness test |
| AC-12 | OUT list respected | ✅ Pass | TC-016 | No `src/tokens/`, no `--annexus-*` definitions, no dark mode, Input-only variables. One `var(--annexus-radius-md)` usage — ISS-005, Story 1.2 |
| AC-13 | build / typecheck / lint / test exit 0; coverage ≥ 90% | ✅ Pass | TC-001–TC-004 | Coverage 100% |
| REQ-DT | Requirements § Design Tokens: tokens as SCSS vars, consumed by components, exported in package | ⚠️ Partial | TC-010, TC-013, TC-014 | Exported for ESM consumers only (BUG-002) |

**Coverage Summary**:
- Total Requirements: 14
- Fully Covered: 12
- Partially Covered: 1 (REQ-DT)
- Not Covered / Failing: 1 (AC-01)
- Coverage %: 86% (12/14)

---

## Test Execution Summary

### Unit Tests
- Total: 25 | Passed: 25 (100%) | Failed: 0 | Skipped: 0
  - `src/styles/designVariables.test.ts`: 7 (Story 3.2)
  - `src/components/Input/Input.test.tsx`: 18 (Story 1.2, regression only)
- Coverage: 100% statements / branches / functions / lines
- Evidence: TC-004 output below

### Integration Tests
- Total: 3 | Passed: 2 (67%) | Failed: 1 | Skipped: 0
  - SCSS → `:export` → TS module under Vitest ✅ (TC-004)
  - `Input.scss` compiles against design variables in the Vite build ✅ (TC-001)
  - Built package import: ESM ✅ / CJS ❌ (TC-014, BUG-002)

### E2E Tests
- N/A — no user-facing UI in this story

---

## Quality Gate Status

| Quality Gate | Target | Actual | Status | Notes |
|--------------|--------|--------|--------|-------|
| Unit Test Coverage | ≥85% (story ≥90%) | 100% | ✅ | - |
| Unit Tests | 100% pass | 25/25 | ✅ | - |
| Build / Typecheck / Lint | Exit 0 | 0 / 0 / 0 | ✅ | - |
| Integration Tests | 100% pass | 2/3 | ❌ | CJS entry — BUG-002 (Story 3.1 scope) |
| Critical Bugs | 0 | 0 | ✅ | - |
| High Bugs | 0 | 1 | ❌ | BUG-002 — pre-existing, packaging |
| Security Scan | No critical | N/A | ✅ | No runtime logic, no new dependencies |

**Overall Quality Gate**: ❌ FAILED at package level (BUG-002). Story 3.2's own gates all pass apart from AC-01 (BUG-001).

---

## Functional Testing Results

### Happy Path Scenarios
- [x] ✅ TC-001: `pnpm build` exits 0, `dist/` has the 4 entry files - PASS
- [x] ✅ TC-002: `pnpm typecheck` exits 0 - PASS
- [x] ✅ TC-003: `pnpm lint` exits 0, zero warnings - PASS
- [x] ✅ TC-004: 25/25 tests, coverage 100% - PASS
- [ ] ❌ TC-005: spec hex → palette, 16/17 - FAIL (BUG-001)
- [x] ✅ TC-006: palette format and named colors - PASS
- [x] ✅ TC-008: design-variable structure and naming - PASS
- [x] ✅ TC-009: fonts match spec typography - PASS
- [x] ✅ TC-013: public API in barrel and `.d.ts` - PASS
- [ ] ⚠️ TC-014: built package import — ESM PASS, CJS FAIL (BUG-002)

### Edge Cases
- [x] ✅ TC-007: palette uniqueness (independent script) - PASS
- [x] ✅ TC-011: export parity (independent script) - PASS
- [x] ✅ Spec hex upper-case vs palette lower-case compared case-insensitively - PASS
- [x] ✅ Windows CRLF line endings do not break the SCSS or the tests - PASS (my first TC-006 regex wasn't CRLF-aware; re-run with CR stripped)

### Error Handling
- [x] ✅ TC-012: mutation — a variable without an `:export` line fails `exports every variable declared in design.variables.scss`; file restored, `git diff` empty, 25/25 again - PASS

### Integration Points
- [x] ✅ TC-010: component SCSS consumes design variables only - PASS
- [x] ✅ TC-015: palette isolation - PASS
- [x] ✅ TC-016: negative space - PASS
- [x] ✅ TC-017: no stale `src/tokens` pointers (ISS-003 verified fixed) - PASS

---

## Issues Found

| ID | Severity | Category | Description | Reproduction Steps | Status |
|----|----------|----------|-------------|-------------------|--------|
| BUG-001 | 🟡 Medium | Functional / Spec | `$gray700` is `#414651`; `ui-ux-spec.md` `design_tokens.colors.gray.700` is `#404042`. The spec value is not in the palette, so AC-01 fails. Same as review ISS-001 (deferred, needs a design decision). It affects `inputLabelColor`. | 1. Open `docs/ui-ux/ui-ux-spec.md` line 27 → `#404042`. 2. Open `src/styles/pallete.color.scss` → `$gray700: #414651;`. 3. `grep -i 404042 src/styles/pallete.color.scss` → no match | Open — awaiting design decision |
| BUG-002 | 🟠 High | Integration / Packaging | The CJS entry exports nothing. `package.json` has `"type": "module"`, so Node loads `dist/index.cjs.js` (CommonJS code, `.js` extension) as ESM. `require('@annexus/ui')` returns `{}` and `designVariables`/`Input` are `undefined`, with no error. Origin: Story 3.1 `vite.config.ts` `fileName` (`index.cjs.js`) + `"type": "module"`; the Story 3.2 commit didn't change either. | 1. `pnpm build`. 2. `node -e "console.log(Object.keys(require('@annexus/ui')))"` → `[]`. 3. Compare `node -e "import('@annexus/ui').then(m=>console.log(Object.keys(m)))"` → `['Input','designVariables']`. 4. Forcing CommonJS evaluation of the same file yields both exports, so the code is correct and the extension is the problem. | Open — DEV (Story 3.1 / build config) |

### Observations (not defects for Story 3.2)

| ID | Severity | Note |
|----|----------|------|
| OBS-001 | 🟢 Low | `Input.scss:23` uses `var(--annexus-radius-md, 4px)`, and the Input spacing/sizing values are literal px. Review ISS-005 deferred this to Story 1.2, and the story says radius/spacing variables are added per component story. Cover it in the Story 1.2 catch-up QA. |
| OBS-002 | 🟢 Low | `DesignVariables` is typed `Record<string, string>` (from `scss-modules.d.ts`), so consumers get no key autocomplete and a typo like `designVariables.inputLabelColour` type-checks. |
| OBS-003 | 🟢 Low | Vitest prints `DEPRECATION WARNING [legacy-js-api]` from Dart Sass for each SCSS module. No current impact; it will break when Sass 2.0 lands (set `css.preprocessorOptions.scss.api: 'modern-compiler'`). |
| OBS-004 | 🟢 Low | Story 3.1's validation only checked that `dist/index.cjs.js` exists, which is how BUG-002 got past it. Add a `require()` smoke check to the regression suite and to Story 3.6 CI. |

---

## Test Evidence

### TC-001 — `pnpm build`
```
✓ 8 modules transformed.
[vite:dts] Declaration files built in 1354ms.
dist/style.css     1.32 kB │ gzip: 0.50 kB
dist/index.es.js   2.75 kB │ gzip: 1.11 kB
dist/index.cjs.js  2.10 kB │ gzip: 1.00 kB
✓ built in 7.29s
exit=0
dist/: components/ index.cjs.js index.d.ts index.es.js style.css styles/
```

### TC-002 / TC-003 — typecheck, lint
```
$ tsc --noEmit
exit=0
$ eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0
exit=0
```

### TC-004 — `pnpm coverage`
```
 ✓ src/styles/designVariables.test.ts (7 tests) 8ms
 ✓ src/components/Input/Input.test.tsx (18 tests) 259ms
 Test Files  2 passed (2)
      Tests  25 passed (25)
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
All files          |     100 |      100 |     100 |     100 |
 components/Input  |     100 |      100 |     100 |     100 |
 styles            |     100 |      100 |     100 |     100 |
exit=0
```

### TC-005 — spec hex → palette
```
PASS  primary=#11175E -> midnightBlue     PASS  50=#FAFAFA  -> gray50
PASS  hover=#1B3E80   -> cobaltBlue       PASS  100=#F5F5F5 -> gray100
PASS  cta=#0167AC     -> azureBlue        PASS  200=#E9EAEB -> gray200
PASS  700=#044638     -> deepGreen        PASS  300=#D5D7DA -> gray300
PASS  success=#079455 -> jadeGreen        PASS  400=#A4A7AE -> gray400
PASS  error=#B73B3B   -> brickRed         PASS  500=#717680 -> gray500
PASS  control-off=#CED6DB -> lightSteel   FAIL  700=#404042 -> MISSING
PASS  white=#FFFFFF   -> white            PASS  900=#181D27 -> gray900
PASS  black=#222222   -> jetBlack
```

### TC-006 / TC-007 / TC-008 / TC-011
```
palette lines 20; non-conforming (CR stripped): 0
grays: gray50,gray100,gray200,gray300,gray400,gray500,gray600,gray700,gray800,gray900
names 20 unique 20 | hex 20 unique 20
first statement: @use 'pallete.color' as palette;
vars 26 unique 26 | color vars 13 all palette refs: true | undefined palette refs: none
declared 26 exported 26 identical: true key/var mismatches: none
```

### TC-010 / TC-015 / TC-016 / TC-017
```
src/components/Input/Input.scss
no hex
no palette refs
Input.scss:1:@use '../../styles/design.variables' as *;
pallete.color referenced by: src/styles/design.variables.scss, src/styles/designVariables.test.ts
no src/tokens | no --annexus-* definitions | no dark mode | no stale src/tokens pointers
usage only: Input.scss:23: border-radius: var(--annexus-radius-md, 4px);   (OBS-001)
```

### TC-012 — mutation
```
+ $qaProbeColor: palette.$white;        (appended to design.variables.scss)
 × designVariables > exports every variable declared in design.variables.scss
 AssertionError: expected [ 'fontFamilyBase', …(25) ] to deeply equal [ 'fontFamilyBase', …(26) ]
 -   "qaProbeColor",
 Tests  1 failed | 24 passed (25)       exit(mutated)=1
git checkout -- src/styles/design.variables.scss → git diff empty
 Tests  25 passed (25)                  exit(restored)=0
```

### TC-013 — `dist/index.d.ts`
```
export { Input } from './components/Input';
export type { InputProps } from './components/Input';
export { designVariables } from './styles/designVariables';
export type { DesignVariables } from './styles/designVariables';
```

### TC-014 — built package import (BUG-002 evidence)
```
ESM  import('./dist/index.es.js') → 26 keys | inputLabelColor #414651 | focus #11175e | font "Assistant", sans-serif
ESM  import('@annexus/ui')        → [ 'Input', 'designVariables' ]
CJS  require('@annexus/ui')       → keys: []  designVariables: undefined
CJS  require('./dist/index.cjs.js') → []
     forced CommonJS evaluation of dist/index.cjs.js → [ 'Input', 'designVariables' ] | 26 keys | #414651
vite.config.ts:18  fileName: (format) => `index.${format === 'es' ? 'es' : 'cjs'}.js`   (unchanged since Story 3.1, c560be4)
```

---

## Recommendations

### Must Fix Before Release (Blockers)
1. **BUG-002**: emit the CJS bundle with a `.cjs` extension (e.g. `index.cjs`) and point `main` / `exports["."].require` at it, or drop the CJS format if the team decides on ESM only. Add a `require('@annexus/ui')` smoke test. Owner: DEV (Story 3.1 build config). Fix it before Story 3.6 CI so the pipeline checks it.

### Should Fix Before Release
1. **BUG-001**: design decides on gray 700. If `#404042` (the spec) wins, change `$gray700`. If `#414651` (Figma) wins, update `ui-ux-spec.md` and the story Observable stays as is. Either way, AC-01 is then re-tested.

### Can Fix After Release
1. OBS-002: type `DesignVariables` with explicit keys.
2. OBS-003: switch Sass to the modern compiler API.
3. OBS-001: handled by the Story 1.2 follow-up (ISS-005).

---

## Sign-Off

**AIREQA Agent**
**Date**: 2026-10-21
**Status**: CONDITIONAL
**Notes**: Story 3.2 functionality is verified with evidence. Sign-off becomes APPROVED when BUG-001 is resolved by a design decision and re-tested (TC-005). BUG-002 doesn't come from Story 3.2, but it blocks any package release and should be logged against Story 3.1 / the build config.
