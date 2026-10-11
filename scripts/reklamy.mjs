// Vygeneruje obrázky obou reklam do reklamy/ (headless Chrome, stejně jako og.png v obrazky.mjs):
//   a-dvojce-feed.png a b-zacatek-feed.png (1080×1350, feed 4 : 5),
//   a-dvojce-stories.png a b-zacatek-stories.png (1080×1920, Stories a Reels 9 : 16).
// Texty jsou přesně podle reklamy/a-dvojce.md a reklamy/b-zacatek.md, tickery a popisy lístků z data/etf.json
// a public/index.html. U 9 : 16 drží text v bezpečné zóně: nahoře 270 px, dole 450 px, po stranách 65 px
// (ovládání Instagramu a Facebooku); skript to po vykreslení ověří a jinak skončí chybou.
// page.$$eval je API puppeteeru (spustí funkci v prohlížeči), ne JS eval().
// Použití: node reklamy.mjs   (po změně textů, dat nebo vzhledu)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { launch } from './lib/browser.mjs';
import { writeAtomic } from './lib/write.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'data', 'etf.json'), 'utf8'));
const page = readFileSync(join(root, 'public', 'index.html'), 'utf8');

// Reklama A: pár VOO → dvojče a „Stejný index …“ z dat
const voo = data.etf.find((e) => e.ticker === 'VOO');
const twin = voo.ucits_obdoba.burza.hodnota.ticker;
const stejny = voo.ucits_obdoba.rozdil_oproti_originalu.match(/^Stejný index \(([^)]+)\)/);
if (!stejny) throw new Error('VOO: dvojče už nemá stejný index, text reklamy A je potřeba upravit');
const indexText = `Stejný index ${stejny[1]}`.replace(/ (\d)/g, '&nbsp;$1');
// Reklama B: 7 typů s tickery, stejné krátké popisy jako lístky na stránce
const lístky = [...page.matchAll(/data-etf="([A-Z]+)"[^>]*>\s*<span class="listek-in">\s*<span class="lice"><b class="tk">\1<\/b><span class="co">([^<]+)<\/span>/g)].map((m) => [m[2], m[1]]);
if (lístky.length !== 7) throw new Error(`na stránce čekám 7 lístků, našel jsem ${lístky.length}`);

