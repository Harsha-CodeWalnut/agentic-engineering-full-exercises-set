export interface ContractWorkflow {
  id: string;
  customer: string;
  status: string;
  score: number;
  owner: string;
  note: string;
  decisionState: string;
}

const ALLOWED_DECISION_STATES = new Set(["needs-evidence", "pending-review", "accepted"]);

export function parseWorkflowResponse(value: unknown): ContractWorkflow {
  if (value === null || typeof value !== "object") {
    throw new Error("Invalid workflow response");
  }

  const record = value as Record<string, unknown>;
  if (typeof record.decisionState !== "string" || !ALLOWED_DECISION_STATES.has(record.decisionState)) {
    throw new Error("decisionState is missing or unsupported");
  }

  return {
    id: String(record.id ?? ""),
    customer: String(record.customer ?? ""),
    status: String(record.status ?? ""),
    score: Number(record.score ?? 0),
    owner: String(record.owner ?? ""),
    note: String(record.note ?? ""),
    decisionState: record.decisionState,
  };
}

export async function listWorkflows(baseUrl = ""): Promise<ContractWorkflow[]> {
  const response = await fetch(`${baseUrl}/api/workflows`);
  if (!response.ok) throw new Error(`Workflow list failed with ${response.status}`);
  const values = await response.json() as unknown[];
  return values.map(parseWorkflowResponse);
}

export async function submitDecision(baseUrl: string, workflowId: string) {
  const response = await fetch(`${baseUrl}/api/workflows/${workflowId}/decisions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: "Ready", owner: "Asha", evidenceNote: "Contract evidence attached" }),
  });
  if (!response.ok) throw new Error(`Decision failed with ${response.status}`);
  return parseWorkflowResponse(await response.json());
}
