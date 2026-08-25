# Agent Board

The canonical structured board is [agent-board.json](./agent-board.json). The application copy in `kanban-control-app/src/data/agent-board.json` matches exactly.

| Card | Final state | Reservation status |
|---|---|---|
| ESC-118 | needs-info | Released `workflowApi.ts`; still blocked by `REPRO-118`. |
| ESC-120 | merged | Lane integrated; no active reservations. |
| ESC-122 | blocked | Collision released; remains blocked by `RULE-ESC-122` only. |
| ESC-121 | cancelled | Cancellation retained; `exportApi.ts` released. |

All four cards remain visible with complete state histories. ESC-120 is the only merged card. There are no active reservations across the board.

Integration owner synchronized both JSON mirrors and this rendered board after the `--no-ff` merge of lane commit `26442dc1565327db01e438c476cacd89bc609c27`.
