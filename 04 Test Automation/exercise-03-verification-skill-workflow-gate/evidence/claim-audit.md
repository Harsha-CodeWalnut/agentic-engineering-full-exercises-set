# Claim audit

Previous command: `./mvnw -q -Dtest=WorkflowServiceTest test` from `workflow-rules-api`.

Observed result: previous check exit code 0. The focused class passed two examples: Ready without enough evidence is rejected, and a Blocked decision updates owner and status.

What that command proves:

- The Ready evidence-note length rule still throws `InvalidWorkflowDecisionException`.
- A supported Blocked decision can be saved.

What that command does not prove:

- Client contract: runtime rejection of missing or unknown `decisionState`, and rejection of a non-object provider body.
- Complete provider behavior: derived `decisionState` on every response, and that an unknown transition such as `Archived` is rejected before save.
- Client integrity, quality checks, typecheck, or production build.
- Provider build: the complete Maven `verify` lifecycle through the committed wrapper.
- Gate behavior: four surfaces run once, a non-zero step is preserved, and a process-spawn error exits non-zero without later work.

The previous release claim that "the client and API are ready to release" is unsupported. A focused provider unit-test class is not release evidence.
