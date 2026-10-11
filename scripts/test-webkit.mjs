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
  return page.evaluate((root) => {
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
    return { vis, parts, top, bottom };
  }, root);
}

// Fiktivní klávesnice do snímku: popover je v top layer nad panelem.
async function drawKeyboard(page) {
  await page.evaluate(() => {
    const k = document.createElement('div');
    k.popover = 'manual';
    const top = window.visualViewport.offsetTop + window.visualViewport.height;
    k.style.cssText = `position:fixed;inset:${top}px 0 0 0;margin:0;width:100%;height:auto;border:0;padding:14px;background:#D1D4DA;color:#3A3A3C;font:600 15px -apple-system,sans-serif;text-align:center`;
    k.textContent = 'klávesnice (simulace)';
    document.body.appendChild(k);
    k.showPopover();
  });
}

const browser = await webkit.launch();
try {
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
      const must = phone.all ? ['nadpis', 'pole', 'souhlas', 'tlacitko'] : ['pole', 'souhlas', 'tlacitko'];
      check(`${tag}: s klávesnicí vidět ${must.join(', ')}`, must.every((k) => v.vis[k]), JSON.stringify(v.vis));
      await page.keyboard.type('jana@example.com');
      check(`${tag}: v poli je vidět, co píšu`, (await page.inputValue('#panel input[name=email]')) === 'jana@example.com' && v.vis.pole);
      await drawKeyboard(page);
      await page.screenshot({ path: new URL(`../docs/screenshots/webkit-panel-klavesnice-${dev.viewport.width}.png`, import.meta.url).pathname });
      await page.evaluate(() => document.querySelector('[popover]').remove());

      // iOS posune viditelnou oblast k poli: panel jde s ní
      await keyboard(page, phone.visible, 90, 'scroll');
      v = await inView(page, '#panel');
      check(`${tag}: po posunu viditelné oblasti (iOS) je panel pořád nad klávesnicí`, must.every((k) => v.vis[k]), JSON.stringify(v.vis));
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
      const must = phone.all ? ['nadpis', 'pole', 'souhlas', 'tlacitko'] : ['pole', 'souhlas', 'tlacitko'];
      check(`${tag}: zmenšené okno (Android) – vidět ${must.join(', ')}`, must.every((k) => v.vis[k]), JSON.stringify(v.vis));
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
      check(`${tag}: formulář ${where} – s klávesnicí vidět pole, souhlas a tlačítko`, v.vis.pole && v.vis.souhlas && v.vis.tlacitko, JSON.stringify(v.vis));
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
      await page.tap('.listek[data-etf="VWO"]');
      await sleep(550);
      // rub neotočených lístků nesmí prosvítat (headless WebKit nerespektuje backface-visibility)
      const faces = await page.$$eval('.listek', (ls) => ls.map((l) => `${l.dataset.etf}:${getComputedStyle(l.querySelector('.lice')).visibility[0]}${getComputedStyle(l.querySelector('.rub')).visibility[0]}`));
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
