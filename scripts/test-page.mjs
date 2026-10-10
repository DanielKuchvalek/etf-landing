// Interakční testy stránky v headless Chrome na 375×667 (dotyk). Vypíše OK/CHYBA u každé kontroly.
// Použití: node test-page.mjs [URL]   (výchozí http://127.0.0.1:8737/, server viz serve.sh)
// page.evaluate / $eval jsou API puppeteeru (spouští funkci v prohlížeči), ne JS eval().
import { launch, mobilePage, sleep, BASE_URL } from './lib/browser.mjs';

const BASE = process.argv[2] || BASE_URL;
let fails = 0;
const check = (name, cond, extra = '') => { if (!cond) fails++; console.log(`${cond ? 'OK   ' : 'CHYBA'} ${name}${extra ? ' – ' + extra : ''}`); };

const browser = await launch();

async function open(query = '') {
  const page = await mobilePage(browser);
  const logs = [];
  page.on('console', async (m) => {
    const args = await Promise.all(m.args().map((a) => a.jsonValue().catch(() => null)));
    logs.push({ type: m.type(), text: m.text(), args });
  });
  page.on('pageerror', (e) => logs.push({ type: 'pageerror', text: e.message, args: [] }));
  page.on('response', (r) => { if (r.status() >= 400) logs.push({ type: 'http', text: `${r.status()} ${new URL(r.url()).pathname}`, args: [] }); });
  await page.goto(BASE + query, { waitUntil: 'networkidle0' });
  return { page, logs };
}
const realErrors = (logs) => {
  const http = logs.filter((l) => l.type === 'http').map((l) => l.text);
  const onlyPdf404 = http.length > 0 && http.every((t) => t === '404 /tahak.pdf');
  return logs.filter((l) => l.type === 'pageerror' || (l.type === 'error' && !(onlyPdf404 && l.text.includes('404'))) || (l.type === 'http' && l.text !== '404 /tahak.pdf'));
};
const events = (logs) => logs.filter((l) => l.text.startsWith('[měření]')).map((l) => l.args[1]);
const visible = (page, sel) => page.$eval(sel, (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)).catch(() => false);
const text = (page, sel) => page.$eval(sel, (el) => el.textContent.trim()).catch(() => null);

