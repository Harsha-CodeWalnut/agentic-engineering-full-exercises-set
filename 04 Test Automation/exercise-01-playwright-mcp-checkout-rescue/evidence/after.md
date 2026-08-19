# After implementation

- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Other tools: file read/edit, shell
- Permissions: workspace write and command execution
- Time limit: 45 minutes
- Prompt: Replace the flaky checkout coverage with an independent test gate for approval, decline recovery, retry, and duplicate-submit protection. Verify the tax and authorization payloads without changing application behaviour.
- Attempt: 1
- Context source: live Playwright MCP evidence (`browser_snapshot`, `browser_network_requests`, `browser_network_request` on http://127.0.0.1:5173)
- Playwright MCP: enabled
- Patch: `evidence/after.patch`
- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`

### Investigation and decisions

Live snapshots on `http://127.0.0.1:5173` showed `Calculating...` and a disabled `Pay $99.00` button before tax, then an enabled `Pay $106.92` button. Tax POST body was `{ "country": "IN", "subtotal": 99 }`. Authorize POST body was `{ "cardholder": "Asha Kumar", "cardNumber": "4242424242424242", "total": 106.92 }` on approval and the `0000` card on decline. Duplicate submit produced one authorize request. Tests therefore use unique `x-checkout-session` headers, reset that session, user-facing locators, disabled/enabled Pay readiness, and `waitForRequest` payload checks. The flaky spec was removed so fixed waits and generated-class selectors are gone.

### Verification

```text
npm run test:smoke
exit code: 0
1 passed

npm run test:e2e:reproduce
exit code: 1
(recorded on the starting flaky spec before repair)
4 failed
4 passed

npx playwright test tests/e2e/checkout-gate.spec.ts --repeat-each=20 --workers=2
exit code: 0
80 passed (2.0m)

npm run agent:check
exit code: 0
Verified 20 protected challenge inputs.
lint-check passed
agent-check passed for Playwright MCP Checkout Rescue
format-check passed
typecheck and build passed

npm run test:checkout
exit code: 0
Checkout verification passed: 1 repaired spec files, comparable first attempts, complete MCP evidence, isolation, repeat proof, and trace.
```

### Files changed

- Removed `checkout-e2e-app/tests/e2e/flaky-checkout.spec.ts`
- Added `checkout-e2e-app/tests/e2e/checkout-gate.spec.ts`
- Lines added and removed: `+72 / -15` (see `evidence/after.patch`)
- Evidence pack under `evidence/`
