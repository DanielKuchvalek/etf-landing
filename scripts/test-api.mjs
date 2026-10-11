// Testy serverless funkcí v api/ s podvrženou databází a DNS: bez skutečných klíčů a bez sítě.
// globalThis.fetch nahradí atrapa Supabase, která si zapisuje volání a vrací nastavenou odpověď.
// SQL (limity, duplicity, práva) testuje zvlášť test-db.mjs na skutečném Postgresu.
// Použití: node test-api.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let fails = 0;
const check = (name, cond, extra = '') => { if (!cond) fails++; console.log(`${cond ? 'OK   ' : 'CHYBA'} ${name}${extra ? ' – ' + extra : ''}`); };

const KEY = 'testovaci-klic-neni-skutecny';
const SECRET = 'testovaci-sul-0123456789abcdef0123456789abcdef';
const OK_ENV = { SUPABASE_URL: 'https://projekt.supabase.co', SUPABASE_SECRET_KEY: KEY, CRON_SECRET: 'tajny-cron-1234567890', ANTISPAM_SECRET: SECRET };
const env = (vals) => { for (const k of Object.keys(OK_ENV)) delete process.env[k]; Object.assign(process.env, vals); };
env(OK_ENV);

// Atrapa Supabase: zaznamená volání a vrátí nastavenou odpověď (nebo vyhodí chybu jako nedostupná síť).
const calls = [];
let reply = () => Response.json('novy');
globalThis.fetch = async (url, opts = {}) => {
  calls.push({ url: String(url), method: opts.method || 'GET', headers: opts.headers || {}, body: opts.body ? JSON.parse(opts.body) : null });
  return reply();
};
// Zachytí logy, aby šlo ověřit, že v nich není e-mail, klíč ani IP.
const logs = [];
const orig = { error: console.error, warn: console.warn };
console.error = (...a) => logs.push(a.join(' '));
console.warn = (...a) => logs.push(a.join(' '));

const lib = await import('../api/_lib.js');
const { default: lead } = await import('../api/lead.js');
const { default: event } = await import('../api/event.js');
const { default: token } = await import('../api/token.js');
const { default: keepalive } = await import('../api/keepalive.js');

// Podvržené DNS: podle domény vrátí MX, žádný záznam, null MX, chybu nebo nic (timeout).
// chyba-<kód>.cz vyhodí chybu s tím kódem; bez-mx* nemají MX a dotaz jde na adresu domény (implicitní MX).
let dnsCalls = 0;
const dnsChyba = (code) => Object.assign(new Error('x'), { code });
lib.zavislosti.resolveMx = async (d) => {
  dnsCalls++;
  if (d === 'neexistuje.cz') throw dnsChyba('ENOTFOUND');
  if (d.startsWith('bez-mx')) throw dnsChyba('ENODATA');
  if (d === 'null-mx.cz') return [{ exchange: '', priority: 0 }];
  if (d.startsWith('chyba-')) throw dnsChyba(d.slice(6, -3).toUpperCase());
  if (d === 'pomale-dns.cz') return new Promise(() => {});
  return [{ exchange: 'mx1.' + d, priority: 10 }];
};
lib.zavislosti.resolveAdresy = async (d) => {
  dnsCalls++;
  if (d === 'bez-mx-s-adresou.cz') return ['192.0.2.10'];
  if (d === 'bez-mx-pomale.cz') return new Promise(() => {});
  if (d === 'bez-mx-vypadek.cz') throw new AggregateError([dnsChyba('ENODATA'), dnsChyba('ESERVFAIL')]);
  throw new AggregateError([dnsChyba('ENODATA'), dnsChyba('ENODATA')]);
};

const HOST = 'etf-dvojcata.example';
const IP = '203.0.113.7';
function req(path, { method = 'POST', body, type = 'application/json', headers = {} } = {}) {
  const h = { host: HOST, 'x-forwarded-for': IP, ...headers };
  if (type) h['content-type'] = type;
  return new Request(`https://${HOST}${path}`, { method, headers: h, body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) });
}
async function run(handler, r) {
  calls.length = 0;
  dnsCalls = 0;
  const res = await handler.fetch(r);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* bez těla */ }
  return { status: res.status, json, text, calls: [...calls], headers: res.headers };
}
function streamBody(bytes) {
  const chunk = new TextEncoder().encode('x'.repeat(256));
  let sent = 0;
  return new ReadableStream({ pull(c) { if (sent >= bytes) return c.close(); c.enqueue(chunk); sent += chunk.length; } });
}
const oldToken = () => lib.vydejToken(Date.now() - 5000); // vydaný před 5 s: projde
const lead1 = (extra = {}) => ({ email: 'jana.nova@example.cz', souhlas: true, varianta: 'dvojce', token: oldToken(), ...extra });

