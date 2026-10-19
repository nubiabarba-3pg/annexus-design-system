### Story 5.7: v1.0 Release

**File**: `docs/plans/stories/epic-5-story-5.7-v1-release.md`

**BUILDID**: CYCLE-4 | **AzureDevOps**: #23700 | **Epic**: 5 - P2 COMPLEX + v1.0 | **ID**: 5.7 | **Date**: 2026-10-13
**Wave**: 9
**Requires**: [5.1, 5.2, 5.3, 5.4, 5.5, 5.6]
**Enables**: []
**Files Touched**:
  - package.json (version bump to 1.0.0)
  - CHANGELOG.md
  - README.md (update with full component list)
**Roles Ref**: docs/requirements.md#roles--permissions-matrix — single-actor — no role variation
**QA Candidate**: Yes — **Observable:** `git tag v1.0.0 && git push origin v1.0.0` triggers `publish.yml`; GitHub Packages shows `@annexus/ui@1.0.0`; `pnpm add @annexus/ui` in a consuming repo resolves the package; `pnpm build` on `main` at v1.0.0 exits 0 with all components in `dist/`. **Mechanism:** Version bump in `package.json`; `CHANGELOG.md` documents all CYCLE-2/3/4 components; git tag triggers the CI publish workflow (Story 3.6). **Authz & preconditions:** requires all Stories 5.1–5.6 merged AND all CYCLE-2 stories (1.1–2.4) merged; `pnpm build` exits 0 for all components; `pnpm test` exits 0 with ≥ 90% coverage across all components.

---

#### 👤 User Reference

**Description**:
This story delivers the v1.0.0 release of `@annexus/ui`. After Stories 5.1–5.6 (and all CYCLE-2 components) are merged and verified, the version is bumped from `0.0.1` to `1.0.0`, a `CHANGELOG.md` is created documenting all shipped components, and a git tag `v1.0.0` is pushed to trigger the GitHub Packages publish pipeline. This marks the design system as production-ready for use in the Annexus.AI application.

**Acceptance Criteria** (plain-English):
- `package.json` version is `1.0.0`
- `CHANGELOG.md` documents all components shipped in CYCLE-2, CYCLE-3, CYCLE-4
- `pnpm build` exits 0 at v1.0.0 with all components exported from `dist/index.es.js`
- `pnpm test` exits 0 with ≥ 90% coverage on all component files
- `pnpm typecheck` exits 0
- `pnpm lint` exits 0
- `git tag v1.0.0 && git push origin v1.0.0` triggers `publish.yml` and publishes to GitHub Packages
- Package is installable: `pnpm add @annexus/ui@1.0.0` resolves in a consuming project

**User Journey** (no role variation — single actor: DEV / Release Manager):
1. All CYCLE-2/3/4 PRs merged to `main`
2. Bump version: edit `package.json` `version` → `"1.0.0"`
3. Create CHANGELOG.md with component inventory
4. Commit: `git commit -m "chore: release v1.0.0"`
5. Tag: `git tag v1.0.0`
6. Push: `git push origin main --tags`
7. GitHub Actions `publish.yml` runs → `@annexus/ui@1.0.0` appears in GitHub Packages
8. Consuming app adds `.npmrc` scoped to GitHub Packages → `pnpm add @annexus/ui`

**Flow Diagram**:

```mermaid
flowchart TD
  A[All stories merged — Stories 1.1–5.6] --> B[pnpm build exits 0 — all components in dist/]
  B --> C[pnpm test exits 0 — ≥90% coverage]
  C --> D[package.json version → 1.0.0]
  D --> E[CHANGELOG.md created]
  E --> F[git tag v1.0.0 + push]
  F --> G[GitHub Actions publish.yml]
  G --> H[@annexus/ui@1.0.0 on GitHub Packages]
  H --> I[Consuming app: pnpm add @annexus/ui]
```

---

#### 🤖 AI Agent Reference

**Must Read**:
- `docs/architecture/design/00-system-architecture-greenfield.md` — ADR-005 (GitHub Packages), release versioning
- Story 3.6 — `publish.yml` CI workflow (tag-triggered publish)

**Design Tokens**: N/A — no UI tokens in this story.

