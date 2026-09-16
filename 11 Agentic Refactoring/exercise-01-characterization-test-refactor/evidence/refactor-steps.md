# Refactor Steps and Command Proof

1. Started both controlled runs from current `main` commit `fb48d936ec2e6e205478614a4af4d2550662f650` in isolated worktrees.
2. Ran the unconstrained agent once, committed its unedited implementation, and generated `before.patch` from the starting commit to that implementation commit.
3. Added a dynamic public characterization test that imports only `evaluateRenewalEligibility`, reads every protected golden case, and uses `assert.deepEqual` for each observed result.
4. Generated `before-output.json` from the untouched legacy rule and committed only that snapshot and the characterization test.
5. Confirmed the characterization was green across all twelve cases before production edits.
6. Ran the characterized agent once under the same conditions and committed only `legacyEligibility.mjs` directly after the characterization commit.
7. Generated `after.patch` from the characterization commit to the refactor commit, then generated `after-output.json` from the refactored source.
8. Recorded preserve and suspected-bug decisions after the refactor so the required two-commit topology remained intact.
9. Compared before and after output byte-for-byte and recorded matching output SHA-256 values.
10. Ran the automatic evidence capture command for `npm run evidence:verify`; the transcript ends with `exit code: 0`. Then ran the clean `npm run verify:exercise` command before updating the PR.

The history is intentionally linear: characterization, source-only refactor, then evidence-only commits. No command or evidence file is inserted between the characterization and refactor commits.
