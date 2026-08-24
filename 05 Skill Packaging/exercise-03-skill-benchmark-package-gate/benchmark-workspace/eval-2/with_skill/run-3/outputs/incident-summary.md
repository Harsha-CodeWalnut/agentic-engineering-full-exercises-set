# Export queue delay

## Timeline
The export-latency alert opened at 14:05 [EVT-B1].
The worker pool was increased from 8 to 16 at 14:38 and queue depth returned to normal by 14:46 [REM-B4].

## Impact
41 customers had exports delayed by more than 20 minutes. No export data was lost [IMP-B2].

## Cause and uncertainty
Two unconfirmed inferences remain in conflict: a long-running lock [NOTE-B3a] and worker starvation after a concurrency change [NOTE-B3b]. Neither cause is confirmed; the conflict is unresolved.

## Resolution
The deployed worker pool increase restored normal queue depth [REM-B4]. Root cause is not assigned.

## Follow-up actions
[ACT-B5] remains open, owner Reliability: reconcile the database and worker evidence before assigning root cause.
