# Subscription Management Specification

## Objective

Allow authorized users of non-Enterprise accounts to manage supported subscription changes without contacting support, while preventing billing mistakes and preserving the billing provider as the authority for price impact and final outcomes.

## Clarification trace

- Q1 governs role permissions and enforcement.
- Q2 governs supported actions, effective timing, preview, and confirmation.
- Q3 governs the single-pending-request invariant and asynchronous completion.
- Q4 governs failure states, safe errors, reconciliation, and idempotent retries.
- Q5 governs the first-release boundary and provider-call blocking for excluded actions.

## Requirements

### REQ-001: Enforce role-based authorization

For non-Enterprise accounts, an `account_owner` may request a plan upgrade, plan downgrade, seat increase, or scheduled cancellation. A `billing_admin` may request a plan upgrade, plan downgrade, or seat increase, but may not cancel. A `viewer` may not mutate a subscription. The application service must enforce this policy before any billing-provider preview or mutation call, independently of whether the client hides or disables an action. This requirement implements Q1 and the Enterprise boundary from Q5.

### REQ-002: Apply the approved billing timing

Plan upgrades and seat increases must take effect immediately and include provider-calculated proration. Plan downgrades and cancellations must be scheduled for the account's next renewal date. The workflow must not offer immediate downgrades, immediate cancellations, or automatic cancellation refunds. This requirement implements Q2.

### REQ-003: Require a current provider-backed preview and explicit confirmation

Before submitting any supported change, the application must obtain and show a provider-backed preview containing the requested change, its price impact, and its effective date. Submission requires the user to explicitly confirm that preview. The confirmed request must remain bound to the same account and change inputs that produced the preview. Changing an input, refreshing subscription state, or receiving a provider response that invalidates the preview makes it unusable; the user must obtain and confirm a new preview. A missing, stale, or mismatched preview must never produce a mutation call. This requirement implements Q2.

### REQ-004: Represent the request lifecycle without claiming early completion

Subscription change state must distinguish at least `pending`, `indeterminate`, `failed`, and `completed`, and must retain the provider correlation identifier, logical request identifier, idempotency key reference, requested action, requested values, and effective timing needed for display and reconciliation. Provider acceptance is `pending`, not completed, until a correlated final success result arrives. While a request is pending or indeterminate, all subscription mutations for that account must be blocked. The current active subscription remains separately identifiable from the requested change. This requirement implements Q3 and Q4.

### REQ-005: Preserve one pending request and process final results idempotently

At most one change request may be pending or indeterminate for an account. A repeated submission or provider conflict must return and display the existing request rather than create another provider request. Final-result processing must correlate the event to the stored request and be idempotent: a correlated success may transition that request to completed once, a correlated definitive failure may transition it to failed once, and duplicate, unrelated, or invalid terminal events must not repeat a transition or alter the active subscription. This requirement implements Q3 and Q4.

### REQ-006: Recover safely from provider and transport failures

Customer-visible errors must use safe application messages and must not expose provider internals. A definitive provider failure marks the request failed and leaves the active subscription as the displayed source of truth. A timeout or otherwise unknown provider outcome must remain pending or become indeterminate; it must not permit another logical change until reconciliation establishes a terminal result. Transport retries of the same logical submission must reuse its idempotency key. After a definitive failure, the user may begin a new logical request only after refreshing subscription state and obtaining and confirming a new preview; that request must receive a new idempotency key. This requirement implements Q4.

### REQ-007: Present actionable, truthful customer states

The interface must show the active plan and seats separately from any requested change. For a pending or indeterminate request it must show the requested action and effective timing, explain that the final result is outstanding, and disable all mutations. For a failed request it must show a safe failure message and a recovery path that requires refresh and re-preview. For a completed request it must show completion only after the correlated success has updated or confirmed the authoritative subscription state. This requirement implements Q3 and Q4.

### REQ-008: Enforce the first-release scope boundary

