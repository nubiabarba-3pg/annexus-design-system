# Story 3.3 Self-Review

**Date**: 2026-10-26
**Story**: Storybook 8.x Setup — react-vite framework, a11y addon, autodocs
**Developer**: DEV Agent (Dev-1, Salvador)
**Branch**: `feat/cycle-1-story-3.3-storybook-rework` (fresh from `main` @ `41e6eb0`; supersedes closed PR #5, which was built on the pre-CR-001 `src/tokens` layout)
**AzureDevOps**: #23668 → In Progress

---

## What Was Implemented

- `.storybook/main.ts` — `@storybook/react-vite` framework, `addon-essentials` + `addon-a11y`, stories glob `../src/**/*.stories.@(js|jsx|ts|tsx)`, `docs.autodocs: 'tag'`
- `.storybook/preview.ts` — imports `../src/styles.scss` (the same entry `dist/style.css` is built from), controls matchers, global a11y parameters
- `.gitignore` — `storybook-static/` (build output stays out of the repo)
- `package.json` / `pnpm-lock.yaml` — `@storybook/addon-essentials` floor raised to `^8.6.19` so every Storybook package resolves to 8.6.19

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `.storybook/main.ts` | New | Storybook framework, addons, stories glob, autodocs |
| `.storybook/preview.ts` | New | Global stylesheet import + preview parameters |
| `.gitignore` | Modified | Ignore `storybook-static/` |
| `package.json` | Modified | `@storybook/addon-essentials` `^8.0.0` → `^8.6.19` |
| `pnpm-lock.yaml` | Modified | addon-essentials and its 9 sub-addons (actions, backgrounds, controls, docs, highlight, measure, outline, toolbars, viewport) 8.6.14 → 8.6.19. The 8.6.14 copies of `blocks`, `csf-plugin` and `react-dom-shim` merge onto existing 8.6.19 entries. No non-`@storybook` package changes |

## Patterns Applied

| Pattern | Where Applied | Notes |
|---------|---------------|-------|
| `@storybook/react-vite` shares the library Vite config | `.storybook/main.ts:6-9` | Component SCSS compiles through the same Sass pipeline as `pnpm build` |
| a11y addon on every story, no per-story config (patterns §5.3) | `.storybook/main.ts:5`, `.storybook/preview.ts:14-17` | axe-core ran on `Atoms/Input` with no story-level setup |
| Autodocs opt-in per story via `tags: ['autodocs']` (patterns §5.1, §10.3) | `.storybook/main.ts:10-12` | Not enabled globally in `preview.ts`, so it stays opt-in |
| Storybook renders what consumers get | `.storybook/preview.ts:4` | Lesson from PR #5 review ISS-001: import the shipped global stylesheet, not partials |

## Testing Summary

The story specifies manual tests (`Tests (manual)`), and `pnpm build-storybook` becomes the CI regression gate in Story 3.6. So TDD here is a scripted red → green on the Storybook build, plus headless-Chrome checks driven over CDP (`google-chrome --headless=new`). A Vitest test would also have been possible without touching Story 3.4's file: `vitest.config.ts` has no `include` override and Vitest globs dot-folders. Manual tests were chosen because the story asks for them.

- **Unit Tests**: 0 new (config-only story); existing suite 35/35 passing
- **Integration**: `pnpm build-storybook` red → green; dev server + headless-Chrome checks
- **Coverage**: 100% (unchanged — no `src/` code touched)

**Red — before `.storybook/` existed**:
```
$ pnpm build-storybook
... validateConfigurationFiles ...
  data: { location: '.../annexus-design-system/.storybook' },
  fromStorybook: true, category: 'CORE-SERVER', code: 6
[ELIFECYCLE] Command failed with exit code 7.
exit=7
```

**Green — after config**:
```
$ storybook build
@storybook/core v8.6.19
info => Building manager..
info => Manager built (113 ms)
info => Building preview..
✓ 109 modules transformed.
storybook-static/iframe.html                 17.56 kB │ gzip:   4.99 kB
storybook-static/assets/preview-3yEGi_Su.css  0.04 kB │ gzip:   0.06 kB
storybook-static/assets/Input.stories-C3bKQjXh.js 5.51 kB │ gzip: 1.85 kB
storybook-static/assets/axe-r5FRfDe-.js     676.65 kB │ gzip: 194.15 kB
...
✓ built in 3.83s
info => Preview built (4.88 s)
info => Output directory: .../annexus-design-system/storybook-static
exit=0

$ ls storybook-static/index.html
storybook-static/index.html
```

**Built artifacts**:
```
project.json framework: { name: '@storybook/react-vite', options: {} }
project.json addons:    ["@storybook/addon-essentials","@storybook/addon-a11y"]
sb-addons/: a11y-9 essentials-actions-2 essentials-backgrounds-4 essentials-controls-1 essentials-docs-3
            essentials-measure-7 essentials-outline-8 essentials-toolbars-6 essentials-viewport-5
preview CSS: *,*:before,*:after{box-sizing:border-box}
index.json: docs  atoms-input--docs   ["dev","test","autodocs"]
            story atoms-input--default (+7 more Input stories)
```

**Dev server** (`pnpm storybook --ci --no-open`). Excerpt; only the update-available banner is omitted:
```
$ storybook dev -p 6006 --ci --no-open
@storybook/core v8.6.19
(node:100145) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.
info => Starting manager..
info => Starting preview..
Storybook 8.6.19 for react-vite started
133 ms for manager and 702 ms for preview
Local: http://127.0.0.1:6006/
storybook http=200
```
No "incompatible packages" warning (it was printed on every start in PR #5 while addon-essentials sat at 8.6.14). The `DEP0190` line is a Node 26 deprecation emitted by Storybook core's own `spawn(..., { shell: true })`, not by this config. When the server was stopped, the log ended with `[ELIFECYCLE] Command failed.`: that is pnpm reporting its child shell was terminated by the stop signal. There was no stack trace or error output from Storybook.

**Headless Chrome (CDP) against `http://localhost:6006`**:
```
[story atoms-input--default] console errors/warnings: 1
  - log.error: Failed to load resource: 404 (Not Found) http://localhost:6006/favicon.svg
addon panel tabs: ["Controls6","Actions","Accessibility"]
preview iframe: {"inputRendered":true,"inputBoxSizing":"border-box"}
a11y panel: ["0 Violations","7 Passes","0 Incomplete"]
[a11y panel opened] console errors/warnings: 0
[docs atoms-input--docs] console errors/warnings: 2
  - console.error: Warning: Received `true` for a non-boolean attribute `htmlFor` (at label ← markdown-to-jsx ← ArgRow ← ArgsTable)
  - console.error: Warning: Received `true` for a non-boolean attribute `id`      (at input ← markdown-to-jsx ← ArgRow ← ArgsTable)
autodocs page rendered: true
```
All three messages originate outside this story's config (see Challenges). The two React errors are **not** confined to a page users have to navigate to. `http://localhost:6006/` redirects to `?path=/docs/atoms-input--docs` (the first index entry), so they appear on first launch, together with the favicon 404.

**Global reset reaches story elements: static build + control** (`python3 -m http.server` on `storybook-static/`, headless Chrome on `iframe.html?id=atoms-input--default&viewMode=story`). `.annexus-input__field` is a confounded probe because `Input.scss:33` sets `box-sizing` on it itself, so the check uses elements `Input.scss` does not style:
```
universal box-sizing rules: [{"href":"/assets/preview-3yEGi_Su.css","rule":"*, ::before, ::after { box-sizing: border-box; }"}]
with preview stylesheet:     {"body":"border-box","label":"border-box","field":"border-box"}
preview stylesheet disabled: {"body":"content-box","label":"content-box","field":"border-box"}
```
`body` and `.annexus-input__label` depend on the preview stylesheet, which carries the `src/styles.scss` reset.

**Idempotency** — two clean builds, file lists compared (content hashes normalised):
```
build #2 exit=0
files: 66 vs 66
IDENTICAL file lists
```

**Full suite** (`pnpm coverage`):
```
 ✓ src/utils/classNames.test.ts (7 tests) 2ms
 ✓ src/utils/devWarning.test.ts (3 tests) 3ms
 ✓ src/styles/designVariables.test.ts (7 tests) 4ms
 ✓ src/components/Input/Input.test.tsx (18 tests) 126ms
 Test Files  4 passed (4)
      Tests  35 passed (35)
-------------------|---------|----------|---------|---------|
File               | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files          |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|
```

**Linter / typecheck / build**:
```
$ pnpm lint        → eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0   exit=0
$ pnpm typecheck   → tsc --noEmit                                                                exit=0
$ pnpm build       → dist/index.es.js 2.75 kB, dist/index.cjs 2.10 kB, dist/style.css 1.32 kB     exit=0
$ pnpm smoke:require → require smoke check passed                                                exit=0
$ npx eslint .storybook --ext ts --max-warnings 0                                                exit=0
$ npx tsc --noEmit --strict --module ESNext --moduleResolution bundler --target ESNext \
    --skipLibCheck --allowSyntheticDefaultImports .storybook/main.ts .storybook/preview.ts \
    src/styles/scss-modules.d.ts                                                                 exit=0
```

---

## DoD Evidence

### Gate 1 — Spec Echo

| # | Requirement | Source | Proof | Result |
|---|-------------|--------|-------|--------|
| AC1 | Framework is `@storybook/react-vite` | Story AC | `.storybook/main.ts:7`; `project.json` framework `@storybook/react-vite` | ✅ |
| AC2 | Addons include `addon-essentials` and `addon-a11y` | Story AC | `.storybook/main.ts:5`; `sb-addons/` has `a11y-9` + 8 `essentials-*` bundles | ✅ |
| AC3 | Stories glob `['../src/**/*.stories.@(js\|jsx\|ts\|tsx)']` | Story AC | `.storybook/main.ts:4` (exact string); `index.json` picks up `src/components/Input/Input.stories.tsx` | ✅ |
| AC4 | `docs: { autodocs: 'tag' }` | Story AC | `.storybook/main.ts:10-12`; `index.json` has `atoms-input--docs` generated from `tags: ['autodocs']` | ✅ |
| AC5 | `preview.ts` imports `'../src/styles.scss'` | Story AC | `.storybook/preview.ts:4`; built preview CSS is `*,*:before,*:after{box-sizing:border-box}`. In the browser, `body` and `.annexus-input__label` (not styled by `Input.scss`) compute `border-box` and revert to `content-box` when the preview stylesheet is disabled (reset check above) | ✅ |
| AC6 | `pnpm storybook` launches on port 6006; zero console errors; empty sidebar | Story AC | Dev server `Local: http://127.0.0.1:6006/`, HTTP 200. **Not met as written.** `/` lands on the Input docs page, which shows 2 React errors until the Story 1.2 TSDoc fix lands (`src/components/Input/Input.types.ts:4`; tracked in `docs/status.md` Blockers, owner Dev-2). The 1 dev-server favicon 404 is a known Storybook 8.6.19 core-server limitation, and there is no newer 8.x patch. **0 messages originate from `.storybook/`**, which is the scope the story's QA bullet sets ("from Storybook config"). The sidebar lists `Atoms/Input` because Story 1.2 merged early; this story adds no stories (G2.1). QA: validate the console against config scope, and re-check after the 1.2 fix | ⚠️ Not met as written; 0 from config; external causes tracked |
| AC7 | `pnpm build-storybook` exits 0; `storybook-static/index.html` exists | Story AC | Green build `exit=0`; `ls storybook-static/index.html` | ✅ |
| AC8 | a11y addon visible in addons panel of any story | Story AC | CDP: tabs `["Controls6","Actions","Accessibility"]`; panel `0 Violations / 7 Passes / 0 Incomplete` on `atoms-input--default` | ✅ |
| S1 | Step 1 — create `.storybook/main.ts` as specified | Story Steps | `.storybook/main.ts:1-15`. Same keys and values as the snippet; addons array on one line (Prettier) | ✅ |
| S2 | Step 2 — create `.storybook/preview.ts` as specified | Story Steps | `.storybook/preview.ts:1-21`. Same as the snippet plus a two-line WHY comment on the import | ✅ |
| S3 | Step 3 — run `pnpm storybook`, `pnpm build-storybook`, `ls storybook-static/` | Story Steps | Dev server log, build log, `ls` output above | ✅ |
| Q1 | No TypeScript errors in `.storybook/` files | Story Quality | Strict `tsc` on `.storybook/*.ts` exit 0 | ✅ |
| Q2 | `pnpm storybook` exits cleanly | Story Quality | Server stops on signal with no Storybook error or stack trace; the only shutdown line is pnpm's `[ELIFECYCLE] Command failed.` for the signalled child shell. Restarts reproducibly | ✅ |
| Q3 | Idempotent: same config → same output | Story QA Candidate | Two builds, 66 vs 66 files, identical lists | ✅ |
| R1 | CSF3 stories supported (Meta + StoryObj) | Patterns §5.1 (Must Read) | `Input.stories.tsx` (CSF3) indexes and renders: 8 stories + docs entry | ✅ |
| R2 | All stories run axe-core with no per-story config | Patterns §5.3 (Must Read) | Accessibility panel populated on a story with no `a11y` parameters of its own | ✅ |
| R3 | Autodocs opt-in via `tags: ['autodocs']` | Patterns §5.1, §10.3 (Must Read) | No global `tags` in `preview.ts`; docs entry exists only for the tagged file | ✅ |
| R4 | Storybook config lives in `.storybook/main.ts` | Patterns §9.1 (Must Read) | `.storybook/main.ts` | ✅ |
| R5 | `pnpm storybook` launches without errors (empty component list) | Cycle plan AC (Must Read) | Same as AC6 | ⚠️ Same as AC6 |
| R6 | `storybook-static/` ready for Chromatic upload (Story 3.6 CI gate) | Story description / cycle plan | Build exit 0, idempotent, git-ignored | ✅ |
| UR | 👤 User Reference AC "Design token CSS is imported in `preview.ts` so all component stories have access to `--annexus-*` properties" (story line 27; also the System-responses row at line 79) | Story User Reference | Stale since CR-001. Since the re-baseline, no `--annexus-*` custom properties exist by design (design variables are SCSS, consumed via `@use`). Implemented per the authoritative 🤖 AI Agent Reference AC5 (`import '../src/styles.scss'`, `.storybook/preview.ts:4`). QA should validate AC5 against the AI Agent Reference. Story lines 27 and 79 are flagged for PRODUCT_OWNER | ✅ (per AI Agent Reference) |

AC rows: 8 of 8 story AC. Steps: 3 of 3. Reference requirements: 6. User Reference reconciliation: 1.

### Gate 2 — Negative-Space

| # | Rule | Check | Result |
|---|------|-------|--------|
| G2.1 | No component stories in this story | `git diff --name-only origin/main \| grep -c '\.stories\.'` → `0` | ✅ |
| G2.2 | No component code added | `git diff --name-only origin/main -- src \| wc -l` → `0` | ✅ |
| G2.3 | No Chromatic connection | `grep -rin chromatic .storybook package.json .gitignore` → only the explanatory comment at `.storybook/preview.ts:3`; no package, import or config key | ✅ |
| G2.4 | No custom theme or branding | `ls .storybook` → `main.ts preview.ts` (no `manager.ts`); `grep -rn "theme\|staticDirs\|brandTitle\|brandImage" .storybook \| wc -l` → `0` | ✅ |
| G2.5 | No TODO/FIXME | `grep -rn "TODO\|FIXME" .storybook \| wc -l` → `0` | ✅ |
| G2.6 | No secrets | `grep -rniE "token\|secret\|password\|api[_-]?key" .storybook \| wc -l` → `0` | ✅ |

### Gate 3 — Contract Consistency

| Layer A | Layer B | Match |
|---------|---------|-------|
| `main.ts` addons (`addon-essentials`, `addon-a11y`) | `package.json` devDeps (`^8.6.19`, `^8.0.0` → both 8.6.19 installed) | ✅ |
| `main.ts` addons | Built `sb-addons/` (`a11y-9`, `essentials-*` ×8) | ✅ |
| `main.ts` framework `@storybook/react-vite` | devDep `@storybook/react-vite` 8.6.19; `project.json` | ✅ |
| `main.ts` stories glob | Story files on disk (`src/components/Input/Input.stories.tsx`) → `index.json` 8 stories | ✅ |
| `docs.autodocs: 'tag'` | Story meta `tags: ['autodocs']` → `atoms-input--docs` entry | ✅ |
| `preview.ts` `import '../src/styles.scss'` | `dist/style.css` (built from the same entry); both contain `box-sizing:border-box` | ✅ |
| `package.json` scripts `storybook` (`-p 6006`) / `build-storybook` | Dev server on 6006; output in `storybook-static/` (git-ignored) | ✅ |

---

## Challenges Encountered

| Challenge | Resolution | Time Spent |
|-----------|------------|------------|
| `pnpm update @storybook/addon-essentials` stayed on 8.6.14 and reflowed `package.json` formatting | pnpm prefers the `latest` dist-tag (8.6.14) when it satisfies the range; 8.6.19 is published under `v8`. Reverted, set the floor to `^8.6.19` by hand, `pnpm install` | 10 min |
| Dev server 404s on `/favicon.svg` | Storybook 8.6.19 defect: `core-server` registers `GET /favicon.svg` with `sirv()` pointed at the favicon *file*, while `sirv` expects a directory. The static build ships `favicon.svg` correctly. The only config workaround is a repo-owned favicon via `staticDirs`, which is custom branding (OUT), so it is documented, not patched | 10 min |
| Two React `non-boolean attribute` warnings on the Input autodocs page | Root cause is `src/components/Input/Input.types.ts:4`. Its TSDoc `Stable id shared between <label htmlFor> and <input id>` is rendered as markdown, so markdown-to-jsx emits real `<label htmlFor>` / `<input id>` elements with boolean attributes (confirmed in the served `__docgenInfo`). Story 1.2 owns that file (Dev-2), so it is not changed here. Suggested fix: wrap both in backticks. Not live-verified, because Vite does not re-run docgen when a type-only import changes | 15 min |
| `pkill -f` matched its own shell | Stopped the leftover Storybook node process by PID instead | 2 min |

## Deviations from Plan

- **Sidebar not empty.** Story 1.2 (Input) merged to `main` ahead of strict cycle order (PR #8), so the sidebar lists `Atoms/Input`. "Empty sidebar" is read as "this story adds no stories" (G2.1). This lets AC8 be verified now on a real story instead of in CYCLE-2.
- **Files outside `Files Touched`.**
  - `.gitignore`: `storybook-static/` must not be committed.
  - `package.json` / `pnpm-lock.yaml`: aligns addon-essentials so `pnpm storybook` starts without the incompatible-packages warning. Lockfile content changes only for the addon-essentials subtree.
- **TDD form.** No Vitest test, because the story specifies manual tests and `build-storybook` becomes the CI regression gate in Story 3.6. Red → green on `build-storybook`, plus scripted CDP checks, instead.
- **Stale User Reference wording.** The 👤 User Reference AC and the System-responses row still describe pre-CR-001 `--annexus-*` custom properties. The implementation follows the 🤖 AI Agent Reference, which matches CR-001. See Gate 1 row UR. Story lines 27 and 79 are for PRODUCT_OWNER to correct the next time the plan is touched.
- **Comment in `preview.ts`.** Two-line WHY comment on the stylesheet import (patterns §10.2 allows non-obvious reasoning).

## Deferred (carried from PR #5 review, still valid)

- `.storybook/` is outside `pnpm typecheck` (`tsconfig.json` `include: ["src"]`) and `pnpm lint` (`eslint src`). Checked ad hoc here; wire into scripts in Story 3.6 (CI/CD).
- `vite-plugin-dts` from the root `vite.config.ts` runs inside the Storybook build and writes `.d.ts` files into `storybook-static/` (they will reach the Chromatic upload). No functional impact; can be filtered with `viteFinal` if 3.6 wants a lean upload.
- `docs.autodocs` is `@deprecated` in Storybook 8.6 types (`'tag'` is already the default). Kept because AC4 requires it; drop on a Storybook 9+ upgrade.

## Follow-ups for other owners

- **Story 1.2 (Dev-2 / QA catch-up)**: `src/components/Input/Input.types.ts:4`, wrap `<label htmlFor>` / `<input id>` in backticks so the autodocs page renders without React console errors, and the props table without a stray empty `<label>` / `<input>`. Tracked in the `docs/status.md` Blockers table (DEF-3.3-01). It should land before 3.3 QA, because the errors show on Storybook's landing page.
- **PRODUCT_OWNER**: `docs/plans/stories/epic-3-story-3.3-storybook.md:27, 79`, replace the pre-CR-001 `--annexus-*` wording with the global-stylesheet wording of the AI Agent Reference.

## Lessons Learned

1. pnpm resolves to the `latest` dist-tag when it satisfies the range, even if a higher in-range version exists under another tag. To align a package that lags its siblings, set the floor explicitly.
2. TSDoc on public props is rendered as markdown in autodocs. Inline HTML tag names in prose must be in backticks, or they render as live elements.
3. A browser-level console capture finds issues a green `build-storybook` never shows: the favicon route and the docs-page warnings both passed the build.

## Next Steps

- [ ] Ready for code review (`aire-review-code`)
- [ ] Ready for QA validation (`aire-qa-validate`, Vicky)
