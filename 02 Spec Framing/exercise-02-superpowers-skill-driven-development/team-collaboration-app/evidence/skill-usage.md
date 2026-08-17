# Superpowers Skill Usage

- Superpowers version or commit: 6.3.0 (commit b36e0829c6d0140e93cfef2ca599b1b07d4a7797, installed from superpowers-marketplace)
- Design artifact: docs/superpowers/specs/2026-08-17-team-invitations-design.md
- Plan artifact: docs/superpowers/plans/2026-08-17-team-invitations.md
- Design approval: The design was presented section by section in chat and explicitly approved by the human partner before any planning skill ran and before any production code was written. Only after that approval was the design committed and the planning skill invoked.

## Workflow order

The skills below are listed in the order they ran. Each one finished, and
produced its artifact, before the next began.

### 1. superpowers:brainstorming

Classified the request as architectural rather than bounded: the invitation
lifecycle did not exist in the repository, so there was no existing flow to
change, and three new exported interfaces would become dependencies of a
protected test suite.

Asked three clarifying questions, one per message:

1. Where the interface should keep invitation state. Answer: local React state
   seeded from `src/data/team.ts`, no persistence.
2. How the service should obtain the actor authorization rule that already
   exists as `canManageInvitations` in `src/services/teamPolicy.ts`. Answer:
   inline the check with a comment naming the sibling, because a runtime import
   fails to resolve under the test runner and the fix would require editing a
   protected `tsconfig.json`.
3. What the interface should do with a rejected result. Answer: map the error
   code to a human sentence and leave state untouched.

Proposed three approaches (pure service with a thin interface; service plus
interface-side pre-validation; a reducer owning the lifecycle) and recommended
the first. Presented the design in ten sections covering the module boundary,
immutability, authorization, check ordering, normalization and duplicates,
target role and guest policy, expiry, single-use transitions, error handling,
and the interface.

Artifact: `docs/superpowers/specs/2026-08-17-team-invitations-design.md`,
committed as 6526466 before planning began.

### 2. superpowers:writing-plans

Turned the approved design into six bite-sized tasks, each with its own test
cycle and commit. Mapped the file structure first, then wrote every step with
the actual code rather than a description of it.

The plan carries a Global Constraints section recording the protected files, the
module resolution constraint on the service, the prohibition on reusing
`src/legacy/quickInvite.ts`, and the expiry boundary semantics.

Self-review confirmed spec coverage task by task, found no placeholders, and
confirmed that the four private helpers defined in Task 2 are referenced by the
same names in Tasks 3 and 4.

Artifact: `docs/superpowers/plans/2026-08-17-team-invitations.md`, committed as
087ac72.

### 3. superpowers:executing-plans

Selected over the subagent-driven alternative because Tasks 2, 3 and 4 edit the
same file in sequence. There was no independent work to parallelize, so fresh
subagent isolation would have added handoff cost without a matching benefit.

Tasks ran in order, each ending in its own commit:

- 4e042ac Task 2, `createInvitation`
- bfd85f3 Task 3, `acceptInvitation`
- f3721fd Task 4, `revokeInvitation`
- 0f652b0 Task 5, the `Team Invitations` interface

### 4. superpowers:test-driven-development

Applied across Tasks 1 through 5. The first red attempt only produced a gate
refusal from `scripts/run-invitation-tests.mjs`, which short-circuits while the
starter marker string is present, so the sixteen tests never ran. That was not
accepted as a red phase. The marker was neutralized while leaving the functions
unimplemented, and the suite was run again to watch all sixteen cases fail on
missing behavior.

Implementation then proceeded to green in three steps, 9 then 13 then 16 passing.
Full transcript in `evidence/tdd.md`.

### 5. superpowers:requesting-code-review

Dispatched a general-purpose reviewer subagent with the code-reviewer template,
given the commit range 087ac72..0f652b0, the behavioral contract, the approved
design, and the implementation plan. The reviewer worked read-only and did not
see this session's history.

Findings and their resolution are recorded in `evidence/review.md`.

### 6. superpowers:verification-before-completion

Ran the verification commands and confirmed their output before any completion
claim was made. Results are recorded in `evidence/after.md`.

## Artifacts generated

| Artifact | Produced by |
|---|---|
| `docs/superpowers/specs/2026-08-17-team-invitations-design.md` | brainstorming |
| `docs/superpowers/plans/2026-08-17-team-invitations.md` | writing-plans |
| `src/services/invitationService.ts` | the execution workflow, under test-driven development |
| `src/App.tsx` | the execution workflow, under test-driven development |
| `evidence/tdd.md` | test-driven development |
| `evidence/review.md` | requesting-code-review |
| `evidence/after.md` | verification-before-completion |
