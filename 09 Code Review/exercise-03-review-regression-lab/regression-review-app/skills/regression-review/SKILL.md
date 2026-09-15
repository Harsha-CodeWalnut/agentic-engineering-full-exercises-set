---
name: regression-review
description: Review a proposed code change for reproducible regressions and actionable merge findings. Use when asked to review a diff, pull request, patch, or change for merge safety.
---

# Regression Review

Review the supplied change against its request and acceptance rules. Treat pre-change behavior as supporting contract evidence unless the request explicitly authorizes changing it.

## Establish the review surface

1. Read the complete request, every acceptance rule, and the exact diff before forming conclusions.
2. Identify each changed decision, transformation, state transition, and trust boundary. Trace its callers and downstream consumers when the supplied material makes that possible.
3. Compare old and new behavior for ordinary inputs and relevant boundaries. Check correctness, security, authorization, state recovery, error paths, accessibility, and regression risk only where they matter to this change.

## Prove or dismiss suspected regressions

For each suspicion, reproduce the failure with a concrete input or state and derive the result from the changed code. Confirm that it violates a supplied rule or established in-contract behavior. If the trigger depends on invalid data, exotic runtime behavior, or an unstated requirement, dismiss it as unsupported and do not make it a blocker.

Use the exact added line that causes the behavior as the code anchor. Do not add a file prefix, line number, context line, removed line, or nearby change to the anchor. Consolidate evidence for the same acceptance-rule violation into one blocker, choosing the clearest causal added line and describing related changes in its behavior or reproduction. Separate findings by violated rule so duplicate reports do not dilute precision.

Approve behavior-preserving changes. Differences in syntax, allocation strategy, style, tests, performance, or maintainability are not blockers unless they create a demonstrated contract, user, accessibility, or security failure.

## Report the decision

Request changes only when at least one supported blocking finding remains; otherwise approve. For every finding report:

- severity proportional to reachable impact;
- changed file and exact code anchor;
- the requirement or established behavior being violated;
- observed behavior and user or security impact;
- a minimal reproduction;
- a focused recommendation and verification advice;
- whether it blocks the merge.

Before finishing, map blockers one-to-one to the violated acceptance rules, remove unsupported or duplicate claims, and ensure the merge decision agrees with the remaining blockers.
