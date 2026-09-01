import fs from "node:fs";
import path from "node:path";

const FLAG_KEY = "invoice-preview-v2";

function flag(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || index + 1 >= process.argv.length) return undefined;
  return process.argv[index + 1];
}

function reject(message) {
  console.error(message);
  process.exitCode = 1;
}

function isIso8601(value) {
  if (typeof value !== "string" || value.trim() === "") return false;
  if (Number.isNaN(Date.parse(value))) return false;
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value);
}

function rollbackRevision(timestamp) {
  return `rollback-${timestamp.replace(/[:.]/g, "-")}`;
}

const configPath = flag("--config");
const actor = flag("--actor");
const reason = flag("--reason");
const timestamp = flag("--timestamp");

if (!configPath || !actor || !reason || !timestamp) {
  reject("Usage: node scripts/rollback-invoice-preview.mjs --config <path> --actor <value> --reason <value> --timestamp <ISO-8601>");
} else if (typeof actor !== "string" || actor.trim() === "" || typeof reason !== "string" || reason.trim() === "") {
  reject("actor and reason must be non-empty");
} else if (!isIso8601(timestamp)) {
  reject("timestamp must be a valid ISO-8601 value");
} else if (!fs.existsSync(configPath) || !fs.statSync(configPath).isFile()) {
  reject(`configuration is missing: ${configPath}`);
} else {
  const originalBytes = fs.readFileSync(configPath);
  let config;
  try {
    config = JSON.parse(originalBytes.toString("utf8"));
  } catch {
    config = null;
    reject("configuration is invalid JSON");
  }

  if (config) {
    if (config.schemaVersion !== 1 || config.flagKey !== FLAG_KEY) {
      reject("configuration must use schema version 1 and flag key invoice-preview-v2");
    } else {
      const next = {
        ...config,
        enabled: false,
        allowlist: [],
        revision: rollbackRevision(timestamp),
        lastRollback: {
          actor,
          reason,
          timestamp,
          previousRevision: config.revision,
        },
      };
      const serialized = `${JSON.stringify(next, null, 2)}\n`;
      const directory = path.dirname(configPath);
      const temporaryPath = path.join(directory, `${path.basename(configPath)}.tmp`);
      fs.writeFileSync(temporaryPath, serialized);
      fs.renameSync(temporaryPath, configPath);
    }
  }
}
