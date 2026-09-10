# Sequence diagram contract

Submit one Mermaid `sequenceDiagram` at `diagrams/access-sequence.mmd`.

Generate it with Design Doc Mermaid and preserve the skill invocation and raw session evidence described in [setup.md](./setup.md). Submit plain Mermaid text, not an image or XML/JSON renamed to `.mmd`. A rendered preview helps review but does not replace the source file.

Use these participant aliases for automated checks: Employee, Application, Manager, PolicyEngine, Security, DataOwner, IdentityProvider and IdentityAdmin. Choose readable display names and interaction labels from your investigation.

Use `alt High risk` / `else Normal risk` and `alt Provisioning successful` / `else Provisioning failed` to distinguish the required paths. Show who acknowledges completion of rollback. These are the scenario boundaries, not an ordered list of the solution's interactions.

Trace each relationship in `evidence/source-audit.json` using actual source lines and exact diagram excerpts. No state diagram or separate failure diagram is required. Record contradictions, including differences between displayed UI progress and the workflow engine, without changing the source.

Reviewers check ordering, branch placement and unsupported interactions as well as the parser result. An automated source citation confirms the cited text exists, not that the learner interpreted it correctly.