// ---------- /api/lead: úspěch, duplicita, limit ----------
let r = await run(lead, req('/api/lead', { body: lead1({ email: '  Jana.Nova@Example.CZ ' }) }));
const c = r.calls[0] || {};
check('lead: platný kontakt → 200 a jedno volání uloz_kontakt', r.status === 200 && r.json.ok === true && r.calls.length === 1 && c.url === 'https://projekt.supabase.co/rest/v1/rpc/uloz_kontakt', `${r.status} ${c.url}`);
check('lead: e-mail oříznutý a malými písmeny, jen povolené argumenty a verze textu souhlasu', c.body && c.body.p_email === 'jana.nova@example.cz' && c.body.p_varianta === 'dvojce' && c.body.p_souhlas_verze === lib.SOUHLAS.verze && Object.keys(c.body).sort().join() === 'p_email,p_klic,p_souhlas_verze,p_varianta', JSON.stringify(c.body));
check('lead: do databáze jde hash IP (32 hex znaků), ne IP', /^[0-9a-f]{32}$/.test(c.body.p_klic) && !JSON.stringify(c.body).includes(IP));
check('lead: klíč jen v hlavičce apikey, ne v Authorization', c.headers.apikey === KEY && !('Authorization' in c.headers) && !('authorization' in c.headers));
check('lead: odpověď neobsahuje klíč', !r.text.includes(KEY));
reply = () => Response.json('duplicita');
r = await run(lead, req('/api/lead', { body: lead1() }));
check('lead: e-mail už v databázi (duplicita) → stejná odpověď jako nový, tahák se ukáže', r.status === 200 && r.json.ok === true);
reply = () => Response.json('limit');
r = await run(lead, req('/api/lead', { body: lead1() }));
check('lead: překročený limit pokusů z jedné IP → 429 a záznam v logu (bez IP)', r.status === 429 && r.json.chyba === 'limit' && logs.at(-1) === '[lead] zamítnuto: limit pokusů z jedné IP');
reply = () => Response.json('novy');
r = await run(lead, req('/api/lead', { body: lead1({ varianta: 'neco-jineho' }) }));
check('lead: neznámá verze úvodu se uloží jako vychozi', r.calls[0] && r.calls[0].body.p_varianta === 'vychozi');

// ---------- token: rychlost odeslání ----------
r = await run(lead, req('/api/lead', { body: lead1({ token: undefined }) }));
check('lead: bez tokenu → 400 token, nic se neuloží', r.status === 400 && r.json.chyba === 'token' && r.calls.length === 0);
const [ts] = oldToken().split('.');
r = await run(lead, req('/api/lead', { body: lead1({ token: `${ts}.${Buffer.from('podvrh-podvrh-podvrh-podvrh-podvr').toString('base64url')}` }) }));
check('lead: podvržený podpis tokenu → 400', r.status === 400 && r.json.chyba === 'token' && r.calls.length === 0);
r = await run(lead, req('/api/lead', { body: lead1({ token: lib.vydejToken(Date.now() - 25 * 3600 * 1000) }) }));
check('lead: token starší než 24 h → 400 (stránka si vezme nový)', r.status === 400 && r.json.chyba === 'token');
r = await run(lead, req('/api/lead', { body: lead1({ token: lib.vydejToken() }) }));
check('lead: odesláno hned po vydání tokenu (bot) → tváří se úspěšně, nic se neuloží', r.status === 200 && r.json.ok === true && r.calls.length === 0);
r = await run(lead, req('/api/lead', { body: lead1({ token: lib.vydejToken(Date.now() + 60000) }) }));
check('lead: token z budoucnosti → 400', r.status === 400);
const tokenSigned = lib.vydejToken(Date.now() - 5000);
process.env.ANTISPAM_SECRET = 'jina-sul-0123456789abcdef0123456789abcdef';
r = await run(lead, req('/api/lead', { body: lead1({ token: tokenSigned }) }));
check('lead: token podepsaný jiným klíčem → 400', r.status === 400 && r.json.chyba === 'token');
env(OK_ENV);

