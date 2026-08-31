# Comparison

Both attempts used starting commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5` as the PR base, the same agent and model, the same tools and permissions, a 45-minute time limit, and a genuine first attempt with zero human hints. The variable is the authority: legacy brief versus incident plus implemented source and protected traces.

## Defect coverage

The brief-led attempt did not change `webhookReconciler.mjs`. Duplicate `evt_capture_1` still posted a second capture ledger row, and a signed unknown `gatewayReference` was recorded.

The source-led attempt rejects invalid signatures before state access, rejects unknown references without mutation, returns `already-handled` for a repeated event ID, and records the first valid event once.

## Relationship accuracy

Before: architecture skipped Orchestrator and drew checkout-to-gateway plus gateway-written ledger and receipt. State jumped from a valid signature to ledger-recorded. Sequence retried declined authorization and treated every signed capture as a new ledger write. EDGE markers: 0.

After: six implemented architecture dependencies, the twelve reconciliation transitions with no retry, approved and declined checkout plus first/duplicate webhook delivery, and eight data relationships. VIS-01 through VIS-16 appear once on each required diagram.

## Contradictions

Before treated BRIEF-01 through BRIEF-04 as facts. After records all four as rejected and omits them from the diagrams.

## Verification

Before: Mermaid parser passed; semantic verifier failed (exit 1); feature tests still failed on unknown references and duplicate capture.

After: payment trace PASS for approved, declined, first webhook, duplicate webhook, invalid signature, and unknown gateway reference. Mermaid parser PASS. Semantic verifier and submission checks bind the source-led branch to source SHA `95d8759b67a9aa87d8e5152f9208e51e85c43e36`.

## Final coverage

Source-led repair and diagrams are the submission. Brief-led artifacts remain in `evidence/before.md` and `evidence/before.patch` as the comparison baseline. Final coverage is sixteen source-mapped relationships, four parsed diagrams, and four recorded brief contradictions.
