# After Run

- Starting commit: `fb48d936ec2e6e205478614a4af4d2550662f650`
- Run base commit: `4cd44d39da03ccda9ddf86abe60e57f4e22bf47a`
- Implementation commit: `84f0b656c43f6304d14235a3df4e5ed997cd48d2`
- Agent and model: `Codex GPT-5`
- Tools and permissions: `local repository read/write, shell execution, no human intervention`
- Time limit: `45 minutes`
- Human hints: 0
- Retries: 0
- Patch SHA-256: `09b2102aa9edad84dfdbacc97bd2e765f42322ff0f001d8d7f580a4f654e460f`
- Patch path: `evidence/after.patch`
- Checkout check: `node scripts/run-checkout-tests.mjs`
- Checkout check exit code: 0

The contract-backed implementation changed only `checkoutRouter.mjs` and `cardCheckout.mjs`, with 94 lines added and 2 removed from the participant-test base. Enabled card traffic called the new slice once and legacy zero times. Gift-card, invoice, unknown, and flag-off traffic called legacy once and the new slice zero times.

An explicit `{ authorizationCreated: false }` failure called the new slice once and legacy once. Completed, missing, malformed, ambiguous, and primitive failures called the new slice once and legacy zero times, returning either a complete supplied result or `PAYMENT_STATE_UNKNOWN`. This removes duplicate-authorization risk while preserving the public checkout contract.
