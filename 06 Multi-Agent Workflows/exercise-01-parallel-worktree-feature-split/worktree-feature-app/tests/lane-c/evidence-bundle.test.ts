import { describe, expect, it } from "vitest";
import { workItems } from "../../src/data/workItems";
import { createEvidenceBundle, serializeEvidenceBundle } from "../../src/services/workflowApi";

describe("lane C evidence export bundle", () => {
  it("givenCollectedEvidence_whenBundleIsCreated_thenSerializedJsonRoundTripsTheSamePayload", () => {
    // Arrange
    const generatedAt = "2026-08-13T09:00:00.000Z";

    // Act
    const bundle = createEvidenceBundle(workItems[0], ["Policy approval attached"], generatedAt);

    // Assert
    expect(bundle).toEqual({
      id: "parall-01",
      owner: "Asha",
      status: "Blocked",
      risk: 100,
      evidence: ["Policy approval attached"],
      generatedAt,
    });
    expect(JSON.parse(serializeEvidenceBundle(bundle))).toEqual(bundle);
  });
});
