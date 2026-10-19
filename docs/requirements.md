# Requirements - Annexus Design System

**Date**: 2026-10-12
**Author**: ANALYST_PM_GREENFIELD
**Status**: Approved
**Version**: 1.0

---

## Project Overview

### Vision

Build the **Annexus Design System** — a production-ready React component library, Storybook explorer, and Figma component library — extracted from the approved Athene Income Wellness Annuity Calculator Figma design. Components are implemented in code and Storybook simultaneously with their Figma counterparts, giving frontend engineers and UI designers a single source of truth from day one.

### Problem Statement

The Athene Income Wellness Annuity Calculator frontend application needs to be built rapidly and consistently. Without a shared component library, frontend engineers would duplicate UI work, diverge from the approved design, and be unable to leverage agentic frameworks effectively. A design system eliminates that fragmentation.

### Target Users

**Primary**: Frontend engineers building the Athene Income Wellness Annuity Calculator web application.
- They import the npm package into their app
- They browse Storybook to discover components, variants, and usage patterns
- They (or their agentic frameworks) consume Storybook as a reference when generating UI code

**Secondary**: UI designers maintaining the Figma component library in `AnnexusEX`.

### Business Value

- Accelerates frontend development by providing ready-to-use, tested, production-quality components
- Ensures pixel-perfect fidelity to the approved Athene design
- Enables agentic frontend development by making the component catalogue machine-readable via Storybook
- Creates a reusable foundation for future Annexus products

---

## Roles & Permissions Matrix

> Single-actor system — no authentication or authorization within the design system itself.
> The design system is a library/tool, not an application with user sessions.

| Role (canonical) | Description | Key Permissions (allow) | Explicitly Denied | Auth Source |
|------------------|-------------|-------------------------|-------------------|-------------|
| Consumer (Frontend Engineer) | Installs and uses the package in their application | Import any component, read Storybook | Modify library internals without a PR | n/a — library, no auth |

**No role variation** — single actor. All auth/RBAC concerns belong to the consuming application, not this library.

---

## Project Type

| Attribute | Value |
|-----------|-------|
| Type | Greenfield — New System |
| Quality Level | Production-Ready |
| Timeline | 4 working days (Oct 12–16, 2026) |
| Hard Deadline | Friday, October 16, 2026 |

---

## Component Inventory

> Extracted from source Figma file: `ANXSF605 - ATH Health Care Income Planner v12` (key: `DjPqMQEOe6khkoqIVQ8a9u`)
> Target Figma file for component library: `AnnexusEX` (key: `HroaJi0L7qqOWKkw78w29A`)

| # | Component | Variants / States | Priority |
|---|-----------|-------------------|----------|
| 1 | Button | 7 hierarchies (Primary, Secondary Color, Secondary Gray, Tertiary Color, Tertiary Gray, Link Color, Link Gray) × sizes × states (Default, Hover, Disabled, Focus) | P0 |
| 2 | Input | Types: currentAge, currentMonthlyNeed, incomeStartAge, inflationRate — States: Default, Selected, Error | P0 |
| 3 | Toggle | Pressed (True/False) × States (Default, Hover, Focus, Disabled) | P0 |
| 4 | Slider | Income Start × Target Age combinations + Control Handle + Number Strip | P0 |
| 5 | Dropdown / Header Navigation | — | P0 |
| 6 | Modal | States: Input, Add Benefits | P0 |
| 7 | Tooltip | — | P0 |
| 8 | Badge | — | P0 |
| 9 | Footer | — | P1 |
| 10 | Header Section | — | P1 |
| 11 | Legend | States: Default, Monthly Income Only | P1 |
| 12 | Add-on Row | Types: Bundle, Pharmacy × States: Default, Added | P1 |
| 13 | Help Icon | Multiple contexts × States: Default, Hover | P1 |
| 14 | Group Item | States: Default, Hover, Active | P1 |
| 15 | Frequency Selector | States: Monthly, Annually | P1 |
| 16 | Age Tag | States: Target, Default | P1 |
| 17 | Button Group | States: Default, Hover, Active | P1 |
| 18 | Adjust Inflation Rate | States: Default, Active | P1 |
| 19 | Chart / Bar | Target (1/10/20) × Variant (A/B) | P2 |
| 20 | Graph Container | States: 5%, 6%, 7% | P2 |
| 21 | Top Summary | Multiple modes (65/68, 65/65, 60/65 × benefit variants) | P2 |
| 22 | Bottom Summary | States: Start, Mid, End, Locked in 10, Locked in 20 | P2 |
| 23 | Premium | Variants: Premium Amount, Edit | P2 |
| 24 | Animated Values | Multiple income/projection/premium modes | P2 |
| 25 | Icons | check-circle, chevron-down, winLose | P0 |
| 26 | Row (Add-on) | Line (2/3) × States: Default, Added | P1 |
| 27 | Athene Logo | — | P0 |

