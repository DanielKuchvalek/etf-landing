// Testy serverless funkcí v api/ s podvrženou databází: bez skutečných klíčů a bez sítě.
// globalThis.fetch nahradí atrapa Supabase, která si zapisuje, co by funkce poslala.
// Použití: node test-api.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let fails = 0;
const check = (name, cond, extra = '') => { if (!cond) fails++; console.log(`${cond ? 'OK   ' : 'CHYBA'} ${name}${extra ? ' – ' + extra : ''}`); };

// Atrapa Supabase: zaznamená volání a vrátí nastavenou odpověď (nebo vyhodí chybu jako nedostupná síť).
const KEY = 'testovaci-klic-neni-skutecny';
const calls = [];
let reply = () => new Response(null, { status: 201 });
globalThis.fetch = async (url, opts = {}) => {
  calls.push({ url: String(url), method: opts.method || 'GET', headers: opts.headers || {}, body: opts.body ? JSON.parse(opts.body) : null });
  return reply();
};
const env = (vals) => { for (const k of ['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'CRON_SECRET']) delete process.env[k]; Object.assign(process.env, vals); };
const OK_ENV = { SUPABASE_URL: 'https://projekt.supabase.co', SUPABASE_SECRET_KEY: KEY, CRON_SECRET: 'tajny-cron-1234567890' };

// Zachytí console.error, aby šlo ověřit, že log neobsahuje e-mail ani klíč.
const logs = [];
const origError = console.error;
console.error = (...a) => logs.push(a.join(' '));

const { default: lead } = await import('../api/lead.js');
const { default: event } = await import('../api/event.js');
const { default: keepalive } = await import('../api/keepalive.js');

const HOST = 'etf-dvojcata.example';
function req(path, { method = 'POST', body, type = 'application/json', headers = {} } = {}) {
  const h = { host: HOST, ...headers };
  if (type) h['content-type'] = type;
  return new Request(`https://${HOST}${path}`, { method, headers: h, body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) });
}
async function run(handler, r) {
  calls.length = 0;
  const res = await handler.fetch(r);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { status: res.status, json, text, calls: [...calls] };
}
// Tělo, které přijde po kouscích a neuvede délku (klient lže nebo posílá stream).
function streamBody(bytes) {
  const chunk = new TextEncoder().encode('x'.repeat(256));
  let sent = 0;
  return new ReadableStream({ pull(c) { if (sent >= bytes) return c.close(); c.enqueue(chunk); sent += chunk.length; } });
}

// ---------- /api/lead ----------
env(OK_ENV);
reply = () => new Response(null, { status: 201 });
let r = await run(lead, req('/api/lead', { body: { email: '  Jana.Nova@Example.COM ', souhlas: true, varianta: 'dvojce' } }));
const c = r.calls[0] || {};
check('lead: platný kontakt → 200 a jeden zápis', r.status === 200 && r.json.ok === true && r.calls.length === 1, `${r.status} ${r.calls.length}`);
check('lead: zápis do leads s on_conflict=email', c.url === 'https://projekt.supabase.co/rest/v1/leads?on_conflict=email' && c.method === 'POST', c.url);
check('lead: e-mail oříznutý a malými písmeny, jen povolené sloupce', JSON.stringify(c.body) === JSON.stringify({ email: 'jana.nova@example.com', souhlas: true, varianta: 'dvojce' }), JSON.stringify(c.body));
check('lead: klíč jen v hlavičce apikey, ne v Authorization', c.headers.apikey === KEY && !('Authorization' in c.headers) && !('authorization' in c.headers));
check('lead: opakovaný e-mail se ignoruje (ignore-duplicates)', /resolution=ignore-duplicates/.test(c.headers.Prefer || ''));
check('lead: odpověď neobsahuje klíč', !r.text.includes(KEY));

r = await run(lead, req('/api/lead', { body: { email: 'eva@example.com', souhlas: true, varianta: 'neco-jineho' } }));
check('lead: neznámá verze úvodu se uloží jako vychozi', r.calls[0] && r.calls[0].body.varianta === 'vychozi');

for (const [name, body, status, chyba] of [
  ['prázdný e-mail', { email: '', souhlas: true }, 422, 'email'],
  ['neplatný e-mail', { email: 'jana@example', souhlas: true }, 422, 'email'],
  ['e-mail delší než 254 znaků', { email: 'a'.repeat(250) + '@example.com', souhlas: true }, 422, 'email'],
  ['e-mail jiného typu než text', { email: ['a@b.cz'], souhlas: true }, 422, 'email'],
  ['bez souhlasu', { email: 'eva@example.com' }, 422, 'souhlas'],
  ['souhlas false', { email: 'eva@example.com', souhlas: false }, 422, 'souhlas'],
  ['souhlas jako text „ano“', { email: 'eva@example.com', souhlas: 'ano' }, 422, 'souhlas'],
  ['ID návštěvy u e-mailu', { email: 'eva@example.com', souhlas: true, navsteva: '6cea79d5-7dbd-47ef-a402-37cd1ae34015' }, 400, 'pole'],
  ['pole navíc', { email: 'eva@example.com', souhlas: true, telefon: '777' }, 400, 'pole'],
  ['pole místo objektu', [1, 2], 400, 'format'],
]) {
  r = await run(lead, req('/api/lead', { body }));
  check(`lead: ${name} → ${status}, nic se neuloží`, r.status === status && r.json.chyba === chyba && r.calls.length === 0, `${r.status} ${r.json && r.json.chyba}`);
}
r = await run(lead, req('/api/lead', { body: '{"email": "eva@exa' }));
check('lead: rozbitý JSON → 400', r.status === 400 && r.calls.length === 0);
r = await run(lead, req('/api/lead', { body: { email: 'bot@example.com', souhlas: true, web: 'https://spam.example' } }));
check('lead: vyplněné skryté pole (bot) → 200, ale nic se neuloží', r.status === 200 && r.json.ok === true && r.calls.length === 0);
r = await run(lead, req('/api/lead', { body: { email: 'eva@example.com', souhlas: true }, type: 'text/plain' }));
check('lead: jiný typ obsahu než JSON → 415', r.status === 415 && r.calls.length === 0);
r = await run(lead, req('/api/lead', { body: { email: 'eva@example.com', souhlas: true, varianta: 'x'.repeat(2000) } }));
check('lead: tělo nad 1 kB → 413', r.status === 413 && r.calls.length === 0, String(r.status));
r = await run(lead, new Request(`https://${HOST}/api/lead`, { method: 'POST', headers: { host: HOST, 'content-type': 'application/json' }, body: streamBody(5000), duplex: 'half' }));
check('lead: velké tělo bez uvedené délky (stream) → 413', r.status === 413 && r.calls.length === 0, String(r.status));
r = await run(lead, req('/api/lead', { method: 'GET', type: null }));
check('lead: GET → 405', r.status === 405);
r = await run(lead, req('/api/lead', { body: { email: 'eva@example.com', souhlas: true }, headers: { origin: 'https://cizi-stranka.example' } }));
check('lead: požadavek z cizí stránky (Origin) → 403', r.status === 403 && r.calls.length === 0);
r = await run(lead, req('/api/lead', { body: { email: 'eva@example.com', souhlas: true }, headers: { origin: `https://${HOST}` } }));
check('lead: požadavek ze stejné stránky (Origin) projde', r.status === 200);

reply = () => new Response('{"message":"internal"}', { status: 500 });
r = await run(lead, req('/api/lead', { body: { email: 'eva@example.com', souhlas: true } }));
check('lead: chyba databáze → 502', r.status === 502 && r.json.chyba === 'databaze');
reply = () => { throw new TypeError('fetch failed'); };
r = await run(lead, req('/api/lead', { body: { email: 'eva@example.com', souhlas: true } }));
check('lead: nedostupná databáze → 502', r.status === 502 && r.json.chyba === 'databaze');
env({});
r = await run(lead, req('/api/lead', { body: { email: 'eva@example.com', souhlas: true } }));
check('lead: bez proměnných prostředí → 503, nic se neposílá', r.status === 503 && r.calls.length === 0);
env(OK_ENV);
reply = () => new Response(null, { status: 201 });

// ---------- /api/event ----------
const ID = '6cea79d5-7dbd-47ef-a402-37cd1ae34015';
r = await run(event, req('/api/event', { body: { navsteva: ID, udalost: 'otoceni_listku', varianta: 'zacatek', detail: 'VOO:dvojce' }, type: 'text/plain;charset=UTF-8' }));
const e = r.calls[0] || {};
check('event: platná událost přes sendBeacon (text/plain) → 204 a zápis', r.status === 204 && r.calls.length === 1, String(r.status));
check('event: zápis do events, jen čtyři sloupce (čas doplní databáze)', e.url === 'https://projekt.supabase.co/rest/v1/events' && JSON.stringify(e.body) === JSON.stringify({ navsteva: ID, udalost: 'otoceni_listku', varianta: 'zacatek', detail: 'VOO:dvojce' }), JSON.stringify(e.body));
check('event: klíč jen v hlavičce apikey', e.headers && e.headers.apikey === KEY && !('Authorization' in e.headers));
r = await run(event, req('/api/event', { body: { navsteva: ID, udalost: 'prichod', varianta: 'vychozi' } }));
check('event: bez detailu → detail null', r.status === 204 && r.calls[0].body.detail === null);
for (const [name, body, chyba] of [
  ['neplatné ID návštěvy', { navsteva: 'abc', udalost: 'prichod', varianta: 'vychozi' }, 'navsteva'],
  ['neznámá událost', { navsteva: ID, udalost: 'nakup', varianta: 'vychozi' }, 'udalost'],
  ['neznámá verze úvodu', { navsteva: ID, udalost: 'prichod', varianta: 'jina' }, 'varianta'],
  ['e-mail v detailu', { navsteva: ID, udalost: 'prichod', varianta: 'vychozi', detail: 'jana@example.com' }, 'detail'],
  ['e-mail jako pole navíc', { navsteva: ID, udalost: 'odeslano', varianta: 'vychozi', email: 'jana@example.com' }, 'pole'],
  ['příliš dlouhý detail', { navsteva: ID, udalost: 'prichod', varianta: 'vychozi', detail: 'x'.repeat(41) }, 'detail'],
]) {
  r = await run(event, req('/api/event', { body, type: 'text/plain' }));
  check(`event: ${name} → 400, nic se neuloží`, r.status === 400 && r.json.chyba === chyba && r.calls.length === 0, `${r.status} ${r.json && r.json.chyba}`);
}
r = await run(event, req('/api/event', { body: { navsteva: ID, udalost: 'prichod', varianta: 'vychozi', detail: 'x'.repeat(600) }, type: 'text/plain' }));
check('event: tělo nad 512 B → 413', r.status === 413 && r.calls.length === 0);
r = await run(event, req('/api/event', { method: 'GET', type: null }));
check('event: GET → 405', r.status === 405);
r = await run(event, req('/api/event', { body: { navsteva: ID, udalost: 'prichod', varianta: 'vychozi' }, type: 'text/plain', headers: { origin: 'https://cizi-stranka.example' } }));
check('event: požadavek z cizí stránky → 403', r.status === 403 && r.calls.length === 0);
reply = () => { throw new TypeError('fetch failed'); };
r = await run(event, req('/api/event', { body: { navsteva: ID, udalost: 'prichod', varianta: 'vychozi' }, type: 'text/plain' }));
check('event: nedostupná databáze → 502', r.status === 502);
reply = () => new Response(null, { status: 201 });

// ---------- /api/keepalive ----------
r = await run(keepalive, req('/api/keepalive', { method: 'GET', type: null }));
check('keepalive: bez hlavičky Authorization → 401, žádný dotaz', r.status === 401 && r.calls.length === 0);
r = await run(keepalive, req('/api/keepalive', { method: 'GET', type: null, headers: { authorization: 'Bearer spatne' } }));
check('keepalive: špatný CRON_SECRET → 401', r.status === 401 && r.calls.length === 0);
reply = () => Response.json([{ id: 1 }]);
r = await run(keepalive, req('/api/keepalive', { method: 'GET', type: null, headers: { authorization: `Bearer ${OK_ENV.CRON_SECRET}` } }));
check('keepalive: se správným CRON_SECRET → 200 a jeden malý dotaz', r.status === 200 && r.calls.length === 1 && r.calls[0].url.endsWith('/rest/v1/events?select=id&limit=1') && r.calls[0].method === 'GET', r.calls[0] && r.calls[0].url);
env({ SUPABASE_URL: OK_ENV.SUPABASE_URL, SUPABASE_SECRET_KEY: KEY });
r = await run(keepalive, req('/api/keepalive', { method: 'GET', type: null, headers: { authorization: 'Bearer undefined' } }));
check('keepalive: bez nastaveného CRON_SECRET nepustí nikoho', r.status === 401 && r.calls.length === 0);
env(OK_ENV);

// ---------- logy, konfigurace, žádné klíče ve webu ----------
console.error = origError;
check('logy funkcí neobsahují e-mail ani klíč', logs.length > 0 && !logs.some((l) => l.includes('@') || l.includes(KEY)), logs.join(' | '));

const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
const apiFiles = readdirSync(join(root, 'api'));
check('vercel.json: výstupní složka public/', vercel.outputDirectory === 'public');
check('vercel.json: funkce ve Frankfurtu (fra1)', JSON.stringify(vercel.regions) === '["fra1"]');
const cron = (vercel.crons || [])[0] || {};
const [min, hour, ...rest] = (cron.schedule || '').split(' ');
check('vercel.json: denní cron na existující /api/keepalive (Hobby: nejvýš jednou denně)', cron.path === '/api/keepalive' && apiFiles.includes('keepalive.js') && /^\d+$/.test(min) && /^\d+$/.test(hour) && rest.join(' ') === '* * *', cron.schedule);
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
check('package.json: funkce jsou ES moduly, bez závislostí', pkg.type === 'module' && !pkg.dependencies);

const publicText = readdirSync(join(root, 'public')).filter((f) => /\.(html|js|json|txt)$/.test(f)).map((f) => readFileSync(join(root, 'public', f), 'utf8')).join('\n');
check('public/: žádná adresa Supabase ani klíč (prohlížeč mluví jen s /api/)', !/supabase\.co|sb_secret|sb_publishable|service_role|SUPABASE_/i.test(publicText));
const example = readFileSync(join(root, '.env.example'), 'utf8');
check('.env.example: jen názvy bez hodnot', example.split('\n').filter((l) => /^[A-Z_]+=/.test(l)).every((l) => /^[A-Z_]+=$/.test(l)) && /SUPABASE_SECRET_KEY=/.test(example));
const gitignore = readFileSync(join(root, '.gitignore'), 'utf8');
check('.gitignore: .env.local se necommituje', /^\.env\.\*$/m.test(gitignore) && /^!\.env\.example$/m.test(gitignore));

console.log(fails ? `\nCELKEM CHYB: ${fails}` : '\nVŠE OK');
process.exit(fails ? 1 : 0);
