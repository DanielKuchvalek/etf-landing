# Srovnání ETF z NYSE – konverzní landing page

Řešení zadání B (konverzní landing page) do výběrového řízení na pozici Junior AI Developer.

- **Stránka:** TODO (URL na Vercelu)
- **Obě verze reklamy:** [reklamy/](reklamy/)
- **Exporty konverzací s AI:** [ai-log/](ai-log/)

## Cílová skupina

**Začínající investoři ve věku 25–40 let.** O ETF už slyšeli z YouTube, TikToku nebo od kamaráda. Někteří zkoušeli VOO najít u brokera a nešlo to. Chtějí začít, ale bojí se, že vyberou špatně nebo přeplatí na poplatcích. Přicházejí z reklamy na Instagramu nebo Facebooku, na mobilu, a stránce dají pár sekund.

**Proč právě oni:**

- Vědí, co je ETF, a mají konkrétní problém: fond, o kterém slyšeli, u brokera nenajdou. Stránka jim ten problém vyřeší jedním klepnutím, takže hodnotu vidí okamžitě.
- Jsou blízko k akci. Nepotřebují vysvětlovat, proč investovat, jen co koupit a jak.
- Začátečníky, kteří nevědí, kterým ETF začít, oslovuje reklama B. Testujeme tak druhou motivaci: nejistotu místo zklamání z brokera.

**Stavíme na ověřeném faktu:** americká ETF ti broker v Česku často nenabídne, evropská obdoba ano. Například u Trading 212 je pro evropské klienty vyloučeno 1 137 z 1 151 amerických ETF (viz [data/README.md](data/README.md)). Tuhle informaci jinde snadno nenajde, a je to hlavní důvod, proč na stránce zůstat.

## Lead magnet a moment žádosti o kontakt

**Co návštěvník dostane:** PDF „Tahák: 7 ETF z NYSE a jejich dvojčata, která koupíš z Česka“ ([public/tahak.pdf](public/tahak.pdf), 8 stran A5). Obsahuje ISINy, poplatky, kde koupit a postup nákupu u XTB a Trading 212 krok za krokem, se zdrojem u každého kroku. Generuje se z [tahak/tahak.html](tahak/tahak.html) a dat, takže po změně dat stačí přegenerovat ([scripts/README.md](scripts/README.md)).

**Hodnota je vidět ještě před formulářem.** Interaktivní prvek „Najdi dvojče“ na první obrazovce ukáže k vybranému ETF jeho evropskou obdobu, rozdíl v poplatku a kde ji koupit. Zdarma, bez e-mailu. Dělba je jasná: na stránce návštěvník vidí, **co** koupit, v taháku dostane, **jak** to udělat.

**Kdy žádáme o kontakt:**

1. Hned po prvním otočení lístku tlačítkem „Chci tahák se všemi 7 dvojčaty“, které se v tu chvíli objeví pod lístky. Návštěvník právě dostal hodnotu a ví, že zbylých 6 párů a postup jsou v taháku. Formulář se rozbalí na místě.
2. Tlačítkem, které je na mobilu pořád vidět dole na obrazovce. Formulář se otevře jako panel ve spodní části obrazovky, na místě, kde návštěvník právě je.

Formulář se nikdy neotevírá odkazem dolů na sekci 6. Přeskočení přes tři sekce stojí konverze a návštěvník ztratí kontext. Tuhle úpravu navrhla AI (Claude Code).

**Formulář:** jen e-mail a souhlas se zpracováním. Žádné jméno ani telefon.

**Po odeslání:** poděkování s tlačítkem „Otevřít tahák“, nikdo nečeká na e-mail. Pod ním je jedna věta s prvním krokem a tlačítko „Poslat odkaz kamarádovi“ (nativní sdílení telefonu, jinak zkopírování odkazu). Každé sdílení je další možný kontakt, proto ho měříme a sdílený odkaz má `?ref=sdileni`. PDF se samo nestahuje: Safari na iPhonu zpracuje stažení jinak než Chrome (při testu na iPhonu se PDF otevřelo v prohlížeči místo stránky), takže by poděkování slibovalo něco, co se nestane, a návštěvník by odešel ze stránky dřív, než uvidí sdílení. Rozeslání taháku e-mailem doplníme, jen pokud zbude čas.

