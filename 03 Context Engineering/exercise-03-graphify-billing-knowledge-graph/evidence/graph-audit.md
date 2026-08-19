# Graph audit

Graph-first boundary: the first graph command was `graphify extract . --code-only --force` then `graphify query "recognized revenue formula billing account mapping"`. Those graph queries ran before opening source files for the after implementation. INFERRED and AMBIGUOUS edges were treated as leads and source-verified.

## Current Sources Retained

| Rule or ownership fact | Source path and line | Graph node or edge |
|---|---|---|
| Charge is gross minus credits; refund is negative gross | `docs/current-metric-contract.md` lines 9–10 | `recognizedRevenueByAccount()` governed_by `current-metric-contract.md` |
| Totals group by billing account | `docs/current-metric-contract.md` line 11 | `resolveBillingAccountId()` governed_by contract |
| Missing mapping is an error | `docs/current-metric-contract.md` lines 12–13 | EXTRACTED `calls` to `resolveBillingAccountId()` |
| Gross volume unchanged | `docs/current-metric-contract.md` line 14 | `grossVolumeByAccount()` preserved_by contract |
| Dashboard and snapshot share the summary | `docs/current-metric-contract.md` line 15 | EXTRACTED paths through `buildRevenueSummary()` |
| Billing Platform owns the formula | `docs/service-ownership.md` line 7 | `recognizedRevenueByAccount()` owned_by `service-ownership.md` |
| Support Analytics and Finance Operations consume | `docs/service-ownership.md` lines 9–10 | dashboard and snapshot consumed_by ownership doc |

## Stale or Unsupported Claims Excluded

| Claim | Source | Current evidence that rejects it |
|---|---|---|
| Group revenue by tenant; treat every event as positive gross | `docs/legacy-finance-metrics.md` | `docs/current-metric-contract.md` nets credits/refunds by billing account |
| Support Analytics owns calculation changes | `docs/legacy-finance-metrics.md`; `docs/previous-agent-progress.md` | `docs/service-ownership.md` assigns the formula to Billing Platform |
| `publishRevenueSnapshot` owns the revenue formula | `docs/graph-extract.md` line 9 (INFERRED) | Snapshot source-verified as a consumer of `buildRevenueSummary` |
| `finance-metrics.md` defines recognized revenue | `docs/graph-extract.md` | Current authority is `docs/current-metric-contract.md` |
| Implementation is complete after a generic check | `docs/previous-agent-progress.md` | Seeded `recognizedRevenue.ts` still groups by tenant and sums grossAmount |

## Graph-First Boundary

First graph command: `graphify query "recognized revenue formula billing account mapping" --graph graphify-out/graph.json`. First source-file read for the after session occurred after that query. The after agent queried the graph before opening, reading, or inspecting source for the implementation.