// ---------- skryté pole, formát e-mailu, souhlas ----------
r = await run(lead, req('/api/lead', { body: lead1({ poznamka: 'https://spam.example' }) }));
check('lead: vyplněné skryté pole (bot) → 200, ale nic se neuloží', r.status === 200 && r.json.ok === true && r.calls.length === 0);
for (const [name, email] of [
  ['prázdný', ''], ['bez domény', 'jana@seznam'], ['delší než 254 znaků', 'a'.repeat(60) + '@' + 'b'.repeat(190) + '.cz'],
  ['dvě tečky', 'jana..nova@example.cz'], ['tečka před zavináčem', 'jana.@example.cz'], ['diakritika', 'jána@example.cz'],
  ['znaky < >', 'ja<na>@example.cz'], ['uvozovky', '"jana"@example.cz'], ['= na začátku (vzorec v tabulce)', '=cmd@example.cz'],
  ['+ na začátku', '+jana@example.cz'], ['číselná koncovka', 'jana@example.123'], ['pole místo textu', ['a@b.cz']],
]) {
  r = await run(lead, req('/api/lead', { body: lead1({ email }) }));
  check(`lead: e-mail (${name}) → 422, nic se neuloží`, r.status === 422 && r.json.chyba === 'email' && r.calls.length === 0, `${r.status} ${r.json && r.json.chyba}`);
}
for (const [name, souhlas] of [['bez souhlasu', undefined], ['souhlas false', false], ['souhlas jako text „ano“', 'ano']]) {
  r = await run(lead, req('/api/lead', { body: lead1({ souhlas }) }));
  check(`lead: ${name} → 422`, r.status === 422 && r.json.chyba === 'souhlas' && r.calls.length === 0);
}

// ---------- jednorázové domény a MX ----------
for (const email of ['x@mailinator.com', 'x@10minutemail.com', 'x@sub.mailinator.com']) {
  r = await run(lead, req('/api/lead', { body: lead1({ email }) }));
  check(`lead: jednorázová doména (${email.split('@')[1]}) → 422, bez dotazu do DNS`, r.status === 422 && r.json.chyba === 'jednorazovy' && r.calls.length === 0 && dnsCalls === 0);
}
for (const domena of ['seznam.cz', 'email.cz', 'centrum.cz', 'gmail.com']) check(`běžná doména ${domena} není na seznamu jednorázových`, !lib.jednorazovaDomena(domena));
for (const [name, domena, dotazu] of [['doména neexistuje', 'neexistuje.cz', 1], ['„null MX“ (poštu nepřijímá)', 'null-mx.cz', 1], ['doména bez MX i bez adresy', 'bez-mx.cz', 2]]) {
  r = await run(lead, req('/api/lead', { body: lead1({ email: `x@${domena}` }) }));
  check(`lead: ${name} → 422 mx, nic se neuloží`, r.status === 422 && r.json.chyba === 'mx' && r.calls.length === 0 && dnsCalls === dotazu, `${r.status} ${dnsCalls} dotazů`);
}
r = await run(lead, req('/api/lead', { body: lead1({ email: 'x@bez-mx-s-adresou.cz' }) }));
check('lead: doména bez MX, ale s adresou (implicitní MX, RFC 5321) → kontakt se uloží', r.status === 200 && r.calls.length === 1);
// Fail-open: při chybě nebo timeoutu DNS kontakt projde, skutečného člověka kvůli DNS neodmítneme.
check(`MX: timeout DNS je krátký (${lib.MX_TIMEOUT_MS} ms, nejvýš 1,5 s)`, lib.MX_TIMEOUT_MS > 0 && lib.MX_TIMEOUT_MS <= 1500);
for (const code of ['ESERVFAIL', 'ETIMEOUT', 'ECONNREFUSED', 'EREFUSED', 'EBADRESP', 'ECANCELLED']) {
  r = await run(lead, req('/api/lead', { body: lead1({ email: `x@chyba-${code.toLowerCase()}.cz` }) }));
  check(`lead: chyba DNS ${code} → kontakt se uloží`, r.status === 200 && r.calls.length === 1, `${r.status}`);
}
r = await run(lead, req('/api/lead', { body: lead1({ email: 'x@bez-mx-vypadek.cz' }) }));
check('lead: bez MX a dotaz na adresu skončí výpadkem → kontakt se uloží', r.status === 200 && r.calls.length === 1);
for (const [name, domena] of [['DNS neodpoví na MX', 'pomale-dns.cz'], ['DNS neodpoví na adresu domény bez MX', 'bez-mx-pomale.cz']]) {
  const t0 = Date.now();
  r = await run(lead, req('/api/lead', { body: lead1({ email: `x@${domena}` }) }));
  const ms = Date.now() - t0;
  check(`lead: ${name} → po ${lib.MX_TIMEOUT_MS} ms se pokračuje a kontakt se uloží`, r.status === 200 && r.calls.length === 1 && ms >= lib.MX_TIMEOUT_MS - 20 && ms < lib.MX_TIMEOUT_MS + 300, `${ms} ms`);
}
{
  const t0 = Date.now();
  const vysledek = await lib.maPostu('example.cz');
  check('MX: běžná doména odpoví hned, časovač timeoutu se zruší', vysledek === true && Date.now() - t0 < 50 && process.getActiveResourcesInfo().filter((x) => x === 'Timeout').length === 0, `${Date.now() - t0} ms, ${process.getActiveResourcesInfo().join(',')}`);
}

