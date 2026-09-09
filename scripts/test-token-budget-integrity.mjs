import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const app = "10 Token Economics/exercise-01-token-budget-refactor/token-budget-app";
const manifestFile = `${app}/challenge-integrity.json`;
const original = JSON.parse(fs.readFileSync(path.join(root, manifestFile), "utf8"));
assert.ok(!Object.hasOwn(original.protectedFiles, "src/session/adaptSession.mjs"),
  "the exercise's refactor target must be editable");
assert.ok(Object.hasOwn(original.protectedFiles, "scripts/run-adapter-acceptance.mjs"),
  "adapter acceptance checks must remain protected");

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "token-integrity-test-"));
try {
  for (const file of [manifestFile, "scripts/update-challenge-integrity.mjs",
    ...Object.keys(original.protectedFiles).map((file) => path.join(app, file)),
    `${app}/src/session/adaptSession.mjs`]) {
    const destination = path.join(temporary, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, file), destination);
  }
  const manifestPath = path.join(temporary, manifestFile);
  const stale = structuredClone(original);
  stale.protectedFiles["src/session/adaptSession.mjs"] = "stale-entry";
  fs.writeFileSync(manifestPath, JSON.stringify(stale));
  execFileSync(process.execPath, [path.join(temporary, "scripts/update-challenge-integrity.mjs")]);
  const generated = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.ok(!Object.hasOwn(generated.protectedFiles, "src/session/adaptSession.mjs"),
    "regeneration must remove a stale protection for the refactor target");
  assert.ok(Object.hasOwn(generated.protectedFiles, "scripts/run-adapter-acceptance.mjs"));
  const verifier = path.join(temporary, "scripts/verify-protected-inputs.mjs");
  fs.appendFileSync(path.join(temporary, app, "src/session/adaptSession.mjs"), "\n// Learner refactor\n");
  execFileSync(process.execPath, [verifier, manifestPath]);
  fs.appendFileSync(path.join(temporary, app, "scripts/run-adapter-acceptance.mjs"), "\n// Tampered check\n");
  assert.throws(() => execFileSync(process.execPath, [verifier, manifestPath], { stdio: "pipe" }),
    "modifying acceptance checks must still fail integrity verification");
  console.log("PASS editable adapter, protected acceptance checks, and safe manifest regeneration");
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
