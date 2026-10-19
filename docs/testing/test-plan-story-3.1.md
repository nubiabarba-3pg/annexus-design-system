# Test Plan — Story 3.1: Repo Scaffold

**Scope**: Story 3.1 — Repo Scaffold (`@annexus/ui` package foundation)
**BUILDID**: CYCLE-1 | **AzureDevOps**: #23665
**Created**: 2026-10-19 | **Author**: QA Agent
**Status**: Ready for execution

---

## Scope

**Coverage**: Story 3.1 — Repo Scaffold (CYCLE-1 Foundation)
**In Scope**:
- `package.json` — all fields, scripts, peerDeps, devDeps
- `vite.config.ts` — Vite 6 library mode, ESM+CJS dual output, CSS rename
- `tsconfig.json` — TypeScript strict mode and compiler options
- `.eslintrc.cjs` — ESLint config correctness
- `.prettierrc` — Prettier formatting config
- `.npmrc` — GitHub Packages registry scope
- `pnpm-workspace.yaml` — workspace + `allowBuilds`
- `src/index.ts` — empty barrel existence
- `src/styles.scss` — CSS placeholder existence and content
- `dist/` — build output files (4 required files)
- Idempotency — repeated build/install produces identical output

**Out of Scope**:
- React component code (no components in Story 3.1)
- SCSS design tokens (Story 3.2)
- Storybook configuration (Story 3.3)
- Vitest configuration (Story 3.4)
- Shared utilities (Story 3.5)
- CI/CD pipeline (Story 3.6)
- Chromatic integration (Story 3.6)
- Any downstream story functionality

**Test Type**: Manual verification only — no Vitest unit tests apply to configuration files (per story spec: "Tests (manual — no Vitest tests for config files)").

---

## Requirements Traceability

| Req ID | Acceptance Criterion | Test Scenarios |
|--------|----------------------|----------------|
| AC-01 | `pnpm install` exits 0; no peer dep warnings | TC-001 |
| AC-02 | `pnpm build` exits 0; `dist/` contains exactly 4 files | TC-002, TC-003 |
| AC-03 | `pnpm typecheck` exits 0 (zero TS errors, strict mode) | TC-004 |
| AC-04 | `pnpm lint` exits 0 (zero ESLint errors/warnings) | TC-005 |
| AC-05 | `.npmrc` scopes `@annexus` to GitHub Packages | TC-006 |
| AC-06 | `package.json` name=`@annexus/ui`, version=`0.0.1`, type=`module` | TC-007 |
| AC-07 | `package.json` peerDeps include `react@^18` and `react-dom@^18` | TC-007 |
| AC-08 | `package.json` has all 8 required scripts | TC-008 |
| AC-09 | `package.json` main/module/types point to `dist/` | TC-009 |
| AC-10 | `vite.config.ts` entry=`src/index.ts`, formats=`['es','cjs']`, external correct | TC-010 |
| AC-11 | `tsconfig.json` strict=true, target=ESNext, moduleResolution=bundler | TC-011 |
| AC-12 | `.eslintrc.cjs` extends `@typescript-eslint/recommended` + `react-hooks/recommended` | TC-012 |
| AC-13 | `src/index.ts` exists (no export errors) | TC-013 |
| AC-14 | Idempotency: `pnpm install` twice → same lockfile | TC-014 |
| AC-15 | Idempotency: `pnpm build` from clean `dist/` → identical output | TC-015 |
| AC-16 | Negative space: no React components in `src/` | TC-016 |
| AC-17 | Negative space: no Storybook config (no `.storybook/`) | TC-016 |
| AC-18 | Negative space: no Vitest config (no `vitest.config.ts`) | TC-016 |
| AC-19 | Negative space: no CI/CD pipeline (no `.github/workflows/`) | TC-016 |

---

## Test Scenarios