Texty všech částí jsou v [texty.md](texty.md).

## Pořadí sekcí a zdůvodnění

1. **Úvod navazující na reklamu a rovnou „Najdi dvojče“.** Návštěvník má jen pár sekund. První obrazovka musí zopakovat slib reklamy a nabídnout akci bez scrollování. Nadpis se mění podle toho, ze které reklamy návštěvník přišel (viz [reklamy/](reklamy/)).
2. **Výsledek a výzva k taháku.** Otočený lístek ukáže dvojče, kde ho koupíš a kolik stojí: okamžitá hodnota zdarma. Výzva se objeví hned pod lístky ve chvíli, kdy je zájem nejvyšší, a formulář se rozbalí na místě. Pod ní jsou podrobnosti (index, dividendy).
3. **Přehled všech 7 párů v kompaktních kartách.** Pro ty, kdo chtějí vidět celek, než se rozhodnou. Karty zvýrazňují „✓ koupíš u …“ a poplatek ukazují lidsky v korunách; ISINy a postup zůstávají v taháku.
4. **Proč ti broker americká ETF často nenabídne (2–3 věty).** Vysvětlení, proč dvojčata vůbec potřebujeme. Až tady, protože ten, kdo přišel z reklamy „Dvojče“, už důvod zná z úvodu a nechce ho číst před výsledkem.
5. **Důvěra: zdroje dat s datem a upozornění, že nejde o investiční doporučení.** Těsně před formulářem odpovídá na otázku „můžu tomu věřit?“.
6. **Formulář (e-mail a souhlas).** Pro ty, kdo dočetli až sem. Výzvy ze sekce 2 a z tlačítka dole sem nevedou, otevírají formulář na místě. Tuhle změnu oproti původnímu návrhu navrhla AI (Claude Code): méně kroků a žádné přeskakování stránkou.
7. **Krátké FAQ (Je to zdarma? Co s mým e-mailem?).** Odstraní poslední obavy u formuláře, hlavně strach ze spamu.

## Dvě verze reklamy

_TODO: obě verze (text a vizuál, soubory v `reklamy/`), pro jakou platformu a formát, jaký úhel každá zkouší a jak na ni navazuje první obrazovka._

## Zdroje dat

_TODO: odkud jsou údaje o ETF, ke kterému datu platí a jak často je potřeba je aktualizovat._

Podklady: [data/etf.json](data/etf.json) (každý údaj se zdrojem a datem) a shrnutí ověření v [data/README.md](data/README.md).

## Měření cesty návštěvníka

Vlastní anonymní události místo GA4, bez cookies a bez cookie lišty. Stránka je posílá přes `navigator.sendBeacon` na [`/api/event`](api/event.js) a funkce je ukládá do tabulky `events` v Supabase ([schéma](supabase/schema.sql)).

| Událost | Kdy | Detail |
|---|---|---|
| `prichod` | načtení stránky | `sdileni` u odkazu od kamaráda, jinak `utm_source` |
| `scroll` | 25, 50, 75 a 100 % stránky, každá jednou | hloubka |
| `otoceni_listku` | klepnutí na lístek | např. `VOO:dvojce`, `VOO:original` |
| `vyzva_zobrazena` | výzva k taháku pod lístky po prvním otočení | `listky` |
| `cta` | klepnutí na tlačítko taháku | odkud: `listky`, `lista`, `karty` |
| `formular_otevren` | formulář se rozbalí nebo otevře v panelu | odkud |
| `formular_zacatek` | první fokus do formuláře | odkud, včetně `sekce` |
| `odeslani_pokus`, `odeslani_chyba`, `odeslano` | odeslání, chybová hláška, úspěch | odkud / typ chyby |
| `tahak_otevren` | klepnutí na „Otevřít tahák“ | kde: `panel`, `listky`, `sekce` |
| `sdileni` | „Poslat odkaz kamarádovi“ | `nativni`, `zruseno`, `kopie`, `rucne` |

