import { beforeEach, describe, expect, it } from "vitest";
import { workItems } from "../src/data/workItems";
import { collectEvidence, fetchWorkItems, saveAction } from "../src/services/workflowApi";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, String(value)); }
}

const storage = new MemoryStorage();
const immediateTimeout = ((handler: TimerHandler) => {
  if (typeof handler === "function") handler();
  return 0;
}) as typeof window.setTimeout;

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: { localStorage: storage, setTimeout: immediateTimeout },
});

beforeEach(() => storage.clear());

describe("cache regressions", () => {
  it("givenMalformedOrNonArrayCachedJson_whenItemsAreFetched_thenAppFallsBackAndClearsCache", async () => {
    // Arrange
    for (const malformed of ["{broken", JSON.stringify({ id: "not-an-array" })]) {
      storage.setItem("workflow-items", malformed);

      // Act
      const loaded = await fetchWorkItems();

      // Assert
      expect(loaded).toHaveLength(workItems.length);
      expect(storage.getItem("workflow-items")).toBeNull();
    }
  });

  it("givenSharedFixture_whenDefaultResultsAreOrdered_thenImportedFixtureIsUnchanged", async () => {
    // Arrange
    const original = [...workItems];
    const reversed = [...workItems].reverse();
    workItems.splice(0, workItems.length, ...reversed);

    try {
      // Act
      const loaded = await fetchWorkItems();

      // Assert
      expect(workItems.map((item) => item.id)).toEqual(reversed.map((item) => item.id));
      expect(loaded.map((item) => item.dueInDays)).toEqual(
        [...loaded].map((item) => item.dueInDays).sort((left, right) => left - right),
      );
    } finally {
      workItems.splice(0, workItems.length, ...original);
    }
  });

  it("givenSavedOwnerStatusAndNote_whenItemsAreFetchedAgain_thenSaveSurvivesReload", async () => {
    // Arrange
    const target = workItems[0];

    // Act
    await saveAction(target.id, { owner: "Cache owner", note: "Persisted after save", status: "In Review" });
    const reloaded = await fetchWorkItems();

    // Assert
    expect(reloaded.find((item) => item.id === target.id)).toMatchObject({
      owner: "Cache owner",
      note: "Persisted after save",
      status: "In Review",
    });
  });

  it("givenCachedWorkflowState_whenEvidenceIsCollected_thenReadOnlyEvidenceDoesNotRewriteCache", async () => {
    // Arrange
    const sentinel = JSON.stringify([{ id: "saved-state" }]);
    storage.setItem("workflow-items", sentinel);

    // Act
    await collectEvidence(workItems[0]);

    // Assert
    expect(storage.getItem("workflow-items")).toBe(sentinel);
  });

  it("givenFilterChange_whenSavedCacheExists_thenFetchStillReturnsSavedWork", async () => {
    // Arrange
    const target = workItems[1];
    await saveAction(target.id, { owner: "Filter owner", note: "Keep after filter", status: "Ready" });

    // Act
    const reloaded = await fetchWorkItems();

    // Assert
    expect(reloaded.find((item) => item.id === target.id)).toMatchObject({
      owner: "Filter owner",
      note: "Keep after filter",
      status: "Ready",
    });
  });
});
