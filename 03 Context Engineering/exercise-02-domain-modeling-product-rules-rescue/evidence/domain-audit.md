# Domain audit

Preparation used the Domain Modeling skill to separate current policy language from overloaded `account` terms. `CONTEXT.md` and `docs/adr/0001-ai-history-export.md` were written from current sources before the second implementation session.

## Current Rules Retained

| Rule | Authoritative source and line | Domain term or ADR decision |
|---|---|---|
| Billing customer pays for workspaces; owner manages billing only | `docs/current-access-policy.md` lines 11–12 | Billing customer vs workspace |
| Workspace is the product and data-security boundary | `docs/current-access-policy.md` line 12 | Workspace |
| Membership links one user to one workspace | `docs/current-access-policy.md` line 13 | Membership |
| Role applies only inside that workspace | `docs/current-access-policy.md` line 14 | Role |
| Export requires Enterprise plan | `docs/current-access-policy.md` line 20 | Eligible workspace |
| Export requires standard data residency | `docs/current-access-policy.md` line 21 | Data residency |
| Membership must belong to the requesting user and the same workspace, be active, and be admin | `docs/current-access-policy.md` lines 22–25 | Authorized administrator |
| Billing-customer ownership does not grant workspace access | `docs/current-access-policy.md` lines 27–28 | ADR rejected billing-owner export |

## Legacy or Unsupported Assumptions Excluded

| Assumption | Source | Current evidence that rejects it |
|---|---|---|
| `account` means both billing customer and workspace | `docs/legacy-rollout-notes.md` lines 5–6 | `docs/current-access-policy.md` domain boundaries |
| Growth or Enterprise accounts are eligible | `docs/legacy-rollout-notes.md` line 7; `docs/previous-agent-progress.md` line 8 | Current policy requires Enterprise only |
| Account owner or admin role label is sufficient | `docs/legacy-rollout-notes.md` line 7; `docs/previous-agent-progress.md` line 9; `product-rules-app/src/services/aiHistoryExportPolicy.ts` seeded body | Current policy requires an active admin membership for the same user and workspace; `docs/support-example.md` blocks Rina on `ws-blue` and Mateo while suspended |
| Implementation is complete after a generic repository check | `docs/previous-agent-progress.md` lines 5, 10–12 | `scripts/run-product-rule-tests.mjs` still encodes the current authorization cases |

## Context Boundary

The final implementation agent received the production change and `CONTEXT.md` only. It may open files named in `CONTEXT.md`. The previous implementation and `evidence/before.patch` were not provided, given, or shared. The agent did not receive extra human explanation of the first attempt.
