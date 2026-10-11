// Společné kontroly pro funkce v api/. Soubor začíná podtržítkem, takže z něj Vercel neudělá endpoint
// (ověřeno ve zdrojáku Vercelu: packages/fs-detectors/src/detect-builders.ts přeskakuje cesty s „/_“).
import { createHmac, timingSafeEqual } from 'node:crypto';
import { promises as dns } from 'node:dns';
import jednorazove from './_jednorazove-domeny.js';

export const VARIANTY = ['vychozi', 'dvojce', 'zacatek'];

// Text souhlasu u formuláře a jeho verze. Verze se ukládá ke kontaktu (leads.souhlas_verze), aby šlo doložit, s čím
// člověk souhlasil. Při každé změně textu na stránce změň i verzi; test-page.mjs hlídá, že text na stránce sedí.
export const SOUHLAS = {
  verze: 'demo-2026-10-11',
  text: 'Souhlasím, že Daniel Kuchválek uloží můj e-mail jen pro tuhle ukázku do výběrového řízení. Žádné e-maily mi neposílá a smaže ho nejpozději 31. 12. 2026.',
};

// Detail události: pro každou událost jen hodnoty, které stránka opravdu posílá (do měření nejde uložit nic jiného).
const ETF = 'VOO|VTI|VT|VWO|SDY|VGT|AGG';
const ZDROJ = /^(listky|lista|karty)$/;
const ZDROJ_FORMULARE = /^(listky|lista|karty|sekce)$/;
export const DETAILY = {
  prichod: /^[a-z0-9_-]{1,20}$/, // sdileni nebo utm_source
  scroll: /^(25|50|75|100)$/,
  otoceni_listku: new RegExp(`^(${ETF}):(dvojce|original)$`),
  vyzva_zobrazena: /^listky$/,
  cta: ZDROJ,
  formular_otevren: ZDROJ,
  formular_zacatek: ZDROJ_FORMULARE,
  odeslani_pokus: ZDROJ_FORMULARE,
  odeslani_chyba: /^(prazdny|neplatny|souhlas|offline|server|mx|jednorazovy|limit)$/,
  odeslano: ZDROJ_FORMULARE,
  tahak_otevren: /^(panel|listky|sekce)$/,
  sdileni: /^(nativni|zruseno|kopie|rucne)$/,
};
// Události od odeslání formuláře dál jsou vždy bez ID návštěvy, ostatní vždy s ním (hlídá i databáze).
// Podle nich by šlo poznat, která návštěva kontakt odeslala, a spárovat ji s e-mailem (viz README, Měření).
export const BEZ_NAVSTEVY = ['odeslani_pokus', 'odeslani_chyba', 'odeslano', 'tahak_otevren', 'sdileni'];

// Limity (počítá je databáze, viz supabase/schema.sql): kontakty 30 za hodinu z jedné IP,
// události 600 za hodinu z jedné IP a nejvýš 100 na jednu návštěvu.
export const MIN_FORM_MS = 3000; // formulář odeslaný dřív než 3 s po načtení stránky odešle bot
export const MAX_TOKEN_MS = 24 * 3600 * 1000;

export const odpoved = (status, data) => (data
  ? Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
  : new Response(null, { status, headers: { 'Cache-Control': 'no-store' } }));

// Tělo požadavku nejvýš max bajtů, i když klient délku neuvede nebo lže.
export async function nactiTelo(request, max) {
  if (Number(request.headers.get('content-length') || 0) > max) return { chyba: 413 };
  if (!request.body) return { text: '' };
  const reader = request.body.getReader();
  const casti = [];
  let delka = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    delka += value.byteLength;
    if (delka > max) {
      await reader.cancel();
      return { chyba: 413 };
    }
    casti.push(value);
  }
  return { text: Buffer.concat(casti).toString('utf8') };
}

// Požadavek z cizí stránky odmítneme. Skript mimo prohlížeč hlavičku vynechá nebo zfalšuje,
// proto jsou za tím ještě token, limity a kontroly e-mailu.
export function ciziPuvod(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  try { return new URL(origin).host !== host; } catch { return true; }
}

