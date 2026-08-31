# Brief contradictions

## BRIEF-01

Claim: The checkout application calls an external gateway service directly.
Result: rejected
Source: `payment-workflow-app/src/App.tsx:6` calls `runPaymentScenario()`; `paymentOrchestrator.ts` then calls `authorizePayment` and `capturePayment` in the gateway adapter. No checkout-to-gateway call exists.
Diagram decision: architecture and sequence show `CheckoutUI --> Orchestrator` then `Orchestrator --> GatewayAdapter`. Direct checkout-to-gateway edges are omitted.

## BRIEF-02

Claim: A declined authorization is retried once before the order fails.
Result: rejected
Source: `paymentOrchestrator.ts` declined branch sets order `payment_failed` and returns without a second `authorizePayment`. `run-payment-tests.ts` asserts declined checkout has no capture.
Diagram decision: sequence `else Authorization declined` records failure and blocks the receipt. The state diagram has no retry transition.

## BRIEF-03

Claim: Any correctly signed capture webhook belongs to a known payment.
Result: rejected
Source: `webhookReconciler.mjs` throws `Unknown gateway reference` when `knownGatewayReferences` does not contain the event reference. Protected webhook tests require rejection without mutation even when the event id is already marked handled.
Diagram decision: state and sequence include `unknown reference` rejection after a valid signature.

## BRIEF-04

Claim: Every valid capture delivery creates a new ledger entry.
Result: rejected
Source: `webhookReconciler.mjs` returns `already-handled` when `handledEventIds` contains the event id, without pushing a second ledger row. `trace-payment.ts` records first delivery `recorded` with ledger length 1 and duplicate `already-handled` still at length 1.
Diagram decision: state and sequence show first delivery as `ledger_recorded` / `recorded` and duplicate delivery as `already_handled` / `already-handled`.
