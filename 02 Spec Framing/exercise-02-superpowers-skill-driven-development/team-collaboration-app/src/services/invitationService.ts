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
  // NFKC folds compatibility forms so that a case-folded "İRIS" cannot slip past
  // the duplicate check as a distinct address from the stored "iris".
  return email.trim().toLowerCase().normalize("NFKC");
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

/**
 * Preconditions shared by all three exports:
 * - `input.now` must be a parseable date string. An unparseable value makes the
 *   expiry computation throw a RangeError rather than return a result, because
 *   `InvitationErrorCode` has no code for a malformed timestamp and reporting a
 *   misleading one would be worse than failing loudly.
 * - `policy.defaultInviteExpiryDays` must be positive. Zero or less produces an
 *   invitation that is already expired at the boundary instant.
 */
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