// ---------- pole navíc, velikost, typ, metoda, původ ----------
for (const [name, body, status, chyba] of [
  ['ID návštěvy u e-mailu', lead1({ navsteva: '6cea79d5-7dbd-47ef-a402-37cd1ae34015' }), 400, 'pole'],
  ['pole navíc', lead1({ telefon: '777' }), 400, 'pole'],
  ['pole místo objektu', [1, 2], 400, 'format'],
]) {
  r = await run(lead, req('/api/lead', { body }));
  check(`lead: ${name} → ${status}, nic se neuloží`, r.status === status && r.json.chyba === chyba && r.calls.length === 0, `${r.status} ${r.json && r.json.chyba}`);
}
r = await run(lead, req('/api/lead', { body: '{"email": "eva@exa' }));
check('lead: rozbitý JSON → 400', r.status === 400 && r.calls.length === 0);
r = await run(lead, req('/api/lead', { body: lead1(), type: 'text/plain' }));
check('lead: jiný typ obsahu než JSON → 415', r.status === 415 && r.calls.length === 0);
r = await run(lead, req('/api/lead', { body: lead1({ varianta: 'x'.repeat(2000) }) }));
check('lead: tělo nad 1 kB → 413', r.status === 413 && r.calls.length === 0);
r = await run(lead, new Request(`https://${HOST}/api/lead`, { method: 'POST', headers: { host: HOST, 'content-type': 'application/json' }, body: streamBody(5000), duplex: 'half' }));
check('lead: velké tělo bez uvedené délky (stream) → 413', r.status === 413 && r.calls.length === 0);
r = await run(lead, req('/api/lead', { method: 'GET', type: null }));
check('lead: GET → 405', r.status === 405);
r = await run(lead, req('/api/lead', { method: 'OPTIONS', type: null, headers: { origin: 'https://cizi-stranka.example' } }));
check('lead: CORS preflight z cizí stránky neprojde (žádné Access-Control-Allow-Origin)', r.status === 405 && !r.headers.get('access-control-allow-origin'));
r = await run(lead, req('/api/lead', { body: lead1(), headers: { origin: 'https://cizi-stranka.example' } }));
check('lead: požadavek z cizí stránky (Origin) → 403', r.status === 403 && r.calls.length === 0);
r = await run(lead, req('/api/lead', { body: lead1(), headers: { origin: `https://${HOST}` } }));
check('lead: požadavek ze stejné stránky (Origin) projde', r.status === 200);

// ---------- hash IP ----------
const klic = async (ip) => { const x = await run(lead, req('/api/lead', { body: lead1(), headers: { 'x-forwarded-for': ip } })); return x.calls[0] && x.calls[0].body.p_klic; };
const k1 = await klic('198.51.100.1');
check('hash IP: stejná IP ve stejné hodině → stejný klíč, jiná IP → jiný', k1 === await klic('198.51.100.1') && k1 !== await klic('198.51.100.2'));
check('hash IP: klíč pro kontakty a pro události se liší', k1 !== lib.klicIp(req('/api/event', { headers: { 'x-forwarded-for': '198.51.100.1' } }), 'event'));
check('hash IP: v jiné hodině jiný klíč (nejde spojit napříč hodinami)', lib.klicIp(req('/'), 'lead', new Date('2026-10-11T10:00:00Z')) !== lib.klicIp(req('/'), 'lead', new Date('2026-10-11T11:00:00Z')));

