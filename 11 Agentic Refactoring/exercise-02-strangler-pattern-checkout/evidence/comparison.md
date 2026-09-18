# Controlled Comparison

## Same conditions

Both attempts started from `fb48d936ec2e6e205478614a4af4d2550662f650`, used Codex GPT-5 with the same local repository and shell permissions, had a 45-minute limit, received zero human hints, and had zero retries. Each patch is the exact Git diff from its recorded run base to its implementation commit.

## Before

The unconstrained extraction routed enabled card requests into a new slice and preserved ordinary payment results. Its catch-all fallback treated every thrown value as safe. An uncertain or completed authorization therefore produced one new-slice call followed by one legacy call, creating duplicate-authorization risk.

## After

The contract-backed extraction routes only enabled card requests to the new slice. Gift-card, invoice, unknown, and flag-off requests remain legacy. Safe fallback requires the exact object field `authorizationCreated: false`; all other failures avoid legacy and return a complete public result.

## Proof

`checkoutRouter.test.mjs` fails on the all-legacy characterization commit and passes unchanged on the immediately following source commit. It checks enabled card routing, compatibility routes, flag-off behavior, explicit pre-authorization fallback, completed authorization, ambiguous objects, malformed results, and primitive failures. The protected suite independently compares approved and declined card results and executes 11 route checks with exact call counts.

## Conclusion

The after route is safer because fallback depends on positive evidence that no authorization exists. It preserves the existing contract and rollback path while preventing a second authorization when gateway state is uncertain.
