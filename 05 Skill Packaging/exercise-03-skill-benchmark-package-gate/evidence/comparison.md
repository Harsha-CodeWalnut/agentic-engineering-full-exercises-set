# Comparison

All 36 first-attempt runs used the same agent, model, runtime, tools, permissions, repository commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5`, 10-minute time limit, and attempt 1. Only the incident-summary skill tree changed between the starter and candidate lanes.

| Configuration | Train quality | Held-out quality | Held-out critical | Held-out variance | Mean tokens | Mean elapsed |
|---|---:|---:|---:|---:|---:|---:|
| without_skill | 0.0% | 0.0% | 0.0% | 0.0% | 1410 | 48.4s |
| starter_skill | 20.0% | 20.0% | 0.0% | 0.0% | 1292 | 44.1s |
| with_skill | 100.0% | 100.0% | 100.0% | 0.0% | 982 | 31.8s |

Gate mode: quality-improvement. Comparison baseline: starter_skill.

- Held-out quality improved by 1.00 versus no-skill and 0.80 versus starter (required >= 0.10).
- Held-out critical pass rate is 1.00.
- Candidate tokens are 0.697x no-skill; elapsed time is 0.658x no-skill.

Packaging is allowed. Decision: package the evaluated `incident-summary` tree `bde565ae8d3a6dc325650315ebae484ae8df32b00123c34a966dfc31ed0e4cf9`.
