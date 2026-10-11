// Lokální server: statické soubory z public/ a funkce z api/ (stejně jako na Vercelu).
// Bez proměnných SUPABASE_* běží s podvrženou databází v paměti: nic se nikam neposílá
// a na /__dev/db je vidět, co by se uložilo (jen pro testy, na Vercel se tenhle soubor nedostane).
// Se skutečnou databází: node --env-file=../.env.local server.mjs  (klíče se nikdy nevypisují)
// Použití: node server.mjs   (HOST=0.0.0.0 pro telefon ve stejné Wi-Fi, PORT=8737)
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
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
const FUNCTIONS = readdirSync(join(root, 'api')).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3));

// Podvržená databáze: zachytí volání funkcí na Supabase REST a uloží řádky do paměti.
const fake = !process.env.SUPABASE_URL;
const db = { leads: [], events: [], vypadek: false };
if (fake) {
  process.env.SUPABASE_URL = 'http://supabase.lokalne';
  process.env.SUPABASE_SECRET_KEY = 'lokalni-atrapa';
  process.env.CRON_SECRET ??= 'lokalni-cron';
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts = {}) => {
    const u = new URL(url);
    if (u.host !== 'supabase.lokalne') return realFetch(url, opts);
    if (db.vypadek) throw new TypeError('fetch failed');
    const table = u.pathname.replace('/rest/v1/', '');
    if ((opts.method || 'GET') === 'POST') {
      const row = JSON.parse(opts.body);
      if (table === 'leads') {
        if (!db.leads.some((l) => l.email === row.email)) db.leads.push({ ...row, souhlas_cas: new Date().toISOString() });
      } else {
        const hodina = new Date();
        hodina.setMinutes(0, 0, 0);
        db.events.push({ ...row, cas: hodina.toISOString() });
      }
      return new Response(null, { status: 201 });
    }
    return Response.json(db[table] ? db[table].slice(0, 1).map((_, i) => ({ id: i + 1 })) : []);
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
  const request = new Request(`http://${req.headers.host}${req.url}`, {
    method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks),
  });
  const mod = await import(pathToFileURL(join(root, 'api', `${name}.js`)).href);
  const response = await mod.default.fetch(request);
  const body = Buffer.from(await response.arrayBuffer());
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(body);
  log(req, response.status);
}

async function devDb(req, res, url) {
  if (url.searchParams.has('vypadek')) db.vypadek = url.searchParams.get('vypadek') === '1';
  if (url.searchParams.has('smazat')) { db.leads.length = 0; db.events.length = 0; }
  res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(db));
}

async function serveStatic(req, res, url) {
  let path;
  try { path = normalize(join(PUBLIC, decodeURIComponent(url.pathname))); } catch { res.writeHead(400).end(); return log(req, 400); }
  if (path !== PUBLIC && !path.startsWith(PUBLIC + sep)) { res.writeHead(403).end(); return log(req, 403); }
  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    const data = await readFile(path);
    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream', 'Content-Length': data.length, 'Cache-Control': 'no-cache' });
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
  console.log(`http://${HOST}:${PORT}/  (funkce: ${FUNCTIONS.join(', ')}; databáze: ${fake ? 'podvržená v paměti' : 'Supabase z proměnných prostředí'})`);
});
