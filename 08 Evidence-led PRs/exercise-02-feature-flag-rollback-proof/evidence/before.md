# Before: product-request flag repair

### Run

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Implementation commit: `85667d9e8a67282d6abf1630d540eb539936871f`
- Agent and model: Cursor Grok 4.6
- Tools and permissions: file read/edit, shell, git; workspace write and command execution
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Patch: `evidence/before.patch`

| State | Experience | Preview API calls | Telemetry events | Check exit code |
|---|---|---:|---:|---:|
| Enabled | preview | 1 | 1, missing accountId and flagKey | 1 |
| Disabled | legacy | 1 | 1, `invoice_preview_disabled` | 1 |
| Provider error | legacy, reason `flag-disabled` | 1 | 1 | 1 |
| Invalid context | not rejected before evaluation | 1 | 0 or 1 | 1 |
| API failure | uncaught throw | 1 | 0 | 1 |

- Files changed: 3
- Lines added and removed: `+13 / -3`
- Rollback exit code: 0 on valid path; invalid timestamp still writes
- Before and after config digests: not recorded
- Rollback audit path: missing (`lastRollback` not written; in-place `writeFileSync`, no atomic rename)

### Important problems

1. Disabled and provider-error paths still called `api.loadPreview`.
2. Evaluation used default `true` and did not reject mismatched or empty targeting.
3. Rollback only flipped `enabled` and mutated the file in place, with no allowlist clear, revision, or audit record.
