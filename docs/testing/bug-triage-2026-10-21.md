# Bug Triage Report

**Date**: 2026-10-21
**Triaged By**: QA Agent
**Source Report(s)**: `docs/testing/validation-report-story-3.2-2026-10-21.md`
**BUILDID**: CYCLE-1

---

## Summary

**Total Bugs**: 2
**Critical**: 0 🔴
**High**: 1 🟠
**Medium**: 1 🟡
**Low**: 0 🟢

**Release Blockers**: 1 (BUG-002)

Observations OBS-001 to OBS-004 from the source report aren't defects and aren't triaged here. OBS-004 (no `require()` smoke check) is folded into the BUG-002 fix.

---

## Release Blocking Bugs

| ID | Severity | Summary | Impact | Recommendation |
|----|----------|---------|--------|----------------|
| BUG-002 | 🟠 High | `require('@annexus/ui')` returns `{}`: the CJS entry exports nothing | Every CommonJS consumer gets `undefined` for `Input` and `designVariables`, silently | MUST FIX before release, and before Story 3.6 CI |

---

## Priority Classification

### P0 - Must Fix Now (Release Blockers)
- None

### P1 - Should Fix Before Release
- BUG-002: CJS entry exports nothing (`"type": "module"` + `index.cjs.js`)

### P2 - Can Fix After Release
- BUG-001: palette gray 700 `#414651` ≠ spec `#404042`. This blocks Story 3.2 **sign-off** (AC-01) but not a release.

### P3 - Nice to Have
- None

---

## Bug Details

