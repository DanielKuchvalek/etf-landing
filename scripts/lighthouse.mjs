// Lighthouse v mobilním režimu (výchozí emulace telefonu, simulované zpomalení) pro všechny verze úvodu.
// Použití: node lighthouse.mjs [URL]   Výsledky ukládá do scripts/out/ (v .gitignore).
// Proti nasazené stránce (jiné než localhost) blokuje požadavky na /api/, aby měření nezapsalo do databáze příchody.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CHROME_PATH, BASE_URL } from './lib/browser.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });
const base = process.argv[2] || BASE_URL;
const bin = join(here, 'node_modules', '.bin', 'lighthouse');
const live = !/^https?:\/\/(127\.0\.0\.1|localhost)[:/]/.test(base);
const prefix = live ? 'lighthouse-live' : 'lighthouse';

for (const [name, q] of [['vychozi', ''], ['dvojce', '?v=dvojce'], ['zacatek', '?v=zacatek']]) {
  const file = join(out, `${prefix}-${name}.json`);
  const block = live ? ['--blocked-url-patterns=*/api/*'] : [];
  execFileSync(bin, [base + q, '--output=json', `--output-path=${file}`, '--chrome-flags=--headless=new', '--quiet', ...block],
    { env: { ...process.env, CHROME_PATH }, stdio: 'ignore' });
  const r = JSON.parse(readFileSync(file, 'utf8'));
  const s = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
  const a = r.audits;
  console.log(`${name.padEnd(8)} výkon ${s.performance} · přístupnost ${s.accessibility} · postupy ${s['best-practices']} · SEO ${s.seo}`
    + ` | LCP ${a['largest-contentful-paint'].displayValue} · CLS ${a['cumulative-layout-shift'].displayValue}`
    + ` · TBT ${a['total-blocking-time'].displayValue} · ${a['total-byte-weight'].displayValue}`);
  const failed = Object.values(r.categories).flatMap((c) => c.auditRefs.filter((x) => x.weight > 0).map((x) => a[x.id])).filter((x) => x.score !== null && x.score < 1);
  if (failed.length) console.log(`         neúspěšné audity: ${[...new Set(failed.map((x) => x.id))].join(', ')}`);
}
