# Comparison

Both primary runs were fair first attempts: same prompt, same agent, same model, same tools, same permissions, same time limit (45 minutes), same fixture repository commit `1db5cd5b20841572c90bc1a347b0c4b06e01d19c`, and attempt 1 with no human hints. The packaged release-notes skill was the only changed input. The after branch does not contain the before implementation commit.

| Topic | Before (skill disabled) | After (skill enabled) |
|---|---|---|
| Trigger | Monolithic draft triggers on incidents, refactors, test reports, and engineering summaries | Description limits use to customer release notes, changelogs, and publishable Git summaries; ten trigger evals passed |
| Git range | Draft used `git log --oneline --all` and `HEAD~20..HEAD` (exit code 128), then grouped subjects by hand | Shared script `scripts/extract-release.mjs --repo --base --head` selected `exercise-base..origin/exercise-head` |
| Customer items | Highlights/Changes format; no `## Customer-facing changes` | Two customer items: checkout retry and billing export rename |
| Breaking | Labeled a compatibility update; omitted `invoiceTotal` | Explicit breaking change, old field, new field, and customer migration |
| Missing evidence | Green unit tests treated as enough; missing screenshot and dry run omitted | CI-881-unit, CI-881-e2e, CI-884-pact cited; screenshot and migration dry run remain missing |
| Internal | Telemetry published under engineering improvements | Internal telemetry excluded from customer notes |
| Resources | Whole draft loaded every rule and example (2934 bytes) | Full-release loaded SKILL.md plus publication, evidence, and migration references (2449 bytes) |
| Script | Copied Git command output into the prompt | One reusable extractor, also used for hotfix-only and internal-only |
| Verification | `npm run release:verify` exit code 1, score 9 (1/11) | `npm run release:verify` exit code 0, score 100 (11/11) |
| Context | 2934 UTF-8 bytes from `docs/monolithic-skill-draft.md` | 2449 UTF-8 bytes for full-release; hotfix-only 2080; internal-only 1661 |

Hotfix-only loaded publication and evidence policy and skipped migration policy. Internal-only loaded publication policy only, reported no customer-facing work for `breaking-head..origin/exercise-head`, and cited `src/telemetry.js` from Git. Selective resource use reduced context bytes without reducing quality.
