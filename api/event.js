// POST /api/event – uloží anonymní událost z cesty návštěvníka do Supabase (tabulka events).
// Přijímá jen ID návštěvy (náhodné UUID z paměti stránky), název události, verzi úvodu a krátký detail.
// E-mail ani nic jiného navíc neprojde: detail nesmí obsahovat „@“ a neznámá pole funkce odmítne.
// Prohlížeč posílá přes navigator.sendBeacon, tedy jako text/plain.

const MAX_BYTES = 512;
const VARIANTY = ['vychozi', 'dvojce', 'zacatek'];
const UDALOSTI = [
  'prichod', 'scroll', 'otoceni_listku', 'vyzva_zobrazena', 'cta', 'formular_otevren',
  'formular_zacatek', 'odeslani_pokus', 'odeslani_chyba', 'odeslano', 'tahak_otevren', 'sdileni',
];
const POLE = ['navsteva', 'udalost', 'varianta', 'detail'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const DETAIL = /^[A-Za-z0-9_:.-]{1,40}$/;

const odpoved = (status, data) => (data
  ? Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
  : new Response(null, { status, headers: { 'Cache-Control': 'no-store' } }));

async function nactiTelo(request, max) {
  if (Number(request.headers.get('content-length') || 0) > max) return { chyba: 413 };
  if (!request.body) return { text: '' };
  const reader = request.body.getReader();
  const casti = [];
  let delka = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    delka += value.byteLength;
    if (delka > max) {
      await reader.cancel();
      return { chyba: 413 };
    }
    casti.push(value);
  }
  return { text: Buffer.concat(casti).toString('utf8') };
}

function ciziPuvod(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  try { return new URL(origin).host !== host; } catch { return true; }
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
    if (ciziPuvod(request)) return odpoved(403, { ok: false, chyba: 'puvod' });
    const typ = request.headers.get('content-type') || '';
    if (!typ.startsWith('text/plain') && !typ.startsWith('application/json')) return odpoved(415, { ok: false, chyba: 'typ' });

    const { text, chyba } = await nactiTelo(request, MAX_BYTES);
    if (chyba) return odpoved(413, { ok: false, chyba: 'velikost' });
    let d;
    try { d = JSON.parse(text); } catch { return odpoved(400, { ok: false, chyba: 'format' }); }
    if (!d || typeof d !== 'object' || Array.isArray(d)) return odpoved(400, { ok: false, chyba: 'format' });
    if (Object.keys(d).some((k) => !POLE.includes(k))) return odpoved(400, { ok: false, chyba: 'pole' });
    if (typeof d.navsteva !== 'string' || !UUID.test(d.navsteva)) return odpoved(400, { ok: false, chyba: 'navsteva' });
    if (!UDALOSTI.includes(d.udalost)) return odpoved(400, { ok: false, chyba: 'udalost' });
    if (!VARIANTY.includes(d.varianta)) return odpoved(400, { ok: false, chyba: 'varianta' });
    if (d.detail != null && (typeof d.detail !== 'string' || !DETAIL.test(d.detail))) return odpoved(400, { ok: false, chyba: 'detail' });

    const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
      console.error('[event] chybí proměnná prostředí SUPABASE_URL nebo SUPABASE_SECRET_KEY');
      return odpoved(503, { ok: false, chyba: 'konfigurace' });
    }
    try {
      // čas doplní databáze (zaokrouhlený na hodiny), od prohlížeče ho nebereme
      const r = await fetch(`${SUPABASE_URL}/rest/v1/events`, {
        method: 'POST',
        headers: { apikey: SUPABASE_SECRET_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ navsteva: d.navsteva, udalost: d.udalost, varianta: d.varianta, detail: d.detail ?? null }),
        signal: AbortSignal.timeout(5000),
      });
      if (!r.ok) {
        console.error(`[event] Supabase vrátil ${r.status}`);
        return odpoved(502, { ok: false, chyba: 'databaze' });
      }
    } catch (e) {
      console.error(`[event] Supabase nedostupný (${e.name})`);
      return odpoved(502, { ok: false, chyba: 'databaze' });
    }
    return odpoved(204);
  },
};
