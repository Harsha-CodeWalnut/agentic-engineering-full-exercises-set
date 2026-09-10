import { runEvidence } from "../../../../scripts/context-document-evidence.mjs";
import { validate } from "./challenge-validation.mjs";
await runEvidence({ appRoot: process.cwd(), validate });