- **Každá událost má ID návštěvy** (náhodné UUID jen v paměti jednoho načtení stránky), název, verzi úvodu z `?v=` a krátký detail. Do prohlížeče se nic neukládá.
- **Trychtýř podle verzí úvodu** počítá pohled `analytika.trychtyr` ze [supabase/funnel.sql](supabase/funnel.sql): příchod → otočení lístku → otevření formuláře → odeslání. U každého kroku je, kolik návštěv ho udělalo, kolik udělalo i všechny předchozí a podíl z příchodů.
- **ID návštěvy se nikdy nespojuje s e-mailem.** Kontakt jde jinou funkcí ([`/api/lead`](api/lead.js)) do jiné tabulky, bez ID návštěvy. Funkce kontakt s ID odmítne a událost s „@“ v detailu taky. Čas událostí se ukládá jen na celé hodiny, takže událost `odeslano` nejde s řádkem kontaktu spárovat podle času.
- **Ověřeno automaticky:** test v Chromu porovná události, které stránka odeslala, s tím, co lokální server uložil, a kontroluje, že v nich nikde není e-mail. Vlastní funkce mají testy s podvrženou databází ([scripts/test-api.mjs](scripts/test-api.mjs)).
- **Před ostrou kampaní by měl měření posoudit právník.** Do prohlížeče sice nic neukládáme, ale i JavaScript, který z prohlížeče odesílá data, může podle výkladu Evropského sboru pro ochranu osobních údajů (pokyny 2/2023) vyžadovat souhlas. Tenhle výklad jsme z primárního zdroje neověřovali, proto ho necháváme na právníkovi.

## Nasazení na Supabase a Vercel

Všechno je připravené, stačí založit projekty a zadat tři proměnné prostředí. Klíče patří jen do Vercelu (a lokálně do `.env.local`, který je v `.gitignore`), nikdy do repa ani do chatu.

**1. Supabase (databáze)**

