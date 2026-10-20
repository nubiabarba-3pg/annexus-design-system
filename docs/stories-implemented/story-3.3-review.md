# Story 3.3 Self-Review

**Date**: 2026-10-20
**Story**: Storybook 8.x Setup — `@storybook/react-vite` framework, essentials + a11y addons, autodocs, design tokens in preview
**Developer**: DEV (`aire-dev-implement`, Dev 1, one-by-one)

---

## What Was Implemented

- `.storybook/main.ts` — `@storybook/react-vite` framework, `addon-essentials` + `addon-a11y`, stories glob `../src/**/*.stories.@(js|jsx|ts|tsx)`, `docs.autodocs: 'tag'`
- `.storybook/preview.ts` — imports `../src/tokens/index.scss` so every story gets the 51 `--annexus-*` properties, plus `../src/styles.scss` for the same global reset consumers get from `style.css` (review ISS-001); controls matchers; a11y parameters
- `.gitignore` — `storybook-static/` build output ignored

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `.storybook/main.ts` | New | Storybook framework, addons, stories glob, autodocs |
| `.storybook/preview.ts` | New | Token SCSS + global stylesheet imports, controls matchers, a11y parameters |
| `.gitignore` | Modified | Added `storybook-static/` (approved by user; outside Files Touched) |

## Patterns Applied

| Pattern | Where Applied | Notes |
|---------|---------------|-------|
| `@storybook/react-vite` framework | `.storybook/main.ts:6-9` | Reuses root `vite.config.ts`, so SCSS compiles the same way as the library build |
| a11y addon for WCAG 2.2 AA (patterns §5.3) | `.storybook/main.ts:5`, `.storybook/preview.ts:14-17` | axe-core runs on every story; no per-story config |
| Autodocs via `tags: ['autodocs']` (patterns §5.1, §10.3) | `.storybook/main.ts:10-12` | Opt-in per story meta |

## Testing Summary

- **Unit Tests**: N/A — config-only story; the story specifies manual verification and Vitest is not set up until Story 3.4
- **Red phase**: `pnpm build-storybook` before config → exit 7 (no config found)
- **Green phase**: `pnpm build-storybook` → exit 0; `storybook-static/index.html` present
- **Dev server**: `pnpm storybook --ci` → `http://localhost:6006/` 200, `iframe.html` 200, `index.json` = `{"v":5,"entries":{}}` (empty sidebar)
- **Browser check** (headless Chrome 155 via CDP): manager renders Storybook's "Your Storybook is empty" state; preview iframe has 51 `--annexus-*` properties on `:root` (`--annexus-color-brand-primary: #11175e`)
- **Idempotency**: two consecutive builds → identical 57-file list; only `project.json` differs (`generatedAt` telemetry timestamp)
- **Typecheck**: `pnpm typecheck` exit 0; `.storybook/*.ts` checked separately with `tsc --noEmit --strict` → exit 0 (root `tsconfig.json` only includes `src`)
- **Lint**: `pnpm lint` exit 0; `eslint .storybook --max-warnings 0` exit 0; `prettier --check .storybook` clean
- **Library build**: `pnpm build` exit 0; `dist/style.css` still has 51 `--annexus-*` properties (no regression)

**Build output**:
```
WARN No story files found for the specified pattern: src/**/*.stories.@(js|jsx|ts|tsx)
✓ built in 3.26s
info => Output directory: .../annexus-design-system/storybook-static
EXIT=0
```

## DoD Evidence

### Gate 1 — Spec Echo

