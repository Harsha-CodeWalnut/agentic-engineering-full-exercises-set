# After implementation

### Run

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Implementation commit: `a7cc304142d50e3f23bea5b72b82f3b21c56889b`
- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Tools: file read/edit, shell
- Permissions: workspace write and command execution
- Time limit: 30 minutes
- Attempt: 1
- Human hints: 0
- Prompt: Correct recognized-revenue totals in the dashboard and scheduled snapshot. Use the current metric rules and billing-account boundaries, preserve gross-volume behaviour, and reject events without a valid account mapping.
- Context source: Graphify graph
- Graphify: Enabled
- Patch: `evidence/after.patch`

### Results

| Proof | Result |
|---|---|
| `npm run test:billing` | Pass; exit code: 0 |
| `npm run test:graph` | Pass; exit code: 0 |
| `npm run agent:check` | Pass; exit code: 0 |
| Graph questions answered correctly | 6 out of 6 |
| Files opened | 14 |
| Wrong or stale sources used | 0 |
| Unsupported assumptions | 0 |
| Files changed | 1 |
| Lines added and removed | `+9 / -6` |

GQ-01 through GQ-06 were answered from `graphify query`, `graphify path`, and `graphify explain` before source inspection. The INFERRED `publishRevenueSnapshot --owns_formula--> recognizedRevenueByAccount` edge was source-verified against `publishRevenueSnapshot.ts` and discarded. The first attempt grouped net recognized revenue by billing account and left gross volume unchanged.