| ID | Category | Command / Check | Expected Result | Priority |
|----|----------|-----------------|-----------------|----------|
| TC-001 | Install | `pnpm install` | Exit 0; `node_modules/` created; `pnpm-lock.yaml` generated; no peer dep warnings | 🔴 Critical |
| TC-002 | Build | `pnpm build` | Exit 0; no errors; Vite reports successful build | 🔴 Critical |
| TC-003 | Build Output | `ls dist/` | Exactly 4 files: `index.es.js`, `index.cjs.js`, `index.d.ts`, `style.css` — no more, no less | 🔴 Critical |
| TC-004 | TypeCheck | `pnpm typecheck` | Exit 0; zero output (clean) | 🔴 Critical |
| TC-005 | Lint | `pnpm lint` | Exit 0; zero ESLint warnings or errors | 🔴 Critical |
| TC-006 | Registry | `grep "@annexus" .npmrc` | Returns `@annexus:registry=https://npm.pkg.github.com` | 🔴 Critical |
| TC-007 | package.json core fields | `cat package.json \| jq '.name,.version,.type'` | `"@annexus/ui"`, `"0.0.1"`, `"module"` | 🔴 Critical |
| TC-008 | package.json scripts | `cat package.json \| jq '.scripts \| keys[]'` | Contains: `build`, `dev`, `storybook`, `build-storybook`, `test`, `typecheck`, `lint`, `prepublishOnly` | 🟠 High |
| TC-009 | package.json exports | `cat package.json \| jq '.main,.module,.types'` | `"./dist/index.cjs.js"`, `"./dist/index.es.js"`, `"./dist/index.d.ts"` | 🟠 High |
| TC-010 | vite.config.ts | Inspect `vite.config.ts` | entry=`src/index.ts`; formats=`['es','cjs']`; external includes `react`, `react/jsx-runtime`, `react-dom`; `assetFileNames` routes `.css` → `style.css` | 🟠 High |
| TC-011 | tsconfig.json | Inspect `tsconfig.json` | `strict:true`, `target:"ESNext"`, `moduleResolution:"bundler"`, `jsx:"react-jsx"`, `declaration:true`, `include:["src"]` | 🟠 High |
| TC-012 | ESLint config | Inspect `.eslintrc.cjs` | Extends `@typescript-eslint/recommended` + `react-hooks/recommended`; `react/react-in-jsx-scope` OFF; no `plugins` array | 🟠 High |
| TC-013 | Barrel exists | `cat src/index.ts` | File exists; contains SCSS import; no component exports | 🟡 Medium |
| TC-014 | Idempotency — install | Run `pnpm install` twice; compare `pnpm-lock.yaml` hash before and after | Hash identical; no new entries; no warnings | 🟡 Medium |
| TC-015 | Idempotency — build | Delete `dist/`; run `pnpm build` twice; compare `dist/` contents | Same 4 files with identical byte sizes on both runs | 🟡 Medium |
| TC-016 | Negative space | `ls src/components/ \| wc -l`; `ls .storybook 2>/dev/null`; `ls vitest.config.ts 2>/dev/null`; `ls .github/workflows/ 2>/dev/null` | `src/components/` is empty (0 files); `.storybook/` not found; `vitest.config.ts` not found; `.github/workflows/` not found | 🟡 Medium |
| TC-017 | Prettier config | Inspect `.prettierrc` | `singleQuote:true`, `semi:true`, `tabWidth:2`, `trailingComma:"all"`, `printWidth:100` | 🟢 Low |
| TC-018 | pnpm workspace | Inspect `pnpm-workspace.yaml` | `packages: ['.']`; `allowBuilds` entries for `@parcel/watcher` and `esbuild` | 🟢 Low |
| TC-019 | SCSS placeholder | `cat src/styles.scss` | Contains `box-sizing: border-box` reset; contains Story 3.2 forward-pointer comment | 🟢 Low |
| TC-020 | `dist/style.css` content | `cat dist/style.css` | Contains compiled CSS reset (`box-sizing: border-box`); non-empty | 🟢 Low |
| TC-021 | peerDeps version | `cat package.json \| jq '.peerDependencies'` | `react: "^18.0.0"`, `react-dom: "^18.0.0"` | 🟢 Low |
| TC-022 | Regression gate | Run `pnpm build && pnpm typecheck && pnpm lint` in sequence | All three exit 0 in a single pipeline; no inter-step failures | 🟠 High |