| Requirement | Source | Proof |
|---|---|---|
| Framework is `@storybook/react-vite` | Story 3.3 AC | `.storybook/main.ts:7`; `storybook-static/project.json` → `"framework":{"name":"@storybook/react-vite"}` |
| Addons include `addon-essentials` and `addon-a11y` | Story 3.3 AC | `.storybook/main.ts:5`; `storybook-static/sb-addons/` has `a11y-9` + 8 `essentials-*` bundles |
| Stories glob `['../src/**/*.stories.@(js|jsx|ts|tsx)']` | Story 3.3 AC | `.storybook/main.ts:4`; build log echoes the pattern |
| `docs: { autodocs: 'tag' }` | Story 3.3 AC | `.storybook/main.ts:10-12` |
| `preview.ts` imports `'../src/tokens/index.scss'` | Story 3.3 AC | `.storybook/preview.ts:2`; `storybook-static/assets/preview-*.css` contains `--annexus-color-brand-primary`; CDP count = 51 in iframe |
| `pnpm storybook` on port 6006; empty sidebar | Story 3.3 AC | `package.json` script `storybook dev -p 6006`; curl 200 on `:6006`; `index.json` entries `{}` |
| Zero console errors | Story 3.3 AC | ⚠️ Not fully met — see Deviations (Storybook's own empty-index error + dev favicon 404) |
| `pnpm build-storybook` exits 0; `storybook-static/index.html` exists | Story 3.3 AC | build exit 0 (×2); `ls storybook-static` |
| a11y addon visible in addons panel | Story 3.3 AC | `sb-addons/a11y-9/manager-bundle.js` registers the "Accessibility" panel. The panel only shows once a story exists, so the story says to check it visually after the first CYCLE-2 component. |
| Step 1 — create `main.ts` | Story Step 1 | `.storybook/main.ts:1-15` (matches snippet; Prettier collapsed the addons array to one line) |
| Step 2 — create `preview.ts` | Story Step 2 | `.storybook/preview.ts:1-21` (snippet verbatim, plus the `styles.scss` import at lines 3-4 from review ISS-001) |
| Step 3 — run and verify | Story Step 3 | Testing Summary above |
| No TS errors in `.storybook/` | Story Quality | `tsc --noEmit --strict .storybook/main.ts .storybook/preview.ts` → exit 0 |
| Shares the library Vite/SCSS config | Story Description | No `viteFinal` override; `sass` from root devDeps compiles `index.scss` in preview |
| CSF3 / `tags: ['autodocs']` contract for future stories | Patterns §5.1 | Glob + `autodocs: 'tag'` accept CSF3 `*.stories.tsx` in `src/` |
| a11y runs automatically, no per-story config | Patterns §5.3 | Addon registered globally in `main.ts:5`; `preview.ts:14-17` |
| `pnpm storybook` launches without errors (empty list) | Cycle-1 plan AC | Dev server up in 3s; empty index |

### Gate 2 — Negative-Space

- ❌ No component stories: `find src -name '*.stories.*'` → 0 files ✅
- ❌ No Chromatic connection: `grep -ri chromatic .storybook package.json` → no matches ✅
- ❌ No custom theme/branding: no `.storybook/manager.ts`, no `theme` key in `preview.ts` ✅
- No component code added: `src/` unchanged by this story (`git diff --stat 0d9e152 -- src` empty) ✅

### Gate 3 — Contract Consistency

| Producer | Consumer | Match |
|---|---|---|
| `package.json` `storybook` script (`-p 6006`) | AC "launches on port 6006" | ✅ |
| `package.json` `build-storybook` script → `storybook-static/` | Story 3.6 CI (`pnpm build-storybook` → Chromatic) | ✅ default output dir, now git-ignored |
| `src/tokens/index.scss` (Story 3.2, `@forward` barrel) | `.storybook/preview.ts:2` import | ✅ 51 properties resolved in iframe |
| `autodocs: 'tag'` | Patterns §5.1 meta `tags: ['autodocs']` | ✅ |
| Glob `src/**/*.stories.@(js\|jsx\|ts\|tsx)` | Patterns §2 co-located `Component.stories.tsx` | ✅ |

## Challenges Encountered

| Challenge | Resolution |
|-----------|------------|
| `preview.ts` depends on token files that existed only as uncommitted 3.2 work | Committed 3.2 (`0d9e152`) and stacked this branch on it (user-approved) |
| Root `tsconfig.json` only includes `src`, so `pnpm typecheck` skips `.storybook/` | Ran a separate strict `tsc` on the two files; `tsconfig` left unchanged |

## Deviations from Plan

- **"Zero console errors" is not literally achievable with zero stories.** On an empty index, Storybook 8.6 itself calls `console.error` with `SB_PREVIEW_API_0008 (EmptyIndexError)` while showing its "Your Storybook is empty" screen. That screen is the empty sidebar the story expects. It isn't caused by this config, and it goes away once the first story exists. Not suppressed.
- **Dev-server `favicon.svg` 404.** Storybook's `favicon` preset resolves to `@storybook/core/assets/browser/favicon.svg`, and the static build includes that file, but the 8.6 dev server under pnpm returns 404 for `/favicon.svg`. Cosmetic, and it doesn't appear in `storybook-static/`. Not addressed.
- **Version-mismatch warning on startup.** `@storybook/addon-essentials` is locked at 8.6.14 while the other Storybook packages are 8.6.19. Storybook warns that they're incompatible, though it's only a patch difference. Fixing it means changing `pnpm-lock.yaml`, which is outside this story's scope and is shared with Dev 2's 3.4/3.5 work. Recommend a `pnpm update @storybook/addon-essentials` in a follow-up.
- **Stray `storybook-static/index.d.ts`.** Storybook reuses `vite.config.ts`, including `vite-plugin-dts`, which writes a declaration file into the Storybook build. Harmless (`build-storybook` exits 0). It could be filtered out in `viteFinal` later if Chromatic uploads should be minimal.
- `.gitignore` modified (outside Files Touched) to ignore `storybook-static/` — user-approved.
- **`preview.ts` also imports `../src/styles.scss`** (code review ISS-001). The literal AC import of `../src/tokens/index.scss` is kept. The extra import gives stories the same `box-sizing: border-box` reset consumers get from `@annexus/ui/style.css`, so Chromatic baselines match real usage. The token `:root` block is emitted twice, which is harmless.

## Lessons Learned

1. On an empty Storybook, the "zero console errors" AC needs to exclude Storybook's own empty-index error. Worth stating in future infra stories.
2. Config directories outside `src/` (`.storybook/`, and later `vitest.config.ts`) aren't covered by `pnpm typecheck`. Story 3.6 CI should either widen `tsconfig` `include` or add a dedicated check.

## Next Steps

- [ ] Ready for code review (`aire-review-code 3.3`)
- [ ] ADO #23668 board update pending `az login` on this workstation
- [ ] a11y panel visual check after the first CYCLE-2 component story lands
- [ ] Story 3.6 (CI/CD) unblocked once 3.2–3.5 merge
