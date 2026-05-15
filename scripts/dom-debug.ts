import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const info: unknown = await page.evaluate(`
    (() => {
      const desc = (el) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, cls: (el.className||'').toString().slice(0, 100), position: cs.position, z: cs.zIndex, bg: cs.backgroundColor, transform: cs.transform, opacity: cs.opacity, rect: { x: r.x, y: r.y, w: r.width, h: r.height } };
      };
      const canvas = document.querySelector('canvas');
      const ancestors = [];
      let p = canvas ? canvas.parentElement : null;
      while (p) { ancestors.push(desc(p)); p = p.parentElement; }
      const bodyChildren = Array.from(document.body.children).map(desc);
      return { canvas: desc(canvas), ancestors, bodyChildren };
    })()
  `);
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
