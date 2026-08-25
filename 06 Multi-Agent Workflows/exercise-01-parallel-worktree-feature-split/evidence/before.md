# Before implementation

- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Other tools: file read/edit, shell, git worktree
- Permissions: workspace write and command execution
- Time limit: 60 minutes
- Prompt: Coordinate three product changes through real Git worktrees without overlapping edits, then merge B, A, C with `--no-ff` and promote shared types once.
- Attempt: 1
- Patch: `evidence/before.patch`
- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`

### Initial worktree state

The recorded base SHA is `94687b092fe695b5ce2f6a8848f8c26180bd09b5` (`feat: address exercise review feedback`). At that SHA the main checkout was a normal repository (`GIT_DIR` equals `GIT_COMMON`), not a linked worktree. No lane branches existed yet.

`evidence/before.patch` is the genuine Git product diff of that SHA against itself for `worktree-feature-app`. The output is empty because the starter tree is the baseline; there was no in-progress product delta to record.

### Lane ownership

| Lane | Branch | Owned paths | Forbidden |
|---|---|---|---|
| A | `lane/saved-filters` | `src/components/FilterBar.tsx`, `src/utils/filters.ts`, `tests/lane-a/**` | `src/types.ts` |
| B | `lane/sla-risk` | `src/utils/scoring.ts`, `src/components/MetricStrip.tsx`, `tests/lane-b/**` | `src/types.ts` |
| C | `lane/evidence-export` | `src/components/EvidencePanel.tsx`, `src/services/workflowApi.ts`, `tests/lane-c/**` | `src/types.ts` |

### Investigation and decisions

Starter product at the base SHA is missing all three slices:

- `filters.ts` has no `savedFilterPresets` or `applyFilterPreset`. `FilterBar` has search, priority, and status only.
- `summarizePortfolio` does not return `dueToday`. `MetricStrip` has Critical, Blocked, Ready, and Average risk only.
- `workflowApi.ts` has no evidence bundle helpers. `EvidencePanel` has Collect only.

Lanes A and C both need new structural types. Neither owns `src/types.ts`, so each lane keeps a temporary local interface and files a shared-type request.

### Verification

Focused acceptance at the base SHA, extracted with `git archive 94687b092fe695b5ce2f6a8848f8c26180bd09b5` into `/tmp/ex01-parallel-base` and recorded in `evidence/commands/base-focused.txt`:

```text
npm run test:lane-a
exit code: 1
savedFilterPresets is not exported / High-priority Blocked is absent from FilterBar

npm run test:lane-b
exit code: 1
summary.dueToday is undefined; markup does not contain Due today

npm run test:lane-c
exit code: 1
createEvidenceBundle is not a function; markup does not contain Export JSON
```

### Changed files

None. Product state is the recorded base SHA. See `evidence/before.patch`.
