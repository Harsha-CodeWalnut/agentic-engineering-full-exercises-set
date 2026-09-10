import type { LabContract } from "./types";

export const labContract = {
  "title": "Payment Module Visualization",
  "competency": "07. Docs & Diagrams",
  "skillPattern": "design-doc-mermaid",
  "domain": "Payment checkout authorization, capture, ledger, receipt, and idempotent webhook reconciliation.",
  "mission": "Your team cannot clearly explain the payment module because its behaviour is spread across checkout, payment, webhook, ledger, and receipt code. Your mission is to inspect the implementation and visualize the complete payment module.  Create four diagrams: an Architecture diagram, a sequence diagram, a flow chart, and an ER diagram.",
  "outcome": "The challenge is complete when all four diagrams parse, agree with one another, represent the implemented payment module, include important failure and duplicate-event behaviour, and are supported by source evidence.",
  "entities": [
    "CheckoutOrder",
    "PaymentIntent",
    "GatewayTransaction",
    "LedgerEntry",
    "WebhookEvent",
    "Receipt"
  ],
  "seededDefects": ["Outdated supporting descriptions","Important relationships scattered across source files","Unverified assumptions in initial understanding"],
  "verificationGates": [
    "Working source behaviour and protected inputs.",
    "Artifact and source citation checks.",
    "Committed evidence snapshot and command capture."
  ],
  "agentWorkflow": [
    "Record the starting observations and sources.",
    "Use Design Doc Mermaid for the four checked payment views; optional visual copies must agree with them.",
    "Produce the outputs in evidence-contract.json.",
    "Verify source claims and capture the completed result."
  ],
  "workingDeliverables": [
    "diagrams/payment-architecture.mmd",
    "diagrams/payment-sequence.mmd",
    "diagrams/payment-flow.mmd",
    "diagrams/payment-data.mmd",
    "evidence/contradictions.md",
    "evidence/before.md",
    "evidence/after.md",
    "evidence/comparison.md",
    "evidence/source-audit.json",
    "evidence/manifest.json",
    "evidence/skill-use.md",
    "evidence/skill-session.txt",
    "evidence/commands/verify.txt"
  ],
  "masterySignals": [
    "Accurate source-supported understanding.",
    "Explicit unresolved questions.",
    "A result another person or agent can use."
  ],
  "backlog": [
    {
      "id": "7.3-1",
      "title": "Verify architecture",
      "owner": "participant",
      "skill": "implementation-to-multiple-views",
      "risk": "high",
      "done": false
    },
    {
      "id": "7.3-2",
      "title": "Verify authorization",
      "owner": "participant",
      "skill": "implementation-to-multiple-views",
      "risk": "high",
      "done": false
    },
    {
      "id": "7.3-3",
      "title": "Verify capture",
      "owner": "participant",
      "skill": "implementation-to-multiple-views",
      "risk": "high",
      "done": false
    }
  ],
  "evidence": [
    {
      "gate": "diagrams/payment-architecture.mmd",
      "status": "missing",
      "proof": "Participant output and source audit required"
    },
    {
      "gate": "diagrams/payment-sequence.mmd",
      "status": "missing",
      "proof": "Participant output and source audit required"
    },
    {
      "gate": "diagrams/payment-flow.mmd",
      "status": "missing",
      "proof": "Participant output and source audit required"
    },
    {
      "gate": "diagrams/payment-data.mmd",
      "status": "missing",
      "proof": "Participant output and source audit required"
    },
    {
      "gate": "evidence/contradictions.md",
      "status": "missing",
      "proof": "Participant output and source audit required"
    }
  ],
  "decisions": [
    {
      "question": "Which source claims remain uncertain?",
      "decision": "Record and verify evidence before concluding.",
      "status": "open"
    }
  ]
} satisfies LabContract;
