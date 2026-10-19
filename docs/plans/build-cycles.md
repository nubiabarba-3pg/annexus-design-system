# Build Cycles Overview — Annexus Design System

## Summary

**Total Cycles**: 4
**Hard Deadline**: Friday, October 16, 2026
**Cycle Plans**: `docs/plans/builds/cycle-[N]/cycle-plan.md`
**Story Files**: `docs/plans/stories/`

---

## Cycle Map

| Cycle | BUILDID | Sprint | Dates | Scope Summary | Expected Outcome |
|-------|---------|--------|-------|---------------|-----------------|
| Cycle 1 | CYCLE-1 | Sprint 1 | Oct 12 | Foundation: repo scaffold, tokens, Storybook, CI/CD, Chromatic | Working skeleton — CI green, Storybook running, ready for components |
| Cycle 2 | CYCLE-2 | Sprint 2 | Oct 13–14 | P0 Core Primitives: Button, Input, Toggle, Slider, Dropdown/Nav, Modal, Tooltip, Badge, Icons, Logo (10 components) | All P0 components installable and documented — frontend unblocked |
| Cycle 3 | CYCLE-3 | Sprint 3 | Oct 15 | P1 Composition Components: Footer, HeaderSection, Legend, AddonRow, HelpIcon, GroupItem, FrequencySelector, AgeTag, ButtonGroup, Row, AdjustInflationRate (11 components) | Full application UI scaffold — complete calculator app buildable |
| Cycle 4 | CYCLE-4 | Sprint 4 | Oct 16 | P2 Complex Components: Chart/Bar, GraphContainer, TopSummary, BottomSummary, Premium, AnimatedValues (6 components) + v1.0 release | All 27 components shipped, v1.0.0 on GitHub Packages, Storybook deployed |

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

All cycles are **strictly sequential** — each gates the next.

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
| 27 components in 4 days is aggressive | High | P0 first — 10 components unblock frontend by Oct 14; P1/P2 can follow even if slightly delayed |
| P1 components depend on P0 stability | Medium | Freeze P0 component APIs after Cycle 2 merge; no breaking prop changes in Cycle 3+ |
| Chromatic visual approval bottleneck | Medium | Approve snapshots per-cycle rather than batching all to Oct 16 |
| Figma AnnexusEX write access | Low | Confirm on Day 1; fallback is to batch Figma pages at end of each cycle |
| AnimatedValues complexity (CSS animation + reduced-motion) | Low | Spike on Day 4 AM; fallback is static version with `prefers-reduced-motion` always applied |
