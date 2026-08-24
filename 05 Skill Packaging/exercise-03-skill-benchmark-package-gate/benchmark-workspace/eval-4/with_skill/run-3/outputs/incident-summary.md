# Stale analytics dashboards

## Timeline
The public status page records an 18 minutes degradation window [EVT-D1].
Service logs record elevated stale-read errors for 23 minutes [LOG-D4]. The five-minute difference is unresolved.

## Impact
Some EU tenants received stale dashboards. No verified tenant or customer count exists [IMP-D3].

## Cause and uncertainty
Delayed invalidation messages may explain the stale reads, but queue traces were not retained. That remains an inference [HYP-D6]. Duration sources [EVT-D1] and [LOG-D4] disagree; the conflict is unresolved.

## Resolution
A cache invalidation change restored fresh reads; validation covered the EU and US read paths [REM-D5].

## Follow-up actions
[ACT-D2] remains open, owner Data Experience: reconcile status-page timing with service logs and document the authoritative duration.
