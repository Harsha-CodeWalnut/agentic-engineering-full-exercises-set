# Repository rules

## Working safely

1. Read `AGENTS.md` and inspect the relevant source, documentation, and package
   scripts before editing.
2. Make the smallest change that satisfies the request. Keep unrelated cleanup
   and refactoring out of the change.
3. Preserve strict TypeScript checking and existing React behavior unless the
   task explicitly changes a contract.
4. Do not manually edit build output or add `node_modules/`, `dist/`, secrets,
   credentials, or local environment files to version control.
5. Do not use destructive Git operations, force push, or rewrite shared history.
6. Do not upgrade dependencies or change tooling as a side effect of a feature.

## Routing and ownership guardrails

- Treat `src/data/cases.ts` as the source of displayed sample cases and the
  policy passed to the UI routing calls.
- Treat `src/services/caseRouter.ts` as the owner of risk scoring, routing
  decisions, triage ordering, and policy descriptions.
- Never move a restricted-tag or revenue-critical case away from its named
  `ownerTeam` without an explicit, reviewed policy change.
- Preserve the distinction between support-owned status values and
  engineering-owned team labels.
- Do not copy routing rules into `App.tsx`; the UI consumes service results.
- `queuePolicy` and `defaultPolicyMirror` duplicate the same values today.
  Changing one without the other can make sorting disagree with displayed
  routing hints. Update both together and verify their behavior until the
  duplication is intentionally removed.

## Review requirements

- Routing changes require representative sample-data review and confirmation
  that the policy summary remains accurate.
- Type or data-shape changes require reviewing every consumer.
- UI changes must preserve semantic elements, accessible filter labels, keyboard
  operation, and responsive card layout.
- Run `npm run agent:check` before requesting review and report its result.
