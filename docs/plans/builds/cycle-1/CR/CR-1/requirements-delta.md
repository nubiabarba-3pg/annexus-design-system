# CR-1 — Requirements delta

**Entry mode:** 2A (plain English) — this file is the forward patch applied to `docs/requirements.md`.
**Anchor mode:** heading-anchored (no `req-id` blocks in the PRD).
**New requirements:** none. Three existing sections are modified.

## `docs/requirements.md::Deliverables`

Before:

> - Vite library mode build producing `dist/` with ESM + CJS outputs

After:

> - Vite library mode build producing `dist/` with ESM (`dist/index.es.js`) + CJS (`dist/index.cjs`) outputs

## `docs/requirements.md::Explicit Scope`

Before:

> - Vite library mode build (ESM + CJS output)

After:

> - Vite library mode build (ESM `dist/index.es.js` + CJS `dist/index.cjs` output)

## `docs/requirements.md::Functional Requirements` — Feature: Component Library Package

Acceptance criterion added after "Each component ships with its TypeScript types":

> - The package can be consumed with both `import` and `require()`; both expose the same named exports

## Source

BUG-002 (ADO #23779), fixed in commit `f9a4808`; DOC-001 in `docs/testing/regression-report-2026-10-21.md`.
