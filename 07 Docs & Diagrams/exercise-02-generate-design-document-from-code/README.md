# Exercise 02 : Generate a Design Document from Code

## Your Mission

Your team has a working application but no reliable design document. Your mission is to inspect the code and generate a design document that explains the system as it exists today.

The document must explain the architecture, responsibilities, dependencies, data flow, important decisions, operational behaviour, and safe change boundaries.

The duration for this challenge is 60 min or less.

## Project

[notification-mesh-app](./notification-mesh-app) contains the application code, tests, configuration, and a stale description. Treat source and verified behaviour as the authority.

## How To Go About It

1. Record your initial understanding in `evidence/before.md`. Use the [Acquire Codebase Knowledge skill](https://skills.sh/github/awesome-copilot/acquire-codebase-knowledge) to investigate the architecture, modules, integrations, configuration, and tests.
2. Trace one main workflow and one failure or fallback workflow.
3. Consolidate the findings into `docs/design-document.md`: purpose, architecture, responsibilities, dependencies, data flow, decisions, constraints, risks, and verification guidance. Submit one design document, not the skill's default seven-document set.
4. Add only the diagrams needed to make the design easier to understand.
5. Link important statements to source files and record stale or unsupported claims separately.

Record the source-verified result in `evidence/after.md` and compare it in `evidence/comparison.md`. Use the [design scope](./docs/graph-contract.md). Document source defects or uncertainty; source changes are not required.

## Evidence

Submit `docs/design-document.md`, `evidence/stale-claims.md` and `evidence/before.md`, `evidence/after.md`, `evidence/comparison.md`. Include the skill-use record, investigation transcript, source audit, sealed artifact record, and captured verification output required by the [evidence instructions and template](./docs/evidence-template.md).

Follow the [setup and verification instructions](./docs/setup.md) and [submission standard](../../docs/SUBMISSION_STANDARD.md). Run `npm run verify:exercise` from `notification-mesh-app/` before raising a focused PR from your fork.

## Completion Criteria

The challenge is complete when the design document matches the current code, clearly explains how the system works and where changes belong, and its important claims can be verified from the repository.
