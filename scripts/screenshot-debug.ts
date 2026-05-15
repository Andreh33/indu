import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--enable-webgl', '--use-gl=swiftshader'],
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('[console.error]', msg.text());
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  const info = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    return canvases.map((c) => ({
      width: c.width,
      height: c.height,
      cssWidth: c.clientWidth,
      cssHeight: c.clientHeight,
      hasWebGL: !!c.getContext('webgl2') || !!c.getContext('webgl'),
      bbox: c.getBoundingClientRect(),
    }));
  });
  console.log('CANVAS_INFO', JSON.stringify(info, null, 2));

  await page.screenshot({
    path: 'D:/PROYECTO/industrial/_review_frames/after/home-hero.png',
    fullPage: false,
    clip: { x: 0, y: 0, width: 1280, height: 800 },
  });
  console.log('saved screenshot');

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
