# Before: document-led workflow reconstruction

### Run

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Implementation commit: `945e7c8b965b3d127059d65b3731317dddcca77f`
- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Tools: file read/edit, shell, git
- Permissions: workspace write and command execution
- Time limit: 45 minutes
- Attempt: 1
- Human hints: 0
- Prompt: Reconstruct the access-provisioning workflow from `docs/legacy-workflow-description.md`. Create `diagrams/access-state.mmd`, `diagrams/access-approval-sequence.mmd`, and `diagrams/access-failure-sequence.mmd`.
- Context source: `docs/legacy-workflow-description.md` only
- Diagram contract: Not provided
- Source traces: Not used
- Patch: `evidence/before.patch`

### Results

| Proof | Result |
|---|---|
| Mermaid parser (`npm run diagrams:parse`) | Pass; exit code: 0 |
| Semantic verifier (`npm run diagrams:verify`) | Fail; exit code: 1 |
| Unsupported edges | 1 (`failed_provisioning --> provisioning` automatic retry) |
| Missing required state paths | 5 (WF-03 high-risk security, WF-05 security to data owner, WF-09 rollback request, WF-10 rollback completion, `rolled_back --> [*]`) |
| Missing condition labels | 3 (`normal risk`, `healthy`, `unhealthy`) |
| Missing participants | PolicyEngine, Security, IdentityAdmin |
| Missing paths | high-risk security route; identity-admin rollback |
| EDGE markers | 0 of 10 |
| Files changed | 3 |
| Lines added and removed | `+32 / -0` |

### Important problems

1. Legacy routing was copied as fact: manager approval goes directly to data-owner review, with no security route.
2. Provisioning failure is drawn as an automatic retry back to provisioning.
3. Rollback and identity-admin completion are omitted, so the only terminal state is provisioned.
