// GET /api/keepalive – jednou denně ji volá Vercel cron (vercel.json), aby se bezplatný Supabase projekt
// bez návštěv neuspal. Udělá jeden malý dotaz do databáze.
// Vercel posílá hlavičku Authorization: Bearer <CRON_SECRET>; bez ní funkce nic nedělá.

const odpoved = (status, data) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export default {
  async fetch(request) {
    if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } });
    const { CRON_SECRET, SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
    if (!CRON_SECRET || request.headers.get('authorization') !== `Bearer ${CRON_SECRET}`) return odpoved(401, { ok: false });
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
      console.error('[keepalive] chybí proměnná prostředí SUPABASE_URL nebo SUPABASE_SECRET_KEY');
      return odpoved(503, { ok: false, chyba: 'konfigurace' });
    }
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/events?select=id&limit=1`, {
        headers: { apikey: SUPABASE_SECRET_KEY },
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) {
        console.error(`[keepalive] Supabase vrátil ${r.status}`);
        return odpoved(502, { ok: false, chyba: 'databaze' });
      }
    } catch (e) {
      console.error(`[keepalive] Supabase nedostupný (${e.name})`);
      return odpoved(502, { ok: false, chyba: 'databaze' });
    }
    return odpoved(200, { ok: true });
  },
};
