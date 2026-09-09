# Selected-context first attempt

- Starting commit: 499720baf853dead97eb25e59a6a852ca9100788
- Implementation commit: 9f3a0e170711bc67e9888335799b171805475895
- Agent and model: Codex CLI 0.153.4, gpt-5.6-sol, medium reasoning
- Tools and permissions: Codex exec, workspace-write sandbox, approval never
- Time limit: 75 minutes
- Human hints: 0
- Retries: 0
- Context source: repository-rules and current-adapter-contract only
- Patch: evidence/after.patch
- Patch SHA-256: 44b246db52117a91bb513e294c096850c9d81a9b161ccc0e3158ce8bf37a9176

| Metric | Result |
|---|---|
| Sources loaded | 2: AGENTS.md and current-adapter-contract.md |
| Total UTF-8 bytes | 1327 |
| Mandatory sources missed | 0 |
| Stale or irrelevant sources loaded | 0 |
| Adapter checks | Protected contract and 8 learner tests passed; 0 failed; exit code 0 |
| Typecheck | Passed; exit code 0 |
| Files changed | 6 in the starting-to-implementation patch: 2 plan files and 4 implementation/test files |
| Lines added and removed | +307 / -11 |

The session received only the deterministic selection recorded in the ledger. No open question required context expansion. The agent preserved the adapter contract and added broader learner coverage while using 1,558 fewer catalog bytes. The saved patch is the exact Git diff from the common starting commit to the recorded implementation commit.
