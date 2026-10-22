# CR-1 — Plan delta (vs `docs/plans/builds/cycle-1/cycle-plan.md`)

**Scheduled cycle:** CYCLE-1 | **Introduced in cycle:** CYCLE-1

## Scope added

| Story | Title | Cycle | Wave | Status | Notes |
|---|---|---|---|---|---|
| CR-1.1 | CommonJS entry as `dist/index.cjs` + `smoke:require` | CYCLE-1 | 10 | done | Supersedes 3.1. Implemented in `f9a4808`; QA verified 2026-10-21 |

## Scope modified (direct edits, pre-edit status `planned`)

| Story | Cycle | Wave | Delta |
|---|---|---|---|
| 3.6 CI/CD Pipeline | CYCLE-1 | 3 | `ci.yml` adds "Smoke check CommonJS entry" (`pnpm smoke:require`) after Build — six CI steps instead of five. Requires `3.1` → `CR-1.1` |
| 5.7 v1.0 Release | CYCLE-4 | 9 | Release verification adds `pnpm smoke:require`; ACs name both `dist/index.es.js` and `dist/index.cjs` |

## Scope superseded

| Story | Superseded by | Wave (frozen) |
|---|---|---|
| 3.1 Repo Scaffold | CR-1.1 | 1 |

## Schedule

No date changes. CR-1.1 carries no remaining work (status `done`). The 3.6 delta adds one CI step to work that has not started.

## Cycle-plan acceptance criteria

- `pnpm build` produces `dist/index.es.js`, `dist/index.cjs`, `dist/index.d.ts`, `dist/style.css` (file name corrected)
- Added: `require('@annexus/ui')` exposes the public API (`pnpm smoke:require` exits 0)
