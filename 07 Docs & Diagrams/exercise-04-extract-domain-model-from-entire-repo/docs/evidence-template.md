# Evidence instructions and template

All paths are relative to this exercise. Follow [setup.md](./setup.md) for the exact commit and capture order.

## Before and after

Create `evidence/before.md` and `evidence/after.md`, each with these sections:

- `## Conditions`: source commit, date, input files, task or questions, agent/tool and model (record unavailable if not exposed), time spent, and any hints or corrections.
- `## Findings`: concrete observations or answers, supported decisions, failures, and remaining uncertainty.
- `## Proof`: exact source references, links to raw session/query output, and actual command results.

Before records your initial understanding before creating the final artifact. After records the verified result. These are documented observations, not a claim that two different tools caused an improvement.

In `evidence/comparison.md`, use `## Changes`, `## Verified`, and `## Remaining questions`. Compare specific findings; successful initial answers do not need to become wrong to pass. Report equal results honestly.

No before.patch or after.patch is required: this challenge produces knowledge artifacts, not a mandatory code change.

## Outputs

- `CONTEXT.md`.
- `docs/domain-model.md`: Product purpose; People and responsibilities; Business relationships; Business workflows; Rules and exceptions; Unanswered questions.
- `diagrams/business-domain.mmd`.
- `evidence/business-answers.md`: Before; After.
- `evidence/skill-use.md`.
- `evidence/business-session.txt`.

Keep `CONTEXT.md` within 700 words. The business session transcript must show the fresh agent's answers to all supplied questions using only your completed business documents. No technical sections belong in those documents; source citations remain in the separate audit.

## Skill-use record

In `evidence/skill-use.md`, use two sections: `## domain-analysis` and `## domain-modeling`. Under **each** section, record:

- `Source:` the upstream skill URL. Use `tech-leads-club/agent-skills` for Domain Analysis and `mattpocock/skills` or the AI Hero guide for Domain Modeling.
- `Revision: <full 40-character SHA>` or `SHA-256: <64-character skill file hash>` for that installed skill.
- `Invocation:` the actual request or command used to invoke that skill.
- `Proof:` the transcript path and line numbers showing its invocation and result.

Record what Domain Analysis revealed about business areas and what Domain Modeling clarified about their terms. Exclude architecture recommendations from the submitted business documents. A source link or matching filename alone is not proof of using a skill. The verifier checks the record's structure; reviewers check the referenced session evidence.

## Source audit

Create `evidence/source-audit.json` with a `claims` array. Each claim needs:

- `id`: a unique identifier you choose.
- `topic`: one of `purpose`, `roles`, `terms`, `relationships`, `workflows`, `rules`, `exceptions`, `unresolved`. Cover every topic.
- `status`: `supported`, `contradicted`, or `unresolved`.
- `reason`: why the cited evidence supports the statement or leaves it unresolved.
- `artifact`: `{ "path": "<submitted output>", "line": <one-based line>, "excerpt": "<exact text at that line>" }`.
- `sources`: one or more objects with the same path, line, and excerpt fields, referencing supplied source material.

Paths start at the exercise folder. Excerpts must match complete lines, including indentation. Use multiple lines when needed. Cite each important statement and every diagram relationship; put one relationship per diagram line. Code and tests can prove current behaviour; old notes may establish a contradiction, not the current rule. Reviewers assess whether the source really supports the claim.

## Recorded verification

`npm run evidence:seal` creates `evidence/manifest.json` after your outputs and evidence are committed. The capture command creates `evidence/commands/verify.txt` with the actual command, source commit, timestamps, output, and exit code. Final verification rejects missing files, changed artifacts, stale citations, and unsuccessful captures.
