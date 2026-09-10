# Evidence instructions and template

## Before and after runs

Use the [submission standard](../../../docs/SUBMISSION_STANDARD.md) for the exact shared fields in `evidence/before.md` and `evidence/after.md`: Starting commit, Implementation commit, Agent and model, Tools and permissions, Time limit, Human hints, Retries, and Patch SHA-256. Record zero hints and retries for both first attempts.

Both branches start at the same commit. The second branch then gets a guidance-only commit containing `brownfield-agent-app/AGENTS.md` and supporting `.agent/` files. Record it as `Run base commit` in after.md. Record the initial shared commit as the run base in before.md. Guidance cannot change during or after the implementation attempt.

Keep `AGENTS.md` within 500 words and link to the supporting Markdown documents you create under `.agent/`. Choose their names and organization. After the second implementation commit, only evidence may change.

1. Commit the first attempt and save its unedited transcript as `evidence/before-session.txt` outside the repository temporarily.
2. On the second branch, commit the guidance before starting the fresh session. Commit that session's implementation before adding evidence. Save its transcript as `evidence/after-session.txt`.
3. At that second implementation commit, run `npm run evidence:capture -- --output ../evidence/commands/verify.txt -- npm run evidence:verify` from `brownfield-agent-app/`. It checks access and summary behaviour, and records real output and exit status. Do not edit the capture.
4. Generate `evidence/before.patch` and `evidence/after.patch` with `git diff --binary --full-index <that-run-base> <that-run-implementation>`. Use file output that preserves Git's bytes. Record each file's SHA-256 in the matching Markdown report.
5. Bring all before evidence into the second branch. Commit the complete evidence and run `npm run verify:exercise`.

Use `Same conditions`, `Before`, `After`, `Proof`, and `Conclusion` in `comparison.md`. Compare correctness and show, from the transcripts, which guidance files were loaded for which decisions. Equal results are acceptable; do not claim a cost reduction without a real measurement.

The verifier checks Git history, matching conditions, patch hashes, the guidance-only intervention, linked files and the acceptance capture. Reviewers check whether the guidance is repository-specific, useful for unfamiliar tasks, and free of the sample answer.

## Setup

Install Node.js 22.12 or later within the repository's supported range, npm, Git and a Java 21 JDK. Run `npm ci` in the app. `npm test` checks the working starter; `npm run test:acceptance` is expected to fail before the requested feature exists. The exercise timer excludes installing these tools.
