# Exercise Submission Standard

The exercise README is the main source of instructions. Follow it when it is more specific than this document.

## Common Rules

- Work on only one exercise in each PR.
- Keep changes inside the selected exercise unless the README says otherwise.
- Place all requested proof under the exercise's `evidence/` folder.
- Record exact commands, results, and exit codes. Do not claim that a check passed without proof.
- Do not commit secrets, `node_modules`, build output, caches, or unrelated reports.
- Do not change verification scripts, contracts, fixtures, or protected inputs to force a passing result.
- Raise the PR from your fork to the original repository.

## Comparable Before and After Proof

When an exercise requests `before.md`, `before.patch`, `after.md`, `after.patch`, and `comparison.md`:

- Use the same starting commit, agent and model, tools and permissions, time limit, zero hints, and zero retries.
- Record the full 40-character starting SHA and a separate implementation SHA for each run.
- Record the SHA-256 of each patch in its Markdown file.
- Generate each patch with `git diff --binary --full-index <run-base-commit> <that-run-implementation-commit>`. The run base is normally the shared starting commit. If the README introduces a guidance-only or skill-only commit before the second run, record that SHA as `Run base commit` in the matching Markdown file.
- Use `Same conditions`, `Before`, `After`, `Proof`, and `Conclusion` in the comparison.

The shared verifier checks these fields, confirms that every run base descends from the shared starting commit, and verifies that each patch exactly matches its recorded implementation commit. An exercise with a specialized benchmark history may define a different baseline snapshot patch and verify its commit binding in the exercise-specific checker. The shared verifier also rejects changes to the protected manifest or protected inputs after the starting commit.

Trusted CI should also set `CHALLENGE_TRUSTED_REF` to the pull request base SHA when running `test:integrity`. This makes the integrity manifest itself part of the protected input instead of trusting a manifest supplied by the learner branch.

## Final Verification

Context and documentation exercises may use a different comparison. Follow their local evidence template:

- **Documentation:** `before.md` records the initial understanding, `after.md` records the checked findings, and `comparison.md` explains corrections. No code patches or matched model runs are required unless explicitly requested.
- **Claude-to-Codex handover:** compare the supplied session snapshot with the fresh Codex continuation. These are different agents, not a same-model experiment. Submit the continuation transcript and implementation patch specified in the exercise.
- **Brownfield onboarding:** use the matched implementation runs and patches described above. The only intended difference is the onboarding guidance available to the second run.

For exercises providing `evidence:seal`, commit the requested outputs and reports first. Seal those committed files, capture verification at that same commit, then commit the generated manifest and command capture. The manifest never hashes itself. Source citations must refer to real source lines; a reviewer also checks whether those sources support the conclusions.

When the exercise provides `npm run evidence:capture`, use the exact command in its README to generate the command transcript and exit code. Do not type or edit a successful exit code manually.

Run the exercise's final verification command before opening the pull request. The command must not rewrite tracked files, stage changes, or create, remove, or rewrite untracked and ignored paths. Builds run in a temporary output directory. The shared verification guard compares repository state before and after the exercise checks and fails if verification changes it.
