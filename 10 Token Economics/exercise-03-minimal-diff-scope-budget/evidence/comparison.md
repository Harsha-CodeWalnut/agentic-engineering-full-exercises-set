# Before and After comparison

## Same conditions

Two fresh subagents used the same inherited model, local shell and apply_patch tools, isolated worktrees, permissions, 30-minute limit, production request, and test-first instruction. Neither received corrections or a second attempt. Both started from e134b7e7b3163db395144bfb163a06d24ad06507. The budgeted agent additionally received the committed scope plan; that is the intended intervention. Repository exercise documentation was available to both agents, so the baseline was prompt-unconstrained rather than blinded to the documented exercise contract.

## Before

The unbudgeted first attempt changed 2 files with 12 additions and 1 deletion: 13 changed lines. It migrated export, corrected the helper comment, and added a focused regression test. It did not perform unnecessary shared cleanup. Protected helper and consumer checks passed.

## After

The planned first attempt also changed 2 source files with 12 additions and 1 deletion: 13 changed lines. It remained within the declared maximum of 30 and needed no above-20-line justification. The learner test also covers null and undefined fallback inputs. Checkout, delete, and unknown behavior remain unchanged.

## Proof

before-scope.json records the baseline patch numstat and the protected replay command reapplies it at the starting commit. scope-budget.json records source-commit counts, and the history verifier proves that the plan precedes source and later commits contain evidence only. after.patch contains the plan and source changes from the common starting point; its document lines are not counted as implementation lines.

## Conclusion

Both attempts used the same source scope: the measured difference is zero files and zero changed lines. This comparison proves adherence to a predeclared budget, not a reduction in source diff size or API spending. No token telemetry was collected. A scope plan can make review boundaries explicit, but this single comparison does not establish a cost saving. The implementation is accepted on correct behavior, bounded scope, and reproducible verification.
