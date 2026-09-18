const PAYMENT_STATE_UNKNOWN = "PAYMENT_STATE_UNKNOWN";

function calculateTotalCents(request) {
  return request.subtotalCents + Math.round(request.subtotalCents * request.taxRateBps / 10000);
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCompletePublicResult(result, request) {
  if (!isObject(result)) {
    return false;
  }

  const fields = Object.keys(result).sort();
  const expectedFields = ["errorCode", "orderId", "status", "totalCents"];
  return fields.length === expectedFields.length
    && fields.every((field, index) => field === expectedFields[index])
    && result.orderId === request.orderId
    && ["paid", "failed"].includes(result.status)
    && result.totalCents === calculateTotalCents(request)
    && (result.errorCode === null || typeof result.errorCode === "string");
}

function unknownPaymentState(request) {
  return {
    orderId: request.orderId,
    status: "failed",
    totalCents: calculateTotalCents(request),
    errorCode: PAYMENT_STATE_UNKNOWN,
  };
}

export async function routeCheckout(request, implementations) {
  const shouldUseCardSlice = request.paymentType === "card" && implementations.cardSliceEnabled;

  if (!shouldUseCardSlice) {
    return implementations.legacy(request);
  }

  try {
    return await implementations.card(request);
  } catch (failure) {
    if (isObject(failure) && failure.authorizationCreated === false) {
      return implementations.legacy(request);
    }

    if (isObject(failure) && isCompletePublicResult(failure.result, request)) {
      return failure.result;
    }

    return unknownPaymentState(request);
  }
}