// Jen ASCII (JS toLowerCase a Postgres lower se u jiných znaků liší), bez znaků < > " ' a bez
// =, +, - na začátku (vzorec při exportu do tabulky), doména s platnými částmi a koncovkou.
const EMAIL = /^(?![.+=-])[A-Za-z0-9._%+-]{1,64}@(?=.{4,253}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+(?:[A-Za-z]{2,24}|xn--[A-Za-z0-9-]{2,59})$/;
export function platnyEmail(email) {
  return typeof email === 'string' && email.length <= 254 && EMAIL.test(email) && !email.includes('..') && !/\.@/.test(email);
}

export function jednorazovaDomena(domena) {
  const casti = domena.split('.');
  for (let i = 0; i < casti.length - 1; i++) if (jednorazove.has(casti.slice(i).join('.'))) return true;
  return false;
}

// Celá kontrola v DNS nejvýš 1 s, pak kontakt pustíme: odeslání nezdrží a výpadek DNS neodmítne člověka.
export const MX_TIMEOUT_MS = 1000;
const resolver = new dns.Resolver({ timeout: MX_TIMEOUT_MS, tries: 1 });
// DNS jde v testech a v lokálním serveru podvrhnout přes zavislosti.
export const zavislosti = {
  resolveMx: (domena) => resolver.resolveMx(domena),
  resolveAdresy: (domena) => Promise.any([resolver.resolve4(domena), resolver.resolve6(domena)]),
};

// Přijímá doména poštu? true: má MX (ne „null MX“ z RFC 7505), nebo bez MX aspoň adresu (pošta jde na ni,
// implicitní MX z RFC 5321, 5.1). false: doména neexistuje, má „null MX“, nebo nemá ani MX, ani adresu.
// null: nevíme (výpadek, chyba nebo timeout DNS), kontakt projde.
export async function maPostu(domena) {
  let casovac;
  const limit = new Promise((resolve) => { casovac = setTimeout(() => resolve(null), MX_TIMEOUT_MS); });
  try {
    return await Promise.race([zjistiPostu(domena), limit]);
  } finally {
    clearTimeout(casovac);
  }
}
async function zjistiPostu(domena) {
  try {
    const mx = await zavislosti.resolveMx(domena);
    if (mx.length) return mx.some((r) => r.exchange && r.exchange !== '.');
  } catch (e) {
    if (e.code === 'ENOTFOUND') return false;
    if (e.code !== 'ENODATA') return null;
  }
  try {
    return (await zavislosti.resolveAdresy(domena)).length > 0;
  } catch (e) {
    return (e.errors || [e]).every((x) => x.code === 'ENODATA' || x.code === 'ENOTFOUND') ? false : null;
  }
}

function hmac(cast) {
  return createHmac('sha256', process.env.ANTISPAM_SECRET).update(cast).digest();
}

// Token s časem vydání podepsaný tajným klíčem: bez něj ani dřív než 3 s po vydání kontakt neprojde.
export function vydejToken(ted = Date.now()) {
  return `${ted}.${hmac(`token|${ted}`).toString('base64url')}`;
}
// Vrátí 'ok', 'rychle' (méně než MIN_FORM_MS od vydání) nebo 'neplatny' (chybí, podvržený, starý).
export function overToken(token, ted = Date.now()) {
  if (typeof token !== 'string' || token.length > 100) return 'neplatny';
  const [ts, podpis] = token.split('.');
  if (!/^\d{13}$/.test(ts || '') || !podpis) return 'neplatny';
  const ocekavany = hmac(`token|${ts}`);
  const dodany = Buffer.from(podpis, 'base64url');
  if (dodany.length !== ocekavany.length || !timingSafeEqual(dodany, ocekavany)) return 'neplatny';
  const vek = ted - Number(ts);
  if (vek < 0 || vek > MAX_TOKEN_MS) return 'neplatny';
  return vek < MIN_FORM_MS ? 'rychle' : 'ok';
}

// Klíč pro limity: HMAC z IP adresy, endpointu a hodiny s tajnou solí. IP se nikam neukládá
// a klíče z různých hodin spolu nejdou spojit. Na Vercelu x-forwarded-for přepisuje Vercel sám.
export function klicIp(request, endpoint, ted = new Date()) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'neznama';
  return hmac(`ip|${endpoint}|${ted.toISOString().slice(0, 13)}|${ip}`).toString('hex').slice(0, 32);
}

export function chybiNastaveni(jmena) {
  const chybi = jmena.filter((j) => !process.env[j]);
  if (chybi.length) console.error(`[api] chybí proměnné prostředí: ${chybi.join(', ')}`);
  return chybi.length > 0;
}

// Volání funkce v Supabase (PostgREST /rpc). Secret klíč jen v hlavičce apikey, nikdy v odpovědi ani v logu.
export async function rpc(funkce, argumenty, ms = 8000) {
  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/${funkce}`, {
    method: 'POST',
    headers: { apikey: process.env.SUPABASE_SECRET_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(argumenty),
    signal: AbortSignal.timeout(ms),
  });
  if (!r.ok) throw Object.assign(new Error('databaze'), { status: r.status });
  return r.json();
}