**Priority key**: P0 = blocking frontend work (must ship first), P1 = needed this sprint, P2 = needed but can follow P0/P1.

---

## Tech Stack

| Decision | Value | Status |
|----------|-------|--------|
| Framework | React | Confirmed |
| Language | TypeScript (strict) | Confirmed |
| Styling | SASS/SCSS | Confirmed |
| Bundler | Vite (library mode) | Confirmed |
| Storybook | Storybook 8.x | Confirmed |
| Package name | TBD | Architect decision |
| Package registry | TBD | Architect decision |
| Accessibility standard | WCAG 2.1 AA (assumed) | Architect to confirm |
| Browser support | Last 2 versions: Chrome, Firefox, Safari, Edge | Confirmed |
| Unit testing | Vitest + React Testing Library | Confirmed |
| Visual regression | Chromatic (or Percy — TBD) | Confirmed |
| Test coverage | ≥ 90% | Confirmed |
| Node.js | TBD | Architect to confirm |

---

## Deliverables

### 1. React Component Library (npm package)
- All 27 components implemented in React + TypeScript
- Full TypeScript prop types exported — zero `any` usage
- SASS/SCSS styles using design tokens (colors, spacing, typography, etc.)
- Vite library mode build producing `dist/` with ESM + CJS outputs
- `index.ts` barrel export for all components
- Importable as: `import { Button, Input } from '@annexus/ui'` (name TBD)

### 2. Storybook
- One story file per component (`ComponentName.stories.tsx`)
- Every variant and state covered as a named story
- Controls (args) configured for interactive exploration
- Docs page auto-generated from prop types
- Deployed and accessible to the full frontend team
- Searchable by component name, variant, and status

### 3. Figma Component Library (AnnexusEX file)
- One new Figma page per component added to the `AnnexusEX` file
- Each page layout:
  - **Left**: `ComponentName Description` — component explanation, variants, types, usage notes
  - **Right**: `ComponentName` — the component with correct variables, tokens, and all variants
- Design tokens (colors, typography, spacing) defined as Figma variables
- Components use Figma auto-layout and component properties/variants
- Created in parallel with the code implementation

---

## Success Criteria (MUST HAVE)

| ID | Criterion | Measurement | Target |
|----|-----------|-------------|--------|
| SC-1 | Package installable | `npm install <package-name>` succeeds in a fresh React app | By Oct 16 |
| SC-2 | All components importable | `import { Button }` from package resolves with TypeScript types | Every component |
| SC-3 | Storybook complete | Every component has a story covering all variants and states | By Oct 16 |
| SC-4 | Storybook deployed | Team can access Storybook URL without local setup | By Oct 16 |
| SC-5 | Figma library complete | All 27 components have a dedicated page in AnnexusEX | By Oct 16 |
| SC-6 | Unit test coverage | ≥ 90% coverage reported by Vitest | Every component |
| SC-7 | Visual regression baseline | All Storybook stories have approved Chromatic/Percy snapshots | By Oct 16 |
| SC-8 | Browser compatibility | All components render correctly in last 2 Chrome/Firefox/Safari/Edge | All components |
| SC-9 | TypeScript strict | Build passes with `strict: true`, zero `any` | Build-time gate |
| SC-10 | Design fidelity | Components match source Figma design (pixel-level review per component) | Every component |

---

## Failure Criteria (UNACCEPTABLE)

| ID | Criterion | Description |
|----|-----------|-------------|
| FC-1 | Package not importable | A fresh React + TypeScript app cannot install and render any component |
| FC-2 | Missing Storybook story | Any component ships without a Storybook story |
| FC-3 | Missing Figma page | Any component ships without its AnnexusEX Figma page |
| FC-4 | Coverage below 90% | Unit test coverage drops below 90% on any component |
| FC-5 | TypeScript errors in consumer | Importing the package produces TypeScript errors in a strict consumer app |
| FC-6 | Design divergence | Any component visually diverges from the approved Athene source design without explicit sign-off |
| FC-7 | No visual regression baseline | Visual regression tests not set up — regressions become undetectable |

