# Před spuštěním kampaně

Část [README](../README.md), přesunutá sem, aby se hlavní README dalo přečíst za 5 minut.

Stránka je nasazená a funguje jako ukázka. Před ostrou kampaní pod Clientelem zbývá tohle.

**Souhlas a zásady pro ostrou verzi.** Teď je správcem autor ukázky. Pro Clientelo je připravený návrh (text připravil autor stránky, ne právník):

> Souhlasím, že mi Clientelo Czech s.r.o. bude posílat e-maily o investování do ETF. Odhlásit se můžu kdykoli. [Jak nakládáme s osobními údaji]

Celý návrh zásad s místy k doplnění (kontakt, doba uložení, e-mailová služba, právní základ měření) je v [docs/navrh-pro-clientelo.md](navrh-pro-clientelo.md). Při výměně textu souhlasu změnit i jeho verzi v `api/_lib.js` (`SOUHLAS`), ukládá se ke kontaktu.

**Správce (Clientelo Czech s.r.o.):**

- kontaktní e-mail pro otázky k osobním údajům,
- e-mailová služba pro rozesílání (je to další zpracovatel, patří do zásad),
- nejdelší doba uložení e-mailu,
- jak dlouho Vercel uchovává záznamy o přístupu (IP adresy) na zvoleném tarifu,
- potvrdit, že e-maily neprodává ani nepředává dalším firmám (pak to doplnit do zásad),
- převzít projekty Supabase a Vercel (teď jsou na účtu autora),
- přijmout smlouvy o zpracování osobních údajů (DPA) u Supabase a Vercelu,
- rozhodnout o double opt-inu ([doporučení](bezpecnost.md#bezpečnost-a-ochrana-proti-spamu)),
- vlastní doména místo `vercel.app`: přidat ji ve Vercelu a změnit kanonickou adresu, `og:url` a `og:image` v `public/index.html` (CSP i funkce s doménou počítají samy).

**Právník:**

- jestli smí být tahák podmíněný souhlasem s marketingovými e-maily, nebo má být souhlas dobrovolný a tahák dostane každý (souhlas musí být svobodný),
- právní základ měření bez cookie lišty. Do prohlížeče nic neukládáme, ale i odesílání dat z prohlížeče může podle výkladu Evropského sboru pro ochranu osobních údajů (pokyny 2/2023) vyžadovat souhlas. Tenhle výklad jsme z primárního zdroje neověřovali,
- předávání údajů mimo EU: Supabase i Vercel jsou americké firmy, i když data a funkce jsou ve Frankfurtu,
- celý [návrh zásad a souhlasu pro Clientelo](navrh-pro-clientelo.md).

**Reklama:**

- zkontrolovat obrázky reklam v náhledu Ads Manageru (bezpečné zóny Stories a Reels jsem ověřil jen z návodů třetích stran),
- ověřit u Meta, jestli kampaň nespadá do speciální kategorie „Finanční produkty a služby“ (ta může omezit cílení podle věku) a jestli pravidla pro finanční služby nevyžadují ověření inzerenta nebo upozornění přímo v reklamě,
- ověřit limity textů v Ads Manageru.

**Meta Conversions API** (událost Lead ze serveru, popis a proč není v demu): [meta-conversions-api.md](meta-conversions-api.md).

**Vývojář:**

- sledovat v logu Vercelu zamítnuté pokusy (`[lead] zamítnuto: …`). Kdyby spam prošel přes limity, přidat CAPTCHA (například Cloudflare Turnstile) a s právníkem probrat, co to znamená pro souhlas,
- **riziko keep-alive:** Supabase uvádí jen, že bezplatný projekt se pozastaví po týdnu neaktivity ([ceník](https://supabase.com/pricing), stejně v celé dokumentaci). Co se jako aktivita počítá, nedefinuje, takže nevím jistě, jestli denní volání z cronu stačí. **Den před odevzdáním (15. 10. 2026) projekt v Supabase zkontroluju, že neběží jako „Paused“.** Pozastavený projekt jde podle [dokumentace](https://supabase.com/docs/guides/platform/upgrading) do roka obnovit jedním tlačítkem v Supabase Studiu, data zůstanou,

**Až stránku Clientelo převezme:**

- odebrat `noindex`: meta tag v `public/index.html` a hlavičku `X-Robots-Tag` ve `vercel.json`, a poznámku „Ukázkové řešení do výběrového řízení“ v patičce. Do té doby ji vyhledávače neindexují (Lighthouse proto v kategorii SEO hlásí „stránka je blokovaná pro indexování“, to je záměr).
