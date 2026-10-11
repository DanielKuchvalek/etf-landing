// Formuláře a klávesnice ve WebKitu (Playwright) s emulací iPhonu 13, iPhonu SE (3. gen.) a iPhonu SE (1. gen., 320 px).
// Použití: node test-webkit.mjs [URL]   (server viz serve.sh; WebKit nainstaluje `npm run webkit`)
//
// Softwarovou klávesnici emulátor nemá, proto ji simulujeme dvěma způsoby:
// - model iOS: layout viewport zůstane, zmenší se jen visualViewport (podvržená výška + událost resize)
//   a iOS posune viditelnou oblast k poli (offsetTop + událost scroll),
// - model Androidu (interactive-widget=resizes-content): zmenší se celé okno.
// Skutečné chování Safari na iPhonu (vlastní posouvání k poli, lišta nad klávesnicí) to nenahradí, viz README.
// page.evaluate / $eval jsou API Playwrightu (spouští funkci v prohlížeči), ne JS eval().
import { BASE_URL, sleep } from './lib/browser.mjs';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';
const { webkit, devices } = await import('playwright');

const BASE = process.argv[2] || BASE_URL;
const LISTA = 50; // rezerva na lištu s návrhy e-mailů nad klávesnicí
// Viditelná výška nad klávesnicí (včetně lišty nad ní). Pesimistický odhad, ne naměřená hodnota.
const PHONES = [
  { name: 'iPhone 13', visible: 328, all: true },
  { name: 'iPhone SE (3rd gen)', visible: 343, all: true },
  { name: 'iPhone SE', visible: 244, all: false }, // 320 px: musí být vidět aspoň pole a tlačítko
];

let fails = 0;
const check = (name, cond, extra = '') => { if (!cond) fails++; console.log(`${cond ? 'OK   ' : 'CHYBA'} ${name}${extra ? ' – ' + extra : ''}`); };
const frames = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

// Podvrží visualViewport (výška, posun shora) a pošle událost jako iOS při otevření klávesnice.
async function keyboard(page, visible, offsetTop = 0, type = 'resize') {
  await page.evaluate(([h, top, type]) => {
    const proto = Object.getPrototypeOf(window.visualViewport);
    if (!window.__kb) {
      window.__kb = {};
      Object.defineProperty(proto, 'height', { configurable: true, get: () => window.__kb.h ?? window.innerHeight });
      Object.defineProperty(proto, 'offsetTop', { configurable: true, get: () => window.__kb.top ?? 0 });
    }
    window.__kb.h = h;
    window.__kb.top = top;
    window.visualViewport.dispatchEvent(new Event(type));
  }, [visible, offsetTop, type]);
  await frames(page);
}

// Které části formuláře leží celé ve viditelné oblasti (nad klávesnicí, pod horním okrajem).
function inView(page, root) {
  return page.evaluate(([root, LISTA]) => {
    const r = document.querySelector(root);
    const top = window.visualViewport.offsetTop;
    const bottom = top + window.visualViewport.height;
    const box = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { t: Math.round(b.top), b: Math.round(b.bottom) }; };
    const parts = {
      nadpis: box(r.closest('dialog') ? r.closest('dialog').querySelector('h2') : null),
      pole: box(r.querySelector('input[name=email]')),
      souhlas: box(r.querySelector('.consent')),
      tlacitko: box(r.querySelector('[type=submit]')),
    };
    const vis = {};
    for (const [k, v] of Object.entries(parts)) if (v) vis[k] = v.t >= top - 0.5 && v.b <= bottom + 0.5;
    // lišta s návrhy e-mailů nad klávesnicí: iOS ji do visualViewport nemusí započítat, proto zakrývá spodních 50 px
    const nadListou = {};
    for (const [k, v] of Object.entries(parts)) if (v) nadListou[k] = v.t >= top - 0.5 && v.b <= bottom - LISTA + 0.5;
    const souhlasZacina = !!parts.souhlas && parts.souhlas.t < bottom;
    return { vis, nadListou, souhlasZacina, parts, top, bottom };
  }, [root, LISTA]);
}

