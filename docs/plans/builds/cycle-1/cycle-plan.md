# Cycle Plan — Foundation

**Cycle ID**: cycle-1
**BUILDID**: CYCLE-1
**Dates**: Oct 20–22, 2026 (re-baselined from Oct 12 — CR-001)
**Expected Outcome**: Working skeleton — repo scaffolded, CI/CD green, Storybook running locally, design tokens in place, utilities and shared types defined. Ready to receive components.

---

## Scope

### In Scope (this cycle)

- Repo scaffold — package.json (`@annexus/ui`), tsconfig.json (strict), .npmrc (GitHub Packages registry), .prettierrc, .eslintrc, vite.config.ts (library mode)
- Design system styles (re-scoped CR-001): `src/styles/pallete.color.scss` (all colors in hex, one variable per color, named after the color), `src/styles/design.variables.scss` (section-named variables — fonts and colors — referencing the palette; the only variables component SCSS may use), `design.variables.module.scss` + `designVariables.ts` (export of those variables to JS)
- Storybook 8.x configuration: `.storybook/main.ts`, `preview.ts`, a11y addon wired
- Vitest 2.x + React Testing Library 16.x setup: `vitest.config.ts`, coverage thresholds (lines/branches/functions/statements ≥ 90%)
- ESLint + Prettier config (TypeScript strict rules)
- Shared utilities: `src/utils/classNames.ts`, `src/utils/devWarning.ts`
- Shared types: `src/types/common.types.ts` (Size, Variant, BaseProps, etc.)
- Public barrel: `src/index.ts` (empty shell — grows per cycle)
- GitHub Actions CI pipeline: `.github/workflows/ci.yml` (lint → typecheck → test → build → Storybook build → Chromatic publish)
- GitHub Packages publish workflow: `.github/workflows/publish.yml` (on tag push)
- Chromatic integration: project token wired in CI, first baseline snapshot run
- pnpm workspace configuration

### Deferred to Next Cycle

- All React components (Cycle 2 begins P0 primitives)

---

## Workshop Plan

**Day 1** (Oct 20): Story 3.2 (design system styles) + Story 3.4 (Vitest)
**Day 2** (Oct 21): Story 3.3 (Storybook) + Story 3.5 (utils/types)
**Day 3** (Oct 22): Story 3.6 (CI/CD, Chromatic) + cycle close
→ Goal: `pnpm build` passes, `pnpm storybook` runs (empty), CI pipeline green on first push, Chromatic project connected. CYCLE-2 does not start until this goal is met.

Each day ends with **production-ready, deployable code** — no partial or broken states overnight.

---

## Acceptance Criteria

- [ ] `pnpm install` succeeds with no peer dependency errors
- [ ] `pnpm build` produces `dist/index.es.js`, `dist/index.cjs.js`, `dist/index.d.ts`, `dist/style.css`
- [ ] `pnpm test` passes with coverage report generated (0 tests — baseline empty)
- [ ] `pnpm typecheck` passes (0 TypeScript errors, strict mode)
- [ ] `pnpm lint` passes (0 ESLint errors)
- [ ] `pnpm storybook` launches without errors (empty component list)
- [ ] GitHub Actions CI workflow executes all steps without failure
- [ ] Chromatic project connected — baseline run complete
- [ ] `.npmrc` correctly scopes `@annexus` to GitHub Packages registry
- [ ] Palette and design variables compile; `designVariables` is importable from `@annexus/ui` with the exported values

## Open Items

| Item | Owner |
| ---- | ----- |
| Confirm Chromatic project token (env secret) with team | Nubia Barba |
| Confirm GitHub Packages token (GITHUB_TOKEN) is available in CI | Nubia Barba |

## Prerequisites

- GitHub repository `nubiabarba-3pg/annexus-design-system` exists and main branch is accessible
- Node.js 26 LTS available in CI environment
- Chromatic account and project token available
- GitHub Packages write permission confirmed for CI token

---

## Azure DevOps Iteration Plan

**Iteration Path**: `Anexus.AI.Test\Sprint 1`
**Board URL**: https://annexus.visualstudio.com/Anexus.AI.Test/_boards/board/t/Anexus.AI.Test%20Team/Stories?iteration=Anexus.AI.Test%5CSprint%201
