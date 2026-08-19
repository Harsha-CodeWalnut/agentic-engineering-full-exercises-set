# AI-history export

This context defines the vocabulary for workspace AI-history export. It exists so billing language and workspace authorization are never treated as the same thing.

Authoritative policy: `docs/current-access-policy.md`. Historical language only: `docs/legacy-rollout-notes.md`. Illustration, not a substitute for policy: `docs/support-example.md`. Implementation lives in `product-rules-app/src/services/aiHistoryExportPolicy.ts`.

## Language

**Billing customer**:
The paying organization that funds one or more workspaces. Its owner manages invoices and payment, not product data.
_Avoid_: account, customer account

**User**:
A person who signs in and may hold memberships in workspaces. A user is not a billing customer and is not a workspace.
_Avoid_: account, account owner

**Workspace**:
The product and data-security boundary that holds AI history. Export is decided per workspace, never per billing customer.
_Avoid_: account, tenant used as a synonym for billing

**Membership**:
The link between one user and one workspace. Authorization reads this link, including whether it is for the same workspace being exported.
_Avoid_: access, permission blob, account membership

**Role**:
A label on a membership that applies only inside the workspace named by that membership. `admin` is a workspace role, not a billing title.
_Avoid_: account owner, owner used as a workspace role

**Data residency**:
A workspace security mode. Export is allowed only when this mode is `standard`. Restricted workspaces stay blocked.
_Avoid_: region, storage location used as a stand-in for this control

**Authorized administrator**:
The requesting user with an active `admin` membership on the workspace being exported.
_Avoid_: billing owner, account owner, any admin label on a different workspace

**Eligible workspace**:
A workspace whose plan is Enterprise and whose data residency is `standard`.
_Avoid_: Growth used as current eligibility, any billing-customer plan

## Relationships

- One billing customer pays for one or more workspaces.
- One user may have many memberships; each membership names exactly one workspace and one user.
- A role has no meaning outside the membership's workspace.
- Billing ownership does not grant workspace access, membership, or export rights. A suspended membership never grants export, including when that user owns the billing customer.

## Sources that are not current rules

`docs/previous-agent-progress.md` marks the work complete after a generic check and still encodes the superseded draft. `docs/legacy-rollout-notes.md` is retained history. Do not load either as the export rule.
