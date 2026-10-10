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

**Stavíme na ověřeném faktu:** americká ETF si Čech u většiny brokerů nekoupí, evropská obdoba ano (viz [data/README.md](data/README.md)). Tuhle informaci jinde snadno nenajde, a je to hlavní důvod, proč na stránce zůstat.

## Lead magnet a moment žádosti o kontakt

**Co návštěvník dostane:** PDF „Tahák: 7 ETF z NYSE a jejich dvojčata, která koupíš z Česka“ ([public/tahak.pdf](public/tahak.pdf), 8 stran A5). Obsahuje ISINy, poplatky, kde koupit a postup nákupu u XTB a Trading 212 krok za krokem, se zdrojem u každého kroku. Generuje se z [tahak/tahak.html](tahak/tahak.html) a dat, takže po změně dat stačí přegenerovat ([scripts/README.md](scripts/README.md)).

**Hodnota je vidět ještě před formulářem.** Interaktivní prvek „Najdi dvojče“ na první obrazovce ukáže k vybranému ETF jeho evropskou obdobu, rozdíl v poplatku a kde ji koupit. Zdarma, bez e-mailu. Dělba je jasná: na stránce návštěvník vidí, **co** koupit, v taháku dostane, **jak** to udělat.

**Kdy žádáme o kontakt:**

1. Hned po prvním výsledku „Najdi dvojče“ tlačítkem „Chci tahák se všemi 7 dvojčaty“. V tu chvíli návštěvník právě dostal hodnotu a ví, že zbylých 6 párů a postup jsou v taháku. Formulář se rozbalí přímo pod výsledkem.
2. Tlačítkem, které je na mobilu pořád vidět dole na obrazovce. Formulář se otevře jako panel ve spodní části obrazovky, na místě, kde návštěvník právě je.

Formulář se nikdy neotevírá odkazem dolů na sekci 6. Přeskočení přes tři sekce stojí konverze a návštěvník ztratí kontext. Tuhle úpravu navrhla AI (Claude Code).

**Formulář:** jen e-mail a souhlas se zpracováním. Žádné jméno ani telefon.

**Po odeslání:** poděkování a okamžité stažení PDF, nikdo nečeká na e-mail. Rozeslání taháku e-mailem doplníme, jen pokud zbude čas.

Texty všech částí jsou v [texty.md](texty.md).

## Pořadí sekcí a zdůvodnění

1. **Úvod navazující na reklamu a rovnou „Najdi dvojče“.** Návštěvník má jen pár sekund. První obrazovka musí zopakovat slib reklamy a nabídnout akci bez scrollování. Nadpis se mění podle toho, ze které reklamy návštěvník přišel (viz [reklamy/](reklamy/)).
2. **Výsledek a výzva k taháku.** Výsledek je okamžitá hodnota zdarma. Výzva přichází ve chvíli, kdy je zájem nejvyšší, a formulář se rozbalí přímo pod výsledkem.
3. **Přehled všech 7 párů v kompaktních kartách.** Pro ty, kdo chtějí vidět celek, než se rozhodnou. Karty ukazují jen základ (originál → dvojče, poplatky); ISINy a postup zůstávají v taháku.
4. **Proč VOO nekoupíš (2–3 věty).** Vysvětlení, proč dvojčata vůbec potřebujeme. Až tady, protože ten, kdo přišel z reklamy „Dvojče“, už důvod zná z úvodu a nechce ho číst před výsledkem.
5. **Důvěra: zdroje dat s datem a upozornění, že nejde o investiční doporučení.** Těsně před formulářem odpovídá na otázku „můžu tomu věřit?“.
6. **Formulář (e-mail a souhlas).** Pro ty, kdo dočetli až sem. Výzvy ze sekce 2 a z tlačítka dole sem nevedou, otevírají formulář na místě. Tuhle změnu oproti původnímu návrhu navrhla AI (Claude Code): méně kroků a žádné přeskakování stránkou.
7. **Krátké FAQ (Je to zdarma? Co s mým e-mailem?).** Odstraní poslední obavy u formuláře, hlavně strach ze spamu.

## Dvě verze reklamy

_TODO: obě verze (text a vizuál, soubory v `reklamy/`), pro jakou platformu a formát, jaký úhel každá zkouší a jak na ni navazuje první obrazovka._

## Zdroje dat

_TODO: odkud jsou údaje o ETF, ke kterému datu platí a jak často je potřeba je aktualizovat._

Podklady: [data/etf.json](data/etf.json) (každý údaj se zdrojem a datem) a shrnutí ověření v [data/README.md](data/README.md).

## Měření cesty návštěvníka

_TODO: jaké události měříme od příchodu po odeslání formuláře, čím a kde se dají zobrazit; jak je vyřešený souhlas s cookies._

- **ID návštěvy se nikdy nespojuje s e-mailem.** Eventy a kontakty jsou oddělené, jinak by se z anonymních eventů staly osobní údaje.
- **Před ostrou kampaní by měl měření posoudit právník.** Do prohlížeče sice nic neukládáme, ale i JavaScript, který z prohlížeče odesílá data, může podle výkladu Evropského sboru pro ochranu osobních údajů (pokyny 2/2023) vyžadovat souhlas. Tenhle výklad jsme z primárního zdroje neověřovali, proto ho necháváme na právníkovi.

## Očekávaná konverze

