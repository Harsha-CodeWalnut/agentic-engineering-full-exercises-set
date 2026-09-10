import { runEvidence } from "../../../../scripts/context-document-evidence.mjs";
import { validate } from "./challenge-validation.mjs";
import { parseMermaid } from "./mermaid-parser.mjs";
await runEvidence({ appRoot: process.cwd(), parseMermaid, validate });
