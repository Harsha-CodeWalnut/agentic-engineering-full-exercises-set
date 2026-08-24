import { execFileSync } from "node:child_process";

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--repo" || flag === "--base" || flag === "--head") {
      parsed[flag.slice(2)] = argv[index + 1];
      index += 1;
    }
  }
  return parsed;
}

function git(repo, args) {
  return execFileSync("git", ["-C", repo, ...args], { encoding: "utf8" }).trim();
}

function requireRef(repo, ref) {
  try {
    git(repo, ["rev-parse", "--verify", ref]);
  } catch {
    throw new Error(`Invalid ref or range: ${ref}`);
  }
}

const { repo, base, head } = parseArgs(process.argv.slice(2));
if (!repo || !base || !head) {
  console.error("Usage: extract-release.mjs --repo <path> --base <ref> --head <ref>");
  process.exit(1);
}

try {
  requireRef(repo, base);
  requireRef(repo, head);
  const range = `${base}..${head}`;
  const separator = "\u001f";
  const log = git(repo, ["log", "--reverse", `--format=%H${separator}%s`, range]);
  const commits = log
    ? log.split(/\n/).filter(Boolean).map((line) => {
        const [sha, subject] = line.split(separator);
        const files = git(repo, ["diff-tree", "--no-commit-id", "--name-only", "-r", sha])
          .split(/\n/)
          .filter(Boolean)
          .sort();
        return { sha, subject, files };
      })
    : [];
  const changedFiles = git(repo, ["diff", "--name-only", range])
    .split(/\n/)
    .filter(Boolean)
    .sort();
  process.stdout.write(JSON.stringify({ range: { base, head }, commits, changedFiles }) + "\n");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(/invalid ref or range/i.test(message) ? message : `Invalid ref or range: ${message}`);
  process.exit(1);
}
