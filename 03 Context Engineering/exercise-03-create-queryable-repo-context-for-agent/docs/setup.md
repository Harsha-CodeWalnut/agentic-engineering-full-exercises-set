# Setup and verification

Use Node.js 22.12 or later within the root package's supported range, npm, and Git. Run `npm ci` from `billing-graph-app/`. Complete tool-specific setup below before starting the challenge timer. The README duration is a target; record actual time if the task takes longer.

## What the checks prove

- `npm run test:billing`: verifies the source behaviour used in this exercise.
- `npm run agent:check`: checks protected inputs and application build quality.
- `npm run verify:exercise`: checks the source, submitted outputs, source citations, and evidence without changing repository files. A starter with no submission is expected to fail this final check.

## Commit and capture order

1. Record the starting observations in `evidence/before.md` before creating your final outputs.
2. Finish the outputs, `after.md`, `comparison.md`, and `source-audit.json`. Include all extra evidence listed in the evidence template. Commit these files and any permitted implementation changes.
3. From `billing-graph-app/`, run `npm run evidence:seal`. This records the current commit and artifact hashes without putting a commit ID inside its own committed artifact.
4. Before making another commit, run `npm run evidence:capture -- --output ../evidence/commands/verify.txt -- npm run evidence:verify`.
5. Commit the generated `evidence/manifest.json` and `evidence/commands/verify.txt`. Run `npm run verify:exercise`, then raise the PR.

If validation fails, fix the result and repeat steps 2–5. State corrections honestly in the evidence. Do not edit a captured command output or manifest by hand. Verification does not measure the truth of an agent's claimed identity or replace human review of document accuracy.

## Graphify

Use [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify), distributed as the Python package `graphifyy`. Its CLI is named `graphify`. CLI syntax was checked with version 0.9.4.

Install with `uv tool install graphifyy==0.9.4` (Python 3.10+ and uv required), then use `graphify install` with the platform option for your coding agent. Run the skill through that agent's skill interface; a slash command is not a shell command. Record `graphify --version`.

The corpus is the complete selected exercise: app source, tests, configuration and supplied documents. Exclude dependencies, Git internals, generated evidence and graph output. Use the installed Graphify skill to include both code and document knowledge. The code parser is local; semantic document extraction uses the selected assistant or a configured model backend. A separate paid API key is not a requirement when using the assistant's skill workflow. Record actual model/backend use and any indexing exclusions.

Index from this exercise root so node `source_file` paths remain relative to it. The graph must contain real file references from app source, the `scripts/run-` tests, and supplied `docs/`. Inferred business concepts still need supporting source references. A code-only extraction is not a complete submission.

From the exercise root, query the resulting graph with:

```text
graphify query "recognized revenue" --graph graphify-out/graph.json
graphify explain "recognizedRevenueByAccount" --graph graphify-out/graph.json
graphify path "loadRevenueDashboard" "recognizedRevenueByAccount" --graph graphify-out/graph.json
```

Use actual extracted node names when they differ. Save these commands and their unedited output in `evidence/commands/graphify.txt`, including the version, indexing invocation, included paths and exclusions. Answer [graph-questions.md](./graph-questions.md). Include the human CLI output and the fresh agent's graph usage in that transcript.

Graph generation is a learner action before sealing. Final verification reads the committed graph and never regenerates it. In the query guide explain how to rebuild after source changes and how to check stale or inferred edges.
