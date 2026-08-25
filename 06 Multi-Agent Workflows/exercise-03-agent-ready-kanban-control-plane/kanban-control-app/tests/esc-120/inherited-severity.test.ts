import { describe, expect, it } from "vitest";
import { calculateSeverity } from "../../src/utils/scoring";
import { incidents } from "../../src/data/incidents";

describe("ESC-120 lane regression", () => {
  it("givenInheritedCritical_whenChildDeclaredLow_thenScoringUsesCritical", () => {
    const child = incidents.find((incident) => incident.id === "INC-120-C")!;

    expect(calculateSeverity(child)).toBe("Critical");
  });
});
