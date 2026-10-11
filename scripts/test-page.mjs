// Interakční testy stránky v headless Chrome na 375×667 (dotyk). Vypíše OK/CHYBA u každé kontroly.
// Použití: node test-page.mjs [URL]   (výchozí http://127.0.0.1:8737/, server viz serve.sh – s podvrženou databází)
// Události a kontakty čte z odeslaných požadavků na /api/event a /api/lead a porovnává s tím, co server uložil (/__dev/db).
// page.evaluate / $eval jsou API puppeteeru (spouští funkci v prohlížeči), ne JS eval().
import { launch, mobilePage, sleep, BASE_URL } from './lib/browser.mjs';
import { SOUHLAS } from '../api/_lib.js';

const BASE = process.argv[2] || BASE_URL;
let fails = 0;
const check = (name, cond, extra = '') => { if (!cond) fails++; console.log(`${cond ? 'OK   ' : 'CHYBA'} ${name}${extra ? ' – ' + extra : ''}`); };

const browser = await launch();

async function open(query = '', before = null) {
  const page = await mobilePage(browser);
  if (before) await page.evaluateOnNewDocument(before);
  const logs = [];
  page.on('console', async (m) => {
    const args = await Promise.all(m.args().map((a) => a.jsonValue().catch(() => null)));
    logs.push({ type: m.type(), text: m.text(), args });
  });
  page.on('pageerror', (e) => logs.push({ type: 'pageerror', text: e.message, args: [] }));
  page.on('response', (r) => { if (r.status() >= 400) logs.push({ type: 'http', text: `${r.status()} ${new URL(r.url()).pathname}`, args: [] }); });
  page.on('request', (r) => logs.push({ type: 'req', text: `${r.method()} ${new URL(r.url()).pathname}`, args: [] }));
  // odeslané události a kontakty (jen ty, na které server odpověděl)
  page.on('response', (res) => {
    const r = res.request();
    const path = new URL(r.url()).pathname;
    if (r.method() !== 'POST' || (path !== '/api/event' && path !== '/api/lead')) return;
    let data = null;
    try { data = JSON.parse(r.postData() || 'null'); } catch { /* nevalidní tělo test odhalí jinde */ }
    logs.push({ type: path === '/api/event' ? 'event' : 'lead', text: path, data, status: res.status() });
  });
  await page.goto(BASE + query, { waitUntil: 'networkidle0' });
  return { page, logs };
}
const realErrors = (logs) => logs.filter((l) => l.type === 'pageerror' || l.type === 'error' || l.type === 'http');
const events = (logs) => logs.filter((l) => l.type === 'event').map((l) => l.data);
const devDb = (q = '') => fetch(`${BASE}__dev/db${q}`).then((r) => r.json());
// poděkování přijde až ~3 s po načtení (server zahodí formulář odeslaný rychleji, stránka do té doby počká)
const waitFor = (page, sel, ms = 12000) => page.waitForSelector(sel, { timeout: ms }).then(() => true, () => false);
const waitError = (page, F, ms = 12000) => page.waitForFunction((F) => { const p = document.querySelector(`${F} .form-error`); return p && !p.hidden && !document.querySelector(`${F} [type=submit]`).disabled; }, { timeout: ms }, F).then(() => true, () => false);
const visible = (page, sel) => page.$eval(sel, (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)).catch(() => false);
// Klepnutí bez plynulého posunu: puppeteer před klepnutím k prvku posouvá a se scroll-behavior: smooth
// klepne doprostřed posunu, vedle prvku. Proto prvek nejdřív okamžitě vystředíme.
const tapStill = async (page, sel) => { await page.$eval(sel, (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' })); await sleep(50); await page.tap(sel); };
const text = (page, sel) =>page.$eval(sel, (el) => el.textContent.trim()).catch(() => null);

try {
  await devDb('?smazat=1&vypadek=0');

  // 0) JS do 20 kB (limit z CLAUDE.md, všechny vložené skripty) a ID návštěvy i bez crypto.randomUUID (http v lokální síti)
  {
    const html = await fetch(BASE).then((r) => r.text());
    const js = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].reduce((n, m) => n + Buffer.byteLength(m[1]), 0);
    check('JavaScript na stránce do 20 000 B', js <= 20000, `${js} B`);
    const { page, logs } = await open('', () => { delete Crypto.prototype.randomUUID; });
    const ev = logs.find((l) => l.type === 'event' && l.data && l.data.udalost === 'prichod');
    check('ID návštěvy bez crypto.randomUUID: UUID v4, server ho přijme', !!ev && ev.status === 204 && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(ev.data.navsteva), ev && `${ev.status} ${ev.data.navsteva}`);
    await page.close();
  }

  // 1) Varianty úvodu
  const H1 = {
    '': 'Najdi evropské dvojče k VOO, VT a dalším ETF z USA',
    '?v=dvojce': 'Broker ti nenabídl VOO? Není to chyba.',
    '?v=zacatek': 'Začínáš s ETF?',
    '?v=neznama': 'Najdi evropské dvojče k VOO, VT a dalším ETF z USA',
  };
  for (const [q, exp] of Object.entries(H1)) {
    const { page, logs } = await open(q + (q ? '&' : '?') + 'utm_source=meta&utm_campaign=etf-dvojcata&utm_content=A-Dvojce');
    const h1 = (await text(page, '#uvod-h1')).replace(/ /g, ' ');
    check(`varianta ${q || '(výchozí)'}: nadpis`, h1 === exp, h1);
    const tahakRadek = await page.$eval('#uvod-tahak', (p) => { const r = p.getBoundingClientRect(); return { t: p.textContent.replace(/\u00a0/g, ' '), vidět: r.bottom <= innerHeight && r.height > 0 }; }).catch(() => null);
    check(`varianta ${q || '(výchozí)'}: řádek o taháku na první obrazovce bez otočení lístku`, !!tahakRadek && tahakRadek.vidět && tahakRadek.t === 'Tahák zdarma v PDF: ISINy a postup nákupu krok za krokem.', JSON.stringify(tahakRadek));
    const ev = events(logs).find((e) => e.udalost === 'prichod');
    const expVar = q === '?v=dvojce' ? 'dvojce' : q === '?v=zacatek' ? 'zacatek' : 'vychozi';
    check(`varianta ${q || '(výchozí)'}: událost prichod s variantou a utm_source:utm_campaign:utm_content`, ev && ev.varianta === expVar && ev.detail === 'meta:etf-dvojcata:a-dvojce', JSON.stringify(ev));
    if (q === '?v=zacatek') check('varianta zacatek: poznámka viditelná', await visible(page, '#uvod-pozn'));
    check(`varianta ${q || '(výchozí)'}: bez chyb v konzoli`, !realErrors(logs).length);
    await page.close();
  }

  // 2) Najdi dvojče – všech 7
  const PAIRS = { VOO: 'VUAA', VTI: 'SXR4', VT: 'VWCE', VWO: 'VFEA', SDY: 'SPYD', VGT: 'QDVE', AGG: 'IUAA' };
  {
    const { page, logs } = await open();
    check('lišta dole je na začátku schovaná', !(await visible(page, '#lista')));
    check('výzva k taháku je před otočením schovaná', !(await visible(page, '#vyber-cta')));
    const souhlas = await page.$$eval('.consent > span', (ss) => ss.map((x) => x.firstChild.textContent.replace(/\u00a0/g, ' ').trim()));
    check('souhlas na stránce přesně podle SOUHLAS.text v api/_lib.js (jinak změnit i verzi)', souhlas.length >= 1 && souhlas.every((x) => x === SOUHLAS.text), souhlas[0]);
    check('souhlas ani stránka nejmenují Clientelo jako správce', !(await page.evaluate(() => document.body.innerText.includes('Clientelo'))));
    const stamp = await page.$eval('#vyber .stamp', (p) => `${p.textContent.replace(/ /g, ' ')}|${p.querySelector('a[href="#data"]') ? 'odkaz' : ''}`).catch(() => '');
    check('u lístků (ne až v patičce): zdroj dat, datum, odkaz na zdroje a „Není to investiční doporučení“', /správců fondů a brokerů, ověřeno \d{1,2}\. \d{1,2}\. \d{4}/.test(stamp) && stamp.includes('Není to investiční doporučení.') && stamp.endsWith('|odkaz') && await visible(page, '#vyber .stamp'), stamp);
    const rot = await page.$$eval('.listek', (ls) => ls.map((l) => {
      const m = getComputedStyle(l).transform;
      if (m === 'none') return 0;
      const [a, b] = m.slice(7, -1).split(',').map(Number);
      return Math.abs(Math.atan2(b, a) * 180 / Math.PI);
    }));
    check('lístky pootočené nejvýš o 2°', rot.length === 7 && Math.max(...rot) <= 2, rot.map((r) => r.toFixed(1)).join('°, ') + '°');
    const btnBg = await page.$eval('[data-slot="sekce"] .btn', (b) => getComputedStyle(b).backgroundColor);
    check('hlavní tlačítko je černé', btnBg === 'rgb(20, 20, 20)', btnBg);
    for (const [us, tw] of Object.entries(PAIRS)) {
      await page.tap(`.listek[data-etf="${us}"]`);
      await sleep(550);
      const pressed = await page.$$eval('.listek[aria-pressed="true"]', (cs) => cs.map((c) => c.getAttribute('data-etf')));
      const back = await page.$eval(`.listek[data-etf="${us}"] .rub`, (r) => r.textContent.replace(/\u00a0/g, ' '));
      const side = await page.$eval(`.listek[data-etf="${us}"]`, (el) => `${el.dataset.strana}|${getComputedStyle(el.querySelector('.rub')).visibility}|${getComputedStyle(el.querySelector('.lice')).visibility}`);
      const shown = await page.$$eval('.twin', (ts) => ts.filter((t) => !t.hidden).map((t) => t.getAttribute('data-etf')));
      const h2 = await page.$eval(`.twin[data-etf="${us}"] h2`, (h) => h.textContent);
      check(`lístek ${us} → ${tw}: otočený, vzadu dvojče, podrobnosti`, pressed.join() === us && back.includes(tw) && back.includes('Kč ročně') && side === 'rub|visible|hidden' && shown.join() === us && h2.includes(tw), `${pressed} | ${back} | ${shown}`);
    }
    check('výzva k taháku se ukázala po prvním otočení', await visible(page, '#vyber-cta'));
    await page.tap('.listek[data-etf="AGG"]');
    await sleep(550);
    check('druhé klepnutí lístek otočí zpět', (await page.$$('.listek[aria-pressed="true"]')).length === 0);
    await sleep(200);
    const flips = events(logs).filter((e) => e.udalost === 'otoceni_listku').map((e) => e.detail);
    check('měření: otočení lístků (7× na dvojče, 1× zpět)', flips.filter((d) => d.endsWith(':dvojce')).map((d) => d.split(':')[0]).join() === Object.keys(PAIRS).join() && flips.filter((d) => d.endsWith(':original')).length === 1, flips.join(' '));
    check('měření: výzva zobrazena jednou', events(logs).filter((e) => e.udalost === 'vyzva_zobrazena').length === 1);

    // 3) Formulář pod lístky
    await page.tap('[data-otevri="vyber"]');
    await sleep(200);
    check('formulář se rozbalil pod lístky', await visible(page, '[data-slot="vyber"] .lead-form'));
    check('tlačítko výzvy se schovalo', !(await visible(page, '[data-otevri="vyber"]')));
    const af = await page.evaluate(() => document.activeElement.name);
    check('fokus v poli e-mail', af === 'email', af);
    const F = '[data-slot="vyber"] .lead-form';
    const err = async () => (await text(page, `${F} .form-error`) || '').replace(/ /g, ' ');
    await page.tap(`${F} [type=submit]`); await sleep(100);
    check('chyba: prázdný e-mail', (await err()) === 'Napiš svůj e-mail.', await err());
    await page.type(`${F} input[name=email]`, 'jana@example');
    await page.tap(`${F} [type=submit]`); await sleep(100);
    check('chyba: neplatný e-mail', (await err()) === 'Tenhle e-mail nevypadá správně. Zkontroluj ho.', await err());
    await page.type(`${F} input[name=email]`, '.com');
    await page.tap(`${F} [type=submit]`); await sleep(100);
    check('chyba: chybí souhlas', (await err()) === 'Zaškrtni prosím souhlas.', await err());
    await tapStill(page, `${F} input[name=consent]`);
    await page.setOfflineMode(true);
    await page.tap(`${F} [type=submit]`); await sleep(100);
    check('chyba: offline', (await err()) === 'Vypadá to, že nejde internet. Zkontroluj připojení a zkus to znovu.', await err());
    await page.setOfflineMode(false);
    // stav tlačítka během odesílání zachytí pozorovatel změn (lokální server odpoví za pár milisekund)
    await page.$eval(`${F} [type=submit]`, (b) => { window.__btn = []; new MutationObserver(() => window.__btn.push(`${b.disabled}|${b.textContent}`)).observe(b, { attributes: true, childList: true, characterData: true, subtree: true }); });
    await page.tap(`${F} [type=submit]`);
    await sleep(80);
    const busy = await page.evaluate(() => window.__btn || []);
    check('tlačítko při odesílání: zablokované s textem „Odesílám…“', busy.includes('true|Odesílám…'), busy.join(' / '));
    await waitFor(page, '#vyber-cta .thanks');
    check('poděkování po odeslání', ((await text(page, '#vyber-cta .thanks h3')) || '') === 'Hotovo, tahák je tvůj.');
    check('všechny formuláře nahrazené poděkováním', (await page.$$('.lead-form')).length === 0);
    check('poděkování nahradilo celou kartu v sekci (žádné odrážky)', (await page.$$('#tahak .form-card ul, #tahak .form-card .lead-form')).length === 0 && !!(await page.$('#tahak .form-card .thanks')));
    check('poděkování nahradilo výzvu pod lístky', (await page.$$('#vyber-cta [data-otevri], #vyber-cta > .small, #vyber-cta .lead-form')).length === 0);
    check('poděkování v panelu bez nadpisu formuláře', !(await page.$('#panel h2#panel-nadpis')) && !!(await page.$('#panel .thanks')));
    check('odkaz na zásady ochrany osobních údajů', await page.$eval('a[href="ochrana-osobnich-udaju.html"]', () => true).catch(() => false));
    check('na stránce není viditelné TODO', !(await page.evaluate(() => document.body.innerText.includes('TODO'))));
    check('lišta dole po odeslání schovaná', !(await visible(page, '#lista')));
    const lead = logs.find((l) => l.type === 'lead');
    check('odeslání: e-mail, souhlas, verze úvodu, token a prázdné skryté pole, bez ID návštěvy', lead && lead.status === 200 && Object.keys(lead.data).sort().join() === 'email,poznamka,souhlas,token,varianta' && lead.data.email === 'jana@example.com' && lead.data.souhlas === true && lead.data.varianta === 'vychozi' && lead.data.poznamka === '' && /^\d{13}\./.test(lead.data.token), JSON.stringify(lead && lead.data));
    await sleep(300);
    const evs = events(logs);
    const db = await devDb();
    const row = db.leads.find((l) => l.email === 'jana@example.com');
    check('databáze: kontakt uložený jen se sloupci e-mail, souhlas, čas a verze souhlasu a verze úvodu', !!row && Object.keys(row).sort().join() === 'email,id,souhlas,souhlas_cas,souhlas_verze,varianta' && row.souhlas_verze === SOUHLAS.verze, JSON.stringify(row));
    // od odeslání formuláře dál bez ID návštěvy, aby kontakt nešel spárovat s návštěvou
    const BEZ = ['odeslani_pokus', 'odeslani_chyba', 'odeslano', 'tahak_otevren', 'sdileni'];
    const sVisit = evs.filter((e) => !BEZ.includes(e.udalost));
    const sBez = evs.filter((e) => BEZ.includes(e.udalost));
    const key = (e) => `${e.udalost}:${e.detail ?? null}`;
    const visit = sVisit[0] && sVisit[0].navsteva;
    const stored = db.events.filter((e) => e.navsteva === visit).map(key).sort().join();
    check('databáze: každá odeslaná událost této návštěvy opravdu dorazila', !!visit && stored === sVisit.map(key).sort().join() && sVisit.every((e) => e.navsteva === visit), `${sVisit.length} odesláno`);
    check('měření: pokus, chyby a odeslání bez ID návštěvy', sBez.length >= 5 && sBez.every((e) => !('navsteva' in e)) && sBez.some((e) => e.udalost === 'odeslano'), sBez.map(key).join());
    check('databáze: události bez ID návštěvy dorazily a ID v nich není', db.events.filter((e) => e.navsteva === null).map(key).sort().join() === sBez.map(key).sort().join(), `${sBez.length} odesláno`);
    check('databáze: v událostech nikde e-mail', !JSON.stringify(db.events).includes('@'));
    const tr = await fetch(`${BASE}__dev/trychtyr?json`).then((r) => r.json()).catch(() => []);
    const krok4 = tr.find((r) => r.varianta === 'vychozi' && r.poradi === 4);
    check('lokální trychtýř (/__dev/trychtyr): odeslání se počítá z kontaktů podle verze úvodu', !!krok4 && Number(krok4.navstev) === db.leads.filter((l) => l.varianta === 'vychozi').length && Number(krok4.navstev) >= 1 && krok4.navstev_postupne === null, JSON.stringify(krok4));
    check('měření: nikde e-mail', !JSON.stringify(evs).includes('@'));
    const names = evs.map((e) => e.udalost);
    for (const n of ['prichod', 'otoceni_listku', 'vyzva_zobrazena', 'cta', 'formular_otevren', 'formular_zacatek', 'odeslani_pokus', 'odeslani_chyba', 'odeslano']) check(`měření: událost ${n}`, names.includes(n));
    check('po odeslání se PDF samo nestahuje', !logs.some((l) => l.type === 'req' && l.text.endsWith('/tahak.pdf')));
    const link = await page.$eval('#vyber-cta .thanks a[href$="tahak.pdf"]', (a) => `${a.getAttribute('href')} ${a.target}`).catch(() => null);
    check('poděkování: odkaz „Otevřít tahák“ do nové karty', link === '/tahak.pdf _blank', String(link));
    const pdf = await page.evaluate(() => fetch('/tahak.pdf', { method: 'HEAD' }).then((r) => `${r.status} ${r.headers.get('content-type')}`));
    check('tahák PDF je dostupný', pdf.startsWith('200') && pdf.includes('pdf'), pdf);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check('bez vodorovného přetečení (s výsledkem)', overflow === 0, `${overflow}px`);
    // v režimu offline se události ztratí (stejně jako v reálu), to je očekávaná chyba
    const bad = realErrors(logs).filter((l) => !l.text.includes('ERR_INTERNET_DISCONNECTED'));
    check('bez chyb v konzoli (kromě událostí ztracených v režimu offline)', !bad.length, bad.map((l) => l.text).join(' | '));
    await page.close();
  }

  // 4) Lišta dole a panel
  {
    const { page, logs } = await open('?v=dvojce');
    await page.evaluate(() => document.getElementById('pary').scrollIntoView({ behavior: 'instant' }));
    await sleep(500);
    check('lišta dole se objeví pod úvodem', await visible(page, '#lista'));
    await page.tap('[data-otevri="lista"]');
    await sleep(400);
    check('panel s formulářem otevřený', await page.$eval('#panel', (d) => d.open));
    check('lišta schovaná při otevřeném panelu', !(await visible(page, '#lista')));
    const af = await page.evaluate(() => document.activeElement.id);
    check('fokus na nadpisu panelu (dotyk: klávesnice nevyskočí během animace)', af === 'panel-nadpis', af);
    await page.tap('#panel [data-zavri]');
    await sleep(300);
    check('panel zavřený křížkem', !(await page.$eval('#panel', (d) => d.open)));
    check('lišta zpět po zavření panelu', await visible(page, '#lista'));
    await page.evaluate(() => document.querySelector('[data-otevri="karty"]').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await sleep(300);
    await page.tap('[data-otevri="karty"]');
    await sleep(400);
    check('tlačítko pod kartami otevře panel (ne skok dolů)', await page.$eval('#panel', (d) => d.open));
    const F = '#panel .lead-form';
    await page.type(`${F} input[name=email]`, 'petr@example.com');
    await tapStill(page, `${F} input[name=consent]`);
    await page.tap(`${F} [type=submit]`);
    await waitFor(page, '#panel .thanks');
    check('odeslání z panelu → poděkování', ((await text(page, '#panel .thanks h3')) || '') === 'Hotovo, tahák je tvůj.');
    const ev = events(logs).filter((e) => e.udalost === 'odeslano');
    check('měření: odeslano se zdrojem karty', ev.length === 1 && ev[0].detail === 'karty', JSON.stringify(ev));
    await page.keyboard.press('Escape');
    await sleep(200);
    // hloubka scrollu
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await sleep(400);
    await sleep(200);
    const depths = events(logs).filter((e) => e.udalost === 'scroll').map((e) => e.detail);
    check('měření: hloubka scrollu 25/50/75/100', ['25', '50', '75', '100'].every((d) => depths.includes(d)), depths.join());
    check('bez chyb v konzoli', !realErrors(logs).length);
    await page.close();
  }

  // 6) prefers-reduced-motion: lístek se neotáčí animací, jen se vymění obsah
  {
    const page = await mobilePage(browser);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    const t = await page.$eval('.listek-in', (el) => getComputedStyle(el).animationName);
    check('reduced motion: bez „nakouknutí“', t === 'none', t);
    await page.tap('.listek[data-etf="VOO"]');
    const now = await page.$eval('.listek[data-etf="VOO"]', (el) => `${el.querySelector('.listek-in').getAnimations().length}|${el.dataset.strana}`);
    check('reduced motion: bez animace otočení, rub se ukáže hned', now === '0|rub', now);
    await page.close();
  }

  // 7) Náhled taháku u formuláře
  {
    const { page } = await open();
    await page.evaluate(() => document.getElementById('tahak').scrollIntoView({ behavior: 'instant' }));
    await sleep(800);
    const img = await page.$eval('.nahled img', (i) => ({ ok: i.complete && i.naturalWidth > 0, w: i.naturalWidth, h: i.naturalHeight, attr: `${i.getAttribute('width')}×${i.getAttribute('height')}`, lazy: i.loading }));
    check('náhled taháku se načte a má správné rozměry', img.ok && `${img.w}×${img.h}` === img.attr && img.lazy === 'lazy', JSON.stringify(img));
    await page.close();
  }

  // 8) Poděkování: tlačítko na tahák, první krok, sdílení (nativní, zrušené, kopie, ruční kopie)
  const SHARE = {
    nativni: () => { navigator.share = () => Promise.resolve(); },
    zruseno: () => { navigator.share = () => Promise.reject(new DOMException('zrušeno', 'AbortError')); },
    kopie: () => { delete Navigator.prototype.share; Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.resolve() } }); },
    rucne: () => { delete Navigator.prototype.share; Object.defineProperty(navigator, 'clipboard', { value: undefined }); },
  };
  await devDb('?smazat=1'); // limit 30 kontaktů za hodinu z jedné IP: testy jich odešlou víc
  for (const [mode, before] of Object.entries(SHARE)) {
    const { page, logs } = await open('', before);
    const F = '[data-slot="sekce"] .lead-form';
    await page.type(`${F} input[name=email]`, 'eva@example.com');
    await tapStill(page, `${F} input[name=consent]`);
    await page.tap(`${F} [type=submit]`);
    await waitFor(page, '#tahak .thanks');
    await sleep(700); // fokus na poděkování stránku plynule posune, klepat až potom
    const T = '#tahak .thanks';
    if (mode === 'nativni') {
      const btn = await page.$eval(`${T} [data-tahak]`, (a) => `${a.textContent}|${a.className}|${a.getAttribute('href')}|${a.target}`).catch(() => null);
      check('poděkování: tlačítko „Otevřít tahák“', btn === 'Otevřít tahák|btn|/tahak.pdf|_blank', String(btn));
      check('poděkování: věta s prvním krokem', ((await text(page, `${T} .krok`)) || '').startsWith('První krok:'));
      await page.evaluate(() => document.addEventListener('click', (e) => { if (e.target.closest('[data-tahak]')) e.preventDefault(); }));
      await page.tap(`${T} [data-tahak]`);
      await sleep(250);
      const op = events(logs).filter((e) => e.udalost === 'tahak_otevren');
      check('měření: otevření taháku, bez ID návštěvy', op.length === 1 && op[0].detail === 'sekce' && !('navsteva' in op[0]), JSON.stringify(op));
    }
    await page.tap(`${T} [data-sdilej]`);
    await sleep(300);
    const shEv = events(logs).filter((e) => e.udalost === 'sdileni');
    const sh = shEv.map((e) => e.detail);
    check(`měření: sdílení (${mode}), bez ID návštěvy`, sh.join() === mode && shEv.every((e) => !('navsteva' in e)), sh.join());
    if (mode === 'kopie') check('sdílení bez nativní nabídky: odkaz zkopírovaný', ((await text(page, `${T} [data-sdileni-stav]`)) || '').startsWith('Odkaz je zkopírovaný'));
    if (mode === 'rucne') {
      const url = await page.$eval(`${T} .share-url`, (i) => i.value).catch(() => null);
      check('sdílení bez schránky: odkaz k ručnímu zkopírování', !!url && url.endsWith('/?ref=sdileni'), String(url));
    }
    check(`sdílení (${mode}): bez chyb v konzoli`, !realErrors(logs).length, realErrors(logs).map((l) => l.text).join(' | '));
    await page.close();
  }
  {
    const { page, logs } = await open('?ref=sdileni');
    const ev = events(logs).find((e) => e.udalost === 'prichod');
    check('měření: příchod přes sdílený odkaz', ev && ev.detail === 'sdileni', JSON.stringify(ev));
    await page.close();
  }

  // 9) Zásady ochrany osobních údajů pro ukázku: správce je autor, nic otevřeného, žádné Clientelo
  {
    const { page, logs } = await open('ochrana-osobnich-udaju.html');
    const t = (await page.evaluate(() => document.body.innerText)).replace(/\u00a0/g, ' ');
    const robots = await page.$eval('meta[name=robots]', (m) => m.content).catch(() => null);
    check('zásady: označené jako ukázka do výběrového řízení a noindex', t.includes('Ukázka do výběrového řízení.') && robots === 'noindex', String(robots));
    check('zásady: správce Daniel Kuchválek, kontakt, výmaz do 31. 12. 2026, region databáze', ['Správcem osobních údajů je Daniel Kuchválek', 'd.kuchvalek@gmail.com', '31. 12. 2026', 'eu-central-1'].every((x) => t.includes(x)));
    check('zásady: nic k doplnění, žádné TODO ani Clientelo', !/doplní|TODO|Clientelo/.test(t) && !(await page.$('.doplni, .todo')));
    check('zásady: bez chyb v konzoli', !realErrors(logs).length, realErrors(logs).map((l) => l.text).join(' | '));
    await page.close();
  }

  // 10) Hlavička: ikony, obrázek pro sdílení, jen světlé barvy
  {
    const { page } = await open();
    const head = await page.evaluate(async () => {
      const attr = (sel, a) => (document.querySelector(sel) || { getAttribute: () => null }).getAttribute(a);
      const status = async (u) => { const r = await fetch(u); return `${u} ${r.status} ${r.headers.get('content-type')}`; };
      const og = await createImageBitmap(await (await fetch('/og.png')).blob());
      return {
        scheme: attr('meta[name=color-scheme]', 'content'), css: getComputedStyle(document.documentElement).colorScheme,
        ogImage: attr('meta[property="og:image"]', 'content'), ogSize: `${og.width}×${og.height}`,
        files: await Promise.all(['/favicon.svg', '/favicon.ico', '/apple-touch-icon.png', '/og.png'].map(status)),
        modal: attr('#panel', 'aria-modal'),
      };
    });
    check('color-scheme jen světlé (tmavý režim iOS nic nepřebarví)', head.scheme === 'only light' && head.css.includes('only'), `${head.scheme} / ${head.css}`);
    check('favicon, ikona pro iOS a obrázek pro sdílení existují', head.files.every((f) => / 200 (image|text)/.test(f)), head.files.join(' | '));
    const urls = await page.evaluate(() => [document.querySelector('link[rel=canonical]')?.href, document.querySelector('meta[property="og:url"]')?.content, document.querySelector('meta[property="og:image"]')?.content]);
    check('kanonická adresa, og:url a og:image na https://etf-dvojcata-demo.vercel.app', urls[0] === 'https://etf-dvojcata-demo.vercel.app/' && urls[1] === urls[0] && urls[2] === urls[0] + 'og.png', urls.join(' | '));
    check('og:image: absolutní https adresa, 1200×630', /^https:\/\/[^/]+\/og\.png$/.test(head.ogImage) && head.ogSize === '1200×630', `${head.ogImage} ${head.ogSize}`);
    check('panel má aria-modal', head.modal === 'true');
    const robots = await page.$eval('meta[name=robots]', (m) => m.content).catch(() => null);
    const res = await page.evaluate(() => fetch('/').then((r) => r.headers.get('x-robots-tag')));
    check('celá stránka noindex (meta i hlavička X-Robots-Tag)', robots === 'noindex' && res === 'noindex', `${robots} | ${res}`);
    const demo = await page.$eval('footer .demo', (p) => `${p.textContent}|${getComputedStyle(p).fontSize}`).catch(() => null);
    check('patička: nenápadná poznámka „Ukázkové řešení do výběrového řízení.“', demo === 'Ukázkové řešení do výběrového řízení.|13px', String(demo));
    const csp = await page.evaluate(() => {
      const s = document.createElement('script');
      s.textContent = 'window.__xss = 1';
      document.body.appendChild(s);
      return window.__xss === undefined;
    });
    check('CSP: podstrčený vložený skript (XSS) se nespustí', csp);
    await page.close();
  }

  // 11) Panel z klávesnice (počítač bez dotyku): Enter otevře, fokus v poli, Tab zůstane v panelu, Esc zavře a vrátí fokus
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 768 });
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.getElementById('pary').scrollIntoView({ behavior: 'instant' }));
    await sleep(400);
    const y0 = await page.evaluate(() => Math.round(scrollY));
    await page.focus('[data-otevri="lista"]');
    await page.keyboard.press('Enter');
    await sleep(400);
    check('klávesnice: Enter otevře panel a fokus je v poli e-mail', await page.evaluate(() => document.getElementById('panel').open && document.activeElement.name === 'email'));
    let inside = true;
    for (let i = 0; i < 7; i++) { await page.keyboard.press('Tab'); inside = inside && await page.evaluate(() => document.getElementById('panel').contains(document.activeElement)); }
    for (let i = 0; i < 7; i++) { await page.keyboard.down('Shift'); await page.keyboard.press('Tab'); await page.keyboard.up('Shift'); inside = inside && await page.evaluate(() => document.getElementById('panel').contains(document.activeElement)); }
    check('klávesnice: Tab i Shift+Tab zůstávají v panelu', inside);
    await page.keyboard.press('Escape');
    await sleep(300);
    const after = await page.evaluate(() => ({ open: document.getElementById('panel').open, focus: document.activeElement.getAttribute('data-otevri'), y: Math.round(scrollY) }));
    check('klávesnice: Esc zavře panel, fokus zpátky na tlačítku, stránka na místě', !after.open && after.focus === 'lista' && after.y === y0, JSON.stringify({ ...after, y0 }));
    await page.close();
  }

  // 5) Skryté pole proti botům
  {
    const { page, logs } = await open();
    const F = '[data-slot="sekce"] .lead-form';
    await page.evaluate((F) => { document.querySelector(`${F} input[name=poznamka]`).value = 'spam'; }, F);
    await page.type(`${F} input[name=email]`, 'bot@example.com');
    await page.evaluate((F) => { document.querySelector(`${F} input[name=consent]`).checked = true; }, F);
    await page.evaluate((F) => document.querySelector(F).requestSubmit(), F);
    await waitFor(page, '#tahak .form-card .thanks');
    check('bot: poděkování se ukáže (bot se nic nedozví)', ((await text(page, '#tahak .form-card .thanks h3')) || '') === 'Hotovo, tahák je tvůj.');
    const sent = logs.find((l) => l.type === 'lead');
    check('bot: rozhodne server – skryté pole odešle, kontakt se neuloží', !!sent && sent.data.poznamka === 'spam' && !(await devDb()).leads.some((l) => l.email === 'bot@example.com'));
    await page.close();
  }

  // 13) Odeslání modrou klávesou na klávesnici (enterkeyhint="send", Enter): stejná kontrola souhlasu
  {
    const { page } = await open();
    const F = '[data-slot="sekce"] .lead-form';
    const order = await page.$eval(F, (f) => [...f.children].map((c) => c.matches('.field') ? 'pole' : c.matches('[type=submit]') ? 'tlacitko' : c.matches('.consent') ? 'souhlas' : null).filter(Boolean).join(','));
    check('formulář: tlačítko hned pod polem, souhlas pod tlačítkem', order === 'pole,tlacitko,souhlas', order);
    check('pole e-mail má enterkeyhint="send"', (await page.$eval(`${F} input[name=email]`, (i) => i.getAttribute('enterkeyhint'))) === 'send');
    await page.type(`${F} input[name=email]`, 'enter@example.com');
    await page.keyboard.press('Enter');
    await sleep(150);
    const err = ((await text(page, `${F} .form-error`)) || '');
    const focus = await page.evaluate(() => document.activeElement.name);
    check('Enter bez souhlasu: hláška o souhlasu a fokus na zaškrtávátku', err === 'Zaškrtni prosím souhlas.' && focus === 'consent', `${err} | ${focus}`);
    await sleep(700); // fokus na zaškrtávátko stránku plynule posune, klepnout až potom
    await tapStill(page, `${F} input[name=consent]`);
    await page.focus(`${F} input[name=email]`);
    await page.keyboard.press('Enter');
    await waitFor(page, '#tahak .thanks');
    check('Enter se souhlasem: odesláno, poděkování', ((await text(page, '#tahak .thanks h3')) || '') === 'Hotovo, tahák je tvůj.');
    await page.close();
  }

  // 14) Hlášky z ochrany proti spamu: doména bez MX, jednorázová adresa, limit pokusů, rychlé odeslání počká
  {
    const { page } = await open();
    const F = '[data-slot="sekce"] .lead-form';
    const t0 = await page.evaluate(() => performance.now());
    for (const [email, exp] of [['jana@neexistuje.invalid', 'Na tuhle adresu nejde poslat e-mail. Zkontroluj, jestli v ní není překlep.'], ['jana@mailinator.com', 'Jednorázové e-mailové adresy nebereme. Napiš prosím svůj běžný e-mail.']]) {
      await page.$eval(`${F} input[name=email]`, (i) => { i.value = ''; });
      await page.type(`${F} input[name=email]`, email);
      if (!(await page.$eval(`${F} input[name=consent]`, (c) => c.checked))) await page.$eval(`${F} input[name=consent]`, (c) => { c.checked = true; });
      await page.$eval(F, (f) => f.requestSubmit());
      await waitError(page, F);
      const err = ((await text(page, `${F} .form-error`)) || '').replace(/\u00a0/g, ' ');
      const focus = await page.evaluate(() => document.activeElement.name);
      check(`spam: ${email.split('@')[1]} → srozumitelná hláška, fokus v poli e-mail`, err === exp && focus === 'email', `${err} | ${focus}`);
    }
    const waited = await page.evaluate((t0) => performance.now() - t0, t0);
    check('rychlé odeslání: stránka počká, až bude token starý aspoň 3 s (nic se neztratí)', waited >= 2500, `${Math.round(waited)} ms od načtení`);
    await page.setRequestInterception(true);
    page.on('request', (r) => (r.url().endsWith('/api/lead') ? r.respond({ status: 429, contentType: 'application/json', body: '{"ok":false,"chyba":"limit"}' }) : r.continue()));
    await page.$eval(`${F} input[name=email]`, (i) => { i.value = 'jana@example.com'; });
    await page.$eval(F, (f) => f.requestSubmit());
    await waitError(page, F);
    const lim = ((await text(page, `${F} .form-error`)) || '').replace(/\u00a0/g, ' ');
    check('spam: překročený limit → hláška, ať to zkusí za hodinu', lim === 'Z tohohle připojení přišlo moc pokusů za sebou. Zkus to prosím za hodinu.', lim);
    await page.close();
  }

  // 12) Nedostupná databáze: hláška, tlačítko zase funguje, po obnovení druhý pokus projde
  {
    const { page, logs } = await open();
    const F = '[data-slot="sekce"] .lead-form';
    await devDb('?vypadek=1');
    await page.type(`${F} input[name=email]`, 'petra@example.com');
    await tapStill(page, `${F} input[name=consent]`);
    await page.tap(`${F} [type=submit]`);
    await waitError(page, F);
    const err = ((await text(page, `${F} .form-error`)) || '').replace(/\u00a0/g, ' ');
    const btn = await page.$eval(`${F} [type=submit]`, (b) => `${b.disabled}|${b.textContent}`);
    check('výpadek databáze: srozumitelná hláška a tlačítko zase funguje', err === 'Něco se pokazilo u nás. Zkus to prosím za chvíli znovu.' && btn === 'false|Získat tahák', `${err} | ${btn}`);
    check('výpadek databáze: kontakt se neuložil, formulář zůstal', !(await devDb()).leads.some((l) => l.email === 'petra@example.com') && !!(await page.$(F)));
    await devDb('?vypadek=0');
    await page.tap(`${F} [type=submit]`);
    await waitFor(page, '#tahak .thanks');
    check('po obnovení databáze druhý pokus projde', ((await text(page, '#tahak .thanks h3')) || '') === 'Hotovo, tahák je tvůj.' && (await devDb()).leads.some((l) => l.email === 'petra@example.com'));
    const bad = realErrors(logs).filter((l) => !(l.type === 'http' && /^502 \/api\/(lead|event)$/.test(l.text)) && !(l.type === 'error' && l.text.includes('502')));
    check('výpadek databáze: kromě očekávané 502 bez chyb', !bad.length, bad.map((l) => l.text).join(' | '));
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(fails ? `\nCELKEM CHYB: ${fails}` : '\nVŠE OK');
// explicitní konec: po stažení PDF může v headless Chrome zůstat otevřené spojení
process.exit(fails ? 1 : 0);
