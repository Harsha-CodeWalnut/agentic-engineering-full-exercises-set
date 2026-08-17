# Code Review

Skill: `superpowers:requesting-code-review`.

A general-purpose reviewer subagent was dispatched with the skill's
code-reviewer template. It received the commit range 087ac72..0f652b0, the
behavioral contract, the approved design, and the implementation plan. It did
not receive this session's history, so it evaluated the code as written rather
than as intended. It worked read-only and verified its claims by execution
rather than inspection alone.

Fixes were applied in commit 7e4d211.

## Strengths the reviewer confirmed

- The implementation matches the plan's code blocks verbatim across Tasks 2
  through 5. No silent deviations.
- The no-mutation guarantee holds. The reviewer probed it directly: no property
  assignment exists anywhere in the service, and `reject` returns the received
  reference.
- Authorization runs before any invitation lookup in both `createInvitation` and
  `revokeInvitation`, so an unauthorized actor cannot learn which invitation
  identifiers exist.
- `isExpired` is the single definition of the expiry rule and is the only
  expiry test used by create, accept, and revoke.
- `src/App.tsx` contains no lifecycle logic. `ERROR_MESSAGES` is typed as
  `Record<InvitationErrorCode, string>`, so a new code would fail typecheck
  rather than render undefined.
- No runtime sibling import in the service, no reference to `quickInvite`, all
  protected files unchanged.

## Findings and resolution

### Critical

None. Nothing in the range corrupted state, bypassed authorization, or violated
a stated hard constraint.

### Important

**1. A malformed `now` throws instead of returning a result.**
Severity: Important. `invitationService.ts` computed `expiresAt` from
`Date.parse(input.now)`. An unparseable value yields `NaN`, and `toISOString()`
then throws `RangeError: Invalid time value`, escaping the contract that every
function returns an `InvitationActionResult`. The reviewer confirmed this by
execution. It also noted the related asymmetry that `isExpired` with an
unparseable `expiresAt` evaluates `NaN <= x` as false, treating a corrupt record
as live forever.

Resolution: documented as a precondition rather than papered over.
`src/types.ts` is protected and has no code for a malformed timestamp, so
returning an existing code would tell the caller something specific and false. A
JSDoc block on the module now states that `input.now` must be parseable, and the
approved design carries a new Preconditions section recording the reasoning.
This was a gap in the design, not an implementation slip.

**2. Guessable identifiers under a possession-based authorization model.**
Severity: Important. `acceptInvitation` deliberately takes no actor check
because the invitee is not yet a member; capability is carried by possession of
the invitation identifier. The interface generated those identifiers as
`INV-${Date.now()}`, a 13-digit millisecond timestamp, which is enumerable by
anyone who knows roughly when an invitation was sent, with the distinct error
codes confirming hits. The same generator also risked genuine collisions for two
actions in the same millisecond.

Resolution: both generators now use `crypto.randomUUID()`. The constraint on
runtime imports applies to the service, not the interface, so the Web Crypto API
is available. One line each.

**3. Two error codes were structurally unreachable, and the mechanism hiding
them contradicted the design.**
Severity: Important. Accept and Revoke rendered only on pending rows, so
`INVITATION_FINAL` and `INVITATION_NOT_FOUND` had messages that could never
appear. More seriously, the design had rejected interface-side pre-validation on
the grounds that hiding action buttons on finalized rows gives every rule a
second home, and then prescribed exactly that in its interface section. The
finality rule lived in both the service and a JSX conditional.

Resolution: the buttons now render on every row and the service rejects with
`INVITATION_FINAL`. This is the option the design's own argument favors. The
design's interface section was corrected so its reasoning and its prescription
agree.

### Minor

**4. Non-positive `defaultInviteExpiryDays` creates a dead-on-arrival
invitation.** Confirmed by execution: with a zero-day policy the create
succeeds, the invitation is immediately expired, and because an expired pending
invitation does not block a replacement, the same address can be re-invited
without bound. Resolution: documented alongside the `now` precondition. The
shipped policy is seven days, and the policy is protected data.

**5. The email regex is shape-only.** It accepts `a@-.-` and `a@b..c`. All three
cases the contract names are handled correctly, and React escapes on render so
there is no injection path. Resolution: accepted as the pragmatic tradeoff, not
changed. Any real send path needs its own validation.

**6. `toLowerCase()` without Unicode normalization.** Confirmed: `İRIS@…` folds
to `i̇ris@…`, which does not match a stored `iris@…`, so it passes the
`MEMBER_EXISTS` check. These are genuinely distinct addresses at the SMTP layer,
so it is not a true duplicate-mailbox bypass. Resolution: fixed anyway, since
duplicate prevention is the feature's core purpose and the fix is
`.normalize("NFKC")`.

**7. `createdAt` stored unnormalized while `expiresAt` is normalized.**
Harmless for comparison; ugly in an export. Resolution: not changed, recorded
here.

**8. The `?? "UNAUTHORIZED"` fallback produced a misleading message.**
Unreachable today because the service always sets a code, but if it ever fired
it would assert something false about authorization. Resolution: replaced with a
neutral default.

**9. The alert region only existed while a message existed.** Assistive
technology announces `role="alert"` most reliably when the region is in the DOM
before the text arrives. Resolution: the region now renders unconditionally with
`aria-live="polite"`.

**10. The new section has no styling.** Resolution: not changed. Presentation is
not a contract requirement and `styles.css` carries no rules for the section.

**11. Handlers close over the render's `state`.** Safe across separate click
events because React re-renders in between. Resolution: not changed. The
reviewer explicitly did not call this a bug.

## Test gaps the reviewer identified

The protected suite cannot be edited, so these are recorded rather than closed:
accept-then-revoke is untested while revoke-then-accept is; a malformed `now`
and a non-positive expiry policy are both invisible to the suite; `createdAt` is
never asserted; the suite checks that the input is unmutated but never that the
returned state cannot alias back into it; and `src/App.tsx` has no automated
coverage at all, so findings 3, 8 and 9 were unverifiable by the gate.

## Verification after fixes

```
$ npm run test:invitations
ℹ tests 16
ℹ pass 16
ℹ fail 0

$ npm run agent:check
EXIT: 0
```

Reviewer's verdict before fixes: ready to merge with fixes. All three Important
findings are now resolved, and the Minor findings are either fixed or recorded
above with a reason.