---

## Test Data Requirements

This story has no user-facing features, business logic, or dynamic data — all tests are CLI command executions and file inspections. No test fixtures, seeds, or mock data are required.

**Environment requirements**:
- Node.js 26 LTS (or Node.js 24/25 compatible) installed
- pnpm 12.x installed (`pnpm --version`)
- Repository cloned to a local machine (`git clone`)
- No prior `node_modules/` or `dist/` cached state for idempotency tests (TC-014, TC-015)
- Network access to `registry.npmjs.org` for `pnpm install`

---

## Environment Requirements

| Requirement | Value |
|-------------|-------|
| Node.js | 26 LTS (or ≥ 24 compatible) |
| pnpm | 12.x |
| OS | macOS / Linux (CI: Ubuntu) |
| Shell | bash or zsh |
| Network | Internet access (npm registry) |
| Clean state for TC-014/015 | `rm -rf node_modules dist/` before idempotency runs |

---

## Execution Order

Run test cases in this order to respect dependencies:

1. **TC-001** — Install first (all other tests depend on `node_modules/`)
2. **TC-002, TC-003** — Build (produces `dist/`)
3. **TC-004** — Typecheck (uses installed TS)
4. **TC-005** — Lint (uses installed ESLint)
5. **TC-006 through TC-013** — Config file inspections (order-independent)
6. **TC-014** — Idempotency install (run after TC-001 baseline)
7. **TC-015** — Idempotency build (clean `dist/` first)
8. **TC-016** — Negative space checks
9. **TC-017 through TC-021** — Low-priority config inspections
10. **TC-022** — Full regression pipeline (must be last)

---

## Quality Gates

| Gate | Target | Mandatory |
|------|--------|-----------|
| `pnpm install` exits 0 | No errors, no peer dep warnings | ✅ Yes |
| `pnpm build` exits 0 | 4-file `dist/` output | ✅ Yes |
| `pnpm typecheck` exits 0 | Zero TypeScript errors | ✅ Yes |
| `pnpm lint` exits 0 | Zero ESLint errors or warnings | ✅ Yes |
| `.npmrc` registry correct | `@annexus` → GitHub Packages URL | ✅ Yes |
| Vitest coverage | N/A (no source code in 3.1) | N/A |
| All Critical test cases pass | TC-001 through TC-006 | ✅ Yes |
| All High test cases pass | TC-008 through TC-012, TC-022 | ✅ Yes |
| Zero open Critical/High bugs | No blockers at sign-off | ✅ Yes |

**Release recommendation**: Story 3.1 is a prerequisite for all other CYCLE-1 stories. All Critical and High test cases MUST pass before any dependent story (3.2–3.6) begins.

---

## Test Execution Log Template

For each test case, record:

```
TC-ID: ___
Date: ___
Tester: ___
Command: ___
Exit code: ___
Output snippet:
  <paste terminal output>
Result: ✅ PASS / ❌ FAIL / ⚠️ BLOCKED
Notes: ___
```

---

## Schedule

| Activity | Target Date |
|----------|-------------|
| Test plan created | 2026-10-19 |
| Test execution | When Story 3.1 is merged to main |
| Validation report | After execution (`aire-qa-validate`) |
| Sign-off | Before Story 3.2 begins |

---

## Bugs Found

*(Populated during `aire-qa-validate` execution — none at plan time)*

---

## Next Steps

- [ ] Merge Story 3.1 PR (#2) to `main`
- [ ] Execute test plan via `aire-qa-validate story 3.1`
- [ ] File bugs in Azure DevOps (#23665 parent) for any failures
- [ ] Sign off before Story 3.2 begins
