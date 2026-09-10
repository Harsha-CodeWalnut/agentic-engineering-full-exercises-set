# Exercise 04 : Extract a Domain Model from the Entire Repository

## Your Mission

You are working in a business domain where important knowledge is scattered across code, tests, policies, examples, and documents. Different files use the same business terms differently, so an AI agent or a new team member can make a technically valid change that breaks business rules.

Your mission is to extract the business domain model from the entire repository and create clear domain documentation for both AI agents and people.

The duration for this challenge is 60 min or less.

## Project

[product-rules-app](./product-rules-app) contains business entities, workflows, rules, examples, and conflicting terminology. Focus on business domain knowledge, not technologies or source-code folders.

## How To Go About It

1. Use the [Domain Analysis skill](https://skills.sh/tech-leads-club/agent-skills/domain-analysis) to discover the product's business areas, responsibilities, terms, and relationships across the repository. Use only its business analysis, not service-boundary or technical recommendations.
2. Use the [Domain Modeling skill](https://www.aihero.dev/skills-domain-modeling) to refine business terms, roles, relationships, lifecycle states, rules, and exceptions. Compare their use across code, tests, policies, examples, and documents.
3. Resolve conflicting meanings using current evidence and record unanswered questions instead of guessing.
4. Create a concise `CONTEXT.md` glossary and `docs/domain-model.md` explaining the product, people, relationships, workflows, business rules and unanswered questions. Keep technologies, APIs, schemas and code structure out of both documents.
5. Add a business domain diagram. Compare your initial answers to the [business questions](./business/questions.md) with a fresh agent's answers using only your completed documents.

## Evidence

Submit `CONTEXT.md`, `docs/domain-model.md`, `diagrams/business-domain.mmd`, `evidence/business-answers.md` and `evidence/before.md`, `evidence/after.md`, `evidence/comparison.md`. Record both skills in `evidence/skill-use.md`. Include the source audit, fresh-agent transcript, sealed artifact record, and captured verification output required by the [evidence instructions and template](./docs/evidence-template.md).

Follow the [setup and verification instructions](./docs/setup.md) and [submission standard](../../docs/SUBMISSION_STANDARD.md). Run `npm run verify:exercise` from `product-rules-app/` before raising a focused PR from your fork.

## Completion Criteria

The challenge is complete when the document represents business meaning across the repository, distinguishes similar terms, records important rules and exceptions, and gives an AI agent enough business context without inventing domain rules.