// ---------- databáze a nastavení ----------
reply = () => new Response('{"message":"internal"}', { status: 500 });
r = await run(lead, req('/api/lead', { body: lead1() }));
check('lead: chyba databáze → 502', r.status === 502 && r.json.chyba === 'databaze');
reply = () => { throw new TypeError('fetch failed'); };
r = await run(lead, req('/api/lead', { body: lead1() }));
check('lead: nedostupná databáze → 502', r.status === 502 && r.json.chyba === 'databaze');
reply = () => Response.json('novy');
for (const missing of ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'ANTISPAM_SECRET']) {
  env(Object.fromEntries(Object.entries(OK_ENV).filter(([k]) => k !== missing)));
  r = await run(lead, req('/api/lead', { body: { email: 'eva@example.cz', souhlas: true } }));
  check(`lead: bez ${missing} → 503, nic se neposílá`, r.status === 503 && r.calls.length === 0);
}
env(OK_ENV);

// ---------- /api/event ----------
const ID = '6cea79d5-7dbd-47ef-a402-37cd1ae34015';
reply = () => Response.json('ok');
const ev = (o) => ({ navsteva: ID, udalost: 'otoceni_listku', varianta: 'zacatek', detail: 'VOO:dvojce', ...o });
r = await run(event, req('/api/event', { body: ev(), type: 'text/plain;charset=UTF-8' }));
const e = r.calls[0] || {};
check('event: platná událost přes sendBeacon (text/plain) → 204 a jedno volání uloz_udalost', r.status === 204 && r.calls.length === 1 && e.url === 'https://projekt.supabase.co/rest/v1/rpc/uloz_udalost', String(r.status));
check('event: jen ID návštěvy, událost, verze, detail a hash IP (čas doplní databáze)', e.body && Object.keys(e.body).sort().join() === 'p_detail,p_klic,p_navsteva,p_udalost,p_varianta' && e.body.p_detail === 'VOO:dvojce', JSON.stringify(e.body));
for (const [udalost, detail] of [['prichod', null], ['prichod', 'sdileni'], ['prichod', 'facebook'], ['scroll', '75'], ['cta', 'karty'], ['formular_zacatek', 'sekce']]) {
  r = await run(event, req('/api/event', { body: ev({ udalost, detail }), type: 'text/plain' }));
  check(`event: ${udalost}${detail ? ` s detailem ${detail}` : ''} → 204`, r.status === 204);
}
// od odeslání formuláře dál bez ID návštěvy (kontakt nejde spárovat s návštěvou), s ním je to chyba
check('event: seznam událostí bez ID návštěvy', lib.BEZ_NAVSTEVY.join() === 'odeslani_pokus,odeslani_chyba,odeslano,tahak_otevren,sdileni');
for (const [udalost, detail] of [['odeslani_pokus', 'lista'], ['odeslani_chyba', 'mx'], ['odeslano', 'sekce'], ['tahak_otevren', 'panel'], ['sdileni', 'kopie']]) {
  const { navsteva, ...bez } = ev({ udalost, detail });
  r = await run(event, req('/api/event', { body: bez, type: 'text/plain' }));
  check(`event: ${udalost} bez ID návštěvy → 204, do databáze jde ID návštěvy null`, r.status === 204 && r.calls[0] && r.calls[0].body.p_navsteva === null, `${r.status}`);
  r = await run(event, req('/api/event', { body: ev({ udalost, detail }), type: 'text/plain' }));
  check(`event: ${udalost} s ID návštěvy → 400, nic se neuloží`, r.status === 400 && r.json.chyba === 'navsteva' && r.calls.length === 0, `${r.status}`);
}
{
  const { navsteva, ...bez } = ev({ udalost: 'prichod', detail: null });
  r = await run(event, req('/api/event', { body: bez, type: 'text/plain' }));
  check('event: příchod bez ID návštěvy → 400', r.status === 400 && r.json.chyba === 'navsteva' && r.calls.length === 0);
}
for (const [name, body, chyba] of [
  ['neplatné ID návštěvy', ev({ navsteva: 'abc' }), 'navsteva'],
  ['neznámá událost', ev({ udalost: 'nakup' }), 'udalost'],
  ['událost „constructor“', ev({ udalost: 'constructor' }), 'udalost'],
  ['neznámá verze úvodu', ev({ varianta: 'jina' }), 'varianta'],
  ['e-mail v detailu', ev({ udalost: 'prichod', detail: 'jana@example.com' }), 'detail'],
  ['libovolný text v detailu', ev({ udalost: 'scroll', detail: 'tajna-zprava' }), 'detail'],
  ['neexistující ETF v detailu', ev({ detail: 'QQQ:dvojce' }), 'detail'],
  ['detail jako číslo', ev({ udalost: 'scroll', detail: 50 }), 'detail'],
  ['e-mail jako pole navíc', ev({ email: 'jana@example.com' }), 'pole'],
]) {
  r = await run(event, req('/api/event', { body, type: 'text/plain' }));
  check(`event: ${name} → 400, nic se neuloží`, r.status === 400 && r.json.chyba === chyba && r.calls.length === 0, `${r.status} ${r.json && r.json.chyba}`);
}
r = await run(event, req('/api/event', { body: ev({ detail: 'x'.repeat(600) }), type: 'text/plain' }));
check('event: tělo nad 512 B → 413', r.status === 413 && r.calls.length === 0);
r = await run(event, req('/api/event', { method: 'GET', type: null }));
check('event: GET → 405', r.status === 405);
r = await run(event, req('/api/event', { body: ev(), type: 'text/plain', headers: { origin: 'https://cizi-stranka.example' } }));
check('event: požadavek z cizí stránky → 403', r.status === 403 && r.calls.length === 0);
reply = () => Response.json('limit');
r = await run(event, req('/api/event', { body: ev(), type: 'text/plain' }));
check('event: překročený limit (IP nebo návštěva) → 429', r.status === 429 && r.json.chyba === 'limit');
reply = () => { throw new TypeError('fetch failed'); };
r = await run(event, req('/api/event', { body: ev(), type: 'text/plain' }));
check('event: nedostupná databáze → 502', r.status === 502);
reply = () => Response.json('ok');

