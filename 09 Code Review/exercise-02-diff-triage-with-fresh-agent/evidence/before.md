# Before: risky caching head

- Review base SHA: `8911d1064f74bdc7f0d4e88a2e57f122830ef6f2`
- Review head SHA: `8242a84ad8735d1a9c5051e1916d86c1c95101af`
- Comparison: `review-base..review-head`
- Reviewer agent and model: Cursor Grok 4.6
- Tools and permissions: git bundle, Node 22, vitest; workspace write
- Time limit: 45 minutes
- Context provided: `docs/review-brief.md`, `fixtures/manifest.json`, `pr/review-target.diff`
- Human hints: 0
- Patch: `evidence/before.patch`

### Baseline commands

| Check | Exit code | Result |
|---|---:|---|
| `node scripts/verify-review-fixture.mjs` | 0 | `Fresh-review fixture verified: review-base..review-head` |
| `npm run test:cache` | 1 | malformed parse throw; fixture sort mutation; save not persisted; evidence overwrites cache; App clears cache on filter |

### Counts

- Reproduced blockers: 4 (filter wipe, unguarded JSON, in-place sort, evidence write)
- Unsupported claim: 1 (`saveAction` mutates fixture — dismissed)
- Missing learner tests: `tests/cache-regressions.test.ts`
