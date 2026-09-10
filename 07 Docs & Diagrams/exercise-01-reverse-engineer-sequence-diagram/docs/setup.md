# Setup and verification

## Diagram skill

Install before the timer: `npx skills@latest add SpillwaveSolutions/design-doc-mermaid --skill design-doc-mermaid`. Choose your coding agent. [Reviewed skill source](https://github.com/SpillwaveSolutions/design-doc-mermaid/blob/c36d83503d2ba9c1e51638dc2d8a34758a377dea/SKILL.md).

Invoke the skill explicitly for reverse engineering a sequence diagram from source. Use its code-to-diagram and sequence guidance, not a full design-document template. Save plain Mermaid to `diagrams/access-sequence.mmd`, without Markdown fences. The exercise's aliases and scenario requirements still apply.

The app includes a Mermaid parser through `npm ci`; no separate rendering CLI is required for verification. Open the diagram in a Mermaid-capable preview and inspect readability as well as running `npm run diagrams:parse`. Parser success does not establish correct ordering or readable layout.

For each skill used, record its installed revision or file hash, actual invocation, and transcript lines in `evidence/skill-use.md`. Setup links identify reviewed sources; installers may fetch newer revisions. Record the version actually used.

Use Node.js 22.12 or later within the root package's supported range, npm, and Git. Run `npm ci` from `workflow-reconstruction-app/`. Complete all setup before starting the challenge timer. The README duration is a target; record actual time if the task takes longer.

## What the checks prove

- `npm run workflow:trace`: verifies the source behaviour used in this exercise.
- `npm run agent:check`: checks protected inputs and application build quality.
- `npm run verify:exercise`: checks the source, submitted outputs, source citations, and evidence without changing repository files. A starter with no submission is expected to fail this final check.

## Commit and capture order

1. Record the starting observations in `evidence/before.md` before creating your final outputs.
2. Finish the outputs, `after.md`, `comparison.md`, and `source-audit.json`. Include all extra evidence listed in the evidence template. Commit these files and any permitted implementation changes.
3. From `workflow-reconstruction-app/`, run `npm run evidence:seal`. This records the current commit and artifact hashes without putting a commit ID inside its own committed artifact.
4. Before making another commit, run `npm run evidence:capture -- --output ../evidence/commands/verify.txt -- npm run evidence:verify`.
5. Commit the generated `evidence/manifest.json` and `evidence/commands/verify.txt`. Run `npm run verify:exercise`, then raise the PR.

If validation fails, fix the result and repeat steps 2–5. State corrections honestly in the evidence. Do not edit a captured command output or manifest by hand. Verification does not measure the truth of an agent's claimed identity or replace human review of document accuracy.
