import type { ActionDraft, WorkItem } from "../types";
import { workItems } from "../data/workItems";

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const CACHE_KEY = "workflow-items";

function readCachedItems(): WorkItem[] | null {
  const cached = window.localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  try {
    const parsed = JSON.parse(cached) as unknown;
    if (Array.isArray(parsed)) return parsed as WorkItem[];
  } catch {
    // Damaged JSON must not crash the workspace.
  }
  window.localStorage.removeItem(CACHE_KEY);
  return null;
}

function snapshotItems(): WorkItem[] {
  return workItems.map((item) => ({ ...item }));
}

export async function fetchWorkItems(): Promise<WorkItem[]> {
  await wait(220);
  const cached = readCachedItems();
  if (cached) return cached;
  return snapshotItems().sort((left, right) => left.dueInDays - right.dueInDays);
}

export async function saveAction(itemId: string, draft: ActionDraft): Promise<WorkItem> {
  await wait(180);
  const current = readCachedItems() ?? snapshotItems();
  const item = current.find((candidate) => candidate.id === itemId);
  if (!item) {
    throw new Error("Work item was not found");
  }

  const next = {
    ...item,
    status: draft.status,
    owner: draft.owner,
    note: draft.note,
  };
  const updated = current.map((candidate) => (candidate.id === itemId ? next : candidate));
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
  return next;
}

export async function collectEvidence(item: WorkItem): Promise<string[]> {
  await wait(140);
  return [
    `Risk score: ${item.score}`,
    `Owner: ${item.owner}`,
    `Tags: ${item.tags.join(", ")}`,
  ];
}
