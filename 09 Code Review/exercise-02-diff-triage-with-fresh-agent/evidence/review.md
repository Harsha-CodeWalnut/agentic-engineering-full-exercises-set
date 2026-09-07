# Independent review: caching PR (`review-base..review-head`)

**Base SHA:** `8911d1064f74bdc7f0d4e88a2e57f122830ef6f2`  
**Head SHA:** `8242a84ad8735d1a9c5051e1916d86c1c95101af`  
**Comparison:** `review-base..review-head`  
**Source SHA:** `bbf2a4cf0131908689948b521608f3af05d260aa`  
**Reviewer session:** `cursor-grok-fresh-review-09-02`  
**Merge decision:** Request changes

Fresh context was the review brief, protected manifest, and `pr/review-target.diff` only. Implementer notes, earlier reviews, and expected finding identifiers were excluded.

The packaged change caches `workflow-items` in localStorage, sorts defaults by due date, clears cache when filters change, and writes storage from evidence collection. Reproduce each behavior on the mounted head before calling it a blocker.

## CACHE-001 — blocker (high, fix)

Filter changes call `clearCachedWorkflowItems` at `src/App.tsx` line 41. A saved owner, status, or note therefore does not survive filtering and reload. Remove that effect so filters only hide rows.

Regression: `tests/cache-regressions.test.ts`.

## CACHE-002 — blocker (high, fix)

`fetchWorkItems` at `src/services/workflowApi.ts` line 10 parses cached JSON with no fallback. Malformed text or a non-array object throws and the workspace stays on Loading. Parse safely, require an array, and clear the bad key.

Regression: `tests/cache-regressions.test.ts`.

## CACHE-003 — blocker (medium, fix)

Cache miss uses `workItems.sort` at line 13, which mutates the imported fixture. Default due-date order is allowed; changing shared module data is not. Sort a copied snapshot.

Regression: `tests/cache-regressions.test.ts`.

## CACHE-004 — blocker (high, fix)

`collectEvidence` at line 37 writes `JSON.stringify(workItems)` into the cache. That is a write on a read-only action and replaces saved drafts with stale fixture rows. Stop writing storage from evidence collection.

Regression: `tests/cache-regressions.test.ts`.

## CLAIM-001 — unsupported (dismiss)

The claim that `saveAction` mutates `workItems` in place is not supported at line 22. The function returns a new object and does not assign into the fixture. Nearby cache bugs exist; this specific claim remains dismissed.

**Request changes** on `8242a84ad8735d1a9c5051e1916d86c1c95101af`. Do not merge the risky head until the four cache blockers are fixed and CLAIM-001 stays dismissed.
