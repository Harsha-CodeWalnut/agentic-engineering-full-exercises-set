# After: failure-preserving PR evidence pack

### Run

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Implementation commit: `36b2ccae737564f84c45790465053ed99d9b1f02`
- Agent and model: Cursor Grok 4.6
- Tools and permissions: file read/edit, shell, git; workspace write and command execution
- Time limit: 45 minutes
- Human hints: 0
- Retries: 0
- Patch: `evidence/after.patch`

| Proof | Result |
|---|---|
| Failed checks preserved | 1 of 1 |
| Commands with exit codes | 3 of 3 |
| Artifacts copied and hashed | 3 of 3 |
| Risk, reviewer action, and rollback present | Yes |
| Generator exit code | 1 |
| Files changed | 2 |
| Lines added and removed | `+186 / -0` |

### What this attempt kept

1. `checkout-smoke` remains `failed` with command `npm run test:smoke` and exit code `1`. Overall result is `failed` and overall exit code is `1`.
2. Every fixture artifact was copied to `evidence/generated/artifacts/` and hashed. Smoke digest: `cb7437313d1a9a1414cf18811209da242fb555e1b0c605353cbaab294ac121da`.
3. Risk, reviewer action, and rollback are copied verbatim into `pr-evidence.json` and `summary.md`.
4. `.github/workflows/evidence-led-pr-01.yml` generates with `${{ github.sha }}`, then verifies and uploads with `if: always()` and no `continue-on-error`.
