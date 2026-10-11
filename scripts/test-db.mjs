// Testy supabase/schema.sql a supabase/funnel.sql na skutečném Postgresu (PGlite, Postgres ve WASM, bez sítě).
// Nasimuluje role a výchozí práva Supabase (anon a authenticated dostávají na public všechno) a ověří,
// že schéma je odebere, že funkce dělají limity a duplicity a že trychtýř počítá správně.
// Použití: node test-db.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PGlite } from '@electric-sql/pglite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const schema = readFileSync(join(root, 'supabase', 'schema.sql'), 'utf8');
const funnel = readFileSync(join(root, 'supabase', 'funnel.sql'), 'utf8');
let fails = 0;
const check = (name, cond, extra = '') => { if (!cond) fails++; console.log(`${cond ? 'OK   ' : 'CHYBA'} ${name}${extra ? ' – ' + extra : ''}`); };

const db = new PGlite();
// Role a výchozí práva jako v Supabase
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
`);
for (const [name, sql] of [['schema.sql', schema], ['funnel.sql', funnel], ['schema.sql podruhé', schema], ['funnel.sql podruhé', funnel]]) {
  let err = '';
  try { await db.exec(sql); } catch (e) { err = e.message; }
  check(`${name} proběhne bez chyby`, !err, err);
}

async function as(role, sql, params = []) {
  await db.exec(`set role ${role}`);
  try { return { rows: (await db.query(sql, params)).rows }; } catch (e) { return { error: e.message }; } finally { await db.exec('reset role'); }
}
const one = async (role, sql, params) => { const r = await as(role, sql, params); return r.error ? `CHYBA: ${r.error}` : Object.values(r.rows[0])[0]; };
const KLIC = (n) => n.toString(16).padStart(32, '0');

// --- práva: anonymní a přihlášená role nesmí nic ---
for (const role of ['anon', 'authenticated']) {
  for (const [what, sql] of [
    ['číst leads', 'select * from public.leads'],
    ['zapsat do leads', "insert into public.leads (email, souhlas) values ('a@example.com', true)"],
    ['číst events', 'select * from public.events'],
    ['zapsat do events', "insert into public.events (navsteva, udalost, varianta) values (gen_random_uuid(), 'prichod', 'vychozi')"],
    ['číst limity', 'select * from public.limity'],
    ['volat uloz_kontakt', `select public.uloz_kontakt('${KLIC(1)}', 'a@example.com', 'vychozi')`],
    ['volat uloz_udalost', `select public.uloz_udalost('${KLIC(1)}', gen_random_uuid(), 'prichod', 'vychozi', null)`],
    ['volat uklid', 'select public.uklid()'],
    ['číst trychtýř', 'select * from analytika.trychtyr'],
  ]) {
    const r = await as(role, sql);
    check(`${role} nesmí ${what}`, !!r.error && /permission denied/.test(r.error), r.error || 'prošlo!');
  }
}
const rls = await db.query("select relname, relrowsecurity from pg_class where relname in ('leads','events','limity') order by relname");
check('RLS zapnuté na leads, events a limity', rls.rows.length === 3 && rls.rows.every((r) => r.relrowsecurity), JSON.stringify(rls.rows));
const pol = await db.query("select count(*)::int n from pg_policies where tablename in ('leads','events','limity')");
check('žádná politika RLS (nic se přes API neotevírá)', pol.rows[0].n === 0);
const fn = await db.query("select proname, proconfig, prosecdef from pg_proc where proname in ('zapocitej','uloz_kontakt','uloz_udalost','uklid') order by proname");
check('funkce: security invoker a pevný search_path', fn.rows.length === 4 && fn.rows.every((r) => !r.prosecdef && String(r.proconfig).includes('search_path')), JSON.stringify(fn.rows.map((r) => r.proname)));
const typ = await db.query("select table_name, data_type from information_schema.columns where column_name = 'id' and table_name in ('leads','events') order by table_name");
check('klíče leads a events jsou náhodná UUID, ne pořadová čísla', typ.rows.every((r) => r.data_type === 'uuid') && typ.rows.length === 2, JSON.stringify(typ.rows));

// --- kontakty: duplicita, limit, kontroly ---
check('uloz_kontakt: nový kontakt', (await one('service_role', `select public.uloz_kontakt('${KLIC(2)}', 'jana@example.com', 'dvojce')`)) === 'novy');
check('uloz_kontakt: stejný e-mail podruhé = duplicita, neuloží se znovu', (await one('service_role', `select public.uloz_kontakt('${KLIC(2)}', 'jana@example.com', 'zacatek')`)) === 'duplicita'
  && (await one('service_role', "select count(*)::int from public.leads where email = 'jana@example.com'")) === 1
  && (await one('service_role', "select varianta from public.leads where email = 'jana@example.com'")) === 'dvojce');
const LIMIT_KONTAKTU = 30;
const pokusy = [];
for (let i = 0; i <= LIMIT_KONTAKTU; i++) pokusy.push(await one('service_role', `select public.uloz_kontakt('${KLIC(3)}', 'novy${i}@example.com', 'vychozi')`));
check(`uloz_kontakt: ${LIMIT_KONTAKTU} pokusů z jedné IP za hodinu projde, ${LIMIT_KONTAKTU + 1}. = limit`, pokusy.slice(0, -1).every((r) => r === 'novy') && pokusy.at(-1) === 'limit'
  && (await one('service_role', "select count(*)::int from public.leads where email like 'novy%'")) === LIMIT_KONTAKTU, pokusy.at(-1));
check('uloz_kontakt: jiná IP limit nemá', (await one('service_role', `select public.uloz_kontakt('${KLIC(4)}', 'jina@example.com', 'vychozi')`)) === 'novy');
for (const [what, email] of [['velká písmena', 'Jana@Example.com'], ['diakritika', 'jána@example.com'], ['bez zavináče', 'jana.example.com'], ['znak <', 'ja<na@example.com']]) {
  const r = await one('service_role', `select public.uloz_kontakt('${KLIC(5)}', $1, 'vychozi')`, [email]);
  check(`leads: databáze odmítne e-mail (${what})`, String(r).startsWith('CHYBA') && /check constraint/.test(r), r);
}
check('leads: databáze odmítne neznámou verzi úvodu', String(await one('service_role', `select public.uloz_kontakt('${KLIC(6)}', 'v@example.com', 'jina')`)).includes('check constraint'));
check('leads: databáze odmítne souhlas false', !!(await as('service_role', "insert into public.leads (email, souhlas) values ('s@example.com', false)")).error);

// --- události: limit na návštěvu, detail, čas na hodiny ---
const visit = '6cea79d5-7dbd-47ef-a402-37cd1ae34015';
let ev = '';
for (let i = 0; i < 101; i++) ev = await one('service_role', `select public.uloz_udalost('${KLIC(7)}', '${visit}', 'scroll', 'vychozi', '25')`);
check('uloz_udalost: 101. událost jedné návštěvy = limit', ev === 'limit' && (await one('service_role', `select count(*)::int from public.events where navsteva = '${visit}'`)) === 100, ev);
for (let i = 0; i < 500; i++) await one('service_role', `select public.uloz_udalost('${KLIC(7)}', gen_random_uuid(), 'prichod', 'vychozi', null)`);
check('uloz_udalost: 601. událost z jedné IP za hodinu = limit', (await one('service_role', `select public.uloz_udalost('${KLIC(7)}', gen_random_uuid(), 'prichod', 'vychozi', null)`)) === 'limit');
check('events: databáze odmítne „@“ v detailu', String(await one('service_role', `select public.uloz_udalost('${KLIC(8)}', gen_random_uuid(), 'prichod', 'vychozi', 'jana@example.com')`)).includes('check constraint'));
check('events: databáze odmítne neznámou událost', String(await one('service_role', `select public.uloz_udalost('${KLIC(8)}', gen_random_uuid(), 'nakup', 'vychozi', null)`)).includes('check constraint'));
check('events: čas jen na celé hodiny', (await one('service_role', 'select bool_and(cas = date_trunc(\'hour\', cas)) from public.events')) === true);
check('limity: klíč musí vypadat jako hash (žádná IP)', String(await one('service_role', "select public.zapocitej('192.168.1.10', 5)")).includes('check constraint'));

// --- úklid ---
await db.exec(`insert into public.limity (klic, okno, pocet) values ('${KLIC(9)}', now() - interval '3 days', 1)`);
const smazano = await one('service_role', 'select public.uklid()');
check('uklid: smaže počítadla starší než 2 dny, novější nechá', smazano === 1 && (await one('service_role', `select count(*)::int from public.limity where klic = '${KLIC(9)}'`)) === 0 && (await one('service_role', 'select count(*)::int from public.limity')) > 0, String(smazano));

// --- trychtýř ---
await db.exec('delete from public.events');
const ev3 = async (v, items) => { for (const u of items) await db.query("insert into public.events (navsteva, udalost, varianta) values ($1, $2, 'dvojce')", [v, u]); };
await ev3('00000000-0000-4000-8000-000000000001', ['prichod', 'otoceni_listku', 'formular_otevren', 'odeslano']);
await ev3('00000000-0000-4000-8000-000000000002', ['prichod', 'formular_zacatek', 'odeslano']); // formulář v sekci Tahák
await ev3('00000000-0000-4000-8000-000000000003', ['prichod']);
const t = (await db.query("select poradi, navstev, navstev_postupne, pct_z_prichodu::float p from analytika.trychtyr where varianta = 'dvojce' order by poradi")).rows;
const got = t.map((r) => `${r.poradi}:${r.navstev}/${r.navstev_postupne}/${r.p}`).join(' ');
check('trychtýř: kroky, postupně i formulář v sekci Tahák', got === '1:3/3/100 2:1/1/33.3 3:2/1/66.7 4:2/1/66.7', got);

await db.close();
console.log(fails ? `\nCELKEM CHYB: ${fails}` : '\nVŠE OK');
process.exit(fails ? 1 : 0);