The first release is limited to self-service plan upgrades, plan downgrades, seat increases, and scheduled cancellations for non-Enterprise accounts under REQ-001. Enterprise self-service and approval workflows, seat decreases, immediate downgrades or cancellations, automatic refunds, payment-method management, invoice management, and support-agent administration are out-of-scope. Excluded actions must not call the billing provider; where a user encounters an excluded capability, the interface must provide support guidance rather than imply the action is available. This requirement implements Q5.

## Acceptance Criteria

### AC-001: Account owner can reach every supported action

Given a non-Enterprise account with no pending or indeterminate request and a signed-in `account_owner`, When the user selects an upgrade, downgrade, seat increase, or cancellation, Then the application allows the user to request the appropriate preview and applies the effective timing defined by REQ-002.

### AC-002: Billing administrator and viewer restrictions are enforced before provider access

Given either a `billing_admin` attempting cancellation or a `viewer` attempting any subscription mutation, When the action is attempted through the interface or directly through the application service, Then the application rejects it and makes neither a provider preview call nor a provider mutation call.

### AC-003: Enterprise self-service is unavailable

Given an Enterprise account and a user of any role, When the user views or directly attempts a subscription-management action, Then self-service mutation is unavailable, the provider is not called, and the user receives support guidance.

### AC-004: Immediate changes show provider price impact

Given an authorized user requests a plan upgrade or seat increase and no request is pending, When the provider returns a preview, Then the interface shows the provider-calculated price and proration, identifies the effective date as immediate, and requires explicit confirmation before submission.

### AC-005: Scheduled changes show renewal timing

Given an authorized user requests a plan downgrade or an account owner requests cancellation and no request is pending, When the provider returns a preview, Then the interface shows the price impact, identifies the account's next renewal date as the effective date, and does not offer an immediate or automatically refunded alternative.

### AC-006: Invalid preview cannot be confirmed

Given a preview is missing, was produced for different request inputs, or became stale after inputs or subscription state changed, When the user attempts confirmation, Then the application blocks submission, makes no provider mutation call, and requires a new provider-backed preview.

### AC-007: Provider acceptance remains pending

Given an authorized user confirms a current preview, When the provider accepts the request without a final result, Then the application records and displays the request as pending with its action and effective timing, keeps the active subscription separate, and disables all subscription mutations for the account.

### AC-008: Duplicate submission or provider conflict resolves to the existing request

Given an account already has a pending or indeterminate request, When any user submits another change or the provider returns a pending-request conflict, Then the application displays the existing request, creates no additional provider request, and keeps all mutations blocked.

### AC-009: Only correlated success completes a request

Given a stored pending or indeterminate request, When its correlated final success result is processed, Then the request transitions to completed exactly once and the interface shows completion only with authoritative subscription state; duplicate or unrelated results do not alter state.

### AC-010: Definitive failure preserves the active subscription

Given a stored pending request, When its correlated definitive failure result is processed, Then the request transitions to failed exactly once, the active subscription remains the displayed source of truth, and the customer sees a safe failure message without provider-internal details.

### AC-011: Unknown outcome blocks a new logical change and reuses the retry key

Given submission times out or otherwise has an unknown provider outcome, When the application records the outcome or retries transport for that same logical submission, Then the request remains pending or indeterminate, mutations stay blocked, and the original idempotency key is reused.

### AC-012: Retry after definitive failure is a new logical request

Given a request has definitively failed, When the user refreshes authoritative subscription state, obtains a new preview, and explicitly confirms it, Then the application may submit a new logical request with a new idempotency key; without those recovery steps submission remains blocked.

### AC-013: Provider errors are sanitized

Given a provider preview, mutation, conflict, or final-result operation returns internal error details, When the application reports the outcome to the customer, Then it emits an approved safe application message and does not expose provider-internal details.

### AC-014: Excluded capabilities do not reach billing

Given a user attempts a seat decrease, immediate downgrade or cancellation, automatic refund, payment-method or invoice change, support-agent administration, or Enterprise approval flow, When the request reaches the application service, Then the service rejects it without calling the billing provider and supplies support guidance where appropriate.
