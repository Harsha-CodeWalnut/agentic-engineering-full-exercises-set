# After implementation

- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Other tools: file read/edit, shell
- Permissions: workspace write and command execution
- Time limit: 45 minutes
- Prompt: Create customer release notes for `exercise-base..origin/exercise-head`. Trace every published item to Git, identify breaking and migration impact, report missing verification evidence, and exclude internal-only work.
- Repository commit: 1db5cd5b20841572c90bc1a347b0c4b06e01d19c
- Attempt: 1
- Release-notes skill: enabled
- Input context: release-notes-app/.agents/skills/release-notes/SKILL.md
- Context bytes: 2449
- Output: evidence/after-output.md

## Files read

- `release-notes-app/.agents/skills/release-notes/SKILL.md`
- `release-notes-app/.agents/skills/release-notes/references/publication-policy.md`
- `release-notes-app/.agents/skills/release-notes/references/evidence-policy.md`
- `release-notes-app/.agents/skills/release-notes/references/migration-policy.md`
- `docs/pr-descriptions.md` and `docs/ci-evidence.md` as supporting context after Git extraction
- Materialized fixture at `.tmp-fixture` (`1db5cd5b20841572c90bc1a347b0c4b06e01d19c`)

## Commands executed

```text
node .agents/skills/release-notes/scripts/extract-release.mjs --repo .tmp-fixture --base exercise-base --head origin/exercise-head
exit code: 0

npm run context:measure -- .agents/skills/release-notes/SKILL.md .agents/skills/release-notes/references/publication-policy.md .agents/skills/release-notes/references/evidence-policy.md .agents/skills/release-notes/references/migration-policy.md
exit code: 0
total_context_bytes: 2449
```

Extractor JSON supplied the Git range, commits, and changed paths. Publication policy kept telemetry off the customer list. Evidence policy kept the missing screenshot and missing migration dry run explicit. Migration policy named the old `invoiceTotal` contract, the new `total` field, and the customer migration.

## Verification

```text
npm run release:verify -- .tmp-fixture ../evidence/after-output.md
exit code: 0
passed: 11 / 11
score: 100
```
