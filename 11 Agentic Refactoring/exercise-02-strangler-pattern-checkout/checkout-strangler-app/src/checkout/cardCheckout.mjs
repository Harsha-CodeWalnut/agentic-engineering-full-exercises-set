const PAYMENT_DECLINED = "PAYMENT_DECLINED";

function calculateTotalCents(request) {
  const taxCents = Math.round(request.subtotalCents * request.taxRateBps / 10000);
  return request.subtotalCents + taxCents;
}

function approvedResult(request, totalCents) {
  return {
    orderId: request.orderId,
    status: "paid",
    totalCents,
    errorCode: null,
  };
}

function declinedResult(request, totalCents) {
  return {
    orderId: request.orderId,
    status: "failed",
    totalCents,
    errorCode: PAYMENT_DECLINED,
  };
}

export function createCardCheckout({ authorize }) {
  return async function cardCheckout(request) {
    const amountCents = calculateTotalCents(request);
    const authorization = await authorize({
      orderId: request.orderId,
      amountCents,
      paymentToken: request.paymentToken,
    });

    if (authorization.approved) {
      return approvedResult(request, amountCents);
    }

    return declinedResult(request, amountCents);
  };
}
