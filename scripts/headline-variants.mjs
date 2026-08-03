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
const lines = ['The digital', 'financial institution', 'for '];

function html({ accent = 'ownership.', accentCss = '', lead = lines }) {
  return `${lead[0]}<br>${lead[1]}<br>${lead[2]}<em style="${accentCss}">${accent}</em>`;
}

/*
 * Inter and Sora are both loaded upright only, so an italic accent in either
 * would be a browser-synthesized oblique. The accent stays upright blue in the
 * sans options for that reason.
 */
const variants = [
  {
    name: '0-current',
    note: 'Inter 600 / 55px (current)',
    h1: { fontFamily: INTER, fontWeight: '600', fontSize: '55px', lineHeight: '1.02', letterSpacing: '-0.04em' },
    accentCss: 'font-style:normal;color:inherit',
    markup: 'Ownership infrastructure for private markets.',
  },
  {
    name: '1-inter-600',
    note: 'Inter 600 / 58px',
    h1: { fontFamily: INTER, fontWeight: '600', fontSize: '58px', lineHeight: '1.06', letterSpacing: '-0.038em' },
    accentCss: `font-style:normal;color:${BLUE}`,
  },
  {
    name: '2-inter-700',
    note: 'Inter 700 / 56px',
    h1: { fontFamily: INTER, fontWeight: '700', fontSize: '56px', lineHeight: '1.05', letterSpacing: '-0.042em' },
    accentCss: `font-style:normal;color:${BLUE}`,
  },
  {
    name: '3-inter-700-big',
    note: 'Inter 700 / 62px / tight leading',
    h1: { fontFamily: INTER, fontWeight: '700', fontSize: '62px', lineHeight: '1.0', letterSpacing: '-0.046em' },
    accentCss: `font-style:normal;color:${BLUE}`,
  },
  {
    name: '4-sora-600',
    note: 'Sora 600 / 53px / geometric',
    h1: { fontFamily: SORA, fontWeight: '600', fontSize: '53px', lineHeight: '1.1', letterSpacing: '-0.04em' },
    accentCss: `font-style:normal;color:${BLUE}`,
  },
  {
    name: '5-sora-700',
    note: 'Sora 700 / 51px / heaviest',
    h1: { fontFamily: SORA, fontWeight: '700', fontSize: '51px', lineHeight: '1.1', letterSpacing: '-0.042em' },
    accentCss: `font-style:normal;color:${BLUE}`,
  },
  {
    name: '6-serif-600',
    note: 'Newsreader 600 / 65px (bold serif, for reference)',
    h1: { fontFamily: SERIF, fontWeight: '600', fontSize: '65px', lineHeight: '1.05', letterSpacing: '-0.028em' },
    accentCss: `font-style:italic;color:${BLUE}`,
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
  // Widest rendered line, so a variant that only just fits is visible as such.
  const ink = await page.locator('h1').evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return Math.round(Math.max(...[...range.getClientRects()].map((r) => r.width)));
  });
  const lineCount = Math.round(box.height / (parseFloat(v.h1.fontSize) * parseFloat(v.h1.lineHeight)));
  const slack = Math.round(box.width) - ink;
  const flag = lineCount > 3 ? '  <-- EXTRA LINE' : slack < 12 ? '  <-- TIGHT' : '';
  console.log(
    `${v.name.padEnd(16)} ${lineCount} lines  widest ${ink}px / col ${Math.round(box.width)}px  slack ${slack}px  ${v.note}${flag}`
  );

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
