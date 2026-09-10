import fs from "node:fs";
import path from "node:path";
import { parseMermaid } from "./mermaid-parser.mjs";
const contract=JSON.parse(fs.readFileSync("evidence-contract.json","utf8"));
for(const item of contract.outputs.filter(item=>item.type==="mermaid")) {
 const result=await parseMermaid(fs.readFileSync(path.resolve("..",item.path),"utf8"));
 if(result.diagramType!==item.diagramType) throw new Error("Wrong diagram type: "+item.path);
 console.log("PASS "+item.path);
}
