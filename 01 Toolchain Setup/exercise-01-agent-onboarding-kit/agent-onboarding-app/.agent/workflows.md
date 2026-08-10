# Development workflows

Run all commands from `agent-onboarding-app`.

## Begin any change

1. Read `AGENTS.md` and the relevant `.agent` documents.
2. Inspect `package.json`, the files to be changed, and their consumers.
3. Check the working tree and preserve unrelated user changes.
4. State whether the change affects UI, domain types, data, routing policy, or
   routing behavior.

## Change routing behavior

1. Read `src/types.ts`, `src/data/cases.ts`, `src/services/caseRouter.ts`,
   `src/App.tsx`, and `docs/support-notes.md`.
2. Update the decision or risk calculation in `caseRouter.ts`.
3. Preserve named-owner handling for restricted and revenue-critical cases
   unless the approved requirement explicitly changes it.
4. Add or update representative entries in `sampleCases` so the behavior is
   visible and reviewable.
5. Confirm `describePolicy` still describes the behavior shown in the UI.
6. Run the complete verification gate and manually inspect affected scenarios.

## Change queue policy

1. Update `queuePolicy` in `src/data/cases.ts`.
2. Update `defaultPolicyMirror` in `src/services/caseRouter.ts` to identical
   values, or make a separately reviewed architectural change that removes the
   duplication.
3. Review sample cases near the changed threshold or tag rule.
4. Confirm the UI policy summary and risk ordering are accurate.
5. Run `npm run agent:check`.

## Add or modify a sample case

1. Use the unions and interfaces in `src/types.ts`; do not weaken a type to fit
   invalid fixture data.
2. Use a unique `CASE-<number>` identifier and a known support status, customer
   segment, and severity.
3. Use an engineering-team label for `ownerTeam`, express money as
   `revenueRiskUsd`, and express elapsed time as `lastActivityHours`.
4. Choose tags and values that exercise an intentional routing scenario.
5. Verify the case's owner, action, score, and ordering in the UI.

## Make a UI-only change

1. Keep routing and policy calculations out of `App.tsx`.
2. Preserve semantic `main`, `section`, `article`, `dl`, and button elements
   where they describe the content correctly.
3. Preserve accessible names, visible active state, keyboard interaction, and
   responsive behavior.
4. Run type checking and the production build, then manually inspect the UI.

## Prepare a pull request

1. Review the diff for accidental files, generated output, secrets, and
   unrelated changes.
2. Run `npm run agent:check`.
3. Summarize the behavior and affected architecture boundaries.
4. State routing, policy, ownership, data, and UI impact as applicable.
5. Include verification commands and outcomes; disclose skipped checks and
   residual risks.
