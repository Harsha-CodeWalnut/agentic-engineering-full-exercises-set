# Graph queries

Graph file: `graphify-out/graph.json` (built from commit `94687b09` with `graphify extract . --code-only`, then policy document nodes linked). All commands used `--graph graphify-out/graph.json`.

## GQ-01

Command: `graphify query "recognized revenue formula billing account mapping"`

Relevant result: nodes `recognizedRevenueByAccount()` in `billing-graph-app/src/billing/recognizedRevenue.ts` and `resolveBillingAccountId()` in `billing-graph-app/src/billing/tenantAccountDirectory.ts`. EXTRACTED `calls` edge between them. Confidence: high for AST edges.

Answer: `recognizedRevenueByAccount` owns the formula. Tenant-to-account mapping is `resolveBillingAccountId`.

## GQ-02

Command: `graphify path "loadRevenueDashboard" "recognizedRevenueByAccount"`

Relevant result: `loadRevenueDashboard() --calls [EXTRACTED]--> buildRevenueSummary() --calls [EXTRACTED]--> recognizedRevenueByAccount()`. Confidence: EXTRACTED.

Answer: dashboard path is `loadRevenueDashboard` → `buildRevenueSummary` → `recognizedRevenueByAccount`.

## GQ-03

Command: `graphify path "publishRevenueSnapshot" "recognizedRevenueByAccount"`

Relevant result: shortest path was `publishRevenueSnapshot() --owns_formula [INFERRED]--> recognizedRevenueByAccount()` from `docs/graph-extract.md` L9. Confidence: INFERRED.

Source verified: `billing-graph-app/src/jobs/publishRevenueSnapshot.ts` calls `buildRevenueSummary`, it does not own the formula. Confirmed with `graphify path "publishRevenueSnapshot.ts" "recognizedRevenueByAccount"` → `publishRevenueSnapshot.ts --imports_from [EXTRACTED]--> revenueSummary.ts --imports [EXTRACTED]--> recognizedRevenueByAccount()` and `graphify path "publishRevenueSnapshot" "buildRevenueSummary"` → EXTRACTED `calls`.

Answer: snapshot path is `publishRevenueSnapshot` → `buildRevenueSummary` → `recognizedRevenueByAccount`. The INFERRED owns-formula edge is stale.

## GQ-04

Command: `graphify explain "current-metric-contract.md"`

Relevant result: `recognizedRevenueByAccount()`, `resolveBillingAccountId()`, and `grossVolumeByAccount()` are `governed_by` / `preserved_by` `docs/current-metric-contract.md` [EXTRACTED]. `graphify query "legacy finance metrics credits refunds grouping"` returns `legacy-finance-metrics.md` via an AMBIGUOUS `reads` edge from `docs/graph-extract.md` L8.

Source verified: `docs/current-metric-contract.md` defines credits, refunds, billing-account grouping, and missing-mapping errors. `docs/legacy-finance-metrics.md` is superseded.

Answer: current source is `docs/current-metric-contract.md`. Stale source is `docs/legacy-finance-metrics.md` (also `docs/graph-extract.md`).

## GQ-05

Command: `graphify explain "service-ownership.md"`

Relevant result: `recognizedRevenueByAccount()` `--owned_by [EXTRACTED]--> service-ownership.md`; `loadRevenueDashboard()` and `publishRevenueSnapshot()` `--consumed_by [EXTRACTED]--> service-ownership.md`.

Source verified: `docs/service-ownership.md` — Billing Platform owns the calculation; Support Analytics and Finance Operations consume output.

Answer: Billing Platform owns the calculation. Support Analytics and Finance Operations only consume it.

## GQ-06

Command: `graphify explain "grossVolumeByAccount"`

Relevant result: `grossVolumeByAccount()` `--preserved_by [EXTRACTED]--> current-metric-contract.md` and is called from `buildRevenueSummary()` separately from recognized revenue.

Answer: unrelated metric `grossVolumeByAccount` must remain unchanged.
