# Before: Unframed Specification Attempt

## Session Conditions

- Agent: Codex fresh agent
- Model: Inherited Codex session model
- Tools: Local filesystem inspection, shell, and apply_patch
- Permissions: Workspace-write sandbox limited to an isolated exercise copy
- Time limit: 10 minutes
- Attempt: 1
- Prompt: Allow users to manage their subscriptions.

## Result

Date: 2026-08-14

The agent produced a structured and traceable result, but it is not implementation-ready. It recognized that the stakeholder notes were not approved requirements, then converted several unanswered product questions into assumptions and planned implementation around them. The output would therefore let an engineer build unsupported behavior with high confidence.

## Invented or Resolved Decisions

- The agent assumed only account owners may cancel, while `docs/stakeholder-notes.md` explicitly says cancellation authority for billing admins is unclear.
- The agent selected immediate prorated upgrades and seat increases plus renewal-date downgrades and cancellations. Finance prefers that policy, but Support records a conflicting expectation and the stakeholder notes are not approved requirements.
- The agent assumed all Enterprise subscription mutations are outside scope even though Product only says an approval workflow may be needed and that no decision exists.
- The agent excluded seat decreases because their timing and provider support are unspecified, rather than asking whether they belong to the requested seat-change capability.
- The agent assumed failed asynchronous requests leave the existing subscription unchanged and can be retried, without resolving indeterminate provider outcomes or the exact recovery experience.

## Missing Questions or Remaining Blockers

- Who may perform each action, especially whether a billing admin may cancel?
- Which stakeholder expectation controls downgrade and cancellation timing?
- What precise state and user experience apply to an existing pending request, a provider conflict, and an accepted request awaiting a webhook?
- When is retry safe, how is an indeterminate outcome reconciled, and when must the same idempotency key be reused?
- Which requested actions and Enterprise behavior are explicitly outside the first release?

The agent mentioned several of these as assumptions or a later decision gate, but it did not stop and obtain answers before producing the technical plan and tasks.

## Artifacts and Validation

- Generated artifacts: `specs/spec.md`, `specs/plan.md`, and `specs/tasks.md`.
- Exact generated diff: `evidence/before.patch`.
- Result: first attempt captured without correction or rerun.
- Validation: no revision-oriented specification validation was run because the exercise requires preserving the first attempt. No feature code or protected starter input was changed.

