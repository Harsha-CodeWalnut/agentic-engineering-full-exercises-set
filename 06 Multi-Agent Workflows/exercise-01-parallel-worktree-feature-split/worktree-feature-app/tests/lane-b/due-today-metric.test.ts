import { describe, expect, it } from "vitest";
import { workItems } from "../../src/data/workItems";
import { summarizePortfolio } from "../../src/utils/scoring";

describe("lane B due-today portfolio metric", () => {
  it("givenQueueItemsWithMixedDueDates_whenPortfolioIsSummarized_thenDueTodayCountsItemsDueInZeroDays", () => {
    // Arrange
    const items = workItems;

    // Act
    const summary = summarizePortfolio(items);

    // Assert
    expect(summary.dueToday).toBe(1);
    expect(items.filter((item) => item.dueInDays === 0).map((item) => item.id)).toEqual(["parall-01"]);
  });
});
