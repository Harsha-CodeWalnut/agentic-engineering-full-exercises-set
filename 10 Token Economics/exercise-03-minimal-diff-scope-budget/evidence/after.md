# After: budgeted first attempt

Starting commit: e134b7e7b3163db395144bfb163a06d24ad06507
Implementation commit: 6f1ad644aab99813c2c5d53884d9a06b76299646
Agent and model: Codex, inherited GPT-6 model; fresh subagent with no conversation history
Tools and permissions: Local shell and apply_patch; isolated worktree; workspace-write with approval for restricted operations
Time limit: 30 minutes
Human hints: 0
Retries: 0
Patch SHA-256: 2b7ef07c6c051e3637be7baeabcda2091d6ab77ae123dc2274b97381be6b902f

Plan SHA: 671b096079d82492df95beba1d34b33ff1de212e

The fresh agent received the same production request and test-first instruction, plus the precommitted scope plan. No corrective feedback or retry was supplied. It observed both protected and learner failures before implementing the exact export mapping. The coordinator independently ran npm run test:migration after the attempt: exit code: 0. The protected consumers and the learner checks passed.

Actual source scope is 2 files, 12 additions, 1 deletion, 13 changed lines, measured from planSha to sourceSha. The helper adds an export branch and replaces a stale comment; the ten-line learner test checks export, checkout, delete, unknown, empty, case-sensitive, null and undefined inputs. Source remains below both the 30-line cap and the 20-line justification threshold.

For exact common-start reproducibility, after.patch includes the two pre-change plan files as well as the source change. The source budget counts only the direct source commit, excluding those plan documents. Final evidence is committed after source.
