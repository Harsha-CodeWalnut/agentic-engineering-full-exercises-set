import { randomUUID } from "node:crypto";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

async function isolateCheckout(page: Page, request: APIRequestContext, testId: string) {
  const session = `${testId}-${randomUUID()}`;
  await page.setExtraHTTPHeaders({ "x-checkout-session": session });
  await request.post("/api/testing/reset", {
    headers: { "x-checkout-session": session },
  });
  return session;
}

test("tax payload is quoted before Pay becomes ready", async ({ page, request }, testInfo) => {
  await isolateCheckout(page, request, testInfo.testId);
  const taxRequestPromise = page.waitForRequest(
    (candidate) => candidate.url().includes("/api/tax-quote") && candidate.method() === "POST",
  );
  await page.goto("/");
  const pay = page.getByRole("button", { name: /Pay/ });
  await expect(pay).toBeDisabled();
  await expect(page.getByText("Calculating...")).toBeVisible();
  const taxRequest = await taxRequestPromise;
  expect(taxRequest.postDataJSON()).toEqual({ country: "IN", subtotal: 99 });
  await expect(page.getByRole("button", { name: "Pay $106.92" })).toBeEnabled();
});

test("approval posts the authorization payload and shows Order confirmed", async ({ page, request }, testInfo) => {
  await isolateCheckout(page, request, testInfo.testId);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Pay $106.92" })).toBeEnabled();
  const authorizePromise = page.waitForRequest(
    (candidate) => candidate.url().includes("/api/payments/authorize") && candidate.method() === "POST",
  );
  await page.getByRole("button", { name: "Pay $106.92" }).click();
  const authorizeRequest = await authorizePromise;
  expect(authorizeRequest.postDataJSON()).toEqual({
    cardholder: "Asha Kumar",
    cardNumber: "4242424242424242",
    total: 106.92,
  });
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
});

test("decline recovery retries with an approved card", async ({ page, request }, testInfo) => {
  await isolateCheckout(page, request, testInfo.testId);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Pay $106.92" })).toBeEnabled();
  await page.getByLabel("Card number").fill("4000000000000000");
  await page.getByRole("button", { name: "Pay $106.92" }).click();
  await expect(page.getByRole("heading", { name: "Payment declined" })).toBeVisible();
  await page.getByRole("button", { name: "Try another payment" }).click();
  await page.getByLabel("Card number").fill("4242424242424242");
  await page.getByRole("button", { name: "Pay $106.92" }).click();
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
});

test("duplicate submit keeps a single authorization request", async ({ page, request }, testInfo) => {
  await isolateCheckout(page, request, testInfo.testId);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Pay $106.92" })).toBeEnabled();
  const authorizationRequests: string[] = [];
  page.on("request", (candidate) => {
    if (candidate.url().includes("/api/payments/authorize") && candidate.method() === "POST") {
      authorizationRequests.push(candidate.postData() ?? "");
    }
  });
  const pay = page.getByRole("button", { name: "Pay $106.92" });
  await pay.click();
  await page.locator("form").evaluate((form) => (form as HTMLFormElement).requestSubmit());
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
  expect(authorizationRequests).toHaveLength(1);
});
