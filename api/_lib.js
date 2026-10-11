// Společné kontroly pro funkce v api/. Soubor začíná podtržítkem, takže z něj Vercel neudělá endpoint
// (ověřeno ve zdrojáku Vercelu: packages/fs-detectors/src/detect-builders.ts přeskakuje cesty s „/_“).
import { createHmac, timingSafeEqual } from 'node:crypto';
import { promises as dns } from 'node:dns';
import jednorazove from './_jednorazove-domeny.js';

export const VARIANTY = ['vychozi', 'dvojce', 'zacatek'];

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

// Limity (počítá je databáze, viz supabase/schema.sql): kontakty 10 za hodinu z jedné IP,
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

// DNS jde v testech a v lokálním serveru podvrhnout přes zavislosti.resolveMx.
export const zavislosti = { resolveMx: (domena) => dns.resolveMx(domena) };
// Má doména záznam MX, který přijímá poštu? „Null MX“ (RFC 7505, prázdný cíl) znamená, že ne.
// Když DNS neodpoví (výpadek, timeout), skutečného člověka neodmítneme: vrátí null = nevíme.
export async function maPostu(domena) {
  try {
    const mx = await Promise.race([
      zavislosti.resolveMx(domena),
      new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('timeout'), { code: 'ETIMEOUT' })), 2500)),
    ]);
    return mx.some((r) => r.exchange && r.exchange !== '.');
  } catch (e) {
    if (e.code === 'ENOTFOUND' || e.code === 'ENODATA') return false;
    return null;
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
