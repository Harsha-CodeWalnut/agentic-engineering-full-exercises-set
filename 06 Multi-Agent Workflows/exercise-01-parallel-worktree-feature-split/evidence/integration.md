# Integration

## Lane review

Lane review compared each handoff to its Git commit. Lane A (`f627db342c598df040b86f94293d89a32ae66624`) changed only `FilterBar.tsx`, `filters.ts`, and `tests/lane-a/`. Lane B (`cf5703f04cc0be78d84d5a357958d22bac952f6d`) changed only `MetricStrip.tsx`, `scoring.ts`, and `tests/lane-b/`. Lane C (`4aa57dd3fc10119329352833297a5af52c9c5bfa`) changed only `EvidencePanel.tsx`, `workflowApi.ts`, and `tests/lane-c/`. Every focused command exited 0 before merge. No lane edited `src/types.ts`.

## Shared request

Lane A filed one shared request: promote `FilterPreset` to `src/types.ts`. Lane C filed one shared request: promote `EvidenceBundle` to `src/types.ts`. Lane B filed none. Both requests waited for the integration owner.

## Merge order

Merge order was B, A, C with `--no-ff` on `integration/parallel-features`:

1. `be2538d97e66173c12b36d74bd78bbd22c995e54` merged `lane/sla-risk`
2. `3fe66c993a056ff183f6104d4aad45a697c79785` merged `lane/saved-filters`
3. `effd61981cce976ff0463da99d4a8d8caeb6a54d` merged `lane/evidence-export`

Each merge kept the handed-off lane file content. Lanes were not squashed, rebased, or silently fixed during merge.

## Conflict

There was no textual merge conflict. The controlled conflict was ownership of shared types: A and C both needed new interfaces in a file neither owned. That conflict was recorded as shared requests and left unresolved until after Lane C merged.

## Shared-type

Commit `9a3f736fc8d5476aba1b3fabd854338d662fc0e0` follows the Lane C merge and changes only `src/types.ts`, `src/utils/filters.ts`, and `src/services/workflowApi.ts`. It exports both interfaces and replaces the temporary local definitions with imports. This commit is `product_head`.

## Final check

`npm run test:integrated` on the product head exited 0 (6 files, 9 tests). Output is `evidence/commands/integrated.txt`.

## Cleanup

`git worktree list --porcelain` was captured while the three lane worktrees were linked (`evidence/worktree-list-before.txt`). After product verification those linked worktrees were removed. The cleaned capture is `evidence/worktree-list-after.txt`.

## Risk

Remaining risk is none for the three required slices. Export JSON serializes the bundle in the click handler without a download side effect; protected tests only require the action to render when evidence exists.

## Rollback

Rollback order, newest first:

1. `git revert 9a3f736fc8d5476aba1b3fabd854338d662fc0e0` (shared-type)
2. `git revert -m 1 effd61981cce976ff0463da99d4a8d8caeb6a54d` (Lane C merge)
3. `git revert -m 1 3fe66c993a056ff183f6104d4aad45a697c79785` (Lane A merge)
4. `git revert -m 1 be2538d97e66173c12b36d74bd78bbd22c995e54` (Lane B merge)

A single lane can also be rolled back with the handoff command `git revert <lane commit SHA>` if it has not yet been merged.