// Fiktivní klávesnice do snímku: popover je v top layer nad panelem.
async function drawKeyboard(page) {
  await page.evaluate(() => {
    const k = document.createElement('div');
    k.popover = 'manual';
    const top = window.visualViewport.offsetTop + window.visualViewport.height;
    k.style.cssText = `position:fixed;inset:${top}px 0 0 0;margin:0;width:100%;height:auto;overflow:visible;border:0;padding:14px;background:#D1D4DA;color:#3A3A3C;font:600 15px -apple-system,sans-serif;text-align:center`;
    k.textContent = 'klávesnice (simulace)';
    const l = document.createElement('div');
    l.style.cssText = `position:absolute;left:0;right:0;top:-50px;height:50px;background:repeating-linear-gradient(45deg,#969BA5 0 8px,#AFB4BE 8px 16px);color:#1C1C1E;font:600 13px/50px -apple-system,sans-serif`;
    l.textContent = 'lišta s návrhy e-mailů (simulace, 50 px)';
    k.appendChild(l);
    document.body.appendChild(k);
    k.showPopover();
  });
}

// Průběh otočení lístku: animaci zastaví a posune na daný čas, změří úhel, šířku a viditelnou stranu
// a z výřezů složí jeden snímek docs/screenshots/webkit-otoceni-listku.png.
async function flipFrames(browser) {
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' });
  await page.evaluate(() => document.querySelector('.listky').classList.remove('peek'));
  const sel = '.listek[data-etf="VTI"]';
  const box = await page.$eval(sel, (el) => { el.scrollIntoView({ block: 'center' }); const b = el.getBoundingClientRect(); return { x: b.x - 4, y: b.y - 10, width: b.width + 8, height: b.height + 20 }; });
  await page.tap(sel);
  const frames = [];
  const measure = (t) => page.evaluate(([sel, t]) => {
    const card = document.querySelector(sel);
    const inner = card.querySelector('.listek-in');
    const anim = inner.getAnimations()[0];
    if (anim) { anim.pause(); anim.currentTime = t; }
    const m = new DOMMatrix(getComputedStyle(inner).transform === 'none' ? undefined : getComputedStyle(inner).transform);
    return {
      cos: m.m11, sirka: inner.getBoundingClientRect().width,
      lic: getComputedStyle(card.querySelector('.lice')).visibility === 'visible',
      rub: getComputedStyle(card.querySelector('.rub')).visibility === 'visible',
    };
  }, [sel, t]);
  const half = 225;
  for (const [t, phase] of [[0, 1], [100, 1], [200, 1], [224, 1], [25, 2], [125, 2], [225, 2]]) {
    if (phase === 2 && frames.length === 4) {
      // konec první půlky: dokončit ji, výměna stran proběhne v onfinish a začne druhá půlka
      await page.evaluate((sel) => document.querySelector(sel).querySelector('.listek-in').getAnimations()[0].finish(), sel);
      await page.waitForFunction((sel) => document.querySelector(sel).getAttribute('data-strana') === 'rub' && document.querySelector(sel).querySelector('.listek-in').getAnimations().length === 1, sel);
    }
    const f = await measure(t);
    f.ms = phase === 1 ? t : half + t;
    f.png = (await page.screenshot({ clip: box })).toString('base64');
    frames.push(f);
  }
  const full = frames[0].sirka;
  const first = frames.slice(0, 4);
  const second = frames.slice(4);
  check('otočení: v první půlce je vidět líc, lístek se zužuje', first.every((f) => f.lic && !f.rub) && first.every((f, i) => i === 0 || f.sirka < first[i - 1].sirka), first.map((f) => Math.round(f.sirka)).join(' → '));
  check('otočení: v půlce je lístek z boku (šířka pod 15 %)', first[3].sirka < full * 0.15, `${Math.round(first[3].sirka)} z ${Math.round(full)} px`);
  check('otočení: ve druhé půlce je vidět rub s dvojčetem, lístek se rozšiřuje', second.every((f) => f.rub && !f.lic) && second.every((f, i) => i === 0 || f.sirka > second[i - 1].sirka), second.map((f) => Math.round(f.sirka)).join(' → '));
  check('otočení: nikdy obě strany schované ani obě vidět', frames.every((f) => f.lic !== f.rub));
  check('otočení: nikdy zrcadlově (úhel nejvýš 90°, nic nezávisí na backface-visibility)', frames.every((f) => f.cos >= -0.001), frames.map((f) => f.cos.toFixed(2)).join(' '));
  check('otočení: na konci rub v plné šířce', second[2].sirka > full * 0.97);
  // jeden snímek ze všech výřezů s časy
  const sheet = await ctx.newPage();
  await sheet.setViewportSize({ width: 1200, height: 400 });
  await sheet.setContent(`<!doctype html><body style="margin:0;padding:12px;background:#FFFDF5;font:600 14px -apple-system,sans-serif;display:flex;gap:10px;width:max-content">${frames.map((f) => `<figure style="margin:0;text-align:center"><img src="data:image/png;base64,${f.png}" style="display:block;width:${Math.round(box.width)}px"><figcaption style="margin-top:6px">${f.ms} ms</figcaption></figure>`).join('')}</body>`);
  await sheet.waitForFunction(() => [...document.images].every((i) => i.complete));
  const size = await sheet.evaluate(() => ({ width: document.body.scrollWidth, height: document.body.scrollHeight }));
  await sheet.setViewportSize(size);
  await sheet.screenshot({ path: new URL('../docs/screenshots/webkit-otoceni-listku.png', import.meta.url).pathname });
  await ctx.close();
}

