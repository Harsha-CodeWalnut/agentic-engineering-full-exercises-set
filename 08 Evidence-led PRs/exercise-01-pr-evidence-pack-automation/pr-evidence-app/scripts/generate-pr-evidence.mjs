import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function flag(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || index + 1 >= process.argv.length) return undefined;
  return process.argv[index + 1];
}

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function inside(root, candidate) {
  const absolute = path.resolve(root, candidate);
  return absolute === root || absolute.startsWith(`${root}${path.sep}`) ? absolute : null;
}

function reject(message) {
  console.error(message);
  process.exitCode = 1;
  return false;
}

const fixtureArg = flag("--fixture");
const sourceSha = flag("--sha");
const outputArg = flag("--output");

if (!fixtureArg || !sourceSha || !outputArg) {
  reject("Usage: node scripts/generate-pr-evidence.mjs --fixture <fixture.json> --sha <40-character-sha> --output <directory>");
} else if (!/^[a-f0-9]{40}$/.test(sourceSha)) {
  reject("source SHA must be a full 40-character hexadecimal Git SHA");
} else {
  const fixturePath = path.resolve(fixtureArg);
  const outputRoot = path.resolve(outputArg);
  const fixtureRoot = path.dirname(fixturePath);

  if (!fs.existsSync(fixturePath) || !fs.statSync(fixturePath).isFile()) {
    reject(`fixture is missing: ${fixturePath}`);
  } else {
    let fixture;
    try {
      fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
    } catch {
      fixture = null;
      reject("fixture is invalid JSON");
    }

    if (fixture) {
      const failures = [];
      if (fixture.schemaVersion !== 1 || !Array.isArray(fixture.checks) || fixture.checks.length === 0) {
        failures.push("fixture must use schemaVersion 1 and contain checks");
      }

      const filenames = new Set();
      const resolved = [];
      for (const [index, check] of (fixture.checks ?? []).entries()) {
        const label = `fixture check ${index + 1}`;
        for (const field of ["name", "command", "result", "outputPath", "risk", "reviewerAction", "rollback"]) {
          if (typeof check?.[field] !== "string" || !check[field].trim()) failures.push(`${label} is missing ${field}`);
        }
        if (!Number.isInteger(check?.exitCode) || check.exitCode < 0) failures.push(`${label} has an invalid exitCode`);
        if (!["passed", "failed"].includes(check?.result) || (check.result === "passed") !== (check.exitCode === 0)) {
          failures.push(`${label} result and exitCode disagree`);
        }
        const source = inside(fixtureRoot, check?.outputPath ?? "");
        if (!source || !fs.existsSync(source) || !fs.statSync(source).isFile()) {
          failures.push(`${label} artifact is missing or escapes the fixture directory`);
        }
        const filename = path.basename(check?.outputPath ?? "");
        if (!filename) failures.push(`${label} artifact filename is empty`);
        else if (filenames.has(filename)) failures.push(`fixture contains duplicate artifact filename ${filename}`);
        filenames.add(filename);
        resolved.push({ check, source, filename });
      }

      if (failures.length) {
        reject(failures.join("\n"));
      } else {
        const artifactDir = path.join(outputRoot, "artifacts");
        fs.mkdirSync(artifactDir, { recursive: true });

        const checks = resolved.map(({ check, source, filename }) => {
          const relative = `artifacts/${filename}`;
          const target = path.join(outputRoot, relative);
          fs.copyFileSync(source, target);
          return {
            name: check.name,
            command: check.command,
            exitCode: check.exitCode,
            result: check.result,
            risk: check.risk,
            reviewerAction: check.reviewerAction,
            rollback: check.rollback,
            artifact: {
              path: relative,
              sha256: sha256(fs.readFileSync(target)),
            },
          };
        });

        const failed = checks.find((check) => check.exitCode !== 0);
        const pack = {
          schemaVersion: 1,
          sourceSha,
          fixtureSha256: sha256(fs.readFileSync(fixturePath)),
          overallResult: failed ? "failed" : "passed",
          overallExitCode: failed ? failed.exitCode : 0,
          checks,
        };

        fs.writeFileSync(`${path.join(outputRoot, "pr-evidence.json")}`, `${JSON.stringify(pack, null, 2)}\n`);

        const summary = [
          "# PR Evidence",
          `Source SHA: ${pack.sourceSha}`,
          `Overall result: ${pack.overallResult}`,
          `Overall exit code: ${pack.overallExitCode}`,
        ];
        for (const check of checks) {
          summary.push(
            `## ${check.name}`,
            `Command: ${check.command}`,
            `Result: ${check.result}`,
            `Exit code: ${check.exitCode}`,
            `Artifact: ${check.artifact.path}`,
            `SHA-256: ${check.artifact.sha256}`,
            `Risk: ${check.risk}`,
            `Reviewer action: ${check.reviewerAction}`,
            `Rollback: ${check.rollback}`,
          );
        }
        fs.writeFileSync(path.join(outputRoot, "summary.md"), `${summary.join("\n")}\n`);
        process.exitCode = pack.overallExitCode;
      }
    }
  }
}
