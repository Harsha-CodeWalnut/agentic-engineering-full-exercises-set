import { describe, expect, it } from "vitest";
import {
  applyFilterPreset,
  defaultFilters,
  savedFilterPresets,
} from "../../src/utils/filters";

describe("lane A saved filter presets", () => {
  it("givenASearchQuery_whenHighPriorityBlockedPresetIsApplied_thenPriorityAndStatusChangeAndQueryIsPreserved", () => {
    // Arrange
    const preset = savedFilterPresets.find((candidate) => candidate.id === "high-priority-blocked");

    // Act
    const filters = applyFilterPreset({ ...defaultFilters, query: "atlas" }, preset!);

    // Assert
    expect(preset?.name).toBe("High-priority Blocked");
    expect(filters).toEqual({ query: "atlas", priority: "High", status: "Blocked" });
  });
});
