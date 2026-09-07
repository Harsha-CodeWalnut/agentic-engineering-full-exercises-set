import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ActionComposer } from "../src/components/ActionComposer";
import { WorkQueue } from "../src/components/WorkQueue";
import { workItems } from "../src/data/workItems";
import { assertAllowedTransition } from "../src/server/reviewPolicy";
import type { WorkItem } from "../src/types";

const noopSave = async () => undefined;

describe("review regressions", () => {
  it("givenUntrustedHtmlNote_whenComposerRenders_thenPreviewIsTextWithoutDangerouslySetInnerHTML", () => {
    // Arrange
    const item: WorkItem = { ...workItems[0], note: "<img src=x onerror=alert(1)>" };

    // Act
    const markup = renderToStaticMarkup(createElement(ActionComposer, { item, onSave: noopSave }));

    // Assert
    expect(markup).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(markup).not.toMatch(/<img\s/);
    expect(markup.includes("dangerouslySetInnerHTML")).toBe(false);
  });

  it("givenWorkQueue_whenRowsRender_thenTheyRemainNativeButtonsForKeyboardUse", () => {
    // Arrange
    const selectedId = workItems[0].id;

    // Act
    const markup = renderToStaticMarkup(createElement(WorkQueue, {
      items: workItems,
      selectedId,
      onSelect: () => undefined,
    }));

    // Assert
    expect(markup, "queue rows must stay keyboard operable native buttons").toContain("<button");
    expect(markup).toContain('type="button"');
    expect(markup.match(/<button/g)?.length).toBe(workItems.length);
  });

  it("givenShortNote_whenComposerRenders_thenSaveDraftStaysDisabled", () => {
    // Arrange
    const item: WorkItem = { ...workItems[1], note: "short" };

    // Act
    const markup = renderToStaticMarkup(createElement(ActionComposer, { item, onSave: noopSave }));

    // Assert
    expect("short".trim().length).toBeLessThan(8);
    expect(markup).toMatch(/<button[^>]*disabled/);
  });

  it("givenBlockedWork_whenApprovedNoteRequestsReady_thenServerPolicyRejects", () => {
    // Arrange
    const item: WorkItem = { ...workItems[0], status: "Blocked" };

    // Act
    const act = () => assertAllowedTransition(item, {
      owner: "security",
      note: "approved by reviewer",
      status: "Ready",
    });

    // Assert
    expect(act).toThrow(/cannot transition/);
  });

  it("givenEscalatedWork_whenApprovedNoteRequestsReady_thenServerPolicyRejects", () => {
    // Arrange
    const item: WorkItem = { ...workItems[0], status: "Escalated" };

    // Act
    const act = () => assertAllowedTransition(item, {
      owner: "security",
      note: "approved by reviewer",
      status: "Ready",
    });

    // Assert
    expect(act).toThrow(/cannot transition/);
  });
});
