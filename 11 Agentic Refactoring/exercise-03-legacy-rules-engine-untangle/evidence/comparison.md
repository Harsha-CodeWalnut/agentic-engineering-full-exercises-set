# Same conditions

Both runs start from `fb48d936ec2e6e205478614a4af4d2550662f650`, use the same extraction request, two-file production scope, local tools and permissions, ten-minute limit, zero agent retries, and zero hints during the run. The After base additionally contains the committed participant characterization test and before-contract snapshot.

# Before

The unconstrained source patch extracts a repository-free `DecisionPolicy` while keeping lookup, construction, and persistence in `WorkflowService`. Its patch hash is `9cd9f2565a327ba496a3065370beaa78229bbd08028edd06029a9030a2cb6b2c`. The publication source follows the reviewed no-comments convention.

# After

The characterized source patch is behaviorally and textually identical to the Before production patch. Its patch hash is `9cd9f2565a327ba496a3065370beaa78229bbd08028edd06029a9030a2cb6b2c`. The participant tests are committed first and use `given_when_then` names to make each observed contract readable.

# Proof

`contract-before.json` and `contract-after.json` are byte-identical and match every protected observation. Both patches change only `DecisionPolicy.java` and `WorkflowService.java`. The after history directly orders the characterization commit before the focused refactor commit. Source inspection confirms the implementation package contains no comments, `DecisionPolicy` contains no persistence access, and `WorkflowService` performs lookup first, delegates validation once, constructs the response with unchanged stable fields, and saves once only after acceptance. Final backend, HTTP JSON, client, history, integrity, lint, format, typecheck, build, and clean-verification results are captured in `commands/rules-verify.txt`.

# Conclusion

Both source outcomes reach the same behavioral ceiling, while the After path adds pre-committed contract protection and focused history. The result separates pure validation from orchestration without changing exception order or text, HTTP fields, client behavior, rejected-state mutation, save counts, or the legacy unknown-status gap. Test naming and comment-free implementation conventions are explicit in the final submission.
