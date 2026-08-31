# Verification

Source SHA: `b994b77c09961751c61eecc026db803bc0e4f0e2`.

Graph regeneration: `npm run graph:build` wrote `artifacts/code-graph.json` with 11 nodes and 9 edges. The verifier rebuilds the graph from notification source and requires a normalized match.

Mermaid parser: `diagrams/notification-dependencies.mmd` parses as flowchart-v2. `diagrams/fallback-sequence.mmd` parses as sequence.

Semantic edge: DEP-01 through DEP-06 each match one generated `selectNotificationRoute` call edge. The dependency diagram contains only ChannelRouter to ProviderStatus, ConsentPolicy, ImmediateRoute, and DurableQueue.

Routing test: `npm run test:routing` exited 0 for push primary, consented SMS, email fallback, and durable queue cases.

Stale claim: STALE-01 and STALE-02 are supported; STALE-03 through STALE-06 are rejected against the generated graph and source.

Remaining uncertainty: none for required call relationships. Channel health still comes from caller-supplied booleans rather than a live provider probe.

Final conclusion: the generated graph, consent-aware router, diagrams, and evidence agree at this source SHA.
