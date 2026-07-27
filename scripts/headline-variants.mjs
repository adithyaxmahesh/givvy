/**
 * Renders hero headline typography options against the live dev server.
 *
 * Nothing is written back to source: each variant is applied by patching the
 * h1 in the page, screenshotted, then reverted, so the crops are directly
 * comparable and produced under real layout constraints (column width, the
 * desk scene beside it) rather than in isolation.
 *
 * Usage: node scripts/headline-variants.mjs
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/givvy-shots/type';
const SERIF = 'var(--font-newsreader)';
const SORA = 'var(--font-sora)';
const INTER = 'var(--font-inter)';
const BLUE = '#2F6FB5';

/** Roman part of the line, then the accented word, so emphasis can vary per variant. */
const lines = ['The AI native', 'investment bank', 'for '];

function html({ accent = 'ownership.', accentCss = '', lead = lines }) {
  return `${lead[0]}<br>${lead[1]}<br>${lead[2]}<em style="${accentCss}">${accent}</em>`;
}

const variants = [
  {
    name: '1-current',
    note: 'Newsreader 400 · 69px',
    h1: { fontFamily: SERIF, fontWeight: '400', fontSize: '69px', lineHeight: '1.06', letterSpacing: '-0.022em' },
    accentCss: `font-style:italic;color:${BLUE}`,
  },
  {
    name: '2-light',
    note: 'Newsreader 300 · 71px · airier',
    h1: { fontFamily: SERIF, fontWeight: '300', fontSize: '71px', lineHeight: '1.04', letterSpacing: '-0.018em' },
    accentCss: `font-style:italic;color:${BLUE}`,
  },
  {
    name: '3-medium',
    note: 'Newsreader 500 · 65px · heavier',
    h1: { fontFamily: SERIF, fontWeight: '500', fontSize: '65px', lineHeight: '1.06', letterSpacing: '-0.025em' },
    accentCss: `font-style:italic;color:${BLUE}`,
  },
  {
    name: '4-large',
    note: 'Newsreader 400 · 80px · tight leading',
    h1: { fontFamily: SERIF, fontWeight: '400', fontSize: '80px', lineHeight: '0.98', letterSpacing: '-0.032em' },
    accentCss: `font-style:italic;color:${BLUE}`,
  },
  {
    name: '5-sora',
    note: 'Sora 500 · 56px · geometric sans',
    h1: { fontFamily: SORA, fontWeight: '500', fontSize: '56px', lineHeight: '1.1', letterSpacing: '-0.035em' },
    accentCss: `font-style:normal;color:${BLUE}`,
  },
  {
    name: '6-inter',
    note: 'Inter 600 · 58px · tight sans',
    h1: { fontFamily: INTER, fontWeight: '600', fontSize: '58px', lineHeight: '1.06', letterSpacing: '-0.038em' },
    accentCss: `font-style:normal;color:${BLUE}`,
  },
  {
    name: '7-mixed',
    note: 'Inter 600 sans + Newsreader italic accent',
    h1: { fontFamily: INTER, fontWeight: '600', fontSize: '56px', lineHeight: '1.08', letterSpacing: '-0.038em' },
    accentCss: `font-family:${SERIF};font-style:italic;font-weight:400;font-size:1.14em;letter-spacing:-0.02em;color:${BLUE}`,
  },
  {
    name: '8-accent-first',
    note: 'Serif · accent moved to "AI native"',
    h1: { fontFamily: SERIF, fontWeight: '400', fontSize: '69px', lineHeight: '1.06', letterSpacing: '-0.022em' },
    markup: `The <em style="font-style:italic;color:${BLUE}">AI native</em><br>investment bank<br>for ownership.`,
  },
  {
    name: '9-allblue-italic',
    note: 'Serif · whole last line italic blue',
    h1: { fontFamily: SERIF, fontWeight: '400', fontSize: '69px', lineHeight: '1.06', letterSpacing: '-0.022em' },
    markup: `The AI native<br>investment bank<br><em style="font-style:italic;color:${BLUE}">for ownership.</em>`,
  },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const original = await page.locator('h1').evaluate((el) => ({ html: el.innerHTML, style: el.getAttribute('style') || '' }));

for (const v of variants) {
  const markup = v.markup ?? html({ accentCss: v.accentCss });
  await page.locator('h1').evaluate(
    (el, { markup, h1 }) => {
      el.innerHTML = markup;
      Object.assign(el.style, h1);
    },
    { markup, h1: v.h1 }
  );
  await page.waitForTimeout(320);

  const box = await page.locator('h1').boundingBox();
  const lineCount = Math.round(box.height / (parseFloat(v.h1.fontSize) * parseFloat(v.h1.lineHeight)));
  const overflow = box.width > 500 ? '  <-- OVERFLOWS COLUMN' : '';
  console.log(`${v.name.padEnd(18)} ${String(lineCount).padStart(2)} lines  h=${Math.round(box.height)}px  ${v.note}${overflow}`);

  await page.screenshot({
    path: `${OUT}/${v.name}.png`,
    clip: { x: box.x - 24, y: box.y - 26, width: 540, height: box.height + 52 },
  });

  // Revert so each variant starts from the same baseline.
  await page.locator('h1').evaluate(
    (el, o) => {
      el.innerHTML = o.html;
      el.setAttribute('style', o.style);
    },
    original
  );
}

await browser.close();
console.log(`\nWrote ${variants.length} crops to ${OUT}`);
