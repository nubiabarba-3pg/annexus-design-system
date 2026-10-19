# Architecture Diagrams - Annexus Design System

**Source**: `docs/architecture/design/00-system-architecture-greenfield.md`
**Generated**: 2026-10-12

> This file contains Mermaid diagrams extracted from the architecture document for easy preview.
> For full architecture details, refer to the source document above.

---

## System Context Diagram

```mermaid
C4Context
  title System Context — Annexus Design System

  Person(fe, "Frontend Engineer", "Builds the Athene calculator app; consumes @annexus/ui")
  Person(designer, "UI Designer", "Maintains and inspects the Figma component library")

  System(ds, "@annexus/ui", "Annexus Design System: React component library, Storybook, and Figma pages")

  System_Ext(app, "Athene Income Wellness\nAnnuity Calculator", "Consuming React application")
  System_Ext(figma_src, "Figma Source Design\n(ANXSF605)", "Read-only: approved Athene UI design")
  System_Ext(figma_lib, "Figma AnnexusEX File", "Write: component library pages created here")
  System_Ext(ghpkg, "GitHub Packages\n(@annexus/ui)", "Private npm registry — package distribution")
  System_Ext(chromatic, "Chromatic", "Storybook hosting + visual regression CI")
  System_Ext(gha, "GitHub Actions", "CI/CD: lint, test, coverage, visual regression, publish")

  Rel(fe, ds, "npm install @annexus/ui; browse Storybook")
  Rel(designer, figma_lib, "Inspects and uses component pages")
  Rel(ds, figma_src, "Extracts component designs (read-only)")
  Rel(ds, figma_lib, "Creates component pages (write)")
  Rel(ds, ghpkg, "Publishes versioned package")
  Rel(ds, chromatic, "Publishes Storybook + snapshot baselines")
  Rel(fe, app, "Builds with @annexus/ui components")
  Rel(gha, ds, "Runs lint / test / build / publish")
```

---

## Library Layer Architecture

```mermaid
flowchart TB
  subgraph INFRA["Infrastructure (outermost)"]
    SB["Storybook Stories\n(.stories.tsx)"]
    BUILD["Vite Library Build\n(dist/ ESM + CJS)"]
    CI["GitHub Actions CI\n(lint → test → build → publish)"]
    CHROM["Chromatic\n(visual regression + hosting)"]
  end

  subgraph COMP["Component Layer (middle)"]
    REACT["React Components\n(.tsx)"]
    TYPES["TypeScript Interfaces\n(.types.ts)"]
    SCSS["Component SCSS\n(.scss — consumes tokens)"]
    TESTS["Unit Tests\n(.test.tsx — Vitest + RTL)"]
  end

  subgraph TOKEN["Token Layer (innermost)"]
    COLORS["Color Tokens\n(_colors.scss)"]
    TYPO["Typography Tokens\n(_typography.scss)"]
    SPACE["Spacing Tokens\n(_spacing.scss)"]
    CSSVAR["CSS Custom Properties\n(exposed at :root)"]
  end

  TOKEN --> COMP
  COMP --> INFRA
```

---

## Per-Component Structure

```mermaid
flowchart LR
  subgraph Button["src/components/Button/"]
    BT["Button.tsx\n(React component)"]
    BTY["Button.types.ts\n(ButtonProps interface)"]
    BSC["Button.scss\n(styles + token refs)"]
    BST["Button.stories.tsx\n(CSF3 stories)"]
    BTST["Button.test.tsx\n(Vitest + RTL)"]
    BIDX["index.ts\n(re-export)"]
  end

  BTY --> BT
  BSC --> BT
  BT --> BST
  BT --> BTST
  BT --> BIDX
```

---

## Package Export Map

```mermaid
flowchart TD
  IDX["src/index.ts\n(public barrel)"]

  IDX --> C1["Button"]
  IDX --> C2["Input"]
  IDX --> C3["Toggle"]
  IDX --> C4["Slider"]
  IDX --> C5["Modal"]
  IDX --> C6["Tooltip"]
  IDX --> C7["Badge"]
  IDX --> C8["...24 more components"]
  IDX --> TK["tokens (SCSS re-export)"]
  IDX --> TY["shared types"]

  C1 --> DIST["dist/\n@annexus/ui\nESM: index.es.js\nCJS: index.cjs.js\nTypes: index.d.ts"]
```

---

## Token Architecture

```mermaid
flowchart LR
  FIG["Figma Variables\n(AnnexusEX)"] -->|manual sync| SCSS["SCSS Token Files\n(src/tokens/)"]
  SCSS -->|@use| COMP["Component .scss files"]
  SCSS -->|CSS custom props at :root| RUNTIME["Browser Runtime\n(var(--annexus-color-primary))"]
  COMP --> BUILD["Bundled CSS\ndist/style.css"]
```

---

## CI/CD Build Pipeline

```mermaid
flowchart TD
  SRC["src/\n(TypeScript + SCSS)"]

  subgraph LOCAL["Local Development"]
    DEV["vite dev\n(Storybook 8 + HMR)"]
  end

  subgraph CI_PIPE["GitHub Actions CI (on PR + main push)"]
    LINT["pnpm lint\n(ESLint + Prettier)"]
    TSC["pnpm typecheck\n(tsc --noEmit)"]
    TEST["pnpm test\n(Vitest — ≥90% coverage)"]
    BUILD["pnpm build\n(Vite library mode)"]
    SBUILD["pnpm build:storybook"]
    CHROM_CI["Chromatic publish\n(visual regression diff)"]
    PUB["pnpm publish\n→ GitHub Packages\n(on tag push only)"]
  end

  SRC --> DEV
  SRC --> LINT --> TSC --> TEST --> BUILD --> SBUILD --> CHROM_CI
  BUILD --> PUB
```

---

## Figma Parallel Workflow

```mermaid
flowchart LR
  subgraph SOURCE["Source (read-only)"]
    FSRC["Figma ANXSF605\nATH Health Care Income Planner"]
  end

  subgraph PARALLEL["Parallel Implementation (per component)"]
    CODE["Code + Tests\nsrc/components/ComponentName/"]
    STORY["Storybook Story\nComponentName.stories.tsx"]
    FPAGE["Figma Page in AnnexusEX\n'ComponentName Description' + 'ComponentName'"]
  end

  subgraph TARGET["Target (AnnexusEX file)"]
    FLIB["Figma Component Library\n27 pages — one per component"]
  end

  FSRC -->|extract design| PARALLEL
  CODE --> STORY
  FPAGE --> FLIB
```
