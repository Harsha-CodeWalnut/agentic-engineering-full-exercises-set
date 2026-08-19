# Allow AI-history export only for an active admin on an Enterprise workspace with standard data residency

Status: accepted

The product request asked for export by an authorized administrator on an eligible workspace without defining those terms. Current policy and a superseded draft both exist in the repository, and the seeded implementation mixed them.

## Decision

AI-history export is authorized only when every condition in `docs/current-access-policy.md` is true: the workspace plan is Enterprise, data residency is `standard`, and the requesting user has an active admin membership for the same workspace. Billing ownership is not a substitute for that membership.

## Sources

- Retained: `docs/current-access-policy.md` (approved Workspace Security policy).
- Rejected as current guidance: `docs/legacy-rollout-notes.md` (superseded draft that used `account` for both billing customer and workspace).
- Illustration only: `docs/support-example.md`.
- Not a completion signal: `docs/previous-agent-progress.md`.

## Rejected interpretations

- Treating a billing-customer owner as an authorized administrator.
- Treating Growth, or any plan other than Enterprise, as eligible.
- Treating an `admin` role label as enough without checking active status, the same user, and the same workspace.
- Ignoring data residency.

## Consequences

`canExportAIHistory` in `product-rules-app/src/services/aiHistoryExportPolicy.ts` must fail closed when membership is missing, suspended, scoped to another user, or scoped to another workspace. Regression coverage is `npm run test:rules`. Future agents should read `CONTEXT.md` before that policy file so overloaded `account` language is not revived.
