# After: source-led workflow reconstruction

### Run

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Implementation commit / source SHA: `6a34ba70d5a6212cde6d4c73aacebc755fa2214d`
- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Tools: file read/edit, shell, git
- Permissions: workspace write and command execution
- Time limit: 45 minutes
- Attempt: 1
- Human hints: 0
- Prompt: Reconstruct the implemented access-provisioning workflow. Require every important transition to come from source or protected trace output. Create state, approval-sequence, and failure-sequence diagrams.
- Context source: `src/workflow.tsx`, fixtures, UI, `docs/diagram-contract.md`, `npm run workflow:trace`
- Diagram contract: Provided
- Source traces: Used
- Patch: `evidence/after.patch`

### Results

| Proof | Result |
|---|---|
| Mermaid parser (`npm run diagrams:parse`) | Pass; exit code: 0 |
| Scenario trace (`npm run workflow:trace`) | Pass; exit code: 0 |
| Unsupported edges | 0 |
| Missing required state paths | 0 |
| Missing participants | 0 |
| Missing paths | none; high-risk security, unhealthy provisioning, and identity-admin rollback are present |
| EDGE markers | WF-01 through WF-10, one per required diagram |
| Files changed | 3 diagram files at source SHA; evidence files in the follow-up commit |

### Parser output

Source SHA: `6a34ba70d5a6212cde6d4c73aacebc755fa2214d`. `access-state.mmd` parsed as stateDiagram. `access-approval-sequence.mmd` and `access-failure-sequence.mmd` parsed as sequence. PASS.

### Changed files

- `diagrams/access-state.mmd`
- `diagrams/access-approval-sequence.mmd`
- `diagrams/access-failure-sequence.mmd`
