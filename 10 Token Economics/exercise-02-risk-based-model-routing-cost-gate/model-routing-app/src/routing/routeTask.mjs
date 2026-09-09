const supportedRisks = new Set(["low", "medium", "high"]);
const supportedAmbiguities = new Set(["low", "medium", "high"]);
const supportedScopes = new Set(["one-file", "mechanical", "three-files", "cross-boundary", "unknown"]);

export function routeTask(task) {
  if (!task || !supportedRisks.has(task.risk) || !supportedAmbiguities.has(task.ambiguity) || !supportedScopes.has(task.scope)) {
    return "clarify";
  }
  if (task.ambiguity === "high" || task.scope === "unknown") return "clarify";
  if (task.risk === "high" || task.scope === "cross-boundary") return "reasoning";
  if (task.risk === "medium" || task.scope === "three-files") return "balanced";
  if (task.risk === "low" && task.ambiguity === "low" && ["one-file", "mechanical"].includes(task.scope)) return "fast";
  return "clarify";
}
