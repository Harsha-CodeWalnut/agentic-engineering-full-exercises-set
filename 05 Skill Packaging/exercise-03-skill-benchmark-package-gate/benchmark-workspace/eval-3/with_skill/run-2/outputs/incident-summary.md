# Cache saturation

## Timeline
The first valid elevated-latency signal fired at 03:14 [EVT-C1]. An earlier 03:09 warning was a monitor test and is not detection.
Both read and write probes passed for five consecutive minutes at 03:49, confirming recovery [EVT-C6].

## Impact
12,400 catalog requests exceeded the two-second latency objective. Customer count was not measured [IMP-C4].

## Cause and uncertainty
Cache saturation above 96 percent is a verified fact [OBS-C2]. Deployment catalog-771 increasing key fan-out remains a hypothesis because request-level traces were unavailable [HYP-C3].

## Resolution
The cache pool was expanded and hot keys were evicted at 03:41 [REM-C5]. Recovery is the 03:49 probe window [EVT-C6].

## Follow-up actions
[ACT-C2] remains open, owner Platform: reproduce key fan-out under load and compare it with the deployment.
