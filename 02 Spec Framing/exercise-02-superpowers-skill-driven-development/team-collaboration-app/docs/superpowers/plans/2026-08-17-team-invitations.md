# Team Invitations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the team invitation lifecycle as three pure functions in `src/services/invitationService.ts` and expose it through a `Team Invitations` section in `src/App.tsx`.

**Architecture:** Three pure functions own every rule and return a new `InvitationState` on success or the untouched input state on rejection. `src/App.tsx` holds that state in local React state and delegates every action to the service, so no lifecycle rule exists in two places.

**Tech Stack:** TypeScript 5.9, React 19, Vite 7, `node --test` with `--experimental-strip-types` for the protected suite.

**Spec:** `docs/superpowers/specs/2026-08-17-team-invitations-design.md`

## Global Constraints

- The acceptance suite is `tests/invitationService.test.ts`. It is protected by `scripts/challenge-integrity.json` and must not be edited.
- `tsconfig.json`, `package.json`, and everything under `scripts/` are protected. Do not modify them.
- `src/services/invitationService.ts` must import types only. A runtime import of a sibling module breaks resolution under `node --test`, because `tsconfig.json` does not set `allowImportingTsExtensions` and cannot be changed.
- Never import or reuse `src/legacy/quickInvite.ts`.
- No function may mutate its `state` argument. A rejected action returns the received `state` reference unchanged.
- All types come from `src/types.ts`. Do not declare new interfaces that duplicate them.
- The verification command for the lifecycle is `npm run test:invitations`. The full gate is `npm run agent:check`.
- Expiry boundary: `Date.parse(expiresAt) <= Date.parse(now)` means expired.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/services/invitationService.ts` | Modify. All lifecycle rules. Exports `createInvitation`, `acceptInvitation`, `revokeInvitation`. Currently throws. |
| `src/App.tsx` | Modify. Renders the `Team Invitations` section and delegates to the service. Currently renders only the member grid. |
| `tests/invitationService.test.ts` | Read only. Sixteen protected cases; the acceptance criterion. |
| `src/types.ts` | Read only. Supplies every type. |
| `docs/invitation-contract.md` | Read only. The behavioral contract. |

---

### Task 1: Confirm the suite fails against the starter

**Files:**
- Test: `tests/invitationService.test.ts` (read only, do not edit)

**Interfaces:**
- Consumes: nothing
- Produces: a recorded failing baseline for `evidence/tdd.md`

- [ ] **Step 1: Read the acceptance suite**

Read `tests/invitationService.test.ts` in full. It is the specification. Note that `scripts/run-invitation-tests.mjs` short-circuits while `src/services/invitationService.ts` contains the string `Invitation lifecycle is not implemented`, so the starter produces a gate refusal rather than sixteen individual failures.

- [ ] **Step 2: Run the suite and verify it fails**

Run: `npm run test:invitations`

Expected: exit code 1, with

```
Invitation tests failed: implement createInvitation, acceptInvitation, and revokeInvitation in src/services/invitationService.ts.
```

Save the verbatim output. It becomes the Red section of `evidence/tdd.md`.

- [ ] **Step 3: Do not commit**

No files changed. Proceed to Task 2.

---

### Task 2: Implement `createInvitation`

**Files:**
- Modify: `src/services/invitationService.ts:1-19` (replace the throwing stubs and the import block)
- Test: `tests/invitationService.test.ts` (protected; run, do not edit)

**Interfaces:**
- Consumes: `InvitationState`, `CreateInvitationInput`, `InvitationActionResult`, `InvitationErrorCode`, `TeamInvitation` from `../types`
- Produces: `createInvitation(state: InvitationState, input: CreateInvitationInput): InvitationActionResult`, plus module-private `normalizeEmail(email: string): string`, `isExpired(invitation: TeamInvitation, now: string): boolean`, `reject(state: InvitationState, code: InvitationErrorCode): InvitationActionResult`, and `authorize(state: InvitationState, actorId: string): boolean`, all four used by Tasks 3 and 4

- [ ] **Step 1: Replace the import block and add the helpers**

Replace lines 1 through 7 of `src/services/invitationService.ts` with:

```typescript
import type {
  AcceptInvitationInput,
  CreateInvitationInput,
  InvitationActionResult,
  InvitationErrorCode,
  InvitationState,
  RevokeInvitationInput,
  TeamInvitation
} from "../types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAY_MS = 24 * 60 * 60 * 1000;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isExpired(invitation: TeamInvitation, now: string) {
  return Date.parse(invitation.expiresAt) <= Date.parse(now);
}

function reject(state: InvitationState, code: InvitationErrorCode): InvitationActionResult {
  return { ok: false, state, code };
}

