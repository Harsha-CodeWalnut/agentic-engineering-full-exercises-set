# ESC-120 completed lane review

## Base SHA

`94687b092fe695b5ce2f6a8848f8c26180bd09b5`

## Lane commit

`26442dc1565327db01e438c476cacd89bc609c27` on branch `lane/esc-120-inherited-severity`

## Owned paths

- `src/utils/scoring.ts`
- `src/components/SeverityBadge.tsx`
- `tests/esc-120/`

## Changed paths

- `src/utils/scoring.ts`
- `src/components/SeverityBadge.tsx`
- `tests/esc-120/inherited-severity.test.ts`

## Feature command

```text
npm run feature:verify
Reviewed SHA: 26442dc1565327db01e438c476cacd89bc609c27
PASS: 3 tests passed; inherited Critical preserved in scoring and badge
```

## Reviewer decision

`risk-owner` accepted the exact lane commit after verifying owned-path scope, regression test coverage, and focused command output.

## Merge commit

`8c1a3f55858bab579bf39575548e17924417d5be` (`--no-ff` into `integration/kanban-control`)

## Rollback

`git revert 8c1a3f55858bab579bf39575548e17924417d5be`

## Remaining risk

ESC-118 remains needs-info without reproduction. ESC-122 remains blocked by `RULE-ESC-122` with no approved boost value. ESC-121 remains cancelled. No active path reservations overlap.
