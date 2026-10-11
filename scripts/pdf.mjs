// Vygeneruje public/tahak.pdf ze zdroje tahak/tahak.html a dat data/etf.json (headless Chrome)
// a náhled první strany public/img/tahak-nahled.webp pro formulář (potřebuje macOS kvůli PDFKit).
// Použití: node pdf.mjs   (po každé změně dat nebo taháku)
import { readFileSync, statSync, writeFileSync, renameSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { basename, dirname, join } from 'node:path';
import { launch } from './lib/browser.mjs';

const PREVIEW_W = 480;
const PREVIEW_H = 420;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'data', 'etf.json'), 'utf8'));
const out = join(root, 'public', 'tahak.pdf');

// Zápis přes dočasný soubor ve stejné složce a přejmenování (na stejném disku atomické):
// běžící server tak nikdy neuvidí chybějící ani napůl zapsaný soubor.
function writeAtomic(path, data) {
  const tmp = join(dirname(path), `.${basename(path)}.tmp-${process.pid}`);
  try {
    writeFileSync(tmp, data);
    renameSync(tmp, path);
  } finally {
    rmSync(tmp, { force: true });
  }
}

const browser = await launch();
try {
  const page = await browser.newPage();
  // data dostane šablona přes window.ETF_DATA (bez serveru, přímo ze souboru)
  await page.evaluateOnNewDocument((d) => { window.ETF_DATA = d; }, data);
  await page.goto(pathToFileURL(join(root, 'tahak', 'tahak.html')).href, { waitUntil: 'load' });
  await page.waitForSelector('body[data-ready="1"]', { timeout: 10000 });
  const pdf = await page.pdf({
    format: 'A5',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font:7px -apple-system,Arial,sans-serif;color:#4A4A4A;padding:0 12mm;display:flex;justify-content:space-between">'
      + '<span>ETF dvojčata · tahák · data ověřena ' + data.meta.overeno_dne.split('-').reverse().map(Number).join('. ') + '</span>'
      + '<span><span class="pageNumber"></span>/<span class="totalPages"></span></span></div>',
  });
  writeAtomic(out, pdf);
  console.log(`hotovo: ${out} (${Math.round(statSync(out).size / 1024)} kB)`);

  // Náhled první strany pro formulář: PDFKit vyrenderuje stranu 1, Chrome ji ořízne na horní část a uloží jako WebP.
  // Rozměr je pevný (PREVIEW_W × PREVIEW_H), aby v HTML seděly atributy width/height.
  const tmp = mkdtempSync(join(tmpdir(), 'tahak-'));
  execFileSync('swift', [join(root, 'scripts', 'pdf-to-png.swift'), out, join(tmp, 'strana'), '800', '1'], { stdio: 'ignore' });
  const png = readFileSync(join(tmp, 'strana-1.png')).toString('base64');
  const webp = await page.evaluate(async (src, w, h) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const scale = w / img.naturalWidth;
    c.getContext('2d').drawImage(img, 0, 0, img.naturalWidth, h / scale, 0, 0, w, h);
    return c.toDataURL('image/webp', 0.8);
  }, `data:image/png;base64,${png}`, PREVIEW_W, PREVIEW_H);
  const previewPath = join(root, 'public', 'img', 'tahak-nahled.webp');
  mkdirSync(dirname(previewPath), { recursive: true });
  writeAtomic(previewPath, Buffer.from(webp.split(',')[1], 'base64'));
  rmSync(tmp, { recursive: true, force: true });
  console.log(`náhled: ${previewPath} (${PREVIEW_W}×${PREVIEW_H}, ${Math.round(statSync(previewPath).size / 1024)} kB)`);
} finally {
  await browser.close();
}