// ---------- /api/token ----------
r = await run(token, req('/api/token', { method: 'GET', type: null }));
check('token: GET → 200, podepsaný a platný token, necachuje se', r.status === 200 && /^\d{13}\./.test(r.json.token) && lib.overToken(r.json.token) === 'rychle' && lib.overToken(r.json.token, Date.now() + 3500) === 'ok' && r.headers.get('cache-control') === 'no-store');
r = await run(token, req('/api/token', { body: '{}' }));
check('token: POST → 405', r.status === 405);
env({ ...OK_ENV, ANTISPAM_SECRET: '' });
r = await run(token, req('/api/token', { method: 'GET', type: null }));
check('token: bez ANTISPAM_SECRET → 503', r.status === 503);
env(OK_ENV);

// ---------- /api/keepalive ----------
r = await run(keepalive, req('/api/keepalive', { method: 'GET', type: null }));
check('keepalive: bez hlavičky Authorization → 401, žádný dotaz', r.status === 401 && r.calls.length === 0);
r = await run(keepalive, req('/api/keepalive', { method: 'GET', type: null, headers: { authorization: 'Bearer spatne' } }));
check('keepalive: špatný CRON_SECRET → 401', r.status === 401 && r.calls.length === 0);
reply = () => Response.json(3);
r = await run(keepalive, req('/api/keepalive', { method: 'GET', type: null, headers: { authorization: `Bearer ${OK_ENV.CRON_SECRET}` } }));
check('keepalive: se správným CRON_SECRET → 200 a volání uklid (zápis do databáze)', r.status === 200 && r.calls.length === 1 && r.calls[0].url.endsWith('/rest/v1/rpc/uklid') && r.json.smazano === 3, r.calls[0] && r.calls[0].url);
env({ ...OK_ENV, CRON_SECRET: '' });
r = await run(keepalive, req('/api/keepalive', { method: 'GET', type: null, headers: { authorization: 'Bearer ' } }));
check('keepalive: bez nastaveného CRON_SECRET nepustí nikoho', r.status === 401 && r.calls.length === 0);
env(OK_ENV);

// ---------- logy, konfigurace, žádné klíče ve webu ----------
console.error = orig.error;
console.warn = orig.warn;
check('logy funkcí neobsahují e-mail, klíč ani IP', logs.length > 0 && !logs.some((l) => l.includes('@') || l.includes(KEY) || l.includes(SECRET) || l.includes(IP)), logs.slice(0, 4).join(' | '));

