# Rollback plan

If the extraction causes a production regression, revert the focused refactor commit `87ef36805896671fb12b5fe7577536dc7588fe4b`. That revert removes `DecisionPolicy` and restores the Ready rule directly inside `WorkflowService`; it does not remove the preceding characterization commit, so the contract test and `contract-before.json` remain available while the issue is investigated.

After the revert, run the participant characterization test, the complete Maven suite, HTTP JSON checks, and the React client contract. Confirm that repository lookup still precedes validation, rejected decisions do not mutate stored state, rejection performs zero saves, and accepted decisions perform exactly one save. Compare the new observation with both contract snapshots and retain the exact exception messages.

The rollback should remain limited to the two production files. Do not revert protected fixtures, verification scripts, or evidence to conceal a mismatch. A later retry should be a new focused commit so reviewers can distinguish the rollback from the corrected `DecisionPolicy` and `WorkflowService` boundary.
