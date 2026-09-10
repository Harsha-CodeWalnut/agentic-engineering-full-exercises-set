# Setup and verification

## Documentation skill

Install before the timer: `npx skills@latest add github/awesome-copilot --skill acquire-codebase-knowledge`. Choose your coding agent. Install Python 3.8+ and Git as required by the skill. [Reviewed skill source](https://github.com/github/awesome-copilot/blob/7568a482ce2df38f8965ab5336a3220db796a4ba/skills/acquire-codebase-knowledge/SKILL.md).

Use the skill to investigate this exercise's `notification-mesh-app/`, not the full exercises repository. Run its bundled `scripts/scan.py` from the app directory using the installed skill's absolute path. Set `--output ../evidence/codebase-scan.txt` and preserve the scan command and output in `evidence/skill-session.txt`. Use `python`, `python3`, or `py -3` as appropriate for your machine.

Explicitly override the skill's default seven-document output: use its investigation checkpoints, then write one `docs/design-document.md` at the exercise root. Do not submit seven duplicate reports. Replace unresolved template markers with clear statements of what is unknown and what evidence or decision is needed. Do not guess design intent from code.

This skill documents technical codebase knowledge, which is appropriate here. It is not the business-domain skill used in exercise 7.4. Diagrams are optional supporting content; no diagram skill is required.

For each skill used, record its installed revision or file hash, actual invocation, and transcript lines in `evidence/skill-use.md`. Setup links identify reviewed sources; installers may fetch newer revisions. Record the version actually used.

Use Node.js 22.12 or later within the root package's supported range, npm, and Git. Run `npm ci` from `notification-mesh-app/`. Complete all setup before starting the challenge timer. The README duration is a target; record actual time if the task takes longer.

## What the checks prove

- `npm run test:routing`: verifies the source behaviour used in this exercise.
- `npm run agent:check`: checks protected inputs and application build quality.
- `npm run verify:exercise`: checks the source, submitted outputs, source citations, and evidence without changing repository files. A starter with no submission is expected to fail this final check.

## Commit and capture order

1. Record the starting observations in `evidence/before.md` before creating your final outputs.
2. Finish the outputs, `after.md`, `comparison.md`, and `source-audit.json`. Include all extra evidence listed in the evidence template. Commit these files and any permitted implementation changes.
3. From `notification-mesh-app/`, run `npm run evidence:seal`. This records the current commit and artifact hashes without putting a commit ID inside its own committed artifact.
4. Before making another commit, run `npm run evidence:capture -- --output ../evidence/commands/verify.txt -- npm run evidence:verify`.
5. Commit the generated `evidence/manifest.json` and `evidence/commands/verify.txt`. Run `npm run verify:exercise`, then raise the PR.

If validation fails, fix the result and repeat steps 2–5. State corrections honestly in the evidence. Do not edit a captured command output or manifest by hand. Verification does not measure the truth of an agent's claimed identity or replace human review of document accuracy.
