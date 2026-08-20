# Comparison

Both runs were fair first attempts: same starting commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5`, same agent, model, other tools, permissions, 45-minute time limit, and the same dashboard prompt. The TDD skill was the only changed input. The after branch does not contain the before implementation.

| Topic | Before (TDD skill disabled) | After (TDD skill enabled) |
|---|---|---|
| Public seam | Assumed `GET /api/cases` from repository files, then coded the dashboard | Named the seam first: user-visible dashboard states through MSW `GET /api/cases` |
| Implementation order | Production `App.tsx` first, then a six-test file | Vertical slices: loading, then filtered-empty, then retry; other states after green |
| Observed red | No captured red. Acceptance already failed; new tests were written against the new code | Machine-captured red in `tdd-commands.jsonl` before each production change |
| Production-change timing | All App edits landed before tests ran | Each App change followed a failing test for that one behaviour |
| Isolation | `onUnhandledRequest: "warn"`, no `resetHandlers`; infinite handler leaked | `onUnhandledRequest: "error"`, `resetHandlers`, and RTL cleanup after each test |
| Coverage | Six tests attempted; 3 passed / 3 failed after leaks. Loading had no status role | Six independent tests plus protected acceptance; shuffled seeds 104, 108, 220 passed |
| Verification | `test:smoke` pass, `test:acceptance` fail, participant file fail | `test:smoke`, `test:acceptance`, `test:network`, `agent:check` pass |
| Changed files | `App.tsx`, `App.dashboard.test.tsx` (`evidence/before.patch`) | `App.tsx`, `src/test/setup.ts`, `App.network.test.tsx` (`evidence/after.patch`) |

The skill changed the work from a code-first batch into ordered red-green slices at the real network seam, with proof that each test failed before the matching production edit.
