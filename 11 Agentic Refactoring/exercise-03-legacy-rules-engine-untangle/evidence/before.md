# Before run

- Starting commit: `fb48d936ec2e6e205478614a4af4d2550662f650`
- Run base commit: `fb48d936ec2e6e205478614a4af4d2550662f650`
- Implementation commit: `d541cd19cf7f0cce821f8cc00b4721249c8f81e7`
- Agent and model: Codex (GPT-5), fresh session
- Tools and permissions: local filesystem, shell, `apply_patch`; workspace-write sandbox; no network
- Time limit: 10 minutes
- Human hints: 0
- Retries: 0
- Patch path: `evidence/before.patch`
- Patch SHA-256: `9cd9f2565a327ba496a3065370beaa78229bbd08028edd06029a9030a2cb6b2c`

The fixed run established the repository-free extraction shape and preserved lookup-before-validation, the exact Ready error, legacy unknown-status acceptance, zero rejection saves, and one acceptance save. The final publication patch applies the repository's reviewed style convention without changing behavior: implementation classes contain no comments or Javadocs.

Review found no exception-order differences, JSON differences, rejected-state mutations, or save-count differences. Files changed: `DecisionPolicy.java` and `WorkflowService.java`. Lines added: 37. Lines removed: 3. The publication commit contains the final source patch bound to this evidence.
