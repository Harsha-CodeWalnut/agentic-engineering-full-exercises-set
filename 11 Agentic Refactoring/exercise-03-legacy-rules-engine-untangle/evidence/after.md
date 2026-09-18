# After run

- Starting commit: `fb48d936ec2e6e205478614a4af4d2550662f650`
- Run base commit: `ffe9d249ea133272c984f2ca021c208059202228`
- Implementation commit: `87ef36805896671fb12b5fe7577536dc7588fe4b`
- Agent and model: Codex (GPT-5), fresh session
- Tools and permissions: local filesystem, shell, `apply_patch`; workspace-write sandbox; no network
- Time limit: 10 minutes
- Human hints: 0
- Retries: 0
- Patch path: `evidence/after.patch`
- Patch SHA-256: `9cd9f2565a327ba496a3065370beaa78229bbd08028edd06029a9030a2cb6b2c`

The characterized run preserves lookup precedence, exact Ready exception text, the 12-character boundary, accepted unknown statuses, zero rejection saves, and one acceptance save. The participant tests use the repository's `given_<context>_when_<action>_then_<outcome>` naming convention. The final implementation classes contain no comments or Javadocs.

Review found no exception-order differences, JSON differences, rejected-state mutations, or save-count differences. Files changed: `DecisionPolicy.java` and `WorkflowService.java`. Lines added: 37. Lines removed: 3. The publication commit contains the final source patch bound to this evidence.
