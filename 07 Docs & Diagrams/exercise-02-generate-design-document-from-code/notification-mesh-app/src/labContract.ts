import type { LabContract } from "./types";

export const labContract = {
  "title": "Generate a Design Document from Code",
  "competency": "07. Docs & Diagrams",
  "skillPattern": "acquire-codebase-knowledge",
  "domain": "Notification routing across provider availability, SMS consent, immediate delivery, and durable queue fallback.",
  "mission": "Your team has a working application but no reliable design document. Your mission is to inspect the code and generate a design document that explains the system as it exists today.  The document must explain the architecture, responsibilities, dependencies, data flow, important decisions, operational behaviour, and safe change boundaries.",
  "outcome": "The challenge is complete when the design document matches the current code, clearly explains how the system works and where changes belong, and its important claims can be verified from the repository.",
  "entities": [
    "ChannelRouter",
    "ProviderStatus",
    "ConsentPolicy",
    "ImmediateRoute",
    "DurableQueue"
  ],
  "seededDefects": ["Outdated supporting descriptions","Important relationships scattered across source files","Unverified assumptions in initial understanding"],
  "verificationGates": [
    "Working source behaviour and protected inputs.",
    "Artifact and source citation checks.",
    "Committed evidence snapshot and command capture."
  ],
  "agentWorkflow": [
    "Record the starting observations and sources.",
    "Use Acquire Codebase Knowledge for source-backed discovery and consolidate the findings into one design document.",
    "Produce the outputs in evidence-contract.json.",
    "Verify source claims and capture the completed result."
  ],
  "workingDeliverables": [
    "docs/design-document.md",
    "evidence/stale-claims.md",
    "evidence/before.md",
    "evidence/after.md",
    "evidence/comparison.md",
    "evidence/source-audit.json",
    "evidence/manifest.json",
    "evidence/skill-use.md",
    "evidence/skill-session.txt",
    "evidence/codebase-scan.txt",
    "evidence/commands/verify.txt"
  ],
  "masterySignals": [
    "Accurate source-supported understanding.",
    "Explicit unresolved questions.",
    "A result another person or agent can use."
  ],
  "backlog": [
    {
      "id": "7.2-1",
      "title": "Verify architecture",
      "owner": "participant",
      "skill": "source-to-graph-to-diagram",
      "risk": "high",
      "done": false
    },
    {
      "id": "7.2-2",
      "title": "Verify responsibilities",
      "owner": "participant",
      "skill": "source-to-graph-to-diagram",
      "risk": "high",
      "done": false
    },
    {
      "id": "7.2-3",
      "title": "Verify dependencies",
      "owner": "participant",
      "skill": "source-to-graph-to-diagram",
      "risk": "high",
      "done": false
    }
  ],
  "evidence": [
    {
      "gate": "docs/design-document.md",
      "status": "missing",
      "proof": "Participant output and source audit required"
    },
    {
      "gate": "evidence/stale-claims.md",
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