function authorize(state: InvitationState, actorId: string) {
  // Mirrors canManageInvitations in ./teamPolicy; kept inline so the test runner
  // can load this module without a runtime cross-module import extension.
  const actor = state.members.find((member) => member.id === actorId);
  return actor?.status === "active" && state.policy.inviteRoles.includes(actor.role);
}
```

`reject` returns the received `state` reference, which is how the no-mutation guarantee holds on every rejection path.

- [ ] **Step 2: Replace the `createInvitation` stub**

```typescript
export function createInvitation(state: InvitationState, input: CreateInvitationInput): InvitationActionResult {
  if (!authorize(state, input.actorId)) return reject(state, "UNAUTHORIZED");
  if (input.role !== "member" && input.role !== "guest") return reject(state, "INVALID_ROLE");
  if (input.role === "guest" && !state.policy.allowGuestInvites) return reject(state, "GUEST_DISABLED");

  const email = normalizeEmail(input.email);
  if (!EMAIL_PATTERN.test(email)) return reject(state, "INVALID_EMAIL");
  if (state.members.some((member) => normalizeEmail(member.email) === email)) return reject(state, "MEMBER_EXISTS");

  const blocking = state.invitations.some(
    (invitation) =>
      normalizeEmail(invitation.email) === email &&
      invitation.status === "pending" &&
      !isExpired(invitation, input.now)
  );
  if (blocking) return reject(state, "INVITATION_PENDING");
  if (state.invitations.some((invitation) => invitation.id === input.invitationId)) {
    return reject(state, "DUPLICATE_INVITATION_ID");
  }

  const invitation: TeamInvitation = {
    id: input.invitationId,
    email,
    role: input.role,
    invitedBy: input.actorId,
    createdAt: input.now,
    expiresAt: new Date(Date.parse(input.now) + state.policy.defaultInviteExpiryDays * DAY_MS).toISOString(),
    status: "pending"
  };

  return {
    ok: true,
    state: { ...state, invitations: [...state.invitations, invitation] },
    invitation
  };
}
```

The check order is fixed by the spec: authorize, then role validity, then guest policy, then email shape, then existing member, then unexpired pending duplicate, then duplicate identifier.

- [ ] **Step 3: Run the suite**

Run: `npm run test:invitations`

Expected: the nine create-related cases pass. The accept and revoke cases still fail with `Invitation lifecycle is not implemented`, because Tasks 3 and 4 have not run. This is the expected intermediate state.

- [ ] **Step 4: Commit**

```bash
git add src/services/invitationService.ts
git commit -m "feat(invitations): implement createInvitation with authorization, guest policy, normalization, and expiry"
```

---

### Task 3: Implement `acceptInvitation`

**Files:**
- Modify: `src/services/invitationService.ts` (replace the `acceptInvitation` stub)
- Test: `tests/invitationService.test.ts` (protected; run, do not edit)

**Interfaces:**
- Consumes: `reject`, `isExpired` from Task 2
- Produces: `acceptInvitation(state: InvitationState, input: AcceptInvitationInput): InvitationActionResult`

- [ ] **Step 1: Replace the `acceptInvitation` stub**

```typescript
export function acceptInvitation(state: InvitationState, input: AcceptInvitationInput): InvitationActionResult {
  const invitation = state.invitations.find((candidate) => candidate.id === input.invitationId);
  if (!invitation) return reject(state, "INVITATION_NOT_FOUND");
  if (invitation.status !== "pending") return reject(state, "INVITATION_FINAL");
  if (isExpired(invitation, input.now)) return reject(state, "INVITATION_EXPIRED");
  if (state.members.some((member) => member.id === input.memberId)) return reject(state, "DUPLICATE_MEMBER_ID");

  const accepted: TeamInvitation = { ...invitation, status: "accepted" };

  return {
    ok: true,
    state: {
      ...state,
      members: [
        ...state.members,
        {
          id: input.memberId,
          name: invitation.email,
          email: invitation.email,
          role: invitation.role,
          status: "active",
          lastActiveDays: 0
        }
      ],
      invitations: state.invitations.map((candidate) => (candidate.id === accepted.id ? accepted : candidate))
    },
    invitation: accepted
  };
}
```

Finality is checked before expiry so a revoked invitation that has also passed its expiry reports `INVITATION_FINAL`, the more specific reason. The new member's `name` is the normalized email, because the invitation carries no display name.

- [ ] **Step 2: Run the suite**

Run: `npm run test:invitations`

Expected: the create and accept cases pass. The two revoke cases still fail.

- [ ] **Step 3: Commit**

```bash
git add src/services/invitationService.ts
git commit -m "feat(invitations): implement acceptInvitation with single-use transition and member creation"
```

---

### Task 4: Implement `revokeInvitation` and reach green

**Files:**
- Modify: `src/services/invitationService.ts` (replace the `revokeInvitation` stub)
- Test: `tests/invitationService.test.ts` (protected; run, do not edit)

**Interfaces:**
- Consumes: `authorize`, `reject`, `isExpired` from Task 2
- Produces: `revokeInvitation(state: InvitationState, input: RevokeInvitationInput): InvitationActionResult`

- [ ] **Step 1: Replace the `revokeInvitation` stub**

```typescript
export function revokeInvitation(state: InvitationState, input: RevokeInvitationInput): InvitationActionResult {
  if (!authorize(state, input.actorId)) return reject(state, "UNAUTHORIZED");

  const invitation = state.invitations.find((candidate) => candidate.id === input.invitationId);
  if (!invitation) return reject(state, "INVITATION_NOT_FOUND");
  if (invitation.status !== "pending") return reject(state, "INVITATION_FINAL");
  if (isExpired(invitation, input.now)) return reject(state, "INVITATION_EXPIRED");

  const revoked: TeamInvitation = { ...invitation, status: "revoked" };

  return {
    ok: true,
    state: {
      ...state,
      invitations: state.invitations.map((candidate) => (candidate.id === revoked.id ? revoked : candidate))
    },
    invitation: revoked
  };
}
```

Authorization runs before the lookup so an unauthorized actor cannot probe which invitation identifiers exist.

- [ ] **Step 2: Run the suite and verify green**

Run: `npm run test:invitations`

Expected: exit code 0, `tests 16`, `pass 16`, `fail 0`. Save the verbatim output. It becomes the Green section of `evidence/tdd.md`.

- [ ] **Step 3: Commit**

```bash
git add src/services/invitationService.ts
git commit -m "feat(invitations): implement revokeInvitation and complete the lifecycle service"
```

---

### Task 5: Build the Team Invitations section

**Files:**
- Modify: `src/App.tsx:1-40` (whole file)
- Test: `tests/invitationService.test.ts` (protected; run to confirm no regression)

**Interfaces:**
- Consumes: `createInvitation`, `acceptInvitation`, `revokeInvitation` from Task 4; `members`, `workspacePolicy` from `src/data/team.ts`; `canManageInvitations`, `summarizeMemberAccess` from `src/services/teamPolicy.ts`
- Produces: the rendered `Team Invitations` section required by `docs/invitation-contract.md`

- [ ] **Step 1: Add imports and the error message map**

At the top of `src/App.tsx`:

```typescript
import { useState } from "react";