1. Na [supabase.com](https://supabase.com/dashboard) → **New project**. Název třeba `etf-dvojcata`, **Region: Central EU (Frankfurt)**, tedy `eu-central-1`. Heslo k databázi si ulož do správce hesel, stránka ho nepotřebuje.
2. **SQL Editor → New query** → vlož celý [supabase/schema.sql](supabase/schema.sql) → **Run**. V **Table Editor** pak uvidíš tabulky `leads` a `events`, obě s RLS zapnutým.
3. Znovu **SQL Editor → New query** → vlož [supabase/funnel.sql](supabase/funnel.sql) → **Run**. Trychtýř pak kdykoli zobrazíš dotazem `select * from analytika.trychtyr;`.
4. Tlačítko **Connect** (nebo **Project Settings → Data API**): zkopíruj **Project URL** (`https://….supabase.co`), to je `SUPABASE_URL`.
5. **Project Settings → API Keys → Secret keys**: zkopíruj secret klíč (`sb_secret_…`), to je `SUPABASE_SECRET_KEY`. Publishable klíč stránka nepotřebuje, prohlížeč se Supabase vůbec nekontaktuje.

**2. Vercel (web a funkce)**

1. Na [vercel.com](https://vercel.com/new) → **Add New → Project** → importuj repozitář z GitHubu.
2. **Project Name:** `etf-dvojcata-clientelo`. Adresa pak bude `https://etf-dvojcata-clientelo.vercel.app` a bude sedět s `og:image` ve stránce (`etf-dvojcata` už používá cizí projekt). Když zvolíš jiný název, změň adresu v `og:image` v `public/index.html`.
3. **Framework Preset:** Other. Build ani výstupní složku neměň, nastavuje je [vercel.json](vercel.json): web z `public/`, funkce z `api/` ve Frankfurtu (`fra1`) a denní cron na `/api/keepalive`.
4. **Environment Variables** (pro Production, případně i Preview):
   - `SUPABASE_URL`: Project URL ze Supabase,
   - `SUPABASE_SECRET_KEY`: secret klíč `sb_secret_…`,
   - `CRON_SECRET`: náhodný řetězec aspoň 16 znaků, vytvoříš ho třeba příkazem `openssl rand -hex 24`. Vercel ho posílá cronu v hlavičce, bez něj keep-alive nic neudělá.
5. **Deploy.**

**3. Kontrola po nasazení**

1. Otevři stránku na telefonu, otoč lístek a odešli svůj e-mail.
2. V Supabase → **Table Editor → leads** musí být řádek s e-mailem. V `events` řádky z návštěvy.
3. Ve Vercelu → **Settings → Cron Jobs** je `/api/keepalive` jednou denně. Tlačítkem **Run** ho můžeš pustit hned a v **Logs** uvidíš odpověď 200.
4. **Settings → Functions:** region `fra1`.
5. Odkaz stránky vlož do [nástroje pro ladění sdílení od Facebooku](https://developers.facebook.com/tools/debug/), ať je vidět obrázek pro sdílení.

**Lokálně se skutečnou databází** (jinak lokální server běží s podvrženou databází v paměti): vytvoř `.env.local` podle [.env.example](.env.example) a spusť `node --env-file=.env.local scripts/server.mjs`. Obsah `.env.local` nikdy nevypisuj ani nesdílej.

## Očekávaná konverze

_TODO: odhad konverze (a čeho přesně, např. návštěva → kontakt), z čeho vychází a co ji nejvíc ovlivní._

## Hypotézy na A/B test

_TODO: tři hypotézy seřazené podle očekávaného dopadu. U každé změna, očekávaný efekt, metrika a proč je na tomto místě pořadí._

1. TODO
2. TODO
3. TODO

## Technická rozhodnutí

_TODO: stack a proč (čisté HTML/CSS/JS bez build kroku, Vercel, Supabase), zpracování formuláře, zabezpečení klíčů, rychlost načtení._

- **Celá stránka je jeden soubor `public/index.html`** s inline CSS a JS a systémovým písmem. Bez externích skriptů a písem: 58,7 kB, po gzipu 16,9 kB, z toho JS 16,7 kB (po gzipu 6,1 kB). Jediný obrázek je náhled taháku (WebP, 24 kB), který se načte až u formuláře. Lighthouse (mobil, 11. 10. 2026, lokální server bez komprese): 100 ve všech čtyřech kategoriích (výkon, přístupnost, osvědčené postupy, SEO) u všech tří verzí úvodu, LCP 1,2 s, CLS 0, TBT 0 ms, celkem 82 KiB.
- **„Ručně kreslené“ prvky bez písma navíc.** Fix, šipky, kroužky a fajfky jsou malá inline SVG. Rukou psané písmo by přidalo desítky kB a probliknutí textu. Lístky se otáčejí bez 3D kontextu a bez `backface-visibility`: JS (Web Animations API, bez knihovny) otočí jednu rovinu s perspektivou o 90°, když je lístek z boku, vymění strany a dotočí. WebKit to kreslí stejně s grafickým čipem i bez něj. Při `prefers-reduced-motion` se jen vymění strany.
- **Ikony a obrázek pro sdílení generuje skript** ([scripts/obrazky.mjs](scripts/obrazky.mjs)) ve stylu stránky a s čísly z `data/etf.json`: favicon (SVG a ICO), ikona pro iOS a `og.png` 1200×630 pro náhled odkazu na Facebooku a v Messengeru. Stránka si je nenačítá, takže nezdržují.
- **Jen světlé barvy** (`color-scheme: only light`). Tmavý režim iOS ani automatické ztmavení v Chromu stránku nepřebarví, „sešit“ zůstane papírový.
- **Panel s formulářem je přístupný z klávesnice.** Je to nativní modální `<dialog>` s `aria-modal`: Tab a Shift+Tab zůstávají v panelu, Esc ho zavře a fokus se vrátí na tlačítko, které ho otevřelo.
- **Funguje i bez JavaScriptu.** Obsah je v HTML a tlačítka výběru jsou odkazy na karty párů. JS jen přidává výsledek na místě, formulář na místě a lištu dole.
- **Úvod podle reklamy:** malý inline skript hned za nadpisem přepíše nadpis podle `?v=` dřív, než se stránka vykreslí, takže se layout neposune (CLS 0 i u varianty s poznámkou navíc).
- **Zpracování formuláře a měření: tři malé funkce bez závislostí** ([api/](api/)). Volají Supabase přímo přes REST (`fetch`), bez knihovny `supabase-js`, takže se nic neinstaluje. Každá funkce sama ověří vstup a nespoléhá na formulář:
  - povolená pole (kontakt s ID návštěvy nebo s polem navíc odmítne), formát e-mailu, souhlas musí být `true`,
  - velikost těla nejvýš 1 kB u kontaktu a 512 B u události, i když klient délku neuvede,
  - skryté pole `web` proti botům: když je vyplněné, funkce odpoví úspěchem, ale nic neuloží,
  - požadavek z cizí stránky (hlavička `Origin`) odmítne,
  - opakovaný e-mail se uloží jen jednou a odpověď je stejná, aby formulář neprozradil, kdo už je v databázi,
  - do logu jde jen stavový kód, nikdy e-mail ani klíč.
- **Secret klíč Supabase (`sb_secret_…`) jen na serveru.** Funkce ho posílá v hlavičce `apikey`, jak chce [dokumentace Supabase](https://supabase.com/docs/guides/api/api-keys) (nové klíče nejsou JWT, do `Authorization: Bearer` nepatří). Starý klíč `service_role` Supabase do konce roku 2026 ruší. Tabulky mají zapnuté RLS bez jediné politiky a odebraná práva pro `anon` a `authenticated`, takže publishable klíčem nejde nic přečíst ani zapsat.
- **Lokální server se stejnými funkcemi** ([scripts/server.mjs](scripts/server.mjs)): servíruje `public/` a funkce z `api/` jako Vercel. Bez klíčů běží s podvrženou databází v paměti, takže formulář jde vyzkoušet i na telefonu ve stejné Wi-Fi a testy můžou ověřit, co se opravdu uložilo.
- **Supabase projekt v EU regionu.** Ukládáme e-maily českých návštěvníků a databáze má být blízko serverless funkcím ve Frankfurtu.
- **Denní keep-alive přes Vercel cron.** Bezplatný Supabase projekt se po čase bez aktivity pozastaví a formulář musí fungovat, i když stránku někdo otevře až za dva týdny. Cron volá [`/api/keepalive`](api/keepalive.js) jednou denně (víc bezplatný tarif Vercelu nedovolí) a ta udělá jeden malý dotaz do databáze. Funkce chce hlavičku s `CRON_SECRET`, cizí volání odmítne.
- **Serverless funkce v regionu `fra1` (Frankfurt).** Kratší odezva pro české návštěvníky i k databázi v EU.

## Testování: co automaticky a co jen na telefonu

Skripty a návod jsou ve [scripts/](scripts/README.md). Všechny vracejí nenulový kód, když něco neprojde.

**Automaticky:**

- **Chrome (headless, 375 px, dotyk):** výběr ETF a otočení všech lístků, chybové hlášky formuláře, odeslání, panel, lišta dole, měření (každá událost a že e-mail nikdy nejde s ID návštěvy), `prefers-reduced-motion`.
- **WebKit, tedy engine Safari (Playwright, emulace iPhonu 13, iPhonu SE 3. generace a iPhonu SE 1. generace s šířkou 320 px):** panel a formuláře na místě s otevřenou klávesnicí. Emulátor softwarovou klávesnici nemá, proto ji test simuluje dvěma způsoby:
  - jako iOS: layout viewport zůstane, zmenší se jen `visualViewport` a viditelná oblast se posune k poli,
  - jako Android: zmenší se celé okno.

  Kontroluje, že:
  - nad klávesnicí je vidět nadpis panelu, pole, souhlas i tlačítko; na 320 px aspoň pole, souhlas a tlačítko,
  - pozadí se pod panelem nepohne,
  - po zavření se stránka vrátí na stejné místo a fokus na tlačítko, které panel otevřelo,
  - nic nepřetéká do šířky.

  Viditelnou výšku nad klávesnicí (328 px na iPhonu 13, 343 px na SE, 244 px na 320 px) jsme odhadli pesimisticky, nenaměřili.
- **Lighthouse (mobil), data proti zdrojům, čísla na stránce proti datům, text PDF proti datům.**

**Jen na skutečném telefonu:**

- skutečná klávesnice iOS: její výška, lišta nad ní (šipky, Hotovo, automatické doplnění e-mailu) a to, jak Safari sám posouvá stránku k poli,
- plynulost otočení lístků na skutečném displeji. Průběh (úhel, šířka a viditelná strana po 100 ms) test ve WebKitu kontroluje a skládá do [snímku](docs/screenshots/webkit-otoceni-listku.png),
- otevření a uložení PDF v Safari,
- nativní sdílení a kopírování odkazu,
- výřez displeje a domovský indikátor (safe area), tmavý režim iOS,
- dotyková odezva a gumové dotažení stránky.

## Nejasnosti v zadání a moje rozhodnutí

- **„ETF obchodované na NYSE“:** beru NYSE i NYSE Arca, fondy obchodované hlavně na Nasdaqu (např. QQQ) vynechávám. Většina amerických ETF je kotovaná na NYSE Arca, která patří pod NYSE Group.
- **Americké ETF a český drobný investor:** ke každému ETF z NYSE ukazuju i evropskou UCITS obdobu, kterou si Čech opravdu koupí. Brokeři v EU drobným investorům americké ETF často neprodají, protože americké fondy nemají sdělení klíčových informací (KID) podle nařízení PRIIPs. Ověření z primárních zdrojů i výhrady (výklad ČNB k execution-only) jsou v [data/README.md](data/README.md). Stránka návštěvníkovi nemá slibovat něco, co nemůže udělat.
- **Co je „kontakt“:** jen e-mail, žádný telefon. Zadání chce co nejméně polí a e-mail stačí k doručení toho, co návštěvníkovi slibujeme.
- **Co je konverze:** návštěva → odeslaný formulář. Oba konce trychtýře změříme vlastním měřením, bez dat z reklamního systému.
- **Měření celé cesty bez cookie lišty:** vlastní anonymní eventy (příchod, hloubka scrollu, interakce s prvky, otevření formuláře, odeslání) ukládané do Supabase, místo GA4. ID návštěvy existuje jen v paměti po dobu jednoho načtení stránky a do prohlížeče se nic neukládá. GA4 by potřebovalo souhlas a cookie lišta na mobilu zdržuje a ubírá konverze. Trychtýř se počítá SQL dotazem.
- **Správce osobních údajů:** zadání ho neuvádí. Na stránce uvádím **Clientelo Czech s.r.o.** Že je správcem právě tahle firma, je můj předpoklad. Její údaje jsou ověřené z [ARES](https://ares.gov.cz/ekonomicke-subjekty?ico=22193456) (obchodní rejstřík, 11. 10. 2026): IČO 22193456, sídlo Platnéřská 90/13, Staré Město, 110 00 Praha 1, spisová značka C 412348 u Městského soudu v Praze. [Zásady ochrany osobních údajů](public/ochrana-osobnich-udaju.html) jsou jen návrh, jasně tak označený, a před spuštěním je musí schválit právník. Co v nich chybí, je v sekci [Před spuštěním kampaně](#před-spuštěním-kampaně).
- **Tón textů:** stránka tyká. Cílovka jsou spíš mladší lidé z reklamy na Instagramu a Facebooku, vykání by tam působilo strojeně.

## Jak jsem pracoval s AI

_TODO: jaké pokyny dostali agenti (viz [CLAUDE.md](CLAUDE.md)), jak probíhala kontrola jejich výstupu, kde se spletli a jak se na to přišlo. Exporty konverzací jsou v [ai-log/](ai-log/), průběžné poznámky v [ai-log/denik.md](ai-log/denik.md)._

**Test na skutečném telefonu udělal člověk, ne AI** (iPhone, Safari, 10. 10. 2026). AI testovala jen v headless Chrome ([scripts/](scripts/)). Výsledek:

- Stránka funguje, je rychlá a obsahově sedí.
- Design působil příliš „bezpečně“: bílé zaoblené karty a modré tlačítko vypadaly jako typický web od AI a ze „sešitu“ zbyla jen mřížka.
- Stav po odeslání byl rozbitý: nad „Hotovo, tahák se ti stahuje“ zůstávaly odrážky z formuláře.
- Stránka slibovala PDF, které neexistovalo.

Snímky před úpravami a po nich jsou v [docs/screenshots/](docs/screenshots/) (375 px, generuje `scripts/screenshots.mjs`):

| | Před | Po |
|---|---|---|
| Úvod | <img src="docs/screenshots/pred-1-uvod.png" width="220" alt="Úvod před"> | <img src="docs/screenshots/po-1-uvod.png" width="220" alt="Úvod po"> |
| Výběr ETF | <img src="docs/screenshots/pred-2-vysledek-voo.png" width="220" alt="Výsledek VOO před"> | <img src="docs/screenshots/po-2-otoceny-listek.png" width="220" alt="Otočený lístek VOO po"> |
| Karty párů | <img src="docs/screenshots/pred-3-karty-paru.png" width="220" alt="Karty párů před"> | <img src="docs/screenshots/po-3-karty-paru.png" width="220" alt="Karty párů po"> |
| Formulář | <img src="docs/screenshots/pred-4-formular.png" width="220" alt="Formulář před"> | <img src="docs/screenshots/po-4-formular.png" width="220" alt="Formulář s náhledem taháku po"> |
| Poděkování | <img src="docs/screenshots/pred-5-podekovani.png" width="220" alt="Rozbité poděkování před"> | <img src="docs/screenshots/po-5-podekovani.png" width="220" alt="Poděkování po"> |

Varianty úvodu po: [?v=dvojce](docs/screenshots/po-1b-uvod-dvojce.png), [?v=zacatek](docs/screenshots/po-1c-uvod-zacatek.png).

**Druhý test na skutečném iPhonu, zase člověk** (Safari, 10. 10. 2026). Design a lístky fungovaly, ale objevily se chyby, které headless Chrome neukázal:

- Po klepnutí do pole e-mail v panelu ze spodní lišty panel odskočil nahoru, nadpis zajel pod horní lištu telefonu, pole zmizelo pod klávesnicí a pod panelem prosvítala stránka. Příčina: iOS při klávesnici zmenší jen visual viewport, pevně umístěný panel nechá pod klávesnicí a posouvá stránku i panel. Navíc fokus šel do pole ještě během animace panelu. Oprava a test ve WebKitu jsou popsané v sekci [Testování](#testování-co-automaticky-a-co-jen-na-telefonu).
- V logu serveru bylo `GET /tahak.pdf` s 404 hned po úspěšném HEAD. Zopakovat se to nepodařilo a přegenerováním PDF to nebylo (PDF se naposledy zapsalo o 22 minut dřív). Generování teď zapisuje přes dočasný soubor a lokální server u každé 404 vypíše, kde soubor hledal.
- Safari PDF místo stažení otevřelo v prohlížeči, takže poděkování „tahák se ti stahuje“ neplatilo. Teď je tam tlačítko „Otevřít tahák“.
- Poděkování bylo prázdné, zásady měly moc žlutých TODO, chyběla favicona.

AI navíc při kontrole na 320 px našla, že zadní strana lístku se třemi brokery přetékala přes další řadu, a že headless WebKit nerespektuje `backface-visibility` (rub prosvítal). Obojí je opravené a hlídané testem.

Panel a formulář na místě s otevřenou klávesnicí ve WebKitu (simulace, viz [scripts/test-webkit.mjs](scripts/test-webkit.mjs)):

| | iPhone SE 1. gen. (320 px) | iPhone SE 3. gen. (375 px) | iPhone 13 (390 px) |
|---|---|---|---|
| Panel ze spodní lišty | <img src="docs/screenshots/webkit-panel-klavesnice-320.png" width="180" alt="Panel s klávesnicí, 320 px"> | <img src="docs/screenshots/webkit-panel-klavesnice-375.png" width="180" alt="Panel s klávesnicí, 375 px"> | <img src="docs/screenshots/webkit-panel-klavesnice-390.png" width="180" alt="Panel s klávesnicí, 390 px"> |
| Formulář pod lístky | <img src="docs/screenshots/webkit-na-miste-klavesnice-320.png" width="180" alt="Formulář na místě s klávesnicí, 320 px"> | <img src="docs/screenshots/webkit-na-miste-klavesnice-375.png" width="180" alt="Formulář na místě s klávesnicí, 375 px"> | <img src="docs/screenshots/webkit-na-miste-klavesnice-390.png" width="180" alt="Formulář na místě s klávesnicí, 390 px"> |

## Před spuštěním kampaně

Co musí doplnit nebo rozhodnout někdo jiný než vývojář. V návrhu zásad jsou tato místa nenápadně označená „doplní správce“.

**Správce (Clientelo Czech s.r.o.):**

- kontaktní e-mail pro otázky k osobním údajům,
- e-mailová služba pro rozesílání (je to další zpracovatel, patří do zásad),
- nejdelší doba uložení e-mailu,
- jak dlouho Vercel uchovává záznamy o přístupu (IP adresy) na zvoleném tarifu,
- potvrdit, že e-maily neprodává ani nepředává dalším firmám (pak to doplnit do zásad),
- přijmout smlouvy o zpracování osobních údajů (DPA) u Supabase a Vercelu.

**Právník:**

- jestli smí být tahák podmíněný souhlasem s marketingovými e-maily, nebo má být souhlas dobrovolný a tahák dostane každý (souhlas musí být svobodný),
- právní základ měření bez cookie lišty. Do prohlížeče nic neukládáme, ale i odesílání dat z prohlížeče může podle výkladu Evropského sboru pro ochranu osobních údajů (pokyny 2/2023) vyžadovat souhlas. Tenhle výklad jsme z primárního zdroje neověřovali,
- předávání údajů mimo EU: Supabase i Vercel jsou americké firmy, i když data a funkce jsou ve Frankfurtu,
- celý návrh [zásad ochrany osobních údajů](public/ochrana-osobnich-udaju.html) a text souhlasu u formuláře.

**Vývojář (před ostrou kampaní):**

- omezení počtu požadavků z jedné adresy (rate limiting) chybí. Proti botům je jen skryté pole a kontrola `Origin`; bez úložiště pro počítadla ho serverless funkce sama neudělá. Kdyby přišel spam, přidat ochranu na úrovni Vercelu nebo službu typu Turnstile,
- ověřit, že denní dotaz z keep-alive Supabase opravdu počítá jako aktivitu (předpoklad, z dokumentace neověřený),
- [nasadit podle návodu](#nasazení-na-supabase-a-vercel) a projít kontrolu po nasazení.

**Po nasazení (vývojář):**

- sladit adresu v `og:image` v `public/index.html` se skutečnou doménou. Je tam `https://etf-dvojcata-clientelo.vercel.app/og.png`, protože `etf-dvojcata.vercel.app` už používá cizí projekt. Pak odkaz zkontrolovat v [nástroji pro ladění sdílení od Facebooku](https://developers.facebook.com/tools/debug/).

## Co v řešení chybí

_TODO: co se nestihlo nebo bylo vědomě vynecháno a co by bylo potřeba před ostrým spuštěním reklamy._
