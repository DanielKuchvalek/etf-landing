// POST /api/event – uloží pseudonymní událost z cesty návštěvníka (ID návštěvy je náhodné, ale ne anonymní) (funkce uloz_udalost, tabulka events).
// Přijímá jen ID návštěvy (náhodné UUID z paměti stránky), název události, verzi úvodu a detail z pevného
// seznamu pro každou událost (_lib.js, DETAILY; u příchodu UTM text přes regulární výraz), takže se přes měření
// nedají ukládat libovolná data. Endpoint nemá token: falešné příchody a jejich čištění viz docs/mereni.md.
// Události od odeslání formuláře dál (BEZ_NAVSTEVY) musí přijít bez ID návštěvy, ostatní s ním.
// Proti zahlcení: tělo nejvýš 512 B, 600 událostí za hodinu z jedné IP a 100 na návštěvu (počítá databáze).
// Prohlížeč posílá přes navigator.sendBeacon, tedy jako text/plain.
import { VARIANTY, DETAILY, BEZ_NAVSTEVY, odpoved, nactiTelo, ciziPuvod, klicIp, chybiNastaveni, rpc } from './_lib.js';

const MAX_BYTES = 512;
const POLE = ['navsteva', 'udalost', 'varianta', 'detail'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

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
    if (!Object.hasOwn(DETAILY, d.udalost)) return odpoved(400, { ok: false, chyba: 'udalost' });
    const bezNavstevy = BEZ_NAVSTEVY.includes(d.udalost);
    if (bezNavstevy ? d.navsteva !== undefined : typeof d.navsteva !== 'string' || !UUID.test(d.navsteva)) return odpoved(400, { ok: false, chyba: 'navsteva' });
    if (!VARIANTY.includes(d.varianta)) return odpoved(400, { ok: false, chyba: 'varianta' });
    if (d.detail != null && (typeof d.detail !== 'string' || !DETAILY[d.udalost].test(d.detail))) return odpoved(400, { ok: false, chyba: 'detail' });
    if (chybiNastaveni(['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'ANTISPAM_SECRET'])) return odpoved(503, { ok: false, chyba: 'konfigurace' });

    try {
      // čas doplní databáze (zaokrouhlený na minuty), od prohlížeče ho nebereme
      const vysledek = await rpc('uloz_udalost', {
        p_klic: klicIp(request, 'event'), p_navsteva: bezNavstevy ? null : d.navsteva, p_udalost: d.udalost, p_varianta: d.varianta, p_detail: d.detail ?? null,
      }, 5000);
      if (vysledek === 'limit') return odpoved(429, { ok: false, chyba: 'limit' });
    } catch (e) {
      console.error(`[event] databáze: ${e.status ? `Supabase vrátil ${e.status}` : `nedostupná (${e.name})`}`);
      return odpoved(502, { ok: false, chyba: 'databaze' });
    }
    return odpoved(204);
  },
};
