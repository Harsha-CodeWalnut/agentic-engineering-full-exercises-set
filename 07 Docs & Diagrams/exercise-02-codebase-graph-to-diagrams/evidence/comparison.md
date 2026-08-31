# Comparison

Both attempts used starting commit `94687b092fe695b5ce2f6a8848f8c26180bd09b5` as the PR base, the same agent and model, the same tools and permissions, a 45-minute limit, and a genuine first attempt with zero human hints. The variable is graph authority: the stale snapshot versus a generated call graph plus the current routing contract.

## Graph accuracy

Before copied snapshot edges that do not exist in source: `ProviderStatus --> ConsentPolicy` and `ImmediateRoute --> DurableQueue`. It omitted ChannelRouter to ConsentPolicy and ChannelRouter to DurableQueue as first-class calls.

After generated `artifacts/code-graph.json` from `src/notification`. Query of `selectNotificationRoute` shows six outgoing call edges. The path from `selectNotificationRoute` to `durableQueueRoute` is a direct call.

## Routing behavior

Before left the seeded defect: SMS was selected whenever the provider was available, including `smsConsent: false`.

After: `npm run test:routing` passes all six cases. Push stays primary. SMS requires explicit consent. Email is the next fallback. The durable queue is used when no permitted immediate channel exists.

## Diagram traceability

Before had no DEP markers and no generated edge IDs.

After maps DEP-01 through DEP-06 to generated `calls:*` IDs and exact `source_lines` in `routeNotification.mjs`.

## Verification

Before: snapshot-led diagrams; routing tests not used as the authority.

After: graph regeneration, Mermaid parse, semantic edges, routing tests, and stale-claim review are bound to source SHA `b994b77c09961751c61eecc026db803bc0e4f0e2`.
