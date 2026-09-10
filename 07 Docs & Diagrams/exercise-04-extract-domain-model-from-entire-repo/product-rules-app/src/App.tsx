import { calculateReadiness, groupByRisk } from "./domainReadiness";
import { labContract } from "./labContract";
import { canExportAIHistory, type ExportAuthorizationContext } from "./services/aiHistoryExportPolicy";
import "./styles.css";

export default function App() {
  const readiness = calculateReadiness(labContract);
  const groupedRisks = groupByRisk(labContract.seededDefects);
  const workspace = { id: "support-east", billingCustomerId: "orbit", plan: "Enterprise", dataResidency: "standard" } as const;
  const billingCustomer = { id: "orbit", ownerUserId: "finance-owner" };
  const examples: Array<{ label: string; context: ExportAuthorizationContext }> = [
    { label: "Billing owner without workspace membership", context: { callerUserId: "finance-owner", billingCustomer, workspace, membership: null } },
    { label: "Active workspace administrator", context: { callerUserId: "support-lead", billingCustomer, workspace, membership: { workspaceId: workspace.id, userId: "support-lead", role: "admin", status: "active" } } },
    { label: "Suspended workspace administrator", context: { callerUserId: "former-lead", billingCustomer, workspace, membership: { workspaceId: workspace.id, userId: "former-lead", role: "admin", status: "suspended" } } },
  ];

  return (
    <main className="app-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">{labContract.competency}</p>
          <h1>{labContract.title}</h1>
          <p>{labContract.domain}</p>
        </div>
        <div className="metric-card">
          <span>Readiness</span>
          <strong>{readiness.score}%</strong>
          <small>{readiness.status}</small>
        </div>
      </section>

      <section className="panel" aria-label="Workspace history export">
        <h2>Workspace history export</h2>
        <p>Workspace: {workspace.id}. Subscription: {workspace.plan}. Billing customer: {billingCustomer.id}.</p>
        <ul>{examples.map(({ label, context }) => (
          <li key={label}>{label}: {canExportAIHistory(context) ? "Export permitted" : "Export unavailable"}</li>
        ))}</ul>
        <p>These local examples use the application's current access policy.</p>
      </section>

      <section className="workspace-grid">
        <article className="panel">
          <h2>Domain Model</h2>
          <ul>
            {labContract.entities.map((entity) => (
              <li key={entity}>{entity}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Seeded Defects</h2>
          <ul>
            {labContract.seededDefects.map((defect) => (
              <li key={defect}>{defect}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Verification Gates</h2>
          <ul>
            {labContract.verificationGates.map((gate) => (
              <li key={gate}>{gate}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="workspace-grid">
        <article className="panel wide">
          <h2>Agent Workflow</h2>
          <ol>
            {labContract.agentWorkflow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="panel">
          <h2>Risk Groups</h2>
          {Object.entries(groupedRisks).map(([risk, items]) => (
            <p key={risk}>
              <strong>{risk}</strong>: {items.length}
            </p>
          ))}
        </article>
      </section>
    </main>
  );
}
