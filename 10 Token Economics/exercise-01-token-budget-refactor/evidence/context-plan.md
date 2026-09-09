# Pre-change Context Plan

## Before implementation

The baseline run loads all six catalog sources. Their current total is 2,885 exact UTF-8 bytes. This supersedes the older estimate in `usage-log.md`. The full pack includes the stale migration note and current UI, audit-retention, and error guidance that the adapter refactor does not initially need. The optimized run uses the same request, agent, model, tools, permissions, time limit, first-attempt rule, and zero human hints.

## Maximum and selection rules

The maximum context budget is 2,000 bytes. The selector must choose mandatory current sources before optional sources. It then considers relevant current sources by descending priority and stable ID, making the result independent of catalog order. A source that does not fit is skipped; the total must never exceed the maximum.

`repository-rules` is mandatory and costs 489 bytes. `current-adapter-contract` is the current primary authority for the adapter and session tags and costs 838 bytes. The expected selection is 1,327 bytes with 673 remaining. The stale `legacy-migration-notes` must not be selected. The UI and audit guidance are irrelevant to this task.

## Open question and expansion

The open question is whether implementation reveals a need to change validation or public error behavior. The request is a behavior-preserving refactor, so the initial question tags are empty. If an unresolved error-contract question appears, add the `errors` question tag and expand with `current-error-contract`; that result remains within the maximum. Record any expansion instead of loading the source in advance.

The planned initial selection contains only `repository-rules` and `current-adapter-contract`. The final ledger must record actual selected and skipped sources, exact bytes, reasons, unresolved tags, and whether expansion occurred.
