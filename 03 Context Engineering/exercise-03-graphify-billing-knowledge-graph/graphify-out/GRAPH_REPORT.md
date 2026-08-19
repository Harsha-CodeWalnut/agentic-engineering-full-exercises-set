# Graph Report - exercise-03-graphify-billing-knowledge-graph  (2026-08-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 129 nodes · 174 edges · 12 communities (10 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `94687b09`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 16 edges
3. `TenantAccountLink` - 7 edges
4. `buildRevenueSummary()` - 7 edges
5. `LabContract` - 6 edges
6. `BillingEvent` - 6 edges
7. `App()` - 5 edges
8. `resolveBillingAccountId()` - 5 edges
9. `grossVolumeByAccount()` - 4 edges
10. `recognizedRevenueByAccount()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `loadRevenueDashboard()` --calls--> `buildRevenueSummary()`  [EXTRACTED]
  billing-graph-app/src/dashboard/loadRevenueDashboard.ts → billing-graph-app/src/billing/revenueSummary.ts
- `publishRevenueSnapshot()` --calls--> `buildRevenueSummary()`  [EXTRACTED]
  billing-graph-app/src/jobs/publishRevenueSnapshot.ts → billing-graph-app/src/billing/revenueSummary.ts
- `App()` --calls--> `evidenceStatus()`  [EXTRACTED]
  billing-graph-app/src/App.tsx → billing-graph-app/src/skillWorkflow.ts
- `App()` --calls--> `readinessScore()`  [EXTRACTED]
  billing-graph-app/src/App.tsx → billing-graph-app/src/skillWorkflow.ts
- `App()` --calls--> `riskSummary()`  [EXTRACTED]
  billing-graph-app/src/App.tsx → billing-graph-app/src/skillWorkflow.ts

## Import Cycles
- None detected.

## Communities (12 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (15): App(), DecisionLog(), EvidenceLedger(), SkillPatternBoard(), labContract, root, evidenceStatus(), readinessScore() (+7 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (22): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (16): scripts, agent:check, build, dev, format, lint, preview, test (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.38
Nodes (9): BillingEvent, RevenueSummary, TenantAccountLink, grossVolumeByAccount(), recognizedRevenueByAccount(), buildRevenueSummary(), resolveBillingAccountId(), loadRevenueDashboard() (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (11): devDependencies, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react, @types/react, @types/react-dom (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (8): appRoot, evidence, evidencePaths, exerciseRoot, failures, readRequired(), sha256(), verifyStarterIntegrity()

### Community 6 - "Community 6"
Cohesion: 0.20
Nodes (9): dependencies, react, react-dom, name, private, type, version, react (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (5): failures, files, missingSections, readme, requiredSections

### Community 8 - "Community 8"
Cohesion: 0.40
Nodes (4): contract, docsDir, failures, root

## Knowledge Gaps
- **65 isolated node(s):** `DecisionItem`, `root`, `riskWeight`, `allowJs`, `allowSyntheticDefaultImports` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `scripts` connect `Community 2` to `Community 6`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 4` to `Community 6`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `DecisionItem`, `root`, `riskWeight` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._