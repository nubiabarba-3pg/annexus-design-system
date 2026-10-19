# Story 3.1 Self-Review

**Date**: 2026-10-14
**Story**: Repo Scaffold — package.json, tsconfig, vite.config, ESLint, Prettier, pnpm workspace
**Developer**: DEV Agent

---

## What Was Implemented

- `package.json` — `@annexus/ui` package with Vite 6 library mode config, all scripts, peer deps, devDeps
- `vite.config.ts` — Vite 6 lib mode: ESM + CJS dual output, `vite-plugin-dts` for type declarations, CSS renamed to `style.css`
- `tsconfig.json` — TypeScript strict mode, ESNext target, bundler module resolution, `jsx: react-jsx`
- `.eslintrc.cjs` — `@typescript-eslint/recommended` + `react-hooks/recommended`; `react/react-in-jsx-scope` OFF
- `.prettierrc` — singleQuote, semi, tabWidth 2, trailingComma all, printWidth 100
- `.npmrc` — `@annexus:registry=https://npm.pkg.github.com`
- `pnpm-workspace.yaml` — single-package workspace + `allowBuilds` for `@parcel/watcher` and `esbuild`
- `src/index.ts` — empty barrel (comment only + styles import)
- `src/styles.scss` — placeholder with box-sizing reset; ensures `style.css` emitted in dist
- `src/{components,hooks,utils,types,tokens,test}/` — empty directory scaffold

## Files Changed

| File | Change Type | Description |
|------|-------------|-------------|
| `package.json` | New | Package manifest: name, version, scripts, peer/dev deps |
| `vite.config.ts` | New | Vite 6 library mode with dts plugin and CSS rename |
| `tsconfig.json` | New | TypeScript strict config |
| `.eslintrc.cjs` | New | ESLint config for TS + React |
| `.prettierrc` | New | Prettier formatting rules |
| `.npmrc` | New | GitHub Packages registry scope |
| `pnpm-workspace.yaml` | New | Workspace config + build approvals |
| `src/index.ts` | New | Empty public barrel |
| `src/styles.scss` | New | CSS placeholder (ensures style.css output) |

## Patterns Applied

| Pattern | Where Applied | Notes |
|---------|---------------|-------|
| Vite 6 library mode | `vite.config.ts` | ESM + CJS dual output per ADR-002 |
| TypeScript strict | `tsconfig.json` | ADR-001 zero-any policy |
| GitHub Packages scoped registry | `.npmrc` | ADR-005 private package distribution |
| pnpm workspace | `pnpm-workspace.yaml` | ADR-001 package manager |

## Testing Summary

- **Unit Tests**: N/A — config-only story; no Vitest tests for scaffold files
- **Build verification**: `pnpm build` exits 0; dist contains `index.es.js`, `index.cjs.js`, `index.d.ts`, `style.css`
- **Typecheck**: `pnpm typecheck` exits 0 (clean)
- **Lint**: `pnpm lint` exits 0 (zero warnings/errors)
- **Install**: `pnpm install` exits 0; lockfile generated

**Build output**:
```
vite v6.4.4 building for production...
✓ 2 modules transformed.
dist/style.css     0.04 kB │ gzip: 0.06 kB
dist/index.es.js   0.00 kB │ gzip: 0.02 kB
dist/index.cjs.js  0.01 kB │ gzip: 0.03 kB
✓ built in 627ms
```

## DoD Evidence

### Gate 1 — Spec Echo

| Requirement | Source | Proof (file:line) |
|---|---|---|
| name = `@annexus/ui` | Story 3.1 AC | `package.json:2` |
| version = `0.0.1` | Story 3.1 AC | `package.json:3` |
| type = `module` | Story 3.1 AC | `package.json:4` |
| peerDeps react/react-dom ^18 | Story 3.1 AC | `package.json:19-22` |
| All 10 scripts present | Story 3.1 AC | `package.json:8-18` |
| vite lib entry `src/index.ts` | Story 3.1 AC | `vite.config.ts:12` |
| formats `['es','cjs']` | Story 3.1 AC | `vite.config.ts:13` |
| external react/react-dom | Story 3.1 AC | `vite.config.ts:18` |
| CSS output → `style.css` | Story 3.1 AC | `vite.config.ts:21` |
| tsconfig strict: true | Story 3.1 AC | `tsconfig.json:7` |
| target: ESNext | Story 3.1 AC | `tsconfig.json:3` |
| moduleResolution: bundler | Story 3.1 AC | `tsconfig.json:6` |
| jsx: react-jsx | Story 3.1 AC | `tsconfig.json:7` |
| declaration: true | Story 3.1 AC | `tsconfig.json:11` |
| declarationDir: dist | Story 3.1 AC | `tsconfig.json:12` |
| include: ["src"] | Story 3.1 AC | `tsconfig.json:19` |
| .eslintrc extends ts-recommended | Story 3.1 AC | `.eslintrc.cjs:5` |
| react-hooks/recommended | Story 3.1 AC | `.eslintrc.cjs:6` |
| react/react-in-jsx-scope OFF | Story 3.1 AC | `.eslintrc.cjs:12` |
| .npmrc @annexus:registry | Story 3.1 AC | `.npmrc:1` |
| src/index.ts exists | Story 3.1 AC | `src/index.ts` created |
| pnpm build exits 0; 4 dist files | Story 3.1 AC | build output above |
| pnpm typecheck exits 0 | Story 3.1 AC | `tsc --noEmit` clean |
| pnpm lint exits 0 | Story 3.1 AC | eslint clean |

### Gate 2 — Negative-Space

- ❌ No React components — `src/components/` is empty ✅
- ❌ No SCSS tokens — `src/tokens/` is empty (Story 3.2) ✅
- ❌ No Storybook config — no `.storybook/` (Story 3.3) ✅
- ❌ No Vitest config — no `vitest.config.ts` (Story 3.4) ✅
- ❌ No CI/CD — no `.github/workflows/` (Story 3.6) ✅

### Gate 3 — Contract Consistency

- `main`/`module`/`types`/`exports` all point to `dist/` matching Vite output config ✅
- `types` condition placed before `import`/`require` in exports map ✅

## Challenges Encountered

| Challenge | Resolution |
|---|---|
| pnpm 12 strict build scripts blocked install | `pnpm approve-builds --all` — added `allowBuilds` to `pnpm-workspace.yaml` |
| Empty SCSS produced no `style.css` in dist | Added `box-sizing: border-box` placeholder rule to `src/styles.scss` |
| CSS asset named `ui.css` not `style.css` | Changed `assetFileNames` to match on `.css` extension rather than exact name |
| `exports.types` warning (came after import/require) | Reordered exports: `types` → `import` → `require` |

## Deviations from Plan

- `src/styles.scss` created (not in story steps) — required to produce `dist/style.css` output; Story 3.2 will import token partials into this file
- `pnpm-workspace.yaml` gained `allowBuilds` entries — pnpm 12 security requirement; `onlyBuiltDependencies` syntax moved from package.json (deprecated in pnpm 12)
- `vite.config.ts` `assetFileNames` matches on `.css` extension (not exact name `style.css`) — the internal Vite asset name is derived from the entry file name, not `style.css`
- `exports.types` reordered before `import`/`require` — Vite/esbuild best practice for TypeScript resolution

## Next Steps

- [ ] Ready for code review
- [ ] Story 3.2 (SCSS Design Tokens) — Wave 4, unblocked
