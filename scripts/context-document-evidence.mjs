import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const hash = (bytes) => crypto.createHash("sha256").update(String(bytes).replaceAll("\r\n", "\n")).digest("hex");
const normalize = (bytes) => String(bytes).replaceAll("\r\n", "\n");
function inside(root, relative) {
  assert.equal(typeof relative, "string", "artifact path is required");
  const absolute = path.resolve(root, relative);
  const local = path.relative(root, absolute);
  assert.ok(local && !local.startsWith("..") && !path.isAbsolute(local), `path escapes exercise: ${relative}`);
  if (fs.existsSync(absolute)) {
    const real = path.relative(fs.realpathSync(root), fs.realpathSync(absolute));
    assert.ok(real && !real.startsWith("..") && !path.isAbsolute(real), `linked path escapes exercise: ${relative}`);
  }
  return absolute;
}
function git(root, args) { return execFileSync("git", args, { cwd: root, stdio: ["ignore", "pipe", "pipe"] }); }
function read(root, relative) {
  const file = inside(root, relative);
  assert.ok(fs.existsSync(file) && fs.statSync(file).isFile(), `missing ${relative}`);
  const bytes = fs.readFileSync(file);
  assert.ok(bytes.length, `empty ${relative}`);
  return bytes;
}
function excerpt(root, record) {
  assert.ok(Number.isInteger(record.line) && record.line > 0, "citation line must be a positive integer");
  assert.ok(typeof record.excerpt === "string" && record.excerpt.trim().length >= 8, "citation needs an exact excerpt");
  const lines = normalize(read(root, record.path)).split("\n");
  const count = record.excerpt.split("\n").length;
  assert.equal(lines.slice(record.line - 1, record.line - 1 + count).join("\n"), record.excerpt, `stale citation: ${record.path}:${record.line}`);
}
export function checkAudit(root, contract) {
  const audit = JSON.parse(read(root, "evidence/source-audit.json"));
  assert.ok(Array.isArray(audit.claims), "source-audit.json requires claims[]");
  const ids = new Set();
  for (const claim of audit.claims) {
    assert.ok(typeof claim.id === "string" && claim.id && !ids.has(claim.id), "claim IDs must be unique"); ids.add(claim.id);
    assert.ok(contract.topics.includes(claim.topic), `unknown audit topic: ${claim.topic}`);
    assert.ok(["supported", "contradicted", "unresolved"].includes(claim.status), "claim status is invalid");
    assert.ok(typeof claim.reason === "string" && claim.reason.trim().length >= 20, "explain the source-to-claim relationship");
    assert.ok(contract.outputs.some((item) => item.path === claim.artifact.path), "claim must point to a submitted output");
    excerpt(root, claim.artifact);
    assert.ok(Array.isArray(claim.sources) && claim.sources.length, "each claim needs source evidence");
    for (const source of claim.sources) {
      assert.ok(!contract.outputs.some((item) => item.path === source.path), "a submitted output cannot be its own source evidence");
      assert.ok(contract.sourceRoots.some((prefix) => source.path.startsWith(prefix)), `not an authoritative source: ${source.path}`);
      excerpt(root, source);
    }
  }
  for (const topic of contract.topics) assert.ok(audit.claims.some((claim) => claim.topic === topic), `missing audit topic: ${topic}`);
  // Source excerpts prove location and freshness. Whether they support the claim is also reviewed by a person.
  return audit;
}
export async function checkOutputs(root, contract, parseMermaid) {
  for (const output of contract.outputs) {
    const text = normalize(read(root, output.path));
    for (const heading of output.headings ?? []) assert.ok(text.includes(`## ${heading}`), `${output.path} is missing ${heading}`);
    if (output.type === "json") JSON.parse(text);
    if (output.type === "mermaid") {
      assert.ok(parseMermaid, "Mermaid parser is not configured");
      const result = await parseMermaid(text);
      assert.equal(result.diagramType, output.diagramType, `${output.path} has the wrong diagram type`);
    }
    for (const block of text.matchAll(/^```mermaid\s*\n([\s\S]*?)^```\s*$/gm)) {
      assert.ok(parseMermaid, "a Mermaid parser is required for embedded diagrams");
      await parseMermaid(block[1]);
    }
  }
  const audit = checkAudit(root, contract);
  for (const output of contract.outputs.filter((item) => item.type === "mermaid")) {
    const lines = normalize(read(root, output.path)).split("\n");
    let relationships = 0;
    lines.forEach((line, index) => {
      if (line.trim().startsWith("%%") || !/(?:-->|->>|-->>|--\||\|--|--o|o--|\.->)/.test(line)) return;
      relationships += 1;
      assert.ok(audit.claims.some((claim) => claim.artifact.path === output.path && claim.artifact.line <= index + 1 && claim.artifact.line + claim.artifact.excerpt.split("\n").length > index + 1), `uncited diagram relationship: ${output.path}:${index + 1}`);
    });
    assert.ok(relationships, `${output.path} has no relationships`);
  }
}
export function evidencePaths(contract) {
  return [...new Set([...contract.outputs.map((item) => item.path), "evidence/before.md", "evidence/after.md", "evidence/comparison.md", "evidence/source-audit.json", ...(contract.extraEvidence ?? [])])];
}
export function checkSkillEvidence(root, contract) {
  if (!contract.requiredSkills?.length) return;
  const text = normalize(read(root, "evidence/skill-use.md"));
  const transcript = normalize(read(root, "evidence/skill-session.txt"));
  assert.ok(transcript.trim().length >= 100, "include the actual skill-session.txt transcript");
  const lines = transcript.split("\n");
  const sections = text.split(/^##[ \t]+/m).slice(1);
  for (const skill of contract.requiredSkills) {
    const matching = sections.filter((section) => section.split("\n", 1)[0].trim() === skill.name);
    assert.equal(matching.length, 1, `record exactly one ## ${skill.name} section in skill-use.md`);
    const section = matching[0];
    const field = (name) => section.match(new RegExp(`^(?:- )?${name}: ([^\\r\\n]+)$`, "m"))?.[1].trim();
    let source;
    try { source = new URL(field("Source")); } catch { assert.fail(`record the upstream Source URL for ${skill.name}`); }
    const expected = new URL(skill.source);
    assert.ok(source.protocol === "https:" && source.host === expected.host &&
      (source.pathname.toLowerCase() === expected.pathname.toLowerCase() || source.pathname.toLowerCase().startsWith(expected.pathname.toLowerCase() + "/")),
      `record the correct upstream source for ${skill.name}`);
    assert.ok(/^[a-f0-9]{40}$/.test(field("Revision") ?? "") || /^[a-f0-9]{64}$/.test(field("SHA-256") ?? ""),
      `record the installed revision or skill file hash for ${skill.name}`);
    assert.ok(field("Invocation"), `record the actual invocation for ${skill.name}`);
    const proof = field("Proof")?.match(/^evidence\/skill-session\.txt:L(\d+)-L(\d+)$/);
    assert.ok(proof, `record Proof: evidence/skill-session.txt:L<first>-L<last> for ${skill.name}`);
    const first = Number(proof[1]); const last = Number(proof[2]);
    assert.ok(first >= 1 && last >= first && last <= lines.length, `invalid transcript line range for ${skill.name}`);
    assert.ok(lines.slice(first - 1, last).join("\n").trim().length >= 20, `empty or insufficient referenced transcript for ${skill.name}`);
  }
  // A well-formed record is not proof of agent behaviour. Reviewers inspect the referenced raw session.
}
export function seal(root, appRoot, contract) {
  const sourceSha = git(root, ["rev-parse", "HEAD"]).toString().trim();
  const files = Object.fromEntries(evidencePaths(contract).map((relative) => [relative, hash(read(root, relative))]));
  // Commit first, seal second: the manifest does not record its own hash or commit.
  const manifest = { algorithm: "sha256-normalized-lf", sourceSha, files };
  verifySnapshot(root, manifest, contract);
  fs.writeFileSync(path.join(root, "evidence/manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Sealed ${Object.keys(files).length} artifacts at ${sourceSha}`);
}
export function verifySnapshot(root, manifest, contract) {
  root = fs.realpathSync(root);
  assert.equal(manifest.algorithm, "sha256-normalized-lf", "unsupported evidence hash algorithm");
  assert.match(manifest.sourceSha ?? "", /^[a-f0-9]{40}$/, "sourceSha must be a full commit SHA");
  git(root, ["merge-base", "--is-ancestor", manifest.sourceSha, "HEAD"]);
  const prefix = git(root, ["rev-parse", "--show-prefix"]).toString().trim();
  for (const relative of evidencePaths(contract)) {
    const bytes = read(root, relative);
    assert.equal(manifest.files?.[relative], hash(bytes), `artifact changed since seal: ${relative}`);
    const repoPath = prefix + relative.split(path.sep).join("/");
    assert.equal(normalize(git(root, ["show", `${manifest.sourceSha}:${repoPath}`])), normalize(bytes), `commit all outputs before evidence:seal: ${relative}`);
  }
  const changes = git(root, ["diff", "--name-only", "--relative", manifest.sourceSha, "--", "."]).toString().trim().split(/\r?\n/).filter(Boolean);
  const evidencePrefix = "evidence/";
  for (const changed of changes) assert.ok(changed.startsWith(evidencePrefix), `source changed after evidence snapshot: ${changed}`);
}
export function verifyTranscript(root, sourceSha) {
  const text = normalize(read(root, "evidence/commands/verify.txt"));
  assert.ok(text.startsWith("Command: npm run evidence:verify\n"), "capture the documented evidence:verify command");
  assert.ok(text.includes(`Repository commit: ${sourceSha}\n`), "capture must run at the sealed source commit");
  assert.match(text, /\nexit code: 0\s*$/, "verification capture did not succeed");
  const start = Date.parse(text.match(/^Started at: (.+)$/m)?.[1]);
  const end = Date.parse(text.match(/^Finished at: (.+)$/m)?.[1]);
  assert.ok(Number.isFinite(start) && Number.isFinite(end) && end >= start, "invalid capture timestamps");
}
export async function runEvidence({ appRoot, parseMermaid, validate }) {
  const root = path.resolve(appRoot, "..");
  const contract = JSON.parse(fs.readFileSync(path.join(appRoot, "evidence-contract.json")));
  const mode = process.argv[2];
  if (mode === "seal") return seal(root, appRoot, contract);
  await checkOutputs(root, contract, parseMermaid);
  for (const name of ["before", "after"]) {
    const text = normalize(read(root, `evidence/${name}.md`));
    for (const heading of ["Conditions", "Findings", "Proof"]) assert.ok(text.includes(`## ${heading}`), `${name}.md is missing ${heading}`);
  }
  const comparison = normalize(read(root, "evidence/comparison.md"));
  for (const heading of ["Changes", "Verified", "Remaining questions"]) assert.ok(comparison.includes(`## ${heading}`), `comparison.md is missing ${heading}`);
  checkSkillEvidence(root, contract);
  if (validate) await validate(root, contract);
  const manifest = JSON.parse(read(root, "evidence/manifest.json"));
  verifySnapshot(root, manifest, contract);
  if (mode !== "content") verifyTranscript(root, manifest.sourceSha);
  console.log("PASS submitted artifacts, source citations, evidence snapshot, and required checks. Semantic accuracy also requires reviewer assessment.");
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await runEvidence({ appRoot: process.cwd() });
}
