import type { AccessReview } from "../data/accessReviews";

export function calculatePortfolioRisk(items: AccessReview[]) {
  const total = items.reduce((sum, item) => sum + item.risk + (item.privileged ? 20 : 0), 0);
  return Math.round(total / Math.max(items.length, 1));
}
