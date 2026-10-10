// Snímky obrazovky klíčových stavů na 375 px do docs/screenshots/<prefix>-*.png.
// Použití: node screenshots.mjs <prefix>   (např. pred, po). Server musí běžet (viz serve.sh).
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { launch, mobilePage, sleep, BASE_URL } from './lib/browser.mjs';

const prefix = process.argv[2] || 'snimek';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots');
mkdirSync(OUT, { recursive: true });

const browser = await launch();
try {
  const page = await mobilePage(browser);
  const shot = async (name) => { await sleep(400); await page.screenshot({ path: join(OUT, `${prefix}-${name}.png`) }); console.log(`uloženo ${prefix}-${name}.png`); };
  const toTop = (sel) => page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start', behavior: 'instant' }), sel);

  // 1) úvod
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await shot('1-uvod');

  // 2) výsledek po klepnutí na VOO (kartička / výsledek)
  await page.tap('[data-etf="VOO"]');
  await sleep(1200);
  await shot('2-vysledek-voo');

  // 3) karty párů
  await toTop('#pary');
  await shot('3-karty-paru');

  // 4) formulář v sekci Tahák
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await toTop('#tahak');
  await shot('4-formular');

  // 5) poděkování po odeslání formuláře v sekci Tahák
  const F = '[data-slot="sekce"] .lead-form';
  await page.type(`${F} input[name=email]`, 'ukazka@example.com');
  await page.tap(`${F} input[name=consent]`);
  await page.tap(`${F} [type=submit]`);
  await sleep(1200);
  await toTop('#tahak');
  await shot('5-podekovani');
} finally {
  await browser.close();
}
