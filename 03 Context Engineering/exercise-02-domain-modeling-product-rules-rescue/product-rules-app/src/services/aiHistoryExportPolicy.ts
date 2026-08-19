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
 * AI history may be exported only by an active admin of the same Enterprise
 * workspace when data residency is standard. Billing ownership is not access.
 */
export function canExportAIHistory(context: ExportAuthorizationContext) {
  const { callerUserId, workspace, membership } = context;
  if (!membership) {
    return false;
  }

  return (
    workspace.plan === "Enterprise" &&
    workspace.dataResidency === "standard" &&
    membership.userId === callerUserId &&
    membership.workspaceId === workspace.id &&
    membership.status === "active" &&
    membership.role === "admin"
  );
}
