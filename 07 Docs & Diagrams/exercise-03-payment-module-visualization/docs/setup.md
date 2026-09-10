# Setup and verification

## Diagram skills and formats

Use **Design Doc Mermaid** for the four required, source-traced `.mmd` files:

```sh
npx skills@latest add SpillwaveSolutions/design-doc-mermaid --skill design-doc-mermaid
```

[Reviewed skill source](https://github.com/SpillwaveSolutions/design-doc-mermaid/blob/c36d83503d2ba9c1e51638dc2d8a34758a377dea/SKILL.md). Invoke its architecture, sequence, flowchart and ER guidance. Request the exact Mermaid types in [diagram-contract.md](./diagram-contract.md), not experimental architecture syntax. No full design document is required.

The app's installed Mermaid parser checks these files locally. Open all four in a Mermaid-capable preview and inspect readability; parsing alone does not verify layout or business meaning.

If useful, create additional editable visual copies with either skill:

- [Draw.io Diagram Generator](https://www.skills.sh/github/awesome-copilot/draw-io-diagram-generator): install with `npx skills@latest add github/awesome-copilot --skill draw-io-diagram-generator`. Its native output is `.drawio` XML; open it in draw.io web, desktop, or the VS Code extension. Python 3.8+ is optional for its bundled validator.
- [Excalidraw Diagram Generator](https://www.skills.sh/github/awesome-copilot/excalidraw-diagram-generator): install with `npx skills@latest add github/awesome-copilot --skill excalidraw-diagram-generator`. Its native output is `.excalidraw` JSON; open it in Excalidraw or a compatible editor.

Both optional skills were reviewed in [GitHub Awesome Copilot](https://github.com/github/awesome-copilot/tree/7568a482ce2df38f8965ab5336a3220db796a4ba/skills). Install only tools you choose, before the timer. Do not rename their native output to `.mmd`. Optional copies must match the four checked Mermaid views; they cannot replace them and are reviewed visually, not by the Mermaid verifier. No additional visual copies are required.

For each skill used, record its installed revision or file hash, actual invocation, and transcript lines in `evidence/skill-use.md`. Setup links identify reviewed sources; installers may fetch newer revisions. Record the version actually used.

Use Node.js 22.12 or later within the root package's supported range, npm, and Git. Run `npm ci` from `payment-workflow-app/`. Complete all setup before starting the challenge timer. The README duration is a target; record actual time if the task takes longer.

## What the checks prove

- `npm run test:feature`: verifies the source behaviour used in this exercise.
- `npm run agent:check`: checks protected inputs and application build quality.
- `npm run verify:exercise`: checks the source, submitted outputs, source citations, and evidence without changing repository files. A starter with no submission is expected to fail this final check.

## Commit and capture order

1. Record the starting observations in `evidence/before.md` before creating your final outputs.
2. Finish the outputs, `after.md`, `comparison.md`, and `source-audit.json`. Include all extra evidence listed in the evidence template. Commit these files and any permitted implementation changes.
3. From `payment-workflow-app/`, run `npm run evidence:seal`. This records the current commit and artifact hashes without putting a commit ID inside its own committed artifact.
4. Before making another commit, run `npm run evidence:capture -- --output ../evidence/commands/verify.txt -- npm run evidence:verify`.
5. Commit the generated `evidence/manifest.json` and `evidence/commands/verify.txt`. Run `npm run verify:exercise`, then raise the PR.

If validation fails, fix the result and repeat steps 2–5. State corrections honestly in the evidence. Do not edit a captured command output or manifest by hand. Verification does not measure the truth of an agent's claimed identity or replace human review of document accuracy.
