# After: generated-graph notification reconstruction

### Run

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Implementation commit / source SHA: `b994b77c09961751c61eecc026db803bc0e4f0e2`
- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Tools: file read/edit, shell, git
- Permissions: workspace write and command execution
- Time limit: 45 minutes
- Attempt: 1
- Human hints: 0
- Prompt: Generate the notification graph from source, repair routing so SMS requires consent, and produce dependency and fallback-sequence diagrams mapped to DEP-01 through DEP-06.
- Graph source: `npm run graph:build` over `src/notification/**/*.mjs`
- Routing contract: `docs/current-routing-contract.md`
- Generated graph: Used
- Patch: `evidence/after.patch`

### Results

| Proof | Result |
|---|---|
| `npm run test:routing` | Pass; exit code: 0 |
| Graph source | Generated from notification source at the source SHA |
| Unsupported edges | 0 |
| Missing required call edges | 0 (DEP-01 through DEP-06 present once) |
| Routing | Push primary; consented SMS; email fallback; durable queue when nothing is permitted |
| Files changed at source SHA | `routeNotification.mjs` and two Mermaid diagrams |

### Changed files

- `notification-mesh-app/src/notification/routeNotification.mjs`
- `diagrams/notification-dependencies.mmd`
- `diagrams/fallback-sequence.mmd`
