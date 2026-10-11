// Vygeneruje ikony a obrázek pro sdílení do public/ (headless Chrome):
//   favicon.svg, favicon.ico (32 px), apple-touch-icon.png (180 px), og.png (1200×630, náhled odkazu na Facebooku a v Messengeru).
// Čísla na obrázku pro sdílení bere z data/etf.json (pár VOO → dvojče).
// Použití: node obrazky.mjs   (po změně dat nebo vzhledu)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { launch } from './lib/browser.mjs';
import { writeAtomic } from './lib/write.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (f) => join(root, 'public', f);
const data = JSON.parse(readFileSync(join(root, 'data', 'etf.json'), 'utf8'));

// Ikona: černý čtverec, žlutý fix a zelená fajfka jako na stránce.
const MARK = '<path d="M6 21c3-1 7-1 10 0M17 21c3-1 6-1 9 0" stroke="#FFE45C" stroke-width="4" stroke-linecap="round"/><path d="M8 11l3 3 6-7" stroke="#39B26B" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
const ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#141414"/>${MARK}</svg>`;
// iOS si rohy zakulatí sám, proto bez rx a se značkou trochu menší
const TOUCH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#141414"/><g transform="translate(3.2 3.2) scale(.8)">${MARK}</g></svg>`;

// PNG uvnitř ICO (podporují všechny dnešní prohlížeče)
function ico(png, size) {
  const h = Buffer.alloc(22);
  h.writeUInt16LE(0, 0); h.writeUInt16LE(1, 2); h.writeUInt16LE(1, 4);
  h.writeUInt8(size, 6); h.writeUInt8(size, 7); h.writeUInt8(0, 8); h.writeUInt8(0, 9);
  h.writeUInt16LE(1, 10); h.writeUInt16LE(32, 12); h.writeUInt32LE(png.length, 14); h.writeUInt32LE(22, 18);
  return Buffer.concat([h, png]);
}

const voo = data.etf.find((e) => e.ticker === 'VOO');
const twin = voo.ucits_obdoba;
const kc = (ter) => Math.round(Number(ter.hodnota) * 100); // poplatek v Kč z 10 000 Kč
const BROKERS = { xtb_cz: 'XTB', trading212: 'Trading&nbsp;212', degiro: 'Degiro' };
const brokers = Object.entries(BROKERS).filter(([k]) => String(twin.kde_koupit[k]?.hodnota ?? '').startsWith('ano')).map(([, n]) => n);
const sameIndex = twin.rozdil_oproti_originalu.startsWith('Stejný index');
const date = data.meta.overeno_dne.split('-').reverse().map(Number).join('.&nbsp;');
const FIX = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 30' preserveAspectRatio='none'%3E%3Cpath d='M4 8C40 3 120 6 197 4l-2 20c-60 4-128 1-193 4z' fill='%23FFE45C'/%3E%3C/svg%3E";