const browser = await webkit.launch();
try {
  await flipFrames(browser);
  for (const phone of PHONES) {
    const dev = devices[phone.name];
    const H = dev.viewport.height;
    const tag = `${phone.name} ${dev.viewport.width}×${H}`;

    // A) Panel ze spodní lišty, model iOS
    {
      const ctx = await browser.newContext({ ...dev });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(BASE + '?v=dvojce', { waitUntil: 'load' });
      await page.evaluate(() => document.getElementById('pary').scrollIntoView({ behavior: 'instant' }));
      await sleep(400);
      const y0 = await page.evaluate(() => Math.round(scrollY));
      const paryTop = () => page.evaluate(() => Math.round(document.getElementById('pary').getBoundingClientRect().top));
      const p0 = await paryTop();
      check(`${tag}: lišta dole je vidět`, await page.isVisible('#lista'));
      await page.tap('[data-otevri="lista"]');
      await sleep(350);
      check(`${tag}: panel otevřený`, await page.$eval('#panel', (d) => d.open));
      const focus = await page.evaluate(() => document.activeElement.id || document.activeElement.name);
      check(`${tag}: fokus na nadpisu panelu, klávesnice nevyskočí během animace`, focus === 'panel-nadpis', focus);

      // pozadí je zamčené: ani programové posunutí, ani kolečko ho nepohne
      await page.evaluate(() => { window.scrollTo(0, 99999); window.scrollBy(0, -600); document.getElementById('faq').scrollIntoView(); });
      await sleep(200);
      check(`${tag}: pozadí pod panelem se neposune`, (await paryTop()) === p0, `${p0} → ${await paryTop()}`);

      await page.tap('#panel input[name=email]');
      await keyboard(page, phone.visible);
      const sheet = await page.evaluate(() => { const b = document.getElementById('panel').getBoundingClientRect(); return { b: Math.round(b.bottom), t: Math.round(b.top) }; });
      check(`${tag}: spodek panelu sedí na klávesnici`, Math.abs(sheet.b - phone.visible) <= 1, `spodek ${sheet.b}, klávesnice od ${phone.visible}`);
      check(`${tag}: panel nepřesahuje nahoru`, sheet.t >= 0, `horní okraj ${sheet.t}`);
      let v = await inView(page, '#panel');
      const ok = (v) => v.nadListou.pole && v.nadListou.tlacitko && (!phone.all || v.vis.nadpis) && v.souhlasZacina;
      const popis = phone.all ? 'nadpis, pole a tlačítko nad lištou návrhů, souhlas začíná pod nimi' : 'pole a tlačítko nad lištou návrhů, souhlas začíná pod nimi';
      check(`${tag}: s klávesnicí ${popis}`, ok(v), JSON.stringify(v.nadListou));
      await page.keyboard.type('jana@example.com');
      check(`${tag}: v poli je vidět, co píšu`, (await page.inputValue('#panel input[name=email]')) === 'jana@example.com' && v.vis.pole);
      await drawKeyboard(page);
      await page.screenshot({ path: new URL(`../docs/screenshots/webkit-panel-klavesnice-${dev.viewport.width}.png`, import.meta.url).pathname });
      await page.evaluate(() => document.querySelector('[popover]').remove());

      // iOS posune viditelnou oblast k poli: panel jde s ní
      await keyboard(page, phone.visible, 90, 'scroll');
      v = await inView(page, '#panel');
      check(`${tag}: po posunu viditelné oblasti (iOS) je panel pořád nad klávesnicí`, ok(v), JSON.stringify(v.nadListou));
      check(`${tag}: pozadí se ani s klávesnicí neposunulo`, (await paryTop()) === p0);

      // zavření: klávesnice dolů, Esc, stránka zpátky na místě, fokus na tlačítku, které panel otevřelo
      await keyboard(page, null, 0);
      await page.keyboard.press('Escape');
      await sleep(300);
      check(`${tag}: Esc panel zavře`, !(await page.$eval('#panel', (d) => d.open)));
      const y1 = await page.evaluate(() => Math.round(scrollY));
      check(`${tag}: po zavření je stránka tam, kde byla`, y1 === y0 && (await paryTop()) === p0, `${y0} → ${y1}`);
      const back = await page.evaluate(() => document.activeElement.getAttribute('data-otevri'));
      check(`${tag}: fokus zpátky na tlačítku v liště`, back === 'lista', String(back));
      check(`${tag}: bez chyb JS`, !errors.length, errors.join(' | '));
      await ctx.close();
    }

    // B) Panel, model Androidu (klávesnice zmenší celé okno)
    {
      const ctx = await browser.newContext({ ...dev });
      const page = await ctx.newPage();
      await page.goto(BASE, { waitUntil: 'load' });
      await page.evaluate(() => document.getElementById('pary').scrollIntoView({ behavior: 'instant' }));
      await sleep(400);
      await page.tap('[data-otevri="lista"]');
      await sleep(350);
      await page.tap('#panel input[name=email]');
      await page.setViewportSize({ width: dev.viewport.width, height: phone.visible });
      await sleep(300);
      const v = await inView(page, '#panel');
      check(`${tag}: zmenšené okno (Android) – pole a tlačítko nad lištou návrhů${phone.all ? ', nadpis vidět' : ''}`, v.nadListou.pole && v.nadListou.tlacitko && (!phone.all || v.vis.nadpis), JSON.stringify(v.nadListou));
      await ctx.close();
    }

    // C) Formulář na místě pod lístky a v sekci Tahák, model iOS
    for (const [where, prepare, root] of [
      ['pod lístky', async (page) => { await page.tap('.listek[data-etf="VOO"]'); await sleep(550); await page.tap('[data-otevri="vyber"]'); await sleep(150); }, '[data-slot="vyber"] .lead-form'],
      ['v sekci Tahák', async (page) => { await page.evaluate(() => { const f = document.querySelector('[data-slot="sekce"] .lead-form'); window.scrollTo(0, f.getBoundingClientRect().bottom + scrollY - innerHeight + 10); }); await sleep(300); await page.tap('[data-slot="sekce"] input[name=email]'); }, '[data-slot="sekce"] .lead-form'],
    ]) {
      const ctx = await browser.newContext({ ...dev });
      const page = await ctx.newPage();
      await page.goto(BASE, { waitUntil: 'load' });
      await prepare(page);
      const focused = await page.evaluate(() => document.activeElement.name);
      check(`${tag}: formulář ${where} má fokus v poli`, focused === 'email', String(focused));
      await keyboard(page, phone.visible);
      await sleep(100);
      const v = await inView(page, root);
      check(`${tag}: formulář ${where} – pole a tlačítko nad lištou návrhů, souhlas začíná pod nimi`, v.nadListou.pole && v.nadListou.tlacitko && v.souhlasZacina, JSON.stringify(v.nadListou));
      check(`${tag}: formulář ${where} – lišta dole schovaná`, !(await page.isVisible('#lista')));
      if (where === 'pod lístky') {
        await drawKeyboard(page);
        await page.screenshot({ path: new URL(`../docs/screenshots/webkit-na-miste-klavesnice-${dev.viewport.width}.png`, import.meta.url).pathname });
      }
      await ctx.close();
    }

    // D) Šířka: nic nepřetéká
    {
      const ctx = await browser.newContext({ ...dev });
      const page = await ctx.newPage();
      await page.goto(BASE, { waitUntil: 'load' });
      // rychlé klepání během animace: strany musí na konci odpovídat stavu
      await page.evaluate(() => document.querySelector('.listky').classList.remove('peek'));
      for (const [etf, ms] of [['VOO', 80], ['VTI', 60], ['VTI', 120], ['VOO', 30]]) { await page.tap(`.listek[data-etf="${etf}"]`); await sleep(ms); }
      await sleep(600);
      const states = await page.$$eval('.listek', (ls) => ls.map((l) => `${l.dataset.etf}:${l.getAttribute('aria-pressed')}:${l.dataset.strana}`));
      check(`${tag}: rychlé klepání – strany odpovídají stavu`, states.every((s) => (s.endsWith('true:rub') || s.endsWith('false:lic'))) && states.filter((s) => s.includes('true')).join() === 'VOO:true:rub', states.join(' '));
      await page.tap('.listek[data-etf="VWO"]');
      await sleep(550);
      // rub neotočených lístků nesmí prosvítat (headless WebKit nerespektuje backface-visibility)
      const faces = await page.$$eval('.listek', (ls) => ls.map((l) => `${l.dataset.etf}:${getComputedStyle(l.querySelector('.lice')).visibility[0]}${getComputedStyle(l.querySelector('.rub')).visibility[0]}`));
      const spill = await page.$$eval('.lice, .rub', (fs) => fs.filter((f) => f.scrollHeight - f.clientHeight > 1).map((f) => `${f.closest('.listek').dataset.etf}:${f.className} ${f.scrollHeight}/${f.clientHeight}`));
      check(`${tag}: obsah lístků (líc i rub) se vejde, nic nepřetéká dolů`, !spill.length, spill.join(', '));
      check(`${tag}: viditelný jen líc, u otočeného jen rub`, faces.every((f) => f.startsWith('VWO') ? f.endsWith('hv') : f.endsWith('vh')), faces.join(' '));
      const over = await page.evaluate(() => {
        const W = document.documentElement.clientWidth;
        const wide = [...document.querySelectorAll('body *')].filter((el) => { const b = el.getBoundingClientRect(); return b.width && (b.right > W + 0.5 || b.left < -0.5) && !el.closest('.hp, svg, [hidden], .listek'); });
        return { scroll: document.documentElement.scrollWidth - W, wide: wide.slice(0, 5).map((el) => el.className || el.tagName) };
      });
      check(`${tag}: bez vodorovného přetečení`, over.scroll === 0 && !over.wide.length, JSON.stringify(over));
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
console.log(fails ? `\nCELKEM CHYB: ${fails}` : '\nVŠE OK');
process.exit(fails ? 1 : 0);
