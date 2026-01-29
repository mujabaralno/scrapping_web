import { test, expect } from "@playwright/test";
import { qase } from "playwright-qase-reporter";


test(qase(4, "TC-04: Pengakhiran Sesi (Logout)"), async ({ page }) => {
  // --- STEP 1: LOGIN (PRECONDITION) ---
  await page.goto('/sign-in');
  await page.getByRole('textbox', { name: /email|username|identifier/i }).fill('alnom');
  await page.getByRole('button', { name: /^continue$/i }).click();
  await page.getByRole('textbox', { name: /^password$/i }).fill('Cobapassword123_');
  await page.getByRole('button', { name: /^continue$/i }).click();

  // Pastikan sudah masuk ke dashboard
  await page.waitForURL('/');
  await expect(page).not.toHaveURL(/\/sign-in/);

  // --- STEP 2: OPEN USER BUTTON ---
  const userButton = page.locator('.cl-userButtonTrigger, button[aria-label*="Open user button"]');
  
  // Tunggu sampai Clerk selesai loading (Client-side hydration)
  await expect(userButton).toBeVisible({ timeout: 15000 });
  await userButton.click();

  // --- STEP 3: CLICK SIGN OUT ---
  const signOutButton = page.getByText(/Sign out/i);
  await expect(signOutButton).toBeVisible({ timeout: 10000 });
  await signOutButton.click();

  // --- STEP 4: VERIFICATION ---
  const signInButton = page.getByRole('button', { name: /sign-?in/i });
  await expect(signInButton).toBeVisible({ timeout: 15000 });

  // Pastikan tombol UserButton sudah hilang
  await expect(userButton).toHaveCount(0);
});