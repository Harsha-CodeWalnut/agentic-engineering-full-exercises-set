import assert from "node:assert/strict";
import { buttonVariantFor } from "../src/migration/exportButton.mjs";

assert.equal(buttonVariantFor("export"), "ds-secondary", "export uses the design-system secondary variant");
assert.equal(buttonVariantFor("checkout"), "legacy-primary");
assert.equal(buttonVariantFor("delete"), "legacy-danger");
for (const action of ["archive", "save", "unknown", "", "Export", undefined, null]) {
  assert.equal(buttonVariantFor(action), "legacy-primary", `${String(action)} preserves the legacy fallback`);
}
console.log("PASS only export changes variant; other actions retain legacy behavior");
