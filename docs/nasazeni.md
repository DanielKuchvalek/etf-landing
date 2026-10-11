# Nasazení na Supabase a Vercel

Část [README](../README.md), přesunutá sem, aby se hlavní README dalo přečíst za 5 minut.

**Nasazeno 11. 10. 2026** na https://etf-dvojcata-demo.vercel.app (Supabase ve Frankfurtu, funkce v `fra1`). Odškrtnuté je, co je hotové a ověřené; nezaškrtnuté zbývá. Klíče patří jen do Vercelu (a lokálně do `.env.local`, který je v `.gitignore`), nikdy do repa ani do chatu.

**1. Supabase (databáze v EU)**

- [x] [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**, název třeba `etf-dvojcata`, **Region: Central EU (Frankfurt)**, tedy `eu-central-1`. Heslo k databázi do správce hesel, stránka ho nepotřebuje. „Automatically expose new tables“ může být vypnuté a „Enable automatic RLS“ zapnuté: `schema.sql` dává roli `service_role` všechna potřebná práva výslovně (přístup ke schématu, tabulky, funkce; sekvence nejsou) a test to ověřuje na databázi bez automatických práv.
- [x] **SQL Editor → New query** → vlož celý [supabase/schema.sql](../supabase/schema.sql) → **Run**. V **Table Editor** jsou pak tabulky `leads`, `events` a `limity`, všechny s RLS.
- [x] Znovu **SQL Editor → New query** → [supabase/funnel.sql](../supabase/funnel.sql) → **Run** (až po `schema.sql`). Zkouška: `select * from analytika.trychtyr;` vrátí 12 řádků s nulami.
- [x] **Connect** (nebo **Project Settings → Data API**): **Project URL** (`https://….supabase.co`) je `SUPABASE_URL`.
- [x] **Project Settings → API Keys → Secret keys**: secret klíč (`sb_secret_…`) je `SUPABASE_SECRET_KEY`. Publishable klíč stránka nepotřebuje.

**2. Vercel (web a funkce)**

- [x] [vercel.com/new](https://vercel.com/new) → importuj repozitář z GitHubu.
- [x] **Project Name: `etf-dvojcata-demo`**, aby adresa byla `https://etf-dvojcata-demo.vercel.app` a seděla s kanonickou adresou, `og:url` a `og:image`. Stránka není oficiálně Clientela, proto bez jejich jména v adrese. 11. 10. 2026 byla adresa volná.
- [x] **Framework Preset: Other.** Build ani výstupní složku neměň, nastavuje je [vercel.json](../vercel.json): web z `public/`, funkce z `api/` ve Frankfurtu (`fra1`), denní cron na `/api/keepalive` a bezpečnostní hlavičky.
- [x] **Environment Variables** pro Production (a Preview, pokud ho chceš zkoušet), všechny čtyři:
  - `SUPABASE_URL`: Project URL ze Supabase,
  - `SUPABASE_SECRET_KEY`: secret klíč `sb_secret_…`,
  - `CRON_SECRET`: náhodný řetězec aspoň 16 znaků (`openssl rand -hex 24`). Vercel ho posílá cronu v hlavičce, bez něj keep-alive nic neudělá,
  - `ANTISPAM_SECRET`: náhodný řetězec aspoň 32 znaků (`openssl rand -hex 32`). Podepisuje token formuláře a hashuje IP pro limit pokusů, bez něj formulář vrátí chybu.
- [x] **Deploy.** Když proměnné přidáš až po prvním nasazení, pusť **Redeploy**, jinak je funkce neuvidí.

**2b. Aktualizace databáze po kole 11. 10. 2026 (verze souhlasu, UTM, trychtýř od data)**

- [ ] SQL Editor → vlož celý aktuální [supabase/schema.sql](../supabase/schema.sql) → **Run** (nic nesmaže: doplní sloupec `leads.souhlas_verze`, vymění funkci `uloz_kontakt` a limit detailu událostí na 80 znaků).
- [ ] SQL Editor → vlož celý aktuální [supabase/funnel.sql](../supabase/funnel.sql) → **Run** (přidá `analytika.trychtyr_od` a pohled `trychtyr` postaví nad ní).
- [ ] Kontrola: `select column_name from information_schema.columns where table_name = 'leads';` obsahuje `souhlas_verze` a `select * from analytika.trychtyr_od(now() - interval '1 day');` vrátí 12 řádků.

**3. Kontrola na živé adrese**

- [x] Projekt dostal adresu `https://etf-dvojcata-demo.vercel.app`. Jinak změň kanonickou adresu, `og:url` a `og:image` v hlavičce `public/index.html` (hledej `etf-dvojcata-demo`).
- [x] `curl -sI https://etf-dvojcata-demo.vercel.app/` ukáže `content-security-policy`, `strict-transport-security` a `x-robots-tag: noindex`.
- [x] `curl -s https://etf-dvojcata-demo.vercel.app/api/token` vrátí `{"token":"…"}`. Odpověď 503 znamená chybějící `ANTISPAM_SECRET`.
- [x] `curl -s -o /dev/null -w "%{http_code}\n" https://etf-dvojcata-demo.vercel.app/api/keepalive` vrátí 401 (bez tajemství cron nikoho nepustí).
- [x] Na telefonu otevři `?v=dvojce`, otoč lístek a odešli svůj e-mail. Musí přijít poděkování a otevřít se tahák.
- [x] V Supabase → **Table Editor**: v `leads` je řádek s e-mailem a verzí `dvojce`. `select * from analytika.trychtyr;` ukáže u `dvojce` příchod, otočení, formulář a odeslání.
- [x] V `events` jsou `odeslano`, `odeslani_pokus` i `odeslani_chyba` bez ID návštěvy (ověřeno ručně na živé databázi).
- [x] Ochrana formuláře: `x@mailinator.com` ukáže hlášku o jednorázových adresách a nic se neuloží (ověřeno ručně na živé stránce). Hlášku pro `test@neexistuje.invalid` hlídají lokální testy.
- [ ] Publishable klíč nic nepřečte: `curl -s "<SUPABASE_URL>/rest/v1/leads?select=email" -H "apikey: <publishable klíč>"` vrátí chybu oprávnění, ne data.
- [x] Vercel → **Settings → Cron Jobs**: `/api/keepalive` jednou denně. Tlačítkem **Run** ho pusť hned, v **Logs** musí být odpověď 200.
- [x] Vercel → **Settings → Functions**: region `fra1` (hlavička `x-vercel-id` u `/api/*` začíná `fra1::fra1`).
- [x] Lighthouse na živé adrese v mobilním režimu: výkon 100, SEO 66 kvůli záměrnému `noindex` ([výsledky](../README.md#technická-rozhodnutí)). Hlavičky, token, keep-alive, soubory a nadpisy kontroluje jen čtením [scripts/check-live.mjs](../scripts/check-live.mjs).
- [ ] Odkaz vlož do [nástroje pro ladění sdílení od Facebooku](https://developers.facebook.com/tools/debug/), ať je vidět obrázek pro sdílení.
- [ ] **15. 10. 2026** zkontroluju v Supabase, že projekt neběží jako „Paused“ ([riziko keep-alive](../README.md#před-spuštěním-kampaně)), a pustím `node scripts/check-live.mjs`.

**Lokálně se skutečnou databází** (jinak lokální server běží s podvrženou databází v paměti): vytvoř `.env.local` podle [.env.example](../.env.example) a spusť `node --env-file=.env.local scripts/server.mjs`. Obsah `.env.local` nikdy nevypisuj ani nesdílej.
