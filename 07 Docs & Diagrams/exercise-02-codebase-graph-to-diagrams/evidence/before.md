# Before: stale-snapshot graph reconstruction

### Run

- Starting commit: `94687b092fe695b5ce2f6a8848f8c26180bd09b5`
- Implementation commit: `ace96193ea7082eb0fff3da3c4613e3a47b7e3a7`
- Agent: Cursor Grok 4.6
- Model: Cursor Grok 4.6
- Tools: file read/edit, shell, git
- Permissions: workspace write and command execution
- Time limit: 45 minutes
- Attempt: 1
- Human hints: 0
- Prompt: Reconstruct the notification architecture from `docs/graph-snapshot.md`. Create `diagrams/notification-dependencies.mmd` and `diagrams/fallback-sequence.mmd`.
- Graph source: `docs/graph-snapshot.md` (stale snapshot)
- Routing contract: Not provided
- Generated graph: Not used
- Patch: `evidence/before.patch`

### Results

| Proof | Result |
|---|---|
| Graph source | Stale snapshot, not generated from `src/notification` |
| Unsupported edges | 2 (`ProviderStatus --> ConsentPolicy`, `ImmediateRoute --> DurableQueue`) |
| Missing required edges | ChannelRouter to ConsentPolicy and ChannelRouter to DurableQueue as first-class calls |
| Missing sequence terms | sms not consented; email selected; email unavailable; durable queue selected |
| Routing tests | Not run; SMS-without-consent defect left in place |
| Files changed | 2 |
| Lines added and removed | `+15 / -0` |

### Important problems

1. Consent is drawn as a child of provider availability, matching the snapshot instead of `selectNotificationRoute -> hasSmsConsent`.
2. Immediate delivery is drawn as feeding the durable queue after failure; source has no such call.
3. SMS is treated as an immediate channel whenever the provider is available, with no consent check.
