import type { ActionDraft, EvidenceBundle, WorkItem } from "../types";
import { workItems } from "../data/workItems";
import { calculateRisk } from "../utils/scoring";

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function fetchWorkItems(): Promise<WorkItem[]> {
  await wait(220);
  return workItems;
}

export async function saveAction(itemId: string, draft: ActionDraft): Promise<WorkItem> {
  await wait(180);
  const item = workItems.find((candidate) => candidate.id === itemId);
  if (!item) {
    throw new Error("Work item was not found");
  }

  return {
    ...item,
    status: draft.status,
    owner: draft.owner,
    note: draft.note,
  };
}

export async function collectEvidence(item: WorkItem): Promise<string[]> {
  await wait(140);
  return [
    `Risk score: ${item.score}`,
    `Owner: ${item.owner}`,
    `Tags: ${item.tags.join(", ")}`,
  ];
}

export function createEvidenceBundle(item: WorkItem, evidence: string[], generatedAt: string): EvidenceBundle {
  return {
    id: item.id,
    owner: item.owner,
    status: item.status,
    risk: calculateRisk(item),
    evidence,
    generatedAt,
  };
}

export function serializeEvidenceBundle(bundle: EvidenceBundle): string {
  return JSON.stringify(bundle);
}
