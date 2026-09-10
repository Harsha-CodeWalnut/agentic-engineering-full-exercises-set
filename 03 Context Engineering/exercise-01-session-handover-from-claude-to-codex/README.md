# Exercise 01 : Session Handover from Claude to Codex

## Your Mission

You have worked in Claude for a while and the session contains important decisions, unfinished work, failed attempts, and useful repository context. Your mission is to continue the same work in Codex without losing the correct context or repeating completed work.

Create a compact, verified handover that separates current facts from stale assumptions and gives Codex everything needed to continue safely.

The duration for this challenge is 30 min or less.

## Project

[bugfix-context-app](./bugfix-context-app) contains an unfinished production change and a simulated saved Claude session used for this exercise.

Codex must receive only the handover and the repository. It must not receive the complete Claude chat or additional explanations.

## How To Go About It

1. Review the supplied Claude session and record the unfinished state in `evidence/before.md`.
2. Identify the current request, completed work, failed attempts, decisions, assumptions, changed files, remaining work, and verification status.
3. Verify important claims against the repository before including them.
4. Use the [Handoff skill](https://github.com/mattpocock/skills/blob/main/docs/productivity/handoff.md) to create a compact transfer. Copy its verified output to `evidence/handover.md`; include only the context Codex needs.
5. Start a fresh Codex session and give it the handover. Let Codex continue the task without hints or corrections.
6. Save the continuation transcript, implementation patch and `evidence/after.md`. Compare completed work and remaining uncertainty in `evidence/comparison.md`.

## Evidence

Submit `evidence/handover.md`, `evidence/handover-audit.md` and `evidence/before.md`, `evidence/after.md`, `evidence/comparison.md`. Include the skill-use record, session transcripts, source audit, sealed artifact record, and captured verification output required by the [evidence instructions and template](./docs/evidence-template.md).

Follow the [setup and verification instructions](./docs/setup.md) and [submission standard](../../docs/SUBMISSION_STANDARD.md). Run `npm run verify:exercise` from `bugfix-context-app/` before raising a focused PR from your fork.

## Completion Criteria

The challenge is complete when Codex continues from the handover alone, avoids stale information and repeated work, completes the requested change, and passes the incident checks. Record any remaining uncertainty honestly.
