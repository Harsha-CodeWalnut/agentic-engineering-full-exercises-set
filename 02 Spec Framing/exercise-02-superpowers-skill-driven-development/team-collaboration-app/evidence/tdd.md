# Test-Driven Development Evidence

The acceptance suite `tests/invitationService.test.ts` is protected by
`scripts/challenge-integrity.json` and holds sixteen cases. It is the
specification for this feature, so the red phase means running that suite
against unimplemented production code and watching it fail.

Skill: `superpowers:test-driven-development`.

## Red

### First attempt: the gate refuses to run the suite

```
$ npm run test:invitations

> team-collaboration-app@0.1.0 test:invitations
> node ./scripts/run-invitation-tests.mjs

Invitation tests failed: implement createInvitation, acceptInvitation, and revokeInvitation in src/services/invitationService.ts.

EXIT CODE: 1
```

This is a genuine failure, but not a sufficient red phase.
`scripts/run-invitation-tests.mjs` short-circuits while the service still
contains the starter string `Invitation lifecycle is not implemented`, so the
sixteen tests never executed. Watching a guard refuse to start is not watching
the tests fail.

### Second attempt: the sixteen tests fail individually

The starter marker was replaced with a shorter `throw new Error("not
implemented")` in all three stubs. No behavior was implemented. The suite then
ran for real:

```
$ npm run test:invitations

✖ authorized creation normalizes email and uses the configured expiry (0.732042ms)
✖ an active admin listed in inviteRoles may create an invitation (0.087209ms)
✖ members and suspended actors cannot create invitations (0.0845ms)
✖ target roles and the guest policy are enforced (0.080458ms)
✖ invalid email addresses are rejected without mutation (0.085958ms)
✖ existing member email comparison is case-insensitive (0.065ms)
✖ an unexpired pending invitation blocks a case-insensitive duplicate (0.451708ms)
✖ an expired pending invitation does not block a replacement (0.070125ms)
✖ duplicate invitation identifiers are rejected (0.083833ms)
✖ accepting a pending invitation adds one member and finalizes the invitation (0.151333ms)
✖ expired invitations cannot be accepted (0.082708ms)
✖ accepted and revoked invitations cannot be accepted (0.071542ms)
✖ acceptance rejects a duplicate member identifier (0.05175ms)
✖ an authorized actor may revoke a pending invitation only once (0.088583ms)
✖ unauthorized actors and expired invitations cannot be revoked (0.058458ms)
✖ unknown invitation identifiers are rejected (0.049458ms)

ℹ tests 16
ℹ pass 0
ℹ fail 16

EXIT CODE: 1
```

Every case failed on missing behavior rather than a typo or an import error.
This is the red state the implementation was written against.

## Green

Implementation proceeded in three commits, each verified against the suite
before being committed.

### After `createInvitation` (commit 4e042ac)

```
$ npm run test:invitations

ℹ tests 16
ℹ pass 9
ℹ fail 7
```

The nine creation cases pass. The seven acceptance and revocation cases still
fail, as predicted by the plan.

### After `acceptInvitation` (commit bfd85f3)

```
$ npm run test:invitations

ℹ tests 16
ℹ pass 13
ℹ fail 3
```

### After `revokeInvitation` (commit f3721fd)

```
$ npm run test:invitations

✔ authorized creation normalizes email and uses the configured expiry (2.804791ms)
✔ an active admin listed in inviteRoles may create an invitation (0.168834ms)
✔ members and suspended actors cannot create invitations (0.220916ms)
✔ target roles and the guest policy are enforced (0.616583ms)
✔ invalid email addresses are rejected without mutation (0.145458ms)
✔ existing member email comparison is case-insensitive (0.077708ms)
✔ an unexpired pending invitation blocks a case-insensitive duplicate (0.128375ms)
✔ an expired pending invitation does not block a replacement (0.094584ms)
✔ duplicate invitation identifiers are rejected (0.086417ms)
✔ accepting a pending invitation adds one member and finalizes the invitation (0.219792ms)
✔ expired invitations cannot be accepted (0.071875ms)
✔ accepted and revoked invitations cannot be accepted (0.075583ms)
✔ acceptance rejects a duplicate member identifier (0.050417ms)
✔ an authorized actor may revoke a pending invitation only once (0.14625ms)
✔ unauthorized actors and expired invitations cannot be revoked (0.075250ms)
✔ unknown invitation identifiers are rejected (0.075542ms)

ℹ tests 16
ℹ pass 16
ℹ fail 0

EXIT CODE: 0
```

### After the interface was wired (commit 0f652b0)

```
$ npm run test:invitations

ℹ tests 16
ℹ pass 16
ℹ fail 0
```

16 tests passed. The service was untouched by the interface task, so this
confirms no regression rather than new behavior.
