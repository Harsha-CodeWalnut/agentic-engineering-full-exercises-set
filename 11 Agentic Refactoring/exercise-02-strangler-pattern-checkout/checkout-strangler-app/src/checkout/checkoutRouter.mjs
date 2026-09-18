export async function routeCheckout(request, implementations) {
  const shouldUseCardSlice = request.paymentType === "card" && implementations.cardSliceEnabled;

  if (!shouldUseCardSlice) {
    return implementations.legacy(request);
  }

  try {
    return await implementations.card(request);
  } catch {
    return implementations.legacy(request);
  }
}
