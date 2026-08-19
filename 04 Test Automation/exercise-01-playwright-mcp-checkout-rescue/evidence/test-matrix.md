# Checkout test matrix

| Behaviour | Test | Isolation | Assertion |
|---|---|---|---|
| Tax payload | `tax payload is quoted before Pay becomes ready` | unique `x-checkout-session` plus `POST /api/testing/reset` | `waitForRequest` body equals `{ country: "IN", subtotal: 99 }` |
| Tax readiness | same test | same session | Pay `toBeDisabled` while `Calculating...` is visible, then `Pay $106.92` is enabled |
| Authorization payload | `approval posts the authorization payload and shows Order confirmed` | unique session | authorize body equals `{ cardholder: "Asha Kumar", cardNumber: "4242424242424242", total: 106.92 }` |
| Approval | same test | unique session | heading `Order confirmed` is visible |
| Decline | `decline recovery retries with an approved card` | unique session | card `4000000000000000` shows heading `Payment declined` |
| Retry | same test | unique session | `Try another payment`, refill `4242424242424242`, heading `Order confirmed` |
| Duplicate submit | `duplicate submit keeps a single authorization request` | unique session | Pay `.click()` plus form `evaluate` `requestSubmit`; `authorizationRequests` `toHaveLength(1)` |
