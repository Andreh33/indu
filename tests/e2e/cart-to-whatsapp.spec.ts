import { expect, test } from '@playwright/test';

test('add product to cart and verify wa.me URL is built', async ({ page }) => {
  await page.goto('/producto/shorts-muay-thai-rojo-bandera', { waitUntil: 'networkidle' });

  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Shorts Muay Thai Rojo/i, {
    timeout: 15_000,
  });

  // Interceptamos window.open en el contexto del navegador antes de hacer click,
  // así no dependemos del timing del popup ni de Chromium headless.
  await page.evaluate(() => {
    const w = window as Window & { __lastOpenUrl?: string };
    const orig = w.open;
    w.open = (url) => {
      w.__lastOpenUrl = String(url);
      return orig.call(window);
    };
  });

  await page.getByRole('button', { name: /añadir al carrito/i }).click();

  const whatsappBtn = page.getByRole('button', {
    name: /abrir conversación en whatsapp/i,
  });
  await expect(whatsappBtn).toBeVisible();
  await whatsappBtn.click();

  // Esperamos a que window.__lastOpenUrl se haya seteado
  await page.waitForFunction(
    () => typeof (window as Window & { __lastOpenUrl?: string }).__lastOpenUrl === 'string',
    { timeout: 5_000 },
  );

  const url = await page.evaluate(
    () => (window as Window & { __lastOpenUrl?: string }).__lastOpenUrl ?? '',
  );

  expect(url.startsWith('https://wa.me/')).toBe(true);
  expect(url).toContain('?text=');
  const text = decodeURIComponent(url.split('?text=')[1]!);
  expect(text).toContain('Industrial Fighters');
  expect(text).toContain('SHORTS MUAY THAI ROJO');
  expect(text).toContain('Talla:');
  expect(text).toContain('TOTAL ESTIMADO:');
});
