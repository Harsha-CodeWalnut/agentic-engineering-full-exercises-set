# After Run: Superpowers-Driven Implementation

Superpowers 6.3.0 was installed and enabled for this run. The workflow was
driven by its skills in the order the exercise requires: design, approval,
plan, failing test, implementation, review, verification.

## Session conditions

- Agent: Claude Code
- Model: claude-opus-5[1m]
- Tools: Read, Write, Edit, Bash, Grep, Glob, Agent (subagent dispatch)
- Permissions: auto mode with classifier gating on destructive git commands
- Time limit: 60 min
- Attempt: 1
- Prompt: Add a Team Invitations section. An active owner or admin allowed by the workspace policy may invite an email as a member or guest. Guest invitations are allowed only when the workspace policy permits them. Prevent invitations for existing members or an email with a pending invitation. Invitations must use the configured expiry period and may be accepted or revoked only once. Rejected actions must not change invitation or member data.

## How Superpowers shaped the run

superpowers:brainstorming classified the request as architectural rather than
bounded, asked three clarifying questions one at a time, proposed three
approaches with trade-offs, and presented a ten-section design. Implementation
was blocked until the design was explicitly approved.

superpowers:writing-plans turned the approved design into six bite-sized tasks,
each carrying its own test cycle, actual code rather than descriptions, and a
Global Constraints section recording the protected files and the module
resolution limit.

superpowers:executing-plans was selected over the subagent-driven alternative
because three of the tasks edit the same file in sequence, leaving nothing to
parallelize.

superpowers:test-driven-development required watching the tests fail before any
production code. The first red attempt was rejected as insufficient: the runner
short-circuits on the starter marker string, so the sixteen tests never ran.
Neutralizing the marker while leaving the functions unimplemented produced a
genuine red of 16 failures, and implementation then moved to green in three
verified steps.

superpowers:requesting-code-review dispatched an independent reviewer that never
saw this session's reasoning. It returned three Important and eight Minor
findings, all resolved or recorded.

superpowers:verification-before-completion required running the commands and
reading their output before any completion claim.

## Verification output

```
$ npm run test:invitations

ℹ tests 16
ℹ pass 16
ℹ fail 0

EXIT: 0
```

```
$ npm run agent:check

lint-check passed
agent-check passed for Superpowers Skill-Driven Development; protected challenge files are unchanged.
format-check passed
✓ built in 444ms

EXIT: 0
```

```
$ npm run submission:verify

Submission verification passed: Superpowers workflow evidence, artifacts, implementation wiring, and challenge integrity are complete.

EXIT: 0
```

## Commits

```
6526466  docs(invitations): approved Team Invitations design
087ac72  docs(invitations): implementation plan from the approved design
4e042ac  feat(invitations): implement createInvitation                9 of 16 passing
bfd85f3  feat(invitations): implement acceptInvitation               13 of 16 passing
f3721fd  feat(invitations): implement revokeInvitation               16 of 16 passing
0f652b0  feat(invitations): add the Team Invitations section         16 of 16 passing
7e4d211  fix(invitations): resolve code review findings              16 of 16 passing
8288e55  fix(invitations): drop the decorative input placeholder     16 of 16 passing
```

The design was committed before the plan, and the plan before any production
code, so the artifact order is visible in history rather than only asserted.

The patch is recorded in `evidence/after.patch`.

## What the workflow caught that the unstructured run did not

The short-circuiting test gate. The unstructured run never watched the suite
fail, so it never discovered that `scripts/run-invitation-tests.mjs` refuses to
execute the tests while the starter marker is present. Claiming a red phase
without that discovery would have been false.

The module resolution failure. The unstructured run imported
`canManageInvitations` from a sibling module and learned only by running the
suite that it breaks under the test runner. The structured run surfaced the same
tension as a design question answered before any code existed.

An unhandled `RangeError` on a malformed `now`, guessable invitation
identifiers under a possession-based acceptance model, and two error codes the
interface structurally could not surface. None of these are visible to the
protected suite; all three came from review.
