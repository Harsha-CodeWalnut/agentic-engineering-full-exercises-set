# Cache saturation

## Timeline
A warning at 03:09 started the incident. Cache was expanded at 03:41 and that restored service.

## Impact
12,400 customers waited on catalog reads.

## Cause and uncertainty
Deployment catalog-771 increased key fan-out. That is the cause.

## Resolution
Expanding the cache pool recovered the service at 03:41.

## Follow-up actions
Platform completed reproduction of key fan-out.
