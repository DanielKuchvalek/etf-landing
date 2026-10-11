// Stáhne seznam jednorázových e-mailových domén a zapíše ho do api/_jednorazove-domeny.js (funkce /api/lead ho používá).
// Zdroj: github.com/disposable-email-domains/disposable-email-domains, licence CC0 1.0 (volné dílo).
// Použití: node jednorazove-domeny.mjs [commit]   (bez argumentu vezme poslední commit souboru se seznamem)
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { writeAtomic } from './lib/write.mjs';

const REPO = 'disposable-email-domains/disposable-email-domains';
const FILE = 'disposable_email_blocklist.conf';
const headers = { 'User-Agent': 'etf-dvojcata' };

let sha = process.argv[2];
let date = '';
if (!sha) {
  const c = await (await fetch(`https://api.github.com/repos/${REPO}/commits?path=${FILE}&per_page=1`, { headers })).json();
  sha = c[0].sha;
  date = c[0].commit.committer.date.slice(0, 10);
}
const res = await fetch(`https://raw.githubusercontent.com/${REPO}/${sha}/${FILE}`);
if (!res.ok) throw new Error(`stažení selhalo: ${res.status}`);
const domains = [...new Set((await res.text()).split('\n').map((l) => l.trim().toLowerCase()).filter((l) => l && !l.startsWith('#')))].sort();
if (domains.length < 1000) throw new Error(`podezřele krátký seznam: ${domains.length}`);
for (const ok of ['gmail.com', 'seznam.cz', 'email.cz', 'centrum.cz', 'outlook.com', 'icloud.com']) {
  if (domains.includes(ok)) throw new Error(`seznam obsahuje běžnou doménu ${ok}`);
}

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'api', '_jednorazove-domeny.js');
writeAtomic(out, `// Jednorázové e-mailové domény, které /api/lead odmítne (${domains.length} domén).
// Zdroj: https://github.com/${REPO}/blob/${sha}/${FILE}${date ? ` (commit z ${date})` : ''}
// Licence: CC0 1.0. Vygenerováno skriptem scripts/jednorazove-domeny.mjs, ručně neupravovat.
// Soubor začíná podtržítkem, takže z něj Vercel neudělá funkci.
export default new Set(${JSON.stringify(domains)});
`);
console.log(`hotovo: ${domains.length} domén, commit ${sha.slice(0, 7)} → api/_jednorazove-domeny.js`);
