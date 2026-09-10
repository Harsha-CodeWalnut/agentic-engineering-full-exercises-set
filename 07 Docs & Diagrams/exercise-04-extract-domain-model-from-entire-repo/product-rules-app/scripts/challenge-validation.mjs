import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

export function validateSkillUse(text) {
  const sources = {
    "domain-analysis": /tech-leads-club\/agent-skills/,
    "domain-modeling": /mattpocock\/skills|aihero\.dev\/skills-domain-modeling/,
  };
  const sections = text.split(/^##\s+/m).slice(1);
  for (const [name, source] of Object.entries(sources)) {
    const matches = sections.filter((section) => section.split(/\r?\n/, 1)[0].trim() === name);
    assert.equal(matches.length, 1, `record exactly one ## ${name} section in skill-use.md`);
    const section = matches[0];
    const sourceLine = section.match(/^(?:- )?Source: (\S.*)$/m)?.[1] ?? "";
    assert.match(sourceLine, source, `record the upstream source for ${name}`);
    assert.match(section, /^(?:- )?(?:Revision: [a-f0-9]{40}|SHA-256: [a-f0-9]{64})\s*$/m,
      `record the installed revision or skill file hash for ${name}`);
    for (const field of ["Invocation", "Proof"]) {
      assert.match(section, new RegExp(`^(?:- )?${field}: \\S[^\\r\\n]*`, "m"),
        `record ${field.toLowerCase()} for ${name}`);
    }
  }
}

export function validate(root) {
  for(const file of ["CONTEXT.md","docs/domain-model.md"]) {
    const text=fs.readFileSync(path.join(root,file),"utf8");
    assert.ok(!/^#{1,6}\s+(?:Tech stack|API endpoints|Database schema|Deployment|Code structure|Frameworks|Service boundaries|Coupling scores|Implementation (?:notes|recommendations)|Refactoring recommendations)\b/im.test(text),file+" must describe business knowledge");
  }
  const glossary=fs.readFileSync(path.join(root,"CONTEXT.md"),"utf8");
  assert.ok(glossary.trim().split(/\s+/).length<=700,"keep CONTEXT.md a concise glossary; put business workflows in domain-model.md");
  const skill=fs.readFileSync(path.join(root,"evidence/skill-use.md"),"utf8");
  validateSkillUse(skill);
  assert.ok(fs.readFileSync(path.join(root,"evidence/business-session.txt"),"utf8").trim().length>100,"include the fresh agent's business Q&A transcript");
}
