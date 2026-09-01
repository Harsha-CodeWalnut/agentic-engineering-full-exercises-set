# After: fail-closed flag boundary and atomic rollback

### Run

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Implementation commit: `803ab79345e5d1b3ca863d96966bcbcd9ebf8295`
- Agent and model: Cursor Grok 4.6
- Tools and permissions: file read/edit, shell, git; workspace write and command execution
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Patch: `evidence/after.patch`

| State | Experience | Preview API calls | Telemetry events | Check exit code |
|---|---|---:|---:|---:|
| Enabled | preview | 1 | 1, `invoice_preview_viewed` with targetingKey, accountId, flagKey | 0 |
| Disabled | legacy, `flag-disabled` | 0 | 0 | 0 |
| Provider error | legacy, `flag-evaluation-error` | 0 | 0 | 0 |
| Invalid context | legacy, `invalid-context` | 0 | 0 | 0 |
| API failure | legacy, `preview-unavailable` | 1 | 0 | 0 |

- Files changed: 2
- Lines added and removed: `+103 / -10`
- Rollback exit code: non-zero for invalid timestamp; 0 for the drill
- Config before digest: protected `invoice-preview.json`; after digest recorded in `evidence/rollback-drill.json`
- Rollback audit path: `lastRollback.actor`, `reason`, `timestamp`, `previousRevision`; revision `rollback-2026-08-14T10-30-00-000Z`

### What this attempt kept

1. `getBooleanValue("invoice-preview-v2", false, context)` runs once for a valid request.
2. Only the enabled path calls the preview API and emits `invoice_preview_viewed`.
3. Rollback writes formatted JSON to a sibling temp file, then `renameSync`s it over the target after validation.
