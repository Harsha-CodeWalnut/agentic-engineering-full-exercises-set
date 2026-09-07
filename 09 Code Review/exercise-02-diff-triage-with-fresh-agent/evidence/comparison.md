# Comparison

Both attempts used base `8911d1064f74bdc7f0d4e88a2e57f122830ef6f2`, head `8242a84ad8735d1a9c5051e1916d86c1c95101af`, Cursor Grok 4.6, a 45-minute limit, and the same fresh prompt files.

## Blockers

Before: filter `useEffect` deleted cache (CACHE-001, `App.tsx:41`). `JSON.parse` trusted cached JSON (CACHE-002, `workflowApi.ts:10`). `workItems.sort` mutated the fixture (CACHE-003, line 13). `collectEvidence` wrote stale fixture rows (CACHE-004, line 37). `saveAction` did not persist to localStorage, so reloads dropped drafts.

After: filters no longer call `clearCachedWorkflowItems`. Malformed JSON falls back and clears the key. Sort uses a copy. Evidence collection does not write cache. `saveAction` writes a copied list and still returns a new object.

## Unsupported claim

Before: a reviewer could repeat that `saveAction` mutates `workItems`.

After: CLAIM-001 is dismissed. Head `saveAction` returns `{ ...item, ... }` and does not assign into the fixture. Persistence is a cache write of a copy, not fixture mutation.

## Tests and commands

Before: `npm run test:cache` exit 1.

After: `npm run test:cache` exit 0 (4 protected + 5 learner). Source SHA `bbf2a4cf0131908689948b521608f3af05d260aa`.
