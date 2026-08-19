export interface BillingCustomer {
  id: string;
  ownerUserId: string;
}

export interface Workspace {
  id: string;
  billingCustomerId: string;
  plan: "Starter" | "Growth" | "Enterprise";
  dataResidency: "standard" | "restricted";
}

export interface WorkspaceMembership {
  workspaceId: string;
  userId: string;
  role: "member" | "admin";
  status: "active" | "suspended";
}

export interface ExportAuthorizationContext {
  callerUserId: string;
  billingCustomer: BillingCustomer;
  workspace: Workspace;
  membership: WorkspaceMembership | null;
}

/**
 * Authorize AI-history export only for an active admin membership on the
 * same eligible workspace. Billing-customer ownership is not a substitute.
 */
export function canExportAIHistory(context: ExportAuthorizationContext) {
  const { callerUserId, workspace, membership } = context;

  if (!membership) {
    return false;
  }

  const eligibleWorkspace =
    workspace.plan === "Enterprise" && workspace.dataResidency === "standard";

  const authorizedAdministrator =
    membership.status === "active" &&
    membership.role === "admin" &&
    membership.userId === callerUserId &&
    membership.workspaceId === workspace.id;

  return eligibleWorkspace && authorizedAdministrator;
}
