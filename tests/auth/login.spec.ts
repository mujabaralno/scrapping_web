import { test, expect } from "@playwright/test";
import { qase } from "playwright-qase-reporter";

const validUsername = process.env.USERNAME_LOGIN;
const validPassword = process.env.PASSWORD_LOGIN;

test.describe("Authentication", () => {
  if (!validUsername && !validPassword) {
    throw new Error(
      "USERNAME_LOGIN OR PASSWORD_LOGIN is not defined in environment variables",
    );
  }

  // TC-01: Login Valid
  test(qase(1, "TC-01: Login Valid dengan Clerk"), async ({ page }) => {
    await page.goto("/sign-in");
    await page
      .getByRole("textbox", { name: /email|username|identifier/i })
      .fill(`${validUsername}`);
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page
      .getByRole("textbox", { name: /^password$/i })
      .fill(`${validPassword}`);
    await page.getByRole("button", { name: /^continue$/i }).click();

    await expect(page).not.toHaveURL(/\/sign-in/, { timeout: 30000 });
    await expect(page.getByRole("button", { name: /sign-?in/i })).toHaveCount(
      0,
    );
  });

  // TC-02: Login Invalid (Wrong Password)
  test(qase(2, "TC-02: Login Invalid (Wrong Password)"), async ({ page }) => {
    await page.goto("/sign-in");
    await page
      .getByRole("textbox", { name: /email|username|identifier/i })
      .fill(`${validUsername}`);
    await page.getByRole("button", { name: /^continue$/i }).click();

    await page
      .getByRole("textbox", { name: /^password$/i })
      .fill("password_salah_123");
    await page.getByRole("button", { name: /^continue$/i }).click();

    // Verifikasi error muncul
    await expect(page.locator("text=/incorrect|invalid|wrong/i")).toBeVisible({
      timeout: 15000,
    });
  });

  test(qase(3, "TC-03: Login Invalid (Wrong Username)"), async ({ page }) => {
    await page.goto("/sign-in");
    await page
      .getByRole("textbox", { name: /email|username|identifier/i })
      .fill("mujabar");
    await page.getByRole("button", { name: /^continue$/i }).click();

    await expect(
      page.locator("text=/not found|doesn’t exist|invalid/i"),
    ).toBeVisible({ timeout: 15000 });

    // Pastikan input password TIDAK muncul
    await expect(
      page.getByRole("textbox", { name: /^password$/i }),
    ).toHaveCount(0);
  });
});
