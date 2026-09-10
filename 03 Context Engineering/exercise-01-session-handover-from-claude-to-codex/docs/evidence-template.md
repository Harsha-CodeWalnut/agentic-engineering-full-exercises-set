# Evidence instructions and template

All paths are relative to this exercise. Follow [setup.md](./setup.md) for the exact commit and capture order.

## Before and after

Create `evidence/before.md` and `evidence/after.md`, each with these sections:

- `## Conditions`: source commit, date, input files, task or questions, agent/tool and model (record unavailable if not exposed), time spent, and any hints or corrections.
- `## Findings`: concrete observations or answers, supported decisions, failures, and remaining uncertainty.
- `## Proof`: exact source references, links to raw session/query output, and actual command results.

Before describes the supplied simulated Claude session and unfinished source. After describes the real fresh Codex continuation. This is a transfer between different agents, not a matched-model experiment. Do not invent the simulated session's model, token usage, or runtime.

In `evidence/comparison.md`, use `## Changes`, `## Verified`, and `## Remaining questions`. Compare specific findings; successful initial answers do not need to become wrong to pass. Report equal results honestly.

Also submit `evidence/continuation.txt` containing the fresh Codex session transcript and `evidence/after.patch` generated with `git diff --binary --full-index <starting-commit> <implementation-commit>`. Record `Starting commit: <full SHA>` in before.md and `Implementation commit: <full SHA>` in after.md. Commit the implementation first, then generate the patch before committing the evidence.

## Outputs

- `evidence/handover.md`: Request; Current state; Remaining work; Verification; Suggested skills.
- `evidence/handover-audit.md`: Retained facts; Rejected claims; Missing information.
- `evidence/continuation.txt`.
- `evidence/after.patch`.

Keep the handover within 1,200 words. Record the final implementation SHA, and do not change application source after that implementation commit; subsequent commits contain only the requested documentation and evidence.

## Skill evidence

Submit `evidence/skill-use.md` and `evidence/skill-session.txt`. The latter is the actual preparation or generation transcript, redacted for secrets, not a rewritten summary.

Use one `## <skill-name>` section per skill in `skill-use.md`. Under each section, record plain fields:

- `Source: <upstream repository URL from setup.md>`.
- `Revision: <full 40-character SHA>` or `SHA-256: <64-character installed SKILL.md hash>`.
- `Invocation: <actual command or request>`.
- `Proof: evidence/skill-session.txt:L<first>-L<last>` pointing to the invocation and result.

Use the exact skill name from setup.md. Record how its output was checked or corrected. Verification checks the required skill, record fields and transcript line range, not whether an agent truly loaded the skill. Reviewers inspect the raw transcript. Do not manufacture unavailable model details or successful results.

## Source audit

Create `evidence/source-audit.json` with a `claims` array. Each claim needs:

- `id`: a unique identifier you choose.
- `topic`: one of `request`, `completed-work`, `stale-claims`, `remaining-work`, `verification`. Cover every topic.
- `status`: `supported`, `contradicted`, or `unresolved`.
- `reason`: why the cited evidence supports the statement or leaves it unresolved.
- `artifact`: `{ "path": "<submitted output>", "line": <one-based line>, "excerpt": "<exact text at that line>" }`.
- `sources`: one or more objects with the same path, line, and excerpt fields, referencing supplied source material.

Paths start at the exercise folder. Excerpts must match complete lines, including indentation. Use multiple lines when needed. Cite each important statement and every diagram relationship; put one relationship per diagram line. Code and tests can prove current behaviour; old notes may establish a contradiction, not the current rule. Reviewers assess whether the source really supports the claim.

## Recorded verification

`npm run evidence:seal` creates `evidence/manifest.json` after your outputs and evidence are committed. The capture command creates `evidence/commands/verify.txt` with the actual command, source commit, timestamps, output, and exit code. Final verification rejects missing files, changed artifacts, stale citations, and unsuccessful captures.
