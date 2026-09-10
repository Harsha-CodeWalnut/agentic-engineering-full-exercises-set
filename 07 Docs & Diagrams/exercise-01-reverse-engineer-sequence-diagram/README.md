# Exercise 01 : Reverse Engineer a Sequence Diagram

## Your Mission

Your team needs to understand an important workflow, but the existing documentation is incomplete and outdated. Your mission is to reverse engineer the workflow from the code and create a new sequence diagram that accurately shows how it works.

The duration for this challenge is 45 min or less.

## Project

[workflow-reconstruction-app](./workflow-reconstruction-app) contains the workflow implementation, tests, and an outdated description. The code and verified runtime behaviour are the authority.

## How To Go About It

1. Record your initial understanding in `evidence/before.md`, then identify the workflow entry point, actors, services, decisions, calls, responses, failures, and rollback paths.
2. Trace normal, high-risk, and failure scenarios through the code and tests.
3. Use the [Design Doc Mermaid skill](https://www.skills.sh/spillwavesolutions/design-doc-mermaid/design-doc-mermaid) to create one sequence diagram containing the important alternatives and error paths.
4. Map every important interaction to the source file and line that proves it.
5. Record differences between the old documentation and the implementation.

Record the source-verified result in `evidence/after.md` and compare it in `evidence/comparison.md`. Use the [diagram requirements](./docs/diagram-contract.md). Document source defects or uncertainty; source changes are not required.

## Evidence

Submit `diagrams/access-sequence.mmd`, `evidence/contradictions.md` and `evidence/before.md`, `evidence/after.md`, `evidence/comparison.md`. Include the skill-use record, generation transcript, source audit, sealed artifact record, and captured verification output required by the [evidence instructions and template](./docs/evidence-template.md).

Follow the [setup and verification instructions](./docs/setup.md) and [submission standard](../../docs/SUBMISSION_STANDARD.md). Run `npm run verify:exercise` from `workflow-reconstruction-app/` before raising a focused PR from your fork.

## Completion Criteria

The challenge is complete when the sequence diagram parses, represents the implemented workflow without invented steps, includes important failure paths, and every important interaction is supported by source evidence.
