# Team Invitations Design

Date: 2026-08-17
Status: approved

## Problem

The workspace console renders members, roles, and a workspace policy, but has no
invitation lifecycle. An owner or admin needs to invite an email address as a
member or guest, and the invited person needs to accept. An authorized actor
needs to revoke an invitation that should no longer stand.

The rules are failure-prone in ways that corrupt membership data when they are
implemented casually: an unauthorized actor adding members, the same email
invited twice under different capitalization, an invitation accepted after it
expired, an invitation accepted twice, or a rejected action that leaves partial
changes behind. `src/legacy/quickInvite.ts` demonstrates the failure mode. It
pushes a member onto the array in place, with no authorization check, no
validation, and no invitation record. It is not reused here.

## Approach

Three pure functions own every rule. The user interface holds state, renders it,
and delegates. The boundary between them is the `InvitationActionResult` value.

Two alternatives were rejected. Pre-validating in the interface (greying out the
guest option when policy forbids it, hiding action buttons on finalized rows)
gives a better feel but gives every rule a second home, which is exactly what
the invitation contract prohibits. Folding the lifecycle into a `useReducer`
was rejected because the protected test suite imports the service directly, so
the rules must live in the service regardless, leaving the reducer a
pass-through layer.

## Module boundary

`src/services/invitationService.ts` exports:

- `createInvitation(state: InvitationState, input: CreateInvitationInput)`
- `acceptInvitation(state: InvitationState, input: AcceptInvitationInput)`
- `revokeInvitation(state: InvitationState, input: RevokeInvitationInput)`

Each returns `InvitationActionResult`. The module imports types only. Four
private helpers stay local to it: `normalizeEmail`, `isExpired`, `reject`, and
`authorize`.

The actor authorization rule already exists as `canManageInvitations` in
`src/services/teamPolicy.ts`, but it is inlined rather than imported. The
protected test suite runs under `node --test` with type stripping and resolves
relative specifiers by exact filename, while `tsconfig.json` does not enable
`allowImportingTsExtensions` and is a protected file that cannot be changed. A
runtime import of a sibling module therefore fails to resolve. The inlined check
carries a comment naming `teamPolicy` as the sibling copy so a future policy
change touches both.

## Immutability

Every function treats its `state` argument as frozen.

A successful action returns a new state object with spread-copied arrays and a
spread-copied invitation record. No property of the input graph is ever
assigned. A rejected action returns the same `state` reference it received,
which is deep-equal to the caller's original value by definition.

This is the property that keeps a rejected action from corrupting membership.
It is asserted on every rejection path in the protected suite.

## Authorization

An actor may create or revoke an invitation when all three hold:

1. The actor id matches a member in `state.members`.
2. That member has `status === "active"`.
3. That member's role appears in `state.policy.inviteRoles`.

A suspended owner is refused. A member or guest is refused. An unknown actor id
is refused.

Acceptance takes no actor id. The invitee is acting, and authorization is
carried by possession of the invitation identifier.

## Check ordering

Ordering decides which code a caller sees when several rules fail at once, so it
is fixed deliberately rather than left to chance:

```
create:  authorize -> role valid -> guest policy -> email valid
         -> member exists -> pending duplicate -> duplicate invitation id
accept:  found -> not final -> not expired -> duplicate member id
revoke:  authorize -> found -> not final -> not expired
```

Authorization runs first wherever it applies, so an unauthorized actor learns
nothing about whether a given invitation exists. Structural validation of the
input runs before lookups against state, so a malformed request is refused for
the reason the caller can act on.

## Normalization and duplicate prevention

Email addresses are trimmed and lowercased on entry. Both the existing-member
comparison and the pending-invitation comparison run through the same
normalization, so `" IRIS@EXAMPLE.TEST "` collides with the stored
`iris@example.test`. The normalized form is what gets stored on the invitation
and later on the created member.