const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const apiFiles = readdirSync(join(root, 'api'));
check('vercel.json: výstupní složka public/', vercel.outputDirectory === 'public');
check('vercel.json: funkce ve Frankfurtu (fra1)', JSON.stringify(vercel.regions) === '["fra1"]');
const cron = (vercel.crons || [])[0] || {};
const [min, hour, ...rest] = (cron.schedule || '').split(' ');
check('vercel.json: denní cron na existující /api/keepalive (Hobby: nejvýš jednou denně)', cron.path === '/api/keepalive' && apiFiles.includes('keepalive.js') && /^\d+$/.test(min) && /^\d+$/.test(hour) && rest.join(' ') === '* * *', cron.schedule);
const all = (vercel.headers.find((h) => h.source === '/(.*)') || { headers: [] }).headers;
const hv = (k) => (all.find((h) => h.key === k) || {}).value || '';
check('hlavičky: HSTS aspoň rok', /max-age=(\d+)/.test(hv('Strict-Transport-Security')) && Number(hv('Strict-Transport-Security').match(/max-age=(\d+)/)[1]) >= 31536000);
check('hlavičky: celý web noindex (X-Robots-Tag), dokud ho Clientelo nepřevezme', hv('X-Robots-Tag') === 'noindex');
check('hlavičky: nosniff, Referrer-Policy, X-Frame-Options, COOP', hv('X-Content-Type-Options') === 'nosniff' && hv('Referrer-Policy') === 'strict-origin-when-cross-origin' && hv('X-Frame-Options') === 'DENY' && hv('Cross-Origin-Opener-Policy') === 'same-origin');
check('hlavičky: Permissions-Policy vypíná kameru, mikrofon, polohu; sdílení a schránku nechává', /camera=\(\)/.test(hv('Permissions-Policy')) && !/web-share|clipboard/.test(hv('Permissions-Policy')));
let cspOk = true;
try { execFileSync('node', [join(root, 'scripts', 'csp.mjs'), '--check'], { stdio: 'pipe' }); } catch { cspOk = false; }
check('hlavičky: CSP na HTML stránkách sedí na hashe vložených skriptů (scripts/csp.mjs --check)', cspOk);
const csp = (vercel.headers.find((h) => h.source === '/') || { headers: [] }).headers.find((h) => h.key === 'Content-Security-Policy')?.value || '';
check("hlavičky: CSP bez 'unsafe-inline' a 'unsafe-eval' u skriptů, object-src a frame-ancestors 'none'", /script-src 'sha256-/.test(csp) && !/script-src[^;]*unsafe/.test(csp) && /object-src 'none'/.test(csp) && /frame-ancestors 'none'/.test(csp));
check('api/_lib.js a seznam domén nejsou funkce (podtržítko), všechny endpointy mají soubor', apiFiles.filter((f) => !f.startsWith('_')).sort().join() === 'event.js,keepalive.js,lead.js,token.js', apiFiles.join());
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
check('package.json: funkce jsou ES moduly, bez závislostí', pkg.type === 'module' && !pkg.dependencies);
const publicText = readdirSync(join(root, 'public')).filter((f) => /\.(html|js|json|txt)$/.test(f)).map((f) => readFileSync(join(root, 'public', f), 'utf8')).join('\n');
check('public/: žádná adresa Supabase ani klíč (prohlížeč mluví jen s /api/)', !/supabase\.co|sb_secret|sb_publishable|service_role|SUPABASE_|ANTISPAM/i.test(publicText));
const example = readFileSync(join(root, '.env.example'), 'utf8');
check('.env.example: jen názvy bez hodnot, všechny čtyři proměnné', example.split('\n').filter((l) => /^[A-Z_]+=/.test(l)).every((l) => /^[A-Z_]+=$/.test(l)) && ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'CRON_SECRET', 'ANTISPAM_SECRET'].every((k) => example.includes(`${k}=`)));
const gitignore = readFileSync(join(root, '.gitignore'), 'utf8');
check('.gitignore: .env.local se necommituje', /^\.env\.\*$/m.test(gitignore) && /^!\.env\.example$/m.test(gitignore));

console.log(fails ? `\nCELKEM CHYB: ${fails}` : '\nVŠE OK');
process.exit(fails ? 1 : 0);
