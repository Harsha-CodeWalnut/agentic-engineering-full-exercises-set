# Subscription Management Technical Plan

## PLAN-001: Establish the authorization and scope policy

- Requirements: REQ-001, REQ-008
- Clarifications: Q1, Q5
- Define one policy used by both interface action availability and the application service.
- Evaluate account tier, user role, requested action, and pending-state eligibility before provider preview or mutation access.
- Return stable denial reasons that allow the interface to distinguish read-only, owner-only cancellation, Enterprise, and unsupported-capability guidance without exposing provider details.

## PLAN-002: Expand the domain model for previews and request lifecycle

- Requirements: REQ-002, REQ-003, REQ-004, REQ-006, REQ-007
- Clarifications: Q2, Q3, Q4
- Replace the unstructured pending-change string with typed preview and request records while retaining the active subscription as a separate object.
- Represent requested action and values, immediate or renewal timing, price impact, logical request identity, provider correlation identity, idempotency-key reference, lifecycle state, and safe customer message.
- Define invariants for preview-to-request matching, one active request per account, and permitted lifecycle transitions.

## PLAN-003: Add provider-preview orchestration

- Requirements: REQ-001, REQ-002, REQ-003, REQ-008
- Clarifications: Q1, Q2, Q5
- Route preview requests through authorization and scope checks before calling the provider adapter.
- Translate supported actions into immediate-prorated or renewal-scheduled provider inputs.
- Bind each returned preview to the account, current subscription state, and exact requested inputs so changed or invalidated previews cannot be submitted.
- Normalize preview failures into safe application outcomes.

## PLAN-004: Add idempotent submission and single-pending enforcement

- Requirements: REQ-003, REQ-004, REQ-005, REQ-006
- Clarifications: Q2, Q3, Q4
- Revalidate authorization, account state, pending state, and preview binding at confirmation.
- Create one logical request and idempotency key per confirmed preview, persisting the request boundary before or atomically with provider submission.
- Reuse the key for transport retries, treat accepted-but-not-final as pending, and map duplicate submissions or provider conflicts to the existing request.
- Keep unknown outcomes pending or indeterminate until reconciliation.

## PLAN-005: Reconcile asynchronous final results

- Requirements: REQ-004, REQ-005, REQ-006, REQ-007
- Clarifications: Q3, Q4
- Correlate each provider final result to the stored request and validate that its transition is permitted.
- Apply success or definitive failure once, ignore duplicate or unrelated terminal events, and retain safe diagnostic details outside customer-facing output.
- Refresh or confirm authoritative subscription state before presenting completion; preserve the active subscription after failure.

## PLAN-006: Build the management and recovery interface

- Requirements: REQ-001, REQ-002, REQ-003, REQ-004, REQ-006, REQ-007, REQ-008
- Clarifications: Q1, Q2, Q3, Q4, Q5
- Present only authorized, in-scope actions and expose support guidance for excluded capabilities.
- Implement preview review and explicit confirmation, including price impact and effective date.
- Render active subscription and requested change separately across pending, indeterminate, failed, and completed states.
- Disable all mutations while unresolved and require refresh plus re-preview before a post-failure resubmission.

## PLAN-007: Verify policy, billing, lifecycle, and scope behavior

- Requirements: REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008
- Clarifications: Q1, Q2, Q3, Q4, Q5
- Add focused service tests proving unauthorized and out-of-scope requests cannot reach the provider adapter.
- Add preview and submission tests for effective timing, proration presentation, binding invalidation, explicit confirmation, idempotency reuse, and the single-pending invariant.
- Add final-result tests for correlation, duplicate delivery, success, definitive failure, unknown outcome, sanitized messaging, and recovery.
- Add interface tests for action availability, support guidance, truthful pending presentation, mutation blocking, and the refresh-and-re-preview path.

## Delivery sequence

Implement PLAN-001 and PLAN-002 first because all later work depends on their policy and domain invariants. PLAN-003 may follow once those contracts exist. PLAN-004 and PLAN-005 then establish the mutation lifecycle. PLAN-006 consumes those service contracts. Execute PLAN-007 alongside each item and complete the full verification set before review.
