# Before: unstructured PR evidence pack

### Run

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Implementation commit: `223feb168cb089a034b5625c4b4b33f564f1c7ef`
- Agent and model: Cursor Grok 4.6
- Tools and permissions: file read/edit, shell, git; workspace write and command execution
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Patch: `evidence/before.patch`

| Proof | Result |
|---|---|
| Failed checks preserved | 0 of 1 |
| Commands with exit codes | 0 of 3 |
| Artifacts copied and hashed | 0 of 3 hashed; 2 of 3 copied without digests |
| Risk, reviewer action, and rollback present | No |
| Generator exit code | Not run |
| Files changed | 3 |
| Lines added and removed | `+28 / -0` |

### Important problems

1. `checkout-smoke` was omitted so the summary could stay green. Overall result was recorded as `passed`.
2. Commands were listed without exit codes. The failing `npm run test:smoke` exit `1` never appeared.
3. Only passing artifacts were copied (`unit-tests.txt`, `checkout.svg`). `checkout-smoke.txt` was not copied and no SHA-256 digests were calculated.
4. Fixture risk, reviewer action, and rollback text were dropped. There is no generator and no workflow, so a failing check cannot keep the job red.
