# Comparison: Unstructured Run vs Superpowers Run

## Why the two runs are comparable

Both runs used the same agent, the same model, the same tool set, the same
permissions, the same time limit, and the same feature request, recorded field
by field in `evidence/before.md` and `evidence/after.md`. Both are first
attempts; neither was rerun after seeing its result. Both started from the same
commit, `f714944`, with `src/services/invitationService.ts` throwing and
`src/App.tsx` carrying no invitation interface. The before run's changes were
reverted with `git checkout --` before the after run began, so the second run
started from an identical tree rather than an edited one.

The one condition that is not identical, and that would be dishonest to omit:
the two runs happened in the same session, so the after run began with the
before run's reading of `tests/invitationService.test.ts` already in context.
A cold second session would have had to rediscover the check ordering. This
makes the comparison conservative rather than flattering. It understates the
gap, because the unstructured run's chief weakness is that it derived its rules
from the test file, and the structured run had that same information available
and still produced a design that stands on its own.

## What actually changed

Both runs produce 16 of 16 passing tests. The difference is not whether the
feature works. It is whether anyone can tell why it works.

### Authorization

Before: the rule was written directly into each function. Nothing recorded why
authorization runs before the invitation lookup in `revokeInvitation`, so a
later editor reordering the checks for readability would have silently created
an enumeration oracle, letting an unauthorized actor learn which invitation
identifiers exist by distinguishing `UNAUTHORIZED` from `INVITATION_NOT_FOUND`.

After: `superpowers:brainstorming` forced the check ordering into an explicit
design section with the security reason attached, and
`superpowers:writing-plans` repeated the ordering as a fixed block in each task.
The constraint now survives the person who wrote it.

### Duplicate prevention and email normalization

Before: normalization was applied correctly, but only because the protected
suite happened to assert it with `" IRIS@EXAMPLE.TEST "`. Nothing stated that
the normalized form is also what gets stored, or that the member comparison and
the pending-invitation comparison must use the same normalization.

After: the design states both, so the invariant is checkable without reading
the tests.

### Guest policy

Before: guest handling was correct but undocumented, and the ordering choice
(role validity before guest policy, so an invalid role reports the more specific
code) was accidental rather than decided.

After: stated as a deliberate ordering decision with its reason.

### Expiry

Before: the boundary semantics — `expiresAt <= now` counts as expired — were
inferred from a single test case and never written down. The consequence that an
expired pending invitation stops blocking a replacement, which prevents a stale
invitation from permanently locking an email out of the workspace, was never
articulated.

After: stated explicitly, along with the requirement that the same boundary
apply uniformly across create, accept and revoke so an invitation is never live
for one operation and dead for another.

### Single-use accept and revoke

Before: finality was checked before expiry, which is correct, but by chance. No
record explained that a revoked invitation which has since expired should report
`INVITATION_FINAL` rather than `INVITATION_EXPIRED`.

After: stated as a decision about which error is more useful to the caller.

### State mutation on rejection

Before: the no-mutation guarantee lived entirely in the service. The interface
called `setState` on every result, so nothing at the call site showed that a
rejected action changes nothing; the property held only because the service
returned the original reference.

After: `superpowers:brainstorming` surfaced this as a question rather than an
assumption, and the interface now carries a comment at the `apply` boundary
explaining why the call is a no-op on failure.

## Process differences that produced those outcomes

**The red phase caught a real gap.** The unstructured run never watched the
tests fail; it wrote the implementation and ran the suite once, green.
`superpowers:test-driven-development` required watching the failure, which
exposed that `scripts/run-invitation-tests.mjs` short-circuits on the starter
marker string and never runs the sixteen tests at all. The first red attempt was
a gate refusal, not a test failure. Without the discipline, that would have gone
unnoticed and "the tests failed first" would have been a false claim.

**Design pressure caught a real defect before it was written.** The
unstructured run imported `canManageInvitations` from
`src/services/teamPolicy.ts` and discovered only by running the suite that the
import breaks module resolution under `node --test`. In the structured run the
same tension surfaced as a design question answered before any code existed, and
the answer is recorded in both the design and the plan's Global Constraints, so
the next person does not repeat the import.

**Review examined decisions, not just output.** The unstructured run had no
review step at all. `superpowers:requesting-code-review` dispatched a reviewer
that never saw this session's reasoning, so it evaluated the code as written
rather than as intended. Findings and resolutions are in `evidence/review.md`.

**Verification was defined rather than remembered.** The unstructured run ran
the two commands it happened to think of and never ran
`npm run submission:verify`. `superpowers:verification-before-completion`
required running the commands and confirming their output before any claim of
completion.

## Honest assessment of the gap

On this exercise the unstructured run reached a correct implementation. That is
a real result and should not be dismissed. But it reached it by treating an
unusually complete protected test suite as the specification. Strip the suite
down to a handful of happy-path cases and the same run would have shipped an
undocumented expiry boundary, an accidental check ordering with a security
consequence, and an interface whose no-mutation behavior nobody could verify.

The Superpowers run produced the same passing tests plus a design and plan that
make each of those decisions inspectable, and it caught two concrete problems —
the short-circuiting test gate and the module resolution failure — before they
could be mistaken for success.
