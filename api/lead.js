// POST /api/lead – uloží e-mail a souhlas do Supabase (funkce uloz_kontakt, tabulka leads).
// Secret klíč je jen v proměnných prostředí na serveru, nikdy v odpovědi ani v logu.
// Funkce nepřijme ID návštěvy ani nic jiného navíc: e-mail se s měřením nikdy neposílá ani neukládá.
// Ochrana proti spamu, v tomhle pořadí (na formulář v prohlížeči se nespoléhá):
//   povolená pole a velikost → skryté pole → token (rychlost odeslání) → formát e-mailu → souhlas →
//   jednorázová doména → MX záznam → limit pokusů z jedné IP (v databázi, s hashem IP) → duplicita.
// Bot (skryté pole, příliš rychlé odeslání) dostane stejnou odpověď jako úspěch, ať se nic nedozví.
import { VARIANTY, SOUHLAS, odpoved, nactiTelo, ciziPuvod, platnyEmail, jednorazovaDomena, maPostu, overToken, klicIp, chybiNastaveni, rpc } from './_lib.js';

const MAX_BYTES = 1024;
const POLE = ['email', 'souhlas', 'varianta', 'token', 'poznamka']; // poznamka = skryté pole proti botům

export default {
  async fetch(request) {
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
    if (ciziPuvod(request)) return odpoved(403, { ok: false, chyba: 'puvod' });
    if (!(request.headers.get('content-type') || '').startsWith('application/json')) return odpoved(415, { ok: false, chyba: 'typ' });

    const { text, chyba } = await nactiTelo(request, MAX_BYTES);
    if (chyba) return odpoved(413, { ok: false, chyba: 'velikost' });
    let data;
    try { data = JSON.parse(text); } catch { return odpoved(400, { ok: false, chyba: 'format' }); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return odpoved(400, { ok: false, chyba: 'format' });
    if (Object.keys(data).some((k) => !POLE.includes(k))) return odpoved(400, { ok: false, chyba: 'pole' });
    if (chybiNastaveni(['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'ANTISPAM_SECRET'])) return odpoved(503, { ok: false, chyba: 'konfigurace' });

    if (typeof data.poznamka === 'string' && data.poznamka.trim()) {
      console.warn('[lead] zamítnuto: vyplněné skryté pole');
      return odpoved(200, { ok: true });
    }
    const token = overToken(data.token);
    if (token === 'neplatny') return odpoved(400, { ok: false, chyba: 'token' });
    if (token === 'rychle') {
      console.warn('[lead] zamítnuto: odesláno dřív než 3 s po načtení');
      return odpoved(200, { ok: true });
    }

    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
    if (!platnyEmail(email)) return odpoved(422, { ok: false, chyba: 'email' });
    if (data.souhlas !== true) return odpoved(422, { ok: false, chyba: 'souhlas' });
    const domena = email.split('@')[1];
    if (jednorazovaDomena(domena)) return odpoved(422, { ok: false, chyba: 'jednorazovy' });
    if (await maPostu(domena) === false) return odpoved(422, { ok: false, chyba: 'mx' });
    const varianta = VARIANTY.includes(data.varianta) ? data.varianta : 'vychozi';

    try {
      // limit pokusů a uložení v jedné transakci; opakovaný e-mail se neuloží znovu, odpověď je stejná
      const vysledek = await rpc('uloz_kontakt', { p_klic: klicIp(request, 'lead'), p_email: email, p_varianta: varianta, p_souhlas_verze: SOUHLAS.verze });
      if (vysledek === 'limit') {
        console.warn('[lead] zamítnuto: limit pokusů z jedné IP'); // bez IP; kdyby přibývalo během kampaně, zvednout limit
        return odpoved(429, { ok: false, chyba: 'limit' });
      }
    } catch (e) {
      console.error(`[lead] databáze: ${e.status ? `Supabase vrátil ${e.status}` : `nedostupná (${e.name})`}`);
      return odpoved(502, { ok: false, chyba: 'databaze' });
    }
    return odpoved(200, { ok: true });
  },
};