### BUG-002: CJS entry exports nothing 🟠
**AzureDevOps**: https://annexus.visualstudio.com/Anexus.AI.Test/_workitems/edit/23779
**Severity**: High
**Priority**: P1
**Category**: Functional (Integration / Packaging)
**Source**: Validation TC-014 (Story 3.2); defect originates in Story 3.1 (ADO #23665)
**Affected Features**: The whole public API (`Input`, `designVariables`, every future component) for consumers resolving the `require` condition: CommonJS apps, Jest without ESM mode, CJS SSR setups
**Affected Users**: All CommonJS consumers of `@annexus/ui`. ESM consumers (Vite, modern bundlers using `import`) are unaffected.
**User Impact**: Silent failure, with no error at load time. Components and variables are `undefined`, so the crash happens later and far from the cause.
**Root Cause**: `package.json` has `"type": "module"`, so Node treats every `.js` file in the package as ESM. `vite.config.ts:18` emits the CommonJS bundle as `index.cjs.js`, which Node then loads as ESM, and that yields no exports. The bundle code itself is correct: forced CommonJS evaluation returns both exports.
**Reproduction**:
1. `pnpm build`
2. `node -e "console.log(Object.keys(require('@annexus/ui')))"` → `[]`
3. `node -e "import('@annexus/ui').then(m=>console.log(Object.keys(m)))"` → `[ 'Input', 'designVariables' ]`
**Workaround**: Consumers use `import` / an ESM-capable bundler. That works, but the package advertises a `require` export that is broken.
**Dependencies**: Should land before Story 3.6 (CI/CD) so the pipeline can include a `require()` smoke check (OBS-004). Independent of BUG-001.
**Recommendation**: FIX NOW. Emit the CJS bundle as `index.cjs` (`fileName` → `` `index.${format === 'es' ? 'es.js' : 'cjs'}` ``), update `main` and `exports["."].require` in `package.json`, and add a test or script asserting that `require('@annexus/ui')` exposes `designVariables`. Alternative: drop the CJS format if the team decides on ESM only. That's a product decision and would need an ADR.
**Assigned To**: DEV
**Target**: 2026-10-22 (CYCLE-1 close)

### BUG-001: Palette gray 700 differs from UI/UX spec 🟡
**AzureDevOps**: https://annexus.visualstudio.com/Anexus.AI.Test/_workitems/edit/23780
**Severity**: Medium
**Priority**: P2
**Category**: UI (Spec conformance)
**Source**: Validation TC-005 (Story 3.2, AC-01); duplicate of code review ISS-001 (`docs/reviews/story-3.2-code-review-v1.md`)
**Affected Features**: `$gray700` → `$inputLabelColor` (Input label text). Any future component using gray 700.
**Affected Users**: All. The visual difference is negligible (`#414651` vs `#404042`, both near-black gray). Contrast on white is ≥ 9:1 either way, so there's no accessibility impact.
**User Impact**: Cosmetic for now. The risk is the source of truth drifting: Figma (`#414651`) and `ui-ux-spec.md` (`#404042`) disagree.
**Workaround**: None needed functionally.
**Dependencies**: Blocked on a **design / PO decision**, not on DEV. Independent of BUG-002.
**Recommendation**: FIX LATER, once decided. If the spec wins, change `$gray700` to `#404042` and update the story Observable (`inputLabelColor === '#404042'`). If Figma wins, update `docs/ui-ux/ui-ux-spec.md` line 27 and add `gray600`/`gray800` there too. In both cases QA re-runs TC-005 to approve Story 3.2.
**Assigned To**: Design / PRODUCT_OWNER (decision) → DEV (apply)
**Target**: Decision before CYCLE-1 close (2026-10-22). It gates Story 3.2 sign-off.

---

## Release Decision

**Recommendation**:
- [ ] ✅ APPROVE RELEASE (no blockers)
- [ ] ❌ BLOCK RELEASE (P0 bugs exist)
- [x] ⚠️ CONDITIONAL RELEASE (with documented issues)

**Rationale**: No P0/Critical bugs. BUG-002 (🟠 High, P1) blocks any package release under the QA rulebook, so `@annexus/ui` must not be published until it's fixed. CYCLE-1 work can continue in parallel. Story 3.2 sign-off stays CONDITIONAL until BUG-001 is decided and re-tested.

---

## Tracker Push (Azure DevOps)

**Status**: ✅ Pushed 2026-10-21

| Bug | Work Item | ADO Priority | Tags | Iteration | Parent |
|-----|-----------|--------------|------|-----------|--------|
| BUG-002 | [#23779](https://annexus.visualstudio.com/Anexus.AI.Test/_workitems/edit/23779) | 2 | `bug;cycle-1;P1-high;severity:high` | `Anexus.AI.Test\Sprint 1` | #23665 (Story 3.1) |
| BUG-001 | [#23780](https://annexus.visualstudio.com/Anexus.AI.Test/_workitems/edit/23780) | 3 | `bug;cycle-1;P2-medium;severity:medium` | `Anexus.AI.Test\Sprint 1` | #23669 (Story 3.2) |

The required custom field "Iteration #" was copied from each parent story.

---

## Next Steps
1. DEV: fix BUG-002 via `aire-dev-remediate` (P1, target 2026-10-22)
2. Design / PO: decide gray 700 for BUG-001; DEV applies it
3. QA: re-validate TC-005 and TC-014 after the fixes. Add a `require()` smoke check to the regression suite.

---

## Remediation Section

**Date**: 2026-10-21 | **Agent**: DEV

| Bug | Files changed | Result |
|-----|---------------|--------|
| BUG-002 | `vite.config.ts` (CJS emitted as `index.cjs`), `package.json` (`main`, `exports.require`, `smoke:require` script wired into `prepublishOnly`), `scripts/smoke-require.cjs` | ✅ `require('@annexus/ui')` build output exposes `Input` and `designVariables` |
| BUG-001 | `src/styles/pallete.color.scss` (`$gray700` → `#404042`), `src/styles/designVariables.test.ts` (asserts `inputLabelColor === '#404042'`), story 3.2 Observable updated | ✅ Spec value adopted (decision: spec wins) |

**Tests**: 25/25 pass | **Coverage**: 100% | `pnpm build` / `typecheck` / `lint` / `smoke:require` exit 0
**Next**: QA re-runs TC-005 and TC-014. The `require()` smoke check is not yet in CI (Story 3.6).

## QA Verification

**Date**: 2026-10-21 | **Agent**: QA | **Evidence**: `docs/testing/validation-report-story-3.2-2026-10-21-v2.md`

| Bug | Re-test | Result |
|-----|---------|--------|
| BUG-002 | TC-014 + `smoke:require` (also mutation-tested) | ✅ Verified fixed — `require('@annexus/ui')` returns `Input` + `designVariables`, identical to ESM |
| BUG-001 | TC-005 | ✅ Verified fixed — 17/17 spec colors in palette; `inputLabelColor === '#404042'` |

Both bugs can be closed in Azure DevOps (#23779, #23780).
