# Before implementation

- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Other tools: file read/edit, shell
- Permissions: workspace write and command execution
- Time limit: 45 minutes
- Prompt: Repair the case dashboard test-first. Prove loading, success, server-empty, filtered-empty, request error, and retry recovery through GET /api/cases. Make the network test boundary strict and isolated.
- Attempt: 1
- TDD skill: disabled
- Patch: `evidence/before.patch`
- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`

### Investigation and decisions

Public seam assumed from repository inspection: `GET /api/cases` via MSW default handlers. Ran `npm run test:smoke` (pass) and `npm run test:acceptance` (3 failed) before edits. Implementation was code-first: added a `loading` flag, empty-state copy, and Retry calling `loadCases`, then wrote six tests in `App.dashboard.test.tsx`. Loading used visible text without `role="status"`. `src/test/setup.ts` was left on `onUnhandledRequest: "warn"` with no `resetHandlers`, so the infinite loading handler leaked into later tests.

### Verification

```text
npm run test:smoke
exit code: 0
1 passed

npm run test:acceptance
exit code: 1
3 failed

npx vitest run src/App.dashboard.test.tsx --pool=forks --maxWorkers=1
exit code: 1
3 failed | 3 passed (6)
success, filtered-empty, and retry failed after the pending GET /api/cases handler leaked
```

### Files changed

- `case-dashboard-app/src/App.tsx`
- `case-dashboard-app/src/App.dashboard.test.tsx`
- Lines added and removed: see `evidence/before.patch`
