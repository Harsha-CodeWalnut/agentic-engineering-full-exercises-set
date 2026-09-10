# Exercise 03 : Create Queryable Repo Context for Agents

## Your Mission

Your repository is too large for an AI agent or a new team member to understand through repeated file searches. Your mission is to create a queryable repository graph using Graphify.

The graph must help an AI agent and a human user find components, dependencies, business rules, data flow, ownership, and the source of important decisions without loading the entire repository into every session.

The duration for this challenge is 45 min or less.

## Project

[billing-graph-app](./billing-graph-app) contains application code, tests, and documents with relationships that are not explained in one place. Build the graph from this complete exercise, excluding dependencies and generated output.

## How To Go About It

1. Record initial answers to the [repository questions](./docs/graph-questions.md) in `evidence/before.md`, then install and configure [Graphify](https://github.com/Graphify-Labs/graphify) for your coding agent.
2. Index the complete repository, including code, tests, configuration, and documents.
3. Create useful queries for architecture, dependencies, data flow, business rules, ownership, and change impact.
4. Use `graphify query`, `graphify path`, and `graphify explain` to answer them.
5. Verify important answers against source files and record unsupported or ambiguous results.
6. Show a fresh agent and a human querying the graph. Record verified answers in `evidence/after.md` and compare them with the initial answers.

## Evidence

Submit `graphify-out/graph.json`, `graphify-out/GRAPH_REPORT.md`, `docs/query-guide.md`, `evidence/answers.md` and `evidence/before.md`, `evidence/after.md`, `evidence/comparison.md`. Include the source audit, sealed artifact record, and captured verification output required by the [evidence instructions and template](./docs/evidence-template.md).

Follow the [setup and verification instructions](./docs/setup.md) and [submission standard](../../docs/SUBMISSION_STANDARD.md). Run `npm run verify:exercise` from `billing-graph-app/` before raising a focused PR from your fork.

## Completion Criteria

The challenge is complete when the graph represents the repository accurately, important answers are traceable to source files, and both agents and users can query it to reduce repeated repository discovery.
