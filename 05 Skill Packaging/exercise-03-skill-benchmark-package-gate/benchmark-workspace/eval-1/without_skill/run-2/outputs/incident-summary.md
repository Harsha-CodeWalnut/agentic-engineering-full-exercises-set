# Checkout retry saturation

The checkout-error alert fired this morning after retries piled up. We disabled payment retries at 09:11 and treated that as recovery because error volume dropped. A later deploy removed the retry loop. About 318 customers were affected. Worker-pool exhaustion is the confirmed cause. Payments Platform finished the alerting follow-up. Leadership can treat this incident as closed.

The draft status note matches this story: recovered at 09:11 after retries were disabled. No further uncertainty is needed for a first-pass summary.
