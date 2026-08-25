import { describe, expect, it, vi } from "vitest";
import { accessReviews } from "../src/data/accessReviews";
import {
  ApprovalError,
  approveAccessReview,
  type ApprovalActor,
} from "../src/services/accessReviewApi";

describe("access review approval boundary", () => {
  it("givenIncompletePrivilegedEvidence_whenAuthorizedActorApproves_thenThrowsMissingEvidence", async () => {
    // Arrange
    const actor: ApprovalActor = { id: "operator-1", canApprovePrivileged: true };
    const wait = vi.fn(async () => undefined);

    // Act
    const attempt = approveAccessReview(accessReviews[0], actor, { wait });

    // Assert
    await expect(attempt).rejects.toBeInstanceOf(ApprovalError);
    await expect(approveAccessReview(accessReviews[0], actor, { wait })).rejects.toMatchObject({
      code: "MISSING_EVIDENCE",
    });
  });

  it("givenAPrivilegedReview_whenUnauthorizedActorApproves_thenThrowsNotAuthorized", async () => {
    // Arrange
    const actor: ApprovalActor = { id: "operator-2", canApprovePrivileged: false };
    const wait = vi.fn(async () => undefined);

    // Act
    const attempt = approveAccessReview(accessReviews[2], actor, { wait });

    // Assert
    await expect(attempt).rejects.toMatchObject({ code: "NOT_AUTHORIZED" });
  });
});
