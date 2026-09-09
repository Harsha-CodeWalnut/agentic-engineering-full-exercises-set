import assert from "node:assert/strict";
import test from "node:test";

import { routeTask } from "../src/routing/routeTask.mjs";

test("routes supported tasks from risk, ambiguity, and scope fields", () => {
  for (const [task, expected] of [
    [{ risk: "low", ambiguity: "low", scope: "one-file" }, "fast"],
    [{ risk: "low", ambiguity: "low", scope: "mechanical" }, "fast"],
    [{ risk: "medium", ambiguity: "low", scope: "one-file" }, "balanced"],
    [{ risk: "low", ambiguity: "medium", scope: "three-files" }, "balanced"],
    [{ risk: "high", ambiguity: "low", scope: "one-file" }, "reasoning"],
    [{ risk: "low", ambiguity: "low", scope: "cross-boundary" }, "reasoning"],
  ]) {
    assert.equal(routeTask(task), expected);
  }
});

test("clarifies missing, unknown, ambiguous, and unsupported task fields", () => {
  for (const task of [
    null,
    {},
    { ambiguity: "low", scope: "one-file" },
    { risk: "unknown", ambiguity: "low", scope: "one-file" },
    { risk: "low", ambiguity: "high", scope: "one-file" },
    { risk: "low", ambiguity: "low", scope: "unknown" },
    { risk: "urgent", ambiguity: "low", scope: "one-file" },
    { risk: "low", ambiguity: "medium", scope: "one-file" },
    { risk: "low", ambiguity: "low", scope: "six-files" },
  ]) {
    assert.equal(routeTask(task), "clarify");
  }
});

test("applies clarification, reasoning, and balanced precedence", () => {
  assert.equal(routeTask({ risk: "high", ambiguity: "high", scope: "cross-boundary" }), "clarify");
  assert.equal(routeTask({ risk: "medium", ambiguity: "low", scope: "cross-boundary" }), "reasoning");
  assert.equal(routeTask({ risk: "medium", ambiguity: "low", scope: "mechanical" }), "balanced");
});

test("does not route by case IDs or task wording", () => {
  const fields = { risk: "low", ambiguity: "low", scope: "one-file" };
  assert.equal(routeTask({ id: "authorization-boundary", title: "security migration", ...fields }), "fast");
  assert.equal(routeTask({ id: "case IDs are irrelevant", title: "typo", ...fields }), "fast");
  assert.equal(routeTask({ id: "docs-typo", risk: "high", ambiguity: "low", scope: "one-file" }), "reasoning");
});
