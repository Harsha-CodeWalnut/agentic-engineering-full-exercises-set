# Context decision

## Planned selection

The plan set a 2,000-byte maximum for the adapter and session tags. It required current mandatory context before any optional source, then relevant current sources by descending priority and stable ID. The planned set was repository-rules at 489 bytes and current-adapter-contract at 838 bytes, totaling 1327 bytes with 673 bytes remaining.

The plan left one open question: whether the refactor would require a change to validation or public error behavior. If that question became unresolved, the run would be expanded with the errors tag and current-error-contract. This explicit expansion rule avoided loading error guidance speculatively.

## Actual selection

The actual deterministic result matched the plan exactly. It selected the two planned sources and skipped every other catalog item with an auditable reason. The legacy migration notes were skipped as stale even though they carried higher priority than the current adapter contract. The current error contract, UI guide, and audit policy were skipped as irrelevant to the initial tags. Mandatory context was not missed, the maximum was not exceeded, and adapter and session tags were resolved.

The context was not expanded. The implementation preserved existing errors and validation order using the current source, existing adapter, and protected acceptance runner; no contract-change question arose.

## Verification and correctness

The selected-context patch passed the protected adapter acceptance contract and 8 learner tests with 0 failures. Typecheck also passed. The before patch passed the same protected contract and 6 learner tests. Patch replay provides comparable correctness evidence independent of the working tree. Selector tests cover exact budget totals, catalog-order determinism, stable ID tie-breaking, mandatory-first behavior, stale exclusion, question-driven expansion, duplicate IDs, impossible mandatory budgets, and selected/skipped reasons.

## Trade-off

The verified documentation reduction is 1,558 UTF-8 bytes, from 2,885 to 1327, or 54.0%. The trade-off is that an initially irrelevant source may require a later expansion when a concrete question appears. The ledger and unresolved tags make that decision visible. This is a byte-cost result for the protected document catalog, not a direct measurement of tokenizer usage, latency, or money.
