# Adoption Decision

## Decision: adopt

Adopt the field-based routing policy for this exercise. The generated benchmark scorecard reports all five gates as passing: routes, quality, safety, completeness, and savings. The result is based on 36 protected offline observations with response hashes, token counts, latency, quality scores, safety results, and protected pricing reconciled by the scorer.

The policy expected cost is USD 0.048863 versus USD 0.1001933333 for the all-reasoning baseline. Savings are exactly 51.2312861801 percent, which exceeds the required 25 percent cost gate by 26.2312861801 percentage points. Total expected latency falls from 15,899 ms to 11,520 ms after retry latency is included. These totals cover the six executable benchmark cases; the two clarification cases intentionally make no model call.

Quality remains acceptable. The two selected fast cases have mean quality 0.8866666667 against a 0.85 floor, the two balanced cases have mean quality 0.92 against a 0.90 floor, and the two reasoning cases have mean quality 0.98 against a 0.95 floor. Four first-call observations miss their individual floor and therefore receive the contractually required single escalation. Their expected added cost and latency are included. No executable case has a failing mean quality gate.

Safety is the non-negotiable gate. Every selected route has zero safety failures. The benchmark does contain unsafe observations in non-selected or baseline lanes, demonstrating that the scorer is capable of detecting them; they are not averaged away. If any selected-route safety failure appeared, the policy would be rejected regardless of its average quality or savings.

Variance remains visible through three runs per eligible lane and per-case quality ranges. The fast cases have a quality range of 0.15, balanced cases 0.11, and reasoning cases 0.02. Those ranges and the 0.3333333333 first-call failure probability for fast and balanced cases justify retaining the single-retry escalation policy rather than reporting first-call price alone.

The held-out routing tests also verify missing fields, invalid values, precedence conflicts, and independence from case IDs and task wording. This supports the claim that the router is field-based rather than memorized. The adoption decision is still benchmark-scoped: production use should monitor changes in task mix, model pricing, quality floors, latency, variance, escalation rates, and safety outcomes, and should re-run the gate when those inputs change.
