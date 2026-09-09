import assert from "node:assert/strict";
import test from "node:test";

import { routeTask } from "../src/routing/routeTask.mjs";

test("baseline sends every representative task to the reasoning lane", () => {
  const tasks = [
    { risk: "low", ambiguity: "low", scope: "one-file" },
    { risk: "medium", ambiguity: "low", scope: "three-files" },
    { risk: "high", ambiguity: "low", scope: "cross-boundary" },
    { risk: "unknown", ambiguity: "high", scope: "unknown" }
  ];

  for (const task of tasks) {
    assert.equal(routeTask(task), "reasoning");
  }
});
