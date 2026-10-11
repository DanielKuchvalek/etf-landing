// GET /api/keepalive – jednou denně ji volá Vercel cron (vercel.json), aby se bezplatný Supabase projekt
// bez návštěv neuspal. Zavolá v databázi funkci uklid (smaže záznamy limitů starší než 2 dny),
// takže je to skutečný zápis do databáze, ne jen dotaz na API.
// Vercel posílá hlavičku Authorization: Bearer <CRON_SECRET>; bez ní funkce nic nedělá.
import { odpoved, chybiNastaveni, rpc } from './_lib.js';

export default {
  async fetch(request) {
    if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } });
    const { CRON_SECRET } = process.env;
    if (!CRON_SECRET || request.headers.get('authorization') !== `Bearer ${CRON_SECRET}`) return odpoved(401, { ok: false });
    if (chybiNastaveni(['SUPABASE_URL', 'SUPABASE_SECRET_KEY'])) return odpoved(503, { ok: false, chyba: 'konfigurace' });
    try {
      const smazano = await rpc('uklid', {});
      return odpoved(200, { ok: true, smazano });
    } catch (e) {
      console.error(`[keepalive] databáze: ${e.status ? `Supabase vrátil ${e.status}` : `nedostupná (${e.name})`}`);
      return odpoved(502, { ok: false, chyba: 'databaze' });
    }
  },
};
