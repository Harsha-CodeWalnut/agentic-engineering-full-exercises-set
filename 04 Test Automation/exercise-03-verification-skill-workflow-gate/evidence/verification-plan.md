# Verification plan

Public seam: workflow `decisionState` on provider JSON, client runtime parsing of unknown input, and one fail-closed command that stops later work when a step or spawn fails.

| Requirement | Command or test | Observable assertion | Expected result | Failure meaning |
|---|---|---|---|---|
| Client accepts `needs-evidence`, `pending-review`, `accepted` | `npm run test:release` | `parseWorkflowResponse` returns that `decisionState` | 6 tests pass, exit 0 | Runtime client still trusts an unchecked cast |
| Client rejects missing `decisionState` | `npm run test:release` | throws `/decisionState/` | same | Missing field is still accepted |
| Client rejects unknown `decisionState` | `npm run test:release` | throws `/decisionState/` for `archived` | same | Unknown state is still accepted |
| Client rejects a non-object | `npm run test:release` | throws `/workflow response/i` for `null` | same | Null is misclassified |
| Provider derives every `decisionState` | `./mvnw -q verify` via `WorkflowReleaseGateTest` | list JSON contains `needs-evidence`, `pending-review`, `accepted` | Maven verify exit 0 | Responses omit or mis-map state |
| Unsupported / unknown transition is not saved | `./mvnw -q verify` | `Archived` throws and `wf-101` stays `Blocked` | Maven verify exit 0 | Invalid transition is persisted |
| Ready evidence-note rule kept | `./mvnw -q verify` | short Ready note still throws | Maven verify exit 0 | Existing rule was dropped |
| Gate contract | `npm run test:gate` | success path runs all four; preserves a non-zero; spawn error is non-zero and stops | exit 0 | Gate still takes the focused-test shortcut |
| Client quality and production build | `npm run agent:check` | integrity, lint, format, typecheck, build | exit 0 | Client is not releasable |
| Complete provider tests and package | `./mvnw -q verify` | committed wrapper, full lifecycle | exit 0 | Only `WorkflowServiceTest` was proven |

Gate order in `node scripts/verification-gate.mjs`:

1. `npm run test:gate` (`gate-contract`)
2. `npm run test:release` (`client-release`)
3. `npm run agent:check` (`client-quality-build`)
4. `./mvnw -q verify` (`provider-tests-build`)

The first failure stops later steps: a non-zero status is returned as the gate exit code, and a process-spawn error returns `1` without running the remaining surfaces. Success is logged only after every surface passes.
