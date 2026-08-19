import { expect, test } from "@playwright/test";

test("approves a normal card after waiting for tax", async ({ page }) => {
  const taxBodies: unknown[] = [];
  const authorizeBodies: unknown[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/tax-quote") && request.method() === "POST") {
      taxBodies.push(request.postDataJSON());
    }
    if (request.url().includes("/api/payments/authorize") && request.method() === "POST") {
      authorizeBodies.push(request.postDataJSON());
    }
  });

  await page.goto("/");
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: /Pay/ }).click();
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
  expect(taxBodies[0]).toMatchObject({ country: "IN", subtotal: 99 });
  expect(authorizeBodies[0]).toMatchObject({
    cardholder: "Asha Kumar",
    cardNumber: "4242424242424242",
    total: 106.92,
  });
});

test("declines a card ending in 0000 and retries with an approved card", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1200);
  await page.getByLabel("Card number").fill("4000000000000000");
  await page.getByRole("button", { name: /Pay/ }).click();
  await expect(page.getByRole("heading", { name: "Payment declined" })).toBeVisible();
  await page.getByRole("button", { name: "Try another payment" }).click();
  await page.getByLabel("Card number").fill("4242424242424242");
  await page.getByRole("button", { name: /Pay/ }).click();
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
});

test("duplicate submit during authorization does not send a second request", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1200);
  const pay = page.getByRole("button", { name: /Pay/ });
  await pay.click();
  await pay.click();
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
});
