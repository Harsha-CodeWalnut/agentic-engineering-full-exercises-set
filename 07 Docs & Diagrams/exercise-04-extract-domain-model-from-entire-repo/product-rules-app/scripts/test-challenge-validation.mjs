import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validate, validateSkillUse } from "./challenge-validation.mjs";

const analysis = `## domain-analysis
Source: https://github.com/tech-leads-club/agent-skills
Revision: ${"a".repeat(40)}
Invocation: Use domain-analysis to identify business areas only.
Proof: evidence/discovery-session.txt lines 1-20
`;
const modeling = `## domain-modeling
Source: https://github.com/mattpocock/skills
SHA-256: ${"b".repeat(64)}
Invocation: Use domain-modeling to refine the business glossary.
Proof: evidence/modeling-session.txt lines 1-20
`;
const valid = `${analysis}\n${modeling}`;

test("accepts separate records for both skills, including CRLF and bullet fields", () => {
  validateSkillUse(valid);
  validateSkillUse(valid.replace(/^(Source|Revision|SHA-256|Invocation|Proof):/gm, "- $1:").replaceAll("\n", "\r\n"));
});

test("rejects missing or duplicate skills", () => {
  assert.throws(() => validateSkillUse(modeling), /domain-analysis/);
  assert.throws(() => validateSkillUse(analysis), /domain-modeling/);
  assert.throws(() => validateSkillUse(valid + analysis), /exactly one/);
});

test("each skill requires its own source, revision, invocation and proof", () => {
  for (const section of [analysis, modeling]) {
    for (const field of ["Source", section === analysis ? "Revision" : "SHA-256", "Invocation", "Proof"]) {
      const incomplete = section.replace(new RegExp(`^${field}:.*$`, "m"), "");
      assert.throws(() => validateSkillUse(valid.replace(section, incomplete)), undefined, field);
    }
  }
  assert.throws(() => validateSkillUse(valid.replace("tech-leads-club/agent-skills", "example/wrong-skill")), /source/);
  assert.throws(() => validateSkillUse(valid.replace("a".repeat(40), "a".repeat(39))), /revision/);
  assert.throws(() => validateSkillUse(valid.replace("Invocation: Use domain-analysis to identify business areas only.", "Invocation: ")), /invocation/);
});

test("business documents pass while technical output and oversized glossaries fail", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "domain-validation-"));
  try {
    fs.mkdirSync(path.join(root, "docs"));
    fs.mkdirSync(path.join(root, "evidence"));
    fs.writeFileSync(path.join(root, "CONTEXT.md"), "# Business terms\nMember: a person belonging to a workspace.\n");
    const domainPath = path.join(root, "docs/domain-model.md");
    fs.writeFileSync(domainPath, "# Product purpose\nHelp authorized members understand their export eligibility.\n");
    fs.writeFileSync(path.join(root, "evidence/skill-use.md"), valid);
    fs.writeFileSync(path.join(root, "evidence/business-session.txt"), "Synthetic validation fixture, not evidence from a learner session. ".repeat(3));
    validate(root);
    for (const heading of ["Service boundaries", "Coupling scores", "Implementation recommendations", "API endpoints"]) {
      fs.writeFileSync(domainPath, `## ${heading}\nOut of scope.\n`);
      assert.throws(() => validate(root), /business knowledge/);
    }
    fs.writeFileSync(domainPath, "# Business workflows\nExport eligibility.\n");
    fs.writeFileSync(path.join(root, "CONTEXT.md"), "term ".repeat(701));
    assert.throws(() => validate(root), /concise glossary/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
