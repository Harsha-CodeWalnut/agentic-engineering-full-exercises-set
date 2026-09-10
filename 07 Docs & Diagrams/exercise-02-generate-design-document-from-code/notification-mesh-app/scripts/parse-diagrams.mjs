import fs from "node:fs";
import { parseMermaid } from "./mermaid-parser.mjs";

const document = fs.readFileSync("../docs/design-document.md", "utf8").replaceAll("\r\n", "\n");
const blocks = [...document.matchAll(/^```mermaid\s*\n([\s\S]*?)^```\s*$/gm)];
for (const [index, block] of blocks.entries()) {
  const parsed = await parseMermaid(block[1]);
  console.log(`PASS optional diagram ${index + 1}: ${parsed.diagramType}`);
}
console.log(`Parsed ${blocks.length} embedded diagrams. Diagrams support the design document; they are not required separately.`);
