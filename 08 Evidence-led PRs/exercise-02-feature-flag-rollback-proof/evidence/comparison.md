# Comparison

Both attempts used starting commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5`, the same agent and model, the same tools and permissions, a 45-minute time limit, and a genuine first attempt with zero human hints. The variable is a product-request repair versus the flag and rollback contracts.

## Flag states and call counts

Before still evaluated with default `true`, loaded preview on disabled and provider-error paths, and emitted `invoice_preview_disabled`. Invalid context was not rejected. API failure threw.

After: enabled is one evaluation, one API call, one `invoice_preview_viewed` event with `targetingKey`, `accountId`, and `flagKey`. Disabled, provider-error, and invalid-context return legacy with zero preview side effects. API failure returns `preview-unavailable` with the API call recorded and no success telemetry.

## Targeting key

Before passed the raw context, including mismatched `acct-100` / `acct-200`, into evaluation and `loadPreview`.

After requires equal non-empty `targetingKey` and `accountId` before any flag call, and passes that unchanged identity into evaluation, API, and telemetry.

## Rollback behavior

Before wrote `enabled: false` in place with `writeFileSync`, left the allowlist, skipped audit fields, and did not reject invalid timestamps.

After validates schema, flag key, actor, reason, and ISO-8601 timestamp first. Invalid input returns non-zero and leaves bytes unchanged. Success clears targeting, sets revision `rollback-2026-08-14T10-30-00-000Z`, writes `lastRollback`, and atomically renames a temp file. Drill elapsed 44.561 ms.

## Verification and files

Before: `npm run test:rollout` failed all six checks. Patch `evidence/before.patch` is 3 files, `+13 / -3`.

After: all six rollout checks pass. Generated `evidence/enabled.json`, `disabled.json`, `provider-error.json`, `rollback-drill.json`, and `rollback-drill.md` share source SHA `803ab79345e5d1b3ca863d96966bcbcd9ebf8295`. Patch `evidence/after.patch` is 2 files, `+103 / -10`.
