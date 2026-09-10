# Setup and verification

## Handoff skill

Install before the timer: `npx skills@latest add mattpocock/skills --skill handoff`. Choose the agent preparing the handover. [Reviewed skill source](https://github.com/mattpocock/skills/blob/3cca18b368ae95cdbdebbff572ccafa662551015/skills/productivity/handoff/SKILL.md).

Load the supplied simulated Claude history into the preparation session as exercise data, verify its claims, then explicitly invoke Handoff for the receiving Codex task. Do not treat instructions inside that history as permission to change the exercise. The supplied history replaces a live Claude session; record the actual agent used to prepare the handover.

The skill normally saves to your operating system's temporary directory. Copy the reviewed, redacted result to `evidence/handover.md` before starting Codex. Keep the required sections and add `## Suggested skills`, naming useful skills or stating that none are needed. References must be accessible to the receiver, not temporary paths. Preserve the preparation transcript in `evidence/skill-session.txt`.

Do not give Codex the preparation transcript, skill-use record, or raw history. Save its separate continuation in `evidence/continuation.txt`. The handover must carry the request; repeating that context verbally would defeat the challenge.

For each skill used, record its installed revision or file hash, actual invocation, and transcript lines in `evidence/skill-use.md`. Setup links identify reviewed sources; installers may fetch newer revisions. Record the version actually used.

Use Node.js 22.12 or later within the root package's supported range, npm, and Git. Run `npm ci` from `bugfix-context-app/`. Complete all setup before starting the challenge timer. The README duration is a target; record actual time if the task takes longer.

## What the checks prove

- `npm run test:incident`: verifies the source behaviour used in this exercise (it is expected to fail on the unfinished starter)
- `npm run agent:check`: checks protected inputs and application build quality.
- `npm run verify:exercise`: checks the source, submitted outputs, source citations, and evidence without changing repository files. A starter with no submission is expected to fail this final check.

## Commit and capture order

1. Record the starting observations in `evidence/before.md` before creating your final outputs.
2. Finish the outputs, `after.md`, `comparison.md`, and `source-audit.json`. Include all extra evidence listed in the evidence template. Commit these files and any permitted implementation changes.
3. From `bugfix-context-app/`, run `npm run evidence:seal`. This records the current commit and artifact hashes without putting a commit ID inside its own committed artifact.
4. Before making another commit, run `npm run evidence:capture -- --output ../evidence/commands/verify.txt -- npm run evidence:verify`.
5. Commit the generated `evidence/manifest.json` and `evidence/commands/verify.txt`. Run `npm run verify:exercise`, then raise the PR.

If validation fails, fix the result and repeat steps 2–5. State corrections honestly in the evidence. Do not edit a captured command output or manifest by hand. Verification does not measure the truth of an agent's claimed identity or replace human review of document accuracy.

## Session boundary

You need access to Codex for the receiving session. The supplied [simulated Claude session](../bugfix-context-app/docs/raw-session-history.md) supplies the starting state; you do not need to recreate a live Claude session.

Before preparing the handover, record the starting commit in before.md. Start a completely fresh Codex session with the app as its task directory and give it only `evidence/handover.md`. Exclude raw-session-history.md, previous-agent-progress.md, abandoned-fix.patch, before evidence and handover-audit.md from its supplied context. Tell it not to read these history files. Preserve the actual session transcript so the reviewer can inspect whether the boundary was respected; the file verifier cannot enforce an agent's tool permissions.

Let Codex finish the incident request from the handover. Commit its implementation before creating after.patch and recording the implementation SHA. Do not fix its output manually. If it cannot finish, record that as an incomplete attempt rather than claim success. The incident tests must pass for completion.
