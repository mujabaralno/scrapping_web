import { test, expect } from "@playwright/test";
import { qase } from "playwright-qase-reporter";

/**
 * TC-10: Pengambilan Riwayat (GET)
 * Robot ini memastikan bahwa data dari MongoDB ditarik melalui API 
 * dan dirender ke dalam tabel riwayat di dashboard.
 */

test(qase(10, "TC-10: Pengambilan Riwayat (GET)"), async ({ page }) => {
  // --- LANGKAH 1: LOGIN (PRECONDITION) ---
  // Kita butuh session aktif agar middleware tidak memblokir request API
  await page.goto('/sign-in');
  await page.getByRole('textbox', { name: /email|username|identifier/i }).fill('alnom');
  await page.getByRole('button', { name: /^continue$/i }).click();
  await page.getByRole('textbox', { name: /^password$/i }).fill('Cobapassword123_');
  await page.getByRole('button', { name: /^continue$/i }).click();

  // Tunggu hingga sampai di dashboard
  await page.waitForURL('/', { timeout: 30000 });

  // --- LANGKAH 2: VERIFIKASI PENGAMBILAN DATA (GET) ---
  // Kita memantau network request ke endpoint API jobs
  const responsePromise = page.waitForResponse(
    response => response.url().includes('/api/jobs') && response.status() === 200
  );

  // Refresh halaman untuk memicu pengambilan data ulang (sesuai langkah di Canvas)
  await page.reload();

  // Menunggu respon API selesai
  const response = await responsePromise;
  const data = await response.json();

  // --- LANGKAH 3: VALIDASI VISUAL PADA TABEL ---
  // Pastikan tabel riwayat (Extracted Repository) terlihat
  const table = page.locator('table');
  await expect(table).toBeVisible({ timeout: 15000 });

  // Jika database tidak kosong (sesuai Pre-condition di Canvas), 
  // maka setidaknya harus ada satu baris data selain header.
  const rowCount = await page.locator('table tr').count();
  
  // Minimal ada 2 baris (1 header + 1 data)
  expect(rowCount).toBeGreaterThan(1);

  // Verifikasi bahwa salah satu data dari JSON muncul di dalam teks tabel
  if (data.jobs && data.jobs.length > 0) {
    const firstJobTitle = data.jobs[0].job_title;
    await expect(table).toContainText(firstJobTitle);
  }

  // Log untuk bukti di terminal
  console.log(`Berhasil memverifikasi ${data.jobs?.length || 0} data riwayat.`);
});