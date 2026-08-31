# Comparison

Both attempts used starting commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5` as the PR base, the same agent and model, the same tools and permissions, a 45-minute time limit, and a genuine first attempt with zero human hints. The variable is the authority: legacy description versus implemented `nextStepFor` plus protected traces.

## Edge accuracy

The document-led state diagram copied the legacy skip from manager approval to data-owner review. It had 1 unsupported edge (`failed_provisioning --> provisioning` automatic retry) and 5 missing required paths (WF-03, WF-05, WF-09, WF-10, and `rolled_back --> [*]`).

The source-led diagrams contain WF-01 through WF-10 exactly once on the required files, with `high risk`, `normal risk`, `healthy`, and `unhealthy` labels. Unsupported edge count is 0. Missing paths: none.

## Actor coverage

Before: Employee, Application, Manager, DataOwner, IdentityProvider. Missing PolicyEngine, Security, and IdentityAdmin. No `alt High risk` / `else Normal risk`.

After: approval sequence includes PolicyEngine and Security; failure sequence includes IdentityAdmin removing partial access and completing rolled back.

## Contradictions

Before treated LEG-01 through LEG-04 as facts. After records five contradictions (LEG-01, LEG-02, LEG-03, LEG-04, CODE-01) and does not copy them into the diagrams.

## Verification

Before: Mermaid parser passed; semantic verifier failed (exit 1) on missing routes, the retry edge, missing actors, and missing EDGE markers.

After: scenario trace PASS for normal, highRisk, and failure; Mermaid parser PASS. Semantic verifier and submission checks bind the source-led branch to source SHA `6a34ba70d5a6212cde6d4c73aacebc755fa2214d`.

## Final coverage

Source-led reconstruction is the submission. Document-led artifacts remain in `evidence/before.md` and `evidence/before.patch` as the comparison baseline. Final coverage is ten source-mapped edges, three parsed diagrams, and five recorded contradictions.
