# Build Cycles Overview — Annexus Design System

## Summary

**Total Cycles**: 4
**Hard Deadline**: ~~Friday, October 16, 2026~~ → **Monday, November 9, 2026** (re-baselined 2026-10-20, CR-001)
**Cycle Plans**: `docs/plans/builds/cycle-[N]/cycle-plan.md`
**Story Files**: `docs/plans/stories/`

---

## Cycle Map

| Cycle | BUILDID | Sprint | Dates | Scope Summary | Expected Outcome |
|-------|---------|--------|-------|---------------|-----------------|
| Cycle 1 | CYCLE-1 | Sprint 1 | Oct 12–14 (started) → Oct 20–22 | Foundation: repo scaffold, tokens, Storybook, CI/CD, Chromatic | Working skeleton — CI green, Storybook running, ready for components |
| Cycle 2 | CYCLE-2 | Sprint 2 | ~~Oct 13–14~~ → Oct 23–29 | P0 Core Primitives: Button, Input, Toggle, Slider, Dropdown/Nav, Modal, Tooltip, Badge, Icons, Logo (10 components) | All P0 components installable and documented — frontend unblocked |
| Cycle 3 | CYCLE-3 | Sprint 3 | ~~Oct 15~~ → Oct 30–Nov 4 | P1 Composition Components: Footer, HeaderSection, Legend, AddonRow, HelpIcon, GroupItem, FrequencySelector, AgeTag, ButtonGroup, Row, AdjustInflationRate (11 components) | Full application UI scaffold — complete calculator app buildable |
| Cycle 4 | CYCLE-4 | Sprint 4 | ~~Oct 16~~ → Nov 5–9 | P2 Complex Components: Chart/Bar, GraphContainer, TopSummary, BottomSummary, Premium, AnimatedValues (6 components) + v1.0 release | All 27 components shipped, v1.0.0 on GitHub Packages, Storybook deployed |

---

## Component Count

| Priority | Count | Cycle |
|----------|-------|-------|
| Foundation (scaffold, tokens, CI/CD) | — | CYCLE-1 |
| P0 Core Primitives | 10 | CYCLE-2 |
| P1 Composition | 11 | CYCLE-3 |
| P2 Complex + Data Viz | 6 | CYCLE-4 |
| **Total** | **27** | — |

---

## Dependency Map

```
CYCLE-1 (Foundation)
  └── CYCLE-2 (P0 Primitives — requires: scaffold, tokens, Storybook, CI)
        └── CYCLE-3 (P1 Composition — requires: P0 primitives stable)
              └── CYCLE-4 (P2 Complex + Release — requires: P0+P1 stable, Chromatic baselines)
```

All cycles are **strictly sequential** — each gates the next. No story of a cycle starts until the previous cycle is closed (all stories merged, reviewed and QA-passed). Enforced in `dependency-graph.yml` through `requires` (re-baseline CR-001, 2026-10-20).

**Exception recorded**: Story 1.2 (Input) was started on 2026-10-20 before CYCLE-1 closed. Its branch is kept and it is merged only after Story 3.6; it is the first story of CYCLE-2.

---

## Re-baseline (CR-001, 2026-10-20)

**Why**: the 2026-10-16 deadline passed with 1 of 34 stories complete (3.1); CYCLE-1 was never closed and component work started out of order.

**Changes**:
- Dates moved: CYCLE-1 Oct 20–22 · CYCLE-2 Oct 23–29 · CYCLE-3 Oct 30–Nov 4 · CYCLE-4 Nov 5–9 (team of 2). Dates are an estimate — Story 3.1 took Oct 14–19 through dev, review and QA — and must be revisited at the end of CYCLE-1.
- Waves renumbered in cycle order (3.1 → 3.2–3.5 → 3.6 → P0 → P1 → P2).
- Story 3.2 re-scoped: design system is now `src/styles/pallete.color.scss` (hex palette, camelCase variables named after the color) → `src/styles/design.variables.scss` (section-named variables; the only ones component SCSS may use) → `design.variables.module.scss` + `designVariables.ts` (JS export). CSS custom properties `--annexus-*` are no longer generated.
- Cycle 4 counted as 6 components + the v1.0 release story (7 stories).
- Open items (Chromatic token, GitHub Packages token, Figma write access, Slider drag design) must be closed before the cycle that needs them starts.

---

## Azure DevOps Iteration Map

| Cycle | Sprint | Iteration Path | Dates |
|-------|--------|---------------|-------|
| CYCLE-1 | Sprint 1 | `Anexus.AI.Test\Sprint 1` | Oct 12 |
| CYCLE-2 | Sprint 2 | `Anexus.AI.Test\Sprint 2` | Oct 13–14 |
| CYCLE-3 | Sprint 3 | `Anexus.AI.Test\Sprint 3` | Oct 15 |
| CYCLE-4 | Sprint 4 | `Anexus.AI.Test\Sprint 4` | Oct 16 |

**Board**: https://annexus.visualstudio.com/Anexus.AI.Test/_boards/board/t/Anexus.AI.Test%20Team/Stories
**Backlog**: https://annexus.visualstudio.com/Anexus.AI.Test/_backlogs/backlog/Anexus.AI.Test%20Team/Stories

---

## Risk Log

| Risk | Impact | Mitigation |
|------|--------|-----------|
| 27 components in ~14 working days with 2 people | High | Strict cycle order; P0 first — 10 components unblock frontend by Oct 29; reassess velocity at end of CYCLE-1 and CYCLE-2 |
| P1 components depend on P0 stability | Medium | Freeze P0 component APIs after Cycle 2 merge; no breaking prop changes in Cycle 3+ |
| Chromatic visual approval bottleneck | Medium | Approve snapshots per-cycle rather than batching all to Nov 9 |
| Open items unanswered (Chromatic/GitHub tokens, Figma access) | Medium | Close before CYCLE-1 ends; Chromatic and Figma work deferred to end of each cycle if still blocked |
| Style architecture changed after plan (palette/design variables) | Medium | Story 3.2 re-scoped; patterns doc §4.1 updated; no component starts before 3.2 merges |
| Figma AnnexusEX write access | Low | Confirm on Day 1; fallback is to batch Figma pages at end of each cycle |
| AnimatedValues complexity (CSS animation + reduced-motion) | Low | Spike at start of CYCLE-4; fallback is static version with `prefers-reduced-motion` always applied |
