# Playwright MCP investigation

Configuration: official Playwright MCP server `npx @playwright/mcp@latest` against `http://127.0.0.1:5173`. This after session used the same accessibility-snapshot and network tools (`browser_snapshot`, `browser_network_requests`, `browser_network_request`) on the live checkout app after `npm run setup:check` passed (Node.js 22.23.2, Chromium ready, starter smoke 1 passed, exit code 0).

Session header: `x-checkout-session: mcp-investigate-1787140780209`. Reset with `POST /api/testing/reset` before each flow.

## browser_snapshot — before tax readiness

`browser_snapshot` on `http://127.0.0.1:5173` immediately after navigation:

```text
- main:
  - heading "Complete checkout" [level=1]
  - article "Cart":
    - strong: Calculating...
    - strong: $99.00
  - textbox "Cardholder": Asha Kumar
  - textbox "Card number": "4242424242424242"
  - button "Pay $99.00" [disabled]
```

Conclusion: Pay is disabled and tax still shows Calculating... until `/api/tax-quote` returns. Tests wait on the disabled Pay button, not `waitForTimeout`.

## browser_snapshot — after tax readiness

```text
- article "Cart":
  - strong: $7.92
  - strong: $106.92
- button "Pay $106.92"
```

Conclusion: the user-facing ready state is the enabled button named `Pay $106.92`.

## browser_network_request — tax quote

`browser_network_request` for `POST http://127.0.0.1:5173/api/tax-quote`:

```json
{ "country": "IN", "subtotal": 99 }
```

## browser_network_requests — authorization

`browser_network_requests` listed authorize calls to `http://127.0.0.1:5173/api/payments/authorize`.

`browser_network_request` body for the approved card:

```json
{ "cardholder": "Asha Kumar", "cardNumber": "4242424242424242", "total": 106.92 }
```

`browser_network_request` body for the declined card:

```json
{ "cardholder": "Asha Kumar", "cardNumber": "4000000000000000", "total": 106.92 }
```

## Approval, decline, retry, duplicate

- Approval `browser_snapshot`: heading `Order confirmed` and authorization id `AUTH-mcp-investigate-1787140780209-1`.
- Decline `browser_snapshot`: alert with heading `Payment declined` and button `Try another payment`.
- Retry: fill `4242424242424242`, click Pay, heading `Order confirmed` with `AUTH-mcp-investigate-1787140780209-2`.
- Duplicate: click Pay then `form.requestSubmit()` while authorizing. Authorize count stayed 1 with the same body `{ "cardholder": "Asha Kumar", "cardNumber": "4242424242424242", "total": 106.92 }`.
