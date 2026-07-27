// Signs into the client portal through the UI and captures each screen.
// Usage: PORTAL_EMAIL=... PORTAL_PASSWORD=... node scripts/shoot-portal.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/givvy-shots';
const BASE = process.env.BASE_URL || 'http://localhost:3000';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1380, height: 900 },
  deviceScaleFactor: 2,
});

const errors = [];
page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
page.on('pageerror', (err) => errors.push(String(err)));

await page.goto(`${BASE}/portal/login`, { waitUntil: 'networkidle' });
await page.fill('input[name="email"]', process.env.PORTAL_EMAIL);
await page.fill('input[name="password"]', process.env.PORTAL_PASSWORD);
await Promise.all([page.waitForURL('**/portal', { timeout: 15000 }), page.click('button[type="submit"]')]);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/portal-overview.png` });
console.log('overview ok:', page.url());

await page.goto(`${BASE}/portal/workstreams`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUT}/portal-list.png` });
console.log('list rows:', await page.locator('text=Quality of earnings review').count());

await page.click('button:has-text("Board")');
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/portal-board.png` });

await page.click('button:has-text("List")');
await page.waitForTimeout(400);
await page.click('text=Customer concentration analysis');
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/portal-drawer.png` });
await page.keyboard.press('Escape');
await page.click('[aria-label="Close task details"]');

await page.goto(`${BASE}/portal/documents`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/portal-documents.png` });

await page.goto(`${BASE}/portal/admin/users`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/portal-admin.png` });

await page.setViewportSize({ width: 420, height: 860 });
await page.goto(`${BASE}/portal`, { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/portal-mobile.png` });

console.log(errors.length ? `CONSOLE ERRORS:\n${errors.join('\n')}` : 'no console errors');
await browser.close();
