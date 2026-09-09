import assert from "node:assert/strict";

import { selectContext } from "../src/budget/selectContext.mjs";

const catalog = [
  { id: "mandatory-rules", bytes: 10, tags: ["mandatory"], authority: "current", priority: 1, mandatory: true },
  { id: "adapter-b", bytes: 20, tags: ["adapter"], authority: "current", priority: 100 },
  { id: "adapter-a", bytes: 20, tags: ["adapter"], authority: "current", priority: 100 },
  { id: "error-contract", bytes: 15, tags: ["errors"], authority: "current", priority: 90 },
  { id: "stale-adapter", bytes: 5, tags: ["adapter"], authority: "stale", priority: 500 },
  { id: "ui-guide", bytes: 5, tags: ["ui"], authority: "current", priority: 80 },
];

const ids = (items) => items.map((item) => item.id);

const deterministic = selectContext(catalog, { tags: ["adapter"] }, 50);
assert.deepEqual(ids(deterministic.selected), ["mandatory-rules", "adapter-a", "adapter-b"]);
assert.equal(deterministic.totalBytes, 50);
assert.equal(deterministic.remainingBytes, 0);
assert.deepEqual(deterministic.requestedTags, ["adapter"]);
assert.deepEqual(deterministic.unresolvedTags, []);
assert.deepEqual(
  selectContext([...catalog].reverse(), { tags: ["adapter"] }, 50),
  deterministic,
  "deterministic output must not depend on catalog order",
);

const budget = selectContext(catalog, { tags: ["adapter"] }, 30);
assert.deepEqual(ids(budget.selected), ["mandatory-rules", "adapter-a"]);
assert.equal(budget.skipped.find((item) => item.id === "adapter-b")?.reason, "budget");

const tightBudget = selectContext(catalog, { tags: ["adapter"] }, 15);
assert.deepEqual(ids(tightBudget.selected), ["mandatory-rules"]);
assert.deepEqual(tightBudget.unresolvedTags, ["adapter"]);

assert.equal(deterministic.skipped.find((item) => item.id === "stale-adapter")?.reason, "stale");
assert.equal(deterministic.skipped.find((item) => item.id === "ui-guide")?.reason, "irrelevant");

const question = selectContext(catalog, { tags: ["adapter"], questions: ["errors"] }, 65);
assert.deepEqual(ids(question.selected), ["mandatory-rules", "adapter-a", "adapter-b", "error-contract"]);
assert.deepEqual(question.requestedTags, ["adapter", "errors"]);

const mandatoryFirstCatalog = [
  { id: "rules", mandatory: true, authority: "current", priority: 1, bytes: 10, tags: [] },
  { id: "optional", authority: "current", priority: 100, bytes: 10, tags: ["adapter"] },
];
const mandatoryFirst = selectContext(mandatoryFirstCatalog, { tags: ["adapter"] }, 10);
assert.deepEqual(ids(mandatoryFirst.selected), ["rules"], "mandatory rules must precede optional sources");
assert.equal(mandatoryFirst.skipped.find((item) => item.id === "optional")?.reason, "budget");
assert.deepEqual(mandatoryFirst.unresolvedTags, ["adapter"]);
assert.deepEqual(selectContext([...mandatoryFirstCatalog].reverse(), { tags: ["adapter"] }, 10), mandatoryFirst);

assert.throws(() => selectContext(catalog, { tags: [] }, 9), /mandatory context/i);
assert.throws(() => selectContext(catalog, { tags: [] }, -1), /positive integer/i);
assert.throws(() => selectContext([...catalog, catalog[0]], { tags: [] }, 100), /duplicate context id/i);

console.log("PASS learner deterministic budget, stale, duplicate, question, and mandatory-first selector tests");
