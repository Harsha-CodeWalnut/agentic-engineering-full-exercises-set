# Checkout retry saturation

## Timeline
The alert opened at 09:02. Retries were disabled at 09:11 and the service recovered then. A deploy at 09:18 cleaned up the retry loop. Probes later looked healthy.

## Impact
Hundreds of checkout attempts failed. Customer impact was obvious even without a precise unique-user count.

## Cause and uncertainty
Retry amplification exhausted the worker pool. That is the root cause.

## Resolution
Disabling retries restored the service at 09:11. The later deploy was cleanup.

## Follow-up actions
Retry saturation alerting was completed by Payments Platform.
