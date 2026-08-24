# Export queue delay

## Timeline
The export-latency alert opened at 14:05. The worker pool was increased at 14:38 and the queue was healthy by 14:46.

## Impact
41 customers had delayed exports. Nothing was lost.

## Cause and uncertainty
A long-running database lock caused the delay.

## Resolution
Increasing the worker pool restored normal depth.

## Follow-up actions
Reliability completed the cause review after the pool increase.
