# Pre-change scope plan

Commit this plan before editing source. The production request is to map only export to ds-secondary and preserve checkout, delete, and unknown legacy behavior. The implementation budget is exactly two allowed source paths and at most 30 added-plus-deleted lines: minimal-diff-app/src/migration/exportButton.mjs and minimal-diff-app/tests/export-button.test.mjs. Target 20 or fewer changed lines; any result above 20 needs a concrete justification in the final ledger.

The excluded paths are src/components, src/styles.css, package.json, package-lock.json, and src/migration/actionButtons.mjs. Shared cleanup is unnecessary because export can be handled inside the existing helper; migrating other actions would change behavior outside the request.

Use node scripts/run-migration-tests.mjs to observe the seeded failure, add a focused learner test first, then implement and run npm run test:migration. The coordinator will run npm run verify:exercise after recording the source commit and evidence. Derive file and line counts from Git, preserve the first attempt, and commit final evidence separately.
