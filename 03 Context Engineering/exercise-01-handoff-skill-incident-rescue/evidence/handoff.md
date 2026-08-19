# Handoff: INC-2047 automatic escalation

Next session purpose: first-attempt implementation of the automatic escalation fix. Read this file, then open only the paths it names. Do not reconstruct the prior chat.

## Incident request

Complete the automatic escalation fix for at-risk cases. Use the current SLA rules, preserve existing ownership and manual escalation behaviour, and keep the queue totals and saved workflow state consistent.

Working app: `03 Context Engineering/exercise-01-handoff-skill-incident-rescue/bugfix-context-app`

## Authoritative sources

Read these before editing code:

- `bugfix-context-app/docs/current-sla-policy.md` — approved Support Operations policy, version 3.1, effective 2026-07-01. This is the production rule for automatic customer escalation.
- `bugfix-context-app/docs/workflow-api-contract.md` — current contract for dashboard and verification exports.
- `bugfix-context-app/incidents/INC-2047.md` — open incident, limited to the automatic escalation policy and its workflow API integration.
- `bugfix-context-app/scripts/run-incident-tests.mjs` — executable expected behavior for the 48-hour boundary, owner preservation, manual cases, persistence, totals, and clone safety.
- `bugfix-context-app/src/services/escalationPolicy.ts` and `bugfix-context-app/src/services/workflowApi.ts` — partial implementation to finish, not to replace wholesale.
- `bugfix-context-app/src/data/workItems.ts` — seeded queue used by persistence checks.

Verified production rule from `docs/current-sla-policy.md`: a case is automatically escalated only when priority is High, waiting time is 48 hours or greater, the case is not already escalated, and the case was not manually escalated. Automatic escalation changes only `status` to `Escalated` and `escalationMode` to `automatic`. Existing owner, note, identity, priority, waiting time, score, due date, and tags stay as they are. Manual escalations stay unchanged. Re-running the process is idempotent. The process must save the resulting queue so a later fetch and the dashboard totals use that same state.

Verified API rule from `docs/workflow-api-contract.md`: `runAutomaticEscalation()` applies the current policy, saves the resulting queue, and returns a copy. `fetchWorkItems()` returns a copy of saved state. Callers must not receive mutable references. Public names stay `fetchWorkItems`, `saveAction`, `runAutomaticEscalation`, and `collectEvidence`. When a user manually selects Escalated, `saveAction` records `escalationMode` as `manual`. Leaving Escalated clears the mode. An existing automatic escalation remains automatic when note or owner is edited without leaving Escalated.

## Completed work already in the tree

- Escalation helpers exist and are wired from `runAutomaticEscalation()`.
- Non-High cases, already escalated cases, and `escalationMode === "manual"` are skipped.
- `saveAction` already preserves an existing automatic mode when status stays Escalated.
- `fetchWorkItems` and `saveAction` clone items, including tags.
- Dashboard `src/App.tsx` already calls `runAutomaticEscalation()` and renders returned items.

## Remaining work

1. Align `src/services/escalationPolicy.ts` with the approved 48-hour High-priority boundary in `docs/current-sla-policy.md`. Cases just below that boundary must stay queued.
2. Preserve owner and other case content during automatic escalation. Do not move ownership as part of the automatic path.
3. Persist the processed queue inside `runAutomaticEscalation()` so `fetchWorkItems()` returns the same items afterward. Queue totals must match that saved state. Seeded High cases at or beyond the boundary that are not manual should become automatic and remain so on a later fetch.

## Protected behavior

- Leave the manually escalated case unchanged, including its owner.
- Do not rename or remove public workflow exports.
- Do not mutate caller-held copies of queue state.
- Do not edit scoring, fixtures, verification scripts, `package.json`, incident markdown, or policy documents.

## Sources that are not production guidance

- `bugfix-context-app/docs/sla-rollout-proposal.md` — draft pilot. Not approved. Superseded by `docs/current-sla-policy.md`.
- `bugfix-context-app/docs/previous-agent-progress.md` — marks the incident Complete after a generic repository check. Incident behavior is still failing.
- `bugfix-context-app/docs/abandoned-fix.patch` — leftover draft-based edits already present in the partial implementation. Do not apply it again.
- `bugfix-context-app/docs/failed-test-output.txt` — QA evidence that boundary, owner, and saved totals still fail. The trailing export permission error is unrelated.
- `bugfix-context-app/docs/raw-session-history.md` — mixed notes. Do not load it as the requirement source for this session.

## Verification

From `bugfix-context-app` run:

`npm run test:incident`

Do not claim completion from a generic `npm test` or from dashboard display of a returned array. Confirm a later `fetchWorkItems()` matches the saved automatic result. If you install dependencies, use `npm ci` in that app directory first.

## Suggested skills

- test-driven-development: the incident tests already exist in `scripts/run-incident-tests.mjs`; observe the failing contract, then make the smallest production change in the two service files.
- verification-before-completion: treat `npm run test:incident` exit code 0 as the only implementation done signal.
