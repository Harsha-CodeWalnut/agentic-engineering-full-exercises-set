# Before: no-skill baseline

- Starting commit: `63f5e8f1b35cdc3937b7e1c35873d32c78607aa0`
- Implementation commit: `611707e0597970bf5ca0c993c4caf07da6d43b0f`
- Agent and model: codex-cli / gpt-5.6-luna
- Tools and permissions: repository-read / sandbox-read-only
- Time limit: 10 minutes
- Human hints: 0
- Retries: 0
- Patch: `evidence/before.patch`
- Patch SHA-256: `f142c62c7efeafb96a8827c6429f25e312ea400377af2a0a603ce16ee442cf1c`
- Adapter SHA-256: `8cc5a2230bee6ba25fae08ca15bdee4e9965465ba2e5157483601fd648129b71`
- Case count: 3
- Runner-captured responses: 3

## Runner identity

| Case | Session ID | Run nonce |
|---|---|---|
| Historical regression | `review-session-9d72659e-df05-4e10-8c82-4b0c35610902` | `9d72659e-df05-4e10-8c82-4b0c35610902` |
| Security regression | `review-session-99b33986-ec1a-4179-aa78-15c14adb29fc` | `99b33986-ec1a-4179-aa78-15c14adb29fc` |
| Clean control | `review-session-a903e89d-638e-49ae-91e2-417dbac298c6` | `a903e89d-638e-49ae-91e2-417dbac298c6` |

## Measured result

- Historical coverage: 100%
- Security coverage: 100%
- Precision: 100%
- Clean-control blockers: 0
- Verification exit code: 0

The implementation commit removes the starter skill, so `before.patch` is a genuine Git diff for the evaluated no-skill baseline rather than a false new-file snapshot.
