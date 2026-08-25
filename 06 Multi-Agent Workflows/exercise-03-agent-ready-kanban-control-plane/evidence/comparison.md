# Control-plane comparison

## Assignment safety

| Check | Before | After |
|---|---|---|
| Agent-ready cards | ESC-120 only | ESC-120 merged; no open agent assignments |
| Illegal reservations | 3 cards held paths in invalid states | All reservations released |
| ESC-122 collision on `scoring.ts` | ESC-120 and ESC-122 both reserved | Collision removed; ESC-122 blocked by rule only |

## Board consistency

Both `docs/agent-board.json` and `kanban-control-app/src/data/agent-board.json` match exactly. ESC-120 state history includes `in-progress`, `in-review`, and `merged`. Terminal and unresolved cards retain full histories without reopening.

## History preservation

ESC-121 cancellation reason unchanged. ESC-118 stays needs-info with `REPRO-118`. ESC-122 stays blocked with `RULE-ESC-122`. No card was deleted.

## Final behavior

Inherited Critical severity from `INC-120-P` flows to `INC-120-C` in scoring and badge rendering. Independent incidents such as `INC-121` remain Medium.

## Git traceability

Lane commit `26442dc1565327db01e438c476cacd89bc609c27` has base SHA as sole parent. Merge commit `8c1a3f55858bab579bf39575548e17924417d5be` preserves lane blobs unchanged. Control commit `92042d86739847a2ec437adaf75e244069615a29` updates only board and ownership artifacts.
