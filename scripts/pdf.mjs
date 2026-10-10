// Vygeneruje public/tahak.pdf ze zdroje tahak/tahak.html a dat data/etf.json (headless Chrome).
// Použití: node pdf.mjs   (po každé změně dat nebo taháku)
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { launch } from './lib/browser.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'data', 'etf.json'), 'utf8'));
const out = join(root, 'public', 'tahak.pdf');

const browser = await launch();
try {
  const page = await browser.newPage();
  // data dostane šablona přes window.ETF_DATA (bez serveru, přímo ze souboru)
  await page.evaluateOnNewDocument((d) => { window.ETF_DATA = d; }, data);
  await page.goto(pathToFileURL(join(root, 'tahak', 'tahak.html')).href, { waitUntil: 'load' });
  await page.waitForSelector('body[data-ready="1"]', { timeout: 10000 });
  await page.pdf({
    path: out,
    format: 'A5',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font:7px -apple-system,Arial,sans-serif;color:#4A4A4A;padding:0 12mm;display:flex;justify-content:space-between">'
      + '<span>ETF dvojčata · tahák · data ověřena ' + data.meta.overeno_dne.split('-').reverse().map(Number).join('. ') + '</span>'
      + '<span><span class="pageNumber"></span>/<span class="totalPages"></span></span></div>',
  });
  console.log(`hotovo: ${out} (${Math.round(statSync(out).size / 1024)} kB)`);
} finally {
  await browser.close();
}
