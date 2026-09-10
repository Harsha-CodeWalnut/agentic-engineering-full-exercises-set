import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
export function validate(root) {
 const text=fs.readFileSync(path.join(root,"docs/design-document.md"),"utf8");
 assert.ok(!/\b(?:TODO|TBD|FIXME)\b/.test(text),"resolve template placeholders or record explicit unanswered questions");
}
