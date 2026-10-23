### Story 3.2: Design System Styles (Palette, Design Variables, JS Export)

**File**: `docs/plans/stories/epic-3-story-3.2-design-tokens.md`

**BUILDID**: CYCLE-1 | **AzureDevOps**: #23669 | **Epic**: 3 - FOUNDATION SETUP | **ID**: 3.2 | **Date**: 2026-10-12 | **Re-scoped**: 2026-10-20 (CR-001)
**Wave**: 2
**Requires**: [3.1]
**Enables**: [3.6]
**Files Touched**:
  - src/styles/pallete.color.scss
  - src/styles/design.variables.scss
  - src/styles/design.variables.module.scss
  - src/styles/designVariables.ts
  - src/styles/designVariables.test.ts
  - src/styles/scss-modules.d.ts
  - src/index.ts
**Roles Ref**: docs/requirements.md#roles--permissions-matrix — single-actor — no role variation
**QA Candidate**: Yes — **Observable:** `pnpm build` exits 0; `import { designVariables } from '@annexus/ui'` returns an object whose values equal the SCSS variables (e.g. `inputLabelColor === '#404042'`); component SCSS contains no hex values.

---

#### 👤 User Reference

**Description**:
Defines the style foundation of `@annexus/ui` in three layers:
1. `pallete.color.scss` — every color in hex, one SCSS variable per color, named after the color (`$midnightBlue`, `$gray300`); no repeated values or names. Only `design.variables.scss` may reference it.
2. `design.variables.scss` — design variables named after the section they style (`$inputFieldBorderColor: palette.$gray300`, `$inputLabelFontSize`, `$fontFamilyBase`). These are the **only** variables exposed to component `.scss` files.
3. `design.variables.module.scss` + `designVariables.ts` — export every design variable to JS through CSS Modules `:export`.

**Acceptance Criteria** (plain-English):
- All colors from `docs/ui-ux/ui-ux-spec.md` exist once in the palette, in hex
- Every font family, size, weight and line height used by a component is a design variable
- Component SCSS uses only design variables — no hex, no palette variables
- Every design variable is available in JS through `designVariables`
- Adding a design variable requires adding its line to the `:export` module (a test fails otherwise)

**Status at re-scope (2026-10-20)**: palette (21 colors), design variables for Input (colors and fonts), `:export` module, `designVariables.ts`, public export and `Input.scss` migration are already implemented on branch `feat/cycle-2-story-1.2-input`. They ship with this story; Story 1.2 merges after Story 3.6.

---

#### 🤖 AI Agent Reference

**Must Read**:
- `docs/ui-ux/ui-ux-spec.md` — `design_tokens` section (canonical values)
- `docs/architecture/design/01-patterns-and-standards-greenfield.md` — §4.1 Token Consumption

**Acceptance Criteria** (comprehensive):
- `pallete.color.scss` defines every spec color as `$camelCaseColorName: #hex;`; no duplicate hex values, no duplicate names; includes `$midnightBlue` #11175E, `$cobaltBlue` #1B3E80, `$azureBlue` #0167AC, `$deepGreen` #044638, `$jadeGreen` #079455, `$brickRed` #B73B3B, `$lightSteel` #CED6DB, `$white`, `$jetBlack` #222222, `$shadowBlack` #0A0D12, `$gray50`–`$gray900`
- `design.variables.scss` starts with `@use 'pallete.color' as palette;`; every color variable is `$<section><Element><State>Color: palette.$x`; no variable name repeated
- Fonts: `$fontFamilyBase: 'Assistant', sans-serif` and per-section size / line-height / weight variables
- Spacing, radius and shadow variables are added per section by the component story that needs them (not speculatively)
- `design.variables.module.scss` exports every variable declared in `design.variables.scss`
- `designVariables.ts` re-exports the module as `designVariables` and the `DesignVariables` type; both exported from `src/index.ts`
- `designVariables.test.ts` asserts that every variable in `design.variables.scss` appears in `designVariables`, and that no hex value is duplicated in the palette
- `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test` exit 0; coverage ≥ 90%

**Patterns**: SCSS `@use` with namespace; CSS Modules `:export`; camelCase section-prefixed names

**Steps**:
1. Review `pallete.color.scss` against the `design_tokens` block of `docs/ui-ux/ui-ux-spec.md`; add missing colors
2. Review `design.variables.scss`; keep naming `<section><Element><State><Property>`
3. Write `designVariables.test.ts` (variable parity; palette uniqueness)
4. Update `docs/architecture/design/01-patterns-and-standards-greenfield.md` §4.1 (done in CR-001) and the story files that reference `--annexus-*` or `src/tokens/`
5. Verify: `pnpm build`; `node -e "import('./dist/index.es.js').then(m=>console.log(m.designVariables))"`

**OUT**:
- ❌ No `--annexus-*` CSS custom properties and no `src/tokens/` directory (replaced by this design)
- ❌ No dark-mode overrides (no dark mode per architecture ADR)
- ❌ No variables for components that do not exist yet

**Evidence**:
- Terminal output of `pnpm build` (exit 0) and of the `designVariables` import
- `pnpm test` coverage report
