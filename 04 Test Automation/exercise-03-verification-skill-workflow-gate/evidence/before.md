# Before implementation

- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Other tools: file read/edit, shell
- Permissions: workspace write and command execution
- Time limit: 45 minutes
- Prompt: Audit the previous release claim, repair the workflow decision boundary, and create one fail-closed command that proves the client contract, client build, complete provider behavior, provider build, and gate failure handling.
- Attempt: 1
- Verification Before Completion skill: disabled
- Patch: `evidence/before.patch`
- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`

### Investigation and decisions

Ran `npm run test:shortcut` first. `./mvnw -q -Dtest=WorkflowServiceTest test` exited 0, matching the previous release claim. Implementation was claim-first: treated that focused provider class as enough proof, then patched the obvious holes without mapping every release requirement to a command.

Client `parseWorkflowResponse` started throwing when `decisionState` was missing, but unknown states such as `archived` were still accepted and `null` was reported as a missing field rather than an invalid workflow response. `WorkflowItem` gained a derived `decisionState`, defaulting every non-Blocked/In Review status to `accepted`. `WorkflowService` still persisted unsupported transitions such as `Archived`. The gate added client release tests beside the focused Maven class, kept `if (result.status && result.status !== 0)`, and never ran the gate contract, `agent:check`, or `./mvnw verify`.

### Verification

```text
npm run test:shortcut
PREVIOUS CHECK: ./mvnw -q -Dtest=WorkflowServiceTest test
PREVIOUS CHECK EXIT CODE: 0
exit code: 0

npm run test:release
exit code: 1
2 failed | 4 passed (6)
unknown decisionState and non-object response still accepted or misclassified

npm run test:gate
exit code: 1
releaseSteps must contain exactly 4 steps; spawn errors still return 0

./mvnw -q -Dtest=WorkflowReleaseGateTest test
exit code: 1
rejectsUnknownDecisionTransitionWithoutSavingIt failed because Archived was saved

node scripts/verification-gate.mjs
exit code: 1
FAILED client-release with exit code 1
```

### Changed files

- `workflow-gate-app/src/services/workflowContractClient.ts`
- `workflow-rules-api/src/main/java/dev/agentic/exercise/workflow/WorkflowItem.java`
- `scripts/verification-gate.mjs`
- Lines added and removed: see `evidence/before.patch`
