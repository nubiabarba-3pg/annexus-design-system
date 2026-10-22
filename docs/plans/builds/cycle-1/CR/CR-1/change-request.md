---
cr-id: CR-1
status: applied
applied-at: 2026-10-21
applied-by: Gricelda Molina
introduced-by: "docs/requirements.md::Deliverables, docs/requirements.md::Explicit Scope, docs/requirements.md::Functional Requirements (heading-anchored)"
impacts-requirements: ["§Deliverables", "§Explicit Scope", "§Functional Requirements — Feature: Component Library Package"]
impacts-stories: [epic-3-story-3.1-repo-scaffold]
impacts-epics: [Epic-3]
cycle-introduced: 1
scheduled-cycle: 1
primary-epic: Epic-3
introduces-epic: Epic-6
approval-authority: tech-lead
rationale: |
  docs/requirements.md specifies "ESM + CJS outputs" without file names. Foundation story
  epic-3-story-3.1-repo-scaffold specified the CJS bundle as dist/index.cjs.js. With
  package.json "type": "module", Node loads a .js file as ESM, so require('@annexus/ui')
  returned {} (BUG-002, ADO #23779). Commit f9a4808 emits the CJS bundle as dist/index.cjs,
  points main and exports["."].require to it, and adds a smoke:require check. This CR records
  the file names in the requirements and moves the scaffold contract to a CR-born story.
applies-against-shipped: true
evidence-links:
  - "commit f9a4808 fix(story-3.2): remediate BUG-001 and BUG-002"
  - "https://github.com/nubiabarba-3pg/annexus-design-system/pull/14"
  - "docs/testing/bug-triage-2026-10-21.md (BUG-002)"
  - "docs/testing/validation-report-story-3.2-2026-10-21-v2.md (TC-014 PASS)"
  - "docs/testing/regression-report-2026-10-21.md (DOC-001)"
  - "https://annexus.visualstudio.com/Anexus.AI.Test/_workitems/edit/23779"
produced-by: "requirements-steward@v1.0.0 Mode A"
---

# CR-1 (cycle-1) — CommonJS entry of @annexus/ui is dist/index.cjs

## Summary

The CommonJS bundle of `@annexus/ui` is emitted as `dist/index.cjs` instead of `dist/index.cjs.js`. `package.json` `main` and `exports["."].require` point to `./dist/index.cjs`. A `smoke:require` script (`scripts/smoke-require.cjs`) asserts that `require('@annexus/ui')` exposes `Input` and `designVariables`; it runs in `prepublishOnly`.

Trigger: BUG-002 (ADO #23779). Under `"type": "module"`, Node loads `dist/index.cjs.js` as ESM and `require('@annexus/ui')` returns `{}`. The code change shipped in commit `f9a4808` (merged via PR #14) and was verified by QA on 2026-10-21. This CR brings the requirements, the scaffold story contract, the architecture document and the plans in line with the shipped code (regression finding DOC-001).

Entry mode: 2A (plain-English description).

## Impact analysis

### Requirement sections

| Section | Before | After |
|---|---|---|
| `docs/requirements.md::Deliverables` | "Vite library mode build producing `dist/` with ESM + CJS outputs" | "… with ESM (`dist/index.es.js`) + CJS (`dist/index.cjs`) outputs" |
| `docs/requirements.md::Explicit Scope` | "Vite library mode build (ESM + CJS output)" | "Vite library mode build (ESM `dist/index.es.js` + CJS `dist/index.cjs` output)" |
| `docs/requirements.md::Functional Requirements` — Feature: Component Library Package | 5 acceptance criteria | + "The package can be consumed with both `import` and `require()`; both expose the same named exports" |

### Stories

| Story | Pre-edit status (origin/main Story Tracker) | Path | Delta |
|---|---|---|---|
| `epic-3-story-3.1-repo-scaffold` | done (End 2026-10-14) | CR-supersede → `CR-1.1` | CJS file name `index.cjs.js` → `index.cjs` in package.json, vite.config.ts `fileName`, ACs, Observable; adds `smoke:require` script |
| `epic-3-story-3.6-cicd` | planned | direct edit + `## Change log` | `ci.yml` gains a `pnpm smoke:require` step after Build; Requires `3.1` → `CR-1.1` |
| `epic-5-story-5.7-v1-release` | planned | direct edit + `## Change log` | Release verification adds `pnpm smoke:require` and the CJS entry |
| `epic-1-story-1.1-button` | planned | no delta | Text "ESM + CJS output" remains accurate |

### Non-story documents

| File | Lines | Delta |
|---|---|---|
| `docs/architecture/design/00-system-architecture-greenfield.md` | 151, 209, 221 | `index.cjs.js` → `index.cjs` (diagram label, dist tree, export map) |
| `docs/plans/builds/cycle-1/cycle-plan.md` | 47 + new section | `index.cjs.js` → `index.cjs`; CR-1 scope entry |
| `docs/plans/implementation-plan.md` | 151, 227 + Epic 3 table | `index.cjs.js` → `index.cjs`; CR-1.1 row |
| `docs/plans/dependency-graph.yml` | stories + waves | 3.1 tombstoned (`superseded_by: CR-1.1`); CR-1.1 entry; wave 10; 3.6 `requires` |
| `docs/architecture-diagrams/00-system-architecture-diagrams-greenfield.md` | 111 | Not written by this CR: outside the R16 allow-list. Value remains `index.cjs.js`. |

### Metadata-only updates

None. No foundation story carries a `traces-to:` line citing the modified sections.

## Dependency impact

- `CR-1.1` inherits from `3.1`: Requires `[]`, Enables `[3.2, 3.3, 3.4, 3.5, 3.6]`.
- `3.6` Requires changes from `[3.1, 3.2, 3.3, 3.4, 3.5]` to `[CR-1.1, 3.2, 3.3, 3.4, 3.5]` (its CI step runs the `smoke:require` script introduced by CR-1.1).
- `3.2`–`3.5` keep `Requires: [3.1]` (3.2 shipped; 3.3–3.5 consume scaffold files that CR-1.1 does not alter besides the CJS output name).
- Wave 1 (`3.1`, done) is sealed and unchanged. `CR-1.1` is placed in new wave 10.
- No dependency cycle (Tarjan SCC over in-scope stories: none).

## Resolution

1. Create CR-born story `CR-1.1` in `Epic 6 (Change Request)/`, superseding `epic-3-story-3.1-repo-scaffold`. Its status is `done`: the implementation is commit `f9a4808` and the QA evidence is `docs/testing/validation-report-story-3.2-2026-10-21-v2.md`.
2. Record `superseded-by: [CR-1.1]` on the foundation scaffold story (audit-write; body byte-identical).
3. Apply the requirement section text in `requirements-delta.md` to `docs/requirements.md`.
4. Rewrite the planned stories 3.6 and 5.7 in place with an appended `## Change log` (R14(b) carve-out).
5. Replace `index.cjs.js` with `index.cjs` in the architecture document, the CYCLE-1 cycle plan and the implementation plan; add CR-1 entries.
6. Update `docs/plans/dependency-graph.yml` (tombstone, CR-1.1 entry, wave 10, 3.6 requires) and `docs/status.md` (Change Requests, Story Tracker, Build Cycles, Agent Activity).

Open item: `docs/architecture-diagrams/00-system-architecture-diagrams-greenfield.md` line 111 still reads `CJS: index.cjs.js`. The file is outside this workflow's write allow-list.

## Approval

| Role | Name | Decision | Date |
|---|---|---|---|
| Approval authority (tech-lead) | Gricelda Molina | Approved via aire-drift single-gate `yes` | 2026-10-21 |

## Closure

Applied 2026-10-21 by aire-drift Phase 8.8. 16 files written — see [CHANGELOG.md](./CHANGELOG.md).
