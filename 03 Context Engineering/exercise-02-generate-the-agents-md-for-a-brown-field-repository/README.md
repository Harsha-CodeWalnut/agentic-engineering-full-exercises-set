# Exercise 02 : Generate AGENTS.md for a Brownfield Repository

## Your Mission

Your team has a brownfield Java repository where customer features sit beside older internal tools. Fresh agents copy the wrong patterns or load every document because they cannot find the guidance relevant to their change.

Your mission is to create a concise `AGENTS.md` that directs an agent to the right architecture, coding-quality, Java, testing, and workflow guidance when needed.

The duration for this challenge is 45 min or less.

## Project

[brownfield-agent-app](./brownfield-agent-app) contains working case access, a legacy export, and an unfinished workspace summary. Complete the [same change request](./docs/change-request.md) in both agent attempts.

## How To Go About It

1. Create two branches from the same starting commit. On the first, let a fresh agent attempt the change without onboarding. Commit its result and save the before evidence.
2. Inspect the repository and that result. On the second branch, create `brownfield-agent-app/AGENTS.md` and the supporting documents you choose under `.agent/`. Keep the entry file short and link to deeper guidance by task.
3. Commit only the guidance, then let a fresh agent attempt the same change using the same model, tools, permissions, time limit, zero hints and zero retries.
4. Keep its first result, copy the before evidence into the second branch, and compare which guidance was used. Follow the [commit and evidence instructions](./docs/evidence-template.md).

The guidance must apply to other repository tasks and must not contain the summary implementation.

## Evidence

Submit `AGENTS.md`, your supporting documents, `evidence/before.md`, `evidence/before.patch`, `evidence/after.md`, `evidence/after.patch`, `evidence/comparison.md`, session transcripts and captured checks. Follow the [evidence instructions and template](./docs/evidence-template.md) and [submission standard](../../docs/SUBMISSION_STANDARD.md).

Run `npm run verify:exercise` from `brownfield-agent-app/`. Raise the final PR only from the second branch; keep the first branch until review is complete.

## Completion Criteria

A fresh agent finds the relevant guidance, implements the summary with correct workspace access and time handling, preserves existing behaviour, and passes the checks without human correction. Both attempts must be recorded honestly; an already-correct first attempt is valid.
