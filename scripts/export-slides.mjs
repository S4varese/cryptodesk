import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const slidesPath = resolve(__dirname, '../public/slides.html');
const outDir = resolve(__dirname, '../public/slides');

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

await page.setViewportSize({ width: 1080, height: 1920 });
await page.goto(`file://${slidesPath}`);
await page.waitForLoadState('networkidle');

const slides = await page.$$('.slide');
console.log(`Found ${slides.length} slides`);

for (let i = 0; i < slides.length; i++) {
  const num = String(i + 1).padStart(2, '0');
  const outPath = `${outDir}/botvault-slide-${num}.png`;

  // Reset any CSS transform applied by the scaling JS
  await page.evaluate(el => {
    el.style.transform = 'none';
    el.style.transformOrigin = 'top left';
    el.style.position = 'relative';
  }, slides[i]);

  await slides[i].screenshot({ path: outPath, type: 'png' });

  console.log(`✓ Slide ${num} → ${outPath}`);
}

await browser.close();
console.log('\nDone! Files saved to public/slides/');
