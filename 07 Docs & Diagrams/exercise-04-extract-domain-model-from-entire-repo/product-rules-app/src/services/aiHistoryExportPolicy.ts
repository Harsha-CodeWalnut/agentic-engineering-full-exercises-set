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

/** Current approved workspace export policy. Billing ownership grants no product access. */
export function canExportAIHistory(context: ExportAuthorizationContext) {
  const membership = context.membership;
  return context.workspace.plan === "Enterprise"
    && context.workspace.dataResidency === "standard"
    && membership?.userId === context.callerUserId
    && membership.workspaceId === context.workspace.id
    && membership.status === "active"
    && membership.role === "admin";
}
