# Cycle Plan — P0 Core Primitives

**Cycle ID**: cycle-2
**BUILDID**: CYCLE-2
**Dates**: Oct 23–29, 2026 (re-baselined from Oct 13–14 — CR-001). Starts only after CYCLE-1 is closed; Story 1.2 (Input) is already implemented on its branch and is merged first.
**Expected Outcome**: Frontend engineers can install `@annexus/ui` and render all 10 P0 components with full TypeScript types, documented Storybook stories, and ≥90% unit test coverage. Package is pre-release ready.

---

## Scope

### In Scope (this cycle)

Each component is delivered as a **complete vertical slice**: `.tsx` component + `.types.ts` interface + `.scss` styles (token-referenced) + `.stories.tsx` (CSF3, all variants + states) + `.test.tsx` (Vitest + RTL, ≥90% coverage) + Figma page in AnnexusEX.

- **Button** — 7 hierarchies (Primary, Secondary Color, Secondary Gray, Tertiary Color, Tertiary Gray, Link Color, Link Gray) × sizes (sm/md/lg) × states (Default, Hover, Disabled, Focus). `forwardRef` pattern. WCAG 2.2 AA focus-visible-ring + min-touch-target mixins.
- **Input** — 4 types (currentAge, currentMonthlyNeed, incomeStartAge, inflationRate) × 3 states (Default, Selected, Error). `forwardRef` pattern. `aria-invalid`, `aria-describedby` for error state.
- **Toggle** — Pressed (True/False) × 4 states (Default, Hover, Focus, Disabled). Controlled/uncontrolled dual-mode pattern. `aria-pressed`.
- **Slider** — Income Start × Target Age combinations + Control Handle + Number Strip. WCAG 2.5.7 — arrow-key + click-on-track alternative to dragging. `role="slider"`, `aria-valuemin/max/now`.
- **Dropdown / Header Navigation** — Keyboard navigation (Arrow keys, Escape, Enter). `role="combobox"` or `role="navigation"` per context.
- **Modal** — 2 states (Input, Add Benefits). Focus trap. `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. Escape to close.
- **Tooltip** — `role="tooltip"`, `aria-describedby` hookup. Pointer + keyboard trigger.
- **Badge** — Display-only. Variant colors from token system.
- **Icons** — SVG React components: `check-circle`, `chevron-down`, `winLose`. `aria-hidden="true"` when decorative; `aria-label` prop when standalone.
- **Athene Logo** — SVG React component. `role="img"`, `aria-label`.

### Deferred to Next Cycle

- P1 composition components (Footer, HeaderSection, etc.) — depend on P0 primitives being stable

---

## Workshop Plan

**Days 1–3** (Oct 23, 24, 27): Button + Input (merge) + Toggle + Slider + Icons + Logo + Badge + Tooltip
→ Goal: 8 wave-4 components complete — code, tests ≥90% coverage, Storybook stories, Figma pages

**Days 4–5** (Oct 28–29): Dropdown/Nav + Modal (wave 5)
→ Goal: All 10 P0 components complete — CI green, Chromatic snapshots captured for all P0 stories

Each day ends with **production-ready, deployable code** — no partial or broken states overnight.

---

## Acceptance Criteria

- [ ] All 10 P0 components importable: `import { Button, Input, Toggle, Slider } from '@annexus/ui'`
- [ ] TypeScript strict — no `any`, all props typed
- [ ] Vitest coverage ≥ 90% (lines, branches, functions, statements) for all 10 components
- [ ] Every variant and state has a named Storybook story
- [ ] Storybook a11y addon reports zero violations for all P0 stories
- [ ] All components pass WCAG 2.2 AA — focus-visible-ring on all interactive elements, min 24×24px touch targets
- [ ] Chromatic snapshots captured and approved for all P0 stories
- [ ] All 10 Figma pages created in AnnexusEX (left: Description frame, right: Component frame with variants + tokens)
- [ ] `pnpm build` succeeds with all P0 components in output
- [ ] CI pipeline green

## Open Items

| Item | Owner |
| ---- | ----- |
| Confirm Figma AnnexusEX file write access for component pages | Nubia Barba |
| Slider — confirm drag interaction design (WCAG 2.5.7 alternative) with UX | Nubia Barba |

## Prerequisites

- Cycle 1 complete: repo scaffold, tokens, Storybook, CI/CD, Chromatic all operational
- Source Figma file `DjPqMQEOe6khkoqIVQ8a9u` accessible (read-only design extraction)
- Target Figma file `HroaJi0L7qqOWKkw78w29A` (AnnexusEX) writable

---

## Azure DevOps Iteration Plan

**Iteration Path**: `Anexus.AI.Test\Sprint 2`
**Board URL**: https://annexus.visualstudio.com/Anexus.AI.Test/_boards/board/t/Anexus.AI.Test%20Team/Stories?iteration=Anexus.AI.Test%5CSprint%202
