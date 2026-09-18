# Public Contract Comparison

The card slice preserves the four-field result shape exactly: `orderId`, `status`, `totalCents`, and `errorCode`. It sends `authorize` the original `orderId` and `paymentToken` together with `amountCents` calculated as the subtotal plus rounded tax.

For the rounding boundary of 1,001 cents at 825 basis points, both legacy and the card slice return `totalCents: 1084`. An approved authorization returns `status: paid` and `errorCode: null`. A declined authorization returns `status: failed` and `errorCode: PAYMENT_DECLINED`.

The router does not change gift-card, invoice, unknown, or flag-off behavior. For an unsafe authorization outcome it preserves a valid complete public result. If that result is absent or malformed, it uses the same calculated total and returns `status: failed` with `errorCode: PAYMENT_STATE_UNKNOWN`, never retrying legacy.

The protected comparison covers both approved and declined fixtures, confirms one authorization call, and checks the exact authorization request and exact public result.
