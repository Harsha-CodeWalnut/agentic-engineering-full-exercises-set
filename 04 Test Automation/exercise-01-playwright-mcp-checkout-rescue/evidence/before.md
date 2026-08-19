# Before implementation

- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Other tools: file read/edit, shell
- Permissions: workspace write and command execution
- Time limit: 45 minutes
- Prompt: Replace the flaky checkout coverage with an independent test gate for approval, decline recovery, retry, and duplicate-submit protection. Verify the tax and authorization payloads without changing application behaviour.
- Attempt: 1
- Context source: repository inspection of the flaky spec, checkout contract, Vite API fixture, and previous test notes
- Playwright MCP: disabled
- Patch: `evidence/before.patch`
- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`

### Investigation and decisions

Reproduced `npm run test:e2e:reproduce` (exit code 1): 4 failed, 4 passed. Failures were `locator('.checkout-primary-0')` missing after the generated class rolled, and `Order confirmed` missing after a 500 ms wait plus a click on Pay while tax or shared `default` authorization state still raced.

Without Playwright MCP, the first attempt used repository inspection only. `vite.config.ts` sleeps 900 ms on tax and authorize, so tests waited 1200 ms with `waitForTimeout`. Locators moved to `getByRole` / `getByLabel`. Request bodies were collected with `page.on('request')` from the contract values. Isolation was not applied: every browser request still used the fixture `default` session, and duplicate-submit coverage clicked Pay twice without counting authorize requests.

### Verification

```text
npm run setup:check
exit code: 0
Node.js 22.23.2: ready
1 passed (starter-smoke)

npm run test:e2e:reproduce
exit code: 1
4 failed
4 passed
generated-class timeout and Order confirmed not visible

npx playwright test tests/e2e/flaky-checkout.spec.ts --workers=2
exit code: 1
1 failed
2 passed
decline/retry did not confirm after the third authorization on the shared default session
```

### Files changed

- `checkout-e2e-app/tests/e2e/flaky-checkout.spec.ts`
- Lines added and removed: `+37 / -6` in the test spec (see `evidence/before.patch`)
