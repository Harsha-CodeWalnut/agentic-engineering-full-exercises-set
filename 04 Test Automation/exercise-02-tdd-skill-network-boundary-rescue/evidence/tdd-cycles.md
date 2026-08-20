# TDD cycles

Public seam: user-visible case dashboard states observed through Testing Library, with the real `GET /api/cases` request controlled by MSW. Confirmed from the network contract before Cycle 1.

## Cycle 1 Loading

- Public seam and one behaviour: announce `Loading cases...` on `role="status"` while `GET /api/cases` is pending.
- Red test and test-only diff: added `src/App.network.test.tsx` loading example only. Production `App.tsx` unchanged. Record: cycle 1 red in `tdd-commands.jsonl` (exit 1, missing status role).
- Smallest production or harness change: render `<p role="status">Loading cases...</p>` when `cases === null` and there is no error.
- Matching records: cycle 1 red then cycle 1 green in `tdd-commands.jsonl`. Red proves the status is absent; green proves the pending request is announced.

## Cycle 2 Filtered-empty

- Public seam and one behaviour: loaded cases with no query match show `No cases match "<query>".` and do not send another request.
- Red test and test-only diff: added the filtered-empty test before changing copy. Production still reused server-empty text. Record: cycle 2 red in `tdd-commands.jsonl` (exit 1). Harness cleanup was required so the infinite loading handler did not leave a second dashboard mounted.
- Smallest production or harness change: filtered-empty copy `No cases match "{query}".` plus `cleanup()` with `server.resetHandlers()` in `src/test/setup.ts`.
- Matching records: cycle 2 red then cycle 2 green in `tdd-commands.jsonl`. Green proves the match copy and `requests` stays 1.

## Cycle 3 Retry

- Public seam and one behaviour: Retry sends exactly one new `GET /api/cases`, shows loading again, and can recover with returned cases.
- Red test and test-only diff: added the retry test while Retry still called `setError("")`. Record: cycle 3 red in `tdd-commands.jsonl` (exit 1, Recovered Co never appears).
- Smallest production or harness change: Retry calls `loadCases()`.
- Matching records: cycle 3 red then cycle 3 green in `tdd-commands.jsonl`. Red proves clearing the alert is not a refetch; green proves two total requests and recovery.

## Final review

Independent success, server-empty, and request-error tests were added after the three slices. `npm run test:component`, `npm run test:acceptance`, and `npm run test:network` all passed. No extra behaviour was added during review.
