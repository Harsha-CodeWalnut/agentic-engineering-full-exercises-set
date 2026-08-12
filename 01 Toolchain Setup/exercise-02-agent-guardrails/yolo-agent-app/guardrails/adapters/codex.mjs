import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { evaluateAction as evaluateSharedAction, createAuditRecord } from "../enforce.mjs";

export const agentName = "OpenAI Codex";
export const instructionFiles = ["AGENTS.md"];
export const configurationFiles = [".codex/hooks.json"];
export const evaluateAction = evaluateSharedAction;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let input = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;
  try {
    const action = JSON.parse(input || "{}");
    const policy = JSON.parse(readFileSync(new URL("../policy.json", import.meta.url), "utf8"));
    const evaluation = evaluateAction(policy, action);
    process.stdout.write(`${JSON.stringify({ ...evaluation, audit: createAuditRecord(action, evaluation) })}\n`);
    process.exitCode = evaluation.decision === "allowed" ? 0 : evaluation.decision === "approval-required" ? 2 : 1;
  } catch {
    process.stdout.write(`${JSON.stringify({ decision: "blocked", reason: "Invalid hook input." })}\n`);
    process.exitCode = 1;
  }
}
