// GET /api/token – podepsaný čas vydání pro formulář. Stránka si ho vezme hned po načtení a pošle ho
// s kontaktem; /api/lead odmítne kontakt bez platného tokenu a potichu zahodí odeslaný dřív než 3 s po vydání
// (tak rychle formulář vyplní jen bot). Token neobsahuje nic o návštěvníkovi.
import { odpoved, vydejToken, chybiNastaveni } from './_lib.js';

export default {
  fetch(request) {
    if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } });
    if (chybiNastaveni(['ANTISPAM_SECRET'])) return odpoved(503, { ok: false, chyba: 'konfigurace' });
    return odpoved(200, { token: vydejToken() });
  },
};
