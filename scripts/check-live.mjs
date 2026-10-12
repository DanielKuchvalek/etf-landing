// Kontrola nasazené stránky jen čtením: nic neodesílá a do databáze nic nezapíše.
// Hlavičky, /api/token, /api/keepalive bez tajemství, soubory, adresy v hlavičce stránky a nadpisy verzí úvodu.
// Nadpisy čte headless Chrome se zablokovanými požadavky na /api/ (ani událost příchodu se neuloží).
// page.$eval je API puppeteeru (spustí funkci v prohlížeči), ne JS eval().
// Použití: node check-live.mjs [URL]   (výchozí https://etf-dvojcata-demo.vercel.app)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { launch, mobilePage } from './lib/browser.mjs';

const BASE = (process.argv[2] || 'https://etf-dvojcata-demo.vercel.app').replace(/\/$/, '');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let fails = 0;
const check = (name, cond, extra = '') => { if (!cond) fails++; console.log(`${cond ? 'OK   ' : 'CHYBA'} ${name}${extra ? ' – ' + extra : ''}`); };

const home = await fetch(`${BASE}/`);
const h = (k) => home.headers.get(k) || '';
const csp = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8')).headers.find((x) => x.source === '/').headers[0].value;
check('stránka vrací 200', home.status === 200, String(home.status));
check('CSP stejná jako ve vercel.json (hashe skriptů sedí)', h('content-security-policy') === csp);
check('HSTS', h('strict-transport-security').startsWith('max-age='), h('strict-transport-security'));
check('x-robots-tag: noindex', h('x-robots-tag') === 'noindex');
check('HTML: Cache-Control max-age=0, must-revalidate (nová verze hned po nasazení)', /max-age=0/.test(h('cache-control')) && /must-revalidate/.test(h('cache-control')), h('cache-control'));
{
  // s parametry reklamy musí přijít stejná (aktuální) verze jako bez nich
  const r = await fetch(`${BASE}/?v=dvojce&utm_source=meta&utm_campaign=etf-dvojcata&utm_content=a-dvojce&kontrola=${Date.now()}`);
  check('stránka s ?v= a UTM má stejný ETag jako / (žádná stará verze z cache)', r.headers.get('etag') === h('etag') && !!h('etag'), `${r.headers.get('etag')} / ${h('etag')}`);
}
for (const k of ['x-content-type-options', 'referrer-policy', 'permissions-policy', 'x-frame-options', 'cross-origin-opener-policy']) check(`hlavička ${k}`, !!h(k), h(k));

const html = await home.text();
for (const [what, re] of [['canonical', /<link rel="canonical" href="([^"]+)"/], ['og:url', /<meta property="og:url" content="([^"]+)"/], ['og:image', /<meta property="og:image" content="([^"]+)"/]]) {
  const v = (html.match(re) || [])[1] || '';
  check(`${what} ukazuje na ${BASE}`, v.startsWith(`${BASE}/`), v);
}
check('meta robots noindex', /<meta name="robots" content="noindex">/.test(html));

const token = await fetch(`${BASE}/api/token`, { cache: 'no-store' });
const t = await token.json().catch(() => ({}));
check('/api/token vrací podepsaný token', token.status === 200 && /^\d{13}\.[A-Za-z0-9_-]{20,}$/.test(t.token || ''), String(token.status));
const keep = await fetch(`${BASE}/api/keepalive`);
check('/api/keepalive bez tajemství → 401', keep.status === 401, String(keep.status));
for (const [path, type] of [['tahak.pdf', 'application/pdf'], ['og.png', 'image/png'], ['ochrana-osobnich-udaju.html', 'text/html'], ['favicon.svg', 'image/svg+xml']]) {
  const r = await fetch(`${BASE}/${path}`, { method: 'HEAD' });
  check(`${path} vrací 200 (${type})`, r.status === 200 && (r.headers.get('content-type') || '').startsWith(type), `${r.status} ${r.headers.get('content-type')}`);
}

const NADPISY = {
  '': 'Najdi evropské dvojče k VOO, VT a dalším ETF z USA',
  '?v=dvojce': 'Broker ti nenabídl VOO? Není to chyba.',
  '?v=zacatek': 'Začínáš s ETF?',
};
const browser = await launch();
let api = 0;
for (const [q, exp] of Object.entries(NADPISY)) {
  const page = await mobilePage(browser);
  await page.setRequestInterception(true);
  page.on('request', (r) => { if (new URL(r.url()).pathname.startsWith('/api/')) { api++; r.abort(); } else r.continue(); });
  await page.goto(`${BASE}/${q}`, { waitUntil: 'networkidle0' });
  const h1 = await page.$eval('#uvod-h1', (el) => el.textContent.replace(/ /g, ' '));
  check(`nadpis ${q || '(výchozí)'}`, h1 === exp, h1);
  await page.close();
}
await browser.close();
console.log(`INFO  zablokováno ${api} požadavků na /api/ (do databáze nic nešlo)`);
console.log(fails ? `\nCELKEM CHYB: ${fails}` : '\nVŠE OK');
process.exit(fails ? 1 : 0);