import { members, workspacePolicy } from "./data/team";
import { acceptInvitation, createInvitation, revokeInvitation } from "./services/invitationService";
import { canManageInvitations, summarizeMemberAccess } from "./services/teamPolicy";
import type { InvitationErrorCode, InvitationRole, InvitationState } from "./types";

const ERROR_MESSAGES: Record<InvitationErrorCode, string> = {
  UNAUTHORIZED: "That actor may not manage invitations.",
  INVALID_EMAIL: "Enter a valid email address.",
  INVALID_ROLE: "Only member and guest invitations are supported.",
  GUEST_DISABLED: "The workspace policy does not allow guest invitations.",
  MEMBER_EXISTS: "That email already belongs to a team member.",
  INVITATION_PENDING: "That email already has a pending invitation.",
  DUPLICATE_INVITATION_ID: "That invitation identifier is already in use.",
  INVITATION_NOT_FOUND: "That invitation no longer exists.",
  INVITATION_EXPIRED: "That invitation has expired.",
  INVITATION_FINAL: "That invitation was already accepted or revoked.",
  DUPLICATE_MEMBER_ID: "That member identifier is already in use."
};

const initialState: InvitationState = { members, invitations: [], policy: workspacePolicy };
```

`App.tsx` may import `teamPolicy` freely. The resolution constraint applies only to the service, which the `node --test` runner loads directly.

- [ ] **Step 2: Add component state and the shared apply helper**

```typescript
const [state, setState] = useState(initialState);
const [email, setEmail] = useState("");
const [role, setRole] = useState<InvitationRole>("member");
const [actorId, setActorId] = useState(members[0].id);
const [message, setMessage] = useState("");

function apply(result: ReturnType<typeof createInvitation>) {
  setState(result.state);
  setMessage(result.ok ? "" : ERROR_MESSAGES[result.code ?? "UNAUTHORIZED"]);
  return result.ok;
}

