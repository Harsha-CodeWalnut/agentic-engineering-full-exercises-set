# Integration Log

| Field | Value |
|---|---|
| base SHA | `94687b092fe695b5ce2f6a8848f8c26180bd09b5` |
| lane commit | `26442dc1565327db01e438c476cacd89bc609c27` |
| reviewer | `risk-owner` |
| feature command | `npm run feature:verify` |
| merge commit | `8c1a3f55858bab579bf39575548e17924417d5be` |
| board command | `npm run board:verify` |
| decision | accept |
| rollback | `git revert 8c1a3f55858bab579bf39575548e17924417d5be` |

## Reservation releases before lane assignment

1. ESC-118 — kept needs-info; released illegal `workflowApi.ts` reservation.
2. ESC-121 — kept cancelled; released `exportApi.ts`.
3. ESC-122 — kept blocked; released `scoring.ts` collision; retained `RULE-ESC-122`.

## ESC-120 integration

Risk-owner reviewed lane commit `26442dc1565327db01e438c476cacd89bc609c27`. Focused command passed with inherited Critical preserved in scoring and badge rendering. Integration owner merged with `--no-ff` into `integration/kanban-control`, then synchronized board mirrors, ownership map, and this log.

Remaining blockers: `REPRO-118` for ESC-118 and `RULE-ESC-122` for ESC-122. No agent assignment for those cards until evidence or product rules are approved.
