# UI/UX Discovery — Annexus Design System

**Date**: 2026-10-12
**Agent**: UI_UX_DESIGNER
**Status**: In Progress — awaiting Step 02 answers

---

## Extracted from Requirements

- **Platform**: Web (browser-based React application)
- **Primary users**: Frontend engineers (build-time consumers); secondary: UI designers (Figma AnnexusEX)
- **Product context**: Annuity calculator — financial tool (Athene Income Wellness Annuity Calculator)
- **Deliverable**: Component library + Storybook + Figma pages — NOT an application
- **Design source**: Figma `ANXSF605 - ATH Health Care Income Planner v12` (key: `DjPqMQEOe6khkoqIVQ8a9u`) — approved, final, frozen
- **Figma target**: `AnnexusEX` (key: `HroaJi0L7qqOWKkw78w29A`)
- **Deadline**: Oct 16, 2026

## Extracted from Architecture

- **Framework**: React 18 + TypeScript strict
- **Styling**: SASS/SCSS with design tokens as CSS custom properties
- **Token naming**: `--annexus-{category}-{scale}-{variant}`
- **BEM naming**: `annexus-{component}__{element}--{modifier}`
- **Accessibility**: WCAG 2.2 AA (architecture ADR — confirmed, not just assumed)
  - Focus appearance: 2.4.11 — `:focus-visible` 2px outline
  - Target size: 2.5.8 — 24×24px minimum
  - Dragging alternative: 2.5.7 — keyboard + click-on-track for Slider
- **Icons**: Custom SVGs from Figma (check-circle, chevron-down, winLose) — no icon library dependency
- **Browser support**: Last 2 versions — Chrome, Firefox, Safari, Edge
- **No dark mode** (unless present in source Figma design)
- **Node.js**: 26 LTS

## Open Questions (Step 02)

Answers pending from user — see Step 02 output.
