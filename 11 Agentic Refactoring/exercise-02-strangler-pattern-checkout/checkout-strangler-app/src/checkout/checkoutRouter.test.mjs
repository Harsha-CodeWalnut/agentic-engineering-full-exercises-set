import assert from "node:assert/strict";
import test from "node:test";
import { routeCheckout } from "./checkoutRouter.mjs";

const cardRequest = {
  orderId: "ord-card",
  paymentType: "card",
  subtotalCents: 1001,
  taxRateBps: 825,
  paymentToken: "tok-card",
};

function checkoutResult(request, status = "paid", errorCode = null) {
  return {
    orderId: request.orderId,
    status,
    totalCents: request.subtotalCents + Math.round(request.subtotalCents * request.taxRateBps / 10000),
    errorCode,
  };
}

function routingFakes(cardBehavior = async (request) => checkoutResult(request)) {
  const calls = { legacy: [], card: [] };
  return {
    calls,
    implementations: {
      legacy: async (request) => {
        calls.legacy.push(structuredClone(request));
        return checkoutResult(request);
      },
      card: async (request) => {
        calls.card.push(structuredClone(request));
        return cardBehavior(request);
      },
      cardSliceEnabled: true,
    },
  };
}

test("given_enabled_card_slice_when_checkout_is_routed_then_only_new_card_slice_runs", async () => {
  const fakes = routingFakes();

  const result = await routeCheckout(structuredClone(cardRequest), fakes.implementations);

  assert.deepEqual(result, checkoutResult(cardRequest));
  assert.deepEqual(fakes.calls, { legacy: [], card: [cardRequest] });
});

test("given_non_card_payment_types_when_checkout_is_routed_then_each_remains_on_legacy", async () => {
  for (const paymentType of ["gift-card", "invoice", "crypto"]) {
    const fakes = routingFakes();
    const request = { ...cardRequest, paymentType };

    const result = await routeCheckout(structuredClone(request), fakes.implementations);

    assert.deepEqual(result, checkoutResult(request));
    assert.deepEqual(fakes.calls, { legacy: [request], card: [] });
  }
});

test("given_disabled_card_slice_when_card_checkout_is_routed_then_legacy_runs_once", async () => {
  const fakes = routingFakes();
  fakes.implementations.cardSliceEnabled = false;

  const result = await routeCheckout(structuredClone(cardRequest), fakes.implementations);

  assert.deepEqual(result, checkoutResult(cardRequest));
  assert.deepEqual(fakes.calls, { legacy: [cardRequest], card: [] });
});

test("given_explicit_pre_authorization_failure_when_card_checkout_is_routed_then_legacy_falls_back_once", async () => {
  const fakes = routingFakes(async () => {
    throw { authorizationCreated: false };
  });

  const result = await routeCheckout(structuredClone(cardRequest), fakes.implementations);

  assert.deepEqual(result, checkoutResult(cardRequest));
  assert.deepEqual(fakes.calls, { legacy: [cardRequest], card: [cardRequest] });
});

test("given_completed_authorization_failure_when_card_checkout_is_routed_then_legacy_never_retries", async () => {
  const failureResult = checkoutResult(cardRequest, "failed", "PAYMENT_STATE_UNKNOWN");
  const fakes = routingFakes(async () => {
    throw { authorizationCreated: true, result: failureResult };
  });

  const result = await routeCheckout(structuredClone(cardRequest), fakes.implementations);

  assert.deepEqual(result, failureResult);
  assert.deepEqual(fakes.calls, { legacy: [], card: [cardRequest] });
});

test("given_ambiguous_failure_with_valid_result_when_card_checkout_is_routed_then_result_is_preserved_without_retry", async () => {
  const failureResult = checkoutResult(cardRequest, "failed", "PAYMENT_STATE_UNKNOWN");
  const fakes = routingFakes(async () => {
    throw { result: failureResult };
  });

  const result = await routeCheckout(structuredClone(cardRequest), fakes.implementations);

  assert.deepEqual(result, failureResult);
  assert.deepEqual(fakes.calls, { legacy: [], card: [cardRequest] });
});

test("given_malformed_or_primitive_failure_when_card_checkout_is_routed_then_unknown_result_returns_without_retry", async () => {
  for (const failure of [{ authorizationCreated: true, result: { status: "failed" } }, "gateway unknown"]) {
    const fakes = routingFakes(async () => {
      throw failure;
    });

    const result = await routeCheckout(structuredClone(cardRequest), fakes.implementations);

    assert.deepEqual(result, checkoutResult(cardRequest, "failed", "PAYMENT_STATE_UNKNOWN"));
    assert.deepEqual(fakes.calls, { legacy: [], card: [cardRequest] });
  }
});
