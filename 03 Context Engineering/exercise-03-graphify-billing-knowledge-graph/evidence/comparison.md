# Comparison

Both runs were fair: same starting commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5`, same agent, model, tools, permissions, 30-minute time limit, and the same incident prompt. Each implementation is a first attempt with zero human hints.

| Topic | Before (Graphify disabled) | After (graph-first) |
|---|---|---|
| Question accuracy | 6 / 6 from repository search | 6 / 6 from graph query, path, and explain |
| Files opened | 17 exercise files, including the incident dump and both stale metric docs | 14 exercise files named by the graph, plus source verification of one INFERRED edge |
| Wrong files | Opened `docs/legacy-finance-metrics.md`, `docs/previous-agent-progress.md`, and `incidents/REV-482.md` during discovery | Did not open those stale files for authority; opened `docs/graph-extract.md` only as a lead |
| Assumption | 0 unsupported assumptions; followed `docs/current-metric-contract.md` | 0 unsupported assumptions; discarded the INFERRED snapshot-owns-formula claim after source verification |
| Verification | `npm run test:billing` pass, exit 0 | `npm run test:billing`, `npm run test:graph`, and `npm run agent:check` all pass, exit 0 |
| Implementation | `recognizedRevenue.ts` only; `+4 / -4`; ternary helper | `recognizedRevenue.ts` only; `+9 / -6`; if/else helper with an explicit return type |

Graph-first context improved discovery: the after session skipped the incident dump and legacy finance notes, used Billing Platform ownership from the graph, and source-verified the stale extract before editing. Both first attempts produced a correct net-by-account formula, which `evidence/before.patch` and `evidence/after.patch` show as different implementations of the same rule. Gross volume was left unchanged in both patches.
