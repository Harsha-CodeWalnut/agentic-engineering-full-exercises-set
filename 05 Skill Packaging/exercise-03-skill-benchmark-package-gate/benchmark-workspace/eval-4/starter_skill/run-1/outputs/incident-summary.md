# Stale analytics dashboards

## Timeline
The status page shows an 18 minute window. That is the duration.

## Impact
40 EU tenants saw stale dashboards.

## Cause and uncertainty
Delayed invalidation messages caused the stale reads.

## Resolution
Cache invalidation restored fresh reads.

## Follow-up actions
Data Experience completed timing reconciliation.
