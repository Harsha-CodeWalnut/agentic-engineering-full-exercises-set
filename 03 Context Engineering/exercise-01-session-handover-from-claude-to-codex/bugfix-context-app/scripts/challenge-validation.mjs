import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
export function verifyContinuationSource(root, implementation) {
  const changed = execFileSync("git", ["diff", "--name-only", implementation, "--", "bugfix-context-app/src/"], { cwd: root }).toString().trim();
  assert.equal(changed, "", "source must match the recorded continuation implementation");
}
export function validate(root) {
  const before = fs.readFileSync(path.join(root,"evidence/before.md"),"utf8");
  const after = fs.readFileSync(path.join(root,"evidence/after.md"),"utf8");
  const start = before.match(/^(?:- )?Starting commit: ([a-f0-9]{40})\s*$/m)?.[1];
  const end = after.match(/^(?:- )?Implementation commit: ([a-f0-9]{40})\s*$/m)?.[1];
  assert.ok(start && end,"record full Starting commit and Implementation commit fields");
  const git = (args) => execFileSync("git",args,{cwd:root});
  git(["merge-base","--is-ancestor",start,end]);
  git(["merge-base","--is-ancestor",end,"HEAD"]);
  verifyContinuationSource(root, end);
  const patch = git(["diff","--binary","--full-index",start,end]);
  assert.ok(patch.length && patch.equals(fs.readFileSync(path.join(root,"evidence/after.patch"))),"after.patch must match the recorded implementation commits");
  const handover = fs.readFileSync(path.join(root,"evidence/handover.md"),"utf8");
  assert.ok(handover.trim().split(/\s+/).length <= 1200,"keep the handover under 1,200 words");
  const transcript = fs.readFileSync(path.join(root,"evidence/continuation.txt"),"utf8");
  assert.ok(transcript.trim().length > 100,"include the actual fresh Codex continuation transcript");
  assert.match(after,/Codex/i,"identify the receiving Codex session");
}
