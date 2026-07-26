// Captures the Aurelian landing page at three widths for visual comparison.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/aurelian-shots';
const URL = process.env.SHOT_URL ?? 'http://localhost:3000/';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 834, height: 1000 },
  { name: 'mobile', width: 390, height: 900 },
];

const only = process.argv[2];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

for (const viewport of VIEWPORTS) {
  if (only && only !== viewport.name) continue;

  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);

  await page.screenshot({ path: `${OUT}/${viewport.name}-full.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/${viewport.name}-hero.png` });

  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log(`${viewport.name}: ${viewport.width}x${height}`);
  await page.close();
}

await browser.close();
