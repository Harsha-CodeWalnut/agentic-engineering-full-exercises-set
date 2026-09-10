import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
export function checkSequence(text) {
  assert.match(text,/^sequenceDiagram\b/m,"submit one sequence diagram");
  for(const actor of ["Employee","Application","Manager","PolicyEngine","Security","DataOwner","IdentityProvider","IdentityAdmin"])
    assert.match(text,new RegExp("(?:participant|actor)\\s+"+actor+"\\b"),"missing workflow participant "+actor);
  assert.match(text,/alt\s+High risk/i,"show the high-risk alternative");
  assert.match(text,/else\s+Normal risk/i,"show the normal-risk alternative");
  assert.match(text,/alt\s+Provisioning successful/i,"show successful provisioning");
  assert.match(text,/else\s+Provisioning failed/i,"show provisioning failure");
  assert.match(text,/IdentityAdmin\s*(?:->>|-->>)\s*Application\s*:[^\n]*rolled.back/i,"rollback completion must be acknowledged by IdentityAdmin");
}
export function validate(root) { checkSequence(fs.readFileSync(path.join(root,"diagrams/access-sequence.mmd"),"utf8")); }
