# Cycle Plan — P2 Complex Components + v1.0 Release

**Cycle ID**: cycle-4
**BUILDID**: CYCLE-4
**Dates**: Nov 5–9, 2026 (re-baselined from Oct 16 — CR-001). Starts only after CYCLE-3 is closed.
**Expected Outcome**: All 27 components shipped. v1.0 published to GitHub Packages (@annexus/ui). Chromatic visual regression baselines approved. Package installable by the Athene calculator app.

---

## Scope

### In Scope (this cycle)

Each component is delivered as a **complete vertical slice**: `.tsx` component + `.types.ts` interface + `.scss` styles (token-referenced) + `.stories.tsx` (CSF3, all variants + states) + `.test.tsx` (Vitest + RTL, ≥90% coverage) + Figma page in AnnexusEX.

**P2 Components (6):**
- **Chart / Bar** — Target (1/10/20) × Variant (A/B). Data-visualization component. SVG-based or CSS-based bars. `role="img"` with descriptive `aria-label`.
- **Graph Container** — 3 states (5%, 6%, 7%). Wrapper/layout for chart components. Composes Chart/Bar.
- **Top Summary** — Multiple modes (65/68, 65/65, 60/65 × benefit variants). Display-only summary panel.
- **Bottom Summary** — 5 states (Start, Mid, End, Locked in 10, Locked in 20). Status-driven display component.
- **Premium** — 2 variants (Premium Amount, Edit). Composes Button (P0) and Input (P0) in Edit mode.
- **Animated Values** — Multiple modes (income/projection/premium). CSS animation using `prefers-reduced-motion` media query to disable motion when set.

**Release activities:**
- Full visual regression review: approve all pending Chromatic snapshots (27 components × all stories)
- Browser compatibility final check: Chrome, Firefox, Safari, Edge (last 2 versions) — manual smoke test of all P0 components
- v1.0 package tag and publish: `git tag v1.0.0` → GitHub Actions publish workflow → `@annexus/ui@1.0.0` live on GitHub Packages
- Storybook final deploy to Chromatic — share URL with frontend team
- `README.md` — install instructions, quick-start code snippet, component list
- Package smoke test: create temporary fresh React + TypeScript app, install `@annexus/ui@1.0.0`, render Button + Input — must resolve with types

### Deferred to Next Cycle

- v1.1+ features (multi-brand tokens, Code Connect, changelog automation) — per Future Considerations in requirements

---

## Workshop Plan

**Days 1–2** (Nov 5–6): P2 components (6 components)
→ Goal: Chart/Bar + GraphContainer + TopSummary + BottomSummary + Premium + AnimatedValues — all code, tests, stories, Figma pages complete

**Day 3** (Nov 9): Release gate
→ Goal: Chromatic approved, v1.0.0 tagged and published, package smoke-tested, Storybook URL shared, README complete

Each day ends with **production-ready, deployable code** — no partial or broken states overnight.

---

## Acceptance Criteria

- [ ] All 27 components importable from `@annexus/ui@1.0.0`
- [ ] TypeScript strict — no `any`, `strict: true` build passes in fresh consumer app
- [ ] Vitest coverage ≥ 90% for all 6 P2 components (and cumulative for all 27)
- [ ] Every variant and state has a named Storybook story for all 6 P2 components
- [ ] Storybook a11y addon reports zero violations for all P2 stories
- [ ] `prefers-reduced-motion` disables AnimatedValues animation
- [ ] All Chromatic snapshots approved (27 components — zero pending)
- [ ] All 6 Figma pages created in AnnexusEX (total: 27 pages)
- [ ] `@annexus/ui@1.0.0` published to GitHub Packages — `npm install @annexus/ui` succeeds
- [ ] Package smoke test passes in fresh React 18 + TypeScript strict app
- [ ] Storybook deployed — team URL accessible without local setup
- [ ] README with install instructions and component index committed
- [ ] CI pipeline green on main branch at tag v1.0.0

## Open Items

| Item | Owner |
| ---- | ----- |
| Confirm AnimatedValues animation spec from source Figma (timing, easing) | Nubia Barba |
| Confirm Chart/Bar data shape — static props or dynamic data array? | Nubia Barba |
| Confirm GitHub Packages access policy (private org package vs public) | Nubia Barba |

## Prerequisites

- Cycle 3 complete: all 21 P0 + P1 components stable and merged to main
- Chromatic project active with all P0 + P1 baselines captured
- GitHub Packages publish permission confirmed (GITHUB_TOKEN with `write:packages`)
- Source Figma still frozen (no design changes since Oct 14)

---

## Azure DevOps Iteration Plan

**Iteration Path**: `Anexus.AI.Test\Sprint 4`
**Board URL**: https://annexus.visualstudio.com/Anexus.AI.Test/_boards/board/t/Anexus.AI.Test%20Team/Stories?iteration=Anexus.AI.Test%5CSprint%204
