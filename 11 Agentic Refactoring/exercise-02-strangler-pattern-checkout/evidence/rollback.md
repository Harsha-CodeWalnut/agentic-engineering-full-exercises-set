# Rollback Plan

The strangler seam keeps the original legacy implementation injectable and unchanged. Immediate rollback is configuration-only: set `cardSliceEnabled` to `false`. With the flag false, every card request is routed directly to legacy, while gift-card, invoice, and unknown routes continue using legacy exactly as before.

During normal operation, fallback is intentionally narrower than rollback. The router calls legacy after a card-slice error only when an object explicitly contains `authorizationCreated: false`. That value proves authorization did not begin, so one legacy call is safe.

If `authorizationCreated` is true, missing, ambiguous, malformed, or carried by a primitive failure, the router performs no duplicate attempt. It returns a valid supplied result or a complete `PAYMENT_STATE_UNKNOWN` response. This no duplicate authorization rule remains in force even during gateway uncertainty.

Operational rollback therefore requires disabling the flag before processing another request; it never relies on retrying an uncertain in-flight authorization.