**Description**:
This is a release coordination story, not a feature story. The implementation is three edits: (1) `package.json` `version` field: `"0.0.1"` → `"1.0.0"`; (2) create `CHANGELOG.md` with an inventory of all shipped components organized by cycle; (3) update `README.md` to list all available components with brief descriptions. The actual publish is automated via the `publish.yml` workflow introduced in Story 3.6 — no manual `pnpm publish` needed.

**Complete Component Inventory at v1.0.0**:

CYCLE-2 — P0 Primitives:
- Button, Input, Toggle, Badge, Icon, Logo (Epic 1)
- Slider, Tooltip, DropdownNav, Modal (Epic 2)

CYCLE-3 — P1 Composition:
- Footer, HeaderSection, Legend, AddonRow, HelpIcon, GroupItem, FrequencySelector, AgeTag, ButtonGroup, Row, AdjustInflationRate (Epic 4)

CYCLE-4 — P2 Complex:
- ChartBar, GraphContainer, TopSummary, BottomSummary, Premium, AnimatedValues (Epic 5)

**Acceptance Criteria** (comprehensive):
- `package.json`: `"version": "1.0.0"`
- `CHANGELOG.md`: `## [1.0.0] — 2026-10-13` section listing all 22 components by category
- `src/index.ts` exports all 22 components and their types (verified by `pnpm typecheck`)
- `pnpm build` exits 0; `dist/index.es.js` exists and contains all component exports
- `pnpm test` exits 0; coverage ≥ 90% for all files in `src/components/`
- `pnpm typecheck` exits 0
- `pnpm lint` exits 0
- Tag `v1.0.0` pushed → `publish.yml` triggered → package appears in Packages tab

**RBAC Enforcement**: No role-differentiated access — single actor.

**System responses + error cases**:

| Trigger | Response | Side-effect |
|---------|----------|-------------|
| `pnpm publish` without tag | Blocked by `prepublishOnly` script: runs build + typecheck first | Fix: always publish via tag |
| Coverage drops below 90% | `pnpm coverage` fails; publish blocked | Fix: add missing tests before tagging |
| `GITHUB_TOKEN` insufficient | `publish.yml` fails at publish step | Fix: verify `packages: write` permission in repo settings |
| Consuming app missing `.npmrc` | `pnpm add @annexus/ui` falls back to npm public registry (not found) | Fix: consumer must add `.npmrc` scoped to GitHub Packages |

**QA-observable behaviour**:
- `jq .version package.json` → `"1.0.0"`.
- `cat CHANGELOG.md` → contains `## [1.0.0]` section.
- `pnpm build && pnpm test && pnpm typecheck && pnpm lint` — all exit 0.
- GitHub Packages tab: `@annexus/ui` version `1.0.0` listed.
- In a consuming project: `pnpm add @annexus/ui` + `import { Button } from '@annexus/ui'` — compiles.

**Prerequisites**:
- All Stories 1.1–5.6 merged to `main`
- `publish.yml` workflow from Story 3.6 active and tested
- GitHub repository permissions: `packages: write` for `GITHUB_TOKEN`

**Context**:
- `docs/architecture/design/00-system-architecture-greenfield.md` — ADR-005

**Steps**:

1. **Verify all prerequisites pass**:
   ```bash
   pnpm install
   pnpm build
   pnpm test
   pnpm typecheck
   pnpm lint
   ```
   All must exit 0 before proceeding.

2. **Bump version in `package.json`**:
   Change `"version": "0.0.1"` → `"version": "1.0.0"`.

