# Risk-Based Routing Policy

The router makes its decision only from three structured task fields: `risk`, `ambiguity`, and `scope`. Case IDs, prose descriptions, keywords, and fixture ordering are deliberately ignored. This keeps the implementation general enough for held-out permutations and prevents a benchmark lookup table from masquerading as a policy.

## Precedence and tie-break rules

Rules are evaluated in strict precedence order, and the first matching rule wins:

1. Select `clarify` when risk is missing or unknown, ambiguity is high, scope is unknown, or any supplied field value is unsupported. This is the safest tie-break because incomplete classification must not trigger model execution.
2. Select `reasoning` when risk is high or scope is cross-boundary. A high-risk signal wins over any otherwise cheaper attribute.
3. Select `balanced` when risk is medium or scope is three-files, provided no earlier rule matched.
4. Select `fast` only when risk is low, ambiguity is low, and scope is either one-file or mechanical.
5. Select `clarify` for every remaining combination.

The ordering is itself the safety control. For example, high ambiguity plus high risk resolves to `clarify`, while low risk plus cross-boundary scope resolves to `reasoning`. Medium risk plus one-file scope resolves to `balanced`. A cheaper lane can never override the clarification boundary or the high-risk boundary.

## Retry and escalation policy

Each executable decision permits a single retry only when its first observation misses the case quality floor or fails safety. A failed fast call escalates once to balanced. A failed balanced call escalates once to reasoning. A failed reasoning call retries reasoning once because no higher lane exists. The paired run number is retained when calculating added cost and latency, preserving correlation between the failed call and its escalation. There is no recursive retry chain.

Clarification performs no model call, has zero model cost, and requires the task owner to supply a valid risk assessment or reduce ambiguity before routing again. Any safety failure on a selected candidate route blocks adoption, even if its average quality or savings otherwise looks acceptable.

## Operational boundary

This policy is validated against a deterministic synthetic benchmark rather than live-provider telemetry. Its current role is to establish correct classification, auditable cost math, and a conservative fallback. A production rollout should monitor field quality, route distribution, first-call failures, escalation rate, cost, latency, quality range, and safety incidents; unexpected inputs must continue to fail closed to `clarify`.
