// Lokální server: statické soubory z public/ a funkce z api/ (stejně jako na Vercelu), včetně hlaviček z vercel.json.
// Bez proměnných SUPABASE_* běží s podvrženou databází: PGlite (Postgres ve WASM) se skutečným supabase/schema.sql,
// funkce volají jeho funkce stejně jako na Supabase. Na /__dev/db je vidět, co by se uložilo – jen z tohohle
// počítače (ne z telefonu v síti) a jen přes adresu localhost / 127.0.0.1. Na Vercel se tenhle soubor nedostane.
// Se skutečnou databází: node --env-file=../.env.local server.mjs  (klíče se nikdy nevypisují)
// Použití: node server.mjs   (HOST=0.0.0.0 pro telefon ve stejné Wi-Fi, PORT=8737)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { readdirSync, readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(root, 'public');
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 8737);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8',
};
const FUNCTIONS = readdirSync(join(root, 'api')).filter((f) => f.endsWith('.js') && !f.startsWith('_')).map((f) => f.slice(0, -3));

// Hlavičky z vercel.json (zdroje typu "/(.*)" nebo přesná cesta), ať se lokálně projeví i CSP.
const HEADERS = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8')).headers || [];
const headerRules = HEADERS.map((h) => ({ re: new RegExp(`^${h.source.replace(/\(\.\*\)/g, '(.*)')}$`), headers: h.headers }));
function vercelHeaders(path) {
  const out = {};
  for (const rule of headerRules) if (rule.re.test(path)) for (const { key, value } of rule.headers) out[key] = value;
  return out;
}

// Podvržená databáze (PGlite) a DNS: e-mailové domény končící .invalid nemají MX, ostatní ano.
const fake = !process.env.SUPABASE_URL;
let db = null;
let vypadek = false;
if (!process.env.ANTISPAM_SECRET) process.env.ANTISPAM_SECRET = randomBytes(32).toString('hex');
if (fake) {
  const { PGlite } = await import('@electric-sql/pglite');
  db = new PGlite();
  await db.exec(`create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
    grant usage on schema public to anon, authenticated, service_role;`);
  await db.exec(readFileSync(join(root, 'supabase', 'schema.sql'), 'utf8'));
  await db.exec(readFileSync(join(root, 'supabase', 'funnel.sql'), 'utf8'));
  process.env.SUPABASE_URL = 'http://supabase.lokalne';
  process.env.SUPABASE_SECRET_KEY = 'lokalni-atrapa';
  process.env.CRON_SECRET ??= 'lokalni-cron';
  const lib = await import(pathToFileURL(join(root, 'api', '_lib.js')).href);
  lib.zavislosti.resolveMx = async (domena) => {
    if (domena.endsWith('.invalid')) throw Object.assign(new Error('nenalezeno'), { code: 'ENOTFOUND' });
    return [{ exchange: 'mx.lokalne', priority: 10 }];
  };
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts = {}) => {
    const u = new URL(url);
    if (u.host !== 'supabase.lokalne') return realFetch(url, opts);
    if (vypadek) throw new TypeError('fetch failed');
    const m = u.pathname.match(/^\/rest\/v1\/rpc\/([a-z_]+)$/);
    if (!m || (opts.method || 'GET') !== 'POST') return new Response('{"message":"nepodporováno"}', { status: 404 });
    const args = JSON.parse(opts.body || '{}');
    const names = Object.keys(args);
    if (!names.every((n) => /^p_[a-z_]+$/.test(n))) return new Response('{"message":"argumenty"}', { status: 400 });
    // jako PostgREST: volání funkce pod rolí service_role s pojmenovanými argumenty
    await db.exec('set role service_role');
    try {
      const r = await db.query(`select public.${m[1]}(${names.map((n, i) => `${n} => $${i + 1}`).join(', ')}) as r`, names.map((n) => args[n]));
      return Response.json(r.rows[0].r);
    } catch (e) {
      return Response.json({ message: e.message }, { status: 400 });
    } finally {
      await db.exec('reset role');
    }
  };
}

function log(req, status, extra = '') {
  console.log(`${new Date().toLocaleTimeString('cs-CZ')} ${req.method} ${req.url} → ${status}${extra}`);
}

async function callFunction(name, req, res) {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > 1e6) { res.writeHead(413).end(); return log(req, 413); }
    chunks.push(c);
  }
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
  headers.set('x-forwarded-for', req.socket.remoteAddress || ''); // jako Vercel: IP klienta, ne co klient pošle
  const request = new Request(`http://${req.headers.host}${req.url}`, {
    method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
  });
  const mod = await import(pathToFileURL(join(root, 'api', `${name}.js`)).href);
  const response = await mod.default.fetch(request);
  const body = Buffer.from(await response.arrayBuffer());
  res.writeHead(response.status, { ...vercelHeaders(new URL(request.url).pathname), ...Object.fromEntries(response.headers) });
  res.end(body);
  log(req, response.status);
}

// /__dev/db jen z tohohle počítače a jen přes localhost/127.0.0.1 (ne z telefonu v síti, ne přes podvržený Host)
function devAllowed(req) {
  const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
  const host = (req.headers.host || '').replace(/:\d+$/, '');
  return local && ['127.0.0.1', 'localhost', '[::1]'].includes(host);
}
async function devDb(req, res, url) {
  if (!devAllowed(req)) { res.writeHead(403).end(); return log(req, 403); }
  if (url.searchParams.has('vypadek')) vypadek = url.searchParams.get('vypadek') === '1';
  if (url.searchParams.has('smazat')) await db.exec('delete from public.leads; delete from public.events; delete from public.limity;');
  const [leads, events, limity] = await Promise.all(['leads', 'events', 'limity'].map((t) => db.query(`select * from public.${t}`)));
  res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify({ leads: leads.rows, events: events.rows, limity: limity.rows, vypadek }));
}

async function serveStatic(req, res, url) {
  let path;
  try { path = normalize(join(PUBLIC, decodeURIComponent(url.pathname))); } catch { res.writeHead(400).end(); return log(req, 400); }
  if (path !== PUBLIC && !path.startsWith(PUBLIC + sep)) { res.writeHead(403).end(); return log(req, 403); }
  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    const data = await readFile(path);
    res.writeHead(200, { ...vercelHeaders(url.pathname), 'Content-Type': TYPES[extname(path)] || 'application/octet-stream', 'Content-Length': data.length, 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : data);
    log(req, 200);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Nenalezeno');
    // u 404 vypíšeme, kde soubor hledal a kdo se ptal: kdyby se chyba z telefonu opakovala, půjde dohledat proč
    log(req, 404, ` (hledáno ${path}; ${(req.headers['user-agent'] || '').slice(0, 80)})`);
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    const fn = url.pathname.match(/^\/api\/([a-z]+)$/);
    if (fn && FUNCTIONS.includes(fn[1])) return await callFunction(fn[1], req, res);
    if (fake && url.pathname === '/__dev/db') return await devDb(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return log(req, 405); }
    return await serveStatic(req, res, url);
  } catch (e) {
    console.error('chyba serveru:', e.message);
    if (!res.headersSent) res.writeHead(500).end();
  }
}).listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}/  (funkce: ${FUNCTIONS.join(', ')}; databáze: ${fake ? 'podvržená (PGlite se schema.sql)' : 'Supabase z proměnných prostředí'})`);
});
