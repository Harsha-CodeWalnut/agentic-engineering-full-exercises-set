# Before Run: Unstructured Implementation

This run was performed without Superpowers. The plugin was not installed, so no
skill-driven design, planning, or test-first discipline was applied. The agent
received the feature request and implemented directly.

## Session conditions

- Agent: Claude Code
- Model: claude-opus-5[1m]
- Tools: Read, Write, Edit, Bash, Grep, Glob, Agent (subagent dispatch)
- Permissions: auto mode with classifier gating on destructive git commands
- Time limit: 60 min
- Attempt: 1
- Prompt: Add a Team Invitations section. An active owner or admin allowed by the workspace policy may invite an email as a member or guest. Guest invitations are allowed only when the workspace policy permits them. Prevent invitations for existing members or an email with a pending invitation. Invitations must use the configured expiry period and may be accepted or revoked only once. Rejected actions must not change invitation or member data.

## What the run produced

The agent read `docs/invitation-contract.md`, `src/types.ts`, and the protected
suite `tests/invitationService.test.ts`, then wrote `createInvitation`,
`acceptInvitation`, and `revokeInvitation` in a single pass, followed by a
`Team Invitations` section in `src/App.tsx`.

The patch is recorded in `evidence/before.patch`.

Result of `npm run test:invitations`: 16 pass, 0 fail.
Result of `npm run agent:check`: lint, test, format, typecheck, and build all pass.

## Observations

The implementation worked, but the process left no verifiable trail:

- No design artifact. Rule ordering (authorization before role validation before
  guest policy before email validation) was inferred by reading the assertion
  order inside the protected test file rather than derived from the contract.
  The tests acted as the specification, so the design decisions were never
  stated anywhere a reviewer could check them.
- No implementation plan. File-touch order was decided as the run went. The
  `src/App.tsx` wiring was treated as an afterthought once the service passed,
  not as a planned step with its own acceptance condition.
- No red phase. The agent wrote production code first and ran the suite once,
  afterwards. The first execution of `npm run test:invitations` in this run was
  already a green run against a completed implementation, so there is no
  evidence the tests can fail for the right reason.
- Reuse was mishandled on the first attempt. The agent imported
  `canManageInvitations` from `src/services/teamPolicy.ts`, which broke module
  resolution under the Node test runner, and only discovered the failure by
  running the suite. A design pass over the module layout would have caught the
  extension-resolution constraint before any code was written.
- Subagent dispatch was available and never used. No independent reviewer saw
  the work, so nothing challenged the check ordering, the expiry
  boundary condition (`expiresAt <= now` treated as expired), or the decision to
  set a new member's `name` to their normalized email.
- Verification was ad hoc. The agent ran the two commands it happened to
  remember and did not run `npm run submission:verify` at all.

The correctness of this run depended on the protected suite being unusually
complete. Against a thinner suite, the unstated rule ordering and the untested
expiry boundary would have been silent defects.
