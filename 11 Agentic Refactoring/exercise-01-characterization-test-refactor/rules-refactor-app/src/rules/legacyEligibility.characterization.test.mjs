import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { evaluateRenewalEligibility } from "./legacyEligibility.mjs";

const goldenCasesPath = [
  path.resolve(import.meta.dirname, "..", "..", "..", "docs", "renewal-golden-cases.json"),
  path.resolve(process.cwd(), "exercise", "docs", "renewal-golden-cases.json"),
].find((candidate) => fs.existsSync(candidate));

assert.ok(goldenCasesPath, "the protected renewal-golden-cases fixture must be available");
const goldenCases = JSON.parse(fs.readFileSync(goldenCasesPath, "utf8"));

assert.ok(Array.isArray(goldenCases) && goldenCases.length > 0, "protected observations must be present");

for (const goldenCase of goldenCases) {
  const actual = evaluateRenewalEligibility(goldenCase.input);

  assert.deepEqual(
    actual,
    goldenCase.expected,
    `${goldenCase.name} must retain its observed public result`,
  );
}

console.log(`PASS ${goldenCases.length} public renewal eligibility characterizations`);