3. **Create `CHANGELOG.md`**:
   ```markdown
   # Changelog

   All notable changes to `@annexus/ui` will be documented here.

   ## [1.0.0] — 2026-10-13

   ### Added — CYCLE-1: Foundation
   - Design token system (SCSS custom properties: colors, typography, spacing, shadows)
   - Storybook 8.x with a11y addon
   - Vitest 2.x + React Testing Library 16.x
   - Shared utilities: `classNames`, `devWarning`
   - Shared types: `Size`, `Tone`, `BaseProps`
   - GitHub Actions CI/CD pipeline

   ### Added — CYCLE-2: P0 Primitives
   - `Button` — primary, secondary, tertiary, link hierarchy variants
   - `Input` — text input with label, error, and helper text
   - `Toggle` — accessible on/off switch
   - `Badge` — semantic tone pill label
   - `Icon` — SVG icon wrapper with accessible name
   - `Logo` — Annexus brand logo component
   - `Slider` — range input with value display
   - `Tooltip` — hover/focus tooltip using Floating UI
   - `DropdownNav` — accessible dropdown navigation menu
   - `Modal` — accessible dialog with focus trap and portal rendering

   ### Added — CYCLE-3: P1 Composition
   - `Footer` — page footer with left/right content slots
   - `HeaderSection` — section header with title, subtitle, and action slot
   - `Legend` — chart legend with color swatch + label pairs
   - `AddonRow` — insurance addon list row with control slot
   - `HelpIcon` — accessible "?" icon button for contextual help
   - `GroupItem` — selectable radio-style row for coverage tier selection
   - `FrequencySelector` — segmented payment frequency control
   - `AgeTag` — age display pill with semantic tone
   - `ButtonGroup` — connected horizontal button group layout
   - `Row` — key-value data row for summary panels
   - `AdjustInflationRate` — numeric stepper for inflation rate input

   ### Added — CYCLE-4: P2 Complex
   - `ChartBar` — accessible SVG vertical bar chart
   - `GraphContainer` — card composing ChartBar + Legend
   - `TopSummary` — quote summary card with plan name, premium, and metric rows
   - `BottomSummary` — addon breakdown card with subtotal and CTA
   - `Premium` — formatted premium amount display with frequency and qualifier
   - `AnimatedValues` — RAF-based count-up animation for numeric values
   ```

4. **Update `README.md`** — add Available Components section:
   ```markdown
   ## Available Components

   | Component | Category | Description |
   |-----------|----------|-------------|
   | Button | P0 | Primary action button with hierarchy variants |
   | Input | P0 | Text input with label and validation |
   | Toggle | P0 | On/off switch |
   | Badge | P0 | Semantic tone label pill |
   | Icon | P0 | SVG icon wrapper |
   | Logo | P0 | Annexus brand logo |
   | Slider | P0 | Range input |
   | Tooltip | P0 | Hover/focus tooltip |
   | DropdownNav | P0 | Accessible dropdown navigation |
   | Modal | P0 | Focus-trapped dialog |
   | Footer | P1 | Page footer layout |
   | HeaderSection | P1 | Section header with action slot |
   | Legend | P1 | Chart legend |
   | AddonRow | P1 | Addon list row with control |
   | HelpIcon | P1 | Contextual help icon button |
   | GroupItem | P1 | Selectable coverage tier row |
   | FrequencySelector | P1 | Payment frequency segmented control |
   | AgeTag | P1 | Age display pill |
   | ButtonGroup | P1 | Connected button group |
   | Row | P1 | Key-value summary row |
   | AdjustInflationRate | P1 | Inflation rate stepper |
   | ChartBar | P2 | SVG bar chart |
   | GraphContainer | P2 | Chart + legend card |
   | TopSummary | P2 | Quote summary card |
   | BottomSummary | P2 | Addon breakdown card |
   | Premium | P2 | Formatted premium display |
   | AnimatedValues | P2 | Count-up animation |
   ```

5. **Commit, tag, and push**:
   ```bash
   git add package.json CHANGELOG.md README.md
   git commit -m "chore: release v1.0.0 — all P0/P1/P2 components"
   git tag v1.0.0
   git push origin main
   git push origin v1.0.0
   ```

6. **Verify GitHub Actions**:
   - Navigate to Actions tab → `publish` workflow → confirm it runs and succeeds.
   - Navigate to Packages tab → confirm `@annexus/ui` at version `1.0.0`.

**Tests** (manual):
- `pnpm build` exits 0; `dist/` contains all component files
- `pnpm test` exits 0; coverage ≥ 90% all files
- `pnpm typecheck` exits 0
- `pnpm lint` exits 0
- GitHub Packages shows `@annexus/ui@1.0.0`

**Quality**: All four quality gates pass; package published; CHANGELOG documented

**OUT**:
- ❌ No semantic versioning automation (releases are manual via git tag per ADR)
- ❌ No npm public publish (GitHub Packages only per ADR-005)
- ❌ No CDN distribution (package-based distribution only)

**Evidence**:
- Terminal output of `pnpm build && pnpm test && pnpm typecheck && pnpm lint` (all exit 0)
- GitHub Actions screenshot of `publish` workflow succeeding on tag `v1.0.0`
- GitHub Packages tab showing `@annexus/ui@1.0.0`
