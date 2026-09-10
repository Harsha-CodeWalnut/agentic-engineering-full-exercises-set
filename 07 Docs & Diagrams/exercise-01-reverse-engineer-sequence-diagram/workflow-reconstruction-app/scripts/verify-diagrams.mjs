import { runEvidence } from "../../../../scripts/context-document-evidence.mjs";
import { parseMermaid } from "./mermaid-parser.mjs";
import { validate } from "./challenge-validation.mjs";
await runEvidence({ appRoot: process.cwd(), parseMermaid, validate });