---

## Technical Constraints

| Constraint | Value | Rationale |
|------------|-------|-----------|
| Framework | React | Consuming app is React |
| Language | TypeScript (strict) | Type safety required for production; enables agentic code generation |
| Styling | SASS/SCSS | Team familiarity; supports design tokens as variables |
| Bundler | Vite (library mode) | Fast build, native ESM, modern output |
| Browser support | Last 2 versions (Chrome, Firefox, Safari, Edge) | Excludes IE11; aligns with modern tooling |
| Package registry | TBD — architect decision | May affect CI/CD pipeline configuration |
| Accessibility | WCAG 2.1 AA (assumed) | Architect to confirm; drives interactive component behavior |
| Node.js version | TBD — architect decision | Must align with CI environment |

---

## Quality Gates

| Gate | Target | Required |
|------|--------|----------|
| Unit Test Coverage | ≥ 90% | Yes |
| Visual Regression | 100% stories snapshotted | Yes |
| TypeScript strict build | 0 errors | Yes |
| No critical bugs | 0 P0 bugs at release | Yes |
| Design fidelity review | Pass per component | Yes |
| Browser compatibility | Pass in last 2 Chrome/Firefox/Safari/Edge | Yes |
| Storybook stories | 100% components covered | Yes |
| Figma pages | 100% components covered | Yes |
| Code review | All PRs reviewed | Yes |

---

## Design References

| File | Type | Description | Used In |
|------|------|-------------|---------|
| `ANXSF605 - ATH Health Care Income Planner v12` | Figma Design | Source of truth for all component designs and variants | All components |
| `AnnexusEX` — Component Example page | Figma Design | Layout template for new component pages (left: Description, right: Component) | Figma library |

**Source Figma URL**: `https://www.figma.com/proto/DjPqMQEOe6khkoqIVQ8a9u/`
**Target Figma URL**: `https://www.figma.com/design/HroaJi0L7qqOWKkw78w29A/AnnexusEX`

---

## Functional Requirements

### Feature: Component Library Package
**Priority**: Must Have

**User Story**: As a frontend engineer, I want to install a single npm package and import any UI component so that I can build the Athene calculator app without creating components from scratch.

**Acceptance Criteria**:
- Package installs via npm/yarn/pnpm without peer dependency conflicts (only React + React-DOM as peers)
- Each component is exported as a named export from the package root
- Each component ships with its TypeScript types
- Tree-shaking works — importing one component does not bundle the rest
- SASS styles are either bundled or available as a separate import

---

### Feature: Storybook Component Explorer
**Priority**: Must Have

**User Story**: As a frontend engineer (or agentic framework), I want to browse all components, their variants, and their usage examples in Storybook so that I can find and use the right component without reading source code.

**Acceptance Criteria**:
- Every component has a dedicated Storybook entry
- All variants and interactive states are represented as named stories
- Storybook Controls panel allows prop manipulation without code
- Auto-generated Docs page shows prop table derived from TypeScript types
- Storybook is deployed to a URL accessible to the full team
- Search returns relevant components by name or category

---

### Feature: Figma Component Library
**Priority**: Must Have

**User Story**: As a UI designer, I want all components available in the AnnexusEX Figma file with correct properties, variants, and tokens so that I can use and inspect them without reverse-engineering the code.

**Acceptance Criteria**:
- One Figma page per component, named `ComponentName`
- Each page contains: left frame `ComponentName Description` (description, variant list, usage notes) and right frame `ComponentName` (the actual component with all variants, using Figma variables/tokens)
- All components use Figma component properties and auto-layout
- Design tokens (colors, typography, spacing) defined as Figma variables, not hardcoded values
- Components match the visual output of the React implementation

---

### Feature: Design Tokens
**Priority**: Must Have

**User Story**: As a frontend engineer, I want all colors, typography, and spacing to come from design tokens so that global style changes require updating only the token, not every component.

**Acceptance Criteria**:
- Tokens defined as SCSS variables (and/or CSS custom properties)
- Token names match Figma variable names
- All components consume tokens — no hardcoded hex values or pixel values in component styles
- Token file exported as part of the package

---

## Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | Component render time | < 16ms (60fps, no jank) |
| Bundle size | Per-component tree-shaken size | < 50KB gzipped per component |
| Accessibility | Keyboard navigation | All interactive components fully keyboard-navigable |
| Accessibility | Screen reader | ARIA labels on all interactive components |
| Accessibility | Color contrast | WCAG 2.1 AA minimum (4.5:1 normal text, 3:1 large text) |
| Compatibility | Browsers | Last 2 major versions: Chrome, Firefox, Safari, Edge |
| TypeScript | Strictness | `strict: true`, no `any` |
| Coverage | Unit tests | ≥ 90% per component |
| Storybook | Story completeness | 100% of variants and states covered |

