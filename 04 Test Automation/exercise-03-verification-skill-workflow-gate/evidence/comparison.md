# Comparison

Both runs were fair first attempts: same prompt, same agent, same model, same tools, same permissions, same time limit (45 minutes), and the same starting commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5`. The Verification Before Completion skill was the only changed input. The after branch does not contain the before implementation.

| Topic | Before (skill disabled) | After (skill enabled) |
|---|---|---|
| Claim coverage | Trusted `./mvnw -q -Dtest=WorkflowServiceTest test` exit 0 as a release | Audited that command; it does not prove client contract, complete provider suite, builds, or gate failure handling |
| Commands selected | `test:shortcut`, then `test:release` plus the focused Maven class | `npm run test:gate`, `npm run test:release`, `npm run agent:check`, `./mvnw -q verify` in one command |
| Failure handling | `result.status && result.status !== 0` treats spawn `null` as success; two incomplete steps | First non-zero status is preserved; process-spawn error returns 1 and stops later work |
| Runtime-boundary checks | Missing `decisionState` only; unknown `archived` accepted; `Archived` transitions persisted | Missing and unknown states throw; unsupported transitions are rejected before save |
| Fresh evidence | Claimed readiness from the previous focused class | Fresh `node scripts/verification-gate.mjs` after implementation commit `119278f280451fae8fedac7b8b33368535e7718b` |
| Completion wording | Implied the client and API were ready after expanding two steps | Reports only what the fresh gate output proves: `VERIFIED release gate passed`, exit code 0 |
| Verification results | `test:release` 2 failed, `test:gate` failed, unknown transition saved | Gate, client, provider, and `verify:exercise` required surfaces passed |
| Changed files | `workflowContractClient.ts`, `WorkflowItem.java`, `verification-gate.mjs` (`evidence/before.patch`) | Those files plus `WorkflowService.java` (`evidence/after.patch`) |

The skill changed the work from a focused green test into a mapped proof plan, a fail-closed four-surface gate, and a completion claim backed only by fresh command output.
