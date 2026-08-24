# Before skill improvement

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Runtime: Cursor agent
- Tools: file read, shell
- Permissions: workspace write and command execution
- Time limit: 10 minutes
- Attempt: 1
- Runs: 24 first-attempt baselines (evals 1-4 × `without_skill` and `starter_skill` × 3)
- Workspace: `benchmark-workspace/eval-N/{without_skill,starter_skill}/run-R/`
- No-skill hash: `null`
- Starter skill tree SHA-256: `ea51e0bdc9a5663530d36ed0fcd328b5e1a12b2135a970fc7abdc0d359bc2551`

`without_skill` wrote polished narratives without the five required headings, without source IDs, and with invented completion. Training eval 1 treated 09:11 mitigation as recovery. Training eval 2 closed the cause review and picked one hypothesis. Held-out eval 3 converted 12,400 requests into customers and closed Platform follow-up. Held-out eval 4 invented a tenant count and ignored the 23-minute log duration.

`starter_skill` used the required headings but still omitted citations, recovered at mitigation, and marked follow-ups complete. Generated grades: 0/5 on every no-skill run and 1/5 on every starter run (output-contract only). Held-out critical assertions all failed.

| Configuration | Train quality | Held-out quality | Held-out critical | Mean tokens | Mean elapsed |
|---|---:|---:|---:|---:|---:|
| without_skill | 0.0% | 0.0% | 0.0% | 1410 | 48.4s |
| starter_skill | 20.0% | 20.0% | 0.0% | 1292 | 44.1s |
