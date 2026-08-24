# Comparison

Both result sets used the same provider, agent, model, runtime, settings, repository commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5`, and protected prompts. The comparison is fair because only the `change-review` description changed.

| Metric | Before | After |
|---|---|---|
| Train majority accuracy | 6/12 (0.50) | 12/12 (1.00) |
| Held-out majority accuracy | 4/8 (0.50) | 8/8 (1.00) |
| Train precision | 0.50 | 1.00 |
| Train recall | 1.00 | 1.00 |
| Train specificity | 0.00 | 1.00 |
| Held-out precision | 0.50 | 1.00 |
| Held-out recall | 1.00 | 1.00 |
| Held-out specificity | 0.00 | 1.00 |
| Unanimous decision rate | 1.00 | 1.00 |
| Train false-positive IDs | train-release, train-incident, train-implementation, train-debugging, train-pr-summary, train-review-advice | none |
| Train false-negative IDs | none | none |
| Held-out false-positive IDs | held-release-paraphrase, held-design-review, held-diff-summary, held-compound | none |
| Held-out false-negative IDs | none | none |

Adoption: adopt the new description. Held-out majority accuracy improved from 0.50 to 1.00, held-out recall and specificity are each 1.00, training accuracy is 12/12, and after decisions are unanimous. The original description over-triggered on neighboring workflows; the repaired boundary keeps evidence-backed code review and abstains elsewhere.
