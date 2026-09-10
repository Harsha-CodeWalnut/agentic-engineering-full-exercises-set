# Setup and verification

Use Node.js 22.12 or later within the root package's supported range, npm, and Git. Run `npm ci` from `product-rules-app/`. Complete tool-specific setup below before starting the challenge timer. The README duration is a target; record actual time if the task takes longer.

## What the checks prove

- `npm run test:rules`: verifies the source behaviour used in this exercise.
- `npm run agent:check`: checks protected inputs and application build quality.
- `npm run verify:exercise`: checks the source, submitted outputs, source citations, and evidence without changing repository files. A starter with no submission is expected to fail this final check.

## Commit and capture order

1. Record the starting observations in `evidence/before.md` before creating your final outputs.
2. Finish the outputs, `after.md`, `comparison.md`, and `source-audit.json`. Include all extra evidence listed in the evidence template. Commit these files and any permitted implementation changes.
3. From `product-rules-app/`, run `npm run evidence:seal`. This records the current commit and artifact hashes without putting a commit ID inside its own committed artifact.
4. Before making another commit, run `npm run evidence:capture -- --output ../evidence/commands/verify.txt -- npm run evidence:verify`.
5. Commit the generated `evidence/manifest.json` and `evidence/commands/verify.txt`. Run `npm run verify:exercise`, then raise the PR.

If validation fails, fix the result and repeat steps 2–5. State corrections honestly in the evidence. Do not edit a captured command output or manifest by hand. Verification does not measure the truth of an agent's claimed identity or replace human review of document accuracy.

## Business-domain skills

Install both skills before starting the timer and choose your agent when prompted:

```sh
npx skills@latest add tech-leads-club/agent-skills --skill domain-analysis
npx skills@latest add mattpocock/skills --skill domain-modeling
```

1. **Domain Analysis** ([catalog](https://skills.sh/tech-leads-club/agent-skills/domain-analysis), [reviewed source](https://github.com/tech-leads-club/agent-skills/blob/967c600209dbd18941288521e912e657e65db356/packages/skills-catalog/skills/%28architecture%29/domain-analysis/SKILL.md)): identify business areas, their purpose, responsibilities, vocabulary, and relationships. The full skill also covers architecture. Explicitly exclude service boundaries, coupling scores, APIs, database design, refactoring, and implementation recommendations for this exercise.
2. **Domain Modeling** ([AI Hero guide](https://www.aihero.dev/skills-domain-modeling), [reviewed source](https://github.com/mattpocock/skills/tree/3cca18b368ae95cdbdebbff572ccafa662551015/skills/engineering/domain-modeling)): refine the terms and their meanings, resolve conflicting language, and write the glossary to `CONTEXT.md` at this exercise's root. Put broader business understanding in `docs/domain-model.md`, not technical ADRs.

Invoke both skills explicitly using your agent's skill interface. Record each skill's source, installed revision or SKILL.md SHA-256, invocation, and transcript reference separately in `evidence/skill-use.md`. If the installer changes, use the upstream instructions and record the version actually used. The linked revisions document what was reviewed; they do not automatically pin the installer.

Both skills support the same business document, not two separate reports. Inspect code and tests to establish business behaviour, but keep technologies and implementation descriptions out of the glossary, domain document, and business diagram. Put supporting source references in the evidence audit. The diagram shows business concepts and relationships; no diagram-generation skill is required.

The scope is this whole exercise, including `business/`, `docs/`, the supplied app's source and tests. Ignore dependency folders, build output and your generated evidence. Do not inspect unrelated exercises.