Email shape is validated with `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, which refuses an
empty string, an address with no `@`, and an address with a doubled `@`.

A pending invitation blocks a duplicate only while it is unexpired. An expired
pending invitation does not block a replacement, so a stale invitation cannot
lock an email address out of the workspace permanently.

Invitation identifiers are unique. A create call reusing an existing identifier
is refused with `DUPLICATE_INVITATION_ID`, independent of the email involved.

## Target role and guest policy

Only `member` and `guest` are valid target roles; anything else is refused with
`INVALID_ROLE`. A `guest` target additionally requires
`policy.allowGuestInvites`, otherwise `GUEST_DISABLED`. Role validity is checked
before the guest policy so an invalid role reports the more specific reason.

## Expiry

`expiresAt` is computed as `now + policy.defaultInviteExpiryDays` days, in
milliseconds, serialized as ISO 8601. With the shipped policy of seven days, an
invitation created at `2026-08-09T10:00:00.000Z` expires at
`2026-08-16T10:00:00.000Z`.

The expiry test is `Date.parse(expiresAt) <= Date.parse(now)`. The boundary
instant counts as expired: an invitation whose `expiresAt` equals the current
instant can no longer be accepted or revoked. This choice is applied uniformly
so that the same invitation is never simultaneously live for one operation and
dead for another.

## Single-use transitions

An invitation is created `pending` and moves to `accepted` or `revoked`. Both
are terminal.

Any action against a non-pending invitation is refused with `INVITATION_FINAL`.
Finality is checked before expiry, so a revoked invitation that has since passed
its expiry reports the more specific reason rather than the incidental one.

Acceptance appends exactly one member: the normalized email as both `name` and
`email`, the role recorded on the invitation, `status: "active"`, and
`lastActiveDays: 0`. If the supplied member identifier already belongs to a
member, the acceptance is refused with `DUPLICATE_MEMBER_ID` and no member is
added.

## Error handling

Every one of the eleven `InvitationErrorCode` values is reachable, and each maps
to one human-readable sentence in the interface. A rejection carries the
original state and a code, and never an invitation.

The interface never calls `setState` on a rejected result. The no-mutation
guarantee is therefore visible at the call site rather than resting only on the
service returning an unchanged value.

## User interface

`src/App.tsx` gains a `Team Invitations` section below the member grid,
containing:

- an actor selector listing current members, so the authorization rule is
  demonstrable by switching to a member or a suspended owner
- an email field and a role selector for `member` or `guest`
- a submit control that calls `createInvitation`
- a list of invitations showing email, role, status, and expiry, with Accept and
  Revoke controls on every row including finalized ones. Hiding the controls on
  non-pending rows would place the single-use rule in the interface as well as
  the service, which is the duplication this design rejects above. Letting the
  service refuse a finalized invitation keeps one owner for the rule and makes
  `INVITATION_FINAL` reachable by a user rather than only by a test.
- an alert region rendering the message for the most recent rejection

Invitation state lives in local React state, seeded from `src/data/team.ts` with
an empty invitation list. Each action calls the service and replaces state with
the returned value on success. Identifiers are generated as `INV-${Date.now()}`
and `USR-${Date.now()}`; the current instant comes from
`new Date().toISOString()`.

Persistence across reloads is out of scope. Nothing in the invitation contract
or the protected suite requires it.

## Preconditions

Added after code review, which found two inputs the original design left
unaddressed.

`input.now` must be a parseable date string. An unparseable value makes the
expiry computation throw a `RangeError` rather than return an
`InvitationActionResult`. `InvitationErrorCode` is fixed by the protected
`src/types.ts` and has no code for a malformed timestamp, so the choice is
between failing loudly and reporting a misleading reason. Failing loudly is the
lesser harm, and the precondition is documented on the module.

`policy.defaultInviteExpiryDays` must be positive. Zero or less produces an
invitation that is already expired at its boundary instant, which then does not
block a replacement, so the same address can be invited repeatedly and every
invitation arrives dead.

## Testing

`tests/invitationService.test.ts` holds sixteen cases and is protected by the
challenge integrity manifest, so it is specification rather than something to
edit. It is the acceptance criterion for this design.

The suite is run against the throwing starter first, to confirm it fails, before
any production code is written. Implementation then proceeds until the suite
passes, followed by `npm run agent:check` for lint, format, typecheck, and
build.