const FIX = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 30' preserveAspectRatio='none'%3E%3Cpath d='M4 8C40 3 120 6 197 4l-2 20c-60 4-128 1-193 4z' fill='%23FFE45C'/%3E%3C/svg%3E";
const RING = '<svg class="ring" viewBox="0 0 120 50" preserveAspectRatio="none"><path d="M64 5C95 4 117 13 115 26c-2 13-29 20-58 19C26 44 4 36 5 24 6 12 31 4 70 7" fill="none" stroke="#141414" stroke-width="6" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>';
const ARROW_DOWN = '<svg class="arrow" viewBox="0 0 40 90"><path d="M20 4c-3 22 3 45 0 74" fill="none" stroke="#141414" stroke-width="5.5" stroke-linecap="round"/><path d="M6 62c5 6 10 12 14 18 4-7 9-13 15-19" fill="none" stroke="#141414" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const BASE = `*{box-sizing:border-box}
body{margin:0;overflow:hidden;color:#141414;font:400 40px/1.3 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;background-color:#FFFDF5;background-image:linear-gradient(#EDEFF2 2px,transparent 2px),linear-gradient(90deg,#EDEFF2 2px,transparent 2px);background-size:54px 54px}
.page{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.logo{font-weight:800;letter-spacing:-.01em}
.fix{padding:0 .12em;margin:0 -.06em;background:url("${FIX}") 0 72%/100% 62% no-repeat}
.card{position:relative;background:#fff;border:4px solid #141414;border-radius:16px;box-shadow:8px 10px 0 rgba(20,20,20,.1)}
.card::before{content:"";position:absolute;top:-20px;left:50%;width:150px;height:40px;margin-left:-75px;background:rgba(214,203,168,.65);transform:rotate(-2deg)}
.orig{font-weight:800;color:#4A4A4A;text-decoration:line-through;text-decoration-color:#C62F3B;text-decoration-thickness:.09em}
.tk{position:relative;display:inline-block;font-weight:800;line-height:1;letter-spacing:-.01em}
.ring{position:absolute;left:-.32em;top:-.22em;width:calc(100% + .64em);height:calc(100% + .44em);overflow:visible}
.ok{color:#177A41;font-weight:800}
.muted{color:#4A4A4A}
h1{margin:0;font-weight:800;letter-spacing:-.02em;line-height:1.05}
.list{width:100%;text-align:left;padding:.3em 1.1em}
.row{display:flex;justify-content:space-between;align-items:baseline;gap:.6em;padding:.36em 0;border-bottom:3px dashed #D9D4C3}
.row:last-child{border-bottom:0}
.row b{font-weight:800}`;

// A „Dvojče“: VOO (přeškrtnuté jako na stránce) → šipka dolů → lístek s VUAA v kroužku a fixem
const adA = (w, h, area, s) => `<!doctype html><html lang="cs"><head><meta charset="utf-8"><style>${BASE}
body{width:${w}px;height:${h}px}
.page{left:${area.l}px;top:${area.t}px;width:${w - area.l - area.r}px;height:${h - area.t - area.b}px;gap:${s.gap}px}
.logo{font-size:${s.logo}px}
.orig{font-size:${s.orig}px}
.arrow{width:${s.arrow * 0.45}px;height:${s.arrow}px}
.card{padding:${s.pad}px ${s.pad * 1.6}px;transform:rotate(1.2deg)}
.card .tk{font-size:${s.tk}px;margin:.12em .3em}
.card .tk .fixbg{position:absolute;left:-.14em;right:-.14em;top:.34em;height:.52em;background:url("${FIX}") 0 0/100% 100% no-repeat;z-index:-1}
.line1{margin-top:${s.gap * 0.7}px;font-size:${s.line}px}
.line2{font-size:${s.small}px}
</style></head><body><div class="page">
  <div class="logo">ETF <span class="fix">dvojčata</span></div>
  <div class="orig">${voo.ticker}</div>
  ${ARROW_DOWN}
  <div class="card"><span class="tk"><span class="fixbg"></span>${twin}${RING}</span>
    <div class="line1 ok">evropské dvojče · koupíš z&nbsp;Česka</div></div>
  <div class="line2 muted">${indexText}</div>
</div></body></html>`;

// B „Začátek“: „Kterým ETF začít?“, lístek se seznamem 7 typů a tickerů (nic zakroužkované), dole jeden řádek
const adB = (w, h, area, s) => `<!doctype html><html lang="cs"><head><meta charset="utf-8"><style>${BASE}
body{width:${w}px;height:${h}px}
.page{left:${area.l}px;top:${area.t}px;width:${w - area.l - area.r}px;height:${h - area.t - area.b}px;gap:${s.gap}px}
.logo{font-size:${s.logo}px}
h1{font-size:${s.h1}px}
.card{width:100%;font-size:${s.row}px;transform:rotate(-.4deg)}
.bottom{font-size:${s.line}px;font-weight:700}
</style></head><body><div class="page">
  <div class="logo">ETF <span class="fix">dvojčata</span></div>
  <h1>Kterým ETF <span class="fix">začít</span>?</h1>
  <div class="card"><div class="list">${lístky.map(([co, tk]) => `<div class="row"><span>${co}</span><b>${tk}</b></div>`).join('')}</div></div>
  <div class="bottom">Co v&nbsp;nich je a&nbsp;kde je koupíš z&nbsp;Česka</div>
</div></body></html>`;

const FEED = { w: 1080, h: 1350, area: { t: 70, b: 70, l: 80, r: 80 } };
const STORY = { w: 1080, h: 1920, area: { t: 270, b: 450, l: 65, r: 65 } }; // bezpečná zóna 9 : 16
const OUT = [
  ['a-dvojce-feed.png', adA, FEED, { gap: 34, logo: 40, orig: 150, arrow: 130, tk: 230, pad: 34, line: 46, small: 40 }],
  ['a-dvojce-stories.png', adA, STORY, { gap: 30, logo: 42, orig: 170, arrow: 120, tk: 250, pad: 32, line: 50, small: 44 }],
  ['b-zacatek-feed.png', adB, FEED, { gap: 40, logo: 40, h1: 104, row: 46, line: 44 }],
  ['b-zacatek-stories.png', adB, STORY, { gap: 26, logo: 40, h1: 112, row: 52, line: 48 }],
];

const browser = await launch();
let fails = 0;
try {
  const tab = await browser.newPage();
  for (const [file, tpl, f, s] of OUT) {
    await tab.setViewport({ width: f.w, height: f.h, deviceScaleFactor: 1 });
    await tab.setContent(tpl(f.w, f.h, f.area, s), { waitUntil: 'load' });
    // každý viditelný text musí být celý uvnitř bezpečné oblasti (a na plátně)
    const out = await tab.$$eval('.page *', (els, a) => els.filter((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
      .map((e) => { const r = e.getBoundingClientRect(); return { t: e.textContent.trim().slice(0, 30), top: r.top, bottom: r.bottom, left: r.left, right: r.right }; })
      .filter((r) => r.top < a.t || r.bottom > a.h - a.b || r.left < a.l || r.right > a.w - a.r), { ...f.area, w: f.w, h: f.h });
    if (out.length) { fails++; console.log(`CHYBA ${file}: text mimo bezpečnou zónu – ${out.map((o) => `${o.t} (${Math.round(o.top)}–${Math.round(o.bottom)})`).join(', ')}`); }
    writeAtomic(join(root, 'reklamy', file), await tab.screenshot({ type: 'png' }));
    console.log(`${out.length ? 'CHYBA' : 'OK   '} reklamy/${file} (${f.w}×${f.h}, text v oblasti ${f.area.t}–${f.h - f.area.b} px)`);
  }
} finally {
  await browser.close();
}
process.exit(fails ? 1 : 0);
