import { expect, test } from '@playwright/test';

const VIEWPORTS = [
  { name: 'iPhone SE 320', width: 320, height: 568 },
  { name: 'iPhone 14 390', width: 390, height: 844 },
  { name: 'iPad 768', width: 768, height: 1024 },
  { name: 'Desktop 1280', width: 1280, height: 800 },
  { name: 'Desktop 1920', width: 1920, height: 1080 },
];

for (const v of VIEWPORTS) {
  test(`slogan se ve completo en 4 líneas sin overflow horizontal · ${v.name}`, async ({ page }) => {
    await page.setViewportSize({ width: v.width, height: v.height });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const h1 = page.locator('h1[data-slogan]');
    await expect(h1).toBeVisible();

    // Cada una de las 4 líneas debe estar visible
    const lines = h1.locator('span');
    await expect(lines).toHaveCount(4);

    // No debe haber scroll horizontal
    const overflow = await page.evaluate(() => {
      return {
        bodyWidth: document.body.scrollWidth,
        windowWidth: window.innerWidth,
      };
    });
    expect(overflow.bodyWidth, `viewport ${v.width}: body=${overflow.bodyWidth} window=${overflow.windowWidth}`).toBeLessThanOrEqual(overflow.windowWidth);

    // Cada línea no debe romperse en varias visualmente (height aprox 1×lineHeight)
    for (let i = 0; i < 4; i++) {
      const box = await lines.nth(i).boundingBox();
      expect(box, `line ${i} bbox missing`).not.toBeNull();
      if (!box) continue;
      // La línea debe caber HORIZONTALMENTE dentro del viewport con margen
      expect(box.width, `line ${i} width=${box.width} viewport=${v.width}`).toBeLessThanOrEqual(v.width);
    }
  });
}
