// POST /api/lead – uloží e-mail a souhlas do Supabase (tabulka leads).
// Secret klíč je jen v proměnných prostředí na serveru (SUPABASE_URL, SUPABASE_SECRET_KEY), nikdy v odpovědi ani v logu.
// Funkce nepřijme ID návštěvy ani nic jiného navíc: e-mail se s měřením nikdy nespojuje.
// Vstup ověřuje sama, na formulář v prohlížeči se nespoléhá.

const MAX_BYTES = 1024;
const VARIANTY = ['vychozi', 'dvojce', 'zacatek'];
const POLE = ['email', 'souhlas', 'varianta', 'web']; // web = skryté pole proti botům
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const odpoved = (status, data) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

// Tělo požadavku nejvýš max bajtů, i když klient délku neuvede nebo lže.
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

// Požadavek z cizí stránky (formulář jinde, který posílá sem) odmítneme. Roboti hlavičku zfalšují, běžný prohlížeč ne.
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
    if (!(request.headers.get('content-type') || '').startsWith('application/json')) return odpoved(415, { ok: false, chyba: 'typ' });

    const { text, chyba } = await nactiTelo(request, MAX_BYTES);
    if (chyba) return odpoved(413, { ok: false, chyba: 'velikost' });
    let data;
    try { data = JSON.parse(text); } catch { return odpoved(400, { ok: false, chyba: 'format' }); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return odpoved(400, { ok: false, chyba: 'format' });
    if (Object.keys(data).some((k) => !POLE.includes(k))) return odpoved(400, { ok: false, chyba: 'pole' });

    // Skryté pole vyplnil bot: tváříme se úspěšně, nic neukládáme.
    if (typeof data.web === 'string' && data.web.trim()) return odpoved(200, { ok: true });

    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
    if (email.length > 254 || !EMAIL.test(email)) return odpoved(422, { ok: false, chyba: 'email' });
    if (data.souhlas !== true) return odpoved(422, { ok: false, chyba: 'souhlas' });
    const varianta = VARIANTY.includes(data.varianta) ? data.varianta : 'vychozi';

    const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
      console.error('[lead] chybí proměnná prostředí SUPABASE_URL nebo SUPABASE_SECRET_KEY');
      return odpoved(503, { ok: false, chyba: 'konfigurace' });
    }
    try {
      // Opakovaný e-mail se neuloží znovu a návštěvník dostane stejnou odpověď (neprozradíme, kdo už v databázi je).
      const r = await fetch(`${SUPABASE_URL}/rest/v1/leads?on_conflict=email`, {
        method: 'POST',
        headers: { apikey: SUPABASE_SECRET_KEY, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' },
        body: JSON.stringify({ email, souhlas: true, varianta }),
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) {
        console.error(`[lead] Supabase vrátil ${r.status}`);
        return odpoved(502, { ok: false, chyba: 'databaze' });
      }
    } catch (e) {
      console.error(`[lead] Supabase nedostupný (${e.name})`);
      return odpoved(502, { ok: false, chyba: 'databaze' });
    }
    return odpoved(200, { ok: true });
  },
};
