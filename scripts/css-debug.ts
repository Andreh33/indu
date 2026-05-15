import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newContext({ viewport: { width: 1920, height: 1080 } }).then((c) => c.newPage());
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Get all stylesheets and find rules matching body bg
  const rules = await page.evaluate(`
    (() => {
      const out = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            const txt = rule.cssText || '';
            if (/body|html/.test(txt) && /background/i.test(txt)) {
              out.push({ href: sheet.href || 'inline', rule: txt.slice(0, 240) });
            }
          }
        } catch (e) { out.push({ err: e.message, href: sheet.href }); }
      }
      return out;
    })()
  `);
  console.log(JSON.stringify(rules, null, 2));
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
