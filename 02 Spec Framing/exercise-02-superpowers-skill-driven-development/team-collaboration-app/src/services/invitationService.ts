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

export function acceptInvitation(_state: InvitationState, _input: AcceptInvitationInput): InvitationActionResult {
  throw new Error("not implemented");
}

export function revokeInvitation(_state: InvitationState, _input: RevokeInvitationInput): InvitationActionResult {
  throw new Error("not implemented");
}
