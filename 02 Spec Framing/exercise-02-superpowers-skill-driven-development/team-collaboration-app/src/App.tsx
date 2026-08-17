import { useState } from "react";

import { members, workspacePolicy } from "./data/team";
import { acceptInvitation, createInvitation, revokeInvitation } from "./services/invitationService";
import { canManageInvitations, summarizeMemberAccess } from "./services/teamPolicy";
import type { InvitationActionResult, InvitationErrorCode, InvitationRole, InvitationState } from "./types";

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

export default function App() {
  const [state, setState] = useState(initialState);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InvitationRole>("member");
  const [actorId, setActorId] = useState(members[0].id);
  const [message, setMessage] = useState("");

  function apply(result: InvitationActionResult) {
    // A rejected result carries the original state by value, so this is a no-op
    // on failure: invitation and member data cannot change on a rejected action.
    setState(result.state);
    setMessage(result.ok ? "" : result.code ? ERROR_MESSAGES[result.code] : "That action could not be completed.");
    return result.ok;
  }

  function onInvite(event: React.FormEvent) {
    event.preventDefault();
    const now = new Date().toISOString();
    const invited = apply(
      createInvitation(state, { invitationId: `INV-${crypto.randomUUID()}`, actorId, email, role, now })
    );
    if (invited) setEmail("");
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Workspace admin</p>
        <h1>Team collaboration console</h1>
        <p>Members, roles, and the invitation lifecycle for this workspace.</p>
      </section>

      <section className="member-grid">
        {state.members.map((member) => (
          <article className="member-card" key={member.id}>
            <div>
              <p className="eyebrow">{member.id}</p>
              <h2>{member.name}</h2>
            </div>
            <p>{summarizeMemberAccess(member)}</p>
            <dl>
              <div>
                <dt>Role</dt>
                <dd>{member.role}</dd>
              </div>
              <div>
                <dt>Can manage invites</dt>
                <dd>{canManageInvitations(member, state.policy) ? "yes" : "no"}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{member.status}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

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

        {/* Rendered unconditionally so assistive technology has the live region
            in the DOM before a message arrives. */}
        <p role="alert" aria-live="polite">
          {message}
        </p>

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
                {/* Rendered for every row, including finalized ones. Hiding them
                    would put the single-use rule in a second place; letting the
                    service reject keeps one owner for it and makes
                    INVITATION_FINAL reachable. */}
                <button
                  type="button"
                  onClick={() =>
                    apply(
                      acceptInvitation(state, {
                        invitationId: invitation.id,
                        memberId: `USR-${crypto.randomUUID()}`,
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
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