const OG = `<!doctype html><html lang="cs"><head><meta charset="utf-8"><style>
*{box-sizing:border-box}
body{margin:0;width:1200px;height:630px;overflow:hidden;color:#141414;font:400 28px/1.3 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;font-variant-numeric:tabular-nums;background-color:#FFFDF5;background-image:linear-gradient(#EDEFF2 1.5px,transparent 1.5px),linear-gradient(90deg,#EDEFF2 1.5px,transparent 1.5px);background-size:36px 36px}
.wrap{display:grid;grid-template-columns:1fr 430px;gap:56px;align-items:center;height:100%;padding:56px 72px}
.logo{font-weight:800;font-size:30px;letter-spacing:-.01em}
.fix{padding:0 .12em;margin:0 -.06em;background:url("${FIX}") 0 72%/100% 62% no-repeat}
h1{margin:26px 0 20px;font-size:62px;line-height:1.06;letter-spacing:-.02em;font-weight:800}
.sub{margin:0;color:#4A4A4A;text-wrap:balance}
.right{position:relative}
.orig{display:flex;align-items:center;gap:14px;margin:0 0 18px 6px;font-size:40px;font-weight:800;color:#4A4A4A}
.orig s{text-decoration-color:#C62F3B;text-decoration-thickness:5px}
.card{position:relative;padding:26px 30px 28px;border:3px solid #141414;border-radius:12px;background:#fff;box-shadow:6px 8px 0 rgba(20,20,20,.1);transform:rotate(1.2deg)}
.card::before{content:"";position:absolute;top:-14px;left:50%;width:96px;height:28px;margin-left:-48px;background:rgba(214,203,168,.6);transform:rotate(-2deg)}
.top{font-size:22px;color:#4A4A4A}
.tk{position:relative;display:inline-block;margin:16px 0 18px 18px;font-size:64px;font-weight:800;line-height:1}
.tk svg{position:absolute;left:-26px;top:-16px;width:calc(100% + 52px);height:calc(100% + 32px);overflow:visible}
.ok{color:#177A41;font-weight:800;font-size:30px}
.fee{margin-top:12px;font-size:26px}
.fee span{display:block;color:#4A4A4A;font-size:22px}
.stamp{margin:22px 0 0 6px;font-size:20px;color:#4A4A4A}
</style></head><body><div class="wrap">
<div>
  <div class="logo">ETF <span class="fix">dvojčata</span></div>
  <h1>Najdi evropské <span class="fix">dvojče</span> k&nbsp;VOO, VT a&nbsp;dalším ETF z&nbsp;USA</h1>
  <p class="sub">Americká ti broker často nenabídne, evropská ano.</p>
</div>
<div class="right">
  <div class="orig"><s>${voo.ticker}</s><svg width="70" height="34" viewBox="0 0 46 22"><path d="M3 13c8-3 21-5 34-2" fill="none" stroke="#141414" stroke-width="2.4" stroke-linecap="round"/><path d="M30 5c3 2 6 4 8 6-3 2-6 4-9 7" fill="none" stroke="#141414" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  <div class="card">
    <div class="top">evropské dvojče · ${sameIndex ? 'stejný' : 'podobný'} index</div>
    <div class="tk">${twin.burza.hodnota.ticker}<svg viewBox="0 0 120 50" preserveAspectRatio="none"><path d="M64 5C95 4 117 13 115 26c-2 13-29 20-58 19C26 44 4 36 5 24 6 12 31 4 70 7" fill="none" stroke="#141414" stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg></div>
    <div class="ok">✓ koupíš u&nbsp;${brokers.join(', ')}</div>
    <div class="fee">${kc(twin.ter)}&nbsp;Kč ročně z&nbsp;10&nbsp;000&nbsp;Kč <span>${voo.ticker}: ${kc(voo.ter)}&nbsp;Kč</span></div>
  </div>
  <div class="stamp">Data od správců fondů, ověřeno ${date}</div>
</div>
</div></body></html>`;

const browser = await launch();
try {
  const page = await browser.newPage();
  const png = async (svg, size) => {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(`<body style="margin:0"><img src="data:image/svg+xml,${encodeURIComponent(svg)}" width="${size}" height="${size}" style="display:block">`);
    await page.waitForFunction(() => document.images[0].complete);
    return page.screenshot({ type: 'png', omitBackground: true });
  };
  writeAtomic(pub('favicon.svg'), ICON + '\n');
  writeAtomic(pub('favicon.ico'), ico(await png(ICON, 32), 32));
  writeAtomic(pub('apple-touch-icon.png'), await png(TOUCH, 180));
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(OG, { waitUntil: 'load' });
  writeAtomic(pub('og.png'), await page.screenshot({ type: 'png' }));
  console.log('hotovo: favicon.svg, favicon.ico, apple-touch-icon.png, og.png (1200×630)');
} finally {
  await browser.close();
}
