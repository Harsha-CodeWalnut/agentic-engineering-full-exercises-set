# Comparison

Both runs were fair first attempts: same starting commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5`, same agent, model, other tools, permissions, 45-minute time limit, and the same checkout prompt. Playwright MCP was the only changed tool. The after branch does not contain the before test implementation.

| Topic | Before (Playwright MCP disabled) | After (live Playwright MCP evidence) |
|---|---|---|
| Failure diagnosis | Repository notes and `test:e2e:reproduce` (4 failed / 4 passed): generated class `.checkout-primary-0` and 500 ms waits | Live `browser_snapshot` showed Pay disabled during Calculating..., class names never used |
| Locator strategy | Mixed `getByRole` with leftover timeout-driven clicks | User-facing `getByRole` / `getByLabel` only (`Pay $106.92`, Card number) |
| Waiting strategy | `waitForTimeout(1200)` copied from the 900 ms fixture sleep | Web-first: `toBeDisabled`, `Calculating...`, then enabled `Pay $106.92` |
| Network | `page.on("request")` after goto; bodies sometimes recorded | `waitForRequest` on `/api/tax-quote` and `/api/payments/authorize` with contract bodies |
| Isolation | Shared fixture `default` session; decline/retry failed on the third authorize | `randomUUID` session, `setExtraHTTPHeaders`, per-test `/api/testing/reset` |
| Coverage | Approval, decline/retry, duplicate click; retry failed; duplicate did not count requests | Tax payload, authorization payload, approval, decline, retry, duplicate count of 1 |
| Repeated-run result | First-attempt suite 1 failed / 2 passed; original flake 4 failed / 4 passed | `npx playwright test tests/e2e/checkout-gate.spec.ts --repeat-each=20 --workers=2` → 80 passed, exit code 0 |
| Files changed | `flaky-checkout.spec.ts` rewritten in place (`evidence/before.patch`) | Removed `flaky-checkout.spec.ts`, added `checkout-gate.spec.ts` (`evidence/after.patch`) |

Live MCP evidence changed waiting, locators, network assertions, and isolation. That is why the after first attempt stayed green under parallel repeats while the before first attempt still leaked server state.
