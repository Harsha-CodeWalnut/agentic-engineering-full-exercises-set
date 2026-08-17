# Before and After Comparison

## Fair Conditions

The comparison was fair: both runs used the same Codex agent type, inherited model, local filesystem and shell tools, workspace-write permissions, 10-minute limit, first attempt, exercise contract, repository inputs, and exact prompt. Neither attempt was rerun or revised. The only intentional input difference was the human-approved `specs/clarifications.md` supplied to the after run.

## Improvement 1: Authorization became an approved policy

Before, the agent assumed an owner-only cancellation rule while acknowledging that Security considered billing-admin cancellation unclear. After, Q1 makes the human-approved role boundary explicit, and REQ-001 requires the application service to enforce it before any provider preview or mutation. AC-001 through AC-003 make each role outcome observable.

## Improvement 2: Billing timing became deterministic and testable

Before, the agent selected Finance's timing despite the conflicting Support expectation without an approved decision. After, Q2 resolves that conflict, REQ-002 defines immediate-prorated versus renewal-date behavior, and REQ-003 prevents mutation without a matching current preview. AC-004 through AC-006 test the price, date, confirmation, and stale-preview boundaries.

## Improvement 3: Pending behavior became a lifecycle contract

Before, pending handling was planned from provider limitations but the user-visible and terminal-state policy remained an inferred design. After, Q3 drives REQ-004 and REQ-005: accepted is not completed, pending or indeterminate blocks another mutation, conflicts return the existing request, and only a correlated result may transition it. AC-007 through AC-010 make those transitions observable.

## Improvement 4: Retry behavior distinguishes unknown and failed outcomes

Before, the agent broadly stated that a failed request could be retried with the same key, leaving indeterminate outcomes and new logical attempts unclear. After, Q4 drives REQ-006 and REQ-007: transport retry of an unknown outcome reuses the original key, while a definitive failure permits a new key only after refresh, re-preview, and confirmation. AC-011 through AC-013 verify duplicate-charge protection and safe customer errors.

## Improvement 5: Scope became an enforceable boundary

Before, Enterprise changes and seat decreases were excluded as agent-selected assumptions. After, Q5 records the human-approved release boundary and REQ-008 requires every excluded capability to stop before provider access. AC-003 and AC-014 prove that Enterprise and other out-of-scope requests receive guidance without billing mutations.

## Traceability and Readiness

The before attempt was structurally polished but could not distinguish agent judgment from approved product intent. The after attempt connects Q1 through Q5 to REQ-001 through REQ-008, AC-001 through AC-014, PLAN-001 through PLAN-007, and TASK-001 through TASK-010. Every task references requirements and acceptance criteria, allowing a future engineer to implement and verify the approved behavior without silently reopening the original ambiguities.

