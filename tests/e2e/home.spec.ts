import { expect, test } from '@playwright/test';

test('home renders slogan and primary CTAs', async ({ page }) => {
  await page.goto('/');
  // Slogan
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/se lucha/i);
  // CTAs
  await expect(page.getByRole('link', { name: /ver tienda/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /ver trabajos/i }).first()).toBeVisible();
  // Nav links
  await expect(page.getByRole('link', { name: /^Tienda$/ }).first()).toBeVisible();
});

test('shop listing shows seeded products', async ({ page }) => {
  await page.goto('/shop');
  // Al menos un producto del seed
  await expect(page.getByText(/Shorts Muay Thai Rojo Bandera/i)).toBeVisible();
  await expect(page.getByText(/Guantes Boxeo 12oz Rojo/i)).toBeVisible();
});

test('404 page shows punching bag and round perdido', async ({ page }) => {
  const response = await page.goto('/ruta-que-no-existe');
  expect(response?.status()).toBe(404);
  await expect(page.getByText('ROUND PERDIDO', { exact: false })).toBeVisible();
});
