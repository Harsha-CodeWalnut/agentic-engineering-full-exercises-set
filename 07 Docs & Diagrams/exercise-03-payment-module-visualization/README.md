# Exercise 03 : Payment Module Visualization

## Your Mission

Your team cannot clearly explain the payment module because its behaviour is spread across checkout, payment, webhook, ledger, and receipt code. Your mission is to inspect the implementation and visualize the complete payment module.

Create four diagrams: an Architecture diagram, a sequence diagram, a flow chart, and an ER diagram.

The duration for this challenge is 75 min or less.

## Project

[payment-workflow-app](./payment-workflow-app) contains the payment module, data models, integrations, tests, and supporting documents. Verify every important relationship against code or observed behaviour.

## How To Go About It

1. Record your initial understanding in `evidence/before.md`, then identify the components, external systems, data stores, actors, entities, states, and business decisions.
2. Trace checkout, authorization, webhook handling, duplicate events, failures, ledger updates, and receipt creation.
3. Use the [Design Doc Mermaid skill](https://www.skills.sh/spillwavesolutions/design-doc-mermaid/design-doc-mermaid) for all four views. Create an architecture diagram showing system boundaries and dependencies.
4. Create a sequence diagram showing the main interaction and important alternatives.
5. Create a flow chart showing decisions, states, failures, and recovery paths.
6. Create an ER diagram showing entities, identifiers, ownership, and relationships.
7. Map important diagram elements to their source files.

Record the source-verified result in `evidence/after.md` and compare it in `evidence/comparison.md`. Use the [diagram requirements](./docs/diagram-contract.md). Document source defects or uncertainty; source changes are not required.

## Evidence

Submit `diagrams/payment-architecture.mmd`, `diagrams/payment-sequence.mmd`, `diagrams/payment-flow.mmd`, `diagrams/payment-data.mmd`, `evidence/contradictions.md` and `evidence/before.md`, `evidence/after.md`, `evidence/comparison.md`. Include the skill-use record, generation transcript, source audit, sealed artifact record, and captured verification output required by the [evidence instructions and template](./docs/evidence-template.md).

Follow the [setup and verification instructions](./docs/setup.md) and [submission standard](../../docs/SUBMISSION_STANDARD.md). Run `npm run verify:exercise` from `payment-workflow-app/` before raising a focused PR from your fork.

## Completion Criteria

The challenge is complete when all four diagrams parse, agree with one another, represent the implemented payment module, include important failure and duplicate-event behaviour, and are supported by source evidence.