_TODO: odhad konverze (a čeho přesně, např. návštěva → kontakt), z čeho vychází a co ji nejvíc ovlivní._

## Hypotézy na A/B test

_TODO: tři hypotézy seřazené podle očekávaného dopadu. U každé změna, očekávaný efekt, metrika a proč je na tomto místě pořadí._

1. TODO
2. TODO
3. TODO

## Technická rozhodnutí

_TODO: stack a proč (čisté HTML/CSS/JS bez build kroku, Vercel, Supabase), zpracování formuláře, zabezpečení klíčů, rychlost načtení._

- **Celá stránka je jeden soubor `public/index.html`** s inline CSS a JS a systémovým písmem. Je to jediný požadavek bez externích skriptů a písem: 40 kB, po gzipu 12 kB, z toho JS 3,8 kB. Lighthouse (mobil, 10. 10. 2026, lokálně): 100 ve všech čtyřech kategoriích (výkon, přístupnost, osvědčené postupy, SEO), LCP 0,9 s, CLS 0.
- **Funguje i bez JavaScriptu.** Obsah je v HTML a tlačítka výběru jsou odkazy na karty párů. JS jen přidává výsledek na místě, formulář na místě a lištu dole.
- **Úvod podle reklamy:** malý inline skript hned za nadpisem přepíše nadpis podle `?v=` dřív, než se stránka vykreslí, takže se layout neposune (CLS 0 i u varianty s poznámkou navíc).
- **Supabase projekt v EU regionu.** Ukládáme e-maily českých návštěvníků a databáze má být blízko serverless funkcím ve Frankfurtu.
- **Denní keep-alive přes Vercel cron.** Bezplatný Supabase projekt se po čase bez aktivity pozastaví a formulář musí fungovat, i když stránku někdo otevře až za dva týdny.
- **Serverless funkce v regionu `fra1` (Frankfurt).** Kratší odezva pro české návštěvníky i k databázi v EU.

## Nejasnosti v zadání a moje rozhodnutí

- **„ETF obchodované na NYSE“:** beru NYSE i NYSE Arca, fondy obchodované hlavně na Nasdaqu (např. QQQ) vynechávám. Většina amerických ETF je kotovaná na NYSE Arca, která patří pod NYSE Group.
- **Americké ETF a český drobný investor:** ke každému ETF z NYSE ukazuju i evropskou UCITS obdobu, kterou si Čech opravdu koupí. Brokeři v EU drobným investorům americké ETF neprodají, protože americké fondy nemají sdělení klíčových informací (KID) podle nařízení PRIIPs. Ověření z primárních zdrojů i výhrady (výklad ČNB k execution-only) jsou v [data/README.md](data/README.md). Stránka návštěvníkovi nemá slibovat něco, co nemůže udělat.
- **Co je „kontakt“:** jen e-mail, žádný telefon. Zadání chce co nejméně polí a e-mail stačí k doručení toho, co návštěvníkovi slibujeme.
- **Co je konverze:** návštěva → odeslaný formulář. Oba konce trychtýře změříme vlastním měřením, bez dat z reklamního systému.
- **Měření celé cesty bez cookie lišty:** vlastní anonymní eventy (příchod, hloubka scrollu, interakce s prvky, otevření formuláře, odeslání) ukládané do Supabase, místo GA4. ID návštěvy existuje jen v paměti po dobu jednoho načtení stránky a do prohlížeče se nic neukládá. GA4 by potřebovalo souhlas a cookie lišta na mobilu zdržuje a ubírá konverze. Trychtýř se počítá SQL dotazem.
- **Správce osobních údajů:** zadání ho neuvádí. Na stránce uvádím **Clientelo Czech s.r.o.**, ale je to můj předpoklad, ne ověřený údaj. IČO, sídlo a kontakt chybí. [Zásady ochrany osobních údajů](public/ochrana-osobnich-udaju.html) jsou jen návrh, jasně tak označený, a před spuštěním je musí schválit právník.
- **Tón textů:** stránka tyká. Cílovka jsou spíš mladší lidé z reklamy na Instagramu a Facebooku, vykání by tam působilo strojeně.

## Jak jsem pracoval s AI

_TODO: jaké pokyny dostali agenti (viz [CLAUDE.md](CLAUDE.md)), jak probíhala kontrola jejich výstupu, kde se spletli a jak se na to přišlo. Exporty konverzací jsou v [ai-log/](ai-log/), průběžné poznámky v [ai-log/denik.md](ai-log/denik.md)._

**Test na skutečném telefonu udělal člověk, ne AI** (iPhone, Safari, 10. 10. 2026). AI testovala jen v headless Chrome ([scripts/](scripts/)). Výsledek:

- Stránka funguje, je rychlá a obsahově sedí.
- Design působil příliš „bezpečně“: bílé zaoblené karty a modré tlačítko vypadaly jako typický web od AI a ze „sešitu“ zbyla jen mřížka.
- Stav po odeslání byl rozbitý: nad „Hotovo, tahák se ti stahuje“ zůstávaly odrážky z formuláře.
- Stránka slibovala PDF, které neexistovalo.

Snímky před úpravami a po nich jsou v [docs/screenshots/](docs/screenshots/).

## Co v řešení chybí

_TODO: co se nestihlo nebo bylo vědomě vynecháno a co by bylo potřeba před ostrým spuštěním reklamy._
