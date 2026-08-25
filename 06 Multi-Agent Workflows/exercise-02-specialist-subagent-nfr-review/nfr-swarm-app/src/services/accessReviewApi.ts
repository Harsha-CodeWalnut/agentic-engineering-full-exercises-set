import type { AccessReview } from "../data/accessReviews";

export class ApprovalError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ApprovalError";
    this.code = code;
  }
}

export interface ApprovalActor {
  id: string;
  canApprovePrivileged: boolean;
}

const defaultWait = (milliseconds: number) => new Promise<void>((resolve) => {
  setTimeout(resolve, milliseconds);
});

export async function approveAccessReview(
  review: AccessReview,
  actor: ApprovalActor,
  options?: { wait?: (milliseconds: number) => Promise<void> },
): Promise<AccessReview> {
  const wait = options?.wait ?? defaultWait;
  await wait(120);

  if (review.privileged && !actor.canApprovePrivileged) {
    throw new ApprovalError("NOT_AUTHORIZED", "Actor cannot approve privileged access");
  }

  if (review.privileged && !review.evidenceComplete) {
    throw new ApprovalError("MISSING_EVIDENCE", "Privileged approval requires complete evidence");
  }

  return { ...review, status: "approved" };
}
