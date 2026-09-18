# Checkout Route Matrix

| Scenario | Flag | New slice calls | Legacy calls | Result and safety proof |
|---|---:|---:|---:|---|
| card approved | on | 1 | 0 | New slice returns the established paid result. |
| card declined | on | 1 | 0 | New slice returns the established `PAYMENT_DECLINED` result. |
| card | flag off | 0 | 1 | The complete request remains on legacy for immediate rollback. |
| gift-card | on or off | 0 | 1 | Compatibility route remains legacy. |
| invoice | on or off | 0 | 1 | Compatibility route remains legacy. |
| unknown payment type | on or off | 0 | 1 | Compatibility route remains legacy. |
| pre-authorization failure with `authorizationCreated: false` | on | 1 | 1 | Explicit proof that no authorization exists permits exactly one legacy fallback. |
| completed authorization failure with `authorizationCreated: true` | on | 1 | 0 | No retry; a valid public failure result is returned. |
| ambiguous object failure without the field | on | 1 | 0 | No retry; a valid supplied result is preserved. |
| malformed result, `Error`, or primitive failure | on | 1 | 0 | No retry; the router returns a complete `PAYMENT_STATE_UNKNOWN` result. |

The participant test and protected route suite observe calls through the public router seam. They establish that only an enabled card enters the new slice and that legacy fallback is limited to explicit pre-authorization failures.
