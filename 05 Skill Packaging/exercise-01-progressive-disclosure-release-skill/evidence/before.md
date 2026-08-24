# Before implementation

- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Other tools: file read/edit, shell
- Permissions: workspace write and command execution
- Time limit: 45 minutes
- Prompt: Create customer release notes for `exercise-base..origin/exercise-head`. Trace every published item to Git, identify breaking and migration impact, report missing verification evidence, and exclude internal-only work.
- Repository commit: 1db5cd5b20841572c90bc1a347b0c4b06e01d19c
- Attempt: 1
- Release-notes skill: disabled
- Input context: docs/monolithic-skill-draft.md
- Context bytes: 2934
- Output: evidence/before-output.md

## Files read

- `docs/monolithic-skill-draft.md` (only release-notes instruction)
- Materialized fixture at `.tmp-fixture` (`1db5cd5b20841572c90bc1a347b0c4b06e01d19c`)

## Commands executed

```text
git log --oneline --all
exit code: 0
1db5cd5 chore: clean events
1c43101 BREAKING billing export field rename (#42)
d3b56d0 fix checkout maybe retry declined cards
94c4f0f baseline release

git diff --stat HEAD~20..HEAD
exit code: 128
fatal: ambiguous argument 'HEAD~20..HEAD': unknown revision or path not in the working tree.

npm run context:measure -- ../docs/monolithic-skill-draft.md
exit code: 0
total_context_bytes: 2934
```

The draft says to continue from commit subjects when a Git command fails. Subjects were grouped into features, a compatibility update, and engineering improvements. Trace lines were treated as optional. Missing screenshot and missing migration dry run were not listed. Telemetry was published as engineering investment. Verification used green unit tests as enough to mark the release passed.

## Verification

```text
npm run release:verify -- .tmp-fixture ../evidence/before-output.md
exit code: 1
passed: 1 / 11
score: 9
failed: customer-section, two-customer-items, checkout-published, billing-published, real-traces, breaking-explicit, migration-contract, checkout-evidence, billing-evidence, missing-migration-proof
```
