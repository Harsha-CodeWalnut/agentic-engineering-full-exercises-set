# Characterization-First Attempt Evidence

- Starting commit: fb48d936ec2e6e205478614a4af4d2550662f650
- Run base commit: 3c8f5a2ead88d80486fe38ac5b44b1fcccb76e2b
- Implementation commit: de514bd6446e81cf37a3852c4cbc30b42d960a3b
- Agent and model: Codex delegated coding agent; inherited current-session model configuration
- Tools and permissions: repository filesystem, shell commands, Git inspection, workspace writes, and restricted network
- Time limit: 10 minutes
- Human hints: 0
- Retries: 0
- Patch SHA-256: a3aec06590b3fd36aac8db9b60dc73c35ce86147cbc2bf881209d58dffe8fe63
- Patch path: evidence/after.patch
- Oracle exit code: 0
- Output SHA-256: 9485e152e5d4da6a7085fdb5f7f7cd444c100a68b039667cfebd373fc5089b6b
- Changed cases: 0 of 12
- Changed files: 1 (`legacyEligibility.mjs`)
- Lines added: 36
- Lines removed: 20

The agent received the same fixed request and execution conditions as the unconstrained run. Its run base was the direct characterization commit, which contains only the public test and baseline snapshot. The first source patch was committed without revision after checks. The protected oracle and dynamic characterization passed all twelve observations. Integrity, lint, verifier self-test, agent check, formatting, and `git diff --check` passed; typecheck and build initially could not run because dependencies were absent from the isolated run worktree and were exercised later by the clean final gate.
