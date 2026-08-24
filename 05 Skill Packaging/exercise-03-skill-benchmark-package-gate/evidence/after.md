# After skill improvement

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Runtime: Cursor agent
- Tools: file read, shell
- Permissions: workspace write and command execution
- Time limit: 10 minutes
- Attempt: 1
- Runs: 12 first-attempt `with_skill` reports (evals 1-4 × 3)
- Workspace: `benchmark-workspace/eval-N/with_skill/run-R/`
- Candidate skill tree SHA-256: `bde565ae8d3a6dc325650315ebae484ae8df32b00123c34a966dfc31ed0e4cf9`
- Benchmark: `evidence/benchmark.json` SHA-256 `cca016f67eda41776ae32474225b36660dbe9a2bea49f65cbe2ed9c0752162b3`

Only `skills/incident-summary/SKILL.md` changed. Protected evals, graders, and the React dashboard were not edited. The improved skill requires source citations, separates facts from inference, records recovery at the final healthy signal, and keeps follow-ups in their recorded state.

Generated grades: 5/5 on every `with_skill` run, including all critical held-out assertions (`c-facts`, `c-timeline`, `d-conflict`, `d-impact`).

| Configuration | Train quality | Held-out quality | Held-out critical | Held-out variance | Mean tokens | Mean elapsed |
|---|---:|---:|---:|---:|---:|---:|
| with_skill | 100.0% | 100.0% | 100.0% | 0.0% | 982 | 31.8s |