function onInvite(event: React.FormEvent) {
  event.preventDefault();
  const now = new Date().toISOString();
  const invited = apply(
    createInvitation(state, { invitationId: `INV-${Date.now()}`, actorId, email, role, now })
  );
  if (invited) setEmail("");
}
```

`apply` calling `setState(result.state)` on a rejection is safe because the service returns the received state reference, so React re-renders with an identical value.

- [ ] **Step 3: Render the section**

Change the member grid to iterate `state.members` and `state.policy` rather than the module imports, so accepted invitations appear as members. Then add, after the grid:

```tsx
<section className="invitations">
  <h2>Team Invitations</h2>
  <p>
    Invitations expire after {state.policy.defaultInviteExpiryDays} days. Guest invitations are{" "}
    {state.policy.allowGuestInvites ? "allowed" : "disabled"} by the workspace policy.
  </p>

  <form onSubmit={onInvite}>
    <label>
      Acting as
      <select value={actorId} onChange={(event) => setActorId(event.target.value)}>
        {state.members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name} ({member.role})
          </option>
        ))}
      </select>
    </label>
    <label>
      Email
      <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />
    </label>
    <label>
      Role
      <select value={role} onChange={(event) => setRole(event.target.value as InvitationRole)}>
        <option value="member">member</option>
        <option value="guest">guest</option>
      </select>
    </label>
    <button type="submit">Send invitation</button>
  </form>

  {message ? <p role="alert">{message}</p> : null}

  {state.invitations.length === 0 ? (
    <p>No invitations yet.</p>
  ) : (
    <ul>
      {state.invitations.map((invitation) => (
        <li key={invitation.id}>
          <span>
            {invitation.email} &middot; {invitation.role} &middot; {invitation.status} &middot; expires{" "}
            {invitation.expiresAt}
          </span>
          {invitation.status === "pending" ? (
            <>
              <button
                type="button"
                onClick={() =>
                  apply(
                    acceptInvitation(state, {
                      invitationId: invitation.id,
                      memberId: `USR-${Date.now()}`,
                      now: new Date().toISOString()
                    })
                  )
                }
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() =>
                  apply(
                    revokeInvitation(state, {
                      invitationId: invitation.id,
                      actorId,
                      now: new Date().toISOString()
                    })
                  )
                }
              >
                Revoke
              </button>
            </>
          ) : null}
        </li>
      ))}
    </ul>
  )}
</section>
```

The actor selector exists so the authorization rule is demonstrable: switching to Iris Chen (member) or Owen Brooks (suspended guest) makes invitation attempts fail with a visible reason.

- [ ] **Step 4: Verify nothing regressed**

Run: `npm run test:invitations`

Expected: exit code 0, 16 pass. The service was not touched by this task.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat(invitations): add the Team Invitations section wired to the lifecycle service"
```

---

### Task 6: Full verification gate

**Files:**
- No source changes. Verification only.

**Interfaces:**
- Consumes: the completed service and interface from Tasks 4 and 5
- Produces: recorded output for `evidence/after.md` and `evidence/review.md`

- [ ] **Step 1: Install dependencies if `tsc` is missing**

Run: `npm install --no-audit --no-fund`

The `typecheck` and `build` steps of `agent:check` need the local TypeScript and Vite binaries.

- [ ] **Step 2: Run the lifecycle suite**

Run: `npm run test:invitations`

Expected: exit code 0, 16 pass, 0 fail.

- [ ] **Step 3: Run the full gate**

Run: `npm run agent:check`

Expected: `lint-check passed`, `agent-check passed`, `format-check passed`, a clean `tsc -b`, and a successful `vite build`. A failure in `agent-check` means a protected file was modified; revert it rather than adapting to it.

- [ ] **Step 4: Run submission verification**

Run: `npm run submission:verify`

Expected: it reports missing `evidence/*` files until the evidence pack is written. Every other class of failure — protected file changed, service still throwing, interface not wired to the service — is a real defect to fix now.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A src/
git commit -m "fix(invitations): resolve verification findings"
```

Skip if nothing changed.

---

## Self-Review

**Spec coverage.** Module boundary → Task 2 Step 1. Immutability → Tasks 2, 3, 4 (spread copies; `reject` returns the received reference). Authorization → Task 2 `authorize`, applied in Tasks 2 and 4. Check ordering → Tasks 2, 3, 4, each ordered as the spec fixes it. Normalization and duplicates → Task 2 Step 2. Target role and guest policy → Task 2 Step 2. Expiry → Task 2 `isExpired` and the `expiresAt` computation. Single-use transitions → Tasks 3 and 4. Error handling → Task 5 Step 1 (`ERROR_MESSAGES` covers all eleven codes). User interface → Task 5. Testing → Tasks 1, 4, 6.

**Placeholder scan.** Every code step carries the actual code. No deferred steps.

**Type consistency.** `normalizeEmail`, `isExpired`, `reject`, and `authorize` are defined once in Task 2 and referenced by the same names in Tasks 3 and 4. `InvitationActionResult`, `TeamInvitation`, `InvitationState`, `InvitationRole`, and `InvitationErrorCode` are used exactly as declared in `src/types.ts`. The `apply` helper in Task 5 accepts `ReturnType<typeof createInvitation>`, which is `InvitationActionResult`, the return type of all three service functions.
