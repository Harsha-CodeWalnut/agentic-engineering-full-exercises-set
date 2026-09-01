import fs from "node:fs";
import path from "node:path";
import { expectedSummary, readAxeEvidence, readLighthouseReports } from "./quality-verification.mjs";

function flag(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || index + 1 >= process.argv.length) return undefined;
  return process.argv[index + 1];
}

function writeDecision(outputPath, summary, exitCode) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);
  process.exitCode = exitCode;
}

function failedSummary({ sourceSha, contract, failures, runs = [], axe = null }) {
  return {
    schemaVersion: 1,
    sourceSha: sourceSha ?? "",
    route: contract?.route ?? "/",
    aggregation: contract?.aggregation ?? "pessimistic",
    thresholds: contract?.thresholds ?? {},
    lighthouseRuns: runs,
    axe: axe ?? {
      file: "axe.json",
      sha256: "",
      testedUrl: "",
      route: contract?.route ?? "/",
      generatedAt: "",
      browser: { name: "", version: "" },
      violations: [],
    },
    worstCase: {
      performance: 0,
      accessibility: 0,
      largestContentfulPaintMs: Number.POSITIVE_INFINITY,
      axeViolations: axe?.violations?.length ?? 0,
    },
    failures,
    releaseDecision: "failed",
  };
}

const lighthouseDir = flag("--lighthouse-dir");
const axePath = flag("--axe");
const contractPath = flag("--contract");
const sourceSha = flag("--sha");
const outputPath = flag("--output");

if (!lighthouseDir || !axePath || !contractPath || !sourceSha || !outputPath) {
  const summary = failedSummary({
    sourceSha,
    contract: null,
    failures: ["Usage: node scripts/quality-gate.mjs --lighthouse-dir <path> --axe <path> --contract <path> --sha <40-character-sha> --output <path>"],
  });
  if (outputPath) writeDecision(path.resolve(outputPath), summary, 1);
  else {
    console.error(summary.failures[0]);
    process.exitCode = 1;
  }
} else if (!/^[a-f0-9]{40}$/.test(sourceSha)) {
  writeDecision(path.resolve(outputPath), failedSummary({
    sourceSha,
    contract: null,
    failures: ["source SHA must be a full 40-character hexadecimal Git SHA"],
  }), 1);
} else {
  let contract;
  try {
    contract = JSON.parse(fs.readFileSync(path.resolve(contractPath), "utf8"));
  } catch {
    contract = null;
  }

  if (!contract) {
    writeDecision(path.resolve(outputPath), failedSummary({
      sourceSha,
      contract: null,
      failures: ["quality contract is missing or invalid JSON"],
    }), 1);
  } else {
    const lighthouse = readLighthouseReports(path.resolve(lighthouseDir), contract);
    const axe = readAxeEvidence(
      path.resolve(axePath),
      sourceSha,
      contract,
      lighthouse.runs[0]?.environment?.browserMajor,
    );
    const evidenceFailures = [...lighthouse.failures, ...axe.failures];
    if (lighthouse.runs.length === contract.lighthouseRuns && axe.axe && evidenceFailures.length === 0) {
      const summary = expectedSummary({ sourceSha, contract, runs: lighthouse.runs, axe: axe.axe });
      writeDecision(path.resolve(outputPath), summary, summary.releaseDecision === "passed" ? 0 : 1);
    } else {
      writeDecision(path.resolve(outputPath), failedSummary({
        sourceSha,
        contract,
        failures: evidenceFailures.length ? evidenceFailures : ["raw Lighthouse or axe evidence is incomplete"],
        runs: lighthouse.runs,
        axe: axe.axe,
      }), 1);
    }
  }
}
