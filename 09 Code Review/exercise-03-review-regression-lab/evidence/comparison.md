# Before and After Comparison

## Same conditions

The Before and After lanes used the same `codex-cli` agent, `gpt-5.6-luna` model, repository-read tools, sandbox-read-only permissions, ten-minute limit, protected runner, canonical prompts, protected diffs, and adapter SHA-256. Each case ran in a fresh session with a unique runner nonce. Human hints and model retries were both zero. The only intentional difference was whether the runner exposed the committed regression-review skill.

| Lane | Historical coverage | Security coverage | Precision | Clean control | Unsupported blockers |
|---|---:|---:|---:|---:|---:|
| Before | 100% | 100% | 100% | approved | 0 |
| After | 100% | 100% | 100% | approved | 0 |

## Analysis

The baseline already reached the measurement ceiling: it found all five historical rule violations and both security violations while approving the conforming control. The skill-assisted lane retained that full coverage and precision. There was therefore no numerical recall lift to claim, but there was also no regression, duplicate blocker, or clean-control cost.

The reusable skill adds an explicit workflow for tracing changed decisions and trust boundaries, reproducing behavior, selecting an exact added-line code anchor, mapping one blocker to one violated rule, and dismissing unsupported suspicions. Those properties make the review method more reproducible on an unseen diff even though this particular model solved all protected cases without it.

## Proof

The six run JSON files link to the runner-generated prompts and nonce-bound transcripts. `evidence/scorecard.json` is regenerated from those artifacts. `evidence/before.patch` exactly represents the no-skill implementation commit, and `evidence/after.patch` exactly represents the skill implementation commit, both from the same starting commit.

## Conclusion

Adopt the skill. Every protected gate passes: historical coverage 100%, security coverage 100%, precision 100%, clean control approved, and no regression. The conclusion follows the generated scorecard while explicitly acknowledging the ceiling-level baseline.
