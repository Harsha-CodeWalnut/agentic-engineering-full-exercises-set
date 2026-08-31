# Verification

Source SHA: `6a34ba70d5a6212cde6d4c73aacebc755fa2214d`.

Mermaid parser: `npm run diagrams:parse` exited 0. All three files parsed (`access-state.mmd` as stateDiagram, both sequences as sequence). Output: `evidence/commands/diagram-parse.txt`.

Semantic verifier: `npm run diagrams:verify` is run as part of submission verification. Required states, routes, actors, condition labels, and `%% EDGE` markers must match the protected contract.

Scenario trace: `npm run workflow:trace` exited 0. Normal, highRisk, and failure traces match the implementation. Output: `evidence/commands/workflow-trace.txt`.

Unsupported edge: none in the source-led state diagram. The document-led attempt had one unsupported automatic-retry edge, recorded in `evidence/before.md`.

Five contradictions: LEG-01, LEG-02, LEG-03, LEG-04, and CODE-01 are recorded in `evidence/contradictions.md`.

Remaining ambiguity: `completedStagesByStatus` still marks `security-review` complete on the normal path that never entered it. Diagrams follow `nextStepFor`; the progress projection is documented rather than changed (App.tsx and workflow.tsx are protected).

Final conclusion: the three source-led diagrams are approved for submission. Every required edge maps to an exact `EDGE: WF-*` line in `workflow.tsx` at the source SHA.