try {
  // 1) Varianty úvodu
  const H1 = {
    '': 'Najdi evropské dvojče k VOO, VT a dalším ETF z USA',
    '?v=dvojce': 'Broker ti nenabídl VOO? Není to chyba.',
    '?v=zacatek': 'Nevíš, kterým ETF začít?',
    '?v=neznama': 'Najdi evropské dvojče k VOO, VT a dalším ETF z USA',
  };
  for (const [q, exp] of Object.entries(H1)) {
    const { page, logs } = await open(q + (q ? '&' : '?') + 'utm_source=meta&utm_content=test');
    const h1 = (await text(page, '#uvod-h1')).replace(/ /g, ' ');
    check(`varianta ${q || '(výchozí)'}: nadpis`, h1 === exp, h1);
    const ev = events(logs).find((e) => e.udalost === 'prichod');
    const expVar = q === '?v=dvojce' ? 'dvojce' : q === '?v=zacatek' ? 'zacatek' : 'vychozi';
    check(`varianta ${q || '(výchozí)'}: událost prichod s variantou a UTM`, ev && ev.varianta === expVar && ev.utm_source === 'meta' && ev.utm_content === 'test', JSON.stringify(ev));
    if (q === '?v=zacatek') check('varianta zacatek: poznámka viditelná', await visible(page, '#uvod-pozn'));
    check(`varianta ${q || '(výchozí)'}: bez chyb v konzoli`, !realErrors(logs).length);
    await page.close();
  }

  // 2) Najdi dvojče – všech 7
  const PAIRS = { VOO: 'VUAA', VTI: 'SXR4', VT: 'VWCE', VWO: 'VFEA', SDY: 'SPYD', VGT: 'QDVE', AGG: 'IUAA' };
  {
    const { page, logs } = await open();
    check('lišta dole je na začátku schovaná', !(await visible(page, '#lista')));
    for (const [us, tw] of Object.entries(PAIRS)) {
      await page.tap(`.chip[data-etf="${us}"]`);
      await sleep(250);
      const shown = await page.$$eval('.twin', (ts) => ts.filter((t) => !t.hidden).map((t) => t.getAttribute('data-etf')));
      const h2 = await page.$eval(`.twin[data-etf="${us}"] h2`, (h) => h.textContent);
      const pressed = await page.$$eval('.chip[aria-pressed="true"]', (cs) => cs.map((c) => c.getAttribute('data-etf')));
      check(`výsledek ${us} → ${tw}`, shown.length === 1 && shown[0] === us && h2.includes(us) && h2.includes(tw) && pressed.join() === us, `${shown} | ${h2} | ${pressed}`);
    }
    const ev = events(logs).filter((e) => e.udalost === 'vyber_etf').map((e) => e.etf);
    check('měření: vyber_etf u všech 7', ev.join() === Object.keys(PAIRS).join(), ev.join());
    const focused = await page.evaluate(() => document.activeElement && document.activeElement.tagName + ':' + document.activeElement.textContent);
    check('fokus na nadpisu výsledku', focused.startsWith('H2:') && focused.includes('IUAA'), focused);

    // 3) Formulář pod výsledkem
    await page.tap('[data-otevri="vysledek"]');
    await sleep(200);
    check('formulář se rozbalil pod výsledkem', await visible(page, '[data-slot="vysledek"] .lead-form'));
    check('tlačítko výzvy se schovalo', !(await visible(page, '[data-otevri="vysledek"]')));
    const af = await page.evaluate(() => document.activeElement.name);
    check('fokus v poli e-mail', af === 'email', af);
    const F = '[data-slot="vysledek"] .lead-form';
    const err = async () => (await text(page, `${F} .form-error`) || '').replace(/ /g, ' ');
    await page.tap(`${F} [type=submit]`); await sleep(100);
    check('chyba: prázdný e-mail', (await err()) === 'Napiš svůj e-mail.', await err());
    await page.type(`${F} input[name=email]`, 'jana@seznam');
    await page.tap(`${F} [type=submit]`); await sleep(100);
    check('chyba: neplatný e-mail', (await err()) === 'Tenhle e-mail nevypadá správně. Zkontroluj ho.', await err());
    await page.type(`${F} input[name=email]`, '.cz');
    await page.tap(`${F} [type=submit]`); await sleep(100);
    check('chyba: chybí souhlas', (await err()) === 'Zaškrtni prosím souhlas.', await err());
    await page.tap(`${F} input[name=consent]`);
    await page.setOfflineMode(true);
    await page.tap(`${F} [type=submit]`); await sleep(100);
    check('chyba: offline', (await err()) === 'Vypadá to, že nejde internet. Zkontroluj připojení a zkus to znovu.', await err());
    await page.setOfflineMode(false);
    await page.tap(`${F} [type=submit]`);
    await sleep(80);
    const busy = await text(page, `${F} [type=submit]`);
    check('tlačítko při odesílání', busy === 'Odesílám…', busy);
    await sleep(900);
    check('poděkování po odeslání', ((await text(page, '#vysledek-cta .thanks h3')) || '') === 'Hotovo, tahák se ti stahuje.');
    check('všechny formuláře nahrazené poděkováním', (await page.$$('.lead-form')).length === 0);
    check('poděkování nahradilo celou kartu v sekci (žádné odrážky)', (await page.$$('#tahak .form-card ul, #tahak .form-card .lead-form')).length === 0 && !!(await page.$('#tahak .form-card .thanks')));
    check('poděkování nahradilo výzvu pod výsledkem', (await page.$$('#vysledek-cta [data-otevri], #vysledek-cta > .small, #vysledek-cta .lead-form')).length === 0);
    check('poděkování v panelu bez nadpisu formuláře', !(await page.$('#panel h2#panel-nadpis')) && !!(await page.$('#panel .thanks')));
    check('odkaz na zásady ochrany osobních údajů', await page.$eval('a[href="ochrana-osobnich-udaju.html"]', () => true).catch(() => false));
    check('na stránce není viditelné TODO', !(await page.evaluate(() => document.body.innerText.includes('TODO'))));
    check('lišta dole po odeslání schovaná', !(await visible(page, '#lista')));
    const lead = logs.find((l) => l.text.startsWith('[formulář]'));
    check('odeslání: e-mail a souhlas, bez ID návštěvy', lead && lead.args[1].email === 'jana@seznam.cz' && lead.args[1].souhlas === true && !('navsteva' in lead.args[1]), JSON.stringify(lead && lead.args[1]));
    const evs = events(logs);
    check('měření: nikde e-mail', !JSON.stringify(evs).includes('@'));
    const names = evs.map((e) => e.udalost);
    for (const n of ['prichod', 'vyber_etf', 'cta', 'formular_otevren', 'formular_zacatek', 'odeslani_pokus', 'odeslani_chyba', 'odeslano']) check(`měření: událost ${n}`, names.includes(n));
    const pdf = await page.evaluate(() => fetch('/tahak.pdf', { method: 'HEAD' }).then((r) => `${r.status} ${r.headers.get('content-type')}`));
    check('tahák PDF je dostupný', pdf.startsWith('200') && pdf.includes('pdf'), pdf);
    check('žádné varování o chybějícím PDF', !logs.some((l) => l.type === 'warn' && l.text.includes('PDF zatím neexistuje')));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check('bez vodorovného přetečení (s výsledkem)', overflow === 0, `${overflow}px`);
    check('bez chyb v konzoli', !realErrors(logs).length, realErrors(logs).map((l) => l.text).join(' | '));
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
    const af = await page.evaluate(() => document.activeElement.name);
    check('fokus v poli e-mail v panelu', af === 'email', af);
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
    await page.tap(`${F} input[name=consent]`);
    await page.tap(`${F} [type=submit]`);
    await sleep(900);
    check('odeslání z panelu → poděkování', ((await text(page, '#panel .thanks h3')) || '') === 'Hotovo, tahák se ti stahuje.');
    const ev = events(logs).filter((e) => e.udalost === 'odeslano');
    check('měření: odeslano se zdrojem karty', ev.length === 1 && ev[0].zdroj === 'karty', JSON.stringify(ev));
    await page.keyboard.press('Escape');
    await sleep(200);
    // hloubka scrollu
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await sleep(400);
    const depths = events(logs).filter((e) => e.udalost === 'scroll').map((e) => e.hloubka);
    check('měření: hloubka scrollu 25/50/75/100', [25, 50, 75, 100].every((d) => depths.includes(d)), depths.join());
    check('bez chyb v konzoli', !realErrors(logs).length);
    await page.close();
  }

  // 5) Skryté pole proti botům
  {
    const { page, logs } = await open();
    const F = '[data-slot="sekce"] .lead-form';
    await page.evaluate((F) => { document.querySelector(`${F} input[name=web]`).value = 'spam'; }, F);
    await page.type(`${F} input[name=email]`, 'bot@example.com');
    await page.evaluate((F) => { document.querySelector(`${F} input[name=consent]`).checked = true; }, F);
    await page.evaluate((F) => document.querySelector(F).requestSubmit(), F);
    await sleep(300);
    check('bot: poděkování se ukáže', ((await text(page, '#tahak .form-card .thanks h3')) || '') === 'Hotovo, tahák se ti stahuje.');
    check('bot: kontakt se neodeslal', !logs.some((l) => l.text.startsWith('[formulář]')));
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(fails ? `\nCELKEM CHYB: ${fails}` : '\nVŠE OK');
process.exitCode = fails ? 1 : 0;
