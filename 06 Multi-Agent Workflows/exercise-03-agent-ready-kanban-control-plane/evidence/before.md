# Before implementation

- Agent: Cursor Composer
- Model: Claude
- Other tools: file read/edit, shell, git
- Permissions: workspace write and command execution
- Time limit: 45 minutes
- Prompt: Repair the invalid Kanban control plane, execute only ESC-120 in an isolated lane, integrate with --no-ff, and synchronize every board mirror.
- Attempt: 1
- Patch: `evidence/before.patch`
- Starting commit / base SHA: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`

### Invalid control-plane state

| Card | State | Reservation problem |
|---|---|---|
| ESC-118 | needs-info | Illegally reserves `src/services/workflowApi.ts` without reproduction |
| ESC-120 | ready-for-agent | Correctly reserves inherited-severity lane paths |
| ESC-122 | blocked | Collides on `src/utils/scoring.ts` with ESC-120 |
| ESC-121 | cancelled | Still reserves `src/services/exportApi.ts` |

Active reservation count at base: 5 paths across 4 cards. Two cards reserve `scoring.ts`.

### Initial checks

```text
npm run feature:verify
Reviewed SHA: 94687b092fe695b5ce2f6a8848f8c26180bd09b5
exit code: 1
calculateSeverity(child) returned Low; badge rendered Low

npm run board:verify
exit code: 1
ESC-118, ESC-121, and ESC-122 hold illegal reservations; ESC-120 is not merged
```

`evidence/before.patch` is the genuine product diff of the base SHA against itself for `kanban-control-app`. The starter tree is the baseline.
