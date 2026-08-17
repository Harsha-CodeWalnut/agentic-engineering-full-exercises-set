# Clarifications

## Q1: Who may perform each subscription-management action?

- Category: Authorization
- Repository evidence: `docs/stakeholder-notes.md` says account owners and billing admins should manage plans, confirms viewers are read-only, and explicitly says whether billing admins may cancel is unclear. `src/types.ts` defines `account_owner`, `billing_admin`, and `viewer`, while `src/services/subscriptionService.ts` labels viewer permission as unclear rather than enforcing a policy.
- Status: Assumption
- Decision: For the first release, account owners may upgrade, downgrade, increase seats, and schedule cancellation. Billing admins may upgrade, downgrade, and increase seats but may not cancel. Viewers remain read-only. The application service must enforce the same policy even if a client attempts a hidden or disabled action directly.
- Consequence: Action availability and server authorization must use one policy. A billing-admin cancellation or any viewer mutation is rejected before a billing-provider preview or mutation is called.

## Q2: When does each supported billing change take effect and what must the user confirm?

- Category: Billing
- Repository evidence: `docs/stakeholder-notes.md` records Finance's preference for immediate prorated upgrades and seat increases and renewal-date downgrades and cancellations, but Support records a conflicting expectation for immediate downgrades or cancellations. `docs/billing-constraints.md` confirms that the provider can preview price impact, apply upgrades and seat increases immediately, schedule downgrades and cancellations for term end, and cannot automatically refund immediate cancellations.
- Status: Assumption
- Decision: Upgrades and seat increases take effect immediately with proration. Downgrades and cancellations take effect at the next renewal date. Before any supported change is submitted, the user must see the provider-backed price impact and effective date and explicitly confirm the current preview.
- Consequence: The workflow must prevent confirmation when the preview is missing, stale, or no longer matches the requested change. Immediate downgrades, immediate cancellations, and automatic cancellation refunds are not offered.

## Q3: How should an existing pending request and an accepted asynchronous request behave?

- Category: Billing, Failure
- Repository evidence: `docs/billing-constraints.md` confirms that only one plan-change request may be pending per account, a second request returns a conflict, and an accepted request may receive its final result later through a webhook. `src/types.ts`, `src/data/subscriptions.ts`, and `src/services/subscriptionService.ts` show that the current application can display a pending string but cannot represent its lifecycle or final outcome.
- Status: Confirmed
- Decision: A provider-accepted request remains pending until its correlated final result arrives. While it is pending, the user sees the requested action and effective timing, and all subscription mutations are blocked. A second submission or provider conflict must resolve to the existing pending request rather than create another request. Only a correlated success result marks the change completed.
- Consequence: The implementation needs structured pending-request state, a single-pending invariant, idempotent final-result processing, and UI states that never present provider acceptance as completed billing.

## Q4: How should definitive failures, indeterminate outcomes, and retries be handled?

- Category: Failure
- Repository evidence: `docs/stakeholder-notes.md` requires clear pending, rejected, and failed states and prohibits exposing sensitive provider errors. `docs/billing-constraints.md` confirms that provider errors contain internal details, final results may be asynchronous, and retrying without the same idempotency key can create a duplicate charge. `src/services/subscriptionService.ts` currently has no failed or recovery state.
- Status: Assumption
- Decision: Customer-visible failures use a safe application message and never expose provider details. A definitive provider failure marks the request failed and leaves the current subscription as the displayed source of truth. A timeout or unknown provider outcome remains pending or indeterminate and cannot start another change until reconciled. Transport retries for the same logical submission reuse its idempotency key. After a definitive failure, a user may start a new logical request only after refreshing state and obtaining a new preview; that new request receives a new idempotency key.
- Consequence: Pending, indeterminate, failed, and completed states must be distinct. Recovery must prevent duplicate charges, repeated terminal transitions, and conflicting requests while still giving the user a safe route to try again after a confirmed failure.

## Q5: What is outside the first release?

- Category: Scope
- Repository evidence: `docs/feature-request.md` asks for upgrades, downgrades, cancellations, and seat changes but says no final decisions are approved. `docs/stakeholder-notes.md` says an Enterprise approval workflow may be needed but is undecided. `docs/billing-constraints.md` verifies seat increases but does not establish seat-decrease behavior and does not support automatic immediate-cancellation refunds. The current `src/App.tsx` is a read-only subscription overview with no payment-method, invoice, refund, approval, or support-agent workflow.
- Status: Assumption
- Decision: The first release supports self-service plan upgrades, plan downgrades, seat increases, and scheduled cancellations for non-Enterprise accounts under Q1. Enterprise self-service and approval workflows, seat decreases, immediate downgrades or cancellations, automatic refunds, payment-method management, invoice management, and support-agent administration are outside scope.
- Consequence: Out-of-scope actions must not reach the billing provider. The interface gives support guidance where appropriate, and each excluded capability requires a separate approved specification before implementation.

