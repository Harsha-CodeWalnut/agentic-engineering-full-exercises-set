import path from "node:path";

const DECISIONS = new Set(["allowed", "blocked", "approval-required"]);

function result(decision, reason) {
  return { decision, reason };
}

function strings(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function normalizePath(value) {
  if (typeof value !== "string") return null;
  const candidate = value.replaceAll("\\", "/").replace(/^\.\//, "");
  if (!candidate || candidate.includes("\0")) return null;
  if (path.posix.isAbsolute(candidate) || path.win32.isAbsolute(value)) return null;
  const normalized = path.posix.normalize(candidate);
  if (normalized === ".." || normalized.startsWith("../")) return null;
  return normalized;
}

function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const pattern = escaped.replaceAll("**", "\0").replaceAll("*", "[^/]*").replaceAll("\0", ".*");
  return new RegExp(`^${pattern}$`, "i");
}

function matchesPath(patterns, candidate) {
  return candidate !== null && strings(patterns).some((pattern) => globToRegExp(pattern).test(candidate));
}

function matchesRegex(patterns, candidate) {
  if (typeof candidate !== "string") return false;
  return strings(patterns).some((pattern) => {
    try {
      return new RegExp(pattern, "i").test(candidate);
    } catch {
      return true;
    }
  });
}

export function evaluateAction(policy, action) {
  const fallback = DECISIONS.has(policy?.defaultDecision) ? policy.defaultDecision : "blocked";
  if (!policy || policy.version !== 1 || !action || typeof action !== "object") {
    return result("blocked", "Malformed policy or action input.");
  }

  const operation = typeof action.operation === "string" ? action.operation.toLowerCase() : "";
  if (!strings(policy.allowedOperations).includes(operation)) {
    return result("blocked", "Operation is not explicitly allowed.");
  }
  if (matchesRegex(policy.blockedPromptPatterns, action.prompt)) {
    return result("blocked", "Untrusted prompt matches a blocked instruction pattern.");
  }

  const command = typeof action.command === "string" ? action.command : "";
  if (command && matchesRegex(policy.blockedCommands, command)) {
    return result("blocked", "Command matches a blocked command rule.");
  }
  if (command && matchesRegex(policy.approvalCommands, command)) {
    return result("approval-required", "Command requires explicit human approval.");
  }

  const candidatePath = normalizePath(action.path);
  const symlinkTarget = action.symlinkTarget === undefined ? null : normalizePath(action.symlinkTarget);
  if (action.path && candidatePath === null) {
    return result("blocked", "Path is absolute, malformed, or escapes the repository.");
  }
  if (action.symlinkTarget !== undefined && symlinkTarget === null) {
    return result("blocked", "Symlink target is malformed or escapes the repository.");
  }
  for (const candidate of [candidatePath, symlinkTarget]) {
    if (matchesPath(policy.blockedPaths, candidate)) {
      return result("blocked", "Path is protected by policy.");
    }
    if (matchesPath(policy.approvalPaths, candidate)) {
      return result("approval-required", "Path requires explicit human approval.");
    }
  }

  if (command) {
    return operation === "command" || operation === "test"
      ? result("allowed", "Command and operation are explicitly allowed by policy.")
      : result(fallback, "Command is not valid for this operation.");
  }
  if (matchesPath(policy.allowedPaths, candidatePath)) {
    return result("allowed", "Operation and path are explicitly allowed by policy.");
  }
  return result(fallback, "No allow rule matched; default decision applied.");
}

export function createAuditRecord(action, evaluation) {
  return {
    timestamp: new Date().toISOString(),
    operation: typeof action?.operation === "string" ? action.operation : "unknown",
    pathCategory: action?.path ? "repository-path" : "none",
    decision: DECISIONS.has(evaluation?.decision) ? evaluation.decision : "blocked",
    reason: typeof evaluation?.reason === "string" ? evaluation.reason : "No safe reason supplied."
  };
}
