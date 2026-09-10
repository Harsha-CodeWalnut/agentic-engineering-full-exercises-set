import assert from "node:assert/strict";
import { buttonVariantFor } from "../src/migration/exportButton.mjs";

assert.equal(buttonVariantFor("export"), "ds-secondary", "export uses the design-system secondary variant");
assert.equal(buttonVariantFor("checkout"), "legacy-primary", "checkout keeps its legacy variant");
assert.equal(buttonVariantFor("delete"), "legacy-danger", "delete keeps its destructive variant");
for (const action of ["archive", "save", "unknown", "", "Export"]) {
  assert.equal(buttonVariantFor(action), "legacy-primary", `${action || "empty action"} keeps the legacy fallback`);
}
console.log("PASS export-only migration and unchanged legacy variants");
