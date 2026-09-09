# Full-context first attempt

- Starting commit: 499720baf853dead97eb25e59a6a852ca9100788
- Implementation commit: 19df3dfd99ef27296cf2c31071b295fd14447122
- Agent and model: Codex CLI 0.153.4, gpt-5.6-sol, medium reasoning
- Tools and permissions: Codex exec, workspace-write sandbox, approval never
- Time limit: 75 minutes
- Human hints: 0
- Retries: 0
- Context source: All six protected catalog documents
- Patch: evidence/before.patch
- Patch SHA-256: 327b6a18fd28041e221b40b82c014aeb011d3dc754b58737b0458a9ea6446227

| Metric | Result |
|---|---|
| Sources loaded | 6: AGENTS.md, current-adapter-contract.md, current-error-contract.md, legacy-migration-notes.md, ui-style-guide.md, audit-retention.md |
| Total UTF-8 bytes | 2885 |
| Mandatory sources missed | 0 |
| Stale or irrelevant sources loaded | 4 |
| Adapter checks | Protected contract and 6 learner tests passed; 0 failed; exit code 0 |
| Typecheck | Passed; exit code 0 |
| Files changed | 2 |
| Lines added and removed | +138 / -9 |

The session received the full catalog, including one explicitly stale source and three sources not needed for the initial behavior-preserving refactor. It completed on its first attempt without human correction. The saved patch is the exact Git diff from the starting commit to the recorded implementation commit.
