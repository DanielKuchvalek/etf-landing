// Content-Security-Policy pro HTML stránky ve vercel.json: vložené skripty povolí jen podle hashe (SHA-256),
// takže cizí vložený skript (XSS) by se nespustil. Po každé změně skriptu v public/*.html spusť znovu.
// Použití: node csp.mjs          (přepočítá hashe a zapíše vercel.json)
//          node csp.mjs --check  (jen ověří, že vercel.json sedí na aktuální HTML; jinak skončí chybou)
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { writeAtomic } from './lib/write.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = readdirSync(join(root, 'public')).filter((f) => f.endsWith('.html'));
const hashes = [];
for (const f of pages) {
  const html = readFileSync(join(root, 'public', f), 'utf8');
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) hashes.push(`'sha256-${createHash('sha256').update(m[1], 'utf8').digest('base64')}'`);
}
export const CSP = [
  "default-src 'self'",
  `script-src ${[...new Set(hashes)].join(' ') || "'none'"}`,
  "style-src 'self' 'unsafe-inline'", // atributy style="--r:…" u lístků; skripty jsou přísné, styly ne
  "img-src 'self' data:", // zvýrazňovač a kroužky jsou SVG v data: URI
  "connect-src 'self'",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

// HTML se v prohlížeči ani ve sdílených cache neuchová bez ověření: nová verze se po nasazení projeví hned
// (Vercel CDN drží statické soubory jen po dobu nasazení, tohle platí i pro proxy a prohlížeče).
export const HTML_CACHE = 'public, max-age=0, must-revalidate';

const vercelPath = join(root, 'vercel.json');
const vercel = JSON.parse(readFileSync(vercelPath, 'utf8'));
const sources = ['/', ...pages.map((f) => `/${f}`)];
const current = (vercel.headers || []).filter((h) => sources.includes(h.source)).map((h) => h.headers.find((x) => x.key === 'Content-Security-Policy')?.value);

if (process.argv.includes('--check')) {
  const cache = (vercel.headers || []).filter((h) => sources.includes(h.source)).map((h) => h.headers.find((x) => x.key === 'Cache-Control')?.value);
  const ok = current.length === sources.length && current.every((v) => v === CSP) && cache.every((v) => v === HTML_CACHE);
  console.log(ok ? `CSP ve vercel.json sedí (${hashes.length} vložené skripty)` : 'CSP ve vercel.json nesedí na HTML: spusť node scripts/csp.mjs');
  process.exit(ok ? 0 : 1);
}
vercel.headers = [
  ...(vercel.headers || []).filter((h) => !sources.includes(h.source)),
  ...sources.map((source) => ({ source, headers: [{ key: 'Content-Security-Policy', value: CSP }, { key: 'Cache-Control', value: HTML_CACHE }] })),
];
writeAtomic(vercelPath, JSON.stringify(vercel, null, 2) + '\n');
console.log(`hotovo: CSP pro ${sources.join(', ')} (${hashes.length} vložené skripty)`);
