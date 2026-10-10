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
    check('výzva k taháku je před otočením schovaná', !(await visible(page, '#vyber-cta')));
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
      const flipped = await page.$eval(`.listek[data-etf="${us}"] .listek-in`, (el) => getComputedStyle(el).transform);
      const shown = await page.$$eval('.twin', (ts) => ts.filter((t) => !t.hidden).map((t) => t.getAttribute('data-etf')));
      const h2 = await page.$eval(`.twin[data-etf="${us}"] h2`, (h) => h.textContent);
      check(`lístek ${us} → ${tw}: otočený, vzadu dvojče, podrobnosti`, pressed.join() === us && back.includes(tw) && back.includes('Kč ročně') && flipped !== 'none' && shown.join() === us && h2.includes(tw), `${pressed} | ${back} | ${shown}`);
    }
    check('výzva k taháku se ukázala po prvním otočení', await visible(page, '#vyber-cta'));
    await page.tap('.listek[data-etf="AGG"]');
    await sleep(550);
    check('druhé klepnutí lístek otočí zpět', (await page.$$('.listek[aria-pressed="true"]')).length === 0);
    const flips = events(logs).filter((e) => e.udalost === 'otoceni_listku');
    check('měření: otočení lístků (7× na dvojče, 1× zpět)', flips.filter((e) => e.strana === 'dvojce').map((e) => e.etf).join() === Object.keys(PAIRS).join() && flips.filter((e) => e.strana === 'original').length === 1, flips.map((e) => e.etf + ':' + e.strana).join(' '));
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
    check('poděkování po odeslání', ((await text(page, '#vyber-cta .thanks h3')) || '') === 'Hotovo, tahák se ti stahuje.');
    check('všechny formuláře nahrazené poděkováním', (await page.$$('.lead-form')).length === 0);
    check('poděkování nahradilo celou kartu v sekci (žádné odrážky)', (await page.$$('#tahak .form-card ul, #tahak .form-card .lead-form')).length === 0 && !!(await page.$('#tahak .form-card .thanks')));
    check('poděkování nahradilo výzvu pod lístky', (await page.$$('#vyber-cta [data-otevri], #vyber-cta > .small, #vyber-cta .lead-form')).length === 0);
    check('poděkování v panelu bez nadpisu formuláře', !(await page.$('#panel h2#panel-nadpis')) && !!(await page.$('#panel .thanks')));
    check('odkaz na zásady ochrany osobních údajů', await page.$eval('a[href="ochrana-osobnich-udaju.html"]', () => true).catch(() => false));
    check('na stránce není viditelné TODO', !(await page.evaluate(() => document.body.innerText.includes('TODO'))));
    check('lišta dole po odeslání schovaná', !(await visible(page, '#lista')));
    const lead = logs.find((l) => l.text.startsWith('[formulář]'));
    check('odeslání: e-mail a souhlas, bez ID návštěvy', lead && lead.args[1].email === 'jana@seznam.cz' && lead.args[1].souhlas === true && !('navsteva' in lead.args[1]), JSON.stringify(lead && lead.args[1]));
    const evs = events(logs);
    check('měření: nikde e-mail', !JSON.stringify(evs).includes('@'));
    const names = evs.map((e) => e.udalost);
    for (const n of ['prichod', 'otoceni_listku', 'vyzva_zobrazena', 'cta', 'formular_otevren', 'formular_zacatek', 'odeslani_pokus', 'odeslani_chyba', 'odeslano']) check(`měření: událost ${n}`, names.includes(n));
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

  // 6) prefers-reduced-motion: lístek se neotáčí animací, jen se vymění obsah
  {
    const page = await mobilePage(browser);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(BASE, { waitUntil: 'networkidle0' });
    const t = await page.$eval('.listek-in', (el) => `${getComputedStyle(el).transitionDuration} / ${getComputedStyle(el).animationName}`);
    check('reduced motion: bez animace otočení i „nakouknutí“', t.startsWith('0s') && t.endsWith('none'), t);
    await page.tap('.listek[data-etf="VOO"]');
    await sleep(100);
    check('reduced motion: lístek přesto ukáže dvojče', (await page.$$('.listek[aria-pressed="true"]')).length === 1);
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
// explicitní konec: po stažení PDF může v headless Chrome zůstat otevřené spojení
process.exit(fails ? 1 : 0);