---

## Explicit Scope

### IN Scope ✅
- 27 React components extracted from Athene Income Wellness Annuity Calculator Figma design
- TypeScript prop types and interfaces for all components
- SASS/SCSS styles using design tokens
- Storybook stories covering all variants and states
- Figma component pages in AnnexusEX (one per component)
- Design tokens (colors, typography, spacing) as SCSS variables
- Vite library mode build (ESM + CJS output)
- Unit tests with Vitest + React Testing Library (≥90% coverage)
- Visual regression baseline with Chromatic or Percy
- npm package (registry TBD)

### OUT of Scope ❌
- Application business logic (annuity calculations, financial math)
- Backend / API integration
- Authentication or authorization of any kind
- The Athene Income Wellness Annuity Calculator application itself
- Documentation site beyond Storybook
- Mobile-native components (iOS/Android)
- IE11 or legacy browser support
- Internationalization (i18n) / localization
- Dark mode (unless present in source design)
- Animation library beyond what is in the source Figma design

### Future Considerations (Not This Release)
- Additional Annexus product themes / multi-brand tokens
- Component playground / sandbox environment
- Automated design-to-code sync (Figma plugin / Code Connect)
- Changelog and versioned releases beyond v1.0

---

## Assumptions

| Assumption | Impact if Wrong |
|------------|-----------------|
| Package name/registry decided by architect before build starts | Import paths in all stories and docs must be updated |
| WCAG 2.1 AA is the accessibility target | Some interactive components may need rework for stricter levels |
| Chromatic is available (free tier or org account) for visual regression | Switch to Percy — story structure unchanged, pipeline config changes |
| Source Figma design (`DjPqMQEOe6khkoqIVQ8a9u`) is final and not changing during implementation | Component rework mid-sprint, potential deadline miss |
| "Next Friday" deadline = October 16, 2026 | Scope must be re-negotiated if date is later |
| Node.js version aligns with team's current environment | CI configuration may need adjustment |
| React version used by the consuming app is React 18+ | Peer dependency constraints may need widening |
| Storybook 8.x is compatible with chosen React/Vite versions | Downgrade or workarounds may be needed |
| AnnexusEX Figma file is owned/editable by the team | Figma sharing permissions must be confirmed |

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| 4-day deadline is insufficient for 27 production-ready components | High | High | Prioritize P0 components (8 components) first; P1 and P2 follow. Negotiate deadline if P0 set is not enough for frontend to start |
| Source Figma design changes mid-sprint | Medium | High | Freeze design for duration of sprint; any changes queued for v1.1 |
| Package registry not decided before build starts | Medium | Medium | Default to public npm under `@annexus` scope; update if architect decides otherwise |
| Visual regression tool setup (Chromatic/Percy) takes longer than expected | Low | Medium | Set up on Day 1 alongside repo scaffolding |
| Figma AnnexusEX file access not available to all designers | Low | Medium | Confirm sharing permissions on Day 1 |

---

## Timeline

| Milestone | Date | Deliverables |
|-----------|------|--------------|
| Requirements Complete | 2026-10-12 | `docs/requirements.md` (this document) |
| Architecture Complete | 2026-10-12 | `docs/architecture/` |
| P0 Components (10) + Stories + Figma pages | 2026-10-14 | Button, Input, Toggle, Slider, Dropdown/Nav, Modal, Tooltip, Badge, Icons, Logo |
| P1 Components (11) + Stories + Figma pages | 2026-10-15 | Footer, Header Section, Legend, Add-on Row, Help Icon, Group Item, Frequency Selector, Age Tag, Button Group, Row, Adjust Inflation Rate |
| P2 Components (6) + Stories + Figma pages | 2026-10-16 | Chart, Graph Container, Top Summary, Bottom Summary, Premium, Animated Values |
| Visual regression baseline approved | 2026-10-16 | All Chromatic/Percy snapshots approved |
| Package published | 2026-10-16 | npm package live and installable |
| Hard Deadline | 2026-10-16 | All deliverables complete |

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Stakeholder | Nubia Barba | 2026-10-12 | Approved |
| Technical Lead | TBD (Architect) | TBD | Pending |
