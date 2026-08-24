# Incident Summary Skill Benchmark

Candidate skill SHA-256: `bde565ae8d3a6dc325650315ebae484ae8df32b00123c34a966dfc31ed0e4cf9`

| Configuration | Train quality | Held-out quality | Held-out critical | Held-out variance | Mean tokens | Mean elapsed |
|---|---:|---:|---:|---:|---:|---:|
| without_skill | 0.0% | 0.0% | 0.0% | 0.0% | 1410 | 48.4s |
| starter_skill | 20.0% | 20.0% | 0.0% | 0.0% | 1292 | 44.1s |
| with_skill | 100.0% | 100.0% | 100.0% | 0.0% | 982 | 31.8s |

## Package gate: PASS

Mode: quality-improvement; comparison baseline: starter_skill

- PASS train-quality: 1.000 (>= 0.875)
- PASS held-out-quality: 1.000 (>= 0.875)
- PASS held-out-critical: 1.000 (= 1.0)
- PASS improve-over-no-skill: 1.000 (>= 0.10)
- PASS improve-over-starter: 0.800 (>= 0.10)
- PASS held-out-variance: 0.000 (<= 0.16)
- PASS token-cost: 0.697 (<= 1.50x no-skill)
- PASS elapsed-cost: 0.658 (<= 2.00x no-skill)
