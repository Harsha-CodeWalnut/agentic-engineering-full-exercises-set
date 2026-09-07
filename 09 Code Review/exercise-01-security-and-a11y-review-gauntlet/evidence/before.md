# Before: vulnerable access-approval head

### Run

- Review base SHA: `f81c3e56a46338c77cce0d0e81b8ae150db5da19`
- Review head SHA: `8292b946c6a756980ecaf6aa1d99adf7105ea597`
- Comparison: `review-base..review-head`
- Starting commit on this branch: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Reviewer agent and model: Cursor Grok 4.6
- Tools and permissions: local git bundle, Semgrep 1.136.0, Node 22, vitest; workspace write and command execution
- Time limit: 45 minutes
- Human hints: 0
- Patch: `evidence/before.patch`

### Baseline commands

| Check | Exit code | Result |
|---|---:|---|
| `node scripts/verify-review-fixture.mjs` | 0 | `Review fixture verified: review-base..review-head` |
| Semgrep `react-dangerous-html-review` on head | 0 (2 findings) | ActionComposer true positive; SafeAnnouncement false positive |
| `npm run test:policy` | 1 | 5 failed, 1 passed |
| `npm run test:review` | 1 | missing learner tests; policy failures; component sink still present |
| `npm run agent:check` | 0 | integrity/lint/format/typecheck/build only; does not prove the review |

### Counts

- True positives: 1 (`SEC-001` dynamic HTML sink)
- False positives: 1 (`SCAN-001` static announcement)
- Manual blockers: 3 (`A11Y-001`, `VAL-001`, `POL-001`)
- Missing regression tests: 4 behaviors (text notes, keyboard buttons, short notes, blocked/escalated Ready)

### Important problems

1. Reviewer notes are rendered with `dangerouslySetInnerHTML`.
2. Queue rows are `div` click targets, not keyboard buttons.
3. Client short-note validation and `type="button"` are gone.
4. Notes containing `approved` skip server note length and Blocked/Escalated rules.
