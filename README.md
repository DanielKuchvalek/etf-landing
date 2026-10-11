# ETF dvojčata – konverzní landing page (zadání B)

- **Stránka:** [etf-dvojcata-demo.vercel.app](https://etf-dvojcata-demo.vercel.app/) · reklama A „Dvojče“: [?v=dvojce](https://etf-dvojcata-demo.vercel.app/?v=dvojce) · reklama B „Začátek“: [?v=zacatek](https://etf-dvojcata-demo.vercel.app/?v=zacatek)
- **Myšlenka:** americká ETF ti broker v Česku často nenabídne. Stránka k 7 známým ETF z NYSE jedním klepnutím ukáže evropské „dvojče“, které koupíš, a za e-mail dá PDF tahák s postupem nákupu.
- **Očekávaná konverze** (návštěva → odeslaný formulář): 2–13 %, nejspíš kolem 6 %. Je to odhad, [výpočet po krocích](#očekávaná-konverze).
- **Do ostrého spuštění chybí:** posouzení právníkem, údaje a e-mailová služba od správce, hotové obrázky reklam a ověření pravidel Meta pro finanční reklamu ([seznam](#před-spuštěním-kampaně)).

## Jak to vyzkoušet za 2 minuty

**Na mobilu:**

1. Otevři [etf-dvojcata-demo.vercel.app/?v=dvojce](https://etf-dvojcata-demo.vercel.app/?v=dvojce). Nadpis navazuje na reklamu A, pro srovnání zkus [?v=zacatek](https://etf-dvojcata-demo.vercel.app/?v=zacatek).
2. Klepni na lístek **VOO**. Otočí se a ukáže evropské dvojče VUAA, u kterých brokerů ho koupíš a kolik stojí ročně z 10 000 Kč. Pod lístky se objeví výzva k taháku.
3. Klepni na „Chci tahák se všemi 7 dvojčaty“, zadej e-mail, zaškrtni souhlas a odešli. Přijde poděkování s tlačítkem „Otevřít tahák“ (PDF) a sdílením. Když stránku posuneš dál, objeví se dole lišta, která formulář otevře jako panel.
4. Ochrana formuláře: zkus `x@mailinator.com` (jednorázová adresa) nebo `test@neexistuje.invalid` (doména nepřijímá poštu).

**Kde je vidět trychtýř:**

- **Na nasazené stránce** v Supabase: SQL Editor → `select * from analytika.trychtyr;` (příchod → otočení lístku → otevření formuláře → odeslání, zvlášť pro každou verzi úvodu).
- **Lokálně bez Supabase:** `./scripts/serve.sh`, projdi stránku na http://127.0.0.1:8737/ a otevři http://127.0.0.1:8737/__dev/trychtyr. Server používá stejné SQL nad Postgresem v paměti (PGlite).

Exporty konverzací s AI jsou v [ai-log/](ai-log/), reklamy v [reklamy/](reklamy/).

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

- **ID návštěvy** (náhodné UUID jen v paměti jednoho načtení stránky) mají jen události do otevření formuláře. Události od odeslání dál (`odeslani_pokus`, `odeslani_chyba`, `odeslano`, `tahak_otevren`, `sdileni`) jdou **bez ID návštěvy**, jen s verzí úvodu z `?v=` a detailem. Do prohlížeče se nic neukládá.
- **Trychtýř podle verzí úvodu** počítá pohled `analytika.trychtyr` ze [supabase/funnel.sql](supabase/funnel.sql): příchod → otočení lístku → otevření formuláře → odeslání. Kroky 1–3 se počítají z událostí podle ID návštěvy: kolik návštěv krok udělalo, kolik i všechny předchozí a podíl z příchodů. Odeslání se počítá z tabulky kontaktů podle verze úvodu, kterou ukládáme ke kontaktu. U odeslání proto nejde říct, které předchozí kroky ta návštěva udělala, a opakovaný e-mail se nepočítá dvakrát.
- **Kontakt a návštěva se nespojují.** Co pro to děláme:
  - e-mail jde jinou funkcí ([`/api/lead`](api/lead.js)) do jiné tabulky a nikdy s ID návštěvy (funkce kontakt s ID odmítne),
  - události od odeslání dál nemají ID návštěvy, takže z měření nejde vyčíst, která návštěva formulář odeslala. Hlídá to funkce i kontrola na tabulce v databázi,
  - čas událostí je jen na celé minuty a klíče řádků jsou náhodná UUID, ne pořadová čísla,
  - detail události bere funkce jen z pevného seznamu hodnot, takže se do měření nedá zapsat nic jiného.

  **Nemožné to není.** Kdo má přímý přístup do databáze, vidí i pořadí zápisu (systémové sloupce Postgresu). Při malém provozu může odhadnout, která návštěva otevřela formulář těsně předtím, než přibyl kontakt se stejnou verzí úvodu. Když v té době formulář otevřela jen jedna návštěva, bude odhad nejspíš správný. S rostoucím provozem se zhoršuje. ID návštěvy proto beru jako pseudonymní údaj, ne anonymní.
- **Ověřeno automaticky:** test v Chromu porovná události, které stránka odeslala, s tím, co lokální server uložil, a kontroluje, že v nich nikde není e-mail. Vlastní funkce mají testy s podvrženou databází ([scripts/test-api.mjs](scripts/test-api.mjs)).
- **Před ostrou kampaní by měl měření posoudit právník.** Do prohlížeče sice nic neukládáme, ale i JavaScript, který z prohlížeče odesílá data, může podle výkladu Evropského sboru pro ochranu osobních údajů (pokyny 2/2023) vyžadovat souhlas. Tenhle výklad jsme z primárního zdroje neověřovali, proto ho necháváme na právníkovi.

## Bezpečnost a ochrana proti spamu

Formulář je veřejný, takže počítám s tím, že ho budou zkoušet boti a že ho někdo bude chtít zneužít. Projekt prošly dva review skilly Claude Code (`security-review` a `code-review`) a vlastní kontrola. Všechno je pokryté testy:
- [scripts/test-api.mjs](scripts/test-api.mjs): funkce s podvrženou databází a DNS, 107 kontrol,
- [scripts/test-db.mjs](scripts/test-db.mjs): `schema.sql` na skutečném Postgresu v PGlite, 44 kontrol,
- [scripts/test-page.mjs](scripts/test-page.mjs): celá cesta v prohlížeči proti lokálnímu serveru se stejnou databází.

**Cesta kontaktu přes `/api/lead`, v tomhle pořadí:**

1. Jen povolená pole (`email`, `souhlas`, `varianta`, `token`, skryté pole). Kontakt s ID návštěvy nebo s čímkoli navíc funkce odmítne. Tělo nejvýš 1 kB, i když klient délku neuvede. Požadavek z cizí stránky (`Origin`) odmítne.
2. **Skryté pole** `poznamka`: když ho bot vyplní, funkce odpoví jako při úspěchu, ale nic neuloží.
3. **Rychlost odeslání:** stránka si po načtení vezme z `/api/token` podepsaný čas vydání (HMAC, `ANTISPAM_SECRET`). Kontakt bez platného tokenu funkce odmítne. Kontakt odeslaný dřív než 3 s po vydání potichu zahodí, protože tak rychle formulář vyplní jen bot. Rychlejší člověk o kontakt nepřijde: stránka ten zbytek počká na „Odesílám…“.
4. **Formát e-mailu:** jen ASCII, platná doména s koncovkou, bez `< > " '`, bez `=`, `+` nebo `-` na začátku (vzorec při exportu do tabulky). Stejné pravidlo hlídá i databáze.
5. **Souhlas** musí být `true`.
6. **Jednorázové domény:** 9 222 domén ze seznamu [disposable-email-domains](https://github.com/disposable-email-domains/disposable-email-domains) (licence CC0, commit `81a8976` z 9. 10. 2026). Aktualizuje se skriptem [scripts/jednorazove-domeny.mjs](scripts/jednorazove-domeny.mjs). Kontroluje se i subdoména (`x.mailinator.com`).
7. **MX záznam:** doména musí přijímat poštu. Neprojde doména, která neexistuje, má „null MX“ (RFC 7505), nebo nemá ani MX, ani adresu. Doména bez MX, ale s adresou projde, protože pošta jde i na ni (implicitní MX podle RFC 5321). **Při chybě DNS nebo timeoutu kontakt projde** (fail-open), aby skutečný člověk nedoplatil na výpadek DNS. Celá kontrola trvá nejvýš 1 s, skutečné dotazy trvají kolem 20 ms. Test ověřuje šest druhů chyb DNS, nezodpovězený dotaz (pokračuje se po 1 s) a že se časovač po odpovědi zruší.
8. **Limit pokusů:** nejvýš 30 kontaktů za hodinu z jedné IP adresy. Počítá to databáze (funkce `uloz_kontakt`) podle HMAC z IP, hodiny a tajné soli. IP adresa se nikam neukládá a klíče z různých hodin nejdou spojit. Záznamy starší než 2 dny maže denní cron.
   **Proč 30, a ne méně:** mobilní operátoři pouštějí mnoho zákazníků přes jednu veřejnou IPv4 adresu (CGNAT, adresní rozsah pro něj vyhrazuje [RFC 6598](https://www.rfc-editor.org/rfc/rfc6598)). Reklama míří na mobily, takže přísnější limit by při kampani odmítal skutečné lidi. Bot z jedné adresy i tak pošle nejvýš 30 kontaktů za hodinu a každý musí projít tokenem, kontrolou MX a seznamem jednorázových domén. Každé odmítnutí limitem se zapíše do logu Vercelu (`[lead] zamítnuto: limit pokusů z jedné IP`, bez IP).
9. **Duplicita:** stejný e-mail se podruhé neuloží (`on conflict do nothing`), ale návštěvník dostane stejnou odpověď a tahák. Formulář tak neprozradí, kdo už v databázi je.

**Nálezy a co s nimi:**

| Nález | Závažnost | Stav |
|---|---|---|
| Spam a cizí e-maily přes API: skript bez hlavičky `Origin` mohl posílat kontakty donekonečna, proti tomu bylo jen skryté pole. | střední | **Opraveno** body 3 až 8 výše. Zůstává jedna věc: kdo zná cizí existující adresu, může ji zapsat. To žádná kontrola na stránce nepozná, pomůže jen double opt-in (níže). |
| Zahlcení `/api/event` nebo ukládání libovolných dat přes měření. | střední | **Opraveno:** detail události jen z pevného seznamu hodnot pro každou událost (např. `scroll` jen 25/50/75/100), nejvýš 600 událostí za hodinu z jedné IP a 100 na návštěvu (počítá databáze), tělo nejvýš 512 B. |
| Spárování e-mailu s návštěvou podle pořadí zápisu: tabulky měly pořadová čísla, takže k-tý kontakt odpovídal k-té události `odeslano`. README přitom tvrdilo, že spárovat nejdou. | střední (soukromí, jen pro toho, kdo má přístup do databáze) | **Opraveno:** klíče jsou náhodná UUID, události od odeslání dál nemají ID návštěvy, verze úvodu je u kontaktu a trychtýř počítá odeslání z kontaktů, čas událostí je na minuty. Nepravdivé tvrzení je opravené. Co zůstává při malém provozu, je popsané v sekci [Měření](#měření-cesty-návštěvníka). |
| Skryté pole kontrolované v prohlížeči tiše zahodilo kontakt, když ho vyplnilo automatické vyplňování formulářů. | nízká (ztracené kontakty) | **Opraveno:** rozhoduje jen server a pole se jmenuje `poznamka`, což automatické vyplňování nezná. |
| Chybějící bezpečnostní hlavičky. | nízká (obrana do hloubky) | **Opraveno ve [vercel.json](vercel.json):** Content-Security-Policy s hashi obou vložených skriptů (bez `unsafe-inline` pro skripty, test ověřuje, že podstrčený skript se nespustí; hashe hlídá [scripts/csp.mjs](scripts/csp.mjs)), HSTS, `nosniff`, Referrer-Policy, Permissions-Policy, COOP a zákaz vkládání do rámu. Lighthouse ani stránku to nerozbilo, lokální server posílá stejné hlavičky. |
| Výchozí práva Supabase dávají anonymní roli přístup ke každé nové tabulce a funkci v `public`. | nízká (obrana do hloubky) | **Opraveno:** schéma výchozí práva odebere a test v PGlite ověřuje, že anonymní ani přihlášená role nic nepřečte, nezapíše ani nezavolá. |
| E-maily s ne-ASCII znaky: `toLowerCase()` v JS a `lower()` v Postgresu se liší, uživatel by dostal „Něco se pokazilo“. | nízká | **Opraveno:** e-mail jen ASCII. |
| Kopie formuláře mohla převzít zablokované tlačítko „Odesílám…“ z formuláře v sekci. | nízká (funkční) | **Opraveno:** kopie vznikají z čisté šablony. |
| `?v=constructor` vypsal v nadpisu „undefined“. | nízká (kosmetika, ne XSS) | **Opraveno:** jen vlastní klíče objektu. |
| `/__dev/db` lokálního serveru byl dostupný z Wi-Fi. | nízká (jen lokálně, falešná data) | **Opraveno:** jen z localhost. |
| V [ai-log/denik.md](ai-log/denik.md) zůstala testovací adresa, která mohla patřit skutečnému člověku. | nízká | **Opraveno v souboru.** V historii commitů zůstává, historii podle pravidel projektu nepřepisuji. |

**Zkontrolované bez nálezu:**
- XSS: žádné `innerHTML` s daty z adresy nebo ze serveru,
- CORS: žádné `Access-Control-Allow-Origin`, preflight z cizí stránky skončí 405,
- klíče: jen v proměnných prostředí a v hlavičce `apikey`, nikdy v odpovědi ani v logu, test hlídá i nepřítomnost e-mailu a IP v logu,
- RLS: zapnuté bez politik,
- lokální server: žádný path traversal,
- keep-alive: bez `CRON_SECRET` nepustí nikoho.

Falešný poplach z review: „chybějící nezlomitelné mezery“ v textech z JS. Texty je mají, jen jako znak, ne `&nbsp;`.

**Co jsem vědomě neudělal:**
- **CAPTCHA (např. Turnstile):** přidala by skript třetí strany a otázku souhlasu. Má smysl, až by spam prošel přes limity.
- **Limit z jedné IP může i při 30 za hodinu zastavit skutečné lidi** za stejnou sdílenou adresou operátora. Kolik lidí sdílí jednu adresu, nevím. Kdyby během kampaně v logu přibývalo odmítnutí limitem, stačí zvednout jedno číslo ve funkci `uloz_kontakt` v [supabase/schema.sql](supabase/schema.sql). Botnet s mnoha adresami limit obejde, proto jsou za ním další kontroly.
- **Formulář bez JavaScriptu nefunguje** (chybí token). Obsah stránky bez JS funguje dál.

**Double opt-in (doporučení, zatím nestavěno).** Po odeslání by přišel e-mail s potvrzovacím odkazem a do marketingových e-mailů by se kontakt zařadil až po kliknutí.
- **Proč:**
  - je to jediná ochrana proti tomu, že někdo zadá cizí existující adresu,
  - dává doklad, kdo a kdy souhlas potvrdil,
  - seznam bez neplatných adres zlepšuje doručitelnost e-mailů.
- **Dopad na konverzi:** konverze stránky (návštěva → odeslaný formulář) se nezmění, tahák se ukáže hned jako teď. Klesne podíl kontaktů, kterým se smí psát, protože část lidí potvrzovací e-mail neotevře. Kolik, bez ověřeného zdroje neodhaduji. Změří se jako podíl potvrzených z odeslaných.
- **Co je potřeba:**
  - e-mailová služba (další zpracovatel),
  - sloupec s časem potvrzení a jednorázový odkaz,
  - endpoint pro potvrzení,
  - text e-mailu.
  
  Rozhodne správce s právníkem.

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
2. **Project Name:** `etf-dvojcata-demo`. Adresa pak bude `https://etf-dvojcata-demo.vercel.app` a sedí s kanonickou adresou, `og:url` a `og:image` ve stránce. Stránka není oficiálně Clientela, proto bez jejich jména v adrese. `etf-dvojcata` už používá cizí projekt, `etf-dvojcata-demo` byl 11. 10. 2026 volný. Kdyby Vercel přidělil jinou adresu, změň tři řádky v hlavičce `public/index.html` (hledej `etf-dvojcata-demo`).
3. **Framework Preset:** Other. Build ani výstupní složku neměň, nastavuje je [vercel.json](vercel.json): web z `public/`, funkce z `api/` ve Frankfurtu (`fra1`) a denní cron na `/api/keepalive`.
4. **Environment Variables** (pro Production, případně i Preview):
   - `SUPABASE_URL`: Project URL ze Supabase,
   - `SUPABASE_SECRET_KEY`: secret klíč `sb_secret_…`,
   - `CRON_SECRET`: náhodný řetězec aspoň 16 znaků, vytvoříš ho třeba příkazem `openssl rand -hex 24`. Vercel ho posílá cronu v hlavičce, bez něj keep-alive nic neudělá.
   - `ANTISPAM_SECRET`: náhodný řetězec aspoň 32 znaků (`openssl rand -hex 32`). Podepisuje token formuláře a hashuje IP adresy pro limit pokusů. Bez něj formulář vrátí chybu.
5. **Deploy.**

**3. Kontrola po nasazení**

1. Otevři stránku na telefonu, otoč lístek a odešli svůj e-mail.
2. V Supabase → **Table Editor → leads** musí být řádek s e-mailem. V `events` řádky z návštěvy.
3. Ve Vercelu → **Settings → Cron Jobs** je `/api/keepalive` jednou denně. Tlačítkem **Run** ho můžeš pustit hned a v **Logs** uvidíš odpověď 200.
4. **Settings → Functions:** region `fra1`.
5. Odkaz stránky vlož do [nástroje pro ladění sdílení od Facebooku](https://developers.facebook.com/tools/debug/), ať je vidět obrázek pro sdílení.

**Lokálně se skutečnou databází** (jinak lokální server běží s podvrženou databází v paměti): vytvoř `.env.local` podle [.env.example](.env.example) a spusť `node --env-file=.env.local scripts/server.mjs`. Obsah `.env.local` nikdy nevypisuj ani nesdílej.

## Očekávaná konverze

**Odhad: 2–13 % návštěv odešle formulář, nejspíš kolem 6 %.** Konverze je návštěva (načtená stránka) → odeslaný formulář, stejně jako v trychtýři. **Všechna procenta v tabulce jsou můj odhad**, ne naměřená data. Po prvním týdnu kampaně je nahradí čísla z `analytika.trychtyr`.

| Krok trychtýře | Pesimisticky | Středně | Optimisticky | Z čeho odhad vychází |
|---|---|---|---|---|
| 1. příchod | 100 % | 100 % | 100 % | výchozí bod, každá načtená stránka |
| 2. otočení lístku (z příchodů) | 25 % | 40 % | 55 % | Lístky jsou na první obrazovce a jsou přesně to, co reklama slibuje. Z reklamy na sociálních sítích ale velká část lidí odejde po pár sekundách bez jediného klepnutí. |
| 3. otevření formuláře (z těch, kdo otočili) | 20 % | 30 % | 40 % | Výzva se objeví hned pod otočeným lístkem. Kdo ale viděl dvojče, už dostal, kvůli čemu přišel, a tahák ho musí zaujmout navíc. |
| 4. odeslání (z otevřených formulářů) | 40 % | 50 % | 60 % | Jedno pole a zaškrtnutí, tahák hned bez čekání na e-mail. Část lidí odradí, že dávají e-mail a souhlas s e-maily. |
| **Návštěva → odeslání** | **2,0 %** | **6,0 %** | **13,2 %** | součin kroků 2–4 |

**Výpočet po krocích na 1 000 návštěv:**
- středně: 1 000 × 40 % = 400 otočí lístek → 400 × 30 % = 120 otevře formulář → 120 × 50 % = 60 odešle, tedy 6,0 %,
- pesimisticky: 1 000 × 25 % = 250 → 250 × 20 % = 50 → 50 × 40 % = 20, tedy 2,0 %,
- optimisticky: 1 000 × 55 % = 550 → 550 × 40 % = 220 → 220 × 60 % = 132, tedy 13,2 %.

Zjednodušení: formulář jde otevřít i bez otočení lístku (spodní lišta, sekce Tahák). Tyhle cesty v odhadu zvlášť nejsou, počítám je jako součást kroku 3.

**Srovnání s benchmarkem (skutečný zdroj, ne odhad):** podle [Unbounce](https://unbounce.com/landing-pages/whats-a-good-conversion-rate/) (Conversion Benchmark Report 2024, 41 000 landing pages a 57 milionů konverzí) je medián konverze landing page napříč obory 6,6 %, ve finančních službách 8,3 % a v podkategorii investování 3,9 %. Starší [stránka Unbounce o financích](https://unbounce.com/industry/finance/) uvádí pro finance a pojištění medián 3,8 % a rok dat neuvádí. Zdroje se rozcházejí, proto mezi nimi nevybírám. Střední odhad 6 % leží mezi investováním (3,9 %) a finančními službami (8,3 %). Benchmark zahrnuje všechny zdroje návštěv a všechny druhy konverzí, nejen e-mail za PDF, a český trh v něm zvlášť není. Je to tedy jen hrubá kontrola, že odhad není mimo.

**Co konverzi nejvíc ovlivní:**
- jestli úvod navazuje na slib reklamy (proto se mění podle `?v=`),
- jestli lidé poznají, že se na lístek dá klepnout (krok 2),
- jestli je tahák lákavý i pro toho, kdo už dvojče viděl (krok 3). Na tenhle krok míří [první hypotéza na A/B test](#hypotézy-na-ab-test).

## Obchodní pohled

**K čemu je kontakt.** Co s kontakty Clientelo nebo jeho klient udělá, zadání neříká, proto to beru obecně. Kontakt je člověk, který se aktivně zajímá o ETF, viděl, které fondy si z Česka koupí, a souhlasil s e-maily o investování do ETF. Hodí se pro firmu, která na investování do ETF vydělává: broker nebo investiční platforma (otevření účtu), finanční médium nebo vzdělávání (newsletter, kurz). U kontaktu je uložená i verze reklamy, takže je vidět, s jakou motivací přišel (zklamání z brokera, nebo nejistota začátečníka), a podle toho jde psát první e-maily.

**Orientační cena za kontakt.** Cena za kontakt = cena za klik ÷ (podíl kliků, ze kterých je načtená stránka × konverze návštěva → kontakt). Předpoklady:

- **Cena za klik z Meta v Česku: předpoklad 5–20 Kč, středně 10 Kč.** Ověřený zdroj pro český trh nemám. Pro představu: [LocaliQ (WordStream)](https://localiq.com/blog/facebook-advertising-benchmarks/) uvádí u kampaní Facebooku na návštěvnost průměrnou cenu za klik 0,60 USD napříč obory a 0,86 USD pro finance a pojištění. Jsou to data z kampaní jejich klientů, český trh v nich zvlášť není a na koruny je nepřepočítávám.
- **Z kliku je načtená stránka: předpoklad 85 %.** Část lidí stránku zavře dřív, než se načte. Stránka je rychlá (LCP 1,2 s v Lighthouse), ztráta by tedy neměla být velká, ale změřená není.
- **Konverze: 2 %, 6 % a 13,2 %** z [odhadu výše](#očekávaná-konverze).

Výpočet střední varianty: 10 Kč ÷ (0,85 × 0,06) = 10 Kč ÷ 0,051 ≈ **196 Kč za kontakt**. Jinak řečeno: 1 000 kliků za 10 000 Kč → 850 návštěv → 51 kontaktů.

| Cena za klik | Konverze 2 % | 6 % | 13,2 % |
|---|---|---|---|
| 5 Kč | 294 Kč | 98 Kč | 45 Kč |
| 10 Kč | 588 Kč | **196 Kč** | 89 Kč |
| 20 Kč | 1 176 Kč | 392 Kč | 178 Kč |

Rozsah je široký, protože oba vstupy jsou odhady. Po pár dnech kampaně se dosadí skutečná cena za klik z Meta a konverze z trychtýře. Kontakt se vyplatí, když z něj klient v průměru vydělá víc, než stojí. To záleží na jeho byznysu, který zadání neuvádí, takže to nehádám. S double opt-inem (viz [Bezpečnost](#bezpečnost-a-ochrana-proti-spamu)) by se cena počítala na potvrzený kontakt a byla by vyšší.

**Proč jen e-mail a nic dalšího:**
- **E-mail stačí k tomu, co slibujeme.** Tahák se ukáže hned a další e-maily jdou na adresu. Jméno ani telefon k tomu nejsou potřeba.
- **Každé pole navíc je na mobilu další psaní** a další důvod formulář nedokončit. Člověk z reklamy stránce dává pár sekund.
- **Telefon by změnil, co nabízíme.** Za PDF zdarma ho návštěvník spíš nedá, protože by čekal hovor od prodejce. Je to můj předpoklad, neměřený.
- **Minimalizace údajů:** GDPR chce osobní údaje omezit na to, co je pro daný účel nezbytné (čl. 5 odst. 1 písm. c)). Méně údajů je i menší škoda při úniku.
- **Víc se dá zjistit později:** v prvním e-mailu jednou otázkou na klepnutí (třeba „U jakého brokera jsi?“). Odpoví jen ti, kdo už důvěřují, a formulář na stránce zůstane krátký.

## Hypotézy na A/B test

_TODO: tři hypotézy seřazené podle očekávaného dopadu. U každé změna, očekávaný efekt, metrika a proč je na tomto místě pořadí._

1. TODO
2. TODO
3. TODO

## Technická rozhodnutí

_TODO: stack a proč (čisté HTML/CSS/JS bez build kroku, Vercel, Supabase), zpracování formuláře, zabezpečení klíčů, rychlost načtení._

- **Celá stránka je jeden soubor `public/index.html`** s inline CSS a JS a systémovým písmem. Bez externích skriptů a písem: 60,7 kB, po gzipu 17,7 kB, z toho JS 19,2 kB (oba vložené skripty, po gzipu 7,0 kB, limit 20 kB hlídá test). Jediný obrázek je náhled taháku (WebP, 24 kB), který se načte až u formuláře. Lighthouse (mobil, 11. 10. 2026, lokální server bez komprese, s CSP a ostatními hlavičkami z `vercel.json`): výkon, přístupnost a osvědčené postupy 100 u všech tří verzí úvodu, LCP 1,2 s, CLS 0, TBT 0 ms, celkem 88 KiB. SEO 66, protože stránka má záměrně `noindex` (jediný neúspěšný audit je „stránka je blokovaná pro indexování“).
- **„Ručně kreslené“ prvky bez písma navíc.** Fix, šipky, kroužky a fajfky jsou malá inline SVG. Rukou psané písmo by přidalo desítky kB a probliknutí textu. Lístky se otáčejí bez 3D kontextu a bez `backface-visibility`: JS (Web Animations API, bez knihovny) otočí jednu rovinu s perspektivou o 90°, když je lístek z boku, vymění strany a dotočí. WebKit to kreslí stejně s grafickým čipem i bez něj. Při `prefers-reduced-motion` se jen vymění strany.
- **Ikony a obrázek pro sdílení generuje skript** ([scripts/obrazky.mjs](scripts/obrazky.mjs)) ve stylu stránky a s čísly z `data/etf.json`: favicon (SVG a ICO), ikona pro iOS a `og.png` 1200×630 pro náhled odkazu na Facebooku a v Messengeru. Stránka si je nenačítá, takže nezdržují.
- **Jen světlé barvy** (`color-scheme: only light`). Tmavý režim iOS ani automatické ztmavení v Chromu stránku nepřebarví, „sešit“ zůstane papírový.
- **Panel s formulářem je přístupný z klávesnice.** Je to nativní modální `<dialog>` s `aria-modal`: Tab a Shift+Tab zůstávají v panelu, Esc ho zavře a fokus se vrátí na tlačítko, které ho otevřelo.
- **Funguje i bez JavaScriptu.** Obsah je v HTML a tlačítka výběru jsou odkazy na karty párů. JS jen přidává výsledek na místě, formulář na místě a lištu dole.
- **Úvod podle reklamy:** malý inline skript hned za nadpisem přepíše nadpis podle `?v=` dřív, než se stránka vykreslí, takže se layout neposune (CLS 0 i u varianty s poznámkou navíc).
- **Zpracování formuláře a měření: čtyři malé funkce bez závislostí** ([api/](api/)): `lead`, `event`, `token` a `keepalive`, společný kód je v [api/_lib.js](api/_lib.js). Soubory s podtržítkem Vercel jako funkce nenasadí (ověřeno ve zdrojovém kódu Vercelu, `packages/fs-detectors/src/detect-builders.ts`). Supabase volají přímo přes REST (`fetch`), bez knihovny `supabase-js`, takže se nic neinstaluje. Každá funkce sama ověří vstup a nespoléhá na formulář. Co přesně kontrolují, je v sekci [Bezpečnost a ochrana proti spamu](#bezpečnost-a-ochrana-proti-spamu).
- **Secret klíč Supabase (`sb_secret_…`) jen na serveru.** Funkce ho posílá v hlavičce `apikey`, jak chce [dokumentace Supabase](https://supabase.com/docs/guides/api/api-keys) (nové klíče nejsou JWT, do `Authorization: Bearer` nepatří). Starý klíč `service_role` Supabase do konce roku 2026 ruší. Tabulky mají zapnuté RLS bez jediné politiky a odebraná práva pro `anon` a `authenticated`, takže publishable klíčem nejde nic přečíst ani zapsat.
- **Lokální server se stejnými funkcemi** ([scripts/server.mjs](scripts/server.mjs)): servíruje `public/` a funkce z `api/` jako Vercel. Bez klíčů běží s podvrženou databází v paměti, takže formulář jde vyzkoušet i na telefonu ve stejné Wi-Fi a testy můžou ověřit, co se opravdu uložilo.
- **Supabase projekt v EU regionu.** Ukládáme e-maily českých návštěvníků a databáze má být blízko serverless funkcím ve Frankfurtu.
- **Denní keep-alive přes Vercel cron.** Bezplatný Supabase projekt se po čase bez aktivity pozastaví a formulář musí fungovat, i když stránku někdo otevře až za dva týdny. Cron volá [`/api/keepalive`](api/keepalive.js) jednou denně (víc bezplatný tarif Vercelu nedovolí). Ta přes API Supabase spustí v databázi funkci `uklid`, která smaže staré záznamy limitů, takže jde o požadavek na API i o příkaz v databázi. Supabase ale nedefinuje, co přesně je „aktivita“ (riziko a doporučení jsou v sekci [Před spuštěním kampaně](#před-spuštěním-kampaně)). Funkce chce hlavičku s `CRON_SECRET`, cizí volání odmítne.
- **Serverless funkce v regionu `fra1` (Frankfurt).** Kratší odezva pro české návštěvníky i k databázi v EU.

## Testování: co automaticky a co jen na telefonu

Skripty a návod jsou ve [scripts/](scripts/README.md). Všechny vracejí nenulový kód, když něco neprojde.

**Automaticky:**

- **Chrome (headless, 375 px, dotyk):** výběr ETF a otočení všech lístků, chybové hlášky formuláře, odeslání, panel, lišta dole, měření (každá událost a že e-mail nikdy nejde s ID návštěvy), `prefers-reduced-motion`.
- **WebKit, tedy engine Safari (Playwright, emulace iPhonu 13, iPhonu SE 3. generace a iPhonu SE 1. generace s šířkou 320 px):** panel a formuláře na místě s otevřenou klávesnicí. Emulátor softwarovou klávesnici nemá, proto ji test simuluje dvěma způsoby:
  - jako iOS: layout viewport zůstane, zmenší se jen `visualViewport` a viditelná oblast se posune k poli,
  - jako Android: zmenší se celé okno.

  Kontroluje, že:
  - nad klávesnicí (s rezervou 50 px na lištu návrhů e-mailů) je vidět pole a tlačítko a souhlas začíná těsně pod nimi; na 375 a 390 px i nadpis panelu. Na 320 px se nadpis vejít nemusí, přednost má pole a tlačítko,
  - pozadí se pod panelem nepohne,
  - po zavření se stránka vrátí na stejné místo a fokus na tlačítko, které panel otevřelo,
  - nic nepřetéká do šířky.

  Viditelnou výšku nad klávesnicí (328 px na iPhonu 13, 343 px na SE, 244 px na 320 px) jsme odhadli pesimisticky, nenaměřili. Nad klávesnicí navíc počítá s 50px lištou s návrhy e-mailů, kterou iOS do `visualViewport` nemusí započítat: pole a tlačítko musí být celé nad ní.
- **WebKit, průběh otočení lístku:** animaci zastaví po 100 ms a kontroluje úhel, šířku a viditelnou stranu (nikdy zrcadlově, nikdy prázdný lístek), z výřezů skládá [snímek](docs/screenshots/webkit-otoceni-listku.png).
- **Lighthouse (mobil), data proti zdrojům, čísla na stránce proti datům, text PDF proti datům.**

**Jen na skutečném telefonu:**

- skutečná klávesnice iOS: její výška, lišta nad ní (šipky, Hotovo, automatické doplnění e-mailu) a to, jak Safari sám posouvá stránku k poli. **Lištu s návrhy e-mailů první simulace nezachytila, našel ji až test na reálném telefonu** (tlačítko „Získat tahák“ skončilo pod klávesnicí). Formulář má proto tlačítko hned pod polem, souhlas pod ním a rezervu 50 px,
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

**Třetí test na skutečném iPhonu, zase člověk** (Chrome na iOS, tedy WebKit, 11. 10. 2026, s videem). Oprava panelu pomohla, ale našly se dvě chyby, které simulace nezachytila:

- **Lístek se neotáčel, jen blikl:** během animace zmizel (zůstala páska) a rub nebylo vidět. Příčinu zavedla AI v předchozí opravě: viditelnost líce a rubu přepínala v půlce *času* (220 ms), ale lístek byl kvůli křivce animace z boku už po ~50 ms. Mezitím byl otočený zády se skrytým rubem a GPU v iPhonu odvrácený líc nekreslí. Původní test kontroloval jen konečný stav, ne průběh. Teď se otáčí jedna rovina bez 3D kontextu, strany se vymění přesně ve chvíli, kdy je lístek z boku, a test ve WebKitu kontroluje snímky po 100 ms:

  <img src="docs/screenshots/webkit-otoceni-listku.png" width="640" alt="Průběh otočení lístku VTI po 100 ms: líc se zužuje, ve 224 ms je lístek z boku, pak se rozšiřuje rub s dvojčetem SXR4">
- **Tlačítko pod klávesnicí:** nad klávesnici vyskočila lišta s návrhy e-mailů, zakryla souhlas a tlačítko „Získat tahák“ skončilo pod klávesnicí. Tuhle lištu simulace nezachytila. Tlačítko je teď hned pod polem, souhlas pod ním a formulář nechává rezervu 50 px.

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

- sledovat v logu Vercelu zamítnuté pokusy (`[lead] zamítnuto: …`). Kdyby spam prošel přes limity, přidat CAPTCHA (například Cloudflare Turnstile) a s právníkem probrat, co to znamená pro souhlas,
- **riziko keep-alive:** Supabase uvádí jen, že bezplatný projekt se pozastaví po týdnu neaktivity ([ceník](https://supabase.com/pricing), stejně v celé dokumentaci). Co se jako aktivita počítá, nedefinuje, takže nevím jistě, jestli denní volání z cronu stačí. **Den před odevzdáním (15. 10. 2026) otevři projekt v Supabase a zkontroluj, že neběží jako „Paused“.** Pozastavený projekt jde podle [dokumentace](https://supabase.com/docs/guides/platform/upgrading) do roka obnovit jedním tlačítkem v Supabase Studiu, data zůstanou,
- [nasadit podle návodu](#nasazení-na-supabase-a-vercel) a projít kontrolu po nasazení.

**Až stránku Clientelo převezme:**

- odebrat `noindex`: meta tag v `public/index.html` a hlavičku `X-Robots-Tag` ve `vercel.json`, a poznámku „Ukázkové řešení do výběrového řízení“ v patičce. Do té doby ji vyhledávače neindexují (Lighthouse proto v kategorii SEO hlásí „stránka je blokovaná pro indexování“, to je záměr).

**Po nasazení (vývojář):**

- ověřit, že projekt dostal adresu `https://etf-dvojcata-demo.vercel.app` (jinak změnit kanonickou adresu, `og:url` a `og:image` v `public/index.html`), a odkaz zkontrolovat v [nástroji pro ladění sdílení od Facebooku](https://developers.facebook.com/tools/debug/).

## Co v řešení chybí

_TODO: co se nestihlo nebo bylo vědomě vynecháno a co by bylo potřeba před ostrým spuštěním reklamy._
