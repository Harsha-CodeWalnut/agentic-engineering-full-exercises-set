# Agent guide

These instructions apply to the entire `agent-onboarding-app` repository.

## Start here

Before editing, read the guidance relevant to the task:

- [`.agent/rules.md`](.agent/rules.md) for safety and scope boundaries.
- [`.agent/architecture.md`](.agent/architecture.md) for code and domain ownership.
- [`.agent/workflows.md`](.agent/workflows.md) for common change procedures.
- [`.agent/testing.md`](.agent/testing.md) for verification commands.
- [`.agent/conventions.md`](.agent/conventions.md) for local coding patterns.

Inspect the files involved in a change before modifying them. Prefer the smallest
reviewable change and do not refactor unrelated application behavior.

## Repository summary

This React and TypeScript application displays support cases in risk order and
suggests an owner and next action for each case. `src/data/cases.ts` owns sample
data and the queue policy, `src/services/caseRouter.ts` owns routing decisions,
`src/types.ts` owns domain contracts, and `src/App.tsx` owns presentation.

Case statuses are support concepts; owner names are engineering-team concepts.
Do not treat these vocabularies as interchangeable.

## Critical boundaries

- Keep routing decisions in `src/services/caseRouter.ts`, not in React components.
- Keep shared domain types in `src/types.ts` and sample records in
  `src/data/cases.ts`.
- Restricted-tag and revenue-critical cases must remain with their named owner.
- `queuePolicy` and `defaultPolicyMirror` currently duplicate policy values.
  Until that design is intentionally changed, update and verify both together.
- When routing behavior changes, update representative sample data and the UI
  policy summary when applicable.
- Do not edit generated output, add secrets, or commit `node_modules/` or `dist/`.

## Commands

Run commands from this directory. Safe read/build commands include:

```bash
npm run dev
npm run lint
npm run test
npm run format
npm run typecheck
npm run build
```

Before requesting review, run the complete gate:

```bash
npm run agent:check
```

Avoid destructive Git commands, force pushes, dependency upgrades, and broad
automated rewrites unless the task explicitly requires them and their impact has
been reviewed.

## Pull requests

Keep commits focused. In the PR description, summarize the change, identify any
routing or ownership impact, list changed policy/sample-data files, and include
the exact verification commands and results. Call out checks that could not run
and any remaining risk.
