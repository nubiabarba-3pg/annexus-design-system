# Cycle Plan — P1 Composition Components

**Cycle ID**: cycle-3
**BUILDID**: CYCLE-3
**Dates**: Oct 30–Nov 4, 2026 (re-baselined from Oct 15 — CR-001). Starts only after CYCLE-2 is closed.
**Expected Outcome**: Full application UI scaffold available — all 11 P1 layout and composition components ready. The Athene calculator app can now be built end-to-end using @annexus/ui.

---

## Scope

### In Scope (this cycle)

Each component is delivered as a **complete vertical slice**: `.tsx` component + `.types.ts` interface + `.scss` styles (token-referenced) + `.stories.tsx` (CSF3, all variants + states) + `.test.tsx` (Vitest + RTL, ≥90% coverage) + Figma page in AnnexusEX.

- **Footer** — Layout component. Composes Button (Link variants). Responsive.
- **Header Section** — Top-level navigation/header. Composes Dropdown/Header Navigation from P0.
- **Legend** — 2 states (Default, Monthly Income Only). Color-coded with token system.
- **Add-on Row** — 2 types (Bundle, Pharmacy) × 2 states (Default, Added). Composes Badge (P0). `role="row"`.
- **Help Icon** — Multiple contexts × 2 states (Default, Hover). Composes Tooltip (P0) and Icons (P0). `aria-label` per context.
- **Group Item** — 3 states (Default, Hover, Active). Keyboard navigable list item pattern. `role="option"` or `role="menuitem"` per context.
- **Frequency Selector** — 2 states (Monthly, Annually). Toggle-group pattern. Composes Toggle (P0) or ButtonGroup. `role="group"`, `aria-label`.
- **Age Tag** — 2 states (Target, Default). Display badge variant. Token-referenced colors.
- **Button Group** — 3 states (Default, Hover, Active). Composes Button (P0). `role="group"`, `aria-label`.
- **Row (Add-on)** — Line 2/3 × 2 states (Default, Added). Composes Badge (P0). Structured row layout.
- **Adjust Inflation Rate** — 2 states (Default, Active). Composes Slider (P0) and Input (P0). WCAG 2.5.7 keyboard alternative.

### Deferred to Next Cycle

- P2 complex/data-viz components (Chart/Bar, GraphContainer, etc.) — can be built independently after P1

---

## Workshop Plan

**Days 1–4** (Oct 30, Nov 2, 3, 4): All 11 P1 components
→ Goal: All 11 P1 components complete — code, tests ≥90% coverage, Storybook stories, Figma pages, CI green, Chromatic snapshots captured

Each day ends with **production-ready, deployable code** — no partial or broken states overnight.

---

## Acceptance Criteria

- [ ] All 11 P1 components importable from `@annexus/ui`
- [ ] No direct token value duplication — all P1 components compose P0 primitives wherever applicable
- [ ] TypeScript strict — no `any`, all props typed
- [ ] Vitest coverage ≥ 90% for all 11 components
- [ ] Every variant and state has a named Storybook story
- [ ] Storybook a11y addon reports zero violations for all P1 stories
- [ ] All components pass WCAG 2.2 AA (focus-visible, touch targets)
- [ ] Chromatic snapshots captured and approved for all P1 stories
- [ ] All 11 Figma pages created in AnnexusEX
- [ ] `pnpm build` succeeds with all P0 + P1 components in output
- [ ] CI pipeline green

## Open Items

| Item | Owner |
| ---- | ----- |
| Confirm AdjustInflationRate keyboard interaction design (Slider composition) | Nubia Barba |
| Confirm FrequencySelector accessible group label text | Nubia Barba |

## Prerequisites

- Cycle 2 complete: all 10 P0 components stable and merged to main
- Tokens stable (no breaking token renames after Cycle 2)

---

## Azure DevOps Iteration Plan

**Iteration Path**: `Anexus.AI.Test\Sprint 3`
**Board URL**: https://annexus.visualstudio.com/Anexus.AI.Test/_boards/board/t/Anexus.AI.Test%20Team/Stories?iteration=Anexus.AI.Test%5CSprint%203
