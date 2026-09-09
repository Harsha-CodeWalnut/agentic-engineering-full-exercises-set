# Before and After Comparison

## Same conditions

Both runs start from commit `e83928ed3c4d34fd51039c65b3d86373687cb259`, use Codex (GPT-5), the same 60-minute limit, zero human hints, zero agent retries, identical local tools and permissions, and the protected pack identified by SHA-256 `a854cf95252f93d1338ed1223ab6d9ae926c4d812a6951b18f5856c4a62ebe9e`. Every eligible route is represented by three fixed response-bound observations, so model output variance cannot change between runs.

## Before

The baseline always selects reasoning. Across the six executable benchmark cases, expected cost is USD 0.1001933333 and expected latency is 15,899 ms after including the paired retry caused by one unsafe reasoning observation. It has no clarification behavior, so missing-risk and high-ambiguity work would be executed instead of stopped. The reasoning observations have no quality-floor misses, but the selected baseline contains one safety failure.

## After

The field router selects fast for two low-risk mechanical cases, balanced for two medium-risk three-file cases, reasoning for two high-risk cross-boundary cases, and clarify for two unknown or highly ambiguous cases. Four first calls fall below their quality floor and each receives exactly one priced escalation. Expected cost is USD 0.048863 and expected latency is 11,520 ms. Every selected route has zero safety failures, every executable case mean meets its quality floor, and observed per-case quality ranges remain explicit in the scorecard rather than being hidden by a global average.

## Proof

All 36 response hashes, token counts, latency values, quality scores, and safety outcomes match the protected offline pack. Call costs reconcile to protected per-million-token prices. The generated scorecard reports route, quality, safety, completeness, and savings gates as true. Expected cost is 51.2312861801 percent below the all-reasoning baseline, exceeding the required 25 percent threshold. Total expected latency is 4,379 ms lower, a 27.54 percent reduction, while single-retry escalation economics are retained.

## Conclusion

Adopt the field-based router. The After policy is cheaper and faster under the same deterministic conditions, handles ambiguity safely, preserves reasoning for high-risk work, and passes every protected adoption gate. The decision is limited to this benchmark: production rollout should continue to monitor task mix, quality variance, retry rate, latency, and safety outcomes.
